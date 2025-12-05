const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config();

let db;
let isLibsql = false;

if (process.env.libsql://linkshrink-rajvansh-1.aws-ap-south-1.turso.io && process.env.eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQ5NTk5MzgsImlkIjoiYjBiOGVmOWEtMTI4NS00ZTIyLTk3Y2MtYjg5NWE0ZTljYWRkIiwicmlkIjoiNjM1OGUwMDgtMWI5NS00ZjY0LWIxMjUtZjQ4YTFhZGY5MjY3In0.y1RJfWjBD2m1MQqYCgieHnl80aDrg7BpmZQbBe7tejd0RoNAM9mdt554E-bcr2MZsGhL1_etocIO1KJRQyCLAw) {
  // Use Turso (Cloud)
  db = createClient({
    url: process.env.libsql://linkshrink-rajvansh-1.aws-ap-south-1.turso.io,
    authToken: process.env.eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQ5NTk5MzgsImlkIjoiYjBiOGVmOWEtMTI4NS00ZTIyLTk3Y2MtYjg5NWE0ZTljYWRkIiwicmlkIjoiNjM1OGUwMDgtMWI5NS00ZjY0LWIxMjUtZjQ4YTFhZGY5MjY3In0.y1RJfWjBD2m1MQqYCgieHnl80aDrg7BpmZQbBe7tejd0RoNAM9mdt554E-bcr2MZsGhL1_etocIO1KJRQyCLAw,
  });
  isLibsql = true;
  console.log('Connected to Turso Database');
} else {
  // Use Local SQLite
  const Database = require('better-sqlite3');
  const dbPath = path.resolve(__dirname, 'url_shortener.db');
  db = new Database(dbPath);
  console.log('Connected to Local SQLite Database');

  // Initialize Local DB
  db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      urlCode TEXT UNIQUE,
      originalUrl TEXT,
      clicks INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Helper to run queries on either DB
const runQuery = async (sql, args = []) => {
  if (isLibsql) {
    return await db.execute({ sql, args });
  } else {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      if (sql.includes('LIMIT 1') || sql.includes('WHERE urlCode = ?')) { // Heuristic for single row
        return stmt.get(...args);
      }
      return stmt.all(...args);
    }
    return stmt.run(...args);
  }
};

const getUrl = async (code) => {
  if (isLibsql) {
    const result = await db.execute({
      sql: 'SELECT * FROM urls WHERE urlCode = ?',
      args: [code]
    });
    return result.rows[0];
  } else {
    const stmt = db.prepare('SELECT * FROM urls WHERE urlCode = ?');
    return stmt.get(code);
  }
};

const createUrl = async (urlCode, originalUrl) => {
  if (isLibsql) {
    await db.execute({
      sql: 'INSERT INTO urls (urlCode, originalUrl) VALUES (?, ?)',
      args: [urlCode, originalUrl]
    });
  } else {
    const stmt = db.prepare('INSERT INTO urls (urlCode, originalUrl) VALUES (?, ?)');
    stmt.run(urlCode, originalUrl);
  }
};

const incrementClicks = async (code) => {
  if (isLibsql) {
    await db.execute({
      sql: 'UPDATE urls SET clicks = clicks + 1 WHERE urlCode = ?',
      args: [code]
    });
  } else {
    const stmt = db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE urlCode = ?');
    stmt.run(code);
  }
};

const getAllUrls = async () => {
  if (isLibsql) {
    const result = await db.execute('SELECT * FROM urls ORDER BY createdAt DESC LIMIT 50');
    return result.rows;
  } else {
    const stmt = db.prepare('SELECT * FROM urls ORDER BY createdAt DESC LIMIT 50');
    return stmt.all();
  }
}

// Initialize Turso Table if needed (Async)
if (isLibsql) {
  (async () => {
    try {
      await db.execute(`
                CREATE TABLE IF NOT EXISTS urls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    urlCode TEXT UNIQUE,
                    originalUrl TEXT,
                    clicks INTEGER DEFAULT 0,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
    } catch (err) {
      console.error("Error initializing Turso DB:", err);
    }
  })();
}

module.exports = {
  getUrl,
  createUrl,
  incrementClicks,
  getAllUrls
};
