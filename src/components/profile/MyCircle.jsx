import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const SAMPLE_MEMBERS = [
  { id: 1, initials: 'SM', color: '#FF6B6B' },
  { id: 2, initials: 'JD', color: '#4ECDC4' },
  { id: 3, initials: 'AB', color: '#45B7D1' },
  { id: 4, initials: 'RT', color: '#FFA07A' },
];

export default function MyCircle({ connectionCount = 8 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
            Your Circle
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.6)', margin: 0 }}>
            {connectionCount} People Who Understand You
          </p>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid rgba(139, 92, 246, 0.3)',
            background: 'transparent',
            color: '#A78BFA',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          View <ChevronRight size={14} />
        </motion.button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
        {SAMPLE_MEMBERS.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${member.color}, ${member.color}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              border: '2px solid #171126',
              marginLeft: i > 0 ? -12 : 0,
              position: 'relative',
              zIndex: SAMPLE_MEMBERS.length - i,
            }}
          >
            {member.initials}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
