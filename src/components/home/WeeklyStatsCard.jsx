import { CARD_STYLE, SECTION_LABEL } from './homeStyles';

/* ─────────────────────────────────────────────────────────────────────────────
   WEEKLY STATS (donut + bars) — extracted verbatim from Home.jsx.
   Currently unreferenced in Home.jsx's JSX output (dead code, flagged in the
   Phase 1/2 audit — left as-is, not deleted, per the zero-behavior-change
   constraint on this refactor).
───────────────────────────────────────────────────────────────────────────── */
export default function WeeklyStatsCard({ weeklyStats }) {
  const { total, daily = [], byCategory = {} } = weeklyStats || {};
  const maxPossible = 21; // 7 days × 3 wins
  const pct = Math.round(((total || 0) / maxPossible) * 100);

  // Donut
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ * (1 - (pct / 100));

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const barMax = Math.max(...(daily.map(d => d.count || 0)), 1);

  return (
    <div style={{ ...CARD_STYLE }}>
      <div style={SECTION_LABEL}>🔥 THIS WEEK</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        {/* Left: text + bars */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {total || 0}
          </div>
          <div style={{ fontSize: 11, color: '#8A84B6', marginBottom: 12 }}>Tiny Wins Completed</div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36 }}>
            {days.map((day, i) => {
              const count = daily[i]?.count || 0;
              const h = Math.max(4, Math.round((count / barMax) * 32));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 12, height: h, borderRadius: 3,
                    background: count > 0
                      ? 'linear-gradient(180deg, #A855F7, #7C3AED)'
                      : 'rgba(255,255,255,0.08)',
                    transition: 'height 0.6s ease',
                    boxShadow: count > 0 ? '0 0 6px rgba(168,85,247,0.4)' : 'none',
                  }} />
                  <span style={{ fontSize: 9, color: '#8A84B6' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Donut */}
        <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
          <svg width="70" height="70" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="35" cy="35" r={r} fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="6"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#F4C542" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F4C542', lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 8, color: '#8A84B6', lineHeight: 1.3, textAlign: 'center' }}>Com-<br/>pletion</div>
          </div>
        </div>
      </div>
    </div>
  );
}
