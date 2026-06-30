import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';

const INITIAL_NOTIFICATIONS = [
  { id: 1, icon: '💜', title: 'Ananya replied to your post.',                     time: '2 min ago',   group: 'today',     unread: true,  type: 'community' },
  { id: 2, icon: '🌤', title: "Don't forget today's check-in.",                   time: '1 hour ago',  group: 'today',     unread: true,  type: 'system'    },
  { id: 3, icon: '🎯', title: 'New Tiny Win unlocked!',                           time: '3 hours ago', group: 'today',     unread: true,  type: 'system'    },
  { id: 4, icon: '👨‍⚕️', title: 'Your therapy session is tomorrow at 11:00 AM.',   time: '5 hours ago', group: 'today',     unread: false, type: 'system'    },
  { id: 5, icon: '🤖', title: "AI Companion: You've checked in 4 days in a row.", time: '6 hours ago', group: 'today',     unread: false, type: 'system'    },
  { id: 6, icon: '💙', title: 'Aarav liked your story.',                          time: 'Yesterday',   group: 'yesterday', unread: false, type: 'community' },
  { id: 7, icon: '🌸', title: 'You joined the Meditation Circle.',                time: 'Yesterday',   group: 'yesterday', unread: false, type: 'system'    },
  { id: 8, icon: '🏆', title: 'You earned the "7-Day Streak" badge!',             time: '3 days ago',  group: 'earlier',   unread: false, type: 'system'    },
  { id: 9, icon: '💬', title: 'Riya commented on your story.',                    time: '3 days ago',  group: 'earlier',   unread: false, type: 'community' },
];

const FILTERS = ['All', 'Unread', 'System', 'Community'];
const GROUPS  = [
  { key: 'today',     label: 'Today'     },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier',   label: 'Earlier'   },
];

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter]   = useState('All');

  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread')    return n.unread;
    if (activeFilter === 'System')    return n.type === 'system';
    if (activeFilter === 'Community') return n.type === 'community';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  function markRead(id)  { setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n)); }
  function deleteN(id)   { setNotifications(prev => prev.filter(n => n.id !== id)); }
  function markAllRead() { setNotifications(prev => prev.map(n => ({ ...n, unread: false }))); }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0B1A',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: 24,
    }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 12, width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} color="#B8B4D8" />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <div style={{ fontSize: 12, color: '#A78BFA', marginTop: 2 }}>{unreadCount} unread</div>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: 10, padding: '6px 12px',
              color: '#A78BFA', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 5,
              flexShrink: 0,
            }}
          >
            <Check size={12} /> Mark all read
          </button>
        )}
      </motion.div>

      {/* ── Filter tabs ── */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 20px', marginBottom: 20,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {FILTERS.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '7px 18px', borderRadius: 20, whiteSpace: 'nowrap',
              background: activeFilter === f
                ? 'linear-gradient(135deg, #7C3AED, #A855F7)'
                : 'rgba(255,255,255,0.06)',
              border: activeFilter === f ? 'none' : '1px solid rgba(255,255,255,0.09)',
              color: activeFilter === f ? '#fff' : '#B8B4D8',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: activeFilter === f ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* ── Notification groups ── */}
      <div style={{ padding: '0 16px' }}>
        {GROUPS.map(({ key, label }) => {
          const items = filtered.filter(n => n.group === key);
          if (items.length === 0) return null;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 22 }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, color: '#F4C542',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                padding: '0 8px', marginBottom: 8,
              }}>
                {label}
              </div>

              <div style={{
                background: 'rgba(34,18,73,0.72)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}>
                <AnimatePresence>
                  {items.map((n, idx) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24, height: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        borderBottom: idx < items.length - 1
                          ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      <NotificationCard
                        notification={n}
                        onMarkRead={markRead}
                        onDelete={deleteN}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '56px 0', color: '#8A84B6' }}
          >
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔔</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E2DEFF', marginBottom: 6 }}>
              {activeFilter === 'Unread' ? 'All caught up!' : 'No notifications'}
            </div>
            <div style={{ fontSize: 12 }}>
              {activeFilter === 'Unread'
                ? 'You have no unread notifications.'
                : 'Nothing to show here yet.'}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
