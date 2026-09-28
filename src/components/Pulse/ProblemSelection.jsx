import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Timer, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PROBLEMS } from '../../data/pulseExperienceData';
import {
  P, DARK, NAVY_SOFT, MUTED, GOLD_TXT, SF, TINTS, tintedBorder, problemIcon,
} from './pulseTheme';

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
        gap: '32px',
        width: '100%',
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: SF,
            fontSize: 'clamp(30px, 4.6vw, 48px)',
            fontWeight: 700,
            color: DARK,
            margin: '0 0 14px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          What are you dealing with <span style={{ color: P }}>right now?</span>
        </h1>
        <p
          style={{
            fontSize: '16.5px',
            fontWeight: 400,
            color: NAVY_SOFT,
            margin: 0,
            lineHeight: 1.65,
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
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: -8,
        }}
      >
        {[
          { Icon: Lock, text: 'No name or email required', t: TINTS[0] },
          { Icon: Timer, text: '60 seconds', t: TINTS[1] },
          { Icon: Sparkles, text: 'No account required', t: TINTS[3] },
        ].map(({ Icon, text, t }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: t.fg,
              padding: '7px 14px',
              borderRadius: '999px',
              backgroundColor: t.bg,
            }}
          >
            <Icon size={14} strokeWidth={1.9} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Selection counter */}
      <div style={{ textAlign: 'center' }}>
        <p
          aria-live="polite"
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: GOLD_TXT,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
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
        className="pl-grid"
        style={{
          display: 'grid',
          gap: '14px',
          width: '100%',
        }}
      >
        {PROBLEMS.map((problem, i) => {
          const isSelected = selected.includes(problem.id);
          const canSelect = !isSelected && selected.length >= MAX_SELECTIONS;
          const t = TINTS[i % TINTS.length];
          const Icon = problemIcon(problem.id);

          return (
            <motion.button
              key={problem.id}
              className="pl-card"
              onClick={() => handleToggle(problem.id)}
              disabled={canSelect}
              aria-pressed={isSelected}
              whileHover={!canSelect ? { y: -3 } : {}}
              whileTap={!canSelect ? { scale: 0.98 } : {}}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '24px 14px',
                minHeight: '148px',
                borderRadius: '18px',
                ...(isSelected
                  ? {
                      border: '2px solid transparent',
                      background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF 100%) padding-box, linear-gradient(150deg, ${P} 0%, #A992DA 55%, ${t.edge[0]} 100%) border-box`,
                      boxShadow: '0 0 0 4px rgba(107,79,160,0.10), 0 12px 28px rgba(107,79,160,0.14)',
                    }
                  : {
                      ...tintedBorder(t, '55%'),
                      boxShadow: '0 2px 12px rgba(34,27,58,0.04)',
                    }),
                cursor: canSelect ? 'not-allowed' : 'pointer',
                font: 'inherit',
                WebkitAppearance: 'none',
                appearance: 'none',
                transition: 'box-shadow 0.2s ease-out, opacity 0.2s',
                opacity: canSelect ? 0.45 : 1,
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: isSelected ? P : t.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background .2s',
                }}
              >
                <Icon size={23} strokeWidth={1.7} color={isSelected ? '#FFFFFF' : t.fg} />
              </span>
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: DARK,
                  textAlign: 'center',
                  lineHeight: 1.35,
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
                    top: '10px',
                    right: '10px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: P,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={13} strokeWidth={3} color="#FFFFFF" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: '8px' }}>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="pl-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 40px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: selected.length > 0 ? P : '#CFC3E6',
            color: '#FFFFFF',
            fontSize: '15.5px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selected.length > 0 ? '0 4px 14px rgba(107,79,160,0.22)' : 'none',
          }}
        >
          Continue
          <ArrowRight size={17} strokeWidth={2} />
        </button>
        {selected.length === 0 && (
          <span style={{ fontSize: 12.5, color: MUTED }}>Pick at least one to continue</span>
        )}
      </div>
    </motion.div>
  );
}

export default ProblemSelection;
