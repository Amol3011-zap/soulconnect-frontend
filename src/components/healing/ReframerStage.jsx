import React, { useState } from 'react';

const REFRAMES = {
  anxiety: [
    { negative: 'I can\'t stop worrying', reframe: 'I care deeply about things that matter to me — worry is love without direction' },
    { negative: 'Something bad will happen', reframe: 'I am preparing my mind, and I am stronger than I believe' },
    { negative: 'I\'m going to embarrass myself', reframe: 'I am willing to try, and that courage is worth more than perfection' },
    { negative: 'I can\'t control anything', reframe: 'I can control my breath, my response, and this moment' },
    { negative: 'My anxiety is a weakness', reframe: 'My sensitivity is a superpower — I feel what others miss' },
  ],
  depression: [
    { negative: 'Nothing will ever change', reframe: 'I am in a difficult season, not a permanent state — seasons always shift' },
    { negative: 'I am a burden to everyone', reframe: 'The people who love me want to carry this with me, not for me' },
    { negative: 'I can\'t do anything right', reframe: 'I am doing the hardest thing — showing up — and that is everything' },
    { negative: 'I don\'t deserve to feel better', reframe: 'I deserve healing as much as anyone I have ever cared for' },
    { negative: 'I\'ve always been this way', reframe: 'I have changed before in ways I couldn\'t predict — I can again' },
  ],
  loneliness: [
    { negative: 'Nobody wants to be around me', reframe: 'I haven\'t found my people yet — and they are looking for me too' },
    { negative: 'I\'ll always be alone', reframe: 'I am building the inner richness that makes deep connection possible' },
    { negative: 'Something is wrong with me', reframe: 'I am deeply human — longing for connection is proof of my capacity to love' },
    { negative: 'Everyone else has people, I don\'t', reframe: 'Many people hide their loneliness — I am brave enough to feel mine' },
    { negative: 'I\'m invisible to others', reframe: 'I haven\'t been truly seen yet — but I am worth seeing' },
  ],
  anger_management: [
    { negative: 'They had no right to do that', reframe: 'I have every right to feel this — and also the power to choose my response' },
    { negative: 'I always lose control', reframe: 'I have controlled myself in harder moments than this — I can learn this' },
    { negative: 'I\'m an angry person', reframe: 'I am a passionate person whose pain is speaking loudly right now' },
    { negative: 'People keep disrespecting me', reframe: 'I am learning to set boundaries that teach people how to treat me' },
    { negative: 'I ruined everything with my anger', reframe: 'I can repair what was broken — owning it is already the first step' },
  ],
  marriage_problems: [
    { negative: 'We\'ve grown too far apart', reframe: 'Distance means there is space to come back — many couples have crossed this' },
    { negative: 'They don\'t understand me at all', reframe: 'We may have stopped trying to understand — and trying can start today' },
    { negative: 'This marriage is a mistake', reframe: 'Every marriage goes through seasons where the seed must be replanted' },
    { negative: 'I give more than I receive', reframe: 'I am showing me the kind of love I want — and I can ask for it in return' },
    { negative: 'We can\'t communicate anymore', reframe: 'Communication is a skill, not a talent — it can be rebuilt' },
  ],
  grief_loss: [
    { negative: 'I will never be okay again', reframe: 'I won\'t be the same — I will be someone who has loved deeply and survived' },
    { negative: 'I should have done more', reframe: 'I loved with what I had at the time — that is all any of us can do' },
    { negative: 'Life is meaningless without them', reframe: 'They gave my life meaning — and that meaning doesn\'t die with them' },
    { negative: 'I shouldn\'t still be this sad', reframe: 'Grief has no timeline — loving deeply means mourning deeply' },
    { negative: 'Moving on feels like betrayal', reframe: 'Healing is not forgetting — it is carrying them forward with me' },
  ],
  relationship_breakup: [
    { negative: 'I will never love or be loved like that again', reframe: 'I loved that deeply once — that capacity lives in me, not in them' },
    { negative: 'I am unlovable', reframe: 'One person ending a relationship is not a verdict on my worth' },
    { negative: 'I wasted years of my life', reframe: 'Those years shaped who I am — and I needed to become this person' },
    { negative: 'I\'m not enough for anyone', reframe: 'I am not for everyone — I am searching for the one who sees my enough' },
    { negative: 'I\'ll never trust again', reframe: 'My heart broke because it was open — I can open it again, more wisely' },
  ],
  work_career_stress: [
    { negative: 'I\'m failing at my job', reframe: 'I am struggling in a hard situation — that is different from being a failure' },
    { negative: 'I\'ll never reach my goals', reframe: 'My timeline is not wrong — it is mine' },
    { negative: 'I\'m not as good as others', reframe: 'I am comparing my inside to their outside — I don\'t know their full story' },
    { negative: 'My work has no meaning', reframe: 'I may be in the wrong role — and that is information, not a life sentence' },
    { negative: 'I can\'t say no or I\'ll lose everything', reframe: 'Saying yes to everything is already costing me everything' },
  ],
  financial_stress: [
    { negative: 'I\'ll never be financially stable', reframe: 'I am in a hard chapter, not a permanent state — chapters end' },
    { negative: 'Money problems mean I\'m a failure', reframe: 'Financial struggle is a circumstance — not a character flaw' },
    { negative: 'I\'m always going to be poor', reframe: 'I am building financial wisdom through the hardest kind of school' },
    { negative: 'I can\'t provide for people I love', reframe: 'I am doing what I can — and presence is a provision money can\'t buy' },
    { negative: 'Everyone else has it figured out', reframe: 'Most people are quietly struggling — I am brave enough to face mine' },
  ],
  panic_attacks: [
    { negative: 'I\'m dying during a panic attack', reframe: 'My body is sounding an alarm that is misfiring — I am completely safe' },
    { negative: 'I\'m losing my mind', reframe: 'My mind is overprotecting me — that is not madness, it is survival mode' },
    { negative: 'I can\'t go anywhere in case I panic', reframe: 'I have survived every panic attack I have ever had — 100% success rate' },
    { negative: 'I am weak because I panic', reframe: 'Panic attacks happen to some of the most feeling, caring people alive' },
    { negative: 'I\'ll panic forever', reframe: 'Panic is a learned response — and what is learned can be unlearned' },
  ],
  ptsd_trauma: [
    { negative: 'I am damaged beyond repair', reframe: 'I am wounded, not broken — wounds heal when given the right conditions' },
    { negative: 'I will never feel safe', reframe: 'Safety is something I can rebuild, one small moment of calm at a time' },
    { negative: 'What happened is all I am', reframe: 'What happened is something that happened to me — it is not who I am' },
    { negative: 'I should be over it by now', reframe: 'Trauma has its own timeline — and my nervous system is doing its best' },
    { negative: 'Nobody understands what I carry', reframe: 'My experience is unique — and there are people trained to walk with me in it' },
  ],
  lack_of_confidence: [
    { negative: 'I\'m not good enough', reframe: 'I am exactly enough to begin — confidence comes after the first step, not before' },
    { negative: 'Everyone else is better than me', reframe: 'I am only seeing their highlights — everyone has hidden struggles' },
    { negative: 'I\'ll make a fool of myself', reframe: 'Everyone who is skilled now was once a beginner who risked looking foolish' },
    { negative: 'I don\'t have what it takes', reframe: 'I don\'t have it yet — "yet" is the most powerful word in self-belief' },
    { negative: 'I\'ve always been insecure', reframe: 'Insecurity is something that was taught to me — and I can unlearn it' },
  ],
  sleep_problems: [
    { negative: 'I\'ll never sleep normally again', reframe: 'My sleep rhythm is disrupted, not destroyed — rhythms can be restored' },
    { negative: 'Lying awake means tomorrow is ruined', reframe: 'Rest without sleep still restores my body — being still has value' },
    { negative: 'My mind won\'t let me sleep', reframe: 'My mind is trying to solve something — I can give it a safe container and rest' },
    { negative: 'I\'ve tried everything and nothing works', reframe: 'I haven\'t found my specific solution yet — it exists' },
    { negative: 'I\'m not like normal sleepers', reframe: 'Sleep struggles are among the most common human experiences — I am not alone' },
  ],
  family_relationships: [
    { negative: 'My family will never change', reframe: 'I cannot change them — but I can change how I show up and what I accept' },
    { negative: 'They don\'t love me the way I need', reframe: 'They may love me in the only way they know — and I can ask for what I need' },
    { negative: 'I\'m the problem in my family', reframe: 'Family pain is systemic — I may be the one feeling it most, not causing it most' },
    { negative: 'I have to fix everyone', reframe: 'I am not responsible for everyone\'s healing — only my own' },
    { negative: 'I owe them everything, I can\'t disappoint them', reframe: 'I honour them best by becoming whole — not by sacrificing my wellbeing' },
  ],
  ocd_intrusive_thoughts: [
    { negative: 'These thoughts mean something is wrong with me', reframe: 'Intrusive thoughts are a feature of a highly active mind, not a moral failing' },
    { negative: 'I must neutralise every bad thought', reframe: 'Fighting the thought gives it power — I can let it pass like a cloud' },
    { negative: 'I am my worst thoughts', reframe: 'Having a thought is not the same as being that thought — I am the observer' },
    { negative: 'I have no control over my mind', reframe: 'I can learn to relate to my mind differently — without obeying every alarm' },
    { negative: 'I\'ll always live like this', reframe: 'OCD is highly treatable — many people with these patterns have found freedom' },
  ],
  trust_issues: [
    { negative: 'Everyone will betray me eventually', reframe: 'Some people will — and I am learning to recognise who is safe' },
    { negative: 'I can\'t let anyone get close', reframe: 'Protection served me once — now I can choose when to lower the shield' },
    { negative: 'I am too broken to be loved properly', reframe: 'My wounds make me deep — the right person will not be frightened by my depth' },
    { negative: 'Trusting someone is naive', reframe: 'Trust with discernment is wisdom, not naivety — I can learn the difference' },
    { negative: 'I\'ll always attract people who hurt me', reframe: 'As I heal, I change what I attract and what I accept — this is already shifting' },
  ],
  default: [
    { negative: 'I am broken', reframe: 'I am healing — and healing is not a linear path, but it is happening' },
    { negative: 'I can\'t handle this', reframe: 'I am handling this right now — even reading this is handling it' },
    { negative: 'I will never feel better', reframe: 'I have felt different before and I will feel different again' },
    { negative: 'I am alone in this', reframe: 'Millions of people have felt exactly what I feel — I am in human company' },
    { negative: 'This defines me', reframe: 'This is happening to me — it is not who I am' },
  ],
};

export default function ReframerStage({ problemType, onComplete }) {
  const [chosen, setChosen] = useState(null);
  const [flipped, setFlipped] = useState({});
  const reframes = REFRAMES[problemType] || REFRAMES.default;

  const handleTap = (i) => {
    setFlipped(prev => ({ ...prev, [i]: !prev[i] }));
    setChosen(i);
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div style={{ fontSize: 52, marginBottom: 12 }}>🔄</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Reframer</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Tap a thought to see it differently.</p>
      </div>

      <div className="space-y-3 mb-6">
        {reframes.map((r, i) => (
          <div
            key={i}
            onClick={() => handleTap(i)}
            className="rounded-2xl p-4 cursor-pointer transition-all"
            style={{
              background: flipped[i] ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
              border: `1px solid ${flipped[i] ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
            }}
          >
            {!flipped[i] ? (
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', opacity: 0.7 }}>
                  "{r.negative}"
                </p>
                <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 8, whiteSpace: 'nowrap' }}>tap ↺</span>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <span style={{ color: '#10b981', fontSize: 18, marginTop: 1 }}>✦</span>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: '#10b981' }}>
                  {r.reframe}
                </p>
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
