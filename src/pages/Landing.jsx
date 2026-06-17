import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Data ───────────────────────────────────────────────────────────────────────

const NAV_LINKS = ['How It Works', 'Features', 'Healers', 'Circles', 'Resources', 'About Us'];

const STATS = [
  { icon: '👥', value: '12,000+', label: 'People Helped' },
  { icon: '🧘', value: '500+',    label: 'Verified Healers' },
  { icon: '🌍', value: '50+',     label: 'Cities' },
  { icon: '💛', value: '25+',     label: 'Life Challenges' },
];

const SOUL_STAGES = [
  { emoji: '🌱', title: 'Beginning',        desc: 'Take your first step toward healing',   color: '#34C38F', active: true },
  { emoji: '✨', title: 'Healing',           desc: 'Release what no longer serves you',     color: '#A78BFA' },
  { emoji: '🌸', title: 'Growth',            desc: 'Discover strength you never knew',      color: '#F472B6' },
  { emoji: '🦋', title: 'Transformation',   desc: 'Emerge as your authentic self',         color: '#F5B841' },
  { emoji: '🕊️', title: 'Inner Harmony',   desc: 'Live in peace and alignment',           color: '#60A5FA' },
];

const CATEGORIES = [
  { icon: '💔', label: 'Breakup &\nHeartbreak',   bg: '#FFF1F2', iconBg: '#FFE4E6', color: '#E11D48' },
  { icon: '🧠', label: 'Anxiety &\nOverthinking', bg: '#F5F3FF', iconBg: '#EDE9FE', color: '#7C3AED' },
  { icon: '🌧',  label: 'Grief &\nLoss',          bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#2563EB' },
  { icon: '😔', label: 'Loneliness &\nIsolation', bg: '#F0FDF4', iconBg: '#DCFCE7', color: '#16A34A' },
  { icon: '💼', label: 'Career &\nWork Stress',   bg: '#FFFBEB', iconBg: '#FEF3C7', color: '#D97706' },
  { icon: '🌙', label: 'Sleep &\nInsomnia',       bg: '#FAF5FF', iconBg: '#F3E8FF', color: '#9333EA' },
];

const STEPS = [
  { num: '01', title: 'Choose Your Struggle',    desc: "Pick the challenge you're facing right now.",     emoji: '🧘' },
  { num: '02', title: 'Get Matched Anonymously', desc: 'We connect you with people who truly understand.', emoji: '💫' },
  { num: '03', title: 'Heal Together',           desc: 'Share, listen, support and grow together.',        emoji: '🫂' },
];

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

const TESTIMONIALS = [
  { name: 'Riya, 24',   city: 'Mumbai',    img: TESTIMONIAL_IMGS[0], quote: "I was going through the worst breakup of my life. SoulConnect helped me find people who really understood me." },
  { name: 'Arjun, 27',  city: 'Bangalore', img: TESTIMONIAL_IMGS[1], quote: "The anxiety support circle changed everything for me. I don't feel alone anymore. I feel seen." },
  { name: 'Priya, 31',  city: 'Delhi',     img: TESTIMONIAL_IMGS[2], quote: "After my dad passed away, I thought I'd never be okay. The grief circle gave me a new family." },
];

const CIRCLES = [
  { title: 'Anxiety Support Circle',    time: 'Today, 7:00 PM',    joined: 12, img: CIRCLE_IMGS[0] },
  { title: 'Heartbreak Healing Circle', time: 'Tomorrow, 6:30 PM', joined: 8,  img: CIRCLE_IMGS[1] },
  { title: 'Grief & Loss Circle',       time: 'Sun, 7:00 PM',      joined: 15, img: CIRCLE_IMGS[2] },
];

const HEALERS = [
  { name: 'Dr. Meera Shah', role: 'Counselor · 8+ Years',  spec: 'Anxiety, Trauma, Relationships', rating: 4.9, img: HEALER_IMGS[0] },
  { name: 'Rohit Verma',    role: 'Therapist · 6+ Years',  spec: 'Depression, Grief, Stress',      rating: 4.8, img: HEALER_IMGS[1] },
  { name: 'Ananya Iyer',    role: 'Life Coach · 5+ Years', spec: 'Confidence, Purpose, Healing',   rating: 4.9, img: HEALER_IMGS[2] },
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
  { q: 'What is SoulConnect?', a: 'SoulConnect is a wellness platform that connects individuals with experienced Reiki healers, energy healers, meditation guides, spiritual mentors, life coaches, and holistic wellness practitioners who support emotional, mental, spiritual, and personal growth.' },
  { q: 'How does Reiki and Energy Healing work?', a: "Reiki and energy healing are holistic wellness practices that aim to support relaxation, stress reduction, emotional balance, and overall well-being. Every person's experience is unique, and sessions are designed to create a calm and supportive healing environment." },
  { q: 'Are online healing sessions effective?', a: 'Many clients report positive experiences from online and distance healing sessions. Practitioners use various techniques to facilitate relaxation, mindfulness, energy balancing, and spiritual support regardless of location.' },
  { q: 'Are your practitioners verified?', a: 'Yes. SoulConnect reviews practitioner profiles, certifications, experience, and background information before allowing them to offer services on the platform.' },
  { q: 'Can healing sessions replace medical treatment?', a: 'No. SoulConnect services are not a substitute for medical treatment, psychotherapy, psychiatric care, or professional healthcare advice. Always consult qualified healthcare professionals regarding medical or mental health concerns.' },
  { q: 'What can I expect during my first session?', a: "Your first session typically includes an introduction, discussion of your goals or concerns, and the practitioner's chosen healing approach. Sessions are conducted in a respectful, confidential, and judgment-free environment." },
  { q: 'Is my information kept confidential?', a: 'Yes. We take privacy seriously. Personal information and session details are handled with care and in accordance with our Privacy Policy.' },
  { q: 'How do I choose the right healer or coach?', a: 'You can browse practitioner profiles, specialties, experience, certifications, reviews, languages spoken, pricing, and availability to find someone who aligns with your needs and goals.' },
  { q: 'What happens if I need to cancel or reschedule?', a: "Appointments can usually be rescheduled or canceled according to the practitioner's cancellation policy. We recommend reviewing the cancellation terms before booking your session." },
  { q: 'What types of services are available on SoulConnect?', a: 'SoulConnect offers: Reiki Healing, Energy Healing, Sound Healing, Meditation Guidance, Breathwork, Spiritual Coaching, Life Coaching, Relationship Coaching, Chakra Balancing, Mindfulness Practices, and Holistic Wellness Programs.' },
  { q: 'Are results guaranteed?', a: 'No. Healing, coaching, and wellness services are highly personal experiences. Results vary from person to person, and no specific outcome can be guaranteed.' },
];

// Deterministic particles — no Math.random() to avoid SSR flicker
const PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  x: 5  + (i * 43 + i * i *  7) % 550,
  y: 10 + (i * 67 + i * i * 13) % 620,
  r: 0.7 + (i % 5) * 0.55,
  op: 0.10 + (i % 6) * 0.07,
  dur: 3.2 + (i % 5) * 1.4,
  del: (i % 9) * 0.45,
  col: i % 3 === 0 ? '#F4C842' : i % 3 === 1 ? '#C4B5FD' : '#93C5FD',
}));

// ── Spiritual Hero Illustration (pure SVG, no images) ─────────────────────────

function SpiritualIllustration() {
  const outerPetals = [0, 45, 90, 135, 180, 225, 270, 315];
  const innerPetals = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  const chakras = [
    { y: 140, c: '#C4B5FD', r: 6   },
    { y: 166, c: '#818CF8', r: 5   },
    { y: 206, c: '#67E8F9', r: 4.5 },
    { y: 242, c: '#6EE7B7', r: 5   },
    { y: 268, c: '#FDE68A', r: 4.5 },
    { y: 291, c: '#FCA5A5', r: 4   },
    { y: 313, c: '#FDA4AF', r: 4   },
  ];

  return (
    <svg viewBox="0 0 560 640" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="44%" r="56%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.38" />
          <stop offset="45%"  stopColor="#4C1D95" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0C0A22" stopOpacity="0"    />
        </radialGradient>
        <radialGradient id="figGrad" cx="35%" cy="25%" r="70%">
          <stop offset="0%"   stopColor="#EDE9FE" />
          <stop offset="55%"  stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
        <radialGradient id="lotusGold" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#FEF3C7" />
          <stop offset="55%"  stopColor="#F4C842" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.45" />
        </radialGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="cGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Aura background */}
      <ellipse cx="280" cy="300" rx="270" ry="315" fill="url(#bgGlow)" />

      {/* Concentric aura rings */}
      {[260, 218, 176, 134, 92].map((r, i) => (
        <circle key={i} cx="280" cy="290" r={r}
          fill="none"
          stroke={`rgba(196,181,253,${0.05 + i * 0.025})`}
          strokeWidth={i === 0 ? 0.5 : 0.9}
          strokeDasharray={i % 2 === 1 ? '5 9' : 'none'}
        />
      ))}

      {/* Sacred geometry: 6 radial spokes */}
      {[0, 30, 60, 90, 120, 150].map((deg, i) => {
        const a = deg * Math.PI / 180;
        return <line key={i}
          x1={280 + 265 * Math.cos(a)} y1={290 + 265 * Math.sin(a)}
          x2={280 - 265 * Math.cos(a)} y2={290 - 265 * Math.sin(a)}
          stroke="rgba(196,181,253,0.05)" strokeWidth="0.7" />;
      })}

      {/* Sacred hexagon */}
      <polygon
        points={[0,60,120,180,240,300].map(d => {
          const a = d * Math.PI / 180;
          return `${280 + 108 * Math.cos(a)},${290 + 108 * Math.sin(a)}`;
        }).join(' ')}
        fill="none" stroke="rgba(196,181,253,0.08)" strokeWidth="1"
      />

      {/* Lotus outer petals */}
      {outerPetals.map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const cx = 280 + 44 * Math.cos(a), cy = 440 + 26 * Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="13" ry="30"
          fill="url(#lotusGold)" opacity={0.5 + (i % 3) * 0.1}
          transform={`rotate(${deg},${cx},${cy})`} filter="url(#glow)" />;
      })}

      {/* Lotus inner petals */}
      {innerPetals.map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const cx = 280 + 22 * Math.cos(a), cy = 436 + 14 * Math.sin(a);
        return <ellipse key={i} cx={cx} cy={cy} rx="8" ry="19"
          fill="url(#lotusGold)" opacity={0.75}
          transform={`rotate(${deg},${cx},${cy})`} />;
      })}
      <circle cx="280" cy="436" r="12" fill="#F4C842" opacity="0.92" filter="url(#glow)" />
      <circle cx="280" cy="436" r="5"  fill="#FEF3C7" opacity="0.98" />

      {/* Figure: head */}
      <circle cx="280" cy="167" r="40" fill="url(#figGrad)" opacity="0.93" filter="url(#glow)" />
      {/* Crown halo */}
      <circle cx="280" cy="167" r="56" fill="none" stroke="rgba(196,181,253,0.22)" strokeWidth="1.5" strokeDasharray="3 6" />
      {/* Neck */}
      <rect x="273" y="207" width="14" height="22" rx="7" fill="url(#figGrad)" opacity="0.88" />
      {/* Torso */}
      <path d="M 248 228 Q 234 272 228 318 Q 252 328 280 326 Q 308 328 332 318 Q 326 272 312 228 Z"
        fill="url(#figGrad)" opacity="0.88" />
      {/* Left arm */}
      <path d="M 250 236 Q 212 252 198 280 Q 212 294 228 288 Q 244 268 256 250 Z"
        fill="url(#figGrad)" opacity="0.80" />
      {/* Right arm */}
      <path d="M 310 236 Q 348 252 362 280 Q 348 294 332 288 Q 316 268 304 250 Z"
        fill="url(#figGrad)" opacity="0.80" />
      {/* Hands */}
      <ellipse cx="207" cy="292" rx="12" ry="8" fill="url(#figGrad)" opacity="0.74" />
      <ellipse cx="353" cy="292" rx="12" ry="8" fill="url(#figGrad)" opacity="0.74" />
      {/* Crossed legs */}
      <path d="M 230 318 Q 204 338 192 374 Q 216 390 252 380 Q 268 360 280 352 Q 292 360 308 380 Q 344 390 368 374 Q 356 338 330 318 Q 306 328 280 326 Q 254 328 230 318 Z"
        fill="url(#figGrad)" opacity="0.82" />

      {/* Chakra centers */}
      {chakras.map((c, i) => (
        <g key={i}>
          <circle cx="280" cy={c.y} r={c.r + 5} fill={c.c} opacity="0.10" />
          <circle cx="280" cy={c.y} r={c.r}     fill={c.c} opacity="0.88" filter="url(#cGlow)">
            <animate attributeName="opacity" values="0.55;1;0.55" dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" />
            <animate attributeName="r" values={`${c.r};${c.r + 1.8};${c.r}`} dur={`${2.2 + i * 0.35}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Energy channel */}
      <path d="M 280 134 C 276 165 284 205 280 242 C 276 268 284 291 280 313"
        stroke="rgba(196,181,253,0.26)" strokeWidth="1.5" fill="none" strokeDasharray="4 7" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity={p.op}>
          <animate attributeName="cy"      values={`${p.y};${p.y - 20};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${p.op};${Math.min(p.op + 0.22, 0.65)};${p.op}`}
            dur={`${p.dur * 0.8}s`} begin={`${p.del}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

// ── Soul Journey Section ───────────────────────────────────────────────────────

function SoulJourneySection() {
  return (
    <section style={{
      padding: 'clamp(56px, 6vw, 88px) clamp(16px, 3vw, 48px)',
      background: 'linear-gradient(180deg, #FAF8F6 0%, #F0EBFF 50%, #FAF8F6 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 320, opacity: 0.025, pointerEvents: 'none', lineHeight: 1 }}>🪷</div>

      <div style={{ maxWidth: 1700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#7C5CFC', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
            Your Transformation Path
          </p>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.02em', margin: '0 auto 14px', lineHeight: 1.2 }}>
            Every Soul Heals in Five Stages
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Wherever you are right now, there is a path forward. Your journey is unique — and you don't walk it alone.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          {/* Rainbow connecting line */}
          <div style={{ position: 'absolute', top: 48, left: '9%', right: '9%', height: 2, background: 'linear-gradient(90deg, #34C38F, #A78BFA, #F472B6, #F5B841, #60A5FA)', opacity: 0.3, borderRadius: 2, pointerEvents: 'none' }} />

          {SOUL_STAGES.map((stage, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', padding: '0 6px' }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                background: stage.active
                  ? `linear-gradient(135deg, ${stage.color}22, ${stage.color}55)`
                  : 'rgba(255,255,255,0.8)',
                border: stage.active
                  ? `2.5px solid ${stage.color}`
                  : '2px solid rgba(196,181,253,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 38, marginBottom: 18, position: 'relative', zIndex: 1,
                boxShadow: stage.active
                  ? `0 0 0 8px ${stage.color}15, 0 12px 32px ${stage.color}28`
                  : '0 4px 16px rgba(0,0,0,0.06)',
              }}>
                {stage.emoji}
                <div style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 24, height: 24, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${stage.color}, ${stage.color}bb)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                  boxShadow: `0 2px 8px ${stage.color}50`,
                }}>
                  {i + 1}
                </div>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: stage.active ? '#1E1B4B' : '#4B5563', marginBottom: 6 }}>
                {stage.title}
              </h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.55, maxWidth: 138 }}>
                {stage.desc}
              </p>

              {stage.active && (
                <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: `${stage.color}18`, border: `1px solid ${stage.color}40` }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: stage.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: stage.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Start Here</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <Link to="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '15px 38px', borderRadius: 14, fontSize: 15, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)',
            boxShadow: '0 6px 24px rgba(124,92,252,0.36)',
          }}>
            Begin Your Soul Journey →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Reusable ───────────────────────────────────────────────────────────────────

function FAQ({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, border: open === i ? '1.5px solid #A78BFA' : '1.5px solid #EDE9FE', overflow: 'hidden', transition: 'border-color 0.2s', boxShadow: open === i ? '0 4px 20px rgba(124,92,252,0.08)' : 'none' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#1E1B4B' }}>{faq.q}</span>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: open === i ? '#7C5CFC' : '#F5F3FF', color: open === i ? 'white' : '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && <div style={{ padding: '0 22px 18px', color: '#6B7280', fontSize: 14, lineHeight: 1.75 }}>{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 44 }}>
      {eyebrow && <p style={{ fontSize: 12, fontWeight: 700, color: '#7C5CFC', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.02em', margin: '0 auto 14px', maxWidth: center ? 580 : 'none', lineHeight: 1.22 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 16, color: '#6B7280', maxWidth: center ? 520 : 'none', margin: center ? '0 auto' : 0, lineHeight: 1.65 }}>{subtitle}</p>}
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!document.getElementById('sc-fonts')) {
      const link = document.createElement('link');
      link.id = 'sc-fonts'; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap';
      document.head.appendChild(link);
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTxt = scrolled ? '#1E1B4B' : 'rgba(255,255,255,0.86)';

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#FAF8F6', color: '#1E1B4B', overflowX: 'hidden' }}>

      <style>{`
        @keyframes fadeUp  { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
        @keyframes shimmer { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp 0.75s ease both; }
        .float   { animation: floatY 5.5s ease-in-out infinite; }
        .sc-btn-primary { transition: transform 0.18s, box-shadow 0.18s; }
        .sc-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 18px 44px rgba(124,92,252,0.48) !important; }
        .sc-card-hover { transition: transform 0.22s, box-shadow 0.22s; }
        .sc-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.11) !important; }
        .sc-cat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .sc-cat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.10) !important; }
        @media (max-width: 860px) {
          .hero-grid  { grid-template-columns: 1fr !important; }
          .hero-art   { display: none !important; }
          .two-col    { grid-template-columns: 1fr !important; }
          .soul-row   { flex-direction: column !important; align-items: center !important; }
          .footer-grid{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ══════════════════════ NAVBAR ══════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(22px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(22px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(237,233,254,0.6)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? '0 2px 24px rgba(124,92,252,0.07)' : 'none',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1700, margin: '0 auto', width: '100%', padding: '0 clamp(16px, 2.5vw, 48px)', display: 'flex', alignItems: 'center' }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 14px rgba(124,92,252,0.38)' }}>🪷</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: scrolled ? '#1E1B4B' : '#fff', letterSpacing: '-0.02em', lineHeight: 1, transition: 'color 0.3s' }}>
                Soul<span style={{ color: '#A78BFA' }}>Connect</span>
              </div>
              <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
            </div>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: navTxt, textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.background = scrolled ? '#F5F3FF' : 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = navTxt; e.currentTarget.style.background = 'transparent'; }}>
                {l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <Link to="/login" style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: scrolled ? '#1E1B4B' : 'rgba(255,255,255,0.88)', textDecoration: 'none', border: scrolled ? '1.5px solid #D1D5DB' : '1.5px solid rgba(255,255,255,0.28)', background: 'transparent', transition: 'all 0.2s' }}>
              Log In
            </Link>
            <Link to="/signup" className="sc-btn-primary" style={{ padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)', boxShadow: '0 4px 16px rgba(124,92,252,0.42)' }}>
              Find My Match
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(v => !v)} style={{ marginLeft: 'auto', width: 40, height: 40, borderRadius: 10, background: scrolled ? '#F5F3FF' : 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 18, height: 2, background: scrolled ? '#7C5CFC' : '#fff', borderRadius: 2, display: 'block' }} />)}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(12,10,34,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 72, left: 0, right: 0, background: '#fff', padding: '20px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(l => <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 0', fontSize: 15, fontWeight: 500, color: '#1E1B4B', textDecoration: 'none', borderBottom: '1px solid #F5F3FF' }}>{l}</a>)}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/login"  onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#1E1B4B', textDecoration: 'none', border: '1.5px solid #D1D5DB' }}>Log In</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)' }}>Find My Match</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section style={{
        background: 'linear-gradient(148deg, #0C0A22 0%, #17093A 30%, #260A58 62%, #100726 100%)',
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Background depth layers */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[520, 400, 290].map((r, i) => (
            <div key={i} style={{
              position: 'absolute', top: '50%', right: '-4%',
              width: r * 2, height: r * 2, marginTop: -r, marginRight: -r,
              borderRadius: '50%',
              border: `1px solid rgba(124,92,252,${0.035 + i * 0.018})`,
              borderStyle: i === 1 ? 'dashed' : 'solid',
            }} />
          ))}
          <div style={{ position: 'absolute', top: '15%',  left: '3%',   width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.11) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '8%', right: '8%',  width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,90,255,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: '55%',  left: '28%',  width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,200,66,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="hero-grid" style={{
          width: 'min(95vw, 1700px)', margin: '0 auto',
          padding: '80px clamp(20px, 2.5vw, 60px) 72px',
          display: 'grid', gridTemplateColumns: '45fr 55fr',
          gap: 'clamp(40px, 4vw, 80px)',
          alignItems: 'center', position: 'relative', zIndex: 1,
        }}>

          {/* LEFT: Copy */}
          <div className="fade-up" style={{ minWidth: 0 }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', borderRadius: 24, background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(167,139,250,0.3)', marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A78BFA', display: 'inline-block', animation: 'shimmer 2.2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Trusted by 12,000+ Healing Souls
              </span>
            </div>

            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(3.4rem, 6.5vw, 8rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: 26,
            }}>
              Heal.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 40%, #F4C842 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', fontStyle: 'italic',
              }}>Connect.</span>
              <br />Transform.
            </h1>

            <p style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.78, marginBottom: 10, maxWidth: 520 }}>
              Whether you're healing from heartbreak, battling anxiety, or searching for deeper meaning — find the people, healers, and tools that truly get you.
            </p>
            <p style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', color: '#A78BFA', fontWeight: 600, marginBottom: 42, fontStyle: 'italic' }}>
              Your healing journey starts now. 🪷
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 44 }}>
              <Link to="/signup" className="sc-btn-primary" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '18px 44px', borderRadius: 16, fontSize: 17, fontWeight: 700,
                color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)',
                boxShadow: '0 8px 32px rgba(124,92,252,0.52)',
              }}>
                Begin Your Journey →
              </Link>
              <a href="#how-it-works" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '18px 32px', borderRadius: 16, fontSize: 17, fontWeight: 600,
                color: 'rgba(255,255,255,0.84)', textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)', transition: 'all 0.2s',
              }}>
                ▶ How It Works
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {[['🔒','Anonymous & Safe'], ['🌸','Judgment-Free'], ['✨','Free To Join']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.46)', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Spiritual illustration */}
          <div className="hero-art float" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, height: 'clamp(520px, 64vh, 780px)' }}>
            <SpiritualIllustration />

            <div style={{ position: 'absolute', top: 36, left: '4%', background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', borderRadius: 18, padding: '12px 20px', boxShadow: '0 12px 36px rgba(124,92,252,0.42)', zIndex: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Currently Healing</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>1,247 souls 🌸</div>
            </div>

            <div style={{ position: 'absolute', bottom: 44, right: '2%', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderRadius: 20, padding: '14px 20px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 14, zIndex: 2 }}>
              <div style={{ display: 'flex' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, hsl(${250+i*28},70%,65%), hsl(${278+i*24},60%,55%))`, border: '2px solid rgba(255,255,255,0.25)', marginLeft: i > 0 ? -10 : 0 }} />
                ))}
              </div>
              <div>
                <div style={{ color: '#F4C842', fontSize: 13, marginBottom: 2 }}>★★★★★</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>4.9/5</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.46)' }}>2,300+ members</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════ TRUST BAR (overlaps hero) ══════════════════════ */}
      <section style={{ padding: '0 clamp(20px, 3vw, 48px)', position: 'relative', zIndex: 10, marginTop: -80 }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <div style={{
            background: '#fff', borderRadius: 28,
            padding: 'clamp(26px, 3vw, 42px) clamp(28px, 4vw, 60px)',
            boxShadow: '0 20px 72px rgba(0,0,0,0.14)',
            border: '1px solid rgba(237,233,254,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 0 160px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 18, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, marginTop: 3 }}>{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div className="hidden md:block" style={{ width: 1, height: 44, background: '#EDE9FE', marginLeft: 'auto' }} />}
              </div>
            ))}
            <div style={{ flex: '1 0 200px', borderLeft: '3px solid #EDE9FE', paddingLeft: 28 }}>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: '#6B7280', lineHeight: 1.65, margin: '0 0 6px' }}>
                "SoulConnect changed my life. I finally felt understood."
              </p>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#7C5CFC' }}>— Neha, 28</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ SOUL JOURNEY ══════════════════════ */}
      <SoulJourneySection />

      {/* ══════════════════════ CATEGORIES ══════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <SectionHeader title="You're Not Alone In What You're Facing" subtitle="Whatever you're going through, there are others here who truly get it." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={i} to="/signup" className="sc-cat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, background: cat.bg, borderRadius: 24, padding: '36px 20px', textDecoration: 'none', border: '1.5px solid transparent', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 72, height: 72, borderRadius: 24, background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>{cat.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{cat.label}</span>
                <span style={{ fontSize: 12, color: cat.color, fontWeight: 700 }}>Find support →</span>
              </Link>
            ))}
            <Link to="/signup" className="sc-cat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', borderRadius: 24, padding: '36px 20px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(124,92,252,0.32)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>→</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>View All{'\n'}Challenges</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#FAF8F6' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <SectionHeader title="How SoulConnect Works" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block" style={{ position: 'absolute', top: 60, left: '60%', right: '-10%', height: 2, background: 'linear-gradient(90deg, #EDE9FE, #DDD6FE)', zIndex: 0, borderRadius: 2 }}>
                    <div style={{ position: 'absolute', right: -4, top: -4, width: 10, height: 10, borderRadius: '50%', background: '#A78BFA' }} />
                  </div>
                )}
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '2px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, marginBottom: 24, position: 'relative', zIndex: 1, boxShadow: '0 8px 32px rgba(124,92,252,0.12)' }}>
                  {step.emoji}
                  <div style={{ position: 'absolute', top: -10, right: -10, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', boxShadow: '0 4px 12px rgba(124,92,252,0.42)' }}>
                    {step.num}
                  </div>
                </div>
                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1E1B4B', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.72, maxWidth: 240 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
            <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 42px', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)', boxShadow: '0 6px 24px rgba(124,92,252,0.38)' }}>
              Start Your Journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <SectionHeader title="Real Stories. Real Healing." subtitle="Thousands of people have found their people here." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="sc-card-hover" style={{ background: '#FAF8F6', borderRadius: 28, padding: '32px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 48, color: '#EDE9FE', fontFamily: 'Georgia', lineHeight: 1, marginBottom: 14 }}>"</div>
                <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 24 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img src={t.img} alt={t.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #EDE9FE' }} loading="lazy" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.city}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: 15 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CIRCLES + HEALERS ══════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#FAF8F6' }}>
        <div className="two-col" style={{ maxWidth: 1700, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Upcoming Support Circles</h2>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '5px 0 0' }}>Safe spaces to share and heal together</p>
              </div>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none', padding: '7px 16px', borderRadius: 10, background: '#F5F3FF' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CIRCLES.map((c, i) => (
                <div key={i} className="sc-card-hover" style={{ borderRadius: 22, overflow: 'hidden', border: '1.5px solid #EDE9FE', position: 'relative', height: 154 }}>
                  <img src={c.img} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,27,75,0.78) 0%, rgba(30,27,75,0.38) 65%, transparent 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '20px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', marginBottom: 10 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>{c.time}</span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>{c.title}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>👥 {c.joined} joined · 60 min</span>
                      <button onClick={() => { window.location.href = '/signup'; }} style={{ padding: '8px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: '#fff', color: '#7C5CFC', border: 'none', cursor: 'pointer' }}>Join Circle</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Top Healers</h2>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '5px 0 0' }}>Verified wellness professionals</p>
              </div>
              <Link to="/signup" style={{ fontSize: 12, fontWeight: 600, color: '#7C5CFC', textDecoration: 'none', padding: '7px 16px', borderRadius: 10, background: '#F5F3FF' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {HEALERS.map((h, i) => (
                <div key={i} className="sc-card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 22, padding: '20px', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <img src={h.img} alt={h.name} style={{ width: 56, height: 56, borderRadius: 18, objectFit: 'cover', flexShrink: 0, border: '2px solid #EDE9FE' }} loading="lazy" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1E1B4B' }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{h.role}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{h.spec}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, justifyContent: 'flex-end' }}>
                      <span style={{ color: '#F59E0B' }}>★</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E1B4B' }}>{h.rating}</span>
                    </div>
                    <button onClick={() => { window.location.href = '/signup'; }} style={{ padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,92,252,0.3)' }}>
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ DAILY TOOLS ══════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#fff' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <SectionHeader title="Daily Healing Tools" subtitle="Simple tools to support your journey every single day." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {TOOLS.map((tool, i) => (
              <Link key={i} to="/signup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '32px 20px', borderRadius: 24, background: '#FAF8F6', border: '1.5px solid #EDE9FE', textDecoration: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(124,92,252,0.12)'; e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.background = '#F5F3FF'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#EDE9FE'; e.currentTarget.style.background = '#FAF8F6'; }}>
                <div style={{ width: 60, height: 60, borderRadius: 20, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{tool.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1E1B4B', textAlign: 'center' }}>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section style={{ padding: 'clamp(60px, 7vw, 96px) clamp(16px, 3vw, 48px)', background: '#FAF8F6' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about SoulConnect." />
          <FAQ faqs={FAQS} />
        </div>
      </section>

      {/* ══════════════════════ FINAL CTA ══════════════════════ */}
      <section style={{ padding: 'clamp(72px, 8vw, 112px) clamp(16px, 3vw, 48px)', background: 'linear-gradient(148deg, #0C0A22 0%, #17093A 35%, #260A58 65%, #100726 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,200,66,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🪷</div>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.18, marginBottom: 18, letterSpacing: '-0.02em' }}>
            Your healing journey<br />
            <span style={{ background: 'linear-gradient(135deg, #C4B5FD, #F4C842)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>
              can begin today.
            </span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginBottom: 42, lineHeight: 1.65 }}>
            Take the first step. We're here for you.
          </p>
          <Link to="/signup" className="sc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 52px', borderRadius: 16, fontSize: 17, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7C5CFC, #6D4EE8)', boxShadow: '0 10px 40px rgba(124,92,252,0.52)' }}>
            Find My Support Match →
          </Link>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.32)', marginTop: 20 }}>
            🔒 Free · Anonymous · Takes 3 Minutes
          </p>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: '#0C0A22', padding: 'clamp(48px, 5vw, 72px) clamp(16px, 3vw, 48px) 32px' }}>
        <div style={{ maxWidth: 1700, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🪷</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>Soul<span style={{ color: '#A78BFA' }}>Connect</span></div>
                  <div style={{ fontSize: 9, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.78, maxWidth: 260, marginBottom: 24 }}>
                A safe, anonymous spiritual wellness platform for real life struggles.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['📘','📸','🐦','💼'].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,92,252,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform', links: ['How It Works', 'Find a Match', 'Support Circles', 'Healers', 'Meditations'] },
              { title: 'Company',  links: ['About Us', 'For Healers', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal',    links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; }}>
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', margin: 0 }}>© 2026 SoulConnect. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link to="/terms" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}>
                Terms of Use
              </Link>
              <Link to="/terms#privacy" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}>
                Privacy Policy
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Made with 💜 for those who need it most</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
