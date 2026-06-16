import React, { useState, useEffect } from 'react';

const MOODS = [
  { score: 1,  emoji: '😭', label: 'Terrible',  color: '#ef4444' },
  { score: 2,  emoji: '😢', label: 'Very Bad',   color: '#f97316' },
  { score: 3,  emoji: '😞', label: 'Bad',        color: '#f59e0b' },
  { score: 4,  emoji: '😟', label: 'Low',        color: '#eab308' },
  { score: 5,  emoji: '😐', label: 'Okay',       color: '#84cc16' },
  { score: 6,  emoji: '🙂', label: 'Fine',       color: '#22c55e' },
  { score: 7,  emoji: '😊', label: 'Good',       color: '#10b981' },
  { score: 8,  emoji: '😄', label: 'Great',      color: '#06b6d4' },
  { score: 9,  emoji: '😁', label: 'Amazing',    color: '#6366f1' },
  { score: 10, emoji: '🤩', label: 'Incredible', color: '#a855f7' },
];

const ENERGY = [
  { value: 'low',  label: 'Drained', icon: '🪫', color: '#ef4444' },
  { value: 'okay', label: 'Neutral',  icon: '⚡', color: '#f59e0b' },
  { value: 'high', label: 'Energised', icon: '🔋', color: '#10b981' },
];

const PROMPTS = [
  "What's one thing you're grateful for today?",
  "What's been weighing on your mind?",
  "What made you smile recently?",
  "How did your body feel today?",
  "What's one kind thing you did for yourself?",
  "What are you looking forward to tomorrow?",
];

const STORAGE_KEY = 'soulconnect_mood_log';

function moodColor(score) {
  if (score >= 8) return '#a855f7';
  if (score >= 6) return '#10b981';
  if (score >= 4) return '#f59e0b';
  return '#ef4444';
}

function getAIInsight(entries) {
  if (!entries.length) return null;
  const recent = entries.slice(-7);
  const avg = recent.reduce((s, e) => s + e.mood, 0) / recent.length;
  const trend = recent.length >= 3
    ? recent[recent.length - 1].mood - recent[Math.max(0, recent.length - 4)].mood
    : 0;

  if (avg >= 8.5) return { text: "You've been radiating incredible energy this week. Keep nurturing what's working for you. ✨", icon: '🌟', color: '#a855f7' };
  if (avg >= 7 && trend > 1) return { text: "Your mood has been climbing — that's beautiful. You're doing the inner work and it shows. 📈", icon: '📈', color: '#10b981' };
  if (avg >= 7) return { text: "You're consistently showing up for yourself. That consistency is your superpower. 💙", icon: '💙', color: '#3b82f6' };
  if (avg >= 5.5 && trend > 0) return { text: "Things are slowly getting better. One good moment at a time — keep going. 🌱", icon: '🌱', color: '#22c55e' };
  if (avg >= 5) return { text: "You're navigating through the middle ground with resilience. Small steps forward still count. 💜", icon: '💜', color: '#7c3aed' };
  if (trend < -2) return { text: "It's been a heavier week. Please reach out to your match or a healer — carrying this alone is too much. 💙", icon: '💙', color: '#2563eb' };
  if (avg >= 3) return { text: "Some days are just hard. You showed up and checked in — that takes courage. You are not alone. 🤍", icon: '🤍', color: '#64748b' };
  return { text: "I see you're really struggling. Please talk to someone today — your match, a healer, or call iCall: 9152987821. You matter deeply. 💙", icon: '🆘', color: '#ef4444' };
}

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
function MoodChart({ entries }) {
  const days = 7;
  const today = new Date();
  const datePoints = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  const dayLabels = datePoints.map(d =>
    new Date(d).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3)
  );
  const values = datePoints.map(date => {
    const e = entries.find(en => en.date === date);
    return e ? e.mood : null;
  });

  const W = 320, H = 130, padX = 16, padY = 14;
  const xStep = (W - 2 * padX) / (days - 1);
  const yRange = H - 2 * padY;

  const coords = values.map((v, i) =>
    v !== null
      ? { x: padX + i * xStep, y: padY + yRange - ((v - 1) / 9) * yRange, v }
      : null
  );
  const valid = coords.filter(Boolean);

  const smooth = (pts) => {
    if (pts.length < 2) return pts.map(p => `${p.x},${p.y}`).join(' ');
    return pts.map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = pts[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
    }).join(' ');
  };

  const linePath = smooth(valid);
  const areaPath = valid.length >= 2
    ? `${linePath} L${valid[valid.length - 1].x},${H - padY} L${valid[0].x},${H - padY} Z`
    : '';

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 16}`} className="overflow-visible" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="chartLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="chartArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {[2, 4, 6, 8, 10].map(v => {
        const y = padY + yRange - ((v - 1) / 9) * yRange;
        return (
          <g key={v}>
            <line x1={padX} y1={y} x2={W - padX} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={W - padX + 4} y={y + 3} fontSize="8" fill="rgba(255,255,255,0.2)">{v}</text>
          </g>
        );
      })}

      {/* Area fill */}
      {areaPath && <path d={areaPath} fill="url(#chartArea)" />}

      {/* Line */}
      {valid.length >= 2 && (
        <path d={linePath} fill="none" stroke="url(#chartLine)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Dots */}
      {coords.map((p, i) => p ? (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill={moodColor(p.v)} opacity="0.3" />
          <circle cx={p.x} cy={p.y} r="4" fill={moodColor(p.v)} />
          <circle cx={p.x} cy={p.y} r="2" fill="white" />
        </g>
      ) : (
        <circle key={i} cx={padX + i * xStep} cy={H / 2} r="2.5"
          fill="rgba(255,255,255,0.12)" />
      ))}

      {/* Day labels */}
      {dayLabels.map((label, i) => (
        <text key={i} x={padX + i * xStep} y={H + 12} textAnchor="middle"
          fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.3)">
          {label}
        </text>
      ))}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MoodTracker() {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('checkin');
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEntries(parsed);
        if (parsed.find(e => e.date === today)) setSubmitted(true);
      }
    } catch {}
  }, []);

  const handleSubmit = () => {
    if (!selectedMood) return;
    const entry = { date: today, mood: selectedMood, energy: selectedEnergy || 'okay', note: note.trim(), ts: Date.now() };
    const updated = [...entries.filter(e => e.date !== today), entry].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmitted(true);
    setActiveTab('progress');
  };

  const resetToday = () => { setSubmitted(false); setSelectedMood(null); setSelectedEnergy(null); setNote(''); setActiveTab('checkin'); };

  const recent = entries.slice(-7);
  const avgMood = recent.length ? (recent.reduce((s, e) => s + e.mood, 0) / recent.length) : null;
  const todayEntry = entries.find(e => e.date === today);
  const todayMeta = todayEntry ? MOODS.find(m => m.score === todayEntry.mood) : null;
  const insight = getAIInsight(entries);
  const streak = (() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const ds = d.toISOString().slice(0, 10);
      if (entries.find(e => e.date === ds)) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const selectedMoodMeta = selectedMood ? MOODS.find(m => m.score === selectedMood) : null;

  return (
    <div className="min-h-screen pb-10" style={{ background: 'linear-gradient(160deg, #09000f 0%, #1a0533 30%, #0d1b4b 65%, #050a1f 100%)' }}>

      {/* Glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'15%', left:'40%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'25%', right:'15%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', filter:'blur(30px)' }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium mb-1" style={{ color: 'rgba(196,181,253,0.6)' }}>{greeting} ✦</p>
          <h1 className="text-2xl font-bold text-white mb-1">Mood & Progress</h1>
          <p className="text-xs" style={{ color: 'rgba(196,181,253,0.5)' }}>Track how you feel. See how far you've come.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: '7-Day Avg', value: avgMood ? `${avgMood}/10` : '—', icon: '📊', color: avgMood ? moodColor(parseFloat(avgMood)) : '#64748b' },
            { label: 'Check-in Streak', value: streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '—', icon: '🔥', color: streak >= 3 ? '#f59e0b' : '#64748b' },
            { label: "Today's Mood", value: todayMeta ? todayMeta.emoji : '—', icon: null, color: todayEntry ? moodColor(todayEntry.mood) : '#64748b' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-lg mb-0.5">{icon}</p>
              <p className="text-base font-bold" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-5"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'checkin', label: "Today's Check-in", icon: '✦' },
            { id: 'progress', label: '7-Day Progress', icon: '📈' },
            { id: 'journal', label: 'Journal', icon: '📝' },
          ].map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={activeTab === id
                ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white' }
                : { color: 'rgba(255,255,255,0.4)' }
              }>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── CHECK-IN TAB ── */}
        {activeTab === 'checkin' && (
          <div className="space-y-4">
            {submitted && todayEntry ? (
              /* Already submitted today */
              <div className="rounded-3xl p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <div className="text-6xl mb-3">{todayMeta?.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">Logged for today ✓</h3>
                <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  You're feeling <span style={{ color: moodColor(todayEntry.mood) }}>{todayMeta?.label}</span> · {ENERGY.find(e => e.value === todayEntry.energy)?.icon} {ENERGY.find(e => e.value === todayEntry.energy)?.label}
                </p>
                {todayEntry.note && (
                  <p className="text-xs italic mt-3 px-4" style={{ color: 'rgba(196,181,253,0.6)' }}>"{todayEntry.note}"</p>
                )}
                <button onClick={resetToday}
                  className="mt-4 text-xs px-4 py-1.5 rounded-full transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                  Update today's entry
                </button>
              </div>
            ) : (
              <>
                {/* Mood selector */}
                <div className="rounded-3xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-sm font-semibold text-white mb-4 text-center">
                    How are you feeling right now?
                  </p>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {MOODS.map(({ score, emoji, label, color }) => (
                      <button key={score} onClick={() => setSelectedMood(score)}
                        className="flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all active:scale-90"
                        style={selectedMood === score
                          ? { background: `${color}25`, border: `1.5px solid ${color}`, boxShadow: `0 0 12px ${color}40` }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                        }>
                        <span className={`transition-transform duration-150 ${selectedMood === score ? 'text-3xl scale-110' : 'text-2xl'}`}>
                          {emoji}
                        </span>
                        <span className="text-[9px] font-semibold leading-none"
                          style={{ color: selectedMood === score ? color : 'rgba(255,255,255,0.3)' }}>
                          {score}
                        </span>
                      </button>
                    ))}
                  </div>
                  {selectedMoodMeta && (
                    <div className="text-center py-2 rounded-xl"
                      style={{ background: `${selectedMoodMeta.color}15` }}>
                      <span className="text-sm font-bold" style={{ color: selectedMoodMeta.color }}>
                        {selectedMoodMeta.emoji} {selectedMoodMeta.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Energy */}
                <div className="rounded-3xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-sm font-semibold text-white mb-3">Energy level?</p>
                  <div className="flex gap-2">
                    {ENERGY.map(({ value, label, icon, color }) => (
                      <button key={value} onClick={() => setSelectedEnergy(value)}
                        className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all flex flex-col items-center gap-1 active:scale-95"
                        style={selectedEnergy === value
                          ? { background: `${color}20`, border: `1.5px solid ${color}`, color }
                          : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }
                        }>
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Journal note */}
                <div className="rounded-3xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-sm font-semibold text-white mb-1">Quick reflection</p>
                  <p className="text-xs mb-3" style={{ color: 'rgba(196,181,253,0.5)' }}>{prompt}</p>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Type here... (optional)"
                    rows={3}
                    className="w-full rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                  />
                </div>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={!selectedMood}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                  style={{ background: selectedMood ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.05)', boxShadow: selectedMood ? '0 4px 20px rgba(124,58,237,0.4)' : 'none' }}>
                  Save Today's Check-in ✦
                </button>
              </>
            )}
          </div>
        )}

        {/* ── PROGRESS TAB ── */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* Chart */}
            <div className="rounded-3xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold text-white mb-1">Last 7 Days</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Mood score 1–10</p>
              {entries.length >= 1 ? (
                <MoodChart entries={entries} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Log your mood for a few days to see your chart</p>
                </div>
              )}
            </div>

            {/* AI Insight */}
            {insight && (
              <div className="rounded-3xl p-5"
                style={{ background: `${insight.color}12`, border: `1px solid ${insight.color}30` }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${insight.color}20` }}>
                    {insight.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1.5" style={{ color: insight.color }}>✦ AI Insight</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {insight.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mood history list */}
            {entries.length > 0 && (
              <div className="rounded-3xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-semibold text-white">Recent Check-ins</p>
                </div>
                {[...entries].reverse().slice(0, 7).map((entry, i, arr) => {
                  const meta = MOODS.find(m => m.score === entry.mood);
                  const eng = ENERGY.find(e => e.value === entry.energy);
                  const dateStr = new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <div key={entry.date} className="flex items-center gap-3 px-5 py-3.5"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span className="text-2xl shrink-0">{meta?.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold" style={{ color: moodColor(entry.mood) }}>
                            {meta?.label}
                          </span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{eng?.icon} {eng?.label}</span>
                        </div>
                        {entry.note && (
                          <p className="text-xs truncate italic" style={{ color: 'rgba(255,255,255,0.35)' }}>"{entry.note}"</p>
                        )}
                      </div>
                      <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── JOURNAL TAB ── */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            {entries.filter(e => e.note).length === 0 ? (
              <div className="rounded-3xl p-8 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-4xl mb-3">📝</p>
                <p className="text-sm font-semibold text-white mb-1">Your journal is empty</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Add a reflection when you log your mood — it'll appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...entries].reverse().filter(e => e.note).map(entry => {
                  const meta = MOODS.find(m => m.score === entry.mood);
                  const dateStr = new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
                  return (
                    <div key={entry.date} className="rounded-3xl p-5"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{meta?.emoji}</span>
                        <div>
                          <p className="text-xs font-bold" style={{ color: moodColor(entry.mood) }}>{meta?.label}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{dateStr}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(221,214,254,0.7)' }}>
                        "{entry.note}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Affirmation footer */}
        <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.18)' }}>
          ✦ &nbsp;Every check-in is an act of self-love&nbsp; ✦
        </p>
      </div>
    </div>
  );
}
