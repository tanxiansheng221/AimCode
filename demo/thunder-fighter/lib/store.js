const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const logger = require('./logger');

const caches = new Map();

async function readCollection(name) {
  if (caches.has(name)) return caches.get(name);
  const filePath = path.join(config.DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    caches.set(name, data);
    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      caches.set(name, []);
      return [];
    }
    throw err;
  }
}

async function writeCollection(name, data) {
  const filePath = path.join(config.DATA_DIR, `${name}.json`);
  await fs.mkdir(config.DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  caches.set(name, data);
}

async function findOne(name, predicate) {
  const col = await readCollection(name);
  return col.find(predicate) || null;
}

async function findMany(name, predicate) {
  const col = await readCollection(name);
  return predicate ? col.filter(predicate) : [...col];
}

async function insert(name, doc) {
  const col = await readCollection(name);
  col.push(doc);
  await writeCollection(name, col);
  return doc;
}

async function updateOne(name, predicate, updater) {
  const col = await readCollection(name);
  const idx = col.findIndex(predicate);
  if (idx === -1) return null;
  const updated = typeof updater === 'function' ? updater(col[idx]) : { ...col[idx], ...updater };
  col[idx] = updated;
  await writeCollection(name, col);
  return updated;
}

async function removeOne(name, predicate) {
  const col = await readCollection(name);
  const idx = col.findIndex(predicate);
  if (idx === -1) return null;
  const removed = col.splice(idx, 1)[0];
  await writeCollection(name, col);
  return removed;
}

async function clearCache(name) {
  if (name) caches.delete(name);
  else caches.clear();
}

module.exports = {
  readCollection,
  writeCollection,
  findOne,
  findMany,
  insert,
  updateOne,
  removeOne,
  clearCache
};
