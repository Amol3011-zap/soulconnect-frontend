import React, { useMemo } from 'react';

/**
 * Closing inspiration card.
 *
 * The scene is drawn with CSS gradients + one inline SVG ridge rather than a
 * photograph: the repo ships no nature imagery, and the production CSP blocks
 * external image hosts, so a bitmap here would either bloat the bundle or fail
 * to load. This costs zero network bytes and stays sharp at any density.
 */
const LINES = [
  'Healing is not a destination, it’s a journey.',
  'Small steps still move you forward.',
  'You are allowed to take up space.',
  'Rest is part of the work.',
  'You have survived every hard day so far.',
  'Being gentle with yourself is progress.',
  'Your pace is the right pace.',
];

export default function InspirationCard() {
  // Stable for the whole day rather than reshuffling on every render.
  const line = useMemo(() => LINES[new Date().getDate() % LINES.length], []);

  return (
    <section className="sc-panel rs-card rs-inspire" aria-label="Daily reflection">
      <div className="rs-inspire-scene" aria-hidden="true">
        {/* Ridge line — a single inline path, no asset request. */}
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="rs-inspire-ridge">
          <path
            d="M0,120 L0,74 L38,52 L64,66 L96,38 L128,62 L162,30 L196,58 L232,42 L268,64 L300,48 L300,120 Z"
            fill="rgba(12,7,28,0.82)"
          />
          <path
            d="M0,120 L0,92 L44,74 L82,88 L120,66 L158,86 L200,70 L246,88 L300,72 L300,120 Z"
            fill="rgba(6,4,18,0.92)"
          />
        </svg>
      </div>

      <div className="rs-inspire-body">
        <p className="rs-inspire-quote">{line}</p>
        <span aria-hidden="true" className="rs-inspire-sprout">🌱</span>
      </div>
    </section>
  );
}
