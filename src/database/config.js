const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.resolve(__dirname, 'lotteryLite.db');

const openDatabase = () => {
    let db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    // 初始化数据库表结构
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                range_start INTEGER NOT NULL,
                range_end INTEGER NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS draws (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                draw_number INTEGER NOT NULL,
                session_id TEXT NOT NULL,
                user_id TEXT NOT NULL
            )
        `);
    });

    return db;
};

module.exports = { openDatabase };
