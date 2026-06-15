import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone) { setError('Please enter your phone number'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(phone);
      setAuth(response.data, response.data.access_token);
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0f3460 100%)' }}>

        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(50px)' }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
              🌿
            </div>
            <span className="text-white text-xl font-bold tracking-tight">SoulConnect</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Welcome back.<br />
              <span style={{ background: 'linear-gradient(90deg, #a855f7, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Your people missed you.
              </span>
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed mb-10">
              Your healing journey continues here — with real people who understand what you're going through.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🤝', label: 'Peer Matches' },
                { icon: '💬', label: 'Safe Chats' },
                { icon: '🧘', label: 'Healer Sessions' },
              ].map(({ icon, label }) => (
                <div key={label} className="rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-white/70 text-xs font-medium">{label}</div>
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
              🌿
            </div>
            <span className="text-gray-800 text-lg font-bold">SoulConnect</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-500">Enter your phone number to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  autoFocus
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors bg-white"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Use the number you signed up with</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In →'}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-center text-sm text-gray-500">
              New to SoulConnect?{' '}
              <Link to="/signup" className="text-purple-600 font-semibold hover:underline">Create account</Link>
            </p>
          </form>

          <div className="mt-10 flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl p-3">
            <span>🔒</span>
            <p className="text-xs text-purple-700">Your account is private and anonymous. We never share your personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
