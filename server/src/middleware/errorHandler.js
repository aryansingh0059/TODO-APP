/**
 * Centralized error handling middleware.
 * Catches errors thrown in route handlers and returns consistent JSON responses.
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.message}`);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
