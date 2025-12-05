const { createClient } = require('@libsql/client/http');
const path = require('path');
require('dotenv').config();

let db;
let isLibsql = false;

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // Use Turso (Cloud)
  db = createClient({
    url: process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://'),
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  isLibsql = true;
  console.log('Connected to Turso Database');
} else {
  // Use Local SQLite
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL ERROR: Running in production without TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
    console.error('Local SQLite is not supported in serverless environments (Vercel).');
    throw new Error('Database configuration missing for production.');
  }

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
  // Initialize Turso Table if needed (Async)
  // Note: In serverless (Vercel), this might fail if multiple requests try to create the table at once.
  // It's better to create the table manually in the Turso dashboard, but we'll try here for convenience.
  if (isLibsql) {
    (async () => {
      try {
        // Simple check query to see if connection works
        await db.execute('SELECT 1');

        // Only attempt to create table if we can connect
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
        console.error("Warning: Could not initialize Turso DB table. Ensure it exists manually if this persists.", err);
      }
    })();
  }
}

module.exports = {
  getUrl,
  createUrl,
  incrementClicks,
  getAllUrls
};
