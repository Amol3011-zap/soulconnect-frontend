import React, { useState } from 'react';

export default function MirrorStage({ problemType, onComplete }) {
  const [reflection, setReflection] = useState('');

  const prompts = {
    anxiety: 'What does your anxiety feel like right now? Describe it without judgment.',
    depression: 'What has been weighing on your heart lately?',
    loneliness: 'When did you last feel truly connected to someone?',
    grief_loss: 'What do you miss most? Allow yourself to feel it.',
    default: 'What brought you here today? Speak your truth.',
  };

  const prompt = prompts[problemType] || prompts.default;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🪞</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Mirror</h2>
        <p style={{ color: 'var(--text-secondary)' }}>See yourself clearly, without judgment.</p>
      </div>

      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-base font-medium mb-4 italic" style={{ color: 'var(--text)' }}>"{prompt}"</p>
        <textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder="Write freely — no one else will see this..."
          rows={5}
          className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      <button
        onClick={() => onComplete({ stage: 'mirror', reflection })}
        disabled={reflection.trim().length < 10}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        I've seen myself clearly →
      </button>
    </div>
  );
}
