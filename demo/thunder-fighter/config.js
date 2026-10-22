const path = require('path');

module.exports = {
  PORT: process.env.PORT || 8808,
  DATA_DIR: path.join(__dirname, 'data'),
  JWT_SECRET: process.env.JWT_SECRET || 'thunder-fighter-neon-secret-2024',
  TOKEN_EXPIRY: '7d',
  MAX_LEADERBOARD: 50,
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX: 120,
  ADMIN_KEY: process.env.ADMIN_KEY || 'thunder-admin-key',
  SEED_ON_BOOT: true,
  WAVE_DIFFICULTY_SCALE: 1.15,
  BASE_SPAWN_INTERVAL_MS: 2000,
  ENEMY_TIERS: ['scout', 'fighter', 'heavy', 'elite', 'boss'],
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
