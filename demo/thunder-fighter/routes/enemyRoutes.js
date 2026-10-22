// Enemy prototype routes (plain http, read-only). Dispatcher: routes/index.js
module.exports = async function enemyRoutes(req, res, ctx, run) {
  const enemyService = require('../services/enemyService');
  const { method, parts } = ctx;

  // GET /api/enemies
  if (method === 'GET' && parts.length === 2) {
    await run(() => enemyService.list(ctx.query))(req, res, ctx);
    return true;
  }

  // GET /api/enemies/:id
  if (method === 'GET' && parts.length === 3) {
    await run(() => enemyService.get(parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
