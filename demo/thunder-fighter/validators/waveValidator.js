const { isNonEmptyString, isPositiveInt, isInt, isOneOf } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

const DIFFICULTIES = ['easy', 'normal', 'hard', 'insane'];

function validateCreate(data) {
  if (!isPositiveInt(data.waveNumber)) throw new ValidationError('waveNumber must be a positive integer');
  if (data.difficulty !== undefined && !isOneOf(data.difficulty, DIFFICULTIES)) {
    throw new ValidationError(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  }
  if (data.enemyCount !== undefined && !isPositiveInt(data.enemyCount)) {
    throw new ValidationError('enemyCount must be a positive integer');
  }
  if (data.spawnInterval !== undefined && !isInt(data.spawnInterval, 100)) {
    throw new ValidationError('spawnInterval must be >= 100ms');
  }
}

function validateUpdate(data) {
  if (data.waveNumber !== undefined && !isPositiveInt(data.waveNumber)) {
    throw new ValidationError('waveNumber must be a positive integer');
  }
  if (data.difficulty !== undefined && !isOneOf(data.difficulty, DIFFICULTIES)) {
    throw new ValidationError(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  }
  if (data.enemyCount !== undefined && !isPositiveInt(data.enemyCount)) {
    throw new ValidationError('enemyCount must be a positive integer');
  }
  if (data.spawnInterval !== undefined && !isInt(data.spawnInterval, 100)) {
    throw new ValidationError('spawnInterval must be >= 100ms');
  }
}

module.exports = { validateCreate, validateUpdate };
