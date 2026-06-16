import React, { useState } from 'react';
import MirrorStage from './healing/MirrorStage';
import ExplorerStage from './healing/ExplorerStage';
import ReframerStage from './healing/ReframerStage';
import ActionStage from './healing/ActionStage';
import VictoryStage from './healing/VictoryStage';

const STAGES = ['mirror', 'explorer', 'reframer', 'action', 'victory'];
const STAGE_LABELS = ['Mirror', 'Explorer', 'Reframer', 'Action', 'Victory'];
const STAGE_ICONS = ['🪞', '🧭', '🔄', '⚡', '🏆'];

export default function GuidedHealing({ problemType, matchName, userId }) {
  const [stage, setStage] = useState(0);
  const [results, setResults] = useState([]);

  const handleComplete = (data) => {
    setResults(prev => [...prev, data]);
    setStage(prev => prev + 1);
  };

  const handleRestart = () => {
    setStage(0);
    setResults([]);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>

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
      {stage === 0 && <MirrorStage problemType={problemType} onComplete={handleComplete} />}
      {stage === 1 && <ExplorerStage problemType={problemType} onComplete={handleComplete} />}
      {stage === 2 && <ReframerStage problemType={problemType} onComplete={handleComplete} />}
      {stage === 3 && <ActionStage problemType={problemType} onComplete={handleComplete} />}
      {stage === 4 && <VictoryStage problemType={problemType} matchName={matchName} onRestart={handleRestart} />}
    </div>
  );
}
