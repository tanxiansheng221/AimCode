const config = require('../config');

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const current = LEVELS[config.LOG_LEVEL] ?? 1;

function log(level, message, meta) {
  if (LEVELS[level] < current) return;
  const ts = new Date().toISOString();
  const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
  const line = `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

module.exports = {
  debug: (msg, meta) => log('debug', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta)
};
