import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, RefreshCw, MessageCircle } from 'lucide-react';

const CONVERSATIONS = [
  { id: 1, name: 'Dr. Meera Sharma', avatar: 'M', color: '#7C3AED', lastMsg: 'Typing...', time: '9:40 AM', unread: 0, isTyping: true, isOnline: true },
  { id: 2, name: 'Anxiety Support Circle', avatar: '🌊', color: '#3B82F6', lastMsg: "Riya: You're not alone 💜", time: '8:30 AM', unread: 5, isTyping: false, isGroup: true, isOnline: false },
  { id: 3, name: 'Arjun', avatar: 'A', color: '#D97706', lastMsg: 'Thanks for your support!', time: 'Yesterday', unread: 0, isTyping: false, isOnline: false },
  { id: 4, name: 'Priya', avatar: 'P', color: '#EC4899', lastMsg: 'That makes sense.', time: 'Yesterday', unread: 0, isTyping: false, isOnline: true },
  { id: 5, name: 'Meditation Group', avatar: '🧘', color: '#2DD4BF', lastMsg: 'New session tomorrow', time: 'Mon', unread: 0, isTyping: false, isGroup: true, isOnline: false },
  { id: 6, name: 'Rohit K.', avatar: 'R', color: '#10B981', lastMsg: 'That breathing exercise really helped', time: 'Sun', unread: 0, isTyping: false, isOnline: false },
];

const TypingDots = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 2 }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#A78BFA',
          display: 'inline-block',
        }}
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </span>
);

export default function Messages() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: '0',
        minHeight: '100vh',
        background: '#0D0B1A',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky Header */}
      <div
        style={{
          background: '#0D0B1A',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 24px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>Messages</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Edit, RefreshCw].map((Icon, idx) => (
              <button
                key={idx}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Icon size={16} color="#B8B4D8" />
              </button>
            ))}
          </div>
        </div>

        {/* Open Full Chat Banner */}
        <div
          style={{
            marginBottom: 14,
            background: 'linear-gradient(135deg, #1A0A3E, #2D1260)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 16,
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessageCircle size={20} color="#8B5CF6" />
            <span style={{ fontSize: 13, color: '#B8B4D8' }}>Open full chat experience</span>
          </div>
          <button
            onClick={() => navigate('/chat')}
            style={{
              background: '#8B5CF6',
              border: 'none',
              borderRadius: 10,
              padding: '7px 14px',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Open →
          </button>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            color="#8A84B6"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: '100%',
              background: '#1A1035',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 16px 10px 40px',
              color: '#fff',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1 }}>
        {filtered.map((conv) => (
          <motion.div
            key={conv.id}
            onClick={() => navigate('/chat')}
            onHoverStart={() => setHoveredId(conv.id)}
            onHoverEnd={() => setHoveredId(null)}
            animate={{ background: hoveredId === conv.id ? 'rgba(255,255,255,0.03)' : 'transparent' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
            }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: conv.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: conv.avatar.length > 1 ? 22 : 18,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {conv.avatar}
              </div>
              {conv.isOnline && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#22C55E',
                    border: '2px solid #0D0B1A',
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.name}
                </span>
                {conv.isGroup && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#8A84B6',
                      background: 'rgba(255,255,255,0.07)',
                      borderRadius: 6,
                      padding: '1px 6px',
                      flexShrink: 0,
                    }}
                  >
                    Group
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#8A84B6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.isTyping ? (
                  <span style={{ fontStyle: 'italic', color: '#A78BFA', display: 'inline-flex', alignItems: 'center' }}>
                    Typing<TypingDots />
                  </span>
                ) : (
                  conv.lastMsg
                )}
              </div>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#8A84B6' }}>{conv.time}</span>
              {conv.unread > 0 && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {conv.unread}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
