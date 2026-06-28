import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Wind } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'breathing', label: 'Breathing', icon: '💨' },
  { id: 'sleep', label: 'Sleep', icon: '🌙' },
  { id: 'anxiety', label: 'Anxiety', icon: '🌊' },
  { id: 'focus', label: 'Focus', icon: '🎯' },
  { id: 'morning', label: 'Morning', icon: '🌅' },
  { id: 'sound', label: 'Sound', icon: '🎵' },
];

const FEATURED = [
  { id: 1, title: 'Morning Calm', duration: '10 min', level: 'Beginner', emoji: '🌅', desc: 'Start your day with clarity and grounded intention.', color: '#F59E0B', cat: 'morning' },
  { id: 2, title: 'Anxiety Relief', duration: '15 min', level: 'All levels', emoji: '🌊', desc: 'Guided breathing to quiet the overthinking mind.', color: '#3B82F6', cat: 'anxiety' },
  { id: 3, title: 'Deep Sleep', duration: '20 min', level: 'All levels', emoji: '🌙', desc: 'Release the day and drift into peaceful rest.', color: '#6D28D9', cat: 'sleep' },
  { id: 4, title: 'Box Breathing', duration: '7 min', level: 'Beginner', emoji: '💨', desc: 'Inhale 4s, hold 4s, exhale 4s — calm in minutes.', color: '#2DD4BF', cat: 'breathing' },
  { id: 5, title: 'Inner Child', duration: '25 min', level: 'Advanced', emoji: '🌸', desc: 'Reconnect with and nurture your inner self.', color: '#EC4899', cat: 'anxiety' },
  { id: 6, title: 'Focus Flow', duration: '12 min', level: 'All levels', emoji: '🎯', desc: 'Sharpen attention and enter a state of deep focus.', color: '#8B5CF6', cat: 'focus' },
];

const AMBIENT = [
  { emoji: '🌊', label: 'Ocean', color: '#3B82F6' },
  { emoji: '🌧', label: 'Rain', color: '#6366F1' },
  { emoji: '🔥', label: 'Fire', color: '#F97316' },
  { emoji: '🌿', label: 'Forest', color: '#10B981' },
];

export default function Meditations() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const filtered = activeCategory === 'all'
    ? FEATURED
    : FEATURED.filter((s) => s.cat === activeCategory);

  return (
    <div
      style={{
        padding: '20px 32px',
        minHeight: '100vh',
        background: '#0D0B1A',
        fontFamily: 'Inter, sans-serif',
        paddingBottom: 100,
        position: 'relative',
      }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#211044',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 14,
              padding: '12px 24px',
              color: '#B8B4D8',
              fontSize: 14,
              fontWeight: 600,
              zIndex: 999,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            Coming Soon 🎧
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Meditate</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8A84B6' }}>Find stillness within.</p>
          </div>
          <div
            style={{
              background: 'rgba(244,197,66,0.12)',
              border: '1px solid rgba(244,197,66,0.3)',
              borderRadius: 20,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              color: '#F4C542',
              flexShrink: 0,
              marginTop: 4,
            }}
          >
            ✦ COMING SOON
          </div>
        </div>
      </motion.div>

      {/* Featured Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          background: 'linear-gradient(135deg, #1a0533, #2d1060, #1a0533)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 24,
          padding: 28,
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Today's Pick
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Box Breathing</div>
          <div style={{ fontSize: 13, color: '#8A84B6', marginBottom: 16 }}>7 min · Beginner</div>
          <button
            onClick={showToast}
            style={{
              background: '#8B5CF6',
              border: 'none',
              borderRadius: 12,
              padding: '10px 22px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Play size={14} fill="#fff" />
            Start Session
          </button>
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.25)',
            boxShadow: '0 0 32px rgba(139,92,246,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
            flexShrink: 0,
          }}
        >
          💨
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          marginBottom: 20,
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              flexShrink: 0,
              background: activeCategory === cat.id ? '#8B5CF6' : 'rgba(255,255,255,0.06)',
              border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '7px 16px',
              color: activeCategory === cat.id ? '#fff' : '#B8B4D8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Session Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {filtered.map((session, idx) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            style={{
              background: '#211044',
              borderRadius: 20,
              padding: 20,
              border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer',
            }}
          >
            {/* Emoji circle */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `${session.color}22`,
                border: `1px solid ${session.color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 14,
              }}
            >
              {session.emoji}
            </div>

            {/* Title */}
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              {session.title}
            </div>

            {/* Pills */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  color: '#8A84B6',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '3px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Clock size={10} />
                {session.duration}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#8A84B6',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '3px 8px',
                }}
              >
                {session.level}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 12, color: '#8A84B6', margin: '0 0 16px', lineHeight: 1.5 }}>
              {session.desc}
            </p>

            {/* Play button row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={(e) => { e.stopPropagation(); showToast(); }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Play size={13} color="#B8B4D8" fill="#B8B4D8" />
              </button>
              <span style={{ fontSize: 13, color: '#8A84B6', fontStyle: 'italic' }}>Coming Soon</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ambient Sounds Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Ambient Sounds</div>
        <div style={{ fontSize: 13, color: '#8A84B6', marginBottom: 16 }}>Background sounds to help you focus or unwind</div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {AMBIENT.map((sound) => (
            <div
              key={sound.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: `${sound.color}22`,
                  border: `1px solid ${sound.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                }}
              >
                {sound.emoji}
              </div>
              <div style={{ fontSize: 12, color: '#B8B4D8', fontWeight: 600 }}>{sound.label}</div>
              <button
                onClick={showToast}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '5px 12px',
                  color: '#B8B4D8',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Play size={10} fill="#B8B4D8" color="#B8B4D8" />
                Play
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
