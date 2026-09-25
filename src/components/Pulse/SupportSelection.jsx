import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight } from 'lucide-react';
import { SUPPORT_OPTIONS } from '../../data/pulseExperienceData';
import { P, DARK, NAVY_SOFT, SF, TINTS, supportIcon } from './pulseTheme';

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
        gap: '36px',
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: SF,
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700,
            color: DARK,
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.18,
          }}
        >
          What would feel most <span style={{ color: P }}>helpful</span> right now?
        </h2>
        <p
          style={{
            fontSize: '16.5px',
            fontWeight: 400,
            color: NAVY_SOFT,
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
          gap: '12px',
          width: '100%',
        }}
      >
        {SUPPORT_OPTIONS.map((option, i) => {
          const isSelected = selectedId === option.id;
          const t = TINTS[i % TINTS.length];
          const Icon = supportIcon(option.id);

          return (
            <motion.button
              key={option.id}
              className="pl-card"
              onClick={() => handleSelect(option.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.99 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 20px',
                borderRadius: '18px',
                ...(isSelected
                  ? {
                      border: '2px solid transparent',
                      background: `linear-gradient(90deg, ${t.wash} 0%, #FFFFFF 100%) padding-box, linear-gradient(150deg, ${P} 0%, #A992DA 55%, ${t.edge[0]} 100%) border-box`,
                      boxShadow: '0 0 0 4px rgba(107,79,160,0.10), 0 12px 28px rgba(107,79,160,0.14)',
                    }
                  : {
                      border: '1.5px solid transparent',
                      background: `linear-gradient(90deg, ${t.wash} 0%, #FFFFFF 45%) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
                      boxShadow: '0 2px 12px rgba(34,27,58,0.04)',
                    }),
                cursor: 'pointer',
                font: 'inherit',
                WebkitAppearance: 'none',
                appearance: 'none',
                transition: 'box-shadow 0.2s ease-out',
                textAlign: 'left',
              }}
            >
              {/* Icon */}
              <span
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  borderRadius: 13,
                  background: isSelected ? P : t.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={22} strokeWidth={1.7} color={isSelected ? '#FFFFFF' : t.fg} />
              </span>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: DARK,
                    margin: '0 0 3px 0',
                  }}
                >
                  {option.label}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: NAVY_SOFT,
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  {option.description}
                </p>
              </div>

              {/* Checkmark / chevron */}
              {isSelected ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: P,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={14} strokeWidth={3} color="#FFFFFF" />
                </motion.div>
              ) : (
                <ChevronRight size={20} strokeWidth={1.8} color="#B8AACF" style={{ flexShrink: 0 }} />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SupportSelection;
