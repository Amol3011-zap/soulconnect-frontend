import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── LEFT PANEL: Premium Hero ── */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: `linear-gradient(155deg, #0A0222 0%, #120B2E 40%, #1E0848 70%, #0A0222 100%)`,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
        <div>
          <motion.h1
            className="text-5xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back.
          </motion.h1>
          <motion.div
            className="text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: `linear-gradient(135deg, ${LAV}, ${GLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your healing journey continues.
          </motion.div>
          <motion.p
            className="text-lg text-white/70 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Reconnect with people who understand you. Continue your healing with meaningful conversations and support.
          </motion.p>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-3 mb-12">
            {[
              { icon: '🤝', title: 'Peer Connections', desc: 'Find people who truly understand.' },
              { icon: '💜', title: 'Safe Conversations', desc: 'Private and judgment-free.' },
              { icon: '🪷', title: 'Guided Healing', desc: 'Mindfulness and healing.' },
            ].map((card) => (
              <motion.div
                key={card.title}
                className="rounded-2xl p-4 backdrop-blur-md border"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                }}
                whileHover={{ y: -4 }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
                <p className="text-xs text-white/60">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="flex justify-between pt-8 border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { value: '12K+', label: 'Members' },
            { value: '98%', label: 'Feel Supported' },
            { value: 'Private', label: 'Anonymous' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-bold text-xl" style={{ color: GLD }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── RIGHT PANEL: Auth Card ── */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-8 bg-white">
        <motion.div
          className="w-full max-w-lg"
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
              className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-50 border border-green-200"
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
              className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-200"
            >
              <span className="text-xl">⚠️</span>
              <span className="text-sm font-medium text-red-700">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">Phone Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📱</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldError({ ...fieldError, phone: '' });
                  }}
                  placeholder="98765 43210"
                  autoFocus
                  className="w-full h-14 pl-14 pr-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-medium"
                  style={{ borderColor: fieldError.phone ? '#EF4444' : undefined, backgroundColor: fieldError.phone ? '#FEF2F2' : undefined }}
                />
              </div>
              {fieldError.phone && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-2">
                  ⚠️ {fieldError.phone}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-sm font-semibold text-gray-900">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: P }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔐</div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldError({ ...fieldError, password: '' });
                  }}
                  placeholder="••••••••"
                  className="w-full h-14 pl-14 pr-12 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-medium"
                  style={{ borderColor: fieldError.password ? '#EF4444' : undefined, backgroundColor: fieldError.password ? '#FEF2F2' : undefined }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-lg hover:opacity-70 transition-opacity"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              {fieldError.password && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-2">
                  ⚠️ {fieldError.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me */}
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
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
              }}
              whileHover={!loading ? { y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </motion.button>
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
              { icon: '🔵', label: 'Google' },
              { icon: '🍎', label: 'Apple' },
              { icon: '📞', label: 'OTP' },
            ].map((btn) => (
              <motion.button
                key={btn.label}
                type="button"
                className="py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:y-0.5"
                whileHover={{ y: -2 }}
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
            <Link to="/signup" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: P }}>
              Create Account →
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
