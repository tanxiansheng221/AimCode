const { verifyToken } = require('../lib/auth');
const { UnauthorizedError } = require('../lib/errors');

const PUBLIC_PATHS = [
  { method: 'POST', path: '/api/pilots/register' },
  { method: 'POST', path: '/api/pilots/login' },
  { method: 'GET', path: '/api/health' },
  { method: 'GET', path: '/api/enemies' },
  { method: 'GET', path: '/api/waves' },
  { method: 'GET', path: '/api/scores' },
  { method: 'GET', path: '/api/reviews' },
  { method: 'GET', path: '/api/stats' }
];

function isPublic(req) {
  return PUBLIC_PATHS.some(p =>
    (p.method === '*' || p.method === req.method) && req.url.startsWith(p.path)
  );
}

function authMiddleware(req, res, next) {
  if (isPublic(req)) {
    req.pilotId = null;
    req.pilot = null;
    next();
    return;
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (!token) {
    const err = new UnauthorizedError('Missing Authorization token');
    res.writeHead(err.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message, code: err.code }));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.pilotId = payload.pilotId;
    req.pilot = payload;
    next();
  } catch (e) {
    const err = new UnauthorizedError('Invalid or expired token');
    res.writeHead(err.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message, code: err.code }));
  }
}

module.exports = authMiddleware;
