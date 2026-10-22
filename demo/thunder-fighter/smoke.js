// Smoke test: full API walk-through against a running server (port from config).
const config = require('./config');
const B = `http://localhost:${config.PORT}`;
let passed = 0, failed = 0;
const results = [];

async function check(name, status, expect, extra) {
  const ok = status === expect;
  ok ? passed++ : failed++;
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name} [${status} expected ${expect}] ${extra || ''}`);
}

(async () => {
  const callsign = 'Ace' + (Date.now() % 100000);

  let r = await fetch(B + '/api/health');
  check('health', r.status, 200); await r.json();

  r = await fetch(B + '/api/pilots/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callsign, password: 'secret123' }) });
  let j = await r.json();
  check('register', r.status, 201, j.pilot ? j.pilot.callsign : JSON.stringify(j));
  const T = j.token;
  const H = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + T };

  r = await fetch(B + '/api/pilots/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callsign, password: 'secret123' }) });
  j = await r.json();
  check('login', r.status, 200, j.token ? 'token ok' : JSON.stringify(j));

  r = await fetch(B + '/api/pilots/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callsign, password: 'secret123' }) });
  j = await r.json();
  check('register-duplicate-409', r.status, 409);

  r = await fetch(B + '/api/pilots/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ callsign: 'x', password: '1' }) });
  check('register-validation-400', r.status, 400);

  r = await fetch(B + '/api/pilots/me', { headers: H });
  j = await r.json();
  check('profile-me', r.status, 200, j.callsign);

  r = await fetch(B + '/api/pilots/me');
  check('no-auth-401', r.status, 401);

  r = await fetch(B + '/api/runs/start', { method: 'POST', headers: H, body: '{}' });
  j = await r.json();
  check('run-start', r.status, 201, j.id);
  const runId = j.id;

  r = await fetch(B + `/api/runs/${runId}/end`, { method: 'POST', headers: H, body: JSON.stringify({ score: 1500, waveReached: 3 }) });
  j = await r.json();
  check('run-end', r.status, 200, `status=${j.status} score=${j.score}`);

  r = await fetch(B + `/api/runs/${runId}/end`, { method: 'POST', headers: H, body: JSON.stringify({ score: 1 }) });
  check('run-end-twice-400', r.status, 400);

  r = await fetch(B + '/api/runs', { headers: H });
  j = await r.json();
  check('run-list', r.status, 200, `${Array.isArray(j) ? j.length : '?'} runs`);

  r = await fetch(B + '/api/pilots/me/loadout', { method: 'PUT', headers: H, body: JSON.stringify({ weapon: 'laser', weaponLevel: 3 }) });
  j = await r.json();
  check('loadout-update', r.status, 200, `${j.weapon} lv${j.weaponLevel}`);

  r = await fetch(B + '/api/pilots/me/loadout');
  check('loadout-noauth-401', r.status, 401);

  r = await fetch(B + '/api/enemies');
  j = await r.json();
  check('enemies-list', r.status, 200, `${Array.isArray(j) ? j.length : '?'} enemies`);

  r = await fetch(B + '/api/enemies/enemy_scout_1');
  j = await r.json();
  check('enemy-get', r.status, 200, j.name);

  r = await fetch(B + '/api/waves');
  j = await r.json();
  check('waves-list', r.status, 200, `${Array.isArray(j) ? j.length : '?'} waves`);

  r = await fetch(B + '/api/scores');
  j = await r.json();
  check('scores-list', r.status, 200);

  r = await fetch(B + '/api/scores/top');
  j = await r.json();
  check('scores-top', r.status, 200, `${Array.isArray(j) ? j.length : '?'} top`);

  r = await fetch(B + '/api/reviews', { method: 'POST', headers: H, body: JSON.stringify({ rating: 5, comment: 'awesome' }) });
  j = await r.json();
  check('review-create', r.status, 201, `rating=${j.rating}`);

  r = await fetch(B + '/api/reviews');
  j = await r.json();
  check('reviews-list', r.status, 200);

  r = await fetch(B + '/api/stats');
  j = await r.json();
  check('stats', r.status, 200, `pilots=${j.totalPilots} runs=${j.totalRuns}`);

  r = await fetch(B + '/api/stats/leaderboard');
  j = await r.json();
  check('leaderboard', r.status, 200);

  r = await fetch(B + '/api/nonexistent', { headers: H });
  check('unknown-404', r.status, 404);

  console.log(results.join('\n'));
  console.log(`\nTOTAL: ${passed + failed} | PASS: ${passed} | FAIL: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
})().catch(e => { console.log('FATAL:', e.message); process.exit(1); });
