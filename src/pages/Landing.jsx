import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// ── Color tokens ──────────────────────────────────────────────────────────────
const P   = '#6D4AFF';
const LAV = '#A78BFA';
const GLD = '#F5B841';
const PNK = '#F472B6';
const GRN = '#34C38F';
const DARK = '#120B2E';

const NAV_LINKS = [
  { label: 'About Us',    href: '#vision' },
  { label: 'How It Works',href: '#how' },
  { label: 'For You',     href: '#struggling' },
  { label: 'Resources',   href: '#trust' },
  { label: 'Contact',     href: '#cta' },
];

// ── Cinematic Hero Illustration ───────────────────────────────────────────────
function HeroIllustration() {
  const W = 700, H = 700;
  const pts = (n, r, cx, cy) => Array.from({length:n}, (_,i) => [
    cx + r*Math.cos(i*2*Math.PI/n - Math.PI/2),
    cy + r*Math.sin(i*2*Math.PI/n - Math.PI/2),
  ]);
  const hex = pts(6, 160, W/2, H/2+30);
  const star = pts(6, 95,  W/2, H/2+30);
  const floats = Array.from({length:28}, (_,i) => ({
    x: 30 + (i*41 + i*i*7)%640,
    y: 20 + (i*53 + i*i*11)%650,
    r: 1.2 + (i%4)*0.6,
    dur: 3 + (i%5)*1.1,
    del: i*0.35,
    col:[LAV,GLD,PNK,'#C4B5FD','#FDE68A'][i%5],
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',display:'block'}} aria-hidden="true">
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0D0626"/>
          <stop offset="35%"  stopColor="#2D0F5E"/>
          <stop offset="65%"  stopColor="#7C2D6E"/>
          <stop offset="85%"  stopColor="#D4622A"/>
          <stop offset="100%" stopColor="#F4944A"/>
        </linearGradient>
        {/* Water gradient */}
        <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3D1A6E" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#1A0A3B" stopOpacity="1"/>
        </linearGradient>
        {/* Sun/moon glow */}
        <radialGradient id="sunglow" cx="50%" cy="38%">
          <stop offset="0%"   stopColor="#FCD34D" stopOpacity="1"/>
          <stop offset="20%"  stopColor="#F59E0B" stopOpacity="0.8"/>
          <stop offset="60%"  stopColor="#D97706" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#7C2D6E"  stopOpacity="0"/>
        </radialGradient>
        {/* Lotus center */}
        <radialGradient id="lcenter" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="50%"  stopColor={GLD}/>
          <stop offset="100%" stopColor={GLD} stopOpacity="0"/>
        </radialGradient>
        {/* Petal gradient */}
        <linearGradient id="lpetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#EDE9FE" stopOpacity="0.96"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7"/>
        </linearGradient>
        {/* Person glow */}
        <radialGradient id="personglow" cx="50%" cy="60%">
          <stop offset="0%"   stopColor={GLD} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={GLD} stopOpacity="0"/>
        </radialGradient>
        {/* Water reflect mask */}
        <linearGradient id="watermask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id="wm"><rect x="0" y="410" width={W} height={H-410} fill="url(#watermask)"/></mask>
        {/* Lotus glow filter */}
        <filter id="lglow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18"/>
        </filter>
        <filter id="persblur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={W} height={H} fill="url(#sky)"/>

      {/* Sun/moon glow orb */}
      <ellipse cx={W/2} cy={H*0.38} rx={200} ry={180} fill="url(#sunglow)"/>
      <circle  cx={W/2} cy={H*0.38} r={38}   fill="#FCD34D" opacity="0.9"/>
      <circle  cx={W/2} cy={H*0.38} r={26}   fill="#FEF9C3"/>

      {/* Sun rays */}
      {Array.from({length:18},(_,i)=>{
        const a=i*20*Math.PI/180, len=60+Math.sin(i*2.1)*25;
        return <line key={i}
          x1={W/2+40*Math.cos(a)} y1={H*0.38+40*Math.sin(a)}
          x2={W/2+(40+len)*Math.cos(a)} y2={H*0.38+(40+len)*Math.sin(a)}
          stroke="#FCD34D" strokeWidth={i%3===0?1.6:0.8} opacity="0.35"/>;
      })}

      {/* Mountains back */}
      <path d={`M0,${H*0.58} L80,${H*0.36} L160,${H*0.48} L240,${H*0.3} L330,${H*0.44} L420,${H*0.28} L500,${H*0.42} L580,${H*0.32} L${W},${H*0.47} L${W},${H} L0,${H} Z`}
        fill="#2A1058" opacity="0.85"/>
      {/* Mountains front */}
      <path d={`M0,${H*0.66} L70,${H*0.5} L150,${H*0.62} L240,${H*0.46} L320,${H*0.58} L400,${H*0.44} L480,${H*0.57} L560,${H*0.48} L${W},${H*0.6} L${W},${H} L0,${H} Z`}
        fill="#1A0840" opacity="0.95"/>

      {/* Water surface */}
      <rect x="0" y={H*0.63} width={W} height={H-H*0.63} fill="url(#water)"/>
      {/* Water shimmer lines */}
      {[0.67,0.72,0.77,0.82,0.87,0.92].map((y,i)=>(
        <line key={i} x1={W*0.05} y1={H*y} x2={W*0.95} y2={H*y}
          stroke="rgba(167,139,250,0.1)" strokeWidth={0.8}/>
      ))}

      {/* Sacred geometry behind lotus */}
      <g opacity="0.13" stroke={LAV} strokeWidth="0.9" fill="none">
        {[60,100,140,180,220].map((r,i)=>(
          <circle key={i} cx={W/2} cy={H*0.45} r={r}
            strokeDasharray={i%2===1?'4 8':'none'}/>
        ))}
        {hex.map((p,i)=><line key={i} x1={p[0]} y1={p[1]} x2={hex[(i+3)%6][0]} y2={hex[(i+3)%6][1]}/>)}
        {hex.map((p,i)=><line key={`h${i}`} x1={p[0]} y1={p[1]} x2={hex[(i+1)%6][0]} y2={hex[(i+1)%6][1]}/>)}
        <polygon points={star.map(p=>p.join(',')).join(' ')}/>
      </g>

      {/* LOTUS — bottom center */}
      {(() => {
        const lx=W/2, ly=H*0.61;
        const outer=[0,45,90,135,180,225,270,315];
        const mid=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
        const inn=[0,60,120,180,240,300];
        return (
          <g filter="url(#lglow)">
            {outer.map((d,i)=>{
              const r=(d-90)*Math.PI/180;
              return <ellipse key={i} cx={lx+90*Math.cos(r)} cy={ly+90*Math.sin(r)}
                rx={16} ry={44} fill="url(#lpetal)" opacity="0.88"
                transform={`rotate(${d},${lx+90*Math.cos(r)},${ly+90*Math.sin(r)})`}/>;
            })}
            {mid.map((d,i)=>{
              const r=(d-90)*Math.PI/180;
              return <ellipse key={i} cx={lx+58*Math.cos(r)} cy={ly+58*Math.sin(r)}
                rx={12} ry={32} fill="#DDD6FE" opacity="0.9"
                transform={`rotate(${d},${lx+58*Math.cos(r)},${ly+58*Math.sin(r)})`}/>;
            })}
            {inn.map((d,i)=>{
              const r=(d-90)*Math.PI/180;
              return <ellipse key={i} cx={lx+32*Math.cos(r)} cy={ly+32*Math.sin(r)}
                rx={8} ry={18} fill="#F5F3FF" opacity="0.95"
                transform={`rotate(${d},${lx+32*Math.cos(r)},${ly+32*Math.sin(r)})`}/>;
            })}
            <circle cx={lx} cy={ly} r={36} fill="url(#lcenter)" filter="url(#lglow)"/>
            <circle cx={lx} cy={ly} r={14} fill={GLD}/>
            <circle cx={lx} cy={ly} r={8}  fill="#FEF9C3"/>
          </g>
        );
      })()}

      {/* Lotus water reflection */}
      <g transform={`translate(0,${2*H*0.61+16}) scale(1,-1)`} mask="url(#wm)" opacity="0.45">
        {[0,45,90,135,180,225,270,315].map((d,i)=>{
          const lx=W/2, ly=H*0.61;
          const r=(d-90)*Math.PI/180;
          return <ellipse key={i} cx={lx+90*Math.cos(r)} cy={ly+90*Math.sin(r)}
            rx={16} ry={44} fill="url(#lpetal)"
            transform={`rotate(${d},${lx+90*Math.cos(r)},${ly+90*Math.sin(r)})`}/>;
        })}
        <circle cx={W/2} cy={H*0.61} r={14} fill={GLD}/>
      </g>

      {/* Meditating woman silhouette */}
      <g filter="url(#persblur)" transform={`translate(${W/2-38},${H*0.4})`}>
        {/* Aura glow */}
        <ellipse cx="38" cy="100" rx="55" ry="80" fill="url(#personglow)"/>
        {/* Legs / lotus sit */}
        <ellipse cx="38" cy="165" rx="46" ry="16" fill="#0D0626" opacity="0.85"/>
        <ellipse cx="14" cy="160" rx="22" ry="12" fill="#110830" opacity="0.8"/>
        <ellipse cx="62" cy="160" rx="22" ry="12" fill="#110830" opacity="0.8"/>
        {/* Body */}
        <path d="M20,100 Q12,135 16,160 L60,160 Q64,135 56,100 Z" fill="#0F0628" opacity="0.88"/>
        {/* Head */}
        <ellipse cx="38" cy="82" rx="18" ry="20" fill="#0F0628" opacity="0.88"/>
        {/* Hair bun */}
        <circle cx="38" cy="64" r="8" fill="#0D0626" opacity="0.8"/>
        {/* Arms */}
        <path d="M20,115 Q4,138 18,155" stroke="#0F0628" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8"/>
        <path d="M56,115 Q72,138 58,155" stroke="#0F0628" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8"/>
        {/* Hands in lap */}
        <ellipse cx="25" cy="150" rx="8" ry="5" fill="#0F0628" opacity="0.75"/>
        <ellipse cx="51" cy="150" rx="8" ry="5" fill="#0F0628" opacity="0.75"/>
        {/* Third eye glow */}
        <circle cx="38" cy="78" r="3" fill={GLD} opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* Floating particles */}
      {floats.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.5">
          <animate attributeName="cy" values={`${p.y};${p.y-16};${p.y}`} dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${p.dur*0.9}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [earlyForm, setEarlyForm] = useState({ challenge:'', name:'', email:'' });
  const [earlySubmitted, setEarlySubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    [['sc-pjs','https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'],
     ['sc-pfair','https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'],
    ].forEach(([id,href])=>{
      if(!document.getElementById(id)){
        const l=document.createElement('link');
        l.id=id; l.rel='stylesheet'; l.href=href;
        document.head.appendChild(l);
      }
    });
    const onScroll=()=>setScrolled(window.scrollY>40);
    window.addEventListener('scroll',onScroll);
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  const F  = "'Plus Jakarta Sans',Inter,-apple-system,sans-serif";
  const SF = '"Playfair Display",Georgia,serif';

  const handleEarlySubmit = (e) => {
    e.preventDefault();
    if(earlyForm.email && earlyForm.name) setEarlySubmitted(true);
  };

  return (
    <div style={{fontFamily:F,background:'#F8F5FF',color:DARK,overflowX:'hidden'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,-12px)}}
        .fade-up{animation:fadeUp 0.9s ease both;}
        .float{animation:floatY 8s ease-in-out infinite;}
        .btn-primary{
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 30px;border-radius:16px;font-size:15px;font-weight:700;
          background:linear-gradient(135deg,${P},#5B3CE8);
          color:#fff;border:none;cursor:pointer;text-decoration:none;
          box-shadow:0 6px 24px rgba(109,74,255,0.42);
          transition:all 0.22s ease;font-family:inherit;
        }
        .btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(109,74,255,0.54);}
        .btn-ghost{
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 30px;border-radius:16px;font-size:15px;font-weight:700;
          background:rgba(255,255,255,0.14);
          color:#fff;border:1.5px solid rgba(255,255,255,0.35);
          cursor:pointer;text-decoration:none;
          backdrop-filter:blur(8px);
          transition:all 0.22s ease;font-family:inherit;
        }
        .btn-ghost:hover{background:rgba(255,255,255,0.24);transform:translateY(-2px);}
        .struggle-card{
          background:#fff;border-radius:20px;padding:28px 16px;
          border:1.5px solid rgba(109,74,255,0.08);
          box-shadow:0 4px 20px rgba(109,74,255,0.06);
          text-align:center;cursor:default;
          transition:all 0.25s ease;
        }
        .struggle-card:hover{
          transform:translateY(-6px);
          box-shadow:0 16px 40px rgba(109,74,255,0.16);
          border-color:rgba(109,74,255,0.28);
        }
        .help-card{
          background:#fff;border-radius:20px;padding:28px 22px;
          border:1.5px solid rgba(109,74,255,0.08);
          box-shadow:0 4px 20px rgba(109,74,255,0.06);
          transition:all 0.22s ease;
        }
        .help-card:hover{transform:translateY(-5px);box-shadow:0 16px 44px rgba(109,74,255,0.14);}
        .nav-link{
          color:rgba(255,255,255,0.78);font-size:14px;font-weight:500;
          text-decoration:none;padding:7px 14px;border-radius:8px;
          transition:all 0.18s;
        }
        .nav-link:hover{color:#fff;background:rgba(255,255,255,0.1);}
        .nav-link-dark{
          color:#4B5563;font-size:14px;font-weight:500;
          text-decoration:none;padding:7px 14px;border-radius:8px;
          transition:all 0.18s;
        }
        .nav-link-dark:hover{color:${P};background:rgba(109,74,255,0.06);}
        select,input{
          width:100%;padding:14px 16px;border-radius:14px;
          border:1.5px solid rgba(255,255,255,0.25);
          background:rgba(255,255,255,0.12);
          color:#fff;font-size:14px;font-family:inherit;
          outline:none;transition:border 0.2s;
          backdrop-filter:blur(8px);
        }
        select:focus,input:focus{border-color:rgba(255,255,255,0.6);}
        select option{background:#2D1060;color:#fff;}
        input::placeholder{color:rgba(255,255,255,0.55);}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-illus{height:380px!important;order:-1;}
          .hero-text{text-align:center;align-items:center!important;}
          .hero-pills{justify-content:center!important;}
          .hero-btns{justify-content:center!important;}
          .two-col{grid-template-columns:1fr!important;}
          .struggle-grid{grid-template-columns:1fr 1fr!important;}
          .help-grid{grid-template-columns:1fr 1fr!important;}
          .steps-row{flex-direction:column!important;gap:24px!important;}
          .step-arrow{transform:rotate(90deg)!important;}
          .vision-grid{grid-template-columns:1fr!important;}
          .trust-row{flex-wrap:wrap!important;gap:20px!important;}
          .desktop-nav{display:none!important;}
          .desktop-btns{display:none!important;}
          .mob-ham{display:flex!important;}
          .hero-section{min-height:auto!important;padding-top:90px!important;padding-bottom:40px!important;}
          .nav-logo-sub{display:none!important;}
        }
        @media(max-width:560px){
          .struggle-grid{grid-template-columns:1fr 1fr!important;}
          .help-grid{grid-template-columns:1fr!important;}
          .trust-row{grid-template-columns:1fr 1fr!important;display:grid!important;}
        }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:300,height:68,
        background:scrolled?'rgba(18,11,46,0.97)':'transparent',
        backdropFilter:scrolled?'blur(20px)':'none',
        borderBottom:scrolled?'1px solid rgba(109,74,255,0.18)':'none',
        transition:'all 0.35s ease',
        display:'flex',alignItems:'center',
      }}>
        <div style={{maxWidth:1360,margin:'0 auto',width:'100%',padding:'0 clamp(16px,3vw,56px)',display:'flex',alignItems:'center',gap:0}}>
          {/* Logo */}
          <Link to="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0,marginRight:32}}>
            <div style={{width:42,height:42,borderRadius:14,background:`linear-gradient(135deg,${P},${LAV})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:`0 4px 16px rgba(109,74,255,0.45)`}}>🪷</div>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:'#fff',letterSpacing:'-0.02em',lineHeight:1}}>Soul<span style={{color:LAV}}>Connect</span></div>
              <div className="nav-logo-sub" style={{fontSize:9,color:LAV,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',marginTop:1}}>Heal · Connect · Grow</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{display:'flex',alignItems:'center',gap:2,flex:1,justifyContent:'center'}}>
            {NAV_LINKS.map(l=>(
              <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="desktop-btns" style={{display:'flex',alignItems:'center',gap:10,marginLeft:'auto'}}>
            <Link to="/login" style={{padding:'9px 20px',borderRadius:12,fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.85)',textDecoration:'none',border:'1.5px solid rgba(255,255,255,0.22)',background:'transparent',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}
            >Login</Link>
            <Link to="/signup" className="btn-primary" style={{padding:'9px 22px',fontSize:14}}>Find My Circle 💜</Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={()=>setMenuOpen(v=>!v)} className="mob-ham" style={{display:'none',marginLeft:'auto',width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.1)',border:'none',cursor:'pointer',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4.5}}>
            {[0,1,2].map(i=><span key={i} style={{width:19,height:2,background:'#fff',borderRadius:2,display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:299,background:'rgba(18,11,46,0.95)',backdropFilter:'blur(12px)'}} onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',top:68,left:0,right:0,padding:'20px 24px',borderBottom:`1px solid rgba(109,74,255,0.2)`}} onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=>(<a key={l.label} href={l.href} onClick={()=>setMenuOpen(false)} style={{display:'block',padding:'14px 0',fontSize:16,fontWeight:500,color:'rgba(255,255,255,0.8)',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{l.label}</a>))}
            <div style={{display:'flex',gap:12,marginTop:20}}>
              <Link to="/login" onClick={()=>setMenuOpen(false)} style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,fontSize:14,fontWeight:600,color:'#fff',textDecoration:'none',border:'1.5px solid rgba(255,255,255,0.22)'}}>Login</Link>
              <Link to="/signup" onClick={()=>setMenuOpen(false)} style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,fontSize:14,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`}}>Find My Circle</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══ SECTION 1 — HERO ════════════════════════════════════════════════════ */}
      <section id="hero" className="hero-section" style={{
        background:`linear-gradient(160deg,#0D0626 0%,#1C0845 40%,#2D1060 70%,#1A0840 100%)`,
        minHeight:850,
        paddingTop:'clamp(80px,10vw,110px)',
        paddingBottom:'clamp(48px,6vw,80px)',
        paddingLeft:'clamp(16px,4vw,72px)',
        paddingRight:'clamp(16px,4vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        {/* Background orbs */}
        <div style={{position:'absolute',top:'-10%',right:'5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.2) 0%,transparent 70%)',pointerEvents:'none',animation:'orb 12s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'-5%',left:'10%',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div className="hero-grid" style={{maxWidth:1360,margin:'0 auto',display:'grid',gridTemplateColumns:'52fr 48fr',gap:'clamp(24px,4vw,72px)',alignItems:'center',position:'relative',zIndex:1}}>

          {/* LEFT — Text */}
          <div className="hero-text fade-up" style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(109,74,255,0.22)',border:'1px solid rgba(167,139,250,0.35)',borderRadius:20,padding:'6px 16px',marginBottom:24}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:GLD,display:'inline-block',animation:'pulse 2s ease-in-out infinite'}}/>
              <span style={{color:LAV,fontSize:12,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Now Live · Join Our Community</span>
            </div>

            <h1 style={{fontFamily:SF,fontSize:'clamp(2.8rem,4.6vw,5.2rem)',fontWeight:800,color:'#fff',lineHeight:1.06,letterSpacing:'-0.03em',marginBottom:20}}>
              You Don't Have To<br/>
              <span style={{background:`linear-gradient(135deg,#C4B5FD,${PNK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Go Through It</span>
              <br/>Alone.
            </h1>

            <p style={{fontSize:'clamp(15px,1.6vw,18px)',color:'rgba(255,255,255,0.65)',lineHeight:1.82,marginBottom:28,maxWidth:490}}>
              SoulConnect is a safe space to share, connect, and heal with people who truly understand what you're going through.
            </p>

            {/* Feature pills */}
            <div className="hero-pills" style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:36}}>
              {['✓ Real Connections','✓ Safe Community','✓ Emotional Support'].map((t,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',borderRadius:99,padding:'8px 16px'}}>
                  <span style={{color:GLD,fontWeight:800,fontSize:13}}>{t.slice(0,1)}</span>
                  <span style={{color:'rgba(255,255,255,0.82)',fontSize:13,fontWeight:500}}>{t.slice(2)}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="hero-btns" style={{display:'flex',flexWrap:'wrap',gap:14}}>
              <Link to="/signup" className="btn-primary">Find My Circle 💜</Link>
              <a href="#how" className="btn-ghost">
                <span style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>▶</span>
                Learn More
              </a>
            </div>
          </div>

          {/* RIGHT — Cinematic illustration */}
          <div className="hero-illus float" style={{height:'clamp(420px,54vw,700px)',position:'relative'}}>
            <HeroIllustration/>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — WHAT ARE YOU STRUGGLING WITH ════════════════════════════ */}
      <section id="struggling" style={{background:'#fff',padding:'clamp(64px,8vw,100px) clamp(16px,3vw,72px)'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(1.8rem,2.8vw,2.8rem)',fontWeight:800,color:DARK,letterSpacing:'-0.025em',marginBottom:14}}>
              What are you struggling with?
            </h2>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${P},${LAV})`,borderRadius:99,margin:'0 auto 18px'}}/>
            <p style={{fontSize:16,color:P,fontWeight:600}}>You are not alone. Thousands of people are on a similar journey.</p>
          </div>

          <div className="struggle-grid" style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:16}}>
            {[
              {emoji:'😰',label:'Anxiety &\nOverthinking', glow:'rgba(139,92,246,0.18)', color:'#7C3AED'},
              {emoji:'💔',label:'Heartbreak',              glow:'rgba(236,72,153,0.18)',  color:'#DB2777'},
              {emoji:'🌧',label:'Loneliness',              glow:'rgba(59,130,246,0.18)',  color:'#2563EB'},
              {emoji:'🕯',label:'Grief',                   glow:'rgba(245,184,65,0.2)',   color:'#D97706'},
              {emoji:'🔥',label:'Burnout',                 glow:'rgba(249,115,22,0.18)',  color:'#EA580C'},
              {emoji:'🌱',label:'Life\nTransitions',       glow:'rgba(52,195,143,0.18)',  color:'#059669'},
            ].map((c,i)=>(
              <div key={i} className="struggle-card">
                <div style={{width:72,height:72,borderRadius:22,background:`radial-gradient(circle,${c.glow},transparent 70%)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,margin:'0 auto 14px',boxShadow:`0 0 20px ${c.glow}`}}>{c.emoji}</div>
                <div style={{fontSize:14,fontWeight:700,color:DARK,lineHeight:1.4,whiteSpace:'pre-line'}}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — HEALING STARTS WITH CONNECTION ══════════════════════════ */}
      <section id="how" style={{background:'#F8F5FF',padding:'clamp(64px,8vw,100px) clamp(16px,3vw,72px)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(1.8rem,2.8vw,2.8rem)',fontWeight:800,color:DARK,letterSpacing:'-0.025em',marginBottom:12}}>
              Healing Starts With Connection
            </h2>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${P},${LAV})`,borderRadius:99,margin:'0 auto'}}/>
          </div>

          <div className="steps-row" style={{display:'flex',alignItems:'flex-start',gap:0,justifyContent:'center'}}>
            {[
              {n:'1',icon:'✍️',title:'Share Your Journey',   desc:'Express what you\'re going through in a safe space.'},
              {n:'2',icon:'👥',title:'Find Similar People',  desc:'We match you with people who understand.'},
              {n:'3',icon:'🫂',title:'Join Support Circles', desc:'Join meaningful conversations and support groups.'},
              {n:'4',icon:'🌱',title:'Grow Together',        desc:'Heal, learn, and grow together as a community.'},
            ].map((s,i,arr)=>(
              <React.Fragment key={i}>
                <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'0 8px'}}>
                  <div style={{position:'relative',marginBottom:20}}>
                    <div style={{width:84,height:84,borderRadius:'50%',background:'#fff',border:`2px solid rgba(109,74,255,0.14)`,boxShadow:'0 6px 24px rgba(109,74,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,position:'relative'}}>
                      {s.icon}
                    </div>
                    <div style={{position:'absolute',top:-6,right:-6,width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${P},#5B3CE8)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',boxShadow:`0 3px 10px rgba(109,74,255,0.45)`}}>{s.n}</div>
                  </div>
                  <h3 style={{fontSize:15,fontWeight:800,color:DARK,marginBottom:7,lineHeight:1.3}}>{s.title}</h3>
                  <p style={{fontSize:13,color:'#6B7280',lineHeight:1.65,maxWidth:160}}>{s.desc}</p>
                </div>
                {i<arr.length-1&&(
                  <div className="step-arrow" style={{display:'flex',alignItems:'center',paddingTop:32,flexShrink:0,color:LAV}}>
                    <svg width="44" height="16" viewBox="0 0 44 16" fill="none">
                      <path d="M2 8 Q12 2 22 8 Q32 14 42 8" stroke={LAV} strokeWidth="1.8" strokeDasharray="3 3" fill="none"/>
                      <path d="M36 4 L42 8 L36 12" stroke={LAV} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — OUR VISION (dark card) ══════════════════════════════════ */}
      <section id="vision" style={{background:'#F8F5FF',padding:'0 clamp(16px,3vw,72px) clamp(64px,8vw,100px)'}}>
        <div style={{
          maxWidth:1200,margin:'0 auto',
          background:`linear-gradient(140deg,#1A0840 0%,#2D1060 50%,#1A0840 100%)`,
          borderRadius:28,padding:'clamp(36px,5vw,64px)',
          position:'relative',overflow:'hidden',
        }}>
          {/* Lotus watermark */}
          <div style={{position:'absolute',right:'5%',top:'50%',transform:'translateY(-50%)',opacity:0.055,pointerEvents:'none',animation:'floatY 14s ease-in-out infinite'}}>
            <svg viewBox="0 0 240 240" width="280" height="280">
              {[0,45,90,135,180,225,270,315].map((a,i)=>{
                const r=(a-90)*Math.PI/180;
                return <ellipse key={i} cx={120+78*Math.cos(r)} cy={120+78*Math.sin(r)} rx={16} ry={42} fill="#A78BFA" transform={`rotate(${a},${120+78*Math.cos(r)},${120+78*Math.sin(r)})`}/>;
              })}
              <circle cx="120" cy="120" r="16" fill={GLD}/>
            </svg>
          </div>
          {/* Glow orb */}
          <div style={{position:'absolute',top:'50%',left:'30%',transform:'translate(-50%,-50%)',width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.2) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div className="vision-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center',position:'relative',zIndex:1}}>
            {/* LEFT */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:LAV,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:16}}>OUR VISION</div>
              <h2 style={{fontFamily:SF,fontSize:'clamp(1.8rem,2.8vw,3rem)',fontWeight:800,color:'#fff',lineHeight:1.15,letterSpacing:'-0.025em',marginBottom:18}}>
                A world where nobody<br/>
                <span style={{background:`linear-gradient(135deg,${LAV},${PNK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>struggles alone.</span>
              </h2>
              <p style={{fontSize:16,color:'rgba(255,255,255,0.58)',lineHeight:1.82}}>
                We believe healing happens faster when we feel understood, supported, and connected. SoulConnect is built to make that possible for everyone.
              </p>
            </div>

            {/* RIGHT — icons */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              {[
                {icon:'🤝',label:'Real Connections',     sub:'Genuine peer-to-peer support'},
                {icon:'🛡',label:'Safe & Supportive',   sub:'Moderated with care'},
                {icon:'🔒',label:'Your Privacy Matters', sub:'Private and secure always'},
                {icon:'🌱',label:'Healing & Growth',     sub:'Grow through connection'},
              ].map((f,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.06)',backdropFilter:'blur(12px)',border:'1px solid rgba(167,139,250,0.18)',borderRadius:18,padding:'20px 16px',textAlign:'center',transition:'all 0.22s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,74,255,0.18)';e.currentTarget.style.borderColor='rgba(167,139,250,0.38)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.borderColor='rgba(167,139,250,0.18)';}}
                >
                  <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:5}}>{f.label}</div>
                  <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',lineHeight:1.5}}>{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — HOW SOULCONNECT HELPS YOU ═══════════════════════════════ */}
      <section style={{background:'#fff',padding:'clamp(64px,8vw,100px) clamp(16px,3vw,72px)'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <h2 style={{fontFamily:SF,fontSize:'clamp(1.8rem,2.8vw,2.8rem)',fontWeight:800,color:DARK,letterSpacing:'-0.025em',marginBottom:12}}>
              How SoulConnect Helps You
            </h2>
            <div style={{width:48,height:3,background:`linear-gradient(90deg,${P},${LAV})`,borderRadius:99,margin:'0 auto'}}/>
          </div>

          <div className="help-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {icon:'👥',title:'Community Matching',  desc:'Find people who truly understand. Connect with others who share your experiences and challenges.',         gradient:'rgba(109,74,255,0.08)'},
              {icon:'🫂',title:'Support Circles',     desc:'Join guided conversations and safe support groups built around shared understanding.',                   gradient:'rgba(236,72,153,0.07)'},
              {icon:'📝',title:'Healing Journal',     desc:'Reflect, release, and understand yourself through guided journaling prompts and mood tracking.',         gradient:'rgba(52,195,143,0.07)'},
              {icon:'📊',title:'Mood Tracking',       desc:'Track your mood and emotional patterns over time to understand your mental wellness journey.',            gradient:'rgba(245,184,65,0.08)'},
              {icon:'🎯',title:'Guided Challenges',   desc:'Build healthy habits step by step through community challenges designed for emotional growth.',           gradient:'rgba(59,130,246,0.07)'},
              {icon:'🙏',title:'Wellness Guides',     desc:'Learn from trusted wellness experts, coaches, and practitioners in a safe, moderated environment.',      gradient:'rgba(167,139,250,0.08)'},
            ].map((c,i)=>(
              <div key={i} className="help-card">
                <div style={{width:58,height:58,borderRadius:18,background:`linear-gradient(135deg,${c.gradient.replace(/[\d.]+\)$/,'0.22)')},${c.gradient})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,marginBottom:16}}>
                  {c.icon}
                </div>
                <h3 style={{fontSize:16,fontWeight:800,color:DARK,marginBottom:8}}>{c.title}</h3>
                <p style={{fontSize:13,color:'#6B7280',lineHeight:1.68,marginBottom:14}}>{c.desc}</p>
                {/* COMING SOON badge */}
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:`rgba(109,74,255,0.09)`,border:`1.5px solid rgba(109,74,255,0.22)`,borderRadius:99,padding:'5px 12px'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:P,display:'inline-block',animation:'pulse 2s ease-in-out infinite'}}/>
                  <span style={{fontSize:11,fontWeight:700,color:P,letterSpacing:'0.08em'}}>COMING SOON</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — EARLY ACCESS ════════════════════════════════════════════ */}
      <section id="early" style={{
        background:`linear-gradient(140deg,#1A0840 0%,#2D1060 50%,#4C1D95 100%)`,
        padding:'clamp(64px,8vw,100px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        {/* Background particles */}
        {Array.from({length:14},(_,i)=>(
          <div key={i} style={{position:'absolute',left:`${5+(i*7.3)%88}%`,top:`${5+(i*11.7)%85}%`,width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:'50%',background:[LAV,GLD,PNK][i%3],opacity:0.3,animation:`floatY ${6+(i%4)*1.4}s ease-in-out ${i*0.5}s infinite`,pointerEvents:'none'}}/>
        ))}
        {/* Community sunset illustration — right bg */}
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'38%',overflow:'hidden',opacity:0.22,pointerEvents:'none'}}>
          <svg viewBox="0 0 340 400" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMaxYMid slice">
            <defs>
              <radialGradient id="csun" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#7C2D6E" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="340" height="400" fill="#1A0840"/>
            <ellipse cx="170" cy="160" rx="120" ry="100" fill="url(#csun)"/>
            <path d="M0,280 L60,220 L120,250 L180,200 L240,235 L300,210 L340,240 L340,400 L0,400Z" fill="#0D0626"/>
            {[[170,230],[110,268],[230,268],[70,310],[270,310],[140,330],[200,330]].map((p,i)=>(
              <g key={i}>
                <circle cx={p[0]} cy={p[1]-10} r={9} fill={[GLD,LAV,PNK,GLD,LAV,PNK,GLD][i]} opacity="0.8"/>
                <ellipse cx={p[0]} cy={p[1]+8} rx={7} ry={14} fill={[GLD,LAV,PNK,GLD,LAV,PNK,GLD][i]} opacity="0.6"/>
              </g>
            ))}
          </svg>
        </div>

        <div className="two-col" style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'55fr 45fr',gap:64,alignItems:'center',position:'relative',zIndex:1}}>
          {/* LEFT */}
          <div>
            <div style={{fontSize:11,fontWeight:700,color:GLD,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:16}}>JOIN OUR EARLY COMMUNITY</div>
            <h2 style={{fontFamily:SF,fontSize:'clamp(2rem,3.2vw,3.4rem)',fontWeight:800,color:'#fff',lineHeight:1.12,letterSpacing:'-0.028em',marginBottom:20}}>
              Find Your Circle.<br/>
              <span style={{background:`linear-gradient(135deg,${LAV},${PNK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>We'll walk with you.</span>
              {' '}<span style={{color:PNK}}>♡</span>
            </h2>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.58)',lineHeight:1.82,maxWidth:420}}>
              Tell us what you're going through so we can connect you with the right people and resources.
            </p>
          </div>

          {/* RIGHT — Form */}
          <div style={{background:'rgba(255,255,255,0.07)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:24,padding:'clamp(24px,3vw,36px)'}}>
            {earlySubmitted ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:52,marginBottom:16}}>💜</div>
                <h3 style={{fontFamily:SF,fontSize:22,fontWeight:800,color:'#fff',marginBottom:10}}>You're on the list!</h3>
                <p style={{color:'rgba(255,255,255,0.58)',fontSize:15,lineHeight:1.7}}>We'll reach out when your circle is ready. Healing begins soon.</p>
              </div>
            ) : (
              <form onSubmit={handleEarlySubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
                <label style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.7)',marginBottom:-6}}>What are you struggling with most?</label>
                <div style={{position:'relative'}}>
                  <select value={earlyForm.challenge} onChange={e=>setEarlyForm(f=>({...f,challenge:e.target.value}))} style={{appearance:'none',WebkitAppearance:'none',paddingRight:38}}>
                    <option value="">Select your main challenge</option>
                    {['Anxiety','Overthinking','Loneliness','Breakup','Burnout','Grief','Life Transition'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                  <span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.5)',pointerEvents:'none',fontSize:12}}>▼</span>
                </div>
                <input type="text" placeholder="Your Name" value={earlyForm.name} onChange={e=>setEarlyForm(f=>({...f,name:e.target.value}))} required/>
                <input type="email" placeholder="Email Address" value={earlyForm.email} onChange={e=>setEarlyForm(f=>({...f,email:e.target.value}))} required/>
                <button type="submit" style={{marginTop:4,padding:'15px',borderRadius:14,background:`linear-gradient(135deg,${P},#5B3CE8)`,color:'#fff',border:'none',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',boxShadow:`0 6px 24px rgba(109,74,255,0.45)`,transition:'all 0.22s'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 36px rgba(109,74,255,0.56)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 24px rgba(109,74,255,0.45)';}}
                >
                  Join Early Access →
                </button>
                <p style={{textAlign:'center',fontSize:12,color:'rgba(255,255,255,0.35)',margin:0}}>🔒 We respect your privacy. No spam ever.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ SECTION 7 — TRUST STRIP ══════════════════════════════════════════════ */}
      <section id="trust" style={{background:'#fff',borderTop:'1px solid rgba(109,74,255,0.08)',borderBottom:'1px solid rgba(109,74,255,0.08)',padding:'clamp(20px,3vw,28px) clamp(16px,3vw,64px)'}}>
        <div className="trust-row" style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',gap:'clamp(24px,4vw,52px)',flexWrap:'wrap'}}>
          {[
            {icon:'🛡',title:'Safe Community',       sub:'Moderated with care and compassion.'},
            {icon:'🔒',title:'Privacy Protected',     sub:'Your data is private and secure.'},
            {icon:'🚨',title:'Crisis Resources',      sub:'Help is always available.'},
            {icon:'📋',title:'Community Guidelines',  sub:'Respect, kindness & inclusion always.'},
            {icon:'⚖️',title:'Wellness Standards',    sub:'Evidence-based and trusted.'},
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
              <div style={{width:38,height:38,borderRadius:12,background:'rgba(109,74,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{t.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:DARK}}>{t.title}</div>
                <div style={{fontSize:11,color:'#9CA3AF',lineHeight:1.4}}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 8 — FINAL CTA ════════════════════════════════════════════════ */}
      <section id="cta" style={{
        background:`linear-gradient(160deg,#0D0626 0%,#1C0845 50%,#0D0626 100%)`,
        padding:'clamp(72px,9vw,120px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        {/* Lotus watermark */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',opacity:0.04,pointerEvents:'none',animation:'floatY 16s ease-in-out infinite'}}>
          <svg viewBox="0 0 300 300" width="460" height="460">
            {[0,45,90,135,180,225,270,315].map((a,i)=>{
              const r=(a-90)*Math.PI/180;
              return <ellipse key={i} cx={150+100*Math.cos(r)} cy={150+100*Math.sin(r)} rx={20} ry={56} fill={LAV} transform={`rotate(${a},${150+100*Math.cos(r)},${150+100*Math.sin(r)})`}/>;
            })}
            <circle cx="150" cy="150" r="22" fill={GLD}/>
          </svg>
        </div>
        {/* Glow orb */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.15) 0%,transparent 70%)',pointerEvents:'none'}}/>
        {/* Particles */}
        {Array.from({length:18},(_,i)=>(
          <div key={i} style={{position:'absolute',left:`${4+(i*5.9)%90}%`,top:`${4+(i*8.1)%90}%`,width:i%3===0?3:2,height:i%3===0?3:2,borderRadius:'50%',background:[LAV,GLD,PNK][i%3],opacity:0.25,animation:`floatY ${5+(i%5)*1.2}s ease-in-out ${i*0.45}s infinite`,pointerEvents:'none'}}/>
        ))}

        <div style={{maxWidth:680,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{fontSize:56,marginBottom:20,filter:'drop-shadow(0 0 20px rgba(167,139,250,0.4))'}}>🪷</div>
          <h2 style={{fontFamily:SF,fontSize:'clamp(2.4rem,4.5vw,4.8rem)',fontWeight:800,color:'#fff',lineHeight:1.06,letterSpacing:'-0.03em',marginBottom:18}}>
            You Are{' '}
            <span style={{background:`linear-gradient(135deg,${LAV},${PNK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Not Alone.</span>
            {' '}💜
          </h2>
          <p style={{fontSize:18,color:'rgba(255,255,255,0.58)',lineHeight:1.82,maxWidth:520,margin:'0 auto 44px'}}>
            Join a community built around connection, support, healing, and personal growth.
          </p>
          <Link to="/signup" className="btn-primary" style={{fontSize:17,padding:'17px 44px',borderRadius:18,margin:'0 auto'}}>
            Find My Circle 💜
          </Link>
          <p style={{marginTop:18,fontSize:13,color:'rgba(255,255,255,0.28)'}}>Because healing happens together.</p>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
