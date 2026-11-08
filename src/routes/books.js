'use strict';

const express = require('express');
const { prepare } = require('../../database');
const { validateBook } = require('../validators/bookValidator');

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /books  — list all books with search, sort, filter, pagination
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  const {
    search_q   = '',
    order_by   = 'id',
    order      = 'ASC',
    limit      = '20',
    offset     = '0',
    min_price,
    max_price,
  } = req.query;

  // --- validate order_by and order to prevent SQL injection ---
  const ALLOWED_COLUMNS = ['id', 'title', 'author', 'price', 'year', 'genre'];
  const ALLOWED_ORDERS  = ['ASC', 'DESC'];

  if (!ALLOWED_COLUMNS.includes(order_by)) {
    return res.status(400).json({
      message: `Invalid order_by value. Allowed: ${ALLOWED_COLUMNS.join(', ')}.`,
    });
  }

  if (!ALLOWED_ORDERS.includes(order.toUpperCase())) {
    return res.status(400).json({
      message: 'Invalid order value. Allowed: ASC, DESC.',
    });
  }

  const parsedLimit  = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return res.status(400).json({ message: 'limit must be an integer between 1 and 100.' });
  }
  if (isNaN(parsedOffset) || parsedOffset < 0) {
    return res.status(400).json({ message: 'offset must be a non-negative integer.' });
  }

  // Build WHERE clauses using parameterised queries
  const conditions = [];
  const params     = [];

  if (search_q.trim() !== '') {
    conditions.push('title LIKE ?');
    params.push(`%${search_q.trim()}%`);
  }

  if (min_price !== undefined) {
    const mn = parseFloat(min_price);
    if (isNaN(mn)) return res.status(400).json({ message: 'min_price must be a number.' });
    conditions.push('price >= ?');
    params.push(mn);
  }

  if (max_price !== undefined) {
    const mx = parseFloat(max_price);
    if (isNaN(mx)) return res.status(400).json({ message: 'max_price must be a number.' });
    conditions.push('price <= ?');
    params.push(mx);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total matching rows for pagination metadata
  const countSql  = `SELECT COUNT(*) AS total FROM books ${whereClause}`;
  const totalRow  = prepare(countSql).get(...params);

  // Fetch the page
  const dataSql  = `SELECT * FROM books ${whereClause} ORDER BY ${order_by} ${order.toUpperCase()} LIMIT ? OFFSET ?`;
  const rows     = prepare(dataSql).all(...params, parsedLimit, parsedOffset);

  return res.status(200).json({
    message : 'success',
    total   : totalRow.total,
    limit   : parsedLimit,
    offset  : parsedOffset,
    data    : rows,
  });
});

// ---------------------------------------------------------------------------
// GET /books/:id  — fetch a single book
// ---------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const book = prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);

  if (!book) {
    return res.status(404).json({ message: `Book with id ${req.params.id} not found.` });
  }

  return res.status(200).json({ message: 'success', data: book });
});

// ---------------------------------------------------------------------------
// POST /books  — create a new book
// ---------------------------------------------------------------------------
router.post('/', (req, res) => {
  const errors = validateBook(req.body);
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const { title, author, price, year = null, genre = null } = req.body;

  const stmt   = prepare(
    'INSERT INTO books (title, author, price, year, genre) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(title.trim(), author.trim(), Number(price), year, genre);

  return res.status(201).json({
    message : 'Book created successfully.',
    data    : { id: result.lastInsertRowid, title, author, price: Number(price), year, genre },
  });
});

// ---------------------------------------------------------------------------
// PUT /books/:id  — update an existing book
// ---------------------------------------------------------------------------
router.put('/:id', (req, res) => {
  const existing = prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: `Book with id ${req.params.id} not found.` });
  }

  const errors = validateBook(req.body);
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const { title, author, price, year = existing.year, genre = existing.genre } = req.body;

  prepare(
    'UPDATE books SET title = ?, author = ?, price = ?, year = ?, genre = ? WHERE id = ?'
  ).run(title.trim(), author.trim(), Number(price), year, genre, req.params.id);

  return res.status(200).json({
    message : 'Book updated successfully.',
    data    : { id: Number(req.params.id), title, author, price: Number(price), year, genre },
  });
});

// ---------------------------------------------------------------------------
// DELETE /books/:id  — remove a book
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const existing = prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: `Book with id ${req.params.id} not found.` });
  }

  prepare('DELETE FROM books WHERE id = ?').run(req.params.id);

  return res.status(200).json({ message: `Book with id ${req.params.id} deleted successfully.` });
});

module.exports = router;
