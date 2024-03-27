const { openDatabase } = require('@/database/config');

export default async function handler(req, res) {
    const { sessionId, userId } = req.query;
    const db = openDatabase();

    db.get(`SELECT draw_number FROM draws WHERE session_id = ? AND user_id = ?`, [sessionId, userId], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '查询数据库时出错' });
        }

        if (row) {
            // 如果用户已抽签，返回抽签结果
            res.json({ hasDrawn: true, drawResult: row.draw_number });
        } else {
            // 如果用户未抽签
            res.json({ hasDrawn: false });
        }
    });
}
