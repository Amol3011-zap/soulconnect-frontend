import React from 'react';
import { Link } from 'react-router-dom';

const P  = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 48 }}>
          ← Back to Home
        </Link>
        <div style={{ fontSize: 48, marginBottom: 20 }}>💜</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 12 }}>
          Contact Us
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
          Have a question or want to get in touch? We'd love to hear from you.
        </p>
        <a href="mailto:community@soulconnect.health" style={{
          display: 'inline-block',
          fontSize: 17, fontWeight: 700, color: P,
          textDecoration: 'none',
          padding: '14px 32px',
          border: '2px solid rgba(167,139,250,0.5)',
          borderRadius: 99,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,74,255,0.25)'; e.currentTarget.style.borderColor = P; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)'; }}
        >
          community@soulconnect.health
        </a>
      </div>
    </div>
  );
}
