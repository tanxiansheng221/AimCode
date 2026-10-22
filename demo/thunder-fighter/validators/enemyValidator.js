const { isNonEmptyString, isInt, isOneOf, isPositive } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

const TYPES = ['scout', 'fighter', 'bomber', 'elite', 'boss'];
const MOVEMENTS = ['straight', 'sine', 'dive', 'hover', 'zigzag'];

function validateCreate(data) {
  if (!isNonEmptyString(data.name)) throw new ValidationError('name is required');
  if (!isOneOf(data.type, TYPES)) throw new ValidationError(`type must be one of: ${TYPES.join(', ')}`);
  if (data.tier !== undefined && !isInt(data.tier, 1, 10)) throw new ValidationError('tier must be 1-10');
  if (data.hp !== undefined && !isPositive(data.hp)) throw new ValidationError('hp must be positive');
  if (data.speed !== undefined && !isPositive(data.speed)) throw new ValidationError('speed must be positive');
  if (data.scoreValue !== undefined && !isInt(data.scoreValue, 0)) throw new ValidationError('scoreValue must be non-negative');
  if (data.movement !== undefined && !isOneOf(data.movement, MOVEMENTS)) {
    throw new ValidationError(`movement must be one of: ${MOVEMENTS.join(', ')}`);
  }
}

function validateUpdate(data) {
  if (data.name !== undefined && !isNonEmptyString(data.name)) throw new ValidationError('name must be a non-empty string');
  if (data.type !== undefined && !isOneOf(data.type, TYPES)) throw new ValidationError(`type must be one of: ${TYPES.join(', ')}`);
  if (data.tier !== undefined && !isInt(data.tier, 1, 10)) throw new ValidationError('tier must be 1-10');
  if (data.hp !== undefined && !isPositive(data.hp)) throw new ValidationError('hp must be positive');
  if (data.speed !== undefined && !isPositive(data.speed)) throw new ValidationError('speed must be positive');
  if (data.scoreValue !== undefined && !isInt(data.scoreValue, 0)) throw new ValidationError('scoreValue must be non-negative');
  if (data.movement !== undefined && !isOneOf(data.movement, MOVEMENTS)) {
    throw new ValidationError(`movement must be one of: ${MOVEMENTS.join(', ')}`);
  }
}

module.exports = { validateCreate, validateUpdate };
