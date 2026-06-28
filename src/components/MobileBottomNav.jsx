import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, BookHeart, Users, MessageCircle, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',      icon: Home,           label: 'Home',      path: '/home'      },
  { id: 'stories',   icon: BookHeart,      label: 'Stories',   path: '/stories'   },
  { id: 'community', icon: Users,          label: 'Community', path: '/community' },
  { id: 'messages',  icon: MessageCircle,  label: 'Messages',  path: '/messages'  },
  { id: 'profile',   icon: UserRound,      label: 'Profile',   path: '/profile'   },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(item) {
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  }

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 200,
        background: 'rgba(13,11,26,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
        paddingTop: 8,
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            style={{
              minWidth: 48, minHeight: 48,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3,
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 12px',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                color={active ? '#A78BFA' : '#8A84B6'}
                strokeWidth={active ? 2.2 : 1.7}
                style={{ transition: 'color 0.2s ease' }}
              />
              {active && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  style={{
                    position: 'absolute', bottom: -7, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%',
                    background: '#A78BFA',
                  }}
                />
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              color: active ? '#A78BFA' : '#8A84B6',
              letterSpacing: '0.01em',
              transition: 'color 0.2s ease',
              lineHeight: 1,
            }}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
