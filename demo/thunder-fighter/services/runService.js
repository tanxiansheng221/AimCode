const store = require('../lib/store');
const { generateId } = require('../lib/idGen');
const { nowISO, durationSeconds } = require('../lib/dateUtil');
const { NotFoundError, ValidationError } = require('../lib/errors');
const V = require('../validators/runValidator');
const pilotEvents = require('../events/pilotEvents');
const scoreEvents = require('../events/scoreEvents');
const notificationEvents = require('../events/notificationEvents');

async function startRun(pilotId, data) {
  V.validateStart(data);
  const run = {
    id: generateId('run'),
    pilotId,
    seed: data.seed || generateId('seed'),
    startedAt: nowISO(),
    endedAt: null,
    score: 0,
    waveReached: 0,
    duration: 0,
    status: 'active',
    inputsHash: null
  };
  await store.insert('runs', run);
  return run;
}

async function endRun(pilotId, runId, data) {
  V.validateEnd(data);
  const run = await store.findOne('runs', r => r.id === runId && r.pilotId === pilotId);
  if (!run) throw new NotFoundError('Run not found');
  if (run.status !== 'active') throw new ValidationError('Run already ended');

  const endedAt = nowISO();
  const duration = durationSeconds(run.startedAt, endedAt);
  const updated = await store.updateOne('runs', r => r.id === runId, {
    ...run,
    endedAt,
    score: data.score || 0,
    waveReached: data.waveReached || 0,
    duration,
    status: 'completed',
    inputsHash: data.inputsHash || null
  });

  const pilot = await store.findOne('pilots', p => p.id === pilotId);
  if (pilot) {
    const updates = {
      runsCompleted: (pilot.runsCompleted || 0) + 1,
      totalScore: (pilot.totalScore || 0) + (data.score || 0),
      highestWave: Math.max(pilot.highestWave || 0, data.waveReached || 0)
    };
    await store.updateOne('pilots', p => p.id === pilotId, { ...pilot, ...updates });
    pilotEvents.emit('pilot:updated', { pilotId, updates });
  }

  if (data.score > 0) {
    await store.insert('scores', {
      id: generateId('score'),
      pilotId,
      runId,
      callsign: pilot ? pilot.callsign : 'Unknown',
      score: data.score,
      waveReached: data.waveReached || 0,
      createdAt: endedAt
    });
    scoreEvents.emit('score:submitted', { pilotId, score: data.score, waveReached: data.waveReached });
  }

  return updated;
}

async function getRuns(pilotId) {
  return store.findMany('runs', r => r.pilotId === pilotId);
}

async function getRun(pilotId, runId) {
  const run = await store.findOne('runs', r => r.id === runId && r.pilotId === pilotId);
  if (!run) throw new NotFoundError('Run not found');
  return run;
}

async function abandonRun(pilotId, runId) {
  const run = await store.findOne('runs', r => r.id === runId && r.pilotId === pilotId);
  if (!run) throw new NotFoundError('Run not found');
  if (run.status !== 'active') throw new ValidationError('Run is not active');
  const updated = await store.updateOne('runs', r => r.id === runId, { ...run, status: 'abandoned', endedAt: nowISO() });
  return updated;
}

module.exports = { startRun, endRun, getRuns, getRun, abandonRun };
