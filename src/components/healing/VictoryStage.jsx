import React from 'react';

export default function VictoryStage({ problemType, matchName, onRestart }) {
  return (
    <div className="animate-fadeIn text-center py-8">
      <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
      <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>You did it.</h2>
      <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
        You showed up for yourself today.
      </p>
      <p className="text-sm mb-8 italic" style={{ color: 'var(--text-muted)' }}>
        That is never small. That is everything.
      </p>

      <div className="rounded-2xl p-6 mb-8 text-left"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(124,58,237,0.06))', border: '1px solid rgba(212,175,55,0.25)' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#d4af37' }}>✦ Your healing today</p>
        <ul className="space-y-2">
          {[
            '🪞 You looked at yourself honestly',
            '🧭 You explored what you carry',
            '🔄 You chose a new perspective',
            '⚡ You took one real action',
          ].map((item, i) => (
            <li key={i} className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Come back tomorrow. Every day you return is a victory.
      </p>

      <button onClick={onRestart}
        className="w-full py-3 rounded-xl font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #d4af37)' }}>
        Begin Again Tomorrow ✦
      </button>
    </div>
  );
}
