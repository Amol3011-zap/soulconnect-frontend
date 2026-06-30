import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const STYLES = `
  @keyframes footerFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.02)} }
  @keyframes footerPulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
  @keyframes crisisPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
  @keyframes particleDrift {
    0%  { transform:translateY(0)   translateX(0)   opacity:0; }
    10% { opacity:0.6; }
    90% { opacity:0.3; }
    100%{ transform:translateY(-120px) translateX(20px) opacity:0; }
  }
  .sc-footer-link {
    background:none; border:none; cursor:pointer; text-align:left; padding:0;
    color:rgba(255,255,255,0.55); font-size:14px; font-family:'Inter',sans-serif;
    transition:all 0.2s ease; display:flex; align-items:center; gap:6px;
    line-height:1.5;
  }
  .sc-footer-link:hover { color:#C4B5FD; transform:translateX(3px); }
  .sc-social-btn {
    width:42px; height:42px; border-radius:50%; border:1px solid rgba(167,139,250,0.25);
    background:rgba(167,139,250,0.08); display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.25s ease; backdrop-filter:blur(8px);
    text-decoration:none;
  }
  .sc-social-btn:hover {
    background:rgba(109,74,255,0.25);
    border-color:rgba(167,139,250,0.6);
    box-shadow:0 0 18px rgba(109,74,255,0.4), 0 0 6px rgba(167,139,250,0.3);
    transform:translateY(-3px) scale(1.08);
  }
  @media(max-width:768px){
    .sc-footer-grid { grid-template-columns:1fr !important; gap:40px !important; }
    .sc-footer-bottom { flex-direction:column !important; text-align:center !important; gap:8px !important; }
    .sc-footer-root { padding-bottom: calc(72px + env(safe-area-inset-bottom,0px)) !important; }
  }
`;

// SVG Social Icons
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function IconYouTube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}

// Floating particles
function Particles() {
  const count = 14;
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {Array.from({length:count}).map((_,i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${6 + (i * 7.1) % 88}%`,
          bottom:`${(i * 13) % 60}%`,
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? 3 : 2,
          borderRadius:'50%',
          background: i % 2 === 0 ? '#A78BFA' : '#C4B5FD',
          animation:`particleDrift ${8 + (i % 5) * 2}s ease-in-out ${i * 0.7}s infinite`,
          opacity:0,
        }} />
      ))}
    </div>
  );
}

// Sacred geometry SVG
function SacredGeometry({ size = 260, opacity = 0.04 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.44;
  const pts = (n, radius) => Array.from({length:n}, (_,i) => [
    cx + radius * Math.cos(i * 2 * Math.PI / n - Math.PI / 2),
    cy + radius * Math.sin(i * 2 * Math.PI / n - Math.PI / 2),
  ]);
  const hex = pts(6, r);
  const star = pts(6, r * 0.55);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
      <g stroke="#A78BFA" strokeWidth="0.8" fill="none" opacity={opacity}>
        {[r, r*0.72, r*0.44, r*0.22].map((rr,i) => (
          <circle key={i} cx={cx} cy={cy} r={rr} />
        ))}
        {hex.map((p,i) => (
          <line key={i} x1={p[0]} y1={p[1]} x2={hex[(i+3)%6][0]} y2={hex[(i+3)%6][1]} />
        ))}
        {hex.map((p,i) => (
          <line key={`h${i}`} x1={p[0]} y1={p[1]} x2={hex[(i+1)%6][0]} y2={hex[(i+1)%6][1]} />
        ))}
        <polygon points={star.map(p=>p.join(',')).join(' ')} />
      </g>
    </svg>
  );
}

export default function Footer() {
  const navigate = useNavigate();

  const go = (to) => navigate(to);

  const exploreLinks = [
    { label: 'Community',   to: '/dashboard' },
    { label: 'Circles',     to: '/groups' },
    { label: 'Guides',      to: '/healers' },
    { label: 'Challenges',  to: '/dashboard' },
    { label: 'Events',      to: '/meetups' },
  ];

  const trustLinks = [
    { label: 'Safety Policy',        to: '/safety' },
    { label: 'Community Guidelines', to: '/community-rules' },
    { label: 'Privacy Policy',       to: '/terms' },
    { label: 'Terms of Service',     to: '/terms' },
    { label: 'Crisis Resources',     to: '/crisis-support', crisis: true },
    { label: 'Report a Concern',     to: '/report' },
  ];

  const trustBadges = [
    { icon: '🛡️', label: 'Safe Community' },
    { icon: '💜', label: 'Peer Support Platform' },
    { icon: '🚨', label: 'Crisis Resources Available' },
  ];

  return (
    <footer className="sc-footer-root" style={{
      background: 'linear-gradient(180deg,#140A38 0%,#0B0420 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter',sans-serif",
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 80px)',
    }}>
      <style>{STYLES}</style>

      {/* Floating particles */}
      <Particles />

      {/* Sacred geometry top-right */}
      <div style={{ position:'absolute', top:-40, right:-40, opacity:1, pointerEvents:'none', animation:'footerFloat 18s ease-in-out infinite' }}>
        <SacredGeometry size={280} opacity={0.06} />
      </div>
      {/* Sacred geometry bottom-left */}
      <div style={{ position:'absolute', bottom:-60, left:-60, opacity:1, pointerEvents:'none', animation:'footerFloat 22s ease-in-out 4s infinite' }}>
        <SacredGeometry size={220} opacity={0.04} />
      </div>

      {/* Lotus watermark center */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', opacity:0.025, animation:'footerPulse 8s ease-in-out infinite' }}>
        <svg viewBox="0 0 200 200" width="320" height="320">
          {[0,45,90,135,180,225,270,315].map((angle, i) => (
            <ellipse key={i} cx="100" cy="100" rx="18" ry="55"
              fill="none" stroke="#A78BFA" strokeWidth="2"
              transform={`rotate(${angle},100,100)`} />
          ))}
          <circle cx="100" cy="100" r="22" fill="#F5B841" opacity="0.8" />
          <circle cx="100" cy="100" r="14" fill="#FFD77A" />
        </svg>
      </div>

      {/* ── Crisis Support Bar ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(220,38,38,0.15),rgba(185,28,28,0.12))',
        borderTop: '1px solid rgba(220,38,38,0.3)',
        borderBottom: '1px solid rgba(220,38,38,0.2)',
        padding: '24px 32px',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ maxWidth:1140, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap: 24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              {/* Crisis Logo */}
              <div style={{
                width:56, height:56, borderRadius:14, flexShrink:0,
                background: 'linear-gradient(135deg,#DC2626,#991B1B)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 8px 24px rgba(220,38,38,0.35)',
                position:'relative',
              }}>
                <span style={{ fontSize:28, lineHeight:1, animation:'crisisPulse 2s ease-in-out infinite' }}>🆘</span>
              </div>
              <div>
                <p style={{ margin:0, color:'#FCA5A5', fontWeight:800, fontSize:15, lineHeight:1.2 }}>In Crisis? Get Immediate Support</p>
                <p style={{ margin:0, color:'rgba(255,255,255,0.55)', fontSize:12, marginTop:4 }}>
                  Call anytime – available 24/7 across India
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <a href="tel:14416" style={{
                background:'rgba(251,146,146,0.2)', border:'1px solid rgba(251,146,146,0.4)',
                borderRadius:12, padding:'12px 18px', fontSize:13, fontWeight:700,
                color:'#FCA5A5', textDecoration:'none', whiteSpace:'nowrap',
                transition:'all 0.2s ease', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(251,146,146,0.3)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(251,146,146,0.2)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.4)'; }}
              title="Tele-MANAS (Government of India, 24×7)"
              >
                🏛️ Tele-MANAS: 14416
              </a>
              <a href="tel:9152987821" style={{
                background:'rgba(251,146,146,0.2)', border:'1px solid rgba(251,146,146,0.4)',
                borderRadius:12, padding:'12px 18px', fontSize:13, fontWeight:700,
                color:'#FCA5A5', textDecoration:'none', whiteSpace:'nowrap',
                transition:'all 0.2s ease', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(251,146,146,0.3)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(251,146,146,0.2)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.4)'; }}
              title="iCall (24/7)"
              >
                📱 iCall: 9152987821
              </a>
              <a href="tel:+919999666555" style={{
                background:'rgba(251,146,146,0.2)', border:'1px solid rgba(251,146,146,0.4)',
                borderRadius:12, padding:'12px 18px', fontSize:13, fontWeight:700,
                color:'#FCA5A5', textDecoration:'none', whiteSpace:'nowrap',
                transition:'all 0.2s ease', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(251,146,146,0.3)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(251,146,146,0.2)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.4)'; }}
              title="Vandrevala Foundation (24×7 Mental Health Support)"
              >
                💜 Vandrevala: 9999 666 555
              </a>
              <a href="tel:1860-2662-345" style={{
                background:'rgba(251,146,146,0.2)', border:'1px solid rgba(251,146,146,0.4)',
                borderRadius:12, padding:'12px 18px', fontSize:13, fontWeight:700,
                color:'#FCA5A5', textDecoration:'none', whiteSpace:'nowrap',
                transition:'all 0.2s ease', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(251,146,146,0.3)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(251,146,146,0.2)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.4)'; }}
              title="Vandrevala Foundation (24×7)"
              >
                💜 Vandrevala: 1860-2662-345
              </a>
              <a href="tel:9820466726" style={{
                background:'rgba(251,146,146,0.2)', border:'1px solid rgba(251,146,146,0.4)',
                borderRadius:12, padding:'12px 18px', fontSize:13, fontWeight:700,
                color:'#FCA5A5', textDecoration:'none', whiteSpace:'nowrap',
                transition:'all 0.2s ease', cursor:'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(251,146,146,0.3)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(251,146,146,0.2)'; e.currentTarget.style.borderColor='rgba(251,146,146,0.4)'; }}
              title="AASRA (24/7)"
              >
                💚 AASRA: 9820466726
              </a>
              <button
                onClick={() => navigate('/crisis-support')}
                style={{
                  background:'linear-gradient(135deg,#DC2626,#991B1B)',
                  color:'white', border:'none', borderRadius:12,
                  padding:'12px 20px', fontSize:13, fontWeight:800,
                  cursor:'pointer', whiteSpace:'nowrap',
                  boxShadow:'0 4px 16px rgba(220,38,38,0.3)',
                  transition:'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(220,38,38,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(220,38,38,0.3)'; }}
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ────────────────────────────────────────── */}
      <div style={{ maxWidth:1140, margin:'0 auto', padding:'64px 32px 40px', position:'relative', zIndex:2 }}>

        {/* 3-column grid */}
        <div className="sc-footer-grid" style={{
          display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:56, marginBottom:56,
        }}>

          {/* ── COLUMN 1: Brand ──────────────────────────────────────── */}
          <div>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <img src="/logo-icon.png" alt="SoulConnect" style={{
                width:44, height:44, borderRadius:14, flexShrink:0, display:'block',
                boxShadow:'0 6px 24px rgba(109,74,255,0.45)',
              }} />
              <div>
                <div style={{ fontSize:19, fontWeight:800, color:'#fff', letterSpacing:'-0.02em', lineHeight:1 }}>
                  Soul<span style={{ color:'#A78BFA' }}>Connect</span>
                </div>
                <div style={{ fontSize:10, color:'rgba(167,139,250,0.7)', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', marginTop:2 }}>
                  Heal • Connect • Grow
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, lineHeight:1.8, margin:'0 0 24px', maxWidth:280 }}>
              Helping people find connection, support, healing, and personal growth through peer communities, wellness circles, journaling, and guided support.
            </p>

            {/* Trust badges */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
              {trustBadges.map((b,i) => (
                <div key={i} style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'rgba(167,139,250,0.07)',
                  border:'1px solid rgba(167,139,250,0.18)',
                  borderRadius:99, padding:'6px 14px',
                  width:'fit-content',
                  backdropFilter:'blur(8px)',
                }}>
                  <span style={{ fontSize:14 }}>{b.icon}</span>
                  <span style={{ color:'rgba(196,181,253,0.85)', fontSize:12, fontWeight:600 }}>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display:'flex', gap:10 }}>
              {[
                { icon:<IconInstagram />, href:'https://instagram.com', label:'Instagram', color:'#E1306C' },
                { icon:<IconLinkedIn />,  href:'https://linkedin.com',  label:'LinkedIn',  color:'#0A66C2' },
                { icon:<IconYouTube />,   href:'https://youtube.com',   label:'YouTube',   color:'#FF0000' },
              ].map((s,i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="sc-social-btn"
                  title={s.label}
                  aria-label={s.label}
                  style={{ color:'rgba(196,181,253,0.8)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── COLUMN 2: Explore ────────────────────────────────────── */}
          <div>
            <p style={{
              color:'#A78BFA', fontSize:11, fontWeight:800,
              textTransform:'uppercase', letterSpacing:'0.15em',
              margin:'0 0 20px', display:'flex', alignItems:'center', gap:8,
            }}>
              <span style={{ width:18, height:1.5, background:'linear-gradient(90deg,#A78BFA,transparent)', display:'inline-block', borderRadius:99 }} />
              Explore
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {exploreLinks.map(link => (
                <button key={link.to} onClick={() => go(link.to)} className="sc-footer-link">
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'rgba(167,139,250,0.4)', flexShrink:0 }} />
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── COLUMN 3: Trust & Safety ─────────────────────────────── */}
          <div>
            <p style={{
              color:'#A78BFA', fontSize:11, fontWeight:800,
              textTransform:'uppercase', letterSpacing:'0.15em',
              margin:'0 0 20px', display:'flex', alignItems:'center', gap:8,
            }}>
              <span style={{ width:18, height:1.5, background:'linear-gradient(90deg,#A78BFA,transparent)', display:'inline-block', borderRadius:99 }} />
              Trust & Safety
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {trustLinks.map(link => (
                <button key={link.label} onClick={() => go(link.to)} className="sc-footer-link"
                  style={{ color: link.crisis ? 'rgba(252,165,165,0.85)' : 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = link.crisis ? '#FCA5A5' : '#C4B5FD'; e.currentTarget.style.transform='translateX(3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = link.crisis ? 'rgba(252,165,165,0.85)' : 'rgba(255,255,255,0.55)'; e.currentTarget.style.transform='translateX(0)'; }}
                >
                  <span style={{ width:4, height:4, borderRadius:'50%', background: link.crisis ? 'rgba(252,165,165,0.5)' : 'rgba(167,139,250,0.4)', flexShrink:0 }} />
                  {link.label}
                </button>
              ))}
            </div>

            {/* Not a medical disclaimer */}
            <div style={{
              marginTop:24,
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:12, padding:'12px 14px',
              backdropFilter:'blur(8px)',
            }}>
              <p style={{ margin:0, color:'rgba(255,255,255,0.35)', fontSize:11, lineHeight:1.6 }}>
                SoulConnect is a peer wellness platform. It is not a medical provider, crisis service, or emergency responder. For emergencies, call 112 / 911 / 999.
              </p>
            </div>
          </div>
        </div>

        {/* ── Gradient Divider ─────────────────────────────────────────── */}
        <div style={{
          height:1,
          background:'linear-gradient(90deg,transparent,rgba(167,139,250,0.35) 30%,rgba(109,74,255,0.5) 50%,rgba(167,139,250,0.35) 70%,transparent)',
          marginBottom:28,
        }} />

        {/* ── Bottom Bar ───────────────────────────────────────────────── */}
        <div className="sc-footer-bottom" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:10,
        }}>
          <p style={{ margin:0, color:'rgba(255,255,255,0.3)', fontSize:12 }}>
            © 2026 SoulConnect Health Technologies. All Rights Reserved.
          </p>
          <p style={{ margin:0, color:'rgba(167,139,250,0.5)', fontSize:12, fontStyle:'italic' }}>
            Made with 💜 for healing, connection, and growth.
          </p>
          <p style={{ margin:0, color:'rgba(255,255,255,0.2)', fontSize:11 }}>
            Version 1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
