/**
 * LAB 3 — DEBUGGING EXERCISE  (SOLUTION / REFERENCE)
 * =====================================================
 * All four bugs from broken_server.js are fixed here.
 * Do NOT look at this file until you have attempted the fixes yourself!
 *
 * FIX 1  — Port changed to 3001        (avoids EADDRINUSE)
 * FIX 2  — DB path corrected to ../books.db
 * FIX 3  — Table name corrected: "book" → "books"
 * FIX 4  — app.listen() moved inside initDatabase().then(...)
 */

'use strict';

require('dotenv').config();

const express   = require('express');
const path      = require('path');
const fs        = require('fs');
const initSqlJs = require('sql.js');

const app = express();
app.use(express.json());

// FIX 1 — Different port to avoid EADDRINUSE with the main server
const PORT = 3001;

// FIX 2 — Correct path: go one level up from debug_exercise/ to reach the project root
const DB_PATH = path.resolve(__dirname, '..', 'books.db');

let _db = null;

function prepare(sql) {
  if (!_db) throw new Error('[db] Database not initialised. Did you await initDatabase()?');
  return {
    get(...args) {
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
  // FIX 3 — Correct table name: "books" not "book"
  _db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, price REAL
    )
  `);
}

// FIX 4 — Await initDatabase() before starting the server so _db is ready
initDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Fixed debug server on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to init database:', err.message);
    process.exit(1);
  });

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
