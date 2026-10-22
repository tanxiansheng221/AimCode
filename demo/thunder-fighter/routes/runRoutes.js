// Run routes (plain http). Dispatcher: routes/index.js
module.exports = async function runRoutes(req, res, ctx, run) {
  const runService = require('../services/runService');
  const { method, parts } = ctx;

  // POST /api/runs/start
  if (method === 'POST' && parts[2] === 'start' && parts.length === 3) {
    await run(async () => {
      const result = await runService.startRun(ctx.pilotId, ctx.body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })(req, res, ctx);
    return true;
  }

  // POST /api/runs/:id/end
  if (method === 'POST' && parts.length === 4 && parts[3] === 'end') {
    await run(() => runService.endRun(ctx.pilotId, parts[2], ctx.body))(req, res, ctx);
    return true;
  }

  // POST /api/runs/:id/abandon
  if (method === 'POST' && parts.length === 4 && parts[3] === 'abandon') {
    await run(() => runService.abandonRun(ctx.pilotId, parts[2]))(req, res, ctx);
    return true;
  }

  // GET /api/runs
  if (method === 'GET' && parts.length === 2) {
    await run(() => runService.getRuns(ctx.pilotId))(req, res, ctx);
    return true;
  }

  // GET /api/runs/:id
  if (method === 'GET' && parts.length === 3) {
    await run(() => runService.getRun(ctx.pilotId, parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
