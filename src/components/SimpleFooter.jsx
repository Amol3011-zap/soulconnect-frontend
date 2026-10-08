import React, { useEffect } from 'react';

/* The simple public-page footer — same as the one on /about: lotus mark,
   SameFeel wordmark and the copyright line, in the "Dawn" palette. */

// The wordmark is set in Playfair Display. /about loads that font itself;
// the other pages using this footer didn't, so the wordmark fell back to
// Georgia (wider — it looked stretched). Load it once, the same way.
const PLAYFAIR_HREF =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap';
const P = '#6B4FA0';
const DARK = '#221B3A';
const MUTED = '#6E6784';
const LILAC_LINE = '#E6DDF3';
const SF = '"Playfair Display",Georgia,serif';

export default function SimpleFooter() {
  useEffect(() => {
    const already = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some((l) => l.href.includes('family=Playfair+Display'));
    if (already) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = PLAYFAIR_HREF;
    document.head.appendChild(link);
  }, []);

  return (
    <footer
      style={{
        background: '#FFFFFF',
        padding: '36px 24px',
        textAlign: 'center',
        borderTop: `1px solid ${LILAC_LINE}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <img src="/logo-icon.png" alt="SameFeel"
            style={{ height: 30, width: 30, borderRadius: 9, display: "block", border: "1px solid rgba(109,74,255,0.38)", boxSizing: "border-box" }} />
          <span
            style={{
              fontFamily: SF,
              fontWeight: 700,
              fontSize: 17,
              color: DARK,
            }}
          >
            Same<span style={{ color: P }}>Feel</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
          © {new Date().getFullYear()} SameFeel. Your first step towards a better tomorrow.
        </p>
      </div>
    </footer>
  );
}
