import React, { useState } from 'react';

const ACTIVITIES_BY_PROBLEM = {
  'anxiety': [
    { emoji: '🫁', name: '4-7-8 Breathing', time: '5 min', benefit: 'Calm nervous system' },
    { emoji: '🚿', name: 'Cold Shower', time: '2 min', benefit: 'Reset body' },
    { emoji: '🧘', name: 'Progressive Relaxation', time: '10 min', benefit: 'Release tension' },
    { emoji: '🌳', name: 'Walk in Nature', time: '15 min', benefit: 'Serotonin' },
  ],
  'depression': [
    { emoji: '🚶', name: 'Take a Walk', time: '20 min', benefit: 'Dopamine boost' },
    { emoji: '🐕', name: 'Pet Interaction', time: '10 min', benefit: 'Oxytocin' },
    { emoji: '🙏', name: 'Gratitude List', time: '5 min', benefit: 'Shift perspective' },
    { emoji: '✅', name: 'Do One Small Task', time: '5-15 min', benefit: 'Achievement dopamine' },
  ],
  'ocd_intrusive_thoughts': [
    { emoji: '🧠', name: 'Thought Noting Exercise', time: '10 min', benefit: 'Observe without judgment' },
    { emoji: '📝', name: 'Write Out Thoughts', time: '15 min', benefit: 'Externalize intrusions' },
    { emoji: '🚶', name: 'Physical Movement', time: '15 min', benefit: 'Interrupt thought loops' },
    { emoji: '🎵', name: 'Listen to Music', time: '10 min', benefit: 'Change mental focus' },
  ],
  'ptsd_trauma': [
    { emoji: '🫁', name: 'Grounding Breathing', time: '5 min', benefit: 'Return to present' },
    { emoji: '5️⃣', name: '5 Senses Grounding', time: '5 min', benefit: 'Anchor to reality' },
    { emoji: '🧊', name: 'Ice or Cold Water', time: '1 min', benefit: 'Nervous system reset' },
    { emoji: '🤗', name: 'Safe Person Call', time: '10 min', benefit: 'Restore safety' },
  ],
  'phobias': [
    { emoji: '✍️', name: 'Write Fear Out', time: '10 min', benefit: 'Reduce power of fear' },
    { emoji: '🫁', name: 'Controlled Breathing', time: '5 min', benefit: 'Calm panic response' },
    { emoji: '💪', name: 'Micro Exposure', time: '5 min', benefit: 'Small courage building' },
    { emoji: '🤝', name: 'Talk to Match', time: '10 min', benefit: 'Not alone in fear' },
  ],
  'panic_attacks': [
    { emoji: '🫁', name: '4-7-8 Breathing', time: '5 min', benefit: 'Calm panic' },
    { emoji: '❄️', name: 'Ice on Face', time: '30 sec', benefit: 'Vagus nerve reset' },
    { emoji: '🚶', name: 'Walk Grounding', time: '5-10 min', benefit: 'Bring back reality' },
    { emoji: '🧊', name: 'Hold Ice Cubes', time: '1 min', benefit: 'Sensory reset' },
  ],
  'self_harm': [
    { emoji: '🧊', name: 'Ice Cube Holding', time: '5 min', benefit: 'Safe sensory alternative' },
    { emoji: '✍️', name: 'Write It Out', time: '15 min', benefit: 'Express pain safely' },
    { emoji: '📞', name: 'Call Your Match', time: '10 min', benefit: 'Connection saves lives' },
    { emoji: '🚶', name: 'Walk Away', time: '10 min', benefit: 'Change environment' },
  ],
  'relationship_breakup': [
    { emoji: '🚶', name: 'Take a Walk', time: '10-20 min', benefit: 'Dopamine boost' },
    { emoji: '📞', name: 'Call a Friend', time: '10 min', benefit: 'Oxytocin (connection)' },
    { emoji: '✍️', name: 'Journal Your Feelings', time: '15 min', benefit: 'Process emotions' },
    { emoji: '🎨', name: 'Do Something Creative', time: '20 min', benefit: 'Channel pain' },
  ],
  'divorce': [
    { emoji: '💪', name: 'Strength Building', time: '15 min', benefit: 'Physical empowerment' },
    { emoji: '👥', name: 'Talk to Friend', time: '20 min', benefit: 'Support system' },
    { emoji: '🧘', name: 'Meditation', time: '10 min', benefit: 'Find peace' },
    { emoji: '📋', name: 'Plan One Good Thing', time: '10 min', benefit: 'Future hope' },
  ],
  'marriage_problems': [
    { emoji: '🫁', name: 'Breathing Space', time: '15 min', benefit: 'Reset emotions' },
    { emoji: '📝', name: "Write Letter (Don't Send)", time: '20 min', benefit: 'Express safely' },
    { emoji: '🚶', name: 'Separate Walk', time: '15 min', benefit: 'Clear your head' },
    { emoji: '🤝', name: 'Talk to Match', time: '15 min', benefit: 'Get perspective' },
  ],
  'family_relationships': [
    { emoji: '📞', name: 'Call Trusted Friend', time: '15 min', benefit: 'External perspective' },
    { emoji: '✍️', name: 'Express in Journal', time: '20 min', benefit: 'Release frustration' },
    { emoji: '🚶', name: 'Take Space', time: '20 min', benefit: 'Cool down' },
    { emoji: '💭', name: 'Reflect on Boundaries', time: '10 min', benefit: 'Self-protection' },
  ],
  'trust_issues': [
    { emoji: '🧘', name: 'Self Trust Meditation', time: '10 min', benefit: 'Reconnect with self' },
    { emoji: '📝', name: 'List Your Strengths', time: '10 min', benefit: 'Build confidence' },
    { emoji: '🤝', name: 'Talk to Trusted Match', time: '15 min', benefit: 'Rebuild safety' },
    { emoji: '✅', name: 'Keep Small Promise', time: '5 min', benefit: 'Prove to yourself' },
  ],
  'unrequited_love': [
    { emoji: '📝', name: 'Write It Out', time: '20 min', benefit: 'Process emotions' },
    { emoji: '🚶', name: 'Physical Activity', time: '20 min', benefit: 'Channel energy' },
    { emoji: '👥', name: 'Connect with Friends', time: '30 min', benefit: 'Redirect focus' },
    { emoji: '🎵', name: 'Listen to Empowering Music', time: '15 min', benefit: 'Change mood' },
  ],
  'loneliness': [
    { emoji: '📞', name: 'Call/Text Someone', time: '10 min', benefit: 'Connection' },
    { emoji: '🤝', name: 'Help Someone', time: '15-30 min', benefit: 'Purpose & connection' },
    { emoji: '👥', name: 'Join a Group Activity', time: '30 min', benefit: 'Belonging' },
    { emoji: '🐕', name: 'Pet Interaction', time: '15 min', benefit: 'Bonding' },
  ],
  'lack_of_confidence': [
    { emoji: '💪', name: 'Power Pose', time: '2 min', benefit: 'Instant confidence' },
    { emoji: '📝', name: 'List Your Wins', time: '10 min', benefit: 'Remember capability' },
    { emoji: '✅', name: 'Do One Hard Thing', time: '10 min', benefit: 'Build momentum' },
    { emoji: '🪞', name: 'Positive Self-Talk', time: '5 min', benefit: 'Rewire mind' },
  ],
  'bullying_harassment': [
    { emoji: '📞', name: 'Tell a Trusted Person', time: '15 min', benefit: 'Get support' },
    { emoji: '🚶', name: 'Walk Away', time: '15 min', benefit: 'Remove yourself' },
    { emoji: '💪', name: 'Physical Activity', time: '20 min', benefit: 'Release anger' },
    { emoji: '🎯', name: 'Plan Your Response', time: '15 min', benefit: 'Feel empowered' },
  ],
  'grief_loss': [
    { emoji: '😢', name: 'Let Yourself Cry', time: '15 min', benefit: 'Healthy processing' },
    { emoji: '📸', name: 'Remember the Good', time: '20 min', benefit: 'Celebrate their life' },
    { emoji: '🕯️', name: 'Light a Candle', time: '10 min', benefit: 'Honor memory' },
    { emoji: '👥', name: 'Share with Someone', time: '20 min', benefit: 'Community in grief' },
  ],
  'work_career_stress': [
    { emoji: '🚶', name: 'Walk Away', time: '15 min', benefit: 'Clear head' },
    { emoji: '🫁', name: 'Desk Breathing', time: '5 min', benefit: 'Instant calm' },
    { emoji: '💬', name: 'Talk It Out', time: '15 min', benefit: 'Get perspective' },
    { emoji: '✅', name: 'Small Win Task', time: '10 min', benefit: 'Regain control' },
  ],
  'financial_stress': [
    { emoji: '📝', name: 'Make a Plan', time: '20 min', benefit: 'Regain control' },
    { emoji: '💰', name: 'Find 1 Saving', time: '10 min', benefit: 'Quick win' },
    { emoji: '🤝', name: 'Talk to Match', time: '15 min', benefit: 'Not alone' },
    { emoji: '🧘', name: 'Breathe', time: '5 min', benefit: 'Calm anxiety' },
  ],
  'identity_sexual_orientation': [
    { emoji: '👥', name: 'Find Community', time: '30 min', benefit: "You're not alone" },
    { emoji: '📝', name: 'Journal Your Truth', time: '20 min', benefit: 'Self-discovery' },
    { emoji: '🤝', name: 'Talk to Trusted Person', time: '20 min', benefit: 'Support' },
    { emoji: '🎨', name: 'Express Authentically', time: '20 min', benefit: 'Be yourself' },
  ],
  'addiction_substance_abuse': [
    { emoji: '📞', name: 'Call Your Match', time: '10 min', benefit: 'Accountability' },
    { emoji: '🚶', name: 'Move Your Body', time: '20 min', benefit: 'Replace habit' },
    { emoji: '💪', name: 'One More Day', time: '1 min', benefit: 'Celebrate sobriety' },
    { emoji: '🤲', name: 'Ask for Help', time: '10 min', benefit: 'Humility & support' },
  ],
  'health_anxiety': [
    { emoji: '🫁', name: 'Calming Breath', time: '5 min', benefit: 'Reduce worry' },
    { emoji: '✍️', name: 'Write Down Fears', time: '10 min', benefit: 'Externalize' },
    { emoji: '🧘', name: 'Mindfulness', time: '10 min', benefit: 'Return to now' },
    { emoji: '🚶', name: 'Gentle Movement', time: '15 min', benefit: 'Feel alive' },
  ],
  'sleep_problems': [
    { emoji: '🧘', name: 'Bedtime Meditation', time: '10 min', benefit: 'Relax body' },
    { emoji: '🚶', name: 'Evening Walk', time: '20 min', benefit: 'Tire body' },
    { emoji: '📵', name: 'Phone Away', time: '30 min', benefit: 'Reset sleep hormone' },
    { emoji: '🫁', name: '4-7-8 Breathing', time: '5 min', benefit: 'Trigger sleep' },
  ],
  'eating_disorders': [
    { emoji: '💧', name: 'Drink Water', time: '5 min', benefit: 'Hydrate' },
    { emoji: '🚶', name: 'Walk After Meal', time: '15 min', benefit: 'Healthy habit' },
    { emoji: '📝', name: 'Journal Feelings', time: '15 min', benefit: 'Not food-focused' },
    { emoji: '🤝', name: 'Talk to Match', time: '20 min', benefit: 'Get support' },
  ],
  'anger_management': [
    { emoji: '💪', name: 'Intense Exercise', time: '15-20 min', benefit: 'Release anger safely' },
    { emoji: '❄️', name: 'Cold Water Splash', time: '1 min', benefit: 'Reset emotions' },
    { emoji: '📝', name: 'Write Angry Letter', time: '15 min', benefit: 'Release safely' },
    { emoji: '🫁', name: 'Breathing Space', time: '5 min', benefit: 'Regain control' },
  ],
};

export default function ActivitySuggestions({ problemType, matchName, onActivityComplete }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [feelingBefore, setFeelingBefore] = useState(null);
  const [feelingAfter, setFeelingAfter] = useState(null);
  const [completed, setCompleted] = useState(false);

  const activities = ACTIVITIES_BY_PROBLEM[problemType] || ACTIVITIES_BY_PROBLEM['anxiety'];

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setFeelingBefore(null);
    setFeelingAfter(null);
    setCompleted(false);
  };

  const handleBeforeFeel = (rating) => {
    setFeelingBefore(rating);
  };

  const handleAfterFeel = (rating) => {
    setFeelingAfter(rating);
    setCompleted(true);
    if (onActivityComplete) {
      onActivityComplete({
        activity: selectedActivity.name,
        beforeFeel: feelingBefore,
        afterFeel: rating,
        improvement: rating - feelingBefore,
      });
    }
  };

  if (completed && selectedActivity && feelingAfter !== null) {
    const improvement = feelingAfter - feelingBefore;
    return (
      <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 mb-4">
        <div className="text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-green-700 mb-1">You Did It!</h3>
          <p className="text-green-600 text-sm mb-4">{selectedActivity.emoji} {selectedActivity.name}</p>

          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Before</p>
              <p className="text-2xl font-bold text-red-500">{feelingBefore}/10</p>
            </div>
            <div className="text-gray-400 text-xl">→</div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">After</p>
              <p className="text-2xl font-bold text-green-600">{feelingAfter}/10</p>
            </div>
          </div>

          <p className="text-sm font-semibold mb-4" style={{ color: improvement > 0 ? '#15803d' : improvement === 0 ? '#374151' : '#1d4ed8' }}>
            {improvement > 0 ? `✅ +${improvement} points better!` : improvement === 0 ? '💪 You took action. That matters.' : '🌱 Keep going. You\'ve got this.'}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const msg = improvement > 0
                  ? `I just did "${selectedActivity.name}" and felt ${improvement} points better! ${feelingBefore}→${feelingAfter} 💪`
                  : `I tried "${selectedActivity.name}" — taking steps to feel better 💪`;
                navigator.clipboard.writeText(msg);
              }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              Copy to Chat
            </button>
            <button
              onClick={() => { setSelectedActivity(null); setCompleted(false); }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">
              Try Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedActivity) {
    return (
      <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 mb-4">
        <button onClick={() => setSelectedActivity(null)} className="text-xs text-purple-500 hover:text-purple-700 mb-3 flex items-center gap-1">
          ← Back to activities
        </button>
        <h3 className="text-base font-bold text-purple-800 mb-1">
          {selectedActivity.emoji} {selectedActivity.name}
        </h3>
        <p className="text-xs text-purple-600 mb-4">{selectedActivity.time} · {selectedActivity.benefit}</p>

        {feelingBefore === null ? (
          <>
            <p className="text-sm font-semibold text-gray-700 mb-3">How are you feeling right now? <span className="text-gray-400 font-normal">(1 = worst, 10 = best)</span></p>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} onClick={() => handleBeforeFeel(n)}
                  className="w-9 h-9 rounded-lg font-bold text-sm border-2 border-purple-200 bg-white text-purple-600 hover:bg-purple-100 transition-all">
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">Rate yourself, then do the activity, then rate again to see your progress.</p>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl px-3 py-2 mb-4 text-sm text-gray-600 border border-purple-100">
              Before: <strong className="text-purple-700">{feelingBefore}/10</strong> ✓ — now go do the activity!
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Done? How do you feel NOW?</p>
            <div className="flex gap-1.5 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} onClick={() => handleAfterFeel(n)}
                  className="w-9 h-9 rounded-lg font-bold text-sm border-2 border-green-200 bg-white text-green-600 hover:bg-green-100 transition-all">
                  {n}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-100 overflow-hidden mb-4"
      style={{ background: 'linear-gradient(135deg, #faf5ff, #eff6ff)' }}>
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">💡</span>
          <h3 className="text-sm font-bold text-purple-800">Quick Relief Activity</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Try one — then rate how you feel before & after</p>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {activities.map((activity, idx) => (
          <button key={idx} onClick={() => handleActivitySelect(activity)}
            className="w-full bg-white border border-purple-100 rounded-xl p-3 text-left hover:border-purple-300 hover:shadow-sm transition-all flex items-center gap-3">
            <span className="text-xl shrink-0">{activity.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{activity.name}</p>
              <p className="text-xs text-gray-500">{activity.time} · {activity.benefit}</p>
            </div>
            <span className="text-purple-300 text-sm shrink-0">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
