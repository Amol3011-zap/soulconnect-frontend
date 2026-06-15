import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/matches" className="text-2xl font-bold text-purple-600">
          SoulConnect
        </Link>

        <div className="flex gap-6">
          {[
            { to: '/matches', label: 'Matches' },
            { to: '/healers', label: 'Healers' },
            { to: '/meetups', label: 'Meetups' },
            { to: '/premium', label: 'Premium' },
            { to: '/account', label: 'Account' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-semibold ${isActive(to) ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
