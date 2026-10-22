const config = require('../config');
const { RateLimitError } = require('../lib/errors');

const buckets = new Map();

function rateLimit(req, res, next) {
  const key = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - config.RATE_LIMIT_WINDOW_MS;

  let bucket = buckets.get(key) || [];
  bucket = bucket.filter(t => t > windowStart);

  if (bucket.length >= config.RATE_LIMIT_MAX) {
    const err = new RateLimitError('Rate limit exceeded');
    res.writeHead(err.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message, code: err.code }));
    return;
  }

  bucket.push(now);
  buckets.set(key, bucket);
  next();
}

module.exports = rateLimit;
