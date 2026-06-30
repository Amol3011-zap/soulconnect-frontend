import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MOOD_CONFIG = {
  'clear-sky': {
    emoji: '☀️',
    label: 'Clear',
    affirmation: 'It\'s good to see brighter skies today.',
    hasConfetti: true,
    bgGradient: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 25%, #FCD34D 50%, #FBBF24 75%, #F59E0B 100%)',
    particles: 'dust',
  },
  'hope': {
    emoji: '🌤',
    label: 'Hope',
    affirmation: 'Hope begins with one small step.',
    hasConfetti: true,
    bgGradient: 'linear-gradient(180deg, #DDD6FE 0%, #E9D5FF 20%, #F3E8FF 40%, #FED7AA 60%, #FECACA 100%)',
    particles: 'light',
  },
  'blooming': {
    emoji: '🌸',
    label: 'Blooming',
    affirmation: 'Growth isn\'t always visible, but it\'s happening.',
    hasConfetti: true,
    bgGradient: 'linear-gradient(180deg, #FDF2F8 0%, #FAE8F3 30%, #F5D5E8 60%, #E8B4DB 85%, #D8A8D0 100%)',
    particles: 'petals',
  },
  'fog': {
    emoji: '🌫',
    label: 'Fog',
    affirmation: 'It\'s okay if things aren\'t clear today.',
    hasConfetti: false,
    bgGradient: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 30%, #9CA3AF 60%, #6B7280 85%, #4B5563 100%)',
    particles: 'fog',
  },
  'heavy-rain': {
    emoji: '🌧',
    label: 'Heavy Rain',
    affirmation: 'Even storms eventually pass.',
    hasConfetti: false,
    bgGradient: 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 25%, #3B82F6 50%, #1E40AF 75%, #0F172A 100%)',
    particles: 'rain',
  },
  'storm': {
    emoji: '⚡',
    label: 'Storm',
    affirmation: 'You don\'t have to face this storm alone.',
    hasConfetti: false,
    bgGradient: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 30%, #4C1D95 60%, #2E1065 85%, #1A0F3E 100%)',
    particles: 'storm',
  },
};

/* ───────────────────────────────────────────────────────────────
   DUST PARTICLES (for Clear)
─────────────────────────────────────────────────────────────── */
function DustParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            zIndex: 0,
          }}
          animate={{ y: '120%', opacity: [0.4, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   LIGHT PARTICLES (for Hope)
─────────────────────────────────────────────────────────────── */
function LightParticles() {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2.5,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            zIndex: 0,
          }}
          animate={{ y: '120%', opacity: [0.3, 0.7, 0], x: Math.sin(Math.random() * 10) * 20 }}
          transition={{
            duration: 4,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   PETAL PARTICLES (for Blooming)
─────────────────────────────────────────────────────────────── */
function PetalParticles() {
  const petals = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10%',
            width: 5,
            height: 5,
            borderRadius: '50% 0',
            background: 'rgba(244, 114, 182, 0.4)',
            zIndex: 0,
          }}
          animate={{
            y: '120%',
            rotate: 360,
            opacity: [0.5, 0.7, 0],
            x: Math.cos(Math.random() * Math.PI) * 40,
          }}
          transition={{
            duration: 5,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Lotus watermark */}
      <motion.div
        style={{
          position: 'absolute',
          right: '10%',
          top: '15%',
          fontSize: 80,
          opacity: 0.08,
          zIndex: 0,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        🪷
      </motion.div>
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   FOG EFFECT
─────────────────────────────────────────────────────────────── */
function FogEffect() {
  return (
    <>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 40%)',
          zIndex: 0,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 80% 60%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          zIndex: 0,
        }}
        animate={{ opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   RAIN EFFECT
─────────────────────────────────────────────────────────────── */
function RainEffect() {
  const raindrops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: 1.5 + Math.random() * 1,
    delay: Math.random() * 1.5,
  }));

  return (
    <>
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          style={{
            position: 'absolute',
            left: drop.left,
            top: '-10%',
            width: 2,
            height: 10,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            zIndex: 0,
          }}
          animate={{ y: '110%', opacity: [0.4, 0.6, 0] }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        />
      ))}
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   STORM EFFECT (clouds + occasional lightning)
─────────────────────────────────────────────────────────────── */
function StormEffect() {
  const [showLightning, setShowLightning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 150);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Moving clouds */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-20%',
          width: 300,
          height: 100,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
        animate={{ x: ['-20%', '120%'], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          left: '20%',
          width: 250,
          height: 80,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
        animate={{ x: ['20%', '-80%'], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 15, repeat: Infinity, delay: 1 }}
      />

      {/* Lightning */}
      <AnimatePresence>
        {showLightning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.15)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   CONFETTI
─────────────────────────────────────────────────────────────── */
function Confetti() {
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.3,
    rotation: Math.random() * 360,
  }));

  return (
    <>
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          style={{
            position: 'absolute',
            left: c.left,
            top: '50%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: ['#FCD34D', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'][Math.floor(Math.random() * 5)],
            zIndex: 10,
            pointerEvents: 'none',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: Math.random() < 0.5 ? '-200px' : '-300px',
            opacity: 0,
            rotate: c.rotation + 360,
          }}
          transition={{
            duration: 2.5 + Math.random() * 1,
            delay: c.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   MAIN WIDGET
─────────────────────────────────────────────────────────────── */
export default function SoulClimateWidget({
  selectedMood,
  onMoodSelect,
  onCheckIn,
  isCheckingIn = false,
  isCheckedIn = false,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(isCheckedIn);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentMood = MOOD_CONFIG[selectedMood];
  const moodOptions = Object.entries(MOOD_CONFIG).map(([id, config]) => ({
    id,
    ...config,
  }));

  const handleCheckInClick = async () => {
    if (isCheckedIn) return;

    setIsAnimating(true);
    await onCheckIn();

    setTimeout(() => {
      setIsAnimating(false);
      setShowAffirmation(true);
      if (currentMood?.hasConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="soul-climate-widget"
      style={{
        background: 'linear-gradient(145deg, rgba(26,10,62,0.95) 0%, rgba(45,18,96,0.9) 50%, rgba(20,8,52,0.95) 100%)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 28,
        padding: '26px 32px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 48,
      }}
    >
      {/* ── BACKGROUND ANIMATION (clipped inside card) ── */}
      {selectedMood && (
        <motion.div
          key={selectedMood}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: currentMood.bgGradient,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Mood-specific particles */}
          {currentMood.particles === 'dust' && <DustParticles />}
          {currentMood.particles === 'light' && <LightParticles />}
          {currentMood.particles === 'petals' && <PetalParticles />}
          {currentMood.particles === 'fog' && <FogEffect />}
          {currentMood.particles === 'rain' && <RainEffect />}
          {currentMood.particles === 'storm' && <StormEffect />}

          {/* Confetti */}
          <AnimatePresence>
            {showConfetti && <Confetti />}
          </AnimatePresence>

          {/* Overlay to darken for readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.25)',
              zIndex: 5,
            }}
          />
        </motion.div>
      )}

      {/* ── TOP SHINE (above background) ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
          zIndex: 6,
        }}
      />

      {/* ── LEFT: TITLE + BUTTON ── */}
      <motion.div
        style={{ zIndex: 10, flexShrink: 0, position: 'relative' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(196,181,253,0.5)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          SOUL CLIMATE ⓘ
        </div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 8px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          How is your mind<br />
          feeling today?
        </h2>
        <p
          style={{
            fontSize: 13,
            color: 'rgba(184,180,216,0.65)',
            margin: '0 0 20px',
            lineHeight: 1.6,
          }}
        >
          Your check-in helps us support you better.
        </p>

        {/* CHECK-IN BUTTON */}
        <motion.button
          whileTap={{ scale: isCheckedIn ? 1 : 0.97 }}
          whileHover={{
            boxShadow: isCheckedIn
              ? '0 4px 12px rgba(107,114,128,0.3)'
              : '0 6px 28px rgba(124,58,237,0.55)',
          }}
          onClick={handleCheckInClick}
          disabled={isCheckedIn}
          style={{
            background: isCheckedIn
              ? 'rgba(107,114,128,0.3)'
              : 'linear-gradient(135deg, #7C3AED, #A855F7)',
            border: isCheckedIn ? '1px solid rgba(156,163,175,0.3)' : 'none',
            borderRadius: 14,
            color: isCheckedIn ? '#9CA3AF' : '#fff',
            cursor: isCheckedIn ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 13,
            padding: '10px 28px',
            boxShadow: isCheckedIn
              ? '0 4px 12px rgba(107,114,128,0.3)'
              : '0 4px 20px rgba(124,58,237,0.45)',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            minWidth: 160,
          }}
        >
          {isAnimating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
              }}
            />
          )}
          {!isAnimating && (
            <>
              {isCheckedIn ? '✓' : ''}
              {isCheckedIn ? 'Checked In Today' : 'Check In Now'}
            </>
          )}
        </motion.button>
      </motion.div>

      {/* ── DIVIDER ── */}
      <div
        style={{
          width: 1,
          alignSelf: 'stretch',
          background: 'rgba(168,85,247,0.15)',
          flexShrink: 0,
          zIndex: 10,
        }}
      />

      {/* ── RIGHT: MOOD SELECTION (only show if not checked in) ── */}
      {!isCheckedIn ? (
        <motion.div
          style={{ zIndex: 10, flex: 1, position: 'relative' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(196,181,253,0.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Select your mood
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {moodOptions.map((mood) => (
              <motion.button
                key={mood.id}
                onClick={() => onMoodSelect(mood.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background:
                    selectedMood === mood.id
                      ? 'rgba(139,92,246,0.32)'
                      : 'rgba(255,255,255,0.07)',
                  border:
                    selectedMood === mood.id
                      ? '1px solid rgba(168,85,247,0.6)'
                      : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '7px 16px',
                  fontSize: 12,
                  color: '#E2DEFF',
                  cursor: 'pointer',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  boxShadow:
                    selectedMood === mood.id
                      ? '0 0 14px rgba(124,58,237,0.35)'
                      : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 15 }}>{mood.emoji}</span>
                <span>{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        /* ── CHECKED IN STATE: Show mood + affirmation ── */
        <motion.div
          style={{ zIndex: 10, flex: 1, position: 'relative' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {currentMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Mood badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 24,
                  padding: '10px 20px',
                  width: 'fit-content',
                }}
              >
                <span style={{ fontSize: 24 }}>{currentMood.emoji}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#E2DEFF',
                  }}
                >
                  Your mood: {currentMood.label}
                </span>
              </div>

              {/* Affirmation */}
              {showAffirmation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14,
                    fontSize: 13,
                    color: '#E2DEFF',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  {currentMood.affirmation}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
