import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { challengesAPI } from '../services/api';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

const DEMO_DATA = {
  top10: [
    { rank: 1, name: 'P***', points: 980,  streak: 14, is_me: false },
    { rank: 2, name: 'A***', points: 820,  streak: 11, is_me: false },
    { rank: 3, name: 'S***', points: 740,  streak: 9,  is_me: false },
    { rank: 4, name: 'R***', points: 610,  streak: 7,  is_me: false },
    { rank: 5, name: 'M***', points: 540,  streak: 6,  is_me: false },
    { rank: 6, name: 'K***', points: 480,  streak: 5,  is_me: true  },
    { rank: 7, name: 'T***', points: 370,  streak: 4,  is_me: false },
    { rank: 8, name: 'N***', points: 290,  streak: 3,  is_me: false },
    { rank: 9, name: 'V***', points: 210,  streak: 2,  is_me: false },
    { rank: 10, name: 'D***', points: 150, streak: 1,  is_me: false },
  ],
  my_rank: 6,
  my_points: 480,
  my_streak: 5,
};

function RankRow({ entry, animate }) {
  const isTop3 = entry.rank <= 3;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 12, marginBottom: 5,
        background: entry.is_me
          ? 'linear-gradient(135deg, rgba(109,74,255,0.10), rgba(109,74,255,0.06))'
          : isTop3
          ? 'rgba(249,115,22,0.04)'
          : 'var(--bg-subtle)',
        border: entry.is_me
          ? '1.5px solid rgba(109,74,255,0.35)'
          : isTop3
          ? '1.5px solid rgba(249,115,22,0.15)'
          : '1px solid var(--border)',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.3s ease ${entry.rank * 0.04}s, transform 0.3s ease ${entry.rank * 0.04}s`,
      }}
    >
      {/* Rank */}
      <div style={{
        width: 28, textAlign: 'center', flexShrink: 0,
        fontSize: isTop3 ? 18 : 12,
        fontWeight: isTop3 ? 700 : 600,
        color: isTop3 ? undefined : 'var(--text-muted)',
      }}>
        {MEDAL[entry.rank] || entry.rank}
      </div>

      {/* Avatar circle */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: entry.is_me
          ? 'var(--primary)'
          : isTop3
          ? 'linear-gradient(135deg, #F97316, #FBBF24)'
          : 'var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700,
        color: entry.is_me || isTop3 ? '#fff' : 'var(--text-muted)',
      }}>
        {entry.name[0]}
      </div>

      {/* Name + streak */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: entry.is_me ? 700 : 600,
          color: entry.is_me ? 'var(--primary)' : 'var(--text)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {entry.name}
          {entry.is_me && (
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--primary)', background: 'rgba(109,74,255,0.1)', padding: '1px 6px', borderRadius: 99 }}>
              you
            </span>
          )}
        </div>
        {entry.streak > 0 && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
            🔥 {entry.streak}d streak
          </div>
        )}
      </div>

      {/* Points */}
      <div style={{
        fontSize: 13, fontWeight: 800,
        color: entry.is_me ? 'var(--primary)' : isTop3 ? '#F97316' : 'var(--text)',
        whiteSpace: 'nowrap',
      }}>
        {entry.points.toLocaleString()}
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 2 }}>pts</span>
      </div>
    </div>
  );
}

export default function Leaderboard({ compact = false }) {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!token) {
      setData(DEMO_DATA);
      setTimeout(() => setAnimate(true), 50);
      return;
    }
    setLoading(true);
    challengesAPI.getLeaderboard()
      .then(res => {
        setData(res.data);
        setTimeout(() => setAnimate(true), 50);
      })
      .catch(() => {
        setData(DEMO_DATA);
        setTimeout(() => setAnimate(true), 50);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 52, borderRadius: 12, background: 'var(--bg-subtle)', marginBottom: 5, animation: `pulse 1.4s ease-in-out ${i * 0.12}s infinite` }} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { top10, my_rank, my_points, my_streak } = data;
  const myInTop10 = top10.some(e => e.is_me);

  return (
    <div style={{ padding: compact ? '10px 0' : 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>🏆 Leaderboard</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Top 10 by challenge points</div>
        </div>
        {!token && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '3px 8px', borderRadius: 99, border: '1px solid var(--border)' }}>
            demo
          </span>
        )}
      </div>

      {/* Rows */}
      {top10.map(entry => (
        <RankRow key={entry.rank} entry={entry} animate={animate} />
      ))}

      {/* My rank (if outside top 10) */}
      {!myInTop10 && (
        <>
          <div style={{ textAlign: 'center', padding: '4px 0', color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.1em' }}>· · ·</div>
          <RankRow
            entry={{ rank: my_rank, name: 'You', points: my_points, streak: my_streak, is_me: true }}
            animate={animate}
          />
        </>
      )}

      {/* My stats summary */}
      {!compact && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(109,74,255,0.07), rgba(109,74,255,0.04))',
          border: '1px solid rgba(109,74,255,0.2)',
          display: 'flex', justifyContent: 'space-around',
        }}>
          {[
            { label: 'Your Rank', value: `#${my_rank}` },
            { label: 'Your Points', value: my_points.toLocaleString() },
            { label: 'Streak', value: `${my_streak}d` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
