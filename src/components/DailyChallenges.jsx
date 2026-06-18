import React, { useState, useEffect } from 'react';
import { challengesAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

const DIFFICULTY_COLOR = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };

function StreakFire({ streak }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 18 }}>🔥</span>
      <span style={{ fontSize: 20, fontWeight: 800, color: '#F97316' }}>{streak}</span>
      <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>day streak</span>
    </div>
  );
}

function ChallengeCard({ challenge, onComplete, completing }) {
  const isCompleting = completing === challenge.id;
  const totalPts = challenge.points + (challenge.streak_bonus || 0);

  return (
    <div
      onClick={() => !challenge.completed && !isCompleting && onComplete(challenge.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 14, marginBottom: 8,
        border: challenge.completed
          ? '1.5px solid rgba(16,185,129,0.4)'
          : '1.5px solid var(--border)',
        background: challenge.completed
          ? 'rgba(16,185,129,0.06)'
          : 'var(--bg)',
        cursor: challenge.completed ? 'default' : 'pointer',
        transition: 'all 0.2s',
        opacity: isCompleting ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!challenge.completed) e.currentTarget.style.borderColor = 'var(--primary)'; }}
      onMouseLeave={e => { if (!challenge.completed) e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Status circle */}
      <div style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: challenge.completed ? '#10B981' : 'var(--bg-subtle)',
        border: challenge.completed ? 'none' : '2px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: challenge.completed ? 18 : 20,
        transition: 'all 0.3s',
      }}>
        {isCompleting ? (
          <div style={{ width: 18, height: 18, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        ) : challenge.completed ? '✓' : challenge.icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {challenge.name}
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

      {/* Points */}
      <div style={{
        padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700,
        background: challenge.completed ? '#10B981' : 'rgba(109,74,255,0.1)',
        color: challenge.completed ? '#fff' : 'var(--primary)',
        whiteSpace: 'nowrap',
      }}>
        +{totalPts} pts
      </div>
    </div>
  );
}

const DEMO_DATA = {
  cycle_day: 1,
  theme: 'Mindfulness Basics',
  challenges: [
    { id: 'breathing_3min',    name: '3-Min Breathing',    description: 'Deep breathing to calm your mind',          type: 'breathing',  duration: 3,  points: 30,  icon: '🌬️', difficulty: 'easy',   completed: false, streak_bonus: 0 },
    { id: 'gratitude_journal', name: 'Gratitude Journal',  description: "Write 3 things you're grateful for today",  type: 'gratitude',  duration: 5,  points: 50,  icon: '📔', difficulty: 'easy',   completed: false, streak_bonus: 0 },
    { id: 'meditation_5min',   name: '5-Min Meditation',   description: 'Guided meditation for peace and clarity',    type: 'meditation', duration: 5,  points: 70,  icon: '🧘', difficulty: 'medium', completed: false, streak_bonus: 0 },
  ],
  completed: 0, total: 3,
  points_earned_today: 0, points_remaining: 150,
  current_streak: 0, longest_streak: 0, total_points: 0,
};

export default function DailyChallenges({ compact = false }) {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = async () => {
    if (!token) { setData(DEMO_DATA); setIsDemo(true); setLoading(false); return; }
    try {
      setLoading(true);
      const res = await challengesAPI.getToday();
      setData(res.data);
      setIsDemo(false);
    } catch {
      setData(DEMO_DATA);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const handleComplete = async (challengeId) => {
    setCompleting(challengeId);
    const challenge = data.challenges.find(c => c.id === challengeId);
    const pts = (challenge?.points || 30) + (challenge?.streak_bonus || 0);

    if (isDemo) {
      // Demo mode: just update local state
      await new Promise(r => setTimeout(r, 600));
      setData(prev => ({
        ...prev,
        challenges: prev.challenges.map(c => c.id === challengeId ? { ...c, completed: true } : c),
        completed: prev.completed + 1,
        points_earned_today: prev.points_earned_today + pts,
        points_remaining: Math.max(0, prev.points_remaining - pts),
      }));
      setToast(`+${pts} pts · ${challenge?.name} done! 🎉`);
      setTimeout(() => setToast(null), 3000);
      setCompleting(null);
      return;
    }

    try {
      const res = await challengesAPI.complete(challengeId);
      const result = res.data;
      setToast(`+${result.total_points} pts · ${result.challenge_name} done! 🎉`);
      setTimeout(() => setToast(null), 3000);
      setData(prev => ({
        ...prev,
        challenges: prev.challenges.map(c => c.id === challengeId ? { ...c, completed: true } : c),
        completed: prev.completed + 1,
        current_streak: result.current_streak,
        total_points: result.total_earned,
        points_earned_today: prev.points_earned_today + result.total_points,
        points_remaining: Math.max(0, prev.points_remaining - result.total_points),
      }));
    } catch (e) {
      if (e?.response?.status === 400) {
        setToast('Already completed today!');
        setTimeout(() => setToast(null), 2000);
      }
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 66, borderRadius: 14, background: 'var(--bg-subtle)', marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    );
  }

  if (!data) setData(DEMO_DATA);

  const { challenges, completed, total, current_streak, longest_streak, total_points, points_remaining, cycle_day, theme } = data;
  const pct = Math.round((completed / total) * 100);
  const allDone = completed === total;

  return (
    <div style={{ padding: compact ? '12px 0' : 16, position: 'relative' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#1A1333', color: '#fff', borderRadius: 12,
          padding: '10px 20px', fontSize: 13, fontWeight: 600, zIndex: 999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'slideDown 0.2s ease',
          whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
            ⚡ Daily Challenges
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Day {cycle_day}/14 · {theme}
          </div>
        </div>
        <StreakFire streak={current_streak} />
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
            height: '100%', borderRadius: 99,
            width: `${pct}%`,
            background: allDone ? '#10B981' : 'linear-gradient(90deg, var(--primary), var(--secondary))',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* All done celebration */}
      {allDone && (
        <div style={{
          borderRadius: 14, padding: '14px 16px', marginBottom: 12, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.06))',
          border: '1.5px solid rgba(16,185,129,0.25)',
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>All challenges complete!</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Come back tomorrow for new challenges</div>
        </div>
      )}

      {/* Challenge cards */}
      {challenges.map(c => (
        <ChallengeCard key={c.id} challenge={c} onComplete={handleComplete} completing={completing} />
      ))}

      {/* Stats footer */}
      {!compact && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Total Points', value: total_points, color: 'var(--primary)' },
            { label: 'Best Streak', value: `${longest_streak}d`, color: '#F97316' },
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
