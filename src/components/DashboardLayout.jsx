import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookHeart, Users, MessageCircle, Stethoscope, UserRound } from 'lucide-react';

// MVP navigation — Journal removed (coming in v2 as Reflection)
const NAV_ITEMS = [
  { icon: Home,          label: 'Home',          to: '/home'          },
  { icon: BookHeart,     label: 'Stories',        to: '/stories'       },
  { icon: Users,         label: 'Circles',        to: '/community'     },
  { icon: Stethoscope,   label: 'Professionals',  to: '/professionals' },
  { icon: MessageCircle, label: 'Messages',       to: '/messages'      },
  { icon: UserRound,     label: 'Profile',        to: '/profile'       },
];

/* ── Crystal + Lotus illustration for sidebar card ── */
function SidebarIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="100" height="84" aria-hidden="true">
      <defs>
        <radialGradient id="crystalGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="lotusGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <filter id="crystalFilter">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow base */}
      <ellipse cx="60" cy="82" rx="38" ry="10" fill="rgba(139,92,246,0.3)" />
      {/* Crystal body */}
      <polygon points="60,10 82,40 75,72 45,72 38,40" fill="url(#crystalGlow)" filter="url(#crystalFilter)" opacity="0.95" />
      {/* Crystal facets */}
      <polygon points="60,10 82,40 60,35" fill="rgba(255,255,255,0.2)" />
      <polygon points="60,10 38,40 60,35" fill="rgba(196,181,253,0.15)" />
      <line x1="60" y1="10" x2="60" y2="72" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Inner highlight */}
      <ellipse cx="54" cy="30" rx="7" ry="12" fill="rgba(255,255,255,0.18)" transform="rotate(-10,54,30)" />
      {/* Lotus petals */}
      <ellipse cx="60" cy="78" rx="16" ry="10" fill="rgba(168,85,247,0.5)" transform="rotate(-30,60,78)" />
      <ellipse cx="60" cy="78" rx="16" ry="10" fill="rgba(168,85,247,0.5)" transform="rotate(30,60,78)" />
      <ellipse cx="60" cy="78" rx="14" ry="9" fill="rgba(192,132,252,0.6)" />
      <circle cx="60" cy="76" r="7" fill="url(#lotusGold)" />
      <circle cx="60" cy="76" r="4" fill="#FEF3C7" opacity="0.9" />
      {/* Sparkles */}
      <circle cx="88" cy="22" r="2" fill="#F4C542" opacity="0.8" />
      <circle cx="32" cy="35" r="1.5" fill="#E9D5FF" opacity="0.6" />
      <circle cx="90" cy="60" r="1.5" fill="#A78BFA" opacity="0.5" />
    </svg>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse 70% 50% at 15% 0%, rgba(124,58,237,0.14) 0%, transparent 55%),
        radial-gradient(ellipse 50% 60% at 85% 100%, rgba(168,85,247,0.09) 0%, transparent 55%),
        radial-gradient(ellipse 40% 70% at 90% 25%, rgba(76,29,149,0.11) 0%, transparent 50%),
        #080812
      `,
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      <style>{`
        /* ── Sidebar ── */
        .dash-sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 210px;
          z-index: 90;
          background: rgba(8,6,22,0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
        }
        .dash-sidebar::-webkit-scrollbar { display: none; }

        /* ── Logo ── */
        .dash-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 18px 10px;
          text-decoration: none;
          margin-bottom: 6px;
          cursor: pointer;
        }
        .dash-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        /* ── Nav links ── */
        .dash-nav-link {
          display: flex !important;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 16px;
          margin: 2px 10px;
          width: calc(100% - 20px);
          color: rgba(184,180,216,0.7);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
          white-space: nowrap;
          position: relative;
        }
        .dash-nav-link:hover {
          background: rgba(139,92,246,0.12);
          color: #E2DEFF;
        }
        .dash-nav-link.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.75) 0%, rgba(168,85,247,0.55) 100%);
          color: #fff;
          font-weight: 600;
          box-shadow:
            0 0 20px rgba(124,58,237,0.3),
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 4px 16px rgba(0,0,0,0.2);
          border: 1px solid rgba(168,85,247,0.3);
        }
        .dash-nav-link.active svg {
          filter: drop-shadow(0 0 6px rgba(196,181,253,0.6));
        }

        /* ── Content ── */
        .dash-content-wrapper {
          margin-left: 210px;
          min-height: 100vh;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-content-wrapper { margin-left: 0 !important; }
        }

        /* ── Custom scrollbar ── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.35);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.55); }

        /* ── Sidebar card illustration float ── */
        @keyframes sidebarFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .sidebar-illus { animation: sidebarFloat 7s ease-in-out infinite; }
      `}</style>

      {/* ── Left Sidebar ── */}
      <aside className="dash-sidebar" aria-label="Main navigation">

        {/* Logo */}
        <div className="dash-logo" onClick={() => navigate('/home')}>
          <img
            src="/logo-icon.png"
            alt="SoulConnect"
            style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'block' }}
          />
          <span className="dash-logo-text">SoulConnect</span>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '4px 0', flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>

      {/* ── Page Content ── */}
      <div className="dash-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            style={{ minHeight: '100vh' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
