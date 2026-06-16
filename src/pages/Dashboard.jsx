import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import ThemeToggle from '../components/ThemeToggle';
import ActivitySuggestions from '../components/ActivitySuggestions';

// ── Demo matches (shown until real API returns data) ──────────────────────────
const DEMO_MATCHES = [
  {
    id: 101, name: 'Priya', initials: 'PR', age: 26, city: 'Mumbai',
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    last_message: 'Hey, just wanted to say hi 👋', last_time: '2m ago', online: true,
    grad: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  {
    id: 102, name: 'Rohan', initials: 'RO', age: 29, city: 'Pune',
    primary_problem: 'depression', match_score: 88,
    match_reason: 'Similar experiences with low motivation and isolation',
    last_message: 'That makes so much sense...', last_time: '1h ago', online: true,
    grad: 'linear-gradient(135deg, #0891b2, #2563eb)',
  },
  {
    id: 103, name: 'Aisha', initials: 'AI', age: 24, city: 'Bangalore',
    primary_problem: 'loneliness', match_score: 82,
    match_reason: 'Both dealing with loneliness after a big life change',
    last_message: "I haven't talked to anyone about this in months", last_time: '3h ago', online: false,
    grad: 'linear-gradient(135deg, #059669, #0891b2)',
  },
  {
    id: 104, name: 'Dev', initials: 'DV', age: 31, city: 'Delhi',
    primary_problem: 'work_career_stress', match_score: 79,
    match_reason: 'Both burned out from high-pressure work environments',
    last_message: 'Same here, it never feels like enough', last_time: '1d ago', online: false,
    grad: 'linear-gradient(135deg, #d97706, #dc2626)',
  },
];

const PROBLEM_LABELS = {
  anxiety: 'Anxiety', depression: 'Depression', loneliness: 'Loneliness',
  work_career_stress: 'Work Stress', ptsd_trauma: 'Trauma', grief_loss: 'Grief',
  relationship_breakup: 'Breakup', panic_attacks: 'Panic Attacks',
  ocd_intrusive_thoughts: 'OCD', lack_of_confidence: 'Confidence',
  sleep_problems: 'Sleep', anger_management: 'Anger', financial_stress: 'Financial',
};

// ── Smart bot response engine ─────────────────────────────────────────────────
const BOT_RESPONSES = {
  anxiety: [
    "Yeah, I totally get that feeling... like your chest is tight and your brain just won't quiet down 😔",
    "Honestly me too. Some days it's so hard to even leave the house without that feeling creeping in.",
    "What helps me sometimes is just focusing on one breath at a time. Have you tried anything like that?",
    "I used to think I was just being dramatic, but then I realized anxiety is SO real. You're not alone in this.",
    "The worst is when it hits at night right? Like everything feels 10x scarier in the dark.",
    "I've been matched with you because we both deal with this. It's kind of comforting knowing someone gets it.",
  ],
  depression: [
    "Some days just getting out of bed feels like climbing a mountain. I hear you 💙",
    "I've been there — that grey fog where nothing feels worth it. It does lift, even when it doesn't feel like it.",
    "What's been the hardest part for you lately? I want to understand.",
    "Thank you for trusting me with this. Not everyone gets what depression really feels like.",
    "I've learned that small wins count. Like, did you eat today? That matters.",
    "We were matched because we understand each other's journey. You don't have to explain yourself here.",
  ],
  loneliness: [
    "That feeling of being surrounded by people but still completely alone... I know it so well 💫",
    "Honestly, finding this app was the first time I felt like someone might actually get it.",
    "How long have you been feeling this way? I'd love to hear your story.",
    "Loneliness is such an underrated pain. People don't take it seriously enough.",
    "I'm really glad we got matched. Even this conversation means a lot to me.",
    "You're not as alone as you feel right now. I promise.",
  ],
  work_career_stress: [
    "Ugh, the pressure to always be 'on' and productive... it's exhausting 😮‍💨",
    "I've been in that spiral too — working more, enjoying it less, but feeling guilty if you stop.",
    "What does your day usually look like? Maybe we can figure out some breathing room together.",
    "Burnout is so real and so misunderstood. You're not lazy, you're depleted.",
    "I've started setting a 'no work after 8pm' rule and it's slowly helping. Small things add up.",
    "The fact that you recognize the stress means you're already ahead. That awareness matters.",
  ],
  default: [
    "I really appreciate you sharing that with me 💜",
    "That sounds really hard. How are you feeling right now, in this moment?",
    "You know, I was thinking about this exact thing recently...",
    "Thank you for being so open. It takes courage to talk about this stuff.",
    "I've been through something similar. Can I share what helped me?",
    "Just having someone listen without judging makes such a difference, doesn't it?",
    "How long have you been carrying this? You don't have to carry it alone.",
    "What you're feeling is valid. All of it.",
  ],
  keyword: {
    sad: "I'm sorry you're feeling sad 💙 Can you tell me more about what's going on?",
    lonely: "Loneliness is one of the heaviest feelings. I'm right here with you.",
    scared: "Fear is so hard to sit with. What does it feel like for you?",
    tired: "That kind of tired that sleep doesn't fix... I know exactly what you mean.",
    help: "I'm here. You reached out — that's the bravest thing. Let's talk.",
    bad: "I'm sorry you're having a hard time. You don't have to face this alone.",
    good: "That's so good to hear! Small moments of good are worth celebrating 🌟",
    thanks: "Of course! That's what we're here for. How are you really doing though?",
    hey: null, // will use problem-based
    hi: null,
    hello: null,
  },
};

function getBotResponse(userText, problem) {
  const lower = userText.toLowerCase();
  for (const [key, response] of Object.entries(BOT_RESPONSES.keyword)) {
    if (lower.includes(key) && response) return response;
  }
  const pool = BOT_RESPONSES[problem] || BOT_RESPONSES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Safety Notice ─────────────────────────────────────────────────────────────
function SafetyNotice({ onDismiss }) {
  return (
    <div className="mx-4 mt-3 mb-1 rounded-2xl overflow-hidden border"
      style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', borderColor: '#fde68a' }}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <span className="text-lg shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-800 mb-0.5">Safety & Privacy Notice</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Never share your phone number, address, or social media with matches.
                Your safety is our priority. If you feel unsafe,{' '}
                <span className="font-semibold underline cursor-pointer">visit our Safety Center</span>.
                This is a peer support space — not a substitute for professional care.
              </p>
            </div>
          </div>
          <button onClick={onDismiss}
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-200 transition-colors text-xs">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 py-1">
      <div className="px-4 py-3 rounded-3xl rounded-bl-lg"
        style={{ background: 'var(--bg-subtle)' }}>
        <div className="flex gap-1 items-center h-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [matches] = useState(DEMO_MATCHES);
  const [activeMatch, setActiveMatch] = useState(DEMO_MATCHES[0]);
  const [chatHistory, setChatHistory] = useState({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [safetyDismissed, setSafetyDismissed] = useState({});
  const [showActivity, setShowActivity] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef(null);

  // Init chat with greeting for each match
  useEffect(() => {
    const init = {};
    DEMO_MATCHES.forEach(m => {
      init[m.id] = [
        {
          id: 1, from: 'bot', text: `Hi! I'm ${m.name} 👋 I saw we were matched because of ${PROBLEM_LABELS[m.primary_problem] || 'similar struggles'}. I'm really glad SoulConnect connected us.`,
          time: new Date(Date.now() - 5 * 60000),
        },
        {
          id: 2, from: 'bot', text: "What's on your mind today? No pressure — we can go at whatever pace feels right.",
          time: new Date(Date.now() - 4 * 60000),
        },
      ];
    });
    setChatHistory(init);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typing, activeMatch]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput('');
    const msgId = Date.now();

    setChatHistory(prev => ({
      ...prev,
      [activeMatch.id]: [...(prev[activeMatch.id] || []), { id: msgId, from: 'me', text, time: new Date() }],
    }));

    // Bot typing delay
    const delay = 1000 + Math.random() * 1500;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const response = getBotResponse(text, activeMatch.primary_problem);
      setChatHistory(prev => ({
        ...prev,
        [activeMatch.id]: [...(prev[activeMatch.id] || []), {
          id: msgId + 1, from: 'bot', text: response, time: new Date(),
        }],
      }));
    }, delay);
  };

  const messages = chatHistory[activeMatch?.id] || [];
  const filteredMatches = matches.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fmt = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div className={`flex-col w-full md:w-80 shrink-0 border-r ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

        {/* Logo + header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>🌟</div>
              <span className="font-bold text-base" style={{ color: 'var(--text)' }}>SoulConnect</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search matches..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }}
            />
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex gap-1 px-5 mb-3">
          {['Chats', 'Matches'].map(tab => (
            <button key={tab}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tab === 'Chats' ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'var(--bg-subtle)',
                color: tab === 'Chats' ? 'white' : 'var(--text-secondary)',
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Match list */}
        <div className="flex-1 overflow-y-auto px-3" style={{ scrollbarWidth: 'thin' }}>
          {filteredMatches.map(m => (
            <button key={m.id}
              onClick={() => { setActiveMatch(m); setMobileView('chat'); }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 text-left transition-all"
              style={{
                background: activeMatch?.id === m.id ? 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(37,99,235,0.08))' : 'transparent',
                border: activeMatch?.id === m.id ? '1.5px solid rgba(124,58,237,0.2)' : '1.5px solid transparent',
              }}>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: m.grad }}>
                  {m.initials}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${m.online ? 'bg-green-400' : 'bg-gray-300'}`}
                  style={{ borderColor: 'var(--bg-card)' }} />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>{m.name}</span>
                  <span className="text-xs shrink-0 ml-1" style={{ color: 'var(--text-muted)' }}>{m.last_time}</span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{m.last_message}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={() => navigate('/healers')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0891b2, #2563eb)' }}>
            <span className="text-xl">🧘</span>
            <div>
              <p className="text-xs font-bold text-white">Talk to a Healer</p>
              <p className="text-xs text-blue-100">Book a professional session</p>
            </div>
          </button>
          <button
            onClick={() => { clearAuth(); navigate('/'); }}
            className="w-full text-xs py-2 rounded-xl font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>

        {/* Chat header */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-3.5"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          {/* Mobile back */}
          <button onClick={() => setMobileView('list')}
            className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-colors mr-1"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text)' }}>
            ←
          </button>

          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: activeMatch?.grad }}>
            {activeMatch?.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{activeMatch?.name}</span>
              {activeMatch?.online && (
                <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  online
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {PROBLEM_LABELS[activeMatch?.primary_problem]} · {activeMatch?.match_score}% match
            </p>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowActivity(!showActivity)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: showActivity ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'var(--bg-subtle)',
                color: showActivity ? 'white' : 'var(--text-secondary)',
              }}>
              💡 Activities
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors hover:opacity-70"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
              ⋯
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)', scrollbarWidth: 'thin' }}>
          {/* Safety notice */}
          {!safetyDismissed[activeMatch?.id] && (
            <SafetyNotice onDismiss={() => setSafetyDismissed(prev => ({ ...prev, [activeMatch.id]: true }))} />
          )}

          {/* Match reason card */}
          <div className="mx-4 my-3 px-4 py-3 rounded-2xl text-center"
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>
              ✨ Why you were matched
            </p>
            <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>"{activeMatch?.match_reason}"</p>
          </div>

          {/* Messages */}
          <div className="px-4 pb-4 space-y-1">
            {messages.map((msg, i) => {
              const isMe = msg.from === 'me';
              const showAvatar = !isMe && (i === 0 || messages[i - 1]?.from === 'me');
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isMe && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: activeMatch?.grad }}>
                      {activeMatch?.initials?.[0]}
                    </div>
                  )}
                  <div className={`max-w-[70%] group`}>
                    <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                      isMe ? 'rounded-3xl rounded-br-md text-white' : 'rounded-3xl rounded-bl-md'
                    }`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }
                        : { background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)' }
                      }>
                      {msg.text}
                    </div>
                    <p className={`text-xs mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'text-right' : ''}`}
                      style={{ color: 'var(--text-muted)' }}>
                      {fmt(msg.time)}
                    </p>
                  </div>
                </div>
              );
            })}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-4 py-3"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 hover:opacity-70 transition-opacity"
              style={{ background: 'var(--bg-subtle)' }}>
              😊
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${activeMatch?.name}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-colors"
              style={{
                background: 'var(--bg-subtle)',
                color: 'var(--text)',
                border: '1.5px solid var(--border)',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            🔒 Anonymous & encrypted · <span className="underline cursor-pointer">Report</span>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      {showActivity && (
        <div className="hidden lg:flex flex-col w-72 shrink-0 border-l overflow-y-auto"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Quick Relief</p>
              <button onClick={() => setShowActivity(false)}
                className="text-xs hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <ActivitySuggestions
              problemType={activeMatch?.primary_problem || 'anxiety'}
              matchName={activeMatch?.name}
              onActivityComplete={() => {}}
            />

            {/* Healer CTA */}
            <div className="rounded-2xl overflow-hidden mt-2"
              style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63)' }}>
              <div className="p-4">
                <p className="text-xs font-bold text-white mb-1">Need more support?</p>
                <p className="text-xs text-purple-200 mb-3">Chat with a verified therapist or counsellor.</p>
                <button
                  onClick={() => navigate('/healers')}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  Browse Healers →
                </button>
              </div>
            </div>

            {/* Community CTA */}
            <div className="rounded-2xl overflow-hidden mt-3"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div className="p-4">
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>👥 Join a Meetup</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Small group sessions for your challenge.</p>
                <button
                  onClick={() => navigate('/meetups')}
                  className="w-full py-2 rounded-xl text-xs font-semibold border transition-colors hover:opacity-80"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                  See Upcoming Meetups
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
