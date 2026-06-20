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
  { label: 'About Us',     href: '#vision'    },
  { label: 'How It Works', href: '#how'       },
  { label: 'For You',      href: '#struggling'},
  { label: 'Resources',    href: '#trust'     },
  { label: 'Contact',      href: '#cta'       },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SVG ILLUSTRATION
   Layers (back→front): sky · sun glow · FOL sacred geometry · mountains ·
   water · woman · lotus · reflection · particles
═══════════════════════════════════════════════════════════════════════════════ */
function HeroIllustration() {
  const W = 800, H = 900;

  /* ── Flower of Life ── */
  const sgR  = 78;           // FOL circle radius
  const sgCX = W * 0.52;
  const sgCY = H * 0.41;

  const FOL_OFFSETS = [
    [0,0],
    [sgR,0],[sgR*.5,sgR*SQ3/2],[-sgR*.5,sgR*SQ3/2],
    [-sgR,0],[-sgR*.5,-sgR*SQ3/2],[sgR*.5,-sgR*SQ3/2],
    [2*sgR,0],[sgR*1.5,sgR*SQ3/2],[sgR,sgR*SQ3],
    [0,sgR*SQ3],[-sgR,sgR*SQ3],[-sgR*1.5,sgR*SQ3/2],
    [-2*sgR,0],[-sgR*1.5,-sgR*SQ3/2],[-sgR,-sgR*SQ3],
    [0,-sgR*SQ3],[sgR,-sgR*SQ3],[sgR*1.5,-sgR*SQ3/2],
  ];
  const folCenters = FOL_OFFSETS.map(([dx,dy])=>[sgCX+dx, sgCY+dy]);

  /* ── Metatron's Cube (13 key nodes, all-pairs lines) ── */
  const MET_OFFSETS = [
    [0,0],
    [sgR,0],[sgR*.5,sgR*SQ3/2],[-sgR*.5,sgR*SQ3/2],
    [-sgR,0],[-sgR*.5,-sgR*SQ3/2],[sgR*.5,-sgR*SQ3/2],
    [2*sgR,0],[sgR,sgR*SQ3],[-sgR,sgR*SQ3],
    [-2*sgR,0],[-sgR,-sgR*SQ3],[sgR,-sgR*SQ3],
  ];
  const metNodes = MET_OFFSETS.map(([dx,dy])=>[sgCX+dx, sgCY+dy]);
  const metEdges = [];
  for(let i=0;i<metNodes.length;i++)
    for(let j=i+1;j<metNodes.length;j++)
      metEdges.push([metNodes[i], metNodes[j]]);

  /* ── Lotus ── */
  const lx = sgCX, ly = H * 0.70;
  const OUTER_D = [0,45,90,135,180,225,270,315];
  const MID_D   = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const INN_D   = [0,60,120,180,240,300];

  /* ── Floating particles ── */
  const particles = Array.from({length:32},(_,i)=>({
    x:  15+((i*47+i*i*11)%762),
    y:  12+((i*61+i*i*13)%862),
    r:  0.9+(i%5)*0.5,
    dur:2.8+(i%6)*0.9,
    del:i*0.32,
    col:[LAV,GLD,PNK,'#C4B5FD','#FDE68A','#E879F9'][i%6],
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}}
      aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Sky */}
        <linearGradient id="hSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#080220"/>
          <stop offset="28%"  stopColor="#190852"/>
          <stop offset="55%"  stopColor="#5E1A58"/>
          <stop offset="78%"  stopColor="#C05528"/>
          <stop offset="100%" stopColor="#E8844A"/>
        </linearGradient>
        {/* Sun radial glow */}
        <radialGradient id="hSun" cx={`${sgCX/W*100}%`} cy={`${sgCY/H*100}%`} r="45%">
          <stop offset="0%"   stopColor="#FBBF24" stopOpacity="1"/>
          <stop offset="15%"  stopColor="#F59E0B" stopOpacity="0.65"/>
          <stop offset="40%"  stopColor="#D97706" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#5E1A58"  stopOpacity="0"/>
        </radialGradient>
        {/* Sacred geometry glow */}
        <radialGradient id="hSG" cx="50%" cy="46%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="0.55"/>
          <stop offset="35%"  stopColor={LAV}     stopOpacity="0.2"/>
          <stop offset="100%" stopColor={P}        stopOpacity="0"/>
        </radialGradient>
        {/* FOL circle clip mask */}
        <radialGradient id="hFOLFade" cx="50%" cy="50%">
          <stop offset="55%"  stopColor="white" stopOpacity="1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <mask id="hFOLMask">
          <ellipse cx={sgCX} cy={sgCY} rx={sgR*2.65} ry={sgR*2.65} fill="url(#hFOLFade)"/>
        </mask>
        {/* Water */}
        <linearGradient id="hWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3B1870" stopOpacity="0.88"/>
          <stop offset="100%" stopColor="#0E0430" stopOpacity="1"/>
        </linearGradient>
        {/* Lotus petal */}
        <linearGradient id="hLPetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#F0E8FF" stopOpacity="0.97"/>
          <stop offset="60%"  stopColor="#C084FC" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.65"/>
        </linearGradient>
        <linearGradient id="hLPetalMid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#E9D5FF" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7"/>
        </linearGradient>
        <radialGradient id="hLCenter" cx="50%" cy="40%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="45%"  stopColor={GLD}/>
          <stop offset="100%" stopColor={GLD} stopOpacity="0"/>
        </radialGradient>
        {/* Lotus glow filter */}
        <filter id="hLGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="11" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Node glow filter */}
        <filter id="hNodeGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Person glow */}
        <radialGradient id="hPersonGlow" cx="50%" cy="55%">
          <stop offset="0%"   stopColor="#FBBF24" stopOpacity="0.45"/>
          <stop offset="100%" stopColor={P}        stopOpacity="0"/>
        </radialGradient>
        {/* Water reflection mask */}
        <linearGradient id="hReflMask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id="hReflMaskID">
          <rect x="0" y={ly} width={W} height={H-ly} fill="url(#hReflMask)"/>
        </mask>
        {/* Person soft blur */}
        <filter id="hPersonBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── SKY ── */}
      <rect x="0" y="0" width={W} height={H} fill="url(#hSky)"/>

      {/* ── SUN GLOW ── */}
      <ellipse cx={sgCX} cy={sgCY} rx={W*0.55} ry={H*0.48} fill="url(#hSun)"/>
      <circle  cx={sgCX} cy={sgCY} r={30} fill="#FBBF24" opacity="0.88"/>
      <circle  cx={sgCX} cy={sgCY} r={19} fill="#FEF9C3"/>
      {/* Sun rays */}
      {Array.from({length:20},(_,i)=>{
        const a=i*(Math.PI*2/20);
        const len=44+Math.sin(i*2.4)*18;
        return <line key={i}
          x1={sgCX+32*Math.cos(a)} y1={sgCY+32*Math.sin(a)}
          x2={sgCX+(32+len)*Math.cos(a)} y2={sgCY+(32+len)*Math.sin(a)}
          stroke="#FBBF24" strokeWidth={i%4===0?1.4:0.65} opacity="0.28"/>;
      })}

      {/* ── SACRED GEOMETRY BG GLOW ── */}
      <ellipse cx={sgCX} cy={sgCY} rx={sgR*2.7} ry={sgR*2.7} fill="url(#hSG)" opacity="0.55"/>

      {/* ── FLOWER OF LIFE CIRCLES ── */}
      <g mask="url(#hFOLMask)">
        <g fill="none" strokeWidth="0.75">
          {folCenters.map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={sgR}
              stroke={i<7?'rgba(215,185,255,0.32)':'rgba(185,155,240,0.18)'}/>
          ))}
        </g>
        {/* Outer boundary circles */}
        <circle cx={sgCX} cy={sgCY} r={sgR*2.18}
          stroke="rgba(200,170,255,0.22)" strokeWidth="1" fill="none"/>
        <circle cx={sgCX} cy={sgCY} r={sgR*2.55}
          stroke="rgba(200,170,255,0.12)" strokeWidth="0.8" fill="none"
          strokeDasharray="6 8"/>

        {/* ── METATRON'S CUBE LINES ── */}
        <g stroke="rgba(220,195,255,0.18)" strokeWidth="0.55" fill="none">
          {metEdges.map(([[x1,y1],[x2,y2]],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>
          ))}
        </g>

        {/* ── GLOWING NODES ── */}
        <g filter="url(#hNodeGlow)">
          {folCenters.map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy}
              r={i===0?4:i<7?2.6:1.7}
              fill={i===0?'#FCD34D':i<7?'#C4B5FD':'rgba(180,150,255,0.7)'}
              opacity={i===0?1:i<7?0.9:0.65}/>
          ))}
        </g>
      </g>

      {/* ── MOUNTAINS BACK ── */}
      <path d={`M0,${H*.6} L70,${H*.38} L145,${H*.5} L230,${H*.32} L315,${H*.46} L400,${H*.3} L490,${H*.44} L570,${H*.34} L650,${H*.48} L730,${H*.36} L${W},${H*.49} L${W},${H} L0,${H} Z`}
        fill="#1E0848" opacity="0.9"/>
      {/* MOUNTAINS FRONT */}
      <path d={`M0,${H*.68} L60,${H*.52} L140,${H*.64} L220,${H*.48} L305,${H*.6} L390,${H*.46} L475,${H*.59} L555,${H*.5} L635,${H*.62} L720,${H*.52} L${W},${H*.64} L${W},${H} L0,${H} Z`}
        fill="#120636" opacity="0.96"/>

      {/* ── WATER ── */}
      <rect x="0" y={H*.65} width={W} height={H-H*.65} fill="url(#hWater)"/>
      {/* Shimmer lines */}
      {[.69,.73,.77,.81,.85,.89,.93].map((y,i)=>(
        <line key={i} x1={W*.04} y1={H*y} x2={W*.96} y2={H*y}
          stroke="rgba(167,139,250,0.07)" strokeWidth="0.9"/>
      ))}

      {/* ── MEDITATING WOMAN ── */}
      <g filter="url(#hPersonBlur)" transform={`translate(${sgCX-40},${H*.48})`}>
        {/* Aura glow behind */}
        <ellipse cx="40" cy="110" rx="58" ry="82" fill="url(#hPersonGlow)"/>
        {/* Sitting legs */}
        <ellipse cx="40" cy="178" rx="50" ry="17" fill="#080218" opacity="0.9"/>
        <ellipse cx="13" cy="172" rx="24" ry="13" fill="#0C0428" opacity="0.85"/>
        <ellipse cx="67" cy="172" rx="24" ry="13" fill="#0C0428" opacity="0.85"/>
        {/* Body/torso */}
        <path d="M21,105 Q12,142 16,172 L64,172 Q68,142 59,105 Z" fill="#0E0528" opacity="0.92"/>
        {/* Head */}
        <ellipse cx="40" cy="87" rx="19" ry="21" fill="#0E0528" opacity="0.92"/>
        {/* Hair bun */}
        <circle cx="40" cy="68" r="9" fill="#0A0220" opacity="0.85"/>
        <ellipse cx="40" cy="68" rx="13" ry="7" fill="#0A0220" opacity="0.75"/>
        {/* Arms */}
        <path d="M21,118 Q4,144 19,164" stroke="#0E0528" strokeWidth="8.5"
          strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d="M59,118 Q76,144 61,164" stroke="#0E0528" strokeWidth="8.5"
          strokeLinecap="round" fill="none" opacity="0.85"/>
        {/* Hands */}
        <ellipse cx="26" cy="160" rx="8" ry="5" fill="#0E0528" opacity="0.8"/>
        <ellipse cx="54" cy="160" rx="8" ry="5" fill="#0E0528" opacity="0.8"/>
        {/* Third eye */}
        <circle cx="40" cy="82" r="3.2" fill={GLD} opacity="0.78">
          <animate attributeName="opacity" values="0.3;0.95;0.3" dur="3.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="82" r="6" fill={GLD} opacity="0.12">
          <animate attributeName="r" values="4;8;4" dur="3.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.16;0.04;0.16" dur="3.2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* ── LOTUS (foreground) ── */}
      <g filter="url(#hLGlow)">
        {/* Outer petals ×8 */}
        {OUTER_D.map((d,i)=>{
          const rad=(d-90)*Math.PI/180;
          const px=lx+96*Math.cos(rad), py=ly+96*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx={16} ry={48}
            fill="url(#hLPetal)" opacity="0.9"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Middle petals ×8 */}
        {MID_D.map((d,i)=>{
          const rad=(d-90)*Math.PI/180;
          const px=lx+62*Math.cos(rad), py=ly+62*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx={12} ry={34}
            fill="url(#hLPetalMid)" opacity="0.94"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Inner petals ×6 */}
        {INN_D.map((d,i)=>{
          const rad=(d-90)*Math.PI/180;
          const px=lx+34*Math.cos(rad), py=ly+34*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx={9} ry={20}
            fill="#F0E8FF" opacity="0.97"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        {/* Center */}
        <circle cx={lx} cy={ly} r={40} fill="url(#hLCenter)" filter="url(#hLGlow)"/>
        <circle cx={lx} cy={ly} r={16} fill={GLD}/>
        <circle cx={lx} cy={ly} r={9}  fill="#FEF9C3"/>
      </g>

      {/* ── LOTUS WATER REFLECTION ── */}
      <g transform={`translate(0,${2*ly+18}) scale(1,-1)`}
         mask="url(#hReflMaskID)" opacity="0.38">
        {OUTER_D.map((d,i)=>{
          const rad=(d-90)*Math.PI/180;
          const px=lx+96*Math.cos(rad), py=ly+96*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx={16} ry={48}
            fill="url(#hLPetal)"
            transform={`rotate(${d},${px},${py})`}/>;
        })}
        <circle cx={lx} cy={ly} r={16} fill={GLD} opacity="0.7"/>
      </g>

      {/* ── FLOATING PARTICLES ── */}
      {particles.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.42">
          <animate attributeName="cy"
            values={`${p.y};${p.y-16};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity"
            values="0.22;0.62;0.22"
            dur={`${p.dur*.88}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   VISION LOTUS SVG  (center column)
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
      {/* Outer glow rings */}
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
   PEOPLE SUNSET SVG  (early access right column)
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
      {/* Mountains */}
      <path d="M0,270 L55,200 L110,238 L165,188 L220,225 L275,198 L340,228 L340,420 L0,420Z"
        fill="#1A0840" opacity="0.92"/>
      {/* Water */}
      <rect x="0" y="286" width="340" height="134" fill="url(#psWater)"/>
      {[.73,.79,.85,.92].map((y,i)=>
        <line key={i} x1="12" y1={420*y} x2="328" y2={420*y}
          stroke="rgba(167,139,250,0.1)" strokeWidth="0.8"/>
      )}
      {/* People silhouettes (5 seated) */}
      {[82,118,155,192,226].map((x,i)=>(
        <g key={i} transform={`translate(${x},274) scale(${0.9+i%3*.07})`}>
          <circle cy="-42" r="9"  fill="#080216"/>
          <path d="M-10,-34 Q-13,-4 -11,14 L11,14 Q13,-4 10,-34Z" fill="#080216"/>
          <path d="M-11,12 Q-20,22 -16,30 L16,30 Q20,22 11,12Z" fill="#080216"/>
        </g>
      ))}
      <ellipse cx="170" cy="285" rx="100" ry="9" fill="#080216" opacity="0.5"/>
      {/* Shimmer reflection of sun */}
      <ellipse cx="170" cy="310" rx="60" ry="14"
        fill="#FCD34D" opacity="0.08"/>
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
        l.id=id;l.rel='stylesheet';l.href=href;
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
      const res = await fetch(`${API}/api/early-access/`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: earlyForm.name,
          email: earlyForm.email,
          challenge: earlyForm.challenge || null,
          source: 'landing_page',
        }),
      });
      // Show success regardless (offline/error graceful fallback)
      setEarlySubmitted(true);
    } catch(_) {
      setEarlySubmitted(true); // still show success — data can be collected via form fallback
    }
  };

  /* ─── inline CSS ─────────────────────────────────────────────────────────── */
  const css = `
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}

    /* Animations */
    @keyframes fadeUp {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
    @keyframes floatY {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes pulse  {0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
    @keyframes orbDrift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-14px)}}
    @keyframes shimmer{0%{background-position:200% center}to{background-position:-200% center}}

    /* Nav link */
    .l-nav-a{
      color:rgba(255,255,255,0.8);font-size:14px;font-weight:500;
      text-decoration:none;padding:7px 14px;border-radius:9px;
      transition:all .18s;white-space:nowrap;
    }
    .l-nav-a:hover{color:#fff;background:rgba(255,255,255,0.1);}

    /* Primary button */
    .l-btn-p{
      display:inline-flex;align-items:center;gap:8px;
      padding:14px 32px;border-radius:14px;font-size:15px;font-weight:700;
      background:linear-gradient(135deg,${P} 0%,#5B3CE8 100%);
      color:#fff;border:none;cursor:pointer;text-decoration:none;
      font-family:inherit;letter-spacing:.01em;
      box-shadow:0 8px 28px rgba(109,74,255,0.45);
      transition:all .25s ease;
    }
    .l-btn-p:hover{transform:translateY(-3px);box-shadow:0 16px 44px rgba(109,74,255,0.58);}

    /* Ghost button */
    .l-btn-g{
      display:inline-flex;align-items:center;gap:9px;
      padding:14px 32px;border-radius:14px;font-size:15px;font-weight:700;
      background:rgba(255,255,255,0.1);
      color:#fff;border:1.5px solid rgba(255,255,255,0.3);
      cursor:pointer;text-decoration:none;font-family:inherit;
      backdrop-filter:blur(8px);
      transition:all .22s ease;
    }
    .l-btn-g:hover{background:rgba(255,255,255,0.2);transform:translateY(-2px);}

    /* Cards */
    .l-struggle-card{
      background:#fff;border-radius:24px;padding:28px 18px 22px;
      border:1.5px solid rgba(109,74,255,0.07);
      box-shadow:0 4px 24px rgba(109,74,255,0.06);
      text-align:center;transition:all .28s ease;cursor:default;
    }
    .l-struggle-card:hover{
      transform:translateY(-7px);
      box-shadow:0 18px 48px rgba(109,74,255,0.16);
      border-color:rgba(109,74,255,0.22);
    }
    .l-help-card{
      background:#fff;border-radius:24px;padding:28px 20px;
      border:1.5px solid rgba(109,74,255,0.07);
      box-shadow:0 4px 24px rgba(109,74,255,0.06);
      transition:all .28s ease;
      display:flex;flex-direction:column;
    }
    .l-help-card:hover{transform:translateY(-5px);box-shadow:0 18px 48px rgba(109,74,255,0.14);}
    .l-vision-feat{
      background:rgba(255,255,255,0.07);backdrop-filter:blur(16px);
      border:1px solid rgba(167,139,250,0.18);border-radius:18px;
      padding:22px 18px;text-align:center;transition:all .24s;
    }
    .l-vision-feat:hover{
      background:rgba(109,74,255,0.18);
      border-color:rgba(167,139,250,0.4);
      transform:translateY(-3px);
    }

    /* Form */
    .l-form-field{
      width:100%;padding:14px 18px;border-radius:13px;
      border:1.5px solid rgba(255,255,255,0.22);
      background:rgba(255,255,255,0.1);
      color:#fff;font-size:14px;font-family:inherit;
      outline:none;transition:border .2s;backdrop-filter:blur(8px);
    }
    .l-form-field:focus{border-color:rgba(255,255,255,0.58);}
    .l-form-field option{background:#2D1060;color:#fff;}
    .l-form-field::placeholder{color:rgba(255,255,255,0.48);}
    select.l-form-field{appearance:none;-webkit-appearance:none;padding-right:38px;}

    /* Footer links */
    .l-ft-link{
      display:block;color:rgba(255,255,255,0.5);font-size:14px;
      text-decoration:none;transition:all .18s;margin-bottom:10px;
    }
    .l-ft-link:hover{color:${LAV};transform:translateX(2px);}
    .l-social{
      width:40px;height:40px;border-radius:50%;
      border:1px solid rgba(167,139,250,0.25);
      background:rgba(167,139,250,0.08);
      display:inline-flex;align-items:center;justify-content:center;
      text-decoration:none;transition:all .22s;font-size:16px;
    }
    .l-social:hover{
      background:rgba(109,74,255,0.28);
      border-color:rgba(167,139,250,0.55);
      transform:translateY(-3px);
      box-shadow:0 0 18px rgba(109,74,255,0.38);
    }

    /* ── Responsive ── */
    @media(max-width:1100px){
      .l-hero-grid{grid-template-columns:1fr!important;min-height:auto!important;}
      .l-hero-illus{height:420px!important;order:-1;}
      .l-hero-text{text-align:center;align-items:center!important;}
      .l-hero-pills{justify-content:center!important;}
      .l-hero-btns{justify-content:center!important;}
      .l-struggle-grid{grid-template-columns:repeat(3,1fr)!important;}
      .l-help-grid{grid-template-columns:repeat(3,1fr)!important;}
      .l-steps-row{flex-direction:column!important;gap:24px!important;align-items:center!important;}
      .l-step-arrow{transform:rotate(90deg);}
      .l-vision-inner{grid-template-columns:1fr!important;}
      .l-lotus-col{display:none!important;}
      .l-vision-feats{grid-template-columns:1fr 1fr!important;}
      .l-early-inner{grid-template-columns:1fr!important;}
      .l-early-right{display:none!important;}
      .l-cta-inner{flex-direction:column!important;align-items:center!important;text-align:center!important;}
      .l-cta-btns{align-items:center!important;}
      .l-ft-grid{grid-template-columns:1fr 1fr!important;}
      .l-desktop-nav{display:none!important;}
      .l-desktop-btns{display:none!important;}
      .l-mob-ham{display:flex!important;}
      .l-logo-sub{display:none!important;}
    }
    @media(max-width:720px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-help-grid{grid-template-columns:repeat(2,1fr)!important;}
      .l-trust-row{flex-wrap:wrap!important;gap:18px!important;}
      .l-ft-grid{grid-template-columns:1fr!important;}
    }
    @media(max-width:480px){
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;}
    }
  `;

  return (
    <div style={{fontFamily:F,background:'#F8F5FF',color:DARK,overflowX:'hidden'}}>
      <style>{css}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:400,height:70,
        background:scrolled?'rgba(10,2,32,0.96)':'transparent',
        backdropFilter:scrolled?'blur(24px)':'none',
        borderBottom:scrolled?'1px solid rgba(109,74,255,0.15)':'none',
        transition:'all .35s ease',
        display:'flex',alignItems:'center',
      }}>
        <div style={{maxWidth:1440,margin:'0 auto',width:'100%',
          padding:'0 32px',display:'flex',alignItems:'center'}}>
          {/* Logo */}
          <Link to="/" style={{display:'flex',alignItems:'center',gap:10,
            textDecoration:'none',flexShrink:0,marginRight:32}}>
            <div style={{width:42,height:42,borderRadius:13,
              background:`linear-gradient(135deg,${P},${LAV})`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:21,boxShadow:`0 4px 16px rgba(109,74,255,0.42)`}}>🪷</div>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:'#fff',
                letterSpacing:'-0.02em',lineHeight:1.1}}>
                Soul<span style={{color:LAV}}>Connect</span>
              </div>
              <div className="l-logo-sub" style={{fontSize:9,color:LAV,
                fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',marginTop:1}}>
                Heal · Connect · Grow
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="l-desktop-nav" style={{display:'flex',alignItems:'center',
            gap:2,flex:1,justifyContent:'center'}}>
            {NAV_LINKS.map(l=>(
              <a key={l.label} href={l.href} className="l-nav-a">{l.label}</a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="l-desktop-btns" style={{display:'flex',
            alignItems:'center',gap:10,marginLeft:'auto'}}>
            <Link to="/login" style={{
              padding:'9px 20px',borderRadius:11,fontSize:14,fontWeight:600,
              color:'rgba(255,255,255,0.82)',textDecoration:'none',
              border:'1.5px solid rgba(255,255,255,0.2)',background:'transparent',
              transition:'all .2s'
            }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >Login</Link>
            <Link to="/signup" className="l-btn-p"
              style={{padding:'9px 22px',fontSize:14,borderRadius:11}}>
              Find My Circle 💜
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={()=>setMenuOpen(v=>!v)} className="l-mob-ham"
            style={{display:'none',marginLeft:'auto',width:40,height:40,
              borderRadius:10,background:'rgba(255,255,255,0.1)',border:'none',
              cursor:'pointer',flexDirection:'column',alignItems:'center',
              justifyContent:'center',gap:4.5}}>
            {[0,1,2].map(i=><span key={i} style={{width:19,height:2,
              background:'#fff',borderRadius:2,display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:399,
          background:'rgba(10,2,32,0.96)',backdropFilter:'blur(14px)'}}
          onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',top:70,left:0,right:0,
            padding:'20px 32px',borderBottom:`1px solid rgba(109,74,255,0.18)`}}
            onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=>(
              <a key={l.label} href={l.href} onClick={()=>setMenuOpen(false)}
                style={{display:'block',padding:'14px 0',fontSize:16,fontWeight:500,
                  color:'rgba(255,255,255,0.8)',textDecoration:'none',
                  borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{l.label}</a>
            ))}
            <div style={{display:'flex',gap:12,marginTop:22}}>
              <Link to="/login" onClick={()=>setMenuOpen(false)}
                style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,
                  fontSize:14,fontWeight:600,color:'#fff',textDecoration:'none',
                  border:'1.5px solid rgba(255,255,255,0.22)'}}>Login</Link>
              <Link to="/signup" onClick={()=>setMenuOpen(false)}
                style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,
                  fontSize:14,fontWeight:700,color:'#fff',textDecoration:'none',
                  background:`linear-gradient(135deg,${P},#5B3CE8)`}}>Find My Circle</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position:'relative',
        background:`linear-gradient(155deg,#08021C 0%,#160638 32%,#2B1065 62%,#160840 100%)`,
        minHeight:900,overflow:'hidden',
      }}>
        {/* Background orbs */}
        <div style={{position:'absolute',top:'-10%',right:'3%',width:540,height:540,
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(109,74,255,0.2) 0%,transparent 70%)',
          pointerEvents:'none',animation:'orbDrift 14s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'-6%',left:'6%',width:400,height:400,
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%)',
          pointerEvents:'none'}}/>

        <div className="l-hero-grid" style={{
          maxWidth:1440,margin:'0 auto',
          display:'grid',gridTemplateColumns:'52fr 48fr',
          minHeight:900,position:'relative',zIndex:1,
          padding:'0 32px',
        }}>
          {/* LEFT — Text */}
          <div className="l-hero-text" style={{
            display:'flex',flexDirection:'column',alignItems:'flex-start',
            justifyContent:'center',
            padding:'120px 0 80px',
            animation:'fadeUp .9s ease both',
          }}>
            {/* Status badges */}
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:28}}>
              {[
                {dot:GLD,   label:'Early Access'},
                {dot:'#34C38F', label:'Building In Public'},
                {dot:PNK,   label:'Community First'},
              ].map((b,i)=>(
                <div key={i} style={{display:'inline-flex',alignItems:'center',gap:7,
                  background:'rgba(109,74,255,0.2)',
                  border:'1px solid rgba(167,139,250,0.28)',
                  borderRadius:99,padding:'5px 14px'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',
                    background:b.dot,display:'inline-block',
                    animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{color:LAV,fontSize:11,fontWeight:700,
                    letterSpacing:'0.11em',textTransform:'uppercase'}}>{b.label}</span>
                </div>
              ))}
            </div>

            <h1 style={{
              fontFamily:SF,
              fontSize:'clamp(3rem,5vw,72px)',
              fontWeight:700,color:'#fff',
              lineHeight:1.1,letterSpacing:'-0.03em',
              marginBottom:22,
            }}>
              You Don't Have To<br/>
              Go Through It Alone.
            </h1>

            <p style={{fontSize:'clamp(15px,1.5vw,18px)',
              color:'rgba(255,255,255,0.62)',
              lineHeight:1.84,marginBottom:32,maxWidth:480}}>
              SoulConnect is a safe space to share, connect, and heal with people
              who truly understand what you're going through.
            </p>

            {/* Feature pills */}
            <div className="l-hero-pills" style={{display:'flex',flexWrap:'wrap',
              gap:10,marginBottom:38}}>
              {[
                {icon:'♡',label:'Real Connections'},
                {icon:'🛡',label:'Safe Community'},
                {icon:'🧠',label:'Emotional Support'},
              ].map((t,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:7,
                  background:'rgba(255,255,255,0.07)',
                  border:'1px solid rgba(255,255,255,0.14)',
                  borderRadius:99,padding:'8px 16px'}}>
                  <span style={{fontSize:15}}>{t.icon}</span>
                  <span style={{color:'rgba(255,255,255,0.82)',
                    fontSize:13,fontWeight:500}}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="l-hero-btns" style={{display:'flex',flexWrap:'wrap',gap:14}}>
              <Link to="/signup" className="l-btn-p">Find My Circle 💜</Link>
              <a href="#how" className="l-btn-g">
                <span style={{width:28,height:28,borderRadius:'50%',
                  background:'rgba(255,255,255,0.18)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:11}}>▶</span>
                Learn More
              </a>
            </div>
          </div>

          {/* RIGHT — Cinematic illustration */}
          <div className="l-hero-illus" style={{
            position:'relative',
            animation:'floatY 9s ease-in-out infinite',
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
        padding:'96px 32px',
      }}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(2rem,3vw,48px)',
              fontWeight:700,color:DARK,letterSpacing:'-0.025em',marginBottom:14}}>
              What are you struggling with?
            </h2>
            <div style={{width:52,height:3.5,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99,margin:'0 auto'}}/>
          </div>

          <div className="l-struggle-grid" style={{
            display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:16,marginBottom:38}}>
            {[
              {emoji:'🧠',label:'Anxiety &\nOverthinking',glow:'rgba(124,58,237,0.14)',color:'#7C3AED'},
              {emoji:'💔',label:'Heartbreak',              glow:'rgba(219,39,119,0.14)',color:'#DB2777'},
              {emoji:'🌧',label:'Loneliness',              glow:'rgba(37,99,235,0.14)', color:'#2563EB'},
              {emoji:'🕯',label:'Grief',                   glow:'rgba(217,119,6,0.16)', color:'#D97706'},
              {emoji:'🔥',label:'Burnout',                 glow:'rgba(234,88,12,0.14)', color:'#EA580C'},
              {emoji:'🌱',label:'Life\nTransitions',       glow:'rgba(5,150,105,0.14)', color:'#059669'},
            ].map((c,i)=>(
              <div key={i} className="l-struggle-card">
                <div style={{width:76,height:76,borderRadius:22,
                  background:`radial-gradient(circle,${c.glow},transparent 72%)`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:36,margin:'0 auto 14px',
                  boxShadow:`0 0 24px ${c.glow}`}}>
                  {c.emoji}
                </div>
                <div style={{fontSize:14,fontWeight:700,color:DARK,
                  lineHeight:1.4,whiteSpace:'pre-line'}}>{c.label}</div>
              </div>
            ))}
          </div>

          <p style={{textAlign:'center',fontSize:16,color:P,fontWeight:600,
            fontStyle:'italic'}}>
            You are not alone. Thousands of people are on a similar journey.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — HEALING STARTS WITH CONNECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="how" style={{background:'#F5F3FF',padding:'96px 32px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(2rem,3vw,48px)',
              fontWeight:700,color:DARK,letterSpacing:'-0.025em',marginBottom:14}}>
              Healing Starts With Connection
            </h2>
            <div style={{width:52,height:3.5,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99,margin:'0 auto'}}/>
          </div>

          <div className="l-steps-row" style={{display:'flex',
            alignItems:'flex-start',justifyContent:'center',gap:0}}>
            {[
              {n:'1',icon:'✍️',title:'Share Your Journey',
               desc:"Express what you're going through in a safe space."},
              {n:'2',icon:'👥',title:'Find Similar People',
               desc:'We match you with people who understand.'},
              {n:'3',icon:'🫂',title:'Join Support Circles',
               desc:'Join meaningful conversations and support groups.'},
              {n:'4',icon:'🌱',title:'Grow Together',
               desc:'Heal, learn, and grow together as a community.'},
            ].map((s,i,arr)=>(
              <React.Fragment key={i}>
                <div style={{flex:1,display:'flex',flexDirection:'column',
                  alignItems:'center',textAlign:'center',padding:'0 8px'}}>
                  <div style={{position:'relative',marginBottom:22}}>
                    <div style={{width:90,height:90,borderRadius:'50%',
                      background:'#fff',
                      border:`2px solid rgba(109,74,255,0.12)`,
                      boxShadow:'0 6px 28px rgba(109,74,255,0.1)',
                      display:'flex',alignItems:'center',
                      justifyContent:'center',fontSize:34}}>
                      {s.icon}
                    </div>
                    <div style={{position:'absolute',top:-6,right:-6,
                      width:30,height:30,borderRadius:'50%',
                      background:`linear-gradient(135deg,${P},#5B3CE8)`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:13,fontWeight:800,color:'#fff',
                      boxShadow:`0 3px 12px rgba(109,74,255,0.48)`}}>
                      {s.n}
                    </div>
                  </div>
                  <h3 style={{fontSize:16,fontWeight:800,color:DARK,
                    marginBottom:8,lineHeight:1.3}}>{s.title}</h3>
                  <p style={{fontSize:13,color:'#6B7280',lineHeight:1.65,
                    maxWidth:165}}>{s.desc}</p>
                </div>
                {i<arr.length-1&&(
                  <div className="l-step-arrow" style={{display:'flex',
                    alignItems:'center',paddingTop:36,flexShrink:0}}>
                    <svg width="52" height="18" viewBox="0 0 52 18" fill="none">
                      <line x1="2" y1="9" x2="44" y2="9"
                        stroke={LAV} strokeWidth="1.8" strokeDasharray="4 4"/>
                      <path d="M38 4 L44 9 L38 14"
                        stroke={LAV} strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — OUR VISION  (dark card, 3 columns)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="vision" style={{background:'#F5F3FF',padding:'0 32px 96px'}}>
        <div style={{maxWidth:1360,margin:'0 auto'}}>
          <div style={{
            background:`linear-gradient(145deg,#160630 0%,#280E58 45%,#160630 100%)`,
            borderRadius:28,
            padding:'clamp(36px,5vw,64px)',
            position:'relative',overflow:'hidden',
          }}>
            {/* Glow orb */}
            <div style={{position:'absolute',top:'50%',left:'22%',
              transform:'translate(-50%,-50%)',width:420,height:420,
              borderRadius:'50%',
              background:'radial-gradient(circle,rgba(109,74,255,0.18) 0%,transparent 70%)',
              pointerEvents:'none'}}/>

            <div className="l-vision-inner" style={{
              display:'grid',
              gridTemplateColumns:'2fr 1.4fr 2fr',
              gap:'clamp(24px,4vw,56px)',
              alignItems:'center',
              position:'relative',zIndex:1,
            }}>
              {/* LEFT — text */}
              <div>
                <div style={{fontSize:11,fontWeight:700,color:LAV,
                  letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:16}}>
                  OUR VISION
                </div>
                <h2 style={{fontFamily:SF,
                  fontSize:'clamp(1.8rem,2.8vw,3.2rem)',
                  fontWeight:700,color:'#fff',lineHeight:1.14,
                  letterSpacing:'-0.024em',marginBottom:18}}>
                  A world where nobody struggles alone.
                </h2>
                <p style={{fontSize:15,color:'rgba(255,255,255,0.52)',lineHeight:1.84}}>
                  We believe healing happens faster when we feel understood,
                  supported, and connected.
                </p>
              </div>

              {/* CENTER — Lotus artwork */}
              <div className="l-lotus-col" style={{display:'flex',
                justifyContent:'center',alignItems:'center'}}>
                <div style={{width:220,height:220,
                  animation:'floatY 9s ease-in-out infinite'}}>
                  <VisionLotus/>
                </div>
              </div>

              {/* RIGHT — 4 feature icons (2×2 grid) */}
              <div className="l-vision-feats" style={{
                display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {[
                  {icon:'🤝',label:'Real\nConnections',   sub:'Genuine peer-to-peer support'},
                  {icon:'🛡',label:'Safe & Supportive\nCommunity', sub:'Moderated with care'},
                  {icon:'🔒',label:'Your Privacy\nMatters',sub:'Private and secure always'},
                  {icon:'🌿',label:'Healing &\nGrowth',   sub:'Grow through connection'},
                ].map((f,i)=>(
                  <div key={i} className="l-vision-feat">
                    <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,color:'#fff',
                      marginBottom:5,whiteSpace:'pre-line',lineHeight:1.3}}>
                      {f.label}
                    </div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.42)',
                      lineHeight:1.45}}>{f.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — HOW SOULCONNECT HELPS YOU  (6 cards in one row)
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:'#fff',padding:'96px 32px'}}>
        <div style={{maxWidth:1360,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(2rem,3vw,48px)',
              fontWeight:700,color:DARK,letterSpacing:'-0.025em',marginBottom:14}}>
              How SoulConnect Helps You
            </h2>
            <div style={{width:52,height:3.5,
              background:`linear-gradient(90deg,${P},${LAV})`,
              borderRadius:99,margin:'0 auto'}}/>
          </div>

          <div className="l-help-grid" style={{
            display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:16}}>
            {[
              {icon:'👥',title:'Community\nMatching',desc:'Find people who truly understand.'},
              {icon:'🫂',title:'Support\nCircles',   desc:'Join guided conversations.'},
              {icon:'📝',title:'Healing\nJournal',   desc:'Reflect, release & understand yourself.'},
              {icon:'📊',title:'Mood\nTracking',     desc:'Track your mood and progress.'},
              {icon:'🎯',title:'Guided\nChallenges', desc:'Build healthy habits step by step.'},
              {icon:'🙏',title:'Wellness\nGuides',   desc:'Learn from trusted wellness experts.'},
            ].map((c,i)=>(
              <div key={i} className="l-help-card">
                <div style={{width:56,height:56,borderRadius:18,
                  background:'rgba(109,74,255,0.08)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:26,marginBottom:16,flexShrink:0}}>
                  {c.icon}
                </div>
                <h3 style={{fontSize:15,fontWeight:800,color:DARK,
                  marginBottom:7,lineHeight:1.3,whiteSpace:'pre-line'}}>
                  {c.title}
                </h3>
                <p style={{fontSize:12,color:'#6B7280',lineHeight:1.62,
                  marginBottom:14,flex:1}}>{c.desc}</p>
                {/* COMING SOON badge — bottom aligned */}
                <div style={{display:'inline-flex',alignItems:'center',gap:6,
                  background:'rgba(109,74,255,0.08)',
                  border:`1.5px solid rgba(109,74,255,0.2)`,
                  borderRadius:99,padding:'5px 11px',alignSelf:'flex-start'}}>
                  <span style={{width:5,height:5,borderRadius:'50%',
                    background:P,display:'inline-block',
                    animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:10,fontWeight:700,color:P,
                    letterSpacing:'0.07em'}}>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5b — CURRENTLY BUILDING
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{background:'#F5F3FF',padding:'80px 32px'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,
            background:`rgba(109,74,255,0.1)`,
            border:`1px solid rgba(109,74,255,0.2)`,
            borderRadius:99,padding:'6px 18px',marginBottom:24}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'#34C38F',
              display:'inline-block',animation:'pulse 2s ease-in-out infinite'}}/>
            <span style={{fontSize:11,fontWeight:700,color:P,
              letterSpacing:'0.12em',textTransform:'uppercase'}}>
              Building In Public
            </span>
          </div>
          <h2 style={{fontFamily:SF,fontSize:'clamp(1.8rem,3vw,42px)',
            fontWeight:700,color:DARK,lineHeight:1.15,
            letterSpacing:'-0.025em',marginBottom:20}}>
            Currently Building With<br/>Early Community Members
          </h2>
          <p style={{fontSize:'clamp(15px,1.6vw,18px)',color:'#4B5563',
            lineHeight:1.84,maxWidth:700,margin:'0 auto 48px'}}>
            SoulConnect is being built alongside people navigating anxiety, loneliness,
            overthinking, burnout, grief, and life transitions. You are not just an
            early user — you are a founding community member shaping what this becomes.
          </p>
          {/* 3 pillars */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap:20,maxWidth:780,margin:'0 auto'}}>
            {[
              {icon:'🧪',title:'We Listen First',
               desc:'Every feature is shaped by real conversations with real people going through real struggles.'},
              {icon:'💬',title:'You Shape The Platform',
               desc:"Your feedback, your stories, and your needs define what SoulConnect becomes."},
              {icon:'💜',title:'No Fake Promises',
               desc:'We are honest about what we are building. Early access = real community, not a polished product.'},
            ].map((p,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:20,padding:'28px 22px',
                border:'1.5px solid rgba(109,74,255,0.08)',
                boxShadow:'0 4px 20px rgba(109,74,255,0.06)',textAlign:'left'}}>
                <div style={{fontSize:32,marginBottom:14}}>{p.icon}</div>
                <h3 style={{fontSize:15,fontWeight:800,color:DARK,
                  marginBottom:8,lineHeight:1.3}}>{p.title}</h3>
                <p style={{fontSize:13,color:'#6B7280',lineHeight:1.65}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — EARLY ACCESS  (text | form | people image)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="early" style={{
        background:`linear-gradient(145deg,#160630 0%,#280E58 45%,#4A1C8C 100%)`,
        padding:'96px 32px',position:'relative',overflow:'hidden',
      }}>
        {/* Particles */}
        {Array.from({length:14},(_,i)=>(
          <div key={i} style={{position:'absolute',
            left:`${4+(i*7.7)%90}%`,top:`${5+(i*11.3)%88}%`,
            width:i%3===0?3:2,height:i%3===0?3:2,
            borderRadius:'50%',
            background:[LAV,GLD,PNK][i%3],opacity:0.28,
            animation:`floatY ${5.5+(i%5)*1.3}s ease-in-out ${i*.55}s infinite`,
            pointerEvents:'none'}}/>
        ))}
        {/* Right bg: people sunset */}
        <div className="l-early-right" style={{
          position:'absolute',right:0,top:0,bottom:0,width:'30%',
          overflow:'hidden',opacity:0.6,pointerEvents:'none'}}>
          <PeopleSunset/>
        </div>

        <div className="l-early-inner" style={{
          maxWidth:1200,margin:'0 auto',
          display:'grid',gridTemplateColumns:'1fr 1.15fr',
          gap:'clamp(32px,5vw,80px)',
          alignItems:'center',position:'relative',zIndex:1,
        }}>
          {/* LEFT */}
          <div>
            <div style={{fontSize:11,fontWeight:700,color:GLD,
              letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:16}}>
              JOIN OUR EARLY COMMUNITY
            </div>
            <h2 style={{fontFamily:SF,
              fontSize:'clamp(2.2rem,3.2vw,3.6rem)',
              fontWeight:700,color:'#fff',lineHeight:1.1,
              letterSpacing:'-0.03em',marginBottom:20}}>
              Find Your Circle.<br/>
              We'll walk with you.{' '}
              <span style={{color:PNK}}>♡</span>
            </h2>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.52)',
              lineHeight:1.84,maxWidth:400}}>
              Tell us what you're going through so we can connect you with
              the right people and resources.
            </p>
          </div>

          {/* CENTER — Form */}
          <div style={{
            background:'rgba(255,255,255,0.07)',backdropFilter:'blur(22px)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:24,padding:'clamp(24px,3vw,36px)',
          }}>
            {earlySubmitted ? (
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{fontSize:54,marginBottom:18}}>💜</div>
                <h3 style={{fontFamily:SF,fontSize:24,fontWeight:700,
                  color:'#fff',marginBottom:12}}>You're on the list!</h3>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:15,
                  lineHeight:1.7}}>
                  We'll reach out when your circle is ready.
                  Healing begins soon.
                </p>
              </div>
            ):(
              <form onSubmit={handleSubmit}
                style={{display:'flex',flexDirection:'column',gap:14}}>
                <label style={{fontSize:13,fontWeight:600,
                  color:'rgba(255,255,255,0.7)'}}>
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
                  <span style={{position:'absolute',right:14,top:'50%',
                    transform:'translateY(-50%)',color:'rgba(255,255,255,0.45)',
                    pointerEvents:'none',fontSize:11}}>▼</span>
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
                  style={{marginTop:4,width:'100%',justifyContent:'center',
                    borderRadius:13,padding:'15px',fontSize:15}}>
                  Join Early Access →
                </button>
                <p style={{textAlign:'center',fontSize:12,
                  color:'rgba(255,255,255,0.32)',margin:0}}>
                  🔒 We respect your privacy. No spam ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — TRUST STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="trust" style={{
        background:'#fff',
        borderTop:'1px solid rgba(109,74,255,0.07)',
        borderBottom:'1px solid rgba(109,74,255,0.07)',
        padding:'22px 32px',
      }}>
        <div className="l-trust-row" style={{
          maxWidth:1200,margin:'0 auto',
          display:'flex',alignItems:'center',
          justifyContent:'center',
          gap:'clamp(20px,4vw,56px)',flexWrap:'wrap',
        }}>
          {[
            {icon:'🛡',title:'Safe Community',      sub:'Moderated with care and compassion.'},
            {icon:'🔒',title:'Privacy Protected',    sub:'Your data is private and secure.'},
            {icon:'🚨',title:'Crisis Resources',     sub:'Help is always available.'},
            {icon:'📋',title:'Community Guidelines', sub:'Respect, kindness & inclusion always.'},
            {icon:'⚖️',title:'Wellness Standards',   sub:'Evidence-based and trusted.'},
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',
              gap:12,flexShrink:0}}>
              <div style={{width:38,height:38,borderRadius:12,
                background:'rgba(109,74,255,0.07)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:18,flexShrink:0}}>{t.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:DARK}}>
                  {t.title}
                </div>
                <div style={{fontSize:11,color:'#9CA3AF',lineHeight:1.38}}>
                  {t.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="cta" style={{
        background:`linear-gradient(160deg,#080218 0%,#160840 50%,#080218 100%)`,
        padding:'96px 32px',position:'relative',overflow:'hidden',
      }}>
        {/* Lotus watermark */}
        <div style={{position:'absolute',top:'50%',left:'50%',
          transform:'translate(-50%,-50%)',opacity:0.04,
          pointerEvents:'none',animation:'floatY 16s ease-in-out infinite'}}>
          <svg viewBox="0 0 300 300" width="500" height="500">
            {[0,45,90,135,180,225,270,315].map((a,i)=>{
              const r=(a-90)*Math.PI/180;
              return <ellipse key={i}
                cx={150+100*Math.cos(r)} cy={150+100*Math.sin(r)}
                rx={20} ry={56} fill={LAV}
                transform={`rotate(${a},${150+100*Math.cos(r)},${150+100*Math.sin(r)})`}/>;
            })}
            <circle cx="150" cy="150" r="22" fill={GLD}/>
          </svg>
        </div>
        {/* Central glow */}
        <div style={{position:'absolute',top:'50%',left:'50%',
          transform:'translate(-50%,-50%)',width:800,height:800,borderRadius:'50%',
          background:'radial-gradient(circle,rgba(109,74,255,0.14) 0%,transparent 70%)',
          pointerEvents:'none'}}/>
        {/* Particles */}
        {Array.from({length:20},(_,i)=>(
          <div key={i} style={{position:'absolute',
            left:`${3+(i*6.1)%92}%`,top:`${4+(i*8.7)%90}%`,
            width:i%3===0?3:2,height:i%3===0?3:2,
            borderRadius:'50%',background:[LAV,GLD,PNK][i%3],
            opacity:0.22,
            animation:`floatY ${5+(i%6)*1.1}s ease-in-out ${i*.42}s infinite`,
            pointerEvents:'none'}}/>
        ))}

        <div className="l-cta-inner" style={{
          maxWidth:1200,margin:'0 auto',
          display:'flex',alignItems:'center',
          justifyContent:'space-between',
          flexWrap:'wrap',gap:36,
          position:'relative',zIndex:1,
        }}>
          {/* Left */}
          <div style={{maxWidth:520}}>
            <div style={{fontSize:58,marginBottom:20,
              filter:'drop-shadow(0 0 22px rgba(167,139,250,0.45))'}}>🪷</div>
            <h2 style={{fontFamily:SF,
              fontSize:'clamp(2.2rem,4vw,4.2rem)',
              fontWeight:700,color:'#fff',
              lineHeight:1.08,letterSpacing:'-0.028em',marginBottom:16}}>
              You Are Not Alone. 💜
            </h2>
            <p style={{fontSize:17,color:'rgba(255,255,255,0.5)',lineHeight:1.86}}>
              Join a community built around connection, support,
              healing, and personal growth.
            </p>
          </div>

          {/* Right */}
          <div className="l-cta-btns" style={{display:'flex',
            flexDirection:'column',alignItems:'flex-end',gap:14}}>
            <Link to="/signup" className="l-btn-p"
              style={{fontSize:16,padding:'17px 44px',borderRadius:16}}>
              Find My Circle 💜
            </Link>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.3)',
              textAlign:'right'}}>
              Because healing happens together.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER  (premium redesign)
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background:`linear-gradient(180deg,#0D0628 0%,#060218 100%)`,
        borderTop:'1px solid rgba(109,74,255,0.14)',
        position:'relative',overflow:'hidden',
        padding:'72px 32px 0',
      }}>
        {/* Sacred geometry watermark */}
        <div style={{position:'absolute',top:'-5%',right:'-4%',
          opacity:0.04,pointerEvents:'none',
          animation:'floatY 20s ease-in-out infinite'}}>
          <svg viewBox="0 0 240 240" width="360" height="360">
            {[0,45,90,135,180,225,270,315].map((a,i)=>{
              const r=(a-90)*Math.PI/180;
              return <ellipse key={i}
                cx={120+78*Math.cos(r)} cy={120+78*Math.sin(r)}
                rx={13} ry={38} fill={LAV}
                transform={`rotate(${a},${120+78*Math.cos(r)},${120+78*Math.sin(r)})`}/>;
            })}
            <circle cx="120" cy="120" r="14" fill={GLD}/>
          </svg>
        </div>
        {/* Floating particles */}
        {Array.from({length:10},(_,i)=>(
          <div key={i} style={{position:'absolute',
            left:`${5+(i*9.3)%88}%`,top:`${5+(i*12.7)%82}%`,
            width:2,height:2,borderRadius:'50%',
            background:[LAV,GLD,PNK][i%3],opacity:0.2,
            animation:`floatY ${8+(i%4)*2}s ease-in-out ${i*1.1}s infinite`,
            pointerEvents:'none'}}/>
        ))}

        {/* Main grid */}
        <div style={{maxWidth:1360,margin:'0 auto',position:'relative',zIndex:1}}>
          <div className="l-ft-grid" style={{
            display:'grid',
            gridTemplateColumns:'2fr 1.2fr 1.2fr 1.2fr 1.5fr',
            gap:'clamp(24px,4vw,56px)',
            paddingBottom:56,
            borderBottom:'1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Brand column */}
            <div>
              <Link to="/" style={{display:'flex',alignItems:'center',gap:10,
                textDecoration:'none',marginBottom:18}}>
                <div style={{width:44,height:44,borderRadius:14,
                  background:`linear-gradient(135deg,${P},${LAV})`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:22,boxShadow:`0 4px 18px rgba(109,74,255,0.44)`}}>🪷</div>
                <div>
                  <div style={{fontSize:19,fontWeight:800,color:'#fff',
                    letterSpacing:'-0.02em',lineHeight:1.1}}>
                    Soul<span style={{color:LAV}}>Connect</span>
                  </div>
                  <div style={{fontSize:9,color:LAV,fontWeight:700,
                    letterSpacing:'0.14em',textTransform:'uppercase',marginTop:1}}>
                    Heal · Connect · Grow
                  </div>
                </div>
              </Link>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.42)',
                lineHeight:1.78,maxWidth:300,marginBottom:24}}>
                A safe space to share, connect, and heal with people who
                truly understand what you're going through.
              </p>
              {/* Social */}
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {[
                  {icon:'📸',label:'Instagram'},
                  {icon:'👤',label:'Facebook'},
                  {icon:'▶',label:'YouTube'},
                  {icon:'🐦',label:'Twitter'},
                ].map((s,i)=>(
                  <a key={i} href="#" className="l-social"
                    aria-label={s.label}
                    style={{color:LAV}}>{s.icon}</a>
                ))}
              </div>
            </div>

            {/* About SoulConnect */}
            <div>
              <h4 style={{fontSize:13,fontWeight:700,color:'#fff',
                letterSpacing:'0.09em',textTransform:'uppercase',
                marginBottom:20}}>About SoulConnect</h4>
              {['Our Story','How It Works','Our Mission','The Team',
                'Careers','Press'].map(l=>(
                <a key={l} href="#" className="l-ft-link">{l}</a>
              ))}
            </div>

            {/* Resources */}
            <div>
              <h4 style={{fontSize:13,fontWeight:700,color:'#fff',
                letterSpacing:'0.09em',textTransform:'uppercase',
                marginBottom:20}}>Resources</h4>
              {['Blog','Wellness Guides','Healing Journal','Community Stories',
                'FAQs','Contact Us'].map(l=>(
                <a key={l} href="#" className="l-ft-link">{l}</a>
              ))}
            </div>

            {/* Safety & Support */}
            <div>
              <h4 style={{fontSize:13,fontWeight:700,color:'#fff',
                letterSpacing:'0.09em',textTransform:'uppercase',
                marginBottom:20}}>Safety & Support</h4>
              {['Safety Policy','Community Guidelines','Privacy Policy',
                'Terms of Service','Report a Concern','Trust & Safety'].map(l=>(
                <Link key={l} to="/safety" className="l-ft-link">{l}</Link>
              ))}
            </div>

            {/* Crisis Resources CTA card */}
            <div>
              <h4 style={{fontSize:13,fontWeight:700,color:'#fff',
                letterSpacing:'0.09em',textTransform:'uppercase',
                marginBottom:20}}>Crisis Support</h4>
              <div style={{
                background:'rgba(109,74,255,0.15)',
                border:'1px solid rgba(167,139,250,0.25)',
                borderRadius:18,padding:'22px 18px',
                backdropFilter:'blur(12px)',
              }}>
                <div style={{fontSize:28,marginBottom:10}}>🆘</div>
                <h5 style={{fontSize:15,fontWeight:700,color:'#fff',
                  marginBottom:8,lineHeight:1.3}}>
                  Need Immediate Help?
                </h5>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.5)',
                  lineHeight:1.6,marginBottom:16}}>
                  Crisis resources are always available.
                  You are not alone.
                </p>
                <Link to="/crisis-support" style={{
                  display:'block',textAlign:'center',
                  padding:'11px 16px',borderRadius:11,
                  background:`linear-gradient(135deg,${P},#5B3CE8)`,
                  color:'#fff',fontSize:13,fontWeight:700,
                  textDecoration:'none',
                  boxShadow:'0 4px 16px rgba(109,74,255,0.4)',
                  transition:'all .22s',
                }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                >
                  Get Crisis Support →
                </Link>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:14,padding:'16px 20px',marginBottom:24,
          }}>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.32)',lineHeight:1.7,textAlign:'center'}}>
              <strong style={{color:'rgba(255,255,255,0.45)'}}>Disclaimer:</strong>{' '}
              SoulConnect is a peer-support and wellness platform. It is not a medical,
              psychiatric, emergency, or crisis intervention service. If you are in
              immediate danger, please call emergency services or visit your nearest
              hospital.{' '}
              <Link to="/crisis-support"
                style={{color:LAV,textDecoration:'underline'}}>
                View Crisis Resources →
              </Link>
            </p>
          </div>

          {/* Bottom bar */}
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            flexWrap:'wrap',gap:14,padding:'18px 0 32px',
          }}>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.28)'}}>
              © 2025 SoulConnect. All rights reserved. Made with 💜 for healing.
            </p>
            <div style={{display:'flex',gap:22,flexWrap:'wrap'}}>
              {[
                {label:'Privacy Policy',  to:'/terms'},
                {label:'Terms of Service',to:'/terms'},
                {label:'Safety Policy',   to:'/safety'},
                {label:'Crisis Support',  to:'/crisis-support'},
              ].map(l=>(
                <Link key={l.label} to={l.to}
                  style={{fontSize:13,color:'rgba(255,255,255,0.28)',
                    textDecoration:'none',transition:'color .18s'}}
                  onMouseEnter={e=>e.currentTarget.style.color=LAV}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.28)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
