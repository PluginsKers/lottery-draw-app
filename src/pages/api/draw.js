const { openDatabase } = require('@/database/config');

export default async function handler(req, res) {
    const db = openDatabase();
    const { userId, sessionId } = req.query;

    // 首先检查用户是否已经抽过签
    db.get(`SELECT draw_number FROM draws WHERE user_id = ? AND session_id = ?`, [userId, sessionId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: '查询数据库时出错' });
        }

        if (row) {
            // 如果找到了记录，说明用户已经抽过签，直接返回结果
            return res.status(200).json({ drawResult: row.draw_number, message: "您已经参与过抽签" });
        } else {
            // 查询当前sessionId的抽签范围
            db.get(`SELECT range_start, range_end FROM settings WHERE session_id = ?`, [sessionId], (settingErr, settingRow) => {
                if (settingErr || !settingRow) {
                    return res.status(500).json({ error: '获取抽签范围失败' });
                }

                // 获取已被抽取的数字
                db.all(`SELECT draw_number FROM draws WHERE session_id = ?`, [sessionId], (drawsErr, drawsRows) => {
                    if (drawsErr) {
                        return res.status(500).json({ error: '查询已抽取数字时出错' });
                    }

                    const drawnNumbers = drawsRows.map(row => row.draw_number);
                    const availableNumbers = [];
                    for (let i = settingRow.range_start; i <= settingRow.range_end; i++) {
                        if (!drawnNumbers.includes(i)) {
                            availableNumbers.push(i);
                        }
                    }

                    if (availableNumbers.length === 0) {
                        return res.status(500).json({ error: '没有更多的数字可以抽取' });
                    }

                    const drawIndex = Math.floor(Math.random() * availableNumbers.length);
                    const drawNumber = availableNumbers[drawIndex];

                    db.run(`INSERT INTO draws (session_id, draw_number, user_id) VALUES (?, ?, ?)`, [sessionId, drawNumber, userId], (insertErr) => {
                        if (insertErr) {
                            return res.status(500).json({ error: '记录抽取数字时出错' });
                        }

                        // 返回抽签结果
                        res.status(200).json({ drawResult: drawNumber, message: "抽签成功" });
                    });
                });
            });
        }
    });
}