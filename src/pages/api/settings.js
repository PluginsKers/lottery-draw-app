const { openDatabase } = require('@/database/config');
const { v4: uuidv4 } = require('uuid');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { range_start, range_end } = req.body;

    // 确保输入是数字且为正数
    if (typeof range_start !== 'number' || typeof range_end !== 'number' || range_start <= 0 || range_end <= 0) {
        return res.status(400).json({ error: '请求数据出错' });
    }

    // 确保区间至少有2个单位
    if ((range_end - range_start) < 2) {
        return res.status(400).json({ error: '请保证至少有2个序号' });
    }

    const session_id = uuidv4();
    const db = openDatabase();

    const insertSql = `INSERT INTO settings (session_id, range_start, range_end) VALUES (?, ?, ?)`;

    db.run(insertSql, [session_id, range_start, range_end], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: '服务端出错，请稍后再试' });
        }
        res.json({ url: `${req.headers.origin}${process.env.BASE_PATH}/draws/${session_id}` });
    });
}
