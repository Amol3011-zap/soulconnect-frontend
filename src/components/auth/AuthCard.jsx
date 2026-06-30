import React from 'react';
import { motion } from 'motion/react';

export default function AuthCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`rounded-3xl p-8 border backdrop-blur-xl ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow:
          '0 20px 60px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)',
      }}
    >
      {children}
    </motion.div>
  );
}
