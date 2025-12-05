const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'url_shortener.db');
const db = new Database(dbPath);

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    urlCode TEXT UNIQUE,
    originalUrl TEXT,
    clicks INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const getUrl = (code) => {
  const stmt = db.prepare('SELECT * FROM urls WHERE urlCode = ?');
  return stmt.get(code);
};

const createUrl = (urlCode, originalUrl) => {
  const stmt = db.prepare('INSERT INTO urls (urlCode, originalUrl) VALUES (?, ?)');
  return stmt.run(urlCode, originalUrl);
};

const incrementClicks = (code) => {
  const stmt = db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE urlCode = ?');
  return stmt.run(code);
};

const getAllUrls = () => {
  const stmt = db.prepare('SELECT * FROM urls ORDER BY createdAt DESC LIMIT 50');
  return stmt.all();
}

module.exports = {
  getUrl,
  createUrl,
  incrementClicks,
  getAllUrls
};
