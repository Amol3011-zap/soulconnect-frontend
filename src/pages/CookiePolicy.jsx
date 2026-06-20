import React from 'react';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        {/* Back */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6D4AFF', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
          Cookie Policy
        </h1>
        <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 48 }}>Last updated: June 2026</p>

        {[
          {
            title: '1. What Are Cookies',
            body: 'Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide information to site owners.',
          },
          {
            title: '2. How We Use Cookies',
            body: 'SoulConnect uses a minimal set of cookies strictly necessary for the platform to function. We do not use advertising cookies or cross-site tracking cookies.',
            list: [
              'Session cookies — to keep you logged in during your visit',
              'Security cookies — to protect against cross-site request forgery (CSRF)',
              'Preference cookies — to remember your theme and language settings',
            ],
          },
          {
            title: '3. Cookies We Do NOT Use',
            list: [
              'Advertising or retargeting cookies',
              'Third-party analytics cookies that track you across websites',
              'Social media tracking pixels',
            ],
          },
          {
            title: '4. Third-Party Cookies',
            body: 'We may use limited third-party services (such as error monitoring) that may set their own cookies. These are used only for platform stability and do not track your personal wellness activity.',
          },
          {
            title: '5. Managing Cookies',
            body: 'You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of SoulConnect, including the ability to stay logged in.',
          },
          {
            title: '6. Contact',
            body: 'If you have questions about our use of cookies, please contact us at privacy@soulconnect.health',
          },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1333', marginBottom: 12 }}>{s.title}</h2>
            {s.body && <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: s.list ? 12 : 0 }}>{s.body}</p>}
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
          <Link to="/terms" style={{ color: '#6D4AFF', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/safety" style={{ color: '#6D4AFF', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Safety Policy</Link>
        </div>
      </div>
    </div>
  );
}
