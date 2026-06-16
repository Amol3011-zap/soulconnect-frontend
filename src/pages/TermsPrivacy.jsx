import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SECTIONS_TERMS = [
  {
    title: '1. Services',
    content: `SoulConnect provides wellness, personal development, spiritual, and complementary healing services, including but not limited to:`,
    list: [
      'Reiki Healing', 'Energy Healing', 'Spiritual Guidance', 'Meditation',
      'Mindfulness Practices', 'Life Coaching', 'Relationship Coaching',
      'Emotional Wellness Support', 'Workshops and Courses',
    ],
    footer: 'All services are educational, spiritual, and wellness-oriented in nature.',
  },
  {
    title: '2. No Medical or Mental Health Treatment',
    content: 'SoulConnect does not provide:',
    list: [
      'Medical diagnosis', 'Medical treatment', 'Psychiatric care',
      'Psychological treatment', 'Emergency mental health services',
    ],
    footer: 'Nothing on this website or within any session should be considered medical, psychological, legal, or financial advice. If you have a physical or mental health condition, you should seek advice from a qualified healthcare professional.',
  },
  {
    title: '3. No Guarantees',
    content: 'Results vary from person to person. SoulConnect makes no guarantees regarding:',
    list: [
      'Healing outcomes', 'Emotional outcomes', 'Relationship outcomes',
      'Financial outcomes', 'Spiritual outcomes', 'Personal growth outcomes',
    ],
    footer: 'Testimonials represent individual experiences only.',
  },
  {
    title: '4. User Responsibility',
    content: 'You acknowledge that you are fully responsible for:',
    list: [
      'Your decisions', 'Your actions', 'Your health choices',
      'Your interpretation of information provided',
    ],
    footer: 'You participate voluntarily and at your own discretion.',
  },
  {
    title: '5. Emergency Situations',
    content: 'SoulConnect is not an emergency service. If you are experiencing:',
    list: [
      'Suicidal thoughts', 'Self-harm thoughts',
      'Medical emergencies', 'Mental health crises',
    ],
    footer: 'Contact emergency services or an appropriate healthcare provider immediately.',
    warning: true,
  },
  {
    title: '6. Session Policies',
    content: 'Clients must provide accurate information when booking. SoulConnect reserves the right to refuse or discontinue services where appropriate.',
  },
  {
    title: '7. Payments',
    content: 'All payments are due before services are provided unless otherwise agreed. Prices may change without notice.',
  },
  {
    title: '8. Cancellation Policy',
    list: [
      'Cancellations made at least 24 hours before a session may be rescheduled.',
      'Late cancellations may be charged in full.',
      'No-shows may be charged in full.',
    ],
  },
  {
    title: '9. Intellectual Property',
    content: 'All website content, materials, videos, courses, meditations, logos, graphics, and written content belong to SoulConnect. You may not copy, reproduce, sell, or distribute content without written permission.',
  },
  {
    title: '10. Limitation of Liability',
    content: 'To the maximum extent permitted by law, SoulConnect shall not be liable for:',
    list: [
      'Personal injury', 'Emotional distress', 'Medical outcomes',
      'Financial losses', 'Relationship outcomes', 'Indirect or consequential damages',
    ],
    footer: 'arising from use of the website or services.',
  },
  {
    title: '11. Indemnification',
    content: 'You agree to indemnify and hold harmless SoulConnect, its owners, practitioners, employees, and affiliates from claims arising from your participation in services or reliance on information provided.',
  },
  {
    title: '12. Changes',
    content: 'SoulConnect may modify these Terms at any time. Continued use of services constitutes acceptance of updated Terms.',
  },
  {
    title: '13. Governing Law',
    content: 'These Terms shall be governed by the laws of the jurisdiction in which SoulConnect is legally established.',
  },
];

const SECTIONS_PRIVACY = [
  {
    title: 'Information We Collect',
    content: 'We may collect:',
    list: [
      'Name', 'Email address', 'Phone number', 'Billing information',
      'Booking details', 'Messages submitted through forms',
      'Information voluntarily shared during sessions',
    ],
  },
  {
    title: 'How We Use Information',
    content: 'We use information to:',
    list: [
      'Schedule appointments', 'Provide services', 'Process payments',
      'Communicate with clients', 'Improve our services', 'Meet legal obligations',
    ],
  },
  {
    title: 'Payment Information',
    content: 'Payments are processed through secure third-party providers. SoulConnect does not store complete credit card information on its servers.',
  },
  {
    title: 'Confidentiality',
    content: 'Information shared during sessions is treated with respect and discretion. However, confidentiality cannot be guaranteed for internet communications, email systems, or third-party platforms.',
  },
  {
    title: 'Cookies',
    content: 'Our website may use cookies to:',
    list: [
      'Improve user experience', 'Analyze website traffic', 'Remember preferences',
    ],
    footer: 'You may disable cookies through your browser settings.',
  },
  {
    title: 'Third-Party Services',
    content: 'We may use third-party providers such as:',
    list: [
      'Payment processors', 'Scheduling platforms',
      'Email marketing services', 'Video conferencing tools',
    ],
    footer: 'These providers have their own privacy policies.',
  },
  {
    title: 'Data Security',
    content: 'We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to:',
    list: [
      'Access your personal data', 'Request correction of inaccurate data',
      'Request deletion of your data', 'Withdraw consent at any time',
    ],
    footer: 'To exercise these rights, contact us at Support@soulconnect.health',
  },
  {
    title: 'Contact',
    content: 'For privacy-related questions or requests, please contact us at Support@soulconnect.health',
  },
];

function Section({ section }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>
        {section.title}
      </h3>
      {section.warning && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 text-xs font-semibold"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}>
          ⚠️ If you are in crisis, please call emergency services immediately.
        </div>
      )}
      {section.content && (
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
          {section.content}
        </p>
      )}
      {section.list && (
        <ul className="space-y-1.5 mb-2 ml-2">
          {section.list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2d6a4f' }} />
              {item}
            </li>
          ))}
        </ul>
      )}
      {section.footer && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {section.footer}
        </p>
      )}
    </div>
  );
}

export default function TermsPrivacy() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.hash === '#privacy' ? 'privacy' : 'terms'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1a3d2e 0%, #1e4d38 50%, #152e23 100%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 32px' }}>
          {/* Back nav */}
          <Link to="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-80 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.7)' }}>
            ← Back to Sign Up
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-5">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#2d6a4f" />
              <path d="M16 8 C10 8 7 12 7 15.5 C7 20 11 23 16 26 C21 23 25 20 25 15.5 C25 12 22 8 16 8Z" fill="#f59e0b" />
              <circle cx="16" cy="15" r="4" fill="white" opacity="0.3" />
            </svg>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>SoulConnect</span>
          </div>

          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.3px' }}>
            Legal Documents
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            Effective Date: June 1, 2025 · Please read carefully before using SoulConnect.
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4 }}>
          {[
            { id: 'terms', label: '📋 Terms & Conditions' },
            { id: 'privacy', label: '🔒 Privacy Policy' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="text-sm font-semibold transition-all"
              style={{
                padding: '14px 20px',
                borderBottom: activeTab === id ? '2px solid #1a3d2e' : '2px solid transparent',
                color: activeTab === id ? '#1a3d2e' : 'var(--text-muted)',
                background: 'none',
                cursor: 'pointer',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>

        {activeTab === 'terms' && (
          <div>
            <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                SoulConnect Terms &amp; Conditions
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Welcome to SoulConnect. By accessing this website, booking a session, purchasing a service,
                enrolling in a program, or using any content provided by SoulConnect, you agree to these
                Terms &amp; Conditions. If you do not agree with these Terms, please discontinue use of the
                website and services.
              </p>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {SECTIONS_TERMS.map((section, i) => (
                <div key={i}>
                  <Section section={section} />
                  {i < SECTIONS_TERMS.length - 1 && (
                    <div className="mb-6" style={{ height: 1, background: 'var(--border-subtle)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(45,106,79,0.08),rgba(26,61,46,0.06))', border: '1px solid rgba(45,106,79,0.2)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1a3d2e' }}>📩 Contact</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                For any questions about these Terms, email us at{' '}
                <a href="mailto:Support@soulconnect.health" className="font-semibold hover:underline" style={{ color: '#1a3d2e' }}>
                  Support@soulconnect.health
                </a>
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <div className="mb-8 p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                SoulConnect Privacy Policy
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                SoulConnect respects your privacy and is committed to protecting your personal information.
                This policy explains what we collect, how we use it, and your rights regarding your data.
              </p>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {SECTIONS_PRIVACY.map((section, i) => (
                <div key={i}>
                  <Section section={section} />
                  {i < SECTIONS_PRIVACY.length - 1 && (
                    <div className="mb-6" style={{ height: 1, background: 'var(--border-subtle)' }} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(45,106,79,0.08),rgba(26,61,46,0.06))', border: '1px solid rgba(45,106,79,0.2)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1a3d2e' }}>📩 Privacy Contact</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                For privacy-related questions, email us at{' '}
                <a href="mailto:Support@soulconnect.health" className="font-semibold hover:underline" style={{ color: '#1a3d2e' }}>
                  Support@soulconnect.health
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Back to signup CTA */}
        <div className="mt-8 flex justify-center">
          <Link to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1a3d2e, #2d6a4f)' }}>
            ← Back to Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
