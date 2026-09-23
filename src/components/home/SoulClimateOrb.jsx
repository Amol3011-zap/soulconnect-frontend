/* ─────────────────────────────────────────────────────────────────────────────
   SOUL CLIMATE ORB  (premium 3-D glass sphere) — extracted verbatim from Home.jsx
   NOTE: this is a decorative illustration, unrelated to and not part of the
   protected SoulClimateWidget component. Currently unreferenced in Home.jsx's
   JSX output (dead code, flagged in the Phase 1/2 audit — left as-is, not
   deleted, per the zero-behavior-change constraint on this refactor).
───────────────────────────────────────────────────────────────────────────── */
export default function SoulClimateOrb() {
  return (
    <div className="orb-float" style={{ position: 'relative', width: 220, height: 220, flexShrink: 0 }}>
      {/* Ambient halo */}
      <div style={{
        position: 'absolute', inset: -28,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.28) 0%, transparent 68%)',
        filter: 'blur(12px)',
      }} />
      {/* Ground reflection */}
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 18,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.45) 0%, transparent 70%)',
        filter: 'blur(6px)',
      }} />

      <svg viewBox="0 0 220 220" width="220" height="220" style={{ filter: 'drop-shadow(0 0 36px rgba(139,92,246,0.65))' }}>
        <defs>
          <radialGradient id="orbBase" cx="36%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#DDD6FE" stopOpacity="0.96" />
            <stop offset="30%"  stopColor="#8B5CF6" stopOpacity="0.88" />
            <stop offset="70%"  stopColor="#4C1D95" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1A0A3E" stopOpacity="0.97" />
          </radialGradient>
          <radialGradient id="cloudFill" cx="50%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#EDE9FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </radialGradient>
          <radialGradient id="orbFloor" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="rgba(168,85,247,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="cloudBlur">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="orbClip">
            <circle cx="110" cy="110" r="94" />
          </clipPath>
        </defs>

        {/* Main sphere */}
        <circle cx="110" cy="110" r="96" fill="url(#orbBase)" />

        {/* Inner rim glow */}
        <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(196,181,253,0.25)" strokeWidth="1.5" />

        {/* Specular highlight (top-left) */}
        <ellipse cx="82" cy="72" rx="30" ry="20" fill="rgba(255,255,255,0.22)" transform="rotate(-15,82,72)" />
        <ellipse cx="75" cy="65" rx="12" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-15,75,65)" />

        {/* Floor gradient inside */}
        <ellipse cx="110" cy="196" rx="70" ry="20" fill="url(#orbFloor)" clipPath="url(#orbClip)" />

        {/* Cloud body */}
        <g filter="url(#cloudBlur)" clipPath="url(#orbClip)">
          <circle cx="95"  cy="128" r="20" fill="url(#cloudFill)" opacity="0.95" />
          <circle cx="113" cy="118" r="25" fill="#D8B4FE" opacity="0.9" />
          <circle cx="133" cy="125" r="18" fill="url(#cloudFill)" opacity="0.9" />
          <rect x="76" y="126" width="76" height="22" rx="11" fill="#D8B4FE" opacity="0.95" />
        </g>

        {/* Cloud face */}
        <circle cx="108" cy="119" r="3.5" fill="#5B21B6" />
        <circle cx="120" cy="119" r="3.5" fill="#5B21B6" />
        <path d="M107 128 Q114 135 122 128" stroke="#5B21B6" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Stars/sparkles */}
        <g filter="url(#softGlow)" fill="#F4C542">
          <circle cx="52"  cy="52"  r="3" opacity="0.9" />
          <circle cx="168" cy="40"  r="2" opacity="0.7" />
          <circle cx="172" cy="82"  r="2.5" opacity="0.6" />
          <circle cx="44"  cy="150" r="2" opacity="0.5" />
          <circle cx="178" cy="155" r="1.8" opacity="0.5" />
        </g>
        {/* Star cross at top-left */}
        <g fill="#F4C542" opacity="0.85" filter="url(#softGlow)">
          <rect x="47"  y="42" width="1.5" height="8" rx="1" transform="rotate(0,47,46)" />
          <rect x="47"  y="42" width="1.5" height="8" rx="1" transform="rotate(90,47,46)" />
        </g>

        {/* Platform glow */}
        <ellipse cx="110" cy="200" rx="58" ry="10" fill="rgba(139,92,246,0.45)" />
        <ellipse cx="110" cy="200" rx="36" ry="6"  fill="rgba(168,85,247,0.65)" />
      </svg>
    </div>
  );
}
