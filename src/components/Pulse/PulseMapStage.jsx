import React from 'react';
import { motion } from 'motion/react';
import Globe3D from './Globe3D';
import { PROBLEMS } from '../../data/pulseExperienceData';
import { NAVY_SOFT, GOLD_EDGE } from './pulseTheme';

function PulseMapStage({ problems, snapshot, selectedIso, onSelectCountry }) {
  const legendProblems = problems.length > 0 ? problems : Object.keys(snapshot.colors).slice(0, 6);

  return (
    <motion.div
      className="pulse-map-stage"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Legend — compact, above the map, not boxed in a card */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '18px',
          fontSize: '12px',
          fontWeight: 600,
          color: NAVY_SOFT,
        }}
      >
        {legendProblems.slice(0, 6).map((problemId) => {
          const problem = PROBLEMS.find((p) => p.id === problemId);
          const color = snapshot.colors[problemId] || snapshot.colors.other;
          return (
            <div key={problemId} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  boxShadow: `0 0 0 3px ${color}22`,
                }}
              />
              <span>{problem?.label}</span>
            </div>
          );
        })}
      </div>

      {/* The globe itself — the hero element. Large, borderless stage. */}
      <div
        className="pulse-map-canvas-wrap"
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '420px',
          borderRadius: '20px',
          border: '1.5px solid transparent',
          background: `radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F7F3FC 55%, #F1ECF9 100%) padding-box, ${GOLD_EDGE}`,
          boxShadow: '0 16px 40px rgba(107,79,160,0.08)',
          overflow: 'hidden',
        }}
      >
        <Globe3D
          countries={snapshot.countries}
          mapPoints={snapshot.map}
          colors={snapshot.colors}
          selectedIso={selectedIso}
          onSelectCountry={onSelectCountry}
          lightTheme
        />
      </div>
    </motion.div>
  );
}

export default PulseMapStage;
