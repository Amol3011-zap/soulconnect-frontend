import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search as SearchIcon, ArrowRight, Home } from 'lucide-react';
import api from '../../services/api';

const CATEGORY_ICONS = {
  anxiety: '🧠',
  depression: '☁️',
  grief: '💔',
  stress: '⚡',
  loneliness: '👤',
  anger: '🔥',
  'self-doubt': '❓',
  'relationship-issues': '👥',
  'work-stress': '💼',
  'financial-worry': '💳',
  'sleep-issues': '🌙',
  'panic-attacks': '⚠️',
  'social-anxiety': '👥❌',
  perfectionism: '🎯',
  overwhelm: '📚',
  'low-self-esteem': '👎',
  burnout: '🔋',
  jealousy: '👀',
  guilt: '😔',
  shame: '🛡️',
  trauma: '🚨',
  addiction: '🚫',
  'body-image': '🪞',
  'imposter-syndrome': '🎭',
  'purpose-meaning': '🧭',
};

export default function ExploreHub() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchInput.trim()) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchInput, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/explore/i-feel-${category.slug}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Home size={16} />
            Home
          </button>
          <span>/</span>
          <span>Explore</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '64px 32px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#FFF', margin: '0 0 16px 0' }}>
            Emotion Library
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: '0 0 32px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Explore 25 emotions and discover evidence-based strategies for emotional wellness
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'rgba(34, 18, 73, 0.72)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          }}>
            <SearchIcon size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              placeholder="Search emotions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: '#FFF',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.5)' }}>
              Loading emotion categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '64px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <p style={{ fontSize: '18px', margin: 0 }}>No emotions found matching "{searchInput}"</p>
              <button
                onClick={() => setSearchInput('')}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  background: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  color: '#A78BFA',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    padding: '28px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Icon & Title */}
                  <div>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                      {CATEGORY_ICONS[category.slug] || '✨'}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: 0 }}>
                      {category.name}
                    </h3>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                      margin: 0,
                      lineHeight: '1.5',
                      flex: 1,
                    }}>
                      {category.description}
                    </p>
                  )}

                  {/* CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#A78BFA',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginTop: '8px',
                  }}>
                    Explore
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '64px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#A78BFA', marginBottom: '8px' }}>
                25
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Emotion Categories
              </p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#A78BFA', marginBottom: '8px' }}>
                {categories.length}
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Available Today
              </p>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#A78BFA', marginBottom: '8px' }}>
                100%
              </div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Evidence-Based
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
