import React, { memo, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Check, X, MoreHorizontal, Ear } from 'lucide-react';
import { scoreToPercent } from './soulmatchData';

const TINTS = [
  ['#C4B5FD', '#7C3AED'], ['#FBCFE8', '#DB2777'], ['#A5B4FC', '#4F46E5'],
  ['#BAE6FD', '#0284C7'], ['#FDE68A', '#D97706'], ['#BBF7D0', '#059669'],
];

const TAG_COLORS = {
  anxiety: '#2DD4BF', overthinking: '#2DD4BF',
  burnout: '#F97316', 'sleep & routine': '#F97316',
  loneliness: '#A78BFA', 'self-worth': '#A78BFA', 'self-doubt': '#A78BFA',
  heartbreak: '#F472B6', 'relationship challenges': '#F472B6',
  grief: '#60A5FA', 'career pressure': '#60A5FA',
  'family pressure': '#34D399', 'feeling lost': '#34D399',
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

function initialsOf(name) {
  if (!name) return '?';
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function Avatar({ name, id, src, size = 72 }) {
  const [from, to] = TINTS[Math.abs(Number(id) || 0) % TINTS.length];
  const [failed, setFailed] = useState(false);
  const show = Boolean(src) && !failed;
  return (
    <div aria-hidden="true" style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, padding: 2.5,
      background: `linear-gradient(150deg, ${from} 0%, ${to} 55%, #7C3AED 100%)`,
      boxShadow: `0 6px 20px ${to}4D`,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(150deg, ${from}D9 0%, ${to} 100%)`,
        border: '2px solid #1B1039', color: '#fff',
        fontSize: size * 0.3, fontWeight: 700,
      }}>
        {show ? (
          <img src={src} alt="" loading="lazy" decoding="async"
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : initialsOf(name)}
      </div>
    </div>
  );
}

function ScoreRing({ percent, size = 54 }) {
  const r = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#34D399" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={`${(percent / 100) * circ} ${circ}`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', lineHeight: 1,
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 800, color: '#fff' }}>{percent}%</span>
        <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Match</span>
      </div>
    </div>
  );
}

function SoulMatchCard({ match, index = 0, pending, requested, onConnect, onDismiss, onView, onSafety }) {
  const percent = scoreToPercent(match.match_score);
  const tags = [match.problem, match.problem_context].filter(Boolean);

  const handleConnect = useCallback(() => onConnect?.(match), [match, onConnect]);
  const handleDismiss = useCallback(() => onDismiss?.(match), [match, onDismiss]);
  const handleView = useCallback(() => onView?.(match), [match, onView]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="sm-card"
      aria-label={`Suggested connection: ${match.name}`}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <Avatar name={match.name} id={match.id} src={match.avatar_url} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {percent !== null && <ScoreRing percent={percent} />}
          <button
            type="button"
            className="sm-icon-btn"
            onClick={() => onSafety?.(match)}
            aria-label={`Safety options for ${match.name}`}
          >
            <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div style={{ margin: '10px 0 10px', minWidth: 0 }}>
        <h3 className="sm-card-name">
          {match.age ? `${match.name}, ${match.age}` : match.name}
        </h3>
        {match.city && (
          <p className="sm-card-loc">
            <MapPin size={11} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
            <span>{match.city}</span>
          </p>
        )}
      </div>

      {tags.length > 0 && (
        <ul className="sm-tags">
          {tags.map(tag => {
            const tint = tagTint(tag);
            return (
              <li key={tag} style={{ background: `${tint}1F`, border: `1px solid ${tint}59`, color: tint }}>
                {tag}
              </li>
            );
          })}
        </ul>
      )}

      {match.match_reason && (
        <p className="sm-card-quote">&ldquo;{match.match_reason}&rdquo;</p>
      )}

      {match.support_need && (
        <p className="sm-card-need">
          <Ear size={12} strokeWidth={2} aria-hidden="true" />
          Looking for: {match.support_need}
        </p>
      )}

      <div className="sm-card-actions">
        {requested ? (
          <span className="sm-btn sm-btn--sent" role="status">
            <Check size={15} strokeWidth={2.4} aria-hidden="true" />
            Request sent
          </span>
        ) : (
          <button type="button" className="sm-btn sm-btn--primary" onClick={handleConnect} disabled={pending}>
            <Check size={15} strokeWidth={2.4} aria-hidden="true" />
            {pending ? 'Sending…' : 'Connect'}
          </button>
        )}
        <button type="button" className="sm-btn sm-btn--ghost" onClick={handleView}>
          View Profile
        </button>
      </div>

      {!requested && (
        <button type="button" className="sm-btn sm-btn--quiet" onClick={handleDismiss}>
          <X size={14} strokeWidth={2.2} aria-hidden="true" />
          Not Now
        </button>
      )}
    </motion.article>
  );
}

export default memo(SoulMatchCard);
