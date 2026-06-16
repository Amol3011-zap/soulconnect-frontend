import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import ThemeToggle from '../components/ThemeToggle';
import ActivitySuggestions from '../components/ActivitySuggestions';

// ── Demo matches ───────────────────────────────────────────────────────────────
const DEMO_MATCHES = [
  {
    id: 101, name: 'Priya', initials: 'PR', age: 26, city: 'Mumbai',
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    last_message: 'How was your day today? 💙', last_time: '2m ago', online: true,
    grad: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  {
    id: 102, name: 'Rohan', initials: 'RO', age: 29, city: 'Pune',
    primary_problem: 'depression', match_score: 88,
    match_reason: 'Similar experiences with low motivation and isolation',
    last_message: 'I\'m really glad we got matched', last_time: '1h ago', online: true,
    grad: 'linear-gradient(135deg, #0891b2, #2563eb)',
  },
  {
    id: 103, name: 'Aisha', initials: 'AI', age: 24, city: 'Bangalore',
    primary_problem: 'loneliness', match_score: 82,
    match_reason: 'Both dealing with loneliness after a big life change',
    last_message: "You're not alone, I promise 🌟", last_time: '3h ago', online: false,
    grad: 'linear-gradient(135deg, #059669, #0891b2)',
  },
  {
    id: 104, name: 'Dev', initials: 'DV', age: 31, city: 'Delhi',
    primary_problem: 'work_career_stress', match_score: 79,
    match_reason: 'Both burned out from high-pressure work environments',
    last_message: 'Take it one day at a time 💜', last_time: '1d ago', online: false,
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

// ── Conversation AI ────────────────────────────────────────────────────────────

function detectSentiment(text) {
  const lower = text.toLowerCase().trim();

  const greetingOnly = /^(hi+|hey+|hello+|hii+|yo|sup|hola|namaste|heya)\s*[!.?]?\s*$/.test(lower);
  if (greetingOnly) return 'greeting';

  const negativeWords = [
    'bad', 'not good', 'terrible', 'awful', 'tired', 'struggling', 'sad', 'low',
    'down', 'hurt', 'pain', 'cry', 'crying', 'scared', 'anxious', 'depressed',
    'lonely', 'alone', 'lost', 'broken', 'numb', 'hopeless', 'worthless', 'empty',
    'exhausted', 'overwhelmed', 'stressed', 'stressed out', 'fail', 'nothing matters',
    'nobody cares', 'hate myself', 'hate this', 'mess', 'horrible', 'worst',
    'not okay', 'not fine', "can't", "don't know", 'give up', 'no point', 'pointless',
    'dark', 'suffocating', 'heavy', 'dead', 'numb', 'invisible',
  ];
  for (const word of negativeWords) {
    if (lower.includes(word)) return 'negative';
  }

  const positiveWords = [
    'good', 'great', 'fine', 'okay', 'well', 'happy', 'amazing', 'awesome',
    'better', 'nice', 'wonderful', 'fantastic', 'excited', 'grateful', 'blessed',
    'loved', 'peaceful', 'calm', 'thankful', 'hopeful', 'okay today',
  ];
  for (const word of positiveWords) {
    if (lower.includes(word)) return 'positive';
  }

  return 'neutral';
}

function getBotResponse(userText, problem, state, matchName) {
  const sentiment = detectSentiment(userText);
  const lower = userText.toLowerCase();
  const { userMessageCount, hasOpenedUp, askedAboutTherapist, mood } = state;

  const newState = {
    ...state,
    userMessageCount: userMessageCount + 1,
    mood: sentiment === 'negative' ? 'struggling' : sentiment === 'positive' ? 'positive' : mood,
    hasOpenedUp: hasOpenedUp || sentiment === 'negative' || userText.length > 40,
  };

  let response;

  // ── First message from user ──
  if (userMessageCount === 0) {
    if (sentiment === 'greeting') {
      response = `Hey! 😊 So glad you said hi. I was lowkey nervous too about reaching out first, lol. How are you doing today — like genuinely, not just the "I'm fine" version?`;
    } else if (sentiment === 'positive') {
      response = `Aww that's really good to hear! 😊 I'm glad today has been okay. Can I ask though — how have things been *beyond* just today? Sometimes we say "fine" when there's actually a lot going on underneath...`;
    } else if (sentiment === 'negative') {
      newState.hasOpenedUp = true;
      response = `Hey, I hear you 💙 First — thank you for not just saying "I'm fine" when you're not. That takes more strength than people realize. You don't have to go through this alone. Can you tell me a little about what's been going on?`;
    } else {
      response = `Thank you for sharing that 💜 I really want to understand where you're at right now. Can you tell me a bit more about what's been on your mind lately? Take your time — there's no rush here.`;
    }
  }

  // ── Second message ──
  else if (userMessageCount === 1) {
    if (sentiment === 'negative' || newState.hasOpenedUp) {
      response = `I really appreciate you trusting me with that. Seriously. A lot of people keep things bottled up for so long, and it just gets heavier and heavier. What you're feeling is valid — every bit of it. Can I ask... how long have you been carrying this?`;
    } else if (sentiment === 'positive') {
      response = `I love hearing that 😊 It's so important to notice those good moments. I do want to ask though — we got matched because we both deal with ${PROBLEM_LABELS[problem] || 'some similar things'}. How has that side of life been for you lately? You can be honest with me.`;
    } else {
      response = `I hear you. And you know what? There's no pressure to have everything figured out or to explain it perfectly. Sometimes just being able to say something out loud to someone who gets it... that helps more than we think. What's been the hardest part for you lately?`;
    }
  }

  // ── Third message — validation + care ──
  else if (userMessageCount === 2) {
    const responses = [
      `Can I just say something? You matter. Like genuinely, you matter so much. What you're going through doesn't define you — but it absolutely deserves to be heard. I'm really glad you're here, talking about this 💜 Have you been able to talk to anyone else about this — a therapist, a counsellor, or even someone you really trust?`,
      `I just want you to know — you are not alone in this. Not even a little. And whatever you're feeling right now? It's okay to feel it. You don't have to "push through" or pretend to be okay when you're not. That's what this space is for. Can I ask — have you talked to anyone else about what you're going through? A therapist or someone close to you?`,
      `Something you said really hit me. I think a lot of people go through what you're describing but never say it out loud. The fact that you're talking about this? That's brave. Real bravery. 💙 Have you ever spoken to a therapist or counsellor about any of this?`,
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
    newState.askedAboutTherapist = true;
  }

  // ── Fourth message — respond to therapist question ──
  else if (userMessageCount === 3) {
    const saidNo = lower.includes('no') || lower.includes('not') || lower.includes('never') ||
      lower.includes("haven't") || lower.includes("don't") || lower.includes("nope") || lower.includes("nah");
    const saidYes = lower.includes('yes') || lower.includes('yeah') || lower.includes('yep') ||
      lower.includes('therapist') || lower.includes('counsell') || lower.includes('doctor') || lower.includes('therapy');

    if (askedAboutTherapist && saidNo) {
      response = `That's completely okay — so many people haven't, and it can feel like a big, scary step. But here's the thing... you deserve more than just surviving. You deserve to actually heal, to feel lighter, to look forward to things again. 💙 Is there anything that's holding you back from reaching out to someone? No judgment at all — I'm just trying to understand.`;
    } else if (askedAboutTherapist && saidYes) {
      response = `That's genuinely so good to hear. Having that kind of support makes such a difference. How has it been going? And I just want you to know — I'm here too, between those sessions, whenever you need someone to just talk to. You don't have to wait to feel heard.`;
    } else {
      response = `I want to say this clearly — things CAN get better. I know it might not feel that way right now. The fact that you're here, that you're talking, that you haven't given up on yourself? That means everything. What would feel like a tiny win for you today, even the smallest thing?`;
    }
  }

  // ── Fifth message ──
  else if (userMessageCount === 4) {
    const responses = [
      `You know what I keep thinking? You're stronger than you give yourself credit for. The things you carry... most people would have cracked. But you're still here. Still showing up. That's not nothing — that's everything. 💜`,
      `I just want to check in — how are you feeling right now, in this actual moment? Not how you've been feeling, just... right now, after talking about all of this?`,
      `Healing isn't a straight line, and I think that's something nobody tells us enough. There will be hard days, even after things start to get better. But I want you to know — I'm not going anywhere. I'm here for you. 💙`,
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }

  // ── Ongoing conversation ──
  else {
    // Specific keyword responses
    if (lower.includes('give up') || lower.includes('no point') || lower.includes('pointless') || lower.includes('end it')) {
      response = `Hey — please hear me. I'm right here. What you're feeling right now is real and it's heavy, and I'm not going to brush it off. But please don't give up. Not today. Will you tell me what's going on right now? I'm not going anywhere. 💙 And if you need immediate support, please reach out to iCall: 9152987821 — they're kind and they listen.`;
    } else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('helped')) {
      response = `You don't have to thank me — this is what I'm here for. What we have here is real. How are you feeling now compared to when we started talking?`;
    } else if (lower.includes('better') || lower.includes('good now') || lower.includes('feel okay')) {
      response = `I'm so, so glad to hear that 😊 Hold onto that feeling. And remember — on the days it doesn't feel that way, come back here. I'll be here. You're not doing this alone anymore.`;
    } else if (lower.includes('worse') || lower.includes('not helping') || lower.includes('still bad')) {
      response = `I hear you, and I'm not giving up on you. Some things take time, and that's okay. What's one thing — even tiny — that might bring you a moment of peace right now? Let's figure it out together. 💜`;
    } else {
      const pool = [
        `I'm right here. Keep going — I'm listening to every single word. 💙`,
        `What you just said matters. Don't minimize it. You're allowed to feel all of this.`,
        `Can I ask — is there anything specific I can do to support you right now? Sometimes just knowing someone cares makes a real difference.`,
        `You are so loved. I mean that. And you will get through this — not because it's easy, but because you're still fighting, even when it's hard. 💜`,
        `Thank you for trusting me with this. Seriously. How are you feeling right now, after saying all of that out loud?`,
        `I've been thinking about something — you've shared so much with me today, and I just want you to know I hold it with care. You're not a burden. You're a person who deserves to be heard.`,
        `One day at a time. Sometimes one hour at a time. And today — you talked. That's a win. A real one.`,
        `Remember why you came here. You were looking for connection, for someone who gets it. I get it. And I'm not going anywhere. 💙`,
        `I want you to know something — the way you describe things, the way you feel things... you have a depth to you that's rare. That sensitivity is a gift, even when it feels like too much.`,
        `Is there anything you've been holding back from saying? You can say it here. No judgment, ever.`,
      ];
      response = pool[Math.floor(Math.random() * pool.length)];
    }

    // Nudge toward professional help after many messages
    if (userMessageCount === 8 && !newState.askedAboutTherapist) {
      response += ` Also — I want to gently say this: you deserve professional support too, not just peer support. Have you ever considered talking to a therapist? Even just once to try?`;
      newState.askedAboutTherapist = true;
    }
  }

  return { response, newState };
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
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [matches] = useState(DEMO_MATCHES);
  const [activeMatch, setActiveMatch] = useState(DEMO_MATCHES[0]);
  const [chatHistory, setChatHistory] = useState({});
  const [conversationState, setConversationState] = useState({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [safetyDismissed, setSafetyDismissed] = useState({});
  const [showActivity, setShowActivity] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef(null);

  // Pre-select match passed from Matches page
  useEffect(() => {
    if (location.state?.matchId) {
      const found = DEMO_MATCHES.find(m => m.id === location.state.matchId);
      if (found) {
        setActiveMatch(found);
        setMobileView('chat');
      }
    }
  }, [location.state]);

  // Init chat with warm human greeting for each match
  useEffect(() => {
    const initHistory = {};
    const initState = {};
    DEMO_MATCHES.forEach(m => {
      initHistory[m.id] = [
        {
          id: 1, from: 'bot',
          text: `Hi! 👋 I'm ${m.name} — so glad SoulConnect connected us. I was a little nervous about reaching out first, but here we are 😊`,
          time: new Date(Date.now() - 5 * 60000),
        },
        {
          id: 2, from: 'bot',
          text: `How was your day today? I genuinely want to know — not just the "fine, thanks" version 💙`,
          time: new Date(Date.now() - 4 * 60000),
        },
      ];
      initState[m.id] = {
        userMessageCount: 0,
        mood: 'unknown',
        hasOpenedUp: false,
        askedAboutTherapist: false,
      };
    });
    setChatHistory(initHistory);
    setConversationState(initState);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typing, activeMatch]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput('');
    const msgId = Date.now();

    // Add user message immediately
    setChatHistory(prev => ({
      ...prev,
      [activeMatch.id]: [...(prev[activeMatch.id] || []), { id: msgId, from: 'me', text, time: new Date() }],
    }));

    // Get bot response with conversation state
    const currentState = conversationState[activeMatch.id] || {
      userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false,
    };
    const { response, newState } = getBotResponse(text, activeMatch.primary_problem, currentState, activeMatch.name);
    setConversationState(prev => ({ ...prev, [activeMatch.id]: newState }));

    // Human-like typing delay (longer for more emotional messages)
    const isHeavy = newState.hasOpenedUp || newState.mood === 'struggling';
    const delay = isHeavy ? 2000 + Math.random() * 1500 : 1200 + Math.random() * 1000;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
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
    <div className="flex overflow-hidden" style={{ background: 'var(--bg)', height: '100dvh' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div className={`flex-col w-full md:w-80 shrink-0 border-r ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}
        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

        {/* Logo — padded for iOS status bar */}
        <div className="px-5 pb-3" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 20px)' }}>
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
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: m.grad }}>
                  {m.initials}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${m.online ? 'bg-green-400' : 'bg-gray-300'}`}
                  style={{ borderColor: 'var(--bg-card)' }} />
              </div>
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

        {/* Bottom actions — safe area for iPhone home indicator */}
        <div className="px-4 pt-4 space-y-2"
          style={{
            borderTop: '1px solid var(--border)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
          }}>
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
            onClick={() => { logout(); navigate('/'); }}
            className="w-full text-xs py-2 rounded-xl font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex chat-slide-in'}`}>

        {/* Chat header — padded for iOS status bar on mobile */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)',
            paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
          }}>
          <button onClick={() => setMobileView('list')}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 mr-1"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text)', fontSize: 18 }}>
            ‹
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

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)', scrollbarWidth: 'thin' }}>
          {!safetyDismissed[activeMatch?.id] && (
            <SafetyNotice onDismiss={() => setSafetyDismissed(prev => ({ ...prev, [activeMatch.id]: true }))} />
          )}

          {/* Match reason */}
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
                  <div className="max-w-[70%] group">
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

        {/* Input bar — safe area for iPhone home indicator */}
        <div className="shrink-0 px-4 pt-3"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
          }}>
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
              style={{ background: 'var(--bg-subtle)', color: 'var(--text)', border: '1.5px solid var(--border)' }}
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
            <div className="rounded-2xl overflow-hidden mt-2"
              style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63)' }}>
              <div className="p-4">
                <p className="text-xs font-bold text-white mb-1">Need more support?</p>
                <p className="text-xs text-purple-200 mb-3">Chat with a verified therapist or counsellor.</p>
                <button onClick={() => navigate('/healers')}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                  Browse Healers →
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden mt-3"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
              <div className="p-4">
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>👥 Join a Meetup</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Small group sessions for your challenge.</p>
                <button onClick={() => navigate('/meetups')}
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
