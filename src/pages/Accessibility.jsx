import React from 'react';
import { Link } from 'react-router-dom';
import SimpleFooter from '../components/SimpleFooter';

/* "Dawn" palette — same tokens as the landing and the other public pages */
const P         = '#6B4FA0';
const DARK      = '#221B3A';
const NAVY_SOFT = '#5B5470';
const GOLD_TXT  = '#8A6A3E';
const CREAM     = '#FAF8FC';
const CREAM_2   = '#F3EFF9';
const LINE      = '#E7E0F2';
const BG = `radial-gradient(ellipse at 50% 0%, #FBF1EC 0%, rgba(251,241,236,0) 55%), linear-gradient(180deg, ${CREAM_2} 0%, ${CREAM} 100%)`;
const CARD = {
  background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 24,
  padding: 'clamp(24px,5vw,48px)', boxShadow: '0 24px 56px rgba(107,79,160,0.08)',
};
const h2Style = { fontSize: 'clamp(17px,2.2vw,20px)', fontWeight: 700, color: DARK, fontFamily: 'Playfair Display, Georgia, serif', margin: '40px 0 10px', paddingBottom: 8, borderBottom: `1px solid ${LINE}` };
const pStyle  = { fontSize: 15, color: NAVY_SOFT, lineHeight: 1.85, marginBottom: 14 };
const liStyle = { fontSize: 15, color: NAVY_SOFT, lineHeight: 1.85, marginBottom: 6 };

export default function Accessibility() {
  return (
    <div style={{ minHeight: '100vh', background: BG, color: DARK, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,24px)' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 28 }}>
          ← Back to Home
        </Link>

        <div style={CARD}>

        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: DARK, fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Accessibility Statement
        </h1>
        <p style={{ fontSize: 13, fontWeight: 600, color: GOLD_TXT, letterSpacing: '0.04em', marginBottom: 40 }}>Last Updated: June 2026</p>

        <p style={pStyle}>
          At SoulConnect, we believe that support, connection, and healing should be accessible to everyone. We are committed to improving the accessibility of our platform and creating an inclusive experience for all users.
        </p>

        <h2 style={h2Style}>Our Commitment</h2>
        <p style={pStyle}>
          We are working toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and continuously review our platform to identify and address accessibility barriers.
        </p>

        <h2 style={h2Style}>Accessibility Features</h2>
        <p style={{ ...pStyle, marginBottom: 8 }}>SoulConnect currently includes:</p>
        <ul style={{ paddingLeft: 24, margin: '0 0 24px' }}>
          {[
            'Semantic HTML structure and logical heading hierarchy',
            'Keyboard-accessible navigation and interactive elements',
            'Visible focus indicators',
            'Responsive layouts across devices and screen sizes',
            'Alternative text for meaningful images',
            'ARIA labels where appropriate',
            'Support for browser and operating system text scaling',
            'Colour contrast considerations for readability',
          ].map((item, i) => (
            <li key={i} style={liStyle}>{item}</li>
          ))}
        </ul>

        <h2 style={h2Style}>Ongoing Improvements</h2>
        <p style={pStyle}>
          SoulConnect is an early-stage platform and accessibility is an ongoing priority. We regularly review feedback and make improvements as the platform evolves.
        </p>

        <h2 style={h2Style}>Report an Accessibility Issue</h2>
        <p style={pStyle}>
          If you experience difficulty accessing any part of SoulConnect or would like to suggest an improvement, we encourage you to contact us.
        </p>
        <p style={pStyle}>We aim to acknowledge accessibility-related requests within 5 business days.</p>

        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>
          Email:{' '}
          <a href="mailto:community@soulconnect.health" style={{ color: P, fontWeight: 600 }}>
            community@soulconnect.health
          </a>
        </p>
        <p style={pStyle}>
          We welcome your feedback and appreciate your help in making SoulConnect more accessible for everyone.
        </p>
        </div>

      </div>

      <SimpleFooter />
    </div>
  );
}
