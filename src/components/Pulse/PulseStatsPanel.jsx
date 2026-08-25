import React from 'react';
import { motion } from 'motion/react';
import { PROBLEMS } from '../../data/pulseExperienceData';
import { getDisplayRange } from '../../data/pulseDataAdapter';

function PulseStatsPanel({ problems, snapshot }) {
  const { total, recentCheckins, recentWindowHours, categories, countries, colors } = snapshot;
  const firstProblem = problems[0];
  const problem = PROBLEMS.find((p) => p.id === firstProblem);

  // The backend already returns `countries` sorted by exact count
  // descending, before bucketing that count into a range string — the
  // frontend never sees the exact number, so it can't (and shouldn't)
  // re-sort here.
  const topCountries = countries.slice(0, 5);

  return (
    <motion.div
      className="pulse-stats-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Main stat card */}
      <motion.div
        style={{
          padding: '22px',
          borderRadius: '16px',
          border: '1px solid rgba(168,85,247,0.2)',
          backgroundColor: 'rgba(34,18,73,0.72)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px', lineHeight: 1 }}>{problem?.icon || '❓'}</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              People dealing with
            </p>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: '4px 0 0 0' }}>
              {problem?.label}
            </h3>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          style={{ fontSize: '34px', fontWeight: 800, color: '#4ADE80', marginBottom: '6px' }}
        >
          {total.toLocaleString()}
        </motion.div>

        <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          anonymous check-ins so far
        </p>

        {recentCheckins > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              padding: '5px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.25)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#4ADE80',
                boxShadow: '0 0 6px rgba(74,222,128,0.8)',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#4ADE80' }}>
              {recentCheckins} {recentCheckins === 1 ? 'person' : 'people'} checked in the last {recentWindowHours === 1 ? 'hour' : `${recentWindowHours} hours`}
            </span>
          </div>
        )}
      </motion.div>

      {/* Problem breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid rgba(168,85,247,0.15)',
          backgroundColor: 'rgba(34,18,73,0.5)',
        }}
      >
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 12px 0',
          }}
        >
          What people are dealing with
        </h4>

        {categories.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
            Category insights will appear as more people check in.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {categories.slice(0, 6).map((item, i) => {
              const color = colors[item.id] || colors.other;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color }}>{item.percentage}%</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(168,85,247,0.15)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.8 }}
                      style={{ height: '100%', backgroundColor: color, borderRadius: '2px' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Top countries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid rgba(168,85,247,0.15)',
          backgroundColor: 'rgba(34,18,73,0.5)',
        }}
      >
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 12px 0',
          }}
        >
          Top countries
        </h4>

        {topCountries.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
            Country insights will appear as the community grows.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topCountries.map((country, i) => {
              const displayRange = getDisplayRange(country.count_range);
              return (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                    paddingBottom: '10px',
                    borderBottom: i < topCountries.length - 1 ? '1px solid rgba(168,85,247,0.1)' : 'none',
                    gap: '12px',
                  }}
                >
                  <span>{country.name}</span>
                  <span style={{ fontWeight: 700, color: displayRange === null ? 'rgba(255,255,255,0.35)' : '#FBBF24', fontSize: displayRange === null ? '11px' : '13px', textAlign: 'right' }}>
                    {displayRange === null ? 'Not enough data to display' : displayRange}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default PulseStatsPanel;
