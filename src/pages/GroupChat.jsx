import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth';

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
    return {
      id: `seed_${i}`,
      from: msg.from,
      senderName: member?.name || 'Member',
      senderInitials: member?.initials || 'M',
      senderColor: member?.color || '#7c3aed',
      text: msg.text,
      time: new Date(now - (seeds[groupId].length - i) * 4 * 60000),
      isMe: false,
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

// ── Create Group Modal ─────────────────────────────────────────────────────────
const PROBLEM_OPTIONS = [
  { value: 'anxiety',    label: 'Anxiety & Panic',    emoji: '😰' },
  { value: 'depression', label: 'Depression',          emoji: '🌧️' },
  { value: 'breakup',    label: 'Breakup & Heartbreak',emoji: '💔' },
  { value: 'loneliness', label: 'Loneliness',          emoji: '🌿' },
  { value: 'work_stress',label: 'Work Stress',         emoji: '💼' },
  { value: 'grief',      label: 'Grief & Loss',        emoji: '🕯️' },
  { value: 'anger',      label: 'Anger Management',    emoji: '😤' },
  { value: 'confidence', label: 'Confidence',          emoji: '📉' },
  { value: 'sleep',      label: 'Sleep Problems',      emoji: '😴' },
  { value: 'trauma',     label: 'Trauma & PTSD',       emoji: '⚠️' },
];

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
      grad: 'linear-gradient(135deg,#7c3aed,#2563eb)',
      color: '#7c3aed',
      isNew: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Create a Group</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-sm hover:opacity-60" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Group Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mumbai Anxiety Circle"
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }} />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Topic / Problem Area</label>
            <div className="grid grid-cols-2 gap-2">
              {PROBLEM_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setProblem(opt.value)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium transition-all border"
                  style={problem === opt.value
                    ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1))', borderColor: '#7c3aed', color: '#7c3aed' }
                    : { background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  <span>{opt.emoji}</span><span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What's this group about? Who should join?"
              rows={2} className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }} />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
              Cancel
            </button>
            <button onClick={submit} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              Create Group 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator({ name }) {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shrink-0"
        style={{ background: '#7c3aed' }}>{name[0]}</div>
      <div className="px-3 py-2 rounded-2xl rounded-bl-md" style={{ background: 'var(--bg-subtle)' }}>
        <div className="flex gap-1 items-center h-3">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{name} is typing...</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
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
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat' | 'info'
  const [showCreate, setShowCreate] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState(new Set(['g1']));
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef(null);

  // Seed initial messages
  useEffect(() => {
    const init = {};
    DEMO_GROUPS.forEach(g => { init[g.id] = seedMessages(g.id); });
    setChatHistory(init);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typing, activeGroup]);

  const openGroup = (group) => {
    setActiveGroup(group);
    setMobileView('chat');
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
      senderName: myName,
      senderInitials: myInitials,
      senderColor: '#7c3aed',
      text,
      time: new Date(),
      isMe: true,
    };
    setChatHistory(prev => ({
      ...prev,
      [activeGroup.id]: [...(prev[activeGroup.id] || []), myMsg],
    }));

    // Simulate a group member replying
    const delay = 1500 + Math.random() * 2000;
    const reply = getGroupReply(activeGroup.id, text);
    setTyping(true);
    setTypingName(reply.senderName);
    setTimeout(() => {
      setTyping(false);
      setTypingName('');
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
        }],
      }));
    }, delay);
  };

  const handleCreate = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    setChatHistory(prev => ({ ...prev, [newGroup.id]: [] }));
    setJoinedGroups(prev => new Set([...prev, newGroup.id]));
    setActiveGroup(newGroup);
    setMobileView('chat');
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
    <div className="flex overflow-hidden" style={{ height: '100dvh', background: 'var(--bg)' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div className={`flex-col w-full md:w-80 shrink-0 border-r ${mobileView !== 'list' ? 'hidden md:flex' : 'flex'}`}
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

        {/* Header */}
        <div className="px-4 pb-3" style={{ paddingTop: 'max(env(safe-area-inset-top,0px),20px)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-bold text-base" style={{ color: 'var(--text)' }}>Group Chats</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Find your people</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              + New
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }} />
          </div>
        </div>

        {/* Group list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filteredGroups.map(g => {
            const isActive = activeGroup?.id === g.id;
            const joined = joinedGroups.has(g.id);
            return (
              <button key={g.id} onClick={() => openGroup(g)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 text-left transition-all"
                style={{
                  background: isActive ? 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))' : 'transparent',
                  border: isActive ? '1.5px solid rgba(124,58,237,0.2)' : '1.5px solid transparent',
                }}>
                {/* Group avatar */}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: g.grad }}>
                  {g.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{g.name}</span>
                    {joined && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1"
                        style={{ background: 'rgba(5,150,105,0.12)', color: '#059669' }}>JOINED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{g.members} members</span>
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                    <span className="text-xs text-green-500">{g.online} online</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>

        {/* Chat header */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', paddingTop: 'max(env(safe-area-inset-top,0px),12px)' }}>
          <button onClick={() => setMobileView('list')}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-lg active:scale-90 mr-1"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
            ‹
          </button>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: activeGroup?.grad }}>
            {activeGroup?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{activeGroup?.name}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {activeGroup?.members} members · {activeGroup?.online} online now
            </p>
          </div>
          {/* Members row */}
          <div className="hidden sm:flex items-center -space-x-1.5">
            {(MEMBERS[activeGroup?.id] || []).slice(0, 4).map(m => (
              <div key={m.id} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs text-white font-bold"
                style={{ background: m.color, borderColor: 'var(--bg-card)' }}>
                {m.initials[0]}
              </div>
            ))}
            {activeGroup?.members > 4 && (
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)', borderColor: 'var(--bg-card)' }}>
                +{activeGroup.members - 4}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
          {/* Group info banner */}
          <div className="mx-4 my-3 px-4 py-3 rounded-2xl text-center"
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <div className="text-2xl mb-1">{activeGroup?.emoji}</div>
            <p className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{activeGroup?.name}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{activeGroup?.description}</p>
            {!isJoined && (
              <button onClick={() => joinGroup(activeGroup.id)}
                className="mt-3 px-5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg,${activeGroup?.color},#2563eb)` }}>
                Join this group
              </button>
            )}
            {isJoined && (
              <p className="mt-2 text-xs font-semibold" style={{ color: '#059669' }}>✓ You're a member</p>
            )}
          </div>

          {/* Messages list */}
          <div className="px-4 pb-4 space-y-3">
            {messages.map((msg, i) => {
              const isMe = msg.isMe;
              const showSender = !isMe && (i === 0 || messages[i-1]?.from !== msg.from || messages[i-1]?.isMe);
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: msg.senderColor, opacity: showSender ? 1 : 0 }}>
                      {msg.senderInitials[0]}
                    </div>
                  )}
                  <div className="max-w-[72%]">
                    {showSender && !isMe && (
                      <p className="text-xs font-semibold mb-0.5 ml-1" style={{ color: msg.senderColor }}>{msg.senderName}</p>
                    )}
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${isMe ? 'rounded-3xl rounded-br-md' : 'rounded-3xl rounded-bl-md'}`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: 'white' }
                        : { background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-0.5 px-1 opacity-50 ${isMe ? 'text-right' : ''}`} style={{ color: 'var(--text-muted)' }}>
                      {fmt(msg.time)}
                    </p>
                  </div>
                </div>
              );
            })}
            {typing && <TypingIndicator name={typingName} />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        {isJoined ? (
          <div className="shrink-0 px-4 pt-3 border-t"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', paddingBottom: 'max(env(safe-area-inset-bottom,0px),12px)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                {myInitials}
              </div>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder={`Message ${activeGroup?.name}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl text-sm focus:outline-none"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }} />
              <button onClick={sendMessage} disabled={!input.trim() || typing}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              🔒 Anonymous & safe · Be kind, be real
            </p>
          </div>
        ) : (
          <div className="shrink-0 px-4 py-4 border-t text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Join this group to participate in the conversation</p>
            <button onClick={() => joinGroup(activeGroup?.id)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              Join Group
            </button>
          </div>
        )}
      </div>

      {/* Create group modal */}
      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
