import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookHeart, Users, MessageCircle, Stethoscope, UserRound } from 'lucide-react';

/* ── Desktop sidebar nav ── */
const NAV_ITEMS = [
  { icon: Home,          label: 'Home',          to: '/home'          },
  { icon: BookHeart,     label: 'Stories',        to: '/stories'       },
  { icon: Users,         label: 'Circles',        to: '/community'     },
  { icon: Stethoscope,   label: 'Professionals',  to: '/professionals' },
  { icon: MessageCircle, label: 'Messages',       to: '/messages'      },
  { icon: UserRound,     label: 'Profile',        to: '/profile'       },
];

/* ── Mobile bottom nav — 5 primary tabs per MOBILE_FIRST_RULES ── */
const MOBILE_NAV = [
  { icon: Home,          label: 'Home',      to: '/home'      },
  { icon: BookHeart,     label: 'Stories',   to: '/stories'   },
  { icon: Users,         label: 'Community', to: '/community' },
  { icon: MessageCircle, label: 'Messages',  to: '/messages'  },
  { icon: UserRound,     label: 'Profile',   to: '/profile'   },
];

/* ── Routes that hide the mobile bottom nav (full-screen layouts) ── */
const HIDE_MOBILE_NAV_ON = ['/chat'];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const showMobileNav = !HIDE_MOBILE_NAV_ON.some(p => location.pathname.startsWith(p));

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
        /* ─── Desktop Sidebar ─── */
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

        /* ─── Content ─── */
        .dash-content-wrapper {
          margin-left: 210px;
          min-height: 100vh;
        }

        /* ─── Mobile bottom nav — hidden on desktop ─── */
        .mobile-bottom-nav { display: none !important; }

        /* ─── Scrollbar ─── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.35);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.55); }

        @keyframes sidebarFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .sidebar-illus { animation: sidebarFloat 7s ease-in-out infinite; }

        /* ══════════════════════════════════════════
           MOBILE  ≤ 768px
        ══════════════════════════════════════════ */
        @media (max-width: 768px) {
          /* Hide desktop sidebar */
          .dash-sidebar { display: none !important; }

          /* Content: no left margin, pad bottom so content clears the nav bar */
          .dash-content-wrapper {
            margin-left: 0 !important;
            padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
          }

          /* Show mobile bottom nav */
          .mobile-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 999;
            /* Frosted glass, deep dark */
            background: rgba(6,4,18,0.96);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border-top: 1px solid rgba(139,92,246,0.15);
            box-shadow: 0 -8px 32px rgba(0,0,0,0.5), 0 -1px 0 rgba(139,92,246,0.08);
            /* Safe area for home indicator */
            padding-bottom: env(safe-area-inset-bottom, 6px);
            padding-top: 6px;
            align-items: flex-start;
            justify-content: space-around;
          }

          /* Each nav tab */
          .mob-tab {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            min-height: 52px;
            min-width: 48px;
            padding: 0 4px 4px;
            text-decoration: none;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }

          .mob-tab-icon {
            width: 36px;
            height: 36px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.22s ease, box-shadow 0.22s ease, transform 0.15s ease;
          }

          .mob-tab.active .mob-tab-icon {
            background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(168,85,247,0.75));
            box-shadow:
              0 0 18px rgba(124,58,237,0.55),
              inset 0 1px 0 rgba(255,255,255,0.18);
          }

          .mob-tab:active .mob-tab-icon {
            transform: scale(0.88);
          }

          .mob-tab-label {
            font-size: 10px;
            font-weight: 500;
            font-family: 'Inter', -apple-system, sans-serif;
            color: rgba(255,255,255,0.38);
            letter-spacing: 0.01em;
            transition: color 0.22s ease, font-weight 0.22s ease;
          }

          .mob-tab.active .mob-tab-label {
            color: #C4B5FD;
            font-weight: 600;
          }

          /* Touch-target safety — per MOBILE_FIRST_RULES min 48×48px */
          .mob-tab { min-width: 48px; min-height: 52px; }
        }
      `}</style>

      {/* ══ Desktop Left Sidebar ══ */}
      <aside className="dash-sidebar" aria-label="Main navigation">
        <div className="dash-logo" onClick={() => navigate('/home')}>
          <img
            src="/logo-icon.png"
            alt="SoulConnect"
            style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'block' }}
          />
          <span className="dash-logo-text">SoulConnect</span>
        </div>

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

      {/* ══ Page Content ══ */}
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

      {/* ══ Mobile Bottom Navigation ══ */}
      {showMobileNav && (
        <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
          {MOBILE_NAV.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to === '/home' && location.pathname === '/');
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`mob-tab${isActive ? ' active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="mob-tab-icon">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    color={isActive ? '#E2DEFF' : 'rgba(255,255,255,0.38)'}
                  />
                </div>
                <span className="mob-tab-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

    </div>
  );
}
