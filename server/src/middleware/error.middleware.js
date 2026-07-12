const response = require('../utils/response');
const config = require('../config/env');

/**
 * Global centralized error-handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Log detailed error information internally
  console.error('Unhandled Server Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Support custom arrays of sub-validation errors if present (e.g. from validator fields)
  const errors = err.errors || null;

  return response.error(res, message, statusCode, errors);
};

module.exports = errorHandler;
