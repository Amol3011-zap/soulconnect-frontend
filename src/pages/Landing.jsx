import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
const P    = '#6D4AFF';
const LAV  = '#A78BFA';
const GLD  = '#F5B841';
const PNK  = '#F472B6';
const DARK = '#120B2E';
const SQ3  = 1.7320508;

const NAV_LINKS = [
  { label: 'About Us',     href: '/about',  isRoute: true  },
  { label: 'How It Works', href: '#how',    isRoute: false },
  { label: 'Resources',    href: '#trust',  isRoute: false },
  { label: 'Contact',      href: '#cta',    isRoute: false },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SVG ILLUSTRATION
═══════════════════════════════════════════════════════════════════════════════ */
function HeroIllustration() {
  /* ── Two Souls Connecting & Healing ──
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
    col:[LAV,GLD,PNK,'#C4B5FD','#FDE68A','#E879F9'][i%6],
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
          <stop offset="0%"   stopColor="#020115"/>
          <stop offset="40%"  stopColor="#0A0330"/>
          <stop offset="75%"  stopColor="#160848"/>
          <stop offset="100%" stopColor="#070122"/>
        </linearGradient>

        {/* ── Left soul orb: 3D sphere (highlight top-left) ── */}
        <radialGradient id="hiLOrb" cx="32%" cy="28%">
          <stop offset="0%"   stopColor="#DDD6FE"/>
          <stop offset="18%"  stopColor="#A78BFA"/>
          <stop offset="45%"  stopColor="#6D4AFF"/>
          <stop offset="78%"  stopColor="#3A1C8A"/>
          <stop offset="100%" stopColor="#180650" stopOpacity="0.8"/>
        </radialGradient>
        <radialGradient id="hiLAura" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#6D4AFF" stopOpacity="0.38"/>
          <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0"/>
        </radialGradient>

        {/* ── Right soul orb: 3D sphere (slightly warmer hue) ── */}
        <radialGradient id="hiROrb" cx="68%" cy="28%">
          <stop offset="0%"   stopColor="#F0EAFF"/>
          <stop offset="18%"  stopColor="#C4B5FD"/>
          <stop offset="45%"  stopColor="#8B5CF6"/>
          <stop offset="78%"  stopColor="#4C1D95"/>
          <stop offset="100%" stopColor="#1E0B52" stopOpacity="0.8"/>
        </radialGradient>
        <radialGradient id="hiRAura" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#8B5CF6" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
        </radialGradient>

        {/* ── Center nexus ── */}
        <radialGradient id="hiNex" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="8%"   stopColor="#FEF9C3"/>
          <stop offset="28%"  stopColor={GLD} stopOpacity="0.85"/>
          <stop offset="55%"  stopColor={LAV} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={P}   stopOpacity="0"/>
        </radialGradient>

        {/* ── Energy beam ── */}
        <linearGradient id="hiBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={LAV} stopOpacity="0.05"/>
          <stop offset="22%"  stopColor={LAV} stopOpacity="0.72"/>
          <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="1"/>
          <stop offset="78%"  stopColor={LAV} stopOpacity="0.72"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0.05"/>
        </linearGradient>

        {/* ── Lotus ── */}
        <linearGradient id="hiLP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F0E8FF" stopOpacity="0.97"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.55"/>
        </linearGradient>
        <radialGradient id="hiLC" cx="50%" cy="38%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="48%"  stopColor={GLD}/>
          <stop offset="100%" stopColor={GLD} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="hiVLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={GLD} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0.05"/>
        </linearGradient>

        {/* ── Filters ── */}
        <filter id="hiXGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="28" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiLGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="16" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hiMGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="b"/>
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
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── COSMIC BACKGROUND ── */}
      <rect x="0" y="0" width={W} height={H} fill="url(#hiBg)"/>

      {/* Nebula soft clouds */}
      <ellipse cx="160" cy="240" rx="220" ry="170" fill="rgba(109,74,255,0.06)" filter="url(#hiXGlow)"/>
      <ellipse cx="650" cy="270" rx="190" ry="150" fill="rgba(139,92,246,0.05)" filter="url(#hiXGlow)"/>
      <ellipse cx="400" cy="500" rx="200" ry="160" fill="rgba(245,184,65,0.025)" filter="url(#hiXGlow)"/>

      {/* ── STARS ── */}
      {stars.map((s,i)=>(
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.op}>
          <animate attributeName="opacity"
            values={`${s.op};${Math.min(s.op*3,0.95)};${s.op}`}
            dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* ── SACRED GEOMETRY RING (center, faint) ── */}
      <g opacity="0.09" transform={`translate(${CX},${MY})`}>
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
      <circle cx={LX} cy={MY} r={168} fill="url(#hiLAura)" filter="url(#hiXGlow)"/>
      {/* 3D Sphere body */}
      <circle cx={LX} cy={MY} r={90} fill="url(#hiLOrb)" filter="url(#hiMGlow)"/>
      {/* Specular shine top-left (makes it feel 3D) */}
      <ellipse cx={LX-30} cy={MY-32} rx={26} ry={18}
        fill="rgba(255,255,255,0.22)" filter="url(#hiSGlow)"/>
      <ellipse cx={LX-20} cy={MY-26} rx={10} ry={7}
        fill="rgba(255,255,255,0.38)"/>
      {/* Inner core glow */}
      <circle cx={LX} cy={MY} r={46} fill="rgba(167,139,250,0.18)" filter="url(#hiMGlow)"/>

      {/* Meditating figure inside left orb — reaching right */}
      <g transform={`translate(${LX},${MY})`} opacity="0.82">
        {/* Head */}
        <ellipse cx="-4" cy="-54" rx="13" ry="15" fill="#0C0326"/>
        <ellipse cx="-4" cy="-67" rx="15" ry="7"  fill="#080220"/>
        {/* Body */}
        <path d="M-17,-40 Q-21,-6 -14,18 L6,18 Q13,-6 9,-40 Z" fill="#0C0326"/>
        {/* Right arm reaching toward center/nexus */}
        <path d="M9,-22 Q30,-12 52,-10" stroke="#0C0326" strokeWidth="9"
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
        <ellipse cx="-4" cy="28" rx="28" ry="11" fill="#0C0326"/>
        <ellipse cx="-24" cy="22" rx="16" ry="9" fill="#100430"/>
        <ellipse cx="16" cy="22" rx="16" ry="9" fill="#100430"/>
        {/* Third eye */}
        <circle cx="-4" cy="-58" r="2.8" fill={GLD} opacity="0.65">
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Pulsing rings left */}
      {[0,1,2].map(i=>(
        <circle key={i} cx={LX} cy={MY} r={102+i*24}
          stroke={LAV} strokeWidth="0.9" fill="none">
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
      <circle cx={RX} cy={MY} r={168} fill="url(#hiRAura)" filter="url(#hiXGlow)"/>
      <circle cx={RX} cy={MY} r={90} fill="url(#hiROrb)" filter="url(#hiMGlow)"/>
      <ellipse cx={RX-30} cy={MY-32} rx={26} ry={18}
        fill="rgba(255,255,255,0.2)" filter="url(#hiSGlow)"/>
      <ellipse cx={RX-20} cy={MY-26} rx={10} ry={7}
        fill="rgba(255,255,255,0.34)"/>
      <circle cx={RX} cy={MY} r={46} fill="rgba(196,181,253,0.16)" filter="url(#hiMGlow)"/>

      {/* Meditating figure inside right orb — reaching left */}
      <g transform={`translate(${RX},${MY})`} opacity="0.82">
        <ellipse cx="4" cy="-54" rx="13" ry="15" fill="#0C0326"/>
        <ellipse cx="4" cy="-67" rx="15" ry="7"  fill="#080220"/>
        <path d="M-9,-40 Q-13,-6 -6,18 L14,18 Q21,-6 17,-40 Z" fill="#0C0326"/>
        {/* Left arm reaching toward center */}
        <path d="M-9,-22 Q-30,-12 -52,-10" stroke="#0C0326" strokeWidth="9"
          strokeLinecap="round" fill="none"/>
        <circle cx="-52" cy="-10" r="7" fill={GLD} opacity="0.85" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="5;9;5"       dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.55;1;0.55"  dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-52" cy="-10" r="12" fill={GLD} opacity="0.18" filter="url(#hiSGlow)">
          <animate attributeName="r"       values="10;18;10"      dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.04;0.2"   dur="2.7s" begin="0.4s" repeatCount="indefinite"/>
        </circle>
        <ellipse cx="4" cy="28" rx="28" ry="11" fill="#0C0326"/>
        <ellipse cx="-16" cy="22" rx="16" ry="9" fill="#100430"/>
        <ellipse cx="24" cy="22" rx="16" ry="9" fill="#100430"/>
        <circle cx="4" cy="-58" r="2.8" fill={GLD} opacity="0.65">
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur="3.4s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {[0,1,2].map(i=>(
        <circle key={i} cx={RX} cy={MY} r={102+i*24}
          stroke={LAV} strokeWidth="0.9" fill="none">
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
        stroke="rgba(196,181,253,0.32)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Lower fine ribbon */}
      <path d={`M${bx1},${MY+12} C${LX+160},${bcy+24} ${RX-160},${bcy+24} ${bx2},${MY+12}`}
        stroke="rgba(196,181,253,0.22)" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Traveling light particle L→R */}
      <circle r="4.5" fill="#fff" opacity="0.92" filter="url(#hiSGlow)">
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
      <circle cx={CX} cy={MY} r={110} fill="url(#hiNex)" opacity="0.65"
        filter="url(#hiLGlow)"/>
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
          fill={['rgba(245,184,65,0.2)','rgba(245,184,65,0.45)','rgba(245,184,65,0.75)'][i]}
          filter={i===2?'url(#hiSGlow)':undefined}>
          {i===2&&<animate attributeName="r" values="17;23;17" dur="2.6s" repeatCount="indefinite"/>}
        </circle>
      ))}
      <circle cx={CX} cy={MY} r={8} fill="#FEF9C3" filter="url(#hiSGlow)"/>
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
      <ellipse cx={CX} cy={LY+28} rx={130} ry={28}
        fill={LAV} opacity="0.07" filter="url(#hiLGlow)"/>
      <g filter="url(#hiPGlow)">
        {/* Outer petals ×8 */}
        {OD.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+90*Math.cos(r), py=LY+90*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={14} ry={46}
            fill="url(#hiLP)" opacity="0.88"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Mid petals ×8 */}
        {MD.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+59*Math.cos(r), py=LY+59*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={11} ry={30}
            fill="#DDD6FE" opacity="0.93"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Inner petals ×6 */}
        {ID.map((d,i)=>{
          const r=(d-90)*Math.PI/180;
          const px=CX+33*Math.cos(r), py=LY+33*Math.sin(r);
          return <ellipse key={i} cx={px} cy={py} rx={8} ry={18}
            fill="#F0E8FF" opacity="0.97"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Lotus center */}
        <circle cx={CX} cy={LY} r={38} fill="url(#hiLC)" filter="url(#hiLGlow)"/>
        <circle cx={CX} cy={LY} r={15} fill={GLD}>
          <animate attributeName="r"       values="13;19;13" dur="4.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;1;0.8" dur="4.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={CX} cy={LY} r={8} fill="#FEF9C3"/>
      </g>

      {/* ── FLOATING PARTICLES ── */}
      {pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.38">
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



/* ═══════════════════════════════════════════════════════════════════════════════
   VISION LOTUS SVG
═══════════════════════════════════════════════════════════════════════════════ */
function VisionLotus() {
  const cx=130, cy=130;
  const OD=[0,45,90,135,180,225,270,315];
  const MD=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const ID=[0,60,120,180,240,300];
  return (
    <svg viewBox="0 0 260 260" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="vlGlow" cx="50%" cy="50%">
          <stop offset="0%"   stopColor={LAV} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="vlPetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F0E8FF" stopOpacity="0.96"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.6"/>
        </linearGradient>
        <radialGradient id="vlCenter" cx="50%" cy="40%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="45%"  stopColor={GLD}/>
          <stop offset="100%" stopColor={GLD} stopOpacity="0"/>
        </radialGradient>
        <filter id="vlGlowF" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={120} ry={120} fill="url(#vlGlow)"/>
      <circle cx={cx} cy={cy} r={108} stroke="rgba(167,139,250,0.22)" strokeWidth="0.8" fill="none" strokeDasharray="5 7"/>
      <circle cx={cx} cy={cy} r={118} stroke={GLD} strokeWidth="0.5" fill="none" strokeDasharray="2 9" opacity="0.3"/>
      <g filter="url(#vlGlowF)">
        {OD.map((d,i)=>{const r=(d-90)*Math.PI/180,px=cx+76*Math.cos(r),py=cy+76*Math.sin(r);return<ellipse key={i} cx={px} cy={py} rx={11} ry={36} fill="url(#vlPetal)" opacity="0.88" transform={`rotate(${d},${px},${py})`}/>;}) }
        {MD.map((d,i)=>{const r=(d-90)*Math.PI/180,px=cx+50*Math.cos(r),py=cy+50*Math.sin(r);return<ellipse key={i} cx={px} cy={py} rx={8.5} ry={24} fill="#DDD6FE" opacity="0.93" transform={`rotate(${d},${px},${py})`}/>;}) }
        {ID.map((d,i)=>{const r=(d-90)*Math.PI/180,px=cx+28*Math.cos(r),py=cy+28*Math.sin(r);return<ellipse key={i} cx={px} cy={py} rx={6} ry={14} fill="#F5F3FF" opacity="0.97" transform={`rotate(${d},${px},${py})`}/>;}) }
        <circle cx={cx} cy={cy} r={30} fill="url(#vlCenter)"/>
        <circle cx={cx} cy={cy} r={12} fill={GLD}>
          <animate attributeName="r" values="10;15;10" dur="3.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx={cx} cy={cy} r={6}  fill="#FEF9C3"/>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PEOPLE SUNSET SVG
═══════════════════════════════════════════════════════════════════════════════ */
function PeopleSunset() {
  return (
    <svg viewBox="0 0 340 420" width="100%" height="100%"
      preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="psSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0A0220"/>
          <stop offset="38%"  stopColor="#361070"/>
          <stop offset="68%"  stopColor="#8B2A60"/>
          <stop offset="100%" stopColor="#E0723E"/>
        </linearGradient>
        <radialGradient id="psSun" cx="50%" cy="47%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="0.95"/>
          <stop offset="28%"  stopColor="#F59E0B" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#8B2A60"  stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="psWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3D1A6E" stopOpacity="0.82"/>
          <stop offset="100%" stopColor="#0E0430"/>
        </linearGradient>
      </defs>
      <rect width="340" height="420" fill="url(#psSky)"/>
      <ellipse cx="170" cy="196" rx="140" ry="120" fill="url(#psSun)"/>
      <circle  cx="170" cy="196" r="28"  fill="#FCD34D" opacity="0.88"/>
      <circle  cx="170" cy="196" r="17"  fill="#FEF9C3"/>
      <path d="M0,270 L55,200 L110,238 L165,188 L220,225 L275,198 L340,228 L340,420 L0,420Z"
        fill="#1A0840" opacity="0.92"/>
      <rect x="0" y="286" width="340" height="134" fill="url(#psWater)"/>
      {[.73,.79,.85,.92].map((y,i)=>
        <line key={i} x1="12" y1={420*y} x2="328" y2={420*y}
          stroke="rgba(167,139,250,0.1)" strokeWidth="0.8"/>
      )}
      {[82,118,155,192,226].map((x,i)=>(
        <g key={i} transform={`translate(${x},274) scale(${0.9+i%3*.07})`}>
          <circle cy="-42" r="9"  fill="#080216"/>
          <path d="M-10,-34 Q-13,-4 -11,14 L11,14 Q13,-4 10,-34Z" fill="#080216"/>
          <path d="M-11,12 Q-20,22 -16,30 L16,30 Q20,22 11,12Z" fill="#080216"/>
        </g>
      ))}
      <ellipse cx="170" cy="285" rx="100" ry="9" fill="#080216" opacity="0.5"/>
      <ellipse cx="170" cy="310" rx="60" ry="14" fill="#FCD34D" opacity="0.08"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LANDING COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [earlyForm,      setEarlyForm]      = useState({challenge:'',name:'',email:''});
  const [earlySubmitted, setEarlySubmitted] = useState(false);

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
    const s=()=>setScrolled(window.scrollY>50);
    window.addEventListener('scroll',s);
    return()=>window.removeEventListener('scroll',s);
  },[]);

  const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";
  const SF = '"Playfair Display",Georgia,serif';

  const handleSubmit = async e=>{
    e.preventDefault();
    if(!earlyForm.name||!earlyForm.email) return;
    try {
      const API = import.meta.env.VITE_API_URL || 'https://soulconnect-api.up.railway.app';
      await fetch(`${API}/api/early-access/`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: earlyForm.name,
          email: earlyForm.email,
          challenge: earlyForm.challenge || null,
          source: 'landing_page',
        }),
      });
      setEarlySubmitted(true);
    } catch(_) {
      setEarlySubmitted(true);
    }
  };

  /* ─── inline CSS ─────────────────────────────────────────────────────────── */
  const css = `
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}

    @keyframes fadeUp    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes floatY    {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes pulse     {0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}
    @keyframes orbDrift  {0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-14px)}}
    @keyframes glowBreathe{
      0%,100%{box-shadow:0 0 0 0 rgba(109,74,255,0),0 6px 28px rgba(109,74,255,0.22);}
      50%{box-shadow:0 0 0 16px rgba(109,74,255,0.04),0 14px 52px rgba(109,74,255,0.42);}
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

    /* Trust badge */
    .l-trust-badge{
      display:inline-flex;align-items:center;gap:10px;
      background:rgba(109,74,255,0.12);
      border:1px solid rgba(109,74,255,0.28);
      backdrop-filter:blur(14px);border-radius:999px;
      padding:12px 24px;cursor:default;
      animation:badgeFloat 5s ease-in-out infinite,badgeGlow 5s ease-in-out infinite;
    }
    .l-trust-badge-dot{
      width:8px;height:8px;border-radius:50%;
      background:linear-gradient(135deg,#6D4AFF,#A78BFA);
      animation:pulse 2.5s ease-in-out infinite;flex-shrink:0;
    }
    .l-trust-badge-rocket{font-size:16px;line-height:1;}
    .l-trust-badge-text{font-size:14px;font-weight:600;color:#A78BFA;letter-spacing:.01em;white-space:nowrap;}
    .l-trust-badge-sep{width:1px;height:14px;background:rgba(167,139,250,0.35);flex-shrink:0;}
    .l-trust-badge-label{font-size:13px;font-weight:500;color:rgba(167,139,250,0.75);white-space:nowrap;}

    /* Nav */
    .l-nav-a{
      color:rgba(255,255,255,0.8);font-size:14px;font-weight:500;
      text-decoration:none;padding:8px 16px;border-radius:10px;
      transition:all .18s;white-space:nowrap;
    }
    .l-nav-a:hover{color:#fff;background:rgba(255,255,255,0.1);}

    /* Buttons */
    .l-btn-p{
      display:inline-flex;align-items:center;gap:8px;
      padding:15px 34px;border-radius:14px;font-size:15px;font-weight:700;
      background:linear-gradient(135deg,${P} 0%,#5B3CE8 100%);
      color:#fff;border:none;cursor:pointer;text-decoration:none;
      font-family:inherit;letter-spacing:.01em;
      box-shadow:0 8px 32px rgba(109,74,255,0.48);
      transition:all .28s ease;
      animation:glowBreathe 5s ease-in-out infinite;
    }
    .l-btn-p:hover{transform:translateY(-4px);box-shadow:0 18px 52px rgba(109,74,255,0.62);animation:none;}
    .l-btn-g{
      display:inline-flex;align-items:center;gap:9px;
      padding:15px 34px;border-radius:14px;font-size:15px;font-weight:700;
      background:rgba(255,255,255,0.08);
      color:#fff;border:1.5px solid rgba(255,255,255,0.25);
      cursor:pointer;text-decoration:none;font-family:inherit;
      backdrop-filter:blur(8px);transition:all .22s ease;
    }
    .l-btn-g:hover{background:rgba(255,255,255,0.18);transform:translateY(-3px);border-color:rgba(255,255,255,0.45);}

    /* Challenge cards */
    .l-struggle-card{
      background:#fff;border-radius:28px;
      padding:40px 20px 32px;
      border:1.5px solid rgba(109,74,255,0.07);
      box-shadow:0 4px 28px rgba(109,74,255,0.06);
      text-align:center;transition:all .32s cubic-bezier(.175,.885,.32,1.275);
      cursor:default;display:flex;flex-direction:column;
      align-items:center;min-height:210px;
    }
    .l-struggle-card:hover{transform:translateY(-12px);}

    /* Help cards */
    .l-help-card{
      background:linear-gradient(145deg,#ffffff,#F7F4FF);
      border-radius:24px;padding:32px 24px;
      border:1.5px solid rgba(109,74,255,0.09);
      box-shadow:0 4px 24px rgba(109,74,255,0.06);
      transition:all .3s ease;
      display:flex;flex-direction:column;min-height:220px;
    }
    .l-help-card:hover{
      transform:translateY(-8px);
      box-shadow:0 24px 60px rgba(109,74,255,0.16);
      border-color:rgba(109,74,255,0.2);
    }

    /* Vision feature tiles */
    .l-vision-feat{
      background:rgba(255,255,255,0.07);backdrop-filter:blur(16px);
      border:1px solid rgba(167,139,250,0.18);border-radius:20px;
      padding:26px 20px;text-align:center;transition:all .26s;
    }
    .l-vision-feat:hover{
      background:rgba(109,74,255,0.2);
      border-color:rgba(167,139,250,0.45);
      transform:translateY(-4px);
      box-shadow:0 12px 36px rgba(109,74,255,0.28);
    }

    /* Form */
    .l-form-field{
      width:100%;padding:15px 18px;border-radius:14px;
      border:1.5px solid rgba(255,255,255,0.22);
      background:rgba(255,255,255,0.1);
      color:#fff;font-size:14px;font-family:inherit;
      outline:none;transition:border .2s,box-shadow .2s;backdrop-filter:blur(8px);
    }
    .l-form-field:focus{border-color:rgba(255,255,255,0.6);box-shadow:0 0 0 3px rgba(109,74,255,0.2);}
    .l-form-field option{background:#2D1060;color:#fff;}
    .l-form-field::placeholder{color:rgba(255,255,255,0.45);}
    select.l-form-field{appearance:none;-webkit-appearance:none;padding-right:38px;}

    /* Footer */
    .l-ft-link{
      display:block;color:rgba(255,255,255,0.5);font-size:14px;
      text-decoration:none;transition:all .18s;margin-bottom:10px;
    }
    .l-ft-link:hover{color:${LAV};transform:translateX(2px);}

    /* ── Responsive ── */
    @media(max-width:1100px){
      .l-hero-grid{grid-template-columns:1fr!important;min-height:auto!important;}
      .l-hero-illus{height:460px!important;order:-1;}
      .l-hero-text{text-align:center;align-items:center!important;}
      .l-trust-badge{max-width:90vw;flex-wrap:wrap;justify-content:center;}
      .l-hero-pills{justify-content:center!important;}
      .l-hero-btns{justify-content:center!important;}
      .l-struggle-grid{grid-template-columns:repeat(3,1fr)!important;}
      .l-help-grid{grid-template-columns:repeat(3,1fr)!important;}
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
      .l-logo-sub{display:none!important;}
      .l-ft-top{flex-direction:column!important;text-align:center!important;gap:28px!important;}
      .l-ft-top > *:last-child{text-align:center!important;}
    }
    @media(max-width:720px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-help-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-trust-row{flex-wrap:wrap!important;gap:18px!important;}
      .l-ft-bottom{flex-direction:column!important;align-items:center!important;gap:16px!important;}
      .l-ft-nav{flex-wrap:wrap!important;justify-content:center!important;}
    }
    @media(max-width:480px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
    }
  `;

  const STEPS = [
    {n:'1', icon:'✍️', title:'Share Your Journey',   desc:'Express what you\'re going through in a safe, judgment-free space.'},
    {n:'2', icon:'👥', title:'Find Similar People',   desc:'We match you with people who truly understand your experience.'},
    {n:'3', icon:'🫂', title:'Join Support Circles',  desc:'Enter meaningful conversations and guided support groups.'},
    {n:'4', icon:'🌱', title:'Grow Together',          desc:'Heal, learn, and transform alongside your community.'},
  ];

  const CHALLENGES = [
    {emoji:'🧠', label:'Anxiety &\nOverthinking', glow:'rgba(124,58,237,0.18)',  border:'rgba(124,58,237,0.28)',  shadow:'0 24px 56px rgba(124,58,237,0.22)'},
    {emoji:'💔', label:'Heartbreak',               glow:'rgba(219,39,119,0.18)', border:'rgba(219,39,119,0.28)', shadow:'0 24px 56px rgba(219,39,119,0.22)'},
    {emoji:'🌧', label:'Loneliness',                glow:'rgba(37,99,235,0.18)',  border:'rgba(37,99,235,0.28)',   shadow:'0 24px 56px rgba(37,99,235,0.22)'},
    {emoji:'🕯', label:'Grief',                     glow:'rgba(217,119,6,0.2)',   border:'rgba(217,119,6,0.3)',    shadow:'0 24px 56px rgba(217,119,6,0.24)'},
    {emoji:'🔥', label:'Burnout',                   glow:'rgba(234,88,12,0.18)', border:'rgba(234,88,12,0.28)',   shadow:'0 24px 56px rgba(234,88,12,0.22)'},
    {emoji:'🌱', label:'Life\nTransitions',          glow:'rgba(5,150,105,0.18)', border:'rgba(5,150,105,0.28)',   shadow:'0 24px 56px rgba(5,150,105,0.22)'},
  ];

  const HELPS = [
    {icon:'👥', grad:'135deg,rgba(109,74,255,0.18),rgba(167,139,250,0.12)', title:'Community\nMatching',  desc:'Find people who truly understand what you\'re going through.'},
    {icon:'🫂', grad:'135deg,rgba(244,114,182,0.18),rgba(232,121,249,0.1)',  title:'Support\nCircles',    desc:'Join guided peer conversations and healing groups.'},
    {icon:'📝', grad:'135deg,rgba(245,184,65,0.18),rgba(252,211,77,0.1)',    title:'Healing\nJournal',    desc:'Reflect, release, and understand yourself more deeply.'},
    {icon:'📊', grad:'135deg,rgba(16,185,129,0.18),rgba(52,211,153,0.1)',    title:'Mood\nTracking',      desc:'Track your emotional journey and celebrate progress.'},
    {icon:'🎯', grad:'135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.1)',    title:'Guided\nChallenges',  desc:'Build healthy habits and routines step by step.'},
    {icon:'🙏', grad:'135deg,rgba(124,58,237,0.18),rgba(109,74,255,0.1)',    title:'Wellness\nGuides',    desc:'Learn from trusted wellness frameworks and practices.'},
  ];

  return (
    <div style={{fontFamily:F, background:'#F8F5FF', color:DARK, overflowX:'hidden'}}>
      <style>{css}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:400, height:72,
        background:scrolled?'rgba(8,2,28,0.97)':'transparent',
        backdropFilter:scrolled?'blur(28px)':'none',
        borderBottom:scrolled?'1px solid rgba(109,74,255,0.18)':'none',
        transition:'all .35s ease',
        display:'flex', alignItems:'center',
      }}>
        <div style={{maxWidth:1440, margin:'0 auto', width:'100%',
          padding:'0 32px', display:'flex', alignItems:'center'}}>

          {/* Logo */}
          <Link to="/" style={{display:'flex', alignItems:'center', gap:10,
            textDecoration:'none', flexShrink:0, marginRight:36}}>
            <div style={{width:42, height:42, borderRadius:13,
              background:`linear-gradient(135deg,${P},${LAV})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:21, boxShadow:`0 4px 18px rgba(109,74,255,0.45)`}}>🪷</div>
            <div>
              <div style={{fontSize:18, fontWeight:800, color:'#fff',
                letterSpacing:'-0.02em', lineHeight:1.1}}>
                Soul<span style={{color:LAV}}>Connect</span>
              </div>
              <div className="l-logo-sub" style={{fontSize:9, color:LAV,
                fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginTop:1}}>
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
              style={{padding:'10px 24px', fontSize:14, borderRadius:11,
                animation:'glowBreathe 5s ease-in-out infinite'}}>
              Find My Circle 💜
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={()=>setMenuOpen(v=>!v)} className="l-mob-ham"
            style={{display:'none', marginLeft:'auto', width:40, height:40,
              borderRadius:10, background:'rgba(255,255,255,0.1)', border:'none',
              cursor:'pointer', flexDirection:'column', alignItems:'center',
              justifyContent:'center', gap:5}}>
            {[0,1,2].map(i=><span key={i} style={{width:20, height:2,
              background:'#fff', borderRadius:2, display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{position:'fixed', inset:0, zIndex:399,
          background:'rgba(8,2,28,0.97)', backdropFilter:'blur(18px)'}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute', top:72, left:0, right:0,
            padding:'24px 32px', borderBottom:`1px solid rgba(109,74,255,0.2)`}}
            onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=>(
              l.isRoute
                ? <Link key={l.label} to={l.href} onClick={()=>setMenuOpen(false)}
                    style={{display:'block', padding:'15px 0', fontSize:17, fontWeight:500,
                      color:'rgba(255,255,255,0.82)', textDecoration:'none',
                      borderBottom:'1px solid rgba(255,255,255,0.07)'}}>{l.label}</Link>
                : <a key={l.label} href={l.href} onClick={()=>setMenuOpen(false)}
                    style={{display:'block', padding:'15px 0', fontSize:17, fontWeight:500,
                      color:'rgba(255,255,255,0.82)', textDecoration:'none',
                      borderBottom:'1px solid rgba(255,255,255,0.07)'}}>{l.label}</a>
            ))}
            <a href="#early" onClick={()=>setMenuOpen(false)}
              style={{display:'block', textAlign:'center', marginTop:24, padding:'15px',
                borderRadius:13, fontSize:15, fontWeight:700, color:'#fff',
                textDecoration:'none',
                background:`linear-gradient(135deg,${P},#5B3CE8)`}}>
              Find My Circle 💜
            </a>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO  (850px, 50/50 cinematic)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position:'relative',
        background:`linear-gradient(155deg,#06011A 0%,#130530 30%,#261060 60%,#130530 100%)`,
        minHeight:850, overflow:'hidden',
      }}>
        {/* Ambient orbs */}
        <div style={{position:'absolute', top:'-8%', right:'2%', width:560, height:560,
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(109,74,255,0.22) 0%,transparent 70%)',
          pointerEvents:'none', animation:'orbDrift 14s ease-in-out infinite'}}/>
        <div style={{position:'absolute', bottom:'-4%', left:'4%', width:420, height:420,
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(245,184,65,0.06) 0%,transparent 70%)',
          pointerEvents:'none'}}/>
        <div style={{position:'absolute', top:'40%', left:'30%', width:300, height:300,
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%)',
          pointerEvents:'none', animation:'orbDrift 22s ease-in-out 4s infinite'}}/>

        <div className="l-hero-grid" style={{
          maxWidth:1440, margin:'0 auto',
          display:'grid', gridTemplateColumns:'50fr 50fr',
          minHeight:850, position:'relative', zIndex:1,
          padding:'0 32px',
        }}>
          {/* LEFT — Text */}
          <div className="l-hero-text" style={{
            display:'flex', flexDirection:'column', alignItems:'flex-start',
            justifyContent:'center',
            padding:'130px 48px 100px 0',
            animation:'fadeUp .9s ease both',
          }}>
            {/* Trust badge */}
            <div className="l-trust-badge" style={{marginBottom:24}}>
              <span className="l-trust-badge-dot"/>
              <span className="l-trust-badge-rocket">🚀</span>
              <span className="l-trust-badge-text">Early Access</span>
              <span className="l-trust-badge-sep"/>
              <span className="l-trust-badge-label">Building With Our First Community Members</span>
            </div>

            <h1 style={{
              fontFamily:SF,
              fontSize:'clamp(3rem,5vw,72px)',
              fontWeight:800, color:'#fff',
              lineHeight:1.06, letterSpacing:'-0.03em',
              marginBottom:26,
            }}>
              You Don't Have To<br/>
              <span style={{
                background:`linear-gradient(135deg,#fff 30%,${LAV} 70%,${GLD})`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text',
              }}>Go Through It Alone.</span>
            </h1>

            <p style={{fontSize:'clamp(15px,1.5vw,18px)',
              color:'rgba(255,255,255,0.58)',
              lineHeight:1.88, marginBottom:36, maxWidth:460}}>
              SoulConnect is a safe space to share, connect, and heal with people
              who truly understand what you're going through.
            </p>

            {/* Feature pills */}
            <div className="l-hero-pills" style={{display:'flex', flexWrap:'wrap',
              gap:10, marginBottom:42}}>
              {[
                {icon:'♡', label:'Real Connections'},
                {icon:'🛡', label:'Safe Community'},
                {icon:'🧠', label:'Emotional Support'},
              ].map((t,i)=>(
                <div key={i} style={{display:'flex', alignItems:'center', gap:8,
                  background:'rgba(255,255,255,0.07)',
                  border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:99, padding:'9px 18px',
                  backdropFilter:'blur(8px)'}}>
                  <span style={{fontSize:15}}>{t.icon}</span>
                  <span style={{color:'rgba(255,255,255,0.85)',
                    fontSize:13, fontWeight:500}}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="l-hero-btns" style={{display:'flex', flexWrap:'wrap', gap:14}}>
              <a href="#early" className="l-btn-p"
                style={{fontSize:16, padding:'16px 38px', borderRadius:15}}>
                Find My Circle 💜
              </a>
              <a href="#how" className="l-btn-g" style={{fontSize:15, padding:'16px 28px'}}>
                <span style={{width:30, height:30, borderRadius:'50%',
                  background:'rgba(255,255,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11}}>▶</span>
                How It Works
              </a>
            </div>

            {/* Sub note */}
            <p style={{marginTop:22, fontSize:12,
              color:'rgba(255,255,255,0.25)', lineHeight:1.6}}>
              No fake metrics. No fake testimonials. Just real community.
            </p>
          </div>

          {/* RIGHT — Cinematic illustration */}
          <div className="l-hero-illus" style={{
            position:'relative',
            animation:'floatY 10s ease-in-out infinite',
          }}>
            <HeroIllustration/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — WHAT ARE YOU STRUGGLING WITH
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="struggling" style={{
        background:'#fff',
        padding:'120px 32px',
      }}>
        <div style={{maxWidth:1280, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:64}}>
            <p style={{fontSize:12, fontWeight:700, color:P,
              letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12}}>
              YOU ARE NOT ALONE
            </p>
            <h2 style={{fontFamily:SF, fontSize:'clamp(2rem,3.2vw,52px)',
              fontWeight:800, color:DARK, letterSpacing:'-0.028em', marginBottom:18}}>
              What are you struggling with?
            </h2>
            <p style={{fontSize:17, color:'#6B7280', lineHeight:1.7, maxWidth:520, margin:'0 auto 24px'}}>
              Thousands of people are on a similar journey. Find your people.
            </p>
            <div style={{width:60, height:4,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99, margin:'0 auto'}}/>
          </div>

          <div className="l-struggle-grid" style={{
            display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:20, marginBottom:44}}>
            {CHALLENGES.map((c,i)=>(
              <div key={i} className="l-struggle-card"
                onMouseEnter={e=>{
                  e.currentTarget.style.boxShadow=c.shadow;
                  e.currentTarget.style.borderColor=c.border;
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.boxShadow='0 4px 28px rgba(109,74,255,0.06)';
                  e.currentTarget.style.borderColor='rgba(109,74,255,0.07)';
                }}>
                <div style={{width:84, height:84, borderRadius:24,
                  background:`radial-gradient(circle,${c.glow},transparent 72%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:40, margin:'0 auto 18px',
                  boxShadow:`0 0 28px ${c.glow}`,
                  border:`1.5px solid ${c.border}`,
                }}>
                  {c.emoji}
                </div>
                <div style={{fontSize:14, fontWeight:800, color:DARK,
                  lineHeight:1.4, whiteSpace:'pre-line'}}>{c.label}</div>
              </div>
            ))}
          </div>

          <p style={{textAlign:'center', fontSize:16, color:P, fontWeight:600, fontStyle:'italic'}}>
            If you've felt this — you belong here. 💜
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — HEALING STARTS WITH CONNECTION  (true timeline)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{background:'#F5F3FF', padding:'120px 32px'}}>
        <div style={{maxWidth:1180, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:80}}>
            <p style={{fontSize:12, fontWeight:700, color:P,
              letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12}}>
              YOUR PATH FORWARD
            </p>
            <h2 style={{fontFamily:SF, fontSize:'clamp(2rem,3.2vw,52px)',
              fontWeight:800, color:DARK, letterSpacing:'-0.028em', marginBottom:18}}>
              Healing Starts With Connection
            </h2>
            <div style={{width:60, height:4,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99, margin:'0 auto'}}/>
          </div>

          {/* Timeline */}
          <div style={{position:'relative'}}>
            {/* Connecting gradient line */}
            <div className="l-timeline-line" style={{
              position:'absolute',
              top:50,
              left:'calc(12.5% + 44px)',
              right:'calc(12.5% + 44px)',
              height:2,
              background:`linear-gradient(90deg,transparent 0%,${LAV} 20%,${P} 50%,${LAV} 80%,transparent 100%)`,
              backgroundSize:'200% 100%',
              animation:'timelineShimmer 4s linear infinite',
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
                    width:100, height:100, borderRadius:'50%',
                    background:`linear-gradient(145deg,${P},#4A28D6)`,
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center',
                    boxShadow:`0 10px 40px rgba(109,74,255,0.48)`,
                    border:'3px solid rgba(167,139,250,0.35)',
                    marginBottom:28, position:'relative',
                    animation:'glowBreathe 5s ease-in-out infinite',
                  }}>
                    <span style={{fontSize:36}}>{s.icon}</span>
                    {/* Number badge */}
                    <div style={{
                      position:'absolute', top:-8, right:-8,
                      width:32, height:32, borderRadius:'50%',
                      background:`linear-gradient(135deg,${GLD},#F59E0B)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:15, fontWeight:900, color:'#1a0a00',
                      boxShadow:'0 4px 14px rgba(245,184,65,0.55)',
                      animation:'goldGlow 5s ease-in-out infinite',
                    }}>{s.n}</div>
                  </div>

                  <h3 style={{fontSize:18, fontWeight:800, color:DARK,
                    marginBottom:12, lineHeight:1.25}}>{s.title}</h3>
                  <p style={{fontSize:14, color:'#6B7280', lineHeight:1.72,
                    maxWidth:180}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — OUR VISION  (dark luxury card with sacred geometry)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="vision" style={{background:'#F5F3FF', padding:'0 32px 120px'}}>
        <div style={{maxWidth:1440, margin:'0 auto'}}>
          <div style={{
            background:`linear-gradient(145deg,#0E0428 0%,#1E0A4A 40%,#2E1060 70%,#0E0428 100%)`,
            borderRadius:32,
            padding:'clamp(40px,5vw,72px)',
            position:'relative', overflow:'hidden',
            border:'1px solid rgba(167,139,250,0.12)',
            boxShadow:'0 40px 100px rgba(0,0,0,0.5)',
          }}>
            {/* Sacred geometry background */}
            <div style={{position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden'}}>
              <svg style={{position:'absolute', top:'-15%', right:'-8%', opacity:0.04}}
                viewBox="0 0 400 400" width="500" height="500" aria-hidden="true">
                {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
                  const r=(a)*Math.PI/180;
                  return <line key={i} x1="200" y1="200"
                    x2={200+190*Math.cos(r)} y2={200+190*Math.sin(r)}
                    stroke={LAV} strokeWidth="0.8"/>;
                })}
                {[40,80,120,160,190].map((r,i)=>(
                  <circle key={i} cx="200" cy="200" r={r}
                    stroke={LAV} strokeWidth="0.7" fill="none"
                    strokeDasharray={i%2===0?'4 6':'2 8'}/>
                ))}
              </svg>
              {/* Gold accent circles */}
              <div style={{position:'absolute', top:'20%', left:'18%',
                width:280, height:280, borderRadius:'50%',
                border:`1px solid rgba(245,184,65,0.08)`,
                pointerEvents:'none'}}/>
              <div style={{position:'absolute', top:'25%', left:'23%',
                width:180, height:180, borderRadius:'50%',
                border:`1px solid rgba(245,184,65,0.05)`,
                pointerEvents:'none'}}/>
            </div>

            {/* Glow orb */}
            <div style={{position:'absolute', top:'50%', left:'22%',
              transform:'translate(-50%,-50%)', width:460, height:460, borderRadius:'50%',
              background:'radial-gradient(circle,rgba(109,74,255,0.2) 0%,transparent 70%)',
              pointerEvents:'none'}}/>
            <div style={{position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)', width:300, height:300, borderRadius:'50%',
              background:`radial-gradient(circle,rgba(245,184,65,0.06) 0%,transparent 70%)`,
              pointerEvents:'none'}}/>

            <div className="l-vision-inner" style={{
              display:'grid',
              gridTemplateColumns:'2fr 1.6fr 2fr',
              gap:'clamp(28px,4vw,64px)',
              alignItems:'center',
              position:'relative', zIndex:1,
            }}>
              {/* LEFT — copy */}
              <div>
                <div style={{fontSize:11, fontWeight:700, color:GLD,
                  letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:18,
                  display:'flex', alignItems:'center', gap:8}}>
                  <div style={{width:20, height:1, background:GLD}}/>
                  OUR VISION
                  <div style={{width:20, height:1, background:GLD}}/>
                </div>
                <h2 style={{fontFamily:SF,
                  fontSize:'clamp(1.8rem,3vw,3.4rem)',
                  fontWeight:800, color:'#fff', lineHeight:1.12,
                  letterSpacing:'-0.026em', marginBottom:22}}>
                  A world where nobody<br/>
                  <span style={{color:LAV}}>struggles alone.</span>
                </h2>
                <p style={{fontSize:16, color:'rgba(255,255,255,0.48)', lineHeight:1.9, marginBottom:28}}>
                  We believe healing happens faster when we feel understood,
                  supported, and connected to people who truly get it.
                </p>
                <div style={{display:'flex', alignItems:'center', gap:12}}>
                  <div style={{width:38, height:38, borderRadius:11,
                    background:`linear-gradient(135deg,rgba(245,184,65,0.2),rgba(245,184,65,0.08))`,
                    border:`1px solid rgba(245,184,65,0.25)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:18}}>💜</div>
                  <p style={{fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.6}}>
                    Community-first. Human-first. Always.
                  </p>
                </div>
              </div>

              {/* CENTER — Lotus */}
              <div className="l-lotus-col" style={{display:'flex',
                justifyContent:'center', alignItems:'center'}}>
                <div style={{width:240, height:240,
                  animation:'floatY 9s ease-in-out infinite',
                  filter:'drop-shadow(0 0 40px rgba(109,74,255,0.35))'}}>
                  <VisionLotus/>
                </div>
              </div>

              {/* RIGHT — 4 feature tiles */}
              <div className="l-vision-feats" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                {[
                  {icon:'🤝', label:'Real\nConnections',       sub:'Genuine peer-to-peer support'},
                  {icon:'🛡', label:'Safe &\nModerated',        sub:'Community care always'},
                  {icon:'🔒', label:'Your Privacy\nMatters',    sub:'Private and secure'},
                  {icon:'🌿', label:'Healing &\nGrowth',        sub:'Grow through connection'},
                ].map((f,i)=>(
                  <div key={i} className="l-vision-feat">
                    <div style={{width:44, height:44, borderRadius:13,
                      background:`linear-gradient(135deg,rgba(109,74,255,0.22),rgba(167,139,250,0.1))`,
                      border:'1px solid rgba(167,139,250,0.2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:22, margin:'0 auto 12px'}}>
                      {f.icon}
                    </div>
                    <div style={{fontSize:13, fontWeight:700, color:'#fff',
                      marginBottom:6, whiteSpace:'pre-line', lineHeight:1.3}}>
                      {f.label}
                    </div>
                    <div style={{fontSize:11, color:'rgba(255,255,255,0.38)',
                      lineHeight:1.5}}>{f.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — HOW SOULCONNECT HELPS YOU  (glassmorphism cards)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:'#fff', padding:'120px 32px'}}>
        <div style={{maxWidth:1440, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:64}}>
            <p style={{fontSize:12, fontWeight:700, color:P,
              letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:12}}>
              WHAT WE'RE BUILDING
            </p>
            <h2 style={{fontFamily:SF, fontSize:'clamp(2rem,3.2vw,52px)',
              fontWeight:800, color:DARK, letterSpacing:'-0.028em', marginBottom:18}}>
              How SoulConnect Helps You
            </h2>
            <div style={{width:60, height:4,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99, margin:'0 auto'}}/>
          </div>

          <div className="l-help-grid" style={{
            display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:20}}>
            {HELPS.map((c,i)=>(
              <div key={i} className="l-help-card">
                {/* Gradient icon */}
                <div style={{width:62, height:62, borderRadius:20,
                  background:`linear-gradient(${c.grad})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28, marginBottom:18, flexShrink:0,
                  border:'1.5px solid rgba(109,74,255,0.1)',
                }}>
                  {c.icon}
                </div>
                <h3 style={{fontSize:15, fontWeight:800, color:DARK,
                  marginBottom:8, lineHeight:1.3, whiteSpace:'pre-line'}}>
                  {c.title}
                </h3>
                <p style={{fontSize:13, color:'#6B7280', lineHeight:1.65,
                  marginBottom:16, flex:1}}>{c.desc}</p>
                {/* Coming Soon badge */}
                <div style={{display:'inline-flex', alignItems:'center', gap:6,
                  background:`linear-gradient(135deg,rgba(109,74,255,0.1),rgba(167,139,250,0.06))`,
                  border:`1.5px solid rgba(109,74,255,0.18)`,
                  borderRadius:99, padding:'6px 13px', alignSelf:'flex-start'}}>
                  <span style={{width:5, height:5, borderRadius:'50%',
                    background:P, display:'inline-block',
                    animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:10, fontWeight:700, color:P,
                    letterSpacing:'0.07em'}}>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5b — CURRENTLY BUILDING IN PUBLIC
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:'#F5F3FF', padding:'100px 32px'}}>
        <div style={{maxWidth:960, margin:'0 auto', textAlign:'center'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8,
            background:`rgba(109,74,255,0.1)`,
            border:`1px solid rgba(109,74,255,0.2)`,
            borderRadius:99, padding:'7px 20px', marginBottom:28}}>
            <span style={{width:7, height:7, borderRadius:'50%', background:'#34C38F',
              display:'inline-block', animation:'pulse 2s ease-in-out infinite'}}/>
            <span style={{fontSize:11, fontWeight:700, color:P,
              letterSpacing:'0.12em', textTransform:'uppercase'}}>
              Building In Public
            </span>
          </div>

          <h2 style={{fontFamily:SF, fontSize:'clamp(1.8rem,3vw,46px)',
            fontWeight:800, color:DARK, lineHeight:1.15,
            letterSpacing:'-0.026em', marginBottom:22}}>
            Currently Building With<br/>Early Community Members
          </h2>
          <p style={{fontSize:'clamp(15px,1.6vw,18px)', color:'#4B5563',
            lineHeight:1.88, maxWidth:720, margin:'0 auto 52px'}}>
            SoulConnect is being built alongside people navigating anxiety, loneliness,
            overthinking, burnout, grief, and life transitions. You are not just an
            early user — you are a <strong style={{color:P}}>founding community member</strong> shaping what this becomes.
          </p>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:24, maxWidth:820, margin:'0 auto'}}>
            {[
              {icon:'🧪', title:'We Listen First',
               desc:'Every feature is shaped by real conversations with real people going through real struggles.'},
              {icon:'💬', title:'You Shape The Platform',
               desc:"Your feedback, your stories, and your needs define what SoulConnect becomes."},
              {icon:'💜', title:'No Fake Promises',
               desc:'We are honest about what we are building. Early access = real community, not a polished product.'},
            ].map((p,i)=>(
              <div key={i} style={{background:'#fff', borderRadius:22, padding:'32px 24px',
                border:'1.5px solid rgba(109,74,255,0.09)',
                boxShadow:'0 4px 24px rgba(109,74,255,0.07)', textAlign:'left',
                transition:'all .28s',}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 18px 48px rgba(109,74,255,0.14)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 24px rgba(109,74,255,0.07)';}}
              >
                <div style={{fontSize:34, marginBottom:16}}>{p.icon}</div>
                <h3 style={{fontSize:16, fontWeight:800, color:DARK, marginBottom:10, lineHeight:1.3}}>{p.title}</h3>
                <p style={{fontSize:13, color:'#6B7280', lineHeight:1.68}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — EARLY ACCESS  (emotional, community sunset)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="early" style={{
        background:`linear-gradient(145deg,#0E0228 0%,#200A4E 40%,#3C1675 70%,#0E0228 100%)`,
        padding:'120px 32px', position:'relative', overflow:'hidden',
      }}>
        {/* Floating particles */}
        {Array.from({length:18},(_,i)=>(
          <div key={i} style={{position:'absolute',
            left:`${4+(i*6.7)%90}%`, top:`${5+(i*11.3)%88}%`,
            width:i%4===0?3:2, height:i%4===0?3:2,
            borderRadius:'50%',
            background:[LAV,GLD,PNK,'#C4B5FD'][i%4], opacity:0.3,
            animation:`floatY ${5+(i%5)*1.4}s ease-in-out ${i*.5}s infinite`,
            pointerEvents:'none'}}/>
        ))}
        {/* Community sunset bg */}
        <div className="l-early-right" style={{
          position:'absolute', right:0, top:0, bottom:0, width:'32%',
          overflow:'hidden', opacity:0.55, pointerEvents:'none'}}>
          <PeopleSunset/>
        </div>
        {/* Glow */}
        <div style={{position:'absolute', top:'40%', left:'35%',
          transform:'translate(-50%,-50%)', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(109,74,255,0.12) 0%,transparent 70%)',
          pointerEvents:'none'}}/>

        <div className="l-early-inner" style={{
          maxWidth:1200, margin:'0 auto',
          display:'grid', gridTemplateColumns:'1fr 1.15fr',
          gap:'clamp(36px,5vw,88px)',
          alignItems:'center', position:'relative', zIndex:1,
        }}>
          {/* LEFT */}
          <div>
            <div style={{fontSize:11, fontWeight:700, color:GLD,
              letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:18,
              display:'flex', alignItems:'center', gap:8}}>
              <div style={{width:20, height:1, background:GLD}}/>
              JOIN OUR EARLY COMMUNITY
            </div>
            <h2 style={{fontFamily:SF,
              fontSize:'clamp(2.2rem,3.5vw,4rem)',
              fontWeight:800, color:'#fff', lineHeight:1.08,
              letterSpacing:'-0.03em', marginBottom:24}}>
              Find Your Circle.<br/>
              <span style={{color:PNK}}>We'll walk with you.</span> ♡
            </h2>
            <p style={{fontSize:17, color:'rgba(255,255,255,0.48)',
              lineHeight:1.88, maxWidth:420, marginBottom:36}}>
              Tell us what you're going through so we can connect you with
              the right people and resources.
            </p>
            {/* Trust points */}
            {['No spam, ever. Your privacy is sacred.',
              'We\'ll match you with your community before launch.',
              'You help shape what SoulConnect becomes.'].map((t,i)=>(
              <div key={i} style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:14}}>
                <div style={{width:22, height:22, borderRadius:'50%', flexShrink:0, marginTop:1,
                  background:`linear-gradient(135deg,${P},${LAV})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11}}>✓</div>
                <p style={{fontSize:14, color:'rgba(255,255,255,0.52)', lineHeight:1.6}}>{t}</p>
              </div>
            ))}
          </div>

          {/* RIGHT — Form */}
          <div style={{
            background:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px)',
            border:'1px solid rgba(255,255,255,0.14)',
            borderRadius:28, padding:'clamp(28px,4vw,44px)',
            boxShadow:'0 32px 80px rgba(0,0,0,0.3)',
          }}>
            {earlySubmitted ? (
              <div style={{textAlign:'center', padding:'28px 0'}}>
                <div style={{fontSize:60, marginBottom:20,
                  filter:'drop-shadow(0 0 24px rgba(167,139,250,0.6))'}}>💜</div>
                <h3 style={{fontFamily:SF, fontSize:26, fontWeight:800,
                  color:'#fff', marginBottom:14}}>You're on the list!</h3>
                <p style={{color:'rgba(255,255,255,0.52)', fontSize:16, lineHeight:1.72}}>
                  We'll reach out when your circle is ready.<br/>
                  Healing begins soon.
                </p>
              </div>
            ):(
              <form onSubmit={handleSubmit}
                style={{display:'flex', flexDirection:'column', gap:16}}>
                <div style={{marginBottom:4}}>
                  <h3 style={{fontFamily:SF, fontSize:22, fontWeight:700,
                    color:'#fff', marginBottom:6}}>Request Early Access</h3>
                  <p style={{fontSize:13, color:'rgba(255,255,255,0.4)'}}>
                    Join the founding community.
                  </p>
                </div>
                <label style={{fontSize:13, fontWeight:600,
                  color:'rgba(255,255,255,0.65)'}}>
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
                    transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)',
                    pointerEvents:'none', fontSize:11}}>▼</span>
                </div>
                <input type="text" placeholder="Your Name"
                  value={earlyForm.name}
                  onChange={e=>setEarlyForm(f=>({...f,name:e.target.value}))}
                  className="l-form-field" required/>
                <input type="email" placeholder="Email Address"
                  value={earlyForm.email}
                  onChange={e=>setEarlyForm(f=>({...f,email:e.target.value}))}
                  className="l-form-field" required/>
                <button type="submit" className="l-btn-p"
                  style={{marginTop:6, width:'100%', justifyContent:'center',
                    borderRadius:14, padding:'16px', fontSize:15,
                    animation:'glowBreathe 5s ease-in-out infinite'}}>
                  Join Early Access →
                </button>
                <p style={{textAlign:'center', fontSize:12,
                  color:'rgba(255,255,255,0.28)', margin:0, lineHeight:1.6}}>
                  🔒 We respect your privacy. No spam, ever.
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
        background:'#fff',
        borderTop:'1px solid rgba(109,74,255,0.08)',
        borderBottom:'1px solid rgba(109,74,255,0.08)',
        padding:'28px 32px',
      }}>
        <div className="l-trust-row" style={{
          maxWidth:1280, margin:'0 auto',
          display:'flex', alignItems:'center',
          justifyContent:'center',
          gap:'clamp(16px,3.5vw,52px)', flexWrap:'wrap',
        }}>
          {[
            {icon:'🛡', color:'rgba(109,74,255,0.15)',  border:'rgba(109,74,255,0.22)', title:'Safe Community',      sub:'Moderated with care.'},
            {icon:'🔒', color:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.22)', title:'Privacy Protected',    sub:'Your data stays yours.'},
            {icon:'🚨', color:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.2)',   title:'Crisis Resources',     sub:'Help is always available.'},
            {icon:'📋', color:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.2)',  title:'Community Guidelines', sub:'Respect & inclusion always.'},
            {icon:'⚖️', color:'rgba(59,130,246,0.12)',  border:'rgba(59,130,246,0.2)',  title:'Wellness Standards',   sub:'Evidence-based and trusted.'},
          ].map((t,i,arr)=>(
            <React.Fragment key={i}>
              <div style={{display:'flex', alignItems:'center', gap:12, flexShrink:0}}>
                <div style={{width:42, height:42, borderRadius:13,
                  background:t.color,
                  border:`1.5px solid ${t.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:19, flexShrink:0}}>
                  {t.icon}
                </div>
                <div>
                  <div style={{fontSize:13, fontWeight:700, color:DARK}}>{t.title}</div>
                  <div style={{fontSize:11, color:'#9CA3AF', lineHeight:1.4}}>{t.sub}</div>
                </div>
              </div>
              {i<arr.length-1&&(
                <div style={{width:1, height:32, background:'rgba(109,74,255,0.1)', flexShrink:0}}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION — FINAL CTA  (premium · single · emotional)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background:`linear-gradient(155deg,#140028 0%,#24004A 55%,#3B0F72 100%)`,
        padding:'clamp(64px,8vw,96px) 32px',
        position:'relative', overflow:'hidden',
        minHeight:280,
        display:'flex', alignItems:'center',
      }}>
        {/* Sacred geometry */}
        <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}} aria-hidden="true">
          <svg viewBox="0 0 900 350" width="100%" height="100%"
            preserveAspectRatio="xMidYMid slice" style={{opacity:0.055}}>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
              const r=a*Math.PI/180;
              return <line key={i} x1="450" y1="175"
                x2={450+240*Math.cos(r)} y2={175+240*Math.sin(r)}
                stroke={LAV} strokeWidth="0.6"/>;
            })}
            {[45,90,135,175,215].map((r,i)=>(
              <circle key={i} cx="450" cy="175" r={r}
                stroke={LAV} strokeWidth="0.5" fill="none" strokeDasharray="3 7"/>
            ))}
          </svg>
        </div>

        {/* Soft lotus radial glow */}
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:560, height:560,
          background:`radial-gradient(ellipse at center,rgba(109,74,255,0.22) 0%,rgba(167,139,250,0.07) 45%,transparent 70%)`,
          pointerEvents:'none', zIndex:0,
        }}/>

        {/* Gentle top light */}
        <div style={{
          position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)',
          width:700, height:200,
          background:`radial-gradient(ellipse at center,rgba(167,139,250,0.12) 0%,transparent 70%)`,
          pointerEvents:'none', zIndex:0,
        }}/>

        {/* Floating particles */}
        <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',
          pointerEvents:'none',zIndex:0}} aria-hidden="true">
          {Array.from({length:24},(_,i)=>({
            x:3+((i*97+i*i*13)%94),
            y:3+((i*67+i*i*17)%94),
            r:0.7+(i%5)*0.45,
            col:[LAV,GLD,PNK,'#C4B5FD','#FDE68A'][i%5],
            dur:3.2+(i%5)*1.1, del:i*0.35,
          })).map((p,i)=>(
            <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r={p.r}
              fill={p.col} opacity={0.3+(i%3)*0.1}>
              <animate attributeName="opacity"
                values={`${0.18+(i%3)*0.12};${0.5+(i%3)*0.18};${0.18+(i%3)*0.12}`}
                dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
              <animateTransform attributeName="transform" type="translate"
                values={`0,0;${(i%2?4:-4)},${(i%3?-5:5)};0,0`}
                dur={`${p.dur*1.6}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
            </circle>
          ))}
        </svg>

        {/* ── Content ── */}
        <div style={{
          maxWidth:900, margin:'0 auto', textAlign:'center',
          position:'relative', zIndex:1, width:'100%',
        }}>

          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:10,
            background:'rgba(109,74,255,0.2)',
            border:'1px solid rgba(167,139,250,0.3)',
            borderRadius:99, padding:'8px 20px', marginBottom:30,
            backdropFilter:'blur(12px)',
          }}>
            <span style={{fontSize:15, lineHeight:1}}>💜</span>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:10, fontWeight:800, color:LAV,
                letterSpacing:'0.14em', textTransform:'uppercase', lineHeight:1.3}}>
                Early Access
              </div>
              <div style={{fontSize:10, color:'rgba(255,255,255,0.38)',
                letterSpacing:'0.04em', lineHeight:1.3}}>
                Building With Our First Community Members
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily:`'Playfair Display', Georgia, 'Times New Roman', serif`,
            fontSize:'clamp(2.25rem,5.5vw,4rem)',
            fontWeight:800, color:'#fff', lineHeight:1.08,
            letterSpacing:'-0.02em', marginBottom:22,
          }}>
            Find Your Circle.
          </h2>

          {/* Subtext */}
          <p style={{
            fontSize:'clamp(15px,1.7vw,18px)',
            color:'rgba(255,255,255,0.52)',
            lineHeight:1.78, maxWidth:560, margin:'0 auto 42px',
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
              style={{padding:'17px 44px', borderRadius:16, fontSize:17,
                fontWeight:700, display:'inline-block', textDecoration:'none',
                animation:'glowBreathe 5s ease-in-out infinite'}}>
              Find My Circle →
            </a>
            <a href="#how"
              style={{fontSize:15, color:'rgba(255,255,255,0.45)',
                textDecoration:'none', fontWeight:500,
                borderBottom:'1px solid rgba(255,255,255,0.2)',
                paddingBottom:3, transition:'color .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.color=LAV;}}
              onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.45)';}}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER  — compact links · social · crisis · copyright
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background:`linear-gradient(180deg,#0A0222 0%,#050114 100%)`,
        borderTop:'1px solid rgba(109,74,255,0.16)',
        padding:'0 32px', position:'relative', overflow:'hidden',
      }}>
        {/* Sacred geometry watermark */}
        <div style={{position:'absolute', bottom:'-10%', right:'-5%',
          opacity:0.03, pointerEvents:'none',
          animation:'floatY 22s ease-in-out infinite'}}>
          <svg viewBox="0 0 280 280" width="400" height="400" aria-hidden="true">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
              const r=a*Math.PI/180;
              return <line key={i} x1="140" y1="140"
                x2={140+130*Math.cos(r)} y2={140+130*Math.sin(r)}
                stroke={LAV} strokeWidth="0.8"/>;
            })}
            {[30,60,90,120,130].map((r,i)=>(
              <circle key={i} cx="140" cy="140" r={r}
                stroke={LAV} strokeWidth="0.7" fill="none"
                strokeDasharray="3 5"/>
            ))}
          </svg>
        </div>

        <div style={{maxWidth:1440, margin:'0 auto', position:'relative', zIndex:1}}>

          {/* ── Crisis strip ── */}
          <div style={{
            padding:'14px 0',
            borderBottom:'1px solid rgba(255,255,255,0.05)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:20,
            flexWrap:'wrap',
          }}>
            <span style={{fontSize:12, color:'rgba(255,255,255,0.3)'}}>
              🆘 In crisis? Help is always available:
            </span>
            <Link to="/crisis-support" style={{
              fontSize:12, fontWeight:700, color:LAV,
              textDecoration:'none', padding:'4px 14px',
              background:'rgba(109,74,255,0.12)',
              border:'1px solid rgba(167,139,250,0.2)',
              borderRadius:99, transition:'all .18s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,74,255,0.25)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(109,74,255,0.12)';}}
            >
              Crisis Resources →
            </Link>
            <Link to="/safety" style={{
              fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.38)',
              textDecoration:'none', transition:'color .18s',
            }}
              onMouseEnter={e=>e.currentTarget.style.color=LAV}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.38)'}
            >
              Safety Policy
            </Link>
          </div>

          {/* ── Disclaimer ── */}
          <div style={{padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <p style={{fontSize:11, color:'rgba(255,255,255,0.22)',
              lineHeight:1.7, textAlign:'center'}}>
              <strong style={{color:'rgba(255,255,255,0.32)'}}>Disclaimer:</strong>{' '}
              SoulConnect is a peer-support and wellness platform — not a medical,
              psychiatric, or emergency service. If you are in immediate danger,
              please call emergency services or visit your nearest hospital.{' '}
              <Link to="/crisis-support"
                style={{color:LAV, textDecoration:'underline'}}>
                Crisis Resources →
              </Link>
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
              <div style={{width:36, height:36, borderRadius:10,
                background:`linear-gradient(135deg,${P},${LAV})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:17, boxShadow:`0 4px 14px rgba(109,74,255,0.4)`,
                animation:'glowBreathe 6s ease-in-out infinite'}}>🪷</div>
              <div style={{fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.7)',
                letterSpacing:'-0.01em'}}>
                Soul<span style={{color:LAV}}>Connect</span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="l-ft-nav" style={{display:'flex', alignItems:'center',
              flexWrap:'wrap', gap:'4px 0'}}>
              {[
                {label:'About Us',           to:'/about',          isRoute:true},
                {label:'How It Works',       href:'#how',          isRoute:false},
                {label:'Resources',          href:'#trust',        isRoute:false},
                {label:'Privacy Policy',     to:'/terms',          isRoute:true},
                {label:'Terms of Service',   to:'/terms',          isRoute:true},
                {label:'Contact',            href:'#cta',          isRoute:false},
              ].map((l,i,arr)=>(
                <React.Fragment key={l.label}>
                  {l.isRoute
                    ? <Link to={l.to} style={{fontSize:12,
                        color:'rgba(255,255,255,0.3)', textDecoration:'none',
                        padding:'0 11px', transition:'color .18s'}}
                        onMouseEnter={e=>e.currentTarget.style.color=LAV}
                        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}
                      >{l.label}</Link>
                    : <a href={l.href} style={{fontSize:12,
                        color:'rgba(255,255,255,0.3)', textDecoration:'none',
                        padding:'0 11px', transition:'color .18s'}}
                        onMouseEnter={e=>e.currentTarget.style.color=LAV}
                        onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}
                      >{l.label}</a>
                  }
                  {i<arr.length-1&&(
                    <span style={{color:'rgba(255,255,255,0.1)', fontSize:11,
                      userSelect:'none'}}>|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Social */}
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              {[
                {
                  label:'Instagram', href:'#',
                  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>,
                },
                {
                  label:'Facebook', href:'#',
                  svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>,
                },
                {
                  label:'YouTube', href:'#',
                  svg:<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0A0230"/>
                  </svg>,
                },
              ].map((s,i)=>(
                <a key={i} href={s.href} aria-label={s.label}
                  style={{width:36, height:36, borderRadius:10,
                    background:'rgba(109,74,255,0.1)',
                    border:'1px solid rgba(109,74,255,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'rgba(167,139,250,0.85)', textDecoration:'none', transition:'all .2s',}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,74,255,0.28)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 6px 18px rgba(109,74,255,0.3)';e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(109,74,255,0.1)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.color='rgba(167,139,250,0.85)';}}
                >{s.svg}</a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p style={{fontSize:11, color:'rgba(255,255,255,0.15)',
            textAlign:'center', paddingBottom:22}}>
            © 2025 SoulConnect. All rights reserved. Made with 💜 for healing.
          </p>

        </div>
      </footer>
    </div>
  );
}
