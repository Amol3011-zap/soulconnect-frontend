import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'motion/react';
import { WEATHERS } from './EmotionWeatherModal';

const WEATHER_VALUE = {
  'clear-sky': 6,
  'blooming': 6,
  'hope': 5,
  'fog': 3,
  'heavy-rain': 2,
  'storm': 1,
};

const WEATHER_EMOJI = {
  6: '☀️',
  5: '🌤',
  4: '🌸',
  3: '🌫',
  2: '🌧',
  1: '⚡',
};

function CustomDot(props) {
  const { cx, cy, payload } = props;
  if (!payload?.weather) return null;
  const w = WEATHERS[payload.weather];
  const color = w ? w.color : '#A855F7';
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={color} opacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const w = d.weather ? WEATHERS[d.weather] : null;
  return (
    <div style={{
      background: 'rgba(20,10,50,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '10px 14px',
      fontSize: 13,
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.day}</div>
      {w ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 20 }}>{w.icon}</span>
          <span style={{ color: w.color, fontWeight: 600 }}>{w.label}</span>
        </div>
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>No check-in</div>
      )}
    </div>
  );
}

function CustomYAxisTick({ x, y, payload }) {
  const emoji = WEATHER_EMOJI[payload.value];
  if (!emoji) return null;
  return (
    <text x={x - 4} y={y + 5} textAnchor="end" fontSize={14} fill="rgba(255,255,255,0.4)">
      {emoji}
    </text>
  );
}

export default function WeeklyChart({ weeklyData }) {
  const data = (weeklyData || []).map((d) => ({
    ...d,
    value: d.weather ? (WEATHER_VALUE[d.weather] || 3) : null,
  }));

  // Fill nulls with interpolated or just skip
  const hasData = data.some((d) => d.value !== null);

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
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          📈 Weekly Emotional Journey
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Your mood patterns over the past 7 days
        </div>
      </div>

      {!hasData ? (
        <div style={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: 13,
        }}>
          No data yet — start checking in daily!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="weatherGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 6]}
              ticks={[1, 2, 3, 5, 6]}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#A855F7"
              strokeWidth={2.5}
              fill="url(#weatherGradient)"
              dot={<CustomDot />}
              activeDot={{ r: 7, fill: '#A855F7', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 14px',
        marginTop: 16,
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {Object.values(WEATHERS).map((w) => (
          <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: w.color,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{w.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
