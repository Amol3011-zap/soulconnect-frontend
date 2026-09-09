import React, { memo, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Check, X } from 'lucide-react';

/**
 * MatchCard — a single "person who understands" card.
 *
 * Data contract (from POST /api/matches/find, see app/routes/matching.py):
 *   { id, name, problem, distance_km, match_score, match_reason, city, problem_context }
 *
 * match_score is a 0–200 point score from MatchingService.calculate_match_score,
 * NOT a percentage. We derive a percentage from it rather than inventing one.
 */

const MAX_MATCH_SCORE = 200;

export function scoreToPercent(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  const pct = Math.round((score / MAX_MATCH_SCORE) * 100);
  return Math.min(100, Math.max(0, pct));
}

/* Deterministic avatar tint per user id — no external image fetch, no fake photos. */
const AVATAR_TINTS = [
  ['#C4B5FD', '#7C3AED'],
  ['#FBCFE8', '#DB2777'],
  ['#A5B4FC', '#4F46E5'],
  ['#BAE6FD', '#0284C7'],
  ['#FDE68A', '#D97706'],
  ['#BBF7D0', '#059669'],
];

function initialsOf(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

/* Avatar inside a gradient ring, per the reference. Renders `avatar_url` when
   the profile has one and falls back to initials on a tint otherwise — also
   the fallback if the image fails to load. */
function MatchAvatar({ name, id, src, size = 74 }) {
  const [from, to] = AVATAR_TINTS[Math.abs(Number(id) || 0) % AVATAR_TINTS.length];
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const ring = 2.5;

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        padding: ring,
        background: `linear-gradient(150deg, ${from} 0%, ${to} 55%, #7C3AED 100%)`,
        boxShadow: `0 6px 20px ${to}4D`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(150deg, ${from}D9 0%, ${to} 100%)`,
          border: '2px solid #1B1039',
          color: '#fff',
          fontSize: size * 0.3,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          initialsOf(name)
        )}
      </div>
    </div>
  );
}

/* Circular percentage ring — replaces the old rectangular badge. */
function ScoreRing({ percent, size = 52 }) {
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="#34D399" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * circ} ${circ}`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        lineHeight: 1,
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>{percent}%</span>
        <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
          Match
        </span>
      </div>
    </div>
  );
}

/* Per-tag colour so tags read as distinct chips, as in the reference.
   Known struggles get a fixed, meaningful tint; anything else falls back to a
   stable hash so the same tag is always the same colour. */
const TAG_COLORS = {
  anxiety: '#2DD4BF',
  overthinking: '#2DD4BF',
  burnout: '#F97316',
  stress: '#F97316',
  loneliness: '#A78BFA',
  'self-worth': '#A78BFA',
  breakup: '#F472B6',
  relationships: '#F472B6',
  grief: '#60A5FA',
  'low mood': '#60A5FA',
  'career pressure': '#60A5FA',
  work: '#60A5FA',
  family: '#34D399',
  'self growth': '#34D399',
};
const TAG_FALLBACK = ['#2DD4BF', '#A78BFA', '#F97316', '#60A5FA', '#F472B6', '#34D399'];

function tagTint(tag) {
  const key = String(tag).toLowerCase().trim();
  if (TAG_COLORS[key]) return TAG_COLORS[key];
  const hit = Object.keys(TAG_COLORS).find(k => key.includes(k));
  if (hit) return TAG_COLORS[hit];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return TAG_FALLBACK[h % TAG_FALLBACK.length];
}

function MatchCard({ match, index = 0, onConnect, onDismiss, pending = false }) {
  const percent = scoreToPercent(match.match_score);
  const tags = [match.problem, match.problem_context].filter(Boolean);

  const handleConnect = useCallback(() => onConnect?.(match), [match, onConnect]);
  const handleDismiss = useCallback(() => onDismiss?.(match), [match, onDismiss]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="sc-match-card"
      aria-label={`Suggested connection: ${match.name}`}
    >
      {/* Head: avatar top-left, score ring top-right */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <MatchAvatar name={match.name} id={match.id} src={match.avatar_url} />
        {percent !== null && <ScoreRing percent={percent} />}
      </div>

      {/* Identity sits below the avatar, as in the reference */}
      <div style={{ margin: '10px 0 12px', minWidth: 0 }}>
        <h3 style={{
          margin: 0,
          fontSize: 15.5,
          fontWeight: 700,
          color: '#F5F3FF',
          letterSpacing: '-0.01em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {match.age ? `${match.name}, ${match.age}` : match.name}
        </h3>

        {match.city && (
          <p style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: 'rgba(196,181,253,0.68)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <MapPin size={11} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {match.city}
            </span>
          </p>
        )}
      </div>

      {/* Shared experience tags — one colour per tag */}
      {tags.length > 0 && (
        <ul style={{
          listStyle: 'none', margin: '0 0 12px', padding: 0,
          display: 'flex', flexWrap: 'wrap', gap: 7,
        }}>
          {tags.map(tag => {
            const tint = tagTint(tag);
            return (
              <li
                key={tag}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: 999,
                  background: `${tint}1F`,
                  border: `1px solid ${tint}59`,
                  color: tint,
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </li>
            );
          })}
        </ul>
      )}

      {/* Why we matched — real reason string from the backend */}
      {match.match_reason && (
        <p style={{
          margin: '0 0 16px',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(226,222,255,0.66)',
          fontStyle: 'italic',
        }}>
          “{match.match_reason}”
        </p>
      )}

      {/* Actions — mutual consent: Connect sends a request, it does not open a chat */}
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button
          type="button"
          onClick={handleConnect}
          disabled={pending}
          className="sc-match-btn sc-match-btn--primary"
        >
          <Check size={15} strokeWidth={2.4} aria-hidden="true" />
          {pending ? 'Sending…' : 'Connect'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={pending}
          className="sc-match-btn sc-match-btn--ghost"
        >
          <X size={15} strokeWidth={2.2} aria-hidden="true" />
          Not Now
        </button>
      </div>
    </motion.article>
  );
}

export default memo(MatchCard);
