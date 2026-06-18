import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const P    = '#6D4AFF';
const LAV  = '#A78BFA';
const GOLD = '#F5B841';
const PINK = '#F472B6';
const GRN  = '#34C38F';

const NAV_LINKS = ['Community', 'Circles', 'Challenges', 'Events', 'Resources', 'About'];

// ── Premium Lotus with sacred geometry, light rays, water reflection ──────────
function PremiumLotusHero() {
  const cx = 280, cy = 255;
  const outerAngles  = [0,45,90,135,180,225,270,315];
  const middleAngles = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const innerAngles  = [0,60,120,180,240,300];
  const rayAngles    = Array.from({length:16},(_,i)=>i*22.5);
  const particles    = Array.from({length:26},(_,i)=>({
    x: 30 + (i*43+i*i*11)%500,
    y: 20 + (i*59+i*i*7)%520,
    r: 1+(i%4)*0.65,
    dur: 3+(i%5)*1.1,
    del: i*0.38,
    col:[LAV,GOLD,PINK,'#C4B5FD','#FDE68A'][i%5],
  }));

  return (
    <svg viewBox="0 0 560 580" style={{width:'100%',height:'100%'}} aria-hidden="true">
      <defs>
        <radialGradient id="lh-halo" cx="50%" cy="46%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.4"/>
          <stop offset="55%"  stopColor="#4C1D95" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#0D0820"  stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="lh-petal-o" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C4B5FD" stopOpacity="0.92"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.65"/>
        </linearGradient>
        <linearGradient id="lh-petal-m" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#DDD6FE"/>
          <stop offset="100%" stopColor="#A78BFA"/>
        </linearGradient>
        <radialGradient id="lh-center" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#FEF9C3"/>
          <stop offset="40%"  stopColor={GOLD}/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="lh-ray" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#A78BFA" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="lh-reflect-mask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id="lh-mask">
          <rect x="0" y="0" width="560" height="580" fill="url(#lh-reflect-mask)"/>
        </mask>
        <filter id="lh-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lh-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Deep ambient halo */}
      <ellipse cx={cx} cy={cy} rx={280} ry={240} fill="url(#lh-halo)"/>

      {/* Sacred geometry: flower of life */}
      {[45,85,125,170,215].map((r,i)=>(
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke="rgba(167,139,250,0.07)"
          strokeWidth={0.9} strokeDasharray={i%2===1?'3 7':'none'}/>
      ))}
      {[0,60,120,180,240,300].map((deg,i)=>{
        const r=(deg)*Math.PI/180;
        return <circle key={i} cx={cx+88*Math.cos(r)} cy={cy+88*Math.sin(r)} r={88}
          fill="none" stroke="rgba(167,139,250,0.045)" strokeWidth={0.7}/>;
      })}

      {/* Light rays */}
      {rayAngles.map((deg,i)=>{
        const r2=deg*Math.PI/180;
        const len = i%4===0?250:i%2===0?200:160;
        return <line key={i}
          x1={cx} y1={cy}
          x2={cx+len*Math.cos(r2)} y2={cy+len*Math.sin(r2)}
          stroke="rgba(167,139,250,0.065)"
          strokeWidth={i%4===0?1.2:0.7}/>;
      })}

      {/* Outer 8 petals */}
      {outerAngles.map((deg,i)=>{
        const rad=(deg-90)*Math.PI/180;
        const px=cx+112*Math.cos(rad), py=cy+112*Math.sin(rad);
        return <ellipse key={i} cx={px} cy={py} rx={21} ry={54}
          fill="url(#lh-petal-o)"
          transform={`rotate(${deg},${px},${py})`}
          filter="url(#lh-soft)"/>;
      })}

      {/* Middle 8 petals */}
      {middleAngles.map((deg,i)=>{
        const rad=(deg-90)*Math.PI/180;
        const px=cx+72*Math.cos(rad), py=cy+72*Math.sin(rad);
        return <ellipse key={i} cx={px} cy={py} rx={15} ry={38}
          fill="url(#lh-petal-m)" opacity={0.88}
          transform={`rotate(${deg},${px},${py})`}/>;
      })}

      {/* Inner 6 petals */}
      {innerAngles.map((deg,i)=>{
        const rad=(deg-90)*Math.PI/180;
        const px=cx+42*Math.cos(rad), py=cy+42*Math.sin(rad);
        return <ellipse key={i} cx={px} cy={py} rx={10} ry={23}
          fill="#EDE9FE" opacity={0.95}
          transform={`rotate(${deg},${px},${py})`}/>;
      })}

      {/* Center glow + dot */}
      <circle cx={cx} cy={cy} r={48} fill="url(#lh-center)" filter="url(#lh-glow)"/>
      <circle cx={cx} cy={cy} r={18} fill={GOLD}/>
      <circle cx={cx} cy={cy} r={10} fill="#FEF9C3"/>

      {/* Water reflection */}
      <g transform={`translate(0,${2*cy+14}) scale(1,-1)`} mask="url(#lh-mask)">
        {outerAngles.map((deg,i)=>{
          const rad=(deg-90)*Math.PI/180;
          const px=cx+112*Math.cos(rad), py=cy+112*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx={21} ry={54}
            fill="url(#lh-petal-o)"
            transform={`rotate(${deg},${px},${py})`}/>;
        })}
        <circle cx={cx} cy={cy} r={18} fill={GOLD}/>
      </g>

      {/* Water ripples */}
      {[12,26,42,60].map((off,i)=>(
        <ellipse key={i} cx={cx} cy={cy*2+off/2+20}
          rx={55+off*2.2} ry={4+i*1.2}
          fill="none" stroke="rgba(167,139,250,0.1)" strokeWidth={0.7}/>
      ))}

      {/* Floating particles */}
      {particles.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.col} opacity="0.38">
          <animate attributeName="cy"
            values={`${p.y};${p.y-15};${p.y}`}
            dur={`${p.dur}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity"
            values="0.38;0.72;0.38"
            dur={`${p.dur*0.88}s`} begin={`${p.del}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

// ── Floating ambient particles for section backgrounds ────────────────────────
function AmbientParticles({ count=12, opacity=0.14 }) {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} style={{
          position:'absolute',
          left:`${5+(i*9.1)%88}%`,
          top:`${5+(i*13.7)%85}%`,
          width:i%3===0?3:2, height:i%3===0?3:2,
          borderRadius:'50%',
          background:[LAV,GOLD,PINK,'#C4B5FD'][i%4],
          opacity:opacity+(i%4)*0.04,
          animation:`floatY ${7+(i%5)*1.6}s ease-in-out ${i*0.5}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    [['sc-pjs','https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'],
     ['sc-pfair','https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'],
    ].forEach(([id,href])=>{
      if (!document.getElementById(id)) {
        const l=document.createElement('link');
        l.id=id; l.rel='stylesheet'; l.href=href;
        document.head.appendChild(l);
      }
    });
    const onScroll=()=>setScrolled(window.scrollY>60);
    window.addEventListener('scroll',onScroll);
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  const F  = "'Plus Jakarta Sans',Inter,-apple-system,sans-serif";
  const SF = '"Playfair Display",Georgia,serif';

  return (
    <div style={{fontFamily:F,background:'#0D0820',color:'#fff',overflowX:'hidden'}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes glowPulse{0%,100%{opacity:0.5}50%{opacity:1}}
        .fade-up{animation:fadeUp 0.95s ease both;}
        .float{animation:floatY 9s ease-in-out infinite;}
        .sc-btn-p{transition:transform 0.2s,box-shadow 0.2s;}
        .sc-btn-p:hover{transform:translateY(-3px);box-shadow:0 20px 48px rgba(109,74,255,0.58)!important;}
        .sc-btn-ghost{transition:all 0.2s;}
        .sc-btn-ghost:hover{transform:translateY(-2px);background:rgba(255,255,255,0.14)!important;}
        .sc-challenge:hover{transform:translateY(-5px) scale(1.04);border-color:rgba(167,139,250,0.4)!important;}
        .sc-journey-card:hover{background:rgba(109,74,255,0.14)!important;border-color:rgba(167,139,250,0.32)!important;}
        .sc-feature-row:hover{background:rgba(109,74,255,0.13)!important;border-color:rgba(167,139,250,0.3)!important;}
        .desktop-nav{display:flex!important;}
        .desktop-btns{display:flex!important;}
        .mob-ham{display:none!important;}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important;}
          .hero-lotus{height:360px!important;}
          .two-col{grid-template-columns:1fr!important;}
          .challenge-grid{grid-template-columns:1fr 1fr!important;}
          .desktop-nav{display:none!important;}
          .desktop-btns{display:none!important;}
          .mob-ham{display:flex!important;}
        }
        @media(max-width:560px){
          .challenge-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:200,height:72,
        background:scrolled?'rgba(13,8,32,0.96)':'transparent',
        backdropFilter:scrolled?'blur(24px)':'none',
        WebkitBackdropFilter:scrolled?'blur(24px)':'none',
        borderBottom:scrolled?'1px solid rgba(109,74,255,0.2)':'1px solid transparent',
        boxShadow:scrolled?'0 2px 32px rgba(109,74,255,0.14)':'none',
        transition:'all 0.4s ease',
        display:'flex',alignItems:'center',
      }}>
        <div style={{width:'100%',maxWidth:1400,margin:'0 auto',padding:'0 clamp(16px,3vw,64px)',display:'flex',alignItems:'center'}}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginRight:36,flexShrink:0}}>
            <div style={{width:40,height:40,borderRadius:13,background:`linear-gradient(135deg,${P},${LAV})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:`0 4px 16px rgba(109,74,255,0.45)`}}>🪷</div>
            <div>
              <div style={{fontSize:17,fontWeight:800,color:'#fff',letterSpacing:'-0.02em',lineHeight:1}}>Soul<span style={{color:LAV}}>Connect</span></div>
              <div style={{fontSize:9,color:LAV,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Heal · Connect · Grow</div>
            </div>
          </Link>

          <div className="desktop-nav" style={{alignItems:'center',gap:2,flex:1,justifyContent:'center'}}>
            {NAV_LINKS.map(l=>(
              <a key={l} href="#" style={{padding:'8px 15px',borderRadius:10,fontSize:14,fontWeight:500,color:'rgba(255,255,255,0.62)',textDecoration:'none',transition:'all 0.18s'}}
                onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.background='rgba(255,255,255,0.08)';}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.62)';e.currentTarget.style.background='transparent';}}
              >{l}</a>
            ))}
          </div>

          <div className="desktop-btns" style={{alignItems:'center',gap:10,marginLeft:'auto'}}>
            <Link to="/login" className="sc-btn-ghost" style={{padding:'10px 22px',borderRadius:12,fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.85)',textDecoration:'none',border:'1.5px solid rgba(167,139,250,0.32)',background:'transparent',transition:'all 0.2s'}}>Login</Link>
            <Link to="/signup" className="sc-btn-p" style={{padding:'10px 24px',borderRadius:12,fontSize:14,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`,boxShadow:'0 4px 18px rgba(109,74,255,0.44)'}}>Get Started</Link>
          </div>

          <button onClick={()=>setMenuOpen(v=>!v)} className="mob-ham" style={{marginLeft:'auto',width:42,height:42,borderRadius:11,background:'rgba(255,255,255,0.08)',border:'none',cursor:'pointer',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5}}>
            {[0,1,2].map(i=><span key={i} style={{width:20,height:2,background:'#fff',borderRadius:2,display:'block'}}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{position:'fixed',inset:0,zIndex:199,background:'rgba(13,8,32,0.92)',backdropFilter:'blur(8px)'}} onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',top:72,left:0,right:0,background:'#140A38',padding:'24px',borderBottom:'1px solid rgba(109,74,255,0.2)',fontFamily:F}} onClick={e=>e.stopPropagation()}>
            {NAV_LINKS.map(l=>(
              <a key={l} href="#" onClick={()=>setMenuOpen(false)} style={{display:'block',padding:'15px 0',fontSize:16,fontWeight:500,color:'rgba(255,255,255,0.8)',textDecoration:'none',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>{l}</a>
            ))}
            <div style={{display:'flex',gap:12,marginTop:20}}>
              <Link to="/login" onClick={()=>setMenuOpen(false)} style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,fontSize:14,fontWeight:600,color:'#fff',textDecoration:'none',border:'1.5px solid rgba(167,139,250,0.3)'}}>Login</Link>
              <Link to="/signup" onClick={()=>setMenuOpen(false)} style={{flex:1,textAlign:'center',padding:'13px',borderRadius:12,fontSize:14,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`}}>Create Account</Link>
            </div>
          </div>
        </div>
      )}

      {/* ══ SECTION 1 — OUR VISION (HERO) ══════════════════════════════════ */}
      <section style={{
        background:'linear-gradient(165deg,#0D0820 0%,#190A40 45%,#0D0820 100%)',
        paddingTop:'clamp(100px,10vw,144px)',
        paddingBottom:'clamp(80px,8vw,120px)',
        paddingLeft:'clamp(16px,3vw,72px)',
        paddingRight:'clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={20} opacity={0.18}/>
        <div style={{position:'absolute',top:'15%',right:'8%',width:560,height:560,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.16) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-8%',left:'4%',width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div className="hero-grid" style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'55fr 45fr',gap:60,alignItems:'center',position:'relative',zIndex:1}}>

          {/* LEFT */}
          <div className="fade-up">
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(109,74,255,0.16)',border:'1px solid rgba(167,139,250,0.32)',borderRadius:20,padding:'6px 16px',marginBottom:24}}>
              <span style={{color:LAV,fontSize:12}}>✦</span>
              <span style={{color:LAV,fontSize:12,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>Our Vision</span>
            </div>

            <h1 style={{fontFamily:SF,fontSize:'clamp(2.6rem,4.2vw,4.6rem)',fontWeight:800,color:'#fff',lineHeight:1.1,letterSpacing:'-0.03em',marginBottom:0}}>
              A world where nobody has to{' '}
              <span style={{background:`linear-gradient(135deg,${LAV},${PINK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>struggle alone.</span>
            </h1>

            <p style={{fontSize:17,color:'rgba(255,255,255,0.6)',lineHeight:1.84,marginTop:24,maxWidth:500}}>
              SoulConnect exists to help people find understanding, connection, and support through communities, wellness circles, guided reflection, and human connection.
            </p>

            <div style={{display:'flex',alignItems:'center',gap:12,marginTop:22,padding:'14px 20px',background:'rgba(109,74,255,0.13)',border:'1px solid rgba(167,139,250,0.22)',borderRadius:14,borderLeft:`3px solid ${LAV}`}}>
              <span style={{fontSize:18}}>💜</span>
              <p style={{color:LAV,fontWeight:600,fontSize:16,fontStyle:'italic',margin:0}}>Because healing shouldn't happen in isolation.</p>
            </div>

            <div style={{display:'flex',gap:12,marginTop:36,flexWrap:'wrap'}}>
              {[
                {emoji:'💜',label:'Heal',    sub:'Find support'},
                {emoji:'🤝',label:'Connect', sub:'Build meaningful relationships'},
                {emoji:'🌱',label:'Grow',    sub:'Become your best self'},
              ].map((c,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.05)',backdropFilter:'blur(12px)',borderRadius:16,padding:'16px 20px',border:'1px solid rgba(167,139,250,0.18)',display:'flex',alignItems:'center',gap:12,transition:'all 0.22s',cursor:'default'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(109,74,255,0.2)';e.currentTarget.style.borderColor='rgba(167,139,250,0.45)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(167,139,250,0.18)';}}
                >
                  <div style={{width:40,height:40,borderRadius:12,background:'rgba(109,74,255,0.28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{c.emoji}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{c.label}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.42)'}}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Premium Lotus */}
          <div className="hero-lotus float" style={{height:'clamp(460px,50vw,620px)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
            <PremiumLotusHero/>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — WHY WE STARTED ═════════════════════════════════════ */}
      <section style={{
        background:'linear-gradient(180deg,#0D0820 0%,#160A36 100%)',
        padding:'clamp(72px,8vw,112px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={10} opacity={0.1}/>
        <div style={{maxWidth:1400,margin:'0 auto',position:'relative',zIndex:1}}>

          <div style={{textAlign:'center',marginBottom:52}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(109,74,255,0.12)',border:'1px solid rgba(167,139,250,0.22)',borderRadius:20,padding:'6px 16px',marginBottom:20}}>
              <span style={{color:LAV,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Why We Started</span>
            </div>
            <h2 style={{fontFamily:SF,fontSize:'clamp(1.9rem,3vw,3rem)',fontWeight:800,color:'#fff',lineHeight:1.2,letterSpacing:'-0.025em',maxWidth:700,margin:'0 auto'}}>
              Millions of people experience challenges like these every day.
            </h2>
          </div>

          {/* Challenge cards */}
          <div className="challenge-grid" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginBottom:52}}>
            {[
              {emoji:'😰',label:'Anxiety',   color:'#8B5CF6',glow:'rgba(139,92,246,0.28)'},
              {emoji:'💔',label:'Heartbreak',color:'#EC4899',glow:'rgba(236,72,153,0.28)'},
              {emoji:'🌧',label:'Loneliness',color:'#60A5FA',glow:'rgba(96,165,250,0.28)'},
              {emoji:'🕯',label:'Grief',     color:GOLD,     glow:'rgba(245,184,65,0.28)'},
              {emoji:'🔥',label:'Burnout',   color:'#F97316',glow:'rgba(249,115,22,0.28)'},
            ].map((item,i)=>(
              <div key={i} className="sc-challenge" style={{
                background:'rgba(255,255,255,0.045)',
                backdropFilter:'blur(12px)',
                border:`1px solid rgba(255,255,255,0.08)`,
                borderRadius:22,padding:'28px 20px',
                textAlign:'center',
                transition:'all 0.25s',cursor:'default',
              }}>
                <div style={{width:68,height:68,borderRadius:22,background:`radial-gradient(circle,${item.glow},transparent 70%)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,margin:'0 auto 14px',boxShadow:`0 0 24px ${item.glow}`}}>{item.emoji}</div>
                <div style={{fontSize:15,fontWeight:700,color:'#fff'}}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{textAlign:'center',maxWidth:600,margin:'0 auto'}}>
            <p style={{fontFamily:SF,fontSize:'clamp(1.15rem,1.8vw,1.4rem)',fontWeight:700,color:'rgba(255,255,255,0.9)',fontStyle:'italic',marginBottom:12}}>
              Yet most suffer silently.
            </p>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.55)',lineHeight:1.82,marginBottom:40}}>
              We believe healing happens faster when people feel understood and supported.<br/>That's why we built SoulConnect.
            </p>
            <Link to="/signup" className="sc-btn-p" style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 38px',borderRadius:14,background:`linear-gradient(135deg,${P},#5B3CE8)`,color:'#fff',textDecoration:'none',fontSize:15,fontWeight:700,boxShadow:'0 8px 32px rgba(109,74,255,0.46)'}}>
              Find Your Circle →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — THE SOULCONNECT HEALING JOURNEY ════════════════════ */}
      <section style={{
        background:'linear-gradient(160deg,#0F0525 0%,#1E0B45 50%,#0F0525 100%)',
        padding:'clamp(72px,8vw,112px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={14} opacity={0.13}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div style={{maxWidth:860,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(109,74,255,0.12)',border:'1px solid rgba(167,139,250,0.22)',borderRadius:20,padding:'6px 16px',marginBottom:20}}>
              <span style={{color:LAV,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>The SoulConnect Healing Journey</span>
            </div>
            <h2 style={{fontFamily:SF,fontSize:'clamp(2rem,3.2vw,3.4rem)',fontWeight:800,color:'#fff',lineHeight:1.18,letterSpacing:'-0.025em',maxWidth:580,margin:'0 auto'}}>
              Your path from struggle to{' '}
              <span style={{background:`linear-gradient(135deg,${LAV},${PINK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>wholeness.</span>
            </h2>
          </div>

          {/* Vertical journey */}
          <div style={{position:'relative',paddingLeft:44}}>
            {/* Gradient line */}
            <div style={{position:'absolute',left:18,top:28,bottom:28,width:2,background:`linear-gradient(180deg,${GRN} 0%,${LAV} 28%,${GOLD} 56%,${PINK} 78%,'#FCD34D' 100%)`,borderRadius:2}}/>

            {[
              {emoji:'🌱',title:'Connection',  desc:'Find people who truly understand what you are going through. You are not as alone as you think.',                              color:GRN,   glow:'rgba(52,195,143,0.42)'},
              {emoji:'💜',title:'Community',   desc:'Join wellness circles and support groups built around shared experiences, compassion, and genuine understanding.',            color:LAV,   glow:'rgba(167,139,250,0.42)'},
              {emoji:'✨',title:'Healing',      desc:'Reflect through journaling, track your mood, and build healthier habits with gentle daily practices.',                      color:GOLD,  glow:'rgba(245,184,65,0.42)'},
              {emoji:'🦋',title:'Growth',      desc:'Develop emotional resilience, self-compassion, and the tools to navigate life\'s challenges with strength and clarity.',    color:PINK,  glow:'rgba(244,114,182,0.42)'},
              {emoji:'🌞',title:'Purpose',     desc:'Live with greater confidence, deeper meaning, and a renewed sense of who you are and what you are here for.',               color:'#FCD34D',glow:'rgba(252,211,77,0.42)'},
            ].map((step,i,arr)=>(
              <div key={i} className="sc-journey-step" style={{display:'flex',alignItems:'flex-start',gap:28,marginBottom:i<arr.length-1?40:0,position:'relative'}}>
                {/* Glowing dot */}
                <div style={{
                  position:'absolute',left:-30,top:16,
                  width:22,height:22,borderRadius:'50%',
                  background:`radial-gradient(circle,${step.color},${P})`,
                  boxShadow:`0 0 16px ${step.glow},0 0 32px ${step.glow}`,
                  zIndex:2,flexShrink:0,
                  transition:'all 0.3s',
                  animation:`glowPulse ${3+i*0.4}s ease-in-out ${i*0.5}s infinite`,
                }}/>

                {/* Card */}
                <div className="sc-journey-card" style={{
                  flex:1,
                  background:'rgba(255,255,255,0.045)',
                  backdropFilter:'blur(16px)',
                  border:'1px solid rgba(167,139,250,0.14)',
                  borderRadius:22,padding:'24px 28px',
                  transition:'all 0.25s',cursor:'default',
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:10}}>
                    <span style={{fontSize:28}}>{step.emoji}</span>
                    <h3 style={{fontFamily:SF,fontSize:'clamp(1.1rem,1.7vw,1.4rem)',fontWeight:800,color:'#fff',margin:0}}>{step.title}</h3>
                    <div style={{marginLeft:'auto',width:8,height:8,borderRadius:'50%',background:step.color,boxShadow:`0 0 8px ${step.glow}`,animation:`glowPulse ${2+i*0.3}s ease-in-out infinite`}}/>
                  </div>
                  <p style={{fontSize:15,color:'rgba(255,255,255,0.58)',lineHeight:1.78,margin:0}}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — DISCOVER SOULCONNECT ═══════════════════════════════ */}
      <section style={{
        background:'linear-gradient(135deg,#130830 0%,#1C0E44 50%,#130830 100%)',
        padding:'clamp(72px,8vw,112px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={16} opacity={0.11}/>
        <div style={{position:'absolute',top:'30%',right:'-5%',width:480,height:480,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,184,65,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'10%',left:'-5%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div className="two-col" style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'55fr 45fr',gap:72,alignItems:'center',position:'relative',zIndex:1}}>

          {/* LEFT */}
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(245,184,65,0.12)',border:'1px solid rgba(245,184,65,0.28)',borderRadius:20,padding:'6px 16px',marginBottom:24}}>
              <span style={{color:GOLD,fontSize:13}}>★</span>
              <span style={{color:GOLD,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Now Live</span>
            </div>

            <h2 style={{fontFamily:SF,fontSize:'clamp(1.9rem,3vw,3.4rem)',fontWeight:800,color:'#fff',lineHeight:1.15,letterSpacing:'-0.025em',marginBottom:18}}>
              Discover a Better Way<br/>
              <span style={{background:`linear-gradient(135deg,${LAV},${PINK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>To Heal</span>
            </h2>

            <p style={{fontSize:16,color:'rgba(255,255,255,0.58)',lineHeight:1.82,marginBottom:36}}>
              Whether you're facing anxiety, heartbreak, grief, loneliness, burnout, or life transitions, SoulConnect helps you connect with people who understand your journey.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:40}}>
              {[
                {icon:'✨',label:'Community Matching',     desc:'Find people who share your experiences'},
                {icon:'🌀',label:'Support Circles',         desc:'Join groups built around your challenges'},
                {icon:'📝',label:'Healing Journal',         desc:'Reflect and process with guided prompts'},
                {icon:'📊',label:'Mood Tracking',           desc:'Understand your emotional patterns'},
                {icon:'🎯',label:'Guided Challenges',       desc:'Build healthy habits step by step'},
                {icon:'🙏',label:'Trusted Wellness Guides', desc:'Connect with certified practitioners'},
              ].map((f,i)=>(
                <div key={i} className="sc-feature-row" style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(167,139,250,0.1)',borderRadius:14,transition:'all 0.2s'}}>
                  <div style={{width:38,height:38,borderRadius:11,background:'rgba(109,74,255,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{f.icon}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:'#fff'}}>{f.label}</div>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <Link to="/login" className="sc-btn-ghost" style={{padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,color:'#fff',textDecoration:'none',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.18)'}}>Login</Link>
              <Link to="/signup" className="sc-btn-p" style={{padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`,boxShadow:'0 8px 28px rgba(109,74,255,0.5)'}}>Create Account</Link>
            </div>
          </div>

          {/* RIGHT — Community illustration card */}
          <div style={{background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',border:'1px solid rgba(167,139,250,0.16)',borderRadius:28,padding:'36px 28px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-20%',right:'-10%',width:250,height:250,borderRadius:'50%',background:'radial-gradient(circle,rgba(245,184,65,0.09),transparent 70%)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',bottom:'-15%',left:'-10%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.14),transparent 70%)',pointerEvents:'none'}}/>

            {/* Sunrise + people SVG */}
            <svg viewBox="0 0 340 220" style={{width:'100%',marginBottom:28}} aria-hidden="true">
              <defs>
                <radialGradient id="sg" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="gg" cx="50%" cy="100%">
                  <stop offset="0%" stopColor={P} stopOpacity="0.22"/>
                  <stop offset="100%" stopColor={P} stopOpacity="0"/>
                </radialGradient>
              </defs>
              <ellipse cx="170" cy="65" rx="110" ry="65" fill="url(#sg)" opacity="0.55"/>
              <circle cx="170" cy="44" r="18" fill="#FCD34D" opacity="0.82"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((d,i)=>{
                const r=d*Math.PI/180;
                return <line key={i} x1={170+20*Math.cos(r)} y1={44+20*Math.sin(r)} x2={170+30*Math.cos(r)} y2={44+30*Math.sin(r)} stroke="#FCD34D" strokeWidth="1.8" opacity="0.45"/>;
              })}
              <ellipse cx="170" cy="200" rx="155" ry="28" fill="url(#gg)"/>
              {[
                {x:170,y:138,c:LAV},
                {x:112,y:158,c:PINK},
                {x:228,y:158,c:GOLD},
                {x:84, y:188,c:GRN},
                {x:256,y:188,c:'#60A5FA'},
                {x:143,y:198,c:PINK},
                {x:197,y:198,c:LAV},
              ].map((p,i)=>(
                <g key={i}>
                  <circle cx={p.x} cy={p.y-9} r={7.5} fill={p.c} opacity="0.82"/>
                  <ellipse cx={p.x} cy={p.y+6} rx={6} ry={12} fill={p.c} opacity="0.6"/>
                </g>
              ))}
              {[[170,138,112,158],[112,158,84,188],[84,188,143,198],[143,198,197,198],[197,198,256,188],[256,188,228,158],[228,158,170,138]].map((l,i)=>(
                <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="rgba(167,139,250,0.28)" strokeWidth="1.3" strokeDasharray="4 4"/>
              ))}
              <circle cx="170" cy="138" r="4" fill={GOLD} opacity="0.6"/>
            </svg>

            {/* Stats grid */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                {num:'2k+',   label:'Members',        icon:'👥'},
                {num:'50+',   label:'Active Circles',  icon:'🌀'},
                {num:'10k+',  label:'Messages Shared', icon:'💬'},
                {num:'100%',  label:'Peer Support',    icon:'💜'},
              ].map((s,i)=>(
                <div key={i} style={{background:'rgba(109,74,255,0.14)',border:'1px solid rgba(167,139,250,0.18)',borderRadius:14,padding:'14px 12px',textAlign:'center'}}>
                  <div style={{fontSize:19,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:18,fontWeight:800,color:'#fff'}}>{s.num}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.45)'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — START YOUR HEALING JOURNEY ═════════════════════════ */}
      <section style={{
        background:'linear-gradient(160deg,#0B0624 0%,#160A38 60%,#0B0624 100%)',
        padding:'clamp(72px,8vw,112px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={12} opacity={0.1}/>
        <div className="two-col" style={{maxWidth:1400,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:72,alignItems:'center',position:'relative',zIndex:1}}>

          {/* LEFT */}
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(109,74,255,0.12)',border:'1px solid rgba(167,139,250,0.22)',borderRadius:20,padding:'6px 16px',marginBottom:24}}>
              <span style={{color:LAV,fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase'}}>Get Started</span>
            </div>

            <h2 style={{fontFamily:SF,fontSize:'clamp(1.9rem,3vw,3.2rem)',fontWeight:800,color:'#fff',lineHeight:1.15,letterSpacing:'-0.025em',marginBottom:18}}>
              Start Your Healing{' '}
              <span style={{background:`linear-gradient(135deg,${GOLD},${PINK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Journey Today</span>
            </h2>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.58)',lineHeight:1.8,marginBottom:32}}>
              Join a growing community focused on connection, wellness, personal growth, and healing.
            </p>

            <div style={{marginBottom:38}}>
              {['Find Your Circle','Match With Like-Minded People','Join Healing Challenges','Track Your Progress','Reflect Through Journaling'].map((f,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'13px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:`linear-gradient(135deg,${GRN},#059669)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0,color:'#fff',fontWeight:700}}>✓</div>
                  <span style={{fontSize:15,color:'rgba(255,255,255,0.78)',fontWeight:500}}>{f}</span>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
              <Link to="/login" className="sc-btn-ghost" style={{padding:'14px 30px',borderRadius:12,fontSize:15,fontWeight:700,color:'#fff',textDecoration:'none',background:'rgba(255,255,255,0.08)',border:'1.5px solid rgba(255,255,255,0.18)'}}>Login</Link>
              <Link to="/signup" className="sc-btn-p" style={{padding:'14px 34px',borderRadius:12,fontSize:15,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`,boxShadow:'0 8px 28px rgba(109,74,255,0.5)'}}>Create Free Account</Link>
            </div>
          </div>

          {/* RIGHT — Glassmorphism device frame */}
          <div style={{background:'rgba(255,255,255,0.055)',backdropFilter:'blur(24px)',border:'1px solid rgba(167,139,250,0.18)',borderRadius:28,padding:'6px',boxShadow:'0 32px 80px rgba(0,0,0,0.42),inset 0 1px 0 rgba(255,255,255,0.1)',position:'relative'}}>
            {/* Notch bar */}
            <div style={{height:38,background:'rgba(11,6,36,0.85)',borderRadius:'22px 22px 0 0',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:56,height:5,background:'rgba(255,255,255,0.1)',borderRadius:3}}/>
            </div>
            {/* App screen */}
            <div style={{background:'linear-gradient(160deg,#0D0820 0%,#140A38 100%)',borderRadius:'0 0 22px 22px',padding:'20px 20px 18px'}}>
              {/* Header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.38)',marginBottom:2}}>Good morning</div>
                  <div style={{fontSize:15,fontWeight:700,color:'#fff'}}>Your Dashboard ✨</div>
                </div>
                <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${P},${LAV})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🪷</div>
              </div>

              {/* Mood row */}
              <div style={{background:'rgba(109,74,255,0.16)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:16,padding:'14px 16px',marginBottom:10}}>
                <div style={{fontSize:11,color:LAV,fontWeight:700,marginBottom:8,letterSpacing:'0.08em'}}>TODAY'S MOOD</div>
                <div style={{display:'flex',gap:8}}>
                  {['😌','😊','😔','😰','💪'].map((m,i)=>(
                    <div key={i} style={{width:34,height:34,borderRadius:10,background:i===0?'rgba(109,74,255,0.42)':'rgba(255,255,255,0.05)',border:i===0?`1.5px solid ${P}`:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>{m}</div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'14px 16px',marginBottom:10}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.45)',fontWeight:700,marginBottom:10,letterSpacing:'0.08em'}}>SOUL JOURNEY</div>
                {[{label:'Healing',pct:58,color:LAV},{label:'Growth',pct:35,color:GRN},{label:'Connection',pct:72,color:PINK}].map((b,i)=>(
                  <div key={i} style={{marginBottom:i<2?10:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:11,color:'rgba(255,255,255,0.55)'}}>{b.label}</span>
                      <span style={{fontSize:11,color:b.color,fontWeight:700}}>{b.pct}%</span>
                    </div>
                    <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:3}}>
                      <div style={{height:'100%',width:`${b.pct}%`,background:b.color,borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Circle */}
              <div style={{background:'rgba(245,184,65,0.09)',border:'1px solid rgba(245,184,65,0.2)',borderRadius:16,padding:'12px 16px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontSize:11,color:GOLD,fontWeight:700,marginBottom:3}}>YOUR CIRCLE</div>
                    <div style={{fontSize:13,color:'#fff',fontWeight:600}}>Anxiety Support</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.42)',marginTop:1}}>47 members · Active now</div>
                  </div>
                  <div style={{display:'flex'}}>
                    {[LAV,PINK,GRN,GOLD].map((c,i)=>(
                      <div key={i} style={{width:24,height:24,borderRadius:'50%',background:c,border:'2px solid #0D0820',marginLeft:i?-8:0,zIndex:4-i}}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6 — COMPACT TRUST STRIP ════════════════════════════════ */}
      <div style={{background:'rgba(109,74,255,0.07)',borderTop:'1px solid rgba(167,139,250,0.1)',borderBottom:'1px solid rgba(167,139,250,0.1)',padding:'20px clamp(16px,3vw,64px)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',flexWrap:'wrap',gap:'clamp(10px,2.5vw,36px)'}}>
          {[
            {icon:'🛡',text:'Safe Community'},
            {icon:'🔒',text:'Privacy Protected'},
            {icon:'🚨',text:'Crisis Resources Available'},
            {icon:'✓',text:'Moderated Circles',   green:true},
            {icon:'✓',text:'Community Guidelines', green:true},
            {icon:'✓',text:'Wellness Standards',   green:true},
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,color:'rgba(255,255,255,0.55)',fontSize:13,fontWeight:500}}>
              <span style={{fontSize:15,color:t.green?GRN:'inherit'}}>{t.icon}</span>
              <span>{t.text}</span>
              {i<5&&<span style={{color:'rgba(255,255,255,0.14)',marginLeft:2}}>·</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ══ SECTION 7 — FINAL CTA ═══════════════════════════════════════════ */}
      <section style={{
        background:'linear-gradient(160deg,#0A0520 0%,#180940 50%,#0A0520 100%)',
        padding:'clamp(80px,9vw,130px) clamp(16px,3vw,72px)',
        position:'relative',overflow:'hidden',
      }}>
        <AmbientParticles count={22} opacity={0.16}/>
        {/* Lotus watermark */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:580,height:580,opacity:0.035,pointerEvents:'none',animation:'floatY 14s ease-in-out infinite'}}>
          <svg viewBox="0 0 280 280" width="100%" height="100%">
            {[0,45,90,135,180,225,270,315].map((a,i)=>{
              const r=(a-90)*Math.PI/180;
              const px=140+85*Math.cos(r),py=140+85*Math.sin(r);
              return <ellipse key={i} cx={px} cy={py} rx={17} ry={46} fill="#A78BFA" transform={`rotate(${a},${px},${py})`}/>;
            })}
            <circle cx="140" cy="140" r="20" fill={GOLD}/>
          </svg>
        </div>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:800,height:800,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.16) 0%,transparent 70%)',pointerEvents:'none'}}/>

        <div style={{maxWidth:740,margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:9,background:'rgba(245,184,65,0.12)',border:'1px solid rgba(245,184,65,0.28)',borderRadius:20,padding:'7px 18px',marginBottom:28}}>
            <span style={{fontSize:18}}>🪷</span>
            <span style={{color:GOLD,fontSize:12,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}}>You Are Not Alone</span>
          </div>

          <h2 style={{fontFamily:SF,fontSize:'clamp(2.4rem,4.5vw,4.6rem)',fontWeight:800,color:'#fff',lineHeight:1.08,letterSpacing:'-0.03em',marginBottom:22}}>
            You Don't Have To Go<br/>
            <span style={{background:`linear-gradient(135deg,${LAV},${PINK})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Through It Alone.</span>
          </h2>

          <p style={{fontSize:18,color:'rgba(255,255,255,0.58)',lineHeight:1.82,maxWidth:540,margin:'0 auto 48px'}}>
            Join a community built around healing, connection, understanding, and personal growth.
          </p>

          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',marginBottom:28}}>
            <Link to="/login" className="sc-btn-ghost" style={{padding:'16px 42px',borderRadius:14,fontSize:16,fontWeight:700,color:'#fff',textDecoration:'none',background:'rgba(255,255,255,0.09)',border:'1.5px solid rgba(255,255,255,0.2)'}}>Login</Link>
            <Link to="/signup" className="sc-btn-p" style={{padding:'16px 46px',borderRadius:14,fontSize:16,fontWeight:700,color:'#fff',textDecoration:'none',background:`linear-gradient(135deg,${P},#5B3CE8)`,boxShadow:'0 12px 40px rgba(109,74,255,0.58)'}}>Create Account</Link>
          </div>

          <p style={{fontSize:13,color:'rgba(255,255,255,0.28)'}}>No credit card · No waitlist · Start healing today</p>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
