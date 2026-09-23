import { motion } from 'motion/react';
import {
  CheckCircle, Heart,
  Activity, Droplets, Wind, Brain, Flower2,
  Users, Zap, Star, Moon, Monitor, Leaf,
  Target, Briefcase, BookOpen, Palette, Sparkles, Gift,
} from 'lucide-react';
import { CATEGORY_META } from '../../data/tinyWinsChallenges';

/* ─────────────────────────────────────────────────────────────────────────────
   TINY WIN HOME CARD  (horizontal, 3-column layout) — extracted verbatim from
   Home.jsx, including its co-located CATEGORY_ICONS map (only consumer).
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_ICONS = {
  'Movement':          Activity,
  'Body':              Droplets,
  'Breathing':         Wind,
  'Mind':              Brain,
  'Meditation':        Flower2,
  'Connection':        Users,
  'Confidence':        Zap,
  'Gratitude':         Star,
  'Sleep':             Moon,
  'Digital Wellbeing': Monitor,
  'Nature':            Leaf,
  'Focus':             Target,
  'Relationships':     Heart,
  'Work':              Briefcase,
  'Learning':          BookOpen,
  'Creativity':        Palette,
  'Self Care':         Sparkles,
  'Kindness':          Gift,
};

export default function HomeTinyWinCard({ win, index, isCompleted, onComplete }) {
  if (!win) return null;
  const meta = CATEGORY_META[win.category] || {};
  const IconComp = CATEGORY_ICONS[win.category];

  return (
    <motion.button
      type="button"
      onClick={() => !isCompleted && onComplete(win.id)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={!isCompleted ? { scale: 0.96 } : undefined}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      style={{
        flex: '1 1 0', minWidth: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        textAlign: 'left',
        background: isCompleted
          ? 'linear-gradient(145deg, rgba(16,185,129,0.1), rgba(34,18,73,0.7))'
          : 'rgba(34,18,73,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isCompleted
          ? '1px solid rgba(16,185,129,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: '16px 14px',
        position: 'relative',
        overflow: 'hidden',
        cursor: isCompleted ? 'default' : 'pointer',
        fontFamily: 'inherit',
        boxShadow: isCompleted
          ? '0 0 20px rgba(16,185,129,0.08), 0 6px 16px rgba(0,0,0,0.3)'
          : '0 6px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)',
        transition: 'box-shadow 0.25s, border 0.25s, transform 0.15s',
      }}
    >
      {/* Inner top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      }} />

      {/* Icon bubble — always shows category color/icon; completion adds a badge */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `radial-gradient(circle at 32% 28%, ${meta.color || '#A78BFA'}55, ${meta.color || '#A78BFA'}22 70%)`,
          border: `1px solid ${meta.color ? meta.color + '55' : 'rgba(139,92,246,0.35)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 22px ${meta.color || '#A78BFA'}66, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}>
          {IconComp
            ? <IconComp size={20} color={meta.color || '#A78BFA'} strokeWidth={1.75} />
            : <span style={{ fontSize: 19 }}>{meta.icon || '✨'}</span>
          }
        </div>
        {isCompleted && (
          <div style={{
            position: 'absolute', bottom: -3, right: -3,
            width: 17, height: 17, borderRadius: '50%',
            background: '#10B981',
            border: '2px solid rgba(34,18,73,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 8px rgba(16,185,129,0.6)',
          }}>
            <CheckCircle size={11} color="#fff" strokeWidth={2.5} fill="#10B981" />
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: isCompleted ? '#86EFAC' : '#fff',
        marginBottom: 10, lineHeight: 1.3,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {win.title}
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 600,
        color: isCompleted ? '#10B981' : '#8A84B6',
      }}>
        {isCompleted
          ? <><CheckCircle size={13} /> 1/1</>
          : <><span style={{
              width: 13, height: 13, borderRadius: '50%',
              border: '1.5px solid rgba(184,180,216,0.4)', display: 'inline-block', flexShrink: 0,
            }} /> 0/1</>
        }
      </div>
    </motion.button>
  );
}
