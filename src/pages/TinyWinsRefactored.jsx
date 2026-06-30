import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTinyWinsRefactoredStore } from '../store/tinyWinsRefactored';
import { useWeatherStore } from '../store/weather';
import { useDailyReset } from '../hooks/useDailyReset';
import { useCountdown } from '../hooks/useCountdown';
import TinyWinCard from '../components/TinyWinCardRefactored';
import TinyWinModal from '../components/TinyWinModal';
import { ChevronLeft, Settings } from 'lucide-react';

const CARD = {
  background: 'rgba(34,18,73,0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  padding: '20px',
  marginBottom: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
  position: 'relative',
  overflow: 'hidden',
};

const LABEL = {
  fontSize: 11,
  color: '#F4C542',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 10,
};

// Progress card
function ProgressCard({ completed, total, isComplete }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...CARD, padding: '16px 20px', marginBottom: 0 }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Today's Progress</span>
        <span style={{ fontSize: 12, color: '#8A84B6' }}>{completed} / {total} completed</span>
      </div>
      <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{
            height: '100%',
            borderRadius: 6,
            background: isComplete
              ? 'linear-gradient(90deg,#10B981,#34D399)'
              : 'linear-gradient(90deg,#7C3AED,#A855F7)',
            boxShadow: isComplete ? '0 0 8px rgba(16,185,129,0.5)' : '0 0 8px rgba(139,92,246,0.5)',
          }}
        />
      </div>
      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ margin: '8px 0 0', fontSize: 12, color: '#10B981', fontWeight: 600 }}
        >
          ✨ Amazing! You completed today's Tiny Wins.
        </motion.p>
      )}
    </motion.div>
  );
}

// Countdown card
function CountdownCard({ countdown, isComplete }) {
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ ...CARD, marginBottom: 0, textAlign: 'center', padding: '24px' }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🌟</div>
        <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 600, marginBottom: 8 }}>
          Next Tiny Wins in
        </p>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#7C3AED', fontFamily: 'monospace' }}>
          {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#8A84B6' }}>
          Refresh at midnight for new challenges
        </p>
      </motion.div>
    );
  }

  return null;
}

// Streak badge
function StreakBadge({ streak, longestStreak, lastCompletedDate }) {
  if (streak === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 0, padding: '16px' }}
      >
        <div style={{ fontSize: 28 }}>🌱</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Welcome back!</div>
          <p style={{ margin: 0, fontSize: 11, color: '#8A84B6', marginTop: 2 }}>
            Let's take one small step today.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 0, padding: '16px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🔥</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#F97316' }}>{streak}</div>
        <div style={{ fontSize: 10, color: '#8A84B6', marginTop: 2 }}>day streak</div>
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Current Streak
        </div>
        <div style={{ fontSize: 11, color: '#8A84B6', marginBottom: 6 }}>
          {streak} {streak === 1 ? 'day' : 'days'} in a row
        </div>
        <div style={{ fontSize: 10, color: '#6B7280' }}>
          Best: {longestStreak} days
        </div>
      </div>
    </motion.div>
  );
}

// Stats overview
function StatsOverview({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...CARD }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={LABEL}>📊 This Week</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>{stats.thisWeekWins}</div>
          <div style={{ fontSize: 10, color: '#8A84B6', marginTop: 4 }}>Wins</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981' }}>{stats.completionPercentage}%</div>
          <div style={{ fontSize: 10, color: '#8A84B6', marginTop: 4 }}>Complete</div>
        </div>
      </div>
      {stats.favoriteCategory && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(139,92,246,0.1)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)' }}>
          <div style={{ fontSize: 11, color: '#A78BFA', fontWeight: 600 }}>
            ⭐ Favorite: {stats.favoriteCategory}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Weekly heatmap
function WeeklyHeatmap({ weekData }) {
  const maxWins = Math.max(...weekData.map(d => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...CARD }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' }} />
      <div style={LABEL}>📈 Weekly Heatmap</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
        {weekData.map((day, i) => {
          const intensity = day.count > 0 ? day.count / maxWins : 0;
          const bgColor = intensity === 0
            ? 'rgba(255,255,255,0.05)'
            : `rgba(139, 92, 246, ${0.2 + intensity * 0.8})`;

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%',
                height: 32,
                borderRadius: 8,
                background: bgColor,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: day.count > 0 ? '#fff' : '#8A84B6',
              }}>
                {day.count > 0 ? day.count : '-'}
              </div>
              <div style={{ fontSize: 10, color: '#8A84B6', textAlign: 'center' }}>{day.label}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Main component
export default function TinyWinsRefactored() {
  const navigate = useNavigate();
  const { todayEntry } = useWeatherStore();
  const countdown = useCountdown();

  const {
    dailySession,
    initializeDailySession,
    completeChallenge,
    getStats,
    getDailyProgress,
  } = useTinyWinsRefactoredStore();

  const [activeTab, setActiveTab] = useState('today');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Initialize on mount and at midnight
  useEffect(() => {
    const weatherId = todayEntry?.weather || 'clear-sky';
    initializeDailySession(weatherId);
  }, [todayEntry?.weather, initializeDailySession]);

  useDailyReset(() => {
    const weatherId = todayEntry?.weather || 'clear-sky';
    initializeDailySession(weatherId);
  });

  const progress = getDailyProgress();
  const stats = getStats();

  const handleStartChallenge = useCallback((challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  }, []);

  const handleCompleteChallenge = (challengeId) => {
    completeChallenge(challengeId);
    setShowModal(false);
    setSelectedChallenge(null);
  };

  return (
    <>
      <style>{`
        .tw-tab {
          padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600;
          cursor: pointer; border: none; font-family: inherit;
          transition: all 0.2s ease;
        }
        .tw-tab.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.7), rgba(168,85,247,0.5));
          color: #fff;
          box-shadow: 0 0 16px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(168,85,247,0.3);
        }
        .tw-tab.inactive {
          background: rgba(255,255,255,0.05);
          color: rgba(184,180,216,0.7);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .tw-tab.inactive:hover { background: rgba(255,255,255,0.08); color: #E2DEFF; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 60% 50% at 15% 0%, rgba(124,58,237,0.13) 0%, transparent 55%),
          radial-gradient(ellipse 40% 60% at 85% 100%, rgba(168,85,247,0.08) 0%, transparent 55%),
          transparent
        `,
        fontFamily: "'Inter', sans-serif",
        padding: '0 0 40px',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/home')}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} color="#B8B4D8" />
            </button>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Tiny Wins
              </h1>
              <p style={{ fontSize: 12, color: '#8A84B6', margin: 0 }}>Small steps. Big change.</p>
            </div>
          </div>
          <button style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Settings size={16} color="#B8B4D8" />
          </button>
        </div>

        {/* Progress */}
        <div style={{ padding: '18px 24px 0' }}>
          <ProgressCard completed={progress.completed} total={progress.total} isComplete={progress.isComplete} />
        </div>

        {/* Tabs */}
        <div style={{ padding: '18px 24px 14px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {['today', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tw-tab ${activeTab === tab ? 'active' : 'inactive'}`}
            >
              {tab === 'today' ? '🌿 Today' : '📊 Stats'}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 24px' }}>
          <AnimatePresence mode="wait">
            {/* Today Tab */}
            {activeTab === 'today' && (
              <motion.div
                key="today"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {dailySession?.challenges && dailySession.challenges.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {dailySession.challenges.map((challenge, i) => (
                      <TinyWinCard
                        key={challenge.id}
                        challenge={challenge}
                        isCompleted={dailySession.completedChallengeIds.includes(challenge.id)}
                        onStart={() => handleStartChallenge(challenge)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ ...CARD, textAlign: 'center', padding: '36px 24px' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                      Loading today's wins...
                    </div>
                  </div>
                )}

                {/* Countdown */}
                {progress.isComplete && (
                  <div style={{ marginTop: 20 }}>
                    <CountdownCard countdown={countdown} isComplete={true} />
                  </div>
                )}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StreakBadge streak={stats.currentStreak} longestStreak={stats.longestStreak} lastCompletedDate={stats.lastCompletedDate} />

                <div style={{ marginTop: 14 }}>
                  <StatsOverview stats={stats} />
                </div>

                <div style={{ marginTop: 14 }}>
                  <WeeklyHeatmap weekData={stats.weekData} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ ...CARD, marginTop: 14 }}
                >
                  <div style={LABEL}>🏆 Lifetime</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Total Wins', value: stats.totalWins, icon: '✨' },
                      { label: 'Active Days', value: stats.activeDays, icon: '📅' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        padding: '12px 14px',
                        borderRadius: 16,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: '#8A84B6', marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedChallenge && (
          <TinyWinModal
            challenge={selectedChallenge}
            onClose={() => {
              setShowModal(false);
              setSelectedChallenge(null);
            }}
            onComplete={() => handleCompleteChallenge(selectedChallenge.id)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
