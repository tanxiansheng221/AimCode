let counter = 0;

function generateId(prefix = 'id') {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 6);
  counter = (counter + 1) % 10000;
  return `${prefix}_${ts}_${rnd}_${counter}`;
}

module.exports = { generateId };
