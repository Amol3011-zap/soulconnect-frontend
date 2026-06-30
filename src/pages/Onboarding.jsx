import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';

const P = '#6D4AFF';
const LAV = '#A78BFA';
const GLD = '#F5B841';

const PROBLEM_OPTIONS = [
  { id: 'anxiety', emoji: '🧠', label: 'Anxiety' },
  { id: 'loneliness', emoji: '😔', label: 'Loneliness' },
  { id: 'depression', emoji: '🌧', label: 'Depression' },
  { id: 'stress', emoji: '🔥', label: 'Stress' },
  { id: 'burnout', emoji: '💼', label: 'Burnout' },
  { id: 'overthinking', emoji: '💭', label: 'Overthinking' },
  { id: 'relationship_challenges', emoji: '❤️', label: 'Relationship Challenges' },
  { id: 'grief', emoji: '🕊', label: 'Grief' },
  { id: 'addiction_recovery', emoji: '🌱', label: 'Addiction Recovery' },
  { id: 'panic_attacks', emoji: '⚡', label: 'Panic Attacks' },
  { id: 'social_anxiety', emoji: '🙋', label: 'Social Anxiety' },
  { id: 'low_self_esteem', emoji: '✨', label: 'Low Self-Esteem' },
  { id: 'career_pressure', emoji: '📈', label: 'Career Pressure' },
  { id: 'sleep_problems', emoji: '😴', label: 'Sleep Problems' },
  { id: 'family_issues', emoji: '👨‍👩‍👧', label: 'Family Issues' },
  { id: 'financial_stress', emoji: '💸', label: 'Financial Stress' },
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
  { id: 'meditation_partner', emoji: '🧘', label: 'Meditation partner' },
  { id: 'accountability', emoji: '🎯', label: 'Daily accountability' },
  { id: 'encouragement', emoji: '💡', label: 'Encouragement' },
  { id: 'emotional_support', emoji: '❤️', label: 'Emotional support' },
  { id: 'not_alone', emoji: '🌸', label: 'Just knowing I\'m not alone' },
];

const LANGUAGE_OPTIONS = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu',
  'Kannada', 'Gujarati', 'Punjabi', 'Bengali', 'Malayalam',
];

const AVAILABILITY_OPTIONS = [
  { id: 'morning', emoji: '🌅', label: 'Morning' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon' },
  { id: 'evening', emoji: '🌇', label: 'Evening' },
  { id: 'night', emoji: '🌙', label: 'Night' },
];

const CITIES = [
  'Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Delhi',
  'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(1);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  const handleNext = async () => {
    if (step === 9) {
      await completeOnboarding();
    } else {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setCompleting(true);
    try {
      const response = await fetch('http://localhost:8000/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          problems: data.problems,
          intensity: data.intensity,
          needs: data.needs,
          display_name: data.display_name,
          language: data.language,
          availability: data.availability,
          city: data.city,
          notifications_enabled: data.notifications_enabled,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to complete onboarding');
      }

      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setCompleting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return data.problems.length > 0;
      case 3:
        return data.intensity !== null;
      case 4:
        return data.needs.length > 0;
      case 5:
        return data.display_name.length >= 3 && data.display_name.length <= 20 && /^[a-zA-Z0-9_]+$/.test(data.display_name);
      case 6:
        return data.language !== '';
      case 7:
        return data.availability.length > 0;
      case 8:
        return data.city !== '';
      case 9:
        return true;
      default:
        return true;
    }
  };

  if (completing) {
    return (
      <CompletingScreen />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #140028 0%, #1e0f47 40%, #2d1b69 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background elements */}
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(109,74,255,0.15) 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        style={{
          position: 'fixed',
          bottom: '10%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 600 }}>
        {/* Progress bar */}
        <motion.div
          style={{
            height: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            marginBottom: 40,
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${(step / 9) * 100}%` }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${P}, ${LAV})`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Header */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40, textAlign: 'center' }}
        >
          <div style={{ fontSize: 56, marginBottom: 12 }}>
            {step === 1 && '🌸'}
            {step === 2 && '🧠'}
            {step === 3 && '📊'}
            {step === 4 && '❤️'}
            {step === 5 && '✨'}
            {step === 6 && '🌍'}
            {step === 7 && '⏰'}
            {step === 8 && '📍'}
            {step === 9 && '🔔'}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
            {step === 1 && 'Welcome to SoulConnect'}
            {step === 2 && 'What has been on your mind lately?'}
            {step === 3 && 'How intense does it feel today?'}
            {step === 4 && 'What are you hoping to find here?'}
            {step === 5 && 'How would you like the community to know you?'}
            {step === 6 && 'Which language are you most comfortable chatting in?'}
            {step === 7 && 'When do you usually have time to connect?'}
            {step === 8 && 'Which city are you in?'}
            {step === 9 && 'Would you like to receive gentle daily reminders?'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(184,180,216,0.65)', margin: 0 }}>
            Step {step} of 9
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 && <Step1 />}
          {step === 2 && (
            <Step2
              value={data.problems}
              onChange={(problems) => setData({ ...data, problems })}
            />
          )}
          {step === 3 && (
            <Step3
              value={data.intensity}
              onChange={(intensity) => setData({ ...data, intensity })}
            />
          )}
          {step === 4 && (
            <Step4
              value={data.needs}
              onChange={(needs) => setData({ ...data, needs })}
            />
          )}
          {step === 5 && (
            <Step5
              value={data.display_name}
              onChange={(display_name) => setData({ ...data, display_name })}
              error={error}
              setError={setError}
            />
          )}
          {step === 6 && (
            <Step6
              value={data.language}
              onChange={(language) => setData({ ...data, language })}
            />
          )}
          {step === 7 && (
            <Step7
              value={data.availability}
              onChange={(availability) => setData({ ...data, availability })}
            />
          )}
          {step === 8 && (
            <Step8
              value={data.city}
              onChange={(city) => setData({ ...data, city })}
            />
          )}
          {step === 9 && (
            <Step9
              value={data.notifications_enabled}
              onChange={(notifications_enabled) =>
                setData({ ...data, notifications_enabled })
              }
            />
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && step !== 5 && (
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
              marginTop: 20,
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 40,
            justifyContent: step === 1 ? 'center' : 'space-between',
          }}
        >
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
                border: '1px solid rgba(168,85,247,0.3)',
                background: 'rgba(139,92,246,0.1)',
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

          {loading ? (
            <motion.button
              disabled
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 12,
                background: `linear-gradient(135deg, ${P}, ${LAV})`,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'not-allowed',
                fontFamily: 'inherit',
                opacity: 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                }}
              />
              Processing...
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: isStepValid() ? 1.05 : 1 }}
              whileTap={{ scale: isStepValid() ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!isStepValid()}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: 12,
                border: 'none',
                background: isStepValid()
                  ? `linear-gradient(135deg, ${P}, ${LAV})`
                  : 'rgba(139,92,246,0.2)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: isStepValid() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {step === 9 ? 'Complete' : 'Continue'} →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function CompletingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #140028 0%, #1e0f47 40%, #2d1b69 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden',
    }}>
      <motion.div
        style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            fontSize: 120,
            marginBottom: 32,
          }}
        >
          🌸
        </motion.div>

        <h1 style={{
          fontSize: 40,
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 16px',
        }}>
          You're all set
        </h1>

        <p style={{
          fontSize: 16,
          color: 'rgba(184,180,216,0.7)',
          margin: '0 0 40px',
          maxWidth: 400,
          lineHeight: 1.7,
        }}>
          We're finding people who understand what you're going through.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {['Finding your community...', 'Matching people with similar experiences...', 'Preparing your dashboard...'].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: 'rgba(184,180,216,0.6)',
                fontSize: 14,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#A78BFA',
                }}
              />
              {text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function Step1() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20,
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 16, color: 'rgba(184,180,216,0.8)', lineHeight: 1.8, margin: 0 }}>
        We're really glad you're here.
        <br />
        <br />
        Before we introduce you to the community, we'd love to understand you a
        little better so we can connect you with people who genuinely understand
        your journey.
        <br />
        <br />
        <strong>This takes less than a minute.</strong>
      </p>
    </motion.div>
  );
}

function Step2({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}
    >
      {PROBLEM_OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (value.includes(opt.id)) {
              onChange(value.filter((p) => p !== opt.id));
            } else {
              onChange([...value, opt.id]);
            }
          }}
          style={{
            padding: '16px',
            borderRadius: 14,
            border: value.includes(opt.id) ? `2px solid #6D4AFF` : '1px solid rgba(168,85,247,0.2)',
            background: value.includes(opt.id)
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 24 }}>{opt.emoji}</span>
          <span>{opt.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function Step3({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {INTENSITY_OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(opt.id)}
          style={{
            padding: '16px',
            borderRadius: 14,
            border: value === opt.id ? `2px solid ${opt.color}` : '1px solid rgba(168,85,247,0.2)',
            background: value === opt.id
              ? `${opt.color}22`
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 28 }}>{opt.emoji}</span>
          <div>
            <div style={{ fontWeight: 600 }}>Level {opt.id}</div>
            <div style={{ fontSize: 12, color: 'rgba(184,180,216,0.6)' }}>{opt.title}</div>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

function Step4({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}
    >
      {NEEDS_OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (value.includes(opt.id)) {
              onChange(value.filter((n) => n !== opt.id));
            } else {
              onChange([...value, opt.id]);
            }
          }}
          style={{
            padding: '16px',
            borderRadius: 14,
            border: value.includes(opt.id) ? `2px solid #6D4AFF` : '1px solid rgba(168,85,247,0.2)',
            background: value.includes(opt.id)
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 24 }}>{opt.emoji}</span>
          <span>{opt.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function Step5({ value, onChange, error, setError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <p style={{ fontSize: 13, color: 'rgba(184,180,216,0.7)', margin: '0 0 8px' }}>
        You don't have to use your real name.
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setError('');
        }}
        placeholder="Example: PurpleLotus, HopefulSoul"
        style={{
          padding: '12px 16px',
          borderRadius: 12,
          border: error && value ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(168,85,247,0.2)',
          background: error && value ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139,92,246,0.08)',
          color: '#fff',
          fontSize: 14,
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(168,85,247,0.6)';
          e.target.style.background = 'rgba(139,92,246,0.12)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error && value ? 'rgba(239, 68, 68, 0.5)' : 'rgba(168,85,247,0.2)';
          e.target.style.background = error && value ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139,92,246,0.08)';
        }}
      />
      {error && value && (
        <p style={{ fontSize: 12, color: '#FCA5A5', margin: '0' }}>{error}</p>
      )}
      <p style={{ fontSize: 12, color: 'rgba(184,180,216,0.5)', margin: '8px 0 0' }}>
        3–20 characters, alphanumeric only
      </p>
    </motion.div>
  );
}

function Step6({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}
    >
      {LANGUAGE_OPTIONS.map((lang) => (
        <motion.button
          key={lang}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(lang)}
          style={{
            padding: '14px',
            borderRadius: 12,
            border: value === lang ? `2px solid #6D4AFF` : '1px solid rgba(168,85,247,0.2)',
            background: value === lang
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {lang}
        </motion.button>
      ))}
    </motion.div>
  );
}

function Step7({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}
    >
      {AVAILABILITY_OPTIONS.map((opt) => (
        <motion.button
          key={opt.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (value.includes(opt.id)) {
              onChange(value.filter((a) => a !== opt.id));
            } else {
              onChange([...value, opt.id]);
            }
          }}
          style={{
            padding: '16px',
            borderRadius: 14,
            border: value.includes(opt.id) ? `2px solid #6D4AFF` : '1px solid rgba(168,85,247,0.2)',
            background: value.includes(opt.id)
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 24 }}>{opt.emoji}</span>
          <span>{opt.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function Step8({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid rgba(168,85,247,0.2)',
          background: 'rgba(139,92,246,0.08)',
          color: '#E2DEFF',
          fontSize: 14,
          fontFamily: 'inherit',
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
        }}
      >
        <option value="">Select your city...</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

function Step9({ value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {[
        { label: 'Yes, I\'d like reminders', val: true },
        { label: 'No thanks', val: false },
      ].map((opt) => (
        <motion.button
          key={String(opt.val)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(opt.val)}
          style={{
            padding: '16px',
            borderRadius: 14,
            border: value === opt.val ? `2px solid #6D4AFF` : '1px solid rgba(168,85,247,0.2)',
            background: value === opt.val
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.08)',
            color: '#E2DEFF',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
