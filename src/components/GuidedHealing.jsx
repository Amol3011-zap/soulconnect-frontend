import React, { useState } from 'react';
import MirrorStage from './healing/MirrorStage';
import ExplorerStage from './healing/ExplorerStage';
import ReframerStage from './healing/ReframerStage';
import ActionStage from './healing/ActionStage';
import VictoryStage from './healing/VictoryStage';

const STAGES = ['mirror', 'explorer', 'reframer', 'action', 'victory'];
const STAGE_LABELS = ['Mirror', 'Explorer', 'Reframer', 'Action', 'Victory'];
const STAGE_ICONS = ['🪞', '🧭', '🔄', '⚡', '🏆'];

const PROBLEM_OPTIONS = [
  { key: 'anxiety', emoji: '🌀', label: 'Anxiety' },
  { key: 'depression', emoji: '🌧️', label: 'Depression' },
  { key: 'loneliness', emoji: '🕊️', label: 'Loneliness' },
  { key: 'anger_management', emoji: '🔥', label: 'Anger' },
  { key: 'marriage_problems', emoji: '💑', label: 'Marriage' },
  { key: 'grief_loss', emoji: '🕯️', label: 'Grief & Loss' },
  { key: 'relationship_breakup', emoji: '💔', label: 'Breakup' },
  { key: 'work_career_stress', emoji: '⚡', label: 'Work Stress' },
  { key: 'financial_stress', emoji: '💸', label: 'Financial' },
  { key: 'panic_attacks', emoji: '💓', label: 'Panic Attacks' },
  { key: 'ptsd_trauma', emoji: '🌿', label: 'Trauma' },
  { key: 'lack_of_confidence', emoji: '🌱', label: 'Confidence' },
  { key: 'sleep_problems', emoji: '🌙', label: 'Sleep' },
  { key: 'family_relationships', emoji: '🏡', label: 'Family' },
  { key: 'ocd_intrusive_thoughts', emoji: '🔄', label: 'OCD' },
  { key: 'trust_issues', emoji: '🤝', label: 'Trust Issues' },
];

export default function GuidedHealing({ problemType, matchName, userId }) {
  const [stage, setStage] = useState(0);
  const [results, setResults] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(problemType || null);
  const [problemConfirmed, setProblemConfirmed] = useState(!!problemType && problemType !== 'anxiety');

  const handleComplete = (data) => {
    setResults(prev => [...prev, data]);
    setStage(prev => prev + 1);
  };

  const handleRestart = () => {
    setStage(0);
    setResults([]);
    setProblemConfirmed(false);
    setSelectedProblem(null);
  };

  const activeProblem = selectedProblem || 'default';

  // ── Problem picker ──────────────────────────────────────────────────────────
  if (!problemConfirmed) {
    return (
      <div className="animate-fadeIn" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="text-center mb-6">
          <div style={{ fontSize: 48, marginBottom: 10 }}>🌟</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>What are you healing today?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Choose the area you want to work on.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {PROBLEM_OPTIONS.map(p => (
            <button
              key={p.key}
              onClick={() => setSelectedProblem(p.key)}
              className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left transition-all"
              style={{
                background: selectedProblem === p.key ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                border: `1.5px solid ${selectedProblem === p.key ? '#7c3aed' : 'var(--border)'}`,
              }}>
              <span style={{ fontSize: 22 }}>{p.emoji}</span>
              <span className="text-sm font-semibold" style={{ color: selectedProblem === p.key ? '#a855f7' : 'var(--text)' }}>{p.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setProblemConfirmed(true)}
          disabled={!selectedProblem}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
          Begin My Healing Journey →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>

      {/* Problem badge + change link */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <span style={{ fontSize: 14 }}>{PROBLEM_OPTIONS.find(p => p.key === activeProblem)?.emoji || '🌟'}</span>
          <span className="text-xs font-semibold" style={{ color: '#a855f7' }}>
            {PROBLEM_OPTIONS.find(p => p.key === activeProblem)?.label || 'Healing'}
          </span>
        </div>
        {stage === 0 && (
          <button onClick={() => setProblemConfirmed(false)}
            className="text-xs underline transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-muted)' }}>
            change
          </button>
        )}
      </div>

      {/* Progress bar */}
      {stage < 5 && (
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STAGES.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: i < stage ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : i === stage ? 'rgba(124,58,237,0.15)' : 'var(--bg-subtle)',
                    border: i <= stage ? '2px solid #7c3aed' : '2px solid var(--border)',
                    color: i <= stage ? (i < stage ? 'white' : '#7c3aed') : 'var(--text-muted)',
                    fontSize: 16,
                  }}>
                  {i < stage ? '✓' : STAGE_ICONS[i]}
                </div>
                <span style={{ fontSize: 9, color: i === stage ? '#7c3aed' : 'var(--text-muted)', fontWeight: i === stage ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {STAGE_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'var(--bg-subtle)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(stage / 4) * 100}%`, background: 'linear-gradient(to right, #7c3aed, #a855f7)' }} />
          </div>
        </div>
      )}

      {/* Stage content */}
      {stage === 0 && <MirrorStage problemType={activeProblem} onComplete={handleComplete} />}
      {stage === 1 && <ExplorerStage problemType={activeProblem} onComplete={handleComplete} />}
      {stage === 2 && <ReframerStage problemType={activeProblem} onComplete={handleComplete} />}
      {stage === 3 && <ActionStage problemType={activeProblem} onComplete={handleComplete} />}
      {stage === 4 && <VictoryStage problemType={activeProblem} matchName={matchName} onRestart={handleRestart} />}
    </div>
  );
}
