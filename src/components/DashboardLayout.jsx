import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookHeart, Users, MessageCircle, BookOpen, Flower2, Stethoscope, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home,         label: 'Home',          to: '/home'          },
  { icon: BookHeart,    label: 'Stories',       to: '/stories'       },
  { icon: Users,        label: 'Community',     to: '/community'     },
  { icon: MessageCircle,label: 'Messages',      to: '/messages'      },
  { icon: BookOpen,     label: 'Journal',       to: '/journal'       },
  { icon: Flower2,      label: 'Meditate',      to: '/meditate'      },
  { icon: Stethoscope,  label: 'Professionals', to: '/professionals' },
  { icon: UserRound,    label: 'Profile',       to: '/profile'       },
];

// Lotus SVG for the motivation card
function LotusSmall() {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
      <defs>
        <radialGradient id="lg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        <radialGradient id="lg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="46" rx="12" ry="20" fill="url(#lg1)" opacity="0.9" />
      <ellipse cx="40" cy="46" rx="12" ry="20" fill="url(#lg1)" opacity="0.8" transform="rotate(60,40,46)" />
      <ellipse cx="40" cy="46" rx="12" ry="20" fill="url(#lg1)" opacity="0.7" transform="rotate(-60,40,46)" />
      <ellipse cx="40" cy="46" rx="10" ry="17" fill="#A78BFA" opacity="0.6" transform="rotate(30,40,46)" />
      <ellipse cx="40" cy="46" rx="10" ry="17" fill="#A78BFA" opacity="0.6" transform="rotate(-30,40,46)" />
      <circle cx="40" cy="42" r="10" fill="url(#lg2)" />
      <circle cx="40" cy="42" r="6" fill="#FEF3C7" opacity="0.9" />
    </svg>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0B1A',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        .dash-sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 200px;
          z-index: 90;
          background: #0D0B1A;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
        }
        .dash-sidebar::-webkit-scrollbar { display: none; }

        .dash-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px 8px;
          text-decoration: none;
          margin-bottom: 8px;
        }
        .dash-logo-text {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .dash-nav-link {
          display: flex !important;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 14px;
          margin: 2px 10px;
          width: calc(100% - 20px);
          color: #8A84B6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          transition: background 0.18s ease, color 0.18s ease;
          box-sizing: border-box;
          white-space: nowrap;
        }
        .dash-nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: #E2DEFF;
        }
        .dash-nav-link.active {
          background: rgba(139,92,246,0.22);
          color: #A78BFA;
          font-weight: 600;
          box-shadow: inset 0 0 0 1px rgba(139,92,246,0.3);
        }

        .dash-content-wrapper {
          margin-left: 200px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-content-wrapper { margin-left: 0 !important; }
        }
      `}</style>

      {/* ── Left Sidebar ── */}
      <aside className="dash-sidebar" aria-label="Main navigation">
        {/* Logo */}
        <div className="dash-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            🪷
          </div>
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
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Motivation card */}
        <div style={{ padding: '12px 12px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E0A3E, #2D1060)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: 18, padding: '16px 14px',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <LotusSmall />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Keep going 💜
            </div>
            <div style={{ fontSize: 11, color: '#B8B4D8', lineHeight: 1.5, marginBottom: 12 }}>
              You're showing up for yourself.
            </div>
            <button
              onClick={() => navigate('/profile')}
              style={{
                width: '100%', padding: '8px 0', borderRadius: 10,
                background: 'rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.35)',
                color: '#A78BFA', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Progress
            </button>
          </div>
        </div>
      </aside>

      {/* ── Page Content ── */}
      <div className="dash-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ minHeight: '100vh' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
