// main.js — UI wiring: auth, menu, score submission
(function () {
  const $ = id => document.getElementById(id);
  const inCallsign = $('in-callsign');
  const inPassword = $('in-password');
  const btnRegister = $('btn-register');
  const btnLogin = $('btn-login');
  const btnStart = $('btn-start');
  const btnRetry = $('btn-retry');
  const btnMenu = $('btn-menu');
  const authMsg = $('auth-msg');
  const lbEl = $('menu-leaderboard');
  const highNote = $('highscore-note');

  function setMsg(text, ok) {
    authMsg.textContent = text;
    authMsg.className = 'msg' + (ok ? ' ok' : '');
  }

  function enableStart() {
    btnStart.disabled = false;
    btnStart.textContent = 'INSERT COIN';
  }

  async function doAuth(kind) {
    const cs = inCallsign.value.trim();
    const pw = inPassword.value;
    if (!cs || !pw) { setMsg('CALLSIGN + PASSWORD REQUIRED'); return; }
    setMsg('...');
    try {
      const res = await API[kind](cs, pw);
      const token = res.token || (res.data && res.data.token);
      if (!token) throw new Error('no token in response');
      API.setAuth(token, cs);
      Game.setCallsign(cs);
      setMsg('WELCOME, ' + cs.toUpperCase(), true);
      enableStart();
      refreshLeaderboard();
    } catch (err) {
      setMsg(err.message.toUpperCase());
    }
  }

  btnRegister.addEventListener('click', () => doAuth('register'));
  btnLogin.addEventListener('click', () => doAuth('login'));
  inPassword.addEventListener('keydown', ev => { if (ev.key === 'Enter') doAuth('login'); });

  // auto-login if we still have a token
  (async function autoLogin() {
    if (!API.token) { refreshLeaderboard(); return; }
    try {
      await API.me();
      Game.setCallsign(API.callsign);
      setMsg('WELCOME BACK, ' + API.callsign.toUpperCase(), true);
      enableStart();
    } catch (e) {
      API.clearAuth();
    }
    refreshLeaderboard();
  })();

  async function refreshLeaderboard() {
    try {
      const data = await API.topScores(5);
      const rows = (data.scores || data.top || data || []).slice ? (data.scores || data.top || data) : [];
      const list = Array.isArray(rows) ? rows : [];
      if (!list.length) { lbEl.innerHTML = '<h3>LEADERBOARD</h3><p style="text-align:center">no scores yet</p>'; return; }
      let html = '<h3>LEADERBOARD</h3>';
      list.forEach((s, i) => {
        const name = (s.pilotId && s.pilotId.callsign) || s.callsign || s.pilotId || '???';
        html += '<div class="lb-row"><span class="rank">#' + (i + 1) + '</span><span class="name">' +
          escapeHtml(String(name)) + '</span><span class="pts">' + (s.score || 0) + '</span></div>';
      });
      lbEl.innerHTML = html;
    } catch (e) {
      lbEl.innerHTML = '';
    }
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- game flow ----
  btnStart.addEventListener('click', () => { if (!btnStart.disabled) Game.start(); });
  btnRetry.addEventListener('click', () => Game.start());
  btnMenu.addEventListener('click', () => {
    Game.showOverlay('menu');
    refreshLeaderboard();
  });

  Game.onGameOver(async (score, wave) => {
    if (!API.token || score <= 0) return;
    try {
      await API.submitScore(score, wave);
      highNote.textContent = 'SCORE SUBMITTED';
      refreshLeaderboard();
    } catch (e) {
      highNote.textContent = 'SUBMIT FAILED: ' + e.message;
    }
  });
})();
