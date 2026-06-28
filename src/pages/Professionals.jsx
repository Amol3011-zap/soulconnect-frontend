import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Filter, Search } from 'lucide-react';

const BG = '#0D0B1A';
const CARD = '#211044';
const BORDER = 'rgba(255,255,255,0.07)';
const PURPLE = '#8B5CF6';
const GOLD = '#F4C542';
const TEXT2 = '#8A84B6';
const TEXT3 = '#B8B4D8';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'therapist', label: 'Therapists', icon: '🧠' },
  { id: 'psychologist', label: 'Psychologists', icon: '📋' },
  { id: 'coach', label: 'Life Coaches', icon: '🌱' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
  { id: 'energy', label: 'Energy Healers', icon: '✨' },
];

const PROFESSIONALS = [
  { id: 1, name: 'Dr. Meera Sharma', role: 'Psychologist', specialty: 'Anxiety & Trauma', rating: 4.9, sessions: 847, price: '₹1,200', avatar: 'M', color: '#7C3AED', available: true, nextSlot: 'Today, 3 PM', tags: ['CBT', 'Trauma', 'Anxiety'] },
  { id: 2, name: 'Rohan Kapoor', role: 'Life Coach', specialty: 'Burnout & Career', rating: 4.8, sessions: 523, price: '₹900', avatar: 'R', color: '#2DD4BF', available: true, nextSlot: 'Tomorrow, 11 AM', tags: ['Burnout', 'Career', 'Mindset'] },
  { id: 3, name: 'Anjali Mehta', role: 'Therapist', specialty: 'Relationships & Grief', rating: 4.9, sessions: 1204, price: '₹1,500', avatar: 'A', color: '#EC4899', available: false, nextSlot: 'Thu, 2 PM', tags: ['Grief', 'Relationships', 'Depression'] },
  { id: 4, name: 'Kabir Das', role: 'Meditation Teacher', specialty: 'Mindfulness & Sleep', rating: 4.7, sessions: 389, price: '₹600', avatar: 'K', color: '#F59E0B', available: true, nextSlot: 'Today, 6 PM', tags: ['Mindfulness', 'Sleep', 'Breathwork'] },
];

export default function Professionals() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredPros = PROFESSIONALS.filter((p) => {
    const matchSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      activeCategory === 'all' ||
      (activeCategory === 'therapist' && p.role === 'Therapist') ||
      (activeCategory === 'psychologist' && p.role === 'Psychologist') ||
      (activeCategory === 'coach' && p.role === 'Life Coach') ||
      (activeCategory === 'meditation' && p.role === 'Meditation Teacher') ||
      (activeCategory === 'energy' && p.role === 'Energy Healer');

    return matchSearch && matchCategory;
  });

  return (
    <div
      style={{
        padding: '20px 32px',
        minHeight: '100vh',
        background: BG,
        paddingBottom: 100,
        fontFamily: "'Inter', sans-serif",
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
            Coming Soon — Bookings open soon! 🌱
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0 }}>Professionals</h1>
        <p style={{ fontSize: 14, color: TEXT2, marginTop: 4, marginBottom: 0 }}>
          Connect with verified therapists, coaches, and healers.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        style={{ position: 'relative', marginBottom: 20 }}
      >
        <Search
          size={16}
          color={TEXT2}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search by name, specialty..."
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

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          marginBottom: 24,
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 20,
              border: `1px solid ${activeCategory === cat.id ? PURPLE : BORDER}`,
              background: activeCategory === cat.id ? PURPLE : 'rgba(255,255,255,0.04)',
              color: activeCategory === cat.id ? '#fff' : TEXT3,
              fontSize: 13,
              fontWeight: activeCategory === cat.id ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Professional Cards */}
      {filteredPros.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', color: TEXT2, fontSize: 14, marginTop: 48 }}
        >
          No professionals found for your search.
        </motion.div>
      ) : (
        filteredPros.map((pro, i) => (
          <motion.div
            key={pro.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + i * 0.08, duration: 0.35 }}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              padding: 20,
              marginBottom: 12,
            }}
          >
            {/* Top row: avatar + name + role + availability */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: `${pro.color}33`,
                  border: `2px solid ${pro.color}66`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: pro.color,
                  flexShrink: 0,
                }}
              >
                {pro.avatar}
              </div>

              {/* Name + role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{pro.name}</div>
                <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>{pro.role}</div>
                {/* Availability badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: pro.available ? '#10B981' : '#6B7280',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: pro.available ? '#10B981' : TEXT2,
                      fontWeight: 500,
                    }}
                  >
                    {pro.available ? 'Available' : `Next: ${pro.nextSlot}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialty */}
            <div style={{ fontSize: 13, color: TEXT3, marginBottom: 12 }}>{pro.specialty}</div>

            {/* Tag pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {pro.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: 'rgba(139,92,246,0.12)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    color: PURPLE,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} color={GOLD} fill={GOLD} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pro.rating}</span>
              </div>
              <div style={{ fontSize: 12, color: TEXT2 }}>{pro.sessions.toLocaleString()} sessions</div>
              <div style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 700, color: '#fff' }}>{pro.price}</div>
              <div style={{ fontSize: 11, color: TEXT2 }}>/ session</div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={triggerToast}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${PURPLE}, #6D28D9)`,
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                Book Session
              </button>
              <button
                onClick={triggerToast}
                style={{
                  padding: '11px 18px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: TEXT3,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                View Profile
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
