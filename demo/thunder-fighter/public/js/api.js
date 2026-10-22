// api.js — backend REST client (global API)
const API = (() => {
  const BASE = '';
  let token = localStorage.getItem('tf_token') || '';
  let callsign = localStorage.getItem('tf_callsign') || '';

  async function request(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) {
      const msg = (data && data.error) ? data.error : ('HTTP ' + res.status);
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function setAuth(t, cs) {
    token = t;
    callsign = cs;
    localStorage.setItem('tf_token', t);
    localStorage.setItem('tf_callsign', cs);
  }

  function clearAuth() {
    token = '';
    callsign = '';
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_callsign');
  }

  return {
    request,
    setAuth,
    clearAuth,
    get callsign() { return callsign; },
    get token() { return token; },
    register: (cs, pw) => request('POST', '/api/pilots/register', { callsign: cs, password: pw }),
    login: (cs, pw) => request('POST', '/api/pilots/login', { callsign: cs, password: pw }),
    me: () => request('GET', '/api/pilots/me'),
    topScores: (limit) => request('GET', '/api/scores/top?limit=' + (limit || 5)),
    submitScore: (score, wave) => request('POST', '/api/scores', { score, wave, source: 'arcade' }),
    enemies: () => request('GET', '/api/enemies'),
    waves: () => request('GET', '/api/waves'),
    stats: () => request('GET', '/api/stats')
  };
})();
