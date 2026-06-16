import React from 'react';

export default function GuidedHealing({ problemType, matchName, userId }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🌟</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Guided Healing</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Coming soon — personalised healing journeys.</p>
    </div>
  );
}
