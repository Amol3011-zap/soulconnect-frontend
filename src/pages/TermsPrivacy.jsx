import React from 'react';
import { Link } from 'react-router-dom';

const P = '#A78BFA';
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
    title: '1. About SoulConnect',
    body: [
      'SoulConnect is an early-stage community platform currently in development.',
      'Our mission is to help people connect with others experiencing similar life challenges, share experiences, participate in guided wellness activities, and build meaningful support networks.',
      'At this stage, SoulConnect primarily operates as a waitlist and informational platform while future features are being developed.',
    ],
  },
  {
    title: '2. Eligibility',
    body: [
      'You must be at least 18 years old to use SoulConnect or join the waitlist.',
      'By using the website, you confirm that you meet this requirement.',
    ],
  },
  {
    title: '3. Waitlist Participation',
    body: ['Joining the SoulConnect waitlist does not guarantee:'],
    list: [
      'Access to future platform features',
      'Membership approval',
      'Specific launch dates',
      'Pricing or subscription terms',
      'Availability in all locations',
    ],
    footer: 'SoulConnect may modify, delay, or discontinue features at any time.',
  },
  {
    title: '4. Acceptable Use',
    body: ['You agree not to:'],
    list: [
      'Violate any applicable laws',
      'Attempt unauthorized access to the website',
      'Interfere with website functionality',
      'Submit false or misleading information',
      'Use the platform for spam or fraudulent activity',
      'Upload harmful code, malware, or malicious content',
    ],
  },
  {
    title: '5. Wellness Information Disclaimer',
    body: [
      'Content provided on SoulConnect is intended for informational, educational, and community-support purposes only.',
      'Nothing on this website should be considered:',
    ],
    list: [
      'Medical advice',
      'Psychological advice',
      'Mental health treatment',
      'Psychiatric care',
      'Legal advice',
      'Financial advice',
    ],
    footer: 'Always seek guidance from qualified professionals regarding your individual circumstances.',
  },
  {
    title: '6. Emergency Situations',
    body: ['SoulConnect is not an emergency service.', 'If you are experiencing:'],
    list: [
      'Suicidal thoughts',
      'Thoughts of self-harm',
      'A mental health crisis',
      'A medical emergency',
    ],
    footer: 'Please contact local emergency services, a crisis hotline, or a qualified healthcare professional immediately.',
  },
  {
    title: '7. Intellectual Property',
    body: [
      'All SoulConnect content, branding, logos, graphics, text, designs, and website materials are owned by SoulConnect and protected by applicable intellectual property laws.',
      'You may not reproduce, distribute, modify, or commercially exploit any content without prior written permission.',
    ],
  },
  {
    title: '8. Privacy',
    body: [
      'Information submitted through the website, including waitlist registrations, is handled in accordance with our Privacy Policy.',
      'By joining the waitlist, you consent to receiving communications related to SoulConnect updates, announcements, and launch information.',
      'You may unsubscribe from communications at any time.',
    ],
  },
  {
    title: '9. No Guarantees',
    body: ['SoulConnect makes no guarantees regarding:'],
    list: [
      'Future platform availability',
      'Specific features',
      'Community outcomes',
      'Wellness outcomes',
      'Personal results',
    ],
    footer: 'Any future testimonials or success stories represent individual experiences and may not reflect typical results.',
  },
  {
    title: '10. Limitation of Liability',
    body: ['To the maximum extent permitted by law, SoulConnect shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:'],
    list: [
      'Use of the website',
      'Reliance on website content',
      'Website interruptions',
      'Technical errors',
      'Future platform participation',
    ],
    footer: 'Your use of SoulConnect is at your own risk.',
  },
  {
    title: '11. Changes to These Terms',
    body: [
      'SoulConnect may update these Terms & Conditions from time to time.',
      'Any updates will be posted on this page with a revised effective date.',
      'Continued use of the website constitutes acceptance of the updated Terms.',
    ],
  },
  {
    title: '12. Governing Law',
    body: ['These Terms shall be governed and interpreted in accordance with the laws applicable in the jurisdiction where SoulConnect operates.'],
  },
];

export default function TermsPrivacy() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Effective Date: June 2026</p>
          <p style={pStyle}>
            Welcome to SoulConnect. By accessing our website, joining the waitlist, or interacting with our platform, you agree to these Terms &amp; Conditions. If you do not agree with these Terms, please do not use the website.
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
            For questions regarding these Terms &amp; Conditions, please contact:{' '}
            <a href="mailto:community@soulconnect.health" style={{ color: P, fontWeight: 600 }}>
              community@soulconnect.health
            </a>
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            We appreciate your interest in SoulConnect and thank you for being part of our early community.
          </p>
        </div>

      </div>
    </div>
  );
}
