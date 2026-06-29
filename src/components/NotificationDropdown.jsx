import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const ICON_COLORS = {
  community: { bg: '#3D1A5C', border: 'rgba(192,84,252,0.25)' },
  checkin:   { bg: '#3D2A0A', border: 'rgba(251,191,36,0.25)'  },
  therapy:   { bg: '#0F2744', border: 'rgba(96,165,250,0.25)'  },
  challenge: { bg: '#3D1A0A', border: 'rgba(249,115,22,0.25)'  },
  ai:        { bg: '#0A3028', border: 'rgba(52,211,153,0.25)'  },
};

const INITIAL_NOTIFS = [
  { id: 1, iconType: 'community', icon: '💜', title: 'Ananya replied to your post.',                   time: '2 min ago',   unread: true  },
  { id: 2, iconType: 'checkin',   icon: '🌤', title: "Time for today's emotional check-in.",           time: '1 hour ago',  unread: true  },
  { id: 3, iconType: 'therapy',   icon: '📅', title: 'Your therapy session is tomorrow at 11:00 AM.', sub: 'Tomorrow • 11:00 AM', time: '5 hours ago', unread: true },
  { id: 4, iconType: 'challenge', icon: '🎯', title: "You completed yesterday's challenge.",           time: 'Yesterday',   unread: false },
  { id: 5, iconType: 'ai',        icon: '🤖', title: "AI Companion: You've checked in 4 days in a row.", time: 'Yesterday', unread: false },
];

function NotifItem({ n }) {
  const colors = ICON_COLORS[n.iconType] || ICON_COLORS.community;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '13px 16px',
      background: n.unread ? 'rgba(124,58,237,0.07)' : 'transparent',
      position: 'relative',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>
        {n.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingRight: n.unread ? 16 : 0 }}>
        <div style={{
          fontSize: 13, lineHeight: 1.45,
          color: n.unread ? '#E2DEFF' : '#9CA3AF',
          fontWeight: n.unread ? 500 : 400,
        }}>
          {n.title}
        </div>
        {n.sub && (
          <div style={{ fontSize: 11, color: '#A855F7', marginTop: 2, fontWeight: 600 }}>
            {n.sub}
          </div>
        )}
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{n.time}</div>
      </div>

      {n.unread && (
        <div style={{
          position: 'absolute', right: 14, top: 18,
          width: 8, height: 8, borderRadius: '50%',
          background: '#A855F7',
          boxShadow: '0 0 7px rgba(168,85,247,0.9)',
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}

export default function NotificationDropdown({ isOpen, onClose, anchorRef }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const unreadCount = notifications.filter(n => n.unread).length;

  /* Calculate fixed position from anchor element */
  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right,
    });
  }, [isOpen, anchorRef]);

  /* Outside click + Escape */
  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) onClose();
    }
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose, anchorRef]);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }

  /* Render via portal — bypasses all parent stacking contexts */
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          key="notif-dropdown"
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{   opacity: 0, y: -6,   scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          style={{
            position: 'fixed',
            top: pos.top,
            right: pos.right,
            width: 320,
            zIndex: 99999,
            background: '#160A36',
            border: '1px solid rgba(139,92,246,0.35)',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(0,0,0,0.9), 0 0 0 1px rgba(168,85,247,0.12), 0 24px 64px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Top accent */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                Notifications
              </div>
              {unreadCount > 0 && (
                <div style={{ fontSize: 11, color: '#A78BFA', marginTop: 1, fontWeight: 500 }}>
                  {unreadCount} Unread
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none', border: 'none',
                  color: '#A855F7', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  padding: '4px 8px', borderRadius: 6,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', scrollbarWidth: 'none', maxHeight: 340 }}>
            {notifications.map((n, idx) => (
              <div
                key={n.id}
                style={{ borderBottom: idx < notifications.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
              >
                <NotifItem n={n} />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <button
              onClick={() => { navigate('/notifications'); onClose(); }}
              style={{
                background: 'none', border: 'none',
                color: '#A855F7', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
            >
              View All Notifications <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
