const { createClient } = require('@libsql/client/http');
const path = require('path');
require('dotenv').config();

let db;
let isLibsql = false;

// ---------------------------------------------------------
// DATABASE CONNECTION LOGIC
// ---------------------------------------------------------

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // CLOUD MODE: Turso (LibSQL)
  try {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://'),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    isLibsql = true;
    console.log('✅ Connected to Turso Database (Cloud)');
  } catch (e) {
    console.error('❌ Failed to connect to Turso:', e.message);
    throw e;
  }
} else {
  // LOCAL MODE: SQLite
  if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), we CANNOT use local file system for DB.
    console.warn('⚠️  WARNING: Running in production without Turso credentials.'); 
    console.warn('⚠️  Data will not persist in Serverless environment.');
  }

  try {
    const Database = require('better-sqlite3');
    const dbPath = path.resolve(__dirname, 'url_shortener.db');
    db = new Database(dbPath);
    isLibsql = false;
    console.log('✅ Connected to Local SQLite Database');

    // Initialize Local DB Synchronously (Safe for local)
    db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        urlCode TEXT UNIQUE,
        originalUrl TEXT,
        clicks INTEGER DEFAULT 0,
        userId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error('❌ Failed to initialize local SQLite:', err);
  }
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

// Helper to normalize query results from different drivers
const normalizeRow = (row) => {
  if (!row) return null;
  // Turso returns objects/arrays, better-sqlite3 returns objects. 
  // We ensure consistent object return.
  return row;
};

// ---------------------------------------------------------
// CORE FUNCTIONS
// ---------------------------------------------------------

const getUrl = async (code) => {
  try {
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
  } catch (err) {
    console.error('DB getUrl Error:', err);
    return null;
  }
};

const createUrl = async (urlCode, originalUrl, userId = null) => {
  const sql = 'INSERT INTO urls (urlCode, originalUrl, userId) VALUES (?, ?, ?)';
  
  if (isLibsql) {
    await db.execute({ sql, args: [urlCode, originalUrl, userId] });
  } else {
    const stmt = db.prepare(sql);
    stmt.run(urlCode, originalUrl, userId);
  }
};

const incrementClicks = async (code) => {
  const sql = 'UPDATE urls SET clicks = clicks + 1 WHERE urlCode = ?';
  
  if (isLibsql) {
    await db.execute({ sql, args: [code] });
  } else {
    const stmt = db.prepare(sql);
    stmt.run(code);
  }
};

const getAllUrls = async (userId) => {
  if (!userId) return [];
  
  const sql = 'SELECT * FROM urls WHERE userId = ? ORDER BY createdAt DESC LIMIT 50';

  if (isLibsql) {
    const result = await db.execute({ sql, args: [userId] });
    return result.rows;
  } else {
    const stmt = db.prepare(sql);
    return stmt.all(userId);
  }
};

const deleteUserUrls = async (userId) => {
  if (!userId) return;
  const sql = 'DELETE FROM urls WHERE userId = ?';

  if (isLibsql) {
    await db.execute({ sql, args: [userId] });
  } else {
    const stmt = db.prepare(sql);
    stmt.run(userId);
  }
};

module.exports = {
  getUrl,
  createUrl,
  incrementClicks,
  getAllUrls,
  deleteUserUrls
};