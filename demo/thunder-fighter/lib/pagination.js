function paginate(items, page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const start = (p - 1) * l;
  const data = items.slice(start, start + l);
  return {
    data,
    page: p,
    limit: l,
    total: items.length,
    totalPages: Math.ceil(items.length / l)
  };
}

module.exports = { paginate };
