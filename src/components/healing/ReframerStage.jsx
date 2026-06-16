import React, { useState } from 'react';

const REFRAMES = {
  anxiety: [
    { negative: 'I can\'t stop worrying', reframe: 'I care deeply about things that matter to me' },
    { negative: 'Something bad will happen', reframe: 'I am preparing — and I can handle what comes' },
    { negative: 'I\'m going to embarrass myself', reframe: 'I am willing to try, and that takes courage' },
  ],
  depression: [
    { negative: 'Nothing will ever change', reframe: 'I am in a difficult season, and seasons change' },
    { negative: 'I am a burden', reframe: 'I deserve care just as I would give to someone I love' },
    { negative: 'I can\'t do anything right', reframe: 'I am doing the best I can with what I have right now' },
  ],
  loneliness: [
    { negative: 'Nobody wants to be around me', reframe: 'I haven\'t found my people yet — they exist' },
    { negative: 'I\'ll always be alone', reframe: 'I am building the capacity for deep connection' },
    { negative: 'Something is wrong with me', reframe: 'I am sensitive and searching for real connection' },
  ],
  default: [
    { negative: 'I am broken', reframe: 'I am healing — and healing takes time' },
    { negative: 'I can\'t handle this', reframe: 'I am handling this, one moment at a time' },
    { negative: 'I will never feel better', reframe: 'I have felt different before and I will again' },
  ],
};

export default function ReframerStage({ problemType, onComplete }) {
  const [chosen, setChosen] = useState(null);
  const reframes = REFRAMES[problemType] || REFRAMES.default;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Reframer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Choose a thought to rewrite. Tap to flip it.</p>
      </div>

      <div className="space-y-4 mb-6">
        {reframes.map((r, i) => (
          <div key={i} onClick={() => setChosen(chosen === i ? null : i)}
            className="rounded-2xl p-5 cursor-pointer transition-all"
            style={{
              background: chosen === i ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
              border: `1px solid ${chosen === i ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
            }}>
            <div className="flex items-center gap-3 mb-2">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{r.negative}</span>
            </div>
            {chosen === i && (
              <div className="flex items-start gap-2 mt-2">
                <span style={{ color: '#10b981', fontSize: 16 }}>✦</span>
                <p className="font-semibold text-sm leading-relaxed" style={{ color: '#10b981' }}>{r.reframe}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete({ stage: 'reframer', chosen: chosen !== null ? reframes[chosen] : null })}
        disabled={chosen === null}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>
        I choose a new perspective →
      </button>
    </div>
  );
}
