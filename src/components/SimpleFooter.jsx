import React, { useEffect } from 'react';

/* The simple public-page footer — same as the one on /about: lotus mark,
   SoulConnect wordmark and the copyright line, in the "Dawn" palette. */

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
          <img src="/brand/logo/soulconnect-lotus-mark.svg" alt="SoulConnect"
            style={{ height: 30, width: 'auto', display: 'block' }} />
          <span
            style={{
              fontFamily: SF,
              fontWeight: 700,
              fontSize: 17,
              color: DARK,
            }}
          >
            Soul<span style={{ color: P }}>Connect</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
          © {new Date().getFullYear()} SoulConnect. Built with care for every soul navigating the hard parts of life.
        </p>
      </div>
    </footer>
  );
}
