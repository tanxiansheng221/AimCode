const { isInt, isPositiveInt } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

function validateSubmit(data) {
  if (data.score === undefined) throw new ValidationError('score is required');
  if (!isInt(data.score, 0)) throw new ValidationError('score must be a non-negative integer');
  if (data.waveReached !== undefined && !isInt(data.waveReached, 0)) {
    throw new ValidationError('waveReached must be a non-negative integer');
  }
  if (data.runId !== undefined && typeof data.runId !== 'string') {
    throw new ValidationError('runId must be a string');
  }
}

module.exports = { validateSubmit };
