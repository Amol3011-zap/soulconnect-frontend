import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const PROBLEMS = [
  { key: 'anxiety',                emoji: '🌀', label: 'Anxiety',         desc: 'Worry, overthinking, panic' },
  { key: 'depression',             emoji: '🌧️', label: 'Depression',      desc: 'Low mood, emptiness, hopelessness' },
  { key: 'loneliness',             emoji: '🕊️', label: 'Loneliness',      desc: 'Feeling isolated, disconnected' },
  { key: 'anger_management',       emoji: '🔥', label: 'Anger',           desc: 'Frustration, outbursts, resentment' },
  { key: 'marriage_problems',      emoji: '💑', label: 'Marriage',         desc: 'Relationship tension, distance' },
  { key: 'grief_loss',             emoji: '🕯️', label: 'Grief & Loss',    desc: 'Bereavement, missing someone' },
  { key: 'relationship_breakup',   emoji: '💔', label: 'Breakup',          desc: 'Heartbreak, moving on' },
  { key: 'work_career_stress',     emoji: '⚡', label: 'Work Stress',      desc: 'Burnout, pressure, no meaning' },
  { key: 'financial_stress',       emoji: '💸', label: 'Financial Stress', desc: 'Money worries, instability' },
  { key: 'panic_attacks',          emoji: '💓', label: 'Panic Attacks',    desc: 'Sudden fear, physical symptoms' },
  { key: 'ptsd_trauma',            emoji: '🌿', label: 'Trauma',           desc: 'Past wounds, PTSD, triggers' },
  { key: 'lack_of_confidence',     emoji: '🌱', label: 'Confidence',       desc: 'Self-doubt, imposter syndrome' },
  { key: 'sleep_problems',         emoji: '🌙', label: 'Sleep Issues',     desc: 'Insomnia, restless nights' },
  { key: 'family_relationships',   emoji: '🏡', label: 'Family',           desc: 'Conflict, expectations, pain' },
  { key: 'ocd_intrusive_thoughts', emoji: '🔄', label: 'OCD',              desc: 'Intrusive thoughts, compulsions' },
  { key: 'trust_issues',           emoji: '🤝', label: 'Trust Issues',     desc: 'Fear of betrayal, walls up' },
];

export default function Onboarding() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0); // 0 = welcome, 1 = pick problem, 2 = done
  const { setPrimaryProblem, user } = useAuthStore();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (step === 0) { setStep(1); return; }
    if (step === 1 && selected) {
      setPrimaryProblem(selected);
      setStep(2);
      setTimeout(() => navigate('/dashboard'), 1800);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #030009 0%, #0d0524 50%, #07031a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* STEP 0 — Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌟</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.2 }}>
              Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(196,181,253,0.8)', lineHeight: 1.7, marginBottom: 8 }}>
              You just took the bravest step — reaching out.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(196,181,253,0.55)', lineHeight: 1.7, marginBottom: 40 }}>
              SoulConnect will match you with people who truly understand what you're going through. To find your best matches, tell us what brought you here.
            </p>
            {/* Ornamental divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 50, height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5))' }} />
              <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: 18 }}>✦</span>
              <div style={{ width: 50, height: 1, background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.5))' }} />
            </div>
            <button
              onClick={handleContinue}
              style={{
                width: '100%', padding: '16px', borderRadius: 18,
                fontSize: 16, fontWeight: 700, color: '#fff', cursor: 'pointer',
                background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #a855f7)',
                border: 'none',
                boxShadow: '0 0 40px rgba(124,58,237,0.4)',
                letterSpacing: '0.03em',
              }}>
              Begin My Journey →
            </button>
          </div>
        )}

        {/* STEP 1 — Pick problem */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>What brings you here?</h2>
              <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.6)' }}>Choose the one that feels most true right now.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {PROBLEMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelected(p.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 16,
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    background: selected === p.key
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.15))'
                      : 'rgba(255,255,255,0.04)',
                    border: selected === p.key
                      ? '1.5px solid rgba(168,85,247,0.6)'
                      : '1.5px solid rgba(255,255,255,0.08)',
                    boxShadow: selected === p.key ? '0 0 20px rgba(124,58,237,0.2)' : 'none',
                  }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{p.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: selected === p.key ? '#c4b5fd' : 'rgba(221,214,254,0.85)', lineHeight: 1.3 }}>{p.label}</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(196,181,253,0.45)', lineHeight: 1.4, marginTop: 2 }}>{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleContinue}
              disabled={!selected}
              style={{
                width: '100%', padding: '15px', borderRadius: 18,
                fontSize: 15, fontWeight: 700, color: '#fff', cursor: selected ? 'pointer' : 'default',
                background: selected ? 'linear-gradient(135deg, #5b21b6, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                boxShadow: selected ? '0 0 30px rgba(124,58,237,0.4)' : 'none',
                opacity: selected ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}>
              Find My Soul Matches →
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(196,181,253,0.35)', marginTop: 12 }}>
              🔒 This is private. Only used to match you with the right people.
            </p>
          </div>
        )}

        {/* STEP 2 — Done / loading */}
        {step === 2 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>✨</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Finding your matches...</h2>
            <p style={{ fontSize: 14, color: 'rgba(196,181,253,0.6)', lineHeight: 1.7 }}>
              The universe is aligning you with souls who truly understand.
            </p>
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#7c3aed',
                  animation: 'bounce 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
