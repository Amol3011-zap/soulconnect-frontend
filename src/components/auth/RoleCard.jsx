import React from 'react';
import { motion } from 'motion/react';

export default function RoleCard({
  icon,
  title,
  description,
  features,
  selected,
  onClick,
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className={`w-full rounded-2xl p-6 text-left transition-all border-2 ${
        selected
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-purple-500/20 hover:border-purple-500/40 bg-purple-500/5'
      }`}
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(109, 74, 255, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(109, 74, 255, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%)',
        boxShadow: selected
          ? '0 8px 32px rgba(109, 74, 255, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex gap-4">
        <div className="text-5xl flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: 'rgba(109, 74, 255, 0.1)',
                  color: '#6D4AFF',
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
