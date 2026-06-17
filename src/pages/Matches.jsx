import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// ── Data ──────────────────────────────────────────────────────────────────────

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

const SOUL_STAGES = [
  { emoji: '🌱', label: 'Beginning',      desc: 'Awakening to the journey',   color: '#34C38F', glow: 'rgba(52,195,143,0.35)' },
  { emoji: '✨', label: 'Healing',         desc: 'Processing and releasing',   color: '#6D4AFF', glow: 'rgba(109,74,255,0.35)' },
  { emoji: '🌸', label: 'Growth',          desc: 'Expanding your awareness',   color: '#F5B841', glow: 'rgba(245,184,65,0.35)'  },
  { emoji: '🦋', label: 'Transformation', desc: 'Becoming your true self',    color: '#A78BFA', glow: 'rgba(167,139,250,0.35)' },
  { emoji: '🕊',  label: 'Inner Harmony', desc: 'Living in alignment',        color: '#34C38F', glow: 'rgba(52,195,143,0.35)'  },
];

const CIRCLES = [
  { id:1, title:'Anxiety Release Circle',   tag:'Anxiety',   members:24, sessions:48, energy:87, img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', tagColor:'#6D4AFF', next:'Today 7:00 PM' },
  { id:2, title:'Grief & Loss Support',     tag:'Grief',     members:18, sessions:32, energy:92, img:'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&q=80', tagColor:'#34C38F', next:'Tomorrow 6:30 PM' },
  { id:3, title:'Self Love Journey',        tag:'Self-Love', members:31, sessions:60, energy:95, img:'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80', tagColor:'#F5B841', next:'Sat 5:00 PM' },
];

const SESSIONS = [
  { id:1, name:'Dr. Meera Shah',  role:'Reiki Healer',       spec:'Energy Healing & Chakra Balance', rating:4.9, reviews:127, duration:'60 min', img:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80', available:'Today',    badge:'Top Rated', badgeColor:'#F5B841' },
  { id:2, name:'Rohit Verma',     role:'Meditation Guide',   spec:'Mindfulness & Breathwork',        rating:4.8, reviews:94,  duration:'45 min', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', available:'Tomorrow', badge:'Most Loved', badgeColor:'#34C38F' },
  { id:3, name:'Ananya Iyer',     role:'Spiritual Coach',    spec:'Soul Purpose & Life Clarity',     rating:4.9, reviews:156, duration:'60 min', img:'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=100&q=80', available:'Today',    badge:'New',        badgeColor:'#6D4AFF' },
];

const EVENTS = [
  { id:1, title:'Morning Stillness Meditation', time:'7:00 AM', date:'Today',    category:'Meditation', color:'#6D4AFF', bg:'#F0EBFF', icon:'🧘', spots:4  },
  { id:2, title:'Anxiety Support Circle',       time:'7:00 PM', date:'Today',    category:'Circle',     color:'#34C38F', bg:'#ECFDF5', icon:'🫂', spots:8  },
  { id:3, title:'Self-Compassion Workshop',     time:'11:00 AM', date:'Saturday', category:'Workshop',   color:'#F5B841', bg:'#FFFBEB', icon:'💛', spots:12 },
  { id:4, title:'Moon Ritual & Intention',      time:'8:30 PM', date:'Sunday',   category:'Ritual',     color:'#A78BFA', bg:'#FAF5FF', icon:'🌙', spots:6  },
];

const MEDITATIONS = [
  { title:'Morning Calm',         duration:'10 min', category:'Mindfulness', plays:'2.4k', color:'#6D4AFF' },
  { title:'Anxiety Relief',       duration:'15 min', category:'Healing',     plays:'3.1k', color:'#34C38F' },
  { title:'Sleep Preparation',    duration:'20 min', category:'Sleep',       plays:'5.2k', color:'#A78BFA' },
];

const MOODS = [
  { emoji:'😔', label:'Low',     value:1, color:'#6B7280' },
  { emoji:'😕', label:'Uneasy',  value:2, color:'#F59E0B' },
  { emoji:'😐', label:'Neutral', value:3, color:'#3B82F6' },
  { emoji:'🙂', label:'Good',    value:4, color:'#34C38F' },
  { emoji:'🌟', label:'Radiant', value:5, color:'#F5B841' },
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

// ── SVGs ──────────────────────────────────────────────────────────────────────

function AuraGlow({ size = 300, color = '#6D4AFF', opacity = 0.06 }) {
  return (
    <div style={{
      position: 'absolute', width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, pointerEvents: 'none',
    }} />
  );
}

function SacredGeometry({ size = 200, opacity = 0.04 }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 90) * Math.PI / 180;
    return [100 + 80 * Math.cos(a), 100 + 80 * Math.sin(a)];
  });
  const hex = pts.map(p => p.join(',')).join(' ');
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: size, height: size, opacity, pointerEvents: 'none' }}>
      <polygon points={hex} fill="none" stroke="#6D4AFF" strokeWidth="0.8" />
      {pts.map((p, i) => pts.slice(i + 1).map((p2, j) => (
        <line key={`${i}-${j}`} x1={p[0]} y1={p[1]} x2={p2[0]} y2={p2[1]} stroke="#6D4AFF" strokeWidth="0.3" opacity="0.5" />
      )))}
      <circle cx="100" cy="100" r="80" fill="none" stroke="#6D4AFF" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="#6D4AFF" strokeWidth="0.4" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="6" fill="#6D4AFF" opacity="0.3" />
    </svg>
  );
}

function LotusIcon({ size = 20, color = '#6D4AFF' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: size, height: size, flexShrink: 0 }}>
      <path d="M12,21C12,21 4,16 4,10C4,7 7,5 10,6.3C11,4 13,4 14,6.3C17,5 20,7 20,10C20,16 12,21 12,21Z" fill={`${color}20`} stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12,21C12,21 8,14.5 8,10C8,8 10,7 12,8.2C14,7 16,8 16,10C16,14.5 12,21 12,21Z" fill={`${color}35`} stroke={color} strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

function CircularProgress({ value, size = 52, strokeWidth = 4, color = '#6D4AFF' }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${circ * value / 100} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
      </div>
    </div>
  );
}

function StarRating({ value }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(value) ? '#F5B841' : '#E5E7EB', fontSize: 11 }}>★</span>
      ))}
    </div>
  );
}

// ── Breathing Widget ──────────────────────────────────────────────────────────

function BreathingWidget() {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const iRef = useRef(null);

  const PHASES = [
    { key: 'inhale',  label: 'Breathe In',  dur: 4, color: '#6D4AFF', scale: 1.4 },
    { key: 'hold',    label: 'Hold',         dur: 4, color: '#A78BFA', scale: 1.4 },
    { key: 'exhale',  label: 'Breathe Out', dur: 6, color: '#34C38F', scale: 1.0 },
  ];
  const cur = PHASES.find(p => p.key === phase) || PHASES[0];

  const start = () => {
    let pi = 0, c = 0;
    setPhase(PHASES[0].key); setCount(PHASES[0].dur);
    iRef.current = setInterval(() => {
      c++;
      if (c >= PHASES[pi].dur) { c = 0; pi = (pi + 1) % 3; setPhase(PHASES[pi].key); setCount(PHASES[pi].dur); }
      else setCount(PHASES[pi].dur - c);
    }, 1000);
  };
  const stop = () => { clearInterval(iRef.current); setPhase('idle'); };
  useEffect(() => () => clearInterval(iRef.current), []);

  const isActive = phase !== 'idle';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {isActive && <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: `${cur.color}15`, animation: 'scPulse 2s ease-in-out infinite' }} />}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: `2.5px solid ${isActive ? cur.color : '#E5E7EB'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.5s',
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%',
            background: isActive ? `radial-gradient(circle, ${cur.color}30, ${cur.color}15)` : '#F8F7FF',
            border: `2px solid ${isActive ? cur.color : '#EDE9FE'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${isActive ? cur.scale : 1})`,
            transition: `transform ${isActive ? (phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0.3) : 0.3}s ease-in-out, background 0.5s`,
          }}>
            <span style={{ fontSize: isActive ? 20 : 15, fontWeight: 800, color: isActive ? cur.color : '#A78BFA' }}>
              {isActive ? count : '🫁'}
            </span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {isActive ? (
          <>
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: cur.color }}>{cur.label}</p>
            <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
              {PHASES.map(p => <div key={p.key} style={{ flex: 1, height: 3, borderRadius: 2, background: p.key === phase ? p.color : '#E5E7EB', transition: 'background 0.3s' }} />)}
            </div>
            <button onClick={stop} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#F5F3FF', color: '#6D4AFF', border: '1px solid #EDE9FE', cursor: 'pointer' }}>Stop</button>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#1F1B3D' }}>4-4-6 Box Breathing</p>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>Calm your nervous system in 2 min</p>
            <button onClick={start} style={{ padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(109,74,255,0.3)' }}>Begin</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Matches() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();

  const today       = new Date();
  const hour        = today.getHours();
  const firstName   = user?.name?.split(' ')[0] || 'Beautiful Soul';
  const greeting    = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const quote       = QUOTES[today.getDate() % QUOTES.length];
  const affirmation = AFFIRMATIONS[today.getDate() % AFFIRMATIONS.length];
  const prompt      = JOURNAL_PROMPTS[today.getDate() % JOURNAL_PROMPTS.length];

  const [mood, setMood]     = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const saveMood = () => { if (mood === null) return; setMoodSaved(true); setTimeout(() => setMoodSaved(false), 3000); };
  const saveJournal = () => { if (!journalText.trim()) return; setJournalSaved(true); setTimeout(() => setJournalSaved(false), 3000); };

  // Inject fonts
  useEffect(() => {
    if (!document.getElementById('sc-fonts')) {
      const l = document.createElement('link');
      l.id = 'sc-fonts'; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,500&display=swap';
      document.head.appendChild(l);
    }
  }, []);

  const S = { // common style shortcuts
    card: {
      background: '#FFFFFF',
      borderRadius: 20,
      boxShadow: '0 12px 40px rgba(109,74,255,0.08)',
      border: '1px solid rgba(109,74,255,0.07)',
    },
    cardHover: { transition: 'transform 0.3s ease, box-shadow 0.3s ease' },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFC',
      fontFamily: "'Plus Jakarta Sans', Inter, -apple-system, sans-serif",
      color: '#1F1B3D',
      position: 'relative',
      overflowX: 'hidden',
    }}>

      {/* ── Global CSS ── */}
      <style>{`
        @keyframes scFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes scPulse    { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.18);opacity:0.15} }
        @keyframes scGlow     { 0%,100%{box-shadow:0 0 24px rgba(109,74,255,0.2)} 50%{box-shadow:0 0 48px rgba(109,74,255,0.5)} }
        @keyframes scRotate   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes scParticle { 0%{transform:translateY(0) translateX(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(-120px) translateX(30px);opacity:0} }
        .sc-card:hover { transform:translateY(-4px)!important; box-shadow:0 18px 50px rgba(109,74,255,0.15)!important; }
        .sc-card { transition:transform 0.3s ease,box-shadow 0.3s ease; }
        .sc-btn-grad { transition:transform 0.2s ease,box-shadow 0.2s ease; }
        .sc-btn-grad:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(109,74,255,0.38)!important; }
        .sc-circle-card:hover .sc-circle-img { transform:scale(1.06); }
        .sc-circle-img { transition:transform 0.4s ease; }
        .sc-session-card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(109,74,255,0.12)!important; }
        .sc-session-card { transition:transform 0.25s ease,box-shadow 0.25s ease; }
        .f1{animation:scFadeUp 0.5s 0.0s ease both}
        .f2{animation:scFadeUp 0.5s 0.08s ease both}
        .f3{animation:scFadeUp 0.5s 0.16s ease both}
        .f4{animation:scFadeUp 0.5s 0.24s ease both}
        .f5{animation:scFadeUp 0.5s 0.32s ease both}
        .f6{animation:scFadeUp 0.5s 0.40s ease both}
        @media(prefers-reduced-motion:reduce){.f1,.f2,.f3,.f4,.f5,.f6,.sc-card,.sc-btn-grad,.sc-session-card{animation:none!important;transition:none!important}}
      `}</style>

      {/* ── Ambient Background ── */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <AuraGlow size={600} color="#6D4AFF" opacity={0.04} style={{ position: 'absolute', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,74,255,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 200, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,195,143,0.04) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '5%', opacity: 0.035 }}>
          <SacredGeometry size={280} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '2%', opacity: 0.025 }}>
          <SacredGeometry size={200} opacity={1} />
        </div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${10 + i * 15}%`, bottom: `${20 + (i % 3) * 20}%`,
            width: 4, height: 4, borderRadius: '50%',
            background: i % 2 === 0 ? '#6D4AFF' : '#F5B841',
            animation: `scParticle ${4 + i * 0.8}s ${i * 1.2}s ease-in-out infinite`,
            opacity: 0.4,
          }} />
        ))}
      </div>

      {/* ── Page Content ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto', padding: '24px clamp(16px, 3vw, 48px) 100px' }}>

        {/* ══════════════════════════════════════════════════════
            HERO — Personalized Welcome
        ══════════════════════════════════════════════════════ */}
        <div className="f1" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, marginBottom: 20, alignItems: 'stretch' }}>

          {/* Left — Welcome */}
          <div style={{
            ...S.card,
            background: 'linear-gradient(140deg, #1F1B3D 0%, #2D2560 50%, #1F1B3D 100%)',
            padding: '36px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* orbs */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,74,255,0.35) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,184,65,0.12) 0%, transparent 70%)' }} />
            {/* Sacred geo bg */}
            <div style={{ position: 'absolute', right: 80, top: 20, opacity: 0.06, animation: 'scRotate 60s linear infinite' }}>
              <SacredGeometry size={220} opacity={1} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C38F', display: 'inline-block', boxShadow: '0 0 10px #34C38F', animation: 'scPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(167,139,250,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {greeting}, {firstName}
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(22px, 2.2vw, 32px)',
                fontWeight: 700, color: '#F9FAFB',
                lineHeight: 1.35, marginBottom: 12,
                letterSpacing: '-0.01em',
              }}>
                Your healing journey<br />
                <span style={{ color: '#A78BFA', fontStyle: 'italic' }}>continues today.</span>
              </h1>

              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                fontStyle: 'italic', color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7, marginBottom: 24, maxWidth: 420,
              }}>
                "{quote.text}" <span style={{ color: '#A78BFA', fontStyle: 'normal', fontSize: 12, fontWeight: 600 }}>— {quote.author}</span>
              </p>

              {/* Today's affirmation */}
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(167,139,250,0.25)',
                borderRadius: 16, padding: '14px 18px',
                backdropFilter: 'blur(8px)', marginBottom: 24,
              }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>✦ Today's Affirmation</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#F9FAFB', lineHeight: 1.55 }}>"{affirmation}"</p>
              </div>

              {/* Quick actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '🫂 Join a Circle', path: '/groups',  bg: 'linear-gradient(135deg, #6D4AFF, #A78BFA)' },
                  { label: '🧘 Meditate',       path: '/meetups', bg: 'rgba(255,255,255,0.1)' },
                  { label: '📔 Journal',         path: '/mood',    bg: 'rgba(255,255,255,0.1)' },
                ].map(a => (
                  <button key={a.label} onClick={() => navigate(a.path)} className="sc-btn-grad" style={{
                    padding: '9px 18px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: a.bg, color: '#fff',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    boxShadow: a.bg.includes('gradient') ? '0 6px 20px rgba(109,74,255,0.35)' : 'none',
                  }}>{a.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Daily Intention + Streak */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Healing streak */}
            <div style={{
              ...S.card,
              background: 'linear-gradient(150deg, #F5B841 0%, #FFD77A 100%)',
              padding: '22px 24px', flex: 1,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 80, opacity: 0.15 }}>🔥</div>
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: 'rgba(139,90,0,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Healing Streak</p>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#78350F', letterSpacing: '-0.04em', lineHeight: 1 }}>27</div>
              <p style={{ margin: '4px 0 12px', fontSize: 12, color: 'rgba(120,53,15,0.8)', fontWeight: 500 }}>consecutive days 🔥</p>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < 6 ? 'rgba(139,90,0,0.5)' : 'rgba(139,90,0,0.15)' }} />
                ))}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 10, color: 'rgba(120,53,15,0.7)', fontWeight: 600 }}>6/7 days this week</p>
            </div>

            {/* Community pulse */}
            <div style={{
              ...S.card,
              padding: '20px 22px', flex: 1,
              background: 'linear-gradient(150deg, #ECFDF5 0%, #D1FAE5 100%)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', right: -15, bottom: -15, fontSize: 72, opacity: 0.12 }}>🌍</div>
              <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#065F46', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Community Pulse</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: '#064E3B', letterSpacing: '-0.04em', lineHeight: 1 }}>1,247</span>
                <span style={{ fontSize: 12, color: '#34C38F', fontWeight: 700 }}>↑ 12%</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#065F46', fontWeight: 500 }}>souls healing right now</p>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SOUL JOURNEY
        ══════════════════════════════════════════════════════ */}
        <div className="f2 sc-card" style={{
          ...S.card,
          padding: '28px 32px',
          marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,184,65,0.06) 0%, transparent 70%)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 6px 16px rgba(109,74,255,0.3)' }}>✨</div>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F1B3D', letterSpacing: '-0.01em' }}>Soul Journey</h2>
                <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Your transformation path</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#6D4AFF' }}>73%</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Weekly Growth</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#34C38F' }}>8.4</div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600 }}>Wellness Score</div>
              </div>
            </div>
          </div>

          {/* Journey path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
            {/* Gold progress line */}
            <div style={{ position: 'absolute', top: 28, left: 28, right: 28, height: 3, background: '#E5E7EB', borderRadius: 2, zIndex: 0 }}>
              <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #F5B841, #FFD77A)', borderRadius: 2, boxShadow: '0 0 12px rgba(245,184,65,0.5)' }} />
            </div>

            {SOUL_STAGES.map((stage, i) => {
              const isActive = i === 1; // "Healing" stage is current
              const isDone   = i === 0;
              const isLocked = i > 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: isDone ? 'linear-gradient(135deg, #F5B841, #FFD77A)' : isActive ? `linear-gradient(135deg, ${stage.color}, ${stage.glow.replace('0.35', '1')})` : '#F9FAFB',
                    border: `2.5px solid ${isActive ? stage.color : isDone ? '#F5B841' : '#E5E7EB'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                    boxShadow: isActive ? `0 0 24px ${stage.glow}, 0 8px 20px ${stage.glow}` : isDone ? '0 4px 16px rgba(245,184,65,0.3)' : 'none',
                    animation: isActive ? 'scGlow 3s ease-in-out infinite' : 'none',
                    transition: 'all 0.3s',
                    opacity: isLocked ? 0.45 : 1,
                  }}>
                    {stage.emoji}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: isActive ? 800 : 600, color: isActive ? stage.color : isLocked ? '#9CA3AF' : '#374151' }}>
                      {stage.label}
                      {isActive && <span style={{ marginLeft: 4, fontSize: 9, background: stage.color, color: '#fff', padding: '1px 6px', borderRadius: 20, fontWeight: 700 }}>YOU</span>}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: '#9CA3AF' }}>{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 14, background: '#F8F7FF', border: '1px solid #EDE9FE', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1F1B3D' }}>Healing Stage Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6D4AFF' }}>42%</span>
              </div>
              <div style={{ height: 7, background: '#EDE9FE', borderRadius: 4 }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #6D4AFF, #A78BFA)', borderRadius: 4, boxShadow: '0 0 10px rgba(109,74,255,0.4)' }} />
              </div>
            </div>
            <div style={{ fontSize: 22 }}>✨</div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            KPI STATS
        ══════════════════════════════════════════════════════ */}
        <div className="f3" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { icon:'🫂', value:8,  label:'Circles Joined',    sub:'Active member',   color:'#6D4AFF', bg:'linear-gradient(150deg,#F0EBFF,#EDE9FE)' },
            { icon:'✨', value:24, label:'People Connected',  sub:'Beautiful souls',  color:'#3B82F6', bg:'linear-gradient(150deg,#EFF6FF,#DBEAFE)' },
            { icon:'🧘', value:12, label:'Sessions Attended', sub:"You're growing",   color:'#34C38F', bg:'linear-gradient(150deg,#ECFDF5,#D1FAE5)' },
            { icon:'🌱', value:27, label:'Days on Journey',   sub:'Keep going',       color:'#F5B841', bg:'linear-gradient(150deg,#FFFBEB,#FEF3C7)' },
          ].map((s, i) => (
            <div key={i} className="sc-card" style={{ ...S.card, padding: '20px', background: s.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: `0 4px 14px ${s.color}20` }}>{s.icon}</div>
                <CircularProgress value={Math.min(s.value * 3.5, 99)} size={46} strokeWidth={3.5} color={s.color} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F1B3D', marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            HEALING CIRCLES
        ══════════════════════════════════════════════════════ */}
        <div className="f3" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <LotusIcon size={20} color="#6D4AFF" />
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F1B3D', letterSpacing: '-0.01em' }}>Healing Circles</h2>
                <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>Safe spaces to share and transform</p>
              </div>
            </div>
            <Link to="/groups" style={{ fontSize: 12, fontWeight: 700, color: '#6D4AFF', textDecoration: 'none', padding: '7px 14px', borderRadius: 10, background: '#F0EBFF', border: '1px solid #EDE9FE' }}>View all →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {CIRCLES.map(c => (
              <div key={c.id} className="sc-card sc-circle-card" style={{ ...S.card, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate('/groups')}>
                {/* Image */}
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img src={c.img} alt={c.title} className="sc-circle-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(31,27,61,0.7) 100%)' }} />
                  <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: c.tagColor, color: '#fff', boxShadow: `0 4px 12px ${c.tagColor}60` }}>{c.tag}</span>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C38F', boxShadow: '0 0 6px #34C38F' }} />
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>Energy {c.energy}%</span>
                  </div>
                </div>

                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#1F1B3D', letterSpacing: '-0.01em' }}>{c.title}</h3>
                  <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>👥 {c.members} members</span>
                    <span style={{ fontSize: 11, color: '#6B7280' }}>🧘 {c.sessions} sessions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C38F', display: 'inline-block' }} />
                      <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{c.next}</span>
                    </div>
                    <button style={{ padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(109,74,255,0.3)' }}>Join</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SUGGESTED SESSIONS + EVENTS (two-col)
        ══════════════════════════════════════════════════════ */}
        <div className="f4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Healing Sessions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <LotusIcon size={18} color="#34C38F" />
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1F1B3D' }}>Suggested Sessions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SESSIONS.map(s => (
                <div key={s.id} className="sc-session-card" style={{ ...S.card, padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={s.img} alt={s.name} style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover', border: '2px solid #EDE9FE' }} loading="lazy" />
                    <div style={{ position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: '#34C38F', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 7, color: '#fff', fontWeight: 800 }}>✓</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#1F1B3D' }}>{s.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: `${s.badgeColor}20`, color: s.badgeColor, flexShrink: 0, marginLeft: 6 }}>{s.badge}</span>
                    </div>
                    <p style={{ margin: '0 0 5px', fontSize: 11, color: '#6B7280' }}>{s.role} · {s.spec}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StarRating value={s.rating} />
                      <span style={{ fontSize: 10, color: '#6B7280' }}>{s.rating} ({s.reviews})</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>⏱ {s.duration}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/healers')} style={{ padding: '8px 14px', borderRadius: 11, fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 14px rgba(109,74,255,0.3)', whiteSpace: 'nowrap' }}>Book</button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Timeline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LotusIcon size={18} color="#F5B841" />
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#1F1B3D' }}>Upcoming Events</h2>
              </div>
              <Link to="/meetups" style={{ fontSize: 11, fontWeight: 700, color: '#6D4AFF', textDecoration: 'none' }}>See all</Link>
            </div>

            <div style={{ ...S.card, padding: '8px 20px' }}>
              {EVENTS.map((ev, i) => (
                <div key={ev.id} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < EVENTS.length - 1 ? '1px solid #F5F3FF' : 'none', cursor: 'pointer' }} onClick={() => navigate('/meetups')}>
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: ev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ev.icon}</div>
                    {i < EVENTS.length - 1 && <div style={{ width: 1, flex: 1, background: '#EDE9FE', marginTop: 6 }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1F1B3D', lineHeight: 1.3, paddingRight: 8 }}>{ev.title}</p>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: ev.bg, color: ev.color, flexShrink: 0 }}>{ev.category}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>📅 {ev.date} · {ev.time}</span>
                      <span style={{ fontSize: 11, color: ev.color, fontWeight: 600 }}>{ev.spots} spots left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MEDITATION + MOOD + JOURNAL (three-col)
        ══════════════════════════════════════════════════════ */}
        <div className="f5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>

          {/* Meditation */}
          <div style={{
            ...S.card,
            background: 'linear-gradient(150deg, #1F1B3D 0%, #2D2560 100%)',
            borderRadius: 20, overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,74,255,0.3) 0%, transparent 70%)' }} />
            <div style={{ padding: '22px 22px 18px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>🎧</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>Daily Meditation</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#A78BFA' }}>12-day listening streak 🔥</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MEDITATIONS.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }} onClick={() => navigate('/meetups')}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `${m.color}30`, border: `1px solid ${m.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>▶</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#F9FAFB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#A78BFA' }}>{m.duration} · {m.plays} plays</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/meetups')} style={{ marginTop: 14, width: '100%', padding: '10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: 'rgba(109,74,255,0.4)', color: '#C4B5FD', border: '1px solid rgba(109,74,255,0.3)', cursor: 'pointer' }}>
                Explore All Meditations →
              </button>
            </div>
          </div>

          {/* Mood Tracker */}
          <div style={{ ...S.card, padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🌈</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1F1B3D' }}>Mood Check-In</p>
                <p style={{ margin: 0, fontSize: 10, color: '#34C38F', fontWeight: 600 }}>↑ 12% better than last week</p>
              </div>
            </div>

            {moodSaved ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>{MOODS[mood]?.emoji}</div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: MOODS[mood]?.color }}>Logged as {MOODS[mood]?.label} ✓</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9CA3AF' }}>Your mood has been recorded</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 14 }}>
                  {MOODS.map((m, i) => (
                    <button key={i} onClick={() => setMood(i)} style={{
                      flex: 1, padding: '8px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: mood === i ? `${m.color}18` : '#F8F9FC',
                      outline: mood === i ? `2px solid ${m.color}` : '2px solid transparent',
                      transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    }}>
                      <span style={{ fontSize: mood === i ? 22 : 18, transition: 'font-size 0.15s' }}>{m.emoji}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: mood === i ? m.color : '#9CA3AF' }}>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Mini trend bars */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: '#6B7280' }}>THIS WEEK</p>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 36 }}>
                    {[3,2,4,3,5,4,3].map((v, i) => (
                      <div key={i} style={{ flex: 1, borderRadius: 4, background: i === 6 ? '#6D4AFF' : '#EDE9FE', height: `${v * 20}%`, minHeight: 6, transition: 'height 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    {['M','T','W','T','F','S','T'].map((d, i) => <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#9CA3AF' }}>{d}</span>)}
                  </div>
                </div>

                <button onClick={saveMood} disabled={mood === null} style={{
                  width: '100%', padding: '11px', borderRadius: 12, border: 'none',
                  background: mood !== null ? 'linear-gradient(135deg, #6D4AFF, #A78BFA)' : '#F3F4F6',
                  color: mood !== null ? '#fff' : '#9CA3AF', fontSize: 12, fontWeight: 700,
                  cursor: mood !== null ? 'pointer' : 'default',
                  boxShadow: mood !== null ? '0 4px 14px rgba(109,74,255,0.28)' : 'none',
                  transition: 'all 0.18s',
                }}>Log Mood</button>
              </>
            )}
          </div>

          {/* Breathing */}
          <div style={{ ...S.card, padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18 }}>🌬️</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1F1B3D' }}>Box Breathing</p>
                <p style={{ margin: 0, fontSize: 10, color: '#6B7280' }}>4-4-6 · Calm your nervous system</p>
              </div>
            </div>
            <BreathingWidget />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            JOURNAL + ANGEL NUMBER (two-col)
        ══════════════════════════════════════════════════════ */}
        <div className="f6" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>

          {/* Journal */}
          <div style={{
            ...S.card,
            background: 'linear-gradient(150deg, #FFFBF0 0%, #FFF8E7 100%)',
            padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.06, transform: 'rotate(-15deg)' }}>📔</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: '#F5B841', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📔</div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1F1B3D' }}>Soul Journal</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#D97706', fontWeight: 600 }}>5-day writing streak 🔥</p>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '4px 10px', borderRadius: 20 }}>Reflect · Release · Renew</span>
            </div>

            <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(245,184,65,0.1)', border: '1px solid rgba(245,184,65,0.25)', marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#D97706', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Today's Prompt</p>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: '#1F1B3D', fontStyle: 'italic', lineHeight: 1.65, fontWeight: 600 }}>"{prompt}"</p>
            </div>

            {journalSaved ? (
              <div style={{ textAlign: 'center', padding: '20px', borderRadius: 14, background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                <span style={{ fontSize: 28 }}>🌱</span>
                <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, color: '#065F46' }}>Entry saved. Keep growing. ✓</p>
              </div>
            ) : (
              <>
                <textarea
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  placeholder="Begin writing here... this is your sacred space 🌸"
                  style={{
                    width: '100%', minHeight: 100, padding: '14px 16px', borderRadius: 14,
                    border: '1.5px solid rgba(245,184,65,0.3)', background: 'rgba(255,255,255,0.8)',
                    fontSize: 13, color: '#1F1B3D', lineHeight: 1.65, resize: 'vertical',
                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={saveJournal} disabled={!journalText.trim()} style={{
                    flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: journalText.trim() ? 'pointer' : 'default',
                    background: journalText.trim() ? 'linear-gradient(135deg, #F5B841, #FFD77A)' : '#F3F4F6',
                    color: journalText.trim() ? '#78350F' : '#9CA3AF', fontSize: 12, fontWeight: 700,
                    boxShadow: journalText.trim() ? '0 4px 14px rgba(245,184,65,0.35)' : 'none', transition: 'all 0.18s',
                  }}>Save Entry →</button>
                  <button onClick={() => navigate('/mood')} style={{ padding: '11px 18px', borderRadius: 12, border: '1.5px solid #FDE68A', background: 'transparent', color: '#D97706', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Full Journal
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Angel Number */}
          <div style={{
            ...S.card,
            background: 'linear-gradient(160deg, #1F1B3D 0%, #312E81 60%, #1F1B3D 100%)',
            padding: '24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,74,255,0.4) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,184,65,0.15) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.08, animation: 'scRotate 40s linear infinite' }}>
              <SacredGeometry size={160} opacity={1} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 16 }}>🌟</span>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Today's Angel Number</p>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 64, fontWeight: 900, color: '#FFD77A', letterSpacing: '-0.06em', lineHeight: 1, textShadow: '0 0 40px rgba(255,215,122,0.6), 0 0 80px rgba(255,215,122,0.3)', animation: 'scGlow 3s ease-in-out infinite' }}>
                  444
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 8 }}>Protection & Guidance</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(167,139,250,0.2)', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(233,230,255,0.85)', lineHeight: 1.65, fontStyle: 'italic' }}>
                  "You are surrounded by angels. Trust the path you're walking. Your guides are close."
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                {[0,1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === 3 ? '#FFD77A' : 'rgba(255,255,255,0.2)', boxShadow: i === 3 ? '0 0 8px rgba(255,215,122,0.8)' : 'none' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
