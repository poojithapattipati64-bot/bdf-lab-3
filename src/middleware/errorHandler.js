'use strict';

/**
 * Global error handler middleware.
 * Must be registered AFTER all routes in server.js.
 */
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.stack || err.message);

  const status  = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
}

module.exports = errorHandler;
