import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, ArrowRight } from 'lucide-react';
import { pulseAPI } from '../../services/api';
import { PROBLEMS } from '../../data/pulseExperienceData';

/**
 * Global Pulse sidebar card — "You're not alone today."
 *
 * Renders the real aggregated feed from GET /api/pulse/global. That endpoint
 * is already privacy-gated server-side (minimum group-size threshold plus a
 * visibility delay), so anything it returns is safe to show. Nothing here is
 * fabricated: with no qualifying data we render an honest empty state rather
 * than placeholder percentages.
 */

/* Tint per row, cycling the dashboard's accent palette. */
const TINTS = ['#F59E0B', '#A855F7', '#F97316', '#3B82F6', '#EC4899', '#10B981'];

/* The API returns full category names ("Anxiety & Overthinking"). In this
   narrow card we show the leading clause so rows stay on one line; the full
   label is still exposed via the row's title attribute. */
function shortLabel(label) {
  return String(label).split(/\s*&\s*/)[0].trim();
}

function Row({ item, index }) {
  const color = TINTS[index % TINTS.length];
  const emoji = PROBLEMS.find(p => p.id === item.id)?.icon;
  return (
    <li
      title={item.label}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 0',
        borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13,
          background: `linear-gradient(145deg, ${color}D9, ${color}73)`,
          boxShadow: `0 0 10px ${color}59`,
        }}
      >
        {emoji}
      </span>
      <span style={{
        flex: 1, minWidth: 0, fontSize: 13, color: 'rgba(232,229,255,0.88)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {shortLabel(item.label)}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
        {item.percentage}%
      </span>
    </li>
  );
}

/* Dotted world silhouette — decorative, drawn from a coarse land mask.
   Deliberately not a data map: it never encodes counts or locations. */
/* Coarse land mask, 60 x 26. Decorative only: it encodes no counts, no
   check-in locations, and never changes with the data. */
const LAND_ROWS = [
  '000000000000000000000000000000000000000000000000000000000000',
  '000001111111000000000000000011100011111111111111111000000000',
  '000111111111110000000000000111111111111111111111111111000000',
  '001111111111111000000000000011111111111111111111111111110000',
  '011111111111110000000000000011111111111111111111111111111100',
  '001111111111100000000000000001111111111111111111111111111110',
  '000011111111000000000000000000011111011111111111111111111000',
  '000001111110000000000000000000001111111111111111111111000000',
  '000000111100000000000000000000000111111111111111111100000000',
  '000000111000000000000000000000000011111111111111110000000000',
  '000000011000000000000000000000000011111111111111000000000000',
  '000000011000000000000000000000000001111111111100000000000000',
  '000000011100000000000000000000000001111111111000000000000000',
  '000000001110000000000000000000000001111111110000000000000000',
  '000000000111000000000000000000000001111111100000011000000000',
  '000000000111100000000000000000000000111111000000111110000000',
  '000000000011110000000000000000000000111110000001111111100000',
  '000000000011110000000000000000000000111100000011111111110000',
  '000000000001111000000000000000000000011100000011111111111000',
  '000000000001111000000000000000000000011000000001111111110000',
  '000000000001110000000000000000000000011000000000111111000000',
  '000000000001100000000000000000000000010000000000011100000000',
  '000000000001100000000000000000000000000000000000000000000000',
  '000000000000100000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000',
];

/* Fixed decorative flare positions (grid coords). Deliberately NOT derived
   from check-in data — see the card's privacy note. */
const FLARES = [
  { x: 7,  y: 4,  c: '#F472B6' },  // N. America
  { x: 36, y: 3,  c: '#A78BFA' },  // Europe
  { x: 48, y: 5,  c: '#FBBF24' },  // N. Asia
  { x: 44, y: 8,  c: '#60A5FA' },  // S. Asia
  { x: 37, y: 12, c: '#F472B6' },  // Africa
  { x: 13, y: 17, c: '#A78BFA' },  // S. America
  { x: 50, y: 18, c: '#FBBF24' },  // Oceania
];

function DottedMap() {
  const cell = 3.4;
  const w = LAND_ROWS[0].length * cell;
  const h = LAND_ROWS.length * cell;

  const dots = [];
  LAND_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '1') dots.push({ x, y });
    }
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="Stylised world map"
      style={{ display: 'block', marginBottom: 10 }}
    >
      {/* One gradient per flare: `currentColor` inside <defs> resolves against
          the gradient element, not the referencing <g>, so a shared gradient
          would render every flare the same colour. */}
      <defs>
        {FLARES.map((f, i) => (
          <radialGradient key={i} id={`gp-flare-${i}`}>
            <stop offset="0%"   stopColor={f.c} stopOpacity="0.95" />
            <stop offset="45%"  stopColor={f.c} stopOpacity="0.45" />
            <stop offset="100%" stopColor={f.c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x * cell + cell / 2}
          cy={d.y * cell + cell / 2}
          r={0.95}
          fill={i % 9 === 0 ? 'rgba(196,181,253,0.85)' : 'rgba(139,120,205,0.5)'}
        />
      ))}

      {FLARES.map((f, i) => (
        <g key={i}>
          <circle
            cx={f.x * cell + cell / 2}
            cy={f.y * cell + cell / 2}
            r={7}
            fill={`url(#gp-flare-${i})`}
          />
          <circle
            cx={f.x * cell + cell / 2}
            cy={f.y * cell + cell / 2}
            r={1.1}
            fill="#fff"
            opacity="0.9"
          />
        </g>
      ))}
    </svg>
  );
}

export default function GlobalPulseCard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);   // null = loading
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await pulseAPI.getGlobal();
        if (!alive) return;
        const cats = res?.data?.categories;
        setRows(Array.isArray(cats) ? cats.slice(0, 5) : []);
      } catch {
        if (alive) { setFailed(true); setRows([]); }
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="sc-panel" style={{ padding: '14px 14px 10px', marginBottom: 12 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <Globe2 size={17} strokeWidth={2} color="#A78BFA" aria-hidden="true" />
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F5F3FF', letterSpacing: '-0.01em' }}>
          Global Pulse
        </h2>
      </header>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(196,181,253,0.6)' }}>
        You&apos;re not alone today.
      </p>

      <DottedMap />

      {rows === null ? (
        <div aria-hidden="true">
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0' }}>
              <span className="sc-shimmer" style={{ width: 22, height: 22, borderRadius: '50%' }} />
              <span className="sc-shimmer" style={{ flex: 1, height: 10, borderRadius: 5 }} />
            </div>
          ))}
        </div>
      ) : rows.length > 0 ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {rows.map((r, i) => <Row key={r.id || i} item={r} index={i} />)}
        </ul>
      ) : (
        <p style={{ margin: '2px 0 0', fontSize: 12, lineHeight: 1.6, color: 'rgba(196,181,253,0.55)' }}>
          {failed
            ? 'Global Pulse is unavailable right now.'
            : 'Not enough check-ins yet today. Share how you feel to help the picture grow.'}
        </p>
      )}

      <button
        type="button"
        onClick={() => navigate('/pulse')}
        className="sc-link-btn"
        style={{ marginTop: 6 }}
      >
        Explore Global Pulse <ArrowRight size={13} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </section>
  );
}
