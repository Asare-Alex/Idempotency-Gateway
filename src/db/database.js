const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./idempotency.sqlite");

db.serialize(() => {
db.run(`     CREATE TABLE IF NOT EXISTS idempotency_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idempotency_key TEXT UNIQUE NOT NULL,
      request_hash TEXT NOT NULL,
      status TEXT NOT NULL,
      response_status INTEGER,
      response_body TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
