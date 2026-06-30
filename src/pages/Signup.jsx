import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
const P    = '#6D4AFF';
const LAV  = '#A78BFA';
const GLD  = '#F5B841';
const PNK  = '#F472B6';
const DARK = '#120B2E';

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

export default function Signup() {
  const [role, setRole] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [pendingNav, setPendingNav] = useState('');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [selectedProblems, setSelectedProblems] = useState([]);

  const [healerType, setHealerType] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [experience, setExperience] = useState('');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [sessionFee, setSessionFee] = useState('');
  const [languages, setLanguages] = useState('');

  const [gpsLocation, setGpsLocation] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
    : ['Basic Info', 'Location', 'Your Struggles', 'Review'];

  const toggleProblem = (val) =>
    setSelectedProblems((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );

  const toggleSpec = (s) =>
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const validate = () => {
    const errs = {};

    if (step === 1) {
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = 'Valid phone required';
      if (!password || password.length < 6) errs.password = 'Min 6 characters';
      if (!name.trim()) errs.name = 'Name is required';
      if (!age || isNaN(age) || +age < 13 || +age > 100) errs.age = 'Enter valid age (13–100)';
      if (!gender) errs.gender = 'Gender required';
    }
    if (step === 2) {
      if (!country) errs.country = 'Country required';
      if (!state.trim()) errs.state = 'State required';
      if (!city.trim()) errs.city = 'City required';
    }
    if (step === 3 && role === 'user' && selectedProblems.length < 2) {
      errs.problems = 'Select at least 2 struggles';
    }
    if (step === 3 && role === 'healer') {
      if (!healerType) errs.healerType = 'Select profession';
      if (!experience) errs.experience = 'Years required';
      if (!bio.trim() || bio.length < 30) errs.bio = 'Min 30 chars';
      if (!sessionFee) errs.sessionFee = 'Session fee required';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setError('');
    setStep((s) => s + 1);
  };

  const back = () => {
    setError('');
    setFieldErrors({});
    setStep((s) => s - 1);
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        phone: phone.replace(/\D/g, ''),
        password,
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
          primary_problem: 'anxiety',
          secondary_problems: [],
        }),
      };

      const response = await authAPI.signup(payload);
      setAuth(response.data, response.data.access_token, role);
      const dest = role === 'healer' ? '/healer-dashboard' : '/onboarding';
      setPendingNav(dest);
      setShowWelcome(true);

      setTimeout(() => navigate(dest), 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((e) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(' | '));
      } else {
        setError(detail || err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedHealerType = HEALER_TYPES.find((h) => h.value === healerType);

  /* ── STEP 0: Role Selection ── */
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* LEFT PANEL */}
        <div
          className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-center items-center text-center p-12"
          style={{
            background: `linear-gradient(155deg, #0A0222 0%, #120B2E 40%, #1E0848 70%, #0A0222 100%)`,
          }}
        >
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🪷
            </motion.div>

            <motion.h1
              className="text-4xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              You don't have to go through this alone.
            </motion.h1>

            <motion.p
              className="text-lg text-white/70 max-w-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Every meaningful connection starts with one small step. Join a community built around empathy, healing, and real conversations.
            </motion.p>

            <motion.div
              className="grid grid-cols-3 gap-3 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: '🔒', label: 'Anonymous' },
                { icon: '✔️', label: 'Verified' },
                { icon: '🤝', label: 'Community' },
              ].map((card) => (
                <motion.div
                  key={card.label}
                  className="rounded-xl p-3 text-center border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className="text-xs font-medium text-white/80">{card.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-8 bg-white">
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <img
                src="/logo-footer.png"
                alt="SoulConnect"
                style={{
                  height: 40,
                  width: 'auto',
                  objectFit: 'contain',
                  maxWidth: 160,
                }}
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join SoulConnect</h1>
            <p className="text-gray-600 mb-8">How would you like to join us?</p>

            <div className="space-y-4 mb-8">
              {[
                {
                  value: 'user',
                  icon: '🌱',
                  title: 'I\'m seeking support',
                  desc: 'Connect with peers who understand your struggle',
                  tags: ['Peer matching', 'Anonymous', 'Free'],
                },
                {
                  value: 'healer',
                  icon: '🧘',
                  title: 'I\'m a healer / professional',
                  desc: 'Offer your expertise as a counsellor, therapist, or practitioner',
                  tags: ['Set your fee', 'Verified', 'Grow practice'],
                },
              ].map((opt) => (
                <motion.button
                  key={opt.value}
                  onClick={() => {
                    setRole(opt.value);
                    setStep(1);
                  }}
                  className="w-full text-left rounded-2xl p-6 border-2 transition-all bg-white"
                  style={{
                    borderColor: role === opt.value ? P : '#E5E7EB',
                    background: role === opt.value ? '#F9F7FF' : '#FFFFFF',
                    boxShadow: role === opt.value ? `0 0 20px ${P}33` : 'none',
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{opt.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{opt.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{opt.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {opt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                              background: opt.value === 'healer' ? '#D1FAE5' : '#EDE9FE',
                              color: opt.value === 'healer' ? '#065F46' : '#4C1D95',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: role === opt.value ? P : '#ddd' }}
                    >
                      {role === opt.value && (
                        <motion.div
                          className="w-3 h-3 rounded-full"
                          style={{ background: P }}
                          layoutId="selectedRoleIndicator"
                        />
                      )}
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: P }}>
                Sign In →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── STEP 1-4: Form Steps ── */
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-center p-12"
        style={{
          background: `linear-gradient(155deg, #0A0222 0%, #120B2E 40%, #1E0848 70%, #0A0222 100%)`,
        }}
      >
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="text-8xl mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🪷
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">You don't have to go through this alone.</h1>
          <p className="text-lg text-white/70 leading-relaxed">Every meaningful connection starts with one small step.</p>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-8 overflow-y-auto bg-white">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          key={step}
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{STEPS[step]}</h2>
              <span className="text-sm font-medium text-gray-500">
                Step {step} of {STEPS.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ background: `linear-gradient(90deg, ${P}, #8B5CF6)` }}
                initial={{ width: '0%' }}
                animate={{ width: `${(step / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 border border-red-200"
            >
              <span className="text-xl">⚠️</span>
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 mb-8">
              {[
                { label: 'Full Name', value: name, onChange: (e) => { setName(e.target.value); setFieldErrors({ ...fieldErrors, name: '' }); }, error: fieldErrors.name },
                { label: 'Phone', value: phone, onChange: (e) => { setPhone(e.target.value); setFieldErrors({ ...fieldErrors, phone: '' }); }, error: fieldErrors.phone, placeholder: '98765 43210' },
                { label: 'Password', type: 'password', value: password, onChange: (e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: '' }); }, error: fieldErrors.password },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    style={{ borderColor: field.error ? '#EF4444' : undefined, backgroundColor: field.error ? '#FEF2F2' : undefined }}
                  />
                  {field.error && <p className="text-xs text-red-600 mt-1.5">⚠️ {field.error}</p>}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => { setAge(e.target.value); setFieldErrors({ ...fieldErrors, age: '' }); }}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    style={{ borderColor: fieldErrors.age ? '#EF4444' : undefined, backgroundColor: fieldErrors.age ? '#FEF2F2' : undefined }}
                  />
                  {fieldErrors.age && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => { setGender(e.target.value); setFieldErrors({ ...fieldErrors, gender: '' }); }}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                    style={{ borderColor: fieldErrors.gender ? '#EF4444' : undefined, backgroundColor: fieldErrors.gender ? '#FEF2F2' : undefined }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {fieldErrors.gender && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.gender}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">Country</label>
                <select
                  value={country}
                  onChange={(e) => { setCountry(e.target.value); setFieldErrors({ ...fieldErrors, country: '' }); }}
                  className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">State</label>
                {country === 'India' ? (
                  <select
                    value={state}
                    onChange={(e) => { setState(e.target.value); setFieldErrors({ ...fieldErrors, state: '' }); }}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => { setState(e.target.value); setFieldErrors({ ...fieldErrors, state: '' }); }}
                    className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                )}
                {fieldErrors.state && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setFieldErrors({ ...fieldErrors, city: '' }); }}
                  className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
                {fieldErrors.city && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.city}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: Struggles or Professional */}
          {step === 3 && (
            <div className="space-y-5 mb-8">
              {role === 'user' ? (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-4">What are you dealing with? (Select at least 2)</p>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {PROBLEMS.map((p) => (
                      <motion.button
                        key={p.value}
                        onClick={() => toggleProblem(p.value)}
                        className="text-left p-3 rounded-lg border-2 transition-all text-sm font-medium flex items-center gap-2"
                        style={{
                          borderColor: selectedProblems.includes(p.value) ? P : '#E5E7EB',
                          background: selectedProblems.includes(p.value) ? `${P}10` : '#F9FAFB',
                          color: selectedProblems.includes(p.value) ? P : '#374151',
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{p.icon}</span>
                        {p.label}
                      </motion.button>
                    ))}
                  </div>
                  {fieldErrors.problems && <p className="text-xs text-red-600 mt-2">⚠️ {fieldErrors.problems}</p>}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5">Profession</label>
                    <select
                      value={healerType}
                      onChange={(e) => { setHealerType(e.target.value); setFieldErrors({ ...fieldErrors, healerType: '' }); }}
                      className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none"
                    >
                      <option value="">Select Profession</option>
                      {HEALER_TYPES.map((h) => (
                        <option key={h.value} value={h.value}>{h.label}</option>
                      ))}
                    </select>
                    {fieldErrors.healerType && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.healerType}</p>}
                  </div>

                  {selectedHealerType && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2.5">Specializations</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SPECIALIZATIONS.map((s) => (
                          <motion.button
                            key={s}
                            onClick={() => toggleSpec(s)}
                            className="text-left p-2.5 rounded-lg border-2 transition-all text-xs font-medium"
                            style={{
                              borderColor: specializations.includes(s) ? '#059669' : '#E5E7EB',
                              background: specializations.includes(s) ? '#D1FAE510' : '#F9FAFB',
                              color: specializations.includes(s) ? '#059669' : '#374151',
                            }}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5">Experience (Years)</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => { setExperience(e.target.value); setFieldErrors({ ...fieldErrors, experience: '' }); }}
                      className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      style={{ borderColor: fieldErrors.experience ? '#EF4444' : undefined, backgroundColor: fieldErrors.experience ? '#FEF2F2' : undefined }}
                    />
                    {fieldErrors.experience && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => { setBio(e.target.value); setFieldErrors({ ...fieldErrors, bio: '' }); }}
                      placeholder="Tell clients about your approach..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all min-h-24"
                      style={{ borderColor: fieldErrors.bio ? '#EF4444' : undefined, backgroundColor: fieldErrors.bio ? '#FEF2F2' : undefined }}
                    />
                    {fieldErrors.bio && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.bio}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5">Session Fee (₹)</label>
                    <input
                      type="number"
                      value={sessionFee}
                      onChange={(e) => { setSessionFee(e.target.value); setFieldErrors({ ...fieldErrors, sessionFee: '' }); }}
                      className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      style={{ borderColor: fieldErrors.sessionFee ? '#EF4444' : undefined, backgroundColor: fieldErrors.sessionFee ? '#FEF2F2' : undefined }}
                    />
                    {fieldErrors.sessionFee && <p className="text-xs text-red-600 mt-1.5">⚠️ {fieldErrors.sessionFee}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2.5">Languages</label>
                    <input
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="English, Hindi, Marathi"
                      className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-4 mb-8">
              {[
                { label: 'Name', value: name },
                { label: 'Phone', value: phone },
                { label: 'Age', value: age },
                { label: 'Gender', value: gender },
                { label: 'City, State', value: `${city}, ${state}` },
                { label: 'Country', value: country },
                ...(role === 'user' ? [{ label: 'Struggles', value: selectedProblems.map((p) => PROBLEMS.find((x) => x.value === p)?.label).join(', ') }] : [
                  { label: 'Profession', value: selectedHealerType?.label },
                  { label: 'Experience', value: `${experience} years` },
                  { label: 'Session Fee', value: `₹${sessionFee}` },
                ]),
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <motion.button
                onClick={back}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
            )}
            <div className="flex-1">
              <motion.button
                onClick={step === 4 ? handleSignup : next}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
                }}
                whileHover={!loading ? { y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {step === 4 ? 'Create Account' : 'Next'}
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: P }}>
              Terms
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: P }}>
              Privacy
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SoulConnect!</h3>
              <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
              <p className="text-sm text-gray-500">Redirecting you now...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
