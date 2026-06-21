import React from 'react';
import { Link } from 'react-router-dom';

const P  = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

const h2Style = {
  fontSize: 'clamp(17px,2.2vw,20px)', fontWeight: 700, color: '#E9D5FF',
  fontFamily: 'Playfair Display, Georgia, serif', margin: '40px 0 10px',
  paddingBottom: 8, borderBottom: '1px solid rgba(167,139,250,0.15)',
};
const pStyle  = { fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 14 };
const liStyle = { fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 6 };

const sections = [
  {
    title: '1. About This Policy',
    body: [
      'This Privacy Policy explains how SoulConnect ("we", "us", or "our") collects, uses, stores, and protects information you provide when using our website or joining our waitlist.',
      'By using SoulConnect, you agree to the practices described in this Privacy Policy.',
    ],
  },
  {
    title: '2. Information We Collect',
    body: ['We may collect the following types of information:'],
    list: [
      'Name and email address (when you join the waitlist)',
      'Any additional details you voluntarily provide through forms or communications',
      'Technical data such as IP address, browser type, and device information',
      'Usage data including pages visited and time spent on the site',
    ],
    footer: 'We only collect information that is necessary for the purposes described in this policy.',
  },
  {
    title: '3. How We Use Your Information',
    body: ['We use the information we collect to:'],
    list: [
      'Process and manage your waitlist registration',
      'Send you updates, announcements, and launch information about SoulConnect',
      'Respond to your enquiries and support requests',
      'Improve and develop our platform and services',
      'Comply with legal obligations',
    ],
    footer: 'We will never sell your personal information to third parties.',
  },
  {
    title: '4. Cookies and Tracking',
    body: [
      'SoulConnect uses cookies and similar tracking technologies to improve your experience on our website.',
      'Cookies help us understand how visitors use our site and allow us to make improvements.',
    ],
    list: [
      'Essential cookies — required for the website to function correctly',
      'Analytics cookies — help us understand how users interact with our site',
      'Preference cookies — remember your settings and preferences',
    ],
    footer: 'You can control cookie settings through your browser at any time. Disabling certain cookies may affect your experience on the site.',
  },
  {
    title: '5. Third-Party Services',
    body: [
      'We may use trusted third-party services to help us operate the website and manage our waitlist. These providers are required to handle your data securely and only for the purposes we specify.',
      'Third-party services we may use include:',
    ],
    list: [
      'Email delivery providers (for sending waitlist and announcement emails)',
      'Analytics platforms (to understand website usage)',
      'Cloud hosting services (to store data securely)',
    ],
    footer: 'We do not authorise third parties to use your data for their own marketing purposes.',
  },
  {
    title: '6. Data Security',
    body: [
      'We take the security of your personal information seriously and implement appropriate technical and organisational measures to protect it.',
      'While we strive to protect your data, no method of transmission over the internet is completely secure. We cannot guarantee absolute security but will notify you promptly if a breach occurs that may affect your rights.',
    ],
  },
  {
    title: '7. Data Retention',
    body: [
      'We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, or as required by law.',
      'If you request removal of your data, we will delete or anonymise your information within a reasonable timeframe, unless we are legally required to retain it.',
    ],
  },
  {
    title: '8. Your Rights',
    body: ['Depending on your location, you may have the following rights regarding your personal information:'],
    list: [
      'The right to access the information we hold about you',
      'The right to correct inaccurate or incomplete information',
      'The right to request deletion of your personal data',
      'The right to withdraw consent at any time',
      'The right to opt out of marketing communications',
      'The right to lodge a complaint with a data protection authority',
    ],
    footer: 'To exercise any of these rights, please contact us at community@soulconnect.health.',
  },
  {
    title: '9. Children\'s Privacy',
    body: [
      'SoulConnect is intended for users who are 18 years of age or older.',
      'We do not knowingly collect personal information from individuals under the age of 18. If we become aware that a minor has provided us with personal information, we will take steps to delete it promptly.',
    ],
  },
  {
    title: '10. Links to Other Websites',
    body: [
      'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.',
      'We encourage you to review the privacy policies of any external sites you visit.',
    ],
  },
  {
    title: '11. Updates to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.',
      'Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically.',
    ],
  },
  {
    title: '12. Governing Law',
    body: [
      'This Privacy Policy is governed by the laws applicable in the jurisdiction where SoulConnect operates.',
    ],
  },
];

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Effective Date: June 2026</p>
          <p style={pStyle}>
            At SoulConnect, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or join our waitlist.
          </p>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i}>
            <h2 style={h2Style}>{s.title}</h2>
            {s.body.map((t, j) => <p key={j} style={pStyle}>{t}</p>)}
            {s.list && (
              <ul style={{ paddingLeft: 24, margin: '4px 0 14px' }}>
                {s.list.map((item, j) => <li key={j} style={liStyle}>{item}</li>)}
              </ul>
            )}
            {s.footer && <p style={pStyle}>{s.footer}</p>}
          </div>
        ))}

        {/* Contact */}
        <div style={{ marginTop: 48, padding: '24px 28px', background: 'rgba(109,74,255,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#E9D5FF', marginBottom: 10 }}>Contact</h2>
          <p style={pStyle}>
            For questions, requests, or concerns regarding this Privacy Policy, please contact:{' '}
            <a href="mailto:community@soulconnect.health" style={{ color: P, fontWeight: 600 }}>
              community@soulconnect.health
            </a>
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            We are committed to protecting your privacy and will respond to your enquiry as promptly as possible.
          </p>
        </div>

      </div>
    </div>
  );
}
