import React from 'react';
import { motion } from 'motion/react';

export default function StatCard({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="text-2xl font-bold" style={{ color: '#F5B841' }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        {label}
      </div>
    </motion.div>
  );
}
