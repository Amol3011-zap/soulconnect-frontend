import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';
import AuthCard from '../components/auth/AuthCard';
import RoleCard from '../components/auth/RoleCard';
import FormInput from '../components/auth/FormInput';
import GradientButton from '../components/auth/GradientButton';

const P = '#6D4AFF';

const ROLE_OPTIONS = [
  {
    id: 'user',
    title: '🌱 I\'m seeking support',
    description: 'Connect with peers who understand your journey',
    features: ['Peer matching', 'Anonymous', 'Free to join'],
  },
  {
    id: 'healer',
    title: '🧘 I\'m a healer / professional',
    description: 'Offer your expertise to those in need',
    features: ['Set your fee', 'Verified profile', 'Grow practice'],
  },
];

const PROBLEMS = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'loneliness', label: 'Loneliness' },
  { value: 'relationship_breakup', label: 'Relationship / Breakup' },
  { value: 'grief_loss', label: 'Grief / Loss' },
  { value: 'burnout', label: 'Burnout' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'other', label: 'Other' },
];

export default function Signup() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [step, setStep] = useState(1); // 1: role, 2: details
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    problem: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        struggle: formData.problem || null,
      });

      if (res.ok) {
        const data = await res.json();
        register(data.user, data.token);
        navigate(role === 'healer' ? '/professionals' : '/home');
      } else {
        const data = await res.json();
        setError(data.detail || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT HOPEFUL SECTION */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(109, 74, 255, 0.06) 0%, rgba(139, 92, 246, 0.04) 50%, rgba(109, 74, 255, 0.02) 100%)`,
        }}
      >
        {/* Animated background */}
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, ${P}, transparent)`,
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${P}, transparent)`,
            filter: 'blur(80px)',
          }}
        />

        {/* Sunrise/Lotus illustration hint */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none"
          style={{ fontSize: '500px' }}
        >
          🪷
        </motion.div>

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img src="/logo-footer.png" alt="SoulConnect" className="h-16" />
          </motion.div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
              You don't have to go through this alone.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Every meaningful connection starts with one small step. Join a community built around empathy, healing and real conversations.
            </p>
          </motion.div>

          {/* Trust cards */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            {[
              { icon: '🔒', title: 'Anonymous', desc: 'Your privacy is protected' },
              {
                icon: '✅',
                title: 'Verified Professionals',
                desc: 'Healers are carefully verified',
              },
              {
                icon: '🤝',
                title: 'Community First',
                desc: 'Built with care, for healing',
              },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                className="flex gap-3 items-start p-4 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(109, 74, 255, 0.1)',
                }}
              >
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{title}</div>
                  <div className="text-xs text-gray-600">{desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Inspirational quote */}
        <motion.div
          className="relative z-10 italic text-gray-600 text-center py-6 px-4 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(109, 74, 255, 0.05)',
            borderLeft: `4px solid ${P}`,
          }}
        >
          "Sometimes healing begins with simply being heard."
        </motion.div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile logo */}
          <motion.div
            className="flex justify-center mb-10 lg:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src="/logo-footer.png" alt="SoulConnect" className="h-14" />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {step === 1 ? 'Join SoulConnect' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 text-sm">
              {step === 1
                ? 'Connect with a community that understands'
                : 'A few more details to get you started'}
            </p>
          </motion.div>

          <AuthCard>
            {/* STEP 1: Role Selection */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {ROLE_OPTIONS.map(({ id, title, description, features }) => (
                    <RoleCard
                      key={id}
                      icon={title.charAt(0)}
                      title={title.slice(2)}
                      description={description}
                      features={features}
                      selected={role === id}
                      onClick={() => {
                        setRole(id);
                        setStep(2);
                      }}
                    />
                  ))}

                  {/* Sign in link */}
                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold transition-colors hover:text-purple-700"
                      style={{ color: P }}
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* STEP 2: Form */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Back button */}
                  <motion.button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setRole(null);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    whileHover={{ x: -2 }}
                  >
                    ← Back
                  </motion.button>

                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2"
                      >
                        <span>⚠️</span> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name */}
                  <FormInput
                    label="Full Name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                  />

                  {/* Email */}
                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, email: e.target.value }))
                    }
                  />

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            password: e.target.value,
                          }))
                        }
                        className="w-full pl-4 pr-12 py-3.5 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none transition-all bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Problem (optional for users) */}
                  {role === 'user' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        What are you struggling with? (Optional)
                      </label>
                      <select
                        value={formData.problem}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            problem: e.target.value,
                          }))
                        }
                        className="w-full pl-4 pr-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-900 focus:outline-none transition-all bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      >
                        <option value="">Select a challenge...</option>
                        {PROBLEMS.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Submit button */}
                  <GradientButton type="submit" loading={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </GradientButton>

                  {/* Sign in link */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold transition-colors hover:text-purple-700"
                      style={{ color: P }}
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </AuthCard>
        </motion.div>
      </div>
    </div>
  );
}
