import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS (matching Landing.jsx)
═══════════════════════════════════════════════════════════════════════════════ */
const P    = '#6D4AFF';  // Primary Purple
const LAV  = '#A78BFA'; // Lavender
const GLD  = '#F5B841'; // Gold
const PNK  = '#F472B6'; // Pink
const DARK = '#120B2E'; // Dark Purple
const BG_GRADIENT = 'linear-gradient(155deg, #0A0222 0%, #120B2E 40%, #1E0848 70%, #0A0222 100%)';

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 20,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: [P, LAV, GLD, PNK][p.id % 4],
            opacity: 0.1,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="rounded-2xl p-4 backdrop-blur-md border transition-all hover:scale-105 cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCard({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.random() * 0.3 }}
    >
      <div className="font-bold text-xl" style={{ color: GLD }}>
        {value}
      </div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </motion.div>
  );
}

function AuthInput({ label, type = 'text', value, onChange, placeholder, error, icon, showPasswordToggle, onTogglePassword, showPassword }) {
  const isPassword = type === 'password';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block text-sm font-semibold text-white/90 mb-2.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{icon}</div>
        )}
        <input
          type={showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full py-3.5 px-4 rounded-xl border-2 transition-all duration-300 font-medium text-white placeholder-white/40"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderColor: error ? '#EF4444' : 'rgba(255, 255, 255, 0.15)',
            paddingLeft: icon ? '48px' : undefined,
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = LAV;
              e.target.style.background = 'rgba(255, 255, 255, 0.12)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }
          }}
        />
        {showPasswordToggle && isPassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-lg"
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-2"
        >
          ⚠️ {error}
        </motion.p>
      )}
    </motion.div>
  );
}

function GradientButton({ children, onClick, loading = false, type = 'button' }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden disabled:opacity-60 flex items-center justify-center gap-2"
      style={{
        background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
      }}
      whileHover={!loading ? { y: -2 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          Signing in...
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

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({ phone: '', password: '' });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg] = useState(location.state?.message || '');

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = { phone: '', password: '' };

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setFieldError(newErrors);

    if (newErrors.phone || newErrors.password) return;

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(phone, password);
      setAuth(response.data, response.data.access_token, response.data.role);
      navigate('/home');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Incorrect phone number or password. Try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── LEFT PANEL: Premium Hero ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: BG_GRADIENT }}
      >
        <FloatingParticles />

        <motion.div
          className="relative z-10 w-full px-12 py-20 flex flex-col justify-between h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="/logo-footer.png"
              alt="SoulConnect"
              style={{
                height: 56,
                width: 'auto',
                objectFit: 'contain',
                maxWidth: 220,
                borderRadius: 12,
              }}
            />
          </motion.div>

          {/* Hero Content */}
          <div className="my-auto">
            <motion.h1
              className="text-5xl font-bold text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome back.
            </motion.h1>
            <motion.div
              className="text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ background: `linear-gradient(135deg, ${LAV}, ${GLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Your healing journey continues.
            </motion.div>
            <motion.p
              className="text-lg text-white/70 mb-10 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Reconnect with people who understand you. Continue your healing with meaningful conversations and support that feels like home.
            </motion.p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 mb-12">
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
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="flex justify-between pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <StatCard value="12K+" label="Members" />
            <StatCard value="98%" label="Feel Supported" />
            <StatCard value="Private" label="Anonymous" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL: Auth Card ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8" style={{ background: '#FFFFFF' }}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <motion.div className="flex items-center mb-8 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-600 text-base">Your community is waiting for you</p>
          </motion.div>

          {/* Success Message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{ background: '#ECFDF5', borderLeft: `4px solid #10B981` }}
            >
              <span className="text-xl">✅</span>
              <span className="text-sm font-medium text-green-700">{successMsg}</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl flex items-center gap-3"
              style={{ background: '#FEF2F2', borderLeft: `4px solid #EF4444` }}
            >
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-medium text-red-700">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AuthInput
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setFieldError({ ...fieldError, phone: '' });
              }}
              placeholder="98765 43210"
              error={fieldError.phone}
              icon="📱"
            />

            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-semibold text-white/90">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold transition-colors hover:opacity-80"
                  style={{ color: P }}
                >
                  Forgot password?
                </Link>
              </div>
              <AuthInput
                label=""
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldError({ ...fieldError, password: '' });
                }}
                placeholder="••••••••"
                error={fieldError.password}
                icon="🔐"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Remember Me & Forgot Password (inline) */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  style={{ accentColor: P }}
                />
                <span className="text-sm text-gray-700 font-medium">Remember me</span>
              </label>
            </motion.div>

            {/* Sign In Button */}
            <GradientButton type="submit" loading={loading}>
              Sign In
            </GradientButton>
          </form>

          {/* Divider */}
          <motion.div
            className="my-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: '🔵', label: 'Google', color: '#4F46E5' },
              { icon: '🍎', label: 'Apple', color: '#000' },
              { icon: '📞', label: 'OTP', color: P },
            ].map((btn) => (
              <motion.button
                key={btn.label}
                type="button"
                className="py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
                whileHover={{ y: -2, background: 'rgba(0,0,0,0.06)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{btn.icon}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors hover:opacity-80" style={{ color: P }}>
              Create Account →
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
