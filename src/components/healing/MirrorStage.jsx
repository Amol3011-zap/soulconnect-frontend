import React, { useState } from 'react';

const MIRROR_DATA = {
  anxiety: {
    emoji: '🌀',
    prompt: 'What does your anxiety feel like right now? Where do you feel it in your body? Describe it without judgment.',
    followUp: 'When did this anxious feeling start? What triggered it today?',
  },
  depression: {
    emoji: '🌧️',
    prompt: 'What has been weighing on your heart lately? What feels heaviest right now — even if it\'s hard to name?',
    followUp: 'What did you used to enjoy that feels distant now? Can you remember the last time you felt a flicker of lightness?',
  },
  loneliness: {
    emoji: '🕊️',
    prompt: 'When did you last feel truly connected to someone? What does loneliness feel like for you — not the definition, but your experience of it?',
    followUp: 'Is there someone you wish would reach out to you right now? What would you want them to say?',
  },
  anger_management: {
    emoji: '🔥',
    prompt: 'What made you angry recently? Describe the situation fully — don\'t hold back. This is a safe space.',
    followUp: 'Beneath the anger — what was the feeling underneath? Fear? Hurt? Disrespect? Helplessness?',
  },
  marriage_problems: {
    emoji: '💑',
    prompt: 'What does your relationship feel like right now — honestly? Not what you tell others, but what you feel when you\'re alone with your thoughts.',
    followUp: 'What do you miss most about the connection you once had, or the one you hoped for?',
  },
  grief_loss: {
    emoji: '🕯️',
    prompt: 'What do you miss most? Allow yourself to feel it fully as you write. There is no wrong way to grieve.',
    followUp: 'What would you want to say to the person or thing you\'ve lost, if you could?',
  },
  relationship_breakup: {
    emoji: '💔',
    prompt: 'What hurts the most right now? Is it the person, the future you imagined, or something else entirely?',
    followUp: 'What part of yourself feels lost in this? What did that relationship represent for you?',
  },
  work_career_stress: {
    emoji: '⚡',
    prompt: 'What about work is draining you most right now? Be specific — is it the people, the pressure, the lack of meaning, or something else?',
    followUp: 'What does your ideal work life look like? What would need to change for you to feel okay?',
  },
  financial_stress: {
    emoji: '💸',
    prompt: 'What is your biggest financial fear right now? Write it out completely — the specific worry, not the general stress.',
    followUp: 'How is money stress affecting other areas of your life — sleep, relationships, self-worth?',
  },
  panic_attacks: {
    emoji: '💓',
    prompt: 'Describe what happens during a panic attack for you — the first sign, the peak, the aftermath. What does it feel like from inside?',
    followUp: 'What are you most afraid of during a panic attack? What do you think will happen?',
  },
  ptsd_trauma: {
    emoji: '🌿',
    prompt: 'You don\'t have to describe the event. Instead — what does living with this feel like day to day? What does it cost you?',
    followUp: 'In what moments do you feel most like yourself, despite everything you carry?',
  },
  lack_of_confidence: {
    emoji: '🌱',
    prompt: 'In what area of your life do you feel most uncertain about yourself? What does that inner critical voice say to you?',
    followUp: 'When did you first start believing you weren\'t enough? Can you trace it back?',
  },
  sleep_problems: {
    emoji: '🌙',
    prompt: 'What happens when you try to sleep? Describe your experience — the thoughts, the body sensations, the frustration.',
    followUp: 'What are you most afraid of when you lie awake? What does your mind keep returning to?',
  },
  family_relationships: {
    emoji: '🏡',
    prompt: 'Which family relationship feels the most painful or complicated right now? What do you wish could be different?',
    followUp: 'What do you wish your family understood about you that they don\'t seem to see?',
  },
  ocd_intrusive_thoughts: {
    emoji: '🔄',
    prompt: 'What kind of intrusive thoughts bother you most? You don\'t need to be specific — just describe how they make you feel and what you do in response.',
    followUp: 'What would your life look like if these thoughts had less power over you?',
  },
  trust_issues: {
    emoji: '🤝',
    prompt: 'What does it feel like for you when you try to trust someone? What happens inside you — the fear, the barriers?',
    followUp: 'Who taught you not to trust? What happened that made trust feel dangerous?',
  },
  default: {
    emoji: '🪞',
    prompt: 'What brought you here today? Write freely — what\'s really going on beneath the surface?',
    followUp: 'What are you most afraid to admit, even to yourself, about what you\'re going through?',
  },
};

export default function MirrorStage({ problemType, onComplete }) {
  const [reflection, setReflection] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const data = MIRROR_DATA[problemType] || MIRROR_DATA.default;

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div style={{ fontSize: 52, marginBottom: 12 }}>{data.emoji}</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Mirror</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>See yourself clearly, without judgment.</p>
      </div>

      <div className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-medium mb-4 italic leading-relaxed" style={{ color: 'var(--text)' }}>
          "{data.prompt}"
        </p>
        <textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          placeholder="Write freely — no one else will see this..."
          rows={5}
          className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none transition-colors"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: 1.6 }}
        />
        {reflection.length > 20 && !showFollowUp && (
          <button onClick={() => setShowFollowUp(true)}
            className="mt-3 text-xs font-semibold transition-colors"
            style={{ color: '#a855f7' }}>
            ✦ Go deeper →
          </button>
        )}
        {showFollowUp && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs italic mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              "{data.followUp}"
            </p>
            <textarea
              placeholder="Continue writing..."
              rows={3}
              className="w-full rounded-xl p-3 text-sm resize-none focus:outline-none"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
        )}
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
