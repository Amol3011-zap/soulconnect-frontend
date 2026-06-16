import React, { useState, useEffect, useRef, useCallback } from 'react';
import { healerAPI } from '../services/api';

const DEMO_HEALERS = [
  {
    id: 1, name: 'Dr. Priya Sharma', avatar_url: null, initials: 'PS',
    specializations: ['Anxiety & Panic', 'Depression', 'Trauma & PTSD'],
    bio: 'Clinical psychologist with 8 years of experience helping people overcome anxiety, depression, and trauma using evidence-based CBT and mindfulness approaches.',
    hourly_rate: 1200, total_rating: 4.9, review_count: 134, experience_years: 8,
    session_type: 'Video & Chat', languages: ['English', 'Hindi'],
    badge: 'Top Rated', badge_color: '#f59e0b',
  },
  {
    id: 2, name: 'Rahul Mehta', avatar_url: null, initials: 'RM',
    specializations: ['Relationships', 'Grief & Loss', 'Life Transitions'],
    bio: 'Certified counsellor specialising in relationship issues, grief processing, and life transitions. I create a warm, judgment-free space for you to heal.',
    hourly_rate: 800, total_rating: 4.7, review_count: 89, experience_years: 5,
    session_type: 'Video', languages: ['English', 'Hindi', 'Marathi'],
    badge: 'Most Popular', badge_color: '#7c3aed',
  },
  {
    id: 3, name: 'Meera Nair', avatar_url: null, initials: 'MN',
    specializations: ['Mindfulness', 'Sleep Issues', 'Anger Management'],
    bio: 'Yoga therapist and mindfulness coach blending ancient wisdom with modern psychology. Specialised in stress, sleep disorders, and emotional regulation.',
    hourly_rate: 600, total_rating: 4.8, review_count: 67, experience_years: 6,
    session_type: 'Video & In-person', languages: ['English', 'Malayalam', 'Hindi'],
    badge: 'New', badge_color: '#10b981',
  },
];

const GRAD_COLORS = [
  'linear-gradient(135deg, #7c3aed, #2563eb)',
  'linear-gradient(135deg, #0891b2, #2563eb)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #dc2626)',
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

// ── Consent Modal ─────────────────────────────────────────────────────────────
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

function ConsentModal({ healer, onClose, onAgree }) {
  const [agreed, setAgreed] = useState(false);
  const [sigMode, setSigMode] = useState('draw');
  const [typedSig, setTypedSig] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a3d2e';
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
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const canProceed = agreed && (sigMode === 'type' ? typedSig.trim().length >= 2 : hasDrawn);

  const handleAgree = () => {
    if (!canProceed) return;
    const sig = sigMode === 'draw'
      ? canvasRef.current.toDataURL()
      : typedSig.trim();
    onAgree(sig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)', maxHeight: '92dvh', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,rgba(26,61,46,0.06),rgba(45,106,79,0.04))' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-base">📋</span>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>Client Consent &amp; Disclaimer</h2>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Read carefully before booking with {healer?.name}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:opacity-70 shrink-0 ml-4"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>✕</button>
        </div>

        {/* Consent content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'thin' }}>
          {/* Intro */}
          <div className="rounded-2xl p-4 mb-5"
            style={{ background: 'rgba(26,61,46,0.06)', border: '1px solid rgba(26,61,46,0.15)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              By booking a session, purchasing a service, attending a workshop, or continuing with any SoulConnect
              program, you acknowledge and agree to the following:
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {CONSENT_SECTIONS.map((s, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-bold mb-1.5" style={{ color: '#1a3d2e' }}>
                  {i + 1}. {s.heading}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Date + Signature placeholders in doc */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl p-3" style={{ border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>DATE</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="rounded-xl p-3" style={{ border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>HEALER</p>
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{healer?.name}</p>
            </div>
          </div>

          <p className="text-center text-[10px] mt-4 pb-2" style={{ color: 'var(--text-muted)' }}>
            — End of Consent Form —
          </p>
        </div>

        {/* Footer — agreement + signature */}
        <div className="shrink-0 px-5 py-4 space-y-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>

          {/* Agreement checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="sr-only" />
              <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer"
                style={{
                  background: agreed ? '#1a3d2e' : 'var(--bg-subtle)',
                  border: `2px solid ${agreed ? '#1a3d2e' : 'var(--border)'}`,
                }}>
                {agreed && <span className="text-white text-xs font-bold">✓</span>}
              </div>
            </div>
            <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I have read and fully understand this Consent &amp; Disclaimer Form. I voluntarily agree to its terms and understand it is not medical treatment.
            </span>
          </label>

          {/* Digital signature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Digital Signature</p>
              <div className="flex gap-1">
                {[{ id: 'draw', label: '✍️ Draw' }, { id: 'type', label: '⌨️ Type' }].map(({ id, label }) => (
                  <button key={id} onClick={() => { setSigMode(id); setHasDrawn(false); setTypedSig(''); }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: sigMode === id ? '#1a3d2e' : 'var(--bg-subtle)',
                      color: sigMode === id ? 'white' : 'var(--text-muted)',
                    }}>
                    {label}
                  </button>
                ))}
                {sigMode === 'draw' && hasDrawn && (
                  <button onClick={clearCanvas}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {sigMode === 'draw' ? (
              <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${hasDrawn ? '#1a3d2e' : 'var(--border)'}` }}>
                <canvas
                  ref={canvasRef}
                  width={560} height={90}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                  className="w-full block touch-none cursor-crosshair"
                  style={{ height: 90, background: '#fafaf9' }}
                />
              </div>
            ) : (
              <input
                value={typedSig}
                onChange={e => setTypedSig(e.target.value)}
                placeholder="Type your full name as signature"
                className="w-full px-4 py-3 rounded-2xl text-lg focus:outline-none"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text)',
                  border: `2px solid ${typedSig ? '#1a3d2e' : 'var(--border)'}`,
                }}
              />
            )}
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {sigMode === 'draw' ? 'Sign using your mouse or finger' : 'Your typed name acts as your legal electronic signature'} · {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleAgree}
            disabled={!canProceed}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: canProceed ? 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' : 'var(--bg-subtle)', color: canProceed ? 'white' : 'var(--text-muted)' }}>
            {canProceed ? 'I Agree & Continue to Booking →' : agreed ? (sigMode === 'draw' ? 'Please draw your signature above' : 'Please type your full name above') : 'Please check the agreement box above'}
          </button>

          <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
            🔒 This consent is recorded with your booking · Support@soulconnect.health
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Booking Modal ──────────────────────────────────────────────────────────────
function BookingModal({ healer, grad, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = confirmed
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-md rounded-3xl p-8 text-center shadow-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: grad }}>✅</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Session Requested!</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
            Your booking request has been sent to <strong>{healer.name}</strong>.
          </p>

          {/* Breathing prompt */}
          <div className="rounded-2xl px-5 py-4 mb-4 text-sm font-medium leading-relaxed"
            style={{ background: 'linear-gradient(135deg,rgba(45,106,79,0.12),rgba(26,61,46,0.08))', border: '1px solid rgba(45,106,79,0.25)', color: '#1a3d2e' }}>
            🌿 While we prepare your session, take a deep breath and relax.
          </div>

          <div className="rounded-2xl px-4 py-3 mb-5 text-sm font-semibold" style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
            📅 {selectedSlot.day} at {selectedSlot.time}
          </div>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            You'll receive a confirmation once {healer.name} accepts the request. Check your profile for updates.
          </p>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: grad }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b sticky top-0 z-10"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
            style={{ background: grad }}>{healer.initials}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Book a Session</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>with {healer.name} · ₹{healer.hourly_rate}/session</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm hover:opacity-60"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>✕</button>
        </div>

        {/* Scrollable form */}
        <div className="overflow-y-auto px-5 py-5 space-y-6" style={{ maxHeight: 'calc(92vh - 130px)' }}>

          {/* 1. Issues */}
          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
              What are you struggling with? <span className="text-red-400">*</span>
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {ISSUE_OPTIONS.map(issue => {
                const selected = issues.includes(issue);
                return (
                  <button key={issue} onClick={() => toggleIssue(issue)}
                    className="text-xs px-3 py-1.5 rounded-full font-medium border transition-all"
                    style={selected
                      ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1))', borderColor: '#7c3aed', color: '#7c3aed' }
                      : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                    }>
                    {selected && '✓ '}{issue}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Duration */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>
              How long have you been experiencing this? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setDuration(opt)}
                  className="text-xs px-3 py-2.5 rounded-xl font-medium border text-left transition-all"
                  style={duration === opt
                    ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1))', borderColor: '#7c3aed', color: '#7c3aed' }
                    : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                  }>
                  {duration === opt ? '● ' : '○ '}{opt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Medication */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>
              Are you currently on any medication?
            </label>
            <div className="flex gap-2">
              {['Yes', 'No', 'Not sure'].map(opt => (
                <button key={opt} onClick={() => setMedication(opt)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={medication === opt
                    ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))', borderColor: '#7c3aed', color: '#7c3aed' }
                    : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                  }>
                  {opt}
                </button>
              ))}
            </div>
            {medication === 'Yes' && (
              <input
                className="mt-2 w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }}
                placeholder="Please mention the medication (optional)"
              />
            )}
          </div>

          {/* 4. Previous therapy */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>
              Have you previously taken counselling or therapy?
            </label>
            <div className="flex gap-2">
              {['Yes', 'No'].map(opt => (
                <button key={opt} onClick={() => setPrevTherapy(opt)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={prevTherapy === opt
                    ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))', borderColor: '#7c3aed', color: '#7c3aed' }
                    : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                  }>
                  {opt}
                </button>
              ))}
            </div>
            {prevTherapy === 'Yes' && (
              <input
                className="mt-2 w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }}
                placeholder="What kind of therapy? How did it go? (optional)"
              />
            )}
          </div>

          {/* 5. Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                Describe your situation in your own words <span className="text-red-400">*</span>
              </label>
              <span className="text-xs font-semibold"
                style={{ color: wordCount > MAX_WORDS * 0.9 ? '#dc2626' : 'var(--text-muted)' }}>
                {wordCount}/{MAX_WORDS} words
              </span>
            </div>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              rows={5}
              placeholder="Share what you're going through — the more you share, the better your healer can prepare for your session. There's no judgment here. Write as much or as little as feels right."
              className="w-full px-4 py-3 rounded-2xl text-sm leading-relaxed focus:outline-none resize-none"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }}
            />
            {/* Word count bar */}
            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%`,
                  background: wordCount > MAX_WORDS * 0.9 ? '#dc2626' : 'linear-gradient(90deg,#7c3aed,#2563eb)',
                }} />
            </div>
          </div>

          {/* 6. Time slots */}
          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
              Choose an available time slot <span className="text-red-400">*</span>
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>All times are in IST</p>
            <div className="space-y-3">
              {Object.entries(TIME_SLOTS).map(([day, times]) => (
                <div key={day}>
                  <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>{day}</p>
                  <div className="flex flex-wrap gap-2">
                    {times.map(time => {
                      const isSelected = selectedSlot?.day === day && selectedSlot?.time === time;
                      return (
                        <button key={time}
                          onClick={() => setSelectedSlot(isSelected ? null : { day, time })}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all"
                          style={isSelected
                            ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white', borderColor: 'transparent' }
                            : { background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
                          }>
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Privacy note */}
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <span className="text-sm shrink-0">🔒</span>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Everything you share is strictly confidential and only visible to <strong>{healer.name}</strong>. We follow full HIPAA-aligned privacy practices.
            </p>
          </div>

          {/* Submit */}
          <button onClick={submit}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: grad }}>
            Confirm Booking Request →
          </button>

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// ── Healer styles ──────────────────────────────────────────────────────────────
const HEALER_STYLES = `
  @keyframes healAurora1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.15)} }
  @keyframes healAurora2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,40px) scale(1.1)} }
  @keyframes healAurora3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,20px) scale(1.08)} }
  @keyframes healStarPulse { 0%,100%{opacity:0.1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.8)} }
  @keyframes healCardHover { from{transform:translateY(0)} to{transform:translateY(-6px)} }
  @keyframes healFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
  .healer-card { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease; }
  .healer-card:hover { transform: translateY(-6px); }
`;

const CARD_ACCENTS = ['#7c3aed', '#0891b2', '#059669', '#d97706'];

// ── Healer Card ────────────────────────────────────────────────────────────────
function HealerCard({ healer, index, onBook }) {
  const grad = GRAD_COLORS[index % GRAD_COLORS.length];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const initial = healer.initials?.[0] || healer.name?.[0] || '?';

  return (
    <div className="healer-card" style={{
      background: 'rgba(6,1,18,0.92)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: `1px solid ${accent}28`,
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: `0 0 0 1px ${accent}12, 0 20px 60px rgba(0,0,0,0.6)`,
      position: 'relative',
    }}>
      {/* Top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Inner glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: `radial-gradient(ellipse at 50% 0%, ${accent}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '24px 24px 0', position: 'relative' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Monogram */}
          <div style={{
            fontSize: 52, fontWeight: 900, fontStyle: 'italic', lineHeight: 0.9,
            background: `linear-gradient(160deg, ${accent} 0%, rgba(255,255,255,0.9) 55%, ${accent}80 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 20px ${accent}50)`,
            letterSpacing: '-0.04em',
          }}>{initial}</div>

          <div style={{ textAlign: 'right' }}>
            {/* Badge */}
            {healer.badge && (
              <div style={{
                display: 'inline-block',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 20, marginBottom: 8,
                background: `${healer.badge_color || accent}22`,
                border: `1px solid ${healer.badge_color || accent}55`,
                color: healer.badge_color || accent,
              }}>{healer.badge}</div>
            )}
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <span style={{ color: '#a78bfa', fontSize: 14 }}>★</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#a78bfa' }}>{healer.total_rating?.toFixed(1)}</span>
              <span style={{ fontSize: 10, color: 'rgba(139,92,246,0.45)', letterSpacing: '0.08em' }}>
                ({healer.review_count})
              </span>
            </div>
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 4 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ebe4ff', letterSpacing: '-0.02em', margin: 0 }}>
            {healer.name}
          </h3>
        </div>

        {/* Specialties as dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {(healer.specializations || []).slice(0, 3).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(235,228,255,0.55)', letterSpacing: '0.04em' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Soul Reading label */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.4)' }}>◆ Healer Bio</span>
        </div>

        {/* Bio as hero italic */}
        <p style={{
          fontSize: 13, fontStyle: 'italic', color: 'rgba(235,228,255,0.72)',
          lineHeight: 1.75, margin: '0 0 18px',
        }}>
          "{healer.bio?.slice(0, 110)}{healer.bio?.length > 110 ? '…' : ''}"
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 16, paddingBottom: 18,
          borderBottom: `1px solid ${accent}18`,
        }}>
          {[
            { label: 'Experience', value: `${healer.experience_years || '?'} yrs` },
            { label: 'Format', value: healer.session_type || 'Video' },
            { label: 'Languages', value: (healer.languages || ['En']).slice(0, 2).join(', ') },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.3)', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(235,228,255,0.7)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <button
        onClick={() => onBook(healer, grad)}
        style={{
          width: '100%', padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          borderTop: `1px solid ${accent}20`,
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${accent}14`}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#a78bfa' }}>₹{healer.hourly_rate}</span>
          <span style={{ fontSize: 10, color: 'rgba(139,92,246,0.45)', letterSpacing: '0.1em' }}>/session</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(235,228,255,0.6)' }}>Book Session</span>
          <span style={{ fontSize: 20, color: '#a78bfa', lineHeight: 1 }}>→</span>
        </div>
      </button>
    </div>
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

  const FILTERS = ['All', 'Anxiety', 'Depression', 'Relationships', 'Trauma', 'Mindfulness'];

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
    setConsentGrad(grad);
  };

  const handleConsentAgree = (sig) => {
    setBookingHealer(consentHealer);
    setBookingGrad(consentGrad);
    setConsentHealer(null);
    setConsentGrad('');
  };

  const STARS = Array.from({ length: 20 }, (_, i) => ({
    l: `${(i * 17 + 5) % 100}%`, t: `${(i * 23 + 8) % 100}%`,
    s: [1, 1.5, 2][i % 3], c: ['#a78bfa','#c4b5fd','#ffffff'][i % 3], d: (i * 0.3) % 3,
  }));

  return (
    <>
      <style>{HEALER_STYLES}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #030009 0%, #0a0225 50%, #040112 100%)', position: 'relative', overflow: 'hidden' }}>

        {/* Aurora blobs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', animation: 'healAurora1 18s ease-in-out infinite', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(8,145,178,0.14) 0%, transparent 70%)', animation: 'healAurora2 22s ease-in-out infinite', filter: 'blur(70px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', animation: 'healAurora3 26s ease-in-out infinite', filter: 'blur(80px)' }} />
          {STARS.map((p, i) => (
            <div key={i} style={{ position: 'absolute', left: p.l, top: p.t, width: p.s, height: p.s, borderRadius: '50%', background: p.c, animation: `healStarPulse ${2.5 + i % 3 * 0.5}s ease-in-out ${p.d}s infinite` }} />
          ))}
        </div>

        {/* ── HERO ── */}
        <div style={{ position: 'relative', zIndex: 1, padding: '60px 24px 50px', textAlign: 'center', borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
          {/* Ornamental divider top */}
          <div style={{ fontSize: 13, letterSpacing: '0.5em', color: 'rgba(139,92,246,0.3)', marginBottom: 28 }}>◆ ✦ ◆</div>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 40, marginBottom: 20, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 8px #a78bfa', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a78bfa' }}>Verified Professionals</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px', color: '#ebe4ff' }}>
            Find Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #e9d5ff 40%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Healer</span>
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(196,181,253,0.6)', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Connect with verified therapists, counsellors, and wellness practitioners who specialise in your area of need.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
            {[['500+', 'Healers'], ['4.8★', 'Avg Rating'], ['10K+', 'Sessions']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.4)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px 60px', position: 'relative', zIndex: 1 }}>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 32, scrollbarWidth: 'none' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0, padding: '8px 20px', borderRadius: 40, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                background: filter === f ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#fff' : 'rgba(196,181,253,0.5)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: filter === f ? '0 0 20px rgba(124,58,237,0.35)' : 'none',
              }}>{f}</button>
            ))}
          </div>

          {/* Cards grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ borderRadius: 24, height: 280, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
              {healers.map((healer, i) => (
                <HealerCard key={healer.id} healer={healer} index={i} onBook={openBooking} />
              ))}
            </div>
          )}

          {/* CTA banner */}
          <div style={{
            marginTop: 48, borderRadius: 24, padding: '32px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            background: 'rgba(6,1,18,0.85)', backdropFilter: 'blur(30px)',
            border: '1px solid rgba(124,58,237,0.2)',
            boxShadow: '0 0 60px rgba(124,58,237,0.08)',
          }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(139,92,246,0.5)', marginBottom: 8 }}>◆ For Practitioners</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ebe4ff', margin: '0 0 6px' }}>Are you a healer or therapist?</h3>
              <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.5)', margin: 0 }}>Join our verified network and reach thousands who need your guidance.</p>
            </div>
            <button style={{
              flexShrink: 0, padding: '12px 24px', borderRadius: 14, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none',
              cursor: 'pointer', boxShadow: '0 0 24px rgba(124,58,237,0.4)',
            }}>Apply Now →</button>
          </div>
        </div>
      </div>

      {/* Consent modal */}
      {consentHealer && (
        <ConsentModal healer={consentHealer} onClose={() => setConsentHealer(null)} onAgree={handleConsentAgree} />
      )}

      {/* Booking modal */}
      {bookingHealer && (
        <BookingModal healer={bookingHealer} grad={bookingGrad} onClose={() => setBookingHealer(null)} onConfirm={() => setBookingHealer(null)} />
      )}
    </>
  );
}
