const { isInt, isOneOf, isString } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

const WEAPONS = ['blaster', 'spread', 'laser', 'missile', 'plasma'];
const SPECIALS = ['none', 'bomb', 'shield_burst', 'time_warp'];

function validateUpdate(data) {
  if (data.weapon !== undefined && !isOneOf(data.weapon, WEAPONS)) {
    throw new ValidationError(`weapon must be one of: ${WEAPONS.join(', ')}`);
  }
  if (data.weaponLevel !== undefined && !isInt(data.weaponLevel, 1, 5)) {
    throw new ValidationError('weaponLevel must be 1-5');
  }
  if (data.speed !== undefined && !isInt(data.speed, 1, 10)) {
    throw new ValidationError('speed must be 1-10');
  }
  if (data.shield !== undefined && !isInt(data.shield, 0, 5)) {
    throw new ValidationError('shield must be 0-5');
  }
  if (data.special !== undefined && !isOneOf(data.special, SPECIALS)) {
    throw new ValidationError(`special must be one of: ${SPECIALS.join(', ')}`);
  }
}

module.exports = { validateUpdate };
