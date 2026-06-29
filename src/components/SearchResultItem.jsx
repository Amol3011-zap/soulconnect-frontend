import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchResultItem({ item, onClose }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(item.route);
    onClose();
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.12)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 12px', borderRadius: 12, cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {item.avatar ? (
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: item.avatarColor || '#7C3AED',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
          boxShadow: `0 0 10px ${item.avatarColor || '#7C3AED'}55`,
        }}>
          {item.avatar}
        </div>
      ) : (
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(168,85,247,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          {item.emoji}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#E2DEFF',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </div>
        {item.sub && (
          <div style={{ fontSize: 11, color: '#8A84B6', marginTop: 1 }}>{item.sub}</div>
        )}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(139,116,230,0.4)', flexShrink: 0 }}>›</div>
    </div>
  );
}
