import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useMoodData, MOODS_5, TRIGGERS, EMOTION_TAGS, WINS, JOURNEY_STAGES, GUIDED_PROMPTS } from '../hooks/useMoodData';
import MoodSelector from '../components/mood/MoodSelector';
import MoodStats from '../components/mood/MoodStats';
import MoodBreakdown from '../components/mood/MoodBreakdown';
import RecentEntries from '../components/mood/RecentEntries';

// ── Lotus Icon ─────────────────────────────────────────────────────────────

function LotusIcon({ size = 28, color = '#7C3AED' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85"/>
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85" transform="rotate(-40 20 26)"/>
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85" transform="rotate(40 20 26)"/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color}/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color} transform="rotate(-35 20 24)"/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color} transform="rotate(35 20 24)"/>
    </svg>
  );
}

// ── Enhanced Mood Chart ────────────────────────────────────────────────────

function MoodChart({ last7Days }) {
  const days = 7;
  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  const labels = dates.map(d =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)
  );

  const values = dates.map(d => {
    const entry = last7Days.find(e => e.date === d);
    return entry?.mood || null;
  });

  const emojis = { 1: '😭', 3: '😔', 5: '😐', 7: '🙂', 9: '😁' };
  const W = 460, H = 110, px = 24, py = 14;
  const xS = (W - 2 * px) / (days - 1);
  const yR = H - 2 * py;
  const coords = values.map((v, i) =>
    v != null ? { x: px + i * xS, y: py + yR - ((v - 1) / 9) * yR, v } : null
  );
  const valid = coords.filter(Boolean);

  const pathD = valid.length >= 2
    ? valid
        .map((p, i) => {
          if (i === 0) return `M${p.x},${p.y}`;
          const prev = valid[i - 1];
          const cx = (prev.x + p.x) / 2;
          return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
        })
        .join(' ')
    : '';

  const areaD = valid.length >= 2
    ? `${pathD} L${valid[valid.length - 1].x},${H - py} L${valid[0].x},${H - py} Z`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'rgba(34,18,73,0.72)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 28,
        backdropFilter: 'blur(24px)',
        marginBottom: 24,
      }}
    >
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
          Your Mood Journey
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.7)', margin: '0 0 20px' }}>
          Track how you've been feeling over time
        </p>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="mlG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="maG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[3, 5, 7, 9].map(v => {
          const y = py + yR - ((v - 1) / 9) * yR;
          return (
            <line
              key={v}
              x1={px}
              y1={y}
              x2={W - px}
              y2={y}
              stroke="rgba(140, 82, 255, 0.07)"
              strokeWidth="1"
            />
          );
        })}
        {areaD && <path d={areaD} fill="url(#maG)" />}
        {pathD && <path d={pathD} fill="none" stroke="url(#mlG)" strokeWidth="2.5" strokeLinecap="round" />}
        {coords.map((p, i) =>
          p ? (
            <g key={i}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="#7C3AED"
                opacity="0.12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              />
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#A78BFA"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.25 }}
              />
              <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
              <text x={p.x} y={p.y - 13} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">
                {emojis[p.v] || ''}
              </text>
            </g>
          ) : (
            <circle
              key={i}
              cx={px + i * xS}
              cy={H / 2}
              r="3"
              fill="rgba(140, 82, 255, 0.12)"
            />
          )
        )}
        {labels.map((l, i) => (
          <text
            key={i}
            x={px + i * xS}
            y={H + 16}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="rgba(184, 180, 216, 0.6)"
          >
            {l}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📊', label: 'Mood Tracker', path: '/mood' },
  { icon: '📔', label: 'Journal', path: '/journal' },
  { icon: '⚡', label: 'Challenges', path: '/challenges' },
  { icon: '👥', label: 'Community', path: '/community' },
  { icon: '💬', label: 'Messages', path: '/chat' },
  { icon: '📚', label: 'Resources', path: '/resources' },
  { icon: '👤', label: 'Profile', path: '/profile' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
  { icon: '🚪', label: 'Logout', path: '/logout' },
];

export default function MoodTracker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const moodData = useMoodData();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSaveAndRefresh = useCallback(async () => {
    await moodData.handleSave();
    setRefreshTrigger(prev => prev + 1);
  }, [moodData]);

  const firstName = user?.full_name?.split(' ')[0] || 'Friend';
  const userInitials = user?.full_name
    ? user.full_name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ME';

  const totalEntries = Object.keys(moodData.store).filter(k => moodData.store[k]?.mood).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ═══ MAIN CONTENT ═══════════════════════════════════════════════════ */}
      <div
        style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '32px 40px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 4 }}>
                Welcome back, {firstName} 👋
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(184, 180, 216, 0.7)', margin: 0 }}>
                How are you feeling today?
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowModal(true); setModalStep(1); }}
              style={{
                padding: '12px 28px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                fontFamily: 'inherit',
              }}
            >
              + Log Mood
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{ marginBottom: 32 }}
          >
            <MoodStats
              streak={moodData.streak}
              longestStreak={moodData.longestStreak}
              wellnessScore={moodData.wellnessScore}
              totalEntries={totalEntries}
            />
          </motion.div>

          {/* Mood Selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 32 }}>
            <MoodSelector
              mood={moodData.mood}
              onMoodSelect={moodData.handleMoodSelect}
              todayMoodMeta={moodData.todayMoodMeta}
            />
          </motion.div>

          {/* Chart */}
          <MoodChart last7Days={moodData.last7Days} />

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(34,18,73,0.72)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: 28,
              backdropFilter: 'blur(24px)',
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
              ✨ Your Insights
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {moodData.insights.slice(0, 3).map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ fontSize: 28 }}>{insight.emoji}</div>
                  <p style={{ fontSize: 13, color: 'rgba(184, 180, 216, 0.8)', margin: 0, lineHeight: 1.6 }}>
                    {insight.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mood Breakdown */}
          <motion.div key={refreshTrigger}>
            <MoodBreakdown moodBreakdown={moodData.moodBreakdown} />
          </motion.div>

          {/* Recent Entries */}
          <motion.div style={{ marginBottom: 32 }}>
            <RecentEntries
              allEntries={moodData.allEntries}
              onDelete={moodData.handleDeleteEntry}
            />
          </motion.div>
        </div>
      </div>

      {/* ═══ LOG MOOD MODAL ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '90%',
                maxWidth: 500,
                background: 'rgba(34,18,73,0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 24,
                padding: 32,
                backdropFilter: 'blur(32px)',
              }}
            >
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#A78BFA', letterSpacing: '0.1em', marginBottom: 12 }}>
                  STEP {modalStep} OF 7
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    background: 'rgba(124, 58, 237, 0.2)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    animate={{ width: `${(modalStep / 7) * 100}%` }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Modal Content based on step */}
              <AnimatePresence mode="wait">
                {modalStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                      How are you feeling?
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {MOODS_5.map(m => (
                        <motion.button
                          key={m.score}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            moodData.handleMoodSelect(m.score);
                            setModalStep(2);
                          }}
                          style={{
                            padding: 20,
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(124, 58, 237, 0.1)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: 32 }}>{m.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {modalStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                      Emotion tags
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                      {EMOTION_TAGS.map(tag => (
                        <motion.button
                          key={tag.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => moodData.handleEmotion(tag.id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 10,
                            border: moodData.emotions.includes(tag.id)
                              ? '2px solid #A78BFA'
                              : '1px solid rgba(255,255,255,0.12)',
                            background: moodData.emotions.includes(tag.id)
                              ? 'rgba(124, 58, 237, 0.2)'
                              : 'rgba(124, 58, 237, 0.08)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 12,
                            fontWeight: 600,
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: 16, marginRight: 6 }}>{tag.emoji}</span>
                          {tag.label}
                        </motion.button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setModalStep(1)}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          borderRadius: 10,
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'transparent',
                          color: '#A78BFA',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontWeight: 600,
                        }}
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setModalStep(3)}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          borderRadius: 10,
                          border: 'none',
                          background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontWeight: 600,
                        }}
                      >
                        Next →
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {modalStep >= 3 && (
                  <motion.div
                    key="step-rest"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {modalStep === 3 && (
                      <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                          Energy Level: {moodData.energy}/10
                        </h2>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData.energy}
                          onChange={e => moodData.setEnergy(parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: 20, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setModalStep(2)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'transparent',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setModalStep(4)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </>
                    )}

                    {modalStep === 4 && (
                      <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                          Stress Level: {moodData.stress}/10
                        </h2>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={moodData.stress}
                          onChange={e => moodData.setStress(parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: 20, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setModalStep(3)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'transparent',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setModalStep(5)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </>
                    )}

                    {modalStep === 5 && (
                      <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                          Sleep Hours: {moodData.sleepHours}
                        </h2>
                        <input
                          type="range"
                          min="0"
                          max="12"
                          value={moodData.sleepHours}
                          onChange={e => moodData.setSleepHours(parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: 20, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setModalStep(4)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'transparent',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setModalStep(6)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </>
                    )}

                    {modalStep === 6 && (
                      <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                          Water Intake: {moodData.waterIntake} glasses
                        </h2>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          value={moodData.waterIntake}
                          onChange={e => moodData.setWaterIntake(parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: 20, cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setModalStep(5)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'transparent',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Back
                          </button>
                          <button
                            onClick={() => setModalStep(7)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </>
                    )}

                    {modalStep === 7 && (
                      <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>
                          Journal Entry
                        </h2>
                        <textarea
                          value={moodData.reflection}
                          onChange={e => moodData.setReflection(e.target.value)}
                          placeholder="What's on your mind today? Share your thoughts..."
                          style={{
                            width: '100%',
                            padding: 14,
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(124, 58, 237, 0.08)',
                            color: '#fff',
                            fontSize: 13,
                            fontFamily: 'inherit',
                            minHeight: 120,
                            resize: 'none',
                            marginBottom: 20,
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={() => setModalStep(6)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'transparent',
                              color: '#A78BFA',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            Back
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                              await handleSaveAndRefresh();
                              setShowModal(false);
                            }}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                            }}
                          >
                            {moodData.saved ? '✓ Saved!' : 'Save Entry'}
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
