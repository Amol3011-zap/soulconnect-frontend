import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// ── Color constants ────────────────────────────────────────────────────────────
const P    = '#6D4AFF';
const LAV  = '#A78BFA';
const GRN  = '#34C38F';
const GOLD = '#F5B841';
const PINK = '#F472B6';
const BG   = '#FAF7FF';

const NAV_LINKS = ['Community', 'Circles', 'Challenges', 'Events', 'Resources', 'About'];

// ── LotusIllustration SVG ─────────────────────────────────────────────────────
function LotusIllustration() {
  const cx = 300, cy = 300;

  const outerAngles  = [0, 45, 90, 135, 180, 225, 270, 315];
  const middleAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  const innerAngles  = [0, 60, 120, 180, 240, 300];

  const particleColors = [GOLD, LAV, PINK];
  const particles = Array.from({ length: 16 }, (_, i) => ({
    x:   40 + (i * 37 + i * i * 11) % 520,
    y:   40 + (i * 53 + i * i *  7) % 520,
    r:   1.2 + (i % 4) * 0.6,
    op:  0.12 + (i % 5) * 0.08,
    dur: 3.2 + (i % 5) * 1.1,
    del: (i % 7) * 0.6,
    col: particleColors[i % 3],
  }));

  return (
    <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        {/* Background halo gradient */}
        <radialGradient id="lotusHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F0EBFF" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#F0EBFF" stopOpacity="0"/>
        </radialGradient>

        {/* Page background orb */}
        <radialGradient id="lotusBgOrb" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#EDE9FE" stopOpacity="0.55"/>
          <stop offset="60%"  stopColor="#DDD6FE" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0"/>
        </radialGradient>

        {/* Outer petal gradient */}
        <linearGradient id="outerPetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#DDD6FE"/>
          <stop offset="100%" stopColor="#C4B5FD"/>
        </linearGradient>

        {/* Center glow gradient */}
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff"  stopOpacity="1"/>
          <stop offset="60%"  stopColor={GOLD}  stopOpacity="0.7"/>
          <stop offset="100%" stopColor={GOLD}  stopOpacity="0"/>
        </radialGradient>

        {/* Soft blur filter for outer petals */}
        <filter id="lotusBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Center glow filter */}
        <filter id="centerGlowFilter" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background halo */}
      <circle cx={cx} cy={cy} r={260} fill="url(#lotusHalo)"/>

      {/* Background radial orb */}
      <circle cx={cx} cy={cy} r={240} fill="url(#lotusBgOrb)"/>

      {/* Sacred geometry: 5 concentric circles */}
      {[80, 120, 160, 200, 240].map((r, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`rgba(167,139,250,0.08)`}
          strokeWidth={i % 2 === 0 ? 0.8 : 1}
          strokeDasharray={i % 2 === 1 ? '4 8' : 'none'}
        />
      ))}

      {/* Outer 8 petals */}
      {outerAngles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const px  = cx + 120 * Math.cos(rad);
        const py  = cy + 120 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={22} ry={55}
            fill="url(#outerPetal)"
            opacity={0.85}
            transform={`rotate(${deg},${px},${py})`}
            filter="url(#lotusBlur)"
          />
        );
      })}

      {/* Middle 8 petals */}
      {middleAngles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const px  = cx + 80 * Math.cos(rad);
        const py  = cy + 80 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={16} ry={40}
            fill="#EDE9FE"
            opacity={0.9}
            transform={`rotate(${deg},${px},${py})`}
          />
        );
      })}

      {/* Inner 6 petals */}
      {innerAngles.map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const px  = cx + 45 * Math.cos(rad);
        const py  = cy + 45 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={10} ry={24}
            fill="#F5F3FF"
            opacity={0.95}
            transform={`rotate(${deg},${px},${py})`}
          />
        );
      })}

      {/* Center glow */}
      <circle cx={cx} cy={cy} r={30} fill="url(#centerGlow)" filter="url(#centerGlowFilter)"/>

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={15} fill={GOLD}/>
      <circle cx={cx} cy={cy} r={8}  fill="#FEF9C3"/>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity={p.op}>
          <animate
            attributeName="cy"
            values={`${p.y};${p.y - 18};${p.y}`}
            dur={`${p.dur}s`}
            begin={`${p.del}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${p.op};${Math.min(p.op + 0.22, 0.6)};${p.op}`}
            dur={`${p.dur * 0.85}s`}
            begin={`${p.del}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 52 }}>
      {eyebrow && (
        <p style={{
          fontSize: 12, fontWeight: 700,
          color: light ? LAV : P,
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12,
        }}>{eyebrow}</p>
      )}
      <h2 style={{
        fontFamily: '"Playfair Display",Georgia,serif',
        fontSize: 'clamp(1.9rem,3.2vw,2.9rem)',
        fontWeight: 800,
        color: light ? '#fff' : '#0F0F1A',
        letterSpacing: '-0.025em',
        margin: '0 auto 16px',
        maxWidth: center ? 640 : 'none',
        lineHeight: 1.22,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          fontSize: 17,
          color: light ? 'rgba(255,255,255,0.6)' : '#6B7280',
          maxWidth: center ? 560 : 'none',
          margin: center ? '0 auto' : 0,
          lineHeight: 1.72,
        }}>{subtitle}</p>
      )}
    </div>
  );
}

// ── Main Landing ──────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids   = ['sc-pjs', 'sc-playfair'];
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

  const FONT = "'Plus Jakarta Sans',Inter,-apple-system,sans-serif";

  return (
    <div style={{ fontFamily: FONT, background: BG, color: '#0F0F1A', overflowX: 'hidden' }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-16px); } }
        @keyframes pulse   { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
        @keyframes shimmer { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        .fade-up { animation: fadeUp 0.9s ease both; }
        .float   { animation: floatY 7s ease-in-out infinite; }
        .sc-card-hover { transition: transform 0.22s, box-shadow 0.22s; }
        .sc-card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.1) !important; }
        .sc-btn-primary { transition: transform 0.2s, box-shadow 0.2s; }
        .sc-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(109,74,255,0.52) !important; }
        @media (max-width: 900px) {
          .hero-grid   { grid-template-columns: 1fr !important; }
          .hero-art    { height: 420px !important; }
          .two-col     { grid-template-columns: 1fr !important; }
          .three-col   { grid-template-columns: 1fr 1fr !important; }
          .safety-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .three-col   { grid-template-columns: 1fr !important; }
          .safety-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 72,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(109,74,255,0.1)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 2px 28px rgba(109,74,255,0.08)' : 'none',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 1400, margin: '0 auto',
          padding: '0 clamp(16px,3vw,72px)',
          display: 'flex', alignItems: 'center',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 13,
              background: `linear-gradient(135deg,${P},${LAV})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: `0 4px 16px rgba(109,74,255,0.4)`,
            }}>🪷</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: scrolled ? '#0F0F1A' : '#fff', letterSpacing: '-0.02em', lineHeight: 1, transition: 'color 0.35s' }}>
                Soul<span style={{ color: LAV }}>Connect</span>
              </div>
              <div style={{ fontSize: 9, color: LAV, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Heal · Connect · Grow</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(l => (
              <a key={l} href="#" style={{
                padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                color: scrolled ? '#6B7280' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none', transition: 'all 0.18s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = scrolled ? P : '#fff';
                  e.currentTarget.style.background = scrolled ? '#F0EBFF' : 'rgba(255,255,255,0.10)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = scrolled ? '#6B7280' : 'rgba(255,255,255,0.75)';
                  e.currentTarget.style.background = 'transparent';
                }}>{l}</a>
            ))}
          </div>

          {/* Desktop right buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <Link to="/login" style={{
              padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              color: scrolled ? '#0F0F1A' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              border: scrolled ? '1.5px solid #D1D5DB' : '1.5px solid rgba(255,255,255,0.25)',
              background: 'transparent', transition: 'all 0.2s',
            }}>Login</Link>
            <Link to="/signup" className="sc-btn-primary" style={{
              padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              color: '#fff', textDecoration: 'none',
              background: `linear-gradient(135deg,${P},#5B3CE8)`,
              boxShadow: '0 4px 18px rgba(109,74,255,0.44)',
            }}>Get Started</Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(v => !v)} style={{
            display: 'none',
            marginLeft: 'auto', width: 42, height: 42, borderRadius: 11,
            background: scrolled ? '#F0EBFF' : 'rgba(255,255,255,0.1)',
            border: 'none', cursor: 'pointer',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
            className="mobile-ham"
          >
            {[0, 1, 2].map(i => <span key={i} style={{ width: 20, height: 2, background: scrolled ? P : '#fff', borderRadius: 2, display: 'block' }}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(15,10,36,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: 72, left: 0, right: 0,
              background: '#fff', padding: '24px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
              fontFamily: FONT,
            }}
            onClick={e => e.stopPropagation()}
          >
            {NAV_LINKS.map(l => (
              <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '15px 0', fontSize: 16, fontWeight: 500,
                color: '#0F0F1A', textDecoration: 'none', borderBottom: '1px solid #F0EBFF',
              }}>{l}</a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#0F0F1A', textDecoration: 'none', border: '1.5px solid #D1D5DB' }}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg,${P},#5B3CE8)` }}>Create Account</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 1 — OUR VISION ── */}
      <section style={{
        background: 'linear-gradient(160deg,#FAF7FF 0%,#F5F0FF 40%,#FAF7FF 100%)',
        paddingTop: 'clamp(120px,12vw,160px)',
        paddingBottom: 'clamp(80px,8vw,120px)',
        paddingLeft: 'clamp(16px,3vw,72px)',
        paddingRight: 'clamp(16px,3vw,72px)',
      }}>
        <div className="hero-grid" style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 60, alignItems: 'center' }}>

          {/* LEFT */}
          <div className="fade-up">
            <p style={{ fontSize: 12, fontWeight: 700, color: P, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
              OUR VISION —
            </p>
            <h1 style={{
              fontFamily: '"Playfair Display",Georgia,serif',
              fontSize: 'clamp(2.8rem,4.5vw,4.8rem)',
              fontWeight: 800, color: '#1A0533',
              lineHeight: 1.12, letterSpacing: '-0.03em',
              marginBottom: 0,
            }}>
              A world where nobody has to struggle alone.
            </h1>
            <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.8, marginTop: 24, maxWidth: 480 }}>
              SoulConnect exists to help people find understanding, connection, and support through communities, wellness circles, guided reflection, and human connection.
            </p>
            <p style={{ color: P, fontWeight: 700, fontSize: 16, marginTop: 20, fontStyle: 'italic' }}>
              Because healing shouldn't happen in isolation.
            </p>

            {/* Three feature mini-cards */}
            <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
              {[
                { emoji: '💜', label: 'Heal',    sub: 'Find support' },
                { emoji: '🤝', label: 'Connect', sub: 'Build real bonds' },
                { emoji: '🌱', label: 'Grow',    sub: 'Become your best self' },
              ].map((c, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 16, padding: '16px 20px',
                  border: '1.5px solid #EDE9FE',
                  boxShadow: '0 4px 20px rgba(109,74,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F0EBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {c.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A0533' }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Lotus art */}
          <div className="hero-art float" style={{
            height: 'clamp(500px,55vw,660px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Background radial blur */}
            <div style={{
              position: 'absolute', width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0,
              pointerEvents: 'none',
            }}/>
            <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
              <LotusIllustration/>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — WHY WE STARTED + ROADMAP ── */}
      <section style={{ background: '#F4F0FC', padding: 'clamp(72px,8vw,112px) clamp(16px,3vw,72px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* LEFT — Why We Started */}
            <div style={{
              background: '#fff', borderRadius: 24, padding: '48px 40px',
              boxShadow: '0 4px 32px rgba(109,74,255,0.06)',
              border: '1px solid #EDE9FE', height: '100%',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
                WHY WE STARTED
              </p>
              <h3 style={{
                fontFamily: '"Playfair Display",Georgia,serif',
                fontSize: 'clamp(1.3rem,2vw,1.75rem)',
                fontWeight: 800, color: '#1A0533',
                lineHeight: 1.28, marginBottom: 32,
              }}>
                Millions of people experience challenges like these every day.
              </h3>

              {/* Challenge icons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                {[
                  { emoji: '😰', label: 'Anxiety',    bg: '#F5F3FF', color: '#7C3AED' },
                  { emoji: '💔', label: 'Heartbreak', bg: '#FFF1F2', color: '#E11D48' },
                  { emoji: '🌧', label: 'Loneliness', bg: '#EFF6FF', color: '#2563EB' },
                  { emoji: '🕯', label: 'Grief',      bg: '#FFFBEB', color: '#D97706' },
                  { emoji: '🔥', label: 'Burnout',    bg: '#FFF7ED', color: '#EA580C' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: item.bg, borderRadius: 16, padding: '12px 16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    minWidth: 80,
                  }}>
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 15, fontWeight: 700, color: '#1A0533', marginBottom: 8 }}>
                Yet most suffer silently.
              </p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.8, marginBottom: 32 }}>
                We believe healing happens faster when people feel understood and supported. That's why we built SoulConnect.
              </p>

              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: P, color: '#fff', textDecoration: 'none',
                fontSize: 14, fontWeight: 700,
                boxShadow: '0 6px 24px rgba(109,74,255,0.3)',
              }}>Join the Movement →</Link>
            </div>

            {/* RIGHT — Roadmap */}
            <div style={{
              background: '#fff', borderRadius: 24, padding: '48px 40px',
              boxShadow: '0 4px 32px rgba(109,74,255,0.06)',
              border: '1px solid #EDE9FE', height: '100%',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
                OUR ROADMAP
              </p>
              <h3 style={{
                fontFamily: '"Playfair Display",Georgia,serif',
                fontSize: 'clamp(1.3rem,2vw,1.75rem)',
                fontWeight: 800, color: '#1A0533',
                lineHeight: 1.28, marginBottom: 40,
              }}>
                Building the future of healing, together.
              </h3>

              {/* Horizontal timeline */}
              <div style={{ position: 'relative', marginBottom: 40 }}>
                {/* Horizontal line */}
                <div style={{
                  position: 'absolute', top: 20, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg,${P} 0%,${P} 50%,rgba(167,139,250,0.3) 50%,rgba(167,139,250,0.3) 100%)`,
                  zIndex: 0,
                }}/>

                {/* Phases grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, position: 'relative', zIndex: 1 }}>
                  {[
                    { label: 'Phase 1', title: 'Community Matching',        done: true,  current: false },
                    { label: 'Phase 2', title: 'Healing Circles',           done: true,  current: false },
                    { label: 'Phase 3', title: 'Mood Tracking & Journaling',done: true,  current: false },
                    { label: 'Phase 4', title: 'Guide Marketplace',         done: false, current: true  },
                    { label: 'Phase 5', title: 'Live Wellness Events',      done: false, current: false },
                    { label: 'Phase 6', title: 'Mobile App',                done: false, current: false },
                  ].map((phase, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      {/* Circle */}
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        margin: '0 auto 10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...(phase.done
                          ? { background: P, color: '#fff', fontSize: 16, boxShadow: '0 0 0 4px rgba(109,74,255,0.15)' }
                          : phase.current
                          ? { background: '#fff', border: `2px solid ${P}`, color: P, fontSize: 14, boxShadow: '0 0 0 4px rgba(109,74,255,0.1)' }
                          : { background: '#F5F3FF', border: '1.5px solid #DDD6FE', color: '#9CA3AF', fontSize: 12 }
                        ),
                      }}>
                        {phase.done ? '✓' : phase.current ? '→' : '⏳'}
                      </div>
                      <div style={{ fontSize: 10, color: P, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
                        {phase.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#374151', fontWeight: 600, lineHeight: 1.4 }}>
                        {phase.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: 'transparent', color: P, textDecoration: 'none',
                fontSize: 14, fontWeight: 700, border: '2px solid #DDD6FE',
              }}>See Full Roadmap →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — JOIN THE COMMUNITY (DARK) ── */}
      <section style={{
        background: 'linear-gradient(135deg,#0F0A24 0%,#1A0B3B 40%,#2A0D5E 70%,#1E0B45 100%)',
        padding: 'clamp(72px,8vw,112px) clamp(16px,3vw,72px)',
      }}>
        <div className="two-col" style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 64, alignItems: 'center' }}>

          {/* LEFT — Dark image overlay area */}
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            minHeight: 420,
            background: 'linear-gradient(145deg,#1a0b3b 0%,#2d1060 50%,#1a0b3b 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40,
          }}>
            {/* Decorative glow orbs */}
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,184,65,0.15) 0%,transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ position: 'absolute', top: '40%', left: '50%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(109,74,255,0.25) 0%,transparent 70%)', pointerEvents: 'none' }}/>

            {/* People silhouettes SVG */}
            <svg viewBox="0 0 300 200" style={{ position: 'absolute', top: '5%', left: 0, right: 0, width: '100%', height: '55%', opacity: 0.55 }} aria-hidden="true">
              <defs>
                <radialGradient id="warmGlow" cx="50%" cy="60%" r="40%">
                  <stop offset="0%" stopColor={GOLD} stopOpacity="0.35"/>
                  <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
                </radialGradient>
              </defs>
              <ellipse cx="150" cy="140" rx="80" ry="30" fill="url(#warmGlow)"/>
              {[
                { x: 150, y: 80 },
                { x: 95,  y: 108 },
                { x: 205, y: 108 },
                { x: 70,  y: 150 },
                { x: 230, y: 150 },
              ].map((f, i) => (
                <g key={i}>
                  <circle cx={f.x} cy={f.y - 12} r={9}  fill={GOLD} opacity="0.6"/>
                  <ellipse cx={f.x} cy={f.y + 6} rx={7} ry={14} fill={GOLD} opacity="0.45"/>
                </g>
              ))}
            </svg>

            {/* EARLY ACCESS badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,184,65,0.15)', border: '1px solid rgba(245,184,65,0.4)',
              borderRadius: 20, padding: '6px 16px', marginBottom: 20, width: 'fit-content',
            }}>
              <span style={{ color: GOLD, fontSize: 14 }}>★</span>
              <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>NOW LIVE</span>
            </div>

            <h3 style={{
              fontFamily: '"Playfair Display",Georgia,serif',
              fontSize: 'clamp(1.6rem,2.5vw,2.2rem)',
              fontWeight: 800, color: '#fff', lineHeight: 1.28, marginBottom: 16,
            }}>
              We're building SoulConnect<br/>with our first community.
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 28 }}>
              We're working closely with early members, wellness practitioners, and circle hosts to create a safe, supportive, and life-changing platform.
            </p>

            {/* Badges row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['🌱 Building in Public', '⭐ Early Access Benefits', '💜 Founding Members'].map((b, i) => (
                <span key={i} style={{
                  fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 20, padding: '6px 14px',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — text content */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: LAV, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
              JOIN THE COMMUNITY
            </p>
            <h2 style={{
              fontFamily: '"Playfair Display",Georgia,serif',
              fontSize: 'clamp(1.8rem,2.8vw,3rem)',
              fontWeight: 800, color: '#fff', lineHeight: 1.22, marginBottom: 20,
            }}>
              Be among the first to experience SoulConnect.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 32 }}>
              SoulConnect is now live. Connect with people who understand your journey, join support circles, track your growth, and discover healing through community.
            </p>

            {/* Feature badges 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
              {['✨ Community Matching', '🌀 Wellness Circles', '📊 Mood Tracking', '📝 Healing Journal'].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, padding: '12px 16px',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Two buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/login" style={{
                flex: 1, minWidth: 140, textAlign: 'center',
                padding: '14px 28px', borderRadius: 12,
                background: '#fff', color: P, textDecoration: 'none',
                fontSize: 15, fontWeight: 700,
                boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
              }}>Login</Link>
              <Link to="/signup" style={{
                flex: 1, minWidth: 140, textAlign: 'center',
                padding: '14px 28px', borderRadius: 12,
                background: `linear-gradient(135deg,${P},#5B3CE8)`,
                color: '#fff', textDecoration: 'none',
                fontSize: 15, fontWeight: 700,
                boxShadow: '0 8px 28px rgba(109,74,255,0.5)',
              }}>Create Account</Link>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 16 }}>
              No spam. No waitlist. Start healing today.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — GET STARTED ── */}
      <section style={{ background: '#fff', padding: 'clamp(72px,8vw,112px) clamp(16px,3vw,72px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* LEFT */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: P, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
                GET STARTED
              </p>
              <h2 style={{
                fontFamily: '"Playfair Display",Georgia,serif',
                fontSize: 'clamp(1.9rem,3.2vw,2.9rem)',
                fontWeight: 800, color: '#0F0F1A',
                lineHeight: 1.22, letterSpacing: '-0.025em', marginBottom: 16,
              }}>
                Start Your Healing Journey Today
              </h2>
              <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.72, marginBottom: 36 }}>
                Join a growing community focused on connection, wellness, personal growth, and healing.
              </p>

              {/* Feature list */}
              <div style={{ marginBottom: 36 }}>
                {['Find Your Circle', 'Match With Like-Minded People', 'Join Healing Challenges', 'Track Your Progress'].map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 0', borderBottom: '1px solid #F0EBFF',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, flexShrink: 0, color: GRN,
                    }}>✓</div>
                    <span style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/login" style={{
                  padding: '13px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                  color: P, textDecoration: 'none', border: `2px solid ${P}`, background: 'transparent',
                }}>Login</Link>
                <Link to="/signup" className="sc-btn-primary" style={{
                  padding: '13px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  color: '#fff', textDecoration: 'none',
                  background: `linear-gradient(135deg,${P},#5B3CE8)`,
                  boxShadow: '0 6px 24px rgba(109,74,255,0.4)',
                }}>Create Free Account</Link>
              </div>
            </div>

            {/* RIGHT — Card stack illustration */}
            <div style={{ position: 'relative', height: 400 }}>
              {/* Background blur card */}
              <div style={{
                position: 'absolute', top: 0, left: 20, right: 20, height: 380,
                borderRadius: 24, background: '#F5F0FF', border: '1.5px solid #EDE9FE',
              }}/>
              {/* Main card */}
              <div style={{
                position: 'relative', background: '#fff', borderRadius: 24, padding: 36,
                border: '1.5px solid #EDE9FE',
                boxShadow: '0 8px 48px rgba(109,74,255,0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: `linear-gradient(135deg,${P},${LAV})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  }}>🪷</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F0F1A', fontSize: 16 }}>Your Healing Journey</div>
                    <div style={{ color: GRN, fontSize: 13, fontWeight: 600 }}>● Active</div>
                  </div>
                </div>

                {/* Progress bars */}
                {[
                  { label: 'Soul Journey',          progress: 45, color: P    },
                  { label: 'Daily Challenges',       progress: 67, color: GRN  },
                  { label: 'Community Connection',   progress: 30, color: PINK },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: 12, color: item.color, fontWeight: 700 }}>{item.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: '#F0EBFF', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: item.color, borderRadius: 4 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — BUILT WITH SAFETY IN MIND ── */}
      <section style={{ background: BG, padding: 'clamp(72px,8vw,112px) clamp(16px,3vw,72px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="BUILT WITH SAFETY IN MIND"
            title="Your safety is our highest priority."
            subtitle="Every feature of SoulConnect is designed with your wellbeing, privacy, and security in mind."
          />

          <div className="safety-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
            {[
              { icon: '🛡️', title: 'Community Guidelines',    desc: 'Respect, kindness and inclusion.' },
              { icon: '🔒', title: 'Privacy Protection',       desc: 'Your data is yours. Always.' },
              { icon: '🚨', title: 'Crisis Resources',          desc: 'Help is always available.' },
              { icon: '💜', title: 'Peer Support First',        desc: 'Community before clinical.' },
              { icon: '📋', title: 'Guide Agreements',          desc: 'Professional standards and responsibilities.' },
              { icon: '⚠️', title: 'Moderation & Reporting',   desc: 'Report concerns anonymously.' },
            ].map((item, i) => (
              <div key={i} className="sc-card-hover" style={{
                background: '#fff', borderRadius: 20, padding: '28px 20px', textAlign: 'center',
                border: '1.5px solid #EDE9FE', boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: '#F0EBFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 16px',
                }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F0F1A', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — YOU ARE NOT ALONE CTA ── */}
      <section style={{
        background: 'linear-gradient(148deg,#0F0A24 0%,#1E0B45 50%,#2A0D5E 100%)',
        padding: 'clamp(80px,9vw,128px) clamp(16px,3vw,72px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorative glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(109,74,255,0.18) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}/>

        <div className="two-col" style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60,
          alignItems: 'center', position: 'relative', zIndex: 1,
        }}>

          {/* LEFT */}
          <div>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🪷</div>
            <h2 style={{
              fontFamily: '"Playfair Display",Georgia,serif',
              fontSize: 'clamp(2.4rem,4vw,4rem)',
              fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 20,
            }}>
              You Are Not Alone.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.60)', lineHeight: 1.80, marginBottom: 40, maxWidth: 480 }}>
              Whether you're navigating anxiety, heartbreak, grief, loneliness, burnout, or life transitions, SoulConnect is here to help you find connection and support.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/login" style={{
                padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                color: P, textDecoration: 'none', background: '#fff',
                boxShadow: '0 4px 20px rgba(255,255,255,0.2)',
              }}>Login</Link>
              <Link to="/signup" className="sc-btn-primary" style={{
                padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                color: '#fff', textDecoration: 'none',
                background: `linear-gradient(135deg,${P},#5B3CE8)`,
                boxShadow: '0 8px 28px rgba(109,74,255,0.5)',
              }}>Create Account</Link>
            </div>
          </div>

          {/* RIGHT — Glassmorphism card */}
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24, padding: 48, textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg,${P},${LAV})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, margin: '0 auto 24px',
              boxShadow: `0 16px 48px rgba(109,74,255,0.4)`,
            }}>💜</div>
            <h3 style={{
              fontFamily: '"Playfair Display",Georgia,serif',
              fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12,
            }}>You are not alone.</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 28 }}>
              Whenever you need support, we're here to walk with you.
            </p>
            <Link to="/crisis-support" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 12,
              background: `linear-gradient(135deg,${P},${LAV})`,
              color: '#fff', textDecoration: 'none',
              fontSize: 14, fontWeight: 700,
              boxShadow: `0 8px 28px rgba(109,74,255,0.4)`,
            }}>Crisis Resources →</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer/>

    </div>
  );
}
