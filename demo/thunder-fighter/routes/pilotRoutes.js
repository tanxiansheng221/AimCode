// Pilot + loadout routes (plain http). Dispatcher: routes/index.js
module.exports = async function pilotRoutes(req, res, ctx, run) {
  const pilotService = require('../services/pilotService');
  const loadoutService = require('../services/loadoutService');
  const { method, parts } = ctx;
  const resource = parts[1]; // 'pilots'

  // POST /api/pilots/register  (public)
  if (method === 'POST' && parts[2] === 'register' && parts.length === 3) {
    await run(async () => {
      const result = await pilotService.register(ctx.body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })(req, res, ctx);
    return true;
  }

  // POST /api/pilots/login  (public)
  if (method === 'POST' && parts[2] === 'login' && parts.length === 3) {
    await run(async () => {
      const result = await pilotService.login(ctx.body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    })(req, res, ctx);
    return true;
  }

  // GET /api/pilots
  if (method === 'GET' && parts.length === 2) {
    await run(() => pilotService.listPilots())(req, res, ctx);
    return true;
  }

  // /api/pilots/me...
  if (parts[2] === 'me') {
    if (parts.length === 3) {
      if (method === 'GET') {
        await run(() => pilotService.getProfile(ctx.pilotId))(req, res, ctx);
        return true;
      }
      if (method === 'PUT') {
        await run(() => pilotService.updateProfile(ctx.pilotId, ctx.body))(req, res, ctx);
        return true;
      }
      if (method === 'DELETE') {
        await run(() => pilotService.deletePilot(ctx.pilotId))(req, res, ctx);
        return true;
      }
    }
    // /api/pilots/me/loadout
    if (parts[3] === 'loadout' && parts.length === 4) {
      if (method === 'GET') {
        await run(() => loadoutService.getLoadout(ctx.pilotId))(req, res, ctx);
        return true;
      }
      if (method === 'PUT') {
        await run(() => loadoutService.updateLoadout(ctx.pilotId, ctx.body))(req, res, ctx);
        return true;
      }
    }
    return false;
  }

  // GET /api/pilots/:id
  if (method === 'GET' && parts.length === 3) {
    await run(() => pilotService.getProfile(parts[2]))(req, res, ctx);
    return true;
  }

  return false;
};
