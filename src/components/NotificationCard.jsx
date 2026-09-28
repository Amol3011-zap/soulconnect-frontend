import React from 'react';

export default function NotificationCard({ notification, onMarkRead, onDelete, compact = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: compact ? '10px 12px' : '14px 16px',
      borderRadius: 0,
      background: notification.unread ? '#F7F3FD' : 'transparent',
      position: 'relative',
      transition: 'background 0.2s',
    }}>
      {/* Unread dot */}
      {notification.unread && (
        <div style={{
          position: 'absolute', top: compact ? 12 : 16, right: compact ? 10 : 14,
          width: 7, height: 7, borderRadius: '50%',
          background: '#6B4FA0',
          boxShadow: '0 0 0 3px rgba(107,79,160,0.15)',
          flexShrink: 0,
        }} />
      )}

      {/* Icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: notification.unread
          ? 'linear-gradient(135deg, #EDE4FA, #FBF1EC)'
          : '#F6F3FA',
        border: notification.unread ? '1px solid #DCD0F0' : '1px solid #EFE9F8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>
        {notification.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: notification.unread ? 16 : 0 }}>
        <div style={{
          fontSize: 13, lineHeight: 1.5,
          color: notification.unread ? '#221B3A' : '#5B5470',
          fontWeight: notification.unread ? 600 : 400,
        }}>
          {notification.title}
        </div>
        <div style={{ fontSize: 11.5, color: '#6E6784', marginTop: 2 }}>{notification.time}</div>

        {!compact && (
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {notification.unread && onMarkRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                style={{
                  background: 'none', border: 'none', color: '#6B4FA0',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  padding: 0, fontFamily: 'inherit',
                }}
              >
                Mark as read
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(notification.id)}
                style={{
                  background: 'none', border: 'none', color: '#8A84A0',
                  fontSize: 12, cursor: 'pointer', padding: 0,
                  fontFamily: 'inherit',
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
