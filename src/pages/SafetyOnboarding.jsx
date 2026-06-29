import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const POLICY_VERSION = '1.0';
const STORAGE_KEY = 'sc_safety_ack';

const STYLES = `
@keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
@keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes orb1     { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.97)} }
@keyframes orb2     { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,20px) scale(1.08)} }
`;

function ProgressDots({ current, total }) {
  return (
    <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:28 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          height: i === current ? 8 : 6,
          width:  i === current ? 28 : 6,
          borderRadius: 99,
          background: i <= current
            ? 'linear-gradient(90deg,#6D4AFF,#A78BFA)'
            : 'rgba(167,139,250,0.2)',
          transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: i === current ? '0 0 10px rgba(109,74,255,0.4)' : 'none',
        }} />
      ))}
    </div>
  );
}

function LotusIcon({ size = 48 }) {
  return (
    <svg viewBox="0 0 64 64" style={{ width:size, height:size }} aria-hidden="true">
      <ellipse cx="32" cy="36" rx="8" ry="14" fill="none" stroke="#A78BFA" strokeWidth="2" />
      <ellipse cx="32" cy="36" rx="8" ry="14" fill="none" stroke="#A78BFA" strokeWidth="2" transform="rotate(45,32,36)" />
      <ellipse cx="32" cy="36" rx="8" ry="14" fill="none" stroke="#A78BFA" strokeWidth="2" transform="rotate(-45,32,36)" />
      <ellipse cx="32" cy="36" rx="8" ry="14" fill="none" stroke="#A78BFA" strokeWidth="2" transform="rotate(90,32,36)" />
      <circle cx="32" cy="34" r="7" fill="#F5B841" opacity="0.9" />
      <circle cx="32" cy="34" r="4" fill="#FFD77A" />
    </svg>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 24,
      padding: '32px 28px',
      boxShadow: '0 8px 40px rgba(109,74,255,0.12), 0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid rgba(167,139,250,0.2)',
      animation: 'fadeUp 0.45s cubic-bezier(0.34,1.1,0.64,1) both',
      ...style,
    }}>{children}</div>
  );
}

function Btn({ children, onClick, disabled, variant='primary', style={} }) {
  const base = {
    border:'none', borderRadius:99, padding:'15px 32px',
    fontSize:16, fontWeight:700, cursor: disabled ? 'not-allowed' : 'pointer',
    width:'100%', transition:'all 0.2s ease',
    opacity: disabled ? 0.45 : 1,
    ...style,
  };
  if (variant==='primary') return (
    <button onClick={onClick} disabled={disabled} style={{
      ...base,
      background: disabled ? '#E5E7EB' : 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
      color: disabled ? '#9CA3AF' : '#fff',
      boxShadow: disabled ? 'none' : '0 6px 24px rgba(109,74,255,0.35)',
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform='translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
    >{children}</button>
  );
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...base,
      background: 'rgba(109,74,255,0.07)',
      color: '#6D4AFF',
    }}>{children}</button>
  );
}

// ── STEP 1: Welcome ────────────────────────────────────────────────────────
function Step1({ onNext }) {
  return (
    <div style={{ textAlign:'center', animation:'fadeUp 0.5s ease both' }}>
      <div style={{ marginBottom:20, animation:'float 4s ease-in-out infinite' }}>
        <LotusIcon size={72} />
      </div>

      {/* Healing circle illustration */}
      <div style={{
        width:120, height:120, borderRadius:'50%', margin:'0 auto 24px',
        background:'linear-gradient(135deg,rgba(109,74,255,0.12),rgba(167,139,250,0.08))',
        border:'2px solid rgba(167,139,250,0.25)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:52,
        position:'relative',
      }}>
        🫂
        {/* orbiting dots */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:'absolute',
            width:8, height:8, borderRadius:'50%',
            background:`hsl(${260+i*20},70%,65%)`,
            top: `${50 - 48*Math.cos(i*Math.PI*2/5)}%`,
            left: `${50 + 48*Math.sin(i*Math.PI*2/5)}%`,
            transform:'translate(-50%,-50%)',
            opacity:0.6,
          }} />
        ))}
      </div>

      <h1 style={{ fontSize:28, fontWeight:800, color:'#1e1b4b', margin:'0 0 10px', lineHeight:1.2 }}>
        Welcome to SoulConnect 💜
      </h1>
      <p style={{ color:'#6B7280', fontSize:16, lineHeight:1.75, margin:'0 0 10px', maxWidth:380, marginLeft:'auto', marginRight:'auto' }}>
        A place for connection, support, growth, and healing.
      </p>
      <p style={{ color:'#9CA3AF', fontSize:14, lineHeight:1.75, margin:'0 0 28px', maxWidth:380, marginLeft:'auto', marginRight:'auto' }}>
        SoulConnect helps people connect with others who understand their experiences through peer support, wellness circles, guided conversations, journaling, and access to independent wellness professionals.
      </p>

      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8, marginBottom:28 }}>
        {['💫 Peer Support','🫂 Circles','🧘 Guides','📔 Journaling','🌱 Healing'].map(t => (
          <span key={t} style={{
            background:'rgba(109,74,255,0.08)', color:'#6D4AFF',
            borderRadius:99, padding:'6px 14px', fontSize:13, fontWeight:600,
          }}>{t}</span>
        ))}
      </div>

      <Btn onClick={onNext}>Continue →</Btn>
    </div>
  );
}

// ── STEP 2: Safety Information ─────────────────────────────────────────────
function Step2({ onNext }) {
  return (
    <div style={{ animation:'fadeUp 0.45s ease both' }}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>⚠️</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>Please Read Before Continuing</h2>
        <p style={{ color:'#9CA3AF', fontSize:14, margin:0 }}>This takes just a moment and keeps our community safe.</p>
      </div>

      {/* What we are */}
      <div style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', borderRadius:16, padding:'18px 20px', marginBottom:12, border:'1.5px solid #BBF7D0' }}>
        <p style={{ margin:'0 0 10px', fontWeight:700, color:'#065F46', fontSize:14 }}>✅ SoulConnect IS:</p>
        {['A peer-support community for healing & connection','Wellness circles and group support spaces','Journaling and mindfulness tools','Access to independent wellness guides'].map((t,i) => (
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:14, color:'#374151', marginBottom:6, lineHeight:1.5 }}>
            <span style={{ color:'#059669', fontWeight:700, flexShrink:0 }}>✓</span>{t}
          </div>
        ))}
      </div>

      {/* What we are NOT — amber warning */}
      <div style={{ background:'linear-gradient(135deg,#FFFBEB,#FEF3C7)', borderRadius:16, padding:'18px 20px', marginBottom:20, border:'2px solid #F59E0B' }}>
        <p style={{ margin:'0 0 10px', fontWeight:700, color:'#92400E', fontSize:14 }}>🚫 SoulConnect is NOT:</p>
        {[
          'An emergency service or crisis hotline',
          'A hospital or medical facility',
          'A psychiatric or mental health treatment provider',
          'A substitute for professional medical or mental health care',
        ].map((t,i) => (
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:14, color:'#374151', marginBottom:6, lineHeight:1.5 }}>
            <span style={{ color:'#EF4444', fontWeight:700, flexShrink:0 }}>✕</span>{t}
          </div>
        ))}
        <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(245,158,11,0.12)', borderRadius:10, border:'1px solid rgba(245,158,11,0.3)' }}>
          <p style={{ margin:0, color:'#92400E', fontSize:12, fontWeight:600, lineHeight:1.5 }}>
            For medical, psychiatric, or emergency situations, please seek qualified professional support.
          </p>
        </div>
      </div>

      <Btn onClick={onNext}>I Understand →</Btn>
    </div>
  );
}

// ── STEP 3: Crisis Support Notice ─────────────────────────────────────────
function Step3({ onNext, onViewCrisis }) {
  return (
    <div style={{ animation:'fadeUp 0.45s ease both' }}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🆘</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>If You Need Immediate Help</h2>
        <p style={{ color:'#9CA3AF', fontSize:14, margin:0 }}>Your safety is our highest priority.</p>
      </div>

      <div style={{ background:'linear-gradient(135deg,#FEF2F2,#FFF7ED)', borderRadius:16, padding:'20px', marginBottom:16, border:'2px solid #FCA5A5' }}>
        <p style={{ color:'#7F1D1D', fontSize:15, lineHeight:1.75, margin:'0 0 14px', fontWeight:500 }}>
          If you are thinking about harming yourself, harming someone else, or are in immediate danger — please contact emergency services or a crisis support provider immediately.
        </p>
        <p style={{ color:'#9CA3AF', fontSize:13, lineHeight:1.6, margin:0 }}>
          SoulConnect community members, guides, hosts, and wellness practitioners are <strong style={{ color:'#6B7280' }}>not emergency responders</strong>. Emergency situations must always be directed to professional services.
        </p>
      </div>

      {/* 3 big resource tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:20 }}>
        {[
          { icon:'🛟', label:'Crisis Support', sub:'Helplines & resources', color:'#7C3AED', bg:'#F5F3FF', action: onViewCrisis },
          { icon:'🚑', label:'Emergency Services', sub:'Call 112 / 911 / 999', color:'#DC2626', bg:'#FEF2F2', action: () => window.open('tel:112') },
          { icon:'🩺', label:'Professional Help', sub:'Therapists & doctors', color:'#0891B2', bg:'#E0F2FE', action: null },
        ].map((t,i) => (
          <button key={i} onClick={t.action || undefined} style={{
            background:t.bg, border:`1.5px solid ${t.color}30`,
            borderRadius:14, padding:'14px 10px', cursor: t.action ? 'pointer' : 'default',
            textAlign:'center', transition:'transform 0.2s',
          }}
          onMouseEnter={e => { if(t.action) e.currentTarget.style.transform='scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
          >
            <div style={{ fontSize:24, marginBottom:4 }}>{t.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:t.color, lineHeight:1.3 }}>{t.label}</div>
            <div style={{ fontSize:10, color:'#9CA3AF', marginTop:2, lineHeight:1.3 }}>{t.sub}</div>
          </button>
        ))}
      </div>

      <Btn onClick={onNext}>Continue →</Btn>
    </div>
  );
}

// ── STEP 4: Community Values ───────────────────────────────────────────────
function Step4({ onNext }) {
  const values = [
    { icon:'💜', name:'Compassion', desc:'Treat everyone with kindness and empathy, especially on their hardest days.' },
    { icon:'🤝', name:'Respect', desc:'Honour different experiences, backgrounds, and healing journeys.' },
    { icon:'🔒', name:'Privacy', desc:"What's shared in the community stays within the community." },
    { icon:'🌱', name:'Growth', desc:"Support each other's journey with encouragement and presence." },
    { icon:'🚫', name:'No Harm', desc:'Harassment, abuse, threats, and encouraging self-harm are strictly prohibited.' },
  ];

  return (
    <div style={{ animation:'fadeUp 0.45s ease both' }}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🌸</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>Our Community Values</h2>
        <p style={{ color:'#9CA3AF', fontSize:14, margin:0 }}>These principles guide every interaction on SoulConnect.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {values.map((v,i) => (
          <div key={i} style={{
            display:'flex', alignItems:'flex-start', gap:14,
            background: v.name==='No Harm' ? 'linear-gradient(135deg,#FEF2F2,#FFF7ED)' : 'linear-gradient(135deg,rgba(109,74,255,0.04),rgba(167,139,250,0.04))',
            border: `1.5px solid ${v.name==='No Harm' ? '#FCA5A5' : 'rgba(167,139,250,0.2)'}`,
            borderRadius:14, padding:'14px 16px',
            animation:`fadeUp 0.4s ease both`,
            animationDelay:`${i*60}ms`,
          }}>
            <div style={{
              width:40, height:40, borderRadius:12, flexShrink:0,
              background: v.name==='No Harm' ? '#FEE2E2' : 'rgba(109,74,255,0.08)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
            }}>{v.icon}</div>
            <div>
              <div style={{ fontWeight:700, color: v.name==='No Harm' ? '#991B1B' : '#1e1b4b', fontSize:15, marginBottom:3 }}>{v.name}</div>
              <div style={{ color:'#6B7280', fontSize:13, lineHeight:1.5 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Btn onClick={onNext}>Continue →</Btn>
    </div>
  );
}

// ── STEP 5: Guide Disclaimer ───────────────────────────────────────────────
function Step5({ onNext }) {
  return (
    <div style={{ animation:'fadeUp 0.45s ease both' }}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🧘</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>Working With Guides & Healers</h2>
        <p style={{ color:'#9CA3AF', fontSize:14, margin:0 }}>Understanding what they can and can't help with.</p>
      </div>

      <p style={{ color:'#6B7280', fontSize:14, lineHeight:1.7, marginBottom:16 }}>
        Guides, coaches, healers, facilitators, and wellness practitioners on SoulConnect are <strong style={{ color:'#1e1b4b' }}>independent practitioners</strong> — not employees or agents of SoulConnect.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        {/* Can Help */}
        <div style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', borderRadius:16, padding:'16px', border:'1.5px solid #BBF7D0' }}>
          <p style={{ margin:'0 0 10px', fontWeight:700, color:'#065F46', fontSize:13 }}>✅ Can Help With</p>
          {['Wellness coaching','Meditation & breathwork','Emotional support','Stress management','Spiritual guidance'].map((t,i) => (
            <div key={i} style={{ display:'flex', gap:6, fontSize:12, color:'#374151', marginBottom:5, lineHeight:1.5 }}>
              <span style={{ color:'#059669', fontWeight:700, flexShrink:0 }}>✓</span>{t}
            </div>
          ))}
        </div>
        {/* Cannot Help */}
        <div style={{ background:'linear-gradient(135deg,#FEF2F2,#FFF7ED)', borderRadius:16, padding:'16px', border:'1.5px solid #FCA5A5' }}>
          <p style={{ margin:'0 0 10px', fontWeight:700, color:'#991B1B', fontSize:13 }}>🚫 Cannot Help With</p>
          {['Emergency intervention','Suicide crisis response','Medical diagnosis','Psychiatric treatment','Medication advice'].map((t,i) => (
            <div key={i} style={{ display:'flex', gap:6, fontSize:12, color:'#374151', marginBottom:5, lineHeight:1.5 }}>
              <span style={{ color:'#EF4444', fontWeight:700, flexShrink:0 }}>✕</span>{t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'linear-gradient(135deg,#EDE9FE,#F5F3FF)', borderRadius:12, padding:'12px 16px', marginBottom:20, border:'1px solid #C4B5FD' }}>
        <p style={{ margin:0, color:'#4C1D95', fontSize:13, fontWeight:600, lineHeight:1.5 }}>
          💜 Guides genuinely care about your wellbeing. If you are in crisis, they will direct you to emergency services and crisis resources.
        </p>
      </div>

      <Btn onClick={onNext}>I Understand →</Btn>
    </div>
  );
}

// ── STEP 6: Final Acknowledgement ─────────────────────────────────────────
function Step6({ onComplete }) {
  const [checks, setChecks] = useState([false,false,false,false,false]);
  const allChecked = checks.every(Boolean);

  const toggle = i => setChecks(c => c.map((v,idx) => idx===i ? !v : v));

  const items = [
    'I understand that SoulConnect is a peer-support and wellness platform.',
    'I understand SoulConnect is not a substitute for emergency, medical, psychiatric, or crisis services.',
    'I agree to follow the Community Guidelines and treat others with respect.',
    'I understand that guides and healers are independent practitioners and are not emergency responders.',
    'I have read the Safety Policy and understand the boundaries of this platform.',
  ];

  return (
    <div style={{ animation:'fadeUp 0.45s ease both' }}>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>✍️</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>One Last Step</h2>
        <p style={{ color:'#9CA3AF', fontSize:14, margin:0 }}>Please confirm the following before entering the community.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
        {items.map((item, i) => (
          <label key={i} onClick={() => toggle(i)} style={{
            display:'flex', alignItems:'flex-start', gap:14, cursor:'pointer',
            background: checks[i] ? 'linear-gradient(135deg,rgba(109,74,255,0.06),rgba(167,139,250,0.04))' : '#fff',
            border:`1.5px solid ${checks[i] ? '#8B5CF6' : '#E5E7EB'}`,
            borderRadius:14, padding:'14px 16px',
            transition:'all 0.2s ease',
          }}>
            <div style={{
              width:22, height:22, borderRadius:7, flexShrink:0, marginTop:1,
              background: checks[i] ? 'linear-gradient(135deg,#6D4AFF,#8B5CF6)' : '#F3F4F6',
              border:`2px solid ${checks[i] ? '#6D4AFF' : '#D1D5DB'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s ease',
              boxShadow: checks[i] ? '0 0 12px rgba(109,74,255,0.3)' : 'none',
            }}>
              {checks[i] && <span style={{ color:'#fff', fontSize:13, fontWeight:900 }}>✓</span>}
            </div>
            <span style={{ fontSize:14, color: checks[i] ? '#1e1b4b' : '#6B7280', lineHeight:1.5, fontWeight: checks[i] ? 600 : 400 }}>
              {item}
            </span>
          </label>
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:12, color:'#9CA3AF' }}>Acknowledgements</span>
          <span style={{ fontSize:12, color:'#6D4AFF', fontWeight:700 }}>{checks.filter(Boolean).length} / {checks.length}</span>
        </div>
        <div style={{ height:4, borderRadius:99, background:'#E5E7EB', overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:99,
            width:`${(checks.filter(Boolean).length/checks.length)*100}%`,
            background:'linear-gradient(90deg,#6D4AFF,#A78BFA)',
            transition:'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Signature section */}
      <div style={{ background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)', borderRadius:14, padding:'14px 16px', marginBottom:20, border:'1px solid #C4B5FD' }}>
        <p style={{ margin:0, color:'#4C1D95', fontSize:12, lineHeight:1.6, textAlign:'center' }}>
          By continuing, you acknowledge and agree to the SoulConnect{' '}
          <strong>Safety Policy</strong>, <strong>Community Guidelines</strong>,{' '}
          <strong>Privacy Policy</strong>, and <strong>Terms of Service</strong>.
        </p>
      </div>

      <Btn onClick={onComplete} disabled={!allChecked}>
        {allChecked ? '💜 Accept & Enter SoulConnect' : `Please check all ${checks.length} boxes to continue`}
      </Btn>

      {!allChecked && (
        <p style={{ textAlign:'center', color:'#9CA3AF', fontSize:12, marginTop:8 }}>
          {checks.filter(Boolean).length} of {checks.length} acknowledged
        </p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SafetyOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState(0); // force re-animation on step change
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const TOTAL_STEPS = 6;

  const goNext = () => {
    setStep(s => s + 1);
    setKey(k => k + 1);
  };

  const handleComplete = () => {
    const ack = {
      accepted_at: new Date().toISOString(),
      user_id: user?.id || 'anonymous',
      policy_version: POLICY_VERSION,
      agreement_version: POLICY_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ack));
    onComplete?.();
  };

  const steps = [
    <Step1 key={key} onNext={goNext} />,
    <Step2 key={key} onNext={goNext} />,
    <Step3 key={key} onNext={goNext} onViewCrisis={() => window.open('/crisis-support','_blank')} />,
    <Step4 key={key} onNext={goNext} />,
    <Step5 key={key} onNext={goNext} />,
    <Step6 key={key} onComplete={handleComplete} />,
  ];

  return (
    <div style={{
      minHeight:'100vh', minWidth:'100vw',
      position:'fixed', inset:0, zIndex:99999,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Inter',sans-serif",
      overflow:'hidden',
    }}>
      <style>{STYLES}</style>

      {/* Animated background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#EDE9FE 0%,#F5F3FF 40%,#EFF6FF 80%,#F0FDF4 100%)' }} />
      <div style={{ position:'absolute', top:'-15%', left:'-10%', width:'55%', height:'55%', borderRadius:'50%', background:'radial-gradient(circle,rgba(109,74,255,0.15),transparent 70%)', animation:'orb1 12s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-15%', right:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,0.12),transparent 70%)', animation:'orb2 15s ease-in-out infinite', pointerEvents:'none' }} />

      {/* Sacred geometry decoration */}
      <div style={{ position:'absolute', top:30, right:30, opacity:0.06, pointerEvents:'none' }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke="#6D4AFF" strokeWidth="1"/>
          <circle cx="90" cy="90" r="60" fill="none" stroke="#6D4AFF" strokeWidth="1"/>
          <circle cx="90" cy="90" r="40" fill="none" stroke="#6D4AFF" strokeWidth="1"/>
          {[0,1,2,3,4,5].map(i => (
            <line key={i}
              x1={90 + 80*Math.cos(i*Math.PI/3)} y1={90 + 80*Math.sin(i*Math.PI/3)}
              x2={90 + 80*Math.cos((i+3)*Math.PI/3)} y2={90 + 80*Math.sin((i+3)*Math.PI/3)}
              stroke="#6D4AFF" strokeWidth="1"
            />
          ))}
        </svg>
      </div>
      <div style={{ position:'absolute', bottom:30, left:30, opacity:0.05, pointerEvents:'none' }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <polygon points="70,10 130,110 10,110" fill="none" stroke="#A78BFA" strokeWidth="1"/>
          <polygon points="70,130 10,30 130,30" fill="none" stroke="#A78BFA" strokeWidth="1"/>
        </svg>
      </div>

      {/* Content panel */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:480, padding:'24px 20px', maxHeight:'100vh', overflowY:'auto' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
          <img src="/logo-icon.svg" alt="SoulConnect" style={{ width:34, height:34, borderRadius:10, boxShadow:'0 4px 14px rgba(109,74,255,0.35)', display:'block' }} />
          <span style={{ fontSize:16, fontWeight:800, color:'#1e1b4b' }}>Soul<span style={{ color:'#6D4AFF' }}>Connect</span></span>
        </div>

        <ProgressDots current={step} total={TOTAL_STEPS} />

        <Card>
          {steps[step]}
        </Card>

        {/* Skip / crisis link at bottom */}
        <div style={{ textAlign:'center', marginTop:14 }}>
          <button onClick={() => window.open('/crisis-support','_blank')} style={{
            background:'none', border:'none', color:'rgba(109,74,255,0.5)',
            fontSize:12, cursor:'pointer',
          }}>🆘 Need immediate help?</button>
        </div>
      </div>
    </div>
  );
}

// ── Hook: check if acknowledgement is needed ───────────────────────────────
export function useNeedsOnboarding() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  try {
    const ack = JSON.parse(raw);
    if (ack.policy_version !== POLICY_VERSION) return true;
    // Re-acknowledge every 12 months
    const acceptedAt = new Date(ack.accepted_at);
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (Date.now() - acceptedAt.getTime() > oneYear) return true;
    return false;
  } catch {
    return true;
  }
}
