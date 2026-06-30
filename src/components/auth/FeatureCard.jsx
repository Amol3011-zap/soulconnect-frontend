import React from 'react';
import { motion } from 'motion/react';

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 backdrop-blur-sm border"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-2 text-sm leading-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
