const store = require('../lib/store');
const { NotFoundError, ValidationError } = require('../lib/errors');
const V = require('../validators/waveValidator');

async function list(query) {
  let waves = await store.findMany('waves');
  if (query.difficulty) waves = waves.filter(w => w.difficulty === query.difficulty);
  waves = waves.sort((a, b) => a.waveNumber - b.waveNumber);
  return waves;
}

async function get(waveId) {
  const wave = await store.findOne('waves', w => w.id === waveId);
  if (!wave) throw new NotFoundError('Wave not found');
  return wave;
}

async function create(data) {
  V.validateCreate(data);
  const { generateId } = require('../lib/idGen');
  const { nowISO } = require('../lib/dateUtil');
  const wave = {
    id: generateId('wave'),
    ...data,
    createdAt: nowISO()
  };
  await store.insert('waves', wave);
  return wave;
}

async function update(waveId, data) {
  V.validateUpdate(data);
  const wave = await store.findOne('waves', w => w.id === waveId);
  if (!wave) throw new NotFoundError('Wave not found');
  const updated = await store.updateOne('waves', w => w.id === waveId, { ...wave, ...data });
  return updated;
}

async function remove(waveId) {
  const removed = await store.removeOne('waves', w => w.id === waveId);
  if (!removed) throw new NotFoundError('Wave not found');
  return { deleted: true };
}

module.exports = { list, get, create, update, remove };
