import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, HeartHandshake, LifeBuoy, Heart, ArrowRight } from 'lucide-react';

/* "Dawn" palette — same tokens as the landing page */
const P          = '#6B4FA0';
const DARK       = '#221B3A';
const NAVY_SOFT  = '#5B5470';
const MUTED      = '#6E6784';
const GOLD_TXT   = '#8A6A3E';
const CREAM_2    = '#F3EFF9';
const LILAC_LINE = '#E6DDF3';

const STYLES = `
  .sc-footer-link {
    background:none; border:none; cursor:pointer; text-align:left; padding:0;
    color:${NAVY_SOFT}; font-size:14px; font-family:inherit;
    transition:color .2s ease, transform .2s ease; display:flex; align-items:center; gap:8px;
    line-height:1.5;
  }
  .sc-footer-link:hover { color:${P}; transform:translateX(3px); }
  .sc-footer-link.crisis { color:#9A4A30; }
  .sc-footer-link.crisis:hover { color:#7A3420; }
  .sc-social-btn {
    width:42px; height:42px; border-radius:50%; border:1px solid ${LILAC_LINE};
    background:${CREAM_2}; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:background .2s ease, color .2s ease, transform .2s ease;
    text-decoration:none; color:${P};
  }
  .sc-social-btn:hover { background:${P}; color:#FFFFFF; transform:translateY(-2px); }
  .sc-crisis-chip {
    display:inline-flex; align-items:center; gap:7px;
    background:#FFFFFF; border:1px solid #F1D6C8;
    border-radius:12px; padding:10px 14px; font-size:13px; font-weight:700;
    color:#7A3A24; text-decoration:none; white-space:nowrap;
    transition:border-color .2s ease, box-shadow .2s ease;
  }
  .sc-crisis-chip:hover { border-color:#E0A585; box-shadow:0 6px 16px rgba(154,63,42,0.08); }
  .sc-crisis-btn { transition:background .2s ease, transform .2s ease; }
  .sc-crisis-btn:hover { background:#9A4A30 !important; transform:translateY(-1px); }
  .sc-footer-root a:focus-visible, .sc-footer-root button:focus-visible { outline:3px solid #C9B8E8; outline-offset:3px; }
  @media(max-width:768px){
    .sc-footer-grid { grid-template-columns:1fr !important; gap:40px !important; }
    .sc-footer-bottom { flex-direction:column !important; text-align:center !important; gap:8px !important; }
    .sc-footer-root { padding-bottom: calc(72px + env(safe-area-inset-bottom,0px)) !important; }
  }
`;

// SVG Social Icons
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.207-6.8-5.979 6.8h-3.393l7.732-8.835L2.678 2.25h6.826l4.722 6.244 5.418-6.244zM17.002 18.335h1.834L6.822 4.126H4.881z"/>
    </svg>
  );
}

const CRISIS_LINES = [
  { href: 'tel:14416',         label: 'Tele-MANAS: 14416',           title: 'Tele-MANAS (Government of India, 24×7)' },
  { href: 'tel:9152987821',    label: 'iCall: 9152987821',           title: 'iCall (24/7)' },
  { href: 'tel:+919999666555', label: 'Vandrevala: 9999 666 555',    title: 'Vandrevala Foundation (24×7 Mental Health Support)' },
  { href: 'tel:1860-2662-345', label: 'Vandrevala: 1860-2662-345',   title: 'Vandrevala Foundation (24×7)' },
  { href: 'tel:9820466726',    label: 'AASRA: 9820466726',           title: 'AASRA (24/7)' },
];

export default function Footer() {
  const navigate = useNavigate();

  const go = (to) => navigate(to);

  const exploreLinks = [
    { label: 'Community',   to: '/dashboard' },
    { label: 'Circles',     to: '/groups' },
    { label: 'Guides',      to: '/healers' },
    { label: 'Challenges',  to: '/dashboard' },
    { label: 'Events',      to: '/meetups' },
  ];

  const trustLinks = [
    { label: 'FAQ',                  to: '/faq' },
    { label: 'Safety Policy',        to: '/safety' },
    { label: 'Community Guidelines', to: '/community-rules' },
    { label: 'Privacy Policy',       to: '/terms' },
    { label: 'Terms of Service',     to: '/terms' },
    { label: 'Crisis Resources',     to: '/crisis-support', crisis: true },
    { label: 'Report a Concern',     to: '/report' },
  ];

  const trustBadges = [
    { Icon: ShieldCheck,    label: 'Safe Community',            bg: '#F1ECF9', fg: '#6B4FA0' },
    { Icon: HeartHandshake, label: 'Peer Support Platform',     bg: '#E7F1EC', fg: '#2F5A45' },
    { Icon: LifeBuoy,       label: 'Crisis Resources Available', bg: '#FBEEE6', fg: '#7A4A2E' },
  ];

  const heading = {
    color: GOLD_TXT, fontSize: 11.5, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.16em',
    margin: '0 0 20px',
  };

  return (
    <footer className="sc-footer-root" style={{
      background: '#FFFFFF',
      borderTop: `1px solid ${LILAC_LINE}`,
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans',Inter,system-ui,sans-serif",
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 40px)',
    }}>
      <style>{STYLES}</style>

      {/* ── Crisis Support Bar ─────────────────────────────────────────── */}
      <div style={{
        background: '#FDF2EC',
        borderBottom: '1px solid #F1D6C8',
        padding: '22px 32px',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: '#FFFFFF', border: '1px solid #EDC3AE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LifeBuoy size={24} strokeWidth={1.7} color="#B5553A" />
              </div>
              <div>
                <p style={{ margin: 0, color: '#7A3A24', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>In Crisis? Get Immediate Support</p>
                <p style={{ margin: 0, color: '#6E5A52', fontSize: 12.5, marginTop: 4 }}>
                  Call anytime – available 24/7 across India
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CRISIS_LINES.map((c) => (
                <a key={c.href} href={c.href} title={c.title} className="sc-crisis-chip">
                  <Phone size={14} strokeWidth={2} color="#B5553A" />
                  {c.label}
                </a>
              ))}
              <button
                className="sc-crisis-btn"
                onClick={() => navigate('/crisis-support')}
                style={{
                  background: '#B5553A',
                  color: '#FFFFFF', border: 'none', borderRadius: 12,
                  padding: '10px 18px', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                Learn More <ArrowRight size={14} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ────────────────────────────────────────── */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '56px 32px 32px' }}>

        {/* 3-column grid */}
        <div className="sc-footer-grid" style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 56, marginBottom: 44,
        }}>

          {/* ── COLUMN 1: Brand ──────────────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img src="/logo-icon.png" alt="SoulConnect" style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: 'block',
                border: `1px solid ${LILAC_LINE}`,
              }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: DARK, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  Soul<span style={{ color: P }}>Connect</span>
                </div>
                <div style={{ fontSize: 10, color: GOLD_TXT, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 3 }}>
                  Heal • Connect • Grow
                </div>
              </div>
            </div>

            <p style={{ color: NAVY_SOFT, fontSize: 14, lineHeight: 1.8, margin: '0 0 22px', maxWidth: 300 }}>
              Helping people find connection, support, healing, and personal growth through peer communities, wellness circles, journaling, and guided support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
              {trustBadges.map(({ Icon, label, bg, fg }) => (
                <div key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: bg, borderRadius: 99, padding: '6px 14px',
                  width: 'fit-content',
                }}>
                  <Icon size={14} strokeWidth={1.9} color={fg} />
                  <span style={{ color: fg, fontSize: 12.5, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <IconInstagram />, href: 'https://instagram.com/soulconnect.health', label: 'Instagram' },
                { icon: <IconX />,         href: 'https://x.com/SoulConnectHQ', label: 'X (Twitter)' },
                { icon: <IconLinkedIn />,  href: 'https://www.linkedin.com/company/%E2%9C%85soulconnect/?viewAsMember=true', label: 'LinkedIn' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="sc-social-btn" title={s.label} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── COLUMN 2: Explore ────────────────────────────────────── */}
          <div>
            <p style={heading}>Explore</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {exploreLinks.map(link => (
                <button key={link.label} onClick={() => go(link.to)} className="sc-footer-link">
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9B8E8', flexShrink: 0 }} />
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── COLUMN 3: Trust & Safety ─────────────────────────────── */}
          <div>
            <p style={heading}>Trust &amp; Safety</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {trustLinks.map(link => (
                <button key={link.label} onClick={() => go(link.to)} className={`sc-footer-link${link.crisis ? ' crisis' : ''}`}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: link.crisis ? '#E0A585' : '#C9B8E8', flexShrink: 0 }} />
                  {link.label}
                </button>
              ))}
            </div>

            <div style={{
              marginTop: 24,
              background: CREAM_2,
              border: `1px solid ${LILAC_LINE}`,
              borderRadius: 12, padding: '12px 14px',
            }}>
              <p style={{ margin: 0, color: MUTED, fontSize: 12, lineHeight: 1.6 }}>
                SoulConnect is a peer wellness platform. It is not a medical provider, crisis service, or emergency responder. For emergencies, call 112 / 911 / 999.
              </p>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: LILAC_LINE, marginBottom: 24 }} />

        {/* ── Bottom Bar ───────────────────────────────────────────────── */}
        <div className="sc-footer-bottom" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10,
        }}>
          <p style={{ margin: 0, color: MUTED, fontSize: 12.5 }}>
            © 2026 SoulConnect Health Technologies. All Rights Reserved.
          </p>
          <p style={{ margin: 0, color: NAVY_SOFT, fontSize: 12.5, fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            Made with <Heart size={13} strokeWidth={2} color={P} fill="#DCD0F0" /> for healing, connection, and growth.
          </p>
          <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>
            Version 1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
