import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SUPPORT_OPTIONS } from '../../data/pulseExperienceData';

const P = '#7C3AED';
const LAV = '#A78BFA';

function SupportSelection({ onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    setTimeout(() => onSelect(id), 150);
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
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
          }}
        >
          What would feel most helpful right now?
        </h2>
        <p
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          You choose what happens next.
        </p>
      </div>

      {/* Support options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          width: '100%',
        }}
      >
        {SUPPORT_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: isSelected
                  ? `0 0 32px rgba(124,58,237,0.6), 0 8px 32px rgba(124,58,237,0.2)`
                  : `0 8px 32px rgba(0,0,0,0.4)`,
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px 24px',
                borderRadius: '16px',
                border: isSelected
                  ? `2px solid ${P}`
                  : '1px solid rgba(168,85,247,0.15)',
                backgroundColor: 'rgba(34,18,73,0.72)',
                backdropFilter: 'blur(24px)',
                cursor: 'pointer',
                font: 'inherit',
                WebkitAppearance: 'none',
                appearance: 'none',
                transition: 'all 0.2s ease-out',
                textAlign: 'left',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: '28px',
                  lineHeight: 1,
                  minWidth: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: '0 0 4px 0',
                  }}
                >
                  {option.label}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {option.description}
                </p>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
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
                    flexShrink: 0,
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Show Me button */}
      {selectedId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
        >
          <motion.button
            onClick={() => {
              // Already handled by onClick above
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '14px 44px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: P,
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 8px 24px rgba(124,58,237,0.4)`,
              transition: 'all 0.2s ease-out',
            }}
          >
            Show Me →
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SupportSelection;
