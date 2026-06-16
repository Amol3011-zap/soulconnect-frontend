import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const STEPS = [
  { id: 1, label: 'Phone' },
  { id: 2, label: 'Verify OTP' },
  { id: 3, label: 'New Password' },
];

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  // Step 1
  const [phone, setPhone] = useState('');

  // Step 2
  const [otp, setOtp] = useState('');

  // Step 3
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const navigate = useNavigate();

  /* ─── Handlers ─────────────────────────────────────────── */

  const handleSendCode = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(cleaned);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const cleaned = phone.replace(/\D/g, '');
    setResendLoading(true);
    setResendMsg('');
    setError('');
    try {
      await authAPI.forgotPassword(cleaned);
      setResendMsg('Code resent successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyResetOTP(phone.replace(/\D/g, ''), otp);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword(phone.replace(/\D/g, ''), otp, newPassword);
      navigate('/login', { state: { message: 'Password reset successfully! Please sign in with your new password.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not reset password. Please start over.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Shared input focus/blur handlers ──────────────────── */
  const focusGreen = (e) => (e.target.style.borderColor = '#1a3d2e');
  const blurGray = (e) => (e.target.style.borderColor = '#e5e7eb');

  /* ─── Step Indicator ────────────────────────────────────── */
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 gap-0">
      {STEPS.map((s, idx) => {
        const isCompleted = step > s.id;
        const isActive = step === s.id;
        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(135deg, #1a3d2e, #2d6a4f)'
                    : isActive
                    ? 'linear-gradient(135deg, #1a3d2e, #2d6a4f)'
                    : '#e5e7eb',
                  color: isCompleted || isActive ? '#fff' : '#9ca3af',
                  boxShadow: isActive ? '0 0 0 3px rgba(45,106,79,0.25)' : 'none',
                }}
              >
                {isCompleted ? '✓' : s.id}
              </div>
              <span
                className="text-xs mt-1.5 font-medium whitespace-nowrap"
                style={{ color: isActive ? '#1a3d2e' : isCompleted ? '#2d6a4f' : '#9ca3af' }}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className="h-0.5 w-12 mb-5 mx-1 transition-all duration-300"
                style={{ background: step > s.id ? '#2d6a4f' : '#e5e7eb' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ─── Step 1 — Phone ─────────────────────────────────────── */
  const Step1 = () => (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter your phone number</h1>
        <p className="text-gray-500 text-sm">We'll send a reset code to verify your identity</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none">
            +91
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            autoFocus
            maxLength={12}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
            onFocus={focusGreen}
            onBlur={blurGray}
          />
        </div>
        <p className="mt-2.5 text-xs leading-relaxed" style={{ color: '#6b7280' }}>
          We'll send a 6-digit code to your phone and a reset link to your registered email
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending code...
          </>
        ) : (
          'Send Reset Code →'
        )}
      </button>
    </form>
  );

  /* ─── Step 2 — Verify OTP ────────────────────────────────── */
  const Step2 = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter verification code</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Code sent to{' '}
          <span className="font-semibold" style={{ color: '#1a3d2e' }}>
            +91 {phone}
          </span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit Code</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 6) setOtp(val);
          }}
          placeholder="— — — — — —"
          autoFocus
          maxLength={6}
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-800 text-center text-2xl font-bold tracking-widest placeholder-gray-300 focus:outline-none transition-colors bg-white"
          onFocus={focusGreen}
          onBlur={blurGray}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Didn't receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="font-semibold hover:underline disabled:opacity-50 transition-opacity"
          style={{ color: '#1a3d2e' }}
        >
          {resendLoading ? 'Resending...' : 'Resend code'}
        </button>
      </div>

      {resendMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm flex items-center gap-2">
          <span>✅</span> {resendMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify Code →'
        )}
      </button>

      <button
        type="button"
        onClick={() => { setStep(1); setError(''); setOtp(''); setResendMsg(''); }}
        className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← Change phone number
      </button>
    </form>
  );

  /* ─── Step 3 — New Password ──────────────────────────────── */
  const Step3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create new password</h1>
        <p className="text-gray-500 text-sm">Choose a strong password you haven't used before</p>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoFocus
            className="w-full pl-4 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
            onFocus={focusGreen}
            onBlur={blurGray}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showNew ? '🙈' : '👁️'}
          </button>
        </div>
        {newPassword && (
          <PasswordStrength password={newPassword} />
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            className="w-full pl-4 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white"
            onFocus={focusGreen}
            onBlur={blurGray}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
        )}
        {confirmPassword && newPassword === confirmPassword && (
          <p className="mt-1.5 text-xs" style={{ color: '#2d6a4f' }}>✓ Passwords match</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Resetting password...
          </>
        ) : (
          'Reset Password →'
        )}
      </button>
    </form>
  );

  /* ─── Password Strength Meter ────────────────────────────── */
  const PasswordStrength = ({ password }) => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#84cc16', '#22c55e'];
    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= score ? colors[score] : '#e5e7eb' }}
            />
          ))}
        </div>
        {score > 0 && (
          <p className="text-xs font-medium" style={{ color: colors[score] }}>
            {labels[score]}
          </p>
        )}
      </div>
    );
  };

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3d2e 0%, #1e4d38 50%, #152e23 100%)' }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)', filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(60px)' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #2d6a4f, #f59e0b)' }}
            >
              🌿
            </div>
            <span className="text-white text-xl font-bold tracking-tight">SoulConnect</span>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Reset your password.<br />
              <span style={{ color: '#f59e0b' }}>Get back to healing.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
              It happens to everyone. A quick reset and you'll be back with your community in moments.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🔐', label: 'Secure Reset' },
                { icon: '📲', label: 'SMS Verify' },
                { icon: '🛡️', label: 'Stay Safe' },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              ['10K+', 'Members'],
              ['95%', 'Feel Better'],
              ['Safe', '& Anonymous'],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-bold text-xl" style={{ color: '#f59e0b' }}>
                  {val}
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: '#f5f5f0' }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}
            >
              🌿
            </div>
            <span className="text-gray-800 text-lg font-bold">SoulConnect</span>
          </div>

          {/* Step Indicator */}
          <StepIndicator />

          {/* Form card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: '#1a3d2e' }}
            >
              Back to Login
            </Link>
          </p>

          {/* Privacy note */}
          <div
            className="mt-6 flex items-center gap-2 rounded-xl p-3"
            style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}
          >
            <span>🔒</span>
            <p className="text-xs" style={{ color: '#166534' }}>
              Your account is private and anonymous. We never share your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
