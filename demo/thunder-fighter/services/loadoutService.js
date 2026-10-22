const store = require('../lib/store');
const { generateId } = require('../lib/idGen');
const { nowISO } = require('../lib/dateUtil');
const { NotFoundError, ConflictError, ValidationError } = require('../lib/errors');
const V = require('../validators/loadoutValidator');

const DEFAULT_LOADOUT = {
  weapon: 'blaster',
  weaponLevel: 1,
  speed: 5,
  shield: 0,
  special: 'none'
};

async function getLoadout(pilotId) {
  let loadout = await store.findOne('loadouts', l => l.pilotId === pilotId);
  if (!loadout) {
    loadout = {
      id: generateId('loadout'),
      pilotId,
      ...DEFAULT_LOADOUT,
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
    await store.insert('loadouts', loadout);
  }
  return loadout;
}

async function updateLoadout(pilotId, data) {
  V.validateUpdate(data);
  let loadout = await store.findOne('loadouts', l => l.pilotId === pilotId);
  if (!loadout) {
    loadout = {
      id: generateId('loadout'),
      pilotId,
      ...DEFAULT_LOADOUT,
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
    await store.insert('loadouts', loadout);
  }
  const updates = {};
  if (data.weapon !== undefined) updates.weapon = data.weapon;
  if (data.weaponLevel !== undefined) updates.weaponLevel = data.weaponLevel;
  if (data.speed !== undefined) updates.speed = data.speed;
  if (data.shield !== undefined) updates.shield = data.shield;
  if (data.special !== undefined) updates.special = data.special;

  const updated = await store.updateOne('loadouts', l => l.pilotId === pilotId, {
    ...loadout,
    ...updates,
    updatedAt: nowISO()
  });
  return updated;
}

module.exports = { getLoadout, updateLoadout };
