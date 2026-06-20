import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const P    = '#6D4AFF';
const LAV  = '#A78BFA';
const GLD  = '#F5B841';
const PNK  = '#F472B6';
const GRN  = '#34C38F';
const DARK = '#120B2E';

const NAV_LINKS = [
  { label: 'About Us',     href: '#vision' },
  { label: 'How It Works', href: '#how' },
  { label: 'For You',      href: '#struggling' },
  { label: 'Resources',    href: '#trust' },
  { label: 'Contact',      href: '#cta' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Hero Illustration — cinematic SVG
   ───────────────────────────────────────────────────────────────────────────── */
function HeroIllustration() {
  const W = 680, H = 660;

  // ── Sacred geometry: Flower-of-Life interconnected nodes ──
  const sgCx = W * 0.52, sgCy = H * 0.42;
  const sgR  = 188;
  const sgPts = [];

  // Center
  sgPts.push([sgCx, sgCy]);
  // Ring 1 — 6 nodes
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    sgPts.push([sgCx + sgR * 0.28 * Math.cos(a), sgCy + sgR * 0.28 * Math.sin(a)]);
  }
  // Ring 2 — 12 nodes
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    sgPts.push([sgCx + sgR * 0.56 * Math.cos(a), sgCy + sgR * 0.56 * Math.sin(a)]);
  }
  // Ring 3 — 18 nodes
  for (let i = 0; i < 18; i++) {
    const a = i * Math.PI / 9;
    sgPts.push([sgCx + sgR * 0.86 * Math.cos(a), sgCy + sgR * 0.86 * Math.sin(a)]);
  }
  // Ring 4 — 24 nodes (outermost)
  for (let i = 0; i < 24; i++) {
    const a = i * Math.PI / 12 + Math.PI / 24;
    sgPts.push([sgCx + sgR * 1.08 * Math.cos(a), sgCy + sgR * 1.08 * Math.sin(a)]);
  }

  // Edges: connect every pair within threshold
  const THRESH = sgR * 0.32;
  const sgEdges = [];
  for (let i = 0; i < sgPts.length; i++) {
    for (let j = i + 1; j < sgPts.length; j++) {
      const dx = sgPts[i][0] - sgPts[j][0];
      const dy = sgPts[i][1] - sgPts[j][1];
      if (Math.sqrt(dx * dx + dy * dy) < THRESH) {
        sgEdges.push([i, j]);
      }
    }
  }

  // Floating particles
  const floats = Array.from({ length: 24 }, (_, i) => ({
    x:   20 + ((i * 43 + i * i * 9) % 630),
    y:   15 + ((i * 57 + i * i * 13) % 610),
    r:   1.1 + (i % 4) * 0.55,
    dur: 3.2 + (i % 5) * 1.0,
    del: i * 0.38,
    col: [LAV, GLD, PNK, '#C4B5FD', '#FDE68A'][i % 5],
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0A0420" />
          <stop offset="30%"  stopColor="#1E0952" />
          <stop offset="60%"  stopColor="#6B2060" />
          <stop offset="82%"  stopColor="#C85A28" />
          <stop offset="100%" stopColor="#F0924A" />
        </linearGradient>
        <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3D1A6E" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#120840" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="sunglow" cx="52%" cy="40%">
          <stop offset="0%"   stopColor="#FBBF24" stopOpacity="1" />
          <stop offset="18%"  stopColor="#F59E0B" stopOpacity="0.7" />
          <stop offset="55%"  stopColor="#D97706" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7C2D6E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgGlow" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="0.7" />
          <stop offset="40%"  stopColor="#A78BFA" stopOpacity="0.3" />
          <stop offset="100%" stopColor={P} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lcenter" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FEF9C3" />
          <stop offset="50%"  stopColor={GLD} />
          <stop offset="100%" stopColor={GLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lpetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#EDE9FE" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.68" />
        </linearGradient>
        <radialGradient id="personglow" cx="50%" cy="55%">
          <stop offset="0%"   stopColor={GLD} stopOpacity="0.55" />
          <stop offset="100%" stopColor={GLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="watermask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="wm">
          <rect x="0" y={H * 0.6} width={W} height={H - H * 0.6} fill="url(#watermask)" />
        </mask>
        <filter id="lglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="persblur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="clipFade" cx="50%" cy="50%">
          <stop offset="60%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="sgMask">
          <ellipse cx={sgCx} cy={sgCy} rx={sgR * 1.12} ry={sgR * 1.12} fill="url(#clipFade)" />
        </mask>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

      {/* Sun glow */}
      <ellipse cx={sgCx} cy={H * 0.38} rx={210} ry={190} fill="url(#sunglow)" />
      <circle  cx={sgCx} cy={H * 0.38} r={34}   fill="#FBBF24" opacity="0.92" />
      <circle  cx={sgCx} cy={H * 0.38} r={22}   fill="#FEF9C3" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = i * (Math.PI * 2 / 16);
        const len = 50 + Math.sin(i * 2.3) * 22;
        return (
          <line key={i}
            x1={sgCx + 36 * Math.cos(a)} y1={H * 0.38 + 36 * Math.sin(a)}
            x2={sgCx + (36 + len) * Math.cos(a)} y2={H * 0.38 + (36 + len) * Math.sin(a)}
            stroke="#FBBF24" strokeWidth={i % 3 === 0 ? 1.5 : 0.7} opacity="0.3" />
        );
      })}

      {/* Sacred geometry glow background */}
      <ellipse cx={sgCx} cy={sgCy} rx={sgR * 1.1} ry={sgR * 1.1} fill="url(#sgGlow)" opacity="0.35" />

      {/* Sacred geometry edges */}
      <g mask="url(#sgMask)">
        <g stroke="#D4B8FF" strokeWidth="0.65" opacity="0.55" fill="none">
          {sgEdges.map(([a, b], i) => (
            <line key={i}
              x1={sgPts[a][0]} y1={sgPts[a][1]}
              x2={sgPts[b][0]} y2={sgPts[b][1]} />
          ))}
        </g>
        {/* Sacred geometry nodes */}
        <g filter="url(#nodeGlow)">
          {sgPts.map(([x, y], i) => {
            const distFromCenter = Math.sqrt((x - sgCx) ** 2 + (y - sgCy) ** 2);
            const fade = 1 - distFromCenter / (sgR * 1.15);
            const isInner = i < 7;
            return (
              <circle key={i} cx={x} cy={y}
                r={isInner ? 2.8 : 1.8}
                fill={isInner ? '#FCD34D' : '#C4B5FD'}
                opacity={Math.max(0.3, fade * 0.9)} />
            );
          })}
        </g>
      </g>

      {/* Mountains back */}
      <path d={`M0,${H*0.58} L80,${H*0.36} L160,${H*0.48} L245,${H*0.3} L330,${H*0.44} L415,${H*0.28} L500,${H*0.42} L580,${H*0.32} L${W},${H*0.47} L${W},${H} L0,${H} Z`}
        fill="#250E50" opacity="0.88" />
      {/* Mountains front */}
      <path d={`M0,${H*0.67} L65,${H*0.5} L150,${H*0.63} L240,${H*0.46} L320,${H*0.59} L400,${H*0.44} L480,${H*0.58} L560,${H*0.49} L${W},${H*0.61} L${W},${H} L0,${H} Z`}
        fill="#16073C" opacity="0.96" />

      {/* Water surface */}
      <rect x="0" y={H * 0.63} width={W} height={H - H * 0.63} fill="url(#water)" />
      {[0.67, 0.72, 0.77, 0.82, 0.87, 0.92].map((y, i) => (
        <line key={i} x1={W * 0.03} y1={H * y} x2={W * 0.97} y2={H * y}
          stroke="rgba(167,139,250,0.08)" strokeWidth="0.9" />
      ))}

      {/* LOTUS */}
      {(() => {
        const lx = sgCx, ly = H * 0.61;
        const outerD = [0, 45, 90, 135, 180, 225, 270, 315];
        const midD   = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
        const innD   = [0, 60, 120, 180, 240, 300];
        return (
          <g filter="url(#lglow)">
            {outerD.map((d, i) => {
              const r = (d - 90) * Math.PI / 180;
              return <ellipse key={i} cx={lx + 86 * Math.cos(r)} cy={ly + 86 * Math.sin(r)}
                rx={15} ry={42} fill="url(#lpetal)" opacity="0.9"
                transform={`rotate(${d},${lx + 86 * Math.cos(r)},${ly + 86 * Math.sin(r)})`} />;
            })}
            {midD.map((d, i) => {
              const r = (d - 90) * Math.PI / 180;
              return <ellipse key={i} cx={lx + 55 * Math.cos(r)} cy={ly + 55 * Math.sin(r)}
                rx={11} ry={30} fill="#DDD6FE" opacity="0.92"
                transform={`rotate(${d},${lx + 55 * Math.cos(r)},${ly + 55 * Math.sin(r)})`} />;
            })}
            {innD.map((d, i) => {
              const r = (d - 90) * Math.PI / 180;
              return <ellipse key={i} cx={lx + 30 * Math.cos(r)} cy={ly + 30 * Math.sin(r)}
                rx={8} ry={17} fill="#F5F3FF" opacity="0.96"
                transform={`rotate(${d},${lx + 30 * Math.cos(r)},${ly + 30 * Math.sin(r)})`} />;
            })}
            <circle cx={lx} cy={ly} r={34} fill="url(#lcenter)" filter="url(#lglow)" />
            <circle cx={lx} cy={ly} r={13} fill={GLD} />
            <circle cx={lx} cy={ly} r={7}  fill="#FEF9C3" />
          </g>
        );
      })()}

      {/* Lotus reflection */}
      <g transform={`translate(0,${2 * H * 0.61 + 14}) scale(1,-1)`} mask="url(#wm)" opacity="0.4">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d, i) => {
          const lx = sgCx, ly = H * 0.61;
          const r = (d - 90) * Math.PI / 180;
          return <ellipse key={i} cx={lx + 86 * Math.cos(r)} cy={ly + 86 * Math.sin(r)}
            rx={15} ry={42} fill="url(#lpetal)"
            transform={`rotate(${d},${lx + 86 * Math.cos(r)},${ly + 86 * Math.sin(r)})`} />;
        })}
        <circle cx={sgCx} cy={H * 0.61} r={13} fill={GLD} />
      </g>

      {/* Meditating woman */}
      <g filter="url(#persblur)" transform={`translate(${sgCx - 36},${H * 0.38})`}>
        <ellipse cx="36" cy="105" rx="52" ry="76" fill="url(#personglow)" />
        <ellipse cx="36" cy="168" rx="44" ry="15" fill="#090318" opacity="0.88" />
        <ellipse cx="12" cy="163" rx="21" ry="11" fill="#100728" opacity="0.82" />
        <ellipse cx="60" cy="163" rx="21" ry="11" fill="#100728" opacity="0.82" />
        <path d="M19,102 Q11,138 15,163 L57,163 Q61,138 53,102 Z" fill="#0E0526" opacity="0.9" />
        <ellipse cx="36" cy="83" rx="17" ry="19" fill="#0E0526" opacity="0.9" />
        <circle cx="36" cy="65" r="7.5" fill="#0B0320" opacity="0.82" />
        <path d="M19,117 Q3,140 17,158" stroke="#0E0526" strokeWidth="7.5" strokeLinecap="round" fill="none" opacity="0.82" />
        <path d="M53,117 Q69,140 55,158" stroke="#0E0526" strokeWidth="7.5" strokeLinecap="round" fill="none" opacity="0.82" />
        <ellipse cx="23" cy="152" rx="7.5" ry="4.5" fill="#0E0526" opacity="0.78" />
        <ellipse cx="49" cy="152" rx="7.5" ry="4.5" fill="#0E0526" opacity="0.78" />
        {/* Third eye */}
        <circle cx="36" cy="78" r="2.8" fill={GLD} opacity="0.72">
          <animate attributeName="opacity" values="0.35;0.9;0.35" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="36" cy="78" r="5" fill={GLD} opacity="0.18">
          <animate attributeName="r" values="4;7;4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.22;0.06;0.22" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Floating particles */}
      {floats.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.45">
          <animate attributeName="cy" values={`${p.y};${p.y - 15};${p.y}`} dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.65;0.25" dur={`${p.dur * 0.9}s`} begin={`${p.del}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Vision Lotus SVG — center column of Our Vision section
   ───────────────────────────────────────────────────────────────────────────── */
function VisionLotus() {
  const W = 220, H = 220;
  const cx = W / 2, cy = H / 2;
  const outerD = [0, 45, 90, 135, 180, 225, 270, 315];
  const midD   = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  const innD   = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <radialGradient id="vlcenter" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FEF9C3" />
          <stop offset="40%"  stopColor={GLD} />
          <stop offset="100%" stopColor={GLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vlpetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#EDE9FE" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6" />
        </linearGradient>
        <filter id="vlglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="vlouterGlow" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#A78BFA" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer glow */}
      <ellipse cx={cx} cy={cy} rx={95} ry={95} fill="url(#vlouterGlow)" />
      {/* Petals */}
      <g filter="url(#vlglow)">
        {outerD.map((d, i) => {
          const r = (d - 90) * Math.PI / 180;
          return <ellipse key={i} cx={cx + 68 * Math.cos(r)} cy={cy + 68 * Math.sin(r)}
            rx={10} ry={32} fill="url(#vlpetal)" opacity="0.88"
            transform={`rotate(${d},${cx + 68 * Math.cos(r)},${cy + 68 * Math.sin(r)})`} />;
        })}
        {midD.map((d, i) => {
          const r = (d - 90) * Math.PI / 180;
          return <ellipse key={i} cx={cx + 44 * Math.cos(r)} cy={cy + 44 * Math.sin(r)}
            rx={8} ry={22} fill="#DDD6FE" opacity="0.92"
            transform={`rotate(${d},${cx + 44 * Math.cos(r)},${cy + 44 * Math.sin(r)})`} />;
        })}
        {innD.map((d, i) => {
          const r = (d - 90) * Math.PI / 180;
          return <ellipse key={i} cx={cx + 24 * Math.cos(r)} cy={cy + 24 * Math.sin(r)}
            rx={6} ry={13} fill="#F5F3FF" opacity="0.96"
            transform={`rotate(${d},${cx + 24 * Math.cos(r)},${cy + 24 * Math.sin(r)})`} />;
        })}
        <circle cx={cx} cy={cy} r={26} fill="url(#vlcenter)" />
        <circle cx={cx} cy={cy} r={11} fill={GLD}>
          <animate attributeName="r" values="9;13;9" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={6}  fill="#FEF9C3" />
      </g>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={90} stroke="#A78BFA" strokeWidth="0.7" fill="none" opacity="0.3"
        strokeDasharray="4 6" />
      <circle cx={cx} cy={cy} r={100} stroke={GLD} strokeWidth="0.5" fill="none" opacity="0.18"
        strokeDasharray="2 8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   People Sunset SVG — right side of Early Access section
   ───────────────────────────────────────────────────────────────────────────── */
function PeopleSunset() {
  return (
    <svg viewBox="0 0 320 380" style={{ width: '100%', height: '100%' }} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="psSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0D0626" />
          <stop offset="40%"  stopColor="#3B1070" />
          <stop offset="70%"  stopColor="#8B2E5E" />
          <stop offset="100%" stopColor="#E87040" />
        </linearGradient>
        <radialGradient id="psSun" cx="50%" cy="48%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="0.9" />
          <stop offset="30%"  stopColor="#F59E0B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B2E5E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="psWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3D1A6E" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#120840" />
        </linearGradient>
      </defs>
      <rect width="320" height="380" fill="url(#psSky)" />
      <ellipse cx="160" cy="182" rx="130" ry="110" fill="url(#psSun)" />
      <circle  cx="160" cy="182" r="26" fill="#FCD34D" opacity="0.85" />
      <circle  cx="160" cy="182" r="16" fill="#FEF9C3" />
      {/* Mountains */}
      <path d="M0,250 L55,185 L110,225 L165,175 L220,215 L275,185 L320,220 L320,380 L0,380Z"
        fill="#1A0840" opacity="0.9" />
      {/* Water */}
      <rect x="0" y="270" width="320" height="110" fill="url(#psWater)" />
      {[0.75, 0.81, 0.87, 0.93].map((y, i) => (
        <line key={i} x1="10" y1={380 * y} x2="310" y2={380 * y}
          stroke="rgba(167,139,250,0.1)" strokeWidth="0.8" />
      ))}
      {/* Silhouette people — group sitting together */}
      {[
        { x: 100, s: 1.05 },
        { x: 136, s: 0.95 },
        { x: 168, s: 1.0  },
        { x: 200, s: 1.1  },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x},265) scale(${p.s})`}>
          {/* Head */}
          <circle cx="0" cy="-38" r="8" fill="#0A0320" />
          {/* Body */}
          <path d="M-9,-30 Q-12,0 -10,16 L10,16 Q12,0 9,-30 Z" fill="#0A0320" />
          {/* Sitting legs */}
          <path d="M-10,14 Q-18,22 -14,28 L14,28 Q18,22 10,14 Z" fill="#0A0320" />
        </g>
      ))}
      {/* Ground platform */}
      <ellipse cx="155" cy="280" rx="90" ry="8" fill="#0A0320" opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Landing Page
   ───────────────────────────────────────────────────────────────────────────── */
export default function Landing() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [earlyForm,     setEarlyForm]     = useState({ challenge: '', name: '', email: '' });
  const [earlySubmitted, setEarlySubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    [
      ['sc-pjs',   'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'],
      ['sc-pfair', 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'],
    ].forEach(([id, href]) => {
      if (!document.getElementById(id)) {
        const l = document.createElement('link');
        l.id = id; l.rel = 'stylesheet'; l.href = href;
        document.head.appendChild(l);
      }
    });
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const F  = "'Plus Jakarta Sans',Inter,-apple-system,sans-serif";
  const SF = '"Playfair Display",Georgia,serif';

  const handleEarlySubmit = (e) => {
    e.preventDefault();
    if (earlyForm.email && earlyForm.name) setEarlySubmitted(true);
  };

  return (
    <div style={{ fontFamily: F, background: '#F8F5FF', color: DARK, overflowX: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-13px)}}
        @keyframes pulse{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-11px)}}
        .fade-up{animation:fadeUp 0.85s ease both;}
        .float{animation:floatY 7s ease-in-out infinite;}

        /* Buttons */
        .btn-primary{
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 28px;border-radius:14px;font-size:15px;font-weight:700;
          background:linear-gradient(135deg,${P},#5B3CE8);
          color:#fff;border:none;cursor:pointer;text-decoration:none;
          box-shadow:0 6px 24px rgba(109,74,255,0.42);
          transition:all 0.22s ease;font-family:inherit;
        }
        .btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(109,74,255,0.54);}
        .btn-ghost{
          display:inline-flex;align-items:center;gap:9px;
          padding:13px 28px;border-radius:14px;font-size:15px;font-weight:700;
          background:rgba(255,255,255,0.12);
          color:#fff;border:1.5px solid rgba(255,255,255,0.3);
          cursor:pointer;text-decoration:none;
          backdrop-filter:blur(8px);
          transition:all 0.22s ease;font-family:inherit;
        }
        .btn-ghost:hover{background:rgba(255,255,255,0.22);transform:translateY(-2px);}

        /* Cards */
        .struggle-card{
          background:#fff;border-radius:18px;padding:24px 14px 20px;
          border:1.5px solid rgba(109,74,255,0.07);
          box-shadow:0 3px 16px rgba(109,74,255,0.05);
          text-align:center;cursor:default;
          transition:all 0.24s ease;
        }
        .struggle-card:hover{
          transform:translateY(-5px);
          box-shadow:0 14px 38px rgba(109,74,255,0.15);
          border-color:rgba(109,74,255,0.25);
        }
        .help-card{
          background:#fff;border-radius:18px;padding:22px 16px;
          border:1.5px solid rgba(109,74,255,0.07);
          box-shadow:0 3px 16px rgba(109,74,255,0.05);
          transition:all 0.22s ease;
        }
        .help-card:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(109,74,255,0.13);}

        /* Nav */
        .nav-link{
          color:rgba(255,255,255,0.75);font-size:14px;font-weight:500;
          text-decoration:none;padding:7px 13px;border-radius:8px;
          transition:all 0.18s;white-space:nowrap;
        }
        .nav-link:hover{color:#fff;background:rgba(255,255,255,0.1);}

        /* Form */
        select,input[type=text],input[type=email]{
          width:100%;padding:13px 16px;border-radius:12px;
          border:1.5px solid rgba(255,255,255,0.22);
          background:rgba(255,255,255,0.1);
          color:#fff;font-size:14px;font-family:inherit;
          outline:none;transition:border 0.2s;
          backdrop-filter:blur(8px);
        }
        select:focus,input[type=text]:focus,input[type=email]:focus{
          border-color:rgba(255,255,255,0.55);
        }
        select option{background:#2D1060;color:#fff;}
        input::placeholder{color:rgba(255,255,255,0.5);}
        select{appearance:none;-webkit-appearance:none;}

        /* Responsive */
        @media(max-width:1000px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-illus{height:360px!important;order:-1;}
          .hero-text{text-align:center;align-items:center!important;}
          .hero-pills{justify-content:center!important;}
          .hero-btns{justify-content:center!important;}
          .two-col{grid-template-columns:1fr!important;}
          .three-col{grid-template-columns:1fr!important;}
          .struggle-grid{grid-template-columns:repeat(3,1fr)!important;}
          .help-grid{grid-template-columns:repeat(3,1fr)!important;}
          .steps-row{flex-direction:column!important;gap:20px!important;}
          .step-arrow{transform:rotate(90deg)!important;}
          .vision-lotus{display:none!important;}
          .trust-row{flex-wrap:wrap!important;gap:18px!important;}
          .desktop-nav{display:none!important;}
          .desktop-btns{display:none!important;}
          .mob-ham{display:flex!important;}
          .hero-section{min-height:auto!important;padding-top:84px!important;padding-bottom:40px!important;}
          .nav-logo-sub{display:none!important;}
          .early-right{display:none!important;}
        }
        @media(max-width:640px){
          .struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
          .help-grid{grid-template-columns:repeat(2,1fr)!important;}
          .trust-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:16px!important;}
        }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 66,
        background: scrolled ? 'rgba(13,6,38,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(109,74,255,0.16)' : 'none',
        transition: 'all 0.32s ease',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', width: '100%', padding: '0 clamp(16px,3vw,52px)', display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${P},${LAV})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: `0 3px 14px rgba(109,74,255,0.42)` }}>🪷</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Soul<span style={{ color: LAV }}>Connect</span></div>
              <div className="nav-logo-sub" style={{ fontSize: 9, color: LAV, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', marginTop: 2 }}>Heal · Connect · Grow</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="desktop-btns" style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <Link to="/login"
              style={{ padding: '8px 18px', borderRadius: 11, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.82)', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14, borderRadius: 11 }}>Find My Circle 💜</Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(v => !v)} className="mob-ham"
            style={{ display: 'none', marginLeft: 'auto', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 18, height: 2, background: '#fff', borderRadius: 2, display: 'block' }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(13,6,38,0.95)', backdropFilter: 'blur(12px)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 66, left: 0, right: 0, padding: '16px 24px', borderBottom: `1px solid rgba(109,74,255,0.18)` }} onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '13px 0', fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{l.label}</a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 11, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)' }}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 11, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg,${P},#5B3CE8)` }}>Find My Circle</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══ SECTION 1 — HERO ════════════════════════════════════════════════════ */}
      <section id="hero" className="hero-section" style={{
        background: `linear-gradient(150deg,#0A0420 0%,#190840 38%,#2A1060 68%,#170840 100%)`,
        minHeight: 820,
        paddingTop: 'clamp(80px,10vw,108px)',
        paddingBottom: 'clamp(48px,6vw,80px)',
        paddingLeft: 'clamp(16px,4vw,68px)',
        paddingRight: 'clamp(16px,4vw,68px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Bg orbs */}
        <div style={{ position: 'absolute', top: '-8%', right: '4%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,rgba(109,74,255,0.22) 0%,transparent 70%)', pointerEvents: 'none', animation: 'orb 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-4%', left: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div className="hero-grid" style={{ maxWidth: 1340, margin: '0 auto', display: 'grid', gridTemplateColumns: '52fr 48fr', gap: 'clamp(24px,4vw,68px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* LEFT — Text */}
          <div className="hero-text fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {/* Live badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(109,74,255,0.22)', border: '1px solid rgba(167,139,250,0.32)', borderRadius: 99, padding: '6px 15px', marginBottom: 22 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: GLD, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ color: LAV, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Now Live · Join Our Community</span>
            </div>

            <h1 style={{ fontFamily: SF, fontSize: 'clamp(2.6rem,4.4vw,5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.07, letterSpacing: '-0.03em', marginBottom: 18 }}>
              You Don't Have To<br />
              Go Through It Alone.
            </h1>

            <p style={{ fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.85, marginBottom: 26, maxWidth: 470 }}>
              SoulConnect is a safe space to share, connect, and heal with people who truly understand what you're going through.
            </p>

            {/* Feature pills */}
            <div className="hero-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 34 }}>
              {[
                { icon: '♡', text: 'Real Connections' },
                { icon: '🛡', text: 'Safe Community' },
                { icon: '🧠', text: 'Emotional Support' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 99, padding: '7px 15px' }}>
                  <span style={{ fontSize: 14 }}>{t.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>{t.text}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 13 }}>
              <Link to="/signup" className="btn-primary">Find My Circle 💜</Link>
              <a href="#how" className="btn-ghost">
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</span>
                Learn More
              </a>
            </div>
          </div>

          {/* RIGHT — Illustration */}
          <div className="hero-illus float" style={{ height: 'clamp(400px,52vw,680px)', position: 'relative' }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — WHAT ARE YOU STRUGGLING WITH ════════════════════════════ */}
      <section id="struggling" style={{ background: '#fff', padding: 'clamp(60px,8vw,96px) clamp(16px,3vw,68px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: SF, fontSize: 'clamp(1.8rem,2.8vw,2.8rem)', fontWeight: 800, color: DARK, letterSpacing: '-0.025em', marginBottom: 12 }}>
              What are you struggling with?
            </h2>
            <div style={{ width: 44, height: 3, background: `linear-gradient(90deg,${P},${LAV})`, borderRadius: 99, margin: '0 auto' }} />
          </div>

          <div className="struggle-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14, marginBottom: 32 }}>
            {[
              { emoji: '🧠', label: 'Anxiety &\nOverthinking', glow: 'rgba(139,92,246,0.16)', color: '#7C3AED' },
              { emoji: '💔', label: 'Heartbreak',              glow: 'rgba(236,72,153,0.16)',  color: '#DB2777' },
              { emoji: '🌧', label: 'Loneliness',              glow: 'rgba(59,130,246,0.16)',  color: '#2563EB' },
              { emoji: '🕯', label: 'Grief',                   glow: 'rgba(245,184,65,0.18)',  color: '#D97706' },
              { emoji: '🔥', label: 'Burnout',                 glow: 'rgba(249,115,22,0.16)',  color: '#EA580C' },
              { emoji: '🌱', label: 'Life\nTransitions',       glow: 'rgba(52,195,143,0.16)',  color: '#059669' },
            ].map((c, i) => (
              <div key={i} className="struggle-card">
                <div style={{ width: 66, height: 66, borderRadius: 20, background: `radial-gradient(circle,${c.glow},transparent 72%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 12px', boxShadow: `0 0 18px ${c.glow}` }}>{c.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{c.label}</div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 15, color: P, fontWeight: 600 }}>
            You are not alone. Thousands of people are on a similar journey.
          </p>
        </div>
      </section>

      {/* ══ SECTION 3 — HEALING STARTS WITH CONNECTION ══════════════════════════ */}
      <section id="how" style={{ background: '#F8F5FF', padding: 'clamp(60px,8vw,96px) clamp(16px,3vw,68px)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: SF, fontSize: 'clamp(1.8rem,2.8vw,2.8rem)', fontWeight: 800, color: DARK, letterSpacing: '-0.025em', marginBottom: 12 }}>
              Healing Starts With Connection
            </h2>
            <div style={{ width: 44, height: 3, background: `linear-gradient(90deg,${P},${LAV})`, borderRadius: 99, margin: '0 auto' }} />
          </div>

          <div className="steps-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0 }}>
            {[
              { n: '1', icon: '✍️', title: 'Share Your Journey',   desc: "Express what you're going through in a safe space." },
              { n: '2', icon: '👥', title: 'Find Similar People',  desc: 'We match you with people who understand.' },
              { n: '3', icon: '🫂', title: 'Join Support Circles', desc: 'Join meaningful conversations and support groups.' },
              { n: '4', icon: '🌱', title: 'Grow Together',        desc: 'Heal, learn, and grow together as a community.' },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 6px' }}>
                  <div style={{ position: 'relative', marginBottom: 18 }}>
                    <div style={{ width: 82, height: 82, borderRadius: '50%', background: '#fff', border: `2px solid rgba(109,74,255,0.12)`, boxShadow: '0 5px 22px rgba(109,74,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                      {s.icon}
                    </div>
                    <div style={{ position: 'absolute', top: -5, right: -5, width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg,${P},#5B3CE8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', boxShadow: `0 3px 10px rgba(109,74,255,0.45)` }}>{s.n}</div>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: DARK, marginBottom: 6, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.62, maxWidth: 150 }}>{s.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="step-arrow" style={{ display: 'flex', alignItems: 'center', paddingTop: 30, flexShrink: 0 }}>
                    <svg width="48" height="18" viewBox="0 0 48 18" fill="none">
                      <line x1="2" y1="9" x2="40" y2="9" stroke={LAV} strokeWidth="1.8" strokeDasharray="4 4" />
                      <path d="M36 4 L42 9 L36 14" stroke={LAV} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — OUR VISION ══════════════════════════════════════════════ */}
      <section id="vision" style={{ background: '#F8F5FF', padding: '0 clamp(16px,3vw,68px) clamp(60px,8vw,96px)' }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto',
          background: `linear-gradient(140deg,#180738 0%,#2A0E5A 45%,#180738 100%)`,
          borderRadius: 26, padding: 'clamp(32px,5vw,60px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%,-50%)', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(109,74,255,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 2fr', gap: 'clamp(24px,4vw,48px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {/* LEFT — Text */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: LAV, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>OUR VISION</div>
              <h2 style={{ fontFamily: SF, fontSize: 'clamp(1.6rem,2.6vw,2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.16, letterSpacing: '-0.024em', marginBottom: 16 }}>
                A world where nobody struggles alone.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.84 }}>
                We believe healing happens faster when we feel understood, supported, and connected.
              </p>
            </div>

            {/* CENTER — Lotus */}
            <div className="vision-lotus" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 200, height: 200, animation: 'floatY 10s ease-in-out infinite' }}>
                <VisionLotus />
              </div>
            </div>

            {/* RIGHT — 2×2 icons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { icon: '🤝', label: 'Real Connections',      sub: 'Genuine peer-to-peer support' },
                { icon: '🛡', label: 'Safe & Supportive\nCommunity', sub: 'Moderated with care' },
                { icon: '🔒', label: 'Your Privacy\nMatters', sub: 'Private and secure always' },
                { icon: '🌿', label: 'Healing &\nGrowth',     sub: 'Grow through connection' },
              ].map((f, i) => (
                <div key={i}
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(167,139,250,0.16)', borderRadius: 16, padding: '18px 14px', textAlign: 'center', transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,74,255,0.16)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.36)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.16)'; }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, whiteSpace: 'pre-line', lineHeight: 1.3 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.45 }}>{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — HOW SOULCONNECT HELPS YOU ═══════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(60px,8vw,96px) clamp(16px,3vw,68px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: SF, fontSize: 'clamp(1.8rem,2.8vw,2.8rem)', fontWeight: 800, color: DARK, letterSpacing: '-0.025em', marginBottom: 12 }}>
              How SoulConnect Helps You
            </h2>
            <div style={{ width: 44, height: 3, background: `linear-gradient(90deg,${P},${LAV})`, borderRadius: 99, margin: '0 auto' }} />
          </div>

          {/* 6 cards in ONE row */}
          <div className="help-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
            {[
              { icon: '👥', title: 'Community Matching',  desc: 'Find people who truly understand.' },
              { icon: '🫂', title: 'Support Circles',     desc: 'Join guided conversations.' },
              { icon: '📝', title: 'Healing Journal',     desc: 'Reflect, release & understand yourself.' },
              { icon: '📊', title: 'Mood Tracking',       desc: 'Track your mood and progress.' },
              { icon: '🎯', title: 'Guided Challenges',   desc: 'Build healthy habits step by step.' },
              { icon: '🙏', title: 'Wellness Guides',     desc: 'Learn from trusted wellness experts.' },
            ].map((c, i) => (
              <div key={i} className="help-card" style={{ textAlign: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: `rgba(109,74,255,0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: DARK, marginBottom: 6, lineHeight: 1.35 }}>{c.title}</h3>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                {/* COMING SOON badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `rgba(109,74,255,0.08)`, border: `1.5px solid rgba(109,74,255,0.2)`, borderRadius: 99, padding: '4px 10px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: P, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: '0.07em' }}>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — EARLY ACCESS ════════════════════════════════════════════ */}
      <section id="early" style={{
        background: `linear-gradient(140deg,#180738 0%,#2A0E5A 45%,#4A1C8E 100%)`,
        padding: 'clamp(60px,8vw,96px) clamp(16px,3vw,68px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Particles */}
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${5 + (i * 8.3) % 88}%`, top: `${5 + (i * 11.7) % 85}%`, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: '50%', background: [LAV, GLD, PNK][i % 3], opacity: 0.28, animation: `floatY ${6 + (i % 4) * 1.4}s ease-in-out ${i * 0.5}s infinite`, pointerEvents: 'none' }} />
        ))}

        {/* Right: people illustration */}
        <div className="early-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '32%', overflow: 'hidden', opacity: 0.55, pointerEvents: 'none' }}>
          <PeopleSunset />
        </div>

        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* LEFT */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: GLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>JOIN OUR EARLY COMMUNITY</div>
            <h2 style={{ fontFamily: SF, fontSize: 'clamp(2rem,3.1vw,3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.12, letterSpacing: '-0.028em', marginBottom: 18 }}>
              Find Your Circle.<br />
              We'll walk with you. <span style={{ color: PNK }}>♡</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.84, maxWidth: 400 }}>
              Tell us what you're going through so we can connect you with the right people and resources.
            </p>
          </div>

          {/* RIGHT — Form */}
          <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.11)', borderRadius: 22, padding: 'clamp(22px,3vw,34px)' }}>
            {earlySubmitted ? (
              <div style={{ textAlign: 'center', padding: '18px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>💜</div>
                <h3 style={{ fontFamily: SF, fontSize: 21, fontWeight: 800, color: '#fff', marginBottom: 9 }}>You're on the list!</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>We'll reach out when your circle is ready. Healing begins soon.</p>
              </div>
            ) : (
              <form onSubmit={handleEarlySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.68)' }}>What are you struggling with most?</label>
                <div style={{ position: 'relative' }}>
                  <select value={earlyForm.challenge} onChange={e => setEarlyForm(f => ({ ...f, challenge: e.target.value }))} style={{ paddingRight: 36 }}>
                    <option value="">Select your main challenge</option>
                    {['Anxiety', 'Overthinking', 'Loneliness', 'Breakup', 'Burnout', 'Grief', 'Life Transition'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', pointerEvents: 'none', fontSize: 11 }}>▼</span>
                </div>
                <input type="text" placeholder="Your Name" value={earlyForm.name} onChange={e => setEarlyForm(f => ({ ...f, name: e.target.value }))} required />
                <input type="email" placeholder="Email Address" value={earlyForm.email} onChange={e => setEarlyForm(f => ({ ...f, email: e.target.value }))} required />
                <button type="submit"
                  style={{ marginTop: 3, padding: '14px', borderRadius: 13, background: `linear-gradient(135deg,${P},#5B3CE8)`, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 6px 22px rgba(109,74,255,0.44)`, transition: 'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 34px rgba(109,74,255,0.54)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(109,74,255,0.44)'; }}
                >
                  Join Early Access →
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>🔒 We respect your privacy. No spam ever.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ SECTION 7 — TRUST STRIP ═════════════════════════════════════════════ */}
      <section id="trust" style={{ background: '#fff', borderTop: '1px solid rgba(109,74,255,0.07)', borderBottom: '1px solid rgba(109,74,255,0.07)', padding: 'clamp(18px,2.8vw,26px) clamp(16px,3vw,60px)' }}>
        <div className="trust-row" style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(20px,4vw,50px)', flexWrap: 'wrap' }}>
          {[
            { icon: '🛡', title: 'Safe Community',      sub: 'Moderated with care and compassion.' },
            { icon: '🔒', title: 'Privacy Protected',    sub: 'Your data is private and secure.' },
            { icon: '🚨', title: 'Crisis Resources',     sub: 'Help is always available.' },
            { icon: '📋', title: 'Community Guidelines', sub: 'Respect, kindness & inclusion always.' },
            { icon: '⚖️', title: 'Wellness Standards',   sub: 'Evidence-based and trusted.' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(109,74,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{t.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{t.title}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.38 }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 8 — FINAL CTA ═══════════════════════════════════════════════ */}
      <section id="cta" style={{
        background: `linear-gradient(160deg,#0A0420 0%,#180840 50%,#0A0420 100%)`,
        padding: 'clamp(68px,9vw,116px) clamp(16px,3vw,68px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Lotus watermark */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.04, pointerEvents: 'none', animation: 'floatY 14s ease-in-out infinite' }}>
          <svg viewBox="0 0 300 300" width="460" height="460">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const r = (a - 90) * Math.PI / 180;
              return <ellipse key={i} cx={150 + 100 * Math.cos(r)} cy={150 + 100 * Math.sin(r)} rx={20} ry={56} fill={LAV} transform={`rotate(${a},${150 + 100 * Math.cos(r)},${150 + 100 * Math.sin(r)})`} />;
            })}
            <circle cx="150" cy="150" r="22" fill={GLD} />
          </svg>
        </div>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(109,74,255,0.14) 0%,transparent 70%)', pointerEvents: 'none' }} />
        {/* Particles */}
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${4 + (i * 6.1) % 90}%`, top: `${4 + (i * 8.3) % 90}%`, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: '50%', background: [LAV, GLD, PNK][i % 3], opacity: 0.22, animation: `floatY ${5 + (i % 5) * 1.2}s ease-in-out ${i * 0.45}s infinite`, pointerEvents: 'none' }} />
        ))}

        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, position: 'relative', zIndex: 1 }}>
          {/* Left: lotus + text */}
          <div style={{ maxWidth: 460 }}>
            <div style={{ fontSize: 48, marginBottom: 16, filter: 'drop-shadow(0 0 18px rgba(167,139,250,0.4))' }}>🪷</div>
            <h2 style={{ fontFamily: SF, fontSize: 'clamp(2rem,3.6vw,3.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.028em', marginBottom: 14 }}>
              You Are Not Alone. 💜
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.52)', lineHeight: 1.84 }}>
              Join a community built around connection, support, healing, and personal growth.
            </p>
          </div>

          {/* Right: CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <Link to="/signup" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px', borderRadius: 16 }}>
              Find My Circle 💜
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', textAlign: 'right' }}>Because healing happens together.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
