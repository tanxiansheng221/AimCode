const store = require('../lib/store');
const { generateId } = require('../lib/idGen');
const { nowISO } = require('../lib/dateUtil');
const { hashPassword, verifyPassword, generateToken } = require('../lib/auth');
const { ConflictError, UnauthorizedError, NotFoundError, ValidationError } = require('../lib/errors');
const V = require('../validators/pilotValidator');

async function register(data) {
  V.validateRegister(data);
  const existing = await store.findOne('pilots', p => p.callsign === data.callsign);
  if (existing) throw new ConflictError('Callsign already taken');

  const pilot = {
    id: generateId('pilot'),
    callsign: data.callsign.trim(),
    passwordHash: hashPassword(data.password),
    createdAt: nowISO(),
    runsCompleted: 0,
    totalScore: 0,
    highestWave: 0
  };
  await store.insert('pilots', pilot);
  return { pilot: sanitize(pilot), token: generateToken({ pilotId: pilot.id, callsign: pilot.callsign }) };
}

async function login(data) {
  V.validateLogin(data);
  const pilot = await store.findOne('pilots', p => p.callsign === data.callsign);
  if (!pilot) throw new UnauthorizedError('Invalid callsign or password');
  if (!verifyPassword(data.password, pilot.passwordHash)) {
    throw new UnauthorizedError('Invalid callsign or password');
  }
  return { pilot: sanitize(pilot), token: generateToken({ pilotId: pilot.id, callsign: pilot.callsign }) };
}

async function getProfile(pilotId) {
  const pilot = await store.findOne('pilots', p => p.id === pilotId);
  if (!pilot) throw new NotFoundError('Pilot not found');
  return sanitize(pilot);
}

async function updateProfile(pilotId, data) {
  V.validateUpdate(data);
  const pilot = await store.findOne('pilots', p => p.id === pilotId);
  if (!pilot) throw new NotFoundError('Pilot not found');

  const updates = {};
  if (data.callsign) {
    const taken = await store.findOne('pilots', p => p.callsign === data.callsign && p.id !== pilotId);
    if (taken) throw new ConflictError('Callsign already taken');
    updates.callsign = data.callsign.trim();
  }
  if (data.password) updates.passwordHash = hashPassword(data.password);

  const updated = await store.updateOne('pilots', p => p.id === pilotId, { ...pilot, ...updates });
  return sanitize(updated);
}

async function listPilots() {
  const pilots = await store.findMany('pilots');
  return pilots.map(sanitize);
}

async function deletePilot(pilotId) {
  const removed = await store.removeOne('pilots', p => p.id === pilotId);
  if (!removed) throw new NotFoundError('Pilot not found');
  await store.removeOne('loadouts', l => l.pilotId === pilotId);
  await store.removeOne('reviews', r => r.pilotId === pilotId);
  const runs = await store.findMany('runs', r => r.pilotId === pilotId);
  for (const r of runs) await store.removeOne('runs', x => x.id === r.id);
  const scores = await store.findMany('scores', s => s.pilotId === pilotId);
  for (const s of scores) await store.removeOne('scores', x => x.id === s.id);
  return { deleted: true };
}

function sanitize(pilot) {
  const { passwordHash, ...rest } = pilot;
  return rest;
}

module.exports = { register, login, getProfile, updateProfile, listPilots, deletePilot };
