import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
`;

function Section({ title, icon, children, delay = 0, accentColor = '#6D4AFF', accentBg = '#F5F3FF' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18, padding: '28px 32px', marginBottom: 20,
      boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
      border: '1.5px solid rgba(167,139,250,0.18)',
      animation: 'fadeUp 0.5s ease both', animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: accentBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
        }}>{icon}</div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e1b4b' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function GreenList({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
          <span style={{ color: '#059669', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function RedList({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
          <span style={{ color: '#EF4444', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>✕</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function GuideTerms() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 40%,#F0FDF4 100%)', fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#4C1D95,#6D4AFF)',
        padding: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-40,left:-40,width:160,height:160,borderRadius:'50%',background:'rgba(255,255,255,0.05)',pointerEvents:'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 40px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 99,
            color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back</button>

          <div style={{ fontSize: 44, marginBottom: 14 }}>🧘</div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.2 }}>Guide & Healer Agreement</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, margin: 0, maxWidth: 560, lineHeight: 1.7 }}>
            Guides and healers on SoulConnect are independent wellness practitioners. This agreement outlines your responsibilities, the scope of your practice, and our shared commitment to keeping the community safe.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Independent Practitioner notice */}
        <div style={{
          background: 'linear-gradient(135deg,#EDE9FE,#F5F3FF)',
          borderRadius: 14, padding: '16px 22px', marginBottom: 24,
          border: '1.5px solid #C4B5FD',
          animation: 'fadeUp 0.4s ease both',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>ℹ️</span>
          <p style={{ margin: 0, color: '#4C1D95', fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>
            <strong>Guides are independent practitioners.</strong> They are not employees, contractors, or agents of SoulConnect. SoulConnect is a platform that facilitates connection between guides and users.
          </p>
        </div>

        {/* Scope of Practice */}
        <Section icon="✅" title="Scope of Practice — What Guides May Provide" delay={60} accentBg="#DCFCE7">
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
            As a guide or healer on SoulConnect, you may offer the following types of support:
          </p>
          <GreenList items={[
            'Wellness coaching and personal development support',
            'Meditation guidance and mindfulness practices',
            'Breathwork support and stress relief techniques',
            'Emotional support and compassionate listening',
            'Energy healing sessions (Reiki, pranic healing, etc.)',
            'Spiritual guidance and life purpose exploration',
            'Guided relaxation and visualisation',
            'Journaling prompts and self-reflection exercises',
          ]} />
        </Section>

        {/* What Guides Must NOT Claim */}
        <div style={{
          background: 'linear-gradient(135deg,#FEF2F2,#FFF7ED)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 20,
          border: '1.5px solid #FCA5A5',
          animation: 'fadeUp 0.5s ease both', animationDelay: '120ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚠️</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#991B1B' }}>Guides Must NOT Claim to:</h2>
          </div>
          <RedList items={[
            'Diagnose any physical or mental illness',
            'Prescribe, recommend, or adjust medication',
            'Provide emergency or crisis intervention',
            'Replace licensed medical, psychiatric, or psychological professionals',
            'Guarantee specific healing outcomes or results',
            'Provide legal, financial, or medical advice',
          ]} />
        </div>

        {/* No Emergency Support */}
        <div style={{
          background: 'linear-gradient(135deg,#FFF7ED,#FEF2F2)',
          borderRadius: 18, padding: '28px 32px', marginBottom: 20,
          border: '2px solid #FCA5A5',
          animation: 'fadeUp 0.5s ease both', animationDelay: '180ms',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>🚨</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#B91C1C' }}>No Emergency Support Obligation</h2>
          </div>
          <p style={{ color: '#7F1D1D', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Guides are not trained crisis responders and are <strong>not responsible for</strong>:
          </p>
          <RedList items={[
            'Suicide intervention or prevention',
            'Emergency response or safety monitoring',
            'Crisis management or acute mental health support',
          ]} />
          <div style={{ marginTop: 18, background: '#FEE2E2', borderRadius: 10, padding: '14px 16px', border: '1px solid #FCA5A5' }}>
            <p style={{ margin: 0, color: '#B91C1C', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
              If a user expresses thoughts of self-harm or suicide, you must direct them to <strong>emergency services</strong> or the <strong>SoulConnect crisis resources</strong> page immediately. Do not attempt to manage this yourself.
            </p>
            <button onClick={() => window.open('/crisis-support', '_blank')} style={{
              marginTop: 10, background: '#DC2626', color: '#fff', border: 'none',
              borderRadius: 99, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>View Crisis Resources →</button>
          </div>
        </div>

        {/* Independent Practitioner Agreement */}
        <Section icon="📋" title="Independent Practitioner Agreement" delay={240} accentBg="#EDE9FE">
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            By operating as a guide on SoulConnect, you acknowledge and agree:
          </p>
          <GreenList items={[
            'You operate as an independent practitioner, not an employee of SoulConnect',
            'SoulConnect does not supervise, direct, or control your clinical or healing decisions',
            'You are responsible for maintaining your own qualifications, certifications, and credentials',
            'You assume all responsibility for the services you provide to users',
            'You carry your own professional liability insurance where applicable',
            'SoulConnect reserves the right to remove guides who violate these terms',
          ]} />
        </Section>

        {/* Guide Responsibilities */}
        <Section icon="💼" title="Guide Responsibilities" delay={300} accentBg="#DCFCE7">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {[
              { icon: '🤝', title: 'Professionalism', desc: 'Conduct all sessions with care, respect, and appropriate boundaries' },
              { icon: '🔒', title: 'Privacy', desc: 'Protect user confidentiality at all times' },
              { icon: '💛', title: 'Helpful Advice Only', desc: 'Avoid harmful, misleading, or pseudoscientific claims' },
              { icon: '🎯', title: 'Stay in Scope', desc: 'Only offer services within your genuine area of expertise' },
              { icon: '📞', title: 'Refer When Needed', desc: 'Direct users to professional help when appropriate' },
              { icon: '🌱', title: 'Continuous Growth', desc: 'Maintain and develop your knowledge and practice' },
            ].map((r, i) => (
              <div key={i} style={{
                background: '#F0FDF4', borderRadius: 12, padding: '14px 16px', border: '1px solid #BBF7D0',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, color: '#065F46', fontSize: 13, marginBottom: 4 }}>{r.title}</div>
                <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Acknowledgement */}
        <div style={{
          background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
          borderRadius: 18, padding: '28px 32px',
          animation: 'fadeUp 0.5s ease both', animationDelay: '360ms',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute',top:-30,right:-30,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.07)',pointerEvents:'none' }} />
          <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>Guide Acknowledgement</h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
            By continuing to offer services on SoulConnect, you confirm that you have read, understood, and agree to these terms. You commit to practising safely, ethically, and within your scope.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#fff', cursor: 'pointer' }}
            />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
              I have read and agree to the Guide & Healer Agreement
            </span>
          </label>
        </div>

        {/* Footer links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 40 }}>
          {[
            { label: 'Safety Policy', to: '/safety' },
            { label: 'Community Rules', to: '/community-rules' },
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
