const path = require('path');

// Load .env — works for both `node server.js` (from server/) AND
// Vercel serverless (called via api/index.js from root). The api/index.js
// loads dotenv first, so this call is a safe no-op if already loaded.
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });
// Also try loading from the same directory (for direct `node server.js` usage)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

let db;
let isLibsql = false;

// ---------------------------------------------------------
// DATABASE CONNECTION LOGIC
// ---------------------------------------------------------

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // CLOUD MODE: Turso (LibSQL) — used in production on Vercel
  try {
    const { createClient } = require('@libsql/client/http');
    db = createClient({
      url: process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://'),
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    isLibsql = true;
    console.log('✅ Connected to Turso Database (Cloud)');

    // Initialize cloud DB table if it doesn't exist
    db.execute(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        urlCode TEXT UNIQUE,
        originalUrl TEXT,
        clicks INTEGER DEFAULT 0,
        userId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).catch(err => console.error('DB Init Error:', err.message));

  } catch (e) {
    console.error('❌ Failed to connect to Turso:', e.message);
    throw e;
  }
} else {
  // LOCAL MODE: SQLite (development only)
  if (process.env.NODE_ENV === 'production') {
    const msg = '❌ FATAL: Running in production without Turso credentials. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel env vars.';
    console.error(msg);
    // Don't throw — let the server start so health check works, but DB ops will fail gracefully
  }

  try {
    const Database = require('better-sqlite3');
    const dbPath = path.resolve(__dirname, 'url_shortener.db');
    db = new Database(dbPath);
    isLibsql = false;
    console.log('✅ Connected to Local SQLite Database at', dbPath);

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
    console.error('❌ Failed to initialize local SQLite:', err.message);
    console.error('   Make sure better-sqlite3 is installed: cd server && npm install');
    // db remains undefined — all DB operations will fail gracefully
  }
}

// ---------------------------------------------------------
// CORE FUNCTIONS
// ---------------------------------------------------------

const getUrl = async (code) => {
  if (!db) return null;
  try {
    if (isLibsql) {
      const result = await db.execute({
        sql: 'SELECT * FROM urls WHERE urlCode = ?',
        args: [code]
      });
      return result.rows[0] || null;
    } else {
      const stmt = db.prepare('SELECT * FROM urls WHERE urlCode = ?');
      return stmt.get(code) || null;
    }
  } catch (err) {
    console.error('DB getUrl Error:', err);
    return null;
  }
};

const createUrl = async (urlCode, originalUrl, userId = null) => {
  if (!db) throw new Error('Database not available');
  const sql = 'INSERT INTO urls (urlCode, originalUrl, userId) VALUES (?, ?, ?)';

  if (isLibsql) {
    await db.execute({ sql, args: [urlCode, originalUrl, userId] });
  } else {
    const stmt = db.prepare(sql);
    stmt.run(urlCode, originalUrl, userId);
  }
};

const incrementClicks = async (code) => {
  if (!db) return;
  const sql = 'UPDATE urls SET clicks = clicks + 1 WHERE urlCode = ?';

  if (isLibsql) {
    await db.execute({ sql, args: [code] });
  } else {
    const stmt = db.prepare(sql);
    stmt.run(code);
  }
};

const getAllUrls = async (userId) => {
  if (!db || !userId) return [];
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
  if (!db || !userId) return;
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