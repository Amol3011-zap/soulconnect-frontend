import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Reduced-motion helper ── */
const REDUCED_MOTION = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function FAQSection({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ background: '#f5f0eb', padding: 'clamp(40px,6vw,72px) 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
          Got Questions?
        </p>
        <h2 style={{ color: '#111827', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: 12, letterSpacing: '-0.4px' }}>
          Frequently Asked Questions
        </h2>
        <p style={{ color: '#6b7280', fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
          Everything you need to know about SoulConnect and how healing works.
        </p>
        <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => {
            const panelId = `faq-panel-${i}`;
            const btnId   = `faq-btn-${i}`;
            return (
              <div key={i} role="listitem"
                style={{
                  background: 'white', borderRadius: 12,
                  border: open === i ? '1.5px solid #2d6a4f' : '1.5px solid #e5e7eb',
                  overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                <button
                  id={btnId}
                  aria-expanded={open === i}
                  aria-controls={panelId}
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    minHeight: 56, padding: '14px 22px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                  }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#111827', lineHeight: 1.4 }}>{faq.q}</span>
                  <span aria-hidden="true" style={{
                    flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                    background: open === i ? '#1a3d2e' : '#f3f4f6',
                    color: open === i ? 'white' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700, lineHeight: 1,
                    transition: 'all 0.2s',
                  }}>
                    {open === i ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  hidden={open !== i}
                  style={{ padding: '0 22px 18px', color: '#4b5563', fontSize: 14, lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: '12,000+', label: 'People Helped' },
  { value: '25', label: 'Problem Categories' },
  { value: '500+', label: 'Verified Healers' },
  { value: '50+', label: 'Cities in India' },
];

const steps = [
  { step: '01', title: 'Choose Your Problem', desc: 'Pick from 25 specific life challenges — from breakups to OCD to financial stress.' },
  { step: '02', title: 'Get Matched Instantly', desc: 'Our algorithm finds someone nearby dealing with the same issue within minutes.' },
  { step: '03', title: 'Heal Together', desc: 'Chat, meet up, or book a healer. You are never alone in this journey.' },
];

const features = [
  {
    title: 'Peer Matching',
    desc: 'We match you with someone dealing with your exact issue — not just "mental health" in general. Same breakup. Same anxiety. Same grief.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="5" fill="#2d6a4f" />
        <circle cx="26" cy="12" r="5" fill="#1a7a8a" />
        <path d="M4 32c0-5.523 4.477-10 10-10h12c5.523 0 10 4.477 10 10" stroke="#1a3d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20 22v-4M17 20h6" stroke="#b5650d" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Verified Healers',
    desc: 'When peer support isn\'t enough, book 1:1 sessions with certified Pranic healers starting at ₹500/hr.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="14" r="6" fill="#2d6a4f" />
        <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#1a3d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="10" r="5" fill="#f59e0b" />
        <path d="M30 10h4M32 8v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Real Meetups',
    desc: 'Weekly in-person circles in your city — small groups (max 8) built around your specific struggle.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="10" r="5" fill="#1a7a8a" />
        <path d="M10 34c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#1a3d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M20 20l-6 6M20 20l6 6" stroke="#b5650d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="26" r="3" fill="#2d6a4f" />
        <circle cx="26" cy="26" r="3" fill="#2d6a4f" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    initials: 'P',
    name: 'Priya S.',
    age: 28,
    tag: 'Breakup',
    avatarBg: '#2d6a4f',
    quote: '"I felt completely alone after my breakup. SoulConnect matched me with someone 2 months into the same journey. For the first time, someone truly understood."',
    stars: 5,
  },
  {
    initials: 'R',
    name: 'Rohan M.',
    age: 31,
    tag: 'Work Anxiety',
    avatarBg: '#1a7a8a',
    quote: '"Anxiety was destroying my career. I found peers going through the exact same thing. Went from 8/10 anxiety to 3/10 in just 6 weeks."',
    stars: 5,
  },
  {
    initials: 'K',
    name: 'Kavya T.',
    age: 35,
    tag: 'Marriage Problems',
    avatarBg: '#b5650d',
    quote: '"My marriage was falling apart. SoulConnect matched me with couples navigating the same issues. Their honesty showed me I was not alone."',
    stars: 5,
  },
];

const problems = [
  'Breakup', 'Anxiety', 'Depression', 'Marriage', 'Loneliness',
  'Career Stress', 'Grief', 'Financial', 'Sleep Issues', 'Anger',
];

/* ── Unique SVG illustrations — abstract & spiritual, not person silhouettes ── */

// Card 1: Lotus mandala — inner peace / healing mind
const LotusIllustration = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer glow ring */}
    <circle cx="75" cy="75" r="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <circle cx="75" cy="75" r="48" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    {/* 8 petals */}
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const cx = 75 + Math.cos(rad) * 28;
      const cy = 75 + Math.sin(rad) * 28;
      return (
        <ellipse key={i} cx={cx} cy={cy} rx="11" ry="18"
          transform={`rotate(${deg}, ${cx}, ${cy})`}
          fill={`rgba(255,255,255,${0.18 + (i % 2) * 0.08})`} />
      );
    })}
    {/* Inner petals */}
    {[22,67,112,157,202,247].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const cx = 75 + Math.cos(rad) * 16;
      const cy = 75 + Math.sin(rad) * 16;
      return (
        <ellipse key={i} cx={cx} cy={cy} rx="7" ry="12"
          transform={`rotate(${deg}, ${cx}, ${cy})`}
          fill="rgba(255,255,255,0.3)" />
      );
    })}
    {/* Center */}
    <circle cx="75" cy="75" r="10" fill="rgba(255,255,255,0.55)" />
    <circle cx="75" cy="75" r="5" fill="rgba(255,255,255,0.9)" />
    {/* Radiating dots */}
    {[0,60,120,180,240,300].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      return <circle key={i} cx={75 + Math.cos(rad) * 42} cy={75 + Math.sin(rad) * 42} r="2" fill="rgba(255,255,255,0.4)" />;
    })}
  </svg>
);

// Card 2: Intertwined hearts / vines — connection & relationships
const ConnectionIllustration = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background ring */}
    <circle cx="75" cy="75" r="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4 6" />
    {/* Left heart */}
    <path d="M50 58 C50 50 38 46 34 54 C30 62 34 70 50 82 C50 82 50 82 50 82"
      stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M50 58 C50 50 62 46 66 54 C70 62 66 70 50 82"
      stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Right heart */}
    <path d="M100 58 C100 50 88 46 84 54 C80 62 84 70 100 82"
      stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M100 58 C100 50 112 46 116 54 C120 62 116 70 100 82"
      stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Connecting vine/thread */}
    <path d="M50 82 C55 90 65 85 75 90 C85 95 95 88 100 82"
      stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Small sparkles */}
    <circle cx="75" cy="90" r="3.5" fill="rgba(255,255,255,0.7)" />
    <circle cx="60" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
    <circle cx="90" cy="100" r="2" fill="rgba(255,255,255,0.4)" />
    <circle cx="75" cy="108" r="2.5" fill="rgba(255,255,255,0.3)" />
    {/* Stars */}
    {[[40,42],[110,42],[75,38],[30,72],[120,72]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.5)" />
    ))}
    {/* Inner glow fill on hearts */}
    <path d="M50 58 C50 50 38 46 34 54 C30 62 34 70 50 82 C66 70 70 62 66 54 C62 46 50 50 50 58Z"
      fill="rgba(255,255,255,0.08)" />
    <path d="M100 58 C100 50 88 46 84 54 C80 62 84 70 100 82 C116 70 120 62 116 54 C112 46 100 50 100 58Z"
      fill="rgba(255,255,255,0.08)" />
  </svg>
);

// Card 3: Compass star / north star — finding your path
const CompassIllustration = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer rings */}
    <circle cx="75" cy="75" r="58" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <circle cx="75" cy="75" r="44" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 5" />
    {/* 4 large compass points */}
    <path d="M75 20 L68 68 L75 75 L82 68 Z" fill="rgba(255,255,255,0.55)" />
    <path d="M75 130 L68 82 L75 75 L82 82 Z" fill="rgba(255,255,255,0.35)" />
    <path d="M20 75 L68 68 L75 75 L68 82 Z" fill="rgba(255,255,255,0.35)" />
    <path d="M130 75 L82 68 L75 75 L82 82 Z" fill="rgba(255,255,255,0.55)" />
    {/* 4 diagonal smaller points */}
    <path d="M75 75 L47 47 L68 68 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M75 75 L103 47 L82 68 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M75 75 L47 103 L68 82 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M75 75 L103 103 L82 82 Z" fill="rgba(255,255,255,0.2)" />
    {/* Concentric detail rings */}
    <circle cx="75" cy="75" r="28" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <circle cx="75" cy="75" r="16" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    {/* Center dot */}
    <circle cx="75" cy="75" r="7" fill="rgba(255,255,255,0.7)" />
    <circle cx="75" cy="75" r="3" fill="white" />
    {/* Cardinal label dots */}
    <circle cx="75" cy="30" r="2.5" fill="rgba(255,255,255,0.8)" />
    <circle cx="75" cy="120" r="2" fill="rgba(255,255,255,0.4)" />
    <circle cx="30" cy="75" r="2" fill="rgba(255,255,255,0.4)" />
    <circle cx="120" cy="75" r="2.5" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  /* Close drawer on Escape key */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* Trap focus inside drawer when open */
  useEffect(() => {
    if (!menuOpen) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable[0]) focusable[0].focus();
  }, [menuOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }}>

      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <nav role="navigation" aria-label="Main navigation" style={{ background: '#1a3d2e', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" aria-label="SoulConnect home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo-navbar.png" alt="" aria-hidden="true" className="md:hidden" style={{ height: 44, width: 44, objectFit: 'contain', borderRadius: 8 }} />
            <img src="/logo-footer.png" alt="" aria-hidden="true" className="hidden md:block" style={{ height: 56, width: 'auto', objectFit: 'contain', maxWidth: 240 }} />
          </Link>

          {/* Nav links — desktop only */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            {[['#how-it-works','How it Works'],['#features','Features'],['#healers','Healers'],['#faq','FAQ']].map(([href,label]) => (
              <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>{label}</a>
            ))}
          </div>

          {/* Right: auth buttons + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" className="hidden md:inline-flex" style={{ color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '10px 18px', minHeight: 44, alignItems: 'center' }}>
              Log in
            </Link>
            <Link to="/signup" style={{ background: '#7c3aed', color: 'white', fontWeight: 700, fontSize: 14, textDecoration: 'none', borderRadius: 8, padding: '10px 18px', minHeight: 44, display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }}>
              Find My Match
            </Link>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMenuOpen(v => !v)}
              style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
              <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 20, height: 2, background: 'white', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="md:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          width: 280, background: '#1a3d2e',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: REDUCED_MOTION ? 'none' : 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
          overflowY: 'auto',
        }}>
        {/* Drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/logo-navbar.png" alt="SoulConnect" style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 8 }} />
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: 'white', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Drawer nav links */}
        <nav aria-label="Mobile navigation" style={{ flex: 1, padding: '12px 0' }}>
          {[['#how-it-works','How it Works','🌿'],['#features','Features','✨'],['#healers','Healers','🧘'],['#faq','FAQ','❓']].map(([href,label,icon]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 16, fontWeight: 500, minHeight: 52, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Drawer CTAs */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/login" onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.35)', color: 'white', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
            Log in
          </Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, borderRadius: 10, background: '#7c3aed', color: 'white', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
            Find My Match →
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section style={{ background: '#1a3d2e', paddingBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(36px,6vw,72px) 20px 0' }}>

          {/* Hero text */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
            <p style={{ color: '#86efac', fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Peer Support for Real Life Struggles
            </p>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem,7vw,3.75rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.5px' }}>
              You Are Not Alone in This.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(15px,2vw,18px)', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.65 }}>
              Connect with someone dealing with your exact struggle — breakup, anxiety, grief, or any of&nbsp;
              <strong style={{ color: 'white' }}>25 specific challenges</strong>. Peer support that truly understands you.
            </p>
            {/* CTA buttons — visible on all screen sizes */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
              <Link to="/signup" style={{ background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: 'white', fontWeight: 700, fontSize: 16, textDecoration: 'none', borderRadius: 50, padding: '14px 32px', boxShadow: '0 4px 20px rgba(124,58,237,0.45)', display: 'inline-flex', alignItems: 'center', minHeight: 52 }}>
                Find Someone Who Gets It →
              </Link>
              <Link to="/login" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, fontSize: 15, textDecoration: 'none', borderRadius: 50, padding: '14px 28px', border: '1.5px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', minHeight: 52 }}>
                Log in
              </Link>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 28 }}>
              🔒 Free · Anonymous · Takes 3 minutes
            </p>
          </div>

          {/* THREE SOULCONNECT CATEGORY CARDS */}
          {/* Desktop: 3-col grid | Mobile: horizontal scroll */}
          <div className="hidden md:grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>

            {/* Card 1 — Heal My Mind — deep indigo */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(160deg, #312e81 0%, #4338ca 100%)',
                borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(67,56,202,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ color: 'rgba(199,210,254,0.85)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Anxiety · Depression · Stress
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>Heal my mind</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '12px 0' }}>
                <LotusIllustration />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(199,210,254,0.7)', fontSize: 12 }}>Find your calm →</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
                  <path d="M13 16h7M18 13l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>

            {/* Card 2 — Mend My Heart — deep rose */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(160deg, #881337 0%, #be185d 100%)',
                borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(190,24,93,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ color: 'rgba(254,205,211,0.85)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Breakup · Grief · Loneliness
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>Mend my heart</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '12px 0' }}>
                <ConnectionIllustration />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(254,205,211,0.7)', fontSize: 12 }}>Feel less alone →</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
                  <path d="M13 16h7M18 13l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>

            {/* Card 3 — Find My Path — deep teal */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'linear-gradient(160deg, #134e4a 0%, #0f766e 100%)',
                borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(15,118,110,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ color: 'rgba(153,246,228,0.85)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Career · Identity · Purpose
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>Find my path</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '12px 0' }}>
                <CompassIllustration />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(153,246,228,0.7)', fontSize: 12 }}>Discover direction →</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
                  <path d="M13 16h7M18 13l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>

          </div>

          {/* Mobile cards — horizontal scroll */}
          <div className="md:hidden flex" style={{ gap: 12, overflowX: 'auto', paddingBottom: 8, marginBottom: 28, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {[
              { to: '/signup', bg: 'linear-gradient(160deg,#312e81 0%,#4338ca 100%)', tag: 'Anxiety · Depression', title: 'Heal my mind', sub: 'Find your calm →', illustration: <LotusIllustration /> },
              { to: '/signup', bg: 'linear-gradient(160deg,#881337 0%,#be185d 100%)', tag: 'Breakup · Grief', title: 'Mend my heart', sub: 'Feel less alone →', illustration: <ConnectionIllustration /> },
              { to: '/signup', bg: 'linear-gradient(160deg,#134e4a 0%,#0f766e 100%)', tag: 'Career · Purpose', title: 'Find my path', sub: 'Discover direction →', illustration: <CompassIllustration /> },
            ].map(card => (
              <Link key={card.title} to={card.to} style={{
                flexShrink: 0, width: '72vw', maxWidth: 260, minHeight: 280,
                background: card.bg, borderRadius: 20, padding: '24px 22px',
                textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                scrollSnapAlign: 'start',
              }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{card.tag}</p>
                  <p style={{ color: 'white', fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{card.title}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>{card.illustration}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{card.sub}</span>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
                    <path d="M13 16h7M18 13l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Problem pills row — clickable, 44px tap targets */}
          <div role="list" aria-label="Supported challenges" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, paddingBottom: 48 }}>
            {problems.map((p) => (
              <Link
                key={p}
                to="/signup"
                role="listitem"
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)', padding: '10px 18px', borderRadius: 999,
                  fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'inline-flex',
                  alignItems: 'center', minHeight: 44,
                }}
              >
                {p}
              </Link>
            ))}
            <Link
              to="/signup"
              role="listitem"
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.6)', padding: '10px 18px', borderRadius: 999,
                fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: 44,
              }}
            >
              +15 more
            </Link>
          </div>

        </div>

        {/* Wave transition to white */}
        <svg viewBox="0 0 1440 64" style={{ display: 'block', width: '100%', height: 64 }} preserveAspectRatio="none">
          <path fill="white" d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#f8faf9', padding: 'clamp(40px,6vw,72px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Start healing in 3 steps</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {steps.map(({ step, title, desc }) => (
              <div
                key={step}
                style={{
                  background: 'white', borderRadius: 16, padding: 'clamp(20px,3vw,36px)',
                  border: '1px solid #e5e7eb', textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14, background: '#1a3d2e',
                    color: 'white', fontWeight: 800, fontSize: 17,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  {step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}
      <section id="features" style={{ background: 'white', padding: 'clamp(40px,6vw,72px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>What We Offer</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Everything you need to heal</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {features.map(({ title, desc, icon }) => (
              <div
                key={title}
                style={{
                  background: '#f8faf9', borderRadius: 16, padding: 'clamp(20px,3vw,36px)',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ marginBottom: 20 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section id="testimonials" aria-label="User testimonials" style={{ background: '#f8faf9', padding: 'clamp(40px,6vw,72px) 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Real Stories</p>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>People who found their people</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t) => (
              <figure key={t.name} style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: t.avatarBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>{t.name}, {t.age}</p>
                    <span style={{ fontSize: 12, background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>{t.tag}</span>
                  </div>
                </div>
                <blockquote style={{ margin: 0 }}>
                  <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.75, fontStyle: 'italic' }}>{t.quote}</p>
                </blockquote>
                <div role="img" aria-label={`${t.stars} out of 5 stars`} style={{ marginTop: 14, color: '#f59e0b', fontSize: 14 }}>
                  {'★'.repeat(t.stars)}
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST STRIP
      ═══════════════════════════════════════ */}
      <section style={{ background: '#1a3d2e', padding: '28px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 40 }}>
          {[
            { icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="2" fill="#86efac"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
            ), label: '100% Anonymous' },
            { icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#86efac" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ), label: 'Verified Healers' },
            { icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14S2 10 2 6a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8z" fill="#86efac"/></svg>
            ), label: 'No Judgment' },
            { icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v4l3 2" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="6" stroke="#86efac" strokeWidth="1.5" fill="none"/></svg>
            ), label: 'Match in Minutes' },
            { icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#86efac" strokeWidth="1.5" fill="none"/><path d="M8 4v8M4 6h8M4 10h8" stroke="#86efac" strokeWidth="1" strokeLinecap="round"/></svg>
            ), label: 'Made for India' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {icon}
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ  (8 high-signal questions)
      ═══════════════════════════════════════ */}
      <FAQSection faqs={[
        { q: 'Is SoulConnect free to use?', a: 'Yes — creating an account, getting peer-matched, and joining support circles is completely free. Verified healer sessions are paid individually, starting at ₹500/session.' },
        { q: 'Is my identity kept anonymous?', a: 'Completely. Your real name, phone number, and social media are never shared with matches or visible publicly. You decide exactly what you reveal and when.' },
        { q: 'How does the peer matching work?', a: 'When you sign up, you select your primary challenge (e.g. anxiety, breakup, grief). Our algorithm matches you with someone going through the same specific issue — not just "mental health" broadly. Most people are matched within a few minutes.' },
        { q: 'Is this a replacement for therapy?', a: 'No — and we\'re honest about that. SoulConnect is peer support: real people who truly understand your struggle. For clinical care, we connect you with verified therapists and counsellors on the platform.' },
        { q: 'Which cities are support circles available in?', a: 'Online matching works across India. In-person circles run in Mumbai, Delhi, Bangalore, Pune, Chennai, Hyderabad, and 44 more cities — with new cities added every month.' },
        { q: 'Who are the verified healers?', a: 'Our healers are certified professionals — psychologists, therapists, counsellors, yoga teachers, Reiki practitioners, and life coaches. Every healer is manually reviewed before joining the platform.' },
        { q: 'What if I need urgent help?', a: 'SoulConnect is a supportive community, not a crisis service. If you\'re in immediate distress or having thoughts of self-harm, please contact iCall (9152987821) or Vandrevala Foundation (1860-2662-345), both available 24/7 across India.' },
        { q: 'How do I get started?', a: 'Sign up for free in about 3 minutes. Choose what you\'re going through, and we\'ll show you your first peer match. No credit card, no waiting list.' },
      ]} />

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section style={{ background: '#1a3d2e', padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background shape */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <p style={{ color: '#86efac', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
            Take the first step
          </p>
          <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.5px' }}>
            You deserve to feel<br />understood.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
            Join thousands of people who found their people on SoulConnect. Free, anonymous, and takes just 5 minutes.
          </p>
          <Link
            to="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center', minHeight: 52,
              background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: 'white',
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              padding: '14px 40px', borderRadius: 50,
              boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
              transition: 'all 0.2s',
            }}
          >
            Find My Match — It's Free →
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 16 }}>No credit card required</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{ background: '#f5f0eb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 28px 0' }}>

          {/* Top row: nav links + social icons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 24 }}>

            {/* Nav links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px' }}>
              {[
                { label: 'Home', href: '#' },
                { label: 'About', href: '#' },
                { label: 'FAQ', href: '#faq' },
                { label: 'How it Works', href: '#how-it-works' },
                { label: 'Find a Match', to: '/signup' },
                { label: 'Talk to a Healer', to: '/signup' },
                { label: 'Contact', href: '#' },
                { label: 'For Healers', to: '/signup' },
              ].map(({ label, href, to }) =>
                to ? (
                  <Link key={label} to={to}
                    style={{ color: '#3d5a4a', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#1a3d2e'}
                    onMouseLeave={e => e.target.style.color = '#3d5a4a'}>
                    {label}
                  </Link>
                ) : (
                  <a key={label} href={href}
                    style={{ color: '#3d5a4a', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#1a3d2e'}
                    onMouseLeave={e => e.target.style.color = '#3d5a4a'}>
                    {label}
                  </a>
                )
              )}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                /* Facebook */
                <svg key="fb" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                /* Instagram */
                <svg key="ig" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>,
                /* TikTok */
                <svg key="tt" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/></svg>,
                /* X / Twitter */
                <svg key="x" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                /* LinkedIn */
                <svg key="li" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2" fill="white"/></svg>,
              ].map((icon, i) => (
                <a key={i} href="#"
                  style={{ width: 38, height: 38, borderRadius: '50%', background: '#1a3d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2d6a4f'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1a3d2e'}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer logo */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 16px' }}>
            <img src="/logo-footer-monochrome.png" alt="SoulConnect" style={{ height: 56, width: 'auto', objectFit: 'contain', opacity: 0.85 }} />
          </div>

          <div style={{ height: 1, background: '#ddd5cc', marginBottom: 0 }} />

          {/* Bottom row: legal links + copyright */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 0 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {[
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Privacy Policy', href: '/terms#privacy' },
                { label: 'Cookie Settings', href: '#' },
                { label: 'Web Accessibility', href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  style={{ color: '#5a7a6a', fontSize: 13, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#1a3d2e'}
                  onMouseLeave={e => e.target.style.color = '#5a7a6a'}>
                  {label}
                </a>
              ))}
            </div>
            <p style={{ color: '#8a9e94', fontSize: 13, margin: 0 }}>© 2026 SoulConnect</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
