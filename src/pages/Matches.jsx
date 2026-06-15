import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../services/api';

const PROBLEM_LABELS = {
  anxiety: { label: 'Anxiety', icon: '😰' },
  depression: { label: 'Depression', icon: '😢' },
  ocd_intrusive_thoughts: { label: 'OCD / Intrusive Thoughts', icon: '🔄' },
  ptsd_trauma: { label: 'PTSD / Trauma', icon: '⚠️' },
  phobias: { label: 'Phobias', icon: '😨' },
  panic_attacks: { label: 'Panic Attacks', icon: '💓' },
  self_harm: { label: 'Self-Harm', icon: '🆘' },
  relationship_breakup: { label: 'Relationship Breakup', icon: '💔' },
  divorce: { label: 'Divorce', icon: '📋' },
  marriage_problems: { label: 'Marriage Problems', icon: '💑' },
  family_relationships: { label: 'Family Relationships', icon: '👨‍👩‍👧' },
  trust_issues: { label: 'Trust Issues', icon: '🤝' },
  loneliness: { label: 'Loneliness', icon: '😔' },
  lack_of_confidence: { label: 'Lack of Confidence', icon: '📉' },
  grief_loss: { label: 'Grief / Loss', icon: '🕯️' },
  work_career_stress: { label: 'Work / Career Stress', icon: '💼' },
  financial_stress: { label: 'Financial Stress', icon: '💸' },
  addiction_substance_abuse: { label: 'Addiction', icon: '⚕️' },
  sleep_problems: { label: 'Sleep Problems', icon: '😴' },
  anger_management: { label: 'Anger Management', icon: '😤' },
  identity_sexual_orientation: { label: 'Identity & Orientation', icon: '🌈' },
  health_anxiety: { label: 'Health Anxiety', icon: '🏥' },
  eating_disorders: { label: 'Eating Disorders', icon: '🍽️' },
  bullying_harassment: { label: 'Bullying / Harassment', icon: '😠' },
};

function ScoreRing({ score }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e9d5ff" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="url(#grad)" strokeWidth="5"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-purple-700">{score}%</span>
      </div>
    </div>
  );
}

function MatchCard({ match, onAccept, onSkip, accepting }) {
  const problem = PROBLEM_LABELS[match.primary_problem] || PROBLEM_LABELS[match.problem_matched];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Top color band */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            {match.name ? match.name[0].toUpperCase() : '?'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-lg truncate">{match.name || 'Anonymous'}</h3>
              <ScoreRing score={match.match_score || 0} />
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {match.city && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  📍 {match.city}{match.distance_km ? ` · ${match.distance_km.toFixed(0)} km` : ''}
                </span>
              )}
              {match.age && <span className="text-xs text-gray-400">{match.age} yrs</span>}
            </div>
          </div>
        </div>

        {/* Problem tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {problem && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {problem.icon} {problem.label}
            </span>
          )}
          {(match.secondary_problems || []).slice(0, 2).map((p) => {
            const info = PROBLEM_LABELS[p];
            return info ? (
              <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                {info.icon} {info.label}
              </span>
            ) : null;
          })}
        </div>

        {/* Match reason */}
        {match.match_reason && (
          <p className="text-sm text-gray-600 bg-purple-50 rounded-xl px-3 py-2 mb-4 italic border border-purple-100">
            "{match.match_reason}"
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onSkip(match.id)}
            className="flex-1 py-2.5 rounded-xl font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
            Skip
          </button>
          <button
            onClick={() => onAccept(match.id)}
            disabled={accepting === match.id}
            className="flex-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all text-sm hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', flex: 2 }}>
            {accepting === match.id
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connecting...</>
              : '💬 Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await matchAPI.findMatches();
      setMatches(response.data.matches || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
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
      showToast('Match accepted! Starting chat...');
      setTimeout(() => navigate(`/chat/${chatId}`), 1000);
    } catch (err) {
      showToast('Could not connect. Try again.');
    } finally {
      setAccepting(null);
    }
  };

  const handleSkip = (matchId) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all animate-bounce-once">
          {toast}
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>🌿</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
              <p className="text-sm text-gray-500">People who understand what you're going through</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6"
              style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
              🔍
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Searching for your people</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              We're finding peers who share your experiences. This usually takes a few minutes.
            </p>
            <button
              onClick={fetchMatches}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              Refresh Matches
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{matches.length} match{matches.length !== 1 ? 'es' : ''} found</span>
              <button onClick={fetchMatches} className="text-xs text-purple-600 font-semibold hover:underline">Refresh</button>
            </div>
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onAccept={handleAccept}
                  onSkip={handleSkip}
                  accepting={accepting}
                />
              ))}
            </div>

            {/* Safety note */}
            <div className="mt-6 flex items-start gap-2 bg-white rounded-2xl border border-gray-100 p-4">
              <span className="text-lg shrink-0">🔒</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                All matches are anonymous until both of you choose to connect. Your personal details are never shared without consent.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
