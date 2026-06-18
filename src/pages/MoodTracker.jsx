import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { journeyAPI } from '../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────

const MOODS_5 = [
  { score: 1, emoji: '😢', label: 'Very Bad',  color: '#EF4444' },
  { score: 3, emoji: '😔', label: 'Bad',        color: '#F97316' },
  { score: 5, emoji: '😐', label: 'Neutral',    color: '#F59E0B' },
  { score: 7, emoji: '🙂', label: 'Good',       color: '#10B981' },
  { score: 9, emoji: '😄', label: 'Very Good',  color: '#6D4AFF' },
];

const TRIGGERS = [
  { id: 'work',     icon: '💼', label: 'Work'        },
  { id: 'relation', icon: '💔', label: 'Relationship' },
  { id: 'family',   icon: '👨‍👩‍👧', label: 'Family'    },
  { id: 'health',   icon: '🏥', label: 'Health'      },
  { id: 'money',    icon: '💰', label: 'Money'       },
  { id: 'sleep',    icon: '😴', label: 'Sleep'       },
  { id: 'social',   icon: '👥', label: 'Social Life'  },
  { id: 'other',    icon: '❓', label: 'Other'       },
];

const GUIDED_PROMPTS = [
  'What challenged you today, and how did you handle it?',
  'What are you most grateful for in this moment?',
  'What made you smile today, even briefly?',
  'What emotion are you holding that needs to be released?',
  "What's one thing you're proud of yourself for this week?",
  'If you could give yourself one piece of advice right now, what would it be?',
  'What does your body need that you haven\'t given it today?',
];

const WINS = [
  'Got out of bed', 'Completed work', 'Attended circle',
  'Exercised', 'Practiced meditation', 'Other win',
];

const JOURNEY_STAGES = [
  { key: 'awareness',      icon: '🌱', label: 'Awareness'      },
  { key: 'healing',        icon: '💜', label: 'Healing'        },
  { key: 'growth',         icon: '🌿', label: 'Growth'         },
  { key: 'transformation', icon: '🦋', label: 'Transformation' },
  { key: 'awakening',      icon: '☀️', label: 'Awakening'      },
];

const STORAGE_KEY = 'sc_journal_v2';

const NAV = [
  { icon: '🔗', label: 'Matches',     path: '/dashboard' },
  { icon: '⭕', label: 'Circles',     path: '/groups'    },
  { icon: '✨', label: 'Healers',     path: '/healers'   },
  { icon: '📔', label: 'Journal',     path: '/mood'      },
  { icon: '🧘', label: 'Meditations', path: '/mood'      },
  { icon: '💬', label: 'Messages',    path: '/chat'      },
  { icon: '🔖', label: 'Saved',       path: '/account'   },
  { icon: '🌱', label: 'My Journey',  path: '/journey'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function moodColor(score) {
  if (score >= 8) return '#6D4AFF';
  if (score >= 6) return '#10B981';
  if (score >= 4) return '#F59E0B';
  return '#EF4444';
}

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveStore(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function getTodayKey() { return new Date().toISOString().slice(0, 10); }

function computeStreak(entries) {
  let s = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const k = d.toISOString().slice(0, 10);
    if (entries[k]?.mood) { s++; d.setDate(d.getDate() - 1); } else break;
  }
  return s;
}

function computeLongestStreak(entries) {
  const keys = Object.keys(entries).filter(k => entries[k]?.mood).sort();
  let best = 0, cur = 0, prev = null;
  for (const k of keys) {
    const d = new Date(k);
    if (prev && (d - new Date(prev)) / 86400000 === 1) { cur++; } else { cur = 1; }
    if (cur > best) best = cur;
    prev = k;
  }
  return best;
}

function getInsights(entries) {
  const keys = Object.keys(entries).filter(k => entries[k]?.mood).sort().slice(-7);
  if (!keys.length) return [{ icon: '✨', text: 'Keep logging your mood to unlock personalized insights.', color: '#A78BFA' }];
  const scores = keys.map(k => entries[k].mood);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const ins = [];
  if (avg >= 6) ins.push({ icon: '😊', text: 'You feel calmer on weekends.', color: '#10B981' });
  const wc = keys.filter(k => (entries[k]?.triggers || []).includes('work')).length;
  if (wc >= 2) ins.push({ icon: '💼', text: `Work stress appears in ${Math.round(wc / keys.length * 100)}% of difficult days.`, color: '#F97316' });
  if (keys.some(k => (entries[k]?.wins || []).includes('Practiced meditation')))
    ins.push({ icon: '🧘', text: 'Your mood improves after meditation.', color: '#6D4AFF' });
  if (scores[scores.length - 1] > scores[0])
    ins.push({ icon: '📈', text: 'Your mood has been trending upward this week!', color: '#6D4AFF' });
  return ins.slice(0, 3).length ? ins.slice(0, 3) : [{ icon: '✨', text: 'Start logging daily to reveal your patterns.', color: '#A78BFA' }];
}

function wellnessScore(entries) {
  const keys = Object.keys(entries).filter(k => entries[k]?.mood).sort().slice(-7);
  if (!keys.length) return 50;
  return Math.round(keys.reduce((s, k) => s + entries[k].mood, 0) / keys.length / 10 * 100);
}

// ── SVG Chart ─────────────────────────────────────────────────────────────────

function MoodChart({ entries }) {
  const days = 7;
  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  const labels = dates.map(d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 3));
  const values = dates.map(d => entries[d]?.mood || null);
  const emos   = { 1:'😭',2:'😢',3:'😞',4:'😟',5:'😐',6:'🙂',7:'😊',8:'😄',9:'😁',10:'🤩' };

  const W=460, H=110, px=24, py=14;
  const xS = (W - 2*px) / (days-1);
  const yR = H - 2*py;
  const coords = values.map((v,i) => v != null ? { x: px+i*xS, y: py+yR-((v-1)/9)*yR, v } : null);
  const valid  = coords.filter(Boolean);

  const pathD = valid.length >= 2 ? valid.map((p,i) => {
    if (i===0) return `M${p.x},${p.y}`;
    const prev = valid[i-1];
    const cx = (prev.x+p.x)/2;
    return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }).join(' ') : '';

  const areaD = valid.length >= 2
    ? `${pathD} L${valid[valid.length-1].x},${H-py} L${valid[0].x},${H-py} Z`
    : '';

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H+28}`} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id="mlG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6D4AFF"/><stop offset="100%" stopColor="#A78BFA"/>
        </linearGradient>
        <linearGradient id="maG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D4AFF" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#6D4AFF" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[3,5,7,9].map(v => {
        const y = py+yR-((v-1)/9)*yR;
        return <line key={v} x1={px} y1={y} x2={W-px} y2={y} stroke="rgba(109,74,255,0.07)" strokeWidth="1"/>;
      })}
      {areaD && <path d={areaD} fill="url(#maG)"/>}
      {pathD && <path d={pathD} fill="none" stroke="url(#mlG)" strokeWidth="2.5" strokeLinecap="round"/>}
      {coords.map((p,i) => p ? (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" fill={moodColor(p.v)} opacity="0.12"/>
          <circle cx={p.x} cy={p.y} r="4.5" fill={moodColor(p.v)}/>
          <circle cx={p.x} cy={p.y} r="2" fill="#fff"/>
          <text x={p.x} y={p.y-13} textAnchor="middle" fontSize="11">{emos[p.v]}</text>
        </g>
      ) : <circle key={i} cx={px+i*xS} cy={H/2} r="3" fill="rgba(109,74,255,0.12)"/>)}
      {labels.map((l,i) => (
        <text key={i} x={px+i*xS} y={H+16} textAnchor="middle" fontSize="10" fontWeight="600" fill="#9CA3AF">{l}</text>
      ))}
    </svg>
  );
}

// ── Lotus SVG ─────────────────────────────────────────────────────────────────

function LotusIcon({ size=28, color='#6D4AFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85"/>
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85" transform="rotate(-40 20 26)"/>
      <ellipse cx="20" cy="26" rx="6" ry="9" fill={color} opacity="0.85" transform="rotate(40 20 26)"/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color}/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color} transform="rotate(-35 20 24)"/>
      <ellipse cx="20" cy="24" rx="4" ry="7" fill={color} transform="rotate(35 20 24)"/>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MoodTracker() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuthStore();

  const [store, setStore]       = useState(loadStore);
  const today                   = getTodayKey();
  const todayData               = store[today] || {};

  const [mood, setMood]                 = useState(todayData.mood || null);
  const [reflection, setReflection]     = useState(todayData.reflection || '');
  const [triggers, setTriggers]         = useState(todayData.triggers || []);
  const [gratitude, setGratitude]       = useState(todayData.gratitude || ['', '', '']);
  const [wins, setWins]                 = useState(todayData.wins || []);
  const [promptIdx, setPromptIdx]       = useState(0);
  const [saved, setSaved]               = useState(false);

  const persist = (patch) => {
    const next = { ...store, [today]: { ...todayData, ...patch } };
    setStore(next); saveStore(next);
  };

  const handleMoodSelect = (score) => { setMood(score); persist({ mood: score }); };
  const handleTrigger = (id) => {
    const next = triggers.includes(id) ? triggers.filter(t=>t!==id) : [...triggers, id];
    setTriggers(next); persist({ triggers: next });
  };
  const handleWin = (w) => {
    const next = wins.includes(w) ? wins.filter(x=>x!==w) : [...wins, w];
    setWins(next); persist({ wins: next });
  };
  const handleGratitude = (i, val) => {
    const next = [...gratitude]; next[i] = val;
    setGratitude(next); persist({ gratitude: next });
  };
  const handleSave = () => {
    persist({ reflection, triggers, gratitude, wins, savedAt: Date.now() });
    if (mood) journeyAPI.logActivity({ activity_type: 'check_in', duration_minutes: 0, intensity: Math.round(mood/10*10), notes: reflection || 'Daily mood check-in' }).catch(()=>{});
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const streak   = computeStreak(store);
  const longest  = computeLongestStreak(store);
  const wscore   = wellnessScore(store);
  const insights = getInsights(store);
  const stageIdx = wscore >= 90 ? 4 : wscore >= 75 ? 3 : wscore >= 55 ? 2 : wscore >= 35 ? 1 : 0;

  const todayMoodMeta = mood ? MOODS_5.reduce((a,b) => Math.abs(b.score-mood)<Math.abs(a.score-mood)?b:a) : null;
  const firstName = user?.full_name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Friend';
  const hour = new Date().getHours();
  const greeting = hour<12 ? 'Good morning' : hour<17 ? 'Good afternoon' : 'Good evening';
  const wTrend = wscore>=55 ? 'Improving ↑' : wscore>=40 ? 'Steady →' : 'Needs care ↓';
  const wTrendColor = wscore>=55 ? '#10B981' : wscore>=40 ? '#F59E0B' : '#EF4444';
  const userInitials = user?.full_name ? user.full_name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : 'ME';

  return (
    <div style={{
      position:'fixed', inset:0,
      display:'grid', gridTemplateColumns:'240px 1fr 284px',
      background:'#FAF7FF',
      fontFamily:"'Plus Jakarta Sans', Inter, system-ui, sans-serif",
      overflow:'hidden',
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes glow   { 0%,100%{box-shadow:0 0 10px rgba(109,74,255,0.3)} 50%{box-shadow:0 0 22px rgba(109,74,255,0.6)} }
        .jsc::-webkit-scrollbar{width:3px} .jsc::-webkit-scrollbar-thumb{background:rgba(109,74,255,0.2);border-radius:99px}
        .jnav:hover{background:rgba(109,74,255,0.07)!important}
        .jtrig:hover{border-color:rgba(109,74,255,0.4)!important}
        .jcard{animation:fadeUp 0.3s ease both}
        .jmood{transition:all 0.2s} .jmood:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.09)!important}
        .jbtn:hover{opacity:0.9;transform:translateY(-1px)} .jbtn:active{transform:scale(0.98)}
        .jrec:hover{border-color:rgba(109,74,255,0.3)!important;background:#F3EEFF!important}
      `}</style>

      {/* ═══ LEFT SIDEBAR ═══════════════════════════════════════════════════ */}
      <div style={{ background:'#fff', borderRight:'1px solid rgba(109,74,255,0.1)', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Logo */}
        <div style={{ padding:'22px 18px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <LotusIcon size={32} color="#6D4AFF"/>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:'#1A1333', lineHeight:1 }}>
              Soul<span style={{ color:'#6D4AFF' }}>Connect</span>
            </div>
            <div style={{ fontSize:9, color:'#A78BFA', letterSpacing:'0.08em', marginTop:2 }}>Heal · Connect · Grow</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'2px 10px', overflowY:'auto' }}>
          {NAV.map(item => {
            const active = item.path === '/mood' && location.pathname === '/mood';
            return (
              <button key={item.label} className="jnav" onClick={() => navigate(item.path)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'10px 12px', borderRadius:12, marginBottom:2,
                border:'none', cursor:'pointer', textAlign:'left',
                background: active ? 'rgba(109,74,255,0.1)' : 'transparent',
                fontFamily:'inherit', transition:'background 0.15s',
              }}>
                <span style={{ fontSize:16, width:20, textAlign:'center' }}>{item.icon}</span>
                <span style={{ fontSize:13, fontWeight: active ? 700 : 500, color: active ? '#6D4AFF' : '#4B5563' }}>
                  {item.label}
                </span>
                {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#6D4AFF' }}/>}
              </button>
            );
          })}
        </nav>

        {/* Wellness card */}
        <div style={{ margin:'0 10px 10px', borderRadius:18, background:'linear-gradient(145deg, #4c1d95, #6D4AFF)', padding:'18px 14px', position:'relative', overflow:'hidden', flexShrink:0 }}>
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{ position:'absolute', width:3+(i%3), height:3+(i%3), borderRadius:'50%', background:'rgba(255,255,255,0.2)', left:`${12+i*18}%`, top:`${10+(i*19)%58}%`, animation:`float ${2+i*0.5}s ease-in-out ${i*0.3}s infinite` }}/>
          ))}
          <div style={{ fontSize:38, textAlign:'center', marginBottom:8, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }}>🧘‍♀️</div>
          <div style={{ fontSize:12, fontWeight:800, color:'#fff', textAlign:'center', marginBottom:4, lineHeight:1.4 }}>Your healing journey matters.</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.65)', textAlign:'center', lineHeight:1.5 }}>Every reflection is a step toward a better you.</div>
        </div>

        {/* Profile */}
        <div style={{ borderTop:'1px solid rgba(109,74,255,0.08)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg, #6D4AFF, #A78BFA)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>
            {userInitials}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#1A1333', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {user?.full_name || user?.name || 'My Account'}
            </div>
            <div onClick={() => navigate('/account')} style={{ fontSize:10, color:'#6D4AFF', cursor:'pointer' }}>View profile ›</div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══════════════════════════════════════════════════ */}
      <div className="jsc" style={{ overflowY:'auto', background:'#FAF7FF' }}>
        <div style={{ padding:'24px 26px', maxWidth:780 }}>

          {/* Greeting + Stats */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:'#1A1333', marginBottom:3, fontFamily:"'Playfair Display', Georgia, serif" }}>
                {greeting}, {firstName} ✨
              </h1>
              <p style={{ fontSize:13, color:'#6B7280' }}>How are you feeling today?</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { icon:'💜', label:'Wellness Score', value:`${wscore}/100`, sub:wTrend, subColor:wTrendColor },
                { icon:'🔥', label:'Current Streak', value:`${streak} days`, sub:'Keep it going!' },
                { icon:'🏆', label:'Longest Streak', value:`${longest} days`, sub:'Your best ⭐' },
              ].map(s => (
                <div key={s.label} style={{ background:'#fff', borderRadius:14, padding:'10px 14px', border:'1px solid rgba(109,74,255,0.1)', boxShadow:'0 2px 12px rgba(109,74,255,0.06)', textAlign:'center', minWidth:94 }}>
                  <div style={{ fontSize:18, marginBottom:3 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'#1A1333', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>{s.label}</div>
                  <div style={{ fontSize:10, color:s.subColor||'#6D4AFF', marginTop:1, fontWeight:600 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MOOD CHECK-IN ── */}
          <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'22px 24px', marginBottom:14, border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 14px rgba(109,74,255,0.06)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <h2 style={{ fontSize:14, fontWeight:700, color:'#1A1333', marginBottom:3 }}>How are you feeling right now?</h2>
                <p style={{ fontSize:11, color:'#6B7280' }}>Tap a card to log your mood</p>
              </div>
              {todayMoodMeta && (
                <div style={{ background:`${todayMoodMeta.color}10`, border:`1.5px solid ${todayMoodMeta.color}30`, borderRadius:14, padding:'10px 14px', textAlign:'center', minWidth:82 }}>
                  <div style={{ fontSize:10, color:'#6B7280', marginBottom:4, fontWeight:600 }}>Today's Mood</div>
                  <div style={{ fontSize:28 }}>{todayMoodMeta.emoji}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:todayMoodMeta.color, marginTop:3 }}>{todayMoodMeta.label}</div>
                  <button onClick={()=>setMood(null)} style={{ marginTop:5, fontSize:9, color:'#6D4AFF', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Update</button>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {MOODS_5.map(m => (
                <button key={m.score} className="jmood" onClick={() => handleMoodSelect(m.score)} style={{
                  flex:1, padding:'14px 8px', borderRadius:16, fontFamily:'inherit',
                  border: mood===m.score ? `2px solid ${m.color}` : '1.5px solid rgba(109,74,255,0.12)',
                  background: mood===m.score ? `${m.color}12` : '#FAF7FF',
                  cursor:'pointer', textAlign:'center',
                  boxShadow: mood===m.score ? `0 4px 18px ${m.color}30` : 'none',
                }}>
                  <div style={{ fontSize: mood===m.score ? 32 : 26, marginBottom:6, transition:'font-size 0.18s' }}>{m.emoji}</div>
                  <div style={{ fontSize:11, fontWeight:600, color: mood===m.score ? m.color : '#6B7280' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── REFLECTION + GUIDED PROMPT ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>

            {/* Reflection */}
            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#6D4AFF', marginBottom:3 }}>Daily Reflection</div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:12 }}>What's on your mind today?</div>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="I felt really anxious before my presentation today. I kept overthinking and was scared of making mistakes. But I tried my best and got through it."
                rows={5}
                style={{ width:'100%', borderRadius:12, padding:'11px 13px', border:'1.5px solid rgba(109,74,255,0.15)', background:'#FAF7FF', color:'#1A1333', fontSize:13, lineHeight:1.6, resize:'none', fontFamily:'inherit', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='#6D4AFF'}
                onBlur={e  => e.target.style.borderColor='rgba(109,74,255,0.15)'}
              />
              <div style={{ display:'flex', gap:7, marginTop:11 }}>
                {[{ icon:'✍️', label:'Write' }, { icon:'🎤', label:'Voice Note' }].map(b => (
                  <button key={b.label} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 11px', borderRadius:9, border:'1.5px solid rgba(109,74,255,0.18)', background:'#fff', color:'#4B5563', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    <span>{b.icon}</span>{b.label}
                  </button>
                ))}
                <button className="jbtn" onClick={handleSave} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:9, background: saved ? '#10B981' : 'linear-gradient(135deg,#6D4AFF,#A78BFA)', border:'none', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                  {saved ? '✓ Saved!' : '💾 Save Entry'}
                </button>
              </div>
            </div>

            {/* Guided Prompt */}
            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)', display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#6D4AFF' }}>Guided Prompt</div>
                <div style={{ display:'flex', gap:5 }}>
                  {['‹','›'].map((a,i) => (
                    <button key={i} onClick={() => setPromptIdx(p=>(p+(i===0?-1:1)+GUIDED_PROMPTS.length)%GUIDED_PROMPTS.length)} style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid rgba(109,74,255,0.2)', background:'#FAF7FF', color:'#6D4AFF', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit' }}>{a}</button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:14 }}>A new reflection prompt for you</div>
              <div style={{ flex:1, borderRadius:14, background:'linear-gradient(135deg, #FAF7FF, #F3EEFF)', border:'1px solid rgba(109,74,255,0.1)', padding:'18px 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div>
                  <div style={{ fontSize:38, color:'#DDD6FE', lineHeight:0.7, marginBottom:8 }}>"</div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#4B5563', lineHeight:1.65, fontStyle:'italic' }}>{GUIDED_PROMPTS[promptIdx]}</p>
                </div>
              </div>
              <button onClick={() => setReflection(r => r ? r+'\n\n'+GUIDED_PROMPTS[promptIdx] : GUIDED_PROMPTS[promptIdx])} style={{ marginTop:12, padding:'9px', borderRadius:11, border:'1.5px solid rgba(109,74,255,0.22)', background:'#fff', color:'#6D4AFF', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                Use This Prompt →
              </button>
            </div>
          </div>

          {/* ── MOOD TIMELINE ── */}
          <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 24px', marginBottom:14, border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#1A1333', marginBottom:2 }}>Mood Timeline</div>
            <div style={{ fontSize:11, color:'#6B7280', marginBottom:14 }}>Your mood over the last 7 days</div>
            <MoodChart entries={store}/>
          </div>

          {/* ── TRIGGERS + GRATITUDE ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>

            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1A1333', marginBottom:3 }}>What affected your mood today?</div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:13 }}>Select all that apply</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {TRIGGERS.map(t => {
                  const on = triggers.includes(t.id);
                  return (
                    <button key={t.id} className="jtrig" onClick={() => handleTrigger(t.id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:99, border: on ? '1.5px solid #6D4AFF' : '1.5px solid rgba(109,74,255,0.14)', background: on ? 'rgba(109,74,255,0.08)' : '#FAF7FF', color: on ? '#6D4AFF' : '#4B5563', fontSize:12, fontWeight: on ? 700 : 500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
                      <span>{t.icon}</span>{t.label}
                    </button>
                  );
                })}
              </div>
              {!triggers.length && <p style={{ marginTop:12, fontSize:11, color:'#9CA3AF', fontStyle:'italic' }}>Anything else you'd like to add?</p>}
              {triggers.length > 0 && (
                <input placeholder="Type here..." style={{ marginTop:12, width:'100%', borderRadius:10, padding:'8px 12px', border:'1.5px solid rgba(109,74,255,0.14)', background:'#FAF7FF', color:'#1A1333', fontSize:12, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
              )}
            </div>

            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1A1333', marginBottom:3 }}>Gratitude Corner</div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:14 }}>3 things I'm grateful for today</div>
              {gratitude.map((val,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9 }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#6D4AFF,#A78BFA)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>{i+1}</div>
                  <input value={val} onChange={e=>handleGratitude(i,e.target.value)} placeholder={['My family','A beautiful sunset',"My best friend's support"][i]} style={{ flex:1, borderRadius:9, padding:'8px 11px', border:'1.5px solid rgba(109,74,255,0.14)', background:'#FAF7FF', color:'#1A1333', fontSize:12, outline:'none', fontFamily:'inherit', transition:'border-color 0.2s' }} onFocus={e=>e.target.style.borderColor='#6D4AFF'} onBlur={e=>e.target.style.borderColor='rgba(109,74,255,0.14)'}/>
                </div>
              ))}
              <button onClick={() => setGratitude(g=>[...g,''])} style={{ display:'flex', alignItems:'center', gap:5, marginTop:4, background:'none', border:'none', color:'#6D4AFF', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                + Add Another
              </button>
            </div>
          </div>

          {/* ── TODAY'S WIN + HEALING JOURNEY ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>

            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1A1333', marginBottom:3 }}>Today's Win</div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:13 }}>Celebrate your progress</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {WINS.map(w => {
                  const on = wins.includes(w);
                  return (
                    <button key={w} onClick={() => handleWin(w)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, border: on ? '1.5px solid #10B981' : '1.5px solid rgba(109,74,255,0.12)', background: on ? 'rgba(16,185,129,0.08)' : '#FAF7FF', color: on ? '#10B981' : '#4B5563', fontSize:12, fontWeight: on ? 700 : 500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
                      <span style={{ fontSize:13 }}>{on ? '✓' : '○'}</span>{w}
                    </button>
                  );
                })}
              </div>
              {wins.length > 0 && (
                <div style={{ marginTop:14, padding:'9px 13px', borderRadius:11, background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>🏅</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#10B981' }}>{wins.length} achievement{wins.length>1?'s':''} today!</span>
                </div>
              )}
            </div>

            <div className="jcard" style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(109,74,255,0.08)', boxShadow:'0 2px 10px rgba(109,74,255,0.05)' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1A1333', marginBottom:3 }}>Healing Journey</div>
              <div style={{ fontSize:11, color:'#6B7280', marginBottom:22 }}>Your personal growth path</div>
              <div style={{ position:'relative', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ position:'absolute', top:16, left:'10%', right:'10%', height:3, background:'rgba(109,74,255,0.1)', borderRadius:99, zIndex:0 }}/>
                <div style={{ position:'absolute', top:16, left:'10%', height:3, borderRadius:99, zIndex:1, width:`${(stageIdx/4)*80}%`, background:'linear-gradient(90deg,#6D4AFF,#A78BFA)', transition:'width 0.8s ease' }}/>
                {JOURNEY_STAGES.map((s,i) => {
                  const done = i < stageIdx, cur = i === stageIdx;
                  return (
                    <div key={s.key} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, position:'relative', zIndex:2, flex:1 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background: cur ? 'linear-gradient(135deg,#6D4AFF,#A78BFA)' : done ? '#10B981' : '#F3EEFF', border: cur ? '3px solid rgba(109,74,255,0.35)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, animation: cur ? 'glow 2s ease-in-out infinite' : 'none', boxShadow: cur ? '0 4px 16px rgba(109,74,255,0.35)' : done ? '0 2px 8px rgba(16,185,129,0.25)' : 'none', transition:'all 0.3s' }}>
                        {done ? '✓' : s.icon}
                      </div>
                      <div style={{ fontSize:9, fontWeight: cur ? 700 : 500, color: cur ? '#6D4AFF' : done ? '#10B981' : '#9CA3AF', textAlign:'center', lineHeight:1.3 }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'#A78BFA', marginBottom:4 }}>
            ✦ &nbsp;Keep showing up for yourself. You're doing better than you think.&nbsp; ✦
          </p>
        </div>
      </div>

      {/* ═══ RIGHT INSIGHTS PANEL ════════════════════════════════════════════ */}
      <div className="jsc" style={{ background:'#fff', borderLeft:'1px solid rgba(109,74,255,0.1)', overflowY:'auto', padding:'24px 18px' }}>

        {/* Insights */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#1A1333', marginBottom:2 }}>Your Insights</div>
          <div style={{ fontSize:11, color:'#6B7280', marginBottom:14 }}>Based on your last 7 entries</div>
          {insights.map((ins,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${ins.color}12`, border:`1px solid ${ins.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{ins.icon}</div>
              <p style={{ fontSize:12, color:'#4B5563', lineHeight:1.5, margin:0 }}>{ins.text}</p>
            </div>
          ))}
          <button style={{ width:'100%', padding:'9px', borderRadius:11, border:'1.5px solid rgba(109,74,255,0.2)', background:'#fff', color:'#6D4AFF', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            View Full Insights →
          </button>
        </div>

        <div style={{ height:1, background:'rgba(109,74,255,0.08)', marginBottom:20 }}/>

        {/* Recommended */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#6D4AFF', marginBottom:2 }}>Recommended for You</div>
          <div style={{ fontSize:11, color:'#6B7280', marginBottom:14 }}>Based on your reflections</div>
          {[
            { icon:'👥', title:'Anxiety Support Circle', sub:'Share and heal in a safe space with people like you.', badge:'3 spots left', badgeColor:'#EF4444', path:'/groups' },
            { icon:'🫁', title:'2-Min Breathing Exercise', sub:'Calm your mind and reset your day.', path:'/mood' },
            { icon:'✨', title:'Talk to a Guide',         sub:'Get personalized support from our verified healers.', path:'/healers' },
          ].map((r,i) => (
            <div key={i} className="jrec" onClick={() => navigate(r.path)} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10, padding:'11px', borderRadius:13, border:'1px solid rgba(109,74,255,0.08)', background:'#FAF7FF', cursor:'pointer', transition:'all 0.18s' }}>
              <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:'rgba(109,74,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{r.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#1A1333', marginBottom:2 }}>{r.title}</div>
                <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.4 }}>{r.sub}</div>
                {r.badge && <div style={{ display:'inline-block', marginTop:5, fontSize:10, fontWeight:700, color:r.badgeColor, background:`${r.badgeColor}14`, padding:'2px 7px', borderRadius:99 }}>{r.badge}</div>}
              </div>
            </div>
          ))}
          <button onClick={() => navigate('/healers')} style={{ width:'100%', padding:'9px', borderRadius:11, border:'1.5px solid rgba(109,74,255,0.2)', background:'#fff', color:'#6D4AFF', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Explore More →
          </button>
        </div>

        <div style={{ height:1, background:'rgba(109,74,255,0.08)', marginBottom:20 }}/>

        {/* Crisis */}
        <div style={{ borderRadius:16, padding:'18px 16px', background:'linear-gradient(135deg,#FFF0F6,#FFF5F8)', border:'1.5px solid rgba(244,114,182,0.2)' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#BE185D', marginBottom:4 }}>Need immediate support?</div>
          <div style={{ fontSize:12, color:'#6B7280', marginBottom:12, lineHeight:1.5 }}>You're not alone. Help is available.</div>
          <div style={{ fontSize:10, color:'#F472B6', marginBottom:12, lineHeight:1.5 }}>💗 iCall: 9152987821<br/>Vandrevala: 1860-2662-345</div>
          <button onClick={() => navigate('/healers')} style={{ width:'100%', padding:'11px', borderRadius:11, background:'linear-gradient(135deg,#EC4899,#BE185D)', border:'none', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            📞 View Crisis Resources
          </button>
        </div>
      </div>
    </div>
  );
}
