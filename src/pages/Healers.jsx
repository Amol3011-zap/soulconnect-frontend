import React, { useState, useEffect } from 'react';
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
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
            Your booking request has been sent to <strong>{healer.name}</strong>.
          </p>
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

// ── Healer Card ────────────────────────────────────────────────────────────────
function HealerCard({ healer, index, onBook }) {
  const grad = GRAD_COLORS[index % GRAD_COLORS.length];
  return (
    <div className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="h-1.5" style={{ background: grad }} />
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: grad }}>
            {healer.avatar_url
              ? <img src={healer.avatar_url} alt={healer.name} className="w-full h-full rounded-2xl object-cover" />
              : healer.initials || healer.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>{healer.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{healer.total_rating?.toFixed(1)}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({healer.review_count} reviews)</span>
                </div>
              </div>
              {healer.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                  style={{ background: healer.badge_color || '#7c3aed' }}>
                  {healer.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{healer.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {(healer.specializations || []).slice(0, 3).map(s => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.15)' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Experience', value: `${healer.experience_years || '?'} yrs` },
            { label: 'Session', value: healer.session_type || 'Video' },
            { label: 'Languages', value: (healer.languages || ['English']).slice(0, 2).join(', ') },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'var(--bg-subtle)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>₹{healer.hourly_rate}</span>
            <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/session</span>
          </div>
          <button
            onClick={() => onBook(healer, grad)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: grad }}>
            Book Session →
          </button>
        </div>
      </div>
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
    setBookingHealer(healer);
    setBookingGrad(grad);
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #1a3d2e 0%, #0f766e 50%, #1a3d2e 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)', filter: 'blur(40px)' }} />
        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-xs font-semibold" style={{ color: '#86efac' }}>Verified Professionals</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Healer</h1>
          <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Connect with verified therapists, counsellors, and wellness practitioners who specialise in your area of need.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[['500+', 'Healers'], ['4.8★', 'Avg Rating'], ['10K+', 'Sessions']].map(([val, label]) => (
              <div key={label}>
                <div className="text-white font-bold text-lg">{val}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={filter === f
                ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white' }
                : { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
              }>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'var(--bg-card)' }}>
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl" style={{ background: 'var(--bg-subtle)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded w-2/3" style={{ background: 'var(--bg-subtle)' }} />
                    <div className="h-3 rounded w-1/2" style={{ background: 'var(--bg-subtle)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {healers.map((healer, i) => (
              <HealerCard key={healer.id} healer={healer} index={i} onBook={openBooking} />
            ))}
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-8 rounded-2xl p-6 flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(37,99,235,0.06))', border: '1px solid rgba(124,58,237,0.15)' }}>
          <div>
            <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>Are you a healer or therapist?</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Join our verified network and reach thousands of people who need your help.</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 rounded-xl font-semibold text-white text-sm hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
            Apply Now
          </button>
        </div>
      </div>

      {/* Booking modal */}
      {bookingHealer && (
        <BookingModal
          healer={bookingHealer}
          grad={bookingGrad}
          onClose={() => setBookingHealer(null)}
          onConfirm={() => setBookingHealer(null)}
        />
      )}
    </div>
  );
}
