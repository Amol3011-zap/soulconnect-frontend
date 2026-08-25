import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROBLEMS } from '../../data/pulseExperienceData';

const P = '#7C3AED';
const LAV = '#A78BFA';
const MAX_SELECTIONS = 2;

function ProblemSelection({ onSelect }) {
  const [selected, setSelected] = useState([]);

  const handleToggle = (problemId) => {
    setSelected((prev) => {
      if (prev.includes(problemId)) {
        return prev.filter((id) => id !== problemId);
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, problemId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onSelect(selected);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
          }}
        >
          What are you dealing with right now?
        </h1>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          You do not have to explain everything. Just choose what feels closest.
        </p>
      </div>

      {/* Trust badges */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: '🔒', text: 'No name or email required' },
          { icon: '⏱️', text: '60 seconds' },
          { icon: '✨', text: 'No account required' },
        ].map((badge, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(168,85,247,0.2)',
              backgroundColor: 'rgba(168,85,247,0.05)',
            }}
          >
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>

      {/* Selection counter */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
          }}
        >
          {selected.length === 0
            ? `Choose up to ${MAX_SELECTIONS}`
            : `${selected.length} of ${MAX_SELECTIONS} selected`}
        </p>
      </div>

      {/* Problem cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          width: '100%',
        }}
      >
        {PROBLEMS.map((problem) => {
          const isSelected = selected.includes(problem.id);
          const canSelect = !isSelected && selected.length >= MAX_SELECTIONS;

          return (
            <motion.button
              key={problem.id}
              onClick={() => handleToggle(problem.id)}
              disabled={canSelect}
              whileHover={!canSelect ? { scale: 1.03, y: -2 } : {}}
              whileTap={!canSelect ? { scale: 0.98 } : {}}
              animate={{
                boxShadow: isSelected
                  ? `0 0 32px rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.2)`
                  : `0 8px 32px rgba(0,0,0,0.4)`,
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '28px 16px',
                minHeight: '160px',
                borderRadius: '18px',
                border: isSelected
                  ? `2px solid ${P}`
                  : '1px solid rgba(168,85,247,0.15)',
                backgroundColor: 'rgba(34,18,73,0.72)',
                backdropFilter: 'blur(24px)',
                cursor: canSelect ? 'not-allowed' : 'pointer',
                font: 'inherit',
                WebkitAppearance: 'none',
                appearance: 'none',
                transition: 'all 0.2s ease-out',
                opacity: canSelect ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: '36px', lineHeight: 1 }}>
                {problem.icon}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {problem.label}
              </span>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: P,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <motion.button
          onClick={handleContinue}
          disabled={selected.length === 0}
          whileHover={selected.length > 0 ? { scale: 1.05 } : {}}
          whileTap={selected.length > 0 ? { scale: 0.95 } : {}}
          style={{
            padding: '14px 44px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: selected.length > 0 ? P : 'rgba(124,58,237,0.3)',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 600,
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selected.length > 0 ? `0 8px 24px rgba(124,58,237,0.4)` : 'none',
            transition: 'all 0.2s ease-out',
            opacity: selected.length > 0 ? 1 : 0.6,
          }}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProblemSelection;
