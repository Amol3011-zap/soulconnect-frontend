import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const EMOTIONS = [
  { emoji: '😰', name: 'Anxiety', count: 156 },
  { emoji: '😢', name: 'Sadness', count: 128 },
  { emoji: '😤', name: 'Anger', count: 94 },
  { emoji: '😔', name: 'Loneliness', count: 142 },
  { emoji: '😩', name: 'Burnout', count: 87 },
  { emoji: '😌', name: 'Calm', count: 203 },
  { emoji: '💪', name: 'Strength', count: 167 },
  { emoji: '🤍', name: 'Compassion', count: 134 },
  { emoji: '🌱', name: 'Hope', count: 156 },
  { emoji: '✨', name: 'Peace', count: 189 },
];

const CATEGORIES = [
  { id: 'meditation', emoji: '🧘', name: 'Meditation', desc: 'Guided meditations for peace', color: '#4F46E5' },
  { id: 'mindfulness', emoji: '🌿', name: 'Mindfulness', desc: 'Present moment awareness', color: '#10B981' },
  { id: 'healing', emoji: '💫', name: 'Healing Practices', desc: 'Energy & spiritual healing', color: '#6D4AFF' },
  { id: 'breathing', emoji: '💨', name: 'Breathwork', desc: 'Calming breathing techniques', color: '#0891B2' },
  { id: 'journaling', emoji: '📔', name: 'Journaling', desc: 'Self-reflection & expression', color: '#D97706' },
  { id: 'yoga', emoji: '🧘‍♀️', name: 'Yoga', desc: 'Mind-body alignment', color: '#EC4899' },
  { id: 'sleep', emoji: '😴', name: 'Sleep & Rest', desc: 'Better sleep practices', color: '#8B5CF6' },
  { id: 'gratitude', emoji: '🙏', name: 'Gratitude', desc: 'Thankfulness practices', color: '#F59E0B' },
];

const TRENDING = [
  { id: 1, title: 'Managing Anxiety in Daily Life', category: 'Mindfulness', saves: 1204, emoji: '🌊' },
  { id: 2, title: '5-Minute Breathing for Stress Relief', category: 'Breathwork', saves: 982, emoji: '💨' },
  { id: 3, title: 'Loving-Kindness Meditation Guide', category: 'Meditation', saves: 756, emoji: '💕' },
  { id: 4, title: 'Sleep Better: The Complete Guide', category: 'Sleep & Rest', saves: 654, emoji: '✨' },
  { id: 5, title: 'Journaling for Emotional Healing', category: 'Journaling', saves: 521, emoji: '📝' },
];

const COLLECTIONS = [
  {
    id: 'morning-ritual',
    emoji: '🌅',
    title: 'Morning Ritual',
    desc: 'Start your day with intention',
    items: 5,
    color: '#FBBF24',
  },
  {
    id: 'stress-relief',
    emoji: '🧘',
    title: 'Stress Relief',
    desc: 'Quick techniques for calm',
    items: 8,
    color: '#6D4AFF',
  },
  {
    id: 'sleep-better',
    emoji: '🌙',
    title: 'Better Sleep',
    desc: 'Wind down before bed',
    items: 6,
    color: '#8B5CF6',
  },
  {
    id: 'confidence-boost',
    emoji: '⭐',
    title: 'Confidence Boost',
    desc: 'Build self-belief',
    items: 7,
    color: '#F59E0B',
  },
];

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingTop: 80, paddingBottom: 80 }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .explore-card {
          animation: fadeInUp 0.4s ease-out both;
          border-radius: 16px;
          border: 1px solid rgba(109,74,255,0.1);
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .explore-card:hover {
          border-color: rgba(109,74,255,0.3);
          box-shadow: 0 8px 32px rgba(109,74,255,0.12);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 40px)', marginBottom: 48 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Explore
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Discover guided practices, curated collections, and trending wisdom
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(109,74,255,0.05)', border: '1px solid rgba(109,74,255,0.15)',
          borderRadius: 16, padding: '12px 16px',
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search meditations, practices, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              outline: 'none', fontSize: 14, color: 'var(--text)',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Emotion Library */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 40px)', marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Emotion Library
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Explore practices, meditations, and resources for what you're feeling right now
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12,
        }}>
          {EMOTIONS.map((emotion, idx) => (
            <button key={emotion.name}
              className="explore-card"
              style={{
                padding: 16, cursor: 'pointer', border: 'none',
                background: 'var(--card)',
                textAlign: 'center',
                animationDelay: `${idx * 30}ms`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{emotion.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{emotion.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{emotion.count} resources</div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 40px)', marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Browse by Category
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16,
        }}>
          {CATEGORIES.map((cat, idx) => (
            <button key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="explore-card"
              style={{
                padding: 20, cursor: 'pointer', border: 'none',
                background: selectedCategory === cat.id
                  ? `linear-gradient(135deg, rgba(${cat.color === '#4F46E5' ? '79,70,229' : cat.color === '#10B981' ? '16,185,129' : cat.color === '#6D4AFF' ? '109,74,255' : cat.color === '#0891B2' ? '8,145,178' : cat.color === '#D97706' ? '217,119,6' : cat.color === '#EC4899' ? '236,72,153' : cat.color === '#8B5CF6' ? '139,92,246' : '245,158,11'},0.2), rgba(${cat.color === '#4F46E5' ? '79,70,229' : cat.color === '#10B981' ? '16,185,129' : cat.color === '#6D4AFF' ? '109,74,255' : cat.color === '#0891B2' ? '8,145,178' : cat.color === '#D97706' ? '217,119,6' : cat.color === '#EC4899' ? '236,72,153' : cat.color === '#8B5CF6' ? '139,92,246' : '245,158,11'},0.08))`
                  : 'var(--card)',
                borderColor: selectedCategory === cat.id ? cat.color : 'rgba(109,74,255,0.1)',
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, textAlign: 'left' }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'left' }}>{cat.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 40px)', marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          🔥 Trending This Week
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {TRENDING.map((item, idx) => (
            <div key={item.id} className="explore-card"
              style={{
                padding: 20, cursor: 'pointer',
                background: 'var(--card)',
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div style={{ fontSize: 24 }}>{item.emoji}</div>
                <span style={{ fontSize: 11, color: '#6D4AFF', fontWeight: 700, background: 'rgba(109,74,255,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                  {item.category}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{item.title}</h3>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>💾 {item.saves.toLocaleString()} saves</div>
            </div>
          ))}
        </div>
      </div>

      {/* Collections Section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 3vw, 40px)', marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Curated Collections
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {COLLECTIONS.map((col, idx) => (
            <div key={col.id} className="explore-card"
              style={{
                padding: 24, cursor: 'pointer',
                background: `linear-gradient(135deg, rgba(109,74,255,0.05), rgba(167,139,250,0.03))`,
                animationDelay: `${idx * 50}ms`,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `linear-gradient(135deg, ${col.color}22, ${col.color}11)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 12,
              }}>
                {col.emoji}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{col.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{col.desc}</p>
              <div style={{ fontSize: 12, color: '#6D4AFF', fontWeight: 600 }}>
                {col.items} practices
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(20px, 3vw, 40px)', marginBottom: 64 }}>
        <div className="explore-card" style={{
          padding: 40, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(109,74,255,0.08), rgba(167,139,250,0.04))',
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ready to Start Your Healing Journey?
          </h3>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Connect with experienced healers, join group circles, and access thousands of guided practices
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/healers" style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)',
              color: '#fff', textDecoration: 'none',
              fontWeight: 700, fontSize: 14,
            }}>
              Find a Healer
            </Link>
            <Link to="/groups" style={{
              padding: '12px 24px', borderRadius: 12,
              background: 'rgba(109,74,255,0.1)', color: '#6D4AFF',
              textDecoration: 'none', fontWeight: 700, fontSize: 14,
              border: '1px solid rgba(109,74,255,0.2)',
            }}>
              Join Circles
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
