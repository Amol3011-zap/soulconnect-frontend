import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Matches',  icon: '💫' },
  { to: '/groups',    label: 'Groups',   icon: '🫂' },
  { to: '/healers',   label: 'Healers',  icon: '🧘' },
  { to: '/meetups',   label: 'Meetups',  icon: '👥' },
  { to: '/mood',      label: 'Mood',     icon: '📊' },
  { to: '/premium',   label: 'Premium',  icon: '⭐' },
  { to: '/account',   label: 'Account',  icon: '👤' },
];

const MOBILE_ITEMS = [
  { to: '/dashboard', label: 'Matches', icon: '💫' },
  { to: '/groups',    label: 'Groups',  icon: '🫂' },
  { to: '/healers',   label: 'Healers', icon: '🧘' },
  { to: '/mood',      label: 'Mood',    icon: '📊' },
  { to: '/account',   label: 'Account', icon: '👤' },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── DESKTOP Navbar ── */}
      <nav className="hidden md:flex sticky top-0 z-50"
        aria-label="Main navigation"
        style={{
          background: 'rgba(8, 2, 20, 0.94)',
          borderBottom: '1px solid rgba(167,139,250,0.15)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 1px 30px rgba(0,0,0,0.5)',
        }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 64 }}>

          {/* Logo */}
          <Link to="/dashboard" aria-label="SoulConnect home" className="flex items-center shrink-0">
            <img src="/logo-navbar.png" alt="" aria-hidden="true" className="md:hidden" style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 8 }} />
            <img src="/logo-footer.png" alt="" aria-hidden="true" className="hidden md:block" style={{ height: 52, width: 'auto', objectFit: 'contain', maxWidth: 220 }} />
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1" role="list">
            {NAV_ITEMS.map(({ to, label, icon }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to}
                  role="listitem"
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative"
                  style={active
                    ? { color: '#a78bfa', background: 'rgba(167,139,250,0.1)' }
                    : { color: 'rgba(196,181,253,0.6)' }
                  }>
                  <span aria-hidden="true" style={{ fontSize: 14 }}>{icon}</span>
                  <span style={{ letterSpacing: '0.01em' }}>{label}</span>
                  {active && (
                    <span aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: '#a78bfa' }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right — theme toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── MOBILE Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        aria-label="Bottom navigation"
        style={{
          background: 'rgba(8, 2, 20, 0.97)',
          borderTop: '1px solid rgba(167,139,250,0.15)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
        }}>
        <div className="flex justify-around items-stretch pt-1.5 pb-0.5 px-1">
          {MOBILE_ITEMS.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className="flex flex-col items-center justify-center flex-1 min-h-[52px] gap-0.5 relative transition-all duration-150 active:scale-90">

                {active && (
                  <div aria-hidden="true" className="absolute inset-x-1 top-1 h-7 rounded-xl"
                    style={{ background: 'rgba(167,139,250,0.1)' }} />
                )}

                <span aria-hidden="true" className={`relative z-10 transition-all duration-200 ${active ? 'text-2xl' : 'text-xl'}`}
                  style={{ opacity: active ? 1 : 0.45 }}>
                  {icon}
                </span>
                <span aria-hidden="true" className="relative z-10 font-semibold leading-none"
                  style={{ fontSize: 11, color: active ? '#a78bfa' : 'rgba(196,181,253,0.45)', letterSpacing: '0.03em' }}>
                  {label}
                </span>

                {active && (
                  <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(to right, transparent, #a78bfa, transparent)' }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so page content isn't hidden behind bottom nav */}
      <div className="md:hidden" aria-hidden="true" style={{ height: 'calc(60px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
