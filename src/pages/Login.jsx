import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg] = useState(location.state?.message || '');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone) { setError('Please enter your phone number'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');
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
    <div className="min-h-screen flex">
      {/* Left Panel — forest green matching landing page */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3d2e 0%, #1e4d38 50%, #152e23 100%)' }}>
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center">
            <img src="/logo-navbar.png" alt="SoulConnect" style={{ height: 52, width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }} />
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back.<br />
              <span style={{ color: '#f59e0b' }}>Your people missed you.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Your healing journey continues here — with real people who understand what you're going through.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🤝', label: 'Peer Matches' },
                { icon: '💬', label: 'Safe Chats' },
                { icon: '🧘', label: 'Healer Sessions' },
              ].map(({ icon, label }) => (
                <div key={label} className="rounded-2xl p-4 text-center"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            {[['10K+', 'Members'], ['95%', 'Feel Better'], ['Safe', '& Anonymous']].map(([val, label]) => (
              <div key={label}>
                <div className="font-bold text-xl" style={{ color: '#f59e0b' }}>{val}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: '#f5f5f0' }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center mb-8 lg:hidden">
            <img src="/logo-navbar.png" alt="SoulConnect" style={{ height: 44, width: 'auto', objectFit: 'contain', maxWidth: 160 }} />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-500">Welcome back — your community is waiting</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="98765 43210" autoFocus
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
                  onFocus={e => e.target.style.borderColor = '#1a3d2e'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: '#1a3d2e' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
                  onFocus={e => e.target.style.borderColor = '#1a3d2e'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm flex items-center gap-2">
                <span>✅</span> {successMsg}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                : 'Sign In →'}
            </button>

            <p className="text-center text-sm text-gray-500">
              New to SoulConnect?{' '}
              <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#1a3d2e' }}>Create account</Link>
            </p>
          </form>

          <div className="mt-8 flex items-center gap-2 rounded-xl p-3"
            style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}>
            <span>🔒</span>
            <p className="text-xs" style={{ color: '#166534' }}>Your account is private and anonymous. We never share your information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
