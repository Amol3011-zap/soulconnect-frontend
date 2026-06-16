import React, { useState } from 'react';

const INSIGHTS = {
  anxiety: [
    { icon: '🧠', title: 'Your nervous system is protecting you', body: 'Anxiety is your brain\'s threat-detection system working overtime. It\'s not weakness — it\'s your body trying to keep you safe from a danger that isn\'t always real.' },
    { icon: '🌊', title: 'Feelings are waves, not walls', body: 'Every anxious feeling peaks and then passes. Research shows anxiety peaks within 10 minutes and begins to subside. You have survived every difficult moment so far — 100% success rate.' },
    { icon: '🌬️', title: 'The breath rewires your brain', body: 'Slow exhales (longer than your inhale) activate the parasympathetic nervous system — your body\'s "rest" mode. You carry your most powerful medicine with you at all times.' },
    { icon: '💡', title: 'Anxiety lies about probability', body: 'The anxious mind treats unlikely events as certain. Ask yourself: "What is the actual probability this happens?" Often the feared thing has a 1-2% chance of occurring.' },
  ],
  depression: [
    { icon: '🌱', title: 'Depression lies to you', body: 'It tells you nothing will change, nothing matters, and you are the problem. But depression is a state — not a fact. States change. You are not your depression.' },
    { icon: '🔋', title: 'Low energy is a symptom, not a flaw', body: 'Depression depletes serotonin, dopamine, and energy. Struggling to get out of bed is not laziness — it\'s biology. Rest is medicine, not failure.' },
    { icon: '🤝', title: 'Connection is the antidote', body: 'Isolation feeds depression. The act of reaching out — even a single message — creates a neurochemical change in your brain. You reaching out here is one of the bravest things you can do.' },
    { icon: '🌅', title: 'Tiny actions create momentum', body: 'You don\'t need to fix everything. One small act — making your bed, stepping outside, drinking water — creates a tiny win. Tiny wins stack. That\'s how people climb out.' },
  ],
  loneliness: [
    { icon: '🌍', title: 'Loneliness is universal', body: 'Millions of people feel exactly as you do right now — even people surrounded by others. You are alone in your room, but not alone in your experience.' },
    { icon: '💡', title: 'Quality over quantity', body: 'Research shows one deep, honest connection is more healing than twenty shallow ones. You don\'t need more people in your life — you need the right ones.' },
    { icon: '🪴', title: 'Start with yourself', body: 'The relationship you have with yourself sets the foundation for all others. When you feel at home within yourself, loneliness softens — because you\'re never entirely without company.' },
    { icon: '🔓', title: 'Loneliness is a signal, not a sentence', body: 'Loneliness is your inner self saying "I need connection." It\'s not a character flaw or a life sentence. It\'s a signal to act — gently, bravely, one step at a time.' },
  ],
  anger_management: [
    { icon: '🔥', title: 'Anger is a secondary emotion', body: 'Beneath almost every anger is a softer emotion: hurt, fear, shame, or powerlessness. Anger protects those vulnerable feelings. Understanding what\'s underneath is the first step.' },
    { icon: '⏱️', title: 'The 90-second rule', body: 'Neurologically, an anger response peaks and passes within 90 seconds — if you don\'t feed it. After 90 seconds, you\'re choosing to stay in the emotion, not being forced.' },
    { icon: '🧠', title: 'Your trigger is information', body: 'What triggers your anger reveals what you value most deeply. Repeated triggers often point to an unmet need — for respect, fairness, safety, or love.' },
    { icon: '💪', title: 'Anger can be channelled', body: 'Anger is energy. The same force that makes you destructive can be redirected into fierce advocacy, creative work, physical exercise, or setting powerful boundaries.' },
  ],
  marriage_problems: [
    { icon: '💑', title: 'All relationships go through seasons', body: 'Research by Dr. John Gottman shows that even happy couples have the same core conflicts — they just handle them differently. Struggle doesn\'t mean failure. It means you\'re human.' },
    { icon: '👂', title: 'The most common issue is not feeling heard', body: 'In 69% of relationship conflicts, the issue is never fully resolved. The key is how couples manage disagreement — with contempt or with curiosity and respect.' },
    { icon: '🌱', title: 'Repair attempts matter more than conflict', body: 'It\'s not how much you fight that predicts a relationship\'s health — it\'s how you repair afterward. A sincere "I\'m sorry" or "Can we start over?" can shift everything.' },
    { icon: '🪞', title: 'Your partner mirrors unresolved parts of you', body: 'What irritates you most about your partner often reflects something within yourself. This isn\'t blame — it\'s an invitation to know yourself more deeply.' },
  ],
  grief_loss: [
    { icon: '🕯️', title: 'Grief is love with nowhere to go', body: 'Grief doesn\'t mean you\'re broken. It means you loved. The depth of your grief is the measure of your love. There is no grief without great love.' },
    { icon: '🌊', title: 'Grief is not linear', body: 'The "stages of grief" are not a checklist. You may feel acceptance, then rage, then denial — all in one afternoon. There is no correct way or timeline to grieve.' },
    { icon: '🤝', title: 'You don\'t have to "get over" it', body: 'The goal of grief is not to forget or move on — it\'s to carry the love forward. You can grieve and still live fully. Both can be true at the same time.' },
    { icon: '🌱', title: 'Post-traumatic growth is real', body: 'Many people who experience profound loss report that it ultimately deepened their empathy, clarified their values, and strengthened their sense of what matters. This takes time — and it\'s real.' },
  ],
  relationship_breakup: [
    { icon: '💔', title: 'A breakup is a loss that deserves grief', body: 'You\'re not just losing a person — you\'re losing a future, a version of yourself, a home in someone else. That deserves to be grieved, not suppressed.' },
    { icon: '🧠', title: 'Heartbreak is neurologically like withdrawal', body: 'Brain scans show that heartbreak activates the same areas as physical pain and addiction withdrawal. What you\'re feeling is real, biological, and temporary.' },
    { icon: '🌱', title: 'Who you are after is often more you', body: 'Relationships reveal both who you are and who you\'ve been compromising to be. This ending is also a beginning — a chance to return to yourself.' },
    { icon: '⏳', title: 'Time heals, but presence heals faster', body: 'Passive waiting prolongs pain. Active healing — journaling, moving your body, connecting with others, building meaning — accelerates recovery more than time alone.' },
  ],
  work_career_stress: [
    { icon: '⚡', title: 'Burnout is not weakness', body: 'Burnout is the result of sustained stress without adequate recovery. It\'s a physical and psychological state — not a character flaw. It requires genuine rest, not just willpower.' },
    { icon: '🎯', title: 'Meaning matters more than money', body: 'Research consistently shows that a sense of purpose at work predicts wellbeing more than salary. If your work feels meaningless, that\'s important information about what you need.' },
    { icon: '🔋', title: 'You cannot pour from an empty cup', body: 'Peak performance requires recovery. The world\'s top performers — athletes, artists, leaders — all prioritise rest as part of their practice, not as a break from it.' },
    { icon: '🌿', title: 'Your identity is not your job', body: 'When work becomes your whole identity, any work setback becomes a self-worth crisis. You are not your job title, salary, or output. You are a whole person.' },
  ],
  financial_stress: [
    { icon: '💸', title: 'Financial stress affects your brain', body: 'Scarcity thinking — the mental state created by financial stress — actually reduces cognitive capacity. It\'s harder to make good decisions when you\'re under money pressure. This is science, not weakness.' },
    { icon: '🌱', title: 'Small steps compound', body: 'Financial health is built through hundreds of small decisions, not one big rescue. One step today — however small — begins the compounding process.' },
    { icon: '🧠', title: 'Your relationship with money was taught', body: 'Your financial behaviours and fears were largely learned from your family and environment. Understanding where your money story came from is the first step to rewriting it.' },
    { icon: '🤝', title: 'Shame makes it worse', body: 'Financial shame keeps people stuck. The moment you speak honestly about money — to yourself, to a trusted person, to a professional — you begin to take back control.' },
  ],
  panic_attacks: [
    { icon: '💓', title: 'A panic attack cannot harm you', body: 'Despite how terrifying it feels, a panic attack is not a heart attack. Your body is having an intense stress response — but it is designed to pass. No one has ever died from a panic attack itself.' },
    { icon: '🧠', title: 'Your brain misreads danger signals', body: 'The amygdala (your brain\'s alarm) sometimes fires false alarms. A panic attack is a false alarm — extremely convincing, but ultimately incorrect. You are safe.' },
    { icon: '🌊', title: 'Resistance amplifies panic', body: 'Fighting a panic attack intensifies it. Counterintuitively, allowing and accepting the sensations — "yes, I feel this, it will pass" — reduces their intensity and duration.' },
    { icon: '🔄', title: 'Patterns can be interrupted', body: 'Panic attacks follow a predictable physiological cycle. Learning your early warning signs allows you to intervene before the peak — with breath, grounding, or movement.' },
  ],
  ptsd_trauma: [
    { icon: '🌿', title: 'Trauma is stored in the body', body: 'Trauma isn\'t just a memory — it\'s held in the nervous system, muscles, and patterns of response. Healing often requires working with the body, not just the mind.' },
    { icon: '🛡️', title: 'Your responses were survival strategies', body: 'The ways you cope — shutting down, hypervigilance, people-pleasing, avoidance — were once survival strategies. They protected you. They can be gradually updated as you become safer.' },
    { icon: '🌅', title: 'Safety is built slowly', body: 'Healing from trauma is not about forgetting or being "over it." It\'s about slowly building a sense of safety in your body, your relationships, and your present moment.' },
    { icon: '💪', title: 'Post-traumatic growth is documented', body: 'Many trauma survivors report deepened empathy, clearer values, and a stronger sense of what truly matters. Your suffering has meaning. Your story can help others.' },
  ],
  lack_of_confidence: [
    { icon: '🌱', title: 'Confidence is built, not found', body: 'Confidence is not a personality trait you either have or don\'t. It is built through doing difficult things, failing, surviving, and doing them again. It is a skill, not a gift.' },
    { icon: '🧠', title: 'Your inner critic is not the truth', body: 'The inner critical voice is usually inherited — absorbed from parents, teachers, or early experiences. It is not objective reality. It is a story. Stories can be changed.' },
    { icon: '🪞', title: 'Comparison robs confidence', body: 'You are comparing your inside to everyone else\'s outside. You see their highlight reel and your unfiltered reality. This is always an unfair comparison.' },
    { icon: '🎯', title: 'Action precedes confidence, not the other way around', body: 'Most people wait to feel confident before acting. But confidence follows action — it is built through evidence of your own capability, accumulated one attempt at a time.' },
  ],
  sleep_problems: [
    { icon: '🌙', title: 'Sleep anxiety creates insomnia', body: 'Often it\'s not a sleep problem — it\'s anxiety about sleep that prevents sleep. The fear of not sleeping becomes the thing that stops you sleeping. Breaking this cycle is possible.' },
    { icon: '🧠', title: 'Your body wants to sleep', body: 'Sleep is biological. Your body craves it and will find it when conditions allow. The problem is usually what\'s getting in the way — stress, screen light, irregular times, or anxiety.' },
    { icon: '🌡️', title: 'Temperature and light matter enormously', body: 'A cool room (18°C/65°F) and no blue light 90 minutes before bed have the single largest impact on sleep quality, backed by extensive research.' },
    { icon: '⏰', title: 'Consistent wake time is the key lever', body: 'Going to bed at the same time matters less than waking at the same time every day — including weekends. A consistent wake time regulates your entire sleep cycle.' },
  ],
  family_relationships: [
    { icon: '🏡', title: 'Family patterns repeat until examined', body: 'The patterns in your family of origin — how love was expressed, how conflict was handled, how emotions were treated — become your default until you consciously choose differently.' },
    { icon: '🌱', title: 'You can love someone and still need distance', body: 'Setting limits with family members is not abandonment. It is self-preservation. You can love someone deeply and still protect your own wellbeing. Both are true.' },
    { icon: '🪞', title: 'Your family\'s story is not your story', body: 'The pain, limitations, and patterns of your parents and grandparents are theirs to carry — unless you unconsciously adopt them. You have the power to write a different chapter.' },
    { icon: '🤝', title: 'Repair is always possible', body: 'Even long-damaged family relationships can shift — not always to what you hoped for, but toward something more honest and sustainable. It starts with one person deciding to respond differently.' },
  ],
  ocd_intrusive_thoughts: [
    { icon: '🔄', title: 'Intrusive thoughts are not who you are', body: 'Having a disturbing thought does not mean you want it or would act on it. Everyone has intrusive thoughts — OCD just makes them stick. The thought is not you.' },
    { icon: '🧠', title: 'Compulsions provide relief, then more anxiety', body: 'Rituals and compulsions reduce anxiety briefly, then reset the cycle higher. The counterintuitive path to freedom is to tolerate the discomfort without the compulsion — and watch it pass.' },
    { icon: '🌊', title: 'Acceptance reduces power', body: 'Fighting intrusive thoughts gives them power. Allowing them — "yes, this thought is here, it does not define me" — removes the fuel that keeps them alive.' },
    { icon: '💪', title: 'ERP is the gold standard', body: 'Exposure and Response Prevention (ERP) therapy has the highest evidence base for OCD. It gradually teaches your brain that the feared thing does not require the compulsive response.' },
  ],
  trust_issues: [
    { icon: '🤝', title: 'Trust issues are survival adaptations', body: 'If trusting people led to being hurt, your nervous system learned to protect you by staying guarded. This was intelligent — and now it may be costing you more than it\'s saving you.' },
    { icon: '🌱', title: 'Trust is rebuilt in small increments', body: 'You don\'t have to trust fully or not at all. Trust is rebuilt through tiny tests — sharing something small, being honest, staying — and watching what happens.' },
    { icon: '🪞', title: 'Trust begins with self-trust', body: 'The deeper issue is often not trusting yourself — your judgment, your instincts, your ability to survive if someone hurts you. Building trust in yourself makes trusting others feel less catastrophic.' },
    { icon: '💡', title: 'Not everyone is who hurt you', body: 'The mind overgeneralises from past pain to protect future safety. The person in front of you is not the person who hurt you before — even if they trigger the same feelings.' },
  ],
  default: [
    { icon: '💜', title: 'You are not broken', body: 'Whatever you\'re going through, it does not define your worth. You are a whole person having a hard time. These are not the same thing.' },
    { icon: '🌿', title: 'Healing is not linear', body: 'There will be good days and hard days. Both are part of the journey. Progress is not always visible, but it is almost always happening beneath the surface.' },
    { icon: '✨', title: 'You have survived before', body: 'Look back at every hard thing you have faced. You are still here. That is not luck — it is evidence of your strength, even if it doesn\'t feel that way.' },
    { icon: '🤝', title: 'Reaching out is the bravest act', body: 'Most people suffer in silence. The fact that you\'re here, seeking support, reading this — that takes more courage than most people realise.' },
  ],
};

export default function ExplorerStage({ problemType, onComplete }) {
  const [open, setOpen] = useState([]);
  const insights = INSIGHTS[problemType] || INSIGHTS.default;

  const toggle = (i) => setOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div style={{ fontSize: 52, marginBottom: 12 }}>🧭</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>The Explorer</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Understand what you're carrying and why. Tap each to reveal.</p>
      </div>

      <div className="space-y-3 mb-6">
        {insights.map((ins, i) => (
          <div key={i} onClick={() => toggle(i)}
            className="rounded-2xl p-4 cursor-pointer transition-all"
            style={{
              background: open.includes(i) ? 'rgba(124,58,237,0.07)' : 'var(--bg-card)',
              border: `1px solid ${open.includes(i) ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
            }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 22, flexShrink: 0 }}>{ins.icon}</span>
              <p className="font-semibold text-sm flex-1" style={{ color: 'var(--text)' }}>{ins.title}</p>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>{open.includes(i) ? '▲' : '▼'}</span>
            </div>
            {open.includes(i) && (
              <p className="text-sm leading-relaxed mt-3 pl-8" style={{ color: 'var(--text-secondary)' }}>{ins.body}</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onComplete({ stage: 'explorer', opened: open })}
        disabled={open.length === 0}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
        style={{ background: 'linear-gradient(135deg, #0891b2, #6d28d9)' }}>
        I understand more now →
      </button>
    </div>
  );
}
