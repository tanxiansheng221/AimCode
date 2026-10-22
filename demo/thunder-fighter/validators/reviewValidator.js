const { isInt } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

function validateCreate(data) {
  if (data.rating === undefined) throw new ValidationError('rating is required');
  if (!isInt(data.rating, 1, 5)) throw new ValidationError('rating must be 1-5');
  if (data.comment !== undefined && typeof data.comment !== 'string') {
    throw new ValidationError('comment must be a string');
  }
  if (data.comment && data.comment.length > 500) {
    throw new ValidationError('comment must be at most 500 characters');
  }
}

module.exports = { validateCreate };
