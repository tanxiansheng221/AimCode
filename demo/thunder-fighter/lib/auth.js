const crypto = require('crypto');
const jwt = require('./jwt');
const config = require('../config');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split('$');
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return computed === hash;
}

function generateToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.TOKEN_EXPIRY });
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};
