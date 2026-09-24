import React, { useId } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Soul Climate illustration system — soft 3D-style mood characters (inline
   SVG, no image assets) and the small scenes they sit in after check-in.
   Characters: viewBox 100×100. Scenes: viewBox 200×150.
───────────────────────────────────────────────────────────────────────────── */

const INK = '#2B1B12';

// Shared face parts -----------------------------------------------------------
function Eye({ x, y, rx = 5, ry = 6.5 }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} />
      <circle cx={x - rx * 0.35} cy={y - ry * 0.4} r={rx * 0.42} fill="#fff" />
      <circle cx={x + rx * 0.3} cy={y + ry * 0.35} r={rx * 0.16} fill="#fff" opacity="0.8" />
    </g>
  );
}
const Blush = ({ x, y, c = '#FF8FA3' }) => <ellipse cx={x} cy={y} rx="6.5" ry="3.8" fill={c} opacity="0.55" />;
const Shine = ({ x, y, rx, ry, o = 0.55 }) => <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity={o} />;
const Ground = () => <ellipse cx="50" cy="93" rx="30" ry="4.5" fill="#3B2A10" opacity="0.13" />;

function Clear({ g }) {
  return (
    <>
      <defs>
        <linearGradient id={`${g}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFEE8A" /><stop offset="0.55" stopColor="#FFD43B" /><stop offset="1" stopColor="#F2A712" /></linearGradient>
        <radialGradient id={`${g}s`} cx="0.3" cy="0.2" r="0.8"><stop offset="0" stopColor="#FFFBE0" stopOpacity="0.9" /><stop offset="0.5" stopColor="#FFFBE0" stopOpacity="0" /></radialGradient>
      </defs>
      <Ground />
      <rect x="13" y="15" width="74" height="74" rx="24" fill={`url(#${g}b)`} />
      <rect x="13" y="15" width="74" height="74" rx="24" fill={`url(#${g}s)`} />
      <Shine x={32} y={24} rx={11} ry={5} />
      <path d="M31 38 q6 -5 12 -1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M57 37 q6 -4 12 1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Eye x={37} y={49} /><Eye x={63} y={49} />
      <Blush x={25} y={62} /><Blush x={75} y={62} />
      <path d="M38 61 Q50 60 62 61 Q61 78 50 78 Q39 78 38 61Z" fill="#5B1F12" />
      <path d="M43 72 Q50 67 57 72 Q55 78 50 78 Q45 78 43 72Z" fill="#FF6B6B" />
    </>
  );
}

function Hope({ g }) {
  return (
    <>
      <defs>
        <linearGradient id={`${g}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFC56E" /><stop offset="0.55" stopColor="#FF9A3D" /><stop offset="1" stopColor="#EC6A1B" /></linearGradient>
        <radialGradient id={`${g}s`} cx="0.3" cy="0.2" r="0.8"><stop offset="0" stopColor="#FFF1DC" stopOpacity="0.85" /><stop offset="0.5" stopColor="#FFF1DC" stopOpacity="0" /></radialGradient>
      </defs>
      <Ground />
      <rect x="13" y="15" width="74" height="74" rx="24" fill={`url(#${g}b)`} />
      <rect x="13" y="15" width="74" height="74" rx="24" fill={`url(#${g}s)`} />
      <Shine x={32} y={24} rx={11} ry={5} />
      <path d="M30 36 q7 -6 13 -2" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M57 34 q7 -4 13 2" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Eye x={37} y={47} /><Eye x={63} y={47} />
      <Blush x={24} y={60} c="#FF7A7A" /><Blush x={76} y={60} c="#FF7A7A" />
      <path d="M34 58 Q50 57 66 58 Q64 80 50 80 Q36 80 34 58Z" fill="#5B1F12" />
      <path d="M36 58.5 Q50 58 64 58.5 L63 62 Q50 63 37 62Z" fill="#fff" />
      <path d="M41 73 Q50 66 59 73 Q57 80 50 80 Q43 80 41 73Z" fill="#FF6B6B" />
    </>
  );
}

function Blooming({ g }) {
  const petals = Array.from({ length: 9 }, (_, i) => (i * 360) / 9);
  return (
    <>
      <defs>
        <radialGradient id={`${g}b`} cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#FFD3E6" /><stop offset="0.6" stopColor="#FF9CC9" /><stop offset="1" stopColor="#EC6AA6" /></radialGradient>
        <radialGradient id={`${g}p`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFE3EF" /><stop offset="1" stopColor="#F58CBE" /></radialGradient>
      </defs>
      <Ground />
      {petals.map((a) => (
        <circle key={a} cx={50 + 30 * Math.cos((a * Math.PI) / 180)} cy={52 + 28 * Math.sin((a * Math.PI) / 180)} r="15" fill={`url(#${g}p)`} />
      ))}
      <circle cx="50" cy="52" r="32" fill={`url(#${g}b)`} />
      <Shine x={36} y={33} rx={10} ry={5} o={0.6} />
      <path d="M33 51 q5 5 10 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M57 51 q5 5 10 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <Blush x={30} y={60} c="#FF6FA0" /><Blush x={70} y={60} c="#FF6FA0" />
      <path d="M45 62 q5 5 10 0" stroke="#7A1E48" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  );
}

function Fog({ g }) {
  return (
    <>
      <defs>
        <radialGradient id={`${g}b`} cx="0.38" cy="0.3" r="0.8"><stop offset="0" stopColor="#F1EDFF" /><stop offset="0.55" stopColor="#CFC6F4" /><stop offset="1" stopColor="#A597DF" /></radialGradient>
        <linearGradient id={`${g}k`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFCB5C" /><stop offset="1" stopColor="#F59E1B" /></linearGradient>
      </defs>
      <Ground />
      <path d="M50 12 C74 12 88 28 88 52 C88 76 72 90 50 90 C28 90 12 76 12 52 C12 28 26 12 50 12Z" fill={`url(#${g}b)`} />
      <circle cx="30" cy="22" r="9" fill="#E7E1FB" /><circle cx="44" cy="15" r="9" fill="#EEEAFD" /><circle cx="60" cy="16" r="8" fill="#E7E1FB" />
      <Shine x={34} y={30} rx={9} ry={4.5} o={0.6} />
      <Eye x={37} y={46} rx={4.5} ry={5.5} /><Eye x={63} y={46} rx={4.5} ry={5.5} />
      <Blush x={25} y={58} /><Blush x={75} y={58} />
      <path d="M36 57 Q50 51 64 57 Q60 64 50 64 Q40 64 36 57Z" fill={`url(#${g}k)`} />
      <path d="M38 60 Q50 72 62 60 Q58 67 50 67 Q42 67 38 60Z" fill="#E88A12" />
    </>
  );
}

function HeavyRain({ g }) {
  return (
    <>
      <defs>
        <linearGradient id={`${g}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B7EE8E" /><stop offset="0.55" stopColor="#7ED05A" /><stop offset="1" stopColor="#4FAE3A" /></linearGradient>
        <radialGradient id={`${g}s`} cx="0.3" cy="0.2" r="0.8"><stop offset="0" stopColor="#F2FFE6" stopOpacity="0.8" /><stop offset="0.5" stopColor="#F2FFE6" stopOpacity="0" /></radialGradient>
      </defs>
      <Ground />
      <path d="M22 26 Q24 14 38 15 Q50 10 62 15 Q76 14 78 26 Q90 40 86 62 Q84 88 50 89 Q16 88 14 62 Q10 40 22 26Z" fill={`url(#${g}b)`} />
      <path d="M22 26 Q24 14 38 15 Q50 10 62 15 Q76 14 78 26 Q90 40 86 62 Q84 88 50 89 Q16 88 14 62 Q10 40 22 26Z" fill={`url(#${g}s)`} />
      <Shine x={34} y={24} rx={10} ry={4.5} />
      <path d="M29 40 q7 -2 13 3" stroke="#23420F" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M58 43 q6 -5 13 -3" stroke="#23420F" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M31 51 q6 -5 12 0" stroke="#23420F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M57 51 q6 -5 12 0" stroke="#23420F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <Blush x={26} y={60} c="#F08080" /><Blush x={74} y={60} c="#F08080" />
      <path d="M42 68 q8 -6 16 0" stroke="#23420F" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  );
}

function Storm({ g }) {
  return (
    <>
      <defs>
        <radialGradient id={`${g}b`} cx="0.38" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.65" stopColor="#F4F0EA" /><stop offset="1" stopColor="#D9D1C5" /></radialGradient>
      </defs>
      <Ground />
      <circle cx="22" cy="26" r="12" fill="#EFEAE2" /><circle cx="22" cy="26" r="6.5" fill="#F4C7C3" />
      <circle cx="78" cy="26" r="12" fill="#EFEAE2" /><circle cx="78" cy="26" r="6.5" fill="#F4C7C3" />
      <ellipse cx="50" cy="54" rx="38" ry="35" fill={`url(#${g}b)`} />
      <Shine x={35} y={31} rx={10} ry={4.5} o={0.8} />
      <Eye x={36} y={50} rx={4.3} ry={5} /><Eye x={64} y={50} rx={4.3} ry={5} />
      <Blush x={25} y={62} c="#F7A5A0" /><Blush x={75} y={62} c="#F7A5A0" />
      <ellipse cx="50" cy="66" rx="13" ry="10" fill="#EFE6D8" />
      <ellipse cx="50" cy="61" rx="5.5" ry="4" fill={INK} />
      <path d="M50 65 v3 M46 70 q4 3 8 0" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

const CHARACTERS = { 'clear-sky': Clear, hope: Hope, blooming: Blooming, fog: Fog, 'heavy-rain': HeavyRain, storm: Storm };

export const MoodCharacter = React.memo(function MoodCharacter({ mood, size = 56, className }) {
  const g = `mc${useId().replace(/:/g, '')}`;
  const C = CHARACTERS[mood] || Clear;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <C g={g} />
    </svg>
  );
});

/* ── Scenes (after check-in) ─────────────────────────────────────────────── */

const Daisy = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <ellipse key={a} cx="0" cy="-4.2" rx="2.1" ry="4" fill="#fff" stroke="#E4D59A" strokeWidth="0.5" transform={`rotate(${a})`} />
    ))}
    <circle r="2.4" fill="#F6C02E" />
  </g>
);
const Cloud = ({ x, y, s = 1, c = '#fff', o = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill={c}>
    <ellipse cx="0" cy="0" rx="16" ry="8" /><circle cx="-6" cy="-5" r="7" /><circle cx="5" cy="-7" r="9" />
  </g>
);
const Blossom = ({ x, y, s = 1, c = '#FF9CC9' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx="0" cy="-3.6" r="3.2" fill={c} transform={`rotate(${a})`} />)}
    <circle r="2" fill="#FFE08A" />
  </g>
);

const SCENES = {
  'clear-sky': { sky: ['#FFF6CF', '#FFE9A3'], hill: ['#CDEB9A', '#9FD36C'], deco: () => (<>
    <circle cx="46" cy="30" r="26" fill="#FFF3B0" opacity="0.7" />
    <Daisy x={26} y={122} s={1.2} /><Daisy x={150} y={126} s={1} /><Daisy x={172} y={116} s={1.2} /><Daisy x={40} y={138} s={0.9} /><Daisy x={134} y={140} s={0.8} />
  </>) },
  hope: { sky: ['#FFE8D6', '#E9DDFB'], hill: ['#F6D9C4', '#E6C3AE'], deco: () => (<>
    <Cloud x={36} y={34} s={1.1} /><Cloud x={160} y={26} s={0.8} o={0.8} />
    <g transform="translate(150 58)"><circle r="9" fill="#FFF3C4" opacity="0.7" /><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8Z" fill="#FFC94A" /></g>
  </>) },
  blooming: { sky: ['#FFE6F1', '#F6DDF7'], hill: ['#F9CFE3', '#EFB2D2'], deco: () => (<>
    <Blossom x={28} y={120} s={1.3} /><Blossom x={160} y={124} s={1.1} c="#F7A8D8" /><Blossom x={178} y={110} s={0.9} /><Blossom x={44} y={138} s={0.9} c="#E7A6F0" />
    <Blossom x={30} y={40} s={0.8} c="#FFC1DC" /><Blossom x={166} y={46} s={0.7} c="#F4B6E8" />
  </>) },
  fog: { sky: ['#F1EFF8', '#E3E0EF'], hill: ['#E1DDEE', '#CFCAE3'], deco: () => (<>
    <Cloud x={34} y={40} s={1.2} c="#FFFFFF" o={0.85} /><Cloud x={164} y={32} s={1} c="#FFFFFF" o={0.75} />
    <rect x="0" y="92" width="200" height="12" fill="#fff" opacity="0.35" /><rect x="0" y="110" width="200" height="9" fill="#fff" opacity="0.3" />
  </>) },
  'heavy-rain': { sky: ['#E3ECFC', '#E6E1FA'], hill: ['#D3DDF4', '#BCC9EC'], deco: () => (<>
    <Cloud x={40} y={26} s={1.1} c="#FFFFFF" o={0.9} /><Cloud x={160} y={22} s={0.9} c="#FFFFFF" o={0.85} />
    {[[20, 50], [34, 70], [168, 52], [182, 76], [150, 84], [16, 92]].map(([x, y]) => (
      <path key={`${x}-${y}`} d={`M${x} ${y} l-3 8`} stroke="#8EA8E8" strokeWidth="2" strokeLinecap="round" />
    ))}
    <g transform="translate(100 30) scale(1.18)">
      <path d="M-34 8 Q0 -26 34 8 Q26 4 17 8 Q8 3 0 8 Q-8 3 -17 8 Q-26 4 -34 8Z" fill="#8E7CF0" />
      <path d="M-34 8 Q-20 -18 0 -18 Q-12 -8 -17 8 Q-26 4 -34 8Z" fill="#A99BF5" />
      <path d="M0 -18 V-22" stroke="#6B5BD6" strokeWidth="2" strokeLinecap="round" />
    </g>
  </>) },
  storm: { sky: ['#E6E2F8', '#D5D2F2'], hill: ['#D8D3EE', '#C3BDE6'], deco: () => (<>
    <Cloud x={38} y={30} s={1.2} c="#EEEAFB" o={0.95} /><Cloud x={162} y={26} s={1} c="#EEEAFB" o={0.9} />
    <path d="M168 40 l-6 12 h6 l-5 12 13 -16 h-7 l5 -8z" fill="#FFD166" opacity="0.9" />
  </>) },
};

export const MoodScene = React.memo(function MoodScene({ mood, dark = false }) {
  const g = `ms${useId().replace(/:/g, '')}`;
  const sc = SCENES[mood] || SCENES['clear-sky'];
  const C = CHARACTERS[mood] || Clear;
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${g}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sc.sky[0]} /><stop offset="1" stopColor={sc.sky[1]} /></linearGradient>
        <linearGradient id={`${g}hill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sc.hill[0]} /><stop offset="1" stopColor={sc.hill[1]} /></linearGradient>
      </defs>
      <rect width="200" height="150" fill={`url(#${g}sky)`} opacity={dark ? 0.16 : 1} />
      {sc.deco()}
      <path d="M0 118 Q50 100 100 110 Q150 120 200 104 V150 H0Z" fill={`url(#${g}hill)`} opacity={dark ? 0.35 : 1} />
      <g transform="translate(42 30) scale(1.16)"><C g={`${g}c`} /></g>
    </svg>
  );
});

export const MOOD_META = {
  'clear-sky':  { label: 'Clear',      quote: 'You’re doing better than you think.', score: 9 },
  hope:         { label: 'Hope',       quote: 'There’s still a little light ahead.', score: 7 },
  blooming:     { label: 'Blooming',   quote: 'You’re growing, even when you can’t see it.', score: 9 },
  fog:          { label: 'Fog',        quote: 'You don’t need all the answers today.', score: 5 },
  'heavy-rain': { label: 'Heavy Rain', quote: 'This feeling is heavy, but it will pass.', score: 3 },
  storm:        { label: 'Storm',      quote: 'One moment at a time. You can get through this.', score: 3 },
};
