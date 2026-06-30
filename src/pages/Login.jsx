import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';
import AuthCard from '../components/auth/AuthCard';
import FeatureCard from '../components/auth/FeatureCard';
import StatCard from '../components/auth/StatCard';
import GradientButton from '../components/auth/GradientButton';
import FormInput from '../components/auth/FormInput';

const P = '#6D4AFF';
const GLD = '#F5B841';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg] = useState(location.state?.message || '');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setPhoneError('');
    setPasswordError('');

    if (!phone) {
      setPhoneError('Please enter your phone number');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(phone, password);
      setAuth(response.data, response.data.access_token, response.data.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* LEFT HERO SECTION */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(109, 74, 255, 0.08) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(109, 74, 255, 0.03) 100%)`,
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${P}, transparent)`,
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${P}, transparent)`,
            filter: 'blur(80px)',
          }}
        />

        {/* Lotus watermark */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
          style={{ fontSize: '400px' }}
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
            <img
              src="/logo-footer.png"
              alt="SoulConnect"
              className="h-16"
            />
          </motion.div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
              Welcome back.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Your healing journey continues here — with real people who understand what you're going through.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            className="grid grid-cols-1 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            <FeatureCard
              icon="🤝"
              title="Peer Connections"
              description="Find people who truly understand your journey."
            />
            <FeatureCard
              icon="💜"
              title="Safe Conversations"
              description="Private and judgment-free conversations."
            />
            <FeatureCard
              icon="🪷"
              title="Guided Healing"
              description="Mindfulness and daily healing practices."
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="relative z-10 flex gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StatCard value="12K+" label="Members" />
          <StatCard value="98%" label="Feel Supported" />
          <StatCard value="100%" label="Private" />
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
            <img
              src="/logo-footer.png"
              alt="SoulConnect"
              className="h-14"
            />
          </motion.div>

          {/* Heading */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Sign in
            </h1>
            <p className="text-gray-600">
              Welcome back — your community is waiting
            </p>
          </motion.div>

          {/* Auth Card */}
          <AuthCard>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Success message */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm flex items-center gap-2"
                  >
                    <span>✅</span> {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>

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

              {/* Phone input */}
              <FormInput
                label="Phone Number"
                type="tel"
                icon="+91"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                error={phoneError}
                autoFocus
              />

              {/* Password input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold hover:text-purple-700 transition-colors"
                    style={{ color: P }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-4 pr-12 py-3.5 rounded-xl border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all ${
                      passwordError
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 mt-2">{passwordError}</p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>

              {/* Sign in button */}
              <GradientButton type="submit" loading={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </GradientButton>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🔵', label: 'Google' },
                  { icon: '🍎', label: 'Apple' },
                  { icon: '📱', label: 'Phone' },
                ].map(({ icon, label }) => (
                  <motion.button
                    key={label}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <span className="text-2xl">{icon}</span>
                  </motion.button>
                ))}
              </div>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600">
                New to SoulConnect?{' '}
                <Link
                  to="/signup"
                  className="font-semibold transition-colors hover:text-purple-700"
                  style={{ color: P }}
                >
                  Create account
                </Link>
              </p>
            </form>
          </AuthCard>

          {/* Trust badge */}
          <motion.div
            className="mt-8 flex items-center gap-3 p-4 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(109, 74, 255, 0.08)',
              border: '1px solid rgba(109, 74, 255, 0.15)',
            }}
          >
            <span className="text-xl">🔒</span>
            <p className="text-xs text-gray-700">
              Your account is private and anonymous. We never share your information.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
