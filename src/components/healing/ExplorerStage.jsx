import React, { useState } from 'react';

const INSIGHTS = {
  anxiety: [
    { icon: '🧠', title: 'Your nervous system is protecting you', body: 'Anxiety is your brain\'s alarm system working overtime. It\'s not weakness — it\'s your body trying to keep you safe.' },
    { icon: '🌊', title: 'Feelings are waves, not walls', body: 'Every anxious feeling peaks and then passes. You have survived every difficult moment so far — 100% success rate.' },
    { icon: '🌬️', title: 'The breath is always available', body: 'Slow exhales activate your parasympathetic nervous system, calming the alarm. You carry your medicine with you.' },
  ],
  depression: [
    { icon: '🌱', title: 'Depression lies to you', body: 'It tells you nothing will change and nothing matters. But depression is a state, not a fact. States change.' },
    { icon: '🔋', title: 'Low energy is a symptom, not a character flaw', body: 'Depression depletes neurotransmitters. Rest is not laziness — it\'s medicine.' },
    { icon: '🤝', title: 'Connection is the antidote', body: 'Isolation feeds depression. You reaching out here is one of the bravest things you can do.' },
  ],
  loneliness: [
    { icon: '🌍', title: 'Loneliness is universal', body: 'Millions of people feel exactly as you do right now. You are alone in your room, but not alone in your experience.' },
    { icon: '💡', title: 'Quality over quantity', body: 'One deep connection heals more than a hundred shallow ones. You don\'t need more people — you need the right ones.' },
    { icon: '🪴', title: 'Start with yourself', body: 'The relationship with yourself is the foundation. When you feel at home within yourself, loneliness softens.' },
  ],
  default: [
    { icon: '💜', title: 'You are not broken', body: 'Whatever you\'re going through, it does not define your worth. You are a whole person having a hard time.' },
    { icon: '🌿', title: 'Healing is not linear', body: 'There will be good days and hard days. Both are part of the journey. Progress is not always visible.' },
    { icon: '✨', title: 'You have survived before', body: 'Look back at every hard thing you have faced. You are still here. That is evidence of your strength.' },
  ],
};

export default function ExplorerStage({ problemType, onComplete }) {
  const [read, setRead] = useState([]);
  const insights = INSIGHTS[problemType] || INSIGHTS.default;

  const toggle = (i) => setRead(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🧭</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Explorer</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Understand what you're carrying and why.</p>
      </div>

      <div className="space-y-3 mb-6">
        {insights.map((ins, i) => (
          <div key={i} onClick={() => toggle(i)}
            className="rounded-2xl p-5 cursor-pointer transition-all"
            style={{
              background: read.includes(i) ? 'rgba(124,58,237,0.08)' : 'var(--bg-card)',
              border: `1px solid ${read.includes(i) ? 'rgba(124,58,237,0.35)' : 'var(--border)'}`,
            }}>
            <div className="flex items-start gap-3">
              <span style={{ fontSize: 24 }}>{ins.icon}</span>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{ins.title}</p>
                {read.includes(i) && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ins.body}</p>
                )}
              </div>
              <span className="ml-auto shrink-0" style={{ color: 'var(--text-muted)' }}>{read.includes(i) ? '▲' : '▼'}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete({ stage: 'explorer', read })}
        disabled={read.length === 0}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #0891b2, #6d28d9)' }}>
        I understand more now →
      </button>
    </div>
  );
}
