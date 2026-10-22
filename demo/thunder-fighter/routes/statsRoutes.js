// Stats + health routes (plain http, public). Dispatcher: routes/index.js
module.exports = async function statsRoutes(req, res, ctx, run) {
  const statsService = require('../services/statsService');
  const { method, parts } = ctx;
  const resource = parts[1];

  // GET /api/health  OR  GET /api/stats/health
  if (method === 'GET' && parts.length === 2 && resource === 'health') {
    await run(() => statsService.getHealth())(req, res, ctx);
    return true;
  }
  if (method === 'GET' && parts[2] === 'health' && parts.length === 3) {
    await run(() => statsService.getHealth())(req, res, ctx);
    return true;
  }

  // GET /api/stats
  if (method === 'GET' && resource === 'stats' && parts.length === 2) {
    await run(() => statsService.getStats())(req, res, ctx);
    return true;
  }

  // GET /api/stats/leaderboard
  if (method === 'GET' && resource === 'stats' && parts[2] === 'leaderboard' && parts.length === 3) {
    await run(() => statsService.getLeaderboard())(req, res, ctx);
    return true;
  }

  return false;
};
