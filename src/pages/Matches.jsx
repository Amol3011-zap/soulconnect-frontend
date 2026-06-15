import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

const PROBLEM_LABELS = {
  anxiety: { label: 'Anxiety', icon: '😰', color: '#7c3aed' },
  depression: { label: 'Depression', icon: '😢', color: '#2563eb' },
  ocd_intrusive_thoughts: { label: 'OCD', icon: '🔄', color: '#0891b2' },
  ptsd_trauma: { label: 'PTSD / Trauma', icon: '⚠️', color: '#dc2626' },
  phobias: { label: 'Phobias', icon: '😨', color: '#7c3aed' },
  panic_attacks: { label: 'Panic Attacks', icon: '💓', color: '#e11d48' },
  self_harm: { label: 'Self-Harm', icon: '🆘', color: '#dc2626' },
  relationship_breakup: { label: 'Breakup', icon: '💔', color: '#e11d48' },
  divorce: { label: 'Divorce', icon: '📋', color: '#64748b' },
  marriage_problems: { label: 'Marriage', icon: '💑', color: '#7c3aed' },
  family_relationships: { label: 'Family', icon: '👨‍👩‍👧', color: '#059669' },
  trust_issues: { label: 'Trust Issues', icon: '🤝', color: '#0891b2' },
  loneliness: { label: 'Loneliness', icon: '😔', color: '#6366f1' },
  lack_of_confidence: { label: 'Confidence', icon: '📉', color: '#7c3aed' },
  grief_loss: { label: 'Grief / Loss', icon: '🕯️', color: '#64748b' },
  work_career_stress: { label: 'Work Stress', icon: '💼', color: '#0891b2' },
  financial_stress: { label: 'Financial', icon: '💸', color: '#d97706' },
  addiction_substance_abuse: { label: 'Addiction', icon: '⚕️', color: '#059669' },
  sleep_problems: { label: 'Sleep', icon: '😴', color: '#6366f1' },
  anger_management: { label: 'Anger', icon: '😤', color: '#dc2626' },
  identity_sexual_orientation: { label: 'Identity', icon: '🌈', color: '#7c3aed' },
  health_anxiety: { label: 'Health Anxiety', icon: '🏥', color: '#0891b2' },
  eating_disorders: { label: 'Eating', icon: '🍽️', color: '#059669' },
  bullying_harassment: { label: 'Bullying', icon: '😠', color: '#dc2626' },
};

const AVATARS_GRAD = [
  'linear-gradient(135deg, #7c3aed, #2563eb)',
  'linear-gradient(135deg, #0891b2, #059669)',
  'linear-gradient(135deg, #e11d48, #7c3aed)',
  'linear-gradient(135deg, #d97706, #dc2626)',
  'linear-gradient(135deg, #059669, #0891b2)',
];

function ScoreRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#7c3aed' : '#f59e0b';
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

function MatchCard({ match, index, onAccept, onSkip, accepting }) {
  const [expanded, setExpanded] = useState(false);
  const prob = PROBLEM_LABELS[match.primary_problem] || PROBLEM_LABELS[match.problem_matched] || { label: 'Peer Support', icon: '🤝', color: '#7c3aed' };
  const grad = AVATARS_GRAD[index % AVATARS_GRAD.length];
  const initial = match.name ? match.name[0].toUpperCase() : '?';

  return (
    <div className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

      {/* Gradient accent bar */}
      <div className="h-1" style={{ background: grad }} />

      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px rgba(124,58,237,0.15)` }} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              style={{ background: grad }}>
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{match.name || 'Anonymous'}</h3>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {match.age && <span className="text-xs text-gray-400">{match.age} yrs</span>}
                  {match.city && (
                    <>
                      {match.age && <span className="text-gray-200">·</span>}
                      <span className="text-xs text-gray-400">📍 {match.city}</span>
                    </>
                  )}
                  {match.distance_km != null && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">{match.distance_km.toFixed(0)} km</span>
                    </>
                  )}
                </div>
              </div>
              <ScoreRing score={match.match_score || 0} />
            </div>
          </div>
        </div>

        {/* Problem tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold border"
            style={{ background: `${prob.color}12`, color: prob.color, borderColor: `${prob.color}25` }}>
            {prob.icon} {prob.label}
          </span>
          {(match.secondary_problems || []).slice(0, 2).map((p) => {
            const info = PROBLEM_LABELS[p];
            return info ? (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-medium">
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Match reason */}
        {match.match_reason && (
          <div className="rounded-2xl px-3.5 py-2.5 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #faf5ff, #eff6ff)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: grad }} />
            <p className="text-xs text-gray-600 italic pl-2 leading-relaxed">"{match.match_reason}"</p>
          </div>
        )}

        {/* Expand toggle */}
        {match.problem_context && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs text-purple-500 font-semibold mb-3 hover:text-purple-700 transition-colors">
            {expanded ? '▲ Less' : '▼ Their story'}
          </button>
        )}
        {expanded && match.problem_context && (
          <p className="text-xs text-gray-500 italic mb-3 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">
            "{match.problem_context}"
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-1">
          <button onClick={() => onSkip(match.id)}
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-400 text-lg shrink-0">
            ✕
          </button>
          <button
            onClick={() => onAccept(match.id)}
            disabled={accepting === match.id}
            className="flex-1 h-11 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: grad }}>
            {accepting === match.id
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connecting...</>
              : <><span>💬</span> Start Conversation</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mx-auto"
          style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
          🔍
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-sm animate-bounce">
          ✨
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Finding your people...</h2>
      <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed">
        We're searching for peers who share your experiences. This usually takes a few minutes.
      </p>
      <button onClick={onRefresh}
        className="px-8 py-3 rounded-2xl font-semibold text-white text-sm hover:opacity-90 transition-opacity active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
        Refresh Matches
      </button>
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await matchAPI.findMatches();
      setMatches(response.data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchId) => {
    setAccepting(matchId);
    try {
      const response = await matchAPI.acceptMatch(matchId);
      const chatId = response.data?.match_id || matchId;
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      showToast('✅ Connected! Opening chat...');
      setTimeout(() => navigate(`/chat/${chatId}`), 900);
    } catch {
      showToast('❌ Could not connect. Try again.');
    } finally {
      setAccepting(null);
    }
  };

  const handleSkip = (matchId) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
          {toast}
        </div>
      )}

      {/* Hero header */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(60px)' }} />
        </div>
        <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-10">
          <p className="text-purple-300 text-sm mb-1">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-white mb-1">Your Matches</h1>
          <p className="text-purple-200/70 text-sm">People who truly understand your journey</p>

          {!loading && matches.length > 0 && (
            <div className="flex items-center gap-3 mt-5">
              <div className="flex -space-x-2">
                {matches.slice(0, 3).map((m, i) => (
                  <div key={m.id} className="w-8 h-8 rounded-full border-2 border-purple-900 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: AVATARS_GRAD[i % AVATARS_GRAD.length] }}>
                    {m.name?.[0]?.toUpperCase() || '?'}
                  </div>
                ))}
              </div>
              <p className="text-purple-200 text-sm">
                <span className="font-bold text-white">{matches.length}</span> peer{matches.length !== 1 ? 's' : ''} matched to you
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        {/* Refresh pill */}
        {!loading && matches.length > 0 && (
          <div className="flex justify-end mb-3">
            <button onClick={fetchMatches}
              className="text-xs text-purple-600 font-semibold bg-white px-3 py-1.5 rounded-full shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              🔄 Refresh
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl p-5 animate-pulse" style={{ background: 'var(--bg-card)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <div className="flex gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-3 bg-gray-50 rounded-full w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-gray-50 rounded-full mb-2" />
                <div className="h-3 bg-gray-50 rounded-full w-3/4" />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-3xl mt-2" style={{ background: 'var(--bg-card)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <EmptyState onRefresh={fetchMatches} />
          </div>
        ) : (
          <div className="space-y-4 pt-2 pb-6">
            {matches.map((match, i) => (
              <MatchCard key={match.id} match={match} index={i}
                onAccept={handleAccept} onSkip={handleSkip} accepting={accepting} />
            ))}

            {/* Safety note */}
            <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-gray-100">
              <span className="text-lg shrink-0">🔒</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                All matches are anonymous. Your personal details are never shared without your consent. You're always in control.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
