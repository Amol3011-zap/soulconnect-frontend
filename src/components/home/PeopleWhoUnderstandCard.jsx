import { motion } from 'motion/react';
import { scoreToPercent } from '../soulmatch/soulmatchData';

/* ─────────────────────────────────────────────────────────────────────────────
   PEOPLE WHO UNDERSTAND — Match cards for sidebar/dashboard.
   Extracted verbatim from Home.jsx, including its co-located AVATAR_PALETTE
   (only consumer).
───────────────────────────────────────────────────────────────────────────── */
const AVATAR_PALETTE = [
  ['#EC4899', '#F472B6'], ['#7C3AED', '#A855F7'], ['#0EA5E9', '#38BDF8'],
  ['#F59E0B', '#FBBF24'], ['#10B981', '#34D399'], ['#6366F1', '#818CF8'],
];

export default function PeopleWhoUnderstandCard({ match, index = 0, onConnect }) {
  if (!match) return null;
  const matchPercent = scoreToPercent(match.match_score);
  const tags = [match.problem, match.problem_context].filter(Boolean).slice(0, 2);
  const statement = match.match_reason || match.bio || '';
  const location = match.city || match.location || 'India';
  const [c1, c2] = AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        flex: 1, minWidth: 0,
        background: 'rgba(34,18,73,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '18px',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
      }}
    >
      {/* Inner top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
      }} />

      {/* Avatar with overlapping match badge */}
      <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 12 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700, color: '#fff',
          boxShadow: `0 0 20px ${c1}55`,
          border: '2px solid rgba(255,255,255,0.12)',
        }}>
          {match.avatar_url
            ? <img src={match.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (match.name?.[0]?.toUpperCase() || '?')
          }
        </div>
        <div style={{
          position: 'absolute', top: -8, right: -10,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(8,6,22,0.95)',
          border: '2px solid rgba(16,185,129,0.5)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
            {matchPercent != null ? `${matchPercent}%` : '—'}
          </span>
        </div>
      </div>

      {/* Name + Location */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          {match.name}, {match.age || '?'}
        </div>
        <div style={{ fontSize: 12, color: '#8A84B6', marginTop: 2 }}>
          📍 {location}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: '#A78BFA',
              borderRadius: 14, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Statement */}
      {statement && (
        <p style={{
          fontSize: 13, color: '#B8B4D8', lineHeight: 1.5, margin: '0 0 14px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          "{statement}"
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onConnect?.(match)}
          style={{
            flex: 1,
            padding: '9px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#fff', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}
        >
          Connect
        </motion.button>
        <button style={{
          flex: 1,
          padding: '9px 14px', borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#B8B4D8', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Not Now
        </button>
      </div>
    </motion.div>
  );
}
