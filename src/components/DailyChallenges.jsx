import React, { useEffect, useState } from 'react';
import { useChallengesStore } from '../store/challenges';
import { useAuthStore } from '../store/auth';

const DIFFICULTY_COLOR = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };

const DEMO_DATA = {
  cycle_day: 1, theme: 'Mindfulness Basics',
  challenges: [
    { id: 'breathing_3min',    name: '3-Min Breathing',   type: 'breathing',  duration: 3,  points: 30,  icon: '🌬️', difficulty: 'easy',   completed: false, streak_bonus: 0 },
    { id: 'gratitude_journal', name: 'Gratitude Journal', type: 'gratitude',  duration: 5,  points: 50,  icon: '📔', difficulty: 'easy',   completed: false, streak_bonus: 0 },
    { id: 'meditation_5min',   name: '5-Min Meditation',  type: 'meditation', duration: 5,  points: 70,  icon: '🧘', difficulty: 'medium', completed: false, streak_bonus: 0 },
  ],
  completed: 0, total: 3, points_earned_today: 0, points_remaining: 150,
  current_streak: 0, longest_streak: 0, total_points: 0,
};

function Spinner({ size = 18, color = 'var(--primary)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid rgba(109,74,255,0.2)`,
      borderTopColor: color,
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  );
}

function ChallengeCard({ challenge, onComplete, completing }) {
  const isCompleting = completing === challenge.id;
  const totalPts = challenge.points + (challenge.streak_bonus || 0);

  return (
    <div
      onClick={() => !challenge.completed && !completing && onComplete(challenge.id)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 14, marginBottom: 8,
        border: challenge.completed
          ? '1.5px solid rgba(16,185,129,0.4)'
          : isCompleting
          ? '1.5px solid var(--primary)'
          : '1.5px solid var(--border)',
        background: challenge.completed
          ? 'rgba(16,185,129,0.06)'
          : isCompleting
          ? 'rgba(109,74,255,0.04)'
          : 'var(--bg)',
        cursor: (challenge.completed || completing) ? 'default' : 'pointer',
        transition: 'all 0.2s',
        opacity: (completing && !isCompleting) ? 0.5 : 1,
        overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!challenge.completed && !completing) e.currentTarget.style.borderColor = 'var(--primary)'; }}
      onMouseLeave={e => { if (!challenge.completed && !isCompleting) e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Loading overlay shimmer */}
      {isCompleting && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: 'linear-gradient(90deg, transparent 0%, rgba(109,74,255,0.06) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* Status circle */}
      <div style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: challenge.completed ? '#10B981' : isCompleting ? 'rgba(109,74,255,0.1)' : 'var(--bg-subtle)',
        border: challenge.completed ? 'none' : isCompleting ? '2px solid var(--primary)' : '2px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: challenge.completed ? 18 : 20,
        transition: 'all 0.3s',
      }}>
        {isCompleting
          ? <Spinner size={18} />
          : challenge.completed
          ? <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>✓</span>
          : challenge.icon
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {challenge.name}
          {isCompleting && <span style={{ fontSize: 11, color: 'var(--primary)', marginLeft: 8 }}>saving…</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: DIFFICULTY_COLOR[challenge.difficulty], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {challenge.difficulty}
          </span>
          {challenge.duration > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>· {challenge.duration} min</span>
          )}
        </div>
      </div>

      {/* Points badge */}
      <div style={{
        padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
        background: challenge.completed ? '#10B981' : isCompleting ? 'rgba(109,74,255,0.15)' : 'rgba(109,74,255,0.1)',
        color: challenge.completed ? '#fff' : 'var(--primary)',
        whiteSpace: 'nowrap', transition: 'all 0.2s',
      }}>
        {isCompleting ? <Spinner size={12} /> : `+${totalPts} pts`}
      </div>
    </div>
  );
}

export default function DailyChallenges({ compact = false }) {
  const { token } = useAuthStore();
  const { data, loading, completing, error, fetchToday, completeChallenge, clearError } = useChallengesStore();
  const [toast, setToast] = useState(null);
  const [localData, setLocalData] = useState(null); // demo fallback
  const isDemo = !token || (!loading && !data);

  useEffect(() => {
    if (token) fetchToday();
  }, [token]);

  // Use store data if available, else demo
  const displayData = data || localData || DEMO_DATA;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleComplete = async (challengeId) => {
    const challenge = displayData.challenges.find(c => c.id === challengeId);
    const pts = (challenge?.points || 30) + (challenge?.streak_bonus || 0);

    if (isDemo) {
      // Demo mode — animate locally without API
      const fakeCompleting = challengeId;
      setLocalData(prev => {
        const base = prev || DEMO_DATA;
        return { ...base, completing: fakeCompleting };
      });
      await new Promise(r => setTimeout(r, 700));
      setLocalData(prev => {
        const base = prev || DEMO_DATA;
        return {
          ...base,
          completing: null,
          challenges: base.challenges.map(c => c.id === challengeId ? { ...c, completed: true } : c),
          completed: base.completed + 1,
          points_earned_today: base.points_earned_today + pts,
          points_remaining: Math.max(0, base.points_remaining - pts),
        };
      });
      showToast(`+${pts} pts · ${challenge?.name} done! 🎉`);
      return;
    }

    const res = await completeChallenge(challengeId);
    if (res?.success) {
      showToast(`+${res.result.total_points} pts · ${res.result.challenge_name} done! 🎉`);
    } else if (res?.error?.type === 'already_done') {
      showToast('Already completed today!');
    } else if (res?.error?.type === 'auth') {
      showToast('Session expired — please log in again.');
    } else if (res?.error) {
      showToast('Could not save. Try again.');
    }
  };

  // Merge demo completing state
  const effectiveCompleting = isDemo ? localData?.completing : completing;
  const effectiveData = isDemo ? (localData || DEMO_DATA) : displayData;

  if (loading && !data) {
    return (
      <div style={{ padding: 20 }}>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 66, borderRadius: 14, background: 'var(--bg-subtle)', marginBottom: 8, animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    );
  }

  const { challenges, completed, total, current_streak, longest_streak, total_points, points_remaining, cycle_day, theme } = effectiveData;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = completed === total;

  return (
    <div style={{ padding: compact ? '12px 0' : 16, position: 'relative' }}>
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes slideDown{ from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shimmer  { 0%{ background-position:200% 0 } 100%{ background-position:-200% 0 } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#1A1333', color: '#fff', borderRadius: 12,
          padding: '10px 20px', fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'slideDown 0.2s ease',
          whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>⚡ Daily Challenges</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day {cycle_day}/14 · {theme}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#F97316' }}>{current_streak}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>day streak</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{completed}/{total} completed</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: allDone ? '#10B981' : 'var(--primary)' }}>
            {allDone ? '✓ All done!' : `${points_remaining} pts left`}
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${pct}%`,
            background: allDone ? '#10B981' : 'linear-gradient(90deg, var(--primary), var(--secondary))',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* All done */}
      {allDone && (
        <div style={{
          borderRadius: 14, padding: '14px 16px', marginBottom: 12, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.06))',
          border: '1.5px solid rgba(16,185,129,0.25)',
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>All challenges complete!</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Come back tomorrow for new ones</div>
        </div>
      )}

      {/* Cards */}
      {challenges.map(c => (
        <ChallengeCard key={c.id} challenge={c} onComplete={handleComplete} completing={effectiveCompleting} />
      ))}

      {/* Stats footer */}
      {!compact && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Total Points', value: total_points, color: 'var(--primary)' },
            { label: 'Best Streak',  value: `${longest_streak}d`, color: '#F97316' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, borderRadius: 12, padding: '10px 12px', textAlign: 'center',
              background: 'var(--bg-subtle)', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
