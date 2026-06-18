import React from 'react';
import { useNavigate } from 'react-router-dom';

function LotusIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: 22, height: 22 }} aria-hidden="true">
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

const FOOTER_LINKS = {
  'Platform': [
    { label: 'Matches',     to: '/dashboard' },
    { label: 'Circles',     to: '/groups' },
    { label: 'Healers',     to: '/healers' },
    { label: 'Journal',     to: '/mood' },
    { label: 'Meditations', to: '/meetups' },
    { label: 'Premium',     to: '/premium' },
  ],
  'Safety & Trust': [
    { label: 'Safety Policy',      to: '/safety' },
    { label: 'Crisis Support 🆘',  to: '/crisis-support', crisis: true },
    { label: 'Community Rules',    to: '/community-rules' },
    { label: 'Guide Terms',        to: '/guide-terms' },
    { label: 'Report a Concern',   to: '/report' },
  ],
  'Legal': [
    { label: 'Terms & Privacy', to: '/terms' },
    { label: 'Guide Agreement', to: '/guide-terms' },
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: 'linear-gradient(135deg,#1e1b4b 0%,#2d1b69 60%,#1e1b4b 100%)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)', // above mobile tab bar
      fontFamily: "'Inter',sans-serif",
    }}>
      {/* Crisis Banner */}
      <div style={{
        background: 'linear-gradient(135deg,#DC2626,#B91C1C)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexWrap: 'wrap', gap: 10,
      }}>
        <span style={{ fontSize: 16 }}>🆘</span>
        <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
          In immediate danger? Call <strong>112 / 911 / 999</strong>.
        </p>
        <button
          onClick={() => navigate('/crisis-support')}
          style={{
            background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 99, padding: '5px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            flexShrink: 0,
          }}
        >Crisis Resources →</button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 32px' }}>

        {/* Top: logo + tagline + safety badge */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <LotusIcon />
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                Soul<span style={{ color: '#A78BFA' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>
              A peer wellness platform for healing, connection, and growth. You are not alone on this journey.
            </p>
            {/* Safety badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: 99, padding: '6px 14px',
            }}>
              <span style={{ fontSize: 14 }}>🛡️</span>
              <span style={{ color: '#C4B5FD', fontSize: 12, fontWeight: 600 }}>Safe Space Committed</span>
            </div>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <p style={{ color: '#C4B5FD', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>
                  {section}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {links.map(link => (
                    <button
                      key={link.to}
                      onClick={() => navigate(link.to)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left', padding: 0,
                        color: link.crisis ? '#FCA5A5' : 'rgba(255,255,255,0.6)',
                        fontSize: 14, fontWeight: link.crisis ? 700 : 400,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = link.crisis ? '#FEE2E2' : '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = link.crisis ? '#FCA5A5' : 'rgba(255,255,255,0.6)'}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
            © {new Date().getFullYear()} SoulConnect · Not a medical provider. For emergencies call 112.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Safety', to: '/safety' },
              { label: 'Terms & Privacy', to: '/terms' },
              { label: 'Community Rules', to: '/community-rules' },
            ].map(l => (
              <button key={l.to} onClick={() => navigate(l.to)} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                fontSize: 12, cursor: 'pointer',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#C4B5FD'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >{l.label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
