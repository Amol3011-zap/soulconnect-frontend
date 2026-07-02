import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, LogOut } from 'lucide-react';

export default function SettingsList({ items, onLogout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.03 }}
            onClick={item.action}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: 'rgba(34, 18, 73, 0.72)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              cursor: item.action ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            whileHover={item.action ? { background: 'rgba(34, 18, 73, 0.85)' } : {}}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                {item.label}
              </div>
              {item.sub && (
                <div style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                  {item.sub}
                </div>
              )}
            </div>

            {item.action && <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />}
          </motion.div>
        ))}
      </div>

      {/* Logout button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        onClick={onLogout}
        whileHover={{ background: 'rgba(239, 68, 68, 0.15)' }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 16,
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#EF4444',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}
      >
        <LogOut size={16} />
        Log Out
      </motion.button>
    </motion.div>
  );
}
