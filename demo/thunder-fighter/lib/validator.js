function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isString(v, min = 1, max = 256) {
  return typeof v === 'string' && v.length >= min && v.length <= max;
}

function isInt(v, min = -Infinity, max = Infinity) {
  return Number.isInteger(v) && v >= min && v <= max;
}

function isPositiveInt(v) {
  return isInt(v, 1);
}

function isPositive(v) {
  return typeof v === 'number' && v > 0;
}

function isArray(v, minLen = 0) {
  return Array.isArray(v) && v.length >= minLen;
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isOneOf(v, arr) {
  return arr.includes(v);
}

function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

module.exports = {
  isNonEmptyString,
  isString,
  isInt,
  isPositiveInt,
  isPositive,
  isArray,
  isObject,
  isOneOf,
  isEmail
};
