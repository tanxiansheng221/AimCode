const store = require('../lib/store');
const { generateId } = require('../lib/idGen');
const { nowISO } = require('../lib/dateUtil');
const { NotFoundError, ValidationError } = require('../lib/errors');
const V = require('../validators/scoreValidator');
const { paginate } = require('../lib/pagination');

async function submit(pilotId, data) {
  V.validateSubmit(data);
  const pilot = await store.findOne('pilots', p => p.id === pilotId);
  if (!pilot) throw new NotFoundError('Pilot not found');
  const score = {
    id: generateId('score'),
    pilotId,
    callsign: pilot.callsign,
    runId: data.runId || null,
    score: data.score,
    waveReached: data.waveReached || 0,
    createdAt: nowISO()
  };
  await store.insert('scores', score);
  return score;
}

async function list(query) {
  const all = await store.findMany('scores');
  const sorted = all.sort((a, b) => b.score - a.score);
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  return paginate(sorted, page, limit);
}

async function topScores(limit = 10) {
  const all = await store.findMany('scores');
  return all.sort((a, b) => b.score - a.score).slice(0, limit);
}

async function getByPilot(pilotId) {
  const all = await store.findMany('scores', s => s.pilotId === pilotId);
  return all.sort((a, b) => b.score - a.score);
}

async function deleteScore(scoreId) {
  const removed = await store.removeOne('scores', s => s.id === scoreId);
  if (!removed) throw new NotFoundError('Score not found');
  return { deleted: true };
}

module.exports = { submit, list, topScores, getByPilot, deleteScore };
