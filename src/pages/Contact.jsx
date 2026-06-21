import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6D4AFF', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 48 }}>
          ← Back to Home
        </Link>
        <div style={{ fontSize: 48, marginBottom: 20 }}>💜</div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 12 }}>
          Contact Us
        </h1>
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, marginBottom: 32, maxWidth: 420, margin: '0 auto 32px' }}>
          Have a question or want to get in touch? We'd love to hear from you.
        </p>
        <a href="mailto:community@soulconnect.health" style={{
          display: 'inline-block',
          fontSize: 18, fontWeight: 700, color: '#6D4AFF',
          textDecoration: 'none',
          padding: '14px 32px',
          border: '2px solid #6D4AFF',
          borderRadius: 99,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#6D4AFF'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6D4AFF'; }}
        >
          community@soulconnect.health
        </a>
      </div>
    </div>
  );
}
