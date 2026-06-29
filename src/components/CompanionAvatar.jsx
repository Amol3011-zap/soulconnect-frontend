import React from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   CompanionAvatar — Premium floating AI companion orb
   Props: size (number, default 160)
───────────────────────────────────────────────────────── */
export default function CompanionAvatar({ size = 160 }) {
  const c = size / 2;
  const r = size * 0.38;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Ambient outer halo */}
      <div style={{
        position: 'absolute',
        inset: -size * 0.22,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.38) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)',
        filter: 'blur(18px)',
        pointerEvents: 'none',
      }} />

      {/* Pulsing ring 1 */}
      <motion.div
        animate={{ scale: [1, 1.14, 1], opacity: [0.45, 0.1, 0.45] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          border: '1.5px solid rgba(168,85,247,0.4)',
          pointerEvents: 'none',
        }}
      />
      {/* Pulsing ring 2 */}
      <motion.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.25, 0.05, 0.25] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          border: '1px solid rgba(139,92,246,0.25)',
          pointerEvents: 'none',
        }}
      />

      {/* Ground reflection */}
      <div style={{
        position: 'absolute', bottom: -size * 0.08, left: '50%',
        transform: 'translateX(-50%)',
        width: size * 0.65, height: size * 0.1,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.5) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ display: 'block', filter: 'drop-shadow(0 0 32px rgba(139,92,246,0.75))' }}
      >
        <defs>
          <radialGradient id="cAvBase" cx="36%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#DDD6FE" stopOpacity="0.96" />
            <stop offset="28%"  stopColor="#8B5CF6" stopOpacity="0.9" />
            <stop offset="65%"  stopColor="#4C1D95" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#1A0A3E" stopOpacity="0.98" />
          </radialGradient>
          <radialGradient id="cAvFloor" cx="50%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="rgba(168,85,247,0.45)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="cAvEye" cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#FFF3C0" />
            <stop offset="50%"  stopColor="#F4C542" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
          <filter id="cAvGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="cAvSoftGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <clipPath id="cAvClip">
            <circle cx={c} cy={c} r={r} />
          </clipPath>
        </defs>

        {/* Main sphere body */}
        <circle cx={c} cy={c} r={r} fill="url(#cAvBase)" />

        {/* Inner rim glow */}
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(196,181,253,0.22)" strokeWidth="1.5" />

        {/* Specular highlights */}
        <ellipse
          cx={c - r * 0.2} cy={c - r * 0.3}
          rx={r * 0.32} ry={r * 0.2}
          fill="rgba(255,255,255,0.22)"
          transform={`rotate(-16,${c - r * 0.2},${c - r * 0.3})`}
        />
        <ellipse
          cx={c - r * 0.26} cy={c - r * 0.38}
          rx={r * 0.14} ry={r * 0.08}
          fill="rgba(255,255,255,0.36)"
          transform={`rotate(-16,${c - r * 0.26},${c - r * 0.38})`}
        />

        {/* Floor gradient inside */}
        <ellipse
          cx={c} cy={c + r * 0.88}
          rx={r * 0.72} ry={r * 0.18}
          fill="url(#cAvFloor)"
          clipPath="url(#cAvClip)"
        />

        {/* === FACE === */}

        {/* Left eye */}
        <circle
          cx={c - r * 0.22} cy={c - r * 0.06}
          r={r * 0.11}
          fill="url(#cAvEye)"
          filter="url(#cAvGlow)"
          opacity="0.97"
        />
        <circle cx={c - r * 0.22} cy={c - r * 0.06} r={r * 0.055} fill="#FFFBEB" />

        {/* Right eye */}
        <circle
          cx={c + r * 0.22} cy={c - r * 0.06}
          r={r * 0.11}
          fill="url(#cAvEye)"
          filter="url(#cAvGlow)"
          opacity="0.97"
        />
        <circle cx={c + r * 0.22} cy={c - r * 0.06} r={r * 0.055} fill="#FFFBEB" />

        {/* Smile */}
        <path
          d={`M ${c - r * 0.22} ${c + r * 0.16} Q ${c} ${c + r * 0.32} ${c + r * 0.22} ${c + r * 0.16}`}
          stroke="#FDE68A"
          strokeWidth={r * 0.065}
          fill="none"
          strokeLinecap="round"
          filter="url(#cAvGlow)"
        />

        {/* Rosy cheeks */}
        <circle cx={c - r * 0.35} cy={c + r * 0.12} r={r * 0.12} fill="rgba(251,113,133,0.25)" />
        <circle cx={c + r * 0.35} cy={c + r * 0.12} r={r * 0.12} fill="rgba(251,113,133,0.25)" />

        {/* Sparkle dots */}
        <g filter="url(#cAvSoftGlow)" fill="#F4C542">
          <circle cx={c - r * 0.68} cy={c - r * 0.52} r="2.2" opacity="0.85" />
          <circle cx={c + r * 0.62} cy={c - r * 0.58} r="1.8" opacity="0.7" />
          <circle cx={c}            cy={c - r * 0.78} r="2.5" opacity="0.8" />
          <circle cx={c - r * 0.72} cy={c + r * 0.18} r="1.5" opacity="0.6" />
          <circle cx={c + r * 0.7}  cy={c + r * 0.22} r="1.5" opacity="0.6" />
        </g>

        {/* Star crosses */}
        <g fill="#F4C542" opacity="0.8" filter="url(#cAvSoftGlow)">
          <rect x={c - r * 0.68 - 0.7} y={c - r * 0.52 - 3.5} width="1.4" height="7" rx="0.7" />
          <rect x={c - r * 0.68 - 3.5} y={c - r * 0.52 - 0.7} width="7" height="1.4" rx="0.7" />
        </g>

        {/* Platform glow */}
        <ellipse cx={c} cy={c + r * 0.95} rx={r * 0.58} ry={r * 0.1} fill="rgba(139,92,246,0.45)" />
        <ellipse cx={c} cy={c + r * 0.95} rx={r * 0.35} ry={r * 0.06} fill="rgba(168,85,247,0.65)" />
      </svg>
    </div>
  );
}
