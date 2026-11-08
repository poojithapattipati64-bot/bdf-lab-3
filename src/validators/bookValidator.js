'use strict';

/**
 * Validates the request body for creating/updating a book.
 * Returns an array of error strings (empty if valid).
 *
 * @param {object} body
 * @returns {string[]}
 */
function validateBook(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required and must be a non-empty string.');
  }

  if (!body.author || typeof body.author !== 'string' || body.author.trim() === '') {
    errors.push('author is required and must be a non-empty string.');
  }

  if (body.price === undefined || body.price === null) {
    errors.push('price is required.');
  } else if (isNaN(Number(body.price)) || Number(body.price) < 0) {
    errors.push('price must be a non-negative number.');
  }

  if (body.year !== undefined && body.year !== null) {
    const y = Number(body.year);
    if (!Number.isInteger(y) || y < 1000 || y > new Date().getFullYear() + 1) {
      errors.push('year must be a valid integer (e.g., 2024).');
    }
  }

  return errors;
}

module.exports = { validateBook };
