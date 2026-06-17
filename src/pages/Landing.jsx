import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Constants ─────────────────────────────────────────────────────────────────

const HERO_IMG  = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80';
const CIRCLE_IMGS = [
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=500&q=70',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=70',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=70',
];

const HEALER_IMGS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=80&q=80',
];

const TESTIMONIAL_IMGS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80',
];

const NAV_LINKS = ['How It Works', 'Features', 'Healers', 'Circles', 'Resources', 'About Us'];

const STATS = [
  { icon: '👥', value: '12,000+', label: 'People Helped' },
  { icon: '🧘', value: '500+',    label: 'Verified Healers' },
  { icon: '🌍', value: '50+',     label: 'Cities' },
  { icon: '💛', value: '25+',     label: 'Life Challenges' },
];

const CATEGORIES = [
  { icon: '💔', label: 'Breakup &\nHeartbreak',     bg: '#FFF1F2', iconBg: '#FFE4E6', color: '#E11D48' },
  { icon: '🧠', label: 'Anxiety &\nOverthinking',   bg: '#F5F3FF', iconBg: '#EDE9FE', color: '#7C3AED' },
  { icon: '🌧',  label: 'Grief &\nLoss',            bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#2563EB' },
  { icon: '😔', label: 'Loneliness &\nIsolation',   bg: '#F0FDF4', iconBg: '#DCFCE7', color: '#16A34A' },
  { icon: '💼', label: 'Career &\nWork Stress',     bg: '#FFFBEB', iconBg: '#FEF3C7', color: '#D97706' },
  { icon: '🌙', label: 'Sleep &\nInsomnia',         bg: '#FAF5FF', iconBg: '#F3E8FF', color: '#9333EA' },
];

const STEPS = [
  { num: '01', title: 'Choose Your Struggle',    desc: 'Pick the challenge you\'re facing right now.',     emoji: '🧘' },
  { num: '02', title: 'Get Matched Anonymously', desc: 'We connect you with people who truly understand.', emoji: '💫' },
  { num: '03', title: 'Heal Together',           desc: 'Share, listen, support and grow together in a safe space.', emoji: '🫂' },
];

const TESTIMONIALS = [
  { name: 'Riya, 24', city: 'Mumbai',    img: TESTIMONIAL_IMGS[0], quote: 'I was going through the worst breakup of my life. SoulConnect helped me find people who really understood me.' },
  { name: 'Arjun, 27', city: 'Bangalore', img: TESTIMONIAL_IMGS[1], quote: 'The anxiety support circle changed everything for me. I don\'t feel alone anymore. I feel seen.' },
  { name: 'Priya, 31', city: 'Delhi',     img: TESTIMONIAL_IMGS[2], quote: 'After my dad passed away, I thought I\'d never be okay. The grief circle gave me a new family.' },
];

const CIRCLES = [
  { title: 'Anxiety Support Circle',    time: 'Today, 7:00 PM',    tag: 'Today',     tagColor: '#7C5CFC', joined: 12, img: CIRCLE_IMGS[0] },
  { title: 'Heartbreak Healing Circle', time: 'Tomorrow, 6:30 PM', tag: 'Tomorrow',  tagColor: '#E11D48', joined: 8,  img: CIRCLE_IMGS[1] },
  { title: 'Grief & Loss Circle',       time: 'Sun, 7:00 PM',      tag: 'Sun',       tagColor: '#2563EB', joined: 15, img: CIRCLE_IMGS[2] },
];

const HEALERS = [
  { name: 'Dr. Meera Shah',  role: 'Counselor · 8+ Years', spec: 'Anxiety, Trauma, Relationships', rating: 4.9, img: HEALER_IMGS[0] },
  { name: 'Rohit Verma',     role: 'Therapist · 6+ Years', spec: 'Depression, Grief, Stress',      rating: 4.8, img: HEALER_IMGS[1] },
  { name: 'Ananya Iyer',     role: 'Life Coach · 5+ Years', spec: 'Confidence, Purpose, Healing',  rating: 4.9, img: HEALER_IMGS[2] },
];

const TOOLS = [
  { icon: '😊', label: 'Mood Tracker' },
  { icon: '📔', label: 'Guided Journal' },
  { icon: '🌬️', label: 'Breathing Exercises' },
  { icon: '🎧', label: 'Meditations' },
  { icon: '✨', label: 'Angel Numbers' },
  { icon: '🌸', label: 'Daily Affirmations' },
];

const FAQS = [
  { q: 'Is SoulConnect free to use?', a: 'Yes — creating an account, getting peer-matched, and joining support circles is completely free. Verified healer sessions are paid individually, starting at ₹500/session.' },
  { q: 'Is my identity kept anonymous?', a: 'Completely. Your real name, phone number, and social media are never shared with matches or visible publicly.' },
  { q: 'How does the peer matching work?', a: 'When you sign up, you select your primary challenge. Our algorithm matches you with someone going through the same specific issue — not just "mental health" broadly. Most people are matched within minutes.' },
  { q: 'Is this a replacement for therapy?', a: "No — and we're honest about that. SoulConnect is peer support: real people who truly understand your struggle. For clinical care, we connect you with verified therapists." },
  { q: 'What if I need urgent help?', a: "SoulConnect is a supportive community, not a crisis service. If you're in immediate distress, please contact iCall (9152987821) or Vandrevala Foundation (1860-2662-345), available 24/7." },
];

// ── SVG Illustrations ─────────────────────────────────────────────────────────

function MandalaOverlay() {
  return (
    <svg viewBox="0 0 320 320" aria-hidden="true" style={{ position: 'absolute', right: -30, top: -20, width: 360, height: 360, opacity: 0.18, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CFC" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      {[150,120,90,60,30].map((r, i) => (
        <circle key={i} cx="160" cy="160" r={r} fill="none" stroke="url(#mGrad)" strokeWidth={i === 0 ? 0.6 : 0.4} strokeDasharray={i % 2 === 0 ? 'none' : '4 8'} />
      ))}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <circle key={i} cx={160 + 150*Math.cos(a)} cy={160 + 150*Math.sin(a)} r="3" fill="url(#mGrad)" opacity="0.7" />;
      })}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <circle key={i} cx={160 + 60*Math.cos(a)} cy={160 + 60*Math.sin(a)} r="60" fill="none" stroke="url(#mGrad)" strokeWidth="0.7" opacity="0.6" />;
      })}
      <circle cx="160" cy="160" r="60" fill="none" stroke="url(#mGrad)" strokeWidth="0.7" opacity="0.6" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <line key={i} x1={160 - 120*Math.cos(a)} y1={160 - 120*Math.sin(a)} x2={160 + 120*Math.cos(a)} y2={160 + 120*Math.sin(a)} stroke="url(#mGrad)" strokeWidth="0.4" opacity="0.4" />;
      })}
      <circle cx="160" cy="160" r="24" fill="none" stroke="url(#mGrad)" strokeWidth="1.2" />
      <circle cx="160" cy="160" r="10" fill="url(#mGrad)" opacity="0.6" />
    </svg>
  );
}

function LotusHero() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" style={{ width: 56, height: 56 }}>
      <defs>
        <linearGradient id="lGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CFC" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <path d="M40 65 C40 65 18 52 18 36 C18 27 25 22 31 24.5 C33 19 37 18 40 20 C43 18 47 19 49 24.5 C55 22 62 27 62 36 C62 52 40 65 40 65Z" fill="url(#lGrad)" opacity="0.15" stroke="url(#lGrad)" strokeWidth="1.5" />
      <path d="M40 65 C40 65 28 50 28 36 C28 29 33 25 37 27 C38 23 39 22 40 23 C41 22 42 23 43 27 C47 25 52 29 52 36 C52 50 40 65 40 65Z" fill="url(#lGrad)" opacity="0.25" stroke="url(#lGrad)" strokeWidth="1" />
      <line x1="40" y1="65" x2="40" y2="26" stroke="url(#lGrad)" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────

function FAQ({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, border: open === i ? '1.5px solid #A78BFA' : '1.5px solid #EDE9FE', overflow: 'hidden', transition: 'border-color 0.2s', boxShadow: open === i ? '0 4px 20px rgba(124,92,252,0.08)' : 'none' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
          >
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1E1B4B' }}>{faq.q}</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: open === i ? '#7C5CFC' : '#F5F3FF', color: open === i ? 'white' : '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 22px 18px', color: '#6B7280', fontSize: 14, lineHeight: 1.75 }}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 40 }}>
      {eyebrow && (
        <p style={{ fontSize: 12, fontWeight: 700, color: '#7C5CFC', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.02em', margin: '0 auto 12px', maxWidth: center ? 560 : 'none', lineHeight: 1.25 }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: 16, color: '#6B7280', maxWidth: center ? 500 : 'none', margin: center ? '0 auto' : 0, lineHeight: 1.65 }}>{subtitle}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!document.getElementById('sc-playfair')) {
      const link = document.createElement('link');
      link.id = 'sc-playfair'; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap';
      document.head.appendChild(link);
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#FAF8F6', color: '#1E1B4B', overflowX: 'hidden' }}>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes pulse { 0%,100% { box-shadow:0 0 0 0 rgba(124,92,252,0.3); } 50% { box-shadow:0 0 0 10px rgba(124,92,252,0); } }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .float   { animation: floatY 4s ease-in-out infinite; }
        .sc-btn-primary { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .sc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(124,92,252,0.38) !important; }
        .sc-btn-outline:hover { background: #F5F3FF !important; border-color: #7C5CFC !important; color: #7C5CFC !important; }
        .sc-card-hover { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .sc-card-hover:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important; }
        .sc-cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.09) !important; }
        .sc-cat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        @media (prefers-reduced-motion: reduce) { .fade-up,.float,.sc-btn-primary,.sc-btn-outline,.sc-card-hover,.sc-cat-card { animation:none !important; transition:none !important; } }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(237,233,254,0.8)' : '1px solid rgba(237,233,254,0.4)',
        boxShadow: scrolled ? '0 2px 24px rgba(124,92,252,0.07)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 clamp(16px, 3vw, 40px)', display: 'flex', alignItems: 'center' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(124,92,252,0.3)' }}>🪷</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Soul<span style={{ color: '#7C5CFC' }}>Connect</span>
              </div>
              <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Heal · Connect · Grow
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#6B7280', textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#7C5CFC'; e.currentTarget.style.background = '#F5F3FF'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = 'transparent'; }}>
                {l}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <Link to="/login" className="sc-btn-outline" style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#1E1B4B', textDecoration: 'none', border: '1.5px solid #D1D5DB', background: 'transparent', transition: 'all 0.15s' }}>
              Log In
            </Link>
            <Link to="/signup" className="sc-btn-primary" style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)', boxShadow: '0 4px 14px rgba(124,92,252,0.35)' }}>
              Find My Match
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} style={{ marginLeft: 'auto', width: 40, height: 40, borderRadius: 10, background: '#F5F3FF', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 18, height: 2, background: '#7C5CFC', borderRadius: 2, display: 'block' }} />)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(30,27,75,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 72, left: 0, right: 0, background: '#fff', padding: '20px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 0', fontSize: 15, fontWeight: 500, color: '#1E1B4B', textDecoration: 'none', borderBottom: '1px solid #F5F3FF' }}>{l}</a>)}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#1E1B4B', textDecoration: 'none', border: '1.5px solid #D1D5DB' }}>Log In</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)' }}>Find My Match</Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(160deg, #FAF8F6 0%, #F3F0FF 50%, #FAF8F6 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: 'clamp(40px, 6vw, 80px) clamp(16px, 3vw, 48px)', display: 'flex', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>

          {/* Left */}
          <div className="fade-up" style={{ flex: '0 0 50%', maxWidth: '50%' }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: '#F0EBFF', border: '1px solid #DDD6FE', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C5CFC', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7C5CFC', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Peer Support For Real Life Struggles</span>
            </div>

            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', fontWeight: 800, color: '#1E1B4B', lineHeight: 1.18, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Find Someone Who Truly{' '}
              <span style={{ color: '#7C5CFC', fontStyle: 'italic' }}>Understands</span>{' '}
              What You're Going Through
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: '#6B7280', lineHeight: 1.75, marginBottom: 8 }}>
              Whether you're healing from a breakup, struggling with anxiety, grieving a loss, or feeling alone... connect with people who have walked the same path.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: '#7C5CFC', fontWeight: 600, marginBottom: 32 }}>
              You don't have to carry it alone anymore.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
              <Link to="/signup" className="sc-btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 30px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)',
                boxShadow: '0 6px 20px rgba(124,92,252,0.38)',
              }}>
                Start Healing →
              </Link>
              <a href="#how-it-works" className="sc-btn-outline" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 26px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                color: '#1E1B4B', textDecoration: 'none',
                border: '1.5px solid #D1D5DB', background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.18s',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>▶</div>
                How It Works
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[['🔒', 'Anonymous & Safe'], ['💜', 'Judgment-Free Space'], ['✓', 'Free To Join']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div className="hidden md:block float" style={{ flex: 1, position: 'relative', minHeight: 520 }}>

            {/* Photo */}
            <div style={{
              borderRadius: 32, overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(124,92,252,0.2)',
              height: 520, position: 'relative',
            }}>
              <img
                src={HERO_IMG}
                alt="Woman meditating peacefully"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                loading="eager"
              />
              {/* Subtle gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(124,92,252,0.05) 0%, rgba(30,27,75,0.08) 100%)' }} />
            </div>

            {/* Mandala overlay */}
            <MandalaOverlay />

            {/* Floating rating card */}
            <div style={{
              position: 'absolute', bottom: 32, right: -20,
              background: '#fff', borderRadius: 20, padding: '14px 20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: '1px solid rgba(237,233,254,0.8)',
              display: 'flex', alignItems: 'center', gap: 14,
              zIndex: 2, backdropFilter: 'blur(8px)',
              animation: 'pulse 3s ease-in-out infinite',
            }}>
              <div style={{ display: 'flex' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${250 + i*30}, 60%, 65%)`, border: '2px solid white', marginLeft: i > 0 ? -8 : 0 }} />
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>{'★★★★★'.split('').map((s,i) => <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>{s}</span>)}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>4.9/5</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>from 2,300+ members</div>
              </div>
            </div>

            {/* Floating "healing" badge */}
            <div style={{
              position: 'absolute', top: 28, left: -16,
              background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', borderRadius: 16, padding: '10px 16px',
              boxShadow: '0 8px 24px rgba(124,92,252,0.3)',
              zIndex: 2,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Currently healing</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>1,247 souls 🌸</div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS / TRUST BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 clamp(16px, 3vw, 48px)', marginTop: -28, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: 'clamp(24px, 3vw, 36px) clamp(24px, 4vw, 48px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.08)',
            border: '1px solid rgba(237,233,254,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '1 0 140px' }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div className="hidden md:block" style={{ width: 1, height: 40, background: '#EDE9FE', marginLeft: 'auto' }} />}
              </div>
            ))}
            {/* Testimonial quote */}
            <div style={{ flex: '1 0 200px', borderLeft: '3px solid #EDE9FE', paddingLeft: 24 }}>
              <p style={{ fontSize: 13, fontStyle: 'italic', color: '#6B7280', lineHeight: 1.6, margin: '0 0 6px' }}>
                "SoulConnect changed my life. I finally felt understood."
              </p>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#7C5CFC' }}>— Neha, 28</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PROBLEM CATEGORIES
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader
            title="You're Not Alone In What You're Facing"
            subtitle="Whatever you're going through, there are others here who truly get it."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to="/signup" className="sc-cat-card" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                background: '#fff', borderRadius: 20, padding: '28px 16px',
                textDecoration: 'none', border: '1.5px solid #EDE9FE',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{cat.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{cat.label}</span>
                <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>Find support →</span>
              </Link>
            ))}
            <Link to="/signup" className="sc-cat-card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', borderRadius: 20, padding: '28px 16px',
              textDecoration: 'none', border: 'none',
              boxShadow: '0 4px 20px rgba(124,92,252,0.25)',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>→</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>View All{'\n'}Challenges</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader title="How SoulConnect Works" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block" style={{ position: 'absolute', top: 60, left: '60%', right: '-10%', height: 2, background: 'linear-gradient(90deg, #EDE9FE, #DDD6FE)', zIndex: 0, borderRadius: 2 }}>
                    <div style={{ position: 'absolute', right: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: '#A78BFA' }} />
                  </div>
                )}

                {/* Step circle */}
                <div style={{
                  width: 120, height: 120, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
                  border: '2px solid #DDD6FE',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, marginBottom: 20,
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 8px 32px rgba(124,92,252,0.12)',
                }}>
                  {step.emoji}
                  <div style={{ position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', boxShadow: '0 4px 12px rgba(124,92,252,0.4)' }}>
                    {step.num}
                  </div>
                </div>

                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1E1B4B', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 220 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)', boxShadow: '0 6px 20px rgba(124,92,252,0.35)' }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#FAF8F6' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader title="Real Stories. Real Healing." subtitle="Thousands of people have found their people here." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="sc-card-hover" style={{ background: '#fff', borderRadius: 24, padding: '28px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 36, color: '#EDE9FE', fontFamily: 'Georgia', lineHeight: 1, marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.img} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EDE9FE' }} loading="lazy" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.city}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: 13 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CIRCLES + HEALERS
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

          {/* Upcoming Circles */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Upcoming Support Circles</h2>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>Safe spaces to share and heal together</p>
              </div>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none', padding: '6px 14px', borderRadius: 10, background: '#F5F3FF' }}>View all</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {CIRCLES.map((c, i) => (
                <div key={i} className="sc-card-hover" style={{ borderRadius: 20, overflow: 'hidden', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', height: 140 }}>
                  <img src={c.img} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,27,75,0.75) 0%, rgba(30,27,75,0.4) 60%, transparent 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '18px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', marginBottom: 8 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>{c.time}</span>
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{c.title}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>👥 {c.joined} joined · 60 min</span>
                      <button onClick={() => window.location.href = '/signup'} style={{ padding: '7px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: '#fff', color: '#7C5CFC', border: 'none', cursor: 'pointer' }}>
                        Join Circle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Healers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Top Healers</h2>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>Verified wellness professionals</p>
              </div>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none', padding: '6px 14px', borderRadius: 10, background: '#F5F3FF' }}>View all</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {HEALERS.map((h, i) => (
                <div key={i} className="sc-card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#FAFAFA', borderRadius: 18, padding: '16px 18px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <img src={h.img} alt={h.name} style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover', flexShrink: 0, border: '2px solid #EDE9FE' }} loading="lazy" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B' }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{h.role}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.spec}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, justifyContent: 'flex-end' }}>
                      <span style={{ color: '#F59E0B', fontSize: 12 }}>★</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1E1B4B' }}>{h.rating}</span>
                    </div>
                    <button onClick={() => window.location.href = '/signup'} style={{ padding: '7px 14px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,92,252,0.3)', whiteSpace: 'nowrap' }}>
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DAILY HEALING TOOLS
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#FAF8F6' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader title="Daily Healing Tools" subtitle="Simple tools to support your journey every day." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            {TOOLS.map((tool, i) => (
              <Link key={i} to="/signup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px 16px', borderRadius: 20, background: '#fff', border: '1.5px solid #EDE9FE', textDecoration: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,92,252,0.1)'; e.currentTarget.style.borderColor = '#C4B5FD'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#EDE9FE'; }}>
                <div style={{ width: 52, height: 52, borderRadius: 18, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{tool.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1E1B4B', textAlign: 'center' }}>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about SoulConnect." />
          <FAQ faqs={FAQS} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: 'linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 50%, #F5F3FF 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🪷</div>

          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#1E1B4B', lineHeight: 1.25, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Your healing journey<br />can begin today.
          </h2>

          <p style={{ fontSize: 17, color: '#6B7280', marginBottom: 36, lineHeight: 1.65 }}>
            Take the first step. We're here for you.
          </p>

          <Link to="/signup" className="sc-btn-primary" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 40px', borderRadius: 16, fontSize: 16, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)',
            boxShadow: '0 8px 32px rgba(124,92,252,0.4)',
          }}>
            Find My Support Match →
          </Link>

          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 16 }}>
            🔒 Free · Anonymous · Takes 3 Minutes
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#1E1B4B', padding: 'clamp(40px, 5vw, 64px) clamp(16px, 3vw, 48px) 28px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🪷</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Soul<span style={{ color: '#A78BFA' }}>Connect</span></div>
                  <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 240, marginBottom: 20 }}>
                A safe, anonymous peer support platform for real life struggles.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['📘','📸','🐦','💼'].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform', links: ['How It Works', 'Find a Match', 'Support Circles', 'Healers', 'Meditations'] },
              { title: 'Company', links: ['About Us', 'For Healers', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>© 2026 SoulConnect. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>Made with 💜 for those who need it most</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
