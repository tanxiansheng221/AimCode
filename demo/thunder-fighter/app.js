const path = require('path');
const config = require('./config');
const logger = require('./lib/logger');
const { jsonBody } = require('./lib/bodyParser');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('./middleware/rateLimit');
const notFound = require('./middleware/notFound');
const routes = require('./routes');

function app(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  logger.info(`${req.method} ${req.url}`);

  if (req.url.startsWith('/api/')) {
    jsonBody(req, res, () => {
      rateLimit(req, res, () => {
        authMiddleware(req, res, () => {
          routes(req, res, () => {
            notFound(req, res);
          });
        });
      });
    });
    return;
  }

  serveStatic(req, res);
}

function serveStatic(req, res) {
  const fs = require('fs');
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (req.url === '/' || !path.extname(req.url)) {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (e2, idx) => {
          if (e2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(idx);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

module.exports = app;
