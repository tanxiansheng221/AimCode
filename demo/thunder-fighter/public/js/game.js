// game.js — core game engine (global Game)
const Game = (() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const hud = {
    callsign: document.getElementById('hud-callsign'),
    score: document.getElementById('hud-score'),
    lives: document.getElementById('hud-lives'),
    wave: document.getElementById('hud-wave'),
    fps: document.getElementById('hud-fps')
  };

  const overlays = {
    menu: document.getElementById('overlay-menu'),
    gameover: document.getElementById('overlay-gameover'),
    pause: document.getElementById('overlay-pause')
  };

  // ---- state ----
  const S = {
    mode: 'menu', // menu | playing | paused | gameover
    player: null, bullets: [], enemies: [], particles: [], stars: [],
    keys: {},
    score: 0, lives: 3, wave: 0,
    waveTimer: 0, spawnQueue: [],
    lastTime: 0, fpsAcc: 0, fpsN: 0,
    shake: 0
  };

  const onGameOver = []; // callbacks(score, wave)

  function reset() {
    S.player = Entities.makePlayer(W / 2, H - 60);
    S.bullets = []; S.enemies = []; S.particles = [];
    S.score = 0; S.lives = 3; S.wave = 0;
    S.waveTimer = 0; S.spawnQueue = []; S.shake = 0;
    if (!S.stars.length) S.stars = Entities.makeStars(W, H);
    updateHud();
  }

  function start() {
    reset();
    S.mode = 'playing';
    showOverlay(null);
    nextWave();
  }

  function showOverlay(name) {
    Object.keys(overlays).forEach(k => overlays[k].classList.toggle('visible', k === name));
  }

  function togglePause() {
    if (S.mode === 'playing') { S.mode = 'paused'; showOverlay('pause'); }
    else if (S.mode === 'paused') { S.mode = 'playing'; showOverlay(null); }
  }

  function gameOver() {
    S.mode = 'gameover';
    showOverlay('gameover');
    document.getElementById('final-score').textContent = S.score;
    onGameOver.forEach(fn => { try { fn(S.score, S.wave); } catch (e) { /* non-fatal */ } });
  }

  function updateHud() {
    hud.score.textContent = 'SCORE ' + S.score;
    hud.lives.textContent = 'LIVES ' + '♥'.repeat(Math.max(0, S.lives));
    hud.wave.textContent = 'WAVE ' + Math.max(1, S.wave);
  }

  // ---- waves ----
  function nextWave() {
    S.wave++;
    S.spawnQueue = [];
    const count = 4 + S.wave * 2;
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const kind = (S.wave >= 3 && r < 0.15) ? 'tank'
        : (S.wave >= 2 && r < 0.35) ? 'weaver'
        : (S.wave >= 2 && r < 0.5) ? 'dart' : 'grunt';
      S.spawnQueue.push({ kind, delay: i * 700 + Math.random() * 400 });
    }
    S.waveTimer = 0;
    updateHud();
  }

  // ---- loop ----
  function loop(ts) {
    const dt = Math.min(50, ts - (S.lastTime || ts));
    S.lastTime = ts;
    S.fpsAcc += dt; S.fpsN++;
    if (S.fpsAcc >= 500) {
      hud.fps.textContent = Math.round(1000 / (S.fpsAcc / S.fpsN)) + ' FPS';
      S.fpsAcc = 0; S.fpsN = 0;
    }

    if (S.mode === 'playing') update(dt);
    render(dt);

    requestAnimationFrame(loop);
  }

  function update(dt) {
    const dts = dt / 1000;
    const p = S.player;

    // player move
    let dx = 0, dy = 0;
    if (S.keys.ArrowLeft || S.keys.KeyA) dx -= 1;
    if (S.keys.ArrowRight || S.keys.KeyD) dx += 1;
    if (S.keys.ArrowUp || S.keys.KeyW) dy -= 1;
    if (S.keys.ArrowDown || S.keys.KeyS) dy += 1;
    p.x = clamp(p.x + dx * p.speed * dts, p.w / 2, W - p.w / 2);
    p.y = clamp(p.y + dy * p.speed * dts, p.h / 2 + 20, H - p.h / 2);
    if (p.invuln > 0) p.invuln -= dt;

    // shoot
    p.cooldown -= dt;
    if (S.keys.Space && p.cooldown <= 0) {
      p.cooldown = p.fireDelay;
      S.bullets.push(Entities.makeBullet(p.x, p.y - p.h / 2, -520));
      S.bullets.push(Entities.makeBullet(p.x - 9, p.y - p.h / 2 + 6, -520, { damage: 1 }));
      S.bullets.push(Entities.makeBullet(p.x + 9, p.y - p.h / 2 + 6, -520, { damage: 1 }));
    }

    // spawn wave enemies
    S.waveTimer += dt;
    S.spawnQueue = S.spawnQueue.filter(sp => {
      if (S.waveTimer >= sp.delay) {
        S.enemies.push(Entities.makeEnemy(sp.kind, 30 + Math.random() * (W - 60), -30, S.wave));
        return false;
      }
      return true;
    });
    if (!S.spawnQueue.length && !S.enemies.length) nextWave();

    // bullets
    S.bullets = S.bullets.filter(b => {
      b.y += b.vy * dts;
      b.x += b.vx * dts;
      return b.y > -20 && b.y < H + 20 && b.x > -20 && b.x < W + 20;
    });

    // enemies
    S.enemies.forEach(e => {
      e.t += dts * 3;
      if (e.kind === 'weaver') e.x += Math.sin(e.t) * 60 * dts;
      if (e.kind === 'dart') e.vy = e.speed;
      e.y += e.speed * dts;
      if (e.kind === 'grunt') e.x += Math.sin(e.t * 0.6) * 30 * dts;

      if (e.fireDelay > 0) {
        e.cooldown -= dt;
        if (e.cooldown <= 0 && e.y > 0 && e.y < H - 150) {
          e.cooldown = e.fireDelay;
          const ang = Math.atan2(p.y - e.y, p.x - e.x);
          S.bullets.push(Entities.makeBullet(e.x, e.y + e.h / 2, Math.sin(ang) * 200, {
            vx: Math.cos(ang) * 200, enemy: true, color: e.color, w: 5, h: 5
          }));
        }
      }
    });

    // bullet vs enemy
    S.bullets = S.bullets.filter(b => {
      if (b.enemy) return true;
      for (let i = 0; i < S.enemies.length; i++) {
        const e = S.enemies[i];
        if (hit(b, e)) {
          e.hp -= b.damage;
          if (e.hp <= 0) {
            S.score += e.score;
            S.particles.push(...Entities.makeExplosion(e.x, e.y, e.color, 14));
            S.shake = Math.min(12, S.shake + 4);
            S.enemies.splice(i, 1);
            updateHud();
          }
          return false;
        }
      }
      return true;
    });

    // enemy bullets vs player, enemy body vs player
    if (p.invuln <= 0) {
      let hitP = false;
      S.bullets = S.bullets.filter(b => {
        if (b.enemy && hit(b, p)) { hitP = true; return false; }
        return true;
      });
      if (!hitP) {
        for (let i = 0; i < S.enemies.length; i++) {
          if (hit(S.enemies[i], p)) { S.enemies.splice(i, 1); hitP = true; break; }
        }
      }
      if (hitP) {
        S.lives--;
        S.shake = 16;
        S.particles.push(...Entities.makeExplosion(p.x, p.y, '#0ff', 20));
        p.invuln = 2000;
        updateHud();
        if (S.lives <= 0) { gameOver(); return; }
      }
    }

    // enemies off screen bottom just despawn
    S.enemies = S.enemies.filter(e => e.y < H + 60);

    // particles
    S.particles = S.particles.filter(pt => {
      pt.life -= dt;
      pt.x += pt.vx * dts;
      pt.y += pt.vy * dts;
      return pt.life > 0;
    });

    if (S.shake > 0) S.shake -= dt * 0.03;
  }

  function hit(a, b) {
    return Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // ---- render ----
  function render(dt) {
    ctx.save();
    if (S.shake > 0.5) ctx.translate((Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake);

    // bg
    ctx.fillStyle = '#020208';
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // stars
    const dts = dt / 1000;
    S.stars.forEach(st => {
      if (S.mode === 'playing') st.y += 40 * st.z * dts * 8;
      if (st.y > H) { st.y = 0; st.x = Math.random() * W; }
      st.tw += 0.05;
      const a = 0.3 + Math.abs(Math.sin(st.tw)) * 0.5 * st.z;
      ctx.fillStyle = 'rgba(120,140,255,' + a.toFixed(2) + ')';
      ctx.fillRect(st.x, st.y, st.z * 2, st.z * 2);
    });

    // scanlines
    ctx.fillStyle = 'rgba(0,0,20,0.25)';
    for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);

    if (S.mode !== 'menu') {
      // particles
      S.particles.forEach(pt => {
        const a = pt.life / pt.maxLife;
        ctx.globalAlpha = a;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      });
      ctx.globalAlpha = 1;

      // bullets
      S.bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        if (b.enemy) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.w, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
        }
      });
      ctx.shadowBlur = 0;

      // enemies
      S.enemies.forEach(e => drawEnemy(e));

      // player
      if (S.player && S.mode !== 'gameover') drawPlayer(S.player);
    }

    ctx.restore();
  }

  function drawPlayer(p) {
    const blink = p.invuln > 0 && Math.floor(p.invuln / 120) % 2 === 0;
    if (blink) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.shadowColor = p.color; ctx.shadowBlur = 14;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.h / 2);
    ctx.lineTo(p.w / 2, p.h / 2);
    ctx.lineTo(0, p.h / 2 - 8);
    ctx.lineTo(-p.w / 2, p.h / 2);
    ctx.closePath();
    ctx.fill();
    // engine flame
    ctx.fillStyle = '#ff8';
    ctx.shadowColor = '#fa0';
    ctx.fillRect(-3, p.h / 2 - 6, 6, 8 + Math.random() * 6);
    ctx.restore();
  }

  function drawEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.shadowColor = e.color; ctx.shadowBlur = 10;
    ctx.strokeStyle = e.color; ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2;
    if (e.kind === 'tank') {
      ctx.beginPath();
      ctx.rect(-e.w / 2, -e.h / 2, e.w, e.h);
      ctx.fill(); ctx.stroke();
      // hp bar
      ctx.shadowBlur = 0;
      ctx.fillStyle = e.color;
      ctx.fillRect(-e.w / 2, -e.h / 2 - 6, e.w * (e.hp / e.maxHp), 3);
    } else if (e.kind === 'dart') {
      ctx.beginPath();
      ctx.moveTo(0, e.h / 2);
      ctx.lineTo(e.w / 2, -e.h / 2);
      ctx.lineTo(-e.w / 2, -e.h / 2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, e.h / 2);
      ctx.lineTo(e.w / 2, 0);
      ctx.lineTo(0, -e.h / 2);
      ctx.lineTo(-e.w / 2, 0);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- input ----
  window.addEventListener('keydown', ev => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(ev.code)) ev.preventDefault();
    S.keys[ev.code] = true;
    if (ev.code === 'KeyP') togglePause();
  });
  window.addEventListener('keyup', ev => { S.keys[ev.code] = false; });

  requestAnimationFrame(loop);

  return {
    get mode() { return S.mode; },
    start,
    showOverlay,
    setCallsign(cs) { hud.callsign.textContent = cs || 'GUEST'; },
    onGameOver(fn) { onGameOver.push(fn); }
  };
})();
