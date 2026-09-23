import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { CARD_STYLE } from './homeStyles';

/* ─────────────────────────────────────────────────────────────────────────────
   TODAY'S FOCUS — compact sidebar checklist card.
   Extracted verbatim from Home.jsx, including its co-located FOCUS_CHECKLIST
   (only consumer).
───────────────────────────────────────────────────────────────────────────── */
const FOCUS_CHECKLIST = [
  'Write 3 things you\'re grateful for',
  '5 minute breathing exercise',
  'Go for a short walk',
  'Be kind to yourself',
];

export default function TodaysFocusChecklistCard({ onStart }) {
  return (
    <div style={{
      ...CARD_STYLE,
      marginBottom: 0,
      background: 'linear-gradient(145deg, rgba(139,92,246,0.1) 0%, rgba(34,18,73,0.72) 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>🌿</span>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Today's Focus</h3>
      </div>

      <p style={{
        fontSize: 20, fontWeight: 800, fontStyle: 'italic', color: '#fff',
        lineHeight: 1.25, margin: '0 0 16px',
      }}>
        Small steps.<br />Big change.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
        {FOCUS_CHECKLIST.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={14} color="#34D399" strokeWidth={2.2} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#D8D4EE', lineHeight: 1.3 }}>{item}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        style={{
          width: '100%', padding: '11px', borderRadius: 13,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          marginBottom: 12,
        }}
      >
        Start Today <span style={{ fontSize: 15 }}>→</span>
      </motion.button>

      <p style={{
        fontSize: 11, fontStyle: 'italic', color: '#8A84B6', textAlign: 'center', margin: 0,
      }}>
        "Progress, not perfection."
      </p>
    </div>
  );
}
