/* ─────────────────────────────────────────────────────────────────────────────
   CINEMATIC SCENE BACKDROPS — CSS/SVG only, no external image assets.
   Three distinct moods (dusk silhouette / misty peaks / golden sunrise) so
   Soul Story cards read as photographic rather than flat UI panels.
   Extracted verbatim from Home.jsx.
───────────────────────────────────────────────────────────────────────────── */
export default function SceneBackdrop({ scene }) {
  if (scene === 'mountains') {
    return (
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="skyMountains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="55%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="peakFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect width="300" height="200" fill="url(#skyMountains)" />
        {/* Fog band */}
        <rect x="0" y="95" width="300" height="30" fill="rgba(199,210,254,0.12)" />
        {/* Far peaks */}
        <polygon points="0,140 45,80 90,140" fill="url(#peakFar)" />
        <polygon points="70,140 130,60 190,140" fill="url(#peakFar)" />
        <polygon points="160,140 220,85 300,140" fill="url(#peakFar)" />
        {/* Near peaks, darker */}
        <polygon points="-10,200 60,110 140,200" fill="#2E1065" />
        <polygon points="100,200 190,95 300,200" fill="#251057" />
        {/* Moon */}
        <circle cx="235" cy="45" r="16" fill="#EDE9FE" opacity="0.85" />
      </svg>
    );
  }

  if (scene === 'sunrise') {
    return (
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="skySunrise" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="45%" stopColor="#C2410C" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="300" height="200" fill="url(#skySunrise)" />
        <circle cx="150" cy="150" r="90" fill="url(#sunGlow)" />
        <circle cx="150" cy="150" r="34" fill="#FFFBEB" opacity="0.9" />
        {/* Rolling hills, dark silhouette */}
        <path d="M0,175 C60,150 100,185 160,165 C220,148 260,178 300,160 L300,200 L0,200 Z" fill="#431407" />
        <path d="M0,190 C80,175 160,198 300,180 L300,200 L0,200 Z" fill="#2A0B04" />
      </svg>
    );
  }

  // 'sunset' — lone silhouette on a hill, dusk gradient
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="40%" stopColor="#7E22CE" />
          <stop offset="70%" stopColor="#DB2777" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="sunSunset" cx="72%" cy="62%" r="26%">
          <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FED7AA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="200" fill="url(#skySunset)" />
      <circle cx="215" cy="125" r="60" fill="url(#sunSunset)" />
      <circle cx="215" cy="125" r="26" fill="#FFEDD5" opacity="0.9" />
      {/* Ground silhouette */}
      <path d="M0,168 C70,150 120,172 180,158 C230,148 270,166 300,155 L300,200 L0,200 Z" fill="#0F0A2E" />
      {/* Person sitting, knees up, looking out */}
      <g fill="#0A0620">
        <circle cx="95" cy="140" r="8" />
        <path d="M85 148 Q95 143 105 148 L108 168 L100 168 L96 154 L92 168 L84 168 Z" />
      </g>
    </svg>
  );
}
