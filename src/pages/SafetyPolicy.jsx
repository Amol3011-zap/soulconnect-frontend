import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
`;

function LotusIcon() {
  return (
    <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }} aria-hidden="true">
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

function SectionCard({ icon, title, children, delay = 0, accent }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      padding: '28px 32px',
      marginBottom: 20,
      boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
      border: `1.5px solid ${accent || 'rgba(167,139,250,0.18)'}`,
      animation: `fadeUp 0.5s ease both`,
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e1b4b' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PillList({ items, color = '#6D4AFF', bg = '#EDE9FE' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {items.map((item, i) => (
        <span key={i} style={{
          background: bg, color, borderRadius: 99,
          padding: '5px 14px', fontSize: 13, fontWeight: 600,
        }}>{item}</span>
      ))}
    </div>
  );
}

function CheckList({ items, color = '#059669' }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#374151' }}>
          <span style={{ color, fontWeight: 700, fontSize: 16, marginTop: 1 }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function CrossList({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#374151' }}>
          <span style={{ color: '#EF4444', fontWeight: 700, fontSize: 16, marginTop: 1 }}>✕</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function SafetyPolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 40%,#F0FDF4 100%)', fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
        padding: '0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-40,left:-40,width:160,height:160,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 40px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 99,
            color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <LotusIcon />
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SoulConnect</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>Your Safety Matters</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
            SoulConnect is designed to provide connection, support, and wellness guidance in a safe and respectful environment.
          </p>

          {/* Quick nav pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {['What We Are','What We\'re Not','Principles','Reporting'].map((t, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 99,
                padding: '6px 16px', fontSize: 12, fontWeight: 600, cursor: 'default',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* What SoulConnect IS */}
        <SectionCard icon="💜" title="What SoulConnect Is" delay={0} accent="rgba(109,74,255,0.2)">
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 14, lineHeight: 1.6 }}>
            SoulConnect is a peer wellness platform that brings people together for healing, growth, and connection.
          </p>
          <CheckList items={[
            'Peer support communities',
            'Wellness circles and group healing',
            'Guided discussions and reflections',
            'Journaling and mood tracking tools',
            'Wellness education and resources',
            'Access to independent wellness guides and healers',
          ]} />
        </SectionCard>

        {/* What SoulConnect is NOT — warning card */}
        <div style={{
          background: 'linear-gradient(135deg,#FEF2F2,#FFF7ED)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 20,
          border: '1.5px solid #FCA5A5',
          animation: 'fadeUp 0.5s ease both', animationDelay: '80ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 26 }}>⚠️</span>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#991B1B' }}>What SoulConnect Is NOT</h2>
          </div>
          <p style={{ color: '#7F1D1D', fontSize: 14, marginBottom: 16, lineHeight: 1.6, fontWeight: 500 }}>
            Understanding our boundaries helps keep everyone safe. SoulConnect does not provide:
          </p>
          <CrossList items={[
            'Emergency support or crisis intervention',
            'Suicide prevention services',
            'Crisis hotline services',
            'Medical advice or diagnosis',
            'Mental health hospital or inpatient care',
            'Psychiatric treatment or therapy',
          ]} />
          <div style={{
            marginTop: 18, padding: '12px 16px', background: '#FEE2E2', borderRadius: 10,
            border: '1px solid #FCA5A5',
          }}>
            <p style={{ margin: 0, color: '#B91C1C', fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>
              🚨 If you are in immediate danger or experiencing a mental health emergency, please contact your local emergency services immediately.
            </p>
          </div>
        </div>

        {/* Community Safety Principles */}
        <SectionCard icon="🕊️" title="Community Safety Principles" delay={160} accent="rgba(16,185,129,0.2)">
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 18, lineHeight: 1.6 }}>
            Every member of SoulConnect is expected to uphold these core principles:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
            {[
              { icon: '🤝', name: 'Respect', desc: 'Honour every person\'s journey' },
              { icon: '🔒', name: 'Privacy', desc: 'What is shared stays here' },
              { icon: '💛', name: 'Compassion', desc: 'Lead with empathy always' },
              { icon: '👁️', name: 'Non-Judgment', desc: 'All paths are valid' },
              { icon: '🌍', name: 'Inclusion', desc: 'Everyone belongs here' },
            ].map((p, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
                borderRadius: 12, padding: '16px 18px', border: '1px solid #BBF7D0',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontWeight: 700, color: '#065F46', fontSize: 15, marginBottom: 3 }}>{p.name}</div>
                <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Reporting & Safety */}
        <SectionCard icon="🛡️" title="Reporting & Safety" delay={240} accent="rgba(109,74,255,0.2)">
          <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
            Our moderation team reviews all reports. You can report users, guides, circles, or messages. All reports are confidential.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              onClick={() => navigate('/report')}
              style={{
                background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
                color: '#fff', border: 'none', borderRadius: 99,
                padding: '13px 28px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(109,74,255,0.35)',
              }}
            >
              🚩 Report a Concern
            </button>
            <button
              onClick={() => navigate('/community-rules')}
              style={{
                background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 99,
                padding: '13px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}
            >
              📋 Community Rules
            </button>
          </div>
        </SectionCard>

        {/* Crisis resources callout */}
        <div style={{
          background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
          borderRadius: 18, padding: '28px 32px',
          animation: 'fadeUp 0.5s ease both', animationDelay: '320ms',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none' }} />
          <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Need Immediate Support?</h3>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6 }}>
            If you or someone you know is in crisis, please reach out to emergency services or a crisis line immediately.
          </p>
          <button
            onClick={() => navigate('/crisis-support')}
            style={{
              background: '#fff', color: '#6D4AFF', border: 'none', borderRadius: 99,
              padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            🆘 View Crisis Resources
          </button>
        </div>

        {/* Footer links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 40 }}>
          {[
            { label: 'Community Rules', to: '/community-rules' },
            { label: 'Guide Terms', to: '/guide-terms' },
            { label: 'Crisis Support', to: '/crisis-support' },
            { label: 'Terms & Privacy', to: '/terms' },
          ].map((l, i) => (
            <button key={i} onClick={() => navigate(l.to)} style={{
              background: 'none', border: 'none', color: '#6D4AFF', fontSize: 14,
              fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
            }}>{l.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
