import React from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   LOTUS MARK — the SoulConnect lotus as a quiet decorative layer for the
   logged-in app (Home header, empty states). Pure SVG, no WebGL, no React
   state: it can't re-render per frame, shift layout or flicker.

   Always decorative: aria-hidden + pointer-events:none, and callers position
   it absolutely so it never takes part in document flow. The slow float
   stops entirely under prefers-reduced-motion.
───────────────────────────────────────────────────────────────────────────── */
const OUTER = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

function LotusMark({ size = 160, className = '', style }) {
  // Per-instance gradient ids: SVG <defs> are document-global, and an id
  // defined inside a display:none instance can't paint another instance.
  const uid = React.useId().replace(/:/g, '');
  const petal = `scLotusPetal${uid}`, petalIn = `scLotusPetalIn${uid}`, core = `scLotusCore${uid}`;
  return (
    <div
      className={`sc-lotus ${className}`}
      aria-hidden="true"
      style={{ width: size, height: size, pointerEvents: 'none', ...style }}
    >
      <style>{`
        @keyframes scLotusFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .sc-lotus svg { animation: scLotusFloat 9s ease-in-out infinite; display: block; }
        @media (prefers-reduced-motion: reduce) { .sc-lotus svg { animation: none; } }
      `}</style>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id={petal} cx="50%" cy="85%" r="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#D9CCF4" />
            <stop offset="100%" stopColor="#A794E3" />
          </radialGradient>
          <radialGradient id={petalIn} cx="50%" cy="85%" r="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C7B8EE" />
          </radialGradient>
          <radialGradient id={core} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D6" />
            <stop offset="60%" stopColor="#F2C46B" />
            <stop offset="100%" stopColor="#E0A63E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="62" fill="#E5DDF5" opacity="0.55" />
        {OUTER.map((d) => (
          <ellipse key={`o${d}`} cx="100" cy="62" rx="15" ry="38" fill={`url(#${petal})`}
            opacity="0.9" transform={`rotate(${d} 100 100)`} />
        ))}
        {INNER.map((d) => (
          <ellipse key={`i${d}`} cx="100" cy="72" rx="11" ry="27" fill={`url(#${petalIn})`}
            opacity="0.95" transform={`rotate(${d} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="20" fill={`url(#${core})`} />
        <circle cx="100" cy="100" r="6" fill="#FFF8E6" />
      </svg>
    </div>
  );
}

export default React.memo(LotusMark);
