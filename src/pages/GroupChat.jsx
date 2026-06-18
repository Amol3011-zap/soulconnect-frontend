import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth';

// ── Animations style block ─────────────────────────────────────────────────────
const GC_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes gcFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes gcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
  @keyframes gcFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes gcShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  .gc-msg { animation: gcFadeUp 0.3s ease both; }
  .gc-hover:hover { opacity: 0.8; transform: translateY(-1px); transition: all 0.2s; }
  .gc-group-item:hover { background: rgba(255,255,255,0.04) !important; }
  .gc-reaction:hover { background: rgba(109,74,255,0.2) !important; border-color: rgba(109,74,255,0.4) !important; cursor: pointer; }
  .gc-icon-btn:hover { background: rgba(255,255,255,0.1) !important; }
  @media (max-width: 768px) {
    .gc-left-sidebar { display: none !important; }
    .gc-right-sidebar { display: none !important; }
    .gc-left-sidebar.gc-mobile-open { display: flex !important; position: fixed; top: 64px; left: 0; bottom: 0; z-index: 100; width: 280px; }
  }
`;

// ── Deterministic floating particles ──────────────────────────────────────────
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: (5 + (i * 47 + i * i * 11) % 88),
  y: (10 + (i * 31 + i * i * 7) % 80),
  size: 4 + (i % 4) * 1.5,
  color: i % 3 === 0 ? '#F5B841' : i % 3 === 1 ? '#6D4AFF' : '#A78BFA',
  opacity: 0.15 + (i % 4) * 0.05,
  duration: 3 + (i % 5),
  delay: i * 0.4,
}));

// ── Demo groups ────────────────────────────────────────────────────────────────
const DEMO_GROUPS = [
  {
    id: 'g1', name: 'Anxiety Warriors', emoji: '😰',
    problem: 'anxiety', members: 38, online: 12,
    description: 'A safe space to talk about anxiety, panic attacks and overthinking. No judgment — only support.',
    grad: 'linear-gradient(135deg,#7c3aed,#4338ca)',
    color: '#7c3aed',
  },
  {
    id: 'g2', name: 'Breakup Recovery', emoji: '💔',
    problem: 'breakup', members: 52, online: 19,
    description: 'Healing hearts together. Share your story, get support, and rediscover yourself after a breakup.',
    grad: 'linear-gradient(135deg,#be185d,#881337)',
    color: '#be185d',
  },
  {
    id: 'g3', name: 'Depression Support Circle', emoji: '🌧️',
    problem: 'depression', members: 29, online: 8,
    description: 'For those navigating the heavy days. You are not broken — you are human.',
    grad: 'linear-gradient(135deg,#1d4ed8,#1e3a5f)',
    color: '#1d4ed8',
  },
  {
    id: 'g4', name: 'Work Stress Survivors', emoji: '💼',
    problem: 'work_stress', members: 44, online: 15,
    description: 'Burnout, toxic workplaces, career anxiety — talk to people who truly get it.',
    grad: 'linear-gradient(135deg,#d97706,#92400e)',
    color: '#d97706',
  },
  {
    id: 'g5', name: 'Loneliness & Connection', emoji: '🌿',
    problem: 'loneliness', members: 61, online: 23,
    description: 'Finding warmth in community. You belong here — always.',
    grad: 'linear-gradient(135deg,#059669,#065f46)',
    color: '#059669',
  },
  {
    id: 'g6', name: 'Grief & Loss', emoji: '🕯️',
    problem: 'grief', members: 22, online: 6,
    description: 'Processing loss is not linear. Walk this path with others who understand.',
    grad: 'linear-gradient(135deg,#6b7280,#374151)',
    color: '#6b7280',
  },
];

// ── Demo members per group ─────────────────────────────────────────────────────
const MEMBERS = {
  g1: [
    { id: 'm1', name: 'Priya', initials: 'PR', color: '#7c3aed', online: true },
    { id: 'm2', name: 'Arjun', initials: 'AR', color: '#0891b2', online: true },
    { id: 'm3', name: 'Sana',  initials: 'SA', color: '#059669', online: false },
    { id: 'm4', name: 'Dev',   initials: 'DV', color: '#d97706', online: true },
  ],
  g2: [
    { id: 'm5', name: 'Meera', initials: 'ME', color: '#be185d', online: true },
    { id: 'm6', name: 'Ravi',  initials: 'RV', color: '#7c3aed', online: true },
    { id: 'm7', name: 'Isha',  initials: 'IS', color: '#0891b2', online: false },
  ],
  g3: [
    { id: 'm8',  name: 'Aadi',  initials: 'AA', color: '#1d4ed8', online: false },
    { id: 'm9',  name: 'Nikki', initials: 'NK', color: '#059669', online: true },
    { id: 'm10', name: 'Rohan', initials: 'RO', color: '#be185d', online: true },
  ],
  g4: [
    { id: 'm11', name: 'Kabir', initials: 'KB', color: '#d97706', online: true },
    { id: 'm12', name: 'Tara',  initials: 'TR', color: '#7c3aed', online: true },
    { id: 'm13', name: 'Mihir', initials: 'MH', color: '#0891b2', online: false },
  ],
  g5: [
    { id: 'm14', name: 'Aarav', initials: 'AV', color: '#059669', online: true },
    { id: 'm15', name: 'Diya',  initials: 'DY', color: '#be185d', online: true },
    { id: 'm16', name: 'Kiran', initials: 'KR', color: '#d97706', online: true },
  ],
  g6: [
    { id: 'm17', name: 'Anjali', initials: 'AN', color: '#6b7280', online: true },
    { id: 'm18', name: 'Suresh', initials: 'SU', color: '#1d4ed8', online: false },
  ],
};

// ── Reactions list ─────────────────────────────────────────────────────────────
const REACTIONS = [
  { emoji: '🤗', label: 'I Relate' },
  { emoji: '💜', label: 'Sending Support' },
  { emoji: '🌱', label: 'Proud Of You' },
  { emoji: '🙏', label: 'Holding Space' },
  { emoji: '✨', label: 'Inspiring' },
];

// ── Demo seed messages per group ───────────────────────────────────────────────
function seedMessages(groupId) {
  const members = MEMBERS[groupId] || [];
  const seeds = {
    g1: [
      { from: 'm1', text: "Hi everyone 👋 Had a rough morning — my anxiety was through the roof before my presentation." },
      { from: 'm2', text: "I completely understand that feeling. Presentations trigger my panic attacks too. How did it go?" },
      { from: 'm1', text: "Somehow got through it! I used the 4-7-8 breathing. It actually helped a little." },
      { from: 'm4', text: "That technique is amazing. I've been using it for 3 months now. Game changer honestly 💜" },
      { from: 'm3', text: "Proud of you for pushing through! That takes so much courage when anxiety is loud." },
    ],
    g2: [
      { from: 'm5', text: "Day 14 without talking to him. It's getting both easier and harder at the same time. Is that normal?" },
      { from: 'm6', text: "Completely normal. The healing isn't linear. Some days feel like progress, others feel like day 1 again." },
      { from: 'm7', text: "I'm on day 47. It does get better. I promise. But be gentle with yourself right now 💙" },
      { from: 'm5', text: "Thank you both. I needed to hear that today more than you know." },
      { from: 'm6', text: "We're all here for each other. That's what this group is for ❤️" },
    ],
    g3: [
      { from: 'm9', text: "Does anyone else find it really hard to get out of bed on some days? Like genuinely physically hard?" },
      { from: 'm10', text: "Every single day. You're not lazy. It's the depression — it literally makes everything heavier." },
      { from: 'm8', text: "What helped me a little was just committing to one tiny thing. Just one. Make tea. Open a window." },
      { from: 'm9', text: "One thing. Okay. I can try that. Thank you 🌧️" },
      { from: 'm10', text: "Update us when you do it. We want to celebrate even the small wins with you." },
    ],
    g4: [
      { from: 'm11', text: "My manager sent a passive-aggressive email at 11pm again. I feel like I can't breathe." },
      { from: 'm12', text: "That is NOT okay. Boundaries matter. Your mental health matters more than their deadline." },
      { from: 'm13', text: "I left a job like that 6 months ago. Best decision of my life. You deserve better." },
      { from: 'm11', text: "I keep telling myself it'll change. But it never does." },
      { from: 'm12', text: "Your time and energy are valuable. Please don't let them convince you otherwise 💼" },
    ],
    g5: [
      { from: 'm14', text: "Moved to a new city 3 months ago and still haven't made a single friend. It's isolating." },
      { from: 'm15', text: "I moved cities 2 years ago. The first few months were the loneliest of my life. You're not alone." },
      { from: 'm16', text: "It takes time but you will find your people. Finding a hobby group helped me a lot 🌿" },
      { from: 'm14', text: "Maybe I should try that. I love hiking but always go alone." },
      { from: 'm15', text: "There are hiking groups in most cities! And honestly this group is full of lovely people too 🫂" },
    ],
    g6: [
      { from: 'm17', text: "Lost my mom 4 months ago. Some days I forget she's gone and then I remember. That moment is unbearable." },
      { from: 'm18', text: "I know that moment all too well. I'm so sorry for your loss. How are you holding up today?" },
      { from: 'm17', text: "Not well but I'm here. I didn't want to be alone with it today." },
      { from: 'm18', text: "You don't have to be. We're here. All of us. Take all the space you need 🕯️" },
    ],
  };

  const now = Date.now();
  return (seeds[groupId] || []).map((msg, i) => {
    const member = members.find(m => m.id === msg.from);
    const reaction = REACTIONS[i % REACTIONS.length];
    return {
      id: `seed_${i}`,
      from: msg.from,
      senderName: member?.name || 'Member',
      senderInitials: member?.initials || 'M',
      senderColor: member?.color || '#7c3aed',
      text: msg.text,
      time: new Date(now - (seeds[groupId].length - i) * 4 * 60000),
      isMe: false,
      reaction: { ...reaction, count: 10 + ((i * 13 + 7) % 31) },
    };
  });
}

// ── Group reply bot ────────────────────────────────────────────────────────────
function getGroupReply(groupId, userText) {
  const members = MEMBERS[groupId] || [];
  const responder = members[Math.floor(Math.random() * members.length)];
  const lower = userText.toLowerCase();

  const replies = {
    positive: [
      "That's so good to hear! 🙌 Progress looks different every day.",
      "Yes!! This is the energy we love to see here 💜",
      "Thank you for sharing this — it genuinely made my day better.",
      "This is exactly why this group exists. So happy for you ✨",
    ],
    negative: [
      "I hear you. That sounds really hard. We're all here with you 💙",
      "Thank you for trusting us with this. You don't have to carry it alone.",
      "Sending you so much warmth right now 🫂 Some days are just hard.",
      "I've been there too. It does pass. You're stronger than you think.",
    ],
    question: [
      "That's such a great question. I've wondered the same thing honestly.",
      "For me personally, what helped was just taking it one hour at a time.",
      "Has anyone tried journaling for this? It helped me process similar feelings.",
      "I think it really depends on the person — what works for one might not for another. But keep asking 💜",
    ],
    default: [
      "Thank you for sharing that with us. Really 🙏",
      "This group is so lucky to have someone as open as you.",
      "I really relate to what you said. You put it into words I couldn't.",
      "Same here honestly. It helps knowing others feel this way too.",
      "Sending love 💙 You're in the right place.",
    ],
  };

  let pool = replies.default;
  if (lower.includes('good') || lower.includes('better') || lower.includes('happy') || lower.includes('progress')) pool = replies.positive;
  else if (lower.includes('bad') || lower.includes('sad') || lower.includes('hard') || lower.includes('pain') || lower.includes('alone')) pool = replies.negative;
  else if (lower.endsWith('?') || lower.includes('how') || lower.includes('what') || lower.includes('anyone')) pool = replies.question;

  return {
    senderName: responder?.name || 'Member',
    senderInitials: responder?.initials || 'M',
    senderColor: responder?.color || '#7c3aed',
    text: pool[Math.floor(Math.random() * pool.length)],
  };
}

// ── PROBLEM OPTIONS ────────────────────────────────────────────────────────────
const PROBLEM_OPTIONS = [
  { value: 'anxiety',    label: 'Anxiety & Panic',     emoji: '😰' },
  { value: 'depression', label: 'Depression',           emoji: '🌧️' },
  { value: 'breakup',    label: 'Breakup & Heartbreak', emoji: '💔' },
  { value: 'loneliness', label: 'Loneliness',           emoji: '🌿' },
  { value: 'work_stress',label: 'Work Stress',          emoji: '💼' },
  { value: 'grief',      label: 'Grief & Loss',         emoji: '🕯️' },
  { value: 'anger',      label: 'Anger Management',     emoji: '😤' },
  { value: 'confidence', label: 'Confidence',           emoji: '📉' },
  { value: 'sleep',      label: 'Sleep Problems',       emoji: '😴' },
  { value: 'trauma',     label: 'Trauma & PTSD',        emoji: '⚠️' },
];

// ── Create Group Modal ─────────────────────────────────────────────────────────
function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [problem, setProblem] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim()) { setError('Group name is required'); return; }
    if (!problem) { setError('Please select a topic'); return; }
    const chosen = PROBLEM_OPTIONS.find(p => p.value === problem);
    onCreate({
      id: `g_custom_${Date.now()}`,
      name: name.trim(),
      emoji: chosen?.emoji || '💬',
      problem,
      members: 1,
      online: 1,
      description: description.trim() || `A support group for ${chosen?.label}.`,
      grad: 'linear-gradient(135deg,#6D4AFF,#5B21B6)',
      color: '#6D4AFF',
      isNew: true,
    });
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#140A38',
        border: '1px solid rgba(109,74,255,0.3)',
        borderRadius: 24, padding: 28,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}>
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: 0 }}>Create a Healing Circle</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>Start a safe space for others</p>
          </div>
          <button onClick={onClose} className="gc-icon-btn" style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Group name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
            GROUP NAME
          </label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Mumbai Anxiety Circle"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(109,74,255,0.25)',
              color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            }}
          />
        </div>

        {/* Topic */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
            TOPIC / PROBLEM AREA
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PROBLEM_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setProblem(opt.value)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                background: problem === opt.value ? 'rgba(109,74,255,0.2)' : 'rgba(255,255,255,0.04)',
                border: problem === opt.value ? '1px solid #6D4AFF' : '1px solid rgba(255,255,255,0.08)',
                color: problem === opt.value ? '#A78BFA' : 'rgba(255,255,255,0.5)',
                fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              }}>
                <span style={{ fontSize: 14 }}>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>
            DESCRIPTION <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: 11 }}>(optional)</span>
          </label>
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            placeholder="What's this group about? Who should join?"
            rows={2}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(109,74,255,0.25)',
              color: '#fff', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box',
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            }}
          />
        </div>

        {error && <p style={{ color: '#F472B6', fontSize: 12, marginBottom: 12 }}>{error}</p>}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex: 1, padding: '12px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)', border: 'none', color: '#fff',
            boxShadow: '0 4px 20px rgba(109,74,255,0.4)',
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}>Create Circle 🚀</button>
        </div>
      </div>
    </div>
  );
}

// ── Lotus SVG ──────────────────────────────────────────────────────────────────
function LotusIcon({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="22" cy="28" rx="6" ry="8" fill="rgba(109,74,255,0.5)" />
      <ellipse cx="14" cy="24" rx="5" ry="7" fill="rgba(109,74,255,0.35)" transform="rotate(-25 14 24)" />
      <ellipse cx="30" cy="24" rx="5" ry="7" fill="rgba(109,74,255,0.35)" transform="rotate(25 30 24)" />
      <ellipse cx="9" cy="27" rx="4" ry="6" fill="rgba(167,139,250,0.25)" transform="rotate(-45 9 27)" />
      <ellipse cx="35" cy="27" rx="4" ry="6" fill="rgba(167,139,250,0.25)" transform="rotate(45 35 27)" />
      <ellipse cx="22" cy="22" rx="3" ry="3" fill="#F5B841" />
      <ellipse cx="22" cy="19" rx="1.5" ry="2" fill="#F5B841" opacity="0.7" />
    </svg>
  );
}

// ── Meditation figure SVG ──────────────────────────────────────────────────────
function MeditationFigure({ size = 50 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" fill="rgba(109,74,255,0.1)" />
      <circle cx="25" cy="25" r="14" fill="rgba(109,74,255,0.07)" />
      <circle cx="25" cy="14" r="4" fill="rgba(167,139,250,0.7)" />
      <path d="M25 18 Q18 26 20 32 Q25 34 30 32 Q32 26 25 18Z" fill="rgba(167,139,250,0.5)" />
      <path d="M18 26 Q14 30 16 33" stroke="rgba(167,139,250,0.5)" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 26 Q36 30 34 33" stroke="rgba(167,139,250,0.5)" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="25" cy="38" rx="8" ry="2" fill="rgba(109,74,255,0.3)" />
      <circle cx="25" cy="25" r="18" stroke="rgba(109,74,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// ── Typing Indicator ───────────────────────────────────────────────────────────
function TypingIndicator({ name, color }) {
  return (
    <div className="gc-msg" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '4px 0' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: color || '#6D4AFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>{name[0]}</div>
      <div>
        <div style={{
          background: 'rgba(27,13,78,0.7)',
          border: '1px solid rgba(109,74,255,0.15)',
          borderRadius: '4px 18px 18px 18px',
          padding: '12px 16px',
          display: 'flex', gap: 5, alignItems: 'center',
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%', background: '#A78BFA',
              animation: `gcPulse 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '4px 0 0 4px' }}>{name} is typing...</p>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function GroupChat() {
  const { user } = useAuthStore();
  const myName = user?.name || 'You';
  const myInitials = myName.slice(0, 2).toUpperCase();

  const [groups, setGroups] = useState(DEMO_GROUPS);
  const [activeGroup, setActiveGroup] = useState(DEMO_GROUPS[0]);
  const [chatHistory, setChatHistory] = useState({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingName, setTypingName] = useState('');
  const [typingColor, setTypingColor] = useState('#6D4AFF');
  const [showCreate, setShowCreate] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState(new Set(['g1']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [showCheckin, setShowCheckin] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showUpcomingCircle, setShowUpcomingCircle] = useState(true);
  const [showPeopleSimilar, setShowPeopleSimilar] = useState(true);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);

  const MOODS = [
    { emoji: '🙂', label: 'Calm', count: 7 },
    { emoji: '😰', label: 'Anxious', count: 43 },
    { emoji: '😔', label: 'Sad', count: 12 },
    { emoji: '😴', label: 'Exhausted', count: 8 },
    { emoji: '💔', label: 'Overwhelmed', count: 5 },
    { emoji: '😤', label: 'Stressed', count: 11 },
  ];

  const COMMUNITY_ENERGY = [
    { emoji: '😌', label: 'Calm', pct: 42, color: '#34C38F' },
    { emoji: '🌟', label: 'Hopeful', pct: 31, color: '#00D4AA' },
    { emoji: '😰', label: 'Anxious', pct: 18, color: '#F5B841' },
    { emoji: '💔', label: 'Overwhelmed', pct: 9, color: '#F472B6' },
  ];

  const SIMILAR_PEOPLE = [
    { initials: 'KA', color: '#6D4AFF' },
    { initials: 'PR', color: '#F472B6' },
    { initials: 'SO', color: '#34C38F' },
    { initials: 'MV', color: '#F5B841' },
  ];

  // Seed initial messages
  useEffect(() => {
    const init = {};
    DEMO_GROUPS.forEach(g => { init[g.id] = seedMessages(g.id); });
    setChatHistory(init);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, typing, activeGroup]);

  const openGroup = (group) => {
    setActiveGroup(group);
  };

  const joinGroup = (groupId) => {
    setJoinedGroups(prev => new Set([...prev, groupId]));
  };

  const sendMessage = () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput('');
    const myMsg = {
      id: Date.now(),
      from: 'me',
      senderName: isAnonymous ? 'Anonymous' : myName,
      senderInitials: isAnonymous ? 'AN' : myInitials,
      senderColor: isAnonymous ? '#6D4AFF' : '#6D4AFF',
      text,
      time: new Date(),
      isMe: true,
      reaction: null,
    };
    setChatHistory(prev => ({
      ...prev,
      [activeGroup.id]: [...(prev[activeGroup.id] || []), myMsg],
    }));

    const delay = 1500 + Math.random() * 2000;
    const reply = getGroupReply(activeGroup.id, text);
    setTyping(true);
    setTypingName(reply.senderName);
    setTypingColor(reply.senderColor);
    setTimeout(() => {
      setTyping(false);
      setTypingName('');
      setTypingColor('#6D4AFF');
      const reactionIdx = Math.floor(Math.random() * REACTIONS.length);
      setChatHistory(prev => ({
        ...prev,
        [activeGroup.id]: [...(prev[activeGroup.id] || []), {
          id: Date.now() + 1,
          from: `bot_${reply.senderName}`,
          senderName: reply.senderName,
          senderInitials: reply.senderInitials,
          senderColor: reply.senderColor,
          text: reply.text,
          time: new Date(),
          isMe: false,
          reaction: { ...REACTIONS[reactionIdx], count: 10 + Math.floor(Math.random() * 31) },
        }],
      }));
    }, delay);
  };

  const handleCreate = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    setChatHistory(prev => ({ ...prev, [newGroup.id]: [] }));
    setJoinedGroups(prev => new Set([...prev, newGroup.id]));
    setActiveGroup(newGroup);
    setShowCreate(false);
  };

  const messages = chatHistory[activeGroup?.id] || [];
  const fmt = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isJoined = joinedGroups.has(activeGroup?.id);

  return (
    <>
      <style>{GC_STYLES}</style>

      {/* Floating particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            animation: `gcFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* Root layout */}
      <div style={{
        display: 'flex', height: 'calc(100vh - 64px)', marginTop: 64,
        background: '#0B0420', overflow: 'hidden', position: 'relative', zIndex: 1,
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}>

        {/* ══ LEFT SIDEBAR ═══════════════════════════════════════════════════════ */}
        <div className="gc-left-sidebar" style={{
          width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: '#0D0525', borderRight: '1px solid rgba(109,74,255,0.15)',
          height: '100%', overflowY: 'auto',
        }}>
          {/* Sidebar header */}
          <div style={{ padding: '20px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>Your Healing Circles</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Find your people</p>
              </div>
              <button onClick={() => setShowCreate(true)} className="gc-hover" style={{
                background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                border: 'none', borderRadius: 10, color: '#fff',
                fontSize: 12, fontWeight: 700, padding: '6px 12px', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>+ New</button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: 'rgba(255,255,255,0.3)',
              }}>🔍</span>
              <input
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search circles..."
                style={{
                  width: '100%', padding: '10px 12px 10px 34px', borderRadius: 12, boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(109,74,255,0.2)',
                  color: '#fff', fontSize: 13, outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                }}
              />
            </div>
          </div>

          {/* Group list */}
          <div style={{ flex: 1, padding: '0 8px 12px' }}>
            {filteredGroups.map(g => {
              const isActive = activeGroup?.id === g.id;
              const joined = joinedGroups.has(g.id);
              return (
                <button key={g.id} onClick={() => openGroup(g)}
                  className={isActive ? '' : 'gc-group-item'}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 10px', borderRadius: 14, marginBottom: 2,
                    textAlign: 'left', cursor: 'pointer', border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(109,74,255,0.2), rgba(167,139,250,0.1))'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid #6D4AFF' : '3px solid transparent',
                    transition: 'all 0.15s',
                    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  }}>
                  {/* Group emoji circle */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: g.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15,
                  }}>{g.emoji}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        maxWidth: 120,
                      }}>{g.name}</span>
                      {joined && isActive && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                          background: 'rgba(109,74,255,0.25)', color: '#A78BFA', flexShrink: 0,
                        }}>JOINED</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{g.members} members</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>•</span>
                      <span style={{ color: '#34C38F', fontSize: 11 }}>{g.online} online</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Healing Streak card */}
          <div style={{
            margin: '0 12px 16px',
            background: 'linear-gradient(135deg, #1B0D4E, #2A1060)',
            border: '1px solid rgba(245,184,65,0.25)',
            borderRadius: 20, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <span style={{ color: '#F5B841', fontWeight: 700, fontSize: 13 }}>Healing Streak</span>
                </div>
                <div style={{ color: '#F5B841', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>14 days</div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '6px 0 0' }}>
                  Keep showing up for yourself
                </p>
              </div>
              <LotusIcon size={44} />
            </div>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[0,1,2,3,4,5,6].map(dot => (
                <div key={dot} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: dot < 6 ? '#F5B841' : 'rgba(245,184,65,0.2)',
                  border: dot >= 6 ? '1px solid rgba(245,184,65,0.4)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* ══ CENTER CHAT ════════════════════════════════════════════════════════ */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: '#0B0420', minWidth: 0, height: '100%', overflow: 'hidden',
        }}>
          {/* Circle header — sticky */}
          <div style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 20px',
            background: 'rgba(11,4,32,0.95)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(109,74,255,0.15)',
            zIndex: 10,
          }}>
            {/* Emoji */}
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: activeGroup?.grad,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{activeGroup?.emoji}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{activeGroup?.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  {activeGroup?.members} members •
                </span>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#34C38F',
                  animation: 'gcPulse 2s ease-in-out infinite',
                }} />
                <span style={{ color: '#34C38F', fontSize: 12 }}>{activeGroup?.online} online</span>
              </div>
            </div>

            {/* Action icon buttons */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['ℹ️', '👥', '⋯'].map(icon => (
                <button key={icon} className="gc-icon-btn" style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  color: 'rgba(255,255,255,0.6)', fontSize: icon === '⋯' ? 16 : 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Scrollable messages area */}
          <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Emotional Check-in card */}
            <div style={{ margin: 16, marginBottom: 0 }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(27,13,78,0.85), rgba(20,10,56,0.9))',
                border: '1px solid rgba(109,74,255,0.3)', borderRadius: 20, padding: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>
                      How are you feeling right now?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>
                      Your feelings matter. Share anonymously.
                    </p>
                  </div>
                  <button onClick={() => setShowCheckin(v => !v)} style={{
                    background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
                    color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer',
                    padding: '4px 8px',
                  }}>{showCheckin ? '▲' : '▼'}</button>
                </div>

                {showCheckin && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                    {MOODS.map(mood => {
                      const isSelected = selectedMood === mood.label;
                      return (
                        <button key={mood.label} onClick={() => setSelectedMood(isSelected ? null : mood.label)}
                          style={{
                            padding: '10px 16px', borderRadius: 12, cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                            background: isSelected ? 'rgba(109,74,255,0.2)' : 'rgba(255,255,255,0.05)',
                            border: isSelected ? '1px solid #6D4AFF' : '1px solid rgba(255,255,255,0.1)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 0 12px rgba(109,74,255,0.3)' : 'none',
                            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                          }}>
                          <span style={{ fontSize: 18 }}>{mood.emoji}</span>
                          <span style={{ color: isSelected ? '#A78BFA' : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600 }}>
                            {mood.label}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{mood.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Daily Reflection card */}
            <div style={{ margin: '12px 16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(20,10,56,0.8), rgba(27,13,78,0.7))',
                border: '1px solid rgba(109,74,255,0.25)', borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 15 }}>🌱</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#A78BFA' }}>Daily Reflection</span>
                  </div>
                  <p style={{ color: '#fff', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                    "What's one small thing you're proud of yourself for today?"
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '4px 0 0' }}>
                    Share openly or anonymously
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>128 shared today</span>
                  <div style={{ display: 'flex' }}>
                    {[{ c: '#6D4AFF', i: 'KA' }, { c: '#F472B6', i: 'PR' }, { c: '#34C38F', i: 'SO' }, { c: '#F5B841', i: 'MV' }].map((av, idx) => (
                      <div key={idx} style={{
                        width: 22, height: 22, borderRadius: '50%', background: av.c,
                        border: '1.5px solid #0B0420',
                        marginLeft: idx === 0 ? 0 : -7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, fontWeight: 700, color: '#fff',
                        zIndex: 4 - idx,
                      }}>{av.i[0]}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages list */}
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((msg, i) => {
                const isMe = msg.isMe;
                const showSender = !isMe && (i === 0 || messages[i - 1]?.from !== msg.from || messages[i - 1]?.isMe);
                return (
                  <div key={msg.id} className="gc-msg" style={{
                    display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row',
                    alignItems: 'flex-start', gap: 10,
                  }}>
                    {/* Avatar */}
                    {!isMe && (
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: msg.senderColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                        opacity: showSender ? 1 : 0,
                        marginTop: showSender ? 0 : 0,
                      }}>{msg.senderInitials[0]}</div>
                    )}

                    <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      {/* Sender name + time */}
                      {showSender && !isMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ color: msg.senderColor, fontWeight: 700, fontSize: 12 }}>{msg.senderName}</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{fmt(msg.time)}</span>
                        </div>
                      )}
                      {isMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{fmt(msg.time)}</span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        background: isMe
                          ? 'linear-gradient(135deg, rgba(109,74,255,0.35), rgba(91,33,182,0.25))'
                          : 'rgba(27,13,78,0.7)',
                        border: '1px solid rgba(109,74,255,0.15)',
                        color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.6,
                      }}>{msg.text}</div>

                      {/* Reaction pill */}
                      {msg.reaction && (
                        <div className="gc-reaction" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          marginTop: 6,
                          padding: '3px 8px', borderRadius: 20,
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: 11, color: 'rgba(255,255,255,0.5)',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span>{msg.reaction.emoji}</span>
                          <span>{msg.reaction.label}</span>
                          <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 2 }}>{msg.reaction.count}</span>
                        </div>
                      )}
                    </div>

                    {/* Own avatar */}
                    {isMe && (
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                        marginTop: 0,
                      }}>{myInitials}</div>
                    )}
                  </div>
                );
              })}

              {typing && <TypingIndicator name={typingName} color={typingColor} />}

              {/* Join prompt if not joined */}
              {!isJoined && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(27,13,78,0.6)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(109,74,255,0.2)', borderRadius: 20,
                    padding: '20px 28px',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{activeGroup?.emoji}</div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{activeGroup?.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 14px', maxWidth: 260 }}>
                      {activeGroup?.description}
                    </p>
                    <button onClick={() => joinGroup(activeGroup?.id)} style={{
                      background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                      border: 'none', borderRadius: 12, color: '#fff',
                      fontSize: 13, fontWeight: 700, padding: '10px 24px', cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(109,74,255,0.4)',
                    }}>Join this circle</button>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Chat input bar */}
          <div style={{
            flexShrink: 0,
            background: 'rgba(11,4,32,0.97)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(109,74,255,0.15)', padding: '12px 16px',
          }}>
            {isJoined ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Anonymous toggle */}
                  <button onClick={() => setIsAnonymous(v => !v)} style={{
                    padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    background: isAnonymous ? 'rgba(109,74,255,0.25)' : 'rgba(255,255,255,0.06)',
                    color: isAnonymous ? '#A78BFA' : 'rgba(255,255,255,0.4)',
                    fontSize: 12, fontWeight: 600, flexShrink: 0, transition: 'all 0.2s',
                    fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                  }}>👤 Anonymous</button>

                  {/* Input field + emoji icons */}
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Share your thoughts... (You're in a safe space)"
                      style={{
                        flex: 1, padding: '12px 80px 12px 16px', borderRadius: 20, border: 'none', outline: 'none',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(109,74,255,0.2)',
                        color: '#fff', fontSize: 14,
                        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                        width: '100%', boxSizing: 'border-box',
                      }}
                    />
                    <div style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2 }}>😊</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 2 }}>💜</button>
                    </div>
                  </div>

                  {/* Send button */}
                  <button onClick={sendMessage} disabled={!input.trim() || typing} style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                    border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(109,74,255,0.5)',
                    opacity: input.trim() && !typing ? 1 : 0.4,
                    transition: 'all 0.2s',
                  }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '8px 0 0' }}>
                  🔒 Anonymous &amp; safe • Be kind, be real
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 10px' }}>
                  Join this circle to participate in the conversation
                </p>
                <button onClick={() => joinGroup(activeGroup?.id)} style={{
                  background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                  border: 'none', borderRadius: 14, color: '#fff',
                  fontSize: 14, fontWeight: 700, padding: '10px 28px', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(109,74,255,0.4)',
                }}>Join Circle</button>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT SIDEBAR ══════════════════════════════════════════════════════ */}
        <div className="gc-right-sidebar" style={{
          width: 300, flexShrink: 0,
          background: '#0D0525', borderLeft: '1px solid rgba(109,74,255,0.15)',
          overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* Card 1 — Community Energy */}
          <div style={{
            background: 'rgba(27,13,78,0.6)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(109,74,255,0.2)', borderRadius: 22, padding: 18,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>Community Energy</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '3px 0 0' }}>Live mood of the circle</p>
              </div>
              <LotusIcon size={32} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COMMUNITY_ENERGY.map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{item.emoji}</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{item.label}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{
                      height: '100%', borderRadius: 3, background: item.color,
                      width: `${item.pct}%`, transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Upcoming Circle */}
          {showUpcomingCircle && (
            <div style={{
              background: 'rgba(27,13,78,0.6)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(109,74,255,0.2)', borderRadius: 22, padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>Upcoming Circle</h3>
                <button onClick={() => setShowUpcomingCircle(false)} className="gc-icon-btn" style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
                  width: 24, height: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(109,74,255,0.15), rgba(20,10,56,0.8))',
                borderRadius: 14, padding: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>🌙</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Breathwork Session</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Tonight • 8:00 PM</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '2px 0 0' }}>with Maya</p>
                  </div>
                  <MeditationFigure size={50} />
                </div>

                {/* Going avatars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ display: 'flex' }}>
                    {[{ c: '#6D4AFF', i: 'A' }, { c: '#F472B6', i: 'B' }, { c: '#34C38F', i: 'C' }].map((av, idx) => (
                      <div key={idx} style={{
                        width: 22, height: 22, borderRadius: '50%', background: av.c,
                        border: '1.5px solid #1B0D4E', marginLeft: idx === 0 ? 0 : -7,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: '#fff',
                      }}>{av.i}</div>
                    ))}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>12 going</span>
                </div>

                <button style={{
                  width: '100%', padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)', color: '#fff',
                  fontSize: 13, fontWeight: 700, boxShadow: '0 4px 14px rgba(109,74,255,0.35)',
                  fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
                }}>Join Circle</button>
              </div>
            </div>
          )}

          {/* Card 3 — People Similar To You */}
          {showPeopleSimilar && (
            <div style={{
              background: 'rgba(27,13,78,0.6)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(109,74,255,0.2)', borderRadius: 22, padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>People Similar To You</h3>
                <button onClick={() => setShowPeopleSimilar(false)} className="gc-icon-btn" style={{
                  background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%',
                  width: 24, height: 24, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 14px' }}>
                Connect with others on a similar journey
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex' }}>
                  {SIMILAR_PEOPLE.map((av, idx) => (
                    <div key={idx} style={{
                      width: 40, height: 40, borderRadius: '50%', background: av.c,
                      border: '2px solid #0D0525', marginLeft: idx === 0 ? 0 : -10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                    }}>{av.initials[0]}</div>
                  ))}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '2px solid #0D0525',
                  marginLeft: -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                }}>+6</div>
              </div>

              <button style={{
                width: '100%', padding: '10px', borderRadius: 12, cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(109,74,255,0.4)',
                color: '#A78BFA', fontSize: 13, fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
              }}>Find My Match</button>
            </div>
          )}

          {/* Card 4 — Need Support Right Now */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.1), rgba(109,74,255,0.1))',
            border: '1px solid rgba(244,114,182,0.2)', borderRadius: 22, padding: 18,
          }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 13, margin: '0 0 6px' }}>
              Need Support Right Now?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 14px' }}>
              You're not alone. Help is always here.
            </p>
            <button style={{
              width: '100%', padding: '10px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(109,74,255,0.2)', border: '1px solid rgba(109,74,255,0.4)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            }}>🎧 Crisis Resources</button>
          </div>
        </div>
      </div>

      {/* Create group modal */}
      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </>
  );
}
