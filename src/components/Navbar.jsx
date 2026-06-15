import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

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
      <nav className="hidden md:flex sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/matches" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              🌿
            </div>
            <div>
              <span className="text-gray-900 font-bold text-lg tracking-tight">SoulConnect</span>
              <p className="text-gray-400 text-xs -mt-0.5 leading-none">Find Your People</p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(to)
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
                style={isActive(to) ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : {}}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex justify-around py-2 px-2">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive(to) ? 'text-purple-600' : 'text-gray-400'
              }`}>
              <span className={`text-xl transition-transform ${isActive(to) ? 'scale-110' : ''}`}>{icon}</span>
              <span className={`text-xs font-semibold ${isActive(to) ? 'text-purple-600' : 'text-gray-400'}`}>{label}</span>
              {isActive(to) && <div className="w-1 h-1 rounded-full bg-purple-600 mt-0.5" />}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile spacer at bottom */}
      <div className="md:hidden h-16" />
    </>
  );
}
