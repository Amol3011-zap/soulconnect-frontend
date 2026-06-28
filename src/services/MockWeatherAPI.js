// MockWeatherAPI.js — localStorage-backed mock weather service
// Storage key: sc_weather_v1
// Entry shape: { id, date: 'YYYY-MM-DD', time: 'HH:MM', weather: 'storm', userId: 1 }

const STORAGE_KEY = 'sc_weather_v1';

const WEATHER_IDS = ['clear-sky', 'hope', 'blooming', 'fog', 'heavy-rain', 'storm'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function formatTime(d) {
  return d.toTimeString().slice(0, 5);
}

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Returns today's entry for the user, or null
export function getToday(userId) {
  const all = loadAll();
  const t = today();
  return all.find(e => e.userId === userId && e.date === t) || null;
}

// Saves today's entry (overwrites if exists), returns the entry
export function saveEntry(weatherId, userId) {
  const all = loadAll();
  const t = today();
  const now = new Date();
  const entry = {
    id: uid(),
    date: t,
    time: formatTime(now),
    weather: weatherId,
    userId,
  };
  // Remove any existing entry for today from this user
  const filtered = all.filter(e => !(e.userId === userId && e.date === t));
  filtered.push(entry);
  saveAll(filtered);
  return entry;
}

// Returns last N days of entries for a user
export function getHistory(userId, days = 30) {
  const all = loadAll();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = formatDate(cutoff);
  return all
    .filter(e => e.userId === userId && e.date >= cutoffStr)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Returns last 7 days as [{ date, day, weather }], weather null if no entry
export function getWeekly(userId) {
  const all = loadAll();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const entry = all.find(e => e.userId === userId && e.date === dateStr);
    days.push({ date: dateStr, day: dayName, weather: entry ? entry.weather : null });
  }
  return days;
}

// Returns current consecutive streak count
export function getStreak(userId) {
  const all = loadAll()
    .filter(e => e.userId === userId)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  if (!all.length) return 0;

  let streak = 0;
  const t = today();
  let checkDate = new Date(t);

  // If no entry today, start checking from yesterday
  const hasToday = all.some(e => e.date === t);
  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const ds = formatDate(checkDate);
    if (all.some(e => e.date === ds)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// Returns calendar array for a month: [{ date, weather|null }]
export function getMonthCalendar(userId, year, month) {
  const all = loadAll().filter(e => e.userId === userId);
  const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-indexed
  const result = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = all.find(e => e.date === dateStr);
    result.push({ date: dateStr, weather: entry ? entry.weather : null });
  }
  return result;
}

// Generates 30 days of realistic mock history if localStorage is empty for this user
export function generateMockHistory(userId) {
  const existing = loadAll().filter(e => e.userId === userId);
  if (existing.length > 0) return; // Already has data

  const patterns = [
    // Week 1 — stormy start
    'storm', 'storm', 'heavy-rain', 'fog', 'fog', 'hope', 'clear-sky',
    // Week 2 — recovery
    'hope', 'blooming', 'clear-sky', 'clear-sky', 'fog', 'heavy-rain', 'hope',
    // Week 3 — mixed
    'blooming', 'clear-sky', 'hope', 'storm', 'heavy-rain', 'fog', 'hope',
    // Week 4 — mostly positive
    'clear-sky', 'blooming', 'hope', 'clear-sky', 'blooming', null, null,
  ];

  const all = loadAll();
  const now = new Date();

  for (let i = 29; i >= 2; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const weather = patterns[29 - i];
    if (!weather) continue;

    // Skip if entry already exists
    if (all.some(e => e.userId === userId && e.date === dateStr)) continue;

    const hour = 7 + Math.floor(Math.random() * 4);
    const min = Math.floor(Math.random() * 60);
    all.push({
      id: uid(),
      date: dateStr,
      time: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      weather,
      userId,
    });
  }

  saveAll(all);
}
