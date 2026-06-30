import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, ChevronRight } from 'lucide-react';

const BG = '#0D0B1A';
const CARD = '#211044';
const BORDER = 'rgba(255,255,255,0.07)';
const PURPLE = '#8B5CF6';
const GOLD = '#F4C542';
const TEXT2 = '#8A84B6';
const TEXT3 = '#B8B4D8';

const MY_COMMUNITIES = [
  { id: 1, name: 'Anxiety Support', icon: '🌊', members: '12.4K', color: '#7C3AED', unread: 3, desc: 'A safe space to share and support each other through anxiety.' },
  { id: 2, name: 'Overthinking', icon: '🌀', members: '8.7K', color: '#3B82F6', unread: 0, desc: 'Break free from the loop. Together.' },
  { id: 3, name: 'Meditation Circle', icon: '🧘', members: '6.3K', color: '#2DD4BF', unread: 1, desc: 'Daily practice, collective peace.' },
];

const TRENDING = [
  { id: 4, name: 'Burnout Recovery', icon: '🔥', members: '9.1K', color: '#F97316', isNew: true },
  { id: 5, name: 'Relationship Healing', icon: '💜', members: '7.2K', color: '#EC4899', isNew: false },
  { id: 6, name: "Men's Circle", icon: '🌿', members: '4.8K', color: '#10B981', isNew: true },
  { id: 7, name: 'Students & Stress', icon: '📚', members: '11K', color: '#6366F1', isNew: false },
  { id: 8, name: 'Grief & Loss', icon: '🕯', members: '5.3K', color: '#8B5CF6', isNew: false },
  { id: 9, name: 'Sleep & Rest', icon: '🌙', members: '8.9K', color: '#1D4ED8', isNew: false },
];

const CATEGORIES = ['Anxiety', 'Depression', 'Relationships', 'Work', 'Family', 'Sleep', 'Grief', 'Identity', 'Trauma', 'Growth'];

export default function Community() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div
      style={{
        padding: 'clamp(16px, 4vw, 32px)',
        minHeight: '100vh',
        background: BG,
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 24,
      }}
    >
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: 'fixed',
              bottom: 90,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1A1035',
              border: `1px solid ${GOLD}`,
              color: GOLD,
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              zIndex: 999,
              whiteSpace: 'nowrap',
            }}
          >
            Coming Soon — Communities launching soon! 🌱
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 20 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>Community</h1>
        <p style={{ fontSize: 14, color: TEXT2, marginTop: 4, marginBottom: 0 }}>
          Support circles built around shared healing.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        style={{ position: 'relative', marginBottom: 28 }}
      >
        <Search
          size={16}
          color={TEXT2}
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: '#1A1035',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '10px 16px 10px 40px',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </motion.div>

      {/* My Communities Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>My Communities</span>
          <span
            onClick={triggerToast}
            style={{ fontSize: 12, color: PURPLE, cursor: 'pointer', fontWeight: 500 }}
          >
            View All
          </span>
        </div>

        {MY_COMMUNITIES.map((community, i) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 + i * 0.05 }}
            onClick={triggerToast}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `${community.color}22`,
                border: `1px solid ${community.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {community.icon}
            </div>

            {/* Name & members */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{community.name}</div>
              <div style={{ fontSize: 12, color: TEXT2, marginTop: 2 }}>{community.members} members</div>
            </div>

            {/* Unread badge + chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {community.unread > 0 && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: PURPLE,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {community.unread}
                </div>
              )}
              <ChevronRight size={16} color={TEXT2} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trending Communities Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Trending Communities</span>
          <button
            onClick={triggerToast}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: PURPLE,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={14} color="#fff" />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
          }}
        >
          {TRENDING.map((community, i) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.32 + i * 0.04 }}
              onClick={triggerToast}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: 16,
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Icon + New badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${community.color}22`,
                    border: `1px solid ${community.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  {community.icon}
                </div>
                {community.isNew && (
                  <span
                    style={{
                      background: `${PURPLE}33`,
                      border: `1px solid ${PURPLE}66`,
                      color: PURPLE,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 20,
                    }}
                  >
                    New
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{community.name}</div>
              <div style={{ fontSize: 11, color: TEXT2, marginBottom: 12 }}>{community.members} members</div>

              <button
                style={{
                  width: '100%',
                  padding: '6px 0',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: TEXT3,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Join +
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Browse by Topic */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{ marginBottom: 20 }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Browse by Topic</div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              style={{
                padding: '7px 16px',
                borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? PURPLE : BORDER}`,
                background: activeCategory === cat ? PURPLE : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? '#fff' : TEXT3,
                fontSize: 13,
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Floating + Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 200 }}
        onClick={triggerToast}
        style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
          zIndex: 50,
        }}
      >
        <Plus size={22} color="#fff" />
      </motion.button>
    </div>
  );
}
