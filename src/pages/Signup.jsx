import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

const PROBLEMS = [
  { value: 'anxiety', label: 'Anxiety', icon: '😰' },
  { value: 'depression', label: 'Depression', icon: '😢' },
  { value: 'ocd_intrusive_thoughts', label: 'OCD / Intrusive Thoughts', icon: '🔄' },
  { value: 'ptsd_trauma', label: 'PTSD / Trauma', icon: '⚠️' },
  { value: 'phobias', label: 'Phobias', icon: '😨' },
  { value: 'panic_attacks', label: 'Panic Attacks', icon: '💓' },
  { value: 'self_harm', label: 'Self-Harm / Suicidal Thoughts', icon: '🆘' },
  { value: 'relationship_breakup', label: 'Relationship Breakup', icon: '💔' },
  { value: 'divorce', label: 'Divorce', icon: '📋' },
  { value: 'marriage_problems', label: 'Marriage Problems', icon: '💑' },
  { value: 'family_relationships', label: 'Family Relationships', icon: '👨‍👩‍👧' },
  { value: 'trust_issues', label: 'Trust Issues', icon: '🤝' },
  { value: 'loneliness', label: 'Loneliness', icon: '😔' },
  { value: 'lack_of_confidence', label: 'Lack of Confidence', icon: '📉' },
  { value: 'grief_loss', label: 'Grief / Loss', icon: '🕯️' },
  { value: 'work_career_stress', label: 'Work / Career Stress', icon: '💼' },
  { value: 'financial_stress', label: 'Financial Stress', icon: '💸' },
  { value: 'addiction_substance_abuse', label: 'Addiction / Substance Abuse', icon: '⚕️' },
  { value: 'sleep_problems', label: 'Sleep Problems', icon: '😴' },
  { value: 'anger_management', label: 'Anger Management', icon: '😤' },
  { value: 'identity_sexual_orientation', label: 'Identity & Orientation', icon: '🌈' },
  { value: 'health_anxiety', label: 'Health Anxiety', icon: '🏥' },
  { value: 'eating_disorders', label: 'Eating Disorders', icon: '🍽️' },
  { value: 'bullying_harassment', label: 'Bullying / Harassment', icon: '😠' },
];

const HEALER_TYPES = [
  { value: 'counsellor', label: 'Counsellor', icon: '🗣️', desc: 'Talking therapy & emotional guidance' },
  { value: 'therapist', label: 'Therapist', icon: '🧠', desc: 'CBT, DBT & evidence-based therapy' },
  { value: 'psychiatrist', label: 'Psychiatrist', icon: '⚕️', desc: 'Medical & psychiatric support' },
  { value: 'life_coach', label: 'Life Coach', icon: '🎯', desc: 'Goal setting & personal growth' },
  { value: 'yoga_meditation', label: 'Yoga / Meditation', icon: '🧘', desc: 'Mindfulness & holistic wellness' },
  { value: 'reiki_healer', label: 'Reiki Healer', icon: '✨', desc: 'Energy healing & chakra balancing' },
  { value: 'nutritionist', label: 'Nutritionist', icon: '🥗', desc: 'Wellness through nutrition' },
  { value: 'art_music_therapy', label: 'Art / Music Therapy', icon: '🎨', desc: 'Creative expression therapy' },
  { value: 'hypnotherapist', label: 'Hypnotherapist', icon: '💫', desc: 'Subconscious healing' },
  { value: 'peer_support', label: 'Peer Support Specialist', icon: '🤝', desc: 'Lived experience support' },
];

const SPECIALIZATIONS = [
  'Anxiety & Panic', 'Depression', 'Trauma & PTSD', 'Relationships',
  'Grief & Loss', 'Addiction', 'Child & Adolescent', 'Couples Therapy',
  'Career & Life', 'Eating Disorders', 'LGBTQ+', 'Women\'s Health',
  'Mindfulness', 'Anger Management', 'OCD', 'Sleep Issues',
];

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Singapore', 'UAE', 'Saudi Arabia',
  'Nepal', 'Sri Lanka', 'Bangladesh', 'Pakistan', 'Malaysia',
  'New Zealand', 'South Africa', 'Nigeria', 'Kenya', 'Other',
];

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const inputClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors bg-white";
const selectClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500 transition-colors bg-white appearance-none cursor-pointer";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

function LeftPanel({ role }) {
  const isHealer = role === 'healer';
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden"
      style={{ background: isHealer
        ? 'linear-gradient(135deg, #052533 0%, #1b4d69 40%, #0f3460 100%)'
        : 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0f3460 100%)' }}>
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${isHealer ? '#22d3ee' : '#a855f7'}, transparent)`, filter: 'blur(40px)' }} />
      <div className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(50px)' }} />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: isHealer ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
            {isHealer ? '🧘' : '🌿'}
          </div>
          <span className="text-white text-xl font-bold tracking-tight">SoulConnect</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            {isHealer ? 'Share your gift.' : "You don't have to"}<br />
            <span style={{ background: isHealer
              ? 'linear-gradient(90deg, #22d3ee, #60a5fa)'
              : 'linear-gradient(90deg, #a855f7, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isHealer ? 'Transform lives.' : 'go through this alone.'}
            </span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            {isHealer
              ? 'Join our verified healer network and connect with people who need your expertise and compassion.'
              : 'Connect with real people who truly understand — because they\'ve been there too.'}
          </p>
          {isHealer ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '✅', label: 'Verified Profile' },
                { icon: '💰', label: 'Set Your Fees' },
                { icon: '📅', label: 'Flexible Schedule' },
                { icon: '🌍', label: 'Reach Thousands' },
              ].map(({ icon, label }) => (
                <div key={label} className="rounded-xl p-3 backdrop-blur-sm border border-white/10 flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <span>{icon}</span>
                  <span className="text-white/80 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                { quote: 'Finally found someone who gets my anxiety without judgment.', name: 'Priya S., Mumbai' },
                { quote: 'Real connections, real healing. SoulConnect changed my life.', name: 'Rahul M., Delhi' },
              ].map((t, i) => (
                <div key={i} className="rounded-2xl p-4 backdrop-blur-sm border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <p className="text-white/80 text-sm italic mb-2">"{t.quote}"</p>
                  <p className="text-purple-300 text-xs font-medium">— {t.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-8">
          {(isHealer
            ? [['500+', 'Healers'], ['10K+', 'Sessions'], ['4.9★', 'Avg Rating']]
            : [['10K+', 'Members'], ['95%', 'Feel Better'], ['Safe', '& Anonymous']]
          ).map(([val, label]) => (
            <div key={label}>
              <div className="text-white font-bold text-xl">{val}</div>
              <div className="text-blue-300 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
  const [role, setRole] = useState(''); // 'user' | 'healer'
  const [step, setStep] = useState(0); // 0 = role select, 1–4 = form steps
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // User-only
  const [selectedProblems, setSelectedProblems] = useState([]);

  // Healer-only
  const [healerType, setHealerType] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [experience, setExperience] = useState('');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [sessionFee, setSessionFee] = useState('');
  const [languages, setLanguages] = useState('');

  const [gpsLocation, setGpsLocation] = useState(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setGpsLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      );
    }
  }, []);

  const STEPS = role === 'healer'
    ? ['Basic Info', 'Location', 'Professional', 'Review']
    : ['Basic Info', 'Location', 'Your Struggle', 'Review'];

  const toggleSpec = (s) => setSpecializations((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
  );

  const validate = () => {
    if (step === 1) {
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return 'Enter a valid phone number';
      if (!name.trim()) return 'Your name is required';
      if (!age || isNaN(age) || +age < 13 || +age > 100) return 'Enter a valid age (13–100)';
      if (!gender) return 'Please select your gender';
    }
    if (step === 2) {
      if (!country) return 'Please select your country';
      if (!state.trim()) return 'Please enter your state';
      if (!city.trim()) return 'Please enter your city';
    }
    if (step === 3 && role === 'user' && selectedProblems.length < 2) return 'Please select at least 2 things you are going through';
    if (step === 3 && role === 'healer') {
      if (!healerType) return 'Please select your profession type';
      if (!experience) return 'Please enter your years of experience';
      if (!bio.trim() || bio.length < 30) return 'Bio must be at least 30 characters';
      if (!sessionFee) return 'Please enter your session fee';
    }
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const back = () => { setError(''); setStep((s) => s - 1); };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        phone: phone.replace(/\D/g, ''),
        name: name.trim(),
        age: parseInt(age),
        gender,
        country,
        state,
        city,
        role,
        latitude: gpsLocation?.latitude || 19.076,
        longitude: gpsLocation?.longitude || 72.8777,
        address: `${city}, ${state}, ${country}`,
        distance_preference: 10,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        ...(role === 'user' && {
          primary_problem: selectedProblems[0],
          secondary_problems: selectedProblems.slice(1),
        }),
        ...(role === 'healer' && {
          healer_type: healerType,
          specializations,
          experience_years: parseInt(experience),
          credentials: credentials.trim(),
          bio: bio.trim(),
          session_fee: parseFloat(sessionFee),
          languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
          primary_problem: 'anxiety', // required by backend, placeholder for healers
          secondary_problems: [],
        }),
      };
      const response = await authAPI.signup(payload);
      setAuth(response.data, response.data.access_token);
      navigate(role === 'healer' ? '/healer-dashboard' : '/matches');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(' | '));
      } else {
        setError(detail || err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleProblem = (val) => setSelectedProblems((prev) =>
    prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
  );
  const selectedHealerType = HEALER_TYPES.find((h) => h.value === healerType);
  const accentColor = role === 'healer' ? '#0891b2' : '#7c3aed';
  const accentGrad = role === 'healer'
    ? 'linear-gradient(135deg, #0891b2, #2563eb)'
    : 'linear-gradient(135deg, #7c3aed, #2563eb)';

  // ── Role Selection (Step 0) ──
  if (step === 0) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel role={role || 'user'} />
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>🌿</div>
              <span className="text-gray-800 text-lg font-bold">SoulConnect</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join SoulConnect</h1>
            <p className="text-gray-500 mb-8">How would you like to join us?</p>

            <div className="space-y-4 mb-8">
              {[
                {
                  value: 'user',
                  icon: '🌱',
                  title: 'I\'m seeking support',
                  desc: 'Connect with peers who understand your struggle and join a community that heals together.',
                  tags: ['Peer matching', 'Anonymous', 'Free to join'],
                  grad: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                },
                {
                  value: 'healer',
                  icon: '🧘',
                  title: 'I\'m a healer / professional',
                  desc: 'Offer your expertise as a counsellor, therapist, coach, or wellness practitioner.',
                  tags: ['Set your own fee', 'Verified profile', 'Grow your practice'],
                  grad: 'linear-gradient(135deg, #0891b2, #2563eb)',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 ${
                    role === opt.value
                      ? 'border-transparent shadow-lg scale-[1.01]'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  style={role === opt.value ? { background: 'white', boxShadow: `0 0 0 2px ${opt.value === 'healer' ? '#0891b2' : '#7c3aed'}, 0 8px 24px rgba(0,0,0,0.1)` } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: opt.grad }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{opt.title}</h3>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          role === opt.value ? 'border-transparent' : 'border-gray-300'
                        }`} style={role === opt.value ? { background: opt.grad } : {}}>
                          {role === opt.value && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{opt.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {opt.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: role === opt.value ? (opt.value === 'healer' ? '#e0f2fe' : '#ede9fe') : '#f3f4f6',
                              color: role === opt.value ? (opt.value === 'healer' ? '#0891b2' : '#7c3aed') : '#6b7280' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => { if (!role) { setError('Please select how you\'d like to join'); return; } setError(''); setStep(1); }}
              disabled={!role}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              style={{ background: role === 'healer' ? 'linear-gradient(135deg, #0891b2, #2563eb)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              Get Started →
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Steps 1–4 ──
  return (
    <div className="min-h-screen flex">
      <LeftPanel role={role} />

      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: accentGrad }}>
              {role === 'healer' ? '🧘' : '🌿'}
            </div>
            <span className="text-gray-800 text-lg font-bold">SoulConnect</span>
          </div>

          {/* Role badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: role === 'healer' ? '#e0f2fe' : '#ede9fe', color: accentColor }}>
            {role === 'healer' ? '🧘 Healer / Professional' : '🌱 Seeking Support'}
            <button onClick={() => { setStep(0); setError(''); }} className="ml-1 hover:opacity-70 text-xs">✕ change</button>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Step {step} of {STEPS.length} — {STEPS[step - 1]}</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center mb-7">
            {STEPS.map((label, i) => {
              const s = i + 1;
              const done = s < step;
              const active = s === step;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      done || active ? 'text-white' : 'bg-gray-200 text-gray-400'
                    }`} style={(done || active) ? { background: accentGrad } : {}}>
                      {done ? '✓' : s}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block`}
                      style={{ color: active ? accentColor : '#9ca3af' }}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mb-4 transition-all duration-300"
                      style={{ background: s < step ? accentColor : '#e5e7eb' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">+91</div>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
                    style={{ '--tw-ring-color': accentColor }}
                    onFocus={(e) => e.target.style.borderColor = accentColor}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Used to log in — never shared</p>
              </div>
              <div>
                <label className={labelClass}>{role === 'healer' ? 'Full Name' : 'Your Name'}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'healer' ? 'Dr. / Your full name' : 'What should we call you?'}
                  className={inputClass}
                  onFocus={(e) => e.target.style.borderColor = accentColor}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
                {role === 'healer' && <p className="text-xs text-gray-400 mt-1">Your name will be visible to clients</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 30" min="13" max="100" className={inputClass}
                    onFocus={(e) => e.target.style.borderColor = accentColor}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="relative">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}
                      onFocus={(e) => e.target.style.borderColor = accentColor}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non_binary">Non-binary</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
              <button onClick={next} className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: accentGrad }}>Continue →</button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: accentColor }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Country</label>
                <div className="relative">
                  <select value={country} onChange={(e) => { setCountry(e.target.value); setState(''); }} className={selectClass}>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                </div>
              </div>
              <div>
                <label className={labelClass}>State / Province</label>
                {country === 'India' ? (
                  <div className="relative">
                    <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
                      <option value="">Select state</option>
                      {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                  </div>
                ) : (
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                    placeholder="Enter your state / province" className={inputClass} />
                )}
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">
                  {role === 'healer' ? 'Helps local clients find you' : 'Helps us find nearby peers & meetups'}
                </p>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={back} className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Back</button>
                <button onClick={next} className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90"
                  style={{ background: accentGrad }}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3A: User — Struggle ── */}
          {step === 3 && role === 'user' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">What are you going through?</p>
              <p className="text-xs text-gray-400 mb-1">Select at least 2 — your first pick is your primary focus</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((selectedProblems.length / 2) * 100, 100)}%`, background: accentGrad }} />
                </div>
                <span className="text-xs font-semibold shrink-0" style={{ color: selectedProblems.length >= 2 ? accentColor : '#9ca3af' }}>
                  {selectedProblems.length} selected{selectedProblems.length >= 2 ? ' ✓' : ' (min 2)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: `${accentColor} #f3f4f6` }}>
                {PROBLEMS.map((prob) => {
                  const isSelected = selectedProblems.includes(prob.value);
                  const order = selectedProblems.indexOf(prob.value);
                  return (
                    <button key={prob.value} onClick={() => toggleProblem(prob.value)}
                      className={`p-3 rounded-xl text-left transition-all border-2 relative ${
                        isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-100 bg-white hover:border-purple-200'
                      }`}>
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                          style={{ background: accentGrad }}>
                          {order === 0 ? '★' : order + 1}
                        </span>
                      )}
                      <div className="text-xl mb-1">{prob.icon}</div>
                      <div className="text-xs font-medium text-gray-700 leading-tight">{prob.label}</div>
                    </button>
                  );
                })}
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Back</button>
                <button onClick={next} disabled={selectedProblems.length < 2} className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40"
                  style={{ background: accentGrad }}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3B: Healer — Professional Info ── */}
          {step === 3 && role === 'healer' && (
            <div className="space-y-5">
              {/* Profession Type */}
              <div>
                <label className={labelClass}>Your Profession</label>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1"
                  style={{ scrollbarWidth: 'thin' }}>
                  {HEALER_TYPES.map((h) => (
                    <button key={h.value} onClick={() => setHealerType(h.value)}
                      className={`p-3 rounded-xl text-left transition-all border-2 ${
                        healerType === h.value ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 bg-white hover:border-cyan-200'
                      }`}>
                      <div className="text-xl mb-1">{h.icon}</div>
                      <div className="text-xs font-semibold text-gray-800">{h.label}</div>
                      <div className="text-xs text-gray-500 leading-tight mt-0.5">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className={labelClass}>Specializations <span className="text-gray-400 font-normal">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((s) => (
                    <button key={s} onClick={() => toggleSpec(s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                        specializations.includes(s) ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 bg-white text-gray-600 hover:border-cyan-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience + Fee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Experience (yrs)</label>
                  <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5" min="0" max="60" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Session Fee (₹)</label>
                  <input type="number" value={sessionFee} onChange={(e) => setSessionFee(e.target.value)}
                    placeholder="e.g. 500" min="0" className={inputClass} />
                </div>
              </div>

              {/* Credentials */}
              <div>
                <label className={labelClass}>Credentials / Qualifications</label>
                <input type="text" value={credentials} onChange={(e) => setCredentials(e.target.value)}
                  placeholder="e.g. M.A. Psychology, RCI Licensed" className={inputClass} />
              </div>

              {/* Languages */}
              <div>
                <label className={labelClass}>Languages Spoken</label>
                <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g. English, Hindi, Marathi" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
              </div>

              {/* Bio */}
              <div>
                <label className={labelClass}>About You <span className="text-gray-400 font-normal">({bio.length}/300)</span></label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  placeholder="Tell potential clients about your approach, background, and how you can help them..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors bg-white resize-none" />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Back</button>
                <button onClick={next} className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90"
                  style={{ background: accentGrad }}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div>
              <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 p-5 mb-4 space-y-2.5">
                <h3 className="font-semibold text-gray-700 text-sm mb-2">Review your profile</h3>
                {[
                  { label: 'Phone', value: `+91 ${phone}` },
                  { label: 'Name', value: name },
                  { label: 'Age', value: `${age} years` },
                  { label: 'Gender', value: gender.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
                  { label: 'Location', value: `${city}, ${state}, ${country}` },
                  ...(role === 'user' ? [
                    { label: 'Primary focus', value: selectedProblems[0] ? `${PROBLEMS.find(p=>p.value===selectedProblems[0])?.icon} ${PROBLEMS.find(p=>p.value===selectedProblems[0])?.label}` : '' },
                    ...(selectedProblems.length > 1 ? [{ label: 'Also going through', value: selectedProblems.slice(1).map(v => PROBLEMS.find(p=>p.value===v)?.label).join(', ') }] : []),
                  ] : [
                    { label: 'Profession', value: selectedHealerType ? `${selectedHealerType.icon} ${selectedHealerType.label}` : '' },
                    { label: 'Experience', value: `${experience} years` },
                    { label: 'Session Fee', value: `₹${sessionFee}` },
                    { label: 'Credentials', value: credentials || '—' },
                    { label: 'Languages', value: languages || '—' },
                    ...(specializations.length ? [{ label: 'Specializations', value: specializations.join(', ') }] : []),
                  ]),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-gray-500 font-medium shrink-0 mr-4">{label}</span>
                    <span className="text-sm text-gray-800 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 rounded-xl p-3 mb-4 border"
                style={{ background: role === 'healer' ? '#e0f2fe' : '#fefce8', borderColor: role === 'healer' ? '#bae6fd' : '#fde68a' }}>
                <span className="mt-0.5 shrink-0">{role === 'healer' ? 'ℹ️' : '🔒'}</span>
                <p className="text-xs" style={{ color: role === 'healer' ? '#0369a1' : '#92400e' }}>
                  {role === 'healer'
                    ? 'Your profile will be reviewed within 24 hours. You\'ll receive a confirmation once verified.'
                    : 'Your info is private. Only your first name and struggle category are visible to matched peers.'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={back} className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">Back</button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: accentGrad }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
                    : role === 'healer' ? 'Join as Healer 🧘' : 'Join SoulConnect 🌿'}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                By joining, you agree to our{' '}
                <span className="text-purple-500 cursor-pointer hover:underline">Terms</span> &{' '}
                <span className="text-purple-500 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
