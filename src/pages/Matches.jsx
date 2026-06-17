import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// ── Color System ──────────────────────────────────────────────────────────────
const C = {
  DEEP:   '#12042A',
  INDIGO: '#1B0D4E',
  CARD:   '#1E1245',
  CARD2:  '#2A1B5E',
  VIOLET: '#6D4AFF',
  LAV:    '#A78BFA',
  GOLD:   '#F5B841',
  PINK:   '#F472B6',
  GRN:    '#34C38F',
  TEXT:   '#F1EEF9',
  MUTED:  '#9B8EC4',
};

// ── Static Data ───────────────────────────────────────────────────────────────
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

const JOURNAL_PROMPTS = [
  "What would you tell your younger self about the pain you've been carrying?",
  "Name three things your body did for you today that you're grateful for.",
  "What emotion have you been avoiding, and what is it trying to tell you?",
  "Describe a moment this week when you felt fully like yourself.",
  "What belief about yourself is ready to be released today?",
  "Write a letter of forgiveness — to yourself.",
  "What does your soul need most right now?",
];

const STAGES = [
  { emoji:'🌱', name:'Awareness',      stage:1, done:true,    color:C.GRN,    desc:'Awakening to the journey'   },
  { emoji:'✨', name:'Healing',         stage:2, current:true, color:C.VIOLET, desc:'Processing and releasing'   },
  { emoji:'🌸', name:'Growth',          stage:3, locked:true,  color:C.PINK,   desc:'Expanding your awareness'   },
  { emoji:'🦋', name:'Transformation',  stage:4, locked:true,  color:C.GOLD,   desc:'Becoming your true self'    },
  { emoji:'🌳', name:'Awakening',       stage:5, locked:true,  color:C.LAV,    desc:'Living in alignment'        },
];

const CHALLENGES = [
  { icon:'🌬️', name:'3-Min Breathing',   pts:30,  done:true,  color:'#0891B2' },
  { icon:'🙏',  name:'Gratitude Journal', pts:50,  done:false, color:C.GRN     },
  { icon:'🎧',  name:'5-Min Meditation',  pts:70,  done:false, color:'#9333EA' },
];

const MY_CIRCLES = [
  { name:'Anxiety Circle',     emoji:'🧠', members:127, live:true,  time:'Now',          color:'#7C3AED' },
  { name:'Morning Meditation', emoji:'🌅', members:43,  live:false, time:'Tomorrow 7AM', color:C.GRN     },
  { name:'Grief Support',      emoji:'🌧', members:28,  live:false, time:'Thu 6PM',      color:'#2563EB' },
];

const HEALERS = [
  { name:'Dr. Meera Shah', role:'Reiki Healer',   rating:4.9, sessions:847, avail:'Today',    color:C.VIOLET, price:'₹900', initial:'M' },
  { name:'Rohit Verma',    role:'Wellness Coach', rating:4.8, sessions:623, avail:'Tomorrow', color:C.GOLD,   price:'₹750', initial:'R' },
  { name:'Ananya Iyer',    role:'Meditation',     rating:4.9, sessions:912, avail:'Today',    color:C.GRN,    price:'₹800', initial:'A' },
];

const MOODS = [
  { emoji:'😔', label:'Low',     color:'#2563EB' },
  { emoji:'😕', label:'Okay',    color:'#D97706' },
  { emoji:'😊', label:'Good',    color:C.GRN     },
  { emoji:'😄', label:'Great',   color:C.VIOLET  },
  { emoji:'🌟', label:'Amazing', color:C.GOLD    },
];

const PARTICLES = Array.from({length:20},(_,i)=>({
  x: 5 + (i*47+i*i*11)%90,
  y: 5 + (i*61+i*i*17)%90,
  size: 1.5+(i%4)*1,
  opacity: 0.06+(i%5)*0.03,
  dur: 4+(i%6)*1.2,
  delay: (i%7)*0.8,
  color: i%3===0?C.GOLD:i%3===1?C.LAV:C.GRN,
}));

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ value }) {
  return (
    <span style={{ color: C.GOLD, fontSize: 12, letterSpacing: 1 }}>
      {'★'.repeat(Math.floor(value))}{'☆'.repeat(5 - Math.floor(value))}
    </span>
  );
}

function BreathingWidget() {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const iRef = useRef(null);
  const PHASES = [
    { key:'inhale', label:'Breathe In',  dur:4, color:C.VIOLET, scale:1.4 },
    { key:'hold',   label:'Hold',        dur:4, color:C.LAV,    scale:1.4 },
    { key:'exhale', label:'Breathe Out', dur:6, color:C.GRN,    scale:1.0 },
  ];
  const cur = PHASES.find(p=>p.key===phase)||PHASES[0];
  const start = () => {
    let pi=0, c=0;
    setPhase(PHASES[0].key); setCount(PHASES[0].dur);
    iRef.current = setInterval(()=>{
      c++;
      if(c>=PHASES[pi].dur){c=0;pi=(pi+1)%3;setPhase(PHASES[pi].key);setCount(PHASES[pi].dur);}
      else setCount(PHASES[pi].dur-c);
    },1000);
  };
  const stop = ()=>{clearInterval(iRef.current);setPhase('idle');};
  useEffect(()=>()=>clearInterval(iRef.current),[]);
  const isActive = phase!=='idle';
  return (
    <div style={{display:'flex',alignItems:'center',gap:16}}>
      <div style={{position:'relative',flexShrink:0}}>
        {isActive&&<div style={{position:'absolute',inset:-8,borderRadius:'50%',background:`${cur.color}20`,animation:'breathe 2s ease-in-out infinite'}}/>}
        <div style={{width:72,height:72,borderRadius:'50%',border:`2.5px solid ${isActive?cur.color:C.MUTED}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color 0.5s'}}>
          <div style={{width:50,height:50,borderRadius:'50%',background:isActive?`radial-gradient(circle,${cur.color}30,${cur.color}10)`:`rgba(255,255,255,0.03)`,border:`2px solid ${isActive?cur.color:C.MUTED}`,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${isActive?cur.scale:1})`,transition:`transform ${isActive?(phase==='inhale'?4:phase==='exhale'?6:0.3):0.3}s ease-in-out,background 0.5s`}}>
            <span style={{fontSize:isActive?20:15,fontWeight:800,color:isActive?cur.color:C.LAV}}>{isActive?count:'🫁'}</span>
          </div>
        </div>
      </div>
      <div style={{flex:1}}>
        {isActive?(
          <>
            <p style={{margin:'0 0 4px',fontSize:14,fontWeight:700,color:cur.color}}>{cur.label}</p>
            <div style={{display:'flex',gap:3,marginBottom:8}}>
              {PHASES.map(p=><div key={p.key} style={{flex:1,height:3,borderRadius:2,background:p.key===phase?p.color:`rgba(255,255,255,0.1)`,transition:'background 0.3s'}}/>)}
            </div>
            <button onClick={stop} style={{padding:'5px 12px',borderRadius:8,fontSize:11,fontWeight:600,background:`rgba(255,255,255,0.08)`,color:C.LAV,border:`1px solid rgba(167,139,250,0.3)`,cursor:'pointer'}}>Stop</button>
          </>
        ):(
          <>
            <p style={{margin:'0 0 4px',fontSize:13,fontWeight:700,color:C.TEXT}}>4-4-6 Box Breathing</p>
            <p style={{margin:'0 0 8px',fontSize:11,color:C.MUTED,lineHeight:1.5}}>Calm your nervous system in 2 min</p>
            <button onClick={start} style={{padding:'7px 16px',borderRadius:10,fontSize:12,fontWeight:700,background:`linear-gradient(135deg,${C.VIOLET},${C.LAV})`,color:'#fff',border:'none',cursor:'pointer',boxShadow:`0 4px 14px rgba(109,74,255,0.4)`}}>Begin</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Matches() {
  const navigate = useNavigate();
  const { user }  = useAuthStore();

  const today      = new Date();
  const hour       = today.getHours();
  const firstName  = user?.name?.split(' ')[0] || 'Beautiful Soul';
  const greeting   = hour<5?'Good night':hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  const quote      = QUOTES[today.getDate()%QUOTES.length];
  const affirmation= AFFIRMATIONS[today.getDate()%AFFIRMATIONS.length];
  const prompt     = JOURNAL_PROMPTS[today.getDate()%JOURNAL_PROMPTS.length];

  const [mood, setMood]               = useState(null);
  const [moodSaved, setMoodSaved]     = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const saveMood    = ()=>{ if(mood===null)return; setMoodSaved(true); setTimeout(()=>setMoodSaved(false),3000); };
  const saveJournal = ()=>{ if(!journalText.trim())return; setJournalSaved(true); setTimeout(()=>setJournalSaved(false),3000); };

  // Inject fonts
  useEffect(()=>{
    if(!document.getElementById('sc-fonts')){
      const l=document.createElement('link');
      l.id='sc-fonts';l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap';
      document.head.appendChild(l);
    }
  },[]);

  return (
    <div style={{
      minHeight:'100vh',
      background:`linear-gradient(160deg,${C.DEEP} 0%,${C.INDIGO} 40%,${C.DEEP} 100%)`,
      fontFamily:"'Plus Jakarta Sans',Inter,-apple-system,sans-serif",
      color:C.TEXT,
      position:'relative',
      overflowX:'hidden',
    }}>

      {/* ── Global CSS ── */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 12px rgba(109,74,255,0.3)} 50%{box-shadow:0 0 28px rgba(109,74,255,0.7)} }
        @keyframes breathe { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes scGlow { 0%,100%{box-shadow:0 0 20px rgba(109,74,255,0.4)} 50%{box-shadow:0 0 40px rgba(109,74,255,0.8)} }
        @keyframes livePulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
        .sc-card:hover { transform:translateY(-4px); transition:all 0.25s ease; }
        .sc-card { transition:all 0.25s ease; }
        .sc-pulse { animation: pulse-glow 2.5s ease-in-out infinite; }
        .sc-breathe { animation: breathe 4s ease-in-out infinite; }
        .sc-float { animation: float 5s ease-in-out infinite; }
        .f1{animation:fadeUp 0.5s 0.0s ease both}
        .f2{animation:fadeUp 0.5s 0.08s ease both}
        .f3{animation:fadeUp 0.5s 0.16s ease both}
        .f4{animation:fadeUp 0.5s 0.24s ease both}
        .f5{animation:fadeUp 0.5s 0.32s ease both}
        .f6{animation:fadeUp 0.5s 0.40s ease both}
        .f7{animation:fadeUp 0.5s 0.48s ease both}
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media(prefers-reduced-motion:reduce){
          .f1,.f2,.f3,.f4,.f5,.f6,.f7,.sc-card,.sc-pulse,.sc-breathe,.sc-float{animation:none!important;transition:none!important}
        }
      `}</style>

      {/* ── Sacred Geometry Background ── */}
      <svg aria-hidden="true" style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none',opacity:0.04}} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.8)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        {/* Concentric circles */}
        <circle cx="50%" cy="50%" r="200" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.8"/>
        <circle cx="50%" cy="50%" r="350" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.6"/>
        <circle cx="50%" cy="50%" r="500" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.5"/>
        {/* 6 radiating lines */}
        {Array.from({length:6},(_,i)=>{
          const a=(i*60)*Math.PI/180;
          return <line key={i} x1="50%" y1="50%" x2={`${50+55*Math.cos(a)}%`} y2={`${50+90*Math.sin(a)}%`} stroke="rgba(167,139,250,0.8)" strokeWidth="0.5"/>;
        })}
        {/* Star of David triangles */}
        <polygon points="50%,25% 70%,58% 30%,58%" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.6"/>
        <polygon points="50%,75% 70%,42% 30%,42%" fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.6"/>
        {/* Lotus petals (8 petals) */}
        {Array.from({length:8},(_,i)=>{
          const a=(i*45)*Math.PI/180;
          const cx=50+8*Math.cos(a);
          const cy=50+13*Math.sin(a);
          return <ellipse key={i} cx={`${cx}%`} cy={`${cy}%`} rx="4%" ry="7%" transform={`rotate(${i*45},${cx*8},${cy*6})`} fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="0.5"/>;
        })}
      </svg>

      {/* ── Floating Particles ── */}
      <div aria-hidden="true" style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>
        {PARTICLES.map((p,i)=>(
          <div key={i} style={{
            position:'absolute',
            left:`${p.x}%`,top:`${p.y}%`,
            width:p.size,height:p.size,
            borderRadius:'50%',
            background:p.color,
            opacity:p.opacity,
            animation:`float ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }}/>
        ))}
      </div>

      {/* ── Page Content ── */}
      <div style={{position:'relative',zIndex:1,maxWidth:1280,margin:'0 auto',padding:`clamp(20px,2.5vw,40px)`,paddingTop:80}}>

        {/* ══ SECTION 1: HERO CARD ══ */}
        <div className="f1" style={{
          background:`linear-gradient(135deg,${C.INDIGO} 0%,${C.CARD2} 50%,#1a0a3a 100%)`,
          border:`1px solid rgba(109,74,255,0.25)`,
          borderRadius:28,
          padding:'40px 48px',
          position:'relative',
          overflow:'hidden',
          marginBottom:20,
          display:'grid',
          gridTemplateColumns:'3fr 2fr',
          gap:32,
          alignItems:'center',
        }}>
          {/* Decorative orb */}
          <div style={{position:'absolute',top:-60,right:-60,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.2) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:-40,left:'20%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,184,65,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
          {/* Rotating sacred geo */}
          <div style={{position:'absolute',right:220,top:20,opacity:0.05,animation:'scRotate 80s linear infinite',pointerEvents:'none'}}>
            <svg viewBox="0 0 200 200" style={{width:200,height:200}}>
              <circle cx="100" cy="100" r="80" fill="none" stroke={C.LAV} strokeWidth="0.8"/>
              <circle cx="100" cy="100" r="50" fill="none" stroke={C.LAV} strokeWidth="0.5"/>
              <circle cx="100" cy="100" r="20" fill="none" stroke={C.LAV} strokeWidth="0.4"/>
              {Array.from({length:6},(_,i)=>{const a=(i*60-90)*Math.PI/180;return<line key={i} x1="100" y1="100" x2={100+80*Math.cos(a)} y2={100+80*Math.sin(a)} stroke={C.LAV} strokeWidth="0.4"/>;})}
            </svg>
          </div>

          {/* Left: text content */}
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'inline-block',fontSize:10,fontWeight:800,color:C.GOLD,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:16,padding:'4px 12px',borderRadius:20,border:`1px solid rgba(245,184,65,0.3)`,background:'rgba(245,184,65,0.08)'}}>
              ✦ YOUR DAILY INTENTION
            </div>
            <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'clamp(22px,2.4vw,38px)',fontWeight:700,color:C.TEXT,lineHeight:1.3,marginBottom:10,letterSpacing:'-0.01em'}}>
              Your healing journey<br/>
              <span style={{color:C.LAV,fontStyle:'italic'}}>continues today.</span>
            </h1>
            <p style={{fontSize:16,color:C.MUTED,lineHeight:1.65,marginBottom:24,maxWidth:440}}>
              "{affirmation}"
            </p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
              <button onClick={()=>navigate('/meetups')} style={{padding:'11px 24px',borderRadius:14,fontSize:13,fontWeight:700,background:`linear-gradient(135deg,${C.VIOLET},${C.LAV})`,color:'#fff',border:'none',cursor:'pointer',boxShadow:`0 6px 20px rgba(109,74,255,0.4)`}}>Continue Your Journey →</button>
              <button onClick={()=>navigate('/mood')} style={{padding:'11px 24px',borderRadius:14,fontSize:13,fontWeight:700,background:'transparent',color:C.LAV,border:`1px solid rgba(167,139,250,0.4)`,cursor:'pointer'}}>Today's Challenge</button>
            </div>
            {/* Micro stats */}
            <div style={{display:'flex',gap:24,flexWrap:'wrap'}}>
              {[
                {icon:'🔥',val:`${user?.streak||7}`,label:'Day Streak'},
                {icon:'🌙',val:'Stage 2',label:'Healing'},
                {icon:'⚡',val:'847',label:'Soul Points'},
              ].map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:7}}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <div>
                    <div style={{fontSize:15,fontWeight:800,color:C.TEXT,lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:10,color:C.MUTED,fontWeight:600}}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Meditation SVG */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <svg viewBox="0 0 400 300" style={{width:'100%',maxWidth:340}} aria-label="Meditating figure">
              <defs>
                <radialGradient id="mandalaBg" cx="50%" cy="55%" r="50%">
                  <stop offset="0%" stopColor="#3B1F6E" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#12042A" stopOpacity="0"/>
                </radialGradient>
                <filter id="auraBlur">
                  <feGaussianBlur stdDeviation="4"/>
                </filter>
                <filter id="softBlur">
                  <feGaussianBlur stdDeviation="2"/>
                </filter>
              </defs>
              <ellipse cx="200" cy="200" rx="180" ry="130" fill="url(#mandalaBg)"/>
              {/* Mandala rings */}
              {[110,90,70,55,40].map((r,i)=>(
                <circle key={i} cx="200" cy="185" r={r} fill="none"
                  stroke={i%2===0?'rgba(245,184,65,0.12)':'rgba(167,139,250,0.15)'}
                  strokeWidth="1"
                  strokeDasharray={i%2===0?'6 4':'3 6'}
                />
              ))}
              {/* Light rays */}
              {Array.from({length:6},(_,i)=>{
                const a=(i*60-90)*Math.PI/180;
                return<line key={i} x1="200" y1="185" x2={200+130*Math.cos(a)} y2={185+130*Math.sin(a)} stroke="rgba(245,184,65,0.12)" strokeWidth="1"/>;
              })}
              {/* Aura halo (blurred, pulsing) */}
              <circle cx="200" cy="160" r="32" fill="none" stroke="rgba(245,184,65,0.35)" strokeWidth="8" filter="url(#auraBlur)">
                <animate attributeName="r" values="30;36;30" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.35;0.6;0.35" dur="3s" repeatCount="indefinite"/>
              </circle>
              {/* Meditator silhouette */}
              {/* Head */}
              <circle cx="200" cy="160" r="16" fill="rgba(167,139,250,0.75)"/>
              {/* Body/torso */}
              <ellipse cx="200" cy="210" rx="28" ry="32" fill="rgba(167,139,250,0.7)"/>
              {/* Left arm */}
              <path d="M172,200 Q155,210 158,228" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="10" strokeLinecap="round"/>
              {/* Right arm */}
              <path d="M228,200 Q245,210 242,228" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="10" strokeLinecap="round"/>
              {/* Left knee/leg */}
              <ellipse cx="178" cy="240" rx="20" ry="10" fill="rgba(167,139,250,0.65)" transform="rotate(-15,178,240)"/>
              {/* Right knee/leg */}
              <ellipse cx="222" cy="240" rx="20" ry="10" fill="rgba(167,139,250,0.65)" transform="rotate(15,222,240)"/>
              {/* Floating particles around figure */}
              {[
                {cx:155,cy:170,r:3,color:'rgba(245,184,65,0.6)',dy:'0;-12;0'},
                {cx:248,cy:165,r:2.5,color:'rgba(167,139,250,0.7)',dy:'0;-10;0'},
                {cx:162,cy:220,r:2,color:'rgba(52,195,143,0.6)',dy:'0;-8;0'},
                {cx:242,cy:215,r:2.5,color:'rgba(245,184,65,0.5)',dy:'0;-14;0'},
              ].map((p,i)=>(
                <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.color}>
                  <animate attributeName="cy" values={`${p.cy};${p.cy-12};${p.cy}`} dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2+i*0.5}s`} repeatCount="indefinite"/>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* ══ SECTION 2: STATS ROW ══ */}
        <div className="f2 stats-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16,marginBottom:20}}>

          {/* Card 1: Healing Streak */}
          <div className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(245,184,65,0.2)`,borderRadius:20,padding:24,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',right:-10,bottom:-10,fontSize:60,opacity:0.07,pointerEvents:'none'}}>🔥</div>
            <div style={{fontSize:32,marginBottom:10}}>🕯️</div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'2.8rem',fontWeight:700,color:C.GOLD,lineHeight:1,textShadow:`0 0 20px rgba(245,184,65,0.5)`,marginBottom:4}}>{user?.streak||7}</div>
            <div style={{fontSize:12,color:C.MUTED,fontWeight:600,marginBottom:12}}>Day Healing Streak</div>
            <div style={{height:4,background:'rgba(245,184,65,0.15)',borderRadius:4,marginBottom:8,overflow:'hidden'}}>
              <div style={{width:`${Math.min(((user?.streak||7)/30)*100,100)}%`,height:'100%',background:`linear-gradient(90deg,${C.GOLD},#FFD77A,${C.GOLD})`,backgroundSize:'200% auto',borderRadius:4,animation:'shimmer 2s linear infinite'}}/>
            </div>
            <div style={{fontSize:10,color:C.MUTED}}>🌙 Best: 14 days</div>
          </div>

          {/* Card 2: Community Pulse */}
          <div className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},#1B2A5E)`,border:`1px solid rgba(52,195,143,0.2)`,borderRadius:20,padding:24,position:'relative',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <svg viewBox="0 0 36 36" style={{width:32,height:32}}>
                <circle cx="18" cy="18" r="15" fill="none" stroke={C.GRN} strokeWidth="1.5" opacity="0.7"/>
                <circle cx="18" cy="18" r="10" fill="none" stroke={C.GRN} strokeWidth="0.8" opacity="0.4"/>
                <circle cx="10" cy="12" r="2.5" fill={C.GRN} opacity="0.8"/>
                <circle cx="26" cy="16" r="2" fill={C.GRN} opacity="0.8"/>
                <circle cx="18" cy="26" r="2.5" fill={C.GRN} opacity="0.8"/>
                <line x1="10" y1="12" x2="18" y2="26" stroke={C.GRN} strokeWidth="0.8" opacity="0.4"/>
                <line x1="26" y1="16" x2="18" y2="26" stroke={C.GRN} strokeWidth="0.8" opacity="0.4"/>
              </svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'2.8rem',fontWeight:700,color:C.GRN,lineHeight:1,textShadow:`0 0 20px rgba(52,195,143,0.5)`,marginBottom:4}}>1,247</div>
            <div style={{fontSize:12,color:C.MUTED,fontWeight:600,marginBottom:12}}>Souls healing right now</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {/* 3 tiny avatar circles */}
              {['#6D4AFF','#F5B841','#34C38F'].map((c,i)=>(
                <div key={i} style={{width:18,height:18,borderRadius:'50%',background:`linear-gradient(135deg,${c},${c}99)`,border:`2px solid rgba(255,255,255,0.1)`,marginLeft:i>0?-6:0,zIndex:3-i}}/>
              ))}
              <div style={{display:'flex',alignItems:'center',gap:4,marginLeft:8}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.GRN,animation:'livePulse 1.5s ease-in-out infinite'}}/>
                <span style={{fontSize:10,color:C.GRN,fontWeight:600}}>LIVE</span>
              </div>
            </div>
          </div>

          {/* Card 3: Soul Points */}
          <div className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},#2A1845)`,border:`1px solid rgba(167,139,250,0.2)`,borderRadius:20,padding:24,position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:28,marginBottom:10}}>⚡</div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'2.8rem',fontWeight:700,color:C.LAV,lineHeight:1,textShadow:`0 0 20px rgba(167,139,250,0.5)`,marginBottom:4}}>847</div>
            <div style={{fontSize:12,color:C.MUTED,fontWeight:600,marginBottom:12}}>Soul Points</div>
            <div style={{height:4,background:'rgba(167,139,250,0.15)',borderRadius:4,marginBottom:6,overflow:'hidden'}}>
              <div style={{width:'84.7%',height:'100%',background:`linear-gradient(90deg,${C.VIOLET},${C.LAV})`,borderRadius:4}}/>
            </div>
            <div style={{fontSize:10,color:C.MUTED}}>Level 3 · 153 pts to Level 4</div>
          </div>

          {/* Card 4: Sessions This Week */}
          <div className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(244,114,182,0.2)`,borderRadius:20,padding:24,position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:28,marginBottom:10}}>🧘</div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'2.8rem',fontWeight:700,color:C.PINK,lineHeight:1,textShadow:`0 0 20px rgba(244,114,182,0.5)`,marginBottom:4}}>3</div>
            <div style={{fontSize:12,color:C.MUTED,fontWeight:600,marginBottom:12}}>Healing Sessions</div>
            {/* Mini sparkline */}
            <div style={{display:'flex',gap:3,alignItems:'flex-end',height:28,marginBottom:8}}>
              {[2,3,1,4,3,5,3].map((v,i)=>(
                <div key={i} style={{flex:1,borderRadius:3,background:i===5?C.PINK:`rgba(244,114,182,0.3)`,height:`${v*18}%`,minHeight:4,transition:'height 0.3s'}}/>
              ))}
            </div>
            <div style={{fontSize:10,color:C.MUTED}}>This week · +2 from last</div>
          </div>
        </div>

        {/* ══ SECTION 3: TWO COLUMN LAYOUT ══ */}
        <div className="f3 two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>

          {/* LEFT: Soul Journey Progress */}
          <div style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(109,74,255,0.2)`,borderRadius:24,padding:28}}>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.3rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>✨ Soul Journey</div>
              <div style={{fontSize:12,color:C.MUTED}}>Stage 2 of 5 · Healing</div>
            </div>
            <div style={{position:'relative'}}>
              {/* Vertical connecting line */}
              <div style={{position:'absolute',left:19,top:28,bottom:28,width:2,background:`linear-gradient(180deg,${C.GRN} 0%,${C.VIOLET} 25%,rgba(167,139,250,0.2) 100%)`,zIndex:0}}/>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {STAGES.map((s,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:14,position:'relative',zIndex:1,padding:'6px 0'}}>
                    {/* Icon circle */}
                    <div style={{
                      width:40,height:40,borderRadius:'50%',flexShrink:0,
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,
                      background:s.done?`linear-gradient(135deg,${s.color},${s.color}99)`:s.current?`linear-gradient(135deg,${s.color}40,${s.color}20)`:`rgba(255,255,255,0.04)`,
                      border:`2px solid ${s.done||s.current?s.color:'rgba(255,255,255,0.1)'}`,
                      boxShadow:s.current?`0 0 20px rgba(109,74,255,0.6)`:'none',
                      animation:s.current?'pulse-glow 2.5s ease-in-out infinite':'none',
                      opacity:s.locked?0.4:1,
                    }}>
                      {s.locked?'🔒':s.emoji}
                    </div>
                    {/* Text */}
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:s.locked?C.MUTED:C.TEXT}}>{s.name}</div>
                      <div style={{fontSize:11,color:C.MUTED}}>{s.desc}</div>
                    </div>
                    {/* Status badge */}
                    {s.done&&<div style={{fontSize:16,color:C.GRN}}>✓</div>}
                    {s.current&&<div style={{fontSize:10,fontWeight:700,color:C.VIOLET,background:'rgba(109,74,255,0.2)',padding:'3px 8px',borderRadius:20,border:`1px solid rgba(109,74,255,0.4)`,whiteSpace:'nowrap'}}>You are here</div>}
                    {s.locked&&<div style={{fontSize:14,color:C.MUTED,opacity:0.5}}>🔒</div>}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={()=>navigate('/meetups')} style={{marginTop:20,width:'100%',padding:'11px',borderRadius:14,fontSize:13,fontWeight:700,background:'transparent',color:C.VIOLET,border:`1px solid rgba(109,74,255,0.4)`,cursor:'pointer'}}>View Full Journey</button>
          </div>

          {/* RIGHT: Daily Healing Challenges */}
          <div style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(52,195,143,0.2)`,borderRadius:24,padding:28}}>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.3rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>⚡ Daily Challenges</div>
              <div style={{fontSize:12,color:C.MUTED}}>Complete 3 challenges to earn 150 Soul Points</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {CHALLENGES.map((ch,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:14,background:ch.done?'rgba(52,195,143,0.08)':'rgba(255,255,255,0.03)',border:`1px solid ${ch.done?'rgba(52,195,143,0.25)':'rgba(255,255,255,0.06)'}`}}>
                  {/* Checkbox */}
                  <div style={{width:22,height:22,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:ch.done?C.GRN:'transparent',border:`2px solid ${ch.done?C.GRN:C.MUTED}`,fontSize:11,color:'#fff'}}>
                    {ch.done&&'✓'}
                  </div>
                  {/* Icon */}
                  <div style={{width:36,height:36,borderRadius:10,background:`${ch.color}20`,border:`1px solid ${ch.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>
                    {ch.icon}
                  </div>
                  {/* Text */}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:ch.done?C.TEXT:`${C.TEXT}cc`,textDecoration:ch.done?'line-through':'none'}}>{ch.name}</div>
                    <div style={{fontSize:11,color:C.MUTED}}>{ch.done?'Day 7 streak 🔥':'Tap to start'}</div>
                  </div>
                  {/* Points badge */}
                  <div style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:20,background:ch.done?`rgba(245,184,65,0.2)`:'transparent',color:ch.done?C.GOLD:C.MUTED,border:`1px solid ${ch.done?'rgba(245,184,65,0.4)':C.MUTED+'40'}`}}>
                    +{ch.pts} pts
                  </div>
                </div>
              ))}
            </div>
            {/* Progress */}
            <div style={{marginTop:16}}>
              <div style={{height:4,background:'rgba(255,255,255,0.08)',borderRadius:4,marginBottom:6,overflow:'hidden'}}>
                <div style={{width:'33%',height:'100%',background:`linear-gradient(90deg,${C.GRN},${C.LAV})`,borderRadius:4}}/>
              </div>
              <div style={{fontSize:11,color:C.MUTED}}>1 of 3 completed · 120 pts remaining</div>
            </div>
            <button onClick={()=>navigate('/mood')} style={{marginTop:14,fontSize:12,fontWeight:700,color:C.VIOLET,background:'none',border:'none',cursor:'pointer',padding:0}}>View All Challenges →</button>
          </div>
        </div>

        {/* ══ SECTION 4: SOUL MATCHES ══ */}
        <div className="f4" style={{marginBottom:20}}>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.5rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>💫 Your Soul Matches</div>
            <div style={{fontSize:13,color:C.MUTED}}>People who truly understand your journey</div>
          </div>
          <div className="three-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            {[
              {name:'Moon_42',     tag:'Anxiety · Week 3',   initial:'M', color:C.VIOLET, online:true  },
              {name:'StarLight_7', tag:'Grief · Day 12',     initial:'S', color:C.GOLD,   online:false },
              {name:'Lotus_88',    tag:'Self-love · Week 5', initial:'L', color:C.GRN,    online:true  },
            ].map((m,i)=>(
              <div key={i} className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(109,74,255,0.15)`,borderRadius:20,padding:20}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <div style={{position:'relative'}}>
                    <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${m.color},${m.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#fff'}}>{m.initial}</div>
                    <div style={{position:'absolute',bottom:1,right:1,width:10,height:10,borderRadius:'50%',background:m.online?C.GRN:'#6B7280',border:`2px solid ${C.CARD}`}}/>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:C.TEXT}}>{m.name}</div>
                    <div style={{fontSize:11,color:C.MUTED}}>{m.online?'Online now':'Last seen 2h ago'}</div>
                  </div>
                </div>
                <div style={{fontSize:11,fontWeight:600,color:m.color,background:`${m.color}15`,padding:'5px 12px',borderRadius:20,display:'inline-block',marginBottom:14,border:`1px solid ${m.color}30`}}>{m.tag}</div>
                <button onClick={()=>navigate('/chat')} style={{width:'100%',padding:'9px',borderRadius:12,fontSize:12,fontWeight:700,background:'transparent',color:C.VIOLET,border:`1px solid rgba(109,74,255,0.35)`,cursor:'pointer'}}>Start Conversation</button>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 5: ACTIVE CIRCLES ══ */}
        <div className="f4" style={{marginBottom:20}}>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.5rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>🌀 Your Healing Circles</div>
            <div style={{fontSize:13,color:C.MUTED}}>Safe spaces to share and transform</div>
          </div>
          <div className="three-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            {MY_CIRCLES.map((c,i)=>(
              <div key={i} className="sc-card" style={{background:`linear-gradient(135deg,${c.color}18,${c.color}08)`,border:`1px solid ${c.color}33`,borderRadius:20,padding:20}}>
                {/* Live/time badge */}
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:14}}>
                  {c.live?(
                    <><div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444',animation:'livePulse 1.5s ease-in-out infinite'}}/><span style={{fontSize:10,fontWeight:800,color:'#EF4444',letterSpacing:'0.1em'}}>LIVE NOW</span></>
                  ):(
                    <><div style={{width:8,height:8,borderRadius:'50%',background:C.MUTED}}/><span style={{fontSize:10,color:C.MUTED,fontWeight:600}}>{c.time}</span></>
                  )}
                </div>
                <div style={{fontSize:32,marginBottom:8}}>{c.emoji}</div>
                <div style={{fontSize:14,fontWeight:800,color:C.TEXT,marginBottom:4}}>{c.name}</div>
                <div style={{fontSize:11,color:C.MUTED,marginBottom:16}}>{c.members} members active</div>
                <button onClick={()=>navigate('/groups')} style={{width:'100%',padding:'9px',borderRadius:12,fontSize:12,fontWeight:700,background:c.live?`linear-gradient(135deg,${c.color},${c.color}bb)`:'transparent',color:c.live?'#fff':c.color,border:`1px solid ${c.color}55`,cursor:'pointer'}}>
                  {c.live?'Join Now':'Set Reminder'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 6: RECOMMENDED HEALERS ══ */}
        <div className="f5" style={{marginBottom:20}}>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.5rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>🧘 Recommended Healers</div>
            <div style={{fontSize:13,color:C.MUTED}}>Connect with verified wellness professionals</div>
          </div>
          <div className="three-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            {HEALERS.map((h,i)=>(
              <div key={i} className="sc-card" style={{background:`linear-gradient(135deg,${C.CARD},${C.CARD2})`,border:`1px solid rgba(109,74,255,0.15)`,borderRadius:20,padding:20}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${h.color},${h.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:'#fff',flexShrink:0}}>{h.initial}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:C.TEXT}}>{h.name}</div>
                    <div style={{fontSize:11,color:C.MUTED}}>{h.role}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <StarRating value={h.rating}/>
                  <span style={{fontSize:11,color:C.MUTED}}>{h.rating} · {h.sessions} sessions</span>
                </div>
                <div style={{display:'inline-block',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,background:h.avail==='Today'?'rgba(52,195,143,0.15)':'rgba(245,184,65,0.1)',color:h.avail==='Today'?C.GRN:C.GOLD,border:`1px solid ${h.avail==='Today'?'rgba(52,195,143,0.3)':'rgba(245,184,65,0.3)'}`,marginBottom:14}}>
                  {h.avail==='Today'?'● Available Today':'● '+h.avail}
                </div>
                <button onClick={()=>navigate('/healers')} style={{width:'100%',padding:'10px',borderRadius:12,fontSize:12,fontWeight:700,background:`linear-gradient(135deg,${C.VIOLET},${C.LAV})`,color:'#fff',border:'none',cursor:'pointer',boxShadow:`0 4px 14px rgba(109,74,255,0.3)`}}>Book Session {h.price}</button>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 7: MOOD TRACKER ══ */}
        <div className="f6" style={{marginBottom:20}}>
          <div style={{background:`linear-gradient(135deg,${C.INDIGO},${C.CARD2})`,border:`1px solid rgba(167,139,250,0.15)`,borderRadius:24,padding:28}}>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.3rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>💜 How are you feeling today?</div>
              <div style={{fontSize:12,color:C.MUTED}}>Track your emotional wellbeing</div>
            </div>
            {moodSaved?(
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:48,marginBottom:8}}>{MOODS[mood]?.emoji}</div>
                <p style={{margin:0,fontSize:15,fontWeight:700,color:MOODS[mood]?.color}}>Logged as {MOODS[mood]?.label} ✓</p>
                <p style={{margin:'6px 0 0',fontSize:12,color:C.MUTED}}>Your mood has been recorded</p>
              </div>
            ):(
              <>
                <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',marginBottom:24}}>
                  {MOODS.map((m,i)=>(
                    <button key={i} onClick={()=>setMood(i)} style={{
                      display:'flex',flexDirection:'column',alignItems:'center',gap:8,
                      padding:'16px 20px',borderRadius:16,border:'none',cursor:'pointer',
                      background:mood===i?`${m.color}20`:`rgba(255,255,255,0.04)`,
                      outline:mood===i?`2px solid ${m.color}`:`2px solid transparent`,
                      transform:mood===i?'scale(1.15)':'scale(1)',
                      transition:'all 0.2s',
                      boxShadow:mood===i?`0 0 16px ${m.color}40`:'none',
                    }}>
                      <span style={{fontSize:mood===i?36:28,transition:'font-size 0.2s'}}>{m.emoji}</span>
                      <span style={{fontSize:11,fontWeight:700,color:mood===i?m.color:C.MUTED}}>{m.label}</span>
                    </button>
                  ))}
                </div>
                {/* Mood trend sparkline */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:10,fontWeight:700,color:C.MUTED,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>LAST 7 DAYS</div>
                  <div style={{display:'flex',gap:6,alignItems:'flex-end',height:48}}>
                    {[3,2,4,3,5,4,4].map((v,i)=>(
                      <div key={i} style={{flex:1,borderRadius:4,background:i===6?C.VIOLET:`rgba(109,74,255,0.25)`,height:`${v*18}%`,minHeight:8,transition:'height 0.3s'}}/>
                    ))}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                    {['M','T','W','T','F','S','T'].map((d,i)=><span key={i} style={{flex:1,textAlign:'center',fontSize:9,color:C.MUTED}}>{d}</span>)}
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <button onClick={saveMood} disabled={mood===null} style={{
                    padding:'12px 40px',borderRadius:14,border:'none',
                    background:mood!==null?`linear-gradient(135deg,${C.VIOLET},${C.LAV})`:'rgba(255,255,255,0.05)',
                    color:mood!==null?'#fff':C.MUTED,fontSize:13,fontWeight:700,
                    cursor:mood!==null?'pointer':'default',
                    boxShadow:mood!==null?`0 6px 20px rgba(109,74,255,0.35)`:'none',
                    transition:'all 0.18s',
                  }}>Log Today's Mood</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ══ BREATHING + JOURNAL ROW ══ */}
        <div className="f7 two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:40}}>

          {/* Box Breathing */}
          <div style={{background:`linear-gradient(135deg,${C.INDIGO},${C.CARD2})`,border:`1px solid rgba(109,74,255,0.2)`,borderRadius:24,padding:28}}>
            <div style={{marginBottom:16}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.2rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>🌬️ Box Breathing</div>
              <div style={{fontSize:12,color:C.MUTED}}>4-4-6 · Calm your nervous system</div>
            </div>
            <BreathingWidget/>
          </div>

          {/* Soul Journal */}
          <div style={{background:`linear-gradient(135deg,${C.INDIGO},${C.CARD2})`,border:`1px solid rgba(245,184,65,0.15)`,borderRadius:24,padding:28,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',right:-20,bottom:-20,fontSize:100,opacity:0.04,pointerEvents:'none'}}>📔</div>
            <div style={{marginBottom:16}}>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:'1.2rem',fontWeight:700,color:C.TEXT,marginBottom:4}}>📔 Soul Journal</div>
              <div style={{fontSize:10,fontWeight:700,color:C.GOLD,background:'rgba(245,184,65,0.1)',padding:'3px 10px',borderRadius:20,display:'inline-block',marginBottom:8}}>5-day writing streak 🔥</div>
            </div>
            <div style={{padding:'12px 14px',borderRadius:12,background:'rgba(245,184,65,0.07)',border:'1px solid rgba(245,184,65,0.2)',marginBottom:12}}>
              <div style={{fontSize:9,fontWeight:700,color:C.GOLD,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>Today's Prompt</div>
              <p style={{margin:0,fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,color:C.TEXT,fontStyle:'italic',lineHeight:1.6}}>"{prompt}"</p>
            </div>
            {journalSaved?(
              <div style={{textAlign:'center',padding:'16px',borderRadius:12,background:'rgba(52,195,143,0.1)',border:`1px solid rgba(52,195,143,0.2)`}}>
                <span style={{fontSize:24}}>🌱</span>
                <p style={{margin:'6px 0 0',fontSize:12,fontWeight:700,color:C.GRN}}>Entry saved. Keep growing. ✓</p>
              </div>
            ):(
              <>
                <textarea value={journalText} onChange={e=>setJournalText(e.target.value)}
                  placeholder="Begin writing here... this is your sacred space 🌸"
                  style={{width:'100%',minHeight:80,padding:'12px 14px',borderRadius:12,border:`1.5px solid rgba(167,139,250,0.2)`,background:'rgba(255,255,255,0.04)',fontSize:13,color:C.TEXT,lineHeight:1.6,resize:'vertical',fontFamily:'inherit',outline:'none',boxSizing:'border-box',placeholder:C.MUTED}}
                />
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  <button onClick={saveJournal} disabled={!journalText.trim()} style={{flex:1,padding:'10px',borderRadius:12,border:'none',cursor:journalText.trim()?'pointer':'default',background:journalText.trim()?`linear-gradient(135deg,${C.GOLD},#FFD77A)`:'rgba(255,255,255,0.05)',color:journalText.trim()?'#78350F':C.MUTED,fontSize:12,fontWeight:700,transition:'all 0.18s'}}>Save Entry →</button>
                  <button onClick={()=>navigate('/mood')} style={{padding:'10px 16px',borderRadius:12,border:`1px solid rgba(245,184,65,0.25)`,background:'transparent',color:C.GOLD,fontSize:12,fontWeight:700,cursor:'pointer'}}>Full Journal</button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
