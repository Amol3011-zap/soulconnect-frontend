import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';
import emotionContentLibrary from '../../data/emotionContentLibrary';

export default function ExploreEmotionDetail() {
  const { emotionSlug } = useParams();
  const navigate = useNavigate();

  // Get emotion from static library
  const emotion = useMemo(() => {
    return emotionContentLibrary.find((e) => e.slug === emotionSlug);
  }, [emotionSlug]);

  // If emotion not found, redirect to /explore
  if (!emotion) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <p>Emotion not found</p>
          <button
            onClick={() => navigate('/explore')}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#A78BFA',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Back to Explore
          </button>
        </div>
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
          <span>{emotion.displayName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '48px 32px', background: 'rgba(34, 18, 73, 0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                marginBottom: '24px',
                padding: 0,
              }}
            >
              <ArrowLeft size={18} />
              Back to Explore
            </button>

            <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#FFF', margin: '0 0 16px 0' }}>
              {emotion.hero.title}
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: '700px', lineHeight: '1.6' }}>
              {emotion.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 16px 0' }}>Overview</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', margin: 0 }}>
              {emotion.summary}
            </p>
          </motion.div>

          {/* Relatable Experiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>What This Might Feel Like</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {emotion.relatable.map((item, idx) => (
                <p key={idx} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                  • {item}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Common Situations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Common Situations</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {emotion.situations.map((item, idx) => (
                <p key={idx} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                  • {item}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Things You Can Try Today</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {emotion.tips.map((item, idx) => (
                <p key={idx} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                  • {item}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Reflection Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Reflection Questions</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {emotion.reflectionQuestions.map((question, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500', lineHeight: '1.6', margin: 0 }}>• {question}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Stories from People Like You</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {emotion.stories.map((story, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  background: 'rgba(34, 18, 73, 0.5)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>{story.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>{story.content}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {emotion.faq.map((item, idx) => (
                <div key={idx}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>{item.question}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* When to Seek Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ marginBottom: '48px', padding: '24px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px' }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#A78BFA', margin: '0 0 12px 0' }}>When to Seek Professional Support</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', margin: 0 }}>
              {emotion.whenToSeekSupport}
            </p>
          </motion.div>

          {/* Related Emotions */}
          {emotion.relatedCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ marginBottom: '48px' }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Related Topics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {emotion.relatedCategories.map((slug) => {
                  const related = emotionContentLibrary.find(e => e.slug === slug);
                  if (!related) return null;
                  return (
                    <button
                      key={slug}
                      onClick={() => navigate(`/explore/i-feel-${slug}`)}
                      style={{
                        padding: '16px',
                        background: 'rgba(34, 18, 73, 0.72)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        borderRadius: '12px',
                        color: '#A78BFA',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(124, 58, 237, 0.2)';
                        e.target.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(34, 18, 73, 0.72)';
                        e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                      }}
                    >
                      {related.displayName}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Trust & Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: 'rgba(255,255,255,0.7)' }}>About this content</p>
            <p style={{ margin: 0 }}>
              {emotion.trustSafety.disclaimer}
            </p>
            <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Last reviewed: {emotion.trustSafety.lastReviewedDate}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
