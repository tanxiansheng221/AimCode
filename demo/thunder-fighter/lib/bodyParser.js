function jsonBody(req, res, next) {
  if (req.method === 'GET' || req.method === 'DELETE' || req.method === 'HEAD') {
    req.body = {};
    next();
    return;
  }
  let data = '';
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => {
    try {
      req.body = data ? JSON.parse(data) : {};
    } catch {
      req.body = {};
    }
    next();
  });
}

module.exports = { jsonBody };
