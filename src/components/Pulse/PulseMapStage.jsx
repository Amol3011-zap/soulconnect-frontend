import React from 'react';
import { motion } from 'motion/react';
import Globe3D from './Globe3D';
import { PROBLEMS } from '../../data/pulseExperienceData';

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
          color: 'rgba(255,255,255,0.7)',
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
                  boxShadow: `0 0 8px ${color}`,
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
          backgroundColor: '#050817',
          border: '1px solid rgba(124,90,200,0.12)',
          boxShadow: 'inset 0 0 80px rgba(124,58,237,0.06)',
          overflow: 'hidden',
        }}
      >
        <Globe3D
          countries={snapshot.countries}
          mapPoints={snapshot.map}
          colors={snapshot.colors}
          selectedIso={selectedIso}
          onSelectCountry={onSelectCountry}
        />
      </div>
    </motion.div>
  );
}

export default PulseMapStage;
