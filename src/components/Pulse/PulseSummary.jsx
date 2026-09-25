import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PROBLEMS, SUPPORT_OPTIONS } from '../../data/pulseExperienceData';
import {
  P, DARK, GOLD_TXT, LILAC_LINE, SF, TINTS, GOLD_EDGE, problemIcon, supportIcon,
} from './pulseTheme';

const eyebrow = {
  fontSize: '12px',
  fontWeight: 700,
  color: GOLD_TXT,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  margin: '0 0 14px 0',
};

const chip = (t) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '9px 16px 9px 10px',
  borderRadius: '999px',
  backgroundColor: '#FFFFFF',
  border: `1.5px solid ${t.edge[1]}`,
  fontSize: '14px',
  fontWeight: 600,
  color: DARK,
  boxShadow: '0 2px 8px rgba(34,27,58,0.04)',
});

const chipIcon = (t) => ({
  width: 26,
  height: 26,
  borderRadius: '50%',
  background: t.bg,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function PulseSummary({ problems, support, onContinue }) {
  const problemLabels = PROBLEMS.filter((p) => problems.includes(p.id));
  const supportLabel = SUPPORT_OPTIONS.find((s) => s.id === support);
  const SupportIcon = supportIcon(support);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Summary card */}
      <motion.div
        style={{
          position: 'relative',
          padding: 'clamp(32px,5vw,48px) clamp(22px,4vw,40px)',
          borderRadius: '24px',
          border: '2px solid transparent',
          background: `linear-gradient(160deg, #FBF1EC 0%, #FFFFFF 45%, #F7F3FC 100%) padding-box, ${GOLD_EDGE}`,
          boxShadow: '0 0 0 6px rgba(255,255,255,0.6), 0 24px 56px rgba(107,79,160,0.10)',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* Problems section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p style={eyebrow}>You told us you are dealing with</p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              {problemLabels.map((problem, i) => {
                const t = TINTS[i % TINTS.length];
                const Icon = problemIcon(problem.id);
                return (
                  <motion.span
                    key={problem.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.1 }}
                    style={chip(t)}
                  >
                    <span style={chipIcon(t)}><Icon size={14} strokeWidth={1.9} color={t.fg} /></span>
                    {problem.label}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>

          {/* Support section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p style={eyebrow}>and</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span style={chip(TINTS[1])}>
                <span style={chipIcon(TINTS[1])}><SupportIcon size={14} strokeWidth={1.9} color={TINTS[1].fg} /></span>
                {supportLabel.label}
              </span>
            </div>
          </motion.div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: `linear-gradient(90deg, transparent 0%, ${LILAC_LINE} 20%, #E7D3E4 50%, ${LILAC_LINE} 80%, transparent 100%)`,
            }}
          />

          {/* CTA text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: SF,
              fontSize: 'clamp(19px, 2.4vw, 23px)',
              fontWeight: 700,
              color: DARK,
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Let us see how many people are going through something similar.
          </motion.p>
        </div>
      </motion.div>

      {/* Continue button */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={onContinue}
          className="pl-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '15px 36px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: P,
            color: '#FFFFFF',
            fontSize: '15.5px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(107,79,160,0.22)',
          }}
        >
          Show Me The Global Pulse
          <ArrowRight size={17} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}

export default PulseSummary;
