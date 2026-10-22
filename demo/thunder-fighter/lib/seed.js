const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const logger = require('./logger');

const seedData = {
  enemies: [
    { id: 'enemy_scout_1', name: 'Void Scout', hp: 30, speed: 3.5, pattern: 'straight', tier: 'scout', scoreValue: 100, color: '#00ffcc' },
    { id: 'enemy_scout_2', name: 'Blink Drone', hp: 25, speed: 4.2, pattern: 'zigzag', tier: 'scout', scoreValue: 120, color: '#00ffcc' },
    { id: 'enemy_fighter_1', name: 'Nebula Fighter', hp: 80, speed: 2.5, pattern: 'wave', tier: 'fighter', scoreValue: 250, color: '#ff00ff' },
    { id: 'enemy_fighter_2', name: 'Plasma Interceptor', hp: 70, speed: 3.0, pattern: 'chase', tier: 'fighter', scoreValue: 280, color: '#ff00ff' },
    { id: 'enemy_heavy_1', name: 'Iron Cruiser', hp: 200, speed: 1.2, pattern: 'straight', tier: 'heavy', scoreValue: 500, color: '#ff4444' },
    { id: 'enemy_heavy_2', name: 'Aegis Tank', hp: 250, speed: 1.0, pattern: 'zigzag', tier: 'heavy', scoreValue: 600, color: '#ff4444' },
    { id: 'enemy_elite_1', name: 'Star Destroyer', hp: 500, speed: 1.5, pattern: 'wave', tier: 'elite', scoreValue: 1200, color: '#ffaa00' },
    { id: 'enemy_elite_2', name: 'Nexus Hunter', hp: 450, speed: 1.8, pattern: 'chase', tier: 'elite', scoreValue: 1400, color: '#ffaa00' },
    { id: 'enemy_boss_1', name: 'Oblivion Titan', hp: 2000, speed: 0.8, pattern: 'boss', tier: 'boss', scoreValue: 5000, color: '#ff0000' },
    { id: 'enemy_boss_2', name: 'Abyssal Overlord', hp: 3000, speed: 0.6, pattern: 'boss', tier: 'boss', scoreValue: 8000, color: '#ff0000' }
  ],
  waves: [
    { id: 'wave_1', number: 1, formation: 'line', enemyMix: [{ enemyId: 'enemy_scout_1', count: 5 }], spawnIntervalMs: 2000, difficulty: 1 },
    { id: 'wave_2', number: 2, formation: 'vshape', enemyMix: [{ enemyId: 'enemy_scout_1', count: 4 }, { enemyId: 'enemy_scout_2', count: 3 }], spawnIntervalMs: 1800, difficulty: 1.2 },
    { id: 'wave_3', number: 3, formation: 'grid', enemyMix: [{ enemyId: 'enemy_fighter_1', count: 4 }, { enemyId: 'enemy_scout_2', count: 4 }], spawnIntervalMs: 1600, difficulty: 1.5 },
    { id: 'wave_4', number: 4, formation: 'diamond', enemyMix: [{ enemyId: 'enemy_fighter_1', count: 5 }, { enemyId: 'enemy_fighter_2', count: 3 }], spawnIntervalMs: 1500, difficulty: 1.8 },
    { id: 'wave_5', number: 5, formation: 'line', enemyMix: [{ enemyId: 'enemy_heavy_1', count: 3 }, { enemyId: 'enemy_fighter_1', count: 4 }], spawnIntervalMs: 1400, difficulty: 2.2 },
    { id: 'wave_6', number: 6, formation: 'vshape', enemyMix: [{ enemyId: 'enemy_heavy_1', count: 4 }, { enemyId: 'enemy_heavy_2', count: 2 }], spawnIntervalMs: 1300, difficulty: 2.6 },
    { id: 'wave_7', number: 7, formation: 'grid', enemyMix: [{ enemyId: 'enemy_elite_1', count: 3 }, { enemyId: 'enemy_heavy_2', count: 4 }], spawnIntervalMs: 1200, difficulty: 3.2 },
    { id: 'wave_8', number: 8, formation: 'diamond', enemyMix: [{ enemyId: 'enemy_elite_1', count: 4 }, { enemyId: 'enemy_elite_2', count: 2 }], spawnIntervalMs: 1100, difficulty: 3.8 },
    { id: 'wave_9', number: 9, formation: 'boss', enemyMix: [{ enemyId: 'enemy_boss_1', count: 1 }, { enemyId: 'enemy_elite_2', count: 6 }], spawnIntervalMs: 1000, difficulty: 4.5 },
    { id: 'wave_10', number: 10, formation: 'boss', enemyMix: [{ enemyId: 'enemy_boss_2', count: 1 }, { enemyId: 'enemy_boss_1', count: 1 }, { enemyId: 'enemy_elite_1', count: 6 }], spawnIntervalMs: 900, difficulty: 6.0 }
  ],
  pilots: [],
  runs: [],
  loadouts: [],
  scores: [],
  replays: [],
  reviews: [],
  notifications: []
};

async function seedAll() {
  await fs.mkdir(config.DATA_DIR, { recursive: true });
  for (const [name, data] of Object.entries(seedData)) {
    const filePath = path.join(config.DATA_DIR, `${name}.json`);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      logger.info(`Seeded ${name}.json`);
    }
  }
}

module.exports = { seedAll };
