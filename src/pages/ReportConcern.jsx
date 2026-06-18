import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
@keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
`;

const REPORT_TYPES = [
  { value: 'user', label: 'User', icon: '👤', desc: 'Report a community member' },
  { value: 'guide', label: 'Guide / Healer', icon: '🧘', desc: 'Report a guide or healer' },
  { value: 'circle', label: 'Circle', icon: '⭕', desc: 'Report a group or circle' },
  { value: 'message', label: 'Message', icon: '💬', desc: 'Report a specific message' },
];

const REASONS = [
  { value: 'harassment', label: 'Harassment or Bullying', icon: '🚫' },
  { value: 'selfharm', label: 'Self-Harm Concern', icon: '💛' },
  { value: 'abuse', label: 'Abuse or Exploitation', icon: '⚠️' },
  { value: 'spam', label: 'Spam or Advertising', icon: '📢' },
  { value: 'misinformation', label: 'Dangerous Misinformation', icon: '❗' },
  { value: 'privacy', label: 'Privacy Violation', icon: '🔒' },
  { value: 'other', label: 'Other', icon: '❓' },
];

export default function ReportConcern() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(1); // 1=form, 2=submitted
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: '',
    reason: '',
    description: '',
    screenshot: null,
    anonymous: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.type) e.type = 'Please select what you are reporting';
    if (!form.reason) e.reason = 'Please select a reason';
    if (!form.description.trim()) e.description = 'Please describe the concern';
    else if (form.description.trim().length < 20) e.description = 'Please provide more detail (at least 20 characters)';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setStep(2);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm(f => ({ ...f, screenshot: file }));
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#F0FDF4 0%,#DCFCE7 40%,#F5F3FF 100%)', fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{STYLES}</style>
        <div style={{
          maxWidth: 480, width: '100%', textAlign: 'center',
          animation: 'fadeUp 0.5s ease both',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,#059669,#10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 24px',
            animation: 'checkPop 0.4s ease both', animationDelay: '0.2s',
          }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#065F46', marginBottom: 12 }}>Report Submitted</h1>
          <p style={{ color: '#6B7280', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Thank you for helping keep SoulConnect safe. Our moderation team will review your report confidentially and take appropriate action. You'll be notified of the outcome.
          </p>
          <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', marginBottom: 24, border: '1.5px solid #BBF7D0', textAlign: 'left' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#065F46', fontSize: 14 }}>What happens next:</p>
            {[
              'Our team reviews within 24–48 hours',
              'Action taken based on severity',
              'You\'ll receive a notification when resolved',
              'Your identity remains confidential',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#374151', marginTop: 8 }}>
                <span style={{ color: '#059669', fontWeight: 700, flexShrink: 0 }}>✓</span>{s}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')} style={{
              background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)', color: '#fff',
              border: 'none', borderRadius: 99, padding: '13px 24px', fontSize: 14,
              fontWeight: 700, cursor: 'pointer',
            }}>← Back to SoulConnect</button>
            <button onClick={() => { setForm({ type:'', reason:'', description:'', screenshot:null, anonymous:false }); setErrors({}); setStep(1); }} style={{
              background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 99,
              padding: '13px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 40%,#FFF7ED 100%)', fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#DC2626,#7C3AED)',
        padding: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-40,right:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 34px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 99,
            color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 22,
          }}>← Back</button>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚩</div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Report a Safety Concern</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
            All reports are reviewed by our moderation team. Your identity will be kept confidential.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 64px' }}>
        <form onSubmit={handleSubmit} noValidate>

          {/* Step 1: Type */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20,
            boxShadow: '0 2px 14px rgba(109,74,255,0.07)', border: '1.5px solid rgba(167,139,250,0.18)',
            animation: 'fadeUp 0.4s ease both',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: '0 0 16px' }}>
              1. What are you reporting? <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
              {REPORT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, type: t.value })); setErrors(e => ({ ...e, type: '' })); }}
                  style={{
                    border: `2px solid ${form.type === t.value ? '#6D4AFF' : '#E5E7EB'}`,
                    borderRadius: 12, padding: '14px 10px', background: form.type === t.value ? '#EDE9FE' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 5 }}>{t.icon}</div>
                  <div style={{ fontWeight: 700, color: form.type === t.value ? '#6D4AFF' : '#374151', fontSize: 13 }}>{t.label}</div>
                  <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
            {errors.type && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>{errors.type}</p>}
          </div>

          {/* Step 2: Reason */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20,
            boxShadow: '0 2px 14px rgba(109,74,255,0.07)', border: '1.5px solid rgba(167,139,250,0.18)',
            animation: 'fadeUp 0.5s ease both', animationDelay: '60ms',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: '0 0 16px' }}>
              2. Reason for Report <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REASONS.map(r => (
                <label key={r.value} style={{
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                  border: `1.5px solid ${form.reason === r.value ? '#6D4AFF' : '#E5E7EB'}`,
                  borderRadius: 10, padding: '12px 16px',
                  background: form.reason === r.value ? '#F5F3FF' : '#fff',
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="radio" name="reason" value={r.value}
                    checked={form.reason === r.value}
                    onChange={() => { setForm(f => ({ ...f, reason: r.value })); setErrors(e => ({ ...e, reason: '' })); }}
                    style={{ accentColor: '#6D4AFF', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: form.reason === r.value ? '#6D4AFF' : '#374151' }}>{r.label}</span>
                </label>
              ))}
            </div>
            {errors.reason && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>{errors.reason}</p>}
          </div>

          {/* Self-harm callout */}
          {form.reason === 'selfharm' && (
            <div style={{
              background: 'linear-gradient(135deg,#FEF3C7,#FEF2F2)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 20,
              border: '1.5px solid #FDE68A', animation: 'fadeUp 0.3s ease both',
            }}>
              <p style={{ margin: 0, color: '#92400E', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                💛 If <strong>you</strong> are experiencing thoughts of self-harm, please reach out for support immediately.
                <button onClick={() => navigate('/crisis-support')} style={{
                  background: '#D97706', color: '#fff', border: 'none', borderRadius: 99,
                  padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 8,
                }}>Crisis Resources →</button>
              </p>
            </div>
          )}

          {/* Description */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20,
            boxShadow: '0 2px 14px rgba(109,74,255,0.07)', border: '1.5px solid rgba(167,139,250,0.18)',
            animation: 'fadeUp 0.5s ease both', animationDelay: '120ms',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: '0 0 6px' }}>
              3. Describe the Concern <span style={{ color: '#EF4444' }}>*</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>Please include as much detail as possible to help our team investigate.</p>
            <textarea
              value={form.description}
              onChange={e => { setForm(f => ({ ...f, description: e.target.value })); setErrors(er => ({ ...er, description: '' })); }}
              placeholder="Describe what happened, when it occurred, and who was involved..."
              rows={5}
              style={{
                width: '100%', borderRadius: 10, border: `1.5px solid ${errors.description ? '#EF4444' : '#E5E7EB'}`,
                padding: '12px 14px', fontSize: 14, color: '#374151', resize: 'vertical',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                background: '#FAFAFA',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {errors.description
                ? <p style={{ color: '#EF4444', fontSize: 12, margin: 0 }}>{errors.description}</p>
                : <span />
              }
              <span style={{ color: '#9CA3AF', fontSize: 11 }}>{form.description.length} chars</span>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20,
            boxShadow: '0 2px 14px rgba(109,74,255,0.07)', border: '1.5px solid rgba(167,139,250,0.18)',
            animation: 'fadeUp 0.5s ease both', animationDelay: '180ms',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', margin: '0 0 6px' }}>4. Screenshot (Optional)</h2>
            <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 14 }}>Attach evidence to help our team investigate.</p>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            {form.screenshot ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', borderRadius: 10, padding: '12px 16px', border: '1.5px solid #BBF7D0' }}>
                <span style={{ fontSize: 20 }}>🖼️</span>
                <span style={{ fontSize: 13, color: '#065F46', fontWeight: 600, flex: 1 }}>{form.screenshot.name}</span>
                <button type="button" onClick={() => setForm(f => ({ ...f, screenshot: null }))} style={{
                  background: '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: 6,
                  padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>Remove</button>
              </div>
            ) : (
              <button
                type="button" onClick={() => fileRef.current?.click()}
                style={{
                  border: '2px dashed #C4B5FD', borderRadius: 12, padding: '20px',
                  width: '100%', background: '#FAFAFA', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 28 }}>📎</span>
                <span style={{ fontSize: 14, color: '#6D4AFF', fontWeight: 600 }}>Click to attach screenshot</span>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>PNG, JPG up to 10MB</span>
              </button>
            )}
          </div>

          {/* Anonymous toggle */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '20px 28px', marginBottom: 24,
            boxShadow: '0 2px 14px rgba(109,74,255,0.07)', border: '1.5px solid rgba(167,139,250,0.18)',
            animation: 'fadeUp 0.5s ease both', animationDelay: '240ms',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
                style={{
                  width: 44, height: 24, borderRadius: 99, background: form.anonymous ? '#6D4AFF' : '#D1D5DB',
                  position: 'relative', flexShrink: 0, transition: 'background 0.2s', cursor: 'pointer',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: form.anonymous ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 14 }}>Submit Anonymously</div>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>Your name won't be shared with the reported party</div>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', background: 'linear-gradient(135deg,#DC2626,#7C3AED)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '16px', fontSize: 16, fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 16px rgba(220,38,38,0.3)',
              animation: 'fadeUp 0.5s ease both', animationDelay: '300ms',
            }}
          >
            {submitting ? (
              <>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                Submitting Report...
              </>
            ) : '🚩 Submit Report'}
          </button>

          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
            By submitting, you confirm this report is truthful. False reports may result in account action.
          </p>
        </form>
      </div>
    </div>
  );
}
