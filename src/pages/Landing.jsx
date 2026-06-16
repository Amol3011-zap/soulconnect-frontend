import React from 'react';
import { Link } from 'react-router-dom';

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

/* ── SVG Illustrations for the 3 hero cards ── */
const IndividualIllustration = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="130" rx="36" ry="6" fill="rgba(255,255,255,0.15)" />
    <circle cx="60" cy="36" r="22" fill="rgba(255,255,255,0.25)" />
    <circle cx="60" cy="32" r="14" fill="rgba(255,255,255,0.35)" />
    <ellipse cx="60" cy="26" rx="6" ry="7" fill="rgba(255,255,255,0.6)" />
    <path d="M38 90 Q60 70 82 90 L84 124 Q60 130 36 124 Z" fill="rgba(255,255,255,0.25)" />
    <path d="M42 94 Q60 78 78 94" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="60" cy="58" r="3" fill="rgba(255,255,255,0.5)" />
    <path d="M52 68 Q60 62 68 68" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const CouplesIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="70" cy="132" rx="44" ry="6" fill="rgba(255,255,255,0.15)" />
    <circle cx="46" cy="34" r="16" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="46" cy="28" rx="8" ry="9" fill="rgba(255,255,255,0.5)" />
    <path d="M28 88 Q46 72 64 88 L66 122 Q46 128 26 122 Z" fill="rgba(255,255,255,0.2)" />
    <circle cx="94" cy="34" r="16" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="94" cy="28" rx="8" ry="9" fill="rgba(255,255,255,0.5)" />
    <path d="M76 88 Q94 72 112 88 L114 122 Q94 128 74 122 Z" fill="rgba(255,255,255,0.2)" />
    <path d="M62 78 Q70 70 78 78" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M70 74 L70 62" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="70" cy="59" r="4" fill="rgba(255,255,255,0.5)" />
  </svg>
);

const HealerIllustration = () => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="132" rx="36" ry="6" fill="rgba(255,255,255,0.15)" />
    <circle cx="60" cy="32" r="20" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="60" cy="27" rx="10" ry="11" fill="rgba(255,255,255,0.5)" />
    <path d="M36 90 Q60 70 84 90 L86 124 Q60 132 34 124 Z" fill="rgba(255,255,255,0.2)" />
    <rect x="50" y="56" width="20" height="28" rx="4" fill="rgba(255,255,255,0.3)" />
    <path d="M56 64h8M60 60v8" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="88" cy="44" r="14" fill="rgba(255,255,255,0.2)" />
    <path d="M83 44h10M88 39v10" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="88" cy="44" r="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
  </svg>
);

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }}>

      {/* ═══════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════ */}
      <nav style={{ background: '#1a3d2e' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#2d6a4f" />
              <path d="M16 8 C10 8 7 12 7 15.5 C7 20 11 23 16 26 C21 23 25 20 25 15.5 C25 12 22 8 16 8Z" fill="#f59e0b" />
              <circle cx="16" cy="15" r="4" fill="white" opacity="0.3" />
            </svg>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px' }}>SoulConnect</span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#how-it-works" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>How it Works</a>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>Features</a>
            <a href="#healers" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>Healers</a>
            <a href="#faq" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>FAQ</a>
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              to="/signup"
              style={{
                color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 6,
                padding: '8px 20px', transition: 'all 0.2s',
              }}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              style={{
                background: '#f59e0b', color: '#1a1a1a', fontWeight: 700, fontSize: 14,
                textDecoration: 'none', borderRadius: 6, padding: '9px 22px',
                boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section style={{ background: '#1a3d2e', paddingBottom: 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px 0' }}>

          {/* Hero text */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#86efac', fontWeight: 600, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              Peer Support for Real Life Struggles
            </p>
            <h1 style={{ color: 'white', fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
              You Are Not Alone in This.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 18, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Connect with someone dealing with your exact struggle — breakup, anxiety, grief, or any of&nbsp;
              <strong style={{ color: 'white' }}>25 specific challenges</strong>. Real peer support that truly understands you.
            </p>
          </div>

          {/* THREE BIG CATEGORY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>

            {/* Card 1 — Individual Support */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: '#2d6a4f', borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Label top-left */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Individual Support
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>For myself</p>
              </div>

              {/* Illustration center */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '16px 0' }}>
                <IndividualIllustration />
              </div>

              {/* Arrow bottom-right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>
                  Get started
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.2)" />
                    <path d="M7 9h5M10 7l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Card 2 — Couples & Marriage */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: '#1a7a8a', borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Couples &amp; Marriage
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>For me &amp; my partner</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '16px 0' }}>
                <CouplesIllustration />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>
                  Get started
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.2)" />
                    <path d="M7 9h5M10 7l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Card 3 — Talk to a Healer */}
            <Link
              to="/signup"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: '#b5650d', borderRadius: 20, padding: 32, minHeight: 320,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Talk to a Healer
                </p>
                <p style={{ color: 'white', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>With a professional</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '16px 0' }}>
                <HealerIllustration />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>
                  Get started
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.2)" />
                    <path d="M7 9h5M10 7l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>

          </div>

          {/* Problem pills row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingBottom: 52 }}>
            {problems.map((p) => (
              <span
                key={p}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                }}
              >
                {p}
              </span>
            ))}
            <span
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.5)', padding: '6px 16px', borderRadius: 999, fontSize: 13,
              }}
            >
              +15 more
            </span>
          </div>

        </div>

        {/* Wave transition to white */}
        <svg viewBox="0 0 1440 64" style={{ display: 'block', width: '100%', height: 64 }} preserveAspectRatio="none">
          <path fill="white" d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
        </svg>
      </section>

      {/* ═══════════════════════════════════════
          STATS ROW
      ═══════════════════════════════════════ */}
      <section style={{ background: 'white', padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p style={{ fontSize: 40, fontWeight: 800, color: '#1a3d2e', lineHeight: 1.1, marginBottom: 6 }}>{value}</p>
              <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: '#f8faf9', padding: '88px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Start healing in 3 steps</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}>
            {steps.map(({ step, title, desc }, idx) => (
              <div
                key={step}
                style={{
                  background: 'white', borderRadius: 16, padding: 36,
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
      <section id="features" style={{ background: 'white', padding: '88px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>What We Offer</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Everything you need to heal</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map(({ title, desc, icon }) => (
              <div
                key={title}
                style={{
                  background: '#f8faf9', borderRadius: 16, padding: 36,
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
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section style={{ background: '#f8faf9', padding: '88px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Real People, Real Healing</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Stories that give us purpose</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map(({ initials, name, age, tag, avatarBg, quote, stars }) => (
              <div
                key={name}
                style={{
                  background: 'white', borderRadius: 16, padding: 32,
                  border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} style={{ color: '#f59e0b', fontSize: 15 }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%', background: avatarBg,
                      color: 'white', fontWeight: 700, fontSize: 15,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 2 }}>{name}, {age}</p>
                    <span
                      style={{
                        background: '#ecfdf5', color: '#065f46', fontSize: 11,
                        fontWeight: 600, padding: '2px 10px', borderRadius: 999,
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              display: 'inline-block', background: '#f59e0b', color: '#1a1a1a',
              fontWeight: 700, fontSize: 16, textDecoration: 'none',
              padding: '15px 40px', borderRadius: 8,
              boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
              transition: 'all 0.2s',
            }}
          >
            Start for Free — Find My Match
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 16 }}>No credit card required</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{ background: '#0f2419', padding: '40px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#2d6a4f" />
              <path d="M16 8 C10 8 7 12 7 15.5 C7 20 11 23 16 26 C21 23 25 20 25 15.5 C25 12 22 8 16 8Z" fill="#f59e0b" />
              <circle cx="16" cy="15" r="4" fill="white" opacity="0.3" />
            </svg>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>SoulConnect</span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>© 2026 SoulConnect. Made for every soul.</p>

          <div style={{ display: 'flex', gap: 28 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Terms</a>
            <Link to="/signup" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
