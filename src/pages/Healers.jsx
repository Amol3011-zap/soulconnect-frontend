import React, { useState, useEffect, useRef, useCallback } from 'react';
import { healerAPI } from '../services/api';

// ── Data ───────────────────────────────────────────────────────────────────────
const DEMO_HEALERS = [
  {
    id: 1, name: 'Dr. Priya Sharma', avatar_url: null, initials: 'PS',
    specializations: ['Anxiety', 'Depression', 'Trauma'],
    bio: 'Helps with anxiety, panic attacks, overthinking and self-worth.',
    hourly_rate: 1200, total_rating: 4.9, review_count: 134, experience_years: 8,
    session_type: 'Video & Chat', languages: ['English', 'Hindi'],
    badge: 'Top Rated', badge_color: '#F5B841',
    grad: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
    match: 89,
  },
  {
    id: 2, name: 'Rahul Mehta', avatar_url: null, initials: 'RM',
    specializations: ['Relationships', 'Grief', 'Life Transitions'],
    bio: 'Specialises in relationship healing, grieving, and life transitions.',
    hourly_rate: 800, total_rating: 4.7, review_count: 89, experience_years: 5,
    session_type: 'Video', languages: ['English', 'Hindi'],
    badge: 'Most Popular', badge_color: '#6D4AFF',
    grad: 'linear-gradient(135deg,#0891B2,#0E7490)',
    match: 92,
  },
  {
    id: 3, name: 'Meera Nair', avatar_url: null, initials: 'MN',
    specializations: ['Mindfulness', 'Stress', 'Sleep'],
    bio: 'Combines yoga, breathwork and mindfulness for deep healing.',
    hourly_rate: 600, total_rating: 4.8, review_count: 67, experience_years: 6,
    session_type: 'Video & In-person', languages: ['English', 'Malayalam'],
    badge: 'New', badge_color: '#34C38F',
    grad: 'linear-gradient(135deg,#34C38F,#059669)',
    match: 85,
  },
];

const ISSUE_OPTIONS = [
  'Anxiety & Panic Attacks', 'Depression', 'Relationship Issues', 'Grief & Loss',
  'Work / Career Stress', 'Trauma & PTSD', 'Loneliness', 'Sleep Problems',
  'Anger Management', 'Low Confidence', 'OCD / Intrusive Thoughts', 'Addiction',
  'Family Problems', 'Financial Stress', 'Identity / Life Purpose', 'Other',
];

const DURATION_OPTIONS = [
  'Less than 1 month', '1–3 months', '3–6 months',
  '6 months – 1 year', '1–2 years', 'More than 2 years',
];

const TIME_SLOTS = {
  'Today': ['3:00 PM', '5:00 PM', '7:00 PM'],
  'Tomorrow': ['10:00 AM', '12:00 PM', '2:00 PM', '5:00 PM', '7:00 PM'],
  'Day After': ['9:00 AM', '11:00 AM', '3:00 PM', '6:00 PM'],
};

// ── Consent Sections ───────────────────────────────────────────────────────────
const CONSENT_SECTIONS = [
  {
    heading: 'Nature of Services',
    body: 'SoulConnect provides complementary wellness services, including Reiki, Energy Healing, Spiritual Guidance, Meditation, Coaching, and Wellness Support. These services are intended to support personal growth, relaxation, self-awareness, and overall well-being.',
  },
  {
    heading: 'Not Medical Treatment',
    body: 'Reiki and energy healing are complementary wellness practices. These services are not medical treatment. SoulConnect does not diagnose illness, prescribe medication, or replace healthcare professionals.',
  },
  {
    heading: 'Medical Responsibility',
    body: 'I agree that I remain responsible for seeking medical care when necessary, following advice from licensed healthcare providers, and maintaining any prescribed treatment plans. I will not discontinue medications or medical treatment based on information received from SoulConnect.',
  },
  {
    heading: 'Voluntary Participation',
    body: 'I understand my participation is entirely voluntary. I may stop a session at any time.',
  },
  {
    heading: 'No Guaranteed Results',
    body: 'Outcomes vary between individuals. No specific results are guaranteed. Testimonials do not guarantee similar experiences.',
  },
  {
    heading: 'Personal Responsibility',
    body: 'I accept full responsibility for my decisions, actions, health choices, and my interpretation of information provided.',
  },
  {
    heading: 'Release of Liability',
    body: 'To the fullest extent permitted by law, I release and hold harmless SoulConnect, its owners, practitioners, employees, contractors, and affiliates from any claims, liabilities, damages, injuries, losses, costs, or expenses arising from my participation in any service.',
  },
  {
    heading: 'Electronic Consent',
    body: 'By checking the acceptance box, signing electronically, and proceeding to book a session, I acknowledge that I have read this document, I understand this document, and I voluntarily agree to its terms.',
  },
];

// ── Consent Modal ──────────────────────────────────────────────────────────────
function ConsentModal({ healer, onClose, onAgree }) {
  const [agreed, setAgreed] = useState(false);
  const [sigMode, setSigMode] = useState('draw');
  const [typedSig, setTypedSig] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FAF7FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#6D4AFF';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [sigMode]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e, canvasRef.current);
    lastPos.current = pos;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  }, []);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FAF7FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const canProceed = agreed && (sigMode === 'type' ? typedSig.trim().length >= 2 : hasDrawn);

  const handleAgree = () => {
    if (!canProceed) return;
    const sig = sigMode === 'draw' ? canvasRef.current.toDataURL() : typedSig.trim();
    onAgree(sig);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'rgba(26,19,51,0.72)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 520, borderRadius: 24,
        background: '#FFFFFF', boxShadow: '0 32px 80px rgba(109,74,255,0.25)',
        display: 'flex', flexDirection: 'column', maxHeight: '92vh', overflow: 'hidden',
        border: '1px solid rgba(109,74,255,0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(109,74,255,0.1)',
          background: 'linear-gradient(135deg,rgba(109,74,255,0.06),rgba(167,139,250,0.04))',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1333', margin: 0 }}>Client Consent &amp; Disclaimer</h2>
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Read carefully before booking with {healer?.name}</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(109,74,255,0.08)', color: '#6D4AFF', fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12,
          }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', scrollbarWidth: 'thin' }}>
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(109,74,255,0.06)', border: '1px solid rgba(109,74,255,0.15)',
          }}>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: '#4B5563', margin: 0 }}>
              By booking a session, purchasing a service, attending a workshop, or continuing with any SoulConnect program, you acknowledge and agree to the following:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONSENT_SECTIONS.map((s, i) => (
              <div key={i} style={{
                borderRadius: 14, padding: 14,
                background: '#FAF7FF', border: '1px solid rgba(109,74,255,0.1)',
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#6D4AFF' }}>{i + 1}. {s.heading}</p>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: '#4B5563', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ borderRadius: 12, padding: 12, border: '1px solid rgba(109,74,255,0.12)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>DATE</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1A1333', margin: 0 }}>
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div style={{ borderRadius: 12, padding: 12, border: '1px solid rgba(109,74,255,0.12)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>GUIDE</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1A1333', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{healer?.name}</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>— End of Consent Form —</p>
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0, padding: '16px 24px',
          borderTop: '1px solid rgba(109,74,255,0.1)', background: '#FFFFFF',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <div style={{ position: 'relative', marginTop: 2, flexShrink: 0 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
              <div onClick={() => setAgreed(!agreed)} style={{
                width: 20, height: 20, borderRadius: 6, cursor: 'pointer',
                background: agreed ? 'linear-gradient(135deg,#6D4AFF,#5B21B6)' : '#FAF7FF',
                border: `2px solid ${agreed ? '#6D4AFF' : 'rgba(109,74,255,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {agreed && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>}
              </div>
            </div>
            <span style={{ fontSize: 12, lineHeight: 1.6, color: '#4B5563' }}>
              I have read and fully understand this Consent &amp; Disclaimer Form. I voluntarily agree to its terms and understand it is not medical treatment.
            </span>
          </label>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', margin: 0 }}>Digital Signature</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ id: 'draw', label: '✍️ Draw' }, { id: 'type', label: '⌨️ Type' }].map(({ id, label }) => (
                  <button key={id} onClick={() => { setSigMode(id); setHasDrawn(false); setTypedSig(''); }} style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: sigMode === id ? 'linear-gradient(135deg,#6D4AFF,#5B21B6)' : 'rgba(109,74,255,0.08)',
                    color: sigMode === id ? 'white' : '#6D4AFF',
                  }}>{label}</button>
                ))}
                {sigMode === 'draw' && hasDrawn && (
                  <button onClick={clearCanvas} style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  }}>Clear</button>
                )}
              </div>
            </div>
            {sigMode === 'draw' ? (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: `2px solid ${hasDrawn ? '#6D4AFF' : 'rgba(109,74,255,0.2)'}` }}>
                <canvas
                  ref={canvasRef} width={560} height={90}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                  style={{ width: '100%', display: 'block', height: 90, background: '#FAF7FF', cursor: 'crosshair', touchAction: 'none' }}
                />
              </div>
            ) : (
              <input
                value={typedSig}
                onChange={e => setTypedSig(e.target.value)}
                placeholder="Type your full name as signature"
                style={{
                  width: '100%', padding: '10px 16px', borderRadius: 14, fontSize: 18,
                  fontFamily: 'Georgia, serif', fontStyle: 'italic',
                  background: '#FAF7FF', color: '#1A1333',
                  border: `2px solid ${typedSig ? '#6D4AFF' : 'rgba(109,74,255,0.2)'}`,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            )}
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
              {sigMode === 'draw' ? 'Sign using your mouse or finger' : 'Your typed name acts as your legal electronic signature'} · {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          <button onClick={handleAgree} disabled={!canProceed} style={{
            width: '100%', padding: '14px', borderRadius: 14, fontSize: 13, fontWeight: 700,
            border: 'none', cursor: canProceed ? 'pointer' : 'not-allowed',
            background: canProceed ? 'linear-gradient(135deg, #6D4AFF, #5B21B6)' : 'rgba(109,74,255,0.1)',
            color: canProceed ? 'white' : '#9CA3AF',
            transition: 'opacity 0.2s',
          }}>
            {canProceed ? 'I Agree & Continue to Booking →' : agreed ? (sigMode === 'draw' ? 'Please draw your signature above' : 'Please type your full name above') : 'Please check the agreement box above'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', margin: 0 }}>
            🔒 This consent is recorded with your booking · Support@soulconnect.health
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Booking Modal ──────────────────────────────────────────────────────────────
function BookingModal({ healer, grad, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [issues, setIssues] = useState([]);
  const [duration, setDuration] = useState('');
  const [medication, setMedication] = useState('');
  const [prevTherapy, setPrevTherapy] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const MAX_WORDS = 500;

  const toggleIssue = (issue) => {
    setIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    if (words.length <= MAX_WORDS) setDescription(text);
  };

  const submit = () => {
    if (issues.length === 0) { setError('Please select at least one issue'); return; }
    if (!duration) { setError('Please select how long you have been experiencing this'); return; }
    if (!selectedSlot) { setError('Please choose an available time slot'); return; }
    if (!description.trim()) { setError('Please describe your situation in a few words'); return; }
    setError('');
    setStep(2);
  };

  if (step === 2) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'rgba(26,19,51,0.6)', backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          width: '100%', maxWidth: 420, borderRadius: 24, padding: 36,
          background: '#FFFFFF', border: '1px solid rgba(109,74,255,0.15)',
          boxShadow: '0 32px 80px rgba(109,74,255,0.2)', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 28,
            background: grad, margin: '0 auto 16px',
          }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1333', marginBottom: 8 }}>Session Requested!</h2>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#4B5563', marginBottom: 14 }}>
            Your booking request has been sent to <strong>{healer.name}</strong>.
          </p>
          <div style={{
            borderRadius: 16, padding: '14px 18px', marginBottom: 14,
            background: 'rgba(109,74,255,0.06)', border: '1px solid rgba(109,74,255,0.15)',
            fontSize: 13, fontWeight: 600, color: '#6D4AFF', lineHeight: 1.5,
          }}>
            🌿 While we prepare your session, take a deep breath and relax.
          </div>
          <div style={{
            borderRadius: 14, padding: '10px 16px', marginBottom: 20,
            background: '#FAF7FF', fontSize: 13, fontWeight: 700, color: '#1A1333',
          }}>
            📅 {selectedSlot.day} at {selectedSlot.time}
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 24 }}>
            You'll receive a confirmation once {healer.name} accepts the request. Check your profile for updates.
          </p>
          <button onClick={onClose} style={{
            width: '100%', padding: '13px', borderRadius: 14, fontSize: 14, fontWeight: 700,
            background: grad, color: '#fff', border: 'none', cursor: 'pointer',
          }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(26,19,51,0.6)', backdropFilter: 'blur(8px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '100%', maxWidth: 520, borderRadius: '24px 24px 0 0',
        background: '#FFFFFF', border: '1px solid rgba(109,74,255,0.15)',
        boxShadow: '0 -8px 48px rgba(109,74,255,0.15)',
        maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
          borderBottom: '1px solid rgba(109,74,255,0.1)', background: '#FFFFFF', flexShrink: 0,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            background: grad, color: 'white', fontSize: 14, fontWeight: 700,
          }}>{healer.initials}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', margin: 0 }}>Book a Session</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>with {healer.name} · ₹{healer.hourly_rate}/session</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(109,74,255,0.08)', color: '#6D4AFF', fontSize: 14, fontWeight: 700,
          }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Issues */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>
              What are you struggling with? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>Select all that apply</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ISSUE_OPTIONS.map(issue => {
                const selected = issues.includes(issue);
                return (
                  <button key={issue} onClick={() => toggleIssue(issue)} style={{
                    fontSize: 12, padding: '6px 14px', borderRadius: 50, fontWeight: 600, cursor: 'pointer',
                    background: selected ? 'rgba(109,74,255,0.1)' : '#FAF7FF',
                    border: `1.5px solid ${selected ? '#6D4AFF' : 'rgba(109,74,255,0.2)'}`,
                    color: selected ? '#6D4AFF' : '#4B5563',
                  }}>{selected && '✓ '}{issue}</button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 8 }}>
              How long have you been experiencing this? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DURATION_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setDuration(opt)} style={{
                  fontSize: 12, padding: '10px 12px', borderRadius: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                  background: duration === opt ? 'rgba(109,74,255,0.08)' : '#FAF7FF',
                  border: `1.5px solid ${duration === opt ? '#6D4AFF' : 'rgba(109,74,255,0.15)'}`,
                  color: duration === opt ? '#6D4AFF' : '#4B5563',
                }}>{duration === opt ? '● ' : '○ '}{opt}</button>
              ))}
            </div>
          </div>

          {/* Medication */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 8 }}>
              Are you currently on any medication?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Yes', 'No', 'Not sure'].map(opt => (
                <button key={opt} onClick={() => setMedication(opt)} style={{
                  flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: medication === opt ? 'rgba(109,74,255,0.08)' : '#FAF7FF',
                  border: `1.5px solid ${medication === opt ? '#6D4AFF' : 'rgba(109,74,255,0.15)'}`,
                  color: medication === opt ? '#6D4AFF' : '#4B5563',
                }}>{opt}</button>
              ))}
            </div>
            {medication === 'Yes' && (
              <input placeholder="Please mention the medication (optional)" style={{
                marginTop: 8, width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 13,
                background: '#FAF7FF', color: '#1A1333', border: '1.5px solid rgba(109,74,255,0.2)',
                outline: 'none', boxSizing: 'border-box',
              }} />
            )}
          </div>

          {/* Previous therapy */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 8 }}>
              Have you previously taken counselling or therapy?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Yes', 'No'].map(opt => (
                <button key={opt} onClick={() => setPrevTherapy(opt)} style={{
                  flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: prevTherapy === opt ? 'rgba(109,74,255,0.08)' : '#FAF7FF',
                  border: `1.5px solid ${prevTherapy === opt ? '#6D4AFF' : 'rgba(109,74,255,0.15)'}`,
                  color: prevTherapy === opt ? '#6D4AFF' : '#4B5563',
                }}>{opt}</button>
              ))}
            </div>
            {prevTherapy === 'Yes' && (
              <input placeholder="What kind of therapy? How did it go? (optional)" style={{
                marginTop: 8, width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 13,
                background: '#FAF7FF', color: '#1A1333', border: '1.5px solid rgba(109,74,255,0.2)',
                outline: 'none', boxSizing: 'border-box',
              }} />
            )}
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#1A1333' }}>
                Describe your situation <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: wordCount > MAX_WORDS * 0.9 ? '#dc2626' : '#6B7280' }}>
                {wordCount}/{MAX_WORDS} words
              </span>
            </div>
            <textarea
              value={description} onChange={handleDescriptionChange} rows={5}
              placeholder="Share what you're going through — the more you share, the better your guide can prepare for your session."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 16, fontSize: 13, lineHeight: 1.6,
                background: '#FAF7FF', color: '#1A1333', border: '1.5px solid rgba(109,74,255,0.2)',
                outline: 'none', resize: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: 'rgba(109,74,255,0.1)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2, transition: 'width 0.3s',
                width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%`,
                background: wordCount > MAX_WORDS * 0.9 ? '#dc2626' : 'linear-gradient(90deg,#6D4AFF,#A78BFA)',
              }} />
            </div>
          </div>

          {/* Time slots */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>
              Choose an available time slot <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>All times are in IST</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(TIME_SLOTS).map(([day, times]) => (
                <div key={day}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#6D4AFF', marginBottom: 8 }}>{day}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {times.map(time => {
                      const isSelected = selectedSlot?.day === day && selectedSlot?.time === time;
                      return (
                        <button key={time} onClick={() => setSelectedSlot(isSelected ? null : { day, time })} style={{
                          padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          background: isSelected ? 'linear-gradient(135deg,#6D4AFF,#5B21B6)' : '#FAF7FF',
                          color: isSelected ? 'white' : '#4B5563',
                          border: `1.5px solid ${isSelected ? 'transparent' : 'rgba(109,74,255,0.2)'}`,
                        }}>{time}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 13,
            }}>⚠️ {error}</div>
          )}

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 14,
            background: 'rgba(109,74,255,0.06)', border: '1px solid rgba(109,74,255,0.15)',
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: '#6B7280', margin: 0 }}>
              Everything you share is strictly confidential and only visible to <strong>{healer.name}</strong>. We follow full HIPAA-aligned privacy practices.
            </p>
          </div>

          <button onClick={submit} style={{
            width: '100%', padding: '14px', borderRadius: 16, fontSize: 14, fontWeight: 700,
            background: grad, color: 'white', border: 'none', cursor: 'pointer',
          }}>Confirm Booking Request →</button>

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  );
}

// ── Assessment Modal (minimal, preserved) ─────────────────────────────────────
function AssessmentModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'rgba(26,19,51,0.72)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: '100%', maxWidth: 480, borderRadius: 24, padding: 36,
        background: '#FFFFFF', border: '1px solid rgba(109,74,255,0.15)',
        boxShadow: '0 32px 80px rgba(109,74,255,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1333', margin: 0 }}>✨ Find Your Match</h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>Quick assessment to match you with the right guide</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(109,74,255,0.08)', color: '#6D4AFF', fontSize: 14, fontWeight: 700,
          }}>✕</button>
        </div>
        <div style={{
          borderRadius: 16, padding: 20, marginBottom: 20,
          background: 'linear-gradient(135deg,rgba(109,74,255,0.06),rgba(167,139,250,0.04))',
          border: '1px solid rgba(109,74,255,0.12)',
        }}>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
            Our AI-powered assessment takes less than 2 minutes and will match you with guides who truly understand your journey and needs.
          </p>
        </div>
        <button onClick={onClose} style={{
          width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700,
          background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)', color: 'white', border: 'none', cursor: 'pointer',
        }}>Start Assessment →</button>
      </div>
    </div>
  );
}

// ── Animations ─────────────────────────────────────────────────────────────────
const HEALER_STYLES = `
  @keyframes hFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes hFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  .h-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
  .h-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(109,74,255,0.15) !important; }
  .h-anim-1 { animation: hFadeUp 0.45s 0.05s ease both; }
  .h-anim-2 { animation: hFadeUp 0.45s 0.12s ease both; }
  .h-anim-3 { animation: hFadeUp 0.45s 0.19s ease both; }
  .h-anim-4 { animation: hFadeUp 0.45s 0.26s ease both; }
  .h-anim-5 { animation: hFadeUp 0.45s 0.33s ease both; }
  @media (max-width: 768px) {
    .h-sidebar { display: none !important; }
    .h-main { padding: 0 16px 60px !important; }
    .h-hero-grid { grid-template-columns: 1fr !important; }
    .h-guide-grid { grid-template-columns: 1fr !important; }
    .h-approach-grid { grid-template-columns: 1fr 1fr !important; }
    .h-path-grid { grid-template-columns: 1fr !important; }
  }
`;

// ── Meditation SVG Illustration ────────────────────────────────────────────────
function MeditationIllustration() {
  return (
    <svg viewBox="0 0 300 320" width="100%" height="100%" style={{ display: 'block' }} aria-hidden="true">
      {/* Radial glow */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="rgba(109,74,255,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#3D2B8E" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="154" rx="100" ry="100" fill="url(#glow)" />

      {/* Mandala circles */}
      {[28,56,84,112,140,168,196,224].map((r, i) => (
        <circle key={i} cx="150" cy="154" r={r} fill="none" stroke="rgba(109,74,255,0.12)" strokeWidth="1" />
      ))}

      {/* Spokes */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 22.5) * Math.PI / 180;
        return (
          <line key={i}
            x1={150 + 28 * Math.cos(angle)} y1={154 + 28 * Math.sin(angle)}
            x2={150 + 224 * Math.cos(angle)} y2={154 + 224 * Math.sin(angle)}
            stroke="rgba(109,74,255,0.08)" strokeWidth="0.8"
          />
        );
      })}

      {/* Lotus petals at base */}
      {[-60,-30,0,30,60].map((angle, i) => {
        const rad = (angle - 90) * Math.PI / 180;
        const cx = 150 + 40 * Math.cos(rad);
        const cy = 248 + 40 * Math.sin(rad);
        return (
          <ellipse key={i} cx={cx} cy={cy} rx="22" ry="36"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            fill={i % 2 === 0 ? 'rgba(167,139,250,0.2)' : 'rgba(196,181,253,0.3)'}
          />
        );
      })}

      {/* Body — lotus position */}
      {/* Base/crossed legs */}
      <ellipse cx="150" cy="256" rx="52" ry="18" fill="url(#bodyGrad)" />
      {/* Torso */}
      <rect x="136" y="192" width="28" height="66" rx="14" fill="url(#bodyGrad)" />
      {/* Left arm */}
      <path d="M136,218 Q112,228 108,244" stroke="#3D2B8E" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="108" cy="246" r="8" fill="#3D2B8E" />
      {/* Right arm */}
      <path d="M164,218 Q188,228 192,244" stroke="#3D2B8E" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="192" cy="246" r="8" fill="#3D2B8E" />
      {/* Head */}
      <circle cx="150" cy="182" r="22" fill="url(#bodyGrad)" />
      {/* Hair bun */}
      <ellipse cx="150" cy="162" rx="10" ry="8" fill="#2D1B6E" />
      <circle cx="150" cy="157" r="5" fill="#2D1B6E" />

      {/* Golden dots */}
      {[
        {cx:80,cy:90,r:3,o:0.7},{cx:220,cy:80,r:2,o:0.5},{cx:60,cy:180,r:2.5,o:0.6},
        {cx:240,cy:170,r:3,o:0.8},{cx:100,cy:50,r:2,o:0.5},{cx:200,cy:45,r:2.5,o:0.6},
        {cx:70,cy:130,r:2,o:0.4},{cx:230,cy:120,r:2,o:0.5},
      ].map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#F5B841" opacity={d.o}
          style={{ animation: `hFloat ${2 + i * 0.3}s ease-in-out infinite` }} />
      ))}
    </svg>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Healers() {
  const [healers, setHealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [bookingHealer, setBookingHealer] = useState(null);
  const [bookingGrad, setBookingGrad] = useState('');
  const [consentHealer, setConsentHealer] = useState(null);
  const [consentGrad, setConsentGrad] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Anxiety');
  const [selectedHealer, setSelectedHealer] = useState(null);

  useEffect(() => { fetchHealers(); }, []);

  const fetchHealers = async () => {
    try {
      const response = await healerAPI.listHealers();
      const data = response.data.healers || [];
      setHealers(data.length > 0 ? data : DEMO_HEALERS);
    } catch {
      setHealers(DEMO_HEALERS);
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (healer, grad) => {
    setConsentHealer(healer);
    setConsentGrad(grad || healer.grad || 'linear-gradient(135deg,#6D4AFF,#5B21B6)');
  };

  const handleConsentAgree = () => {
    setBookingHealer(consentHealer);
    setBookingGrad(consentGrad);
    setConsentHealer(null);
    setConsentGrad('');
  };

  const displayHealers = loading ? DEMO_HEALERS : (healers.length > 0 ? healers : DEMO_HEALERS);

  const SIDEBAR_LINKS = [
    { icon: '🔍', label: 'Find a Guide', active: true },
    { icon: '📅', label: 'My Sessions', active: false },
    { icon: '👤', label: 'My Guides', active: false },
    { icon: '🔖', label: 'Saved Guides', active: false },
    { icon: '⭐', label: 'Recommended For You', active: false },
  ];

  const HEALING_CATEGORIES = [
    { emoji: '🔥', label: 'Anxiety', count: 42 },
    { emoji: '🌧', label: 'Depression', count: 36 },
    { emoji: '💔', label: 'Relationships', count: 39 },
    { emoji: '⚡', label: 'Trauma', count: 28 },
    { emoji: '🕯', label: 'Grief & Loss', count: 24 },
    { emoji: '💼', label: 'Life Transitions', count: 31 },
    { emoji: '🧘', label: 'Mindfulness', count: 27 },
    { emoji: '😮‍💨', label: 'Stress & Burnout', count: 34 },
    { emoji: '✨', label: 'Spiritual Growth', count: 22 },
  ];

  const CATEGORY_CHIPS = [
    { emoji: '😰', label: 'Anxiety' },
    { emoji: '💔', label: 'Breakup Recovery' },
    { emoji: '🌧', label: 'Depression' },
    { emoji: '🔥', label: 'Burnout' },
    { emoji: '🌿', label: 'Grief & Loss' },
    { emoji: '✨', label: 'Spiritual Growth' },
    { emoji: '😴', label: 'Stress' },
    { emoji: '🧘', label: 'Mindfulness' },
  ];

  const APPROACHES = [
    { emoji: '🧠', name: 'Therapy & Counselling', desc: 'Talk therapy for mental and emotional health', count: 26 },
    { emoji: '🧘', name: 'Mind-Body Healing', desc: 'Yoga, breathwork and body-based practices', count: 24 },
    { emoji: '✨', name: 'Energy & Spiritual', desc: 'Reiki, meditation and energy healing', count: 18 },
    { emoji: '🌿', name: 'Holistic Wellness', desc: 'Holistic healing for mind, body & soul', count: 32 },
    { emoji: '🤝', name: 'Community Healing', desc: 'Group circles and peer support', count: 15 },
  ];

  const HEALING_PATHS = [
    {
      title: 'Anxiety Recovery Path', duration: '4 Weeks',
      desc: 'A guided path to calm your mind, reduce anxiety and feel in control.',
      steps: 4, exercises: 6, gradient: 'linear-gradient(135deg,#E0F2FE,#BFDBFE)',
      people: '1.2K+',
    },
    {
      title: 'Heartbreak Healing Path', duration: '3 Weeks',
      desc: 'Heal your heart, rebuild your self-love and move forward.',
      steps: 3, exercises: 5, gradient: 'linear-gradient(135deg,#FCE7F3,#FBCFE8)',
      people: '893',
    },
    {
      title: 'Grief Support Path', duration: '4 Weeks',
      desc: 'Coping with loss and finding meaning again.',
      steps: 4, exercises: 5, gradient: 'linear-gradient(135deg,#F3F4F6,#E5E7EB)',
      people: '746',
    },
  ];

  const MATCH_SCORES = [89, 92, 85];

  return (
    <>
      <style>{HEALER_STYLES}</style>

      {/* Layout wrapper */}
      <div style={{ display: 'flex', marginTop: 64, minHeight: 'calc(100vh - 64px)', background: '#FAF7FF' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="h-sidebar" style={{
          width: 240, background: '#FFFFFF', borderRight: '1px solid rgba(109,74,255,0.1)',
          height: 'calc(100vh - 64px)', position: 'sticky', top: 64, overflowY: 'auto',
          flexShrink: 0, scrollbarWidth: 'thin',
        }}>

          {/* Section 1: Healing Journey */}
          <div style={{ padding: '20px 16px 16px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', margin: '0 0 10px' }}>My Healing Journey</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{
                background: 'rgba(109,74,255,0.1)', color: '#6D4AFF',
                fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 600,
              }}>Stage 2 · Healing</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(109,74,255,0.1)', marginBottom: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: '40%', borderRadius: 2,
                background: 'linear-gradient(90deg,#6D4AFF,#A78BFA)',
              }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>14 day streak 🔥</span>
              <span style={{ fontSize: 14, color: '#9CA3AF' }}>›</span>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(109,74,255,0.08)', margin: '0 16px' }} />

          {/* Section 2: Quick Links */}
          <div style={{ padding: '12px 8px' }}>
            {SIDEBAR_LINKS.map((link) => (
              <div key={link.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer', marginBottom: 2,
                background: link.active ? 'rgba(109,74,255,0.08)' : 'transparent',
                color: link.active ? '#6D4AFF' : '#4B5563',
                borderLeft: link.active ? '2px solid #6D4AFF' : '2px solid transparent',
                fontSize: 13, fontWeight: link.active ? 700 : 500,
                transition: 'background 0.15s',
              }}>
                <span style={{ fontSize: 14 }}>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(109,74,255,0.08)', margin: '0 16px' }} />

          {/* Section 3: Assessment CTA */}
          <div style={{ padding: '14px 12px' }}>
            <div style={{
              background: 'rgba(109,74,255,0.06)', border: '1px solid rgba(109,74,255,0.15)',
              borderRadius: 16, padding: 16,
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', margin: '0 0 6px' }}>Not sure where to start?</p>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: '0 0 12px' }}>
                Take our quick assessment and we'll match you with the right guide.
              </p>
              <button onClick={() => setShowAssessment(true)} style={{
                width: '100%', padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)', color: 'white',
                border: 'none', cursor: 'pointer',
              }}>Find My Match ✨</button>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(109,74,255,0.08)', margin: '0 16px' }} />

          {/* Section 4: Healing Categories */}
          <div style={{ padding: '14px 16px' }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: '#6B7280',
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px',
            }}>Healing Categories</p>
            {HEALING_CATEGORIES.map(cat => (
              <div key={cat.label} onClick={() => setSelectedCategory(cat.label)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                background: selectedCategory === cat.label ? 'rgba(109,74,255,0.08)' : 'transparent',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => { if (selectedCategory !== cat.label) e.currentTarget.style.background = 'rgba(109,74,255,0.05)'; }}
                onMouseLeave={e => { if (selectedCategory !== cat.label) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 12, color: '#4B5563', fontWeight: selectedCategory === cat.label ? 600 : 400 }}>{cat.label}</span>
                </div>
                <span style={{
                  fontSize: 10, background: '#F3F4F6', color: '#6B7280',
                  padding: '1px 7px', borderRadius: 20,
                }}>{cat.count}</span>
              </div>
            ))}
          </div>

          {/* Bottom: You're not alone card */}
          <div style={{ padding: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6D4AFF, #A78BFA)',
              borderRadius: 16, padding: 16, color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>You're not alone.</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: 0 }}>Healing is better together. 💜</p>
                </div>
                {/* Simple people SVG */}
                <svg width="50" height="36" viewBox="0 0 50 36" fill="none" aria-hidden="true">
                  <circle cx="16" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M6 28 Q16 20 26 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <circle cx="34" cy="8" r="6" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M24 28 Q34 20 44 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="h-main" style={{ flex: 1, overflowY: 'auto', padding: '0 32px 60px' }}>

          {/* ── HERO ── */}
          <div className="h-anim-1" style={{
            borderRadius: 24, overflow: 'hidden', marginBottom: 28, marginTop: 20,
            border: '1px solid rgba(109,74,255,0.12)',
            display: 'grid', gridTemplateColumns: '52% 48%',
            minHeight: 280,
          }} className="h-hero-grid h-anim-1">
            {/* Left */}
            <div style={{
              background: 'linear-gradient(135deg, #FAF7FF 0%, #F0EBFF 40%, #E8DFFF 100%)',
              padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <p style={{ fontSize: 11, color: '#6D4AFF', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 12px', textTransform: 'uppercase' }}>
                ✦ YOUR HEALING COMPANION
              </p>
              <h1 style={{
                fontSize: 36, fontWeight: 800, color: '#1A1333',
                fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: 0,
              }}>Find the right guide</h1>
              <h1 style={{
                fontSize: 36, fontWeight: 800, color: '#6D4AFF',
                fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.2, margin: '0 0 14px',
              }}>for your healing journey.</h1>
              <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 420, lineHeight: 1.6, margin: '0 0 24px' }}>
                Connect with verified wellness professionals and healing guides who truly understand your journey.
              </p>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
                {[
                  { icon: '👤', val: '500+', label: 'Verified Guides' },
                  { icon: '📋', val: '10K+', label: 'Sessions Booked' },
                  { icon: '⭐', val: '4.8★', label: 'Average Rating' },
                ].map(stat => (
                  <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{stat.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1333', lineHeight: 1 }}>{stat.val}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: i === 0 ? 20 : 8, height: 8, borderRadius: 4,
                    background: i === 0 ? '#6D4AFF' : 'rgba(109,74,255,0.2)',
                    transition: 'width 0.3s',
                  }} />
                ))}
              </div>
            </div>

            {/* Right — Illustration */}
            <div style={{
              background: 'linear-gradient(180deg, #E8DFFF 0%, #D4C6FF 40%, #C4B5FD 70%, #F3F0FF 100%)',
              position: 'relative', overflow: 'hidden', minHeight: 280,
            }}>
              <MeditationIllustration />
            </div>
          </div>

          {/* ── WHAT BRINGS YOU HERE ── */}
          <div className="h-anim-2" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', margin: '0 0 4px' }}>
                  What brings you here today?
                </h2>
                <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Choose what you want support with</p>
              </div>
              <button onClick={() => setShowAssessment(true)} style={{
                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: 'transparent', border: '1.5px solid #6D4AFF', color: '#6D4AFF',
                whiteSpace: 'nowrap',
              }}>Not sure? Take assessment →</button>
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
              {CATEGORY_CHIPS.map(chip => {
                const isSelected = selectedCategory === chip.label;
                return (
                  <button key={chip.label} onClick={() => setSelectedCategory(chip.label)} style={{
                    flexShrink: 0, padding: '10px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', border: `1.5px solid ${isSelected ? '#6D4AFF' : 'rgba(109,74,255,0.2)'}`,
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(109,74,255,0.1), rgba(167,139,250,0.08))'
                      : 'white',
                    color: isSelected ? '#6D4AFF' : '#4B5563',
                    transition: 'all 0.15s',
                  }}>{chip.emoji} {chip.label}</button>
                );
              })}
            </div>
          </div>

          {/* ── RECOMMENDED GUIDES ── */}
          <div className="h-anim-3" style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', margin: 0 }}>
                  Recommended guides for you
                </h2>
                <span style={{
                  background: 'rgba(52,195,143,0.1)', color: '#34C38F',
                  border: '1px solid rgba(52,195,143,0.3)', fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                }}>AI Matched</span>
              </div>
              <button style={{ fontSize: 13, color: '#6D4AFF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 16px' }}>Based on your journey, goals and preferences</p>

            <div className="h-guide-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {displayHealers.slice(0, 3).map((healer, idx) => {
                const match = healer.match || MATCH_SCORES[idx] || 85;
                const grad = healer.grad || 'linear-gradient(135deg,#6D4AFF,#5B21B6)';
                const badgeColors = {
                  'Top Rated': { bg: 'rgba(245,184,65,0.12)', color: '#D97706', border: 'rgba(245,184,65,0.3)' },
                  'Most Popular': { bg: 'rgba(109,74,255,0.1)', color: '#6D4AFF', border: 'rgba(109,74,255,0.25)' },
                  'New': { bg: 'rgba(52,195,143,0.1)', color: '#34C38F', border: 'rgba(52,195,143,0.25)' },
                };
                const bc = badgeColors[healer.badge] || badgeColors['New'];
                return (
                  <div key={healer.id} className="h-hover" style={{
                    background: 'white', borderRadius: 20,
                    border: '1px solid rgba(109,74,255,0.1)',
                    boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
                    padding: 20, position: 'relative',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Avatar + heart */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: grad,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, fontWeight: 700, color: 'white',
                        border: '2px solid white', boxShadow: '0 4px 12px rgba(109,74,255,0.2)',
                      }}>{healer.initials}</div>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                        background: 'rgba(109,74,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13,
                      }}>🤍</div>
                    </div>

                    {/* Badge */}
                    {healer.badge && (
                      <span style={{
                        display: 'inline-block', fontSize: 10, fontWeight: 700,
                        padding: '3px 9px', borderRadius: 20, marginBottom: 8,
                        background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`,
                      }}>{healer.badge}</span>
                    )}

                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1333', margin: '0 0 3px' }}>{healer.name}</h3>
                    <p style={{ fontSize: 12, color: '#6D4AFF', fontWeight: 600, margin: '0 0 6px' }}>
                      {idx === 0 ? 'Clinical Psychologist' : idx === 1 ? 'Counselling Psychologist' : 'Yoga Therapist & Coach'}
                    </p>

                    {/* Stars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      <span style={{ color: '#F59E0B', fontSize: 12 }}>⭐</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1333' }}>{healer.total_rating?.toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>({healer.review_count} reviews)</span>
                    </div>

                    {/* Specialty tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {(healer.specializations || []).slice(0, 3).map(s => (
                        <span key={s} style={{
                          background: 'rgba(109,74,255,0.06)', color: '#6D4AFF',
                          fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 500,
                        }}>{s}</span>
                      ))}
                    </div>

                    {/* Meta */}
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 8px' }}>
                      🕐 {healer.experience_years} yrs experience · 📹 {healer.session_type} · 🌐 {(healer.languages || []).join(', ')}
                    </p>

                    {/* Bio */}
                    <p style={{
                      fontSize: 12, color: '#4B5563', lineHeight: 1.5, margin: '0 0 12px',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{healer.bio}</p>

                    {/* Match score */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#34C38F' }}>{match}% Match</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(52,195,143,0.15)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${match}%`,
                          background: 'linear-gradient(90deg, #34C38F, #10B981)',
                        }} />
                      </div>
                    </div>

                    {/* Book button */}
                    <button onClick={() => openBooking(healer, grad)} style={{
                      width: '100%', padding: '9px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: 'linear-gradient(135deg, #34C38F, #10B981)', color: 'white',
                      border: 'none', cursor: 'pointer', marginTop: 'auto',
                    }}>Book Session +</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── EXPLORE APPROACHES ── */}
          <div className="h-anim-4" style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', margin: 0 }}>
                Explore healing approaches
              </h2>
              <button style={{ fontSize: 13, color: '#6D4AFF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>

            <div className="h-approach-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
              {APPROACHES.map((ap) => (
                <div key={ap.name} className="h-hover" style={{
                  background: 'white', borderRadius: 18,
                  border: '1px solid rgba(109,74,255,0.1)',
                  padding: '18px 16px',
                  boxShadow: '0 2px 16px rgba(109,74,255,0.05)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', marginBottom: 10,
                    background: 'linear-gradient(135deg, rgba(109,74,255,0.12), rgba(167,139,250,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{ap.emoji}</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', margin: '0 0 6px' }}>{ap.name}</p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: '0 0 8px' }}>{ap.desc}</p>
                  <span style={{ fontSize: 11, color: '#6D4AFF', fontWeight: 600 }}>{ap.count} guides</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── HEALING PATHS ── */}
          <div className="h-anim-5" style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', margin: 0 }}>
                Popular healing paths
              </h2>
              <button style={{ fontSize: 13, color: '#6D4AFF', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>

            <div className="h-path-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {HEALING_PATHS.map((path) => (
                <div key={path.title} className="h-hover" style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  border: '1px solid rgba(109,74,255,0.1)',
                  boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
                }}>
                  {/* Image area */}
                  <div style={{ height: 120, background: path.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {path.title.includes('Anxiety') && (
                      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden="true">
                        <circle cx="35" cy="30" r="16" stroke="rgba(109,74,255,0.4)" strokeWidth="2" fill="none" />
                        <path d="M35 46 L35 58" stroke="rgba(109,74,255,0.4)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 52 L35 58 L48 52" stroke="rgba(109,74,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M28 22 Q35 16 42 22" stroke="rgba(109,74,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      </svg>
                    )}
                    {path.title.includes('Heartbreak') && (
                      <svg width="70" height="60" viewBox="0 0 70 60" fill="none" aria-hidden="true">
                        <path d="M35 50 C35 50 8 32 8 18 C8 10 14 4 22 6 C28 7 33 12 35 16 C37 12 42 7 48 6 C56 4 62 10 62 18 C62 32 35 50 35 50Z" stroke="rgba(244,114,182,0.6)" strokeWidth="2" fill="rgba(244,114,182,0.15)" />
                      </svg>
                    )}
                    {path.title.includes('Grief') && (
                      <svg width="80" height="70" viewBox="0 0 80 70" fill="none" aria-hidden="true">
                        <circle cx="60" cy="14" r="10" fill="rgba(245,184,65,0.4)" />
                        <path d="M10 55 Q20 35 30 55 Q40 35 50 55" stroke="rgba(107,114,128,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <circle cx="30" cy="30" r="8" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" fill="none" />
                        <path d="M30 38 L30 52" stroke="rgba(107,114,128,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1333', margin: 0, flex: 1 }}>{path.title}</h3>
                      <span style={{
                        flexShrink: 0, marginLeft: 8, fontSize: 11, color: '#F5B841',
                        background: 'rgba(245,184,65,0.1)', border: '1px solid rgba(245,184,65,0.25)',
                        padding: '2px 8px', borderRadius: 20, fontWeight: 600,
                      }}>{path.duration}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: '0 0 10px',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{path.desc}</p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>📋 {path.steps} Steps</span>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>💪 {path.exercises} Exercises</span>
                      <span style={{ fontSize: 11, color: '#6B7280' }}>👤 1 Guide Session</span>
                    </div>

                    {/* People joined */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ display: 'flex' }}>
                        {['#7C3AED','#0891B2','#34C38F'].map((col, ci) => (
                          <div key={ci} style={{
                            width: 22, height: 22, borderRadius: '50%', background: col,
                            border: '2px solid white', marginLeft: ci > 0 ? -6 : 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: 'white', fontWeight: 700,
                          }}>
                            {['A','B','C'][ci]}
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{path.people} people joined</span>
                    </div>

                    <button style={{
                      width: '100%', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: 'transparent', border: '1.5px solid #6D4AFF', color: '#6D4AFF', cursor: 'pointer',
                    }}>Start Journey →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TRUST BANNER ── */}
          <div style={{
            background: 'white', borderRadius: 20, border: '1px solid rgba(109,74,255,0.1)',
            padding: '24px 32px', marginTop: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
          }}>
            {[
              { icon: '✅', text: 'All guides are verified & trusted' },
              { icon: '🛡', text: 'Safe, private & judgment-free space' },
              { icon: '💜', text: '10K+ souls healed' },
              { icon: '🔒', text: 'Secure payments & easy booking' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(109,74,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                }}>{item.icon}</div>
                <span style={{ fontSize: 11, color: '#4B5563', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <p style={{ fontSize: 12, color: '#4B5563', margin: 0, textAlign: 'right' }}>
                Need help right now? You're not alone. Support is available.
              </p>
              <button style={{
                padding: '10px 20px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                background: 'linear-gradient(135deg,#6D4AFF,#5B21B6)', color: 'white',
                border: 'none', cursor: 'pointer',
              }}>Crisis Resources</button>
            </div>
          </div>

        </div>{/* end main */}
      </div>{/* end layout */}

      {/* ── MODALS ── */}
      {consentHealer && (
        <ConsentModal healer={consentHealer} onClose={() => setConsentHealer(null)} onAgree={handleConsentAgree} />
      )}
      {bookingHealer && (
        <BookingModal healer={bookingHealer} grad={bookingGrad} onClose={() => setBookingHealer(null)} onConfirm={() => setBookingHealer(null)} />
      )}
      {showAssessment && (
        <AssessmentModal onClose={() => setShowAssessment(false)} />
      )}
    </>
  );
}
