import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Eye, Clock, Home } from 'lucide-react';
import api from '../../services/api';

export default function ExploreEmotionDetail() {
  const { emotionSlug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [guides, setGuides] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryGuides, setCategoryGuides] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const slug = emotionSlug?.replace('i-feel-', '') || '';
    const cat = categories.find((c) => c.slug === slug);
    setCategory(cat);

    if (cat) {
      fetchGuides(cat.id);
    }
  }, [emotionSlug, categories]);

  useEffect(() => {
    if (guides.length > 0 && category) {
      let sorted = guides.filter((g) => g.category_id === category.id);

      if (sortBy === 'recent') {
        sorted = sorted.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
      } else if (sortBy === 'popular') {
        sorted = sorted.sort((a, b) => b.view_count - a.view_count);
      }

      setCategoryGuides(sorted);
    }
  }, [guides, sortBy, category]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchGuides = async (categoryId) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/guides?category_id=${categoryId}`);
      setGuides(res.data);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!category) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</div>
      </div>
    );
  }

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
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Explore
          </button>
          <span>/</span>
          <span>{category.name}</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => navigate('/explore')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '16px',
                padding: 0,
              }}
            >
              <ChevronLeft size={18} />
              Back to Explore
            </button>

            <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#FFF', margin: '0 0 12px 0' }}>
              {category.name}
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              {categoryGuides.length} {categoryGuides.length === 1 ? 'guide' : 'guides'} available
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Sort Controls */}
          <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
            {['recent', 'popular'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                style={{
                  padding: '8px 16px',
                  background: sortBy === option ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: sortBy === option ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: sortBy === option ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Guides Grid */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
              Loading guides...
            </div>
          ) : categoryGuides.length === 0 ? (
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
              <p style={{ fontSize: '18px', marginBottom: '16px' }}>No guides available yet</p>
              <p style={{ fontSize: '14px' }}>Check back soon for guides on {category.name}</p>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {categoryGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 8 }}
                  onClick={() => navigate(`/explore/guide/${guide.slug}`)}
                  style={{
                    padding: '24px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'grid',
                    gridTemplateColumns: guide.featured_image_url ? '200px 1fr' : '1fr',
                    gap: '24px',
                  }}
                >
                  {/* Featured Image */}
                  {guide.featured_image_url && (
                    <img
                      src={guide.featured_image_url}
                      alt={guide.title}
                      style={{
                        width: '200px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  )}

                  {/* Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                        {guide.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                        {guide.excerpt || guide.meta_description || 'Learn evidence-based strategies for emotional wellness.'}
                      </p>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Eye size={14} />
                        {guide.view_count || 0} views
                      </div>
                      {guide.published_at && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} />
                          {new Date(guide.published_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
