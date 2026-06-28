import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WEATHERS } from './EmotionWeatherModal';

const WEATHER_COLORS = {
  'clear-sky': '#F59E0B',
  'hope': '#FBBF24',
  'blooming': '#EC4899',
  'fog': '#94A3B8',
  'heavy-rain': '#60A5FA',
  'storm': '#818CF8',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function getWeekLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays < 7) return 'This Week';
  if (diffDays < 14) return 'Last Week';
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - d.getDay());
  return `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function groupByWeek(history) {
  const groups = {};
  history.forEach((entry) => {
    const label = getWeekLabel(entry.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  });
  return Object.entries(groups);
}

function HistoryEntry({ entry, index }) {
  const weather = WEATHERS[entry.weather];
  if (!weather) return null;
  const color = WEATHER_COLORS[entry.weather] || '#A855F7';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 16px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Colored accent bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: color,
        borderRadius: '14px 0 0 14px',
        opacity: 0.7,
      }}
        aria-hidden="true"
      />

      {/* Weather icon */}
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
      }}
        aria-hidden="true"
      >
        {weather.icon}
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: color,
          }}>
            {weather.label}
          </span>
          <span style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
          }}>
            · {entry.time || ''}
          </span>
        </div>
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 6,
        }}>
          {formatDate(entry.date)}
        </div>
        <p style={{
          margin: 0,
          fontSize: 12,
          fontStyle: 'italic',
          color: 'rgba(245,184,65,0.6)',
          lineHeight: 1.45,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          "{weather.quote}"
        </p>
      </div>

      {/* Color dot */}
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
        marginTop: 6,
        boxShadow: `0 0 6px ${color}88`,
      }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function WeatherHistory({ history, onClose }) {
  const grouped = useMemo(() => groupByWeek(history || []), [history]);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8000,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        role="dialog"
        aria-modal="true"
        aria-label="Weather history panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(440px, 100vw)',
          zIndex: 8001,
          background: 'rgba(10,5,28,0.97)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.01em',
            }}>
              Weather History
            </h2>
            <p style={{
              margin: '4px 0 0',
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
            }}>
              {history?.length || 0} check-ins recorded
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            aria-label="Close history panel"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </motion.button>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(168,85,247,0.3) transparent',
        }}>
          {(!history || history.length === 0) ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No history yet</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                Start checking in daily to build your emotional weather journal.
              </div>
            </div>
          ) : (
            grouped.map(([weekLabel, entries], gi) => (
              <div key={weekLabel} style={{ marginBottom: 24 }}>
                {/* Week label */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                  }} />
                  {weekLabel}
                  <div style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                  }} />
                </div>

                {/* Entries */}
                {entries.map((entry, i) => (
                  <HistoryEntry key={entry.id || entry.date} entry={entry} index={gi * 5 + i} />
                ))}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
