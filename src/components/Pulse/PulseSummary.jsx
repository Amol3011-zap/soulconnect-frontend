import React from 'react';
import { motion } from 'motion/react';
import { PROBLEMS, SUPPORT_OPTIONS } from '../../data/pulseExperienceData';

const P = '#7C3AED';

function PulseSummary({ problems, support, onContinue }) {
  const problemLabels = PROBLEMS.filter((p) => problems.includes(p.id));
  const supportLabel = SUPPORT_OPTIONS.find((s) => s.id === support);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      {/* Summary card */}
      <motion.div
        style={{
          position: 'relative',
          padding: '48px 40px',
          borderRadius: '24px',
          border: `1px solid rgba(168,85,247,0.2)`,
          backgroundColor: 'rgba(34,18,73,0.72)',
          backdropFilter: 'blur(24px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.15)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Problems section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 16px 0',
              }}
            >
              You told us you are dealing with
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              {problemLabels.map((problem, i) => (
                <motion.span
                  key={problem.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(124,58,237,0.2)',
                    border: `1px solid rgba(124,58,237,0.4)`,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                  }}
                >
                  {problem.icon} {problem.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Support section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 16px 0',
              }}
            >
              and
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(124,58,237,0.2)',
                  border: `1px solid rgba(124,58,237,0.4)`,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                {supportLabel.icon} {supportLabel.label}
              </span>
            </div>
          </motion.div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.3) 50%, transparent 100%)',
            }}
          />

          {/* CTA text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#E2DEFF',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Let us see how many people are going through something similar.
          </motion.p>
        </div>
      </motion.div>

      {/* Continue button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.button
          onClick={onContinue}
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
          Show Me The Global Pulse →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PulseSummary;
