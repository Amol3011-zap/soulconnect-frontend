import React from 'react';
import { Link } from 'react-router-dom';

export default function Accessibility() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6D4AFF', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
          Accessibility Statement
        </h1>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 48 }}>Last updated: June 2026</p>

        <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.8, marginBottom: 40 }}>
          SoulConnect is committed to making our platform accessible to everyone, including people with disabilities.
          We believe healing and support should be available to all — regardless of ability.
        </p>

        {[
          {
            title: 'Our Commitment',
            body: 'We aim to meet WCAG 2.1 Level AA accessibility standards across our web platform. We are an early-stage platform and are continuously improving accessibility as we build.',
          },
          {
            title: 'Current Accessibility Features',
            list: [
              'Semantic HTML structure with proper heading hierarchy',
              'Keyboard navigation support for all interactive elements',
              'Visible focus indicators on all focusable elements',
              'Sufficient colour contrast ratios for text and UI elements',
              'Alt text on all meaningful images',
              'ARIA labels on icon-only buttons',
              'Responsive design that works on screen readers',
              'Text sizing that respects browser/OS font size preferences',
            ],
          },
          {
            title: 'Known Limitations',
            body: 'As an early-access platform still in development, some areas of the app may not yet fully meet WCAG standards. We are actively working to identify and address these gaps.',
          },
          {
            title: 'Report an Accessibility Issue',
            body: 'If you encounter a barrier or need assistance using SoulConnect, please contact us. We take accessibility feedback seriously and aim to respond within 5 business days.',
          },
          {
            title: 'Contact',
            body: 'Email: accessibility@soulconnect.health\nWe welcome your feedback and are committed to improving your experience.',
          },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1333', marginBottom: 12 }}>{s.title}</h2>
            {s.body && <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: s.list ? 12 : 0 }}>{s.body}</p>}
            {s.list && (
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {s.list.map((item, j) => (
                  <li key={j} style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ borderTop: '1px solid rgba(109,74,255,0.1)', paddingTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#6D4AFF', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/safety" style={{ color: '#6D4AFF', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Safety Policy</Link>
          <Link to="/report" style={{ color: '#6D4AFF', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Report a Concern</Link>
        </div>
      </div>
    </div>
  );
}
