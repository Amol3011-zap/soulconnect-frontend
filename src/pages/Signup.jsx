import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

const ROLE_OPTIONS = [
  {
    id: 'user',
    title: 'I\'m seeking support',
    subtitle: 'Connect with peers who understand',
    description: 'Find community, share experiences, and heal together with people who\'ve walked similar paths.',
    icon: '💜',
    features: ['Peer matching', 'Anonymous', 'Free to join']
  },
  {
    id: 'healer',
    title: 'I\'m a healer / professional',
    subtitle: 'Offer your expertise to those in need',
    description: 'Support others through your lived experience or professional expertise. Grow your practice on SoulConnect.',
    icon: '🌿',
    features: ['Set your own fee', 'Verified profile', 'Grow your practice']
  }
];

const PROBLEMS = [
  { value: 'anxiety', label: 'Anxiety', icon: '😰' },
  { value: 'depression', label: 'Depression', icon: '😢' },
  { value: 'loneliness', label: 'Loneliness', icon: '😔' },
  { value: 'relationship_breakup', label: 'Relationship / Breakup', icon: '💔' },
  { value: 'grief_loss', label: 'Grief / Loss', icon: '🕯️' },
  { value: 'burnout', label: 'Burnout', icon: '😵' },
  { value: 'trauma', label: 'Trauma', icon: '⚠️' },
  { value: 'other', label: 'Other', icon: '💭' },
];

const P = '#6D4AFF';
const LAV = '#A78BFA';
const DARK = '#120B2E';

export default function Signup() {
  const navigate = useNavigate();
  const register = useAuthStore(s => s.register);
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

  async function handleSignup(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
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
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #140028 0%, #1e0f47 40%, #2d1b69 100%)`,
      fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '5%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Main card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 500,
      }}>
        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: 28 }}>
            <img src="/brand/logo/soulconnect-logo-primary.png" alt="SoulConnect"
              style={{ height: 48, width: 'auto', filter: 'drop-shadow(0 4px 12px rgba(124,58,237,0.4))' }} />
          </Link>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}>
            {step === 1 ? 'Join SoulConnect' : 'Create Your Account'}
          </h1>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
          }}>
            {step === 1
              ? 'Connect with a community that understands'
              : 'A few more details to get you started'}
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setRole(opt.id);
                  setStep(2);
                }}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(139,92,246,0.2)',
                  borderRadius: 20,
                  padding: '24px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: 40 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 4,
                  }}>
                    {opt.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}>
                    {opt.description}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}>
                    {opt.features.map(f => (
                      <span key={f} style={{
                        fontSize: 11,
                        background: 'rgba(245,184,65,0.15)',
                        border: '1px solid rgba(245,184,65,0.25)',
                        color: 'rgba(245,184,65,0.8)',
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontWeight: 500,
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
            <p style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 8,
            }}>
              Already have an account? <Link to="/login" style={{
                color: P,
                textDecoration: 'none',
                fontWeight: 600,
              }}>Sign In</Link>
            </p>
          </div>
        )}

        {/* Step 2: Signup Form */}
        {step === 2 && (
          <form onSubmit={handleSignup} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setRole(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              ← Back
            </button>

            {/* Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(139,92,246,0.4)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(139,92,246,0.4)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={e => setFormData(f => ({...f, password: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(139,92,246,0.4)';
                  e.target.style.background = 'rgba(255,255,255,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.08)';
                }}
              />
            </div>

            {/* Problem (optional for users) */}
            {role === 'user' && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  What are you struggling with? (Optional)
                </label>
                <select
                  value={formData.problem}
                  onChange={e => setFormData(f => ({...f, problem: e.target.value}))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 14,
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.4)';
                    e.target.style.background = 'rgba(255,255,255,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.background = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <option value="">Select a challenge...</option>
                  {PROBLEMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                padding: 12,
                fontSize: 12,
                color: '#FCA5A5',
              }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 14,
                border: 'none',
                background: `linear-gradient(135deg, ${P} 0%, #8B5CF6 100%)`,
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s',
                boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(124,58,237,0.5)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)';
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Sign in link */}
            <p style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
            }}>
              Already have an account? <Link to="/login" style={{
                color: P,
                textDecoration: 'none',
                fontWeight: 600,
              }}>Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
