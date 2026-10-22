const { AppError } = require('../lib/errors');
const logger = require('../lib/logger');

function errorHandler(err, req, res) {
  const status = err instanceof AppError ? err.status : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';

  logger.error(`${req.method} ${req.url} -> ${status}: ${message}`);

  if (!res.headersSent) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message, code }));
  }
}

module.exports = errorHandler;
