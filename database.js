'use strict';

const initSqlJs = require('sql.js');
const path      = require('path');
const fs        = require('fs');

const DB_PATH = path.resolve(__dirname, 'books.db');

let _db = null; // internal sql.js Database instance

// ── Persistence ──────────────────────────────────────────────────────────────
function saveDb() {
  if (_db) {
    const data = _db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

// ── better-sqlite3-compatible prepare() wrapper ───────────────────────────────
/**
 * Returns a Statement-like object whose .get(), .all() and .run() methods
 * mirror the synchronous better-sqlite3 API so the rest of the codebase
 * does not need to change.
 *
 * @param {string} sql - Parameterised SQL using ? placeholders
 */
function prepare(sql) {
  if (!_db) {
    throw new Error('[db] Database not initialised. Did you await initDatabase()?');
  }

  return {
    /** Return the first matching row as a plain object, or undefined. */
    get(...args) {
      const stmt = _db.prepare(sql);
      try {
        stmt.bind(args);
        return stmt.step() ? stmt.getAsObject() : undefined;
      } finally {
        stmt.free();
      }
    },

    /** Return all matching rows as an array of plain objects. */
    all(...args) {
      const stmt = _db.prepare(sql);
      const rows = [];
      try {
        stmt.bind(args);
        while (stmt.step()) rows.push(stmt.getAsObject());
        return rows;
      } finally {
        stmt.free();
      }
    },

    /**
     * Execute a mutating statement and return { lastInsertRowid, changes }.
     * Automatically persists the database to disk.
     */
    run(...args) {
      _db.run(sql, args);
      // Capture metadata before export() so the values are still live
      const meta = _db.exec('SELECT last_insert_rowid(), changes()');
      const [lastInsertRowid, changes] = meta[0]?.values[0] ?? [null, 0];
      saveDb();
      return { lastInsertRowid, changes };
    },
  };
}

// ── Schema helper ─────────────────────────────────────────────────────────────
function exec(sql) {
  if (!_db) throw new Error('[db] Database not initialised.');
  _db.exec(sql);
  saveDb();
}

// ── Initialiser (must be awaited before the server starts) ───────────────────
/**
 * Loads (or creates) the SQLite database file, runs the schema migration,
 * and stores the connection in the module-level _db variable so that
 * prepare() can be called synchronously from route handlers.
 */
async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    _db = new SQL.Database(buf);
  } else {
    _db = new SQL.Database();
  }

  // Create the books table (idempotent)
  _db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      title   TEXT    NOT NULL,
      author  TEXT    NOT NULL,
      price   REAL    NOT NULL,
      year    INTEGER,
      genre   TEXT
    )
  `);
  saveDb();

  console.log('[database] SQLite (sql.js) ready at', DB_PATH);
  return _db;
}

module.exports = { initDatabase, prepare, exec };
