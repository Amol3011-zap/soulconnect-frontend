import React from 'react';
import { motion } from 'motion/react';

export default function GradientButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={{
        background: 'linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%)',
        boxShadow: '0 8px 24px rgba(109, 74, 255, 0.3)',
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </div>
    </motion.button>
  );
}
