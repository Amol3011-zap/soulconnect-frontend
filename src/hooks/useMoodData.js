import { useState, useCallback } from 'react';
import { journeyAPI } from '../services/api';

const STORAGE_KEY = 'sc_journal_v2';

export const MOODS_5 = [
  { score: 1, emoji: '😭', label: 'Awful',      color: '#EF4444' },
  { score: 3, emoji: '😔', label: 'Not Good',   color: '#F97316' },
  { score: 5, emoji: '😐', label: 'Okay',       color: '#F59E0B' },
  { score: 7, emoji: '🙂', label: 'Good',       color: '#10B981' },
  { score: 9, emoji: '😁', label: 'Amazing',    color: '#6D4AFF' },
];

export const TRIGGERS = [
  { id: 'work',     icon: '💼', label: 'Work'        },
  { id: 'relation', icon: '💔', label: 'Relationship' },
  { id: 'family',   icon: '👨‍👩‍👧', label: 'Family'    },
  { id: 'health',   icon: '🏥', label: 'Health'      },
  { id: 'money',    icon: '💰', label: 'Money'       },
  { id: 'sleep',    icon: '😴', label: 'Sleep'       },
  { id: 'social',   icon: '👥', label: 'Social Life'  },
  { id: 'other',    icon: '❓', label: 'Other'       },
];

export const EMOTION_TAGS = [
  { id: 'happy',       emoji: '😊', label: 'Happy' },
  { id: 'grateful',    emoji: '🙏', label: 'Grateful' },
  { id: 'calm',        emoji: '😌', label: 'Calm' },
  { id: 'hopeful',     emoji: '🤞', label: 'Hopeful' },
  { id: 'lonely',      emoji: '😞', label: 'Lonely' },
  { id: 'anxious',     emoji: '😰', label: 'Anxious' },
  { id: 'overthinking',emoji: '🧠', label: 'Overthinking' },
  { id: 'burnt_out',   emoji: '🔥', label: 'Burnt Out' },
  { id: 'sad',         emoji: '😢', label: 'Sad' },
  { id: 'excited',     emoji: '🤩', label: 'Excited' },
];

export const WINS = [
  'Got out of bed', 'Completed work', 'Attended circle',
  'Exercised', 'Practiced meditation', 'Other win',
];

export const JOURNEY_STAGES = [
  { key: 'awareness',      emoji: '🌱', label: 'Awareness'      },
  { key: 'healing',        emoji: '💜', label: 'Healing'        },
  { key: 'growth',         emoji: '🌿', label: 'Growth'         },
  { key: 'transformation', emoji: '🦋', label: 'Transformation' },
  { key: 'awakening',      emoji: '☀️', label: 'Awakening'      },
];

export const GUIDED_PROMPTS = [
  'What challenged you today, and how did you handle it?',
  'What are you most grateful for in this moment?',
  'What made you smile today, even briefly?',
  'What emotion are you holding that needs to be released?',
  "What's one thing you're proud of yourself for this week?",
  'If you could give yourself one piece of advice right now, what would it be?',
  'What does your body need that you haven\'t given it today?',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function moodColor(score) {
  if (score >= 8) return '#6D4AFF';
  if (score >= 6) return '#10B981';
  if (score >= 4) return '#F59E0B';
  return '#EF4444';
}

function computeStreak(entries) {
  let s = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const k = d.toISOString().slice(0, 10);
    if (entries[k]?.mood) {
      s++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return s;
}

function computeLongestStreak(entries) {
  const keys = Object.keys(entries)
    .filter(k => entries[k]?.mood)
    .sort();
  let best = 0, cur = 0, prev = null;
  for (const k of keys) {
    const d = new Date(k);
    if (prev && (d - new Date(prev)) / 86400000 === 1) {
      cur++;
    } else {
      cur = 1;
    }
    if (cur > best) best = cur;
    prev = k;
  }
  return best;
}

function getInsights(entries) {
  const keys = Object.keys(entries)
    .filter(k => entries[k]?.mood)
    .sort()
    .slice(-7);

  if (!keys.length) {
    return [{
      emoji: '✨',
      text: 'Keep logging your mood to unlock personalized insights.',
      color: '#A78BFA'
    }];
  }

  const scores = keys.map(k => entries[k].mood);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const ins = [];

  if (avg >= 6) {
    ins.push({
      emoji: '😊',
      text: 'You feel happier on weekends!',
      color: '#10B981'
    });
  }

  const wc = keys.filter(k => (entries[k]?.triggers || []).includes('work')).length;
  if (wc >= 2) {
    ins.push({
      emoji: '💼',
      text: `Work stress appears in ${Math.round((wc / keys.length) * 100)}% of your entries.`,
      color: '#F97316'
    });
  }

  if (keys.some(k => (entries[k]?.wins || []).includes('Practiced meditation'))) {
    ins.push({
      emoji: '🧘',
      text: 'Your mood improves after meditation.',
      color: '#6D4AFF'
    });
  }

  if (scores[scores.length - 1] > scores[0]) {
    ins.push({
      emoji: '📈',
      text: 'Your mood has been trending upward this week!',
      color: '#6D4AFF'
    });
  }

  if (scores.some(s => s >= 8)) {
    ins.push({
      emoji: '✨',
      text: 'You\'ve had some amazing days recently. Keep it going!',
      color: '#F4C542'
    });
  }

  return ins.slice(0, 3).length
    ? ins.slice(0, 3)
    : [{
        emoji: '✨',
        text: 'Start logging daily to reveal your patterns.',
        color: '#A78BFA'
      }];
}

function wellnessScore(entries) {
  const keys = Object.keys(entries)
    .filter(k => entries[k]?.mood)
    .sort()
    .slice(-7);
  if (!keys.length) return 50;
  return Math.round((keys.reduce((s, k) => s + entries[k].mood, 0) / keys.length / 10) * 100);
}

function getMoodBreakdown(entries) {
  const breakdown = {
    1: 0, // Awful
    3: 0, // Not Good
    5: 0, // Okay
    7: 0, // Good
    9: 0, // Amazing
  };

  Object.values(entries).forEach(entry => {
    if (entry.mood) {
      const score = entry.mood;
      const closest = MOODS_5.reduce((a, b) =>
        Math.abs(b.score - score) < Math.abs(a.score - score) ? b : a
      );
      breakdown[closest.score]++;
    }
  });

  return breakdown;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMoodData() {
  const [store, setStore] = useState(loadStore);
  const today = getTodayKey();
  const todayData = store[today] || {};

  const [mood, setMood] = useState(todayData.mood || null);
  const [reflection, setReflection] = useState(todayData.reflection || '');
  const [triggers, setTriggers] = useState(todayData.triggers || []);
  const [emotions, setEmotions] = useState(todayData.emotions || []);
  const [gratitude, setGratitude] = useState(todayData.gratitude || ['', '', '']);
  const [wins, setWins] = useState(todayData.wins || []);
  const [energy, setEnergy] = useState(todayData.energy || 5);
  const [stress, setStress] = useState(todayData.stress || 5);
  const [sleepHours, setSleepHours] = useState(todayData.sleepHours || 0);
  const [waterIntake, setWaterIntake] = useState(todayData.waterIntake || 0);
  const [saved, setSaved] = useState(false);

  const persist = useCallback((patch) => {
    const next = { ...store, [today]: { ...todayData, ...patch } };
    setStore(next);
    saveStore(next);
  }, [store, today, todayData]);

  const handleMoodSelect = useCallback((score) => {
    setMood(score);
    persist({ mood: score });
  }, [persist]);

  const handleTrigger = useCallback((id) => {
    const next = triggers.includes(id)
      ? triggers.filter(t => t !== id)
      : [...triggers, id];
    setTriggers(next);
    persist({ triggers: next });
  }, [triggers, persist]);

  const handleEmotion = useCallback((id) => {
    const next = emotions.includes(id)
      ? emotions.filter(e => e !== id)
      : [...emotions, id];
    setEmotions(next);
    persist({ emotions: next });
  }, [emotions, persist]);

  const handleWin = useCallback((w) => {
    const next = wins.includes(w)
      ? wins.filter(x => x !== w)
      : [...wins, w];
    setWins(next);
    persist({ wins: next });
  }, [wins, persist]);

  const handleGratitude = useCallback((i, val) => {
    const next = [...gratitude];
    next[i] = val;
    setGratitude(next);
    persist({ gratitude: next });
  }, [gratitude, persist]);

  const handleSave = useCallback(async () => {
    persist({
      reflection,
      triggers,
      emotions,
      gratitude,
      wins,
      energy,
      stress,
      sleepHours,
      waterIntake,
      savedAt: Date.now(),
    });

    if (mood) {
      try {
        await journeyAPI.logActivity({
          activity_type: 'check_in',
          duration_minutes: 0,
          intensity: Math.round((mood / 10) * 10),
          notes: reflection || 'Daily mood check-in',
        });
      } catch (err) {
        console.error('Failed to log activity:', err);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [persist, mood, reflection, triggers, emotions, gratitude, wins, energy, stress, sleepHours, waterIntake]);

  // Computed values
  const streak = computeStreak(store);
  const longestStreak = computeLongestStreak(store);
  const wellnessScoreValue = wellnessScore(store);
  const insights = getInsights(store);
  const moodBreakdown = getMoodBreakdown(store);
  const stageIdx =
    wellnessScoreValue >= 90 ? 4 : wellnessScoreValue >= 75 ? 3 : wellnessScoreValue >= 55 ? 2 : wellnessScoreValue >= 35 ? 1 : 0;

  const todayMoodMeta = mood
    ? MOODS_5.reduce((a, b) =>
        Math.abs(b.score - mood) < Math.abs(a.score - mood) ? b : a
      )
    : null;

  // Get last 7 days entries
  const last7DaysKeys = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const last7Days = last7DaysKeys.map(key => ({
    date: key,
    ...store[key],
  }));

  // Get all entries sorted by date
  const allEntries = Object.entries(store)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    // State
    store,
    today,
    todayData,
    mood,
    reflection,
    triggers,
    emotions,
    gratitude,
    wins,
    energy,
    stress,
    sleepHours,
    waterIntake,
    saved,

    // Handlers
    handleMoodSelect,
    handleTrigger,
    handleEmotion,
    handleWin,
    handleGratitude,
    handleSave,
    setReflection,
    setEnergy,
    setStress,
    setSleepHours,
    setWaterIntake,

    // Computed
    streak,
    longestStreak,
    wellnessScore: wellnessScoreValue,
    insights,
    moodBreakdown,
    stageIdx,
    todayMoodMeta,
    last7Days,
    allEntries,
  };
}
