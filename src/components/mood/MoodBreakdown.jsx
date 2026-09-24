import React from 'react';
import { Card } from '@/components/ui/card';

/* Mood breakdown — donut + legend (same maths as before), light card.
   The donut scales with its container so it can't overflow narrow phones. */
const MOODS = [
  { score: 1, emoji: '😭', label: 'Awful', color: '#EF4444' },
  { score: 3, emoji: '😔', label: 'Not Good', color: '#F97316' },
  { score: 5, emoji: '😐', label: 'Okay', color: '#F59E0B' },
  { score: 7, emoji: '🙂', label: 'Good', color: '#10B981' },
  { score: 9, emoji: '😁', label: 'Amazing', color: '#6D4AFF' },
];

function MoodBreakdown({ moodBreakdown }) {
  const total = Object.values(moodBreakdown).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <Card className="p-4 sm:p-5">
        <h2 className="text-[18px] font-semibold text-foreground">Mood breakdown</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Log a few moods to see your mix.</p>
      </Card>
    );
  }

  const size = 220, radius = 70, c = size / 2;
  let angle = -Math.PI / 2;
  const slices = [];
  const labels = [];
  MOODS.forEach((m) => {
    const count = moodBreakdown[m.score] || 0;
    if (count === 0) return;
    const sweep = (count / total) * 2 * Math.PI;
    const end = angle + sweep, mid = angle + sweep / 2;
    const x1 = c + radius * Math.cos(angle), y1 = c + radius * Math.sin(angle);
    const x2 = c + radius * Math.cos(end), y2 = c + radius * Math.sin(end);
    slices.push({ d: `M ${c} ${c} L ${x1} ${y1} A ${radius} ${radius} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`, color: m.color });
    labels.push({ x: c + radius * 0.65 * Math.cos(mid), y: c + radius * 0.65 * Math.sin(mid), emoji: m.emoji });
    angle = end;
  });

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="mb-3 text-[18px] font-semibold text-foreground">Mood breakdown</h2>
      <div className="flex items-center gap-4">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-[120px] shrink-0 sm:w-[140px]" role="img" aria-label="Mood distribution">
          {/* A single mood at 100% is a zero-length arc that draws nothing
              (pre-existing bug) — draw a full circle for that case. */}
          {slices.length === 1
            ? <circle cx={c} cy={c} r={radius} fill={slices[0].color} fillOpacity="0.85" />
            : slices.map((s, i) => <path key={i} d={s.d} fill={s.color} fillOpacity="0.85" />)}
          <circle cx={c} cy={c} r={40} fill="#FFFFFF" />
          {labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central" fontSize="20">{l.emoji}</text>
          ))}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {MOODS.map((m) => {
            const count = moodBreakdown[m.score] || 0;
            const pct = Math.round((count / total) * 100);
            return (
              <li key={m.score} className="flex items-center gap-2 text-[13px]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} aria-hidden="true" />
                <span className="flex-1 truncate text-foreground">{m.label}</span>
                <span className="shrink-0 text-muted-foreground">{count}</span>
                <span className="w-10 shrink-0 text-right font-semibold text-foreground">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

export default React.memo(MoodBreakdown);
