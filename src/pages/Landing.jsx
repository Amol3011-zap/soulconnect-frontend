import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─── Waitlist API ─────────────────────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL || 'https://soulconnect-backend-production.up.railway.app/api';

const STRUGGLES = [
  'Anxiety', 'Breakup', 'Burnout', 'Loneliness',
  'Grief', 'Stress', 'Self Growth', 'Other',
];

function WaitlistForm() {
  const P_COL = '#6D4AFF';
  const [form,    setForm]    = useState({ name:'', email:'', struggle:'' });
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | duplicate | error
  const [msg,     setMsg]     = useState('');

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('error'); setMsg('Please enter a valid email address.'); return;
    }
    setStatus('loading');
    try {
      const res = await fetch(`${API}/early-access/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name.trim() || null,
          email,
          struggle: form.struggle || null,
          source:  'Landing Page',
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setStatus('error'); setMsg('Too many attempts. Please wait a moment.'); return;
      }
      if (!res.ok) {
        setStatus('error'); setMsg(data.detail || 'Something went wrong.'); return;
      }
      if (data.success === false && data.message === 'Email already registered') {
        setStatus('duplicate'); setMsg(''); return;
      }
      setStatus('success');
    } catch {
      setStatus('error'); setMsg('Network error. Please try again.');
    }
  }, [form]);

  const F = "'Plus Jakarta Sans', Inter, sans-serif";
  const inputStyle = {
    width:'100%', padding:'13px 16px', borderRadius:12, fontSize:15,
    border:'1.5px solid #E5E7EB', outline:'none', fontFamily:F,
    background:'#fff', color:'#111827', transition:'border .18s',
  };

  if (status === 'success') {
    return (
      <div style={{
        background:'linear-gradient(135deg,rgba(109,74,255,0.08),rgba(167,139,250,0.05))',
        border:'1.5px solid rgba(109,74,255,0.25)', borderRadius:20,
        padding:'36px 32px', textAlign:'center',
      }}>
        <div style={{fontSize:52, marginBottom:12}}>💜</div>
        <h3 style={{fontSize:22, fontWeight:800, color:'#120B2E', margin:'0 0 10px', fontFamily:"'Playfair Display',Georgia,serif"}}>
          You're on the list!
        </h3>
        <p style={{fontSize:15, color:'#6B7280', lineHeight:1.7, margin:0}}>
          We'll let you know when SoulConnect launches.<br/>
          Thank you for being part of this journey. 💜
        </p>
      </div>
    );
  }

  if (status === 'duplicate') {
    return (
      <div style={{
        background:'rgba(245,184,65,0.08)', border:'1.5px solid rgba(245,184,65,0.35)',
        borderRadius:20, padding:'28px 28px', textAlign:'center',
      }}>
        <div style={{fontSize:36, marginBottom:8}}>✨</div>
        <p style={{fontSize:16, fontWeight:700, color:'#92400E', margin:'0 0 6px'}}>
          You're already on the list!
        </p>
        <p style={{fontSize:14, color:'#6B7280', margin:0}}>
          We already have your email. We'll be in touch when SoulConnect launches.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{display:'flex', flexDirection:'column', gap:14}}>
      <input
        name="name" type="text" placeholder="Your name (optional)"
        value={form.name} onChange={handleChange}
        style={inputStyle} maxLength={200}
        onFocus={e=>{e.target.style.borderColor=P_COL;}}
        onBlur={e=>{e.target.style.borderColor='#E5E7EB';}}
      />
      <input
        name="email" type="email" placeholder="Your email address *"
        value={form.email} onChange={handleChange} required
        style={inputStyle} maxLength={320}
        onFocus={e=>{e.target.style.borderColor=P_COL;}}
        onBlur={e=>{e.target.style.borderColor='#E5E7EB';}}
      />
      <select
        name="struggle" value={form.struggle} onChange={handleChange}
        style={{...inputStyle, color: form.struggle ? '#111827' : '#9CA3AF', cursor:'pointer'}}
        onFocus={e=>{e.target.style.borderColor=P_COL;}}
        onBlur={e=>{e.target.style.borderColor='#E5E7EB';}}
      >
        <option value="">What brings you here? (optional)</option>
        {STRUGGLES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {status === 'error' && (
        <p style={{margin:0, fontSize:13, color:'#DC2626', fontWeight:600}}>{msg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          background: status === 'loading' ? '#9CA3AF' : `linear-gradient(135deg,${P_COL},#8B5CF6)`,
          color:'#fff', border:'none', borderRadius:14,
          padding:'16px', fontSize:16, fontWeight:700,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontFamily: F, transition:'all .22s',
          boxShadow: status === 'loading' ? 'none' : '0 6px 24px rgba(109,74,255,0.45)',
        }}
      >
        {status === 'loading' ? 'Joining…' : 'Join the Waitlist 💜'}
      </button>
      <p style={{fontSize:11, color:'#9CA3AF', textAlign:'center', margin:0}}>
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
}

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
  { label: 'About Us',     href: '/about',   isRoute: true  },
  { label: 'How It Works', href: '#how',     isRoute: false },
  { label: 'Resources',    href: '#trust',   isRoute: false },
  { label: 'Contact',      href: '/contact', isRoute: true  },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   MODULE-SCOPE DATA ARRAYS
═══════════════════════════════════════════════════════════════════════════════ */
const STEPS = [
  {n:'1', icon:'✍️', title:'Share Your Journey',  desc:"Express what you're going through in a safe, judgment-free space."},
  {n:'2', icon:'👥', title:'Find Similar People',  desc:'We match you with people who truly understand your experience.'},
  {n:'3', icon:'🫂', title:'Join Support Circles', desc:'Enter meaningful conversations and guided support groups.'},
  {n:'4', icon:'🌱', title:'Grow Together',         desc:'Heal, learn, and transform alongside your community.'},
];

const CHALLENGES = [
  {emoji:'🧠', label:'Anxiety &\nOverthinking', glow:'rgba(124,58,237,0.18)',  border:'rgba(124,58,237,0.28)',  shadow:'0 24px 56px rgba(124,58,237,0.22)'},
  {emoji:'💔', label:'Heartbreak',               glow:'rgba(219,39,119,0.18)', border:'rgba(219,39,119,0.28)', shadow:'0 24px 56px rgba(219,39,119,0.22)'},
  {emoji:'🌧', label:'Loneliness',                glow:'rgba(37,99,235,0.18)',  border:'rgba(37,99,235,0.28)',  shadow:'0 24px 56px rgba(37,99,235,0.22)'},
  {emoji:'🕯', label:'Grief',                     glow:'rgba(217,119,6,0.2)',   border:'rgba(217,119,6,0.3)',   shadow:'0 24px 56px rgba(217,119,6,0.24)'},
  {emoji:'🔥', label:'Burnout',                   glow:'rgba(234,88,12,0.18)', border:'rgba(234,88,12,0.28)',  shadow:'0 24px 56px rgba(234,88,12,0.22)'},
  {emoji:'🌱', label:'Life\nTransitions',          glow:'rgba(5,150,105,0.18)', border:'rgba(5,150,105,0.28)',  shadow:'0 24px 56px rgba(5,150,105,0.22)'},
];

const HELPS = [
  {icon:'👥', grad:'135deg,rgba(109,74,255,0.18),rgba(167,139,250,0.12)', title:'Community\nMatching',  desc:"Find people who truly understand what you're going through."},
  {icon:'🫂', grad:'135deg,rgba(244,114,182,0.18),rgba(232,121,249,0.1)',  title:'Support\nCircles',    desc:'Join guided peer conversations and healing groups.'},
  {icon:'📝', grad:'135deg,rgba(245,184,65,0.18),rgba(252,211,77,0.1)',    title:'Healing\nJournal',    desc:'Reflect, release, and understand yourself more deeply.'},
  {icon:'📊', grad:'135deg,rgba(16,185,129,0.18),rgba(52,211,153,0.1)',    title:'Mood\nTracking',      desc:'Track your emotional journey and celebrate progress.'},
  {icon:'🎯', grad:'135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.1)',    title:'Guided\nChallenges', desc:'Build healthy habits and routines step by step.'},
  {icon:'🙏', grad:'135deg,rgba(124,58,237,0.18),rgba(109,74,255,0.1)',    title:'Wellness\nGuides',   desc:'Learn from trusted wellness frameworks and practices.'},
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HERO SVG ILLUSTRATION
═══════════════════════════════════════════════════════════════════════════════ */
function HeroIllustration() {
  const W = 800, H = 900;
  const LX = 175, RX = 625, MY = 350;
  const CX = 400, LY = 640;

  const stars = Array.from({length:60},(_,i)=>({
    x: 8+((i*131+i*i*7)%784), y: 8+((i*97+i*i*11)%390),
    r: 0.4+(i%5)*0.35, op: 0.15+(i%7)*0.07,
    dur: 1.8+(i%5)*0.7, del: i*0.17,
  }));

  const OD=[0,45,90,135,180,225,270,315];
  const MD=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const ID=[0,60,120,180,240,300];

  const pts = Array.from({length:30},(_,i)=>({
    x: 20+((i*83+i*i*13)%760), y: 60+((i*67+i*i*17)%820),
    r: 0.8+(i%5)*0.45,
    col:[LAV,GLD,PNK,'#C4B5FD','#FDE68A','#E879F9'][i%6],
    dur: 2.8+(i%5)*0.9, del: i*0.25,
  }));

  const bx1=LX+86, bx2=RX-86, bcy=MY-18;
  const beamPath = `M${bx1},${MY} C${LX+160},${bcy} ${RX-160},${bcy} ${bx2},${MY}`;
  const beamRev  = `M${bx2},${MY} C${RX-160},${bcy} ${LX+160},${bcy} ${bx1},${MY}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}}
      aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hiBg" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#020115"/>
          <stop offset="40%"  stopColor="#0A0330"/>
          <stop offset="75%"  stopColor="#160848"/>
          <stop offset="100%" stopColor="#070122"/>
        </linearGradient>
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
        <radialGradient id="hiNex" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="8%"   stopColor="#FEF9C3"/>
          <stop offset="28%"  stopColor={GLD} stopOpacity="0.85"/>
          <stop offset="55%"  stopColor={LAV} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={P}   stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="hiBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={LAV} stopOpacity="0.05"/>
          <stop offset="22%"  stopColor={LAV} stopOpacity="0.72"/>
          <stop offset="50%"  stopColor="#FFFFFF" stopOpacity="1"/>
          <stop offset="78%"  stopColor={LAV} stopOpacity="0.72"/>
          <stop offset="100%" stopColor={LAV} stopOpacity="0.05"/>
        </linearGradient>
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

      {/* COSMIC BACKGROUND */}
      <rect x="0" y="0" width={W} height={H} fill="url(#hiBg)"/>

      {/* Nebula */}
      <ellipse cx="160" cy="240" rx="220" ry="170" fill="rgba(109,74,255,0.06)" filter="url(#hiXGlow)"/>
      <ellipse cx="650" cy="270" rx="190" ry="150" fill="rgba(139,92,246,0.05)" filter="url(#hiXGlow)"/>
      <ellipse cx="400" cy="500" rx="200" ry="160" fill="rgba(245,184,65,0.025)" filter="url(#hiXGlow)"/>

      {/* Stars */}
      {stars.map((s,i)=>(
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.op}>
          <animate attributeName="opacity"
            values={`${s.op};${Math.min(s.op*3,0.95)};${s.op}`}
            dur={`${s.dur}s`} begin={`${s.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}

      {/* Sacred geometry */}
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

      {/* LEFT SOUL ORB */}
      <circle cx={LX} cy={MY} r={168} fill="url(#hiLAura)" filter="url(#hiXGlow)"/>
      <g filter="url(#hiMGlow)">
        <circle cx={LX} cy={MY} r={90} fill="url(#hiLOrb)">
          <animateTransform attributeName="transform" type="translate"
            values="0 0;0 -7;0 0" dur="4.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx={LX-26} cy={MY-30} r={20} fill="rgba(255,255,255,0.15)" filter="url(#hiSGlow)"/>
        <circle cx={LX+18} cy={MY+24} r={8}  fill="rgba(255,255,255,0.07)"/>
      </g>
      <ellipse cx={LX} cy={MY} rx={112} ry={28}
        stroke={LAV} strokeWidth="0.8" fill="none" opacity="0.28"
        transform={`rotate(-28,${LX},${MY})`}>
        <animateTransform attributeName="transform" type="rotate"
          from={`-28 ${LX} ${MY}`} to={`332 ${LX} ${MY}`}
          dur="18s" repeatCount="indefinite"/>
      </ellipse>

      {/* RIGHT SOUL ORB */}
      <circle cx={RX} cy={MY} r={168} fill="url(#hiRAura)" filter="url(#hiXGlow)"/>
      <g filter="url(#hiMGlow)">
        <circle cx={RX} cy={MY} r={90} fill="url(#hiROrb)">
          <animateTransform attributeName="transform" type="translate"
            values="0 -7;0 0;0 -7" dur="5.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={RX-22} cy={MY-28} r={18} fill="rgba(255,255,255,0.13)" filter="url(#hiSGlow)"/>
        <circle cx={RX+16} cy={MY+22} r={7}  fill="rgba(255,255,255,0.06)"/>
      </g>
      <ellipse cx={RX} cy={MY} rx={112} ry={28}
        stroke={LAV} strokeWidth="0.8" fill="none" opacity="0.22"
        transform={`rotate(20,${RX},${MY})`}>
        <animateTransform attributeName="transform" type="rotate"
          from={`20 ${RX} ${MY}`} to={`-340 ${RX} ${MY}`}
          dur="22s" repeatCount="indefinite"/>
      </ellipse>

      {/* ENERGY BEAM */}
      <path d={beamPath} stroke="url(#hiBeam)" strokeWidth="2.5" fill="none"
        filter="url(#hiBGlow)" opacity="0.6">
        <animate attributeName="opacity" values="0.35;0.85;0.35" dur="2.8s" repeatCount="indefinite"/>
      </path>
      <path d={beamPath} stroke={LAV} strokeWidth="0.8" fill="none" opacity="0.35"/>

      {/* Beam particles */}
      <circle r="4" fill="#fff" filter="url(#hiSGlow)" opacity="0.92">
        <animateMotion dur="2.4s" repeatCount="indefinite" path={beamPath}/>
      </circle>
      <circle r="2.5" fill={GLD} filter="url(#hiSGlow)" opacity="0.8">
        <animateMotion dur="3.1s" repeatCount="indefinite" begin="0.8s" path={beamRev}/>
      </circle>
      <circle r="3" fill={PNK} filter="url(#hiSGlow)" opacity="0.75">
        <animateMotion dur="2.7s" repeatCount="indefinite" begin="1.4s" path={beamPath}/>
      </circle>

      {/* CENTER NEXUS */}
      <circle cx={CX} cy={MY} r={54} fill="url(#hiNex)" filter="url(#hiLGlow)" opacity="0.9">
        <animate attributeName="r" values="50;58;50" dur="2.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx={CX} cy={MY} r={26} fill="url(#hiNex)" filter="url(#hiMGlow)"/>
      <circle cx={CX} cy={MY} r={10} fill="#fff" opacity="0.95" filter="url(#hiSGlow)">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
      </circle>

      {/* LOTUS */}
      <g transform={`translate(${CX},${LY})`}>
        {/* Radial glow lines */}
        {Array.from({length:8},(_,i)=>{
          const a=i*Math.PI/4;
          return <line key={i} x1="0" y1="0"
            x2={Math.sin(a)*88} y2={-Math.cos(a)*88}
            stroke="url(#hiVLine)" strokeWidth="0.7" opacity="0.4"/>;
        })}
        {/* Outer petals */}
        {OD.map((deg,i)=>{
          const r=deg*Math.PI/180;
          const px=Math.sin(r)*54, py=-Math.cos(r)*54;
          const cx1=px*0.45+Math.cos(r)*28, cy1=py*0.45+Math.sin(r)*28;
          const cx2=px*0.45-Math.cos(r)*28, cy2=py*0.45-Math.sin(r)*28;
          return <path key={i}
            d={`M0,0 Q${cx1},${cy1} ${px},${py} Q${cx2},${cy2} 0,0 Z`}
            fill="url(#hiLP)" opacity="0.55" filter="url(#hiSGlow)"/>;
        })}
        {/* Middle petals */}
        {MD.map((deg,i)=>{
          const r=deg*Math.PI/180;
          const px=Math.sin(r)*38, py=-Math.cos(r)*38;
          const cx1=px*0.45+Math.cos(r)*18, cy1=py*0.45+Math.sin(r)*18;
          const cx2=px*0.45-Math.cos(r)*18, cy2=py*0.45-Math.sin(r)*18;
          return <path key={i}
            d={`M0,0 Q${cx1},${cy1} ${px},${py} Q${cx2},${cy2} 0,0 Z`}
            fill="url(#hiLP)" opacity="0.8"/>;
        })}
        {/* Inner petals */}
        {ID.map((deg,i)=>{
          const r=deg*Math.PI/180;
          const px=Math.sin(r)*23, py=-Math.cos(r)*23;
          const cx1=px*0.45+Math.cos(r)*11, cy1=py*0.45+Math.sin(r)*11;
          const cx2=px*0.45-Math.cos(r)*11, cy2=py*0.45-Math.sin(r)*11;
          return <path key={i}
            d={`M0,0 Q${cx1},${cy1} ${px},${py} Q${cx2},${cy2} 0,0 Z`}
            fill="url(#hiLC)" opacity="0.95"/>;
        })}
        {/* Center jewel */}
        <circle cx="0" cy="0" r="10" fill="url(#hiLC)" filter="url(#hiSGlow)">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Vertical connection line lotus→nexus */}
      <line x1={CX} y1={MY+90} x2={CX} y2={LY-60}
        stroke="url(#hiVLine)" strokeWidth="1" opacity="0.35"/>

      {/* FLOATING PARTICLES */}
      {pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.65"
          filter="url(#hiSGlow)">
          <animate attributeName="cy"
            values={`${p.y};${p.y-14};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity"
            values="0.25;0.75;0.25"
            dur={`${p.dur*1.3}s`} begin={`${p.del*0.5}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener('scroll',fn,{passive:true});
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  const F2 = "'Playfair Display', Georgia, serif";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');

    html, body, #root { width:100%; max-width:100%; overflow-x:hidden; }
    * { box-sizing:border-box; }
    img { max-width:100%; height:auto; display:block; }

    @keyframes glowBreathe {
      0%,100% { box-shadow:0 6px 24px rgba(109,74,255,0.45); }
      50%      { box-shadow:0 8px 36px rgba(109,74,255,0.8), 0 0 0 6px rgba(109,74,255,0.08); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes orbitSlow {
      to { transform:rotate(360deg); }
    }
    @keyframes particleDrift {
      0%,100% { transform:translateY(0) scale(1); opacity:.6; }
      50%      { transform:translateY(-18px) scale(1.08); opacity:1; }
    }
    @keyframes finalFloat {
      0%,100% { transform:translateY(0); }
      50%      { transform:translateY(-10px); }
    }

    /* Nav */
    .l-nav-a {
      color:rgba(255,255,255,0.72); font-size:14px; font-weight:500;
      text-decoration:none; padding:8px 14px; border-radius:8px;
      transition:all .18s; white-space:nowrap;
    }
    .l-nav-a:hover { color:#fff; background:rgba(255,255,255,0.08); }

    /* Buttons */
    .l-btn-p {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,${P},#8B5CF6);
      color:#fff; border:none; border-radius:14px;
      padding:18px 38px; font-size:17px; font-weight:700;
      cursor:pointer; text-decoration:none; transition:all .25s;
      box-shadow:0 6px 24px rgba(109,74,255,0.5);
      font-family:"Plus Jakarta Sans",Inter,sans-serif;
    }
    .l-btn-p:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(109,74,255,0.7); }
    .l-btn-g {
      display:inline-flex; align-items:center; gap:8px;
      background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.85);
      border:1.5px solid rgba(255,255,255,0.2); border-radius:14px;
      padding:18px 38px; font-size:17px; font-weight:600;
      cursor:pointer; text-decoration:none; transition:all .25s;
      font-family:"Plus Jakarta Sans",Inter,sans-serif;
    }
    .l-btn-g:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.42); transform:translateY(-2px); }

    /* Trust badge */
    .l-trust-badge {
      display:inline-flex; align-items:center; gap:0;
      background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
      border-radius:99px; padding:10px 22px;
      font-size:12px; font-weight:600; color:rgba(255,255,255,0.72);
    }
    .l-trust-badge-sep { color:rgba(255,255,255,0.2); margin:0 14px; user-select:none; }

    /* Section padding */
    .l-section-pad { padding:clamp(56px,8vw,120px) clamp(20px,3vw,32px); }

    /* Hero */
    .l-hero-grid {
      display:grid; grid-template-columns:1fr 1fr;
      gap:0; min-height:clamp(580px,85svh,850px);
      align-items:center; max-width:1440px; margin:0 auto;
      padding:0 clamp(20px,3vw,32px);
    }
    .l-hero-text {
      display:flex; flex-direction:column; align-items:flex-start;
      padding:130px clamp(0px,3vw,48px) 100px 0;
      z-index:2; position:relative;
    }
    .l-hero-illus {
      height:clamp(580px,85svh,850px); max-height:clamp(580px,85svh,850px);
      position:relative; overflow:hidden;
    }
    .l-hero-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
    .l-hero-btns  { display:flex; gap:14px; flex-wrap:wrap; margin-top:8px; }

    /* Struggle cards */
    .l-struggle-grid {
      display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px;
    }
    .l-struggle-card {
      background:#fff; border-radius:20px; padding:28px 20px;
      text-align:center; cursor:pointer; transition:all .28s;
      box-shadow:0 2px 12px rgba(109,74,255,0.06);
      border:1.5px solid transparent; min-height:140px;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
    }
    .l-struggle-card:hover { transform:translateY(-6px); }

    /* Help cards */
    .l-help-grid {
      display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px;
    }
    .l-help-card {
      border-radius:20px; padding:28px 22px; min-height:160px;
      display:flex; flex-direction:column; gap:14px;
      transition:all .28s; cursor:default;
      background:rgba(255,255,255,0.6); backdrop-filter:blur(12px);
      border:1px solid rgba(109,74,255,0.12);
    }
    .l-help-card:hover { transform:translateY(-5px); box-shadow:0 18px 44px rgba(109,74,255,0.12); }

    /* Timeline */
    .l-timeline-row {
      display:flex; gap:0; align-items:flex-start; position:relative;
    }
    .l-timeline-step {
      flex:1; text-align:center; padding:0 20px; position:relative;
    }
    .l-timeline-line {
      position:absolute; top:32px; left:50%; right:-50%;
      height:2px; background:linear-gradient(90deg,${P},rgba(109,74,255,0.1));
      z-index:0;
    }

    /* Vision */
    .l-vision-inner { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
    .l-lotus-col { display:flex; align-items:center; justify-content:center; }
    .l-vision-feats { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .l-vision-feat {
      background:rgba(109,74,255,0.06); border:1px solid rgba(109,74,255,0.14);
      border-radius:16px; padding:22px 18px; transition:all .25s;
    }
    .l-vision-feat:hover { background:rgba(109,74,255,0.1); transform:translateY(-3px); }

    /* Early */
    .l-early-inner { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
    .l-early-right { display:flex; flex-direction:column; gap:16px; }

    /* Trust row */
    .l-trust-row {
      display:flex; align-items:center; justify-content:space-between;
      flex-wrap:wrap; gap:20px;
      background:rgba(109,74,255,0.07); border:1px solid rgba(109,74,255,0.15);
      border-radius:20px; padding:24px 32px;
    }

    /* Final CTA */
    .l-cta-inner {
      display:flex; align-items:center; justify-content:space-between;
      gap:40px; flex-wrap:wrap;
    }
    .l-cta-btns { display:flex; flex-direction:column; gap:12px; align-items:flex-start; }
    .l-final-btns { display:flex; gap:16px; flex-wrap:wrap; justify-content:center; }

    /* Footer */
    .l-ft-link {
      display:block; color:rgba(255,255,255,0.5); font-size:14px;
      text-decoration:none; transition:all .18s; margin-bottom:10px;
    }
    .l-ft-link:hover { color:${LAV}; transform:translateX(2px); }

    /* ── Tablet (≤1100px) ── */
    @media(max-width:1100px){
      .l-hero-grid{grid-template-columns:1fr!important;min-height:auto!important;}
      .l-hero-illus{height:460px!important;order:2;}
      .l-hero-text{text-align:center;align-items:center!important;padding:80px 24px 40px!important;}
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
      .l-ft-bottom{flex-direction:column!important;align-items:center!important;gap:16px!important;}
      .l-ft-nav{flex-wrap:wrap!important;justify-content:center!important;}
    }

    /* ── Mobile (≤768px) ── */
    @media(max-width:768px){
      *{box-sizing:border-box!important;}
      .l-hero-grid{grid-template-columns:1fr!important;min-height:auto!important;padding:0 20px!important;}
      .l-hero-text{order:1;padding:96px 0 24px!important;text-align:center;align-items:center!important;}
      .l-hero-illus{order:2;height:260px!important;max-height:260px!important;width:100%!important;overflow:hidden!important;animation:none!important;}
      .l-hero-illus svg{width:100%!important;height:260px!important;max-width:100%!important;}
      .l-hero-btns{flex-direction:column!important;width:100%!important;align-items:stretch!important;gap:12px!important;}
      .l-btn-p,.l-btn-g{width:100%!important;max-width:100%!important;justify-content:center!important;padding:16px 20px!important;font-size:16px!important;border-radius:14px!important;}
      .l-section-pad{padding:56px 20px!important;}
      .l-struggle-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important;}
      .l-help-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important;}
      .l-struggle-card{min-height:auto!important;padding:24px 16px!important;}
      .l-help-card{min-height:auto!important;padding:24px 18px!important;}
      .l-timeline-row{flex-direction:column!important;gap:20px!important;align-items:center!important;}
      .l-timeline-line{display:none!important;}
      .l-vision-inner{grid-template-columns:1fr!important;}
      .l-lotus-col{display:none!important;}
      .l-vision-feats{grid-template-columns:1fr 1fr!important;gap:10px!important;}
      .l-vision-feat{padding:18px 14px!important;}
      .l-early-inner{grid-template-columns:1fr!important;}
      .l-early-right{display:none!important;}
      .l-trust-row{flex-direction:column!important;align-items:flex-start!important;gap:14px!important;padding:20px!important;}
      .l-ft-top{flex-direction:column!important;text-align:center!important;gap:24px!important;padding:32px 0 24px!important;}
      .l-ft-top > *:last-child{text-align:center!important;}
      .l-ft-bottom{flex-direction:column!important;align-items:center!important;gap:14px!important;}
      .l-ft-nav{flex-wrap:wrap!important;justify-content:center!important;gap:0!important;}
    }

    /* ── Small Mobile (≤480px) ── */
    @media(max-width:480px){
      .l-hero-illus{height:220px!important;max-height:220px!important;}
      .l-hero-illus svg{height:220px!important;}
      .l-hero-text{padding-top:88px!important;}
      .l-struggle-grid{grid-template-columns:1fr!important;}
      .l-help-grid{grid-template-columns:1fr!important;}
      .l-vision-feats{grid-template-columns:1fr!important;}
      .l-timeline-step{width:100%!important;max-width:320px!important;}
      .l-final-btns{flex-direction:column!important;align-items:stretch!important;gap:12px!important;}
      .l-final-btns a{width:100%!important;justify-content:center!important;}
      .l-trust-badge{padding:8px 14px!important;}
      .l-trust-badge-label{display:none!important;}
      .l-trust-badge-sep{display:none!important;}
      .l-logo-img{height:36px!important;}
    }

    /* ── Extra Small (≤375px — iPhone SE) ── */
    @media(max-width:375px){
      .l-hero-illus{height:180px!important;max-height:180px!important;}
      .l-hero-illus svg{height:180px!important;}
      .l-btn-p,.l-btn-g{font-size:15px!important;padding:14px 16px!important;}
    }
  `;

  const F = "'Plus Jakarta Sans', Inter, sans-serif";

  const quotes = [
    {q:'"I finally feel understood. This community gets me."',      a:'Early member'},
    {q:'"The healing challenges keep me consistent every day."',    a:'Founding member'},
    {q:'"Real people. Real support. This is what I needed."',       a:'Beta user'},
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
        display:'flex', alignItems:'center', width:'100%',
      }}>
        <div style={{maxWidth:1440, margin:'0 auto', width:'100%',
          padding:'0 clamp(20px,3vw,32px)', display:'flex', alignItems:'center'}}>

          <Link to="/" style={{display:'flex', alignItems:'center', gap:10,
            textDecoration:'none', flexShrink:0, marginRight:36}}>
            <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
              className="l-logo-img"
              style={{height:44, width:'auto', display:'block',
                filter:'drop-shadow(0 4px 14px rgba(109,74,255,0.5))'}}/>
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

          <div className="l-desktop-nav" style={{display:'flex', alignItems:'center',
            gap:2, flex:1, justifyContent:'center'}}>
            {NAV_LINKS.map(l=>(
              l.isRoute
                ? <Link key={l.label} to={l.href} className="l-nav-a">{l.label}</Link>
                : <a key={l.label} href={l.href} className="l-nav-a">{l.label}</a>
            ))}
          </div>

          <div className="l-desktop-btns" style={{display:'flex', alignItems:'center',
            gap:10, marginLeft:'auto'}}>
            <a href="#early" className="l-btn-p"
              style={{padding:'10px 24px', fontSize:14, borderRadius:11,
                animation:'glowBreathe 5s ease-in-out infinite'}}>
              Find My Circle 💜
            </a>
          </div>

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
      {menuOpen && (
        <div
          style={{
            position:'fixed', top:72, left:0, right:0, zIndex:399,
            background:'rgba(8,2,28,0.98)', backdropFilter:'blur(24px)',
            borderBottom:'1px solid rgba(109,74,255,0.18)',
            padding:'20px clamp(20px,3vw,32px) 28px',
            display:'flex', flexDirection:'column', gap:4,
          }}>
          {NAV_LINKS.map(l=>(
            l.isRoute
              ? <Link key={l.label} to={l.href}
                  onClick={()=>setMenuOpen(false)}
                  style={{color:'rgba(255,255,255,0.85)', textDecoration:'none',
                    padding:'12px 16px', borderRadius:10, fontSize:15, fontWeight:600,
                    display:'block', transition:'all .18s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(109,74,255,0.15)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >{l.label}</Link>
              : <a key={l.label} href={l.href}
                  onClick={()=>setMenuOpen(false)}
                  style={{color:'rgba(255,255,255,0.85)', textDecoration:'none',
                    padding:'12px 16px', borderRadius:10, fontSize:15, fontWeight:600,
                    display:'block', transition:'all .18s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(109,74,255,0.15)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >{l.label}</a>
          ))}
          <a href="#early" onClick={()=>setMenuOpen(false)}
            style={{
              marginTop:8, background:`linear-gradient(135deg,${P},#8B5CF6)`,
              color:'#fff', borderRadius:99, padding:'14px 20px',
              fontSize:15, fontWeight:700, textAlign:'center',
              textDecoration:'none', display:'block',
              boxShadow:'0 4px 18px rgba(109,74,255,0.4)',
            }}>
            Find My Circle 💜
          </a>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background:'linear-gradient(135deg,#08021C 0%,#0E0535 50%,#12063F 100%)',
        position:'relative', overflow:'hidden',
      }}>
        <div className="l-hero-grid">
          {/* Text */}
          <div className="l-hero-text">
            {/* Early access badge */}
            <div className="l-hero-pills">
              <span style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(109,74,255,0.14)',
                border:'1px solid rgba(109,74,255,0.35)',
                borderRadius:99, padding:'8px 18px',
                fontSize:13, fontWeight:700, color:LAV,
                letterSpacing:'.06em', animation:'glowBreathe 4s ease-in-out infinite',
              }}>
                💜 &nbsp;Early Access — Join Free
              </span>
            </div>

            <h1 style={{
              fontFamily:F2, fontSize:'clamp(42px,5.5vw,72px)',
              fontWeight:900, color:'#fff', lineHeight:1.1,
              margin:'0 0 22px', letterSpacing:'-0.02em',
            }}>
              You Are Not Alone.<br/>
              <span style={{
                background:`linear-gradient(135deg,${LAV},${PNK})`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>
                Find Your Circle.
              </span>
            </h1>

            <p style={{
              fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(255,255,255,0.65)',
              lineHeight:1.75, margin:'0 0 34px', maxWidth:500,
            }}>
              Connect with people facing the same challenges. Share your journey, complete healing challenges together, and grow through real human connection.
            </p>

            <div className="l-hero-btns">
              <a href="#early" className="l-btn-p">Find My Circle 💜</a>
              <a href="#how"   className="l-btn-g">How It Works →</a>
            </div>

            {/* Trust badge */}
            <div style={{marginTop:36}}>
              <div className="l-trust-badge">
                <span style={{marginRight:8}}>🔒</span>
                <span className="l-trust-badge-label">Safe &amp; Private</span>
                <span className="l-trust-badge-sep">·</span>
                <span className="l-trust-badge-label">Real Peer Support</span>
                <span className="l-trust-badge-sep">·</span>
                <span className="l-trust-badge-label">Not Therapy</span>
              </div>
            </div>

            <p style={{
              marginTop:20, fontSize:11, color:'rgba(255,255,255,0.28)',
              lineHeight:1.6, maxWidth:440,
            }}>
              Peer support platform. Not a substitute for professional medical or psychiatric care. In crisis? Call 112 / 911 / 999.
            </p>
          </div>

          {/* Illustration */}
          <div className="l-hero-illus">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT ARE YOU STRUGGLING WITH
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="l-section-pad" style={{background:'#F8F5FF'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:48}}>
            <p style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(109,74,255,0.08)', border:'1px solid rgba(109,74,255,0.2)',
              borderRadius:99, padding:'6px 18px', fontSize:12, fontWeight:700,
              color:P, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:18,
            }}>🤝 Your Journey</p>
            <h2 style={{
              fontFamily:F2, fontSize:'clamp(28px,4vw,44px)',
              fontWeight:800, color:DARK, margin:'0 0 14px',
            }}>
              What Are You Going Through?
            </h2>
            <p style={{fontSize:16, color:'#6B7280', lineHeight:1.7, maxWidth:540, margin:'0 auto'}}>
              Whatever challenge you're facing, there's a circle of people who truly understand. You're not alone in this.
            </p>
          </div>

          <div className="l-struggle-grid">
            {CHALLENGES.map(({ emoji, label, glow, border, shadow }) => (
              <Link key={label} to="/signup" className="l-struggle-card" style={{ textDecoration: 'none' }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background=glow;
                  e.currentTarget.style.borderColor=border;
                  e.currentTarget.style.boxShadow=shadow;
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background='#fff';
                  e.currentTarget.style.borderColor='transparent';
                  e.currentTarget.style.boxShadow='0 2px 12px rgba(109,74,255,0.06)';
                }}>
                <span style={{fontSize:40}}>{emoji}</span>
                <span style={{
                  fontSize:14, fontWeight:700, color:DARK,
                  whiteSpace:'pre-line', textAlign:'center', lineHeight:1.4,
                }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW SOULCONNECT HELPS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="l-section-pad"
        style={{background:'linear-gradient(180deg,#0E0535 0%,#120B2E 100%)'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:52}}>
            <p style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)',
              borderRadius:99, padding:'6px 18px', fontSize:12, fontWeight:700,
              color:LAV, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:18,
            }}>✨ Features</p>
            <h2 style={{
              fontFamily:F2, fontSize:'clamp(28px,4vw,44px)',
              fontWeight:800, color:'#fff', margin:'0 0 14px',
            }}>
              How SoulConnect Helps
            </h2>
            <p style={{fontSize:16, color:'rgba(255,255,255,0.55)', lineHeight:1.7,
              maxWidth:540, margin:'0 auto'}}>
              Everything you need to heal, grow, and connect — in one thoughtful platform.
            </p>
          </div>

          <div className="l-help-grid">
            {HELPS.map(({icon,grad,title,desc})=>(
              <div key={title} className="l-help-card"
                style={{background:`linear-gradient(${grad})`}}>
                <span style={{fontSize:32}}>{icon}</span>
                <div>
                  <div style={{
                    fontSize:16, fontWeight:800, color:'#fff',
                    whiteSpace:'pre-line', marginBottom:8, lineHeight:1.3,
                  }}>{title}</div>
                  <div style={{fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.65}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="l-section-pad" id="how"
        style={{background:'#F8F5FF'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:56}}>
            <p style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(109,74,255,0.08)', border:'1px solid rgba(109,74,255,0.2)',
              borderRadius:99, padding:'6px 18px', fontSize:12, fontWeight:700,
              color:P, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:18,
            }}>🗺️ Your Path</p>
            <h2 style={{
              fontFamily:F2, fontSize:'clamp(28px,4vw,44px)',
              fontWeight:800, color:DARK, margin:'0 0 14px',
            }}>
              How It Works
            </h2>
            <p style={{fontSize:16, color:'#6B7280', lineHeight:1.7, maxWidth:480, margin:'0 auto'}}>
              Four simple steps from where you are now to where you want to be.
            </p>
          </div>

          <div className="l-timeline-row">
            {STEPS.map(({n,icon,title,desc},idx)=>(
              <div key={n} className="l-timeline-step">
                {idx < STEPS.length-1 && (
                  <div className="l-timeline-line" />
                )}
                {/* Step icon circle */}
                <div
                  style={{
                    width:64, height:64, borderRadius:'50%', margin:'0 auto 20px',
                    background:`linear-gradient(135deg,${P},#8B5CF6)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:24, position:'relative', zIndex:1,
                    boxShadow:`0 8px 28px rgba(109,74,255,0.4)`,
                  }}
                >{icon}</div>
                <div>
                  <div style={{
                    fontSize:11, fontWeight:800, letterSpacing:'.1em',
                    textTransform:'uppercase', color:P, marginBottom:8, opacity:.8,
                  }}>Step {n}</div>
                  <h3 style={{fontSize:17, fontWeight:800, color:DARK, margin:'0 0 10px'}}>{title}</h3>
                  <p style={{fontSize:13, color:'#6B7280', lineHeight:1.65, margin:0}}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VISION / FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="l-section-pad"
        style={{background:'linear-gradient(135deg,#0A021A 0%,#120B2E 100%)'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div className="l-vision-inner">
            {/* Lotus / decorative side */}
            <div className="l-lotus-col">
              <div style={{
                width:340, height:340, borderRadius:'50%',
                background:'radial-gradient(circle,rgba(109,74,255,0.25) 0%,rgba(109,74,255,0.04) 60%,transparent 80%)',
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative',
                boxShadow:'0 0 120px rgba(109,74,255,0.2)',
              }}>
                {/* Orbit ring */}
                <div style={{
                  position:'absolute', width:300, height:300, borderRadius:'50%',
                  border:`1px dashed rgba(167,139,250,0.25)`,
                  animation:'orbitSlow 20s linear infinite',
                }}/>
                <div style={{
                  position:'absolute', width:200, height:200, borderRadius:'50%',
                  border:`1px dashed rgba(245,184,65,0.2)`,
                  animation:'orbitSlow 14s linear infinite reverse',
                }}/>
                <span style={{fontSize:80, filter:'drop-shadow(0 0 30px rgba(109,74,255,0.7))'}}>🪷</span>
              </div>
            </div>

            {/* Feature list */}
            <div>
              <p style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)',
                borderRadius:99, padding:'6px 18px', fontSize:12, fontWeight:700,
                color:LAV, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:20,
              }}>🔮 Our Vision</p>
              <h2 style={{
                fontFamily:F2, fontSize:'clamp(26px,3.5vw,40px)',
                fontWeight:800, color:'#fff', margin:'0 0 14px', lineHeight:1.2,
              }}>
                Built for Real<br/>Human Healing
              </h2>
              <p style={{
                fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.75,
                margin:'0 0 36px', maxWidth:460,
              }}>
                SoulConnect brings together the best of community support, structured healing challenges, and expert guidance — in one safe space.
              </p>
              <div className="l-vision-feats">
                {[
                  {icon:'🔒', title:'Privacy First',     desc:'Your journey stays private. No judgment, no exposure.'},
                  {icon:'🤝', title:'Real Connections',  desc:'Matched with people who genuinely understand you.'},
                  {icon:'📈', title:'Track Progress',    desc:'See yourself grow through every challenge completed.'},
                  {icon:'🌍', title:'Global Community',  desc:'Thousands of people healing together worldwide.'},
                  {icon:'💜', title:'Peer Support',      desc:'Human-to-human. Not bots. Real care from real people.'},
                  {icon:'🎯', title:'Guided Challenges', desc:'Structured healing paths with daily micro-actions.'},
                ].map(({icon,title,desc})=>(
                  <div key={title} className="l-vision-feat">
                    <span style={{fontSize:22, marginBottom:8, display:'block'}}>{icon}</span>
                    <div style={{fontSize:14, fontWeight:700, color:'#fff', marginBottom:4}}>{title}</div>
                    <div style={{fontSize:12, color:'rgba(255,255,255,0.48)', lineHeight:1.6}}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BUILDING WITH EARLY COMMUNITY
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="l-section-pad" id="early" style={{background:'#F8F5FF'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div className="l-early-inner">
            <div>
              <p style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(109,74,255,0.08)', border:'1px solid rgba(109,74,255,0.2)',
                borderRadius:99, padding:'6px 18px', fontSize:12, fontWeight:700,
                color:P, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:20,
              }}>🌱 Early Access</p>
              <h2 style={{
                fontFamily:F2, fontSize:'clamp(26px,3.5vw,42px)',
                fontWeight:800, color:DARK, margin:'0 0 16px', lineHeight:1.2,
              }}>
                Building With Early<br/>Community Members
              </h2>
              <p style={{
                fontSize:16, color:'#6B7280', lineHeight:1.75, margin:'0 0 32px', maxWidth:460,
              }}>
                SoulConnect is in early access. We're building this platform together with our founding community — people like you who believe in the power of real human connection to heal.
              </p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:36}}>
                {[
                  {icon:'💜', text:'Free during early access'},
                  {icon:'🔒', text:'Private & confidential'},
                  {icon:'🌱', text:'Shape the platform'},
                  {icon:'🎖️', text:'Founding member badge'},
                ].map(({icon,text})=>(
                  <div key={text} style={{
                    display:'flex', alignItems:'center', gap:12,
                    background:'rgba(109,74,255,0.06)',
                    border:'1px solid rgba(109,74,255,0.14)',
                    borderRadius:12, padding:'14px 18px',
                    fontSize:14, fontWeight:600, color:DARK,
                  }}>
                    <span style={{fontSize:20}}>{icon}</span>{text}
                  </div>
                ))}
              </div>
              {/* Waitlist form */}
              <div style={{
                background:'#fff', borderRadius:20, padding:'28px 28px',
                boxShadow:'0 4px 24px rgba(109,74,255,0.10)',
                border:'1px solid rgba(109,74,255,0.12)',
              }}>
                <p style={{fontSize:15, fontWeight:700, color:DARK, margin:'0 0 16px'}}>
                  Reserve your spot — it's free 💜
                </p>
                <WaitlistForm />
              </div>
            </div>

            <div className="l-early-right">
              {quotes.map(({q,a},i)=>(
                <div key={i} style={{
                  background:'#fff', borderRadius:20, padding:'24px 28px',
                  boxShadow:'0 4px 20px rgba(109,74,255,0.08)',
                  border:'1px solid rgba(109,74,255,0.1)',
                }}>
                  <p style={{
                    fontSize:15, color:'#374151', fontStyle:'italic',
                    lineHeight:1.7, margin:'0 0 14px',
                  }}>{q}</p>
                  <p style={{fontSize:12, fontWeight:700, color:P, margin:0}}>— {a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUST / SAFETY STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="trust" className="l-section-pad"
        style={{background:'linear-gradient(135deg,#0A021A,#120B2E)'}}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div className="l-trust-row">
            {[
              {icon:'🔒', title:'Your Privacy Matters',       desc:'We never sell your data. Your story stays yours.'},
              {icon:'🛡️', title:'Safe Community',              desc:'Clear community rules and active moderation.'},
              {icon:'⚕️', title:'Peer Support — Not Therapy', desc:'A complement to professional care, not a replacement.'},
              {icon:'🆘', title:'Crisis Resources',            desc:<>If you need immediate help, <Link to="/crisis-support" style={{color:LAV}}>view crisis resources</Link>.</>},
            ].map(({icon,title,desc})=>(
              <div key={title} style={{flex:1, minWidth:200}}>
                <div style={{fontSize:28, marginBottom:10}}>{icon}</div>
                <div style={{fontSize:14, fontWeight:700, color:'#fff', marginBottom:6}}>{title}</div>
                <div style={{fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.65}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA — FIND YOUR CIRCLE
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        background:'linear-gradient(160deg,#140028 0%,#24004A 50%,#3B0F72 100%)',
        padding:'clamp(80px,10vw,130px) clamp(20px,3vw,32px)',
        position:'relative', overflow:'hidden', textAlign:'center',
      }}>
        {/* Radial glow */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(109,74,255,0.28) 0%,transparent 70%)',
        }}/>
        {/* Floating particles decoration */}
        {[
          {top:'15%',left:'8%',size:6,col:LAV,dur:'3.8s'},
          {top:'75%',left:'12%',size:4,col:GLD,dur:'4.5s'},
          {top:'20%',right:'10%',size:5,col:PNK,dur:'3.2s'},
          {top:'65%',right:'8%',size:7,col:LAV,dur:'5.1s'},
          {top:'45%',left:'5%',size:3,col:GLD,dur:'2.9s'},
          {top:'50%',right:'5%',size:4,col:PNK,dur:'4.0s'},
        ].map((p,i)=>(
          <div key={i} style={{
            position:'absolute', width:p.size, height:p.size,
            borderRadius:'50%', background:p.col,
            top:p.top, left:p.left, right:p.right,
            opacity:.5, animation:`finalFloat ${p.dur} ease-in-out infinite`,
            animationDelay:`${i*0.5}s`,
          }}/>
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:99, padding:'8px 20px', fontSize:12, fontWeight:700,
            color:'rgba(255,255,255,0.85)', letterSpacing:'.1em', textTransform:'uppercase',
            marginBottom:28,
          }}>
            💜 Early Access — Free to Join
          </div>

          <h2 style={{
            fontFamily:F2, fontSize:'clamp(42px,6vw,72px)',
            fontWeight:900, color:'#fff', lineHeight:1.08,
            margin:'0 0 20px', letterSpacing:'-0.02em',
          }}>
            Find Your Circle.
          </h2>

          <p style={{
            fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.62)',
            lineHeight:1.75, margin:'0 auto 44px', maxWidth:520,
          }}>
            Join people healing through connection. Share your journey, find those who truly understand, and grow together — one day at a time.
          </p>

          <div className="l-final-btns">
            <a href="#early"
              style={{
                background:'#fff', color:'#120B2E',
                borderRadius:99, padding:'18px 40px',
                fontSize:17, fontWeight:800,
                textDecoration:'none', display:'inline-flex',
                alignItems:'center', gap:8, transition:'all .25s',
                boxShadow:'0 10px 36px rgba(0,0,0,0.35)',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 18px 52px rgba(0,0,0,0.5)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 10px 36px rgba(0,0,0,0.35)';}}
            >
              Get Started — It's Free 💜
            </a>
            <Link to="/about"
              style={{
                background:'transparent', color:'rgba(255,255,255,0.82)',
                border:'1.5px solid rgba(255,255,255,0.28)', borderRadius:99,
                padding:'18px 36px', fontSize:17, fontWeight:600,
                textDecoration:'none', display:'inline-flex',
                alignItems:'center', gap:8, transition:'all .25s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.6)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.28)';e.currentTarget.style.color='rgba(255,255,255,0.82)';}}
            >
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background:'#050110',
        borderTop:'1px solid rgba(109,74,255,0.12)',
        padding:'clamp(48px,6vw,80px) clamp(20px,3vw,32px) 0',
        width:'100%',
      }}>
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          {/* Top grid */}
          <div className="l-ft-top" style={{
            display:'flex', justifyContent:'space-between',
            gap:40, paddingBottom:48,
            borderBottom:'1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Brand */}
            <div style={{maxWidth:300}}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
                <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
                  style={{height:38, width:'auto',
                    filter:'drop-shadow(0 4px 12px rgba(109,74,255,0.4))'}}/>
                <div>
                  <div style={{fontSize:16, fontWeight:800, color:'#fff', letterSpacing:'-0.02em'}}>
                    Soul<span style={{color:LAV}}>Connect</span>
                  </div>
                </div>
              </div>
              <p style={{fontSize:14, color:'rgba(255,255,255,0.38)', lineHeight:1.75, margin:'0 0 20px'}}>
                Helping people heal through connection, shared experiences, and meaningful peer support. You are not alone.
              </p>
            </div>

            {/* Nav columns */}
            <div style={{display:'flex', gap:40, flexWrap:'wrap'}}>
              <div>
                <div style={{fontSize:11, fontWeight:800, letterSpacing:'.1em',
                  textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:16}}>
                  Platform
                </div>
                <Link to="/about"          className="l-ft-link">About Us</Link>
                <a    href="#how"           className="l-ft-link">How It Works</a>
                <a    href="#trust"         className="l-ft-link">Safety</a>
                <Link to="/signup"          className="l-ft-link">Join Free</Link>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:800, letterSpacing:'.1em',
                  textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:16}}>
                  Trust &amp; Safety
                </div>
                <Link to="/safety"          className="l-ft-link">Safety Policy</Link>
                <Link to="/crisis-support"  className="l-ft-link">Crisis Support</Link>
                <Link to="/community-rules" className="l-ft-link">Community Rules</Link>
                <Link to="/guide-terms"     className="l-ft-link">Guide Terms</Link>
                <Link to="/report"          className="l-ft-link">Report Concern</Link>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:800, letterSpacing:'.1em',
                  textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:16}}>
                  Legal
                </div>
                <Link to="/terms"           className="l-ft-link">Terms of Service</Link>
                <Link to="/terms"           className="l-ft-link">Privacy Policy</Link>
                <Link to="/cookies"         className="l-ft-link">Cookie Policy</Link>
                <Link to="/accessibility"   className="l-ft-link">Accessibility</Link>
                <Link to="/contact"         className="l-ft-link">Contact Us</Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="l-ft-bottom" style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'20px 0 24px', flexWrap:'wrap', gap:12,
          }}>
            <div className="l-ft-nav" style={{display:'flex', alignItems:'center', flexWrap:'wrap', gap:0}}>
              {[
                {label:'About Us',           to:'/about',          isRoute:true},
                {label:'How It Works',       href:'#how',          isRoute:false},
                {label:'Privacy Policy',     to:'/terms',          isRoute:true},
                {label:'Terms of Service',   to:'/terms',          isRoute:true},
                {label:'Contact',            to:'/contact',        isRoute:true},
                {label:'Cookie Policy',      to:'/cookies',        isRoute:true},
                {label:'Accessibility',      to:'/accessibility',  isRoute:true},
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
                    <span style={{color:'rgba(255,255,255,0.1)', fontSize:11, userSelect:'none'}}>|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Social icons */}
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              {[
                {label:'Instagram',href:'#',svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>},
                {label:'Facebook', href:'#',svg:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
                {label:'YouTube',  href:'#',svg:<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#050110"/></svg>},
              ].map((s,i)=>(
                <a key={i} href={s.href} aria-label={s.label}
                  style={{width:36,height:36,borderRadius:10,
                    background:'rgba(109,74,255,0.1)',border:'1px solid rgba(109,74,255,0.2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'rgba(167,139,250,0.85)',textDecoration:'none',transition:'all .2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,74,255,0.28)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(109,74,255,0.1)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.color='rgba(167,139,250,0.85)';}}
                >{s.svg}</a>
              ))}
            </div>
          </div>

          <p style={{fontSize:11, color:'rgba(255,255,255,0.15)',
            textAlign:'center', paddingBottom:22}}>
            © 2026 SoulConnect. All rights reserved. Made with 💜 for healing.
          </p>
        </div>
      </footer>
    </div>
  );
}
