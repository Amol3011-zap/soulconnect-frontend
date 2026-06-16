import React, { useState } from 'react';

const ACTIONS = {
  anxiety: [
    { icon: '🌬️', title: '4-7-8 Breathing', desc: 'Inhale 4s · Hold 7s · Exhale 8s · Repeat 3 times', minutes: 3 },
    { icon: '🖐️', title: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 hear, 3 touch, 2 smell, 1 taste', minutes: 5 },
    { icon: '✍️', title: 'Worry Dump', desc: 'Write every worry in one go. Then close the notebook.', minutes: 5 },
    { icon: '🚶', title: 'Walk Outside', desc: '10 minutes of walking without your phone. Notice the world.', minutes: 10 },
  ],
  depression: [
    { icon: '🌞', title: 'Sunlight Check-in', desc: 'Stand near a window or step outside for 5 minutes', minutes: 5 },
    { icon: '💧', title: 'Hydrate & Eat', desc: 'Drink a full glass of water. Eat something, even small.', minutes: 5 },
    { icon: '📞', title: 'Text One Person', desc: 'Send one message to someone. Just "thinking of you" is enough.', minutes: 2 },
    { icon: '🛏️', title: 'Body Scan Rest', desc: 'Lie down and slowly relax each part of your body', minutes: 10 },
  ],
  loneliness: [
    { icon: '💌', title: 'Write a letter', desc: 'Write to someone you miss — you don\'t have to send it.', minutes: 10 },
    { icon: '☕', title: 'Café presence', desc: 'Go somewhere with people. Order a drink. Just exist with others.', minutes: 30 },
    { icon: '🎵', title: 'Share a song', desc: 'Send someone a song that made you think of them.', minutes: 2 },
    { icon: '🌿', title: 'Tend to something living', desc: 'Water a plant. Feed a bird. Connection starts small.', minutes: 5 },
  ],
  default: [
    { icon: '🧘', title: 'One Minute Breathe', desc: 'Close your eyes. Breathe slowly for 60 seconds.', minutes: 1 },
    { icon: '✍️', title: 'Gratitude note', desc: 'Write 3 things — however small — that are okay right now.', minutes: 5 },
    { icon: '🚿', title: 'Reset your body', desc: 'Splash cold water on your face. Change what you can.', minutes: 2 },
    { icon: '📵', title: 'Phone down, 10 min', desc: 'Put your phone face-down. Be with yourself.', minutes: 10 },
  ],
};

export default function ActionStage({ problemType, onComplete }) {
  const [done, setDone] = useState(null);
  const actions = ACTIONS[problemType] || ACTIONS.default;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Action</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Pick one thing. Do it now. Small steps heal.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {actions.map((a, i) => (
          <div key={i} onClick={() => setDone(i)}
            className="rounded-2xl p-4 cursor-pointer transition-all"
            style={{
              background: done === i ? 'rgba(245,158,11,0.1)' : 'var(--bg-card)',
              border: `1px solid ${done === i ? '#f59e0b' : 'var(--border)'}`,
            }}>
            <span style={{ fontSize: 28 }}>{a.icon}</span>
            <p className="font-semibold text-sm mt-2 mb-1" style={{ color: 'var(--text)' }}>{a.title}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.desc}</p>
            <p className="mt-2 text-xs font-semibold" style={{ color: '#f59e0b' }}>{a.minutes} min</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete({ stage: 'action', chosen: done !== null ? actions[done] : null })}
        disabled={done === null}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #d97706, #dc2626)' }}>
        I did it ✓
      </button>
    </div>
  );
}
