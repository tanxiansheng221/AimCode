// Review routes (plain http). Dispatcher: routes/index.js
module.exports = async function reviewRoutes(req, res, ctx, run) {
  const reviewService = require('../services/reviewService');
  const { method, parts } = ctx;

  // GET /api/reviews (paginated, public)
  if (method === 'GET' && parts.length === 2) {
    await run(() => reviewService.list(ctx.query))(req, res, ctx);
    return true;
  }

  // GET /api/reviews/pilot/:pilotId (public)
  if (method === 'GET' && parts[2] === 'pilot' && parts.length === 4) {
    await run(() => reviewService.getByPilot(parts[3]))(req, res, ctx);
    return true;
  }

  // POST /api/reviews (auth)
  if (method === 'POST' && parts.length === 2) {
    await run(async () => {
      const result = await reviewService.create(ctx.pilotId, ctx.body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })(req, res, ctx);
    return true;
  }

  // DELETE /api/reviews/:id (auth, own review only)
  if (method === 'DELETE' && parts.length === 3) {
    await run(() => reviewService.remove(ctx.pilotId, parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
