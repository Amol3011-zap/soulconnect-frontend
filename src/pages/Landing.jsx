import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, TrendingUp, Leaf, UserRound, Globe as GlobeIcon,
  // Drawn icons replacing the emoji this page used as UI iconography.
  // Emoji render as a different artwork on every OS (and as full-colour
  // cartoons next to a restrained type palette), which is the single
  // loudest "assembled from a template" tell on the page. Lucide at
  // stroke 1.5 is the house icon set per docs/DESIGN_SYSTEM.md.
  Feather, MessagesSquare, Sprout, HeartCrack, CloudRain, Flame, Wind,
  ShieldCheck, Lock, HandHeart, Handshake, Heart, Ear, MessageCircle,
  Award, Mail, BellOff, LifeBuoy, ScrollText, Scale, Check, Compass, Moon,
} from 'lucide-react';

// Globe3D pulls in three.js (large) and isn't visible above the fold —
// lazy-load it so it never blocks Landing's critical-path bundle.
const Globe3D = lazy(() => import('../components/Pulse/Globe3D'));

// Lightweight, dependency-free placeholder shown while Globe3D's chunk
// (three.js) loads. Sized to fill the same container as the real globe so
// there's no layout shift when it swaps in.
const GlobePlaceholder = React.memo(function GlobePlaceholder() {
  return (
    <div style={{
      position:'absolute', inset:0, borderRadius:'50%',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(circle at 35% 30%, #EFE7F8, #E6DDF3 60%, rgba(230,221,243,0.4) 80%)',
      border:'1px solid #E6DDF3',
      animation:'globeFallbackPulse 2.2s ease-in-out infinite',
    }}>
      <GlobeIcon size={40} strokeWidth={1.5} color="#8F77C5" />
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
// "Dawn" palette — soft lavender/blush grounds, ONE violet for actions,
// gold kept for the lotus mark. Every text colour below passes WCAG AA on
// the light grounds it is used on.
const P    = '#6B4FA0';   // Soul Violet — buttons, links, accents
const LAV  = '#8F77C5';   // decorative lavender (never body text)
const GLD  = '#D4B07A';   // Lotus Gold — mark & icons only
const GOLD_TXT = '#8A6A3E'; // deep gold for small eyebrow labels on light grounds
const PNK  = '#C98A6B';   // (legacy name) warm clay accent
// DARK is the text colour on light sections — "dark navy" per the brief,
// not the near-black used on the dark panels' own text (#fff/rgba white).
const DARK = '#221B3A';   // Deep Indigo — headings/UI text
const NAVY_SOFT = '#5B5470'; // Dusk Grey — body copy
const MUTED = '#6E6784';     // small/secondary text (≥4.7:1 on all grounds)
const SQ3  = 1.7320508;
// Cream + navy identity
const CREAM   = '#FAF8FC';   // Morning Mist — page background
const CREAM_2 = '#F3EFF9';   // Lavender Haze — alternate sections
const BLUSH   = '#FBF3EE';   // Dawn Blush — warm sections
const IVORY   = '#FFFFFF';   // cards
const LILAC_LINE = '#E6DDF3'; // borders
const SEA     = '#CFE3DA';   // Sea Glass — calm / safe states
const SEA_TXT = '#2F5A45';
const LINE    = 'rgba(34,27,58,0.08)';
const TWILIGHT = '#2A2150';  // the ONE dark band (vision card)
const NAVY_BAND = TWILIGHT;

const NAV_LINKS = [
  { label: 'Explore',      href: '/explore', isRoute: true },
  { label: 'About Us',     href: '/about',  isRoute: true  },
  { label: 'How It Works', href: '/how-it-works', isRoute: true },
  { label: 'Trust & Safety', href: '/trust-safety', isRoute: true },
  { label: 'Contact',      href: '/contact', isRoute: true  },
];

/* Mock data for Global Pulse demo on landing page */
const GLOBAL_PULSE_DATA = {
  colors: {
    anxiety: '#8F77C5',
    depression: '#6B4FA0',
    loneliness: '#5B7FB0',
    heartbreak: '#C98A6B',
    burnout: '#D4A15A',
    grief: '#7A6A9A',
    'relationship-issues': '#B8798F',
    'work-stress': '#C9A45C',
    other: '#9C8FC2',
  },
  countries: [
    { code: 'IN', name: 'India', count_range: '100-499' },
    { code: 'US', name: 'United States', count_range: '50-99' },
    { code: 'GB', name: 'United Kingdom', count_range: '25-49' },
    { code: 'CA', name: 'Canada', count_range: '10-24' },
    { code: 'AU', name: 'Australia', count_range: '10-24' },
    { code: 'BR', name: 'Brazil', count_range: '25-49' },
    { code: 'DE', name: 'Germany', count_range: '10-24' },
    { code: 'JP', name: 'Japan', count_range: '25-49' },
  ],
  map: [
    { country_code: 'IN', count_range: '100-499', breakdown: { anxiety: 35, depression: 25, loneliness: 20, burnout: 15, other: 5 }},
    { country_code: 'US', count_range: '50-99', breakdown: { anxiety: 30, depression: 28, heartbreak: 20, 'work-stress': 15, other: 7 }},
    { country_code: 'GB', count_range: '25-49', breakdown: { depression: 35, anxiety: 25, loneliness: 25, grief: 10, other: 5 }},
    { country_code: 'CA', count_range: '10-24', breakdown: { loneliness: 40, anxiety: 30, depression: 20, other: 10 }},
    { country_code: 'AU', count_range: '10-24', breakdown: { anxiety: 35, burnout: 35, depression: 20, other: 10 }},
    { country_code: 'BR', count_range: '25-49', breakdown: { heartbreak: 40, anxiety: 30, depression: 20, other: 10 }},
    { country_code: 'DE', count_range: '10-24', breakdown: { 'work-stress': 45, anxiety: 30, depression: 15, other: 10 }},
    { country_code: 'JP', count_range: '25-49', breakdown: { 'relationship-issues': 35, anxiety: 30, depression: 25, other: 10 }},
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════════
   BRAND LOTUS — the real SoulConnect mark (line lotus, meditating figure,
   glowing heart). Replaces the old two-souls/neon-orb hero art and the
   glowing 8-petal vision lotus: one consistent mark everywhere instead of
   generated-looking cosmic illustrations. Drawn in a 200-unit box.
═══════════════════════════════════════════════════════════════════════════════ */
const LOTUS_PETALS = [
  'M100,150 C72,150 32,138 14,100 C48,96 82,116 100,150',
  'M100,150 C128,150 168,138 186,100 C152,96 118,116 100,150',
  'M100,150 C60,140 40,100 58,56 C80,66 94,80 100,94',
  'M100,150 C140,140 160,100 142,56 C120,66 106,80 100,94',
  'M100,150 C64,122 66,72 100,40 C134,72 136,122 100,150',
];
const LOTUS_THEMES = {
  // on light backgrounds
  light: {
    stroke: ['#E2B98A', '#D4B07A', '#B0714F'], strokeW: 2.4,
    glow: ['#C4ACE2', 0.55], petal: ['#EFE7F8', 0.75],
    heart: ['#FFE7C2', '#F4C07E', '#E48A4E'], heartGlow: 0.45, spark: '#C9A06A',
  },
  // on the one dark (Twilight) band
  dark: {
    stroke: ['#F7DDB8', '#D4B07A', '#C4876A'], strokeW: 2.2,
    glow: ['#9A4E86', 0.55], petal: ['#3A2A66', 0.55],
    heart: ['#FFF4DC', '#F9D39A', '#EE9E62'], heartGlow: 0.8, spark: '#F7DDB8',
  },
};

function LotusMark({ variant = 'light', id = 'lm' }) {
  const t = LOTUS_THEMES[variant];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}St`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.stroke[0]} />
          <stop offset="0.55" stopColor={t.stroke[1]} />
          <stop offset="1" stopColor={t.stroke[2]} />
        </linearGradient>
        <radialGradient id={`${id}Gl`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={t.glow[0]} stopOpacity={t.glow[1]} />
          <stop offset="1" stopColor={t.glow[0]} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}Hf`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={t.heart[0]} />
          <stop offset="0.6" stopColor={t.heart[1]} />
          <stop offset="1" stopColor={t.heart[2]} />
        </radialGradient>
        <radialGradient id={`${id}Hg`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F4A460" stopOpacity={t.heartGlow} />
          <stop offset="1" stopColor="#F4A460" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="108" rx="62" ry="52" fill={`url(#${id}Gl)`} />
      <g fill={t.petal[0]} fillOpacity={t.petal[1]}>
        {LOTUS_PETALS.map((d, i) => <path key={i} d={`${d} Z`} />)}
      </g>
      <circle cx="100" cy="112" r="28" fill={`url(#${id}Hg)`} />
      <g fill="none" stroke={`url(#${id}St)`} strokeWidth={t.strokeW}
        strokeLinejoin="round" strokeLinecap="round">
        {LOTUS_PETALS.map((d, i) => <path key={i} d={i === 4 ? `${d} Z` : d} />)}
        <path d="M99,151 C80,150 52,152 30,158 C50,176 80,178 99,151" />
        <path d="M101,151 C120,150 148,152 170,158 C150,176 120,178 101,151" />
        <line x1="100" y1="84" x2="100" y2="94" />
        <path d="M100,70 C102.5,73 104,75.5 104,78.5 A4,4 0 0 1 96,78.5 C96,75.5 97.5,73 100,70 Z"
          strokeWidth={t.strokeW * 0.82} />
      </g>
      <path d="M100,127 C92,121 84,115 84,108 C84,102 89,99 94,101 C97,102 99,105 100,107 C101,105 103,102 106,101 C111,99 116,102 116,108 C116,115 108,121 100,127 Z"
        fill={`url(#${id}Hf)`} />
      <g fill={t.spark}>
        <path d="M100,21 L102,25 L100,29 L98,25 Z" />
        <circle cx="100" cy="25" r="1.6" />
        <circle cx="80" cy="36" r="1.7" />
        <circle cx="120" cy="36" r="1.7" />
        <circle cx="100" cy="12" r="0.9" fillOpacity="0.6" />
      </g>
    </g>
  );
}

function HeroIllustration() {
  /* ── Two Souls Connecting & Healing — light "Dawn" recolour of the
     original composition (same layout, figures, beam, nexus, lotus). ──
     Layers: cosmic bg → stars → nebula → sacred geometry →
     left soul orb → right soul orb → energy beam → nexus →
     healing lotus → particles
  */
  const W = 800, H = 900;
  const LX = 175, RX = 625, MY = 350;   // soul orb centers
  const CX = 400, LY = 640;             // nexus center X, lotus Y

  /* Stars */
  const stars = Array.from({length:60},(_,i)=>({
    x: 8+((i*131+i*i*7)%784), y: 8+((i*97+i*i*11)%390),
    r: 0.4+(i%5)*0.35, op: 0.15+(i%7)*0.07,
    dur: 1.8+(i%5)*0.7, del: i*0.17,
  }));

  /* Lotus angles */
  const OD=[0,45,90,135,180,225,270,315];
  const MD=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const ID=[0,60,120,180,240,300];

  /* Floating particles */
  const pts = Array.from({length:30},(_,i)=>({
    x: 20+((i*83+i*i*13)%760), y: 60+((i*67+i*i*17)%820),
    r: 0.8+(i%5)*0.45,
    col:[LAV,GLD,PNK,'#C2B1E4','#E3BB8A','#B8A6DC'][i%6],
    dur: 2.8+(i%5)*0.9, del: i*0.25,
  }));

  /* Beam path coords */
  const bx1=LX+86, bx2=RX-86, bcy=MY-18;
  const beamPath = `M${bx1},${MY} C${LX+160},${bcy} ${RX-160},${bcy} ${bx2},${MY}`;
  const beamRev  = `M${bx2},${MY} C${RX-160},${bcy} ${LX+160},${bcy} ${bx1},${MY}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}}
      aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* ── Backgrounds ── */}
        <linearGradient id="hiBg" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#F3EFF9" stopOpacity="0"/>
          <stop offset="100%" stopColor="#F3EFF9" stopOpacity="0"/>
        </linearGradient>

        {/* ── Left soul orb: 3D sphere (highlight top-left) ── */}
        <radialGradient id="hiLOrb" cx="32%" cy="28%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="18%"  stopColor="#F3EDFB"/>
          <stop offset="45%"  stopColor="#DCD0F0"/>
          <stop offset="78%"  stopColor="#C2B1E4"/>
          <stop offset="100%" stopColor="#A893D6" stopOpacity="0.9"/>
        </radialGradient>
        <radialGradient id="hiLAura" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#C9B8E8" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#C9B8E8" stopOpacity="0"/>
        </radialGradient>

        {/* ── Right soul orb: 3D sphere (slightly warmer hue) ── */}
        <radialGradient id="hiROrb" cx="68%" cy="28%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="18%"  stopColor="#F7EEF6"/>
          <stop offset="45%"  stopColor="#E6D5EE"/>
          <stop offset="78%"  stopColor="#CDB6E2"/>
          <stop offset="100%" stopColor="#B29BD8" stopOpacity="0.9"/>
        </radialGradient>
        <radialGradient id="hiRAura" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#DCC8EC" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#DCC8EC" stopOpacity="0"/>
        </radialGradient>

        {/* ── Center nexus ── */}
        <radialGradient id="hiNex" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="10%"  stopColor="#FFF1DC"/>
          <stop offset="30%"  stopColor="#F4C98E" stopOpacity="0.75"/>
          <stop offset="60%"  stopColor="#FBE6DA" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#FBE6DA" stopOpacity="0"/>
        </radialGradient>

        {/* ── Energy beam ── */}
        <linearGradient id="hiBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={LAV} stopOpacity="0.1"/>
          <stop offset="22%"  stopColor={LAV} stopOpacity="0.6"/>
          <stop offset="50%"  stopColor="#E3A857" stopOpacity="1"/>
          <stop offset="78%"  stopColor={LAV} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0.1"/>
        </linearGradient>

        {/* ── Lotus ── */}
        <linearGradient id="hiLP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F6F1FC" stopOpacity="1"/>
          <stop offset="100%" stopColor="#A893D6" stopOpacity="0.85"/>
        </linearGradient>
        <radialGradient id="hiLC" cx="50%" cy="38%">
          <stop offset="0%"   stopColor="#FFF1DC"/>
          <stop offset="48%"  stopColor="#F4C98E"/>
          <stop offset="100%" stopColor="#F4C98E" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="hiVLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={GLD} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0.05"/>
        </linearGradient>

        {/* Soft warm wash behind the nexus + lotus (pure gradient, fades to 0,
            so it never shows an edge the way blurred solid shapes did) */}
        <radialGradient id="hiWarm" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FBE6DA" stopOpacity="0.55"/>
          <stop offset="55%"  stopColor="#F6EEF8" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#F6EEF8" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="hiGround" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={LAV} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0"/>
        </radialGradient>

        {/* ── Filters ── */}
        <filter id="hiXGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="20" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiLGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiMGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiSGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiBGlow" x="-8%" y="-300%" width="116%" height="700%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiPGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── COSMIC BACKGROUND ── */}
      <rect x="0" y="0" width={W} height={H} fill="url(#hiBg)"/>

      {/* Nebula soft clouds */}
      <ellipse cx="400" cy="470" rx="330" ry="300" fill="url(#hiWarm)"/>

      {/* ── STARS ── */}
      {stars.map((s,i)=>(
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i%3===0?"#D4B07A":"#B8A6DC"} opacity={s.op}>
          <animate attributeName="opacity"
            values={`${s.op};${Math.min(s.op*3,0.95)};${s.op}`}
            dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* ── SACRED GEOMETRY RING (center, faint) ── */}
      <g opacity="0.16" transform={`translate(${CX},${MY})`}>
        {[65,95,125,148].map((r,i)=>(
          <circle key={i} cx="0" cy="0" r={r}
            stroke={i%2===0?LAV:GLD} strokeWidth={i===0?1:0.65} fill="none"
            strokeDasharray={i%2===0?"5 8":"2 10"}/>
        ))}
        {Array.from({length:12},(_,i)=>{
          const a=i*(Math.PI*2/12);
          return <line key={i} x1="0" y1="0"
            x2={148*Math.cos(a)} y2={148*Math.sin(a)}
            stroke={LAV} strokeWidth="0.5" opacity="0.8"/>;
        })}
        {Array.from({length:6},(_,i)=>{
          const a=i*(Math.PI/3);
          return <circle key={i} cx={95*Math.cos(a)} cy={95*Math.sin(a)} r="48"
            stroke={LAV} strokeWidth="0.45" fill="none"/>;
        })}
      </g>

      {/* ════════════════════════════════════════
          LEFT SOUL ORB  — deep violet sphere
      ════════════════════════════════════════ */}
      {/* Outer aura / atmosphere */}
      <circle cx={LX} cy={MY} r={160} fill="url(#hiLAura)"/>
      {/* 3D Sphere body */}
      <circle cx={LX} cy={MY} r={90} fill="url(#hiLOrb)" filter="url(#hiMGlow)"/>
      {/* Specular shine top-left (makes it feel 3D) */}
      <ellipse cx={LX-30} cy={MY-32} rx={26} ry={18}
        fill="rgba(255,255,255,0.22)" filter="url(#hiSGlow)"/>
      <ellipse cx={LX-20} cy={MY-26} rx={10} ry={7}
        fill="rgba(255,255,255,0.38)"/>
      {/* Inner core glow */}
      <circle cx={LX} cy={MY} r={46} fill="rgba(255,255,255,0.25)" filter="url(#hiMGlow)"/>

      {/* Meditating figure inside left orb — reaching right */}
      <g transform={`translate(${LX},${MY})`} opacity="0.82">
        {/* Head */}
        <ellipse cx="-4" cy="-54" rx="13" ry="15" fill="#3A2E63"/>
        <ellipse cx="-4" cy="-67" rx="15" ry="7"  fill="#2E2452"/>
        {/* Body */}
        <path d="M-17,-40 Q-21,-6 -14,18 L6,18 Q13,-6 9,-40 Z" fill="#3A2E63"/>
        {/* Right arm reaching toward center/nexus */}
        <path d="M9,-22 Q30,-12 52,-10" stroke="#3A2E63" strokeWidth="9"
          strokeLinecap="round" fill="none"/>
        {/* Glowing hand/energy at tip */}
        <circle cx="52" cy="-10" r="7" fill={GLD} opacity="0.85" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="5;9;5"     dur="2.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.55;1;0.55" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="52" cy="-10" r="12" fill={GLD} opacity="0.2" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="10;18;10"    dur="2.3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.22;0.04;0.22" dur="2.3s" repeatCount="indefinite"/>
        </circle>
        {/* Cross-legged base */}
        <ellipse cx="-4" cy="28" rx="28" ry="11" fill="#3A2E63"/>
        <ellipse cx="-24" cy="22" rx="16" ry="9" fill="#463A73"/>
        <ellipse cx="16" cy="22" rx="16" ry="9" fill="#463A73"/>
        {/* Third eye */}
        <circle cx="-4" cy="-58" r="2.8" fill={GLD} opacity="0.65">
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Pulsing rings left */}
      {[0,1,2].map(i=>(
        <circle key={i} cx={LX} cy={MY} r={102+i*24}
          stroke="#B8A6DC" strokeWidth="0.9" fill="none">
          <animate attributeName="r"
            values={`${98+i*24};${122+i*24};${98+i*24}`}
            dur={`${3.2+i*0.9}s`} begin={`${i*0.65}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.28;0;0.28"
            dur={`${3.2+i*0.9}s`} begin={`${i*0.65}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* ════════════════════════════════════════
          RIGHT SOUL ORB — lavender sphere
      ════════════════════════════════════════ */}
      <circle cx={RX} cy={MY} r={160} fill="url(#hiRAura)"/>
      <circle cx={RX} cy={MY} r={90} fill="url(#hiROrb)" filter="url(#hiMGlow)"/>
      <ellipse cx={RX-30} cy={MY-32} rx={26} ry={18}
        fill="rgba(255,255,255,0.2)" filter="url(#hiSGlow)"/>
      <ellipse cx={RX-20} cy={MY-26} rx={10} ry={7}
        fill="rgba(255,255,255,0.34)"/>
      <circle cx={RX} cy={MY} r={46} fill="rgba(255,255,255,0.22)" filter="url(#hiMGlow)"/>

      {/* Meditating figure inside right orb — reaching left */}
      <g transform={`translate(${RX},${MY})`} opacity="0.82">
        <ellipse cx="4" cy="-54" rx="13" ry="15" fill="#3A2E63"/>
        <ellipse cx="4" cy="-67" rx="15" ry="7"  fill="#2E2452"/>
        <path d="M-9,-40 Q-13,-6 -6,18 L14,18 Q21,-6 17,-40 Z" fill="#3A2E63"/>
        {/* Left arm reaching toward center */}
        <path d="M-9,-22 Q-30,-12 -52,-10" stroke="#3A2E63" strokeWidth="9"
          strokeLinecap="round" fill="none"/>
        <circle cx="-52" cy="-10" r="7" fill={GLD} opacity="0.85" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="5;9;5"       dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.55;1;0.55"  dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-52" cy="-10" r="12" fill={GLD} opacity="0.18" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="10;18;10"      dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.04;0.2"   dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <ellipse cx="4" cy="28" rx="28" ry="11" fill="#3A2E63"/>
        <ellipse cx="-16" cy="22" rx="16" ry="9" fill="#463A73"/>
        <ellipse cx="24" cy="22" rx="16" ry="9" fill="#463A73"/>
        <circle cx="4" cy="-58" r="2.8" fill={GLD} opacity="0.65">
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur="3.4s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {[0,1,2].map(i=>(
        <circle key={i} cx={RX} cy={MY} r={102+i*24}
          stroke="#B8A6DC" strokeWidth="0.9" fill="none">
          <animate attributeName="r"
            values={`${98+i*24};${122+i*24};${98+i*24}`}
            dur={`${3.6+i*0.9}s`} begin={`${i*0.5+0.3}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.28;0;0.28"
            dur={`${3.6+i*0.9}s`} begin={`${i*0.5+0.3}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* ════════════════════════════════════════
          ENERGY BEAM — souls reaching toward each other
      ════════════════════════════════════════ */}
      {/* Wide soft glow underneath */}
      <path d={beamPath}
        stroke={LAV} strokeWidth="22" fill="none"
        opacity="0.05" strokeLinecap="round"/>
      {/* Medium glow */}
      <path d={beamPath}
        stroke={LAV} strokeWidth="10" fill="none"
        opacity="0.08" strokeLinecap="round" filter="url(#hiBGlow)"/>
      {/* Main bright beam */}
      <path d={beamPath}
        stroke="url(#hiBeam)" strokeWidth="4.5" fill="none"
        filter="url(#hiBGlow)" strokeLinecap="round" opacity="0.96"/>
      {/* Upper fine ribbon */}
      <path d={`M${bx1},${MY-12} C${LX+160},${bcy-18} ${RX-160},${bcy-18} ${bx2},${MY-12}`}
        stroke="rgba(168,147,214,0.45)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Lower fine ribbon */}
      <path d={`M${bx1},${MY+12} C${LX+160},${bcy+24} ${RX-160},${bcy+24} ${bx2},${MY+12}`}
        stroke="rgba(168,147,214,0.32)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Traveling light particle L→R */}
      <circle r="4.5" fill="#E3A857" opacity="0.92" filter="url(#hiSGlow)">
        <animateMotion path={beamPath} dur="3.2s" repeatCount="indefinite"/>
      </circle>
      {/* Traveling light particle R→L */}
      <circle r="3.5" fill={GLD} opacity="0.78" filter="url(#hiSGlow)">
        <animateMotion path={beamRev} dur="3.8s" begin="1.4s" repeatCount="indefinite"/>
      </circle>

      {/* ════════════════════════════════════════
          CENTER NEXUS — souls meeting point
      ════════════════════════════════════════ */}
      {/* Large outer glow */}
      <circle cx={CX} cy={MY} r={110} fill="url(#hiNex)" opacity="0.7"/>
      {/* Starburst rays */}
      {Array.from({length:24},(_,i)=>{
        const a=i*(Math.PI*2/24);
        const len=36+(i%4===0?26:i%2===0?14:6);
        return <line key={i} x1={CX} y1={MY}
          x2={CX+len*Math.cos(a)} y2={MY+len*Math.sin(a)}
          stroke={i%6===0?GLD:LAV}
          strokeWidth={i%6===0?1.6:0.75}
          opacity={0.55-(i%5)*0.06}/>;
      })}
      {/* Nexus ring halos */}
      {[42,30,20].map((r,i)=>(
        <circle key={i} cx={CX} cy={MY} r={r}
          fill={['rgba(244,201,142,0.22)','rgba(244,201,142,0.45)','rgba(236,176,104,0.8)'][i]}
          filter={i===2?'url(#hiSGlow)':undefined}>
          {i===2&&<animate attributeName="r" values="17;23;17" dur="2.6s" repeatCount="indefinite"/>}
        </circle>
      ))}
      <circle cx={CX} cy={MY} r={8} fill="#FFF6E6" filter="url(#hiSGlow)"/>
      {/* 3 orbiting dots */}
      {[0,120,240].map((a,i)=>{
        const rad=a*Math.PI/180;
        return (
          <circle key={i} cx={CX+46*Math.cos(rad)} cy={MY+46*Math.sin(rad)} r={3.8}
            fill={[LAV,GLD,PNK][i]} filter="url(#hiSGlow)" opacity="0.9">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${CX} ${MY}`} to={`360 ${CX} ${MY}`}
              dur="7s" begin={`${i*0.55}s`} repeatCount="indefinite"/>
          </circle>
        );
      })}

      {/* ════════════════════════════════════════
          VERTICAL ENERGY DESCENT to Lotus
      ════════════════════════════════════════ */}
      <line x1={CX} y1={MY+20} x2={CX} y2={LY-90}
        stroke="url(#hiVLine)" strokeWidth="2.2"
        strokeDasharray="5 7" opacity="0.5"/>

      {/* ════════════════════════════════════════
          HEALING LOTUS (below nexus)
      ════════════════════════════════════════ */}
      {/* Ground aura */}
      <ellipse cx={CX} cy={LY+30} rx={150} ry={30} fill="url(#hiGround)"/>
      <g filter="url(#hiPGlow)">
        {/* Outer petals ×8 */}
        {OD.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+90*Math.cos(r), py=LY+90*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={14} ry={46}
            fill="url(#hiLP)" opacity="0.92" stroke="#C2B1E4" strokeWidth="0.8"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Mid petals ×8 */}
        {MD.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+59*Math.cos(r), py=LY+59*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={11} ry={30}
            fill="#DCD0F0" opacity="0.95" stroke="#C2B1E4" strokeWidth="0.8"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Inner petals ×6 */}
        {ID.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+33*Math.cos(r), py=LY+33*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={8} ry={18}
            fill="#FBF8FE" opacity="0.98" stroke="#D9CCF0" strokeWidth="0.8"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Lotus center */}
        <circle cx={CX} cy={LY} r={38} fill="url(#hiLC)" filter="url(#hiLGlow)"/>
        <circle cx={CX} cy={LY} r={15} fill="#ECB068">
          <animate attributeName="r"       values="13;19;13" dur="4.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;1;0.8" dur="4.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={CX} cy={LY} r={8} fill="#FFF6E6"/>
      </g>

      {/* ── FLOATING PARTICLES ── */}
      {pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.5">
          <animate attributeName="cy"
            values={`${p.y};${p.y-18};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity"
            values="0.18;0.58;0.18"
            dur={`${p.dur*.9}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* Vision card lotus — same mark, dark-band colours. */
function VisionLotus() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
      <LotusMark variant="dark" id="visionLotus" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [earlyForm,      setEarlyForm]      = useState({challenge:'',name:'',email:'',referralSource:''});
  const [earlySubmitted, setEarlySubmitted] = useState(false);

  // Arriving from another page with a #hash (e.g. About → "/#early"):
  // the router doesn't scroll to it, so do it once the page has laid out.
  useEffect(()=>{
    const id = window.location.hash.slice(1);
    if(!id) return;
    const timers = [80, 450, 1100].map(ms => setTimeout(()=>{
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior: ms===80 ? 'auto' : 'smooth', block:'start'});
    }, ms));
    return ()=>timers.forEach(clearTimeout);
  },[]);

  useEffect(()=>{
    [['sc-pjs','https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'],
     ['sc-pfd','https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap'],
    ].forEach(([id,href])=>{
      if(!document.getElementById(id)){
        const l=document.createElement('link');
        l.id=id; l.rel='stylesheet'; l.href=href;
        document.head.appendChild(l);
      }
    });
    // SMIL <animate> tags ignore CSS animation:none; pause them directly.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.l-hero-illus svg').forEach(el=>el.pauseAnimations && el.pauseAnimations());
    }
    const s=()=>setScrolled(window.scrollY>50);
    window.addEventListener('scroll',s);
    return()=>window.removeEventListener('scroll',s);
  },[]);

  const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";
  const SF = '"Playfair Display",Georgia,serif';

  const handleSubmit = async e=>{
    e.preventDefault();
    if(!earlyForm.name||!earlyForm.email||!earlyForm.referralSource) return;
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'https://soulconnect-backend-production.up.railway.app/api').replace(/\/+$/, '');
      const res = await fetch(`${BASE}/early-access/`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: earlyForm.name,
          email: earlyForm.email,
          struggle: earlyForm.challenge || null,
          challenge: earlyForm.challenge || null,
          source: 'landing_page',
          referral_source: earlyForm.referralSource,
        }),
      });
      if (res.ok) {
        setEarlySubmitted(true);
      } else {
        const d = await res.json().catch(()=>({}));
        alert(d.detail || 'Something went wrong. Please try again.');
      }
    } catch(_) {
      alert('Network error. Please check your connection and try again.');
    }
  };

  /* ─── inline CSS ─────────────────────────────────────────────────────────── */
  const css = `
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}

    @keyframes fadeUp    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes pulse     {0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
    @keyframes globeFallbackPulse{0%,100%{opacity:0.75;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
    @keyframes orbDrift  {0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-14px)}}
    @keyframes glowBreathe{
      0%,100%{box-shadow:0 0 0 0 rgba(16,27,61,0),0 6px 22px rgba(16,27,61,0.18);}
      50%{box-shadow:0 0 0 10px rgba(16,27,61,0.03),0 12px 34px rgba(16,27,61,0.26);}
    }
    @keyframes goldGlow  {
      0%,100%{box-shadow:0 0 0 0 rgba(245,184,65,0),0 4px 18px rgba(245,184,65,0.2);}
      50%{box-shadow:0 0 0 10px rgba(245,184,65,0.04),0 8px 36px rgba(245,184,65,0.38);}
    }
    @keyframes badgeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    @keyframes badgeGlow {
      0%,100%{box-shadow:0 0 0 0 rgba(109,74,255,0),0 4px 24px rgba(109,74,255,0.18);}
      50%{box-shadow:0 0 0 8px rgba(109,74,255,0.06),0 8px 36px rgba(109,74,255,0.32);}
    }
    @keyframes timelineShimmer{
      0%{background-position:200% center}
      100%{background-position:-200% center}
    }
    @keyframes slideInScale{
      0%{opacity:0;transform:translateY(12px) scale(0.95)}
      100%{opacity:1;transform:translateY(0) scale(1)}
    }
    @keyframes popScale{
      0%{transform:scale(0.3)}
      50%{transform:scale(1.15)}
      100%{transform:scale(1)}
    }

    /* Trust badge */
    .l-trust-badge{
      display:inline-flex;align-items:center;gap:10px;
      background:#FFFFFF;
      border:1px solid #DCD0F0;
      border-radius:999px;
      padding:10px 20px;cursor:default;
    }
    .l-trust-badge-dot{
      width:8px;height:8px;border-radius:50%;
      background:#6FA88A;flex-shrink:0;
    }
    .l-trust-badge-rocket{font-size:16px;line-height:1;color:${P};display:flex;}
    .l-trust-badge-text{font-size:13.5px;font-weight:700;color:${P};letter-spacing:.01em;white-space:nowrap;}
    .l-trust-badge-sep{width:1px;height:14px;background:#DCD0F0;flex-shrink:0;}
    .l-trust-badge-label{font-size:13px;font-weight:500;color:${NAVY_SOFT};white-space:nowrap;}

    /* Nav */
    .l-nav-a{
      position:relative;
      color:${NAVY_SOFT};font-size:14.5px;font-weight:500;letter-spacing:.005em;
      text-decoration:none;padding:8px 15px;border-radius:999px;
      transition:color .2s, background .2s;white-space:nowrap;
    }
    /* soft gold underline that grows from the centre on hover */
    .l-nav-a::after{
      content:'';position:absolute;left:50%;bottom:3px;height:2px;width:0;
      border-radius:2px;transform:translateX(-50%);
      background:linear-gradient(90deg,#D4B07A,#B08AD6);
      transition:width .25s ease;
    }
    .l-nav-a:hover{color:${P};background:rgba(107,79,160,0.06);}
    .l-nav-a:hover::after{width:18px;}
    .l-nav-a:focus-visible{outline:2px solid #C9B8E8;outline-offset:2px;color:${P};}

    /* Buttons */
    .l-btn-p{
      display:inline-flex;align-items:center;gap:8px;
      padding:15px 34px;border-radius:14px;font-size:15px;font-weight:700;
      background:${P};
      color:#FFFFFF;border:none;cursor:pointer;text-decoration:none;
      font-family:inherit;letter-spacing:.01em;
      box-shadow:0 2px 8px rgba(107,79,160,0.18);
      transition:background .2s ease,transform .2s ease,box-shadow .2s ease;
    }
    .l-btn-p:hover{background:#5A4190;transform:translateY(-1px);box-shadow:0 6px 16px rgba(107,79,160,0.22);}
    .l-btn-p:focus-visible{outline:3px solid #C9B8E8;outline-offset:2px;}
    /* on the one dark (Twilight) band the primary button inverts to white */
    .l-dark .l-btn-p{background:#FFFFFF;color:${DARK};box-shadow:none;}
    .l-dark .l-btn-p:hover{background:#F3EFF9;}
    .l-btn-g{
      display:inline-flex;align-items:center;gap:9px;
      padding:15px 34px;border-radius:14px;font-size:15px;font-weight:700;
      background:rgba(255,255,255,0.08);
      color:#fff;border:1.5px solid rgba(255,255,255,0.25);
      cursor:pointer;text-decoration:none;font-family:inherit;
      backdrop-filter:blur(8px);transition:all .22s ease;
    }
    .l-btn-g:hover{background:rgba(255,255,255,0.18);transform:translateY(-3px);border-color:rgba(255,255,255,0.45);}

    /* Global Pulse CTA */
    @keyframes gpRingExpand{
      0%{transform:scale(0.6);opacity:0.55;}
      100%{transform:scale(2.2);opacity:0;}
    }
    @keyframes gpCoreGlow{
      0%,100%{box-shadow:0 0 0 0 rgba(107,79,160,0);}
      50%{box-shadow:0 0 0 3px rgba(107,79,160,0.12);}
    }
    .l-btn-gp{
      display:inline-flex;align-items:center;gap:12px;
      padding:11px 22px;border-radius:14px;
      background:#FFFFFF;
      border:1px solid #DCD0F0;
      cursor:pointer;text-decoration:none;font-family:inherit;color:inherit;
      transition:all .2s ease;
      position:relative;
    }
    .l-btn-gp:hover{
      border-color:#C9B8E8;
      background:#FDFCFE;
      transform:translateY(-1px);
    }
    .l-btn-gp-icon{
      position:relative;flex-shrink:0;
      width:30px;height:30px;
      display:flex;align-items:center;justify-content:center;
    }
    .l-btn-gp-core{
      position:relative;z-index:2;
      width:7px;height:7px;border-radius:50%;
      background:${P};
      animation:gpCoreGlow 2.8s ease-in-out infinite;
    }
    .l-btn-gp-ring{
      position:absolute;inset:0;margin:auto;
      width:7px;height:7px;border-radius:50%;
      border:1px solid rgba(107,79,160,0.35);
      animation:gpRingExpand 3.6s cubic-bezier(0.2,0.6,0.4,1) infinite;
    }
    .l-btn-gp-ring:nth-child(2){animation-delay:1.2s;}
    .l-btn-gp-ring:nth-child(3){display:none;}
    .l-btn-gp-text{display:flex;flex-direction:column;gap:2px;line-height:1.15;}
    .l-btn-gp-eyebrow{
      font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
      color:${GOLD_TXT};
    }
    .l-btn-gp-main{font-size:15px;font-weight:700;color:${DARK};display:flex;align-items:center;gap:6px;}
    .l-btn-gp-arrow{transition:transform .25s ease;font-size:14px;color:${P};}
    .l-btn-gp:hover .l-btn-gp-arrow{transform:translateX(3px);}
    .l-btn-gp:hover .l-btn-gp-core{animation-duration:1.6s;}
    .l-btn-gp:hover .l-btn-gp-ring{animation-duration:1.6s;}

    /* Challenge cards */
    .l-struggle-card{
      background:#FCF9EF;border-radius:28px;
      padding:40px 20px 32px;
      border:1.5px solid rgba(16,27,61,0.08);
      box-shadow:0 4px 24px rgba(16,27,61,0.05);
      text-align:center;transition:all .32s cubic-bezier(.175,.885,.32,1.275);
      cursor:default;display:flex;flex-direction:column;
      align-items:center;min-height:210px;
    }
    .l-struggle-card:hover{transform:translateY(-12px);}

    /* Help strip boxes */
    .l-help-box:hover{
      transform:translateY(-2px);
      box-shadow:0 10px 24px rgba(34,27,58,0.06);
      border-color:#DCD0F0;
    }

    /* Vision feature tiles */
    .l-vision-feat{
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.10);border-radius:18px;
      padding:24px 18px;text-align:center;transition:background .2s,border-color .2s;
    }
    .l-vision-feat:hover{
      background:rgba(255,255,255,0.08);
      border-color:rgba(227,187,138,0.35);
    }

    /* Form */
    .l-form-field{
      width:100%;padding:15px 18px;border-radius:14px;
      border:1px solid #DCD0F0;
      background:#FFFFFF;
      color:${DARK};font-size:14px;font-family:inherit;
      outline:none;transition:border .2s,box-shadow .2s;
    }
    .l-form-field:focus{border-color:${P};box-shadow:0 0 0 3px rgba(107,79,160,0.14);}
    .l-form-field option{background:#FFFFFF;color:${DARK};}
    .l-form-field::placeholder{color:${MUTED};}
    select.l-form-field{appearance:none;-webkit-appearance:none;padding-right:38px;}

    /* Footer */
    .l-ft-link{
      display:block;color:${NAVY_SOFT};font-size:14px;
      text-decoration:none;transition:all .18s;margin-bottom:10px;
    }
    .l-ft-link:hover{color:${P};transform:translateX(2px);}

    /* Desktop hero: fade the artwork's own backdrop into the navy panel so
       the two halves meet softly instead of at a hard vertical edge. */
    @media(min-width:1100px){
      .l-hero-illus{-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 18%);mask-image:linear-gradient(90deg,transparent 0%,#000 18%);}
    }

    /* ── Responsive ── */
    @media(max-width:1100px){
      /* Nav is transparent-until-scroll by design on desktop, where the
         wide hero gives the logo room to sit over the art. On a narrow
         phone the illustration is directly behind the logo/hamburger with
         no separation, reading as visual collision rather than an
         intentional blend. Solid immediately on mobile instead. */
      .l-nav{background:rgba(250,248,252,0.97)!important;backdrop-filter:blur(20px)!important;
        border-bottom:1px solid rgba(34,27,58,0.08)!important;}
      .l-hero-grid{grid-template-columns:1fr!important;min-height:auto!important;}
      /* Was a flat 460px on every width from 320px phones to 1099px
         tablets — identical size regardless of how much viewport height is
         actually available. Scaling with clamp() means a small phone
         doesn't lose more than a third of its screen to the illustration
         before any headline text appears. */
      /* Real-device testing (not just simulated viewport height) showed the
         headline landing at the very bottom edge of the first screen on an
         iPhone 13 (664px visual viewport after Safari's toolbar) -- passing
         a "is it in the viewport" check but still reading as "too much
         scroll before real content." Tightened further: 200px floor and a
         lower vw ratio. */
      /* Mobile/tablet hero art: the FULL scene (both meditating souls +
         lotus) as its own band under the fixed nav. The SVG is 800x900
         with the subject between y=150 and y=790, so the <svg> is sized
         to 1.40625x the band height and shifted up by 0.2344x -- the band
         shows exactly that 640-unit slice, uncropped. Band height tracks
         the small-viewport height (svh) so "Find My Circle" still lands on
         the first screen: CTA bottom ~= nav 72 + band + ~345 of content. */
      #hero{min-height:auto!important;}
      .l-hero-grid{--ih:240px;}
      @supports (height:100svh){
        .l-hero-grid{--ih:clamp(170px,calc(100svh - 445px),340px);}
      }
      .l-hero-illus{
        position:relative!important;order:-1;pointer-events:none;
        width:calc(100% + 32px)!important;height:var(--ih)!important;
        margin:calc(72px + env(safe-area-inset-top,0px)) 0 0 -32px!important;
        overflow:hidden;animation:none!important;
        -webkit-mask-image:linear-gradient(to bottom,#000 78%,transparent);
        mask-image:linear-gradient(to bottom,#000 78%,transparent);
      }
      .l-hero-illus svg{
        position:absolute;left:50%;transform:translateX(-50%);
        width:calc(var(--ih) * 1.25)!important;
        height:calc(var(--ih) * 1.40625)!important;
        top:calc(var(--ih) * -0.2344);
        /* soften the art's own background edges into the hero */
        -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
        mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
      }
      /* Stacked layout centers the text, so padding needs to be symmetric
         here too — the inline style's 0-left/48px-right pairing is a
         two-column-desktop assumption (image bleeds to the grid edge on
         the left) that doesn't apply once the columns stack. */
      .l-hero-text{text-align:center;align-items:center!important;padding:10px clamp(20px,5vw,32px) clamp(32px,6vw,64px)!important;}
      /* Early Access: one compact pill, not a tall stacked box */
      .l-trust-badge{
        max-width:92vw!important; justify-content:center!important;
        padding:7px 14px!important; margin-bottom:12px!important;
        gap:2px 8px!important; border-radius:999px!important;
      }
      .l-trust-badge-text{font-size:12px!important;}
      .l-trust-badge-label{font-size:11px!important;}
      .l-hero-h1{
        font-size:clamp(2rem,9vw,72px)!important;
        line-height:1.08!important;
        margin-bottom:14px!important;
      }
      .l-hero-p{
        font-size:15px!important;
        line-height:1.5!important;
        margin-bottom:20px!important;
        max-width:340px!important;
      }
      .l-hero-btns{justify-content:center!important; margin-bottom:0!important;}
      .l-hero-pills{
        justify-content:center!important;
        margin-top:16px!important;
        gap:8px!important;
      }
      .l-hero-pills>div{padding:6px 12px!important;}
      .l-hero-pills span{font-size:11.5px!important;}
      .l-hero-pills svg{width:13px!important;height:13px!important;}
      .l-struggle-grid{grid-template-columns:repeat(3,1fr)!important;}
      .l-help-strip{grid-template-columns:repeat(3,1fr)!important;row-gap:28px!important;}
      .l-gp-row{grid-template-columns:1fr!important;gap:40px!important;}
      .l-gp-row>div{min-width:0!important;}
      .l-gp-row>div:first-child{order:1!important;align-items:center!important;text-align:center!important;}
      .l-gp-row>div:first-child>div:first-child{max-width:100%!important;}
      .l-gp-row>div:first-child>a{margin:0 auto!important;}
      .l-gp-row>div:first-child>div:last-child{align-items:center!important;}
      .l-gp-row>div:first-child>div:last-child>div:first-child{margin:0 auto!important;}
      .l-gp-row>div:nth-child(2){order:2!important;}
      .l-gp-row>div:last-child{order:3!important;justify-self:center!important;max-width:100%!important;width:100%!important;}
      .l-timeline-row{flex-direction:column!important;gap:28px!important;align-items:center!important;}
      .l-timeline-line{display:none!important;}
      .l-vision-inner{grid-template-columns:1fr!important;}
      .l-lotus-col{display:none!important;}
      .l-vision-feats{grid-template-columns:1fr 1fr!important;}
      .l-early-inner{grid-template-columns:1fr!important;}
      .l-early-right{display:none!important;}
      .l-cta-inner{flex-direction:column!important;align-items:center!important;text-align:center!important;}
      .l-cta-btns{align-items:center!important;}
      .l-desktop-nav{display:none!important;}
      .l-desktop-btns{display:none!important;}
      .l-mob-ham{display:flex!important;}
      /* Tagline stays on mobile, a touch smaller so it fits beside the menu button */
      .l-logo-sub{font-size:8px!important;letter-spacing:0.16em!important;margin-top:3px!important;white-space:nowrap;}
      .l-ft-top{flex-direction:column!important;text-align:center!important;gap:28px!important;}
      .l-ft-top > *:last-child{text-align:center!important;}
    }
    @media(max-width:720px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-help-strip{grid-template-columns:repeat(2,1fr)!important;row-gap:28px!important;}
      .l-trust-row{flex-wrap:wrap!important;gap:18px!important;}
      .l-ft-bottom{flex-direction:column!important;align-items:center!important;gap:16px!important;}
      .l-ft-nav{flex-wrap:wrap!important;justify-content:center!important;}
    }
    @media(max-width:480px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-help-strip{grid-template-columns:1fr!important;row-gap:14px!important;}
      .l-gp-headline-break{display:none;}
      .l-gp-headline{font-size:1.55rem!important;}
      /* At 320-480px "Building With Our First Community Members" (33
         chars) was forced onto one nowrap line and ran off the edge of the
         screen. Let it wrap onto a second line instead of overflowing;
         the vertical separator reads oddly before a wrapped line, so it's
         hidden here and the badge switches to a column layout. */
      .l-trust-badge{flex-wrap:wrap;border-radius:18px!important;text-align:center;}
      .l-trust-badge-dot,.l-trust-badge-rocket,.l-trust-badge-sep{display:none!important;}
      .l-trust-badge-label{white-space:normal!important;text-align:center;}
    }

    /* ── Values / "Building In Public" card grid ── */
    @media(max-width:767px){
      .l-values-grid{
        grid-template-columns:1fr!important;
        max-width:420px!important;
        margin-left:auto!important;
        margin-right:auto!important;
      }
      .l-values-card{
        padding:24px!important;
        border-radius:24px!important;
        min-height:auto!important;
        width:100%!important;
      }
      .l-values-icon{
        font-size:44px!important;
        margin-bottom:20px!important;
        display:block!important;
      }
      .l-values-h3{
        font-size:22px!important;
        line-height:1.2!important;
        max-width:none!important;
      }
      .l-values-p{
        font-size:16px!important;
        line-height:1.7!important;
        word-break:normal!important;
        overflow-wrap:break-word!important;
      }
    }
    @media(min-width:768px) and (max-width:1023px){
      .l-values-grid{
        grid-template-columns:repeat(2,1fr)!important;
        max-width:680px!important;
        margin-left:auto!important;
        margin-right:auto!important;
      }
      /* The 4 steps were flex-direction:column from the shared <1100px
         rule at line ~867, so a 768px-wide tablet stacked them in one tall
         column instead of using the available width — a 2x2 grid reads
         better and cuts the section's scroll length roughly in half. */
      .l-timeline-row{
        flex-direction:row!important;
        flex-wrap:wrap!important;
        justify-content:center!important;
        gap:40px 24px!important;
      }
      .l-timeline-row>div{flex:0 0 calc(50% - 12px)!important;}
      .l-timeline-line{display:none!important;}
    }
    /* iPad Pro (1024x1366) and similar 1024-1099px tablets fall between
       the tablet block above (which stops at 1023px) and the shared
       <1100px rule that collapses to a single column — at that width a
       1-column stack leaves ~470px of dead space on each side. Extending
       the same 2x2 grid up to 1099px keeps the row using the available
       width right up to where the true desktop 2-column hero layout
       takes over. */
    @media(min-width:1024px) and (max-width:1099px){
      .l-timeline-row{
        flex-direction:row!important;
        flex-wrap:wrap!important;
        justify-content:center!important;
        gap:40px 24px!important;
      }
      .l-timeline-row>div{flex:0 0 calc(50% - 12px)!important;}
      .l-timeline-line{display:none!important;}
    }
    /* Reduced motion: hero art holds still (CSS float + SMIL paused in JS) */
    @media (prefers-reduced-motion: reduce){
      .l-hero-illus,.l-hero-illus *{animation:none!important;}
    }
  `;

  const STEPS = [
    {n:'1', Icon:Feather, title:'Share Your Journey',   desc:'Express what you\'re going through in a safe, judgment-free space.'},
    {n:'2', Icon:Users, title:'Find Similar People',   desc:'We match you with people who truly understand your experience.'},
    {n:'3', Icon:MessagesSquare, title:'Join Support Circles',  desc:'Enter meaningful conversations and guided support groups.'},
    {n:'4', Icon:Sprout, title:'Grow Together',          desc:'Heal, learn, and transform alongside your community.'},
  ];

  const CHALLENGES = [
    {Icon:Wind, label:'Anxiety &\nOverthinking', glow:'rgba(124,58,237,0.18)',  border:'rgba(124,58,237,0.28)',  shadow:'0 24px 56px rgba(124,58,237,0.22)'},
    {Icon:HeartCrack, label:'Heartbreak',               glow:'rgba(219,39,119,0.18)', border:'rgba(219,39,119,0.28)', shadow:'0 24px 56px rgba(219,39,119,0.22)'},
    {Icon:CloudRain, label:'Loneliness',                glow:'rgba(37,99,235,0.18)',  border:'rgba(37,99,235,0.28)',   shadow:'0 24px 56px rgba(37,99,235,0.22)'},
    {Icon:Moon, label:'Grief',                     glow:'rgba(217,119,6,0.2)',   border:'rgba(217,119,6,0.3)',    shadow:'0 24px 56px rgba(217,119,6,0.24)'},
    {Icon:Flame, label:'Burnout',                   glow:'rgba(234,88,12,0.18)', border:'rgba(234,88,12,0.28)',   shadow:'0 24px 56px rgba(234,88,12,0.22)'},
    {Icon:Sprout, label:'Life\nTransitions',          glow:'rgba(5,150,105,0.18)', border:'rgba(5,150,105,0.28)',   shadow:'0 24px 56px rgba(5,150,105,0.22)'},
  ];

  const HELPS = [
    {Icon:Users,     title:'Meaningful Connections', desc:'Find people who understand'},
    {Icon:BookOpen,  title:'Soul Stories',           desc:'Share. Relate. Heal.'},
    {Icon:TrendingUp,title:'Soul Climate',           desc:'Track your mood'},
    {Icon:Leaf,      title:'Tiny Wins',              desc:'Small steps. Real progress.'},
    {Icon:UserRound, title:'Professional Healers',   desc:'Verified support'},
    {Icon:GlobeIcon, title:'Global Pulse',           desc:'See the bigger picture', href:'/pulse'},
  ];

  return (
    <div style={{fontFamily:F, background:CREAM, color:DARK, overflowX:'hidden'}}>
      <style>{css}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      {/* viewport-fit=cover (index.html) lets the page extend under the
          notch/Dynamic Island on iPhone, but nothing was reserving that
          space — a fixed top-0 nav with no safe-area padding can render
          partly behind the notch/status bar. env() falls back to 0 on
          devices without an inset, so this is a no-op everywhere else. */}
      <nav className="l-nav" style={{
        position:'fixed', top:0, left:0, right:0, zIndex:400,
        height:'calc(72px + env(safe-area-inset-top, 0px))',
        paddingTop:'env(safe-area-inset-top, 0px)',
        paddingLeft:'env(safe-area-inset-left, 0px)',
        paddingRight:'env(safe-area-inset-right, 0px)',
        background:'rgba(250,248,252,0.92)',
        backdropFilter:'blur(20px)',
        borderBottom:`1px solid ${scrolled ? 'rgba(34,27,58,0.12)' : LINE}`,
        transition:'all .35s ease',
        display:'flex', alignItems:'center',
        boxSizing:'border-box',
      }}>
        <div style={{maxWidth:1440, margin:'0 auto', width:'100%',
          padding:'0 32px', display:'flex', alignItems:'center'}}>

          {/* Logo */}
          <Link to="/" style={{display:'flex', alignItems:'center', gap:10,
            textDecoration:'none', flexShrink:0, marginRight:36}}>
            <img src="/brand/logo/soulconnect-lotus-mark.svg" alt=""
              width="47" height="46"
              style={{height:46, width:'auto', display:'block'}}/>
            <div>
              <div style={{fontFamily:SF, fontSize:22, fontWeight:700, color:DARK,
                letterSpacing:'-0.01em', lineHeight:1}}>
                Soul<span style={{color:'#A87B45'}}>Connect</span>
              </div>
              <div className="l-logo-sub" style={{fontSize:9, color:P,
                fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:4}}>
                Heal · Connect · Grow
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="l-desktop-nav" style={{display:'flex', alignItems:'center',
            gap:2, flex:1, justifyContent:'center'}}>
            {NAV_LINKS.map(l=>(
              l.isRoute
                ? <Link key={l.label} to={l.href} className="l-nav-a">{l.label}</Link>
                : <a key={l.label} href={l.href} className="l-nav-a">{l.label}</a>
            ))}
          </div>

          {/* Desktop CTA only — no login button */}
          <div className="l-desktop-btns" style={{display:'flex',
            alignItems:'center', gap:10, marginLeft:'auto'}}>
            <a href="#early" className="l-btn-p"
              style={{padding:'10px 22px', fontSize:14, borderRadius:11}}>
              Find My Circle
            </a>
          </div>

          {/* Mobile hamburger */}
          {/* Primary mobile nav trigger — was 40x40, under the 48px minimum
              touch target for the single most-used control on mobile. */}
          <button onClick={()=>setMenuOpen(v=>!v)} className="l-mob-ham"
            aria-label="Open menu"
            style={{display:'none', marginLeft:'auto', width:48, height:48,
              borderRadius:10, background:'rgba(107,79,160,0.07)', border:'none',
              cursor:'pointer', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:5}}>
            {[0,1,2].map(i=><span key={i} style={{width:20, height:2,
              background:DARK, borderRadius:2, display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu — top:72 was hardcoded and is now stale against the
          nav's dynamic safe-area height above; matched here so the menu
          panel starts exactly below the nav instead of overlapping or
          gapping on notched devices. Bottom/left/right insets cover the
          home-indicator area and landscape notch on either side. */}
      {menuOpen&&(
        <div style={{position:'fixed', inset:0, zIndex:399,
          background:'rgba(250,248,252,0.985)', backdropFilter:'blur(18px)',
          paddingBottom:'env(safe-area-inset-bottom, 0px)',
          paddingLeft:'env(safe-area-inset-left, 0px)',
          paddingRight:'env(safe-area-inset-right, 0px)'}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',
            top:'calc(72px + env(safe-area-inset-top, 0px))', left:0, right:0,
            padding:'24px 32px', borderBottom:`1px solid ${LINE}`}}
            onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=>(
              l.isRoute
                ? <Link key={l.label} to={l.href} onClick={()=>setMenuOpen(false)}
                    style={{display:'block', padding:'15px 0', fontSize:17, fontWeight:500,
                      color:DARK, textDecoration:'none',
                      borderBottom:`1px solid ${LINE}`}}>{l.label}</Link>
                : <a key={l.label} href={l.href} onClick={()=>setMenuOpen(false)}
                    style={{display:'block', padding:'15px 0', fontSize:17, fontWeight:500,
                      color:DARK, textDecoration:'none',
                      borderBottom:`1px solid ${LINE}`}}>{l.label}</a>
            ))}
            <a href="#early" onClick={()=>setMenuOpen(false)}
              style={{display:'block', textAlign:'center', marginTop:24, padding:'15px',
                borderRadius:13, fontSize:15, fontWeight:700, color:'#FFFFFF',
                textDecoration:'none',
                background:P}}>
              Find My Circle
            </a>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO  (850px, 50/50 cinematic)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position:'relative',
        background:`linear-gradient(180deg,${CREAM_2} 0%,${CREAM} 100%)`,
        minHeight:850, overflow:'hidden',
      }}>

        <div className="l-hero-grid" style={{
          maxWidth:1440, margin:'0 auto',
          display:'grid', gridTemplateColumns:'50fr 50fr',
          minHeight:850, position:'relative', zIndex:1,
          padding:'0 0 0 32px',
        }}>
          {/* LEFT — Text */}
          <div className="l-hero-text" style={{
            display:'flex', flexDirection:'column', alignItems:'flex-start',
            justifyContent:'center',
            // Was a flat 130px/100px — correct only at desktop widths. Below
            // 1100px the hero stacks (illustration above, text below via
            // .l-hero-illus{order:-1}), so that fixed padding was adding on
            // top of the 460px illustration and pushing the headline past
            // the fold on mobile. clamp() keeps the desktop feel while
            // shrinking padding as the viewport narrows.
            padding:'clamp(32px,8vw,130px) clamp(20px,4vw,48px) clamp(48px,8vw,100px) 0',
            animation:'fadeUp .9s ease both',
          }}>
            {/* Trust badge */}
            <div className="l-trust-badge" style={{marginBottom:24}}>
              <span className="l-trust-badge-dot"/>
              <span className="l-trust-badge-rocket"><Compass size={12} strokeWidth={1.75} /></span>
              <span className="l-trust-badge-text">Early Access</span>
              <span className="l-trust-badge-sep"/>
              <span className="l-trust-badge-label">Building With Our First Community Members</span>
            </div>

            <h1 className="l-hero-h1" style={{
              fontFamily:SF,
              // Floor was a flat 3rem/48px regardless of width — at 320px
              // that's tight against the edge with only ~20px of padding on
              // each side. 2.15rem/34px still reads as a confident headline
              // at 320-360px without crowding the line.
              fontSize:'clamp(2.15rem,7vw,72px)',
              fontWeight:700, color:DARK,
              lineHeight:1.06, letterSpacing:'-0.025em',
              marginBottom:26,
            }}>
              You are more than<br/>
              what you’re <span style={{color:P}}>going through</span>
            </h1>

            <p className="l-hero-p" style={{fontSize:'clamp(15px,1.5vw,18px)',
              color:NAVY_SOFT,
              lineHeight:1.75, marginBottom:36, maxWidth:470}}>
              SoulConnect is a safe space to share, connect, and heal with people
              who truly understand what you're going through.
            </p>

            {/* Buttons — moved above the feature pills on mobile via CSS
                order, so the primary CTA lands before secondary decorative
                content rather than after it. See the <1100px block. */}
            <div className="l-hero-btns" style={{display:'flex', flexWrap:'wrap', gap:14}}>
              <a href="#early" className="l-btn-p"
                style={{fontSize:16, padding:'16px 38px', borderRadius:15}}>
                Find My Circle
              </a>
              <Link to="/pulse" className="l-btn-gp" aria-label="Global Pulse — how are you feeling?">
                <span className="l-btn-gp-icon">
                  <span className="l-btn-gp-ring" />
                  <span className="l-btn-gp-ring" />
                  <span className="l-btn-gp-ring" />
                  <span className="l-btn-gp-core" />
                </span>
                <span className="l-btn-gp-text">
                  <span className="l-btn-gp-eyebrow">Global Pulse</span>
                  <span className="l-btn-gp-main">How are you feeling? <span className="l-btn-gp-arrow">→</span></span>
                </span>
              </Link>
            </div>

            {/* Feature pills — kept, but now after the primary CTA (was
                before it), and compact on mobile via .l-hero-pills in the
                <1100px block: a tight horizontal row instead of 3 stacked
                full-width pills eating ~180px of vertical space. */}
            <div className="l-hero-pills" style={{display:'flex', flexWrap:'wrap',
              gap:10, marginTop:24}}>
              {[
                {Icon:Heart,       label:'Real Connections',  bg:SEA,       fg:SEA_TXT},
                {Icon:ShieldCheck, label:'Safe Community',    bg:'#F8E6DB', fg:'#7A4A2E'},
                {Icon:HandHeart,   label:'Emotional Support', bg:'#EDE6F7', fg:'#4E3680'},
              ].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:8,
                  background:t.bg,
                  borderRadius:99, padding:'8px 16px'}}>
                  <t.Icon size={15} strokeWidth={1.75} color={t.fg} />
                  <span style={{color:t.fg,
                    fontSize:13, fontWeight:600}}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Sub note */}
            <p style={{marginTop:22, fontSize:12.5,
              color:MUTED, lineHeight:1.6}}>
              No fake metrics. No fake testimonials. Just real community.
            </p>
          </div>

          {/* RIGHT — Cinematic illustration */}
          <div className="l-hero-illus" style={{
            position:'relative',
            animation:'floatY 10s ease-in-out infinite',
            marginLeft:'-20px',
            overflow:'hidden',
          }}>
            <HeroIllustration/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — GLOBAL PULSE (3D Interactive Globe) — PREMIUM LIGHT THEME
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="global-pulse" style={{
        background:IVORY,
        padding:'clamp(56px,9vw,88px) 32px clamp(40px,7vw,64px)',
        position:'relative',
        overflow:'hidden',
      }}>
        {/* Soft atmospheric background glow behind the globe */}
        <div style={{
          position:'absolute',
          top:'54%',
          left:'50%',
          transform:'translate(-50%, -50%)',
          width:'1100px',
          height:'1100px',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(243,239,249,0.9) 0%, rgba(243,239,249,0.4) 40%, transparent 68%)',
          pointerEvents:'none',
          zIndex:0,
        }}/>

        <div style={{maxWidth:1320, margin:'0 auto', position:'relative', zIndex:1}}>
          {/* Main row: LEFT (headline + copy + CTA) | CENTER GLOBE | RIGHT */}
          <div className="l-gp-row" style={{
            display:'grid',
            gridTemplateColumns:'1fr 1.5fr 1fr',
            gap:24,
            alignItems:'center',
          }}>
            {/* LEFT — Eyebrow, headline, copy, CTA, avatars (all together,
                matching the reference's single left-column composition) */}
            <div style={{display:'flex', flexDirection:'column', gap:20}}>
              <div>
                <p style={{fontSize:12, fontWeight:700, color:GOLD_TXT,
                  letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:14}}>
                  Global Pulse
                </p>
                <h2 className="l-gp-headline" style={{fontFamily:SF, fontSize:'clamp(1.6rem,2.6vw,2.6rem)',
                  fontWeight:700, color:DARK, letterSpacing:'-0.02em', marginBottom:14,
                  lineHeight:1.18,
                }}>
                  Maybe what you're feeling<br className="l-gp-headline-break"/>{' '}
                  <span style={{color:P}}>isn't only yours.</span>
                </h2>
                <p style={{fontSize:15, color:NAVY_SOFT, lineHeight:1.75, margin:0, maxWidth:330}}>
                  See anonymized emotional patterns from people around the world. Discover that your feelings are part of a bigger human story.
                </p>
              </div>

              <Link to="/pulse" style={{
                display:'inline-flex',
                alignItems:'center',
                justifyContent:'center',
                gap:8,
                padding:'14px 26px',
                borderRadius:14,
                background:P,
                color:'#FFFFFF',
                fontSize:14,
                fontWeight:600,
                textDecoration:'none',
                boxShadow:'0 2px 8px rgba(107,79,160,0.18)',
                transition:'all 0.2s ease-out',
                border:'none',
                cursor:'pointer',
                width:'fit-content',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(107,79,160,0.22)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(107,79,160,0.18)';
              }}>
                Explore Global Pulse
                <span>→</span>
              </Link>

              {/* Community avatars — abstract person icons, not photos:
                  the page elsewhere promises "no fake testimonials", so
                  these represent people without implying real member
                  photos we don't have. */}
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div style={{display:'flex'}}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      width:34, height:34, borderRadius:'50%',
                      background:['#DCD0F0','#CFE3DA','#F6DCCB','#E6DDF3','#D6E3F0','#F1E4C8'][i%6],
                      border:'2px solid #FFFFFF',
                      marginLeft: i > 1 ? -12 : 0,
                      zIndex:10-i,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <UserRound size={16} strokeWidth={1.75} color="#4E3680"/>
                    </div>
                  ))}
                </div>
                <span style={{fontSize:13, color:MUTED, lineHeight:1.4}}>Real people. Real feelings.<br/>A more connected world.</span>
              </div>
            </div>

            {/* CENTER — 3D Globe, floating free (no card/border). Square
                aspect so the sphere is never stretched/cropped by the
                grid column's width. */}
            <div style={{
              position:'relative',
              width:'100%',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
            }}>
              <div style={{
                position:'relative',
                width:'min(clamp(240px, 34vw, 560px), 100%)',
                height:'min(clamp(240px, 34vw, 560px), 100%)',
                aspectRatio:'1/1',
              }}>
                <Suspense fallback={<GlobePlaceholder />}>
                  <Globe3D
                    colors={GLOBAL_PULSE_DATA.colors}
                    lightTheme={true}
                  />
                </Suspense>
              </div>
            </div>

            {/* RIGHT — Premium card, self-centered so it anchors to the
                globe's vertical middle rather than stretching the full
                grid row height */}
            <div style={{ justifySelf:'end', alignSelf:'center' }}>
              <div style={{
                display:'flex',
                flexDirection:'column',
                gap:16,
                padding:'28px 30px',
                borderRadius:24,
                background:IVORY,
                border:`1px solid ${LILAC_LINE}`,
                boxShadow:'0 12px 36px rgba(34,27,58,0.06)',
                maxWidth:340,
              }}>
                <p style={{fontSize:11, fontWeight:700, color:GOLD_TXT, letterSpacing:'0.12em', textTransform:'uppercase', margin:0}}>
                  You are not alone
                </p>
                <h4 style={{fontSize:19, fontWeight:700, color:DARK, margin:0, lineHeight:1.3}}>
                  Different places.<br/>Similar feelings.
                </h4>
                <p style={{fontSize:13.5, color:NAVY_SOFT, lineHeight:1.7, margin:0}}>
                  Real stories. Real people. A global community reminding you that you don't have to navigate difficult feelings alone.
                </p>

                {/* Avatar row — abstract person icons, not photos (see
                    note on the left-column avatars above) */}
                <div style={{display:'flex'}}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{
                      width:32, height:32, borderRadius:'50%',
                      background:['#DCD0F0','#CFE3DA','#F6DCCB','#E6DDF3','#D6E3F0','#F1E4C8'][i%6],
                      border:'2px solid #FFFFFF',
                      marginLeft: i > 1 ? -10 : 0,
                      zIndex:10-i,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <UserRound size={15} strokeWidth={1.75} color="#4E3680"/>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div style={{
                  paddingTop:14,
                  borderTop:`1px solid ${LILAC_LINE}`,
                }}>
                  <p style={{fontSize:13.5, color:'#3A3350', lineHeight:1.6, margin:'0 0 6px 0', fontStyle:'italic'}}>
                    "It helps to see that I'm not the only one feeling this way."
                  </p>
                  <p style={{fontSize:12, color:MUTED, margin:0}}>
                    — Community member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — HEALING STARTS WITH CONNECTION  (true timeline)
      ══════════════════════════════════════════════════════════════════════ */}
      {/* Flat 120px top+bottom compounded with the adjacent sections' own
          padding at each seam — same fixed-padding-stacking pattern as the
          vision/help-strip boundary below. */}
      <section id="how" style={{background:CREAM, padding:'clamp(64px,10vw,120px) 32px'}}>
        <div style={{maxWidth:1180, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:80}}>
            <p style={{fontSize:12, fontWeight:700, color:GOLD_TXT,
              letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12}}>
              YOUR PATH FORWARD
            </p>
            <h2 style={{fontFamily:SF, fontSize:'clamp(2rem,3.2vw,52px)',
              fontWeight:700, color:DARK, letterSpacing:'-0.025em', marginBottom:0}}>
              Healing Starts With Connection
            </h2>
          </div>

          {/* Timeline */}
          <div style={{position:'relative'}}>
            {/* Connecting gradient line */}
            <div className="l-timeline-line" style={{
              position:'absolute',
              top:50,
              left:'calc(12.5% + 44px)',
              right:'calc(12.5% + 44px)',
              height:1,
              // Static line, no shimmer. The brief calls for motion that's
              // "almost invisible" — a line that visibly sweeps forever on a
              // calm, editorial light section fights that, so it's removed
              // here (kept on the dark hero/CTA where motion already reads
              // as ambient rather than attention-grabbing).
              background:'#DCD0F0',
              zIndex:0,
            }}/>

            <div className="l-timeline-row" style={{
              display:'flex', alignItems:'flex-start',
              justifyContent:'space-between', gap:0,
            }}>
              {STEPS.map((s,i)=>(
                <div key={i} style={{flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', textAlign:'center',
                  padding:'0 16px', position:'relative', zIndex:1}}>

                  {/* Step circle */}
                  <div style={{
                    width:88, height:88, borderRadius:'50%',
                    background:CREAM_2,
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center',
                    boxShadow:'none',
                    border:`1px solid ${LILAC_LINE}`,
                    marginBottom:26, position:'relative',
                  }}>
                    <s.Icon size={30} strokeWidth={1.5} color={P} />
                    {/* Step index — a small typographic marker rather than a
                        glowing gold medal. Numbering should orient, not shout. */}
                    <div style={{
                      position:'absolute', top:-2, right:-2,
                      width:24, height:24, borderRadius:'50%',
                      background:IVORY,
                      border:`1px solid ${LILAC_LINE}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:11, fontWeight:600, color:P,
                      letterSpacing:'0.02em',
                    }}>{s.n}</div>
                  </div>

                  <h3 style={{fontSize:18, fontWeight:650, color:DARK,
                    marginBottom:12, lineHeight:1.25}}>{s.title}</h3>
                  <p style={{fontSize:14, color:NAVY_SOFT, lineHeight:1.7,
                    maxWidth:190}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — OUR VISION  (dark luxury card with sacred geometry)
      ══════════════════════════════════════════════════════════════════════ */}
      {/* Bottom padding was a flat 120px, plus the next section's own 56px
          top padding, stacking to 176px of dead space at the seam between
          them at every viewport — proportionally much heavier on short
          mobile screens than on desktop. clamp() keeps the intentional
          breathing room on large screens without the mobile overrun. */}
      <section id="vision" style={{background:CREAM, padding:'0 32px clamp(56px,8vw,120px)'}}>
        <div style={{maxWidth:1440, margin:'0 auto'}}>
          <div style={{
            background:TWILIGHT,
            borderRadius:28,
            padding:'clamp(40px,5vw,72px)',
            position:'relative', overflow:'hidden',
            boxShadow:'0 24px 60px rgba(34,27,58,0.14)',
          }}>
            <div className="l-vision-inner" style={{
              display:'grid',
              gridTemplateColumns:'2fr 1.6fr 2fr',
              gap:'clamp(28px,4vw,64px)',
              alignItems:'center',
              position:'relative', zIndex:1,
            }}>
              {/* LEFT — copy */}
              <div>
                <div style={{fontSize:11, fontWeight:700, color:'#E3BB8A',
                  letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:18}}>
                  OUR VISION
                </div>
                <h2 style={{fontFamily:SF,
                  fontSize:'clamp(1.8rem,3vw,3.4rem)',
                  fontWeight:700, color:'#F5F1FA', lineHeight:1.12,
                  letterSpacing:'-0.022em', marginBottom:22}}>
                  A world where nobody<br/>
                  <span style={{color:'#C9B8E8'}}>struggles alone.</span>
                </h2>
                <p style={{fontSize:16, color:'#C9BEE0', lineHeight:1.8, marginBottom:28}}>
                  We believe healing happens faster when we feel understood,
                  supported, and connected to people who truly get it.
                </p>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <div style={{width:38, height:38, borderRadius:11,
                    background:'rgba(227,187,138,0.12)',
                    border:'1px solid rgba(227,187,138,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'#E3BB8A'}}><Heart size={17} strokeWidth={1.5} /></div>
                  <p style={{fontSize:13, color:'#B3A8CC', lineHeight:1.6}}>
                    Community-first. Human-first. Always.
                  </p>
                </div>
              </div>

              {/* CENTER — Lotus */}
              <div className="l-lotus-col" style={{display:'flex',
                justifyContent:'center', alignItems:'center'}}>
                <div style={{width:240, height:240}}>
                  <VisionLotus/>
                </div>
              </div>

              {/* RIGHT — 4 feature tiles */}
              <div className="l-vision-feats" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                {[
                  {Icon:Handshake, label:'Real\nConnections',       sub:'Genuine peer-to-peer support'},
                  {Icon:ShieldCheck, label:'Safe &\nModerated',        sub:'Community care always'},
                  {Icon:Lock, label:'Your Privacy\nMatters',    sub:'Private and secure'},
                  {Icon:Leaf, label:'Healing &\nGrowth',        sub:'Grow through connection'},
                ].map((f,i)=>(
                  <div key={i} className="l-vision-feat">
                    <div style={{width:44, height:44, borderRadius:13,
                      background:'rgba(255,255,255,0.06)',
                      border:'1px solid rgba(255,255,255,0.12)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:22, margin:'0 auto 12px'}}>
                      <f.Icon size={21} strokeWidth={1.5} color="#E3BB8A" />
                    </div>
                    <div style={{fontSize:13, fontWeight:700, color:'#F5F1FA',
                      marginBottom:6, whiteSpace:'pre-line', lineHeight:1.3}}>
                      {f.label}
                    </div>
                    <div style={{fontSize:11.5, color:'#B3A8CC',
                      lineHeight:1.5}}>{f.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — HOW SOULCONNECT HELPS YOU  (compact line-icon strip)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:CREAM, padding:'clamp(32px,6vw,56px) 32px'}}>
        <div style={{maxWidth:1440, margin:'0 auto'}}>
          <div className="l-help-strip" style={{
            display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:16}}>
            {HELPS.map(({Icon,title,desc,href},i)=>{
              const isLive = Boolean(href);
              const Tag = isLive ? Link : 'div';
              return (
                <Tag key={i} {...(isLive ? {to:href} : {})} className="l-help-box" style={{
                  display:'flex', flexDirection:'column', alignItems:'center',
                  textAlign:'center', padding:'22px 14px',
                  background:IVORY, borderRadius:16,
                  border: isLive ? '1px solid #BFD9CC' : `1px solid ${LILAC_LINE}`,
                  boxShadow:'none',
                  transition:'all .25s ease',
                  textDecoration:'none', color:'inherit', cursor: isLive ? 'pointer' : 'default',
                }}>
                  <Icon size={26} strokeWidth={1.75} color={isLive ? '#3F7A5E' : P} style={{marginBottom:8}}/>
                  <h3 style={{fontSize:13.5, fontWeight:650, color:DARK,
                    margin:'0 0 4px 0', lineHeight:1.25}}>
                    {title}
                  </h3>
                  {isLive ? (
                    <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
                      <span style={{width:4, height:4, borderRadius:'50%',
                        background:'#3F7A5E', display:'inline-block', flexShrink:0}}/>
                      <span style={{fontSize:10.5, fontWeight:700, color:SEA_TXT,
                        letterSpacing:'0.04em'}}>Live now</span>
                    </span>
                  ) : (
                    <span style={{display:'inline-flex', alignItems:'center', gap:5}}>
                      <span style={{width:4, height:4, borderRadius:'50%',
                        background:P, display:'inline-block', flexShrink:0}}/>
                      <span style={{fontSize:10.5, fontWeight:700, color:P,
                        letterSpacing:'0.04em'}}>Coming Soon</span>
                    </span>
                  )}
                  <span style={{fontSize:12, color:MUTED, marginTop:2}}>{desc}</span>
                </Tag>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5b — CURRENTLY BUILDING IN PUBLIC
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:CREAM_2, padding:'clamp(56px,9vw,100px) 32px'}}>
        <div style={{maxWidth:960, margin:'0 auto', textAlign:'center'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8,
            background:IVORY,
            border:'1px solid #DCD0F0',
            borderRadius:99, padding:'7px 18px', marginBottom:28}}>
            <span style={{width:7, height:7, borderRadius:'50%', background:'#6FA88A',
              display:'inline-block'}}/>
            <span style={{fontSize:11, fontWeight:700, color:P,
              letterSpacing:'0.12em', textTransform:'uppercase'}}>
              Building In Public
            </span>
          </div>

          <h2 style={{fontFamily:SF, fontSize:'clamp(1.8rem,3vw,46px)',
            fontWeight:700, color:DARK, lineHeight:1.15,
            letterSpacing:'-0.022em', marginBottom:22}}>
            Currently Building With<br/>Early Community Members
          </h2>
          <p style={{fontSize:'clamp(15px,1.6vw,18px)', color:NAVY_SOFT,
            lineHeight:1.88, maxWidth:720, margin:'0 auto 52px'}}>
            SoulConnect is being built alongside people navigating anxiety, loneliness,
            overthinking, burnout, grief, and life transitions. You are not just an
            early user — you are a <strong style={{color:P}}>founding community member</strong> shaping what this becomes.
          </p>

          <div className="l-values-grid" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:24, maxWidth:820, margin:'0 auto'}}>
            {[
              {Icon:Ear,           title:'We Listen First',
               desc:'Every feature is shaped by real conversations with real people going through real struggles.'},
              {Icon:MessageCircle, title:'You Shape The Platform',
               desc:"Your feedback, your stories, and your needs define what SoulConnect becomes."},
              {Icon:Compass,       title:'No Fake Promises',
               desc:'We are honest about what we are building. Early access = real community, not a polished product.'},
            ].map((p,i)=>(
              <div key={i} className="l-values-card" style={{background:IVORY, borderRadius:22, padding:'32px 24px',
                border:`1px solid ${LILAC_LINE}`,
                boxShadow:'0 2px 12px rgba(34,27,58,0.03)', textAlign:'left',
                transition:'all .28s',}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 28px rgba(34,27,58,0.06)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 2px 12px rgba(34,27,58,0.03)';}}
              >
                <div className="l-values-icon" style={{marginBottom:16, color:P}}><p.Icon size={30} strokeWidth={1.5} /></div>
                <h3 className="l-values-h3" style={{fontSize:16, fontWeight:650, color:DARK, marginBottom:10, lineHeight:1.3}}>{p.title}</h3>
                <p className="l-values-p" style={{fontSize:14, color:NAVY_SOFT, lineHeight:1.68}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — EARLY ACCESS  (emotional, community sunset)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="early" style={{
        background:`linear-gradient(180deg,${BLUSH} 0%,${CREAM} 100%)`,
        padding:'clamp(64px,10vw,120px) 32px', position:'relative', overflow:'hidden',
      }}>
        <div className="l-early-inner" style={{
          maxWidth:1200, margin:'0 auto',
          display:'grid', gridTemplateColumns:'1fr 1.15fr',
          gap:'clamp(36px,5vw,88px)',
          alignItems:'center', position:'relative', zIndex:1,
        }}>
          {/* LEFT */}
          <div>
            {/* Eyebrow. This is the longest label on the page (23 chars), so
                at 700 weight in full-strength gold it read as a solid bar
                competing with the headline (9.5:1 against this ground — far
                more contrast than an orienting label needs). Lighter weight,
                softened gold and wider tracking let it read as a label. */}
            <div style={{fontSize:11.5, fontWeight:700, color:GOLD_TXT,
              letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:20}}>
              Join Our Early Community
            </div>
            <h2 style={{fontFamily:SF,
              fontSize:'clamp(2.2rem,3.5vw,4rem)',
              fontWeight:700, color:DARK, lineHeight:1.08,
              letterSpacing:'-0.025em', marginBottom:24}}>
              Find Your Circle.<br/>
              <span style={{color:P}}>We'll walk with you.</span>
            </h2>
            <p style={{fontSize:17, color:NAVY_SOFT,
              lineHeight:1.75, maxWidth:430, marginBottom:36}}>
              Tell us what you're going through so we can connect you with
              the right people and resources.
            </p>
            {/* Trust points */}
            {['No spam, ever. Your privacy is sacred.',
              'We\'ll match you with your community before launch.',
              'You help shape what SoulConnect becomes.'].map((t,i)=>(
              <div key={i} style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:14}}>
                <div style={{width:22, height:22, borderRadius:'50%', flexShrink:0, marginTop:1,
                  background:SEA,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:SEA_TXT}}><Check size={12} strokeWidth={2.5} /></div>
                <p style={{fontSize:15, color:NAVY_SOFT, lineHeight:1.6}}>{t}</p>
              </div>
            ))}
          </div>

          {/* RIGHT — Form */}
          <div style={{
            // Soft gold-to-lilac gradient border (padding-box/border-box
            // trick) with a faint white halo, so the card edge feels
            // finished rather than a flat lilac hairline.
            border:'2px solid transparent',
            background:`linear-gradient(${IVORY},${IVORY}) padding-box, linear-gradient(155deg,#D4B07A 0%,#E7D3E4 45%,#9C86CC 100%) border-box`,
            borderRadius:24, padding:'clamp(28px,4vw,44px)',
            boxShadow:'0 0 0 6px rgba(255,255,255,0.55), 0 24px 56px rgba(107,79,160,0.10)',
          }}>
            {earlySubmitted ? (
              <div style={{textAlign:'center', padding:'32px 12px',
                animation:'slideInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1)'}}>
                <div style={{marginBottom:24, color:'#3F7A5E',
                  display:'flex', justifyContent:'center'}}>
                  <Sprout size={52} strokeWidth={1.25} />
                </div>
                <h3 style={{fontFamily:SF, fontSize:28, fontWeight:800,
                  color:DARK, marginBottom:12, letterSpacing:'-0.02em'}}>
                  You're on the list.
                </h3>
                <p style={{color:NAVY_SOFT, fontSize:15, lineHeight:1.8, marginBottom:24}}>
                  Thank you for believing in SoulConnect.<br/><br/>
                  We'll send occasional updates as we build a place where people can heal, connect and grow together.
                </p>
                <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:28}}>
                  <a href="https://www.instagram.com/soulconnect.health" target="_blank" rel="noopener noreferrer"
                    style={{
                      padding:'12px 24px', borderRadius:12,
                      background:IVORY, border:'1px solid #DCD0F0',
                      color:DARK, fontSize:14, fontWeight:600,
                      textDecoration:'none', cursor:'pointer',
                      transition:'all 0.3s ease',
                      display:'inline-flex', alignItems:'center', gap:8
                    }}
                    onMouseEnter={e=>{e.target.style.background=CREAM_2; e.target.style.borderColor='#C9B8E8'}}
                    onMouseLeave={e=>{e.target.style.background=IVORY; e.target.style.borderColor='#DCD0F0'}}>
                    Follow Instagram
                  </a>
                  <button onClick={()=>{setEarlySubmitted(false); setEarlyForm({challenge:'',name:'',email:''})}}
                    style={{
                      padding:'12px 24px', borderRadius:12,
                      background:IVORY, border:'1px solid #DCD0F0',
                      color:DARK, fontSize:14, fontWeight:600,
                      cursor:'pointer',
                      transition:'all 0.3s ease',
                      display:'inline-flex', alignItems:'center', gap:8,
                      fontFamily:'inherit'
                    }}
                    onMouseEnter={e=>{e.target.style.background=CREAM_2; e.target.style.borderColor='#C9B8E8'}}
                    onMouseLeave={e=>{e.target.style.background=IVORY; e.target.style.borderColor='#DCD0F0'}}>
                    ← Return Home
                  </button>
                </div>
              </div>
            ):(
              <form onSubmit={handleSubmit}
                style={{display:'flex', flexDirection:'column', gap:18}}>
                <div style={{marginBottom:4}}>
                  <h3 style={{fontFamily:SF, fontSize:22, fontWeight:700,
                    color:DARK, marginBottom:6}}>Become an Early Member</h3>
                  <p style={{fontSize:14, color:NAVY_SOFT}}>
                    Join a community that cares.
                  </p>
                </div>

                {/* Benefit chips */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8}}>
                  {[
                    {Icon:Compass,   text:'Early Access'},
                    {Icon:HandHeart, text:'Help Shape SoulConnect'},
                    {Icon:Award,     text:'Founding Member'},
                    {Icon:Handshake, text:'Exclusive Updates'},
                  ].map((b,i)=>(
                    <div key={i} style={{
                      padding:'10px 12px', borderRadius:12,
                      background:CREAM, border:`1px solid ${LILAC_LINE}`,
                      display:'flex', alignItems:'center', gap:8,
                      fontSize:12.5, fontWeight:600, color:'#3A3350',
                    }}>
                      <b.Icon size={14} strokeWidth={1.75} color={GOLD_TXT} />
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>

                <label style={{fontSize:13, fontWeight:600,
                  color:'#3A3350', marginTop:8}}>
                  What are you struggling with most?
                </label>
                <div style={{position:'relative'}}>
                  <select value={earlyForm.challenge}
                    onChange={e=>setEarlyForm(f=>({...f,challenge:e.target.value}))}
                    className="l-form-field">
                    <option value="">Select your main challenge</option>
                    {['Anxiety','Overthinking','Loneliness','Breakup / Heartbreak',
                      'Burnout','Grief','Life Transition','Other'].map(o=>(
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <span style={{position:'absolute', right:16, top:'50%',
                    transform:'translateY(-50%)', color:MUTED,
                    pointerEvents:'none', fontSize:11}}>▼</span>
                </div>
                <input type="text" placeholder="Your Name"
                  value={earlyForm.name}
                  onChange={e=>setEarlyForm(f=>({...f,name:e.target.value}))}
                  className="l-form-field" required/>
                {/* Was "Enter your email to become an Early Member" (43
                    chars) — native <input> placeholders don't wrap, so on
                    mobile-width fields it visibly clipped mid-word at the
                    right edge. */}
                <input type="email" placeholder="Your email address"
                  value={earlyForm.email}
                  onChange={e=>setEarlyForm(f=>({...f,email:e.target.value}))}
                  className="l-form-field" required/>

                <label style={{fontSize:13, fontWeight:600,
                  color:'#3A3350'}}>
                  How did you hear about SoulConnect?
                </label>
                <div style={{position:'relative'}}>
                  <select value={earlyForm.referralSource}
                    onChange={e=>setEarlyForm(f=>({...f,referralSource:e.target.value}))}
                    className="l-form-field" required>
                    <option value="">Select an option</option>
                    {['Instagram','X (Twitter)','LinkedIn','Reddit',
                      'Google / Search','Blog / Article'].map(o=>(
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <span style={{position:'absolute', right:16, top:'50%',
                    transform:'translateY(-50%)', color:MUTED,
                    pointerEvents:'none', fontSize:11}}>▼</span>
                </div>

                <button type="submit" className="l-btn-p"
                  style={{marginTop:4, width:'100%', justifyContent:'center',
                    borderRadius:14, padding:'16px', fontSize:15}}>
                  Join Early Community →
                </button>

                {/* Trust indicators */}
                <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:4}}>
                  {[
                    {Icon:Lock,    text:'Your email stays private'},
                    {Icon:Mail,    text:'No spam'},
                    {Icon:Heart,   text:'Only meaningful updates'},
                    {Icon:BellOff, text:'Unsubscribe anytime'},
                  ].map((t,i)=>(
                    <div key={i} style={{display:'flex', alignItems:'center', gap:8,
                      fontSize:12.5, color:NAVY_SOFT}}>
                      <t.Icon size={13} strokeWidth={1.75} color={P} />
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>

                <p style={{textAlign:'center', fontSize:11,
                  color:MUTED, margin:'8px 0 0', lineHeight:1.5,
                  fontWeight:500}}>
                  Takes less than 10 seconds • Free forever • No credit card required
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — TRUST STRIP  (premium, single row)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="trust" style={{
        background:IVORY,
        borderTop:`1px solid ${LILAC_LINE}`,
        borderBottom:`1px solid ${LILAC_LINE}`,
        padding:'28px 32px',
      }}>
        <div className="l-trust-row" style={{
          maxWidth:1280, margin:'0 auto',
          display:'flex', alignItems:'center',
          justifyContent:'center',
          gap:'clamp(16px,3.5vw,52px)', flexWrap:'wrap',
        }}>
          {[
            {Icon:ShieldCheck, color:'rgba(109,74,255,0.15)',  border:'rgba(109,74,255,0.22)', title:'Safe Community',      sub:'Moderated with care.'},
            {Icon:Lock, color:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.22)', title:'Privacy Protected',    sub:'Your data stays yours.'},
            {Icon:LifeBuoy, color:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.2)',   title:'Crisis Resources',     sub:'Help is always available.'},
            {Icon:ScrollText, color:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.2)',  title:'Community Guidelines', sub:'Respect & inclusion always.'},
            {Icon:Scale, color:'rgba(59,130,246,0.12)',  border:'rgba(59,130,246,0.2)',  title:'Wellness Standards',   sub:'Evidence-based and trusted.'},
          ].map((t,i,arr)=>(
            <React.Fragment key={i}>
              <div style={{display:'flex', alignItems:'center', gap:12, flexShrink:0}}>
                <div style={{width:42, height:42, borderRadius:13,
                  background:CREAM_2,
                  border:`1px solid ${LILAC_LINE}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:19, flexShrink:0}}>
                  <t.Icon size={19} strokeWidth={1.5} color={P} />
                </div>
                <div>
                  <div style={{fontSize:13, fontWeight:700, color:DARK}}>{t.title}</div>
                  <div style={{fontSize:12, color:MUTED, lineHeight:1.4}}>{t.sub}</div>
                </div>
              </div>
              {i<arr.length-1&&(
                <div style={{width:1, height:32, background:LILAC_LINE, flexShrink:0}}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION — FINAL CTA  (premium · single · emotional)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background:`radial-gradient(ellipse at 50% 0%, ${BLUSH} 0%, rgba(251,243,238,0) 60%), ${CREAM_2}`,
        padding:'clamp(64px,8vw,96px) 32px',
        position:'relative', overflow:'hidden',
        minHeight:280,
        display:'flex', alignItems:'center',
      }}>
        {/* ── Content ── */}
        <div style={{
          maxWidth:900, margin:'0 auto', textAlign:'center',
          position:'relative', zIndex:1, width:'100%',
        }}>

          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:10,
            background:IVORY,
            border:'1px solid #DCD0F0',
            borderRadius:99, padding:'8px 20px', marginBottom:30,
          }}>
            <span style={{display:'flex', color:P}}><Heart size={14} strokeWidth={1.5} /></span>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:10.5, fontWeight:700, color:P,
                letterSpacing:'0.14em', textTransform:'uppercase', lineHeight:1.3}}>
                Early Access
              </div>
              <div style={{fontSize:11, color:NAVY_SOFT,
                letterSpacing:'0.04em', lineHeight:1.3}}>
                Building With Our First Community Members
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily:SF,
            fontSize:'clamp(2.25rem,5.5vw,4rem)',
            fontWeight:700, color:DARK, lineHeight:1.08,
            letterSpacing:'-0.02em', marginBottom:22,
          }}>
            Find Your Circle.
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize:'clamp(15px,1.7vw,18px)',
            color:NAVY_SOFT,
            lineHeight:1.75, maxWidth:560, margin:'0 auto 42px',
          }}>
            Healing happens faster when people feel understood, supported, and connected.
            Join the SoulConnect community and take your first step forward.
          </p>

          {/* Buttons */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:24, flexWrap:'wrap',
          }}>
            <a href="#early" className="l-btn-p"
              style={{padding:'16px 40px', borderRadius:14, fontSize:16,
                fontWeight:700, display:'inline-block', textDecoration:'none'}}>
              Find My Circle →
            </a>
            {/* Secondary text link next to the primary CTA — was a 26.5px
                tap height from bare text + underline. Extra vertical
                padding (offset by a matching negative margin so it doesn't
                shift the visible layout) brings the real hit area closer to
                the 48px minimum without changing how it looks. */}
            <Link to="/how-it-works"
              style={{fontSize:15, color:P,
                textDecoration:'none', fontWeight:600,
                borderBottom:'1px solid #C9B8E8',
                padding:'12px 4px 3px', margin:'-12px -4px 0', display:'inline-block',
                transition:'color .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.color=DARK;}}
              onMouseLeave={e=>{e.currentTarget.style.color=P;}}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER  — compact links · social · crisis · copyright
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background:IVORY,
        borderTop:`1px solid ${LILAC_LINE}`,
        padding:'0 32px', position:'relative', overflow:'hidden',
      }}>
        <div style={{maxWidth:1440, margin:'0 auto', position:'relative', zIndex:1}}>

          {/* ── Crisis strip — disabled pre-launch ── */}

          {/* ── Disclaimer ── */}
          <div style={{padding:'18px 0', borderBottom:`1px solid ${LILAC_LINE}`}}>
            <p style={{fontSize:12, color:MUTED,
              lineHeight:1.7, textAlign:'center'}}>
              <strong style={{color:'#3A3350'}}>Disclaimer:</strong>{' '}
              SoulConnect is a peer-support and wellness platform, not a medical,
              psychiatric, or emergency service. If you are in immediate danger,
              please call emergency services or visit your nearest hospital.{' '}
            </p>
          </div>

          {/* ── Bottom row: Logo + Nav + Social ── */}
          <div className="l-ft-bottom" style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            flexWrap:'wrap', gap:16, padding:'18px 0 24px',
          }}>
            {/* Logo */}
            <Link to="/" style={{display:'flex', alignItems:'center', gap:10,
              textDecoration:'none', flexShrink:0}}>
              <img src="/brand/logo/soulconnect-lotus-mark.svg" alt=""
                width="39" height="38"
                style={{height:38, width:'auto', display:'block'}}/>
              <div style={{fontFamily:SF, fontSize:18, fontWeight:700, color:DARK,
                letterSpacing:'-0.01em'}}>
                Soul<span style={{color:'#A87B45'}}>Connect</span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="l-ft-nav" style={{display:'flex', alignItems:'center',
              flexWrap:'wrap', gap:'4px 0'}}>
              {[
                {label:'About Us',           to:'/about',          isRoute:true},
                {label:'How It Works',       to:'/how-it-works',   isRoute:true},
                {label:'Trust & Safety',     to:'/trust-safety',   isRoute:true},
                {label:'FAQ',                to:'/faq',            isRoute:true},
                {label:'Privacy Policy',     to:'/privacy',        isRoute:true},
                {label:'Terms of Service',   to:'/terms',          isRoute:true},
                {label:'Contact',            to:'/contact',        isRoute:true},
                {label:'Cookie Policy',      to:'/cookies',        isRoute:true},
                {label:'Accessibility',      to:'/accessibility',  isRoute:true},
              ].map((l,i,arr)=>(
                <React.Fragment key={l.label}>
                  {/* padding was horizontal-only (0 11px), so the tap
                      target was just the 12px line height -- well under the
                      48px minimum. Vertical padding + display:inline-flex
                      brings the real hit area close to 44px without
                      changing how dense the row looks visually. */}
                  {l.isRoute
                    ? <Link to={l.to} style={{fontSize:12,
                        color:NAVY_SOFT, textDecoration:'none',
                        padding:'13px 11px', margin:'-13px 0', display:'inline-flex', alignItems:'center',
                        transition:'color .18s'}}
                        onMouseEnter={e=>e.currentTarget.style.color=P}
                        onMouseLeave={e=>e.currentTarget.style.color=NAVY_SOFT}
                      >{l.label}</Link>
                    : <a href={l.href} style={{fontSize:12,
                        color:NAVY_SOFT, textDecoration:'none',
                        padding:'13px 11px', margin:'-13px 0', display:'inline-flex', alignItems:'center',
                        transition:'color .18s'}}
                        onMouseEnter={e=>e.currentTarget.style.color=P}
                        onMouseLeave={e=>e.currentTarget.style.color=NAVY_SOFT}
                      >{l.label}</a>
                  }
                  {i<arr.length-1&&(
                    <span style={{color:'#DCD0F0', fontSize:11,
                      userSelect:'none'}}>|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Social */}
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              {[
                {
                  label:'Instagram', href:'https://www.instagram.com/soulconnect.health',
                  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>,
                },
                {
                  label:'X (Twitter)', href:'https://x.com/SoulConnectHQ',
                  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.8-5.979 6.8h-3.393l7.732-8.835L2.678 2.25h6.826l4.722 6.244 5.418-6.244zM17.002 18.335h1.834L6.822 4.126H4.881z"/>
                  </svg>,
                },
                {
                  label:'LinkedIn', href:'https://www.linkedin.com/company/%E2%9C%85soulconnect/?viewAsMember=true',
                  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20 0H4C1.794 0 0 1.794 0 4v16c0 2.206 1.794 4 4 4h16c2.206 0 4-1.794 4-4V4c0-2.206-1.794-4-4-4zM8 19H5v-9h3v9zM6.5 8.25C5.5 8.25 4.75 7.5 4.75 6.5C4.75 5.5 5.5 4.75 6.5 4.75C7.5 4.75 8.25 5.5 8.25 6.5C8.25 7.5 7.5 8.25 6.5 8.25zm12.5 10.75h-3v-4.5c0-1.5-1-2-2-2c-1.5 0-2.5 1-2.5 2v4.5h-3v-9h3v1.25c.5-.75 1.5-2.25 4-2.25c2.5 0 4.5 1.5 4.5 5v5z"/>
                  </svg>,
                },
              ].map((s,i)=>(
                <a key={i} href={s.href} aria-label={s.label}
                  style={{width:44, height:44, borderRadius:10,
                    background:CREAM_2,
                    border:`1px solid ${LILAC_LINE}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:P, textDecoration:'none', transition:'all .2s',}}
                  onMouseEnter={e=>{e.currentTarget.style.background=P;e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background=CREAM_2;e.currentTarget.style.color=P;}}
                >{s.svg}</a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p style={{fontSize:12, color:MUTED,
            textAlign:'center', paddingBottom:22}}>
            © 2026 SoulConnect. Built in India, for anyone who needs a place to land.
          </p>

        </div>
      </footer>
    </div>
  );
}
