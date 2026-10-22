const crypto = require('crypto');

function base64UrlEscape(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlUnescape(str) {
  str += new Array(5 - (str.length % 4)).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}

function base64UrlEncode(data) {
  return base64UrlEscape(Buffer.from(JSON.stringify(data)).toString('base64'));
}

function base64UrlDecode(str) {
  return JSON.parse(Buffer.from(base64UrlUnescape(str), 'base64').toString());
}

function sign(payload, secret, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now };
  if (options.expiresIn) {
    const match = options.expiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const val = parseInt(match[1], 10);
      const mult = { d: 86400, h: 3600, m: 60, s: 1 }[match[2]];
      body.exp = now + val * mult;
    }
  }
  const signingInput = base64UrlEncode(header) + '.' + base64UrlEncode(body);
  const signature = crypto.createHmac('sha256', secret).update(signingInput).digest('base64');
  return signingInput + '.' + base64UrlEscape(signature);
}

function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');
  const signingInput = parts[0] + '.' + parts[1];
  const signature = base64UrlEscape(crypto.createHmac('sha256', secret).update(signingInput).digest('base64'));
  if (signature !== parts[2]) throw new Error('Invalid signature');
  const payload = base64UrlDecode(parts[1]);
  if (payload.exp && Date.now() >= payload.exp * 1000) throw new Error('Token expired');
  return payload;
}

module.exports = { sign, verify };
