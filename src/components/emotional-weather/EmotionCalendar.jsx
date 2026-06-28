import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WEATHERS } from './EmotionWeatherModal';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WEATHER_COLORS = {
  'clear-sky': '#F59E0B',
  'hope': '#FBBF24',
  'blooming': '#EC4899',
  'fog': '#94A3B8',
  'heavy-rain': '#60A5FA',
  'storm': '#818CF8',
};

function formatMonthYear(year, month) {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().slice(0, 10);
}

export default function EmotionCalendar({ calendarData, currentMonth, onDayClick }) {
  const [tooltip, setTooltip] = useState(null); // { date, weather, x, y }
  const containerRef = useRef(null);

  const year = currentMonth ? currentMonth.year : new Date().getFullYear();
  const month = currentMonth ? currentMonth.month : new Date().getMonth() + 1;

  // Find day of week for 1st of month (0=Sun)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  function handleDayClick(item, e) {
    if (!item.weather) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    setTooltip({
      date: item.date,
      weather: item.weather,
      x: rect.left - (containerRect?.left || 0) + rect.width / 2,
      y: rect.top - (containerRect?.top || 0),
    });
    if (onDayClick) onDayClick(item);
  }

  function handleClose() {
    setTooltip(null);
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (tooltip) setTooltip(null);
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [tooltip]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: 20,
        padding: '24px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
      }}
      ref={containerRef}
    >
      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          🗓 Emotional Calendar — {formatMonthYear(year, month)}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          Your daily emotional check-ins this month
        </div>
      </div>

      {/* Day names header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
        marginBottom: 8,
      }}>
        {DAY_NAMES.map((d) => (
          <div key={d} style={{
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 6,
      }}>
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {(calendarData || []).map((item) => {
          const dayNum = parseInt(item.date.slice(8), 10);
          const color = item.weather ? WEATHER_COLORS[item.weather] : null;
          const today = isToday(item.date);
          const isFuture = item.date > new Date().toISOString().slice(0, 10);

          return (
            <motion.button
              key={item.date}
              whileHover={item.weather ? { scale: 1.18 } : undefined}
              whileTap={item.weather ? { scale: 0.92 } : undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleDayClick(item, e);
              }}
              aria-label={item.weather
                ? `${item.date}: ${WEATHERS[item.weather]?.label || item.weather}`
                : `${item.date}: No check-in`
              }
              title={item.weather ? WEATHERS[item.weather]?.label : 'No check-in'}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '50%',
                border: today
                  ? '2px solid #F59E0B'
                  : item.weather
                  ? '1.5px solid rgba(255,255,255,0.08)'
                  : 'none',
                background: color
                  ? `${color}40`
                  : isFuture
                  ? 'transparent'
                  : 'rgba(255,255,255,0.04)',
                boxShadow: color ? `0 0 8px ${color}55` : 'none',
                cursor: item.weather ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.15s, box-shadow 0.15s',
                outline: 'none',
              }}
            >
              {/* Color fill dot */}
              {color && (
                <div style={{
                  position: 'absolute',
                  inset: 3,
                  borderRadius: '50%',
                  background: `${color}60`,
                }}
                  aria-hidden="true"
                />
              )}

              {/* Day number */}
              <span style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 11,
                fontWeight: today ? 800 : 500,
                color: color
                  ? '#fff'
                  : today
                  ? '#F59E0B'
                  : isFuture
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.3)',
              }}>
                {dayNum}
              </span>

              {/* Weather emoji overlay on hover */}
              {item.weather && (
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  opacity: 0,
                  transition: 'opacity 0.15s',
                }}
                  className="calendar-emoji"
                  aria-hidden="true"
                >
                  {WEATHERS[item.weather]?.icon}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tooltip popover */}
      <AnimatePresence>
        {tooltip && WEATHERS[tooltip.weather] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: Math.max(10, tooltip.x - 80),
              top: Math.max(10, tooltip.y - 140),
              zIndex: 100,
              minWidth: 160,
              background: 'rgba(15,8,40,0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${WEATHERS[tooltip.weather].color}55`,
              borderRadius: 14,
              padding: '14px 16px',
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${WEATHERS[tooltip.weather].glowColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{WEATHERS[tooltip.weather].icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: WEATHERS[tooltip.weather].color }}>
                  {WEATHERS[tooltip.weather].label}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
            <p style={{
              margin: 0,
              fontSize: 12,
              fontStyle: 'italic',
              color: '#F59E0B',
              lineHeight: 1.5,
            }}>
              "{WEATHERS[tooltip.weather].quote}"
            </p>
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 8,
                right: 10,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: 1,
                padding: '2px 4px',
              }}
              aria-label="Close tooltip"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 12px',
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {Object.values(WEATHERS).map((w) => (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: WEATHER_COLORS[w.id],
              opacity: 0.8,
            }} aria-hidden="true" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{w.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
