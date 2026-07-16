import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Eye, Send, X, ChevronLeft } from 'lucide-react';
import { useCmsStore } from '../store/cms';
import { useAutoSave } from '../hooks/useAutoSave';
import api from '../services/api';
import GuidePreview from '../components/GuidePreview';

export default function GuideEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cms = useCmsStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!id);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();

    if (id) {
      fetchGuide();
    } else {
      cms.setCurrentGuide({
        title: '',
        slug: '',
        excerpt: '',
        meta_description: '',
        meta_keywords: '',
        seo_title: '',
        featured_image_url: '',
        category_id: '',
        content_json: {
          introduction: '',
          what_is: '',
          why_feel: '',
          management_strategies: [],
          quick_tips: [],
        },
        status: 'draft',
      });
      setLoading(false);
    }
  }, [id]);

  const fetchGuide = async () => {
    try {
      const res = await api.get(`/guides/${id}`);
      cms.setCurrentGuide(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch guide:', error);
      setLoading(false);
    }
  };

  // Auto-save hook
  useAutoSave(cms.currentGuide, cms.isDirty, async (guide) => {
    try {
      cms.setIsSaving(true);
      if (id) {
        await api.put(`/guides/${id}`, guide);
      } else {
        const res = await api.post('/guides', guide);
        cms.setCurrentGuide(res.data);
      }
      cms.setIsDirty(false);
      cms.setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      cms.setIsSaving(false);
    }
  }, 2000);

  const handleFieldChange = (field, value) => {
    cms.updateGuideField(field, value);
  };

  const handleContentChange = (section, value) => {
    cms.updateGuideContent(section, value);
  };

  const handleSubmitForReview = async () => {
    try {
      await api.post(`/guides/${cms.currentGuide.id}/submit-review`);
      navigate('/cms');
    } catch (error) {
      console.error('Failed to submit for review:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await api.post(`/guides/${cms.currentGuide.id}/publish`);
      navigate('/cms');
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)' }}>Loading guide...</div>
      </div>
    );
  }

  if (!cms.currentGuide) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/cms')}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px' }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ margin: 0, color: '#FFF', fontSize: '24px', fontWeight: '600' }}>
            {id ? 'Edit Guide' : 'Create New Guide'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {cms.lastSaved && (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Saved at {cms.lastSaved.toLocaleTimeString()}
            </div>
          )}

          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#A78BFA',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <Eye size={16} />
            Preview
          </button>

          {cms.currentGuide.status === 'draft' && (
            <motion.button
              onClick={handleSubmitForReview}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Send size={16} />
              Submit for Review
            </motion.button>
          )}

          {cms.currentGuide.status === 'in_review' && (
            <motion.button
              onClick={handlePublish}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Save size={16} />
              Publish
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: '32px', padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Editor */}
        <motion.div
          layout
          style={{
            background: 'rgba(34, 18, 73, 0.72)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          {/* Basic Fields */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Basic Information
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={cms.currentGuide.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Guide title"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Category *
                </label>
                <select
                  value={cms.currentGuide.category_id}
                  onChange={(e) => handleFieldChange('category_id', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Featured Image URL *
                </label>
                <input
                  type="url"
                  value={cms.currentGuide.featured_image_url}
                  onChange={(e) => handleFieldChange('featured_image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Excerpt
                </label>
                <textarea
                  value={cms.currentGuide.excerpt}
                  onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                  placeholder="Short description"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Content Sections
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {['introduction', 'what_is', 'why_feel'].map((section) => (
                <div key={section}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500', textTransform: 'capitalize' }}>
                    {section.replace(/_/g, ' ')}
                  </label>
                  <textarea
                    value={cms.currentGuide.content_json?.[section] || ''}
                    onChange={(e) => handleContentChange(section, e.target.value)}
                    placeholder={`Enter ${section.replace(/_/g, ' ')}...`}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEO Fields */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              SEO Optimization
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  SEO Title (60 chars max)
                </label>
                <input
                  type="text"
                  maxLength="60"
                  value={cms.currentGuide.seo_title}
                  onChange={(e) => handleFieldChange('seo_title', e.target.value)}
                  placeholder="Title for search results"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  {cms.currentGuide.seo_title?.length || 0}/60 characters
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Meta Description (160 chars max)
                </label>
                <textarea
                  maxLength="160"
                  value={cms.currentGuide.meta_description}
                  onChange={(e) => handleFieldChange('meta_description', e.target.value)}
                  placeholder="Description for search results"
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  {cms.currentGuide.meta_description?.length || 0}/160 characters
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={cms.currentGuide.meta_keywords}
                  onChange={(e) => handleFieldChange('meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GuidePreview guide={cms.currentGuide} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
