import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const P = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

const sections = [
  {
    icon: '🔒',
    title: 'Your Privacy Matters',
    subsections: [
      {
        heading: 'Your personal information belongs to you.',
        content: 'We are committed to protecting your privacy and giving you control over what you choose to share on SoulConnect.'
      },
      {
        heading: 'You decide what information appears on your profile.',
        content: 'We encourage users not to share sensitive personal information publicly. Read our Privacy Policy to learn how your data is handled.'
      }
    ]
  },
  {
    icon: '💜',
    title: 'A Respectful Community',
    subsections: [
      {
        heading: 'SoulConnect is built around empathy, kindness, and respect.',
        content: 'Everyone is expected to:'
      },
      {
        items: [
          'Treat others respectfully',
          'Avoid harassment or discrimination',
          'Respect personal boundaries',
          'Support others without judgment'
        ],
        content: 'Content that violates our Community Guidelines may be removed.'
      }
    ]
  },
  {
    icon: '🛡️',
    title: 'Community Moderation',
    subsections: [
      {
        heading: 'To help maintain a safe environment, SoulConnect uses moderation tools and reporting features.',
        content: 'Users can:'
      },
      {
        items: [
          'Report inappropriate content',
          'Block unwanted interactions',
          'Flag harmful behavior'
        ],
        content: 'Our team reviews reports to help keep the community safe.'
      }
    ]
  },
  {
    icon: '✅',
    title: 'Verified Professionals',
    subsections: [
      {
        heading: 'Where professional services are offered, practitioners go through a verification process before appearing on the platform.',
        content: 'Users should always review a professional\'s profile, qualifications, and experience before booking a session.'
      }
    ]
  },
  {
    icon: '⚕️',
    title: 'Peer Support, Not Emergency Care',
    subsections: [
      {
        heading: 'SoulConnect provides peer support, wellness resources, and access to professionals where available.',
        content: 'It is not an emergency service and should not be used as a substitute for urgent medical or psychiatric care.'
      },
      {
        heading: 'If you are in immediate danger or experiencing a mental health crisis, contact your local emergency services or a crisis helpline immediately.'
      }
    ]
  },
  {
    icon: '🤝',
    title: 'Transparency',
    subsections: [
      {
        heading: 'We believe trust is earned through honesty.',
        content: 'We do not intentionally display misleading statistics, fake testimonials, or fabricated reviews. Our goal is to build a supportive community through genuine experiences and meaningful connections.'
      }
    ]
  },
  {
    icon: '🔐',
    title: 'Account & Data Security',
    subsections: [
      {
        heading: 'We continuously work to protect user accounts and platform security using industry-standard security practices.',
        content: 'To help keep your account safe:'
      },
      {
        items: [
          'Use a strong password.',
          'Never share your login credentials.',
          'Contact us if you believe your account has been compromised.'
        ]
      }
    ]
  },
  {
    icon: '💚',
    title: 'Your Well-being Comes First',
    subsections: [
      {
        heading: 'We encourage users to seek professional support whenever it is needed.',
        content: 'SoulConnect is designed to complement—not replace—professional mental health care.'
      }
    ]
  }
];

export default function TrustSafety() {
  useEffect(() => {
    document.title = 'Trust & Safety | SoulConnect Community Standards';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Learn about SoulConnect\'s commitment to privacy, community safety, moderation, and your well-being. Verified professionals, transparent practices, and your control over your data.';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{
            fontSize: 'clamp(28px,4vw,42px)',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Playfair Display, Georgia, serif',
            marginBottom: 16
          }}>
            🤝 Trust & Safety
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Your privacy, safety, and well-being are our highest priorities
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
          {sections.map((section, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(109,74,255,0.08)',
                border: '1px solid rgba(167,139,250,0.15)',
                borderRadius: 16,
                padding: 28,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(109,74,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(109,74,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.15)';
              }}
            >
              {/* Icon + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{section.icon}</span>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.3,
                }}>
                  {section.title}
                </h2>
              </div>

              {/* Subsections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {section.subsections.map((sub, j) => (
                  <div key={j}>
                    {sub.heading && (
                      <h3 style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: sub.content || sub.items ? 8 : 0,
                        lineHeight: 1.5,
                      }}>
                        {sub.heading}
                      </h3>
                    )}

                    {sub.items && (
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        marginBottom: sub.content ? 8 : 0,
                      }}>
                        {sub.items.map((item, k) => (
                          <li key={k} style={{
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.6)',
                            marginBottom: 6,
                            paddingLeft: 20,
                            position: 'relative',
                            lineHeight: 1.5,
                          }}>
                            <span style={{ position: 'absolute', left: 0 }}>•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {sub.content && (
                      <p style={{
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {sub.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Section */}
        <div style={{
          marginTop: 48,
          padding: 32,
          background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(191,33,33,0.08))',
          border: '2px solid rgba(239,68,68,0.3)',
          borderRadius: 16,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#FCA5A5', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🆘</span> Need Immediate Help?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.6 }}>
            If you or someone you know is experiencing a mental health crisis, contact emergency services immediately or reach out to:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { name: 'Tele-MANAS', number: '14416', desc: '24/7 Mental Health Support' },
              { name: 'Vandrevala Foundation', number: '+91 9999 666 555', desc: 'Crisis Support' },
              { name: 'iCall', number: '9152987821', desc: 'Mental Health Support' },
              { name: 'AASRA', number: '9820466726', desc: 'Suicide Prevention' },
            ].map((crisis, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 14,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#FCA5A5', marginBottom: 4 }}>
                  {crisis.name}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {crisis.number}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {crisis.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: 48,
          padding: 32,
          background: 'rgba(109,74,255,0.15)',
          border: `2px solid ${P}`,
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            More Questions?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            Check our FAQ or contact our support team for more information
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/faq" style={{
              display: 'inline-block',
              background: P,
              color: '#120B2E',
              padding: '12px 28px',
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              Visit FAQ
            </Link>
            <Link to="/contact" style={{
              display: 'inline-block',
              background: 'transparent',
              color: P,
              padding: '12px 28px',
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: 'none',
              border: `2px solid ${P}`,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
