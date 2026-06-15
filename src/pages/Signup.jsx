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

const STEPS = ['Basic Info', 'Location', 'Your Struggle', 'Review'];

const inputClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors bg-white";
const selectClass = "w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500 transition-colors bg-white appearance-none cursor-pointer";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

function LeftPanel({ heading, sub }) {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0f3460 100%)' }}>
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(50px)' }} />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>🌿</div>
          <span className="text-white text-xl font-bold tracking-tight">SoulConnect</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            {heading}<br />
            <span style={{ background: 'linear-gradient(90deg, #a855f7, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {sub}
            </span>
          </h2>
          <p className="text-purple-200 text-lg leading-relaxed mb-10">
            Connect with real people who truly understand — because they've been there too.
          </p>
          <div className="flex flex-col gap-4">
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
        </div>
        <div className="flex gap-8">
          {[['10K+', 'Members'], ['95%', 'Feel Less Alone'], ['Safe', '& Anonymous']].map(([val, label]) => (
            <div key={label}>
              <div className="text-white font-bold text-xl">{val}</div>
              <div className="text-purple-300 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 fields
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Step 3 fields
  const [primaryProblem, setPrimaryProblem] = useState('');

  // GPS
  const [gpsLocation, setGpsLocation] = useState(null);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGpsLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      });
    }
  }, []);

  const validate = () => {
    if (step === 1) {
      if (!phone.trim()) return 'Phone number is required';
      if (phone.replace(/\D/g, '').length < 10) return 'Enter a valid phone number';
      if (!name.trim()) return 'Your name is required';
      if (!age || isNaN(age) || +age < 13 || +age > 100) return 'Enter a valid age (13–100)';
      if (!gender) return 'Please select your gender';
    }
    if (step === 2) {
      if (!country) return 'Please select your country';
      if (!state.trim()) return 'Please enter your state';
      if (!city.trim()) return 'Please enter your city';
    }
    if (step === 3) {
      if (!primaryProblem) return 'Please select what you are going through';
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
      const response = await authAPI.signup({
        phone: phone.replace(/\D/g, ''),
        name: name.trim(),
        age: parseInt(age),
        gender,
        country,
        state,
        city,
        primary_problem: primaryProblem,
        secondary_problems: [],
        latitude: gpsLocation?.latitude || 19.076,
        longitude: gpsLocation?.longitude || 72.8777,
        address: `${city}, ${state}, ${country}`,
        distance_preference: 10,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      });
      setAuth(response.data, response.data.access_token);
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedProblem = PROBLEMS.find((p) => p.value === primaryProblem);

  const stepPanelText = [
    { heading: "You don't have to", sub: 'go through this alone.' },
    { heading: 'Your community is', sub: 'closer than you think.' },
    { heading: 'Healing starts with', sub: 'being understood.' },
    { heading: "Almost there —", sub: 'your people await.' },
  ][step - 1];

  return (
    <div className="min-h-screen flex">
      <LeftPanel heading={stepPanelText.heading} sub={stepPanelText.sub} />

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>🌿</div>
            <span className="text-gray-800 text-lg font-bold">SoulConnect</span>
          </div>

          <div className="mb-6">
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${done ? 'bg-purple-600 text-white' : active ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-gray-200 text-gray-400'}`}>
                      {done ? '✓' : s}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block ${active ? 'text-purple-600' : 'text-gray-400'}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${s < step ? 'bg-purple-600' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">+91</div>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors bg-white" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Used to log in — never shared</p>
              </div>

              {/* Name */}
              <div>
                <label className={labelClass}>Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Only your first name is shown to peers</p>
              </div>

              {/* Age + Gender side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24" min="13" max="100" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="relative">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
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

              <button onClick={next}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 mt-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                Continue →
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Country */}
              <div>
                <label className={labelClass}>Country</label>
                <div className="relative">
                  <select value={country} onChange={(e) => { setCountry(e.target.value); setState(''); }}
                    className={selectClass}>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                </div>
              </div>

              {/* State */}
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

              {/* City */}
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city" className={inputClass} />
                <p className="text-xs text-gray-400 mt-1">Helps us find nearby peers and meetups</p>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button onClick={back}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Back
                </button>
                <button onClick={next}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Struggle ── */}
          {step === 3 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">What are you going through?</p>
              <p className="text-xs text-gray-400 mb-4">Select what resonates most — this helps us find the right people for you</p>

              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#a855f7 #f3f4f6' }}>
                {PROBLEMS.map((prob) => (
                  <button key={prob.value + prob.label} onClick={() => setPrimaryProblem(prob.value)}
                    className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                      primaryProblem === prob.value
                        ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                        : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/50'
                    }`}>
                    <div className="text-xl mb-1">{prob.icon}</div>
                    <div className="text-xs font-medium text-gray-700 leading-tight">{prob.label}</div>
                  </button>
                ))}
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">{error}</p>}

              <div className="flex gap-3">
                <button onClick={back}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Back
                </button>
                <button onClick={next} disabled={!primaryProblem}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div>
              <div className="rounded-2xl border-2 border-purple-100 bg-purple-50/50 p-5 mb-4 space-y-3">
                <h3 className="font-semibold text-gray-700 text-sm mb-1">Review your profile</h3>
                {[
                  { label: 'Phone', value: `+91 ${phone}` },
                  { label: 'Name', value: name },
                  { label: 'Age', value: `${age} years` },
                  { label: 'Gender', value: gender.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                  { label: 'Country', value: country },
                  { label: 'State', value: state },
                  { label: 'City', value: city },
                  { label: 'Going through', value: selectedProblem ? `${selectedProblem.icon} ${selectedProblem.label}` : '' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center border-b border-purple-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-gray-500 font-medium">{label}</span>
                    <span className="text-sm text-gray-800 font-semibold text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <span className="text-amber-500 mt-0.5 shrink-0">🔒</span>
                <p className="text-xs text-amber-700">Your info is private. Only your first name and struggle category are visible to matched peers.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={back}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Back
                </button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
                    : 'Join SoulConnect 🌿'}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                By joining, you agree to our{' '}
                <span className="text-purple-500 cursor-pointer hover:underline">Terms</span>
                {' '}&{' '}
                <span className="text-purple-500 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
