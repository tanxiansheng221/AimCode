const listeners = [];

function on(event, handler) {
  listeners.push({ event, handler });
}

function emit(event, payload) {
  listeners.filter(l => l.event === event).forEach(l => {
    try { l.handler(payload); } catch (e) { /* ignore */ }
  });
}

module.exports = { on, emit };
