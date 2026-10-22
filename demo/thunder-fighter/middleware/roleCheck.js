const { ForbiddenError } = require('../lib/errors');

function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || '';
  const config = require('../config');
  if (adminKey !== config.ADMIN_KEY) {
    const err = new ForbiddenError('Admin access required');
    res.writeHead(err.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message, code: err.code }));
    return;
  }
  next();
}

module.exports = { requireAdmin };
