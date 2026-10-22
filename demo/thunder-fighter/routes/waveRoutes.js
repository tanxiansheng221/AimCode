// Wave routes (plain http, read-only). Dispatcher: routes/index.js
module.exports = async function waveRoutes(req, res, ctx, run) {
  const waveService = require('../services/waveService');
  const { method, parts } = ctx;

  // GET /api/waves
  if (method === 'GET' && parts.length === 2) {
    await run(() => waveService.list(ctx.query))(req, res, ctx);
    return true;
  }

  // GET /api/waves/:id
  if (method === 'GET' && parts.length === 3) {
    await run(() => waveService.get(parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
