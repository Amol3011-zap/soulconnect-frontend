import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Matches' },
  { to: '/groups',    label: 'Circles' },
  { to: '/healers',   label: 'Healers' },
  { to: '/mood',      label: 'Journal' },
  { to: '/meetups',   label: 'Meditations' },
  { to: '/chat',      label: 'Messages' },
];

const MOBILE_ITEMS = [
  { to: '/dashboard', label: 'Home',    icon: '🏡' },
  { to: '/chat',      label: 'Matches', icon: '💫' },
  { to: '/healers',   label: 'Healers', icon: '🧘' },
  { to: '/mood',      label: 'Journal', icon: '📝' },
  { to: '/account',   label: 'Account', icon: '👤' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <>
      {/* ── DESKTOP TOP NAV ── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: 80,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(237,233,254,0.7)',
          boxShadow: '0 2px 32px rgba(109,94,245,0.06)',
          alignItems: 'center',
        }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto', width: '100%',
          padding: '0 36px',
          display: 'flex', alignItems: 'center',
        }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 48, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 13,
              background: 'linear-gradient(135deg, #8B5CF6, #6D5EF5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 14px rgba(139,92,246,0.28)',
              flexShrink: 0,
            }}>🪷</div>
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#1A1F36', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
                Soul<span style={{ color: '#8B5CF6' }}>Connect</span>
              </span>
              <span style={{ fontSize: 9, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Heal · Connect · Grow
              </span>
            </div>
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to}
                style={({ isActive }) => ({
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 14, fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#8B5CF6' : '#6B7280',
                  background: isActive ? '#F5F3FF' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = '#8B5CF6';
                    e.currentTarget.style.background = '#FAFAFF';
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = '#6B7280';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: ThemeToggle + Bell + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

            <ThemeToggle />

            {/* Notification bell */}
            <button
              aria-label="Notifications"
              style={{
                width: 42, height: 42, borderRadius: 13,
                background: '#F8F7FF', border: '1px solid #EDE9FE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18, position: 'relative',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#EDE9FE'}
              onMouseLeave={e => e.currentTarget.style.background = '#F8F7FF'}
            >
              🔔
              <div style={{
                position: 'absolute', top: 9, right: 9,
                width: 7, height: 7, borderRadius: '50%',
                background: '#F87171', border: '1.5px solid white',
              }} />
            </button>

            {/* Avatar + dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: 'linear-gradient(135deg, #8B5CF6, #6D5EF5)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff',
                  boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {initial}
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: '#fff', borderRadius: 18, padding: '6px',
                  boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
                  border: '1px solid #EDE9FE',
                  minWidth: 200, zIndex: 1000,
                  animation: 'fadeInDown 0.15s ease',
                }}>
                  <div style={{ padding: '10px 14px 14px', borderBottom: '1px solid #F5F3FF', marginBottom: 4 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1A1F36', fontSize: 14 }}>{user?.name || 'Friend'}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF' }}>{user?.email || 'soulconnect member'}</p>
                  </div>
                  {[
                    { label: '👤 My Account', to: '/account' },
                    { label: '⭐ Go Premium', to: '/premium' },
                    { label: '😊 Mood Journal', to: '/mood' },
                  ].map(({ label, to }) => (
                    <button key={to}
                      onClick={() => { navigate(to); setProfileOpen(false); }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '9px 14px', borderRadius: 12, border: 'none',
                        background: 'none', cursor: 'pointer',
                        fontSize: 13, color: '#4B5563', fontWeight: 500,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8F7FF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      {label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: '#F5F3FF', margin: '4px 6px' }} />
                  <button
                    onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '9px 14px', borderRadius: 12, border: 'none',
                      background: 'none', cursor: 'pointer',
                      fontSize: 13, color: '#F87171', fontWeight: 600,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        aria-label="Bottom navigation"
        style={{
          background: 'rgba(255,255,255,0.98)',
          borderTop: '1px solid #EDE9FE',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
          boxShadow: '0 -4px 20px rgba(109,94,245,0.07)',
        }}>
        <div className="flex justify-around items-stretch pt-1.5 pb-0.5 px-1">
          {MOBILE_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to}
              aria-label={label}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 relative"
              style={({ isActive }) => ({
                minHeight: 52, textDecoration: 'none',
                color: isActive ? '#8B5CF6' : '#9CA3AF',
                transition: 'all 0.15s',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div aria-hidden="true" className="absolute inset-x-1 top-1 h-7 rounded-xl"
                      style={{ background: 'rgba(139,92,246,0.1)' }} />
                  )}
                  <span aria-hidden="true" className="relative z-10" style={{ fontSize: isActive ? 22 : 20 }}>
                    {icon}
                  </span>
                  <span aria-hidden="true" className="relative z-10 font-semibold leading-none"
                    style={{ fontSize: 11, letterSpacing: '0.03em' }}>
                    {label}
                  </span>
                  {isActive && (
                    <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: '#8B5CF6' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile bottom spacer */}
      <div className="md:hidden" aria-hidden="true"
        style={{ height: 'calc(60px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
