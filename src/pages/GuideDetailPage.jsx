import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share2, Bookmark } from 'lucide-react';
import { useEmotionLibraryStore } from '../store/emotionLibrary';
import api from '../services/api';
import RelatedGuidesComponent from '../components/RelatedGuidesComponent';
import AssessmentComponent from '../components/AssessmentComponent';

export default function GuideDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentGuide, setCurrentGuide, setIsLoading, isLoading } = useEmotionLibraryStore();
  const [showAssessment, setShowAssessment] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchGuide();
  }, [slug]);

  const fetchGuide = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/guides/slug/${slug}`);
      setCurrentGuide(res.data);

      // Log page view
      await api.post('/analytics/events', {
        event_type: 'page_view',
        guide_id: res.data.id,
        page_url: window.location.pathname,
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    } catch (error) {
      console.error('Failed to fetch guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)' }}>Loading guide...</div>
      </div>
    );
  }

  if (!currentGuide) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>Guide not found</p>
          <button
            onClick={() => navigate('/emotion-library')}
            style={{
              padding: '10px 20px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#A78BFA',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
          <button
            onClick={() => navigate(-1)}
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
            Back
          </button>

          {/* Featured Image */}
          {currentGuide.featured_image_url && (
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              src={currentGuide.featured_image_url}
              alt={currentGuide.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '16px',
                marginBottom: '32px',
              }}
            />
          )}

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 style={{ fontSize: '44px', fontWeight: '700', color: '#FFF', margin: '0 0 16px 0' }}>
              {currentGuide.title}
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0' }}>
              {currentGuide.meta_description || 'Evidence-based strategies for emotional wellness'}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSaved(!saved)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: saved ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: saved ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: saved ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px', padding: '48px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Content Sections */}
          {currentGuide.content_json?.introduction && (
            <section style={{ marginBottom: '48px' }}>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', margin: 0 }}>
                {currentGuide.content_json.introduction}
              </p>
            </section>
          )}

          {currentGuide.content_json?.what_is && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#FFF', margin: '0 0 16px 0' }}>
                What Is {currentGuide.title}?
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', margin: 0 }}>
                {currentGuide.content_json.what_is}
              </p>
            </section>
          )}

          {currentGuide.content_json?.why_feel && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#FFF', margin: '0 0 16px 0' }}>
                Why Do We Feel It?
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', margin: 0 }}>
                {currentGuide.content_json.why_feel}
              </p>
            </section>
          )}

          {/* Strategies */}
          {currentGuide.content_json?.management_strategies && currentGuide.content_json.management_strategies.length > 0 && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                Evidence-Based Strategies
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {currentGuide.content_json.management_strategies.map((strategy, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      padding: '20px',
                      background: 'rgba(124, 58, 237, 0.1)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(124, 58, 237, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#A78BFA',
                          fontWeight: '600',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 8px 0', color: '#FFF', fontSize: '16px', fontWeight: '600' }}>
                          {typeof strategy === 'string' ? strategy.split(':')[0] : strategy}
                        </h4>
                        {typeof strategy === 'string' && strategy.includes(':') && (
                          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                            {strategy.split(':')[1]}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Tips */}
          {currentGuide.content_json?.quick_tips && currentGuide.content_json.quick_tips.length > 0 && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                Quick Tips
              </h2>
              <ul style={{
                display: 'grid',
                gap: '12px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}>
                {currentGuide.content_json.quick_tips.map((tip, idx) => (
                  <li key={idx} style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '14px',
                  }}>
                    ✨ {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Assessment CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(168, 85, 247, 0.1))',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FFF', margin: '0 0 12px 0' }}>
              How Are You Feeling?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 20px 0', fontSize: '14px' }}>
              Take a quick self-assessment to understand your emotional state better
            </p>
            <motion.button
              onClick={() => setShowAssessment(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Start Assessment
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <div style={{ display: 'grid', gap: '24px' }}>
          <RelatedGuidesComponent guideId={currentGuide.id} />
        </div>
      </div>

      {/* Assessment Modal */}
      <AnimatePresence>
        {showAssessment && (
          <AssessmentComponent
            guide={currentGuide}
            onClose={() => setShowAssessment(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
