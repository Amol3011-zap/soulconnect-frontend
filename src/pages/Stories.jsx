import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../store/auth';

const BG = '#0D0B1A';
const CARD = '#211044';
const BORDER = 'rgba(255,255,255,0.07)';
const PURPLE = '#8B5CF6';
const GOLD = '#F4C542';
const TEXT2 = '#8A84B6';
const TEXT3 = '#B8B4D8';

const STORIES = [
  { id: 1, name: 'Anonymous', avatar: null, time: '2h ago', tag: 'Growth', tagColor: '#10B981', preview: "Today I finally said no without feeling guilty. For years I've been saying yes to everything and everyone, putting myself last. Today something shifted.", hearts: 128, comments: 32, saved: false, isAnon: true },
  { id: 2, name: 'Riya', avatar: 'R', avatarColor: '#7C3AED', time: '5h ago', tag: 'Overthinking', tagColor: '#8B5CF6', preview: "After weeks of overthinking, I chose to let it go. It wasn't easy — my mind kept pulling me back. But I realized that not every thought deserves my attention.", hearts: 96, comments: 18, saved: true, isAnon: false },
  { id: 3, name: 'Arjun', avatar: 'A', avatarColor: '#D97706', time: '9h ago', tag: 'Motivation', tagColor: '#F59E0B', preview: "Small steps every day really do change everything. Six months ago I couldn't get out of bed. Today I went for a walk and it felt like flying.", hearts: 112, comments: 24, saved: false, isAnon: false },
  { id: 4, name: 'Priya S.', avatar: 'P', avatarColor: '#EC4899', time: '1d ago', tag: 'Anxiety', tagColor: '#3B82F6', preview: "Therapy changed my relationship with fear. I used to run from every anxious thought. Now I sit with them, breathe through them.", hearts: 203, comments: 41, saved: false, isAnon: false },
  { id: 5, name: 'Anonymous', avatar: null, time: '2d ago', tag: 'Grief', tagColor: '#6366F1', preview: "Missing you gets easier, but it never fully goes away. That's okay. Grief is just love with nowhere to go.", hearts: 341, comments: 67, saved: true, isAnon: true },
  { id: 6, name: 'Mehul', avatar: 'M', avatarColor: '#2DD4BF', time: '3d ago', tag: 'Burnout', tagColor: '#F97316', preview: "I quit a job that was killing me slowly. Best decision of my life. Rest is not laziness. Rest is resistance.", hearts: 178, comments: 29, saved: false, isAnon: false },
];

const TABS = ['For You', 'Following', 'Latest'];
const FILTERS = ['All', 'Anxiety', 'Depression', 'Growth', 'Overthinking', 'Grief', 'Burnout', 'Gratitude', 'Motivation'];

export default function Stories() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('For You');
  const [activeFilter, setActiveFilter] = useState('All');
  const [stories, setStories] = useState(STORIES);
  const [likedMap, setLikedMap] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [heartAnim, setHeartAnim] = useState({});

  const handleLike = (id) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setHeartAnim((prev) => ({ ...prev, [id]: true }));
    setStories((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, hearts: likedMap[id] ? s.hearts - 1 : s.hearts + 1 } : s
      )
    );
    setTimeout(() => setHeartAnim((prev) => ({ ...prev, [id]: false })), 350);
  };

  const handleSave = (id) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, saved: !s.saved } : s))
    );
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'S';

  return (
    <div
      style={{
        padding: '20px 32px',
        minHeight: '100vh',
        background: BG,
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 100,
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
            Coming Soon — Stories posting opens soon! 🌱
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>Soul Stories</h1>
          <p style={{ fontSize: 14, color: TEXT2, marginTop: 4, marginBottom: 0 }}>
            Share your healing journey. You're not alone.
          </p>
        </div>
        <button
          onClick={triggerToast}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Plus size={20} color="#fff" />
        </button>
      </motion.div>

      {/* Write Your Story CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #1A0A3E, #2D1260)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 20,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {userInitial}
        </div>
        <div style={{ flex: 1 }}>
          <div
            onClick={triggerToast}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '10px 16px',
              fontSize: 14,
              color: TEXT2,
              cursor: 'text',
              marginBottom: 10,
            }}
          >
            Share what's on your soul...
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={triggerToast}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: PURPLE,
                border: 'none',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Post
            </button>
            <button
              onClick={triggerToast}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: TEXT3,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Anonymous
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: 'none',
              background: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab ? '#0D0B1A' : TEXT2,
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Filter Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.16 }}
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          marginBottom: 20,
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${activeFilter === f ? PURPLE : BORDER}`,
              background: activeFilter === f ? PURPLE : 'rgba(255,255,255,0.04)',
              color: activeFilter === f ? '#fff' : TEXT3,
              fontSize: 13,
              fontWeight: activeFilter === f ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Story Cards */}
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.05, duration: 0.35 }}
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 20,
            padding: 20,
            marginBottom: 12,
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: story.isAnon ? '#4B4B6B' : story.avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {story.isAnon ? '?' : story.avatar}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{story.name}</div>
                <div style={{ fontSize: 11, color: TEXT2 }}>{story.time}</div>
              </div>
            </div>
            <button
              onClick={() => handleSave(story.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Bookmark
                size={18}
                color={story.saved ? PURPLE : TEXT2}
                fill={story.saved ? PURPLE : 'none'}
              />
            </button>
          </div>

          {/* Preview text */}
          <p
            style={{
              fontSize: 14,
              color: TEXT3,
              lineHeight: 1.7,
              margin: '0 0 12px 0',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {story.preview}
          </p>

          {/* Tag pill */}
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 20,
                background: `${story.tagColor}22`,
                color: story.tagColor,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid ${story.tagColor}44`,
              }}
            >
              {story.tag}
            </span>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Heart */}
            <button
              onClick={() => handleLike(story.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: 0,
              }}
            >
              <motion.span
                animate={heartAnim[story.id] ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Heart
                  size={18}
                  color={likedMap[story.id] ? '#A855F7' : TEXT2}
                  fill={likedMap[story.id] ? '#A855F7' : 'none'}
                />
              </motion.span>
              <span style={{ fontSize: 13, color: likedMap[story.id] ? '#A855F7' : TEXT2 }}>
                {story.hearts}
              </span>
            </button>

            {/* Comment */}
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: 0,
              }}
            >
              <MessageCircle size={18} color={TEXT2} />
              <span style={{ fontSize: 13, color: TEXT2 }}>{story.comments}</span>
            </button>

            {/* Share */}
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                marginLeft: 'auto',
              }}
            >
              <Share2 size={18} color={TEXT2} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
