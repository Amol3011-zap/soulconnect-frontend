import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, ShieldCheck, Flag, Ban } from 'lucide-react';
import { scoreToPercent } from './soulmatchData';

/**
 * "Why you two matched" detail dialog.
 *
 * Reasons are phrased as shared experience and support preference. It never
 * asserts a diagnosis, never claims what someone "has", and shows only fields
 * the matching endpoint already exposes — no private check-ins or history.
 */
function buildReasons(match) {
  const reasons = [];
  if (match.problem) {
    reasons.push({ icon: '🌱', text: `You've both written about ${String(match.problem).toLowerCase()}.` });
  }
  if (match.support_need) {
    reasons.push({ icon: '💬', text: `Similar support preference — ${match.support_need.toLowerCase()}.` });
  }
  if (match.problem_context) {
    reasons.push({ icon: '🎯', text: `A shared challenge around ${String(match.problem_context).toLowerCase()}.` });
  }
  if (typeof match.distance_km === 'number') {
    reasons.push({ icon: '🌎', text: 'You are in a similar region, so timing tends to line up.' });
  }
  return reasons;
}

export default function MatchDetailPanel({ match, requested, onClose, onConnect, onReport, onBlock }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!match) return null;
  const percent = scoreToPercent(match.match_score);
  const reasons = buildReasons(match);

  return (
    <div className="sm-overlay" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sm-detail-title"
        className="sm-sheet"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <h2 id="sm-detail-title" style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#F5F3FF' }}>
              {match.age ? `${match.name}, ${match.age}` : match.name}
            </h2>
            {match.city && (
              <p style={{
                margin: '5px 0 0', fontSize: 12.5, color: 'rgba(196,181,253,0.7)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <MapPin size={12} strokeWidth={2} aria-hidden="true" />{match.city}
              </p>
            )}
          </div>
          <button ref={closeRef} type="button" className="sm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={17} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </header>

        {percent !== null && (
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#5EEAD4', fontWeight: 650 }}>
            {percent}% SoulMatch
          </p>
        )}

        {match.match_reason && (
          <p style={{
            margin: '12px 0 0', fontSize: 14, lineHeight: 1.6,
            color: 'rgba(226,222,255,0.8)', fontStyle: 'italic',
          }}>
            &ldquo;{match.match_reason}&rdquo;
          </p>
        )}

        <h3 style={{ margin: '22px 0 10px', fontSize: 14, fontWeight: 700, color: '#F5F3FF' }}>
          Why you two matched
        </h3>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 9 }}>
          {reasons.map((r, i) => (
            <li key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              fontSize: 13, lineHeight: 1.55, color: 'rgba(226,222,255,0.78)',
            }}>
              <span aria-hidden="true" style={{ fontSize: 15, flexShrink: 0 }}>{r.icon}</span>
              {r.text}
            </li>
          ))}
        </ul>

        <div className="sm-card-actions" style={{ marginTop: 22 }}>
          {requested ? (
            <span className="sm-btn sm-btn--sent" role="status">Request sent</span>
          ) : (
            <button type="button" className="sm-btn sm-btn--primary" onClick={() => onConnect(match)}>
              Connect
            </button>
          )}
          <button type="button" className="sm-btn sm-btn--ghost" onClick={onClose}>Not Now</button>
        </div>

        <p className="sm-safety-note">
          <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
          Your safety matters. You can block or report anyone at any time.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button type="button" className="sm-btn sm-btn--quiet" onClick={() => onReport(match)}>
            <Flag size={13} strokeWidth={2} aria-hidden="true" /> Report
          </button>
          <button type="button" className="sm-btn sm-btn--quiet" onClick={() => onBlock(match)}>
            <Ban size={13} strokeWidth={2} aria-hidden="true" /> Block
          </button>
        </div>
      </motion.div>
    </div>
  );
}
