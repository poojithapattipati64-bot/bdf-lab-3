/**
 * LAB 3 — DEBUGGING EXERCISE
 * ===========================
 * This file contains FOUR deliberate bugs.
 * Find and fix each one. Each bug is marked with a TODO comment.
 *
 * Bug 1  — Port conflict      : EADDRINUSE (port already in use)
 * Bug 2  — Wrong db path      : database file not found / empty db
 * Bug 3  — Table-name typo   : no such table
 * Bug 4  — Missing await      : server starts before the database is ready
 *                                → routes crash with "Database not initialised"
 */

'use strict';

require('dotenv').config();

const express   = require('express');
const path      = require('path');
const fs        = require('fs');
const initSqlJs = require('sql.js');

const app = express();
app.use(express.json());

// BUG 1 — EADDRINUSE
// TODO: This port clashes with the main server. Change it to a free port (e.g., 3001)
const PORT = process.env.PORT || 3000;

// BUG 2 — Wrong db path
// TODO: Fix the path so it correctly resolves to the database file one level up.
//       Hint: use path.resolve(__dirname, '..', 'books.db')
const DB_PATH = path.resolve(__dirname, 'books.db'); // BUG: file is in the parent directory

let _db = null;

// Thin sql.js wrapper (same API as main database.js)
function prepare(sql) {
  if (!_db) throw new Error('[db] Database not initialised. Did you await initDatabase()?');
  return {
    get(...args)  {
      const s = _db.prepare(sql);
      try { s.bind(args); return s.step() ? s.getAsObject() : undefined; }
      finally { s.free(); }
    },
    all(...args) {
      const s = _db.prepare(sql); const rows = [];
      try { s.bind(args); while (s.step()) rows.push(s.getAsObject()); return rows; }
      finally { s.free(); }
    },
    run(...args) { _db.run(sql, args); },
  };
}

async function initDatabase() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    _db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    _db = new SQL.Database();
  }
  // BUG 3 — Table name typo
  // TODO: The table is named "books", not "book". Fix the CREATE TABLE statement.
  _db.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, price REAL
    )
  `);
}

// BUG 4 — initDatabase() is NOT awaited before the server starts.
// TODO: Move app.listen() inside initDatabase().then(...) so it only starts
//       after _db has been assigned and the schema has been created.
//       Without this, the first incoming request arrives while _db is still null,
//       and prepare() throws "Database not initialised".
initDatabase(); // fire-and-forget — _db is null when the first request arrives!

app.get('/debug/books', (req, res) => {
  try {
    const books = prepare('SELECT * FROM books').all();
    res.json({ message: 'success', data: books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/debug/books/:id', (req, res) => {
  try {
    const book = prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'success', data: book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Debug server on port ${PORT}`));
