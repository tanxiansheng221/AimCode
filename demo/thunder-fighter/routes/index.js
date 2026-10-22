const url = require('url');
const errorHandler = require('../middleware/errorHandler');

const pilotRoutes = require('./pilotRoutes');
const runRoutes = require('./runRoutes');
const enemyRoutes = require('./enemyRoutes');
const waveRoutes = require('./waveRoutes');
const scoreRoutes = require('./scoreRoutes');
const reviewRoutes = require('./reviewRoutes');
const statsRoutes = require('./statsRoutes');

function run(handler) {
  return async (req, res, ctx) => {
    try {
      const result = await handler(req, res, ctx);
      if (result !== false && !res.writableEnded) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      }
    } catch (err) {
      errorHandler(err, req, res);
    }
  };
}

const router = async function routes(req, res, next) {
  const parsed = url.parse(req.url, true);
  req.query = parsed.query;
  req.pathname = parsed.pathname;

  const parts = parsed.pathname.split('/').filter(Boolean); // ['api', 'pilots', ...]
  if (parts[0] !== 'api' || parts.length < 2) {
    next();
    return;
  }

  const ctx = {
    method: req.method,
    parts,
    // parts[1] = resource, parts[2..] = sub path
    segment: (i) => parts[i],
    query: req.query,
    pilotId: req.pilotId,
    pilot: req.pilot,
    body: req.body
  };

  const dispatchers = {
    pilots: pilotRoutes,
    runs: runRoutes,
    enemies: enemyRoutes,
    waves: waveRoutes,
    scores: scoreRoutes,
    reviews: reviewRoutes,
    stats: statsRoutes,
    health: statsRoutes
  };

  const dispatcher = dispatchers[parts[1]];
  if (!dispatcher) {
    next();
    return;
  }

  const handled = await dispatcher(req, res, ctx, run);
  if (!handled) next();
};

module.exports = router;
