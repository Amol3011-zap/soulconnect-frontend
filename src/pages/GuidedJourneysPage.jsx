import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';

const JOURNEYS = [
  {
    id: 1,
    title: 'Anxiety Recovery Path',
    description: 'A 7-day guided journey to understand and manage anxiety',
    duration: '7 days',
    steps: 5,
    difficulty: 'Beginner',
    color: '#7C3AED',
  },
  {
    id: 2,
    title: 'Stress Management Basics',
    description: 'Learn evidence-based techniques to reduce daily stress',
    duration: '14 days',
    steps: 8,
    difficulty: 'Beginner',
    color: '#8B5CF6',
  },
  {
    id: 3,
    title: 'Resilience Building',
    description: 'Develop emotional resilience through structured practices',
    duration: '21 days',
    steps: 12,
    difficulty: 'Intermediate',
    color: '#A855F7',
  },
  {
    id: 4,
    title: 'Sleep & Recovery',
    description: 'Improve sleep quality and emotional recovery habits',
    duration: '14 days',
    steps: 7,
    difficulty: 'Beginner',
    color: '#D946EF',
  },
  {
    id: 5,
    title: 'Relationship Wellness',
    description: 'Build healthier, more fulfilling relationships',
    duration: '28 days',
    steps: 15,
    difficulty: 'Intermediate',
    color: '#EC4899',
  },
  {
    id: 6,
    title: 'Self-Compassion Journey',
    description: 'Learn to treat yourself with kindness and acceptance',
    duration: '21 days',
    steps: 10,
    difficulty: 'Beginner',
    color: '#F43F5E',
  },
];

export default function GuidedJourneysPage() {
  const navigate = useNavigate();
  const [startedJourneys, setStartedJourneys] = useState({});
  const [filter, setFilter] = useState('all');

  const handleStartJourney = (journey) => {
    setStartedJourneys((prev) => ({
      ...prev,
      [journey.id]: { progress: 0, startedAt: new Date() },
    }));
  };

  const handleContinueJourney = (journey) => {
    navigate(`/journeys/${journey.id}`);
  };

  const filteredJourneys = filter === 'all'
    ? JOURNEYS
    : JOURNEYS.filter((j) => j.difficulty === filter);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '64px 32px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#FFF', margin: '0 0 16px 0' }}>
            Guided Healing Journeys
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Follow structured paths to emotional wellness with daily practices and insights
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Filters */}
          <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  background: filter === f ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: filter === f ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: filter === f ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Journeys Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredJourneys.map((journey, index) => {
              const isStarted = startedJourneys[journey.id];
              return (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  style={{
                    padding: '28px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: isStarted ? '2px solid ' + journey.color : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                  onClick={() => isStarted ? handleContinueJourney(journey) : handleStartJourney(journey)}
                >
                  {/* Header */}
                  <div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: journey.color + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <MapPin size={24} style={{ color: journey.color }} />
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                      {journey.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      {journey.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        color: 'rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={14} />
                      {journey.duration}
                    </div>
                    <div
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '6px',
                        color: 'rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle size={14} />
                      {journey.steps} steps
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: journey.color + '20',
                      color: journey.color,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      width: 'fit-content',
                    }}
                  >
                    {journey.difficulty}
                  </div>

                  {/* Progress / CTA */}
                  {isStarted ? (
                    <div>
                      <div
                        style={{
                          height: '4px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          marginBottom: '8px',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${isStarted.progress * 10}%` }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, ' + journey.color + ' 0%, #A855F7 100%)',
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                        {Math.round(isStarted.progress * 10)}% complete
                      </p>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        marginTop: 'auto',
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, ' + journey.color + ', #A855F7)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                      onClick={() => handleStartJourney(journey)}
                    >
                      Start Journey
                      <ArrowRight size={14} />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
