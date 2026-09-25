import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

/* "Dawn" palette — same tokens as the landing page */
const P         = '#6B4FA0';
const DARK      = '#221B3A';
const NAVY_SOFT = '#5B5470';
const GOLD_TXT  = '#8A6A3E';
const CREAM     = '#FAF8FC';
const CREAM_2   = '#F3EFF9';
const BG = `radial-gradient(ellipse at 50% 0%, #FBF1EC 0%, rgba(251,241,236,0) 55%), linear-gradient(180deg, ${CREAM_2} 0%, ${CREAM} 100%)`;

const css = `
  .ct-back{transition:color .15s;}
  .ct-back:hover{color:${DARK}!important;}
  .ct-mail{transition:background .2s, transform .2s;}
  .ct-mail:hover{background:#5A4190!important;transform:translateY(-1px);}
  .ct-mail:focus-visible,.ct-back:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
`;

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', color: DARK }}>
      <style>{css}</style>
      <div style={{ textAlign: 'center', padding: '48px 20px', width: '100%', maxWidth: 560 }}>
        <Link to="/" className="ct-back" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back to Home
        </Link>

        <div style={{
          padding: 'clamp(32px,6vw,52px) clamp(24px,5vw,44px)',
          borderRadius: 24,
          border: '2px solid transparent',
          background: `linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(155deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box`,
          boxShadow: '0 0 0 6px rgba(255,255,255,0.55), 0 24px 56px rgba(107,79,160,0.10)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 22px',
            background: '#F1ECF9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Mail size={28} strokeWidth={1.6} color={P} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: GOLD_TXT, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Get in touch
          </p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: DARK, fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16.5, color: NAVY_SOFT, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 30px' }}>
            Have a question or want to get in touch? We'd love to hear from you.
          </p>
          <a href="mailto:community@soulconnect.health" className="ct-mail" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16, fontWeight: 700, color: '#FFFFFF',
            background: P,
            textDecoration: 'none',
            padding: '14px 28px',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(107,79,160,0.18)',
            maxWidth: '100%',
            wordBreak: 'break-all',
          }}>
            <Mail size={18} strokeWidth={1.9} />
            community@soulconnect.health
          </a>
        </div>
      </div>
    </div>
  );
}
