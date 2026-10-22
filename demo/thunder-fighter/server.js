const http = require('http');
const config = require('./config');
const app = require('./app');
const logger = require('./lib/logger');
const { seedAll } = require('./lib/seed');

const server = http.createServer(app);

seedAll().then(() => {
  server.listen(config.PORT, () => {
    logger.info(`THUNDER FIGHTER server running on port ${config.PORT}`);
  });
}).catch(err => {
  logger.error('Failed to seed data:', err.message);
  server.listen(config.PORT, () => {
    logger.info(`THUNDER FIGHTER server running on port ${config.PORT} (no seed)`);
  });
});
