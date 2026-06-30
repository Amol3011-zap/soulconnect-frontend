import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
const P    = '#6D4AFF';  // Primary Purple
const LAV  = '#A78BFA'; // Lavender
const GLD  = '#F5B841'; // Gold
const PNK  = '#F472B6'; // Pink
const DARK = '#120B2E'; // Dark Purple
const BG_GRADIENT = 'linear-gradient(155deg, #0A0222 0%, #120B2E 40%, #1E0848 70%, #0A0222 100%)';

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

/* ═══════════════════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

function RoleCard({ role, isSelected, onClick, title, description, tags, icon }) {
  const roleColor = role === 'healer' ? '#059669' : P;
  const roleGrad = role === 'healer'
    ? 'linear-gradient(135deg, #059669, #0d9488)'
    : 'linear-gradient(135deg, #6D4AFF, #8B5CF6)';

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-6 border-2 transition-all"
      style={{
        background: isSelected ? 'rgba(0,0,0,0.02)' : 'transparent',
        borderColor: isSelected ? roleColor : 'rgba(0,0,0,0.1)',
        boxShadow: isSelected ? `0 0 20px ${roleColor}33` : 'none',
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: role === 'healer' ? '#D1FAE5' : '#EDE9FE',
                  color: role === 'healer' ? '#065F46' : '#4C1D95',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <motion.div
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: isSelected ? roleColor : '#ddd' }}
        >
          {isSelected && (
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ background: roleColor }}
              layoutId="selectedRoleIndicator"
            />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}

function FormInput({ label, type = 'text', value, onChange, placeholder, error, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2.5">
        {label}
        {required && <span style={{ color: P }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-3 px-4 rounded-xl border-2 transition-all focus:outline-none font-medium"
        style={{
          borderColor: error ? '#EF4444' : '#E5E7EB',
          background: error ? '#FEF2F2' : '#FAFAF9',
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = LAV;
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = '#E5E7EB';
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1.5">⚠️ {error}</p>}
    </div>
  );
}

function FormSelect({ label, value, onChange, options, error, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2.5">
        {label}
        {required && <span style={{ color: P }}>*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full py-3 px-4 rounded-xl border-2 transition-all focus:outline-none font-medium appearance-none cursor-pointer"
        style={{
          borderColor: error ? '#EF4444' : '#E5E7EB',
          background: error ? '#FEF2F2' : '#FAFAF9',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1.5">⚠️ {error}</p>}
    </div>
  );
}

function GradientButton({ children, loading = false, type = 'button', onClick }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      style={{
        background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
      }}
      whileHover={!loading ? { y: -2 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Creating account...
        </>
      ) : (
        <>
          {children}
          <span>→</span>
        </>
      )}
    </motion.button>
  );
}

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
      style={{ background: BG_GRADIENT }}
    >
      <motion.div
        className="relative z-10 w-full px-12 py-20 flex flex-col justify-center items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* Lotus Illustration */}
        <motion.div
          className="text-8xl mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🪷
        </motion.div>

        {/* Sunrise Elements */}
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="text-6xl">🌅</div>
        </motion.div>

        {/* Hero Text */}
        <motion.h1
          className="text-4xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          You don't have to go through this alone.
        </motion.h1>

        <motion.p
          className="text-lg text-white/70 max-w-md mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Every meaningful connection starts with one small step. Join a community built around empathy, healing, and real conversations.
        </motion.p>

        {/* Trust Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: '🔒', label: 'Anonymous' },
            { icon: '✔️', label: 'Verified Professionals' },
            { icon: '🤝', label: 'Community First' },
          ].map((card) => (
            <motion.div
              key={card.label}
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              whileHover={{ y: -4 }}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="text-xs font-medium text-white/80">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          className="mt-16 italic text-white/60 text-sm border-l-4 border-white/30 pl-4 py-2 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          "Sometimes healing begins with simply being heard."
        </motion.blockquote>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN SIGNUP COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */

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
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8" style={{ background: '#FAFAF8' }}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Mobile Logo */}
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
              <RoleCard
                role="user"
                isSelected={role === 'user'}
                onClick={() => {
                  setRole('user');
                  setStep(1);
                }}
                icon="🌱"
                title="I'm seeking support"
                description="Connect with peers who understand your struggle and join a community that heals together."
                tags={['Peer matching', 'Anonymous', 'Free to join']}
              />
              <RoleCard
                role="healer"
                isSelected={role === 'healer'}
                onClick={() => {
                  setRole('healer');
                  setStep(1);
                }}
                icon="🧘"
                title="I'm a healer / professional"
                description="Offer your expertise as a counsellor, therapist, coach, or wellness practitioner."
                tags={['Set your own fee', 'Verified profile', 'Grow your practice']}
              />
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: P }}>
                Sign In →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── STEP 1: Basic Info ── */
  if (step === 1) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto" style={{ background: '#FAFAF8' }}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Basic Info</h2>
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
                className="mb-6 p-4 rounded-xl flex items-start gap-3"
                style={{ background: '#FEF2F2', borderLeft: `4px solid #EF4444` }}
              >
                <span className="text-xl">⚠️</span>
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            <div className="space-y-5 mb-8">
              <FormInput
                label="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors({ ...fieldErrors, name: '' });
                }}
                placeholder="Your full name"
                error={fieldErrors.name}
                required
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setFieldErrors({ ...fieldErrors, phone: '' });
                }}
                placeholder="98765 43210"
                error={fieldErrors.phone}
                required
              />
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors({ ...fieldErrors, password: '' });
                }}
                placeholder="••••••••"
                error={fieldErrors.password}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setFieldErrors({ ...fieldErrors, age: '' });
                  }}
                  placeholder="18"
                  error={fieldErrors.age}
                  required
                />
                <FormSelect
                  label="Gender"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setFieldErrors({ ...fieldErrors, gender: '' });
                  }}
                  options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
                  error={fieldErrors.gender}
                  required
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <div className="flex-1">
                <GradientButton onClick={next}>Next</GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── STEP 2: Location ── */
  if (step === 2) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto" style={{ background: '#FAFAF8' }}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
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

            <div className="space-y-5 mb-8">
              <FormSelect
                label="Country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setFieldErrors({ ...fieldErrors, country: '' });
                }}
                options={COUNTRIES}
                error={fieldErrors.country}
                required
              />
              {country === 'India' ? (
                <FormSelect
                  label="State"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setFieldErrors({ ...fieldErrors, state: '' });
                  }}
                  options={INDIA_STATES}
                  error={fieldErrors.state}
                  required
                />
              ) : (
                <FormInput
                  label="State / Province"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setFieldErrors({ ...fieldErrors, state: '' });
                  }}
                  placeholder="Your state"
                  error={fieldErrors.state}
                  required
                />
              )}
              <FormInput
                label="City"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setFieldErrors({ ...fieldErrors, city: '' });
                }}
                placeholder="Your city"
                error={fieldErrors.city}
                required
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={back}
                className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <div className="flex-1">
                <GradientButton onClick={next}>Next</GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── STEP 3: Struggles (User) or Professional (Healer) ── */
  if (step === 3) {
    return (
      <div className="min-h-screen flex">
        <LeftPanel />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto" style={{ background: '#FAFAF8' }}>
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {role === 'user' ? 'Your Struggles' : 'Professional Info'}
                </h2>
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
                className="mb-6 p-4 rounded-xl flex items-start gap-3"
                style={{ background: '#FEF2F2', borderLeft: `4px solid #EF4444` }}
              >
                <span className="text-xl">⚠️</span>
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {role === 'user' ? (
              <div className="space-y-4 mb-8">
                <p className="text-sm text-gray-600 font-medium">
                  What are you dealing with? (Select at least 2)
                </p>
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
                {fieldErrors.problems && (
                  <p className="text-xs text-red-600">⚠️ {fieldErrors.problems}</p>
                )}
              </div>
            ) : (
              <div className="space-y-6 mb-8">
                <FormSelect
                  label="Profession Type"
                  value={healerType}
                  onChange={(e) => {
                    setHealerType(e.target.value);
                    setFieldErrors({ ...fieldErrors, healerType: '' });
                  }}
                  options={HEALER_TYPES.map((h) => h.value)}
                  error={fieldErrors.healerType}
                  required
                />

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

                <FormInput
                  label="Years of Experience"
                  type="number"
                  value={experience}
                  onChange={(e) => {
                    setExperience(e.target.value);
                    setFieldErrors({ ...fieldErrors, experience: '' });
                  }}
                  placeholder="5"
                  error={fieldErrors.experience}
                  required
                />

                <FormInput
                  label="Bio"
                  type="textarea"
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setFieldErrors({ ...fieldErrors, bio: '' });
                  }}
                  placeholder="Tell clients about your approach..."
                  error={fieldErrors.bio}
                  required
                />

                <FormInput
                  label="Session Fee (₹)"
                  type="number"
                  value={sessionFee}
                  onChange={(e) => {
                    setSessionFee(e.target.value);
                    setFieldErrors({ ...fieldErrors, sessionFee: '' });
                  }}
                  placeholder="500"
                  error={fieldErrors.sessionFee}
                  required
                />

                <FormInput
                  label="Languages (comma-separated)"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Hindi, Marathi"
                />
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                onClick={back}
                className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <div className="flex-1">
                <GradientButton onClick={next}>Review</GradientButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── STEP 4: Review & Submit ── */
  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto" style={{ background: '#FAFAF8' }}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Review</h2>
              <span className="text-sm font-medium text-gray-500">
                Step {step} of {STEPS.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ background: `linear-gradient(90deg, ${P}, #8B5CF6)` }}
                initial={{ width: '0%' }}
                animate={{ width: `100%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl flex items-start gap-3"
              style={{ background: '#FEF2F2', borderLeft: `4px solid #EF4444` }}
            >
              <span className="text-xl">⚠️</span>
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4 mb-8">
            <ReviewRow label="Name" value={name} />
            <ReviewRow label="Phone" value={phone} />
            <ReviewRow label="Age" value={age} />
            <ReviewRow label="Gender" value={gender} />
            <ReviewRow label="City, State" value={`${city}, ${state}`} />
            <ReviewRow label="Country" value={country} />

            {role === 'user' && selectedProblems.length > 0 && (
              <ReviewRow
                label="Your Struggles"
                value={selectedProblems.map((p) => PROBLEMS.find((x) => x.value === p)?.label).join(', ')}
              />
            )}

            {role === 'healer' && (
              <>
                <ReviewRow
                  label="Profession"
                  value={selectedHealerType?.label}
                />
                <ReviewRow
                  label="Experience"
                  value={`${experience} years`}
                />
                <ReviewRow
                  label="Session Fee"
                  value={`₹${sessionFee}`}
                />
              </>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={back}
              className="flex-1 py-3 rounded-xl font-semibold border-2 transition-all"
              style={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            <div className="flex-1">
              <GradientButton loading={loading} onClick={handleSignup}>
                Create Account
              </GradientButton>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="font-semibold hover:opacity-80" style={{ color: P }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-semibold hover:opacity-80" style={{ color: P }}>
              Privacy Policy
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

function ReviewRow({ label, value }) {
  return (
    <motion.div
      className="flex justify-between items-center p-3 rounded-lg"
      style={{ background: '#F9FAFB' }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </motion.div>
  );
}
