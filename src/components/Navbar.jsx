import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/matches',  label: 'Matches',  icon: '💫' },
  { to: '/healers',  label: 'Healers',  icon: '🧘' },
  { to: '/meetups',  label: 'Meetups',  icon: '👥' },
  { to: '/premium',  label: 'Premium',  icon: '⭐' },
  { to: '/account',  label: 'Account',  icon: '👤' },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── DESKTOP Navbar ── */}
      <nav className="hidden md:flex sticky top-0 z-50 backdrop-blur-md border-b shadow-sm"
        style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/matches" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              🌟
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>SoulConnect</span>
              <p className="text-xs -mt-0.5 leading-none" style={{ color: 'var(--text-muted)' }}>Find Your People. Feel Better Today.</p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(to) ? 'text-white shadow-sm' : 'hover:opacity-80'
                }`}
                style={isActive(to)
                  ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }
                  : { color: 'var(--text-secondary)', background: 'var(--bg-subtle)' }}>
                <span>{icon}</span>
                {label}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'var(--nav-bg)',
          borderTop: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          // Extend background into iPhone home indicator area
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
        }}>
        <div className="flex justify-around items-stretch pt-1 pb-0.5 px-1">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center justify-center flex-1 min-h-[52px] gap-0.5 relative transition-all duration-150 active:scale-95"
                style={{ color: active ? '#7c3aed' : 'var(--text-muted)' }}>

                {/* Active pill background */}
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-7 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))' }} />
                )}

                <span className={`relative text-2xl transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                  {icon}
                </span>
                <span className={`relative text-[10px] font-bold tracking-wide leading-none ${active ? 'text-purple-600' : ''}`}
                  style={!active ? { color: 'var(--text-muted)' } : {}}>
                  {label}
                </span>

                {/* Active dot */}
                {active && (
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-purple-600" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so content doesn't hide behind tab bar */}
      <div className="md:hidden"
        style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
