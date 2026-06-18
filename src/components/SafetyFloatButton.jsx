import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const STYLES = `
@keyframes floatIn { from { opacity:0; transform:translateY(20px) scale(0.9); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes menuFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes gentlePulse { 0%,100%{box-shadow:0 4px 20px rgba(109,74,255,0.4)} 50%{box-shadow:0 4px 28px rgba(109,74,255,0.6)} }
`;

// Pages that have their own full-screen layout with bottom nav — offset the button
const BOTTOM_NAV_PAGES = ['/mood', '/chat', '/groups'];

export default function SafetyFloatButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isBottomNav = BOTTOM_NAV_PAGES.includes(location.pathname);
  const bottom = isBottomNav ? 80 : 24;

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <style>{STYLES}</style>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.15)',
          }}
        />
      )}

      {/* Menu */}
      {open && (
        <div style={{
          position: 'fixed', bottom: bottom + 64, right: 20,
          zIndex: 9999, width: 230,
          animation: 'menuFadeUp 0.25s ease both',
        }}>
          <div style={{
            background: '#fff', borderRadius: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            border: '1.5px solid rgba(167,139,250,0.25)',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
              padding: '12px 16px',
            }}>
              <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 13 }}>🛟 Safety & Support</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 }}>You are not alone</p>
            </div>

            {/* Emergency */}
            <button
              onClick={() => go('/crisis-support')}
              style={{
                width: '100%', background: '#FEF2F2', border: 'none',
                borderBottom: '1px solid #FEE2E2', cursor: 'pointer',
                padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18 }}>🆘</span>
              <div>
                <div style={{ fontWeight: 700, color: '#B91C1C', fontSize: 13 }}>Crisis Support</div>
                <div style={{ color: '#9CA3AF', fontSize: 11 }}>Emergency & crisis lines</div>
              </div>
            </button>

            {[
              { icon: '🛡️', label: 'Safety Policy', sub: 'How we keep you safe', path: '/safety' },
              { icon: '📋', label: 'Community Rules', sub: 'Our guidelines', path: '/community-rules' },
              { icon: '🚩', label: 'Report a Concern', sub: 'Report users or content', path: '/report' },
              { icon: '🧘', label: 'Find a Guide', sub: 'Professional wellness support', path: '/healers' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => go(item.path)}
                style={{
                  width: '100%', background: '#fff', border: 'none',
                  borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none',
                  cursor: 'pointer', padding: '11px 16px',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F3FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>{item.label}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 11 }}>{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: -8, right: 22,
            width: 16, height: 16, background: '#fff',
            transform: 'rotate(45deg)',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
          }} />
        </div>
      )}

      {/* Float Button */}
      <button
        onClick={() => setOpen(!open)}
        title="Safety & Support"
        style={{
          position: 'fixed', bottom, right: 20,
          width: 52, height: 52, borderRadius: '50%',
          background: open ? '#5B21B6' : 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
          border: 'none', cursor: 'pointer', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: '#fff',
          animation: `floatIn 0.5s ease both, ${open ? 'none' : 'gentlePulse 3s ease infinite'}`,
          transition: 'background 0.2s, transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          boxShadow: '0 4px 20px rgba(109,74,255,0.4)',
        }}
        aria-label="Safety and support menu"
      >
        {open ? '✕' : '🛟'}
      </button>
    </>
  );
}
