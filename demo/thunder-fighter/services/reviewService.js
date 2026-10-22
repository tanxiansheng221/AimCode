const store = require('../lib/store');
const { generateId } = require('../lib/idGen');
const { nowISO } = require('../lib/dateUtil');
const { NotFoundError, ForbiddenError } = require('../lib/errors');
const V = require('../validators/reviewValidator');
const { paginate } = require('../lib/pagination');

async function create(pilotId, data) {
  V.validateCreate(data);
  const pilot = await store.findOne('pilots', p => p.id === pilotId);
  if (!pilot) throw new NotFoundError('Pilot not found');
  const review = {
    id: generateId('review'),
    pilotId,
    callsign: pilot.callsign,
    rating: data.rating,
    comment: data.comment || '',
    createdAt: nowISO()
  };
  await store.insert('reviews', review);
  return review;
}

async function list(query) {
  const all = await store.findMany('reviews');
  const sorted = all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  return paginate(sorted, page, limit);
}

async function getByPilot(pilotId) {
  return store.findMany('reviews', r => r.pilotId === pilotId);
}

async function remove(pilotId, reviewId) {
  const review = await store.findOne('reviews', r => r.id === reviewId);
  if (!review) throw new NotFoundError('Review not found');
  if (review.pilotId !== pilotId) throw new ForbiddenError('Cannot delete another pilot\'s review');
  await store.removeOne('reviews', r => r.id === reviewId);
  return { deleted: true };
}

module.exports = { create, list, getByPilot, remove };
