import React from 'react';
import { motion } from 'motion/react';
import { PROBLEMS } from '../../data/pulseExperienceData';
import { getDisplayRange } from '../../data/pulseDataAdapter';
import { P, DARK, NAVY_SOFT, MUTED, GOLD_TXT, LILAC_LINE, SEA_TXT, SF, TINTS, GOLD_EDGE, problemIcon } from './pulseTheme';

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
          border: '1.5px solid transparent',
          background: `linear-gradient(170deg, #FBF1EC 0%, #FFFFFF 60%) padding-box, ${GOLD_EDGE}`,
          boxShadow: '0 12px 32px rgba(107,79,160,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: TINTS[0].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {React.createElement(problemIcon(firstProblem), { size: 20, strokeWidth: 1.7, color: P })}
          </span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: GOLD_TXT,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                margin: 0,
              }}
            >
              People dealing with
            </p>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: DARK, margin: '4px 0 0 0' }}>
              {problem?.label}
            </h3>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          style={{ fontFamily: SF, fontSize: '38px', fontWeight: 700, color: P, marginBottom: '4px', lineHeight: 1.1 }}
        >
          {total.toLocaleString()}
        </motion.div>

        <p style={{ fontSize: '13.5px', fontWeight: 500, color: NAVY_SOFT, margin: 0 }}>
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
              backgroundColor: '#E7F1EC',
              border: '1px solid #D3E7DC',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#3F7A5E',
                boxShadow: '0 0 0 3px rgba(63,122,94,0.18)',
              }}
            />
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: SEA_TXT }}>
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
          border: `1.5px solid ${LILAC_LINE}`,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(34,27,58,0.03)',
        }}
      >
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: GOLD_TXT,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            margin: '0 0 12px 0',
          }}
        >
          What people are dealing with
        </h4>

        {categories.length === 0 ? (
          <p style={{ fontSize: '13px', color: MUTED, margin: 0, lineHeight: 1.55 }}>
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
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: DARK, flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: NAVY_SOFT }}>{item.percentage}%</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: '#EFE9F8', overflow: 'hidden' }}>
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
          border: `1.5px solid ${LILAC_LINE}`,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(34,27,58,0.03)',
        }}
      >
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: GOLD_TXT,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            margin: '0 0 12px 0',
          }}
        >
          Top countries
        </h4>

        {topCountries.length === 0 ? (
          <p style={{ fontSize: '13px', color: MUTED, margin: 0, lineHeight: 1.55 }}>
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
                    color: NAVY_SOFT,
                    paddingBottom: '10px',
                    borderBottom: i < topCountries.length - 1 ? `1px solid ${LILAC_LINE}` : 'none',
                    gap: '12px',
                  }}
                >
                  <span>{country.name}</span>
                  <span style={{ fontWeight: 700, color: displayRange === null ? MUTED : GOLD_TXT, fontSize: displayRange === null ? '11px' : '13px', textAlign: 'right' }}>
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
