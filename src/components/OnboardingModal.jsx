import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onboardingAPI } from '../services/api';

const P = '#6D4AFF';
const LAV = '#A78BFA';

const PROBLEM_OPTIONS = [
  { id: 'anxiety', emoji: '🧠', label: 'Anxiety' },
  { id: 'loneliness', emoji: '😔', label: 'Loneliness' },
  { id: 'depression', emoji: '🌧', label: 'Depression' },
  { id: 'stress', emoji: '🔥', label: 'Stress' },
  { id: 'burnout', emoji: '💼', label: 'Burnout' },
];

const INTENSITY_OPTIONS = [
  { id: 1, emoji: '😊', title: 'I\'m doing okay', color: '#10B981' },
  { id: 2, emoji: '😐', title: 'A little overwhelmed', color: '#F59E0B' },
  { id: 3, emoji: '😕', title: 'Today feels difficult', color: '#EF4444' },
  { id: 4, emoji: '😢', title: 'I\'m really struggling', color: '#8B5CF6' },
  { id: 5, emoji: '🆘', title: 'I need support today', color: '#7C3AED' },
];

const NEEDS_OPTIONS = [
  { id: 'listening', emoji: '👂', label: 'Someone who listens' },
  { id: 'conversation', emoji: '💬', label: 'Honest conversations' },
  { id: 'friendship', emoji: '🤝', label: 'Friendship' },
  { id: 'healing', emoji: '🌿', label: 'Healing' },
  { id: 'emotional_support', emoji: '❤️', label: 'Emotional support' },
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi'];
const AVAILABILITY_OPTIONS = [
  { id: 'morning', emoji: '🌅', label: 'Morning' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon' },
  { id: 'evening', emoji: '🌇', label: 'Evening' },
  { id: 'night', emoji: '🌙', label: 'Night' },
];
const CITIES = ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    problems: [],
    intensity: null,
    needs: [],
    display_name: '',
    language: '',
    availability: [],
    city: '',
    notifications_enabled: true,
  });

  const handleNext = async () => {
    if (step === 8) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await onboardingAPI.complete(data);
      onComplete?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to complete onboarding');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onComplete?.();
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return data.problems.length > 0;
      case 2: return data.intensity !== null;
      case 3: return data.needs.length > 0;
      case 4: return data.display_name.length >= 3 && /^[a-zA-Z0-9_]+$/.test(data.display_name);
      case 5: return data.language !== '';
      case 6: return data.availability.length > 0;
      case 7: return data.city !== '';
      case 8: return true;
      default: return true;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: `linear-gradient(135deg, #140028 0%, #1e0f47 40%, #2d1b69 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999,
          overflow: 'auto',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            width: '100%',
            maxWidth: 600,
            background: 'rgba(30, 15, 71, 0.8)',
            border: '1px solid rgba(168, 139, 250, 0.2)',
            borderRadius: 24,
            padding: 40,
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Progress */}
          <div style={{
            height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            marginBottom: 40,
            overflow: 'hidden',
          }}>
            <motion.div
              animate={{ width: `${(step / 8) * 100}%` }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${P}, ${LAV})` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Header */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 32, textAlign: 'center' }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {step === 1 && '🧠'}
              {step === 2 && '📊'}
              {step === 3 && '❤️'}
              {step === 4 && '✨'}
              {step === 5 && '🌍'}
              {step === 6 && '⏰'}
              {step === 7 && '📍'}
              {step === 8 && '🎉'}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
              {step === 1 && 'What\'s been on your mind?'}
              {step === 2 && 'How intense does it feel?'}
              {step === 3 && 'What are you looking for?'}
              {step === 4 && 'Your display name'}
              {step === 5 && 'Preferred language'}
              {step === 6 && 'When do you connect?'}
              {step === 7 && 'Which city are you in?'}
              {step === 8 && 'All set! 🌸'}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(184,180,216,0.6)', margin: 0 }}>
              Step {step} of 8
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            key={`content-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: 32, minHeight: 150 }}
          >
            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {PROBLEM_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setData({
                        ...data,
                        problems: data.problems.includes(opt.id)
                          ? data.problems.filter((p) => p !== opt.id)
                          : [...data.problems, opt.id],
                      });
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      border: data.problems.includes(opt.id)
                        ? `2px solid ${LAV}`
                        : '1px solid rgba(168, 139, 250, 0.2)',
                      background: data.problems.includes(opt.id)
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(139, 92, 246, 0.08)',
                      color: '#E2DEFF',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{opt.emoji}</div>
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {INTENSITY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setData({ ...data, intensity: opt.id })}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      border: data.intensity === opt.id ? `2px solid ${opt.color}` : '1px solid rgba(168, 139, 250, 0.2)',
                      background: data.intensity === opt.id ? `${opt.color}15` : 'rgba(139, 92, 246, 0.08)',
                      color: '#E2DEFF',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                    {opt.title}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {NEEDS_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setData({
                        ...data,
                        needs: data.needs.includes(opt.id)
                          ? data.needs.filter((n) => n !== opt.id)
                          : [...data.needs, opt.id],
                      });
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      border: data.needs.includes(opt.id)
                        ? `2px solid ${LAV}`
                        : '1px solid rgba(168, 139, 250, 0.2)',
                      background: data.needs.includes(opt.id)
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(139, 92, 246, 0.08)',
                      color: '#E2DEFF',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{opt.emoji}</div>
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 4 && (
              <input
                type="text"
                value={data.display_name}
                onChange={(e) => setData({ ...data, display_name: e.target.value })}
                placeholder="e.g., alex_123 (letters, numbers, underscores)"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 139, 250, 0.2)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            )}

            {step === 5 && (
              <select
                value={data.language}
                onChange={(e) => setData({ ...data, language: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 139, 250, 0.2)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              >
                <option value="" style={{ background: '#1e0f47' }}>Select a language</option>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang} value={lang} style={{ background: '#1e0f47' }}>
                    {lang}
                  </option>
                ))}
              </select>
            )}

            {step === 6 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setData({
                        ...data,
                        availability: data.availability.includes(opt.id)
                          ? data.availability.filter((a) => a !== opt.id)
                          : [...data.availability, opt.id],
                      });
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      border: data.availability.includes(opt.id)
                        ? `2px solid ${LAV}`
                        : '1px solid rgba(168, 139, 250, 0.2)',
                      background: data.availability.includes(opt.id)
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'rgba(139, 92, 246, 0.08)',
                      color: '#E2DEFF',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{opt.emoji}</div>
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 7 && (
              <select
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 139, 250, 0.2)',
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              >
                <option value="" style={{ background: '#1e0f47' }}>Select your city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city} style={{ background: '#1e0f47' }}>
                    {city}
                  </option>
                ))}
              </select>
            )}

            {step === 8 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', paddingY: 20 }}
              >
                <p style={{ fontSize: 16, color: 'rgba(184, 180, 216, 0.8)', lineHeight: 1.6 }}>
                  🌸 Welcome to SoulConnect! You're all set to begin your healing journey.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                padding: 12,
                color: '#FCA5A5',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 139, 250, 0.3)',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Back
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={step < 8 ? handleNext : handleSkip}
              disabled={loading || !isStepValid()}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 12,
                border: 'none',
                background: isStepValid() ? `linear-gradient(135deg, ${P} 0%, ${LAV} 100%)` : 'rgba(139, 92, 246, 0.3)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: isStepValid() && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                opacity: isStepValid() ? 1 : 0.5,
              }}
            >
              {loading ? 'Loading...' : step === 8 ? 'Get Started →' : 'Next →'}
            </motion.button>

            {step < 8 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(168, 139, 250, 0.2)',
                  background: 'transparent',
                  color: 'rgba(184, 180, 216, 0.6)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Skip
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
