'use strict';

/**
 * seed.js — Populates the books table with sample data.
 * Run once after `npm install`:
 *   node seed.js
 */

const { initDatabase, prepare } = require('./database');

const SAMPLE_BOOKS = [
  { title: 'The Pragmatic Programmer', author: 'David Thomas',      price: 42.99, year: 2019, genre: 'Programming' },
  { title: 'Clean Code',               author: 'Robert C. Martin',  price: 29.99, year: 2008, genre: 'Programming' },
  { title: 'Design Patterns',          author: 'Gang of Four',       price: 59.99, year: 1994, genre: 'Programming' },
  { title: 'You Don\'t Know JS',       author: 'Kyle Simpson',       price: 24.99, year: 2015, genre: 'Programming' },
  { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', price: 19.99, year: 1997, genre: 'Fantasy' },
  { title: 'The Hobbit',               author: 'J.R.R. Tolkien',    price: 14.99, year: 1937, genre: 'Fantasy' },
  { title: 'Dune',                     author: 'Frank Herbert',      price: 15.00, year: 1965, genre: 'Sci-Fi' },
  { title: 'Foundation',               author: 'Isaac Asimov',       price: 12.99, year: 1951, genre: 'Sci-Fi' },
  { title: 'Atomic Habits',            author: 'James Clear',        price: 18.99, year: 2018, genre: 'Self-Help' },
  { title: 'Deep Work',                author: 'Cal Newport',        price: 16.99, year: 2016, genre: 'Self-Help' },
];

async function seed() {
  await initDatabase();

  const insert = prepare(
    'INSERT INTO books (title, author, price, year, genre) VALUES (?, ?, ?, ?, ?)'
  );

  for (const book of SAMPLE_BOOKS) {
    insert.run(book.title, book.author, book.price, book.year, book.genre);
    console.log(`  ✔ Inserted: ${book.title}`);
  }

  const count = prepare('SELECT COUNT(*) AS total FROM books').get();
  console.log(`\nDone. Total books in database: ${count.total}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
