import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { ChevronRight, LogOut } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { streak, history } = useWeatherStore();

  const MENU = [
    { icon: '🌳', label: 'Healing Tree', sub: 'Level 3', action: () => navigate('/home') },
    { icon: '🏆', label: 'Achievements', sub: '12 Badges', action: () => {} },
    { icon: '⚙️', label: 'Settings', sub: null, action: () => navigate('/account') },
    { icon: '🛡️', label: 'Privacy & Safety', sub: null, action: () => navigate('/privacy') },
    { icon: '🔔', label: 'Notifications', sub: 'Manage reminders', action: () => {} },
    { icon: '❓', label: 'Help & Support', sub: null, action: () => navigate('/safety') },
  ];

  const checkIns = history?.length || 7;
  const stories = 3;

  return (
    <div
      style={{
        padding: '20px 24px',
        minHeight: '100vh',
        background: '#0D0B1A',
        fontFamily: 'Inter, sans-serif',
        paddingBottom: 100,
      }}
    >
      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, #1A0A3E, #2D1260)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 24,
          padding: 24,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
            color: '#fff',
            margin: '0 auto 14px',
          }}
        >
          {(user?.name || 'S')[0].toUpperCase()}
        </div>

        {/* Name */}
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          {user?.name || 'Soul Traveler'}
        </div>

        {/* View Profile link */}
        <div
          onClick={() => navigate('/account')}
          style={{ fontSize: 14, color: '#A78BFA', cursor: 'pointer', marginBottom: 20 }}
        >
          View Profile ›
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 16,
          }}
        >
          {[
            { label: 'Streak', value: `${streak || 5} days` },
            { label: 'Check-ins', value: checkIns },
            { label: 'Stories', value: stories },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#8A84B6', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Soul Climate History Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onClick={() => navigate('/journal')}
        style={{
          background: '#211044',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: 20,
          marginBottom: 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Soul Climate History
          </span>
          <ChevronRight size={16} color="#8A84B6" />
        </div>
        <div style={{ fontSize: 12, color: '#8A84B6', marginBottom: 14 }}>This Week</div>

        {/* Mini SVG Line Chart */}
        <svg viewBox="0 0 240 60" width="100%" height="60" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points="0,45 40,35 80,20 120,30 160,15 200,25 240,10"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,45 40,35 80,20 120,30 160,15 200,25 240,10 240,60 0,60"
            fill="url(#chartFill)"
            stroke="none"
          />
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <text key={d + i} x={i * 40} y={58} fontSize="9" fill="#8A84B6" textAnchor="middle">
              {d}
            </text>
          ))}
        </svg>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {MENU.map((item, idx) => (
          <motion.div
            key={item.label}
            onClick={item.action}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              background: '#211044',
              borderRadius: 14,
              marginBottom: 8,
              cursor: 'pointer',
            }}
          >
            {/* Emoji icon circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(139,92,246,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            {/* Label + sub */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.label}</div>
              {item.sub && (
                <div style={{ fontSize: 12, color: '#8A84B6', marginTop: 1 }}>{item.sub}</div>
              )}
            </div>

            <ChevronRight size={16} color="#8A84B6" />
          </motion.div>
        ))}
      </motion.div>

      {/* Logout button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={() => { logout(); navigate('/'); }}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 14,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: '#EF4444',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: 'Inter, sans-serif',
          marginTop: 8,
        }}
      >
        <LogOut size={16} />
        Log Out
      </motion.button>
    </div>
  );
}
