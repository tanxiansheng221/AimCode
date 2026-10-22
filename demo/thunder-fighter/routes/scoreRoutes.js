// Score / leaderboard routes (plain http). Dispatcher: routes/index.js
module.exports = async function scoreRoutes(req, res, ctx, run) {
  const scoreService = require('../services/scoreService');
  const { method, parts } = ctx;

  // GET /api/scores (paginated leaderboard, public)
  if (method === 'GET' && parts.length === 2) {
    await run(() => scoreService.list(ctx.query))(req, res, ctx);
    return true;
  }

  // GET /api/scores/top?limit=N (public)
  if (method === 'GET' && parts[2] === 'top' && parts.length === 3) {
    const limit = Math.min(50, parseInt(ctx.query.limit || '10', 10) || 10);
    await run(() => scoreService.topScores(limit))(req, res, ctx);
    return true;
  }

  // GET /api/scores/me (my scores)
  if (method === 'GET' && parts[2] === 'me' && parts.length === 3) {
    await run(() => scoreService.getByPilot(ctx.pilotId))(req, res, ctx);
    return true;
  }

  // GET /api/scores/pilot/:pilotId (public)
  if (method === 'GET' && parts[2] === 'pilot' && parts.length === 4) {
    await run(() => scoreService.getByPilot(parts[3]))(req, res, ctx);
    return true;
  }

  // POST /api/scores (submit, auth)
  if (method === 'POST' && parts.length === 2) {
    await run(async () => {
      const result = await scoreService.submit(ctx.pilotId, ctx.body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })(req, res, ctx);
    return true;
  }

  // DELETE /api/scores/:id (auth)
  if (method === 'DELETE' && parts.length === 3) {
    await run(() => scoreService.deleteScore(parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
