import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/matches', label: 'Matches', icon: '💫' },
  { to: '/healers', label: 'Healers', icon: '🧘' },
  { to: '/meetups', label: 'Meetups', icon: '👥' },
  { to: '/premium', label: 'Premium', icon: '⭐' },
  { to: '/account', label: 'Account', icon: '👤' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex sticky top-0 z-50 backdrop-blur-md border-b shadow-sm" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
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
                  isActive(to) ? 'text-white shadow-sm' : 'hover:bg-[var(--bg-subtle)]'
                }`}
                style={isActive(to) ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : { color: 'var(--text-secondary)' }}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
            <ThemeToggle className="ml-2" />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg"
        style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
        <div className="flex justify-around py-2 px-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                isActive(to) ? 'text-purple-600' : ''
              }`}
              style={!isActive(to) ? { color: 'var(--text-muted)' } : {}}>
              <span className={`text-xl transition-transform ${isActive(to) ? 'scale-110' : ''}`}>{icon}</span>
              <span className={`text-xs font-semibold`}>{label}</span>
              {isActive(to) && <div className="w-1 h-1 rounded-full bg-purple-600 mt-0.5" />}
            </Link>
          ))}
          <div className="flex flex-col items-center justify-center px-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile spacer at bottom */}
      <div className="md:hidden h-16" />
    </>
  );
}
