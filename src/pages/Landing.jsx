import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Color constants ────────────────────────────────────────────────────────────
const P = '#6D4AFF', LAV = '#A78BFA', GRN = '#34C38F', GOLD = '#F5B841';

const NAV_LINKS = ['Community', 'Healers', 'Challenges', 'Events', 'Resources'];

const STRUGGLES = [
  { id: 'anxiety',  label: 'Anxiety & Overthinking', icon: '🧠', count: 5892, color: '#7C3AED' },
  { id: 'breakup',  label: 'Breakup & Heartbreak',   icon: '💔', count: 3421, color: '#E11D48' },
  { id: 'grief',    label: 'Grief & Loss',            icon: '🌧', count: 2156, color: '#2563EB' },
  { id: 'lonely',   label: 'Loneliness',              icon: '😔', count: 4337, color: '#0891B2' },
  { id: 'stress',   label: 'Stress & Burnout',        icon: '💼', count: 2891, color: '#D97706' },
  { id: 'doubt',    label: 'Self-Doubt',              icon: '🪞', count: 1984, color: '#9333EA' },
  { id: 'career',   label: 'Career Pressure',         icon: '📈', count: 2345, color: '#0369A1' },
  { id: 'family',   label: 'Family Issues',           icon: '🏠', count: 1876, color: '#BE185D' },
  { id: 'spiritual',label: 'Spiritual Growth',        icon: '🕊️', count: 1543, color: '#34C38F' },
];

const LIVE_ACTIVITY = [
  { n: 127, label: 'discussing anxiety right now',   color: '#7C3AED', bg: '#F5F3FF' },
  { n: 84,  label: 'healing after heartbreak',       color: '#E11D48', bg: '#FFF1F2' },
  { n: 53,  label: 'navigating grief together',      color: '#2563EB', bg: '#EFF6FF' },
  { n: 210, label: 'building self-confidence',       color: GRN,       bg: '#F0FDF4' },
  { n: 98,  label: 'working on better sleep',        color: '#9333EA', bg: '#FAF5FF' },
  { n: 163, label: 'on healing journeys today',      color: GOLD,      bg: '#FFFBEB' },
];

const HOW_STEPS = [
  { num: '01', emoji: '🎯', title: 'Choose What You\'re Going Through', desc: 'Select from 25+ life challenges. You\'ll instantly see thousands of people on the same path.' },
  { num: '02', emoji: '🤝', title: 'Get Matched With People Who Understand', desc: 'Our algorithm connects you with peers who have faced the same challenges — not strangers, but kindred spirits.' },
  { num: '03', emoji: '💬', title: 'Join Conversations, Circles & Challenges', desc: 'Participate in group healing sessions, live circles, daily challenges, and private conversations.' },
  { num: '04', emoji: '📈', title: 'Track Your Growth & Healing Journey', desc: 'Watch your mood improve, streaks grow, and milestones accumulate on your personal Soul Journey dashboard.' },
  { num: '05', emoji: '🧘', title: 'Seek Expert Support If Needed', desc: 'When you\'re ready for deeper guidance, connect with verified Reiki healers, coaches, and wellness professionals.' },
];

const HEALING_CIRCLES = [
  { name: 'Anxiety Circle',        emoji: '🧠', members: 5892, sessions: 18, next: 'Today · 7 PM',     live: true,  color: '#7C3AED' },
  { name: 'Heartbreak Circle',     emoji: '💔', members: 3421, sessions: 12, next: 'Today · 9 PM',     live: false, color: '#E11D48' },
  { name: 'Grief Support Circle',  emoji: '🌧', members: 2156, sessions: 9,  next: 'Tomorrow · 6 PM', live: false, color: '#2563EB' },
  { name: 'Confidence Circle',     emoji: '✨', members: 4337, sessions: 15, next: 'Today · 8 PM',     live: true,  color: '#34C38F' },
  { name: 'Stress Recovery Circle',emoji: '🌿', members: 2891, sessions: 11, next: 'Tomorrow · 7 PM', live: false, color: '#D97706' },
  { name: 'Spiritual Growth Circle',emoji: '🕊️',members: 1543, sessions: 8,  next: 'Sunday · 6 PM',  live: false, color: '#F5B841' },
];

const CHALLENGES = [
  { icon: '🌬️', label: '3-Min Breathing',    desc: 'Reset your nervous system with conscious breath.',    joined: 2847, dur: '3 min',  streak: 7,  color: '#0891B2', bg: '#ECFEFF' },
  { icon: '🙏',  label: 'Gratitude Practice', desc: 'Write 3 things you are grateful for today.',          joined: 1923, dur: '5 min',  streak: 14, color: GRN,       bg: '#F0FDF4' },
  { icon: '📝',  label: 'Journal Reflection', desc: 'Express what is on your heart with guided prompts.',  joined: 1445, dur: '10 min', streak: 5,  color: P,         bg: '#F5F3FF' },
  { icon: '🚶',  label: '10-Min Mindful Walk',desc: 'Move your body and clear your mind.',                 joined: 2156, dur: '10 min', streak: 10, color: '#D97706', bg: '#FFFBEB' },
  { icon: '💧',  label: 'Hydration Challenge',desc: 'Drink 8 glasses of water to support your healing.',   joined: 987,  dur: 'All day',streak: 3,  color: '#0284C7', bg: '#F0F9FF' },
  { icon: '🎧',  label: '5-Min Meditation',   desc: 'A guided session to ground and center yourself.',     joined: 3421, dur: '5 min',  streak: 21, color: '#9333EA', bg: '#FAF5FF' },
];

const SOUL_STAGES = [
  { emoji: '🌱', title: 'Awareness',      members: 12847, desc: 'Your first courageous step',          color: GRN,     active: false },
  { emoji: '✨', title: 'Acceptance',     members: 8423,  desc: 'Understanding your patterns',         color: LAV,     active: true  },
  { emoji: '🌸', title: 'Healing',        members: 5891,  desc: 'Releasing what no longer serves',     color: '#F472B6',active: false },
  { emoji: '🦋', title: 'Growth',         members: 3267,  desc: 'Becoming who you are meant to be',    color: GOLD,    active: false },
  { emoji: '🕊️', title: 'Transformation', members: 1834,  desc: 'Living in peace and alignment',       color: '#60A5FA',active: false },
];

const TESTIMONIALS = [
  { name: 'Riya, 24', city: 'Mumbai', from: 'Heartbreak', to: 'Healing', weeks: 8,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    quote: 'I was shattered after my breakup. I didn\'t want therapy — I wanted someone who just got it. SoulConnect gave me 12 people who had felt exactly what I was feeling. I haven\'t felt alone since week one.' },
  { name: 'Arjun, 27', city: 'Bangalore', from: 'Anxiety', to: 'Calm', weeks: 12,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    quote: 'My anxiety made me feel like I was broken. My SoulConnect circle showed me I wasn\'t — they were all carrying the same weight. We helped each other breathe again. Literally.' },
  { name: 'Priya, 31', city: 'Delhi', from: 'Grief', to: 'Peace', weeks: 16,
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80',
    quote: 'After my dad passed, I felt like no one could understand. The grief circle on SoulConnect became my new family. They didn\'t try to fix me. They just stayed. That was everything.' },
];

const HEALERS = [
  { name: 'Dr. Meera Shah',  role: 'Reiki Healer · 8+ Years',       spec: 'Trauma, Anxiety, Energy Healing',    rating: 4.9, sessions: 847, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80', avail: 'Available Today', price: 900  },
  { name: 'Rohit Verma',     role: 'Wellness Coach · 6+ Years',      spec: 'Grief, Stress, Life Transitions',     rating: 4.8, sessions: 623, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', avail: 'Next: Tomorrow', price: 750  },
  { name: 'Ananya Iyer',     role: 'Meditation Teacher · 5+ Years',  spec: 'Mindfulness, Breathwork, Growth',     rating: 4.9, sessions: 912, img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=80&q=80', avail: 'Available Today', price: 850  },
];

const EVENTS = [
  { title: 'Morning Healing Meditation', host: 'Dr. Meera Shah', time: 'Today · 7:00 AM',    type: 'Meditation',    joined: 47, limit: 60, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=70', typeColor: P },
  { title: 'Breathwork for Anxiety',     host: 'Ananya Iyer',    time: 'Today · 8:00 PM',    type: 'Breathwork',    joined: 32, limit: 40, img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=500&q=70', typeColor: GRN },
  { title: 'Heartbreak Healing Circle',  host: 'Rohit Verma',    time: 'Tomorrow · 7:00 PM', type: 'Circle',        joined: 18, limit: 25, img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=70', typeColor: '#E11D48' },
];

const FAQS = [
  { q: 'What is SoulConnect?', a: 'SoulConnect is a community-driven healing platform where people facing similar life challenges connect, support each other, and heal together. Professional healers are available when you need deeper support, but community comes first.' },
  { q: 'How is SoulConnect different from therapy?', a: 'SoulConnect is a peer support community, not a therapy service. We connect you with people who have faced the same challenges — people who truly understand. Therapy focuses on clinical treatment; we focus on human connection and community healing.' },
  { q: 'Is SoulConnect completely anonymous?', a: 'Yes. You can participate using a username with no real name required. Your personal information is never shared with other community members without your consent.' },
  { q: 'How does the matching work?', a: 'When you tell us what you\'re going through, our system matches you with people in similar situations. You\'re connected to conversations, circles, and challenges that align with your specific journey.' },
  { q: 'What are Healing Circles?', a: 'Healing Circles are small group sessions (8–20 people) facilitated by our community leaders. They can be topic-based (grief, anxiety) or goal-based (breathwork, meditation). They happen live and are recorded for members who miss them.' },
  { q: 'What is the Soul Journey?', a: 'The Soul Journey is SoulConnect\'s personal growth framework — a five-stage path from Awareness to Transformation. You progress through stages as you complete challenges, attend circles, and contribute to the community.' },
  { q: 'What if I\'m in crisis?', a: 'SoulConnect is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact emergency services (112) or a mental health helpline immediately. We care about your safety above all.' },
  { q: 'Are the wellness professionals verified?', a: 'Yes. All practitioners on SoulConnect are reviewed for credentials, experience, certifications, and background before being listed.' },
  { q: 'Is SoulConnect free to use?', a: 'Community features — circles, conversations, challenges, and the Soul Journey — are free to join. Professional sessions are paid separately. Premium membership unlocks additional features and unlimited access.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use 256-bit SSL encryption, are GDPR compliant, and never sell your personal data to third parties. Your privacy is non-negotiable.' },
  { q: 'How do I report harmful content?', a: 'Every post and message has a one-tap report button. Our moderation team reviews reports within minutes, 24/7. Zero tolerance for harassment or harmful content.' },
];

// ── Particles (deterministic) ─────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: 8  + (i * 43 + i * i *  7) % 544,
  y: 10 + (i * 67 + i * i * 13) % 600,
  r: 0.8 + (i % 5) * 0.5,
  op: 0.09 + (i % 6) * 0.07,
  dur: 3.5 + (i % 5) * 1.3,
  del: (i % 8) * 0.55,
  col: i % 3 === 0 ? GOLD : i % 3 === 1 ? LAV : '#93C5FD',
}));

// ── CommunityIllustration SVG ─────────────────────────────────────────────────
const FIGURES = [
  { x: 280, y: 110, body: '#C4B5FD', head: '#EDE9FE', glow: P },
  { x: 448, y: 205, body: '#FDE68A', head: '#FEF3C7', glow: GOLD },
  { x: 410, y: 430, body: '#A7F3D0', head: '#D1FAE5', glow: GRN },
  { x: 150, y: 430, body: '#FBCFE8', head: '#FCE7F3', glow: '#F472B6' },
  { x: 112, y: 205, body: '#BAE6FD', head: '#E0F2FE', glow: '#38BDF8' },
];
const CX = 280, CY = 295;

function CommunityIllustration() {
  const lotusPetals8  = [0,45,90,135,180,225,270,315];
  const lotusPetals8i = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  return (
    <svg viewBox="0 0 560 620" style={{ width:'100%', height:'100%' }} aria-hidden="true">
      <defs>
        <radialGradient id="ci-bg" cx="50%" cy="44%" r="55%">
          <stop offset="0%"   stopColor={P}         stopOpacity="0.22"/>
          <stop offset="50%"  stopColor="#1E0B45"   stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#0F0A24"   stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ci-gold" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="55%"  stopColor={GOLD}/>
          <stop offset="100%" stopColor="#B45309" stopOpacity="0.4"/>
        </radialGradient>
        <radialGradient id="ci-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GOLD} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
        <filter id="ci-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ci-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="280" cy="295" rx="270" ry="310" fill="url(#ci-bg)"/>
      {[230,188,146].map((r,i) => (
        <circle key={i} cx={CX} cy={CY} r={r} fill="none"
          stroke={`rgba(167,139,250,${0.06+i*0.02})`}
          strokeWidth={i===0?0.6:0.9} strokeDasharray={i===1?'5 9':'none'}/>
      ))}
      {FIGURES.map((f,i) => {
        const f2 = FIGURES[(i+2)%5];
        return <line key={i} x1={f.x} y1={f.y} x2={f2.x} y2={f2.y} stroke="rgba(196,181,253,0.055)" strokeWidth="0.8"/>;
      })}
      {FIGURES.map((f,i) => {
        const cpx = (f.x+CX)/2 + (i%2===0?22:-22);
        const cpy = (f.y+CY)/2 + (i%3===0?-20:14);
        const path = `M ${f.x} ${f.y} Q ${cpx} ${cpy} ${CX} ${CY}`;
        return (
          <path key={i} d={path} stroke={f.glow} strokeWidth="1.5" fill="none" opacity="0.38" strokeDasharray="5 8">
            <animate attributeName="stroke-dashoffset" values="0;-52;0" dur={`${3.2+i*0.7}s`} begin={`${i*0.45}s`} repeatCount="indefinite"/>
          </path>
        );
      })}
      {FIGURES.map((f,i) => {
        const angle = Math.atan2(CY-f.y, CX-f.x);
        return (
          <g key={i}>
            <circle cx={f.x} cy={f.y} r={44} fill={f.glow} opacity="0.08"/>
            <circle cx={f.x} cy={f.y} r={29} fill={f.glow} opacity="0.10" filter="url(#ci-soft)"/>
            {[-0.55,0.55].map((offset,j) => {
              const a = angle+offset;
              return <line key={j}
                x1={f.x+13*Math.cos(a+Math.PI/2)} y1={f.y+14+13*Math.sin(a+Math.PI/2)}
                x2={f.x+13*Math.cos(a+Math.PI/2)+24*Math.cos(angle)} y2={f.y+14+13*Math.sin(a+Math.PI/2)+24*Math.sin(angle)}
                stroke={f.body} strokeWidth="5" strokeLinecap="round" opacity="0.75"/>;
            })}
            <ellipse cx={f.x} cy={f.y+14} rx={13} ry={20} fill={f.body} opacity="0.92"/>
            <circle cx={f.x} cy={f.y-14} r={14} fill={f.head} opacity="0.95" filter="url(#ci-soft)"/>
            <circle cx={f.x} cy={f.y+4} r={4.5} fill={f.glow} opacity="0.55">
              <animate attributeName="opacity" values="0.35;0.75;0.35" dur={`${2.4+i*0.4}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        );
      })}
      {lotusPetals8.map((deg,i) => {
        const a = (deg-90)*Math.PI/180;
        const px = CX+34*Math.cos(a), py = CY+20*Math.sin(a);
        return <ellipse key={i} cx={px} cy={py} rx={10} ry={22} fill="url(#ci-gold)" opacity={0.52+(i%3)*0.12} transform={`rotate(${deg},${px},${py})`} filter="url(#ci-glow)"/>;
      })}
      {lotusPetals8i.map((deg,i) => {
        const a = (deg-90)*Math.PI/180;
        const px = CX+17*Math.cos(a), py = CY+11*Math.sin(a);
        return <ellipse key={i} cx={px} cy={py} rx={7} ry={15} fill="url(#ci-gold)" opacity={0.78} transform={`rotate(${deg},${px},${py})`}/>;
      })}
      <circle cx={CX} cy={CY} r={18} fill="url(#ci-center)"/>
      <circle cx={CX} cy={CY} r={12} fill={GOLD} opacity="0.9" filter="url(#ci-glow)"/>
      <circle cx={CX} cy={CY} r={5}  fill="#FEF9C3"/>
      {PARTICLES.map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity={p.op}>
          <animate attributeName="cy" values={`${p.y};${p.y-18};${p.y}`} dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values={`${p.op};${Math.min(p.op+0.2,0.55)};${p.op}`} dur={`${p.dur*0.8}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, center=true, light=false }) {
  return (
    <div style={{ textAlign: center?'center':'left', marginBottom: 52 }}>
      {eyebrow && <p style={{ fontSize:12, fontWeight:700, color: light?LAV:P, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'clamp(1.9rem,3.2vw,2.9rem)', fontWeight:800, color: light?'#fff':'#0F0F1A', letterSpacing:'-0.025em', margin:'0 auto 16px', maxWidth: center?620:'none', lineHeight:1.2 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:17, color: light?'rgba(255,255,255,0.58)':'#6B7280', maxWidth: center?560:'none', margin: center?'0 auto':0, lineHeight:1.72 }}>{subtitle}</p>}
    </div>
  );
}

// ── WellnessAssessment ────────────────────────────────────────────────────────
function WellnessAssessment() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  const total = selected.reduce((acc, id) => {
    const s = STRUGGLES.find(x=>x.id===id);
    return acc + (s ? s.count : 0);
  }, 0);

  return (
    <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#FAFAFC' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <SectionHeader eyebrow="Wellness Assessment" title="Find Your Healing Community in 2 Minutes" subtitle="Tell us what you're going through. We'll match you with thousands of people on the same journey." />

        {step === 0 && (
          <div style={{ textAlign:'center' }}>
            <div style={{ background:'#fff', borderRadius:32, padding:'clamp(40px,5vw,72px)', boxShadow:'0 8px 48px rgba(109,74,255,0.1)', border:'1.5px solid #EDE9FE', display:'inline-block', maxWidth:560 }}>
              <div style={{ fontSize:64, marginBottom:24 }}>🧘</div>
              <h3 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'clamp(1.4rem,2.4vw,2rem)', fontWeight:800, color:'#0F0F1A', marginBottom:16 }}>Take the 2-Minute Wellness Assessment</h3>
              <p style={{ fontSize:16, color:'#6B7280', lineHeight:1.7, marginBottom:32 }}>Answer a few quick questions and discover the exact community waiting for you on SoulConnect.</p>
              <button onClick={()=>setStep(1)} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 48px', borderRadius:16, fontSize:17, fontWeight:700, color:'#fff', background:`linear-gradient(135deg,${P},#5B3CE8)`, border:'none', cursor:'pointer', boxShadow:'0 8px 28px rgba(109,74,255,0.4)' }}>
                Start Assessment →
              </button>
              <p style={{ fontSize:13, color:'#9CA3AF', marginTop:16 }}>Free · Anonymous · 2 minutes</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p style={{ textAlign:'center', fontSize:18, fontWeight:600, color:'#0F0F1A', marginBottom:32 }}>What are you currently going through? <span style={{ color:'#9CA3AF', fontWeight:400 }}>(select all that apply)</span></p>
            <div className="assess-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:32 }}>
              {STRUGGLES.map(s => {
                const isSelected = selected.includes(s.id);
                return (
                  <button key={s.id} onClick={()=>toggle(s.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'16px 20px', borderRadius:18, border: isSelected?`2px solid ${s.color}`:'2px solid #EDE9FE', background: isSelected?`${s.color}15`:'#fff', cursor:'pointer', textAlign:'left', transition:'all 0.18s', boxShadow: isSelected?`0 4px 16px ${s.color}30`:'none' }}>
                    <span style={{ fontSize:28 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color: isSelected?s.color:'#0F0F1A', lineHeight:1.3 }}>{s.label}</div>
                      <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{s.count.toLocaleString()} members</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ textAlign:'center' }}>
              <button onClick={()=>setStep(2)} disabled={selected.length===0} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 48px', borderRadius:16, fontSize:17, fontWeight:700, color:'#fff', background: selected.length>0?`linear-gradient(135deg,${P},#5B3CE8)`:'#D1D5DB', border:'none', cursor: selected.length>0?'pointer':'not-allowed', boxShadow: selected.length>0?'0 8px 28px rgba(109,74,255,0.4)':'none', transition:'all 0.2s' }}>
                Show My Community →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign:'center' }}>
            <div style={{ background:'#fff', borderRadius:32, padding:'clamp(40px,5vw,64px)', boxShadow:'0 8px 48px rgba(109,74,255,0.1)', border:'1.5px solid #EDE9FE', display:'inline-block', maxWidth:600 }}>
              <div style={{ fontSize:64, marginBottom:20 }}>🎉</div>
              <div style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:800, color:P, lineHeight:1, marginBottom:8 }}>{total.toLocaleString()}</div>
              <p style={{ fontSize:20, fontWeight:700, color:'#0F0F1A', marginBottom:12 }}>people are on a similar journey</p>
              <p style={{ fontSize:15, color:'#6B7280', marginBottom:32, lineHeight:1.7 }}>Your community is already waiting. These are real people going through exactly what you're experiencing — anonymous, safe, and supportive.</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginBottom:36 }}>
                {selected.map(id => {
                  const s = STRUGGLES.find(x=>x.id===id);
                  return s ? <span key={id} style={{ padding:'6px 14px', borderRadius:20, background:`${s.color}18`, border:`1px solid ${s.color}44`, fontSize:13, fontWeight:600, color:s.color }}>{s.icon} {s.label}</span> : null;
                })}
              </div>
              <Link to="/signup" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 48px', borderRadius:16, fontSize:17, fontWeight:700, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${P},#5B3CE8)`, boxShadow:'0 8px 28px rgba(109,74,255,0.4)' }}>
                Find My Circle →
              </Link>
              <div style={{ marginTop:16 }}>
                <button onClick={()=>{setStep(1);}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#9CA3AF', textDecoration:'underline' }}>Go back</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── ProductDemo ───────────────────────────────────────────────────────────────
function ProductDemo() {
  const [tab, setTab] = useState(0);
  const TABS = [
    { label:'Assessment', icon:'🎯' },
    { label:'Community',  icon:'👥' },
    { label:'Circles',    icon:'🌀' },
    { label:'Challenges', icon:'⚡' },
    { label:'Journey',    icon:'🗺️' },
    { label:'Healers',    icon:'🧘' },
  ];

  const screens = [
    // 0 – Assessment
    <div style={{ height:'100%', background:'#1a1a2e', padding:'20px 16px', overflow:'hidden' }}>
      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginBottom:8 }}>Step 1 of 3</p>
      <h4 style={{ color:'#fff', fontSize:15, fontWeight:700, marginBottom:16, lineHeight:1.4 }}>What are you struggling with?</h4>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {[['🧠','Anxiety'],['💔','Heartbreak'],['🌧','Grief'],['😔','Lonely'],['💼','Stress'],['🪞','Self-Doubt']].map(([icon,label],i) => (
          <div key={i} style={{ padding:'10px 8px', borderRadius:12, background: i===0||i===3?`${P}33`:'rgba(255,255,255,0.06)', border: i===0||i===3?`1.5px solid ${P}`:'1.5px solid rgba(255,255,255,0.1)', textAlign:'center' }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
            <div style={{ fontSize:10, color: i===0||i===3?LAV:'rgba(255,255,255,0.6)', fontWeight:600 }}>{label}</div>
          </div>
        ))}
      </div>
      <button style={{ marginTop:20, width:'100%', padding:'11px', borderRadius:12, background:`linear-gradient(135deg,${P},${LAV})`, border:'none', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Continue →</button>
    </div>,

    // 1 – Community
    <div style={{ height:'100%', background:'#F8F9FF', padding:'0', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:`linear-gradient(135deg,${P},${LAV})`, padding:'16px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🧠</div>
        <div>
          <div style={{ color:'#fff', fontSize:13, fontWeight:700 }}>Anxiety Circle</div>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>847 members online</div>
        </div>
      </div>
      <div style={{ flex:1, padding:'12px', display:'flex', flexDirection:'column', gap:10, overflow:'hidden' }}>
        {[
          { name:'Moon_42',     msg:'Anyone else overthink every conversation? 😅', time:'2m', mine:false },
          { name:'StarPath',    msg:'All the time! Breathing really helps me reset.', time:'1m', mine:false },
          { name:'HealingWave', msg:'I started journaling and it changed everything 💙', time:'30s', mine:true },
        ].map((m,i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: m.mine?'flex-end':'flex-start', gap:3 }}>
            {!m.mine && <span style={{ fontSize:9, color:'#9CA3AF', paddingLeft:4 }}>{m.name} · {m.time}</span>}
            <div style={{ maxWidth:'85%', padding:'8px 12px', borderRadius: m.mine?'14px 14px 4px 14px':'14px 14px 14px 4px', background: m.mine?`linear-gradient(135deg,${P},${LAV})`:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize:11, color: m.mine?'#fff':'#374151', margin:0, lineHeight:1.5 }}>{m.msg}</p>
            </div>
            {m.mine && <span style={{ fontSize:9, color:'#9CA3AF', paddingRight:4 }}>You · {m.time}</span>}
          </div>
        ))}
      </div>
      <div style={{ padding:'10px 12px', background:'#fff', borderTop:'1px solid #EDE9FE', display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ flex:1, padding:'8px 12px', borderRadius:20, background:'#F0EBFF', fontSize:11, color:'#9CA3AF' }}>Share how you feel...</div>
        <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${P},${LAV})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff' }}>↑</div>
      </div>
    </div>,

    // 2 – Circles
    <div style={{ height:'100%', background:'#1a1a2e', padding:'0', overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'livePulse 2s infinite' }}/>
          <span style={{ color:'#fff', fontSize:13, fontWeight:700 }}>Anxiety Circle · LIVE</span>
        </div>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, marginTop:4 }}>14 members in session</p>
      </div>
      <div style={{ padding:'16px', flex:1 }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginBottom:12 }}>Participants</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:20 }}>
          {[['A','#7C3AED'],['M','#E11D48'],['S','#34C38F'],['R','#F5B841'],['K','#0891B2']].map(([init,col],i) => (
            <div key={i} style={{ width:40, height:40, borderRadius:'50%', background:col, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', border:'2px solid rgba(255,255,255,0.15)' }}>{init}</div>
          ))}
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.4)' }}>+9</div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:14, padding:'12px', marginBottom:16 }}>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:11, lineHeight:1.6, margin:0 }}>Tonight's topic: <strong style={{ color:LAV }}>Managing anxiety in relationships</strong></p>
        </div>
        <button style={{ width:'100%', padding:'12px', borderRadius:14, background:`linear-gradient(135deg,${P},${LAV})`, border:'none', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>Join Circle →</button>
      </div>
    </div>,

    // 3 – Challenges
    <div style={{ height:'100%', background:'#fff', padding:'16px', overflow:'hidden' }}>
      <h4 style={{ fontSize:14, fontWeight:700, color:'#0F0F1A', marginBottom:16 }}>Your Challenges</h4>
      {[
        { icon:'🌬️', label:'Breathing', day:7,  total:30, color:'#0891B2' },
        { icon:'🙏',  label:'Gratitude', day:14, total:30, color:GRN },
        { icon:'🎧',  label:'Meditation',day:3,  total:30, color:'#9333EA' },
      ].map((c,i) => (
        <div key={i} style={{ background:'#F8F9FF', borderRadius:16, padding:'14px', marginBottom:10, border:'1.5px solid #EDE9FE' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>{c.icon}</span>
              <span style={{ fontSize:13, fontWeight:700, color:'#0F0F1A' }}>{c.label}</span>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:c.color, background:`${c.color}15`, padding:'3px 8px', borderRadius:20 }}>Day {c.day} 🔥</span>
          </div>
          <div style={{ height:5, background:'#EDE9FE', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(c.day/c.total)*100}%`, background:c.color, borderRadius:4 }}/>
          </div>
          <p style={{ fontSize:10, color:'#9CA3AF', marginTop:5 }}>{c.day}/{c.total} days</p>
        </div>
      ))}
    </div>,

    // 4 – Journey
    <div style={{ height:'100%', background:'#0F0A24', padding:'20px 16px', overflow:'hidden' }}>
      <h4 style={{ color:'#fff', fontSize:14, fontWeight:700, marginBottom:6 }}>Your Soul Journey</h4>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20 }}>
        <span style={{ background:`${GOLD}22`, border:`1px solid ${GOLD}55`, borderRadius:20, padding:'4px 10px', fontSize:11, fontWeight:700, color:GOLD }}>⚡ 847 XP</span>
      </div>
      <div style={{ position:'relative', paddingLeft:24 }}>
        <div style={{ position:'absolute', left:11, top:0, bottom:0, width:2, background:'rgba(167,139,250,0.2)' }}/>
        {[
          { stage:'Awareness',      done:true,  current:false },
          { stage:'Acceptance',     done:false, current:true  },
          { stage:'Healing',        done:false, current:false },
          { stage:'Growth',         done:false, current:false },
          { stage:'Transformation', done:false, current:false },
        ].map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, position:'relative' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background: s.done?GRN:s.current?GOLD:'rgba(255,255,255,0.1)', border: s.current?`2px solid ${GOLD}`:s.done?`2px solid ${GRN}`:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, zIndex:1, boxShadow: s.current?`0 0 12px ${GOLD}88`:s.done?`0 0 8px ${GRN}66`:'none' }}>
              {s.done?'✓':i+1}
            </div>
            <span style={{ fontSize:12, color: s.current?GOLD:s.done?GRN:'rgba(255,255,255,0.4)', fontWeight: s.current||s.done?700:400 }}>{s.stage}</span>
            {s.current && <span style={{ fontSize:10, background:`${GOLD}22`, color:GOLD, padding:'2px 6px', borderRadius:10, fontWeight:600 }}>You are here</span>}
          </div>
        ))}
      </div>
    </div>,

    // 5 – Healers
    <div style={{ height:'100%', background:'#fff', padding:'16px', overflow:'hidden' }}>
      <h4 style={{ fontSize:14, fontWeight:700, color:'#0F0F1A', marginBottom:16 }}>Healers for You</h4>
      {[
        { name:'Dr. Meera Shah',  role:'Reiki Healer',   rating:4.9, avail:true,  price:900,  initial:'M', color:'#7C3AED' },
        { name:'Ananya Iyer',     role:'Meditation Guide',rating:4.9, avail:true,  price:850,  initial:'A', color:'#34C38F' },
      ].map((h,i) => (
        <div key={i} style={{ background:'#F8F9FF', borderRadius:16, padding:'14px', marginBottom:12, border:'1.5px solid #EDE9FE' }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:10 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${h.color},${h.color}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', flexShrink:0 }}>{h.initial}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#0F0F1A' }}>{h.name}</div>
              <div style={{ fontSize:11, color:'#9CA3AF' }}>{h.role}</div>
              <div style={{ fontSize:11, color:GOLD, marginTop:2 }}>★ {h.rating}</div>
            </div>
            {h.avail && <span style={{ fontSize:10, fontWeight:600, color:GRN, background:'#F0FDF4', padding:'3px 8px', borderRadius:10 }}>Available</span>}
          </div>
          <button style={{ width:'100%', padding:'8px', borderRadius:10, background:`linear-gradient(135deg,${P},${LAV})`, border:'none', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Book ₹{h.price}</button>
        </div>
      ))}
    </div>,
  ];

  return (
    <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#FAFAFC' }}>
      <div style={{ maxWidth:1800, margin:'0 auto' }}>
        <SectionHeader eyebrow="Product Tour" title="See SoulConnect In Action" subtitle="Explore the features that make healing together possible." />

        <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', marginBottom:48 }}>
          {TABS.map((t,i) => (
            <button key={i} onClick={()=>setTab(i)} style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:28, fontSize:14, fontWeight:700, border: tab===i?`2px solid ${P}`:'2px solid #EDE9FE', background: tab===i?`${P}12`:'#fff', color: tab===i?P:'#6B7280', cursor:'pointer', transition:'all 0.18s', boxShadow: tab===i?`0 4px 16px ${P}22`:'none' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'center' }}>
          <div style={{ width:280, height:560, background:'#1a1a2e', borderRadius:40, padding:'12px 8px 24px', boxShadow:'0 40px 100px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)', position:'relative' }}>
            <div style={{ width:80, height:20, background:'#0f0f1a', borderRadius:'0 0 12px 12px', margin:'0 auto 8px', position:'relative', zIndex:2 }}/>
            <div style={{ height:'calc(100% - 40px)', borderRadius:28, overflow:'hidden', background:'#fff' }}>
              {screens[tab]}
            </div>
            <div style={{ width:80, height:4, background:'rgba(255,255,255,0.3)', borderRadius:2, position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)' }}/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Landing ──────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const ids = ['sc-pjs','sc-playfair'];
    const hrefs = [
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap',
    ];
    ids.forEach((id,i) => {
      if (!document.getElementById(id)) {
        const l = document.createElement('link');
        l.id=id; l.rel='stylesheet'; l.href=hrefs[i];
        document.head.appendChild(l);
      }
    });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FONT = "'Plus Jakarta Sans',Inter,-apple-system,sans-serif";

  return (
    <div style={{ fontFamily:FONT, background:'#FAFAFC', color:'#0F0F1A', overflowX:'hidden' }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
        @keyframes shimmer  { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.3); } }
        @keyframes breathe  { 0%,100% { opacity:0.7; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
        @keyframes livePulse{ 0%,100% { box-shadow:0 0 0 0 rgba(52,195,143,0.5); } 70% { box-shadow:0 0 0 8px rgba(52,195,143,0); } }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .float   { animation: floatY 6s ease-in-out infinite; }
        .sc-btn-primary { transition: transform 0.2s, box-shadow 0.2s; }
        .sc-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(109,74,255,0.52) !important; }
        .sc-btn-ghost:hover { background: rgba(255,255,255,0.12) !important; }
        .sc-card-hover { transition: transform 0.22s, box-shadow 0.22s; }
        .sc-card-hover:hover { transform: translateY(-7px); box-shadow: 0 24px 60px rgba(0,0,0,0.11) !important; }
        .sc-cat-card { transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; }
        .sc-cat-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(0,0,0,0.1) !important; }
        .live-dot { animation: livePulse 2s ease-in-out infinite; }
        @media (max-width: 900px) {
          .hero-grid  { grid-template-columns: 1fr !important; }
          .hero-art   { display: none !important; }
          .two-col    { grid-template-columns: 1fr !important; }
          .three-col  { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .three-col  { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .assess-grid{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:72, background: scrolled?'rgba(255,255,255,0.97)':'transparent', backdropFilter: scrolled?'blur(24px)':'none', WebkitBackdropFilter: scrolled?'blur(24px)':'none', borderBottom: scrolled?'1px solid rgba(109,74,255,0.1)':'1px solid rgba(255,255,255,0.07)', boxShadow: scrolled?'0 2px 28px rgba(109,74,255,0.08)':'none', transition:'all 0.4s ease', display:'flex', alignItems:'center' }}>
        <div style={{ width:'100%', maxWidth:1800, margin:'0 auto', padding:'0 clamp(16px,2.5vw,52px)', display:'flex', alignItems:'center' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginRight:44, flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:13, background:`linear-gradient(135deg,${P},${LAV})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:`0 4px 16px rgba(109,74,255,0.4)` }}>🪷</div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color: scrolled?'#0F0F1A':'#fff', letterSpacing:'-0.02em', lineHeight:1, transition:'color 0.35s' }}>Soul<span style={{ color:LAV }}>Connect</span></div>
              <div style={{ fontSize:9, color:LAV, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Heal · Connect · Grow</div>
            </div>
          </Link>

          <div className="hidden md:flex" style={{ alignItems:'center', gap:2, flex:1, justifyContent:'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{ padding:'8px 16px', borderRadius:10, fontSize:14, fontWeight:500, color: scrolled?'#6B7280':'rgba(255,255,255,0.75)', textDecoration:'none', transition:'all 0.18s', whiteSpace:'nowrap' }}
                onMouseEnter={e=>{ e.currentTarget.style.color=scrolled?P:'#fff'; e.currentTarget.style.background=scrolled?'#F0EBFF':'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.color=scrolled?'#6B7280':'rgba(255,255,255,0.75)'; e.currentTarget.style.background='transparent'; }}>{l}</a>
            ))}
          </div>

          <div className="hidden md:flex" style={{ alignItems:'center', gap:10, marginLeft:'auto' }}>
            <Link to="/login" style={{ padding:'10px 22px', borderRadius:12, fontSize:14, fontWeight:600, color: scrolled?'#0F0F1A':'rgba(255,255,255,0.85)', textDecoration:'none', border: scrolled?'1.5px solid #D1D5DB':'1.5px solid rgba(255,255,255,0.25)', background:'transparent', transition:'all 0.2s' }}>Log In</Link>
            <Link to="/signup" className="sc-btn-primary" style={{ padding:'10px 24px', borderRadius:12, fontSize:14, fontWeight:700, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${P},#5B3CE8)`, boxShadow:'0 4px 18px rgba(109,74,255,0.44)' }}>Find My Circle</Link>
          </div>

          <button className="md:hidden" onClick={()=>setMenuOpen(v=>!v)} style={{ marginLeft:'auto', width:42, height:42, borderRadius:11, background: scrolled?'#F0EBFF':'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5 }}>
            {[0,1,2].map(i=><span key={i} style={{ width:20, height:2, background: scrolled?P:'#fff', borderRadius:2, display:'block' }}/>)}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:199, background:'rgba(15,10,36,0.75)', backdropFilter:'blur(6px)' }} onClick={()=>setMenuOpen(false)}>
          <div style={{ position:'absolute', top:72, left:0, right:0, background:'#fff', padding:'24px', boxShadow:'0 12px 48px rgba(0,0,0,0.18)', fontFamily:FONT }} onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=><a key={l} href="#" onClick={()=>setMenuOpen(false)} style={{ display:'block', padding:'15px 0', fontSize:16, fontWeight:500, color:'#0F0F1A', textDecoration:'none', borderBottom:'1px solid #F0EBFF' }}>{l}</a>)}
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <Link to="/login"  onClick={()=>setMenuOpen(false)} style={{ flex:1, textAlign:'center', padding:'13px', borderRadius:12, fontSize:14, fontWeight:600, color:'#0F0F1A', textDecoration:'none', border:'1.5px solid #D1D5DB' }}>Log In</Link>
              <Link to="/signup" onClick={()=>setMenuOpen(false)} style={{ flex:1, textAlign:'center', padding:'13px', borderRadius:12, fontSize:14, fontWeight:700, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${P},#5B3CE8)` }}>Find My Circle</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(148deg,#0F0A24 0%,#1E0B45 35%,#2A0D5E 65%,#120828 100%)', minHeight:'100vh', display:'flex', alignItems:'flex-start', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'10%', left:'2%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(109,74,255,0.14) 0%,transparent 70%)' }}/>
          <div style={{ position:'absolute', bottom:'8%', right:'4%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,0.10) 0%,transparent 70%)' }}/>
          <div style={{ position:'absolute', top:'55%', left:'40%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,184,65,0.05) 0%,transparent 70%)' }}/>
          {[0,30,60,90,120,150].map((deg,i)=><div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:'120vw', height:1, background:'rgba(167,139,250,0.025)', transformOrigin:'left center', transform:`rotate(${deg}deg) translateY(-0.5px)` }}/>)}
        </div>

        <div className="hero-grid" style={{ width:'100%', maxWidth:1800, margin:'0 auto', padding:'100px clamp(20px,2.5vw,60px) 80px', display:'grid', gridTemplateColumns:'50fr 50fr', gap:'clamp(40px,4vw,88px)', alignItems:'center', position:'relative', zIndex:1 }}>

          <div className="fade-up" style={{ minWidth:0 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'8px 20px', borderRadius:28, background:'rgba(109,74,255,0.18)', border:'1px solid rgba(167,139,250,0.32)', marginBottom:32 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:GRN, display:'inline-block', animation:'shimmer 2.4s ease-in-out infinite' }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#C4B5FD', letterSpacing:'0.06em' }}>12,000+ souls healing together</span>
            </div>

            <h1 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'clamp(3.2rem,6vw,8rem)', fontWeight:800, color:'#fff', lineHeight:1.04, letterSpacing:'-0.03em', marginBottom:28 }}>
              You Don't Have<br/>To Go Through<br/>
              <span style={{ background:`linear-gradient(135deg,${LAV} 0%,#C4B5FD 40%,${GOLD} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontStyle:'italic' }}>It Alone.</span>
            </h1>

            <p style={{ fontSize:'clamp(15px,1.4vw,19px)', color:'rgba(255,255,255,0.60)', lineHeight:1.80, marginBottom:40, maxWidth:540 }}>
              Whether you're dealing with anxiety, heartbreak, loneliness, grief, stress, or self-doubt — SoulConnect connects you with people who truly understand your journey.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:40 }}>
              <Link to="/signup" className="sc-btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'18px 48px', borderRadius:16, fontSize:17, fontWeight:700, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${P},#5B3CE8)`, boxShadow:'0 10px 36px rgba(109,74,255,0.52)' }}>
                Find My Circle →
              </Link>
              <Link to="/signup" className="sc-btn-ghost" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'18px 34px', borderRadius:16, fontSize:17, fontWeight:600, color:'rgba(255,255,255,0.82)', textDecoration:'none', border:'1.5px solid rgba(255,255,255,0.22)', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)', transition:'all 0.2s' }}>
                Take Wellness Assessment
              </Link>
            </div>

            <div style={{ display:'flex', flexWrap:'wrap', gap:20, padding:'16px 24px', background:'rgba(255,255,255,0.05)', borderRadius:16, border:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(8px)' }}>
              {['🔒 100% Anonymous','✦ Free to Join','💬 12,000+ Members','🛡️ Safe & Moderated'].map((t,i)=>(
                <span key={i} style={{ fontSize:13, color:'rgba(255,255,255,0.55)', fontWeight:500 }}>{t}</span>
              ))}
            </div>
          </div>

          <div className="hero-art float" style={{ position:'relative', minWidth:0, height:'clamp(500px,62vh,780px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CommunityIllustration/>
            <div style={{ position:'absolute', top:'8%', left:'2%', background:'rgba(15,10,36,0.75)', backdropFilter:'blur(16px)', border:'1px solid rgba(52,195,143,0.3)', borderRadius:16, padding:'10px 18px', zIndex:2, display:'flex', alignItems:'center', gap:10 }}>
              <span className="live-dot" style={{ width:9, height:9, borderRadius:'50%', background:GRN, display:'inline-block' }}/>
              <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>127 discussing anxiety right now</span>
            </div>
            <div style={{ position:'absolute', top:'35%', right:'0%', background:'rgba(255,255,255,0.07)', backdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'12px 16px', zIndex:2 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>New members today</div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>+84</div>
            </div>
            <div style={{ position:'absolute', bottom:'10%', right:'2%', background:'rgba(255,255,255,0.07)', backdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'14px 20px', zIndex:2, display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ display:'flex' }}>
                {[0,1,2,3].map(i=><div key={i} style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,hsl(${250+i*28},65%,62%),hsl(${275+i*22},55%,52%))`, border:'2px solid rgba(255,255,255,0.2)', marginLeft:i>0?-10:0 }}/>)}
              </div>
              <div>
                <div style={{ color:GOLD, fontSize:13, marginBottom:2 }}>★★★★★</div>
                <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>4.9/5</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>2,300+ members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#fff' }}>
        <div style={{ maxWidth:1800, margin:'0 auto' }}>
          <SectionHeader title="How SoulConnect Works" subtitle="Five simple steps from first visit to lasting transformation." />
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
            {HOW_STEPS.map((s,i) => (
              <div key={i} className="sc-card-hover" style={{ background:'#FAFAFC', borderRadius:24, padding:'32px 24px 28px', border:'1.5px solid #EDE9FE', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:18, right:18, width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${P},${LAV})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>{s.num}</div>
                <div style={{ fontSize:48, marginBottom:20 }}>{s.emoji}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0F0F1A', marginBottom:10, lineHeight:1.38 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.72 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#FAFAFC' }}>
        <div style={{ maxWidth:1800, margin:'0 auto' }}>
          <SectionHeader eyebrow="Real People. Real Healing." title="Community Success Stories" subtitle="These aren't testimonials. These are transformation journals." />
          <div className="three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="sc-card-hover" style={{ background:'#fff', borderRadius:28, padding:'36px 32px', border:'1.5px solid #EDE9FE', boxShadow:'0 2px 18px rgba(0,0,0,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 14px', borderRadius:20, background:'#F0EBFF', border:'1px solid #DDD6FE' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:P }}>{t.from} → {t.to}</span>
                  </div>
                  <div style={{ marginLeft:'auto', padding:'5px 12px', borderRadius:20, background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:GRN }}>{t.weeks} weeks</span>
                  </div>
                </div>
                <div style={{ fontSize:52, color:'#EDE9FE', fontFamily:'Georgia', lineHeight:1, marginBottom:16 }}>"</div>
                <p style={{ fontSize:16, color:'#374151', lineHeight:1.80, fontStyle:'italic', marginBottom:28 }}>{t.quote}</p>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <img src={t.img} alt={t.name} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2.5px solid #EDE9FE' }} loading="lazy"/>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#0F0F1A' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{t.city}</div>
                  </div>
                  <div style={{ marginLeft:'auto', color:GOLD, fontSize:14 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEALERS MARKETPLACE ── */}
      <section style={{ padding:'clamp(56px,6vw,88px) clamp(16px,2.5vw,52px)', background:'#fff' }}>
        <div style={{ maxWidth:1800, margin:'0 auto' }}>
          <SectionHeader eyebrow="When You Need More" title="Meet Our Healers" subtitle="Community first. Professionals when you need them. Verified Reiki practitioners, coaches, and wellness professionals." />
          <div className="three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {HEALERS.map((h,i) => (
              <div key={i} className="sc-card-hover" style={{ background:'#FAFAFC', borderRadius:24, padding:'28px 24px', border:'1.5px solid #EDE9FE', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:18 }}>
                  <img src={h.img} alt={h.name} style={{ width:64, height:64, borderRadius:20, objectFit:'cover', flexShrink:0, border:'2px solid #EDE9FE' }} loading="lazy"/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:16, fontWeight:700, color:'#0F0F1A', marginBottom:3 }}>{h.name}</div>
                    <div style={{ fontSize:12, color:'#9CA3AF', marginBottom:4 }}>{h.role}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ color:GOLD, fontSize:12 }}>★ {h.rating}</span>
                      <span style={{ fontSize:11, color:'#9CA3AF' }}>· {h.sessions} sessions</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:'#6B7280', marginBottom:16, lineHeight:1.6 }}>{h.spec}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:GRN, background:'#F0FDF4', padding:'4px 10px', borderRadius:20 }}>{h.avail}</span>
                  <Link to="/signup" style={{ padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${P},${LAV})`, boxShadow:'0 4px 14px rgba(109,74,255,0.3)' }}>Book ₹{h.price}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#FFFDF7' }}>
        <div style={{ maxWidth:1800, margin:'0 auto' }}>
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,5vw,80px)', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:P, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>Why We Exist</p>
              <div style={{ fontSize:80, color:`${P}18`, fontFamily:'Georgia', lineHeight:0.8, marginBottom:24 }}>"</div>
              <blockquote style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'clamp(1.1rem,1.8vw,1.5rem)', fontWeight:700, color:'#0F0F1A', lineHeight:1.6, fontStyle:'italic', marginBottom:28, borderLeft:`4px solid ${P}`, paddingLeft:24 }}>
                When I went through my own breakdown, I didn't want a prescription. I wanted someone who had been there. SoulConnect was built from that moment — the realisation that human connection heals in ways that clinical support alone cannot.
              </blockquote>
              <p style={{ fontSize:15, fontWeight:700, color:P }}>— Founder, SoulConnect</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { icon:'🤝', title:'Community First',       desc:'Professional help when needed. Human connection always.' },
                { icon:'🌱', title:'Prevention-Focused',    desc:'Support people BEFORE they hit crisis. That\'s where lasting change happens.' },
                { icon:'🇮🇳', title:'Made for India',        desc:'Built for the unique emotional challenges of Indian life — pressure, family, expectations, and silence.' },
              ].map((m,i) => (
                <div key={i} style={{ display:'flex', gap:18, padding:'22px 24px', background:'#fff', borderRadius:20, border:'1.5px solid #EDE9FE', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:'#F0EBFF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{m.icon}</div>
                  <div>
                    <h3 style={{ fontSize:16, fontWeight:700, color:'#0F0F1A', marginBottom:6 }}>{m.title}</h3>
                    <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background:'#fff' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about SoulConnect." />
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {FAQS.map((faq,i) => (
              <div key={i} style={{ background:'#fff', borderRadius:18, border: openFaq===i?`1.5px solid ${LAV}`:'1.5px solid #EDE9FE', overflow:'hidden', transition:'all 0.2s', boxShadow: openFaq===i?'0 6px 24px rgba(109,74,255,0.1)':'none' }}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 26px', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16 }}>
                  <span style={{ fontWeight:600, fontSize:16, color:'#0F0F1A' }}>{faq.q}</span>
                  <span style={{ width:30, height:30, borderRadius:'50%', background: openFaq===i?P:'#F0EBFF', color: openFaq===i?'#fff':P, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0, transition:'all 0.2s' }}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && <div style={{ padding:'0 26px 20px', color:'#6B7280', fontSize:15, lineHeight:1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'clamp(80px,9vw,128px) clamp(16px,2.5vw,52px)', background:'linear-gradient(148deg,#0F0A24 0%,#1E0B45 50%,#2A0D5E 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle,rgba(109,74,255,0.18) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:72, marginBottom:28 }}>🪷</div>
          <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'clamp(2.4rem,4.5vw,4.2rem)', fontWeight:800, color:'#fff', lineHeight:1.16, marginBottom:20, letterSpacing:'-0.025em' }}>
            Your Healing Journey<br/>
            <span style={{ background:`linear-gradient(135deg,${LAV},#C4B5FD 45%,${GOLD})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontStyle:'italic' }}>Starts Today.</span>
          </h2>
          <p style={{ fontSize:18, color:'rgba(255,255,255,0.52)', marginBottom:52, lineHeight:1.65 }}>Find people who understand. Heal together. Grow together.</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center' }}>
            <Link to="/signup" className="sc-btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'20px 56px', borderRadius:18, fontSize:18, fontWeight:700, color:'#0F0F1A', textDecoration:'none', background:'#fff', boxShadow:'0 10px 40px rgba(255,255,255,0.2)' }}>Find My Circle</Link>
            <Link to="/signup" className="sc-btn-ghost" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'20px 48px', borderRadius:18, fontSize:18, fontWeight:700, color:'#fff', textDecoration:'none', border:'2px solid rgba(255,255,255,0.28)', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(8px)', transition:'all 0.2s' }}>Join SoulConnect</Link>
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.3)', marginTop:24 }}>Free to join · Anonymous · 12,000+ already healing</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#F0F0EB', fontFamily:FONT }}>
        <div style={{ borderBottom:'1px solid #D8D8D0', padding:'20px clamp(16px,2.5vw,52px)' }}>
          <div style={{ maxWidth:1800, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:`linear-gradient(135deg,${P},${LAV})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🪷</div>
              <span style={{ fontSize:16, fontWeight:800, color:'#0F0F1A', letterSpacing:'-0.02em' }}>Soul<span style={{ color:P }}>Connect</span></span>
            </Link>
            <div style={{ display:'flex', flexWrap:'wrap', gap:0 }}>
              {['Community','Healers','Challenges','Events','Resources','Blog'].map((l,i,arr) => (
                <a key={i} href="#" style={{ fontSize:13, color:'#1a3d2e', fontWeight:500, textDecoration:'none', padding:'4px 14px', borderRight: i<arr.length-1?'1px solid #C8C8C0':'none', whiteSpace:'nowrap' }}
                  onMouseEnter={e=>{ e.currentTarget.style.color=P; }}
                  onMouseLeave={e=>{ e.currentTarget.style.color='#1a3d2e'; }}>{l}</a>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {[{label:'IG',title:'Instagram'},{label:'TW',title:'Twitter'},{label:'IN',title:'LinkedIn'},{label:'YT',title:'YouTube'}].map((s,i) => (
                <a key={i} href="#" title={s.title} style={{ width:36, height:36, borderRadius:'50%', background:'#1a3d2e', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, textDecoration:'none', transition:'background 0.2s', flexShrink:0 }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=P; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='#1a3d2e'; }}>{s.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:'14px clamp(16px,2.5vw,52px)' }}>
          <div style={{ maxWidth:1800, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:8 }}>
              {[
                { label:'Terms', to:'/terms' },
                { label:'Privacy', to:'/terms#privacy' },
                { label:'Safety Policy', to:'/safety' },
                { label:'Community Rules', to:'/community-rules' },
                { label:'Crisis Support 🆘', to:'/crisis-support', crisis: true },
              ].map((lk,i,arr) => (
                <React.Fragment key={i}>
                  <Link to={lk.to} style={{ fontSize:13, color: lk.crisis ? '#DC2626' : '#1a3d2e', fontWeight: lk.crisis ? 700 : 500, textDecoration:'none' }}
                    onMouseEnter={e=>{ e.currentTarget.style.color=P; }}
                    onMouseLeave={e=>{ e.currentTarget.style.color= lk.crisis ? '#DC2626' : '#1a3d2e'; }}>{lk.label}</Link>
                  <span style={{ color:'#C8C8C0', fontSize:13 }}>·</span>
                </React.Fragment>
              ))}
              {['Cookie Policy','Accessibility'].map((l,i) => (
                <React.Fragment key={i}>
                  <a href="#" style={{ fontSize:13, color:'#1a3d2e', fontWeight:500, textDecoration:'none' }}
                    onMouseEnter={e=>{ e.currentTarget.style.color=P; }}
                    onMouseLeave={e=>{ e.currentTarget.style.color='#1a3d2e'; }}>{l}</a>
                  {i<1 && <span style={{ color:'#C8C8C0', fontSize:13 }}>·</span>}
                </React.Fragment>
              ))}
            </div>
            <span style={{ fontSize:13, color:'#6B7280' }}>© 2025 SoulConnect Health Technologies · All rights reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
