const { isNonEmptyString, isInt, isPositiveInt } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

function validateStart(data) {
  if (data.seed !== undefined && !isNonEmptyString(data.seed)) {
    throw new ValidationError('seed must be a non-empty string');
  }
}

function validateEnd(data) {
  if (data.score === undefined) throw new ValidationError('score is required');
  if (!isInt(data.score, 0)) throw new ValidationError('score must be a non-negative integer');
  if (data.waveReached !== undefined && !isPositiveInt(data.waveReached)) {
    throw new ValidationError('waveReached must be a positive integer');
  }
  if (data.inputsHash !== undefined && typeof data.inputsHash !== 'string') {
    throw new ValidationError('inputsHash must be a string');
  }
}

module.exports = { validateStart, validateEnd };
