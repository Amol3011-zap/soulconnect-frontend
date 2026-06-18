import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
`;

function RuleCard({ icon, title, items, type = 'allowed', delay = 0 }) {
  const isAllowed = type === 'allowed';
  return (
    <div style={{
      background: isAllowed ? 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' : 'linear-gradient(135deg,#FEF2F2,#FFF7ED)',
      borderRadius: 18, padding: '24px 28px', marginBottom: 0,
      border: `1.5px solid ${isAllowed ? '#BBF7D0' : '#FCA5A5'}`,
      animation: 'fadeUp 0.5s ease both', animationDelay: `${delay}ms`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: isAllowed ? '#065F46' : '#991B1B' }}>{title}</h3>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>
            <span style={{ color: isAllowed ? '#059669' : '#EF4444', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
              {isAllowed ? '✓' : '✕'}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const REPORTING_STEPS = [
  { icon: '📋', label: 'Report Submitted', desc: 'You submit a report via the Report page', color: '#6D4AFF' },
  { icon: '🔍', label: 'Moderator Review', desc: 'Our team reviews your report confidentially', color: '#0891B2' },
  { icon: '⚡', label: 'Action Taken', desc: 'We take appropriate action based on findings', color: '#D97706' },
  { icon: '📬', label: 'User Notified', desc: 'You receive confirmation of the outcome', color: '#059669' },
];

export default function CommunityRules() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const policies = [
    {
      id: 'selfharm',
      icon: '💛',
      title: 'Self-Harm Policy',
      color: '#D97706',
      bg: '#FEF3C7',
      border: '#FDE68A',
      content: (
        <div>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
            <strong style={{ color: '#92400E' }}>Discussion of emotions is welcome and encouraged.</strong> SoulConnect is a space for honest, vulnerable sharing without judgment.
          </p>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
            However, the following are strictly prohibited:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Encouraging, glorifying, or promoting self-harm or suicide',
              'Sharing specific methods or instructions for self-harm',
              'Content that romanticises self-destructive behaviour',
              'Triggering content posted without content warnings',
            ].map((item, i) => (
              <li key={i} style={{ display:'flex', gap:8, fontSize:14, color:'#374151', lineHeight:1.5 }}>
                <span style={{ color:'#EF4444', fontWeight:700, flexShrink:0 }}>✕</span>{item}
              </li>
            ))}
          </ul>
          <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '12px 14px', border: '1px solid #FCA5A5' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#B91C1C', fontWeight: 600, lineHeight: 1.5 }}>
              Violations may result in content removal and account suspension. If you are struggling, please reach out to our crisis support resources.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'harassment',
      icon: '🛡️',
      title: 'Harassment & Discrimination Policy',
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#C4B5FD',
      content: (
        <div>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
            SoulConnect has zero tolerance for harassment or discrimination of any kind. The following are prohibited:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Personal attacks or targeted insults',
              'Intimidation or threatening behaviour',
              'Discrimination based on race, religion, gender, sexuality, disability, or nationality',
              'Sexual harassment or unwanted advances',
              'Doxxing or sharing private information about others',
              'Coordinated attacks or pile-ons',
            ].map((item, i) => (
              <li key={i} style={{ display:'flex', gap:8, fontSize:14, color:'#374151', lineHeight:1.5 }}>
                <span style={{ color:'#EF4444', fontWeight:700, flexShrink:0 }}>✕</span>{item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 40%,#F0FDF4 100%)', fontFamily: "'Inter',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#059669,#6D4AFF)',
        padding: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'rgba(255,255,255,0.06)',pointerEvents:'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 40px', position: 'relative' }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 99,
            color: '#fff', padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 24,
          }}>← Back</button>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🤝</div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.2 }}>Community Guidelines</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: 0, maxWidth: 560, lineHeight: 1.7 }}>
            SoulConnect exists to create a safe healing environment where every person feels respected, valued, and free to grow. These guidelines protect that space for everyone.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Golden rule */}
        <div style={{
          background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
          borderRadius: 18, padding: '20px 28px', marginBottom: 24,
          border: '1.5px solid #FDE68A',
          animation: 'fadeUp 0.4s ease both',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>✨</span>
          <p style={{ margin: 0, color: '#92400E', fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>
            The golden rule: <em>Treat every soul the way you would wish to be treated on your hardest day.</em>
          </p>
        </div>

        {/* Allowed / Not Allowed */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>What's Allowed vs. What Isn't</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16, marginBottom: 28 }}>
          <RuleCard
            icon="💚"
            title="Encouraged in Our Community"
            type="allowed"
            delay={60}
            items={[
              'Sharing your personal experiences and emotions',
              'Seeking peer support and connection',
              'Offering encouragement and kind words',
              'Respectful discussion of wellness topics',
              'Celebrating others\' healing milestones',
              'Asking questions without judgment',
              'Sharing resources that have helped you',
            ]}
          />
          <RuleCard
            icon="🚫"
            title="Not Allowed — Zero Tolerance"
            type="notallowed"
            delay={120}
            items={[
              'Harassment, bullying, or intimidation',
              'Hate speech or discrimination',
              'Threats of violence or harm',
              'Exploitation or manipulation of vulnerable users',
              'Dangerous medical or wellness advice',
              'Spam, self-promotion, or advertising',
              'Sharing others\' private information',
            ]}
          />
        </div>

        {/* Specific Policies (accordion) */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', marginBottom: 14 }}>Specific Policies</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {policies.map(p => (
            <div key={p.id} style={{
              background: '#fff', borderRadius: 14,
              border: `1.5px solid ${openSection === p.id ? p.border : 'rgba(167,139,250,0.18)'}`,
              overflow: 'hidden', transition: 'border-color 0.2s',
              animation: 'fadeUp 0.5s ease both',
            }}>
              <button
                onClick={() => setOpenSection(openSection === p.id ? null : p.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: p.bg, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{p.icon}</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', flex: 1 }}>{p.title}</span>
                <span style={{ color: '#9CA3AF', fontSize: 18, flexShrink: 0 }}>
                  {openSection === p.id ? '▲' : '▼'}
                </span>
              </button>
              {openSection === p.id && (
                <div style={{ padding: '0 24px 22px' }}>{p.content}</div>
              )}
            </div>
          ))}
        </div>

        {/* Reporting Process */}
        <div style={{
          background: '#fff', borderRadius: 18, padding: '28px 32px', marginBottom: 24,
          boxShadow: '0 2px 16px rgba(109,74,255,0.07)',
          border: '1.5px solid rgba(167,139,250,0.18)',
          animation: 'fadeUp 0.5s ease both', animationDelay: '200ms',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e1b4b', margin: '0 0 20px' }}>📬 Reporting Process</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
            You can report any user, guide, message, or circle. All reports are reviewed by our moderation team.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, position: 'relative' }}>
            {REPORTING_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: '1 1 200px', minWidth: 160, paddingRight: 16, marginBottom: 16, position: 'relative' }}>
                {i < REPORTING_STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 20, left: 46, width: 'calc(100% - 50px)', height: 2,
                    background: 'linear-gradient(90deg,rgba(167,139,250,0.4),transparent)',
                  }} />
                )}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: step.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18, position: 'relative', zIndex: 1,
                }}>{step.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 14 }}>{step.label}</div>
                  <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.4, marginTop: 2 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
              You can report: <strong>users · guides · circles · messages</strong>
            </p>
            <button
              onClick={() => navigate('/report')}
              style={{
                background: 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
                color: '#fff', border: 'none', borderRadius: 99,
                padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >🚩 Submit a Report</button>
          </div>
        </div>

        {/* Consequences */}
        <div style={{
          background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
          borderRadius: 18, padding: '24px 28px', marginBottom: 24,
          border: '1.5px solid #C4B5FD',
          animation: 'fadeUp 0.5s ease both', animationDelay: '280ms',
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#4C1D95', margin: '0 0 12px' }}>⚖️ Consequences of Violations</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Content Removal', color: '#D97706', bg: '#FEF3C7' },
              { label: 'Formal Warning', color: '#0891B2', bg: '#E0F2FE' },
              { label: 'Temporary Suspension', color: '#7C3AED', bg: '#EDE9FE' },
              { label: 'Permanent Ban', color: '#DC2626', bg: '#FEE2E2' },
            ].map((c, i) => (
              <span key={i} style={{
                background: c.bg, color: c.color, borderRadius: 99,
                padding: '6px 14px', fontSize: 13, fontWeight: 600,
              }}>{c.label}</span>
            ))}
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
            Consequences are determined by severity, intent, and history. We always aim to be fair, transparent, and proportionate.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          {[
            { label: 'Safety Policy', to: '/safety' },
            { label: 'Guide Terms', to: '/guide-terms' },
            { label: 'Report a Concern', to: '/report' },
            { label: 'Crisis Support', to: '/crisis-support' },
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
