import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
@keyframes gentlePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
`;

const CRISIS_LINES = [
  { name: 'iCall', phone: '9152987821', country: 'India 🇮🇳', hours: 'Mon–Sat, 8am–10pm', color: '#7C3AED' },
  { name: 'AASRA', phone: '9820466627', country: 'India 🇮🇳', hours: '24 / 7', color: '#DC2626' },
  { name: 'Vandrevala Foundation', phone: '1860-2662-345', country: 'India 🇮🇳', hours: '24 / 7', color: '#0891B2' },
  { name: 'Suicide & Crisis Lifeline', phone: '988', country: 'United States 🇺🇸', hours: '24 / 7', color: '#059669' },
  { name: 'Samaritans', phone: '116 123', country: 'United Kingdom 🇬🇧', hours: '24 / 7', color: '#D97706' },
  { name: 'Crisis Text Line', phone: 'Text HOME to 741741', country: 'United States 🇺🇸', hours: '24 / 7', color: '#6D4AFF' },
  { name: 'Lifeline', phone: '13 11 14', country: 'Australia 🇦🇺', hours: '24 / 7', color: '#DB2777' },
];

const EMERGENCY_SIGNS = [
  { icon: '💭', text: 'Thoughts of suicide or self-harm' },
  { icon: '😰', text: 'Feeling unable to keep yourself safe' },
  { icon: '🆘', text: 'Immediate danger from another person' },
  { icon: '🏥', text: 'Medical emergency or overdose' },
  { icon: '💔', text: 'Severe emotional distress or breakdown' },
  { icon: '🚨', text: 'Domestic violence or abuse' },
];

export default function CrisisSupport() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);

  const handleCopy = (phone, i) => {
    navigator.clipboard?.writeText(phone).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#FFF7ED 0%,#FEF2F2 40%,#F5F3FF 100%)', fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Emergency Banner */}
      <div style={{
        background: 'linear-gradient(135deg,#DC2626,#B91C1C)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        <span style={{ animation: 'gentlePulse 2s ease infinite', fontSize: 18 }}>🚨</span>
        <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center' }}>
          If you are in immediate danger — call <strong>emergency services (112 / 911 / 999)</strong> right now.
        </p>
      </div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#7C3AED,#DC2626)',
        padding: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-40,left:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 36px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 99,
            color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back</button>

          <div style={{ fontSize: 44, marginBottom: 12, animation: 'gentlePulse 3s ease infinite' }}>🆘</div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>Need Immediate Help?</h1>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, margin: 0, maxWidth: 560, lineHeight: 1.7 }}>
            If you are in immediate danger, thinking about harming yourself, or believe someone else may be at risk — please seek emergency assistance immediately. You are not alone.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Emergency Action Card */}
        <div style={{
          background: 'linear-gradient(135deg,#FEF2F2,#FFF7ED)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 24,
          border: '2px solid #FCA5A5',
          animation: 'fadeUp 0.4s ease both',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#991B1B', margin: '0 0 16px' }}>
            🚨 Emergency Situations
          </h2>
          <p style={{ color: '#7F1D1D', fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
            If you are experiencing any of the following, contact emergency services immediately:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10, marginBottom: 20 }}>
            {EMERGENCY_SIGNS.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(254,226,226,0.7)', borderRadius: 10, padding: '10px 14px',
              }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 13, color: '#7F1D1D', fontWeight: 500, lineHeight: 1.4 }}>{s.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="tel:112" style={{
              background: '#DC2626', color: '#fff', borderRadius: 99,
              padding: '13px 26px', fontSize: 15, fontWeight: 700,
              textDecoration: 'none', display: 'inline-block',
            }}>📞 Call Emergency: 112</a>
            <a href="tel:100" style={{
              background: '#7C3AED', color: '#fff', borderRadius: 99,
              padding: '13px 26px', fontSize: 15, fontWeight: 700,
              textDecoration: 'none', display: 'inline-block',
            }}>🚔 Police: 100</a>
          </div>
        </div>

        {/* Crisis Lines */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: '28px 32px', marginBottom: 24,
          boxShadow: '0 2px 16px rgba(109,74,255,0.08)',
          animation: 'fadeUp 0.5s ease both', animationDelay: '80ms',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', margin: '0 0 6px' }}>📞 Crisis Support Lines</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>Free, confidential support available 24/7.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CRISIS_LINES.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                border: '1.5px solid #EDE9FE', borderRadius: 14, padding: '14px 18px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 14,
                }}>{r.name[0]}</div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 15 }}>{r.name}</div>
                  <div style={{ color: '#6B7280', fontSize: 12 }}>{r.country} · {r.hours}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, color: r.color, fontSize: 16 }}>{r.phone}</span>
                  <button
                    onClick={() => handleCopy(r.phone, i)}
                    style={{
                      background: copied === i ? '#DCFCE7' : '#F3F4F6',
                      color: copied === i ? '#059669' : '#6B7280',
                      border: 'none', borderRadius: 6, padding: '5px 10px',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >{copied === i ? '✓ Copied' : 'Copy'}</button>
                  <a href={`tel:${r.phone.replace(/\s/g,'')}`} style={{
                    background: r.color, color: '#fff', borderRadius: 6,
                    padding: '5px 12px', fontSize: 12, fontWeight: 700,
                    textDecoration: 'none',
                  }}>Call</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* You Are Not Alone */}
        <div style={{
          background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 24,
          border: '1.5px solid rgba(167,139,250,0.3)',
          animation: 'fadeUp 0.5s ease both', animationDelay: '160ms',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#4C1D95', margin: '0 0 12px' }}>💜 You Are Not Alone</h2>
          <p style={{ color: '#5B21B6', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            Whatever you are going through right now, there are people who care and who want to help.
            Reaching out is an act of incredible strength and courage.
          </p>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            SoulConnect is a peer wellness community. We are not a crisis service, but we care deeply about your wellbeing.
            Please use the crisis resources above for immediate professional support.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button
              onClick={() => navigate('/healers')}
              style={{
                background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
                color: '#fff', border: 'none', borderRadius: 99,
                padding: '12px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >🧘 Find Professional Support</button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#fff', color: '#6D4AFF', border: '2px solid #EDE9FE',
                borderRadius: 99, padding: '12px 22px', fontSize: 14,
                fontWeight: 700, cursor: 'pointer',
              }}
            >← Return to SoulConnect</button>
          </div>
        </div>

        {/* What to say */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: '28px 32px',
          boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
          animation: 'fadeUp 0.5s ease both', animationDelay: '240ms',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', margin: '0 0 14px' }}>💬 What to Say When You Call</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
            If you're not sure what to say, you can start with:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              '"I\'m struggling and need someone to talk to."',
              '"I\'m having thoughts of hurting myself."',
              '"I\'m worried about someone I know."',
              '"I\'m not sure what to do right now."',
            ].map((s, i) => (
              <div key={i} style={{
                background: '#F5F3FF', borderRadius: 10, padding: '12px 16px',
                borderLeft: '3px solid #8B5CF6', color: '#4C1D95',
                fontSize: 14, fontStyle: 'italic', fontWeight: 500,
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginTop: 32, lineHeight: 1.6 }}>
          SoulConnect is a peer wellness platform and is not a crisis service or emergency provider.<br/>
          For emergencies, always contact local emergency services immediately.
        </p>
      </div>
    </div>
  );
}
