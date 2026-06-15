import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '12,000+', label: 'People Helped' },
  { value: '25',      label: 'Problem Categories' },
  { value: '500+',    label: 'Verified Healers' },
  { value: '50+',     label: 'Cities in India' },
];

const features = [
  {
    icon: '💬',
    title: 'Problem-Matched Peers',
    desc: 'We match you with someone dealing with your exact issue — not just "mental health" in general. Same breakup. Same anxiety. Same grief.',
    color: 'from-rose-400 to-pink-500',
  },
  {
    icon: '🧘',
    title: 'Verified Healers',
    desc: 'When peer support isn\'t enough, book 1:1 sessions with certified Pranic healers starting at ₹500/hr.',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: '🤝',
    title: 'Real-Life Meetups',
    desc: 'Weekly in-person circles in your city — small groups (max 8) built around your specific struggle.',
    color: 'from-amber-400 to-orange-500',
  },
];

const steps = [
  { step: '01', title: 'Choose Your Problem', desc: 'Pick from 25 specific life challenges — from breakups to OCD to financial stress.' },
  { step: '02', title: 'Get Matched Instantly', desc: 'Our algorithm finds someone nearby dealing with the same issue within minutes.' },
  { step: '03', title: 'Heal Together', desc: 'Chat, meet up, or book a healer. You are never alone in this journey.' },
];

const testimonials = [
  {
    initials: 'P',
    name: 'Priya S.',
    age: 28,
    tag: 'Breakup',
    color: 'bg-rose-500',
    quote: '"I felt completely alone after my breakup. SoulConnect matched me with someone 2 months into the same journey. For the first time, someone truly understood."',
    stars: 5,
  },
  {
    initials: 'R',
    name: 'Rohan M.',
    age: 31,
    tag: 'Work Anxiety',
    color: 'bg-violet-500',
    quote: '"Anxiety was destroying my career. I found peers going through the exact same thing. Went from 8/10 anxiety to 3/10 in just 6 weeks."',
    stars: 5,
  },
  {
    initials: 'K',
    name: 'Kavya T.',
    age: 35,
    tag: 'Marriage Problems',
    color: 'bg-amber-500',
    quote: '"My marriage was falling apart. SoulConnect matched me with couples navigating the same issues. Their honesty showed me I was not alone."',
    stars: 5,
  },
];

const problems = [
  '💔 Breakup', '😰 Anxiety', '😢 Depression', '💑 Marriage', '😔 Loneliness',
  '💼 Career Stress', '🕯️ Grief', '💸 Financial', '😴 Sleep', '😤 Anger',
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #3b0764 25%, #6d1b7b 50%, #c2185b 75%, #ff6f00 100%)' }}>

        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-blob animation-delay-0 absolute top-10 left-10 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #f472b6, transparent)' }} />
          <div className="animate-blob animation-delay-2000 absolute top-40 right-16 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #c084fc, transparent)' }} />
          <div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/3 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex justify-between items-center px-6 py-5 max-w-6xl mx-auto w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌟</span>
              <span className="text-xl font-bold text-white tracking-tight">SoulConnect</span>
            </div>
            <p className="text-xs text-white/50 ml-10 -mt-0.5 tracking-wide">Find Your People. See The Path. Feel Better Today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signup" className="text-white/80 hover:text-white font-medium text-sm transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="pulse-glow bg-amber-400 hover:bg-amber-300 text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm transition-all"
            >
              Get Started Free →
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">

          {/* Badge */}

          <h1 className="fade-in-up delay-200 text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-4xl">
            You Are <span className="gradient-text">Not Alone</span><br />
            in This.
          </h1>

          <p className="fade-in-up delay-300 text-lg md:text-xl text-white/75 max-w-2xl mb-10 leading-relaxed">
            Match with someone dealing with your exact struggle — breakup, anxiety, grief, or any of
            <strong className="text-white"> 25 specific challenges</strong>. Peer support that actually understands you.
          </p>

          <div className="fade-in-up delay-400 flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/signup"
              className="pulse-glow bg-amber-400 hover:bg-amber-300 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl"
            >
              Find My Match Now →
            </Link>
            <a href="#how-it-works"
              className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur">
              How it Works
            </a>
          </div>

          {/* Problem pills */}
          <div className="fade-in-up delay-500 flex flex-wrap justify-center gap-2 max-w-2xl">
            {problems.map((p) => (
              <span key={p} className="bg-white/10 backdrop-blur border border-white/20 text-white/80 px-3 py-1 rounded-full text-sm">
                {p}
              </span>
            ))}
            <span className="bg-white/10 backdrop-blur border border-white/20 text-white/60 px-3 py-1 rounded-full text-sm">
              +15 more...
            </span>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" className="w-full block" preserveAspectRatio="none" style={{ height: 80 }}>
            <path fill="#f9fafb" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-extrabold text-purple-700 mb-1">{value}</p>
                <p className="text-gray-500 font-medium text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #fdf4ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Start healing in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-rose-300 via-purple-300 to-amber-300" />

            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-rose-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-lg">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Everything you need to heal</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc, color }) => (
              <div key={title} className="group relative bg-gray-50 hover:bg-white rounded-2xl p-8 border border-gray-100 hover:border-purple-100 hover:shadow-xl transition-all duration-300 cursor-default">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TRUST STRIP ───── */}
      <section className="py-10 px-6" style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #db2777 100%)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10 text-white text-center">
          {['🔒 100% Anonymous', '✅ Verified Healers', '❤️ No Judgment', '⚡ Match in Minutes', '🇮🇳 Made for India'].map((item) => (
            <span key={item} className="font-semibold text-sm opacity-90">{item}</span>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #fdf4ff 0%, #f0f9ff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold text-sm uppercase tracking-widest mb-3">Real People, Real Healing</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Stories that give us purpose</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(({ initials, name, age, tag, color, quote, stars }) => (
              <div key={name} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">{quote}</p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{name}, {age}</p>
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">{tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="py-24 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3b0764 0%, #6d1b7b 50%, #c2185b 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
          <div className="animate-blob animation-delay-2000 absolute -bottom-10 -left-10 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #f472b6, transparent)' }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-amber-300 font-semibold text-sm uppercase tracking-widest mb-4">Take the first step</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            You deserve to be<br />
            <span className="gradient-text">understood.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Join thousands of people who found their people on SoulConnect. It's free, anonymous, and takes 5 minutes.
          </p>
          <Link
            to="/signup"
            className="pulse-glow inline-block bg-amber-400 hover:bg-amber-300 text-gray-900 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-2xl"
          >
            Start for Free — Find My Match →
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="text-white font-bold">SoulConnect</span>
          </div>
          <p className="text-sm text-center">© 2026 SoulConnect. Made for every soul.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <Link to="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
