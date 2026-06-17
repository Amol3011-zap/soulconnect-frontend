import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home',          icon: '🏡' },
  { to: '/chat',      label: 'Soul Matches',  icon: '💫' },
  { to: '/groups',    label: 'Circles',       icon: '🫂' },
  { to: '/healers',   label: 'Healers',       icon: '🧘' },
  { to: '/meetups',   label: 'Meetups',       icon: '🌸' },
  { to: '/mood',      label: 'Mood Tracker',  icon: '📊' },
  { to: '/premium',   label: 'Premium',       icon: '⭐' },
  { to: '/account',   label: 'Account',       icon: '👤' },
];

const MOBILE_ITEMS = [
  { to: '/dashboard', label: 'Home',    icon: '🏡' },
  { to: '/chat',      label: 'Matches', icon: '💫' },
  { to: '/healers',   label: 'Healers', icon: '🧘' },
  { to: '/mood',      label: 'Mood',    icon: '📊' },
  { to: '/account',   label: 'Account', icon: '👤' },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── DESKTOP Left Sidebar ── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex flex-col"
        style={{
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          width: 220,
          background: '#FFFFFF',
          borderRight: '1px solid #EDE9FE',
          boxShadow: '2px 0 24px rgba(109,94,245,0.07)',
          zIndex: 50,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', flexShrink: 0 }}>
          <Link to="/dashboard" aria-label="SoulConnect home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo-navbar.png" alt="" aria-hidden="true"
              style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 10, flexShrink: 0 }} />
            <img src="/logo-footer.png" alt="" aria-hidden="true"
              style={{ height: 42, width: 'auto', objectFit: 'contain', maxWidth: 130 }} />
          </Link>
          <p style={{
            fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#A78BFA', fontWeight: 600, marginTop: 6, paddingLeft: 46,
          }}>
            Heal · Connect · Grow
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, #EDE9FE, transparent)', margin: '0 16px 12px', flexShrink: 0 }} />

        {/* Nav items */}
        <div style={{ flex: 1, padding: '4px 10px', overflowY: 'auto' }} role="list">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to} to={to}
                role="listitem"
                aria-current={active ? 'page' : undefined}
                className="nav-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 14px', borderRadius: 13,
                  marginBottom: 2, textDecoration: 'none',
                  background: active ? 'linear-gradient(135deg, #6D5EF5, #8B5CF6)' : 'transparent',
                  color: active ? '#FFFFFF' : '#6B7280',
                  fontWeight: active ? 600 : 500,
                  fontSize: 14,
                  transition: 'all 0.15s ease',
                  boxShadow: active ? '0 4px 14px rgba(109,94,245,0.28)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#F5F3FF';
                    e.currentTarget.style.color = '#6D5EF5';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {active && (
                  <div aria-hidden="true" style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.6)',
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom — quote card + theme toggle */}
        <div style={{ padding: '14px 12px 20px', flexShrink: 0, borderTop: '1px solid #EDE9FE' }}>
          {/* Spiritual quote card */}
          <div style={{
            borderRadius: 14, padding: '12px 14px',
            background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
            border: '1px solid #DDD6FE',
            marginBottom: 12,
          }}>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#6D5EF5', marginBottom: 5,
            }}>✦ Daily Reminder</p>
            <p style={{ fontSize: 11.5, color: '#4B5563', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
              "Your healing is a sacred journey. One breath at a time."
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ThemeToggle />
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
          boxShadow: '0 -4px 20px rgba(109,94,245,0.08)',
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
                    style={{ background: 'rgba(109,94,245,0.1)' }} />
                )}

                <span aria-hidden="true"
                  className={`relative z-10 transition-all duration-200 ${active ? 'text-2xl' : 'text-xl'}`}>
                  {icon}
                </span>
                <span aria-hidden="true"
                  className="relative z-10 font-semibold leading-none"
                  style={{ fontSize: 11, color: active ? '#6D5EF5' : '#9CA3AF', letterSpacing: '0.03em' }}>
                  {label}
                </span>

                {active && (
                  <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: '#6D5EF5' }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so page content isn't hidden behind bottom nav on mobile */}
      <div className="md:hidden" aria-hidden="true"
        style={{ height: 'calc(60px + env(safe-area-inset-bottom, 0px))' }} />
    </>
  );
}
