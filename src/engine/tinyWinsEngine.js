// ─────────────────────────────────────────────────────────────────────────────
// SoulConnect · Tiny Wins Personalization Engine
// Selects 3 daily challenges based on Soul Climate, time of day,
// work mode, and completion history. Never repeats. Never pressures.
// ─────────────────────────────────────────────────────────────────────────────

import { ALL_CHALLENGES } from '../data/tinyWinsChallenges';

// ── Time helpers ──────────────────────────────────────────────────────────────

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

export function getDayType() {
  const day = new Date().getDay(); // 0 = Sun, 6 = Sat
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/**
 * Score a challenge for the current context.
 * Higher score = better fit.
 */
function scoreChallenge(challenge, { weatherId, workMode, timeOfDay, dayType }) {
  let score = 0;

  // Weather match (highest weight — soul climate is the core signal)
  if (challenge.weather.includes(weatherId)) score += 12;

  // Time of day match
  if (challenge.timeOfDay.includes(timeOfDay)) score += 8;

  // Work mode match
  if (challenge.workModes.includes(workMode)) score += 6;

  // Weekend bonus
  if (dayType === 'weekend' && challenge.workModes.includes('weekend')) score += 4;

  // Prefer indoor challenges for storm/fog/heavy-rain
  if (['storm', 'fog', 'heavy-rain'].includes(weatherId) && challenge.indoor) score += 2;

  // Prefer outdoor challenges for clear/blooming/hope
  if (['clear-sky', 'blooming', 'hope'].includes(weatherId) && challenge.outdoor) score += 2;

  // Easy difficulty gets slight boost for low-mood weather
  if (['storm', 'fog'].includes(weatherId) && challenge.difficulty === 'easy') score += 3;

  // Add small random noise to ensure variety across days with same context
  score += Math.random() * 4;

  return score;
}

// ── Category diversity ────────────────────────────────────────────────────────

/**
 * Given a scored list, pick 3 challenges that cover at least 3 different
 * top-level category groups (mental, physical, social).
 */
const MENTAL_CATS   = new Set(['Mind', 'Meditation', 'Focus', 'Learning', 'Breathing', 'Creativity', 'Sleep', 'Digital Wellbeing']);
const PHYSICAL_CATS = new Set(['Movement', 'Body', 'Nature', 'Self Care']);
const SOCIAL_CATS   = new Set(['Connection', 'Relationships', 'Kindness', 'Gratitude', 'Confidence', 'Work']);

function getCatGroup(category) {
  if (MENTAL_CATS.has(category))   return 'mental';
  if (PHYSICAL_CATS.has(category)) return 'physical';
  if (SOCIAL_CATS.has(category))   return 'social';
  return 'other';
}

function pickDiverseThree(scored) {
  const selected = [];
  const usedCategories = new Set();
  const usedGroups = new Set();

  // Pass 1: try to get one from each group
  for (const group of ['mental', 'physical', 'social']) {
    for (const c of scored) {
      if (selected.length >= 3) break;
      if (usedCategories.has(c.category)) continue;
      if (getCatGroup(c.category) !== group) continue;
      selected.push(c);
      usedCategories.add(c.category);
      usedGroups.add(group);
      break;
    }
  }

  // Pass 2: fill remaining slots, avoiding duplicate categories
  if (selected.length < 3) {
    for (const c of scored) {
      if (selected.length >= 3) break;
      if (usedCategories.has(c.category)) continue;
      if (selected.find(s => s.id === c.id)) continue;
      selected.push(c);
      usedCategories.add(c.category);
    }
  }

  // Pass 3: last resort — allow duplicate categories but never duplicate IDs
  if (selected.length < 3) {
    for (const c of scored) {
      if (selected.length >= 3) break;
      if (selected.find(s => s.id === c.id)) continue;
      selected.push(c);
    }
  }

  return selected.slice(0, 3);
}

// ── Main selector ─────────────────────────────────────────────────────────────

/**
 * Select today's 3 Tiny Wins.
 *
 * @param {object} params
 * @param {string}   params.weatherId            - Soul Climate ID
 * @param {string}   params.workMode             - User's work mode
 * @param {string[]} params.recentlyCompletedIds - Last ~21 completed challenge IDs (7 days)
 * @param {string[]} params.completedTodayIds    - IDs already completed today
 * @returns {Array} 3 challenge objects
 */
export function selectDailyWins({
  weatherId = 'clear-sky',
  workMode = 'office',
  recentlyCompletedIds = [],
  completedTodayIds = [],
}) {
  const timeOfDay = getTimeOfDay();
  const dayType   = getDayType();

  const recentSet = new Set(recentlyCompletedIds);
  const todaySet  = new Set(completedTodayIds);

  // Filter: active, not done today, not done in last 7 days
  const candidates = ALL_CHALLENGES.filter(c =>
    c.active &&
    !todaySet.has(c.id) &&
    !recentSet.has(c.id)
  );

  // If we're too restricted (unlikely with 160 challenges) fall back
  const pool = candidates.length >= 10 ? candidates : ALL_CHALLENGES.filter(c => !todaySet.has(c.id));

  // Score and sort
  const scored = pool
    .map(c => ({ ...c, _score: scoreChallenge(c, { weatherId, workMode, timeOfDay, dayType }) }))
    .sort((a, b) => b._score - a._score);

  return pickDiverseThree(scored);
}

// ── AI Reflections ────────────────────────────────────────────────────────────

const AI_REFLECTIONS = [
  'You completed today\'s Tiny Win. Small actions create lasting change.',
  'You chose yourself today.',
  'You kept your promise to yourself.',
  'You made progress.',
  'Every small win adds up to something beautiful.',
  'You showed up for your wellbeing today.',
  'This moment will ripple forward.',
  'You are worth these small acts of care.',
  'Healing doesn\'t have to be dramatic. This counts.',
  'One breath, one step, one win at a time.',
  'Progress is still progress, no matter how small.',
  'You did something kind for yourself today.',
  'The smallest actions often carry the deepest meaning.',
  'You were gentle with yourself. That matters.',
  'Today you moved toward the person you want to be.',
];

let lastReflectionIdx = -1;

export function getRandomReflection() {
  let idx;
  do { idx = Math.floor(Math.random() * AI_REFLECTIONS.length); }
  while (idx === lastReflectionIdx && AI_REFLECTIONS.length > 1);
  lastReflectionIdx = idx;
  return AI_REFLECTIONS[idx];
}

// ── Weekly AI Summary ─────────────────────────────────────────────────────────

export function generateWeeklySummary({ total, mostCompleted, leastCompleted }) {
  if (total === 0) {
    return 'This week, life got in the way. That\'s okay. Every day is a fresh start.';
  }
  if (total >= 15) {
    return `You completed ${total} Tiny Wins this week. You're building something beautiful, one small act at a time.`;
  }
  const least = leastCompleted
    ? ` Try adding one ${leastCompleted} Tiny Win next week.`
    : '';
  return `You completed ${total} Tiny Wins this week. Your most consistent area was ${mostCompleted || 'across the board'}.${least}`;
}
