import React from 'react';

export default function NotificationCard({ notification, onMarkRead, onDelete, compact = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: compact ? '10px 12px' : '14px 16px',
      borderRadius: compact ? 0 : 14,
      background: notification.unread ? 'rgba(124,58,237,0.07)' : 'transparent',
      position: 'relative',
      transition: 'background 0.2s',
    }}>
      {/* Unread dot */}
      {notification.unread && (
        <div style={{
          position: 'absolute', top: compact ? 12 : 16, right: compact ? 10 : 14,
          width: 7, height: 7, borderRadius: '50%',
          background: '#A855F7',
          boxShadow: '0 0 6px rgba(168,85,247,0.8)',
          flexShrink: 0,
        }} />
      )}

      {/* Icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: notification.unread
          ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.2))'
          : 'rgba(255,255,255,0.06)',
        border: notification.unread ? '1px solid rgba(168,85,247,0.25)' : '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>
        {notification.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: notification.unread ? 16 : 0 }}>
        <div style={{
          fontSize: 13, lineHeight: 1.5,
          color: notification.unread ? '#E2DEFF' : '#B8B4D8',
          fontWeight: notification.unread ? 500 : 400,
        }}>
          {notification.title}
        </div>
        <div style={{ fontSize: 11, color: '#8A84B6', marginTop: 2 }}>{notification.time}</div>

        {!compact && (
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {notification.unread && onMarkRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                style={{
                  background: 'none', border: 'none', color: '#A78BFA',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  padding: 0, fontFamily: 'Inter, sans-serif',
                }}
              >
                Mark as read
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(notification.id)}
                style={{
                  background: 'none', border: 'none', color: '#6B7280',
                  fontSize: 11, cursor: 'pointer', padding: 0,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
