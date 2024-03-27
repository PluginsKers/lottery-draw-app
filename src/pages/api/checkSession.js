import { openDatabase } from '@/database/config';

export default async function handler(req, res) {
    const { sessionId } = req.query;
    const db = openDatabase();

    db.get(`SELECT * FROM settings WHERE session_id = ?`, [sessionId], (err, row) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: '查询数据库时出错' });
        }
        db.close();
        if (row) {
            // 如果找到了对应的sessionId记录，返回成功状态
            return res.status(200).json({ exists: true });
        } else {
            // 如果没有找到，说明没有这个sessionId的抽签活动
            return res.status(200).json({ exists: false });
        }
    });
}
