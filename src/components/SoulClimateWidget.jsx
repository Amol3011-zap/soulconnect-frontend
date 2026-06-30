import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';

const MOOD_CONFIG = {
  'clear-sky': {
    label: 'Clear',
    emoji: '☀️',
    affirmation: '☀️ It\'s good to see brighter skies today.',
    hasConfetti: true,
    background: {
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FEF3C7 100%)',
      particles: 'golden-rays',
    },
  },
  'hope': {
    label: 'Hope',
    emoji: '🌅',
    affirmation: '🌅 Hope begins with one small step.',
    hasConfetti: true,
    background: {
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 30%, #FCA5A5 100%)',
      particles: 'pink-sunrise',
    },
  },
  'blooming': {
    label: 'Blooming',
    emoji: '🌸',
    affirmation: '🌸 Growth isn\'t always visible, but it\'s happening.',
    hasConfetti: true,
    background: {
      gradient: 'linear-gradient(135deg, #A855F7 0%, #C084FC 50%, #E9D5FF 100%)',
      particles: 'petals',
    },
  },
  'fog': {
    label: 'Fog',
    emoji: '🌫️',
    affirmation: '🌫️ It\'s okay if things aren\'t clear today.',
    hasConfetti: false,
    background: {
      gradient: 'linear-gradient(135deg, #64748B 0%, #94A3B8 50%, #CBD5E1 100%)',
      particles: 'fog',
    },
  },
  'heavy-rain': {
    label: 'Heavy Rain',
    emoji: '🌧️',
    affirmation: '🌧️ Even storms eventually pass.',
    hasConfetti: false,
    background: {
      gradient: 'linear-gradient(135deg, #0C4A6E 0%, #1E40AF 50%, #60A5FA 100%)',
      particles: 'rain',
    },
  },
  'storm': {
    label: 'Storm',
    emoji: '⚡',
    affirmation: '⚡ You don\'t have to face this storm alone.',
    hasConfetti: false,
    background: {
      gradient: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #818CF8 100%)',
      particles: 'storm-particles',
    },
  },
};

const WEATHER_OPTIONS = Object.entries(MOOD_CONFIG).map(([id, config]) => ({
  id,
  emoji: config.emoji,
  label: config.label,
}));

// ─────────────────────────────────────────────────────────────────────────────
// MOOD BACKGROUND ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

function MoodBackground({ mood, isActive }) {
  if (!isActive) return null;

  const config = MOOD_CONFIG[mood];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: config.background.gradient,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Clear: Golden rays + dust particles */}
      {mood === 'clear-sky' && (
        <>
          {/* Light rays */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              style={{
                position: 'absolute',
                width: 2,
                height: '200%',
                background: 'rgba(255, 255, 255, 0.08)',
                left: `${20 + i * 30}%`,
                top: 0,
                transform: 'skewX(-15deg)',
              }}
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Dust particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              style={{
                position: 'absolute',
                width: 2 + Math.random() * 3,
                height: 2 + Math.random() * 3,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.6)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}

      {/* Hope: Soft floating particles */}
      {mood === 'hope' && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`hope-particle-${i}`}
              style={{
                position: 'absolute',
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 4,
                borderRadius: '50%',
                background: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.4})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}

      {/* Blooming: Floating petals + lotus */}
      {mood === 'blooming' && (
        <>
          {/* Lotus watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              right: -20,
              fontSize: 180,
              opacity: 0.08,
              pointerEvents: 'none',
            }}
          >
            🪷
          </div>
          {/* Petals */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`petal-${i}`}
              style={{
                position: 'absolute',
                fontSize: '1.2rem',
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 30 - 15, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            >
              🌸
            </motion.div>
          ))}
        </>
      )}

      {/* Fog: Slow moving fog layers */}
      {mood === 'fog' && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`fog-${i}`}
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,${0.15 - i * 0.04}), transparent)`,
                filter: 'blur(40px)',
              }}
              animate={{
                x: [0, 30, 0],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Heavy Rain: Rain particles + ripples */}
      {mood === 'heavy-rain' && (
        <>
          {/* Rain drops */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`raindrop-${i}`}
              style={{
                position: 'absolute',
                width: 2,
                height: 20,
                background: 'rgba(255, 255, 255, 0.4)',
                left: `${Math.random() * 100}%`,
                top: 0,
                borderRadius: 1,
              }}
              animate={{
                y: ['0%', '100%'],
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 1,
              }}
            />
          ))}
          {/* Water ripples */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              style={{
                position: 'absolute',
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                left: `${30 + i * 20}%`,
                bottom: 10,
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.6,
              }}
            />
          ))}
        </>
      )}

      {/* Storm: Cloud movement + occasional lightning */}
      {mood === 'storm' && (
        <>
          {/* Storm particles */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`storm-particle-${i}`}
              style={{
                position: 'absolute',
                width: 2,
                height: 2,
                background: 'rgba(255, 255, 255, 0.5)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [-10, 10, -10],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Occasional lightning */}
          <motion.div
            key="lightning"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0)',
              pointerEvents: 'none',
            }}
            animate={{
              background: [
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0.1)',
                'rgba(255, 255, 255, 0)',
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              times: [0, 0.7, 0.75, 1],
              ease: 'easeInOut',
            }}
          />
        </>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFETTI
// ─────────────────────────────────────────────────────────────────────────────

function Confetti() {
  const confetti = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <>
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          initial={{
            y: -10,
            x: c.left,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: 300,
            x: c.left + (Math.random() * 40 - 20),
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            fontSize: ['🎉', '✨', '🌟'][Math.floor(Math.random() * 3)],
            zIndex: 9998,
          }}
        >
          {['🎉', '✨', '🌟'][Math.floor(Math.random() * 3)]}
        </motion.div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN WIDGET
// ─────────────────────────────────────────────────────────────────────────────

export default function SoulClimateWidget() {
  const { user } = useAuthStore();
  const { submitWeather } = useWeatherStore();
  const userId = user?.id || user?.user_id || 1;

  const [selectedMood, setSelectedMood] = useState(null);
  const [checkedInMood, setCheckedInMood] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check localStorage for today's check-in
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('soulclimate_checkin');
    if (stored) {
      const { date, mood } = JSON.parse(stored);
      if (date === today) {
        setCheckedInMood(mood);
      } else {
        localStorage.removeItem('soulclimate_checkin');
      }
    }
  }, []);

  const handleMoodSelect = useCallback((moodId) => {
    if (checkedInMood) return;
    setSelectedMood(moodId);
  }, [checkedInMood]);

  const handleCheckIn = useCallback(async () => {
    if (!selectedMood || checkedInMood) return;

    setIsLoading(true);

    try {
      // Save to backend
      await submitWeather(selectedMood, userId);

      // Save to localStorage
      localStorage.setItem(
        'soulclimate_checkin',
        JSON.stringify({
          date: new Date().toDateString(),
          mood: selectedMood,
        })
      );

      // Animations
      setCheckedInMood(selectedMood);

      const config = MOOD_CONFIG[selectedMood];
      if (config.hasConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }

      setTimeout(() => {
        setShowAffirmation(true);
      }, 300);
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMood, checkedInMood, userId, submitWeather]);

  const isCheckedIn = !!checkedInMood;
  const displayMood = checkedInMood || selectedMood;
  const config = displayMood ? MOOD_CONFIG[displayMood] : null;

  const SECTION_LABEL = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(196,181,253,0.5)',
    marginBottom: 6,
  };

  const PURPLE_BTN = {
    background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontWeight: 600,
    cursor: isCheckedIn ? 'default' : 'pointer',
    opacity: isCheckedIn ? 0.7 : 1,
    transition: 'all 0.3s',
  };

  return (
    <>
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="soul-climate-card"
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
        {/* Animated mood background */}
        <AnimatePresence>
          {displayMood && (
            <MoodBackground mood={displayMood} isActive={true} />
          )}
        </AnimatePresence>

        {/* Floating particles (base layer) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <FloatingParticles count={12} />
        </div>

        {/* Top shine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)',
            zIndex: 1,
          }}
        />

        {/* Left: title + button */}
        <div style={{ zIndex: 1, flexShrink: 0 }}>
          <div style={SECTION_LABEL}>SOUL CLIMATE ⓘ</div>
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
            How is your mind<br />feeling today?
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(184,180,216,0.65)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Your check-in helps us support you better.
          </p>

          <motion.button
            whileTap={isCheckedIn ? {} : { scale: 0.97 }}
            whileHover={isCheckedIn ? {} : { boxShadow: '0 6px 28px rgba(124,58,237,0.55)' }}
            onClick={handleCheckIn}
            disabled={isCheckedIn || !selectedMood || isLoading}
            style={{
              ...PURPLE_BTN,
              fontSize: 13,
              padding: '10px 28px',
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
                {' '}Checking in...
              </>
            ) : isCheckedIn ? (
              `✓ ${new Date().toDateString() === localStorage.getItem('soulclimate_date') ? 'Checked In Today' : 'Checked In'}`
            ) : (
              'Check In Now'
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: 'rgba(168,85,247,0.15)',
            flexShrink: 0,
            zIndex: 1,
          }}
        />

        {/* Right: mood pills + affirmation */}
        <div style={{ zIndex: 1, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(196,181,253,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Select your mood
          </div>

          {/* Mood pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {WEATHER_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                onClick={() => handleMoodSelect(opt.id)}
                disabled={isCheckedIn}
                whileHover={!isCheckedIn ? { scale: 1.05 } : {}}
                whileTap={!isCheckedIn ? { scale: 0.95 } : {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background:
                    selectedMood === opt.id
                      ? 'rgba(139,92,246,0.32)'
                      : 'rgba(255,255,255,0.07)',
                  border:
                    selectedMood === opt.id
                      ? '1px solid rgba(168,85,247,0.6)'
                      : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '7px 16px',
                  fontSize: 12,
                  color: '#E2DEFF',
                  cursor: isCheckedIn ? 'default' : 'pointer',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  boxShadow:
                    selectedMood === opt.id
                      ? '0 0 14px rgba(124,58,237,0.35)'
                      : 'none',
                  transition: 'all 0.2s',
                  opacity: isCheckedIn && !checkedInMood ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 15 }}>{opt.emoji}</span>
                <span>{opt.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Affirmation */}
          <AnimatePresence>
            {showAffirmation && config && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6 }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: 12,
                  fontSize: 13,
                  color: '#E2DEFF',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                {config.affirmation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particleDrift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </>
  );
}

function FloatingParticles({ count = 14 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  if (isMobile) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1.5 + (i % 3) * 0.8,
    left: `${(i * 7.3 + 8) % 92}%`,
    top: `${(i * 11.7 + 4) % 88}%`,
    duration: 8 + (i % 6) * 1.8,
    delay: i * 0.55,
    opacity: 0.12 + (i % 4) * 0.05,
    color: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#F4C542' : '#C4B5FD',
  }));

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            left: p.left,
            top: p.top,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
