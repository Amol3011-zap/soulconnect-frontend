/* ─────────────────────────────────────────────────────────────────────────────
   AI INSIGHT BRAIN SVG  (premium) — extracted verbatim from Home.jsx
   Currently unreferenced in Home.jsx's JSX output (dead code, flagged in the
   Phase 1/2 audit — left as-is, not deleted, per the zero-behavior-change
   constraint on this refactor).
───────────────────────────────────────────────────────────────────────────── */
export default function BrainIllustration() {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: -16,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 65%)',
        filter: 'blur(8px)',
      }} />
      <svg viewBox="0 0 120 120" width="100" height="100" style={{ position: 'relative', filter: 'drop-shadow(0 0 18px rgba(139,92,246,0.6))' }}>
        <defs>
          <radialGradient id="brainG2" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#C4B5FD" />
            <stop offset="60%"  stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3C096C" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="52" rx="38" ry="32" fill="url(#brainG2)" opacity="0.95" />
        <ellipse cx="44" cy="52" rx="22" ry="28" fill="#A78BFA" opacity="0.65" />
        <ellipse cx="76" cy="52" rx="22" ry="28" fill="#8B5CF6" opacity="0.65" />
        <path d="M60 24 Q60 38 60 52" stroke="rgba(196,181,253,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M38 38 Q50 48 38 62" stroke="rgba(196,181,253,0.3)" strokeWidth="1.2" fill="none" />
        <path d="M82 38 Q70 48 82 62" stroke="rgba(196,181,253,0.3)" strokeWidth="1.2" fill="none" />
        <path d="M42 52 Q60 46 78 52" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
        <line x1="60" y1="84" x2="60" y2="100" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="60" cy="104" rx="20" ry="5" fill="rgba(139,92,246,0.3)" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={i} cx={60 + 50 * Math.cos(rad)} cy={60 + 50 * Math.sin(rad)} r="2.5" fill="#F4C542" opacity="0.65" />;
        })}
      </svg>
    </div>
  );
}
