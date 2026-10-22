const store = require('../lib/store');
const { ValidationError, NotFoundError } = require('../lib/errors');
const V = require('../validators/enemyValidator');

async function list(query) {
  let enemies = await store.findMany('enemies');
  if (query.type) enemies = enemies.filter(e => e.type === query.type);
  if (query.tier) enemies = enemies.filter(e => String(e.tier) === String(query.tier));
  return enemies;
}

async function get(enemyId) {
  const enemy = await store.findOne('enemies', e => e.id === enemyId);
  if (!enemy) throw new NotFoundError('Enemy not found');
  return enemy;
}

async function create(data) {
  V.validateCreate(data);
  const { generateId } = require('../lib/idGen');
  const { nowISO } = require('../lib/dateUtil');
  const enemy = {
    id: generateId('enemy'),
    ...data,
    createdAt: nowISO()
  };
  await store.insert('enemies', enemy);
  return enemy;
}

async function update(enemyId, data) {
  V.validateUpdate(data);
  const enemy = await store.findOne('enemies', e => e.id === enemyId);
  if (!enemy) throw new NotFoundError('Enemy not found');
  const updated = await store.updateOne('enemies', e => e.id === enemyId, { ...enemy, ...data });
  return updated;
}

async function remove(enemyId) {
  const removed = await store.removeOne('enemies', e => e.id === enemyId);
  if (!removed) throw new NotFoundError('Enemy not found');
  return { deleted: true };
}

module.exports = { list, get, create, update, remove };
