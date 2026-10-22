const store = require('../lib/store');
const { NotFoundError } = require('../lib/errors');

async function getStats() {
  const [pilots, runs, scores, enemies, waves, reviews] = await Promise.all([
    store.findMany('pilots'),
    store.findMany('runs'),
    store.findMany('scores'),
    store.findMany('enemies'),
    store.findMany('waves'),
    store.findMany('reviews')
  ]);
  const completed = runs.filter(r => r.status === 'completed');
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;
  const highestWave = pilots.reduce((max, p) => Math.max(max, p.highestWave || 0), 0);
  return {
    totalPilots: pilots.length,
    totalRuns: runs.length,
    completedRuns: completed.length,
    totalScores: scores.length,
    averageScore: avgScore,
    highestWave,
    enemyTypes: enemies.length,
    waveCount: waves.length,
    reviewCount: reviews.length,
    averageRating: reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0
  };
}

async function getLeaderboard() {
  const scores = await store.findMany('scores');
  return scores.sort((a, b) => b.score - a.score).slice(0, 10);
}

async function getHealth() {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: nowISO()
  };
}

function nowISO() {
  return new Date().toISOString();
}

module.exports = { getStats, getLeaderboard, getHealth };
