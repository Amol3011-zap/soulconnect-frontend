import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

/* ─────────────────────────────────────────────────────────
   ReflectionTextarea
   Props:
     value       — string
     onChange    — (e) => void
     placeholder — string
     disabled    — bool
     autoFocus   — bool
───────────────────────────────────────────────────────── */
export default function ReflectionTextarea({
  value,
  onChange,
  placeholder = 'Write your thoughts here...',
  disabled = false,
  autoFocus = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      // Small delay so modal entrance animation finishes first
      const t = setTimeout(() => ref.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      style={{ position: 'relative' }}
    >
      {/* Glow ring on focus — pure CSS handled via class */}
      <style>{`
        .reflection-textarea {
          width: 100%;
          min-height: 130px;
          resize: vertical;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(168,85,247,0.22);
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: Inter, sans-serif;
          color: #E2DEFF;
          line-height: 1.7;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          caret-color: #A78BFA;
        }
        .reflection-textarea::placeholder {
          color: rgba(139,116,230,0.45);
          font-style: italic;
        }
        .reflection-textarea:focus {
          border-color: rgba(168,85,247,0.55);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.18), 0 4px 20px rgba(0,0,0,0.2);
        }
        .reflection-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <textarea
        ref={ref}
        className="reflection-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={5}
        maxLength={1000}
      />

      {/* Character count */}
      <div style={{
        position: 'absolute', bottom: 10, right: 14,
        fontSize: 10, color: 'rgba(139,116,230,0.45)',
        fontWeight: 500, pointerEvents: 'none',
        transition: 'color 0.2s ease',
        color: value.length > 900 ? 'rgba(251,191,36,0.7)' : 'rgba(139,116,230,0.45)',
      }}>
        {value.length}/1000
      </div>
    </motion.div>
  );
}
