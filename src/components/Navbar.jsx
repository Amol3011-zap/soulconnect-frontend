import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/matches',  label: 'Matches',  icon: '💫' },
  { to: '/groups',   label: 'Groups',   icon: '🫂' },
  { to: '/healers',  label: 'Healers',  icon: '🧘' },
  { to: '/meetups',  label: 'Meetups',  icon: '👥' },
  { to: '/mood',     label: 'Mood',     icon: '📊' },
  { to: '/premium',  label: 'Premium',  icon: '⭐' },
  { to: '/account',  label: 'Account',  icon: '👤' },
];

// Mobile shows 5 key items
const MOBILE_ITEMS = [
  { to: '/matches',  label: 'Matches',  icon: '💫' },
  { to: '/groups',   label: 'Groups',   icon: '🫂' },
  { to: '/healers',  label: 'Healers',  icon: '🧘' },
  { to: '/mood',     label: 'Mood',     icon: '📊' },
  { to: '/account',  label: 'Account',  icon: '👤' },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── DESKTOP Navbar ── */}
      <nav className="hidden md:flex sticky top-0 z-50 border-b"
        style={{
          background: 'var(--nav-bg)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between w-full">

          {/* Logo — left */}
          <Link to="/matches" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              🌟
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text)' }}>SoulConnect</span>
              <p className="text-xs -mt-0.5 leading-none" style={{ color: 'var(--text-muted)' }}>Find Your People. Feel Better Today.</p>
            </div>
          </Link>

          {/* ── Right side: pill nav + theme toggle ── */}
          <div className="flex items-center gap-3">
            {/* Pill nav group */}
            <div className="flex items-center p-1 rounded-2xl gap-0.5"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              {NAV_ITEMS.map(({ to, label, icon }) => {
                const active = isActive(to);
                return (
                  <Link key={to} to={to}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={active
                      ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }
                      : { color: 'var(--text-secondary)' }
                    }>
                    <span className={`text-base transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                      {icon}
                    </span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── MOBILE Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'var(--nav-bg)',
          borderTop: '1px solid var(--border)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
        }}>
        <div className="flex justify-around items-stretch pt-1.5 pb-0.5 px-1">
          {MOBILE_ITEMS.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to}
                className="flex flex-col items-center justify-center flex-1 min-h-[52px] gap-0.5 relative transition-all duration-150 active:scale-90">

                {/* Active pill bg */}
                {active && (
                  <div className="absolute inset-x-0.5 top-0.5 h-8 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(37,99,235,0.12))' }} />
                )}

                <span className={`relative z-10 transition-all duration-200 ${active ? 'text-2xl' : 'text-xl opacity-55'}`}>
                  {icon}
                </span>
                <span className={`relative z-10 text-[10px] font-bold leading-none`}
                  style={{ color: active ? '#a855f7' : 'var(--text-muted)' }}>
                  {label}
                </span>

                {active && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(to right, #7c3aed, #2563eb)' }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden" style={{ height: 'calc(60px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
