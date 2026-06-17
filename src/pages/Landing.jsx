import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────────

const P = '#6D4AFF', LAV = '#A78BFA', GRN = '#34C38F', GOLD = '#F5B841';

const NAV_LINKS = ['Community', 'Healers', 'Challenges', 'Events', 'Resources'];

const STATS = [
  { icon: '👥', value: '12,000+', label: 'Lives Touched' },
  { icon: '🧘', value: '500+',    label: 'Wellness Pros' },
  { icon: '💬', value: '10,000+', label: 'Daily Conversations' },
  { icon: '🔒', value: '100%',    label: 'Anonymous & Safe' },
];

const CATEGORIES = [
  { icon: '💔', label: 'Breakup &\nHeartbreak',     members: 3421, circles: 12, color: '#E11D48', bg: '#FFF1F2', iconBg: '#FFE4E6' },
  { icon: '🧠', label: 'Anxiety &\nOverthinking',   members: 5892, circles: 18, color: '#7C3AED', bg: '#F5F3FF', iconBg: '#EDE9FE' },
  { icon: '🌧',  label: 'Grief &\nLoss',            members: 2156, circles: 9,  color: '#2563EB', bg: '#EFF6FF', iconBg: '#DBEAFE' },
  { icon: '😔', label: 'Loneliness',                members: 4337, circles: 15, color: '#0891B2', bg: '#ECFEFF', iconBg: '#CFFAFE' },
  { icon: '💼', label: 'Career Stress',             members: 2891, circles: 11, color: '#D97706', bg: '#FFFBEB', iconBg: '#FEF3C7' },
  { icon: '😴', label: 'Sleep Problems',            members: 1743, circles: 7,  color: '#9333EA', bg: '#FAF5FF', iconBg: '#F3E8FF' },
  { icon: '😞', label: 'Depression\nSupport',       members: 3128, circles: 13, color: '#1D4ED8', bg: '#EFF6FF', iconBg: '#DBEAFE' },
  { icon: '💬', label: 'Relationship\nChallenges',  members: 2674, circles: 10, color: '#BE185D', bg: '#FDF2F8', iconBg: '#FCE7F3' },
];

const LIVE_ACTIVITY = [
  { n: 127, label: 'people discussing anxiety right now',    color: '#7C3AED', bg: '#F5F3FF' },
  { n: 84,  label: 'healing after heartbreak',              color: '#E11D48', bg: '#FFF1F2' },
  { n: 53,  label: 'navigating grief together',             color: '#2563EB', bg: '#EFF6FF' },
  { n: 210, label: 'building self-confidence',              color: GRN,       bg: '#F0FDF4' },
  { n: 98,  label: 'working on better sleep',               color: '#9333EA', bg: '#FAF5FF' },
  { n: 163, label: 'on their healing journey today',        color: GOLD,      bg: '#FFFBEB' },
];

const CHALLENGES = [
  { icon: '🌬️', label: '3-Min Breathing',    desc: 'Reset your nervous system with conscious breath.',       joined: 2847, dur: '3 min',  color: '#0891B2', bg: '#ECFEFF' },
  { icon: '🙏',  label: 'Gratitude Practice', desc: 'Write 3 things you are grateful for today.',             joined: 1923, dur: '5 min',  color: GRN,       bg: '#F0FDF4' },
  { icon: '📝',  label: 'Journal Reflection', desc: 'Express what is on your heart with guided prompts.',     joined: 1445, dur: '10 min', color: P,         bg: '#F5F3FF' },
  { icon: '🚶',  label: '10-Min Mindful Walk',desc: 'Move your body and clear your mind.',                    joined: 2156, dur: '10 min', color: '#D97706', bg: '#FFFBEB' },
  { icon: '💧',  label: 'Hydration Challenge', desc: 'Drink 8 glasses of water to support your healing.',     joined: 987,  dur: 'All day', color: '#0284C7', bg: '#F0F9FF' },
  { icon: '🎧',  label: '5-Min Meditation',   desc: 'A guided session to ground and center yourself.',        joined: 3421, dur: '5 min',  color: '#9333EA', bg: '#FAF5FF' },
];

const SOUL_STAGES = [
  { emoji: '🌱', title: 'Beginning',      members: 12847, desc: 'Your first courageous step',            color: GRN,     active: true },
  { emoji: '✨', title: 'Awareness',      members: 8423,  desc: 'Understanding your patterns',           color: LAV },
  { emoji: '🌸', title: 'Healing',        members: 5891,  desc: 'Releasing what no longer serves you',   color: '#F472B6' },
  { emoji: '🦋', title: 'Growth',         members: 3267,  desc: 'Becoming who you are meant to be',      color: GOLD },
  { emoji: '🕊️', title: 'Transformation', members: 1834,  desc: 'Living in peace and alignment',         color: '#60A5FA' },
];

const HOW_STEPS = [
  { num: '01', emoji: '🎯', title: 'Choose What You\'re Going Through', desc: 'Select from 25+ life challenges. You\'ll instantly see thousands of people on the same path.' },
  { num: '02', emoji: '🤝', title: 'Get Matched With People Who Understand', desc: 'Our algorithm connects you with peers who have faced the same challenges — not strangers, but kindred spirits.' },
  { num: '03', emoji: '💬', title: 'Join Conversations, Circles & Challenges', desc: 'Participate in group healing sessions, live circles, daily challenges, and private conversations.' },
  { num: '04', emoji: '📈', title: 'Track Your Growth & Healing Journey', desc: 'Watch your mood improve, streaks grow, and milestones accumulate on your personal Soul Journey dashboard.' },
  { num: '05', emoji: '🧘', title: 'Seek Expert Support If Needed', desc: 'When you\'re ready for deeper guidance, connect with verified Reiki healers, coaches, and wellness professionals.' },
];

const TESTIMONIALS = [
  {
    name: 'Riya, 24', city: 'Mumbai', from: 'Heartbreak', to: 'Healing', weeks: 8,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    quote: 'I was shattered after my breakup. I didn\'t want therapy — I wanted someone who just got it. SoulConnect gave me 12 people who had felt exactly what I was feeling. I haven\'t felt alone since week one.',
  },
  {
    name: 'Arjun, 27', city: 'Bangalore', from: 'Anxiety', to: 'Calm', weeks: 12,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    quote: 'My anxiety made me feel like I was broken. My SoulConnect circle showed me I wasn\'t — they were all carrying the same weight. We helped each other breathe again. Literally.',
  },
  {
    name: 'Priya, 31', city: 'Delhi', from: 'Grief', to: 'Peace', weeks: 16,
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80',
    quote: 'After my dad passed, I felt like no one could understand. The grief circle on SoulConnect became my new family. They didn\'t try to fix me. They just stayed. That was everything.',
  },
];

const HEALERS = [
  { name: 'Dr. Meera Shah',  role: 'Reiki Healer · 8+ Years', spec: 'Trauma, Anxiety, Energy Healing', rating: 4.9, sessions: 847,  img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80', avail: 'Available Today' },
  { name: 'Rohit Verma',     role: 'Wellness Coach · 6+ Years', spec: 'Grief, Stress, Life Transitions', rating: 4.8, sessions: 623,  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', avail: 'Next: Tomorrow' },
  { name: 'Ananya Iyer',     role: 'Meditation Teacher · 5+ Years', spec: 'Mindfulness, Breathwork, Growth', rating: 4.9, sessions: 912, img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=80&q=80', avail: 'Available Today' },
];

const EVENTS = [
  { title: 'Morning Healing Meditation', host: 'Dr. Meera Shah', time: 'Today · 7:00 AM', type: 'Meditation', joined: 47, limit: 60, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=70', typeColor: P },
  { title: 'Breathwork for Anxiety',     host: 'Ananya Iyer',    time: 'Today · 8:00 PM', type: 'Breathwork', joined: 32, limit: 40, img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=500&q=70', typeColor: GRN },
  { title: 'Heartbreak Healing Circle',  host: 'Rohit Verma',    time: 'Tomorrow · 7:00 PM', type: 'Circle', joined: 18, limit: 25, img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=70', typeColor: '#E11D48' },
  { title: 'Sound Healing Journey',      host: 'Dr. Meera Shah', time: 'Sunday · 6:00 PM', type: 'Sound Healing', joined: 28, limit: 30, img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=500&q=70', typeColor: GOLD },
];

const FAQS = [
  { q: 'What is SoulConnect?', a: 'SoulConnect is a community-driven healing platform where people facing similar life challenges connect, support each other, and heal together. Professional healers are available when you need deeper support, but community comes first.' },
  { q: 'How is SoulConnect different from therapy?', a: 'SoulConnect is a peer support community, not a therapy service. We connect you with people who have faced the same challenges — people who truly understand. Therapy focuses on clinical treatment; we focus on human connection and community healing.' },
  { q: 'Is SoulConnect completely anonymous?', a: 'Yes. You can participate using a username with no real name required. Your personal information is never shared with other community members without your consent.' },
  { q: 'How does the matching work?', a: 'When you tell us what you\'re going through, our system matches you with people in similar situations. You\'re connected to conversations, circles, and challenges that align with your specific journey.' },
  { q: 'What are Healing Circles?', a: 'Healing Circles are small group sessions (8–20 people) facilitated by our community leaders. They can be topic-based (grief, anxiety) or goal-based (breathwork, meditation). They happen live and are recorded for members who miss them.' },
  { q: 'What is the Soul Journey?', a: 'The Soul Journey is SoulConnect\'s personal growth framework — a five-stage path from Beginning to Transformation. You progress through stages as you complete challenges, attend circles, and contribute to the community.' },
  { q: 'What if I\'m in crisis?', a: 'SoulConnect is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact emergency services (112) or a mental health helpline immediately. We care about your safety above all.' },
  { q: 'Are the wellness professionals verified?', a: 'Yes. All practitioners on SoulConnect are reviewed for credentials, experience, certifications, and background before being listed. Verification requirements vary by service type.' },
  { q: 'Is SoulConnect free to use?', a: 'Community features — circles, conversations, challenges, and the Soul Journey — are free to join. Professional sessions are paid separately. Premium membership unlocks additional features and unlimited access.' },
];

// Deterministic particles
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: 8  + (i * 43 + i * i *  7) % 544,
  y: 10 + (i * 67 + i * i * 13) % 600,
  r: 0.8 + (i % 5) * 0.5,
  op: 0.09 + (i % 6) * 0.07,
  dur: 3.5 + (i % 5) * 1.3,
  del: (i % 8) * 0.55,
  col: i % 3 === 0 ? GOLD : i % 3 === 1 ? LAV : '#93C5FD',
}));

// ── Community Illustration ────────────────────────────────────────────────────

const FIGURES = [
  { x: 280, y: 110, body: '#C4B5FD', head: '#EDE9FE', glow: P },
  { x: 448, y: 205, body: '#FDE68A', head: '#FEF3C7', glow: GOLD },
  { x: 410, y: 430, body: '#A7F3D0', head: '#D1FAE5', glow: GRN },
  { x: 150, y: 430, body: '#FBCFE8', head: '#FCE7F3', glow: '#F472B6' },
  { x: 112, y: 205, body: '#BAE6FD', head: '#E0F2FE', glow: '#38BDF8' },
];
const CX = 280, CY = 295;

function CommunityIllustration() {
  const lotusPetals8 = [0, 45, 90, 135, 180, 225, 270, 315];
  const lotusPetals8i = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

  return (
    <svg viewBox="0 0 560 620" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <radialGradient id="ci-bg" cx="50%" cy="44%" r="55%">
          <stop offset="0%"   stopColor={P}   stopOpacity="0.22" />
          <stop offset="50%"  stopColor="#1E0B45" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#0F0A24" stopOpacity="0"   />
        </radialGradient>
        <radialGradient id="ci-gold" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#FEF9C3" />
          <stop offset="55%"  stopColor={GOLD}    />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="ci-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={GOLD} stopOpacity="0.35" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"    />
        </radialGradient>
        <filter id="ci-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="ci-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* BG glow */}
      <ellipse cx="280" cy="295" rx="270" ry="310" fill="url(#ci-bg)" />

      {/* Concentric sacred rings */}
      {[230, 188, 146].map((r, i) => (
        <circle key={i} cx={CX} cy={CY} r={r}
          fill="none"
          stroke={`rgba(167,139,250,${0.06 + i * 0.02})`}
          strokeWidth={i === 0 ? 0.6 : 0.9}
          strokeDasharray={i === 1 ? '5 9' : 'none'}
        />
      ))}

      {/* Pentagram connections between figures */}
      {FIGURES.map((f, i) => {
        const f2 = FIGURES[(i + 2) % 5];
        return <line key={i} x1={f.x} y1={f.y} x2={f2.x} y2={f2.y}
          stroke="rgba(196,181,253,0.055)" strokeWidth="0.8" />;
      })}

      {/* Energy lines from each figure to center */}
      {FIGURES.map((f, i) => {
        const cpx = (f.x + CX) / 2 + (i % 2 === 0 ? 22 : -22);
        const cpy = (f.y + CY) / 2 + (i % 3 === 0 ? -20 : 14);
        const path = `M ${f.x} ${f.y} Q ${cpx} ${cpy} ${CX} ${CY}`;
        return (
          <path key={i} d={path}
            stroke={f.glow} strokeWidth="1.5" fill="none"
            opacity="0.38" strokeDasharray="5 8">
            <animate attributeName="stroke-dashoffset"
              values="0;-52;0"
              dur={`${3.2 + i * 0.7}s`}
              begin={`${i * 0.45}s`}
              repeatCount="indefinite" />
          </path>
        );
      })}

      {/* Figures */}
      {FIGURES.map((f, i) => {
        const angle = Math.atan2(CY - f.y, CX - f.x);
        return (
          <g key={i}>
            {/* Aura */}
            <circle cx={f.x} cy={f.y} r={44} fill={f.glow} opacity="0.08" />
            <circle cx={f.x} cy={f.y} r={29} fill={f.glow} opacity="0.10" filter="url(#ci-soft)" />
            {/* Arms toward center */}
            {[-0.55, 0.55].map((offset, j) => {
              const a = angle + offset;
              return <line key={j}
                x1={f.x + 13 * Math.cos(a + Math.PI / 2)}
                y1={f.y + 14 + 13 * Math.sin(a + Math.PI / 2)}
                x2={f.x + 13 * Math.cos(a + Math.PI / 2) + 24 * Math.cos(angle)}
                y2={f.y + 14 + 13 * Math.sin(a + Math.PI / 2) + 24 * Math.sin(angle)}
                stroke={f.body} strokeWidth="5" strokeLinecap="round" opacity="0.75" />;
            })}
            {/* Body */}
            <ellipse cx={f.x} cy={f.y + 14} rx={13} ry={20} fill={f.body} opacity="0.92" />
            {/* Head */}
            <circle cx={f.x} cy={f.y - 14} r={14} fill={f.head} opacity="0.95" filter="url(#ci-soft)" />
            {/* Heart dot */}
            <circle cx={f.x} cy={f.y + 4} r={4.5} fill={f.glow} opacity="0.55">
              <animate attributeName="opacity" values="0.35;0.75;0.35"
                dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Center lotus */}
      {lotusPetals8.map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const px = CX + 34 * Math.cos(a), py = CY + 20 * Math.sin(a);
        return <ellipse key={i} cx={px} cy={py} rx={10} ry={22}
          fill="url(#ci-gold)" opacity={0.52 + (i % 3) * 0.12}
          transform={`rotate(${deg},${px},${py})`} filter="url(#ci-glow)" />;
      })}
      {lotusPetals8i.map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const px = CX + 17 * Math.cos(a), py = CY + 11 * Math.sin(a);
        return <ellipse key={i} cx={px} cy={py} rx={7} ry={15}
          fill="url(#ci-gold)" opacity={0.78}
          transform={`rotate(${deg},${px},${py})`} />;
      })}
      <circle cx={CX} cy={CY} r={18} fill="url(#ci-center)" />
      <circle cx={CX} cy={CY} r={12} fill={GOLD} opacity="0.9" filter="url(#ci-glow)" />
      <circle cx={CX} cy={CY} r={5}  fill="#FEF9C3" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity={p.op}>
          <animate attributeName="cy" values={`${p.y};${p.y - 18};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${p.op};${Math.min(p.op + 0.2, 0.55)};${p.op}`}
            dur={`${p.dur * 0.8}s`} begin={`${p.del}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

// ── Reusable ───────────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 52 }}>
      {eyebrow && (
        <p style={{ fontSize: 12, fontWeight: 700, color: light ? LAV : P, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1.9rem, 3.2vw, 2.9rem)', fontWeight: 800, color: light ? '#fff' : '#0F0F1A', letterSpacing: '-0.025em', margin: '0 auto 16px', maxWidth: center ? 620 : 'none', lineHeight: 1.2 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 17, color: light ? 'rgba(255,255,255,0.58)' : '#6B7280', maxWidth: center ? 560 : 'none', margin: center ? '0 auto' : 0, lineHeight: 1.72 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FAQ({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 18, border: open === i ? `1.5px solid ${LAV}` : '1.5px solid #EDE9FE', overflow: 'hidden', transition: 'all 0.2s', boxShadow: open === i ? '0 6px 24px rgba(109,74,255,0.1)' : 'none' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: '#0F0F1A', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{faq.q}</span>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: open === i ? P : '#F0EBFF', color: open === i ? '#fff' : P, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 26px 20px', color: '#6B7280', fontSize: 15, lineHeight: 1.8, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = ['sc-pjs', 'sc-playfair'];
    const hrefs = [
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap',
    ];
    ids.forEach((id, i) => {
      if (!document.getElementById(id)) {
        const l = document.createElement('link');
        l.id = id; l.rel = 'stylesheet'; l.href = hrefs[i];
        document.head.appendChild(l);
      }
    });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FONT = "'Plus Jakarta Sans', Inter, -apple-system, sans-serif";

  return (
    <div style={{ fontFamily: FONT, background: '#FAFAFC', color: '#0F0F1A', overflowX: 'hidden' }}>

      <style>{`
        * { box-sizing: border-box; }
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
        .sc-challenge-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(109,74,255,0.12) !important; }
        .sc-challenge-card { transition: transform 0.2s, box-shadow 0.2s; }
        .live-dot { animation: livePulse 2s ease-in-out infinite; }
        @media (max-width: 900px) {
          .hero-grid  { grid-template-columns: 1fr !important; }
          .hero-art   { display: none !important; }
          .two-col    { grid-template-columns: 1fr !important; }
          .three-col  { grid-template-columns: 1fr 1fr !important; }
          .footer-grid{ grid-template-columns: 1fr 1fr !important; }
          .soul-stages { overflow-x: auto; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .three-col  { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 72,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(109,74,255,0.1)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 2px 28px rgba(109,74,255,0.08)' : 'none',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ width: 'min(95vw,1800px)', margin: '0 auto', padding: '0 clamp(16px,2.5vw,52px)', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 44, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: `linear-gradient(135deg, ${P}, ${LAV})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: `0 4px 16px rgba(109,74,255,0.4)` }}>🪷</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: scrolled ? '#0F0F1A' : '#fff', letterSpacing: '-0.02em', lineHeight: 1, transition: 'color 0.35s' }}>
                Soul<span style={{ color: LAV }}>Connect</span>
              </div>
              <div style={{ fontSize: 9, color: LAV, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
            </div>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{ padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: scrolled ? '#6B7280' : 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.color = scrolled ? P : '#fff'; e.currentTarget.style.background = scrolled ? '#F0EBFF' : 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = scrolled ? '#6B7280' : 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}>
                {l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <Link to="/login" style={{ padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: scrolled ? '#0F0F1A' : 'rgba(255,255,255,0.85)', textDecoration: 'none', border: scrolled ? '1.5px solid #D1D5DB' : '1.5px solid rgba(255,255,255,0.25)', background: 'transparent', transition: 'all 0.2s' }}>Log In</Link>
            <Link to="/signup" className="sc-btn-primary" style={{ padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${P}, #5B3CE8)`, boxShadow: '0 4px 18px rgba(109,74,255,0.44)' }}>Find My Circle</Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} style={{ marginLeft: 'auto', width: 42, height: 42, borderRadius: 11, background: scrolled ? '#F0EBFF' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 20, height: 2, background: scrolled ? P : '#fff', borderRadius: 2, display: 'block' }} />)}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(15,10,36,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 72, left: 0, right: 0, background: '#fff', padding: '24px', boxShadow: '0 12px 48px rgba(0,0,0,0.18)', fontFamily: FONT }} onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '15px 0', fontSize: 16, fontWeight: 500, color: '#0F0F1A', textDecoration: 'none', borderBottom: '1px solid #F0EBFF' }}>{l}</a>)}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link to="/login"  onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#0F0F1A', textDecoration: 'none', border: '1.5px solid #D1D5DB' }}>Log In</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${P}, #5B3CE8)` }}>Find My Circle</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ background: 'linear-gradient(148deg, #0F0A24 0%, #1E0B45 35%, #2A0D5E 65%, #120828 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* BG orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '2%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(109,74,255,0.14) 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', bottom: '8%', right: '4%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)` }} />
          <div style={{ position: 'absolute', top: '55%', left: '40%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(245,184,65,0.05) 0%, transparent 70%)` }} />
          {/* Sacred geometry lines */}
          {[0,30,60,90,120,150].map((deg, i) => {
            const a = deg * Math.PI / 180;
            return <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: '120vw', height: 1, background: 'rgba(167,139,250,0.025)', transformOrigin: 'left center', transform: `rotate(${deg}deg) translateY(-0.5px)` }} />;
          })}
        </div>

        <div className="hero-grid" style={{ width: 'min(95vw,1800px)', margin: '0 auto', padding: '80px clamp(20px,2.5vw,60px) 72px', display: 'grid', gridTemplateColumns: '50fr 50fr', gap: 'clamp(40px,4vw,88px)', alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* LEFT */}
          <div className="fade-up" style={{ minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 20px', borderRadius: 28, background: 'rgba(109,74,255,0.18)', border: '1px solid rgba(167,139,250,0.32)', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: GRN, display: 'inline-block', animation: 'shimmer 2.4s ease-in-out infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.06em' }}>12,000+ souls healing together</span>
            </div>

            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(3.2rem, 6vw, 8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 28 }}>
              You Don't Have<br />
              To Go Through<br />
              <span style={{ background: `linear-gradient(135deg, ${LAV} 0%, #C4B5FD 40%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>
                It Alone.
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(15px,1.4vw,19px)', color: 'rgba(255,255,255,0.60)', lineHeight: 1.80, marginBottom: 40, maxWidth: 540 }}>
              Whether you're dealing with anxiety, heartbreak, loneliness, grief, stress, self-doubt, or life transitions — SoulConnect connects you with people who truly understand your journey.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 48 }}>
              <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 48px', borderRadius: 16, fontSize: 17, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${P}, #5B3CE8)`, boxShadow: '0 10px 36px rgba(109,74,255,0.52)' }}>
                Find My Circle →
              </Link>
              <Link to="/signup" className="sc-btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 34px', borderRadius: 16, fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.82)', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}>
                Take Wellness Assessment
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
              {['12,000+ Lives Touched', '500+ Wellness Pros', 'Daily Conversations', 'Anonymous & Safe'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: GOLD, fontSize: 15 }}>✦</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Illustration */}
          <div className="hero-art float" style={{ position: 'relative', minWidth: 0, height: 'clamp(500px,62vh,780px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CommunityIllustration />

            {/* Live badge */}
            <div style={{ position: 'absolute', top: '8%', left: '2%', background: 'rgba(15,10,36,0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(52,195,143,0.3)', borderRadius: 16, padding: '10px 18px', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="live-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: GRN, display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>127 discussing anxiety right now</span>
            </div>

            {/* Rating badge */}
            <div style={{ position: 'absolute', bottom: '10%', right: '2%', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '14px 20px', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex' }}>
                {[0,1,2,3].map(i => <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, hsl(${250+i*28},65%,62%), hsl(${275+i*22},55%,52%))`, border: '2px solid rgba(255,255,255,0.2)', marginLeft: i > 0 ? -10 : 0 }} />)}
              </div>
              <div>
                <div style={{ color: GOLD, fontSize: 13, marginBottom: 2 }}>★★★★★</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>4.9/5</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>2,300+ members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section style={{ padding: '0 clamp(16px,2.5vw,52px)', position: 'relative', zIndex: 10, marginTop: -80 }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: 28, padding: 'clamp(28px,3vw,44px) clamp(28px,4vw,64px)', boxShadow: '0 24px 80px rgba(0,0,0,0.16)', border: '1px solid rgba(109,74,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 0 170px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: '#F0EBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: '#0F0F1A', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div className="hidden md:block" style={{ width: 1, height: 48, background: '#EDE9FE', marginLeft: 'auto' }} />}
              </div>
            ))}
            <div style={{ flex: '1 0 220px', borderLeft: '3px solid #EDE9FE', paddingLeft: 32 }}>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: '#6B7280', lineHeight: 1.68, margin: '0 0 7px' }}>"SoulConnect changed my life. I finally felt understood."</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: P }}>— Neha, 28 · Mumbai</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHAT ARE YOU GOING THROUGH? ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#FAFAFC' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader eyebrow="Find Your People" title="What Are You Going Through?" subtitle="Choose your challenge and instantly connect with thousands who understand exactly what you're feeling." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to="/signup" className="sc-cat-card" style={{ display: 'flex', flexDirection: 'column', gap: 14, background: cat.bg, borderRadius: 24, padding: '32px 22px 26px', textDecoration: 'none', border: `1.5px solid ${cat.iconBg}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 72, height: 72, borderRadius: 22, background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>{cat.icon}</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A', lineHeight: 1.38, whiteSpace: 'pre-line' }}>{cat.label}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>👥 {cat.members.toLocaleString()} members</span>
                  <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>🔵 {cat.circles} active circles</span>
                </div>
                <span style={{ fontSize: 13, color: cat.color, fontWeight: 700, marginTop: 4 }}>Join Community →</span>
              </Link>
            ))}
            <Link to="/signup" className="sc-cat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: `linear-gradient(135deg, ${P}, ${LAV})`, borderRadius: 24, padding: '32px 22px', textDecoration: 'none', border: 'none', boxShadow: `0 8px 28px rgba(109,74,255,0.32)` }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>→</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>View All 25+{'\n'}Challenges</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ YOU'RE NOT THE ONLY ONE ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#fff' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader title="You've Already Found Your People" subtitle="Right now, thousands of people on SoulConnect are walking the same path as you." />
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {LIVE_ACTIVITY.map((a, i) => (
              <div key={i} className="sc-card-hover" style={{ background: a.bg, borderRadius: 22, padding: '28px 28px 24px', border: `1.5px solid transparent`, borderLeft: `4px solid ${a.color}`, boxShadow: '0 2px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span className="live-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: GRN, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: GRN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live now</span>
                </div>
                <div style={{ fontSize: 52, fontWeight: 800, color: a.color, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 8 }}>{a.n}</div>
                <p style={{ fontSize: 15, color: '#374151', fontWeight: 500, lineHeight: 1.55, marginBottom: 18 }}>{a.label}</p>
                <Link to="/signup" style={{ fontSize: 13, color: a.color, fontWeight: 700, textDecoration: 'none' }}>Join Conversation →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ DAILY HEALING CHALLENGES ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#FAFAFC' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader eyebrow="Join the Challenge" title="Daily Healing Challenges" subtitle="Small daily actions that compound into massive transformation. Join thousands of people on the same challenge." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {CHALLENGES.map((c, i) => (
              <div key={i} className="sc-challenge-card" style={{ background: '#fff', borderRadius: 24, padding: '28px 26px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 20, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{c.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.04em' }}>{c.dur}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F0F1A', marginBottom: 8 }}>{c.label}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, marginBottom: 20 }}>{c.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>🔥 {c.joined.toLocaleString()} joined</span>
                  <Link to="/signup" style={{ fontSize: 13, fontWeight: 700, color: c.color, textDecoration: 'none', padding: '8px 18px', borderRadius: 10, background: c.bg, transition: 'all 0.2s' }}>Join →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ THE SOUL JOURNEY ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: 'linear-gradient(180deg, #EDE9FE 0%, #F5F3FF 40%, #FAFAFC 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 400, opacity: 0.025, pointerEvents: 'none', lineHeight: 1, userSelect: 'none' }}>🪷</div>
        <div style={{ maxWidth: 1800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionHeader eyebrow="SoulConnect's Signature Feature" title="The Soul Journey" subtitle="A beautiful five-stage path from your first step to complete inner transformation. Track your progress, celebrate milestones, and grow with your community." />

          <div className="soul-stages" style={{ display: 'flex', gap: 'clamp(12px,2vw,28px)', justifyContent: 'space-between', position: 'relative', paddingBottom: 8 }}>
            {/* Connecting rainbow line */}
            <div style={{ position: 'absolute', top: 50, left: '9%', right: '9%', height: 3, background: 'linear-gradient(90deg, #34C38F, #A78BFA, #F472B6, #F5B841, #60A5FA)', opacity: 0.38, borderRadius: 4, pointerEvents: 'none', zIndex: 0 }} />

            {SOUL_STAGES.map((s, i) => (
              <div key={i} style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 4px', minWidth: 140 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: s.active ? `linear-gradient(135deg, ${s.color}28, ${s.color}55)` : 'rgba(255,255,255,0.85)',
                  border: s.active ? `3px solid ${s.color}` : '2px solid rgba(196,181,253,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 42, marginBottom: 20, position: 'relative',
                  boxShadow: s.active ? `0 0 0 10px ${s.color}14, 0 14px 40px ${s.color}30` : '0 4px 18px rgba(0,0,0,0.07)',
                  animation: s.active ? 'breathe 3.5s ease-in-out infinite' : 'none',
                }}>
                  {s.emoji}
                  <div style={{ position: 'absolute', top: -9, right: -9, width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', boxShadow: `0 2px 10px ${s.color}55` }}>
                    {i + 1}
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: s.active ? '#0F0F1A' : '#4B5563', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.55, marginBottom: 10, maxWidth: 148 }}>{s.desc}</p>
                <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.members.toLocaleString()} members</span>
                {s.active && (
                  <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20, background: `${s.color}18`, border: `1px solid ${s.color}44` }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Start Here</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '17px 44px', borderRadius: 16, fontSize: 16, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${P}, #5B3CE8)`, boxShadow: '0 8px 28px rgba(109,74,255,0.4)' }}>
              Begin Your Soul Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#fff' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader title="How SoulConnect Works" subtitle="Five simple steps from first visit to lasting transformation." />
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="sc-card-hover" style={{ background: '#FAFAFC', borderRadius: 24, padding: '32px 24px 28px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 18, right: 18, width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${P}, ${LAV})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{s.num}</div>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{s.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F0F1A', marginBottom: 10, lineHeight: 1.38 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.72 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SUCCESS STORIES ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#FAFAFC' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader eyebrow="Real People. Real Healing." title="Community Success Stories" subtitle="These aren't testimonials. These are transformation journals." />
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="sc-card-hover" style={{ background: '#fff', borderRadius: 28, padding: '36px 32px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 18px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: '#F0EBFF', border: `1px solid #DDD6FE` }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: P }}>{t.from} → {t.to}</span>
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: 20, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: GRN }}>{t.weeks} weeks</span>
                  </div>
                </div>
                <div style={{ fontSize: 52, color: '#EDE9FE', fontFamily: 'Georgia', lineHeight: 1, marginBottom: 16 }}>"</div>
                <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.80, fontStyle: 'italic', marginBottom: 28 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={t.img} alt={t.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #EDE9FE' }} loading="lazy" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{t.city}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: GOLD, fontSize: 14 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ NEED EXTRA SUPPORT? ══════════════ */}
      <section style={{ padding: 'clamp(56px,6vw,88px) clamp(16px,2.5vw,52px)', background: '#fff' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader eyebrow="When You Need More" title="Need More Personalized Guidance?" subtitle="Community first. Professionals when you need them. Connect with verified Reiki practitioners, coaches, healers, and wellness professionals." />
          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {HEALERS.map((h, i) => (
              <div key={i} className="sc-card-hover" style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#FAFAFC', borderRadius: 24, padding: '24px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <img src={h.img} alt={h.name} style={{ width: 64, height: 64, borderRadius: 20, objectFit: 'cover', flexShrink: 0, border: '2px solid #EDE9FE' }} loading="lazy" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0F1A', marginBottom: 3 }}>{h.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 5 }}>{h.role}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.spec}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: GOLD, fontSize: 12 }}>★ {h.rating}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>· {h.sessions} sessions</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: GRN, background: '#F0FDF4', padding: '2px 8px', borderRadius: 10 }}>{h.avail}</span>
                  </div>
                </div>
                <Link to="/signup" style={{ flexShrink: 0, padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${P}, ${LAV})`, boxShadow: '0 4px 14px rgba(109,74,255,0.3)', whiteSpace: 'nowrap' }}>Book</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ UPCOMING EVENTS ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#FAFAFC' }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <SectionHeader eyebrow="Live Events" title="Upcoming Healing Events" subtitle="Group experiences that heal, connect, and transform. Live sessions with real community energy." />
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {EVENTS.map((ev, i) => (
              <div key={i} className="sc-card-hover" style={{ borderRadius: 26, overflow: 'hidden', position: 'relative', height: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <img src={ev.img} alt={ev.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(15,10,36,0.82) 0%, rgba(15,10,36,0.5) 55%, rgba(15,10,36,0.2) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '22px 26px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 20, background: ev.typeColor, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>{ev.type}</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 5px' }}>{ev.title}</h3>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>with {ev.host} · {ev.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{ev.joined}/{ev.limit} joined</span>
                        <span style={{ fontSize: 12, color: ev.joined >= ev.limit * 0.9 ? '#FCA5A5' : GRN, fontWeight: 600 }}>{ev.limit - ev.joined} spots left</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.18)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(ev.joined / ev.limit) * 100}%`, background: ev.joined >= ev.limit * 0.9 ? '#FCA5A5' : GRN, borderRadius: 4, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                    <Link to="/signup" style={{ flexShrink: 0, padding: '9px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>Register</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section style={{ padding: 'clamp(64px,7vw,100px) clamp(16px,2.5vw,52px)', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about SoulConnect." />
          <FAQ faqs={FAQS} />
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section style={{ padding: 'clamp(80px,9vw,128px) clamp(16px,2.5vw,52px)', background: 'linear-gradient(148deg, #0F0A24 0%, #1E0B45 50%, #2A0D5E 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, rgba(109,74,255,0.18) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, rgba(245,184,65,0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 72, marginBottom: 28 }}>🪷</div>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.16, marginBottom: 20, letterSpacing: '-0.025em' }}>
            Your Healing Journey<br />
            <span style={{ background: `linear-gradient(135deg, ${LAV}, #C4B5FD 45%, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>
              Starts Today.
            </span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.52)', marginBottom: 14, lineHeight: 1.65 }}>Find people who understand.</p>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.52)', marginBottom: 14, lineHeight: 1.65 }}>Heal together.</p>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.52)', marginBottom: 52, lineHeight: 1.65 }}>Grow together.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 56px', borderRadius: 18, fontSize: 18, fontWeight: 700, color: '#0F0F1A', textDecoration: 'none', background: '#fff', boxShadow: '0 10px 40px rgba(255,255,255,0.2)' }}>
              Find My Circle
            </Link>
            <Link to="/signup" className="sc-btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 48px', borderRadius: 18, fontSize: 18, fontWeight: 700, color: '#fff', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}>
              Join SoulConnect
            </Link>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>Free to join · Anonymous · 12,000+ already healing</p>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: '#0C0A22', padding: 'clamp(52px,5.5vw,80px) clamp(16px,2.5vw,52px) 36px', fontFamily: FONT }}>
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 52, marginBottom: 60 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg, ${P}, ${LAV})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪷</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Soul<span style={{ color: LAV }}>Connect</span></div>
                  <div style={{ fontSize: 9, color: LAV, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', lineHeight: 1.80, maxWidth: 270, marginBottom: 28 }}>
                A community-driven healing platform where people facing similar life challenges connect, support each other, and heal together.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['📘','📸','🐦','💼'].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(109,74,255,0.4)`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform',  links: ['Community', 'Healing Circles', 'Daily Challenges', 'Soul Journey', 'Events'] },
              { title: 'Support',   links: ['Find a Healer', 'Book Session', 'Wellness Assessment', 'About Us', 'Contact'] },
              { title: 'Legal',     links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility', 'Safety'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: LAV, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', margin: 0 }}>© 2026 SoulConnect. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 28 }}>
              <Link to="/terms" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
                Terms of Use
              </Link>
              <Link to="/terms#privacy" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
                Privacy Policy
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', margin: 0 }}>Made with 💜 for those who need it most</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
