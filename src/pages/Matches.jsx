import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// ── Static Data (preserved) ───────────────────────────────────────────────────
const QUOTES = [
  { text: "Small moments of peace create lasting transformation.", author: "Thich Nhất Hạnh" },
  { text: "You yourself deserve love as much as anybody in the entire universe.", author: "Buddha" },
  { text: "The present moment is the only door to healing.", author: "Eckhart Tolle" },
  { text: "Within you, there is a stillness and a sanctuary.", author: "Hermann Hesse" },
  { text: "Your healing is not linear. Honor every step.", author: "Unknown" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "Healing takes courage, and we all have courage.", author: "Tori Amos" },
];

const AFFIRMATIONS = [
  "I trust the timing of my life.",
  "I am worthy of deep, healing connection.",
  "Peace lives within me — I return to it now.",
  "My healing is sacred and I honor every step.",
  "I am safe. I am loved. I belong here.",
  "Every breath I take is an act of self-love.",
  "I release what no longer serves my highest good.",
];

const STAGES = [
  { emoji: '🌱', name: 'Awareness',     stage: 1, done: true,    locked: false, current: false, desc: 'Awakening to the journey'  },
  { emoji: '🌙', name: 'Healing',        stage: 2, done: false,   locked: false, current: true,  desc: 'Processing and releasing'  },
  { emoji: '🌿', name: 'Growth',         stage: 3, done: false,   locked: true,  current: false, desc: 'Expanding your awareness'  },
  { emoji: '🦋', name: 'Transformation', stage: 4, done: false,   locked: true,  current: false, desc: 'Becoming your true self'   },
  { emoji: '⭐', name: 'Awakening',      stage: 5, done: false,   locked: true,  current: false, desc: 'Living in alignment'       },
];

const CHALLENGES = [
  { icon: '💨', name: '3-Min Breathing',  pts: 30,  done: true,  streak: 'Day 7 streak 🔥', color: '#0891B2' },
  { icon: '📔', name: 'Gratitude Journal', pts: 50, done: false, streak: 'Tap to start',     color: '#D97706' },
  { icon: '🎧', name: '5-Min Meditation',  pts: 70, done: false, streak: 'Tap to start',     color: '#4F46E5' },
];

// ── Lotus SVG Icon ─────────────────────────────────────────────────────────────
function LotusIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }} aria-hidden="true">
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

// ── Bell Icon ──────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: 'none', stroke: 'rgba(255,255,255,0.65)', strokeWidth: 1.8 }}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <div style={{
        position: 'absolute', top: -2, right: -2,
        width: 8, height: 8, borderRadius: '50%',
        background: '#FF8C42',
        border: '1.5px solid rgba(8,2,20,0.9)',
      }} />
    </div>
  );
}

// ── Diya/Candle SVG ───────────────────────────────────────────────────────────
function DiyaIcon() {
  return (
    <svg viewBox="0 0 60 70" style={{ width: 52, height: 60 }} aria-hidden="true">
      {/* Mandala ring behind */}
      <circle cx="30" cy="42" r="22" fill="none" stroke="rgba(200,100,30,0.2)" strokeWidth="6" />
      <circle cx="30" cy="42" r="16" fill="none" stroke="rgba(200,100,30,0.12)" strokeWidth="3" />
      {/* Bowl / diya base */}
      <ellipse cx="30" cy="50" rx="16" ry="6" fill="#C06010" />
      <path d="M14,50 Q16,58 30,60 Q44,58 46,50 Z" fill="#A04A08" />
      <ellipse cx="30" cy="50" rx="16" ry="5" fill="#D4720A" />
      <ellipse cx="30" cy="49" rx="10" ry="3.5" fill="#E8861A" />
      {/* Wick */}
      <line x1="30" y1="46" x2="30" y2="36" stroke="#8B5A1A" strokeWidth="1.5" />
      {/* Flame */}
      <ellipse cx="30" cy="30" rx="5" ry="8" fill="rgba(255,200,60,0.9)" />
      <ellipse cx="30" cy="32" rx="3.5" ry="5.5" fill="rgba(255,140,30,0.95)" />
      <ellipse cx="30" cy="34" rx="2" ry="3" fill="rgba(255,80,10,0.8)" />
      <ellipse cx="30" cy="28" rx="2" ry="3.5" fill="rgba(255,240,120,0.95)" />
      {/* Glow around flame */}
      <ellipse cx="30" cy="30" rx="9" ry="12" fill="rgba(255,180,60,0.12)" />
    </svg>
  );
}

// ── Meditation Scene — Cinematic Spiritual Artwork ───────────────────────────
function MeditationScene() {
  const particles = [
    { cx: 155, cy: 195, r: 2.2, color: 'rgba(255,220,80,0.9)',  dur: '3.2s', delay: '0s'    },
    { cx: 430, cy: 175, r: 1.8, color: 'rgba(255,200,60,0.8)',  dur: '2.8s', delay: '0.4s'  },
    { cx: 215, cy: 145, r: 1.5, color: 'rgba(255,240,140,0.75)',dur: '3.5s', delay: '0.8s'  },
    { cx: 390, cy: 160, r: 2.0, color: 'rgba(255,180,60,0.85)', dur: '2.5s', delay: '0.2s'  },
    { cx: 130, cy: 120, r: 1.3, color: 'rgba(220,180,255,0.8)', dur: '4.0s', delay: '1.0s'  },
    { cx: 470, cy: 205, r: 1.6, color: 'rgba(255,220,100,0.75)',dur: '3.0s', delay: '0.6s'  },
    { cx: 105, cy: 255, r: 1.1, color: 'rgba(255,160,80,0.65)', dur: '2.6s', delay: '1.4s'  },
    { cx: 500, cy: 240, r: 1.4, color: 'rgba(245,184,65,0.75)', dur: '3.8s', delay: '0.3s'  },
    { cx: 180, cy: 90,  r: 1.0, color: 'rgba(200,150,255,0.7)', dur: '4.2s', delay: '1.2s'  },
    { cx: 420, cy: 100, r: 1.2, color: 'rgba(255,200,80,0.7)',  dur: '3.4s', delay: '0.7s'  },
    { cx: 355, cy: 265, r: 1.5, color: 'rgba(255,220,100,0.65)',dur: '2.9s', delay: '0.5s'  },
    { cx: 250, cy: 260, r: 1.2, color: 'rgba(200,160,255,0.7)', dur: '3.6s', delay: '0.9s'  },
    { cx: 310, cy: 130, r: 1.0, color: 'rgba(255,240,120,0.6)', dur: '3.1s', delay: '1.6s'  },
    { cx: 80,  cy: 200, r: 0.9, color: 'rgba(255,200,100,0.6)', dur: '4.5s', delay: '1.8s'  },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 460, overflow: 'hidden' }}>
      <svg
        viewBox="0 0 600 460"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Sky — deep purple → indigo → magenta → orange → gold */}
          <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#080118" />
            <stop offset="18%"  stopColor="#130535" />
            <stop offset="38%"  stopColor="#2D0860" />
            <stop offset="55%"  stopColor="#6B155A" />
            <stop offset="72%"  stopColor="#B83A18" />
            <stop offset="85%"  stopColor="#E06018" />
            <stop offset="100%" stopColor="#F0921A" />
          </linearGradient>

          {/* Lake water */}
          <linearGradient id="hLake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D05818" stopOpacity="0.55" />
            <stop offset="30%"  stopColor="#6B155A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#060010" stopOpacity="0.95" />
          </linearGradient>

          {/* Mandala radial glow */}
          <radialGradient id="hMandalaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,190,70,0.3)"  />
            <stop offset="35%"  stopColor="rgba(210,110,40,0.18)" />
            <stop offset="65%"  stopColor="rgba(150,50,200,0.12)" />
            <stop offset="100%" stopColor="transparent"            />
          </radialGradient>

          {/* Figure halo glow */}
          <radialGradient id="hFigureGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,170,60,0.55)"  />
            <stop offset="30%"  stopColor="rgba(210,90,40,0.35)"   />
            <stop offset="60%"  stopColor="rgba(140,30,160,0.2)"   />
            <stop offset="100%" stopColor="transparent"             />
          </radialGradient>

          {/* Vignette overlay */}
          <radialGradient id="hVignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="transparent"        />
            <stop offset="100%" stopColor="rgba(4,0,12,0.72)"  />
          </radialGradient>

          {/* Fog layer */}
          <linearGradient id="hFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(190,140,255,0)"    />
            <stop offset="50%"  stopColor="rgba(190,130,220,0.07)" />
            <stop offset="100%" stopColor="rgba(180,120,200,0)"    />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id="hSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="hBlur12"><feGaussianBlur stdDeviation="12" /></filter>
          <filter id="hBlur24"><feGaussianBlur stdDeviation="24" /></filter>
          <filter id="hBlur48"><feGaussianBlur stdDeviation="48" /></filter>
        </defs>

        {/* ── SKY BASE ── */}
        <rect width="600" height="460" fill="url(#hSky)" />

        {/* ── ATMOSPHERIC GLOWS ── */}
        {/* Sunset horizon bloom */}
        <ellipse cx="300" cy="330" rx="260" ry="110" fill="rgba(255,130,40,0.22)" filter="url(#hBlur48)" />
        {/* Upper purple atmosphere */}
        <ellipse cx="290" cy="160" rx="210" ry="130" fill="rgba(110,20,190,0.16)" filter="url(#hBlur48)" />
        {/* Pink mid-tone glow */}
        <ellipse cx="360" cy="240" rx="180" ry="90"  fill="rgba(220,55,120,0.13)" filter="url(#hBlur24)" />
        {/* Left warm accent */}
        <ellipse cx="80"  cy="350" rx="120" ry="70"  fill="rgba(255,100,30,0.12)" filter="url(#hBlur24)" />

        {/* ── BACK MOUNTAINS (most distant, lightest) ── */}
        <path d="M-10,300 L60,220 L120,255 L185,185 L250,225 L320,175 L385,215 L450,190 L520,220 L610,245 L610,390 L-10,390 Z"
          fill="rgba(35,8,70,0.5)" />
        {/* Thin glow on mountain ridgeline */}
        <path d="M-10,300 L60,220 L120,255 L185,185 L250,225 L320,175 L385,215 L450,190 L520,220 L610,245"
          fill="none" stroke="rgba(220,100,60,0.25)" strokeWidth="1.5" />

        {/* ── MID MOUNTAINS ── */}
        <path d="M-10,330 L50,268 L110,295 L170,238 L240,275 L305,228 L368,265 L435,242 L500,268 L565,250 L610,272 L610,395 L-10,395 Z"
          fill="rgba(20,4,50,0.68)" />
        <path d="M-10,330 L50,268 L110,295 L170,238 L240,275 L305,228 L368,265 L435,242 L500,268 L565,250 L610,272"
          fill="none" stroke="rgba(200,80,40,0.18)" strokeWidth="1" />

        {/* ── FOREGROUND MOUNTAINS ── */}
        <path d="M-10,360 L40,320 L85,342 L138,305 L200,335 L270,310 L338,328 L408,312 L468,338 L530,318 L610,348 L610,405 L-10,405 Z"
          fill="rgba(10,2,28,0.82)" />

        {/* ── LAKE / WATER ── */}
        <rect x="0" y="395" width="600" height="65" fill="url(#hLake)" />
        {/* Water horizontal shimmer lines */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1="0" y1={402 + i * 7} x2="600" y2={402 + i * 7}
            stroke="rgba(255,160,70,0.055)" strokeWidth="1.2" />
        ))}
        {/* Reflected mandala glow in lake */}
        <ellipse cx="300" cy="430" rx="160" ry="28" fill="rgba(255,140,55,0.18)" filter="url(#hBlur12)" />
        <ellipse cx="300" cy="445" rx="90"  ry="14" fill="rgba(255,100,40,0.12)" filter="url(#hBlur12)" />

        {/* ── SACRED GEOMETRY MANDALA ── */}
        {/* Outer ambient glow */}
        <circle cx="300" cy="220" r="230" fill="url(#hMandalaGlow)" />

        {/* 10 concentric rings */}
        {[28, 52, 78, 104, 128, 152, 172, 192, 210, 226].map((r, i) => (
          <circle key={i} cx="300" cy="220" r={r}
            fill="none"
            stroke={`rgba(245,185,62,${Math.max(0.08, 0.52 - i * 0.044)})`}
            strokeWidth={i < 2 ? 1.4 : i < 5 ? 1.0 : 0.7}
          />
        ))}

        {/* 24 radiating spokes */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * 15 - 90) * Math.PI / 180;
          const inner = i % 3 === 0 ? 28 : i % 3 === 1 ? 52 : 78;
          return (
            <line key={i}
              x1={300 + inner * Math.cos(a)} y1={220 + inner * Math.sin(a)}
              x2={300 + 226 * Math.cos(a)}   y2={220 + 226 * Math.sin(a)}
              stroke={`rgba(245,185,62,${i % 3 === 0 ? 0.18 : 0.09})`}
              strokeWidth={i % 3 === 0 ? 0.9 : 0.5}
            />
          );
        })}

        {/* Star of David (two triangles) at r=104 */}
        {(() => {
          const cx = 300, cy = 220, r = 104;
          const tri = (offset) => Array.from({ length: 3 }, (_, j) => {
            const a = (j * 120 + offset - 90) * Math.PI / 180;
            return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
          }).join(' ');
          return (<>
            <polygon points={tri(0)}   fill="none" stroke="rgba(245,185,62,0.22)" strokeWidth="0.9" />
            <polygon points={tri(60)}  fill="none" stroke="rgba(245,185,62,0.22)" strokeWidth="0.9" />
          </>);
        })()}

        {/* Inner 8-pointed star */}
        {Array.from({ length: 4 }, (_, i) => {
          const a1 = (i * 45 - 90) * Math.PI / 180;
          const a2 = (i * 45 + 90) * Math.PI / 180;
          return (
            <line key={i}
              x1={300 + 52 * Math.cos(a1)} y1={220 + 52 * Math.sin(a1)}
              x2={300 + 52 * Math.cos(a2)} y2={220 + 52 * Math.sin(a2)}
              stroke="rgba(245,185,62,0.32)" strokeWidth="0.9"
            />
          );
        })}

        {/* Lotus petals (8 petals at r=38) */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45) * Math.PI / 180;
          const px = 300 + 38 * Math.cos(a), py = 220 + 38 * Math.sin(a);
          return (
            <ellipse key={i} cx={px} cy={py} rx="16" ry="9"
              fill="rgba(245,185,62,0.06)"
              stroke="rgba(245,185,62,0.28)" strokeWidth="0.8"
              transform={`rotate(${i * 45}, ${px}, ${py})`}
            />
          );
        })}

        {/* Mandala jewel nodes at ring intersections */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          const r = i % 2 === 0 ? 128 : 172;
          return (
            <circle key={i}
              cx={300 + r * Math.cos(a)} cy={220 + r * Math.sin(a)}
              r={i % 2 === 0 ? 2.8 : 1.8}
              fill={`rgba(255,210,80,${i % 2 === 0 ? 0.75 : 0.5})`}
              filter="url(#hSoftGlow)"
            />
          );
        })}

        {/* Center jewel */}
        <circle cx="300" cy="220" r="14" fill="rgba(255,210,80,0.2)" stroke="rgba(245,185,62,0.65)" strokeWidth="1.3" />
        <circle cx="300" cy="220" r="7"  fill="rgba(255,230,110,0.85)" />
        <circle cx="300" cy="220" r="3"  fill="rgba(255,255,200,0.95)" />

        {/* ── FIGURE RADIAL HALO ── */}
        <circle cx="300" cy="345" r="200" fill="url(#hFigureGlow)" />

        {/* ── FOG / ATMOSPHERIC HAZE ── */}
        <rect x="0" y="300" width="600" height="95" fill="url(#hFog)" opacity="0.7" />
        <ellipse cx="300" cy="365" rx="260" ry="35" fill="rgba(200,140,230,0.045)" filter="url(#hBlur12)" />

        {/* ── LEFT TREES ── */}
        <ellipse cx="22"  cy="310" rx="52" ry="80"  fill="rgba(4,0,12,0.82)" />
        <ellipse cx="48"  cy="335" rx="40" ry="62"  fill="rgba(4,0,12,0.78)" />
        <ellipse cx="8"   cy="348" rx="32" ry="55"  fill="rgba(4,0,12,0.82)" />
        <ellipse cx="72"  cy="358" rx="28" ry="48"  fill="rgba(4,0,12,0.75)" />
        <rect    x="50"   y="370" width="14" height="50" fill="rgba(4,0,12,0.72)" />
        <rect    x="16"   y="382" width="10" height="38" fill="rgba(4,0,12,0.7)"  />

        {/* ── RIGHT TREES ── */}
        <ellipse cx="578" cy="310" rx="52" ry="80"  fill="rgba(4,0,12,0.82)" />
        <ellipse cx="552" cy="335" rx="40" ry="62"  fill="rgba(4,0,12,0.78)" />
        <ellipse cx="592" cy="348" rx="32" ry="55"  fill="rgba(4,0,12,0.82)" />
        <ellipse cx="528" cy="358" rx="28" ry="48"  fill="rgba(4,0,12,0.75)" />
        <rect    x="536"  y="370" width="14" height="50" fill="rgba(4,0,12,0.72)" />
        <rect    x="574"  y="382" width="10" height="38" fill="rgba(4,0,12,0.7)"  />

        {/* ── LIGHT RAYS from sunset (subtle) ── */}
        {Array.from({ length: 7 }, (_, i) => {
          const a = ((i * 25) - 65) * Math.PI / 180;
          return (
            <line key={i}
              x1="300" y1="330"
              x2={300 + 340 * Math.cos(a)} y2={330 + 340 * Math.sin(a)}
              stroke={`rgba(255,200,80,${0.025 - i * 0.002})`}
              strokeWidth={16 - i * 2}
            />
          );
        })}

        {/* ── MEDITATING FIGURE ── */}
        {/* Ground shadow */}
        <ellipse cx="300" cy="415" rx="75" ry="11" fill="rgba(0,0,0,0.45)" filter="url(#hBlur12)" />
        {/* Aura / subtle halo */}
        <circle cx="300" cy="355" r="88" fill="rgba(180,90,255,0.07)" filter="url(#hBlur12)" />

        {/* Base seated platform */}
        <ellipse cx="300" cy="407" rx="66" ry="15" fill="rgba(6,1,18,0.95)" />

        {/* Legs — lotus position */}
        <ellipse cx="256" cy="397" rx="44" ry="14" fill="#060112" transform="rotate(-14,256,397)" />
        <ellipse cx="344" cy="397" rx="44" ry="14" fill="#060112" transform="rotate(14,344,397)" />
        <ellipse cx="300" cy="400" rx="56" ry="15" fill="#060112" />

        {/* Torso */}
        <ellipse cx="300" cy="366" rx="26" ry="32" fill="#060112" />
        <path d="M274,400 Q277,350 300,338 Q323,350 326,400 Z" fill="#060112" />

        {/* Shoulders */}
        <ellipse cx="274" cy="360" rx="16" ry="13" fill="#060112" transform="rotate(-18,274,360)" />
        <ellipse cx="326" cy="360" rx="16" ry="13" fill="#060112" transform="rotate(18,326,360)" />

        {/* Arms resting down on knees */}
        <path d="M274,362 Q255,378 250,398" fill="none" stroke="#060112" strokeWidth="15" strokeLinecap="round" />
        <path d="M326,362 Q345,378 350,398" fill="none" stroke="#060112" strokeWidth="15" strokeLinecap="round" />

        {/* Hands */}
        <circle cx="249" cy="399" r="8" fill="#060112" />
        <circle cx="351" cy="399" r="8" fill="#060112" />

        {/* Neck */}
        <rect x="293" y="335" width="14" height="16" rx="6" fill="#060112" />

        {/* Head */}
        <circle cx="300" cy="325" r="21" fill="#060112" />

        {/* Hair bun */}
        <ellipse cx="300" cy="307" rx="11" ry="8"  fill="#060112" />
        <circle  cx="300" cy="302" r="6"            fill="#060112" />

        {/* Subtle inner glow on figure edges (backlit) */}
        <circle cx="300" cy="325" r="22" fill="none"
          stroke="rgba(255,160,60,0.12)" strokeWidth="3" filter="url(#hBlur12)" />
        <ellipse cx="300" cy="370" rx="28" ry="34" fill="none"
          stroke="rgba(200,100,255,0.08)" strokeWidth="4" filter="url(#hBlur12)" />

        {/* ── FLOATING PARTICLES ── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}>
            <animate attributeName="cy"
              values={`${p.cy};${p.cy - 20};${p.cy}`}
              dur={p.dur} begin={p.delay} repeatCount="indefinite" />
            <animate attributeName="opacity"
              values="0.45;1;0.45"
              dur={p.dur} begin={p.delay} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── VIGNETTE ── */}
        <rect width="600" height="460" fill="url(#hVignette)" />
      </svg>

      {/* Gradient blend into left text panel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '28%',
        background: 'linear-gradient(90deg, rgba(14,5,42,0.88) 0%, rgba(14,5,42,0.45) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ── Nav Link Component ────────────────────────────────────────────────────────
function NavLink({ label, icon, active, to, onClick }) {
  return (
    <Link
      to={to || '#'}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '0 4px', height: 64,
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
        textDecoration: 'none',
        borderBottom: active ? '2px solid #7C3AED' : '2px solid transparent',
        transition: 'color 0.2s, border-color 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </Link>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const today = new Date();
  const affirmation = AFFIRMATIONS[today.getDate() % AFFIRMATIONS.length];

  // Bokeh orb data
  const orangeOrbs = [
    { top: '62%',  left: '2%',   width: 340, height: 260, blur: 48, opacity: 0.5 },
    { top: '80%',  left: '18%',  width: 220, height: 180, blur: 36, opacity: 0.4 },
    { top: '45%',  left: '-4%',  width: 280, height: 200, blur: 42, opacity: 0.38 },
    { top: '88%',  left: '38%',  width: 200, height: 160, blur: 30, opacity: 0.35 },
  ];
  const purpleOrbs = [
    { top: '5%',   left: '55%',  width: 380, height: 300, blur: 55, opacity: 0.35 },
    { top: '20%',  left: '78%',  width: 260, height: 220, blur: 44, opacity: 0.3  },
    { top: '-4%',  left: '35%',  width: 300, height: 240, blur: 50, opacity: 0.28 },
    { top: '50%',  left: '88%',  width: 220, height: 180, blur: 40, opacity: 0.3  },
  ];
  const goldenDots = [
    { top: '12%', left: '8%',  size: 10, opacity: 0.45 },
    { top: '32%', left: '92%', size: 8,  opacity: 0.38 },
    { top: '55%', left: '15%', size: 14, opacity: 0.32 },
    { top: '70%', left: '82%', size: 9,  opacity: 0.5  },
    { top: '18%', left: '68%', size: 12, opacity: 0.35 },
    { top: '85%', left: '55%', size: 8,  opacity: 0.42 },
    { top: '40%', left: '48%', size: 10, opacity: 0.3  },
    { top: '92%', left: '12%', size: 13, opacity: 0.36 },
  ];

  // Soul matches data
  const soulMatches = [
    { name: 'Moon_42',     stage: 'Stage 2 · Healing', initial: 'M', color: '#7C3AED', online: true  },
    { name: 'StarLight_7', stage: 'Stage 3 · Growth',  initial: 'S', color: '#F5B841', online: true  },
    { name: 'Lotus_88',    stage: 'Stage 2 · Healing', initial: 'L', color: '#34C38F', online: true  },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif",
      color: '#F1EEF9',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── Animations ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -52%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -52%) scale(1.06); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes livePulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .sc-anim-1 { animation: fadeUp 0.5s 0.00s ease both; }
        .sc-anim-2 { animation: fadeUp 0.5s 0.08s ease both; }
        .sc-anim-3 { animation: fadeUp 0.5s 0.16s ease both; }
        .sc-anim-4 { animation: fadeUp 0.5s 0.24s ease both; }
        .sc-anim-5 { animation: fadeUp 0.5s 0.32s ease both; }
        .sc-anim-6 { animation: fadeUp 0.5s 0.40s ease both; }
        .sc-hover:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.35); }
        .sc-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        @media (max-width: 960px) {
          .sc-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .sc-two-col    { grid-template-columns: 1fr !important; }
          .sc-three-col  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .sc-three-col  { grid-template-columns: 1fr !important; }
          .sc-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        /* Hero responsive */
        @media (max-width: 768px) {
          .sc-hero-grid { grid-template-columns: 1fr !important; min-height: 420px !important; }
          .sc-hero-art  {
            position: absolute !important; inset: 0 !important;
            opacity: 0.55 !important; z-index: 0 !important;
            width: 100% !important; height: 100% !important;
          }
          .sc-hero-text {
            position: relative !important; z-index: 1 !important;
            background: linear-gradient(160deg, rgba(12,4,36,0.93) 0%, rgba(12,4,36,0.75) 100%) !important;
            padding: 32px 24px 28px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-anim-1, .sc-anim-2, .sc-anim-3,
          .sc-anim-4, .sc-anim-5, .sc-anim-6 { animation: none !important; }
        }
      `}</style>

      {/* ══ FIXED BACKGROUND ══ */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(160deg, #0D0320 0%, #1A0845 40%, #0D0220 100%)',
      }}>
        {/* Orange / amber bokeh orbs */}
        {orangeOrbs.map((o, i) => (
          <div key={`o-${i}`} style={{
            position: 'absolute',
            top: o.top, left: o.left,
            width: o.width, height: o.height,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(255,140,50,${o.opacity}) 0%, transparent 70%)`,
            filter: `blur(${o.blur}px)`,
            animation: `float ${7 + i * 1.8}s ${i * 1.2}s ease-in-out infinite`,
          }} />
        ))}
        {/* Purple bokeh orbs */}
        {purpleOrbs.map((o, i) => (
          <div key={`p-${i}`} style={{
            position: 'absolute',
            top: o.top, left: o.left,
            width: o.width, height: o.height,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(140,60,255,${o.opacity}) 0%, transparent 70%)`,
            filter: `blur(${o.blur}px)`,
            animation: `float ${8 + i * 1.5}s ${i * 0.9}s ease-in-out infinite`,
          }} />
        ))}
        {/* Large ambient center glow */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '20%',
          width: '60%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(100,50,200,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Golden bokeh dots */}
        {goldenDots.map((d, i) => (
          <div key={`d-${i}`} style={{
            position: 'absolute',
            top: d.top, left: d.left,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: 'rgba(245,184,65,0.85)',
            opacity: d.opacity,
            animation: `float ${5 + i * 0.8}s ${i * 0.7}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 64, zIndex: 50,
        background: 'rgba(8,2,20,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(120,70,220,0.2)',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px, 3vw, 40px)',
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32, flexShrink: 0 }}>
          <LotusIcon />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              SoulConnect
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', fontWeight: 500 }}>
              HEAL · CONNECT · GROW
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
          <NavLink label="Matches"    icon="🌙" active={true}  to="/matches"    />
          <NavLink label="Circles"    icon="🌀" active={false} to="/groups"     />
          <NavLink label="Healers"    icon="🧘" active={false} to="/healers"    />
          <NavLink label="Journal"    icon="📔" active={false} to="/journal"    />
          <NavLink label="Meditations" icon="✨" active={false} to="/meditations" />
          <NavLink label="Messages"   icon="💬" active={false} to="/messages"   />
        </div>

        {/* Right: bell + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <BellIcon />
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            cursor: 'pointer',
            border: '2px solid rgba(120,70,220,0.4)',
          }}>
            U
          </div>
        </div>
      </nav>

      {/* ══ SCROLLABLE CONTENT ══ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(16px, 2.5vw, 28px)',
        paddingTop: 'calc(64px + 28px)',
        paddingBottom: 60,
      }}>

        {/* ════════════════════════════════════════
            HERO CARD
        ════════════════════════════════════════ */}
        <div className="sc-anim-1 sc-hero-grid" style={{
          background: '#0C0228',
          border: '1px solid rgba(120,70,220,0.38)',
          borderRadius: 24,
          overflow: 'hidden',
          marginBottom: 16,
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          minHeight: 470,
          position: 'relative',
        }}>
          {/* Left Column — Text panel */}
          <div className="sc-hero-text" style={{
            padding: '42px 36px 38px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', zIndex: 2,
            background: 'linear-gradient(90deg, rgba(12,2,40,0.97) 0%, rgba(12,2,40,0.88) 72%, rgba(12,2,40,0.0) 100%)',
          }}>
            {/* Gold badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, color: '#F5B841',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '5px 14px', borderRadius: 20,
              border: '1px solid rgba(245,184,65,0.4)',
              background: 'rgba(245,184,65,0.1)',
              marginBottom: 20, alignSelf: 'flex-start',
            }}>
              ✦ YOUR DAILY INTENTION
            </div>

            {/* Headline */}
            <h1 style={{
              margin: '0 0 8px',
              fontSize: 'clamp(28px, 2.6vw, 40px)', fontWeight: 800, lineHeight: 1.18,
              color: '#fff', letterSpacing: '-0.02em',
            }}>
              Your healing journey
            </h1>
            <h1 style={{
              margin: '0 0 18px',
              fontSize: 'clamp(28px, 2.6vw, 40px)', fontWeight: 700, lineHeight: 1.18,
              color: '#A78BFA', fontStyle: 'italic', letterSpacing: '-0.02em',
            }}>
              continues today.
            </h1>

            {/* Quote */}
            <p style={{
              margin: '0 0 26px',
              fontSize: 14, lineHeight: 1.65,
              color: 'rgba(255,255,255,0.52)',
            }}>
              "I am safe. I am loved. I belong here."
            </p>

            {/* Glassmorphism Buttons */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
              <button
                onClick={() => navigate('/meetups')}
                style={{
                  padding: '12px 22px', borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  background: 'rgba(110,50,220,0.65)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  color: '#fff',
                  border: '1px solid rgba(170,120,255,0.45)',
                  cursor: 'pointer',
                  boxShadow: '0 6px 22px rgba(100,40,210,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
                  letterSpacing: '-0.01em',
                }}>
                Continue Your Journey →
              </button>
              <button
                onClick={() => navigate('/mood')}
                style={{
                  padding: '12px 22px', borderRadius: 12,
                  fontSize: 14, fontWeight: 700,
                  background: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>
                Today's Challenge
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: '🔥', val: String(user?.streak || 7), label: 'Day Streak'  },
                { icon: '🌙', val: 'Stage 2',                  label: 'Healing'     },
                { icon: '⚡', val: '847',                      label: 'Soul Points' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 500, marginTop: 1 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Cinematic Meditation Artwork */}
          <div className="sc-hero-art" style={{ position: 'relative' }}>
            <MeditationScene />
          </div>
        </div>

        {/* ════════════════════════════════════════
            4 STATS CARDS ROW
        ════════════════════════════════════════ */}
        <div className="sc-anim-2 sc-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}>

          {/* Card 1 — Day Streak */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ marginBottom: 8 }}>
              <DiyaIcon />
            </div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#F5B841', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(245,184,65,0.5)',
            }}>
              {user?.streak || 7}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
              Day Healing Streak
            </div>
            {/* Gold progress bar */}
            <div style={{
              width: '100%', height: 4,
              background: 'rgba(245,184,65,0.15)',
              borderRadius: 4, marginBottom: 8, overflow: 'hidden',
            }}>
              <div style={{
                width: '50%', height: '100%',
                background: 'linear-gradient(90deg, #F5B841, #FFD77A, #F5B841)',
                backgroundSize: '200% auto',
                borderRadius: 4,
                animation: 'shimmer 2.5s linear infinite',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>🔥 Best: 14 days</div>
          </div>

          {/* Card 2 — Souls Healing */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #0A1A30, #0C2040)',
            border: '1px solid rgba(0,180,150,0.3)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Globe icon */}
            <div style={{ fontSize: 24, marginBottom: 8 }}>🌍</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#00D4AA', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(0,212,170,0.5)',
            }}>
              1,247
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
              Souls healing right now
            </div>
            {/* Avatar row + LIVE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {[
                { bg: 'linear-gradient(135deg,#7C3AED,#5B21B6)', z: 4 },
                { bg: 'linear-gradient(135deg,#F5B841,#D97706)', z: 3 },
                { bg: 'linear-gradient(135deg,#00D4AA,#059669)', z: 2 },
                { bg: 'linear-gradient(135deg,#EC4899,#BE185D)', z: 1 },
              ].map((av, i) => (
                <div key={i} style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: av.bg,
                  border: '2px solid rgba(10,26,48,0.9)',
                  marginLeft: i > 0 ? -6 : 0,
                  zIndex: av.z,
                  position: 'relative',
                }} />
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 10 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#00D4AA',
                  animation: 'livePulse 1.5s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00D4AA', letterSpacing: '0.05em' }}>LIVE</span>
              </div>
            </div>
          </div>

          {/* Card 3 — Soul Points */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#A78BFA', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(167,139,250,0.5)',
            }}>
              847
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Soul Points</div>
            {/* Progress bar */}
            <div style={{
              width: '100%', height: 4,
              background: 'rgba(167,139,250,0.15)',
              borderRadius: 4, marginBottom: 6, overflow: 'hidden',
            }}>
              <div style={{
                width: '65%', height: '100%',
                background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                borderRadius: 4,
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Level 3 · 153 pts to Level 4</div>
          </div>

          {/* Card 4 — Healing Sessions */}
          <div className="sc-hover" style={{
            background: 'linear-gradient(135deg, #1A0842, #2A1060)',
            border: '1px solid rgba(120,70,220,0.35)',
            borderRadius: 18, padding: 22,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🧘</div>
            <div style={{
              fontSize: 40, fontWeight: 800, color: '#FF8C42', lineHeight: 1,
              marginBottom: 4,
              textShadow: '0 0 20px rgba(255,140,66,0.5)',
            }}>
              3
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Healing Sessions</div>
            {/* 8 pill segments */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i === 0 ? 'rgba(255,140,66,0.45)'
                    : i === 1 ? 'rgba(255,140,66,0.45)'
                    : i === 2 ? '#FF8C42'
                    : 'rgba(255,255,255,0.1)',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>This week: +2 from last</div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            TWO-COLUMN: Soul Journey + Daily Challenges
        ════════════════════════════════════════ */}
        <div className="sc-anim-3 sc-two-col" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 16, marginBottom: 16,
        }}>

          {/* LEFT — Soul Journey */}
          <div style={{
            background: 'linear-gradient(135deg, #0F0530, #1A0A3E)',
            border: '1px solid rgba(120,70,220,0.3)',
            borderRadius: 20, padding: 24,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>✨ Soul Journey</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Stage 2 of 5 · Healing</div>
            </div>

            {/* Stages */}
            <div style={{ position: 'relative' }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: 19, top: 30, bottom: 30,
                width: 2,
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0,
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {STAGES.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    position: 'relative', zIndex: 1,
                    padding: '8px 0',
                  }}>
                    {/* Stage circle */}
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                      background: s.done
                        ? 'linear-gradient(135deg, #34C38F, #10B981)'
                        : s.current
                          ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(91,33,182,0.3))'
                          : 'rgba(255,255,255,0.05)',
                      border: s.done
                        ? '2px solid #34C38F'
                        : s.current
                          ? '2px solid #7C3AED'
                          : '2px solid rgba(255,255,255,0.1)',
                      boxShadow: s.current ? '0 0 18px rgba(124,58,237,0.6)' : 'none',
                      opacity: s.locked ? 0.45 : 1,
                    }}>
                      {s.done ? '✓' : s.locked ? '🔒' : s.emoji}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 700,
                        color: s.locked ? 'rgba(255,255,255,0.35)' : '#fff',
                      }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                    </div>

                    {/* Status badge */}
                    {s.done && (
                      <div style={{ fontSize: 16, color: '#34C38F', fontWeight: 700 }}>✓</div>
                    )}
                    {s.current && (
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: '#A78BFA',
                        background: 'rgba(124,58,237,0.2)',
                        padding: '3px 9px', borderRadius: 20,
                        border: '1px solid rgba(124,58,237,0.4)',
                        whiteSpace: 'nowrap',
                      }}>
                        You are here
                      </div>
                    )}
                    {s.locked && (
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* View Full Journey */}
            <button
              onClick={() => navigate('/journey')}
              style={{
                marginTop: 20, width: '100%',
                padding: '11px', borderRadius: 12,
                fontSize: 13, fontWeight: 700,
                background: 'transparent', color: '#A78BFA',
                border: '1px solid rgba(124,58,237,0.35)',
                cursor: 'pointer',
              }}>
              View Full Journey
            </button>
          </div>

          {/* RIGHT — Daily Challenges */}
          <div style={{
            background: 'linear-gradient(135deg, #0A1225, #0F1A35)',
            border: '1px solid rgba(60,100,200,0.3)',
            borderRadius: 20, padding: 24,
          }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>⚡ Daily Challenges</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                Complete 3 challenges to earn 150 Soul Points
              </div>
            </div>

            {/* Challenge rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {CHALLENGES.map((ch, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 14, borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ch.done ? '#34C38F' : 'transparent',
                    border: `2px solid ${ch.done ? '#34C38F' : 'rgba(255,255,255,0.3)'}`,
                    fontSize: 11, fontWeight: 700, color: '#fff',
                  }}>
                    {ch.done && '✓'}
                  </div>

                  {/* Icon square */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    background: `${ch.color}22`,
                    border: `1px solid ${ch.color}44`,
                  }}>
                    {ch.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: ch.done ? '#fff' : 'rgba(255,255,255,0.8)',
                    }}>
                      {ch.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ch.streak}</div>
                  </div>

                  {/* Points badge */}
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 20,
                    background: ch.done ? 'rgba(245,184,65,0.18)' : 'rgba(255,255,255,0.05)',
                    color: ch.done ? '#F5B841' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${ch.done ? 'rgba(245,184,65,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    +{ch.pts} pts
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
              1 of 3 completed · 120 pts remaining
            </div>

            <button
              onClick={() => navigate('/mood')}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, fontWeight: 700, color: '#A78BFA',
                cursor: 'pointer', padding: 0,
              }}>
              View All Challenges →
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SOUL MATCHES SECTION
        ════════════════════════════════════════ */}
        <div className="sc-anim-4" style={{ marginBottom: 16 }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                🌙 Your Soul Matches
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                People who truly understand your journey
              </div>
            </div>
            <button
              onClick={() => navigate('/matches')}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, fontWeight: 700, color: '#A78BFA',
                cursor: 'pointer', padding: 0,
              }}>
              See All →
            </button>
          </div>

          {/* 3 match cards */}
          <div className="sc-three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {soulMatches.map((m, i) => (
              <div key={i} className="sc-hover" style={{
                background: 'linear-gradient(135deg, #130545, #1E0B52)',
                border: '1px solid rgba(120,70,220,0.2)',
                borderRadius: 18, padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 800, color: '#fff',
                    }}>
                      {m.initial}
                    </div>
                    {/* Online dot */}
                    <div style={{
                      position: 'absolute', bottom: 1, right: 1,
                      width: 11, height: 11, borderRadius: '50%',
                      background: m.online ? '#34C38F' : '#6B7280',
                      border: '2px solid #130545',
                    }} />
                  </div>
                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.stage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
