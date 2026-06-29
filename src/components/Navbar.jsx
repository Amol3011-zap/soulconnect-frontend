import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Matches',    icon: '💫' },
  { to: '/groups',    label: 'Circles',    icon: '🫂' },
  { to: '/healers',   label: 'Healers',    icon: '🧘' },
  { to: '/mood',      label: 'Journal',    icon: '📔' },
  { to: '/meetups',   label: 'Meditations',icon: '🎧' },
  { to: '/chat',      label: 'Messages',   icon: '💬' },
];

const MOBILE_ITEMS = [
  { to: '/dashboard', label: 'Home',    icon: '🏠' },
  { to: '/chat',      label: 'Messages',icon: '💬' },
  { to: '/healers',   label: 'Healers', icon: '🧘' },
  { to: '/mood',      label: 'Journal', icon: '📔' },
  { to: '/account',   label: 'Account', icon: '👤' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initial = user?.name?.[0]?.toUpperCase() || 'U';
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  return (
    <>
      <style>{`
        @keyframes navFadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes navGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(109,74,255,0)} 50%{box-shadow:0 0 0 6px rgba(109,74,255,0.12)} }
        .sc-nav-link { position:relative; transition:all 0.2s ease; }
        .sc-nav-link::after {
          content:''; position:absolute; bottom:-2px; left:50%; right:50%;
          height:2px; border-radius:2px;
          background:linear-gradient(90deg,#6D4AFF,#A78BFA);
          transition:all 0.25s ease;
        }
        .sc-nav-link:hover::after { left:12%; right:12%; }
        .sc-nav-link-active::after { left:12%!important; right:12%!important; box-shadow:0 0 8px rgba(109,74,255,0.5); }
        .sc-dropdown-item { transition:background 0.15s,transform 0.15s; border-radius:12px; }
        .sc-dropdown-item:hover { background:linear-gradient(135deg,rgba(109,74,255,0.06),rgba(167,139,250,0.06))!important; transform:translateX(2px); }
        .sc-avatar-btn { transition:transform 0.2s ease,box-shadow 0.2s ease; }
        .sc-avatar-btn:hover { transform:scale(1.06)!important; }
        .sc-mobile-link { transition:all 0.2s ease; }
        @media(prefers-reduced-motion:reduce){ .sc-nav-link::after,.sc-dropdown-item,.sc-avatar-btn{transition:none!important;animation:none!important} }
      `}</style>

      {/* ── DESKTOP NAVBAR ──────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: 72,
          background: scrolled
            ? 'rgba(250,250,252,0.96)'
            : 'rgba(250,250,252,0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: scrolled
            ? '1px solid rgba(109,74,255,0.1)'
            : '1px solid rgba(109,74,255,0.06)',
          boxShadow: scrolled
            ? '0 4px 32px rgba(109,74,255,0.08)'
            : '0 2px 16px rgba(109,74,255,0.04)',
          transition: 'all 0.3s ease',
          alignItems: 'center',
        }}
      >
        <div style={{
          maxWidth: 1400, margin: '0 auto', width: '100%',
          padding: '0 clamp(20px, 3vw, 40px)',
          display: 'flex', alignItems: 'center',
        }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 44, flexShrink: 0 }}>
            <img
              src="/logo-icon.svg"
              alt="SoulConnect"
              style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'block', boxShadow: '0 4px 16px rgba(109,74,255,0.35)' }}
            />
            <div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1F1B3D', letterSpacing: '-0.02em', display: 'block', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
                Soul<span style={{ color: '#6D4AFF' }}>Connect</span>
              </span>
              <span style={{ fontSize: 8.5, color: '#A78BFA', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Heal · Connect · Grow
              </span>
            </div>
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `sc-nav-link${isActive ? ' sc-nav-link-active' : ''}`}
                style={({ isActive }) => ({
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#6D4AFF' : '#6B7280',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(109,74,255,0.08), rgba(167,139,250,0.06))'
                    : 'transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  letterSpacing: isActive ? '-0.01em' : 'normal',
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('sc-nav-link-active')) {
                    e.currentTarget.style.color = '#6D4AFF';
                    e.currentTarget.style.background = 'rgba(109,74,255,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList.contains('sc-nav-link-active')) {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: Bell + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

            {/* Notification bell — gold accent */}
            <button
              aria-label="Notifications"
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(245,184,65,0.08)',
                border: '1px solid rgba(245,184,65,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16, position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(245,184,65,0.15)';
                e.currentTarget.style.borderColor = 'rgba(245,184,65,0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(245,184,65,0.08)';
                e.currentTarget.style.borderColor = 'rgba(245,184,65,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔔
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 7, height: 7, borderRadius: '50%',
                background: '#F5B841',
                border: '1.5px solid rgba(250,250,252,0.9)',
                boxShadow: '0 0 6px rgba(245,184,65,0.7)',
              }} />
            </button>

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                className="sc-avatar-btn"
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, color: '#fff',
                  boxShadow: profileOpen
                    ? '0 0 0 3px rgba(109,74,255,0.25), 0 6px 20px rgba(109,74,255,0.4)'
                    : '0 4px 16px rgba(109,74,255,0.35)',
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                }}
              >
                {initial}
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: 20, padding: '6px',
                  boxShadow: '0 16px 56px rgba(109,74,255,0.16), 0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(109,74,255,0.1)',
                  minWidth: 220, zIndex: 1000,
                  animation: 'navFadeIn 0.18s ease',
                }}>
                  {/* User info header */}
                  <div style={{ padding: '12px 14px 14px', borderBottom: '1px solid rgba(109,74,255,0.07)', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(109,74,255,0.3)' }}>{initial}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1F1B3D', fontSize: 13, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{user?.name || firstName}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{user?.email || 'soulconnect member'}</p>
                      </div>
                    </div>
                    {/* Healing streak badge */}
                    <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(245,184,65,0.12), rgba(255,215,122,0.08))', border: '1px solid rgba(245,184,65,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>🔥</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>27-day healing streak</span>
                    </div>
                  </div>

                  {/* Nav items */}
                  {[
                    { label: '👤  My Account',    to: '/account', hint: 'Profile & settings' },
                    { label: '⭐  Go Premium',    to: '/premium', hint: 'Unlock all features', accent: true },
                    { label: '📔  Soul Journal',  to: '/mood',    hint: 'Daily reflection' },
                    { label: '🧘  Healers',       to: '/healers', hint: 'Book a session' },
                    { label: '🛡️  Safety & Trust', to: '/safety',  hint: 'Community rules & policies' },
                    { label: '🆘  Crisis Support', to: '/crisis-support', hint: '24/7 emergency resources', crisis: true },
                  ].map(({ label, to, hint, accent, crisis }) => (
                    <button key={to}
                      onClick={() => { navigate(to); setProfileOpen(false); }}
                      className="sc-dropdown-item"
                      style={{
                        display: 'flex', flexDirection: 'column',
                        width: '100%', textAlign: 'left',
                        padding: '10px 14px', border: 'none',
                        background: 'none', cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 13, color: crisis ? '#DC2626' : accent ? '#6D4AFF' : '#374151', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>{label}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{hint}</span>
                    </button>
                  ))}

                  <div style={{ height: 1, background: 'rgba(109,74,255,0.07)', margin: '4px 8px' }} />

                  <button
                    onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                    className="sc-dropdown-item"
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', border: 'none',
                      background: 'none', cursor: 'pointer',
                      fontSize: 13, color: '#EF4444', fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                    }}
                  >
                    🚪  Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM TAB BAR ─────────────────────────────────────── */}
      <nav
        className="md:hidden"
        aria-label="Bottom navigation"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(250,250,252,0.97)',
          borderTop: '1px solid rgba(109,74,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
          boxShadow: '0 -4px 24px rgba(109,74,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', padding: '6px 4px 2px' }}>
          {MOBILE_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to}
              aria-label={label}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                flex: 1, gap: 3, minHeight: 52, textDecoration: 'none',
                color: isActive ? '#6D4AFF' : '#9CA3AF',
                position: 'relative',
                transition: 'color 0.2s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active background glow */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', inset: '2px 4px',
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, rgba(109,74,255,0.1), rgba(167,139,250,0.06))',
                    }} />
                  )}
                  <span style={{ fontSize: isActive ? 22 : 19, position: 'relative', zIndex: 1, transition: 'font-size 0.2s ease' }}>
                    {icon}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.02em', position: 'relative', zIndex: 1,
                    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  }}>
                    {label}
                  </span>
                  {/* Bottom indicator dot */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)',
                      width: 16, height: 3, borderRadius: 2,
                      background: 'linear-gradient(90deg, #6D4AFF, #A78BFA)',
                      boxShadow: '0 0 8px rgba(109,74,255,0.5)',
                    }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile bottom spacer */}
      <div className="md:hidden" aria-hidden="true"
        style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
