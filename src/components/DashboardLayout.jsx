import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookHeart, Users, MessageCircle, Stethoscope, UserRound, BarChart3, Heart, Bell } from 'lucide-react';

/* ── Desktop sidebar nav ── */
const NAV_ITEMS = [
  { icon: Home,          label: 'Home',          to: '/home'          },
  { icon: Heart,         label: 'SoulMatch',     to: '/matches'       },
  { icon: BookHeart,     label: 'Stories',        to: '/stories'       },
  { icon: Users,         label: 'Circles',        to: '/community'     },
  { icon: BarChart3,     label: 'Mood Tracker',   to: '/mood'          },
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

/* ── Shared mobile top bar title, by route (Home shows the brand) ── */
const TITLES = [
  ['/home', 'SoulConnect'], ['/matches', 'SoulMatch'], ['/stories', 'Stories'],
  ['/story', 'Story'], ['/saved', 'Saved stories'], ['/community', 'Community'],
  ['/messages', 'Messages'], ['/profile', 'Profile'], ['/mood', 'Soul Climate'],
  ['/tiny-wins', 'Tiny Wins'], ['/professionals', 'Professionals'],
  ['/notifications', 'Notifications'], ['/meditate', 'Meditate'],
  ['/journeys', 'Journeys'], ['/circles', 'Circles'], ['/healers', 'Healers'],
];
const titleFor = (path) => {
  const hit = TITLES.find(([p]) => path === p || path.startsWith(p + '/'));
  return hit ? hit[1] : 'SoulConnect';
};

/* ── Routes that hide the mobile bottom nav (full-screen layouts) ── */
const HIDE_MOBILE_NAV_ON = ['/chat'];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const showMobileNav = !HIDE_MOBILE_NAV_ON.some(p => location.pathname.startsWith(p));

  return (
    // .sc-app scopes the light SoulConnect tokens (src/index.css) and the
    // shadcn/ui variables to the logged-in app only.
    <div className="sc-app" style={{ minHeight: '100vh' }}>

      <style>{`
        /* ─── Desktop Sidebar ─── */
        .dash-sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 210px;
          z-index: 90;
          background: #FFFFFF;
          border-right: 1px solid #E7E3EF;
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
          font-weight: 700;
          color: #171642;
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
          color: #69677D;
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
          background: #F7F5FB;
          color: #171642;
        }
        .dash-nav-link.active {
          background: #E5DDF5;
          color: #5E47B8;
          font-weight: 600;
        }
        .dash-nav-link.active svg { color: #8066D5; }

        /* ─── Content ─── */
        .dash-content-wrapper {
          margin-left: 210px;
          min-height: 100vh;
        }

        /* ─── Shared mobile top bar (hidden on desktop: sidebar has the brand) ─── */
        .app-topbar { display: none; }

        /* ─── Page route transition (masks flash on tab switch) ─── */
        /* Barely-there page transition. It used to fade from opacity 0,
           which read as a black blink on every tab tap (~70-100ms under
           50% opacity). Starting near-visible keeps the "new screen" cue
           without ever going dark. */
        @keyframes routeFadeIn {
          from { opacity: 0.88; transform: translateY(3px); }
          to   { opacity: 1;    transform: none; }
        }
        .route-fade {
          animation: routeFadeIn 0.16s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .route-fade { animation: none; }
        }

        /* ─── Mobile bottom nav — hidden on desktop ─── */
        .mobile-bottom-nav { display: none !important; }

        /* ─── Scrollbar ─── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: #D8CFEC;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: #C4B7E6; }

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
            padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
            /* Kill horizontal overflow — prevents pages from "sliding" */
            overflow-x: hidden;
          }

          /* Shared top bar: 60px + safe area, stays put while pages change */
          .app-topbar {
            display: flex;
            position: sticky; top: 0; z-index: 50;
            align-items: center; justify-content: space-between;
            height: calc(60px + env(safe-area-inset-top, 0px));
            padding: env(safe-area-inset-top, 0px) 8px 0 16px;
            background: rgba(247,245,251,0.97);
            border-bottom: 1px solid #E7E3EF;
            box-sizing: border-box;
          }
          .app-topbar-brand {
            display: flex; align-items: center; gap: 10px;
            min-height: 48px; text-decoration: none; color: #171642;
          }
          .app-topbar-brand img { width: 28px; height: 28px; border-radius: 8px; display: block; }
          .app-topbar-title { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
          .app-topbar-action {
            width: 48px; height: 48px; border-radius: 999px;
            display: flex; align-items: center; justify-content: center;
            color: #171642; -webkit-tap-highlight-color: transparent;
          }
          .app-topbar-action:active { background: #EFEBF7; }

          /* Show mobile bottom nav */
          .mobile-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 999;
            background: rgba(255,255,255,0.96);
            border-top: 1px solid #E7E3EF;
            padding-bottom: env(safe-area-inset-bottom, 0px);
            padding-top: 6px;
            align-items: flex-start;
            justify-content: space-around;
          }

          /* Each nav tab — 48px+ touch target */
          .mob-tab {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            min-height: 56px;
            min-width: 48px;
            padding: 0 4px 6px;
            text-decoration: none;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }

          /* Active: small soft-lavender pill behind the icon, no glow */
          .mob-tab-icon {
            width: 52px;
            height: 30px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.15s ease, transform 0.12s ease;
          }
          .mob-tab.active .mob-tab-icon { background: #E5DDF5; }
          .mob-tab:active .mob-tab-icon { transform: scale(0.94); }

          .mob-tab-label {
            font-size: 11px;
            font-weight: 500;
            color: #69677D;
            letter-spacing: 0.01em;
          }
          .mob-tab.active .mob-tab-label { color: #5E47B8; font-weight: 600; }
          .mob-tab:focus-visible { outline: 2px solid #8066D5; outline-offset: -2px; border-radius: 12px; }
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
        <header className="app-topbar">
          <NavLink to="/home" className="app-topbar-brand" aria-label="SoulConnect home">
            <img src="/logo-icon.png" alt="" />
            <span className="app-topbar-title">{titleFor(location.pathname)}</span>
          </NavLink>
          <NavLink to="/notifications" className="app-topbar-action" aria-label="Notifications">
            <Bell size={21} strokeWidth={2} />
          </NavLink>
        </header>
        {/* ONE loading boundary for every tab, mounted once with the shell.
            With router transitions enabled, switching tabs keeps the current
            page visible until the next is ready instead of blanking to a
            full-screen spinner. The fallback only appears on a cold first
            load, and it's an empty area the page's height, not a spinner. */}
        <Suspense fallback={<div style={{ minHeight: '70vh' }} aria-busy="true" />}>
          <div key={location.pathname} className="route-fade">
            <Outlet />
          </div>
        </Suspense>
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
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="mob-tab-icon">
                  <item.icon
                    size={21}
                    strokeWidth={2}
                    color={isActive ? '#8066D5' : '#8A889C'}
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
