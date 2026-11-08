'use strict';

const express          = require('express');
const { initDatabase } = require('./database');         // async init
const booksRouter      = require('./src/routes/books'); // correct import path
const errorHandler     = require('./src/middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000; // read from .env, default 3000

require('dotenv').config(); // loads PORT from .env

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/books', booksRouter);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler (must be last)
app.use(errorHandler);

// ── Start server (only after DB is ready) ────────────────────────────────────
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Books API running on http://localhost:${PORT}`);
      console.log(`[server] Press Ctrl+C to stop.`);
    });
  })
  .catch((err) => {
    console.error('[server] Failed to initialise database:', err.message);
    process.exit(1);
  });

module.exports = app; // export for testing
