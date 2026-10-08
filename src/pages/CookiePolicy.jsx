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

const h2Style = {
  fontSize: 'clamp(17px,2.2vw,20px)', fontWeight: 700, color: DARK,
  fontFamily: 'Playfair Display, Georgia, serif', margin: '40px 0 10px',
  paddingBottom: 8, borderBottom: `1px solid ${LINE}`,
};
const pStyle  = { fontSize: 15, color: NAVY_SOFT, lineHeight: 1.85, marginBottom: 14 };
const liStyle = { fontSize: 15, color: NAVY_SOFT, lineHeight: 1.85, marginBottom: 6 };

export default function CookiePolicy() {
  return (
    <div style={{ minHeight: '100vh', background: BG, color: DARK, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,24px)' }}>

        {/* Back */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 28 }}>
          ← Back to Home
        </Link>

        <div style={CARD}>

        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: DARK, fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Cookie Policy
        </h1>
        <p style={{ fontSize: 13, fontWeight: 600, color: GOLD_TXT, letterSpacing: '0.04em', marginBottom: 40 }}>Last updated: June 2026</p>

        {[
          {
            title: '1. What Are Cookies',
            body: 'Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide information to site owners.',
          },
          {
            title: '2. How We Use Cookies',
            body: 'SameFeel uses a minimal set of cookies strictly necessary for the platform to function. We do not use advertising cookies or cross-site tracking cookies.',
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
            body: 'You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of SameFeel, including the ability to stay logged in.',
          },
          {
            title: '6. Contact',
            body: 'If you have questions about our use of cookies, please contact us at privacy@soulconnect.health',
          },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ ...h2Style, margin: '0 0 12px' }}>{s.title}</h2>
            {s.body && <p style={{ ...pStyle, marginBottom: s.list ? 12 : 0 }}>{s.body}</p>}
            {s.list && (
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {s.list.map((item, j) => (
                  <li key={j} style={liStyle}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 28, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: P, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: P, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/safety" style={{ color: P, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Safety Policy</Link>
        </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
}
