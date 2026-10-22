// entities.js — game object factories (global Entities)
const Entities = (() => {

  function makePlayer(x, y) {
    return {
      type: 'player', x, y, w: 30, h: 34,
      speed: 280,
      cooldown: 0, fireDelay: 140,
      invuln: 2000, // ms of invulnerability after spawn/hit
      color: '#0ff'
    };
  }

  function makeBullet(x, y, vy, opts) {
    opts = opts || {};
    return {
      type: 'bullet', x, y, w: opts.w || 4, h: opts.h || 12,
      vy: vy, vx: opts.vx || 0,
      damage: opts.damage || 1,
      color: opts.color || '#ff0',
      enemy: !!opts.enemy
    };
  }

  // kind: grunt|weaver|tank|dart
  function makeEnemy(kind, x, y, wave) {
    const base = {
      grunt:  { w: 28, h: 24, hp: 1, score: 100, speed: 90,  color: '#f0f', fire: 2200, dmg: 1 },
      weaver: { w: 26, h: 26, hp: 2, score: 200, speed: 70,  color: '#0f8', fire: 1800, dmg: 1 },
      tank:   { w: 44, h: 40, hp: 5, score: 500, speed: 45,  color: '#f80', fire: 2600, dmg: 2 },
      dart:   { w: 20, h: 30, hp: 1, score: 150, speed: 220, color: '#8ff', fire: 0,    dmg: 1 }
    }[kind] || base.grunt;

    const hpScale = 1 + Math.floor(wave / 3) * 0.5;
    return {
      type: 'enemy', kind, x, y,
      w: base.w, h: base.h,
      hp: Math.ceil(base.hp * hpScale),
      maxHp: Math.ceil(base.hp * hpScale),
      score: base.score,
      speed: base.speed + wave * 4,
      color: base.color,
      fireDelay: base.fire, cooldown: 400 + Math.random() * 1200,
      dmg: base.dmg,
      t: Math.random() * Math.PI * 2, // phase for weaver sway
      vx: 0
    };
  }

  function makeParticle(x, y, color) {
    return {
      type: 'particle', x, y,
      vx: (Math.random() - 0.5) * 220,
      vy: (Math.random() - 0.5) * 220 - 40,
      life: 500 + Math.random() * 400, maxLife: 900,
      size: 2 + Math.random() * 3, color
    };
  }

  function makeExplosion(x, y, color, n) {
    const parts = [];
    for (let i = 0; i < (n || 12); i++) parts.push(makeParticle(x, y, color));
    return parts;
  }

  // starfield background
  function makeStars(w, h) {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        z: 0.2 + Math.random() * 0.8, // depth → speed & brightness
        tw: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  return { makePlayer, makeBullet, makeEnemy, makeParticle, makeExplosion, makeStars };
})();
