import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../store/auth';
import { useWeatherStore } from '../../store/weather';
import WeatherCard from './WeatherCard';
import WeatherRecommendation from './WeatherRecommendation';

export const WEATHERS = {
  'clear-sky': { id: 'clear-sky', label: 'Clear Sky', icon: '☀️', tagline: 'Peaceful & Calm', description: 'Feeling peaceful, balanced and calm.', color: '#F59E0B', gradient: 'linear-gradient(135deg, #78350F 0%, #D97706 50%, #F59E0B 100%)', glowColor: 'rgba(245,158,11,0.35)', quote: 'You are the sky. Everything else is just weather.', recommendation: { action: 'Help one stranger today.', description: "Your calm energy lights up someone else's day." } },
  'hope': { id: 'hope', label: 'Hope', icon: '🌤', tagline: 'Optimistic & Positive', description: 'Feeling optimistic. Ready for a better day.', color: '#FBBF24', gradient: 'linear-gradient(135deg, #713F12 0%, #CA8A04 50%, #FBBF24 100%)', glowColor: 'rgba(251,191,36,0.35)', quote: 'Hope is being able to see light despite all the darkness.', recommendation: { action: 'Write one gratitude note.', description: 'Capture what you are hopeful about today.' } },
  'blooming': { id: 'blooming', label: 'Blooming', icon: '🌸', tagline: 'Grateful & Growing', description: 'Feeling grateful and growing.', color: '#EC4899', gradient: 'linear-gradient(135deg, #500724 0%, #9D174D 40%, #7E22CE 100%)', glowColor: 'rgba(236,72,153,0.35)', quote: 'You are already blooming into exactly who you are meant to be.', recommendation: { action: 'Share kindness today.', description: 'Your growth creates ripples. Send someone a heartfelt message.' } },
  'fog': { id: 'fog', label: 'Fog', icon: '🌫', tagline: 'Confused & Unfocused', description: 'Feeling confused. Unable to focus.', color: '#94A3B8', gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)', glowColor: 'rgba(148,163,184,0.25)', quote: 'Clarity comes when you stop forcing and start allowing.', recommendation: { action: '5-minute breathing exercise.', description: 'Clear mental fog with slow, intentional breath.' } },
  'heavy-rain': { id: 'heavy-rain', label: 'Heavy Rain', icon: '🌧', tagline: 'Overwhelmed & Sad', description: 'Feeling emotionally overwhelmed. Sad. Drained.', color: '#60A5FA', gradient: 'linear-gradient(135deg, #0C4A6E 0%, #1E40AF 50%, #4C1D95 100%)', glowColor: 'rgba(96,165,250,0.35)', quote: 'After every storm, there is always a rainbow waiting.', recommendation: { action: 'Join a supportive community.', description: "You don't have to carry this alone." } },
  'storm': { id: 'storm', label: 'Storm', icon: '⚡', tagline: 'Anxious & Overthinking', description: 'Feeling anxious. Panicking. Overthinking.', color: '#818CF8', gradient: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #6D28D9 100%)', glowColor: 'rgba(129,140,248,0.35)', quote: "You're stronger than today feels.", recommendation: { action: 'Try Box Breathing.', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat.' } },
};

export const WEATHER_LIST = Object.values(WEATHERS);

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// 15 floating particles with random positions
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  top: `${5 + Math.random() * 90}%`,
  left: `${2 + Math.random() * 96}%`,
  size: 3 + Math.random() * 5,
  opacity: 0.15 + Math.random() * 0.35,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 3,
}));

export default function EmotionWeatherModal() {
  const { user } = useAuthStore();
  const { submitWeather, dismissModal } = useWeatherStore();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.name?.split(' ')[0] || 'Beautiful Soul';
  const selectedWeather = selected ? WEATHERS[selected] : null;

  function handleSelect(id) {
    setSelected(id);
  }

  function handleContinue() {
    if (!selected) return;
    const userId = user?.id || user?.user_id || 1;
    submitWeather(selected, userId);
    setSubmitted(true);
    // Brief delay then close
    setTimeout(() => {
      dismissModal();
    }, 300);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label="Daily emotional weather check-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'radial-gradient(ellipse at 50% 0%, #1a0533 0%, #080812 60%, #050308 100%)',
        overflowY: 'auto',
      }}
    >
      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{ y: [-12, 12, -12] }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(168,85,247,0.9)',
            opacity: p.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Additional gold particles */}
      {Array.from({ length: 6 }, (_, i) => ({
        id: `g-${i}`,
        top: `${10 + i * 15}%`,
        left: `${5 + i * 16}%`,
        size: 2 + Math.random() * 3,
      })).map((p) => (
        <motion.div
          key={p.id}
          aria-hidden="true"
          animate={{ y: [-8, 8, -8], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 5 + Math.random() * 3,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#F59E0B',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.1 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 680,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 'clamp(28px, 5vw, 48px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Skip button */}
        <button
          onClick={dismissModal}
          aria-label="Skip check-in"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 13,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          Skip for now
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 32, textAlign: 'center' }}
        >
          {/* Soul icon */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ fontSize: 36, marginBottom: 12 }}
            aria-hidden="true"
          >
            🌙
          </motion.div>

          <h2 style={{
            margin: '0 0 6px',
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            {greeting}, {firstName}
          </h2>

          <p style={{
            margin: '0 0 16px',
            fontSize: 14,
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 500,
          }}>
            Before we begin...
          </p>

          {/* Divider */}
          <div style={{
            width: 48,
            height: 2,
            background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
            borderRadius: 2,
            margin: '0 auto 20px',
          }} />

          <h3 style={{
            margin: 0,
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.01em',
          }}>
            How does your mind feel today?
          </h3>
        </motion.div>

        {/* Weather Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            role="radiogroup"
            aria-label="Select your emotional weather"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 0,
            }}
          >
            <style>{`
              @media (max-width: 480px) {
                .weather-grid { grid-template-columns: repeat(2, 1fr) !important; }
              }
            `}</style>
            {WEATHER_LIST.map((w) => (
              <WeatherCard
                key={w.id}
                weather={w}
                selected={selected === w.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </motion.div>

        {/* Recommendation + Continue */}
        <AnimatePresence>
          {selectedWeather && (
            <WeatherRecommendation
              weather={selectedWeather}
              onContinue={handleContinue}
            />
          )}
        </AnimatePresence>

        {/* Footer note */}
        {!selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              margin: '20px 0 0',
              textAlign: 'center',
              fontSize: 12,
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Your emotional check-in is private and sacred. No judgment here.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
