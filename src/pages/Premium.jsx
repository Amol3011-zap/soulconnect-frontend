import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FREE_FEATURES = [
  { text: 'Peer matching (up to 3 a day)', included: true },
  { text: '1:1 anonymous chat', included: true },
  { text: 'Browse healers', included: true },
  { text: 'Join 1 meetup/month', included: true },
  { text: 'Priority matching', included: false },
  { text: 'Unlimited meetups', included: false },
  { text: '20% healer discount', included: false },
  { text: 'Progress & mood tracking', included: false },
  { text: 'Ad-free experience', included: false },
];

const PREMIUM_FEATURES = [
  { text: 'Priority matching (under 10 min)', included: true },
  { text: 'Unlimited 1:1 anonymous chat', included: true },
  { text: 'Unlimited meetup access', included: true },
  { text: '20% discount on all healer sessions', included: true },
  { text: 'AI-powered mood & progress tracking', included: true },
  { text: 'Expand match radius (50 km)', included: true },
  { text: 'Ad-free, distraction-free experience', included: true },
  { text: 'Early access to new features', included: true },
];

function Check({ included }) {
  return included
    ? <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)' }}>✓</span>
    : <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>✕</span>;
}

export default function Premium() {
  const [billing, setBilling] = useState('monthly');
  const navigate = useNavigate();
  const monthlyPrice = 299;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.67 / 12);
  const price = billing === 'monthly' ? monthlyPrice : annualPrice;
  const saving = billing === 'annual' ? Math.round((1 - 0.67) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'20%', left:'30%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'20%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', top:'60%', left:'10%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)', filter:'blur(30px)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
            ✦ Invest in your healing journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text)' }}>Choose Your Plan</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Healing is not a luxury. Neither should support be.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="text-sm font-semibold" style={{ color: billing === 'monthly' ? 'var(--text)' : 'var(--text-muted)' }}>Monthly</span>
            <button
              onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-all duration-300"
              style={{ background: billing === 'annual' ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'var(--bg-subtle)' }}>
              <div className="absolute top-1 w-5 h-5 rounded-full shadow transition-all duration-300"
                style={{ left: billing === 'annual' ? '2rem' : '0.25rem', background: 'var(--bg-card)' }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: billing === 'annual' ? 'var(--text)' : 'var(--text-muted)' }}>Annual</span>
            {billing === 'annual' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a0533' }}>
                Save 33%
              </span>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* ── FREE ── */}
          <div className="rounded-3xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Current</p>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Free</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'var(--bg-subtle)' }}>🌱</div>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ color: 'var(--text)' }}>₹0</span>
                <span className="text-base ml-1" style={{ color: 'var(--text-muted)' }}>/month</span>
              </div>

              <ul className="space-y-3 mb-7">
                {FREE_FEATURES.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-3">
                    <Check included={included} />
                    <span className="text-sm" style={{ color: included ? 'var(--text)' : 'var(--text-muted)' }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <button disabled
                className="w-full py-3.5 rounded-2xl font-semibold text-sm"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                Current Plan
              </button>
            </div>
          </div>

          {/* ── PREMIUM ── */}
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(145deg, #2d1b69 0%, #1e3a8a 100%)',
              border: '1px solid rgba(168,85,247,0.4)',
              boxShadow: '0 0 60px rgba(139,92,246,0.25), 0 0 0 1px rgba(168,85,247,0.2)',
            }}>

            {/* Glow overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.25) 0%, transparent 65%)' }} />

            {/* POPULAR badge */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="px-5 py-1.5 rounded-full text-xs font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1a0533',
                  boxShadow: '0 4px 15px rgba(251,191,36,0.4)',
                }}>
                ⭐ MOST POPULAR
              </div>
            </div>

            <div className="p-7 pt-10 relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'rgba(196,181,253,0.6)' }}>Recommended</p>
                  <h2 className="text-2xl font-bold text-white">Premium</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,255,255,0.12)' }}>✨</div>
              </div>

              <div className="mb-1">
                <span className="text-5xl font-bold text-white">₹{price}</span>
                <span className="text-base ml-1" style={{ color: 'rgba(196,181,253,0.6)' }}>/month</span>
              </div>
              {billing === 'annual' && (
                <p className="text-xs mb-5" style={{ color: '#86efac' }}>
                  Billed as ₹{price * 12}/year — saving ₹{(monthlyPrice - price) * 12}/yr
                </p>
              )}
              {billing === 'monthly' && <div className="mb-5" />}

              <ul className="space-y-3 mb-7">
                {PREMIUM_FEATURES.map(({ text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#a855f7,#3b82f6)' }}>✓</span>
                    <span className="text-sm text-white">{text}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #ffffff, #f0e7ff)',
                  color: '#4c1d95',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                Upgrade to Premium ✦
              </button>

              <p className="text-center text-xs mt-4" style={{ color: 'rgba(196,181,253,0.5)' }}>
                Cancel anytime · No questions asked · Secure payment
              </p>
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {[
            ['🔒', 'Secure & private'],
            ['🏆', 'Trusted by 10K+ users'],
            ['💙', 'Cancel anytime'],
            ['🤝', '24/7 peer support'],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
          ✦ &nbsp; Your healing journey is sacred. We are here to support it. &nbsp; ✦
        </p>
      </div>
    </div>
  );
}
