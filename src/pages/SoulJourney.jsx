import React, { useState, useEffect } from 'react';
import { journeyAPI } from '../services/api';

const STAGES = [
  {
    id: 'beginning',
    number: 1,
    name: 'Awareness',
    description: 'Awakening to your journey',
    emoji: '🌱',
  },
  {
    id: 'healing',
    number: 2,
    name: 'Healing',
    description: 'Processing and releasing',
    emoji: '🌸',
  },
  {
    id: 'growth',
    number: 3,
    name: 'Growth',
    description: 'Expanding your awareness',
    emoji: '🌿',
  },
  {
    id: 'transformation',
    number: 4,
    name: 'Transformation',
    description: 'Becoming your true self',
    emoji: '🦋',
  },
  {
    id: 'inner_harmony',
    number: 5,
    name: 'Inner Harmony',
    description: 'Living in alignment',
    emoji: '✨',
  },
];

const ACTIVITY_TYPES = [
  { value: 'meditation', label: 'Meditation', emoji: '🧘' },
  { value: 'journal', label: 'Journal', emoji: '📔' },
  { value: 'chat_session', label: 'Chat Session', emoji: '💬' },
  { value: 'healer_booking', label: 'Healer Session', emoji: '🙏' },
  { value: 'check_in', label: 'Check-In', emoji: '✅' },
  { value: 'reflection', label: 'Reflection', emoji: '🌙' },
];

const STAGE_INDEX = {
  beginning: 0, healing: 1, growth: 2, transformation: 3, inner_harmony: 4,
};

export default function SoulJourney() {
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [logForm, setLogForm] = useState({ activity_type: 'meditation', duration_minutes: 10, intensity: 5, notes: '' });
  const [logLoading, setLogLoading] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [progressRes, statsRes] = await Promise.all([
        journeyAPI.getProgress(),
        journeyAPI.getStats(),
      ]);
      setProgress(progressRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError('Could not load your journey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLog = async (e) => {
    e.preventDefault();
    setLogLoading(true);
    try {
      await journeyAPI.logActivity(logForm);
      setLogSuccess(true);
      setTimeout(() => {
        setLogSuccess(false);
        setShowLog(false);
        fetchData();
      }, 1500);
    } catch {
      alert('Failed to log activity. Please try again.');
    } finally {
      setLogLoading(false);
    }
  };

  const currentStageIndex = progress ? (STAGE_INDEX[progress.current_stage] ?? 0) : 0;

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading your journey…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#EF4444', marginBottom: 12 }}>{error}</p>
          <button onClick={fetchData} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '32px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 6 }}>
              ✨ Soul Journey
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Stage {currentStageIndex + 1} of {STAGES.length}:{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{STAGES[currentStageIndex].name}</span>
            </p>
          </div>
          <button
            onClick={() => setShowLog(true)}
            style={{
              background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12,
              padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            + Log Activity
          </button>
        </div>

        {/* Wellness Stats Row */}
        {progress && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Wellness Score', value: progress.overall_wellness_score, suffix: '/10', color: '#10B981' },
              {
                label: 'Weekly Growth',
                value: `${progress.weekly_growth_percentage > 0 ? '+' : ''}${Math.round(progress.weekly_growth_percentage)}`,
                suffix: '%',
                color: 'var(--primary)',
              },
              { label: 'Total Activities', value: progress.total_activities, suffix: '', color: 'var(--text)' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                  {stat.value}<span style={{ fontSize: 14, fontWeight: 400 }}>{stat.suffix}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Vertical Timeline */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 24px', marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 24 }}>Your Path</h2>
          <div style={{ position: 'relative' }}>
            {/* Track line */}
            <div style={{ position: 'absolute', left: 27, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
            {/* Filled progress line */}
            <div style={{
              position: 'absolute', left: 27, top: 0, width: 2,
              height: `${((currentStageIndex + 0.5) / STAGES.length) * 100}%`,
              background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isLocked = idx > currentStageIndex;

                return (
                  <div key={stage.id} style={{ display: 'flex', gap: 20, paddingBottom: idx < STAGES.length - 1 ? 32 : 0, position: 'relative' }}>
                    {/* Icon */}
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                      background: isCompleted ? '#D1FAE5' : isCurrent ? 'var(--bg-subtle)' : 'var(--bg-subtle)',
                      border: `2px solid ${isCompleted ? '#10B981' : isCurrent ? 'var(--primary)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                      boxShadow: isCurrent ? '0 0 0 4px rgba(109,94,245,0.15)' : 'none',
                      position: 'relative', zIndex: 1,
                      opacity: isLocked ? 0.45 : 1,
                    }}>
                      {stage.emoji}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, opacity: isLocked ? 0.5 : 1, paddingTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: isCompleted ? '#10B981' : isCurrent ? 'var(--text)' : 'var(--text-muted)' }}>
                          {stage.name}
                        </span>
                        {isCurrent && (
                          <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            You are here
                          </span>
                        )}
                        {isCompleted && (
                          <span style={{ color: '#10B981', fontSize: 12, fontWeight: 600 }}>✓ Completed</span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: isCurrent ? 10 : 0 }}>{stage.description}</p>

                      {/* Progress bar only for current stage */}
                      {isCurrent && progress && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stage progress</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{Math.round(progress.stage_progress)}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', borderRadius: 99,
                              width: `${progress.stage_progress}%`,
                              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                              transition: 'width 0.6s ease',
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Breakdown */}
        {stats && stats.total_sessions > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px', marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Activity Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stats.activity_breakdown).map(([type, count]) => {
                const info = ACTIVITY_TYPES.find(a => a.value === type) || { emoji: '•', label: type };
                const pct = Math.round((count / stats.total_sessions) * 100);
                return (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 28, textAlign: 'center', fontSize: 16 }}>{info.emoji}</span>
                    <span style={{ width: 130, fontSize: 13, color: 'var(--text-secondary)' }}>{info.label}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: 'var(--primary)', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ width: 32, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weekly Trend */}
        {stats && stats.weekly_trend?.length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Weekly Trend</h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 80 }}>
              {stats.weekly_trend.map((week) => {
                const max = Math.max(...stats.weekly_trend.map(w => w.activities), 1);
                const height = Math.max((week.activities / max) * 64, 4);
                return (
                  <div key={week.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{week.activities}</span>
                    <div style={{ width: '100%', height, borderRadius: 6, background: 'var(--primary)', opacity: 0.8 }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{week.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {showLog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLog(false); }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420, border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Log an Activity</h2>

            {logSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌸</div>
                <p style={{ color: '#10B981', fontWeight: 600 }}>Activity logged!</p>
              </div>
            ) : (
              <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Activity Type</label>
                  <select
                    value={logForm.activity_type}
                    onChange={e => setLogForm(f => ({ ...f, activity_type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: 14 }}
                  >
                    {ACTIVITY_TYPES.map(a => (
                      <option key={a.value} value={a.value}>{a.emoji} {a.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Duration (minutes)</label>
                  <input
                    type="number" min={1} max={180}
                    value={logForm.duration_minutes}
                    onChange={e => setLogForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 0 }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Intensity: <strong style={{ color: 'var(--primary)' }}>{logForm.intensity}/10</strong>
                  </label>
                  <input
                    type="range" min={1} max={10}
                    value={logForm.intensity}
                    onChange={e => setLogForm(f => ({ ...f, intensity: parseInt(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
                  <textarea
                    value={logForm.notes}
                    onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="How did it feel?"
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: 14, resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={() => setShowLog(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={logLoading}
                    style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, opacity: logLoading ? 0.7 : 1 }}>
                    {logLoading ? 'Logging…' : 'Log Activity'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
