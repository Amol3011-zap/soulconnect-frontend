import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

/**
 * ErrorToast: User-friendly error notification
 * Matches SoulConnect's glassmorphic dark theme
 * Auto-dismisses after 6 seconds or via close button
 */
export default function ErrorToast({
  message,
  onRetry,
  onDismiss,
  autoClose = true,
  duration = 6000,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration]);

  if (!isVisible || !message) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            maxWidth: '90vw',
            width: 'clamp(300px, 90vw, 500px)',
          }}
        >
          <div
            style={{
              background: 'rgba(34, 18, 73, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 16,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              boxShadow: '0 8px 32px rgba(248, 113, 113, 0.2)',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                flexShrink: 0,
                color: '#f87171',
                marginTop: 2,
              }}
            >
              <AlertCircle size={20} strokeWidth={2} />
            </div>

            {/* Message & Actions */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Error Message */}
              <p
                style={{
                  color: '#E2DEFF',
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: '1.5',
                  margin: '0 0 8px 0',
                  wordBreak: 'break-word',
                }}
              >
                {message}
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(248, 113, 113, 0.2)',
                      border: '1px solid rgba(248, 113, 113, 0.4)',
                      borderRadius: 8,
                      color: '#fca5a5',
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(248, 113, 113, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(248, 113, 113, 0.2)';
                    }}
                  >
                    <RotateCcw size={12} />
                    Retry
                  </button>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                flexShrink: 0,
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
