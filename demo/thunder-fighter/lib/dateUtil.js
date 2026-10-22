function nowISO() {
  return new Date().toISOString();
}

function durationSeconds(startISO, endISO) {
  const a = new Date(startISO).getTime();
  const b = new Date(endISO).getTime();
  return Math.max(0, Math.round((b - a) / 1000));
}

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

module.exports = { nowISO, durationSeconds, formatRelative };
