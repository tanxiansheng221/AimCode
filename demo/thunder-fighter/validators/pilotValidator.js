const { isNonEmptyString, isString } = require('../lib/validator');
const { ValidationError } = require('../lib/errors');

function validateRegister(data) {
  if (!isNonEmptyString(data.callsign)) throw new ValidationError('callsign is required');
  if (!isString(data.callsign, 2, 24)) throw new ValidationError('callsign must be 2-24 characters');
  if (!isNonEmptyString(data.password)) throw new ValidationError('password is required');
  if (data.password.length < 6) throw new ValidationError('password must be at least 6 characters');
}

function validateLogin(data) {
  if (!isNonEmptyString(data.callsign)) throw new ValidationError('callsign is required');
  if (!isNonEmptyString(data.password)) throw new ValidationError('password is required');
}

function validateUpdate(data) {
  if (data.callsign !== undefined && !isString(data.callsign, 2, 24)) {
    throw new ValidationError('callsign must be 2-24 characters');
  }
  if (data.password !== undefined && data.password.length < 6) {
    throw new ValidationError('password must be at least 6 characters');
  }
}

module.exports = { validateRegister, validateLogin, validateUpdate };
