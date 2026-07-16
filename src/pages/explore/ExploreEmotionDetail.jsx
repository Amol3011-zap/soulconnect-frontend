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
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px 0', maxWidth: '700px', lineHeight: '1.6' }}>
              {emotion.hero.subtitle}
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              5 min read • Reviewed by the SoulConnect team • Updated February 2025
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
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 16px 0' }}>
              {emotionSlug === 'self-doubt'
                ? 'What are self-doubt and low self-esteem?'
                : emotionSlug === 'relationship-issues'
                ? 'What are relationship issues?'
                : emotionSlug === 'financial-worry'
                ? 'What is financial stress?'
                : emotionSlug === 'sleep-issues'
                ? 'What are sleep issues?'
                : emotionSlug === 'panic-attacks'
                ? 'What are panic attacks?'
                : `What is ${emotion.displayName.toLowerCase()}?`}
            </h2>
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
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
              {emotionSlug === 'relationship-issues'
                ? 'Common relationship challenges'
                : emotionSlug === 'financial-worry'
                ? 'Common signs of financial stress'
                : emotionSlug === 'sleep-issues'
                ? 'Common signs of sleep problems'
                : emotionSlug === 'panic-attacks'
                ? 'Common signs of panic attacks'
                : emotionSlug === 'social-anxiety'
                ? 'Common signs of social anxiety'
                : emotionSlug === 'perfectionism'
                ? 'Common signs of perfectionism'
                : emotionSlug === 'overwhelm'
                ? 'Common signs of overwhelm'
                : `Common ${emotion.displayName.toLowerCase()} symptoms`}
            </h2>
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
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
              {emotionSlug === 'relationship-issues'
                ? 'Common causes of relationship problems'
                : emotionSlug === 'financial-worry'
                ? 'Common causes of financial stress'
                : emotionSlug === 'sleep-issues'
                ? 'Common causes of sleep problems'
                : emotionSlug === 'panic-attacks'
                ? 'Common causes and triggers of panic attacks'
                : emotionSlug === 'social-anxiety'
                ? 'Common causes and triggers of social anxiety'
                : emotionSlug === 'perfectionism'
                ? 'Common causes and triggers of perfectionism'
                : emotionSlug === 'overwhelm'
                ? 'Common causes and triggers of overwhelm'
                : `Common ${emotion.displayName.toLowerCase()} triggers`}
            </h2>
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
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>How to manage {emotionSlug === 'financial-worry' ? 'financial stress' : emotion.displayName.toLowerCase()}: techniques you can try today</h2>
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
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
              {emotionSlug === 'relationship-issues'
                ? 'Questions to understand your relationship'
                : emotionSlug === 'financial-worry'
                ? 'Questions to understand your relationship with money'
                : emotionSlug === 'sleep-issues'
                ? 'Questions to understand your sleep'
                : emotionSlug === 'panic-attacks'
                ? 'Questions to understand your experience with panic'
                : `Questions to understand your ${emotion.displayName.toLowerCase()}`}
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {emotion.reflectionQuestions.map((question, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: '500', lineHeight: '1.6', margin: 0 }}>• {question}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Find Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ marginBottom: '48px', padding: '32px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(124, 58, 237, 0.08) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              💜{' '}
              {emotionSlug === 'self-doubt'
                ? 'Build confidence and self-worth'
                : emotionSlug === 'relationship-issues'
                ? 'Strengthen your relationships'
                : emotionSlug === 'work-stress'
                ? 'Protect your well-being'
                : emotionSlug === 'financial-worry'
                ? 'Build financial confidence and stability'
                : emotionSlug === 'sleep-issues'
                ? 'Improve your sleep and well-being'
                : emotionSlug === 'panic-attacks'
                ? 'Find support for panic and anxiety'
                : emotionSlug === 'social-anxiety'
                ? 'Build confidence and connection'
                : emotionSlug === 'perfectionism'
                ? 'Build self-compassion and confidence'
                : emotionSlug === 'overwhelm'
                ? 'Find clarity and support'
                : `Find ${emotion.displayName.toLowerCase()} support`}
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', margin: '0 0 24px 0' }}>
              {emotionSlug === 'self-doubt'
                ? 'You don\'t have to face self-doubt alone. SoulConnect helps people build confidence, strengthen self-worth, and connect with supportive communities:'
                : emotionSlug === 'relationship-issues'
                ? 'You don\'t have to navigate relationship challenges alone. SoulConnect helps people improve communication, build healthier connections, and find support during difficult times:'
                : emotionSlug === 'work-stress'
                ? 'You don\'t have to carry work stress alone. SoulConnect helps people manage pressure, set healthier boundaries, and protect their mental well-being:'
                : emotionSlug === 'financial-worry'
                ? 'You don\'t have to navigate financial stress alone. SoulConnect helps people understand their finances, build confidence with money, and find support during tough times:'
                : emotionSlug === 'sleep-issues'
                ? 'You don\'t have to deal with sleep problems alone. SoulConnect helps people understand sleep challenges, reduce stress, and build healthier habits:'
                : emotionSlug === 'panic-attacks'
                ? 'You don\'t have to face panic attacks alone. SoulConnect helps people understand panic, build coping skills, and find support during difficult moments:'
                : emotionSlug === 'social-anxiety'
                ? 'You don\'t have to face social anxiety alone. SoulConnect helps people build confidence, practice social connection, and find support in a safe environment:'
                : emotionSlug === 'perfectionism'
                ? 'You don\'t have to face perfectionism alone. SoulConnect helps people manage self-criticism, build confidence, and develop healthier expectations for themselves:'
                : emotionSlug === 'overwhelm'
                ? 'You don\'t have to navigate overwhelm alone. SoulConnect helps people reduce stress, organize their thoughts, and find support during difficult periods:'
                : `You don't have to carry ${emotion.displayName.toLowerCase()} alone. SoulConnect helps people manage ${emotion.displayName.toLowerCase()} and mental health challenges:`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: 'rgba(34, 18, 73, 0.72)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>💬 Connect with peers</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.6' }}>
                  {emotionSlug === 'self-doubt'
                    ? 'Join anonymously with others who understand self-doubt, confidence struggles, and low self-esteem'
                    : emotionSlug === 'relationship-issues'
                    ? 'Join anonymously with others who understand relationship challenges, breakups, trust issues, and communication struggles'
                    : emotionSlug === 'work-stress'
                    ? 'Join anonymously with others who understand workplace pressure, burnout, difficult colleagues, and career stress'
                    : emotionSlug === 'financial-worry'
                    ? 'Join anonymously with others who understand financial stress, money anxiety, and building financial confidence'
                    : emotionSlug === 'sleep-issues'
                    ? 'Join anonymously with others who understand insomnia, restless nights, racing thoughts, and sleep struggles'
                    : emotionSlug === 'panic-attacks'
                    ? 'Join anonymously with others who understand panic attacks, anxiety, fear, and overwhelming emotions'
                    : emotionSlug === 'social-anxiety'
                    ? 'Join anonymously with others who understand social anxiety, fear of judgment, loneliness, and social pressure'
                    : emotionSlug === 'perfectionism'
                    ? 'Join anonymously with others who understand perfectionism, burnout, self-doubt, and the pressure to succeed'
                    : emotionSlug === 'overwhelm'
                    ? 'Join anonymously with others who understand overwhelm, burnout, decision fatigue, and the pressure of everyday life'
                    : `Join anonymously with others who understand ${emotion.displayName.toLowerCase()}`}
                </p>
              </div>
              <div style={{ padding: '16px', background: 'rgba(34, 18, 73, 0.72)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>🧘 Guided exercises</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.6' }}>Explore grounding techniques, calming exercises, and small daily steps that support emotional well-being</p>
              </div>
              <div style={{ padding: '16px', background: 'rgba(34, 18, 73, 0.72)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>👥 Support groups</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.6' }}>Join communities dedicated to mental health and wellness</p>
              </div>
              <div style={{ padding: '16px', background: 'rgba(34, 18, 73, 0.72)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#A78BFA', margin: '0 0 8px 0' }}>👨‍⚕️ Professional help</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: '1.6' }}>Connect with verified therapists and mental health professionals</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                  border: 'none',
                  color: '#FFF',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Join SoulConnect
              </button>
              <button
                onClick={() => window.location.href = '/explore'}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(124, 58, 237, 0.4)',
                  color: '#A78BFA',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(124, 58, 237, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(124, 58, 237, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Explore more emotions
              </button>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            style={{ marginBottom: '48px' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>Frequently asked questions about {emotionSlug === 'financial-worry' ? 'financial stress' : emotionSlug === 'sleep-issues' ? 'sleep problems' : emotionSlug === 'panic-attacks' ? 'panic attacks' : emotion.displayName.toLowerCase()}</h2>
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
          {/* Related Topics */}
          {emotion.relatedCategories && emotion.relatedCategories.length > 0 && (
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
                      onClick={() => navigate(`/explore/${slug}`)}
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

          {/* Important Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            style={{ padding: '20px', background: 'rgba(241, 65, 108, 0.08)', border: '1px solid rgba(241, 65, 108, 0.2)', borderRadius: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '48px' }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#FFF' }}>⚠️ Important</p>
            <p style={{ margin: 0 }}>
              SoulConnect offers support, resources, and community, but it is not a substitute for professional medical advice. If you are in immediate danger or thinking about harming yourself, please contact emergency services or someone you trust immediately.
            </p>
          </motion.div>

          {/* Trust & Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}
          >
            <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: 'rgba(255,255,255,0.7)' }}>Medical and Editorial Review</p>
            <p style={{ margin: '0 0 8px 0' }}>
              {emotion.trustSafety?.disclaimer || 'This content is educational and reviewed by the SoulConnect team. It is not a substitute for professional mental health advice, diagnosis, or treatment.'}
            </p>
            <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Last reviewed: {emotion.trustSafety?.lastReviewedDate || 'February 2025'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
