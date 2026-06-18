import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth';
import { useDashboardStore } from '../store/dashboard';

function StatCard({ icon, value, label, sub, accent, extra }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      borderRadius: 14,
      background: `linear-gradient(135deg, ${accent[0]}, ${accent[1]})`,
      padding: '14px 14px 12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle glow orb */}
      <div style={{
        position: 'absolute', right: -14, bottom: -14,
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 20, marginBottom: 6, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 3 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{sub}</div>
      )}
      {extra}
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={{ marginTop: 6, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        width: `${Math.min(pct, 100)}%`,
        background: 'rgba(255,255,255,0.8)',
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

export default function DashboardStats() {
  const { token } = useAuthStore();
  const { fetchStats, refreshLive, getDisplayStats, loading } = useDashboardStore();
  const liveTimerRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchStats();
      // Refresh live count every 30 seconds
      liveTimerRef.current = setInterval(() => refreshLive(), 30_000);
    }
    return () => clearInterval(liveTimerRef.current);
  }, [token]);

  const s = getDisplayStats();
  const { healing_streak, souls_healing, soul_points, healing_sessions } = s;

  if (loading && !s.healing_streak) {
    return (
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 90, borderRadius: 14, background: 'var(--bg-subtle)', animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    );
  }

  const changeColor = healing_sessions.weekly_change >= 0 ? 'rgba(52,195,143,0.9)' : 'rgba(239,68,68,0.9)';

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
      {/* Healing Streak */}
      <StatCard
        icon="🧘"
        value={healing_streak.current}
        label="Day Streak"
        sub={`Best: ${healing_streak.best}d`}
        accent={['#F97316', '#EA580C']}
      />

      {/* Souls Healing Live */}
      <StatCard
        icon="🌍"
        value={souls_healing.count.toLocaleString()}
        label="Healing Now"
        accent={['#059669', '#047857']}
        extra={
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C38F', animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live</span>
          </div>
        }
      />

      {/* Soul Points + Level */}
      <StatCard
        icon="⚡"
        value={soul_points.total.toLocaleString()}
        label={`Lvl ${soul_points.level} · ${soul_points.points_to_next} to go`}
        accent={['#6D4AFF', '#5B21B6']}
        extra={<ProgressBar pct={soul_points.progress_pct} />}
      />

      {/* Healing Sessions */}
      <StatCard
        icon="💜"
        value={healing_sessions.this_week}
        label="Sessions"
        accent={['#8B5CF6', '#7C3AED']}
        extra={
          <div style={{ marginTop: 5, fontSize: 10, fontWeight: 700, color: changeColor }}>
            {healing_sessions.change_display} from last wk
          </div>
        }
      />
    </div>
  );
}
