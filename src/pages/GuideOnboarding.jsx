import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const AGREEMENT_VERSION = '1.0';
const STORAGE_KEY = 'sc_guide_ack';

const STYLES = `
@keyframes goFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes goFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
@keyframes goPulse   { 0%,100%{opacity:0.4} 50%{opacity:0.75} }
@keyframes goOrb1    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-18px) scale(1.04)} }
@keyframes goOrb2    { 0%,100%{transform:translate(0,0) scale(1)} 60%{transform:translate(-22px,16px) scale(1.06)} }
@keyframes goShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes checkPop  { 0%{transform:scale(0)} 60%{transform:scale(1.25)} 100%{transform:scale(1)} }
@keyframes particleDrift {
  0%  {transform:translateY(0) translateX(0); opacity:0;}
  10% {opacity:0.55;}
  90% {opacity:0.2;}
  100%{transform:translateY(-100px) translateX(16px); opacity:0;}
}
.go-link-btn {
  background:none;border:none;cursor:pointer;padding:0;
  color:rgba(167,139,250,0.7);font-size:12px;text-decoration:underline;
  font-family:'Inter',sans-serif;transition:color 0.15s;
}
.go-link-btn:hover{color:#C4B5FD;}
`;

// ── Shared visual components ────────────────────────────────────────────────
function LotusIcon({ size = 44 }) {
  return (
    <svg viewBox="0 0 64 64" style={{ width:size, height:size }} aria-hidden="true">
      {[0,45,90,135].map(a => (
        <ellipse key={a} cx="32" cy="36" rx="8" ry="16" fill="none" stroke="#A78BFA" strokeWidth="1.8"
          transform={`rotate(${a},32,36)`} />
      ))}
      <circle cx="32" cy="34" r="8" fill="#F5B841" opacity="0.9"/>
      <circle cx="32" cy="34" r="5" fill="#FFD77A"/>
    </svg>
  );
}

function SacredBg() {
  const c = 140;
  return (
    <svg width={c} height={c} viewBox={`0 0 ${c} ${c}`} style={{ display:'block' }}>
      <g stroke="#A78BFA" strokeWidth="0.6" fill="none" opacity="0.08">
        {[58,42,26,12].map(r => <circle key={r} cx={c/2} cy={c/2} r={r}/>)}
        {[0,1,2,3,4,5].map(i => {
          const a = i*Math.PI/3, b = (i+3)*Math.PI/3;
          return <line key={i} x1={c/2+58*Math.cos(a)} y1={c/2+58*Math.sin(a)} x2={c/2+58*Math.cos(b)} y2={c/2+58*Math.sin(b)}/>;
        })}
      </g>
    </svg>
  );
}

function Particles({ n = 10 }) {
  return (
    <div style={{ position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none' }}>
      {Array.from({length:n}).map((_,i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${8+(i*9.3)%80}%`, bottom:`${(i*17)%55}%`,
          width:i%3===0?3:2, height:i%3===0?3:2, borderRadius:'50%',
          background:i%2===0?'#A78BFA':'#C4B5FD',
          animation:`particleDrift ${7+(i%5)*2.2}s ease-in-out ${i*0.6}s infinite`,opacity:0,
        }}/>
      ))}
    </div>
  );
}

function ProgressBar({ step, total }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ color:'rgba(196,181,253,0.7)', fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Step {step + 1} of {total}
        </span>
        <span style={{ color:'#A78BFA', fontSize:11, fontWeight:700 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height:4, borderRadius:99, background:'rgba(167,139,250,0.15)', overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:99,
          width:`${pct}%`,
          background:'linear-gradient(90deg,#6D4AFF,#A78BFA)',
          transition:'width 0.5s cubic-bezier(0.34,1.4,0.64,1)',
          boxShadow:'0 0 10px rgba(109,74,255,0.5)',
        }}/>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.06)',
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      borderRadius:24, padding:'32px 28px',
      border:'1px solid rgba(167,139,250,0.2)',
      boxShadow:'0 8px 48px rgba(0,0,0,0.3)',
      animation:'goFadeUp 0.4s cubic-bezier(0.34,1.1,0.64,1) both',
    }}>{children}</div>
  );
}

function Chip({ icon, text, type='allow' }) {
  const isAllow = type === 'allow';
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8,
      background: isAllow ? 'rgba(52,195,143,0.1)' : 'rgba(239,68,68,0.08)',
      border:`1px solid ${isAllow ? 'rgba(52,195,143,0.25)' : 'rgba(239,68,68,0.2)'}`,
      borderRadius:10, padding:'9px 14px',
    }}>
      <span style={{ color: isAllow ? '#34C38F' : '#EF4444', fontWeight:800, fontSize:14, flexShrink:0 }}>
        {isAllow ? '✓' : '✕'}
      </span>
      <span style={{ color:'rgba(255,255,255,0.75)', fontSize:13, lineHeight:1.4 }}>{text}</span>
    </div>
  );
}

function Checkbox({ checked, onChange, label, sublabel }) {
  return (
    <label onClick={onChange} style={{
      display:'flex', alignItems:'flex-start', gap:14, cursor:'pointer',
      background: checked ? 'rgba(109,74,255,0.12)' : 'rgba(255,255,255,0.04)',
      border:`1.5px solid ${checked ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius:14, padding:'14px 16px',
      transition:'all 0.2s ease', marginTop:8,
    }}>
      <div style={{
        width:22, height:22, borderRadius:7, flexShrink:0, marginTop:1,
        background: checked ? 'linear-gradient(135deg,#6D4AFF,#8B5CF6)' : 'rgba(255,255,255,0.06)',
        border:`2px solid ${checked ? '#8B5CF6' : 'rgba(255,255,255,0.2)'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.2s ease',
        boxShadow: checked ? '0 0 14px rgba(109,74,255,0.4)' : 'none',
      }}>
        {checked && <span style={{ color:'#fff', fontSize:12, fontWeight:900, animation:'checkPop 0.3s ease both' }}>✓</span>}
      </div>
      <div>
        <span style={{ color: checked ? '#E9D5FF' : 'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.5, fontWeight: checked ? 600 : 400 }}>{label}</span>
        {sublabel && <p style={{ margin:'3px 0 0', color:'rgba(255,255,255,0.35)', fontSize:11, lineHeight:1.4 }}>{sublabel}</p>}
      </div>
    </label>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', border:'none', borderRadius:99, padding:'15px 32px',
      fontSize:15, fontWeight:700, cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled
        ? 'rgba(255,255,255,0.08)'
        : 'linear-gradient(135deg,#6D4AFF,#8B5CF6)',
      color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
      boxShadow: disabled ? 'none' : '0 6px 28px rgba(109,74,255,0.4)',
      transition:'all 0.2s ease',
      fontFamily:"'Inter',sans-serif",
    }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 36px rgba(109,74,255,0.5)'; }}}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=disabled?'none':'0 6px 28px rgba(109,74,255,0.4)'; }}
    >{children}</button>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ color:'#fff', fontSize:21, fontWeight:800, margin:'0 0 6px', lineHeight:1.2 }}>{children}</h2>;
}
function SectionSub({ children }) {
  return <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, margin:'0 0 20px', lineHeight:1.6 }}>{children}</p>;
}
function ColTitle({ children }) {
  return (
    <p style={{ color:'#A78BFA', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 12px', display:'flex', alignItems:'center', gap:7 }}>
      <span style={{ width:16, height:1.5, background:'linear-gradient(90deg,#A78BFA,transparent)', display:'inline-block', borderRadius:99 }}/>
      {children}
    </p>
  );
}

// ── STEP COMPONENTS ────────────────────────────────────────────────────────

function Step1({ onNext }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ marginBottom:18, animation:'goFloat 4s ease-in-out infinite' }}>
        <LotusIcon size={64}/>
      </div>
      <div style={{ display:'inline-block', background:'rgba(109,74,255,0.2)', border:'1px solid rgba(167,139,250,0.3)', borderRadius:99, padding:'5px 16px', marginBottom:18 }}>
        <span style={{ color:'#C4B5FD', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>Guide Onboarding</span>
      </div>
      <SectionTitle>Welcome, Guide 💜</SectionTitle>
      <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, lineHeight:1.8, margin:'0 0 10px' }}>
        Thank you for helping people on their healing journeys.
      </p>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:1.8, margin:'0 0 28px', maxWidth:380, marginLeft:'auto', marginRight:'auto' }}>
        SoulConnect exists to create safe spaces for connection, support, wellness, and personal growth. Before accepting bookings, please review your responsibilities and platform guidelines.
      </p>
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8, marginBottom:28 }}>
        {['🧘 Wellness Coaches','🌿 Healers','🎵 Sound Healers','⭕ Circle Hosts','🧬 Reiki Practitioners','🕉️ Meditation Teachers'].map(t => (
          <span key={t} style={{ background:'rgba(167,139,250,0.1)', color:'rgba(196,181,253,0.8)', borderRadius:99, padding:'5px 12px', fontSize:11, fontWeight:600, border:'1px solid rgba(167,139,250,0.2)' }}>{t}</span>
        ))}
      </div>
      <PrimaryBtn onClick={onNext}>Begin Onboarding →</PrimaryBtn>
      <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:12 }}>Takes approximately 5 minutes</p>
    </div>
  );
}

function Step2({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>Understanding Your Role</SectionTitle>
      <SectionSub>Be clear on what you can offer — and where the boundaries are.</SectionSub>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        <div>
          <ColTitle>You May Provide</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Emotional support','Wellness coaching','Meditation guidance','Breathwork','Yoga-based wellness','Spiritual guidance','Energy healing','Group facilitation'].map(t => (
              <Chip key={t} text={t} type="allow"/>
            ))}
          </div>
        </div>
        <div>
          <ColTitle>You May NOT Provide</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Emergency intervention','Suicide prevention','Psychiatric treatment','Medical diagnosis','Prescription advice','Clinical treatment (unless licensed)'].map(t => (
              <Chip key={t} text={t} type="deny"/>
            ))}
          </div>
        </div>
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I understand my role and its limitations on SoulConnect."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>I Understand →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step3({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>Independent Practitioner Agreement</SectionTitle>
      <SectionSub>Guides operate independently — not as SoulConnect employees.</SectionSub>

      <div style={{ background:'rgba(109,74,255,0.1)', border:'1px solid rgba(167,139,250,0.25)', borderRadius:16, padding:'18px 20px', marginBottom:16 }}>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.8, margin:0 }}>
          As a guide on SoulConnect, you operate as an independent practitioner. SoulConnect does not supervise, direct, or control your professional services. You are solely responsible for delivering your own sessions.
        </p>
      </div>

      <ColTitle>Your Responsibilities</ColTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:20 }}>
        {[
          { icon:'🎓', text:'Your qualifications and credentials' },
          { icon:'📋', text:'Your certifications and training' },
          { icon:'⚖️', text:'Compliance with local laws and regulations' },
          { icon:'💼', text:'Your tax and financial obligations' },
          { icon:'🔏', text:'Professional liability for your services' },
        ].map(item => (
          <div key={item.text} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize:17 }}>{item.icon}</span>
            <span style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I understand I am an independent practitioner and not an employee of SoulConnect."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>Continue →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step4({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>Protecting User Privacy</SectionTitle>
      <SectionSub>Every user who trusts you deserves confidentiality and respect.</SectionSub>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        <div>
          <ColTitle>You Must</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Respect confidentiality','Protect personal information','Maintain professional boundaries','Only collect necessary session info','Honour user consent at all times'].map(t => (
              <Chip key={t} text={t} type="allow"/>
            ))}
          </div>
        </div>
        <div>
          <ColTitle>You Must NOT</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Share user information externally','Record sessions without consent','Contact users outside approved channels','Retain data beyond session needs','Sell or transfer user data'].map(t => (
              <Chip key={t} text={t} type="deny"/>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:'rgba(52,195,143,0.08)', border:'1px solid rgba(52,195,143,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
        <p style={{ margin:0, color:'rgba(52,195,143,0.85)', fontSize:13, fontWeight:600, lineHeight:1.5 }}>
          💜 Users place significant trust in you. Protecting their privacy is a core obligation — not optional.
        </p>
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I agree to protect user privacy and uphold confidentiality at all times."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>Continue →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step5({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>What To Do In A Crisis</SectionTitle>
      <SectionSub>You are not expected to manage emergencies. Here's what to do instead.</SectionSub>

      {/* Important notice */}
      <div style={{ background:'rgba(239,68,68,0.1)', border:'2px solid rgba(239,68,68,0.25)', borderRadius:14, padding:'16px 18px', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <span style={{ fontSize:20 }}>🚨</span>
          <span style={{ color:'#FCA5A5', fontWeight:800, fontSize:14 }}>Guides are NOT crisis responders</span>
        </div>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.65, margin:0 }}>
          If a user expresses suicidal intent, self-harm urges, immediate danger, or threats toward others — do NOT attempt crisis intervention beyond your training.
        </p>
      </div>

      {/* Triggers list */}
      <ColTitle>If a User Expresses…</ColTitle>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:18 }}>
        {['💭 Suicidal thoughts','🩹 Self-harm intent','⚡ Immediate danger','😡 Threats to others'].map(t => (
          <span key={t} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'rgba(252,165,165,0.9)', borderRadius:99, padding:'6px 12px', fontSize:12, fontWeight:600 }}>{t}</span>
        ))}
      </div>

      {/* Required actions */}
      <ColTitle>Required Actions</ColTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
        {[
          { n:1, text:'Stay calm and non-judgmental' },
          { n:2, text:'Encourage the user to contact emergency services immediately' },
          { n:3, text:'Direct them to SoulConnect Crisis Resources (/crisis-support)' },
          { n:4, text:'Use the SoulConnect Safety Escalation button on your dashboard' },
          { n:5, text:'End the session if necessary to protect both parties' },
        ].map(a => (
          <div key={a.n} style={{ display:'flex', gap:12, alignItems:'flex-start', background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 14px' }}>
            <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#6D4AFF,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{a.n}</div>
            <span style={{ color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.5 }}>{a.text}</span>
          </div>
        ))}
      </div>

      {/* Example phrases */}
      <ColTitle>Suggested Statements</ColTitle>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
        {[
          '"I\'m concerned about your safety right now."',
          '"I encourage you to contact emergency services or a crisis support provider immediately."',
          '"This situation requires support beyond what I can safely provide."',
        ].map((s,i) => (
          <div key={i} style={{ background:'rgba(109,74,255,0.12)', border:'1px solid rgba(167,139,250,0.2)', borderLeft:'3px solid #8B5CF6', borderRadius:'0 10px 10px 0', padding:'10px 14px', color:'rgba(196,181,253,0.85)', fontSize:13, fontStyle:'italic', lineHeight:1.5 }}>{s}</div>
        ))}
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I understand the crisis escalation process and will follow it."
        sublabel="I will not attempt crisis intervention beyond my training."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>Continue →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step6({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>Professional Conduct</SectionTitle>
      <SectionSub>The standard of care every guide on SoulConnect maintains.</SectionSub>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
        <div>
          <ColTitle>Standards to Uphold</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Be respectful and compassionate','Stay strictly within your expertise','Be honest about your qualifications','Avoid miracle claims or guarantees','Maintain healthy professional boundaries','Support users\' autonomy and choices'].map(t => (
              <Chip key={t} text={t} type="allow"/>
            ))}
          </div>
        </div>
        <div>
          <ColTitle>Strictly Prohibited</ColTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {['Harassment or intimidation','Manipulation or exploitation','Applying financial pressure','False medical or healing claims','Guaranteeing outcomes','Romantically pursuing users'].map(t => (
              <Chip key={t} text={t} type="deny"/>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:'rgba(245,184,65,0.08)', border:'1px solid rgba(245,184,65,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
        <p style={{ margin:0, color:'rgba(253,224,71,0.8)', fontSize:13, fontWeight:600, lineHeight:1.5 }}>
          ⭐ Violations may result in immediate suspension and removal from the platform.
        </p>
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I agree to follow SoulConnect's professional conduct standards."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>Continue →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step7({ onNext }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SectionTitle>Employment Compliance</SectionTitle>
      <SectionSub>Your responsibility to comply with any existing employment arrangements.</SectionSub>

      <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'20px', marginBottom:20 }}>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.8, margin:0 }}>
          If you are currently employed elsewhere, you are solely responsible for ensuring your activities on SoulConnect comply with your employer's policies, non-compete agreements, and applicable local regulations.
        </p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, lineHeight:1.7, margin:'12px 0 0' }}>
          SoulConnect does not determine whether outside work is permitted by your employer. It is your obligation to verify this independently before listing your services.
        </p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {[
          { icon:'⚖️', text:'Check your employment contract for outside work clauses' },
          { icon:'💼', text:'Ensure your practice complies with local professional regulations' },
          { icon:'🏛️', text:'Obtain any required licences or permits for your practice' },
          { icon:'💰', text:'Declare income from SoulConnect to relevant tax authorities' },
        ].map(item => (
          <div key={item.text} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <Checkbox
        checked={checked}
        onChange={() => setChecked(v => !v)}
        label="I confirm I am responsible for complying with my employer's policies and applicable laws."
      />
      <div style={{ marginTop:16 }}>
        <PrimaryBtn onClick={onNext} disabled={!checked}>Continue →</PrimaryBtn>
      </div>
    </div>
  );
}

function Step8({ onNext }) {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('');
  const fileRef = useRef(null);

  const CATEGORIES = [
    { value:'certification', label:'Certification', icon:'📜' },
    { value:'license',       label:'Professional Licence', icon:'🏅' },
    { value:'training',      label:'Training Certificate', icon:'🎓' },
    { value:'membership',    label:'Professional Membership', icon:'🤝' },
  ];

  const handleFiles = (e) => {
    const incoming = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...incoming.map(f => ({ name:f.name, size:f.size, cat:category || 'certification' }))]);
  };

  const remove = (i) => setFiles(f => f.filter((_,idx) => idx !== i));

  return (
    <div>
      <SectionTitle>Qualifications & Credentials</SectionTitle>
      <SectionSub>Upload certificates to earn your Verified Guide badge.</SectionSub>

      {/* Badge preview */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:22 }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:'linear-gradient(135deg,rgba(109,74,255,0.2),rgba(167,139,250,0.15))',
          border:'1.5px solid rgba(167,139,250,0.4)',
          borderRadius:99, padding:'10px 20px',
          boxShadow:'0 0 24px rgba(109,74,255,0.2)',
        }}>
          <span style={{ fontSize:20 }}>✅</span>
          <div>
            <span style={{ color:'#C4B5FD', fontSize:14, fontWeight:800 }}>Verified Guide</span>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11, display:'block' }}>Badge unlocked after review</span>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <ColTitle>Document Category</ColTitle>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)} style={{
            background: category === c.value ? 'rgba(109,74,255,0.3)' : 'rgba(255,255,255,0.05)',
            border:`1.5px solid ${category === c.value ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius:99, padding:'7px 14px', cursor:'pointer',
            color: category === c.value ? '#C4B5FD' : 'rgba(255,255,255,0.5)',
            fontSize:12, fontWeight:600, transition:'all 0.15s',
            display:'flex', alignItems:'center', gap:5,
          }}>
            <span>{c.icon}</span>{c.label}
          </button>
        ))}
      </div>

      {/* Upload area */}
      <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png" multiple style={{ display:'none' }} onChange={handleFiles} />
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border:'2px dashed rgba(167,139,250,0.3)', borderRadius:16,
          padding:'28px', textAlign:'center', cursor:'pointer', marginBottom:16,
          background:'rgba(255,255,255,0.02)', transition:'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(167,139,250,0.6)'; e.currentTarget.style.background='rgba(109,74,255,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
      >
        <div style={{ fontSize:32, marginBottom:8 }}>📎</div>
        <p style={{ margin:0, color:'#A78BFA', fontWeight:600, fontSize:14 }}>Click to upload documents</p>
        <p style={{ margin:'4px 0 0', color:'rgba(255,255,255,0.3)', fontSize:12 }}>PDF, JPG, PNG — max 10MB each</p>
      </div>

      {/* Uploaded files */}
      {files.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
          {files.map((f,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(52,195,143,0.08)', border:'1px solid rgba(52,195,143,0.2)', borderRadius:10, padding:'10px 14px' }}>
              <span style={{ fontSize:18 }}>📄</span>
              <div style={{ flex:1 }}>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600 }}>{f.name}</div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{(f.size/1024).toFixed(1)} KB</div>
              </div>
              <button onClick={() => remove(i)} style={{ background:'rgba(239,68,68,0.15)', border:'none', borderRadius:6, padding:'4px 10px', color:'#FCA5A5', fontSize:11, fontWeight:700, cursor:'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
        <p style={{ margin:0, color:'rgba(196,181,253,0.7)', fontSize:12, lineHeight:1.5 }}>
          💜 Uploading credentials is optional but recommended. Verified guides receive a badge and higher visibility in search results. Documents are reviewed within 2–3 business days.
        </p>
      </div>

      <PrimaryBtn onClick={onNext}>
        {files.length > 0 ? `Continue with ${files.length} document${files.length > 1 ? 's' : ''} →` : 'Skip for Now →'}
      </PrimaryBtn>
    </div>
  );
}

function Step9({ onComplete }) {
  const ITEMS = [
    'I understand my scope of practice as a guide on SoulConnect.',
    'I understand I am not an emergency responder and will direct users in crisis to professional services.',
    'I agree to protect user privacy and maintain confidentiality.',
    'I agree to follow SoulConnect\'s community standards and conduct guidelines.',
    'I understand the crisis escalation procedures and will follow them.',
    'I understand I am an independent practitioner and not an employee of SoulConnect.',
  ];
  const [checks, setChecks] = useState(Array(ITEMS.length).fill(false));
  const allDone = checks.every(Boolean);
  const toggle = i => setChecks(c => c.map((v,idx) => idx===i ? !v : v));

  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{ fontSize:38, marginBottom:10 }}>✍️</div>
        <SectionTitle>Final Acknowledgement</SectionTitle>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:4, lineHeight:1.5 }}>
          Please confirm each item before activating your guide profile.
        </p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {ITEMS.map((item, i) => (
          <Checkbox key={i} checked={checks[i]} onChange={() => toggle(i)} label={item} />
        ))}
      </div>

      {/* Progress indicator */}
      <div style={{ margin:'18px 0 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>Acknowledgements complete</span>
          <span style={{ color:allDone ? '#34C38F' : '#A78BFA', fontSize:11, fontWeight:700 }}>{checks.filter(Boolean).length} / {ITEMS.length}</span>
        </div>
        <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:99,
            width:`${(checks.filter(Boolean).length/ITEMS.length)*100}%`,
            background: allDone ? 'linear-gradient(90deg,#34C38F,#059669)' : 'linear-gradient(90deg,#6D4AFF,#A78BFA)',
            transition:'width 0.4s ease, background 0.3s ease',
            boxShadow:`0 0 10px ${allDone ? 'rgba(52,195,143,0.5)' : 'rgba(109,74,255,0.4)'}`,
          }}/>
        </div>
      </div>

      {/* Signature */}
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'14px 18px', marginBottom:18, textAlign:'center' }}>
        <p style={{ margin:0, color:'rgba(255,255,255,0.35)', fontSize:12, lineHeight:1.7 }}>
          By continuing, you acknowledge and agree to the SoulConnect{' '}
          <button className="go-link-btn" onClick={() => window.open('/guide-terms','_blank')}>Guide Agreement</button>,{' '}
          <button className="go-link-btn" onClick={() => window.open('/community-rules','_blank')}>Community Guidelines</button>,{' '}
          <button className="go-link-btn" onClick={() => window.open('/terms','_blank')}>Privacy Policy</button>, and{' '}
          <button className="go-link-btn" onClick={() => window.open('/safety','_blank')}>Safety Policy</button>.
        </p>
      </div>

      <PrimaryBtn onClick={onComplete} disabled={!allDone}>
        {allDone ? '✅ Accept & Activate Guide Profile' : `${checks.filter(Boolean).length} of ${ITEMS.length} — please check all boxes`}
      </PrimaryBtn>
    </div>
  );
}

// ── COMPLETE SCREEN ────────────────────────────────────────────────────────
function CompletedScreen({ name, onEnter }) {
  return (
    <Card>
      <div style={{ textAlign:'center', padding:'8px 0' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#34C38F,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:38, margin:'0 auto 20px', boxShadow:'0 8px 32px rgba(52,195,143,0.4)', animation:'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>✓</div>
        <div style={{ animation:'goFloat 4s ease-in-out infinite', marginBottom:12 }}>
          <LotusIcon size={48}/>
        </div>
        <h2 style={{ color:'#fff', fontSize:24, fontWeight:800, margin:'0 0 8px' }}>You're All Set! 💜</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, lineHeight:1.7, margin:'0 0 8px' }}>
          Welcome to the SoulConnect guide community, <strong style={{ color:'#C4B5FD' }}>{name}</strong>.
        </p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, lineHeight:1.6, margin:'0 0 24px' }}>
          Your profile is now active. You can start reviewing booking requests from users who need your support.
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:10, marginBottom:24 }}>
          {[
            { icon:'✅', label:'Onboarding Complete' },
            { icon:'🛡️', label:'Safety Trained' },
            { icon:'💜', label:'Community Member' },
          ].map(b => (
            <div key={b.label} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(52,195,143,0.1)', border:'1px solid rgba(52,195,143,0.25)', borderRadius:99, padding:'7px 14px' }}>
              <span style={{ fontSize:14 }}>{b.icon}</span>
              <span style={{ color:'rgba(134,239,172,0.85)', fontSize:12, fontWeight:600 }}>{b.label}</span>
            </div>
          ))}
        </div>
        <PrimaryBtn onClick={onEnter}>Enter Your Dashboard →</PrimaryBtn>
        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:12 }}>
          Your acknowledgement has been recorded with today's date.
        </p>
      </div>
    </Card>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function GuideOnboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const TOTAL = 9;
  const healerName = user?.name?.split(' ')[0] || 'Guide';

  const next = () => setStep(s => s + 1);

  const handleComplete = () => {
    const ack = {
      guide_agreement_version: AGREEMENT_VERSION,
      accepted_at: new Date().toISOString(),
      qualification_status: 'pending_review',
      verification_status: 'unverified',
      safety_training_completed: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ack));
    setDone(true);
  };

  const handleEnter = () => {
    onComplete?.();
  };

  if (done) {
    return (
      <div style={{
        position:'fixed', inset:0, zIndex:99999,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:20, fontFamily:"'Inter',sans-serif",
        background:'linear-gradient(160deg,#140A38 0%,#0B0420 100%)',
      }}>
        <style>{STYLES}</style>
        <Particles/>
        <div style={{ position:'absolute',top:-40,right:-40,opacity:1,pointerEvents:'none',animation:'goFloat 18s ease-in-out infinite' }}><SacredBg/></div>
        <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:480 }}>
          <CompletedScreen name={healerName} onEnter={handleEnter}/>
        </div>
      </div>
    );
  }

  const steps = [
    <Step1 key={0} onNext={next}/>,
    <Step2 key={1} onNext={next}/>,
    <Step3 key={2} onNext={next}/>,
    <Step4 key={3} onNext={next}/>,
    <Step5 key={4} onNext={next}/>,
    <Step6 key={5} onNext={next}/>,
    <Step7 key={6} onNext={next}/>,
    <Step8 key={7} onNext={next}/>,
    <Step9 key={8} onComplete={handleComplete}/>,
  ];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:99999, overflow:'auto',
      fontFamily:"'Inter',sans-serif",
      background:'linear-gradient(160deg,#140A38 0%,#0B0420 100%)',
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      padding:'24px 20px 40px',
    }}>
      <style>{STYLES}</style>

      {/* Background particles & geometry */}
      <Particles n={14}/>
      <div style={{ position:'fixed',top:-50,right:-50,pointerEvents:'none',animation:'goFloat 18s ease-in-out infinite' }}><SacredBg/></div>
      <div style={{ position:'fixed',bottom:-50,left:-50,pointerEvents:'none',animation:'goFloat 22s ease-in-out 5s infinite' }}><SacredBg/></div>

      {/* Glow orbs */}
      <div style={{ position:'fixed',top:'20%',left:'5%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(109,74,255,0.12),transparent 70%)',pointerEvents:'none',animation:'goOrb1 16s ease-in-out infinite' }}/>
      <div style={{ position:'fixed',bottom:'15%',right:'5%',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.1),transparent 70%)',pointerEvents:'none',animation:'goOrb2 20s ease-in-out infinite' }}/>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:560 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:24 }}>
          <img src="/logo-icon.png" alt="SoulConnect" style={{ width:36, height:36, borderRadius:10, boxShadow:'0 4px 16px rgba(109,74,255,0.4)', display:'block' }} />
          <span style={{ fontSize:16, fontWeight:800, color:'#fff' }}>Soul<span style={{ color:'#A78BFA' }}>Connect</span></span>
          <span style={{ background:'rgba(109,74,255,0.25)', color:'#C4B5FD', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:99, border:'1px solid rgba(167,139,250,0.3)' }}>Guide Portal</span>
        </div>

        {step > 0 && <ProgressBar step={step} total={TOTAL}/>}

        <Card>
          {steps[step]}
        </Card>

        {/* Crisis link always visible */}
        <div style={{ textAlign:'center', marginTop:14 }}>
          <button onClick={() => window.open('/crisis-support','_blank')} style={{ background:'none', border:'none', color:'rgba(167,139,250,0.45)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
            🆘 Crisis Support Resources
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useNeedsGuideOnboarding() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  try {
    const ack = JSON.parse(raw);
    if (ack.guide_agreement_version !== AGREEMENT_VERSION) return true;
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (Date.now() - new Date(ack.accepted_at).getTime() > oneYear) return true;
    return false;
  } catch { return true; }
}
