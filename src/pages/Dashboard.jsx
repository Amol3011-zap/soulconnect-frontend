import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import ThemeToggle from '../components/ThemeToggle';
import ActivitySuggestions from '../components/ActivitySuggestions';
import GuidedHealing from '../components/GuidedHealing';
import { journeyAPI } from '../services/api';

// ── Demo match — one chatbot persona shown to every new user ───────────────────
const DEMO_MATCHES = [
  {
    id: 101, name: 'Priya', initials: 'PR', age: 26, city: 'Mumbai',
    primary_problem: 'anxiety', match_score: 94,
    match_reason: 'Both navigating social anxiety and overthinking spirals',
    last_message: 'How was your day today? 💙', last_time: 'just now', online: true,
    grad: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    isDemo: true,
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

    if (userMessageCount === 8 && !newState.askedAboutTherapist) {
      response += ` Also — I want to gently say this: you deserve professional support too, not just peer support. Have you ever considered talking to a therapist? Even just once to try?`;
      newState.askedAboutTherapist = true;
    }
  }

  return { response, newState };
}

// ── Keyframe CSS ──────────────────────────────────────────────────────────────
const DASH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40% { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes slideInChat {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGreen {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,195,143,0.0); }
    50%       { box-shadow: 0 0 0 4px rgba(52,195,143,0.3); }
  }
  @keyframes dcFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
  @keyframes dcPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(1.8); }
  }
  @keyframes dcFadeUp {
    from { opacity:0; transform:translateY(10px); }
    to { opacity:1; transform:translateY(0); }
  }
  @keyframes dcBreath {
    0%,100% { transform:scale(1); }
    50% { transform:scale(1.04); }
  }
  .dc-msg { animation: dcFadeUp 0.3s ease both; }
  .dc-hover:hover { transform:translateY(-2px); transition:transform 0.2s ease; }
  .dc-scroll::-webkit-scrollbar { width: 4px; }
  .dc-scroll::-webkit-scrollbar-track { background: transparent; }
  .dc-scroll::-webkit-scrollbar-thumb { background: rgba(109,74,255,0.18); border-radius: 4px; }
  .dc-msg-enter { animation: slideInChat 0.25s ease forwards; }
  @media (max-width: 900px) {
    .dc-layout { grid-template-columns: 1fr !important; }
    .dc-sidebar { display: none !important; }
    .dc-right { display: none !important; }
  }
`;

// ── Lotus SVG helper ──────────────────────────────────────────────────────────
function LotusSmall({ size = 24 }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }}>
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(-45,16,18)" />
      <ellipse cx="16" cy="18" rx="4" ry="7" fill="none" stroke="#A78BFA" strokeWidth="1.4" transform="rotate(90,16,18)" />
      <circle cx="16" cy="17" r="3.5" fill="#F5B841" opacity="0.9" />
      <circle cx="16" cy="17" r="2" fill="#FFD77A" />
    </svg>
  );
}

// ── Welcome Meditation SVG ────────────────────────────────────────────────────
function WelcomeMeditation() {
  return (
    <svg viewBox="0 0 280 200" style={{ width: '100%', height: '100%', minHeight: 200, display: 'block' }}>
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE5FF" />
          <stop offset="60%" stopColor="#DDD0FF" />
          <stop offset="100%" stopColor="#D4C6FF" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,220,180,0.6)" />
          <stop offset="40%" stopColor="rgba(180,140,255,0.35)" />
          <stop offset="65%" stopColor="transparent" />
        </radialGradient>
        <filter id="blur8">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {/* Background */}
      <rect width="280" height="200" fill="url(#bgGrad)" />
      {/* Sacred geometry — concentric circles */}
      {[20,40,60,80,100,120].map(r => (
        <circle key={r} cx="140" cy="95" r={r} fill="none" stroke="rgba(109,74,255,0.18)" strokeWidth="0.8" />
      ))}
      {/* 12 spokes */}
      {Array.from({length:12}).map((_,i) => {
        const angle = (i * 30) * Math.PI / 180;
        return (
          <line
            key={i}
            x1={140 + 20 * Math.cos(angle)} y1={95 + 20 * Math.sin(angle)}
            x2={140 + 120 * Math.cos(angle)} y2={95 + 120 * Math.sin(angle)}
            stroke="rgba(109,74,255,0.1)" strokeWidth="0.8"
          />
        );
      })}
      {/* Radial glow */}
      <ellipse cx="140" cy="100" rx="80" ry="70" fill="url(#glowGrad)" filter="url(#blur8)" opacity="0.8" />
      {/* Lotus petals at bottom */}
      {[-60,-30,0,30,60].map((deg,i) => {
        const angle = (deg - 90) * Math.PI / 180;
        const cx = 140 + 36 * Math.cos(angle);
        const cy = 160 + 36 * Math.sin(angle);
        return (
          <ellipse
            key={i}
            cx={cx} cy={cy} rx="14" ry="28"
            fill="rgba(196,181,253,0.4)"
            transform={`rotate(${deg}, ${cx}, ${cy})`}
          />
        );
      })}
      {/* Meditating figure */}
      {/* Legs/base */}
      <ellipse cx="140" cy="153" rx="38" ry="12" fill="#3D2B8E" opacity="0.9" />
      {/* Left knee */}
      <ellipse cx="112" cy="148" rx="14" ry="9" fill="#3D2B8E" opacity="0.85" />
      {/* Right knee */}
      <ellipse cx="168" cy="148" rx="14" ry="9" fill="#3D2B8E" opacity="0.85" />
      {/* Torso */}
      <rect x="130" y="118" width="20" height="30" rx="8" fill="#3D2B8E" opacity="0.9" />
      {/* Left arm */}
      <path d="M130 128 Q112 138 112 148" stroke="#3D2B8E" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M150 128 Q168 138 168 148" stroke="#3D2B8E" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="135" y="109" width="10" height="12" rx="4" fill="#3D2B8E" />
      {/* Head */}
      <circle cx="140" cy="96" r="14" fill="#3D2B8E" />
      {/* Hair bun */}
      <ellipse cx="140" cy="84" rx="8" ry="5" fill="#2D1F6B" />
      <circle cx="140" cy="80" r="4" fill="#2D1F6B" />
      {/* Gold sparkle dots — animated */}
      {[
        {x:70, y:40, delay:'0s'}, {x:200, y:30, delay:'0.5s'},
        {x:240, y:80, delay:'1s'}, {x:60, y:130, delay:'1.5s'},
        {x:210, y:140, delay:'0.8s'}, {x:90, y:170, delay:'1.2s'},
      ].map((dot, i) => (
        <circle
          key={i}
          cx={dot.x} cy={dot.y} r="3"
          fill="#F5B841"
          style={{ animation: `dcFloat 3s ease infinite`, animationDelay: dot.delay }}
        />
      ))}
    </svg>
  );
}

// ── Safety Notice ─────────────────────────────────────────────────────────────
function SafetyNotice({ onDismiss }) {
  return (
    <div style={{
      margin: '0 24px 8px',
      borderRadius: 14,
      background: 'rgba(255,251,235,0.95)',
      border: '1px solid rgba(253,230,138,0.8)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '10px 14px',
    }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#92400E' }}>
          Safety &amp; Privacy Notice
        </p>
        <p style={{ margin: 0, fontSize: 11, color: '#78350F', lineHeight: 1.6 }}>
          Never share your phone number, address, or social media with matches.
          Your safety is our priority. If you feel unsafe,{' '}
          <span style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
            visit our Safety Center
          </span>.
          This is a peer support space — not a substitute for professional care.
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss safety notice"
        style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(146,64,14,0.1)', border: 'none',
          color: '#92400E', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        ✕
      </button>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator({ grad }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 0 4px 0', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: grad || 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, color: '#fff', fontWeight: 700, flexShrink: 0,
      }}>
        PR
      </div>
      <div style={{
        padding: '14px 18px',
        borderRadius: '4px 20px 20px 20px',
        background: '#FFFFFF',
        border: '1px solid rgba(109,74,255,0.1)',
        boxShadow: '0 2px 12px rgba(109,74,255,0.07)',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 14 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#A78BFA',
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { logout, user } = useAuthStore();
  const navigate         = useNavigate();
  const location         = useLocation();

  const [matches]              = useState(DEMO_MATCHES);
  const [activeMatch, setActiveMatch]         = useState(DEMO_MATCHES[0]);
  const [messages, setMessages]               = useState([
    { id: 'seed', from: 'bot', text: DEMO_MATCHES[0].last_message, time: new Date() },
  ]);
  const [input, setInput]                     = useState('');
  const [typing, setTyping]                   = useState(false);
  const [conversationState, setConversationState] = useState({
    [DEMO_MATCHES[0].id]: { userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false },
  });
  const [safetyDismissed, setSafetyDismissed] = useState({});
  const [showActivity, setShowActivity]       = useState(false);
  const [rightTab, setRightTab]               = useState('activities');
  const [mainTab, setMainTab]                 = useState('chat');
  const [mobileView, setMobileView]           = useState('list');
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);
  const [selectedMood, setSelectedMood]       = useState(null);
  const bottomRef = useRef(null);
  const chatLoggedRef = useRef(false);

  // Pre-select match from Matches page
  useEffect(() => {
    if (location.state?.matchId) {
      const found = DEMO_MATCHES.find(m => m.id === location.state.matchId);
      if (found) { setActiveMatch(found); setMobileView('chat'); }
    }
  }, [location.state]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, activeMatch]);

  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || typing) return;
    setInput('');
    const msgId = Date.now();

    setMessages(prev => [...prev, { id: msgId, from: 'me', text, time: new Date() }]);

    const currentState = conversationState[activeMatch.id] || {
      userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false,
    };
    const { response, newState } = getBotResponse(text, activeMatch.primary_problem, currentState, activeMatch.name);
    setConversationState(prev => ({ ...prev, [activeMatch.id]: newState }));

    const isHeavy = newState.hasOpenedUp || newState.mood === 'struggling';
    const delay   = isHeavy ? 2000 + Math.random() * 1500 : 1200 + Math.random() * 1000;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: msgId + 1, from: 'bot', text: response, time: new Date() }]);
      // Auto-log chat_session once per component mount (silent, no UI feedback)
      if (!chatLoggedRef.current) {
        chatLoggedRef.current = true;
        journeyAPI.logActivity({ activity_type: 'chat_session', duration_minutes: 0, intensity: 5, notes: 'Auto-logged from chat' }).catch(() => {});
      }
    }, delay);
  };

  const fmt = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Greeting based on time
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const timeEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  // First name
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Friend';

  // Daily affirmation quotes
  const AFFIRMATIONS = [
    "You are enough, exactly as you are right now. Healing is not linear, and every small step matters.",
    "Be gentle with yourself. You are a child of the universe, no less than the trees and the stars.",
    "Within you right now is the power to do things you never dreamed possible. This power becomes available as you change your beliefs.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious.",
    "Healing takes courage, and we all have courage, even if we have to dig a little to find it.",
    "You are braver than you believe, stronger than you seem, and more loved than you know.",
    "Every day is a new beginning. Take a deep breath, smile, and start again.",
  ];
  const todayAffirmation = AFFIRMATIONS[new Date().getDay()];

  // Conversation cards data
  const convCards = [
    {
      id: 'priya', name: 'Priya', sub: 'AI Companion', initials: 'PR',
      grad: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
      online: true, badge: { text: 'AI Companion', color: '#34C38F', bg: 'rgba(52,195,143,0.1)' },
      time: 'Just now', lastMsg: 'How was your day today? 💙', unread: 0,
    },
    {
      id: 'anxiety', name: 'Anxiety Support Circle', sub: 'Group', initials: '👥',
      grad: 'linear-gradient(135deg, #7C3AED, #4338CA)',
      online: false, badge: null,
      time: '9:30 AM', lastMsg: 'Riya: Thank you everyone, this...', unread: 4,
    },
    {
      id: 'mindful', name: 'Mindfulness Group', sub: 'Group', initials: '🌿',
      grad: 'linear-gradient(135deg, #059669, #10B981)',
      online: false, badge: null,
      time: 'Yesterday', lastMsg: 'Aman: Great session today 🙏', unread: 0,
    },
    {
      id: 'healing', name: 'Healing Circle', sub: 'Group', initials: '💗',
      grad: 'linear-gradient(135deg, #BE185D, #EC4899)',
      online: false, badge: null,
      time: 'Yesterday', lastMsg: 'Neha: Sending love to all 💜', unread: 0,
    },
  ];

  const moodChips = [
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '💔', label: 'Hurt' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🙂', label: 'Calm' },
  ];

  const quickStarters = [
    '🌱 I had a difficult day',
    '💜 I need support',
    '🧘 Help me calm down',
    '✨ I want to reflect',
  ];

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
    : 'ME';

  return (
    <>
      <style>{DASH_STYLES}</style>

      {/* Fixed layout — 3 columns */}
      <div
        className="dc-layout"
        style={{
          position: 'fixed',
          inset: 0,
          marginTop: 64,
          display: 'grid',
          gridTemplateColumns: '280px 1fr 300px',
          height: 'calc(100vh - 64px)',
          background: '#FAF7FF',
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* ─────────────────── LEFT SIDEBAR ─────────────────────────────────── */}
        <div
          className="dc-sidebar"
          style={{
            background: '#FFFFFF',
            borderRight: '1px solid rgba(109,74,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top section */}
          <div style={{ padding: '20px 16px 12px', flexShrink: 0 }}>
            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <LotusSmall size={28} />
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1333', lineHeight: 1.2 }}>SoulConnect</div>
                <div style={{ fontSize: 9, color: '#6B7280', letterSpacing: '0.15em', marginTop: 2, textTransform: 'uppercase' }}>
                  Heal · Connect · Grow
                </div>
              </div>
            </div>

            {/* New Conversation button */}
            <button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 14,
                padding: '12px',
                fontSize: 14,
                boxShadow: '0 4px 16px rgba(109,74,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 12,
                fontFamily: 'inherit',
              }}
            >
              ✨ New Conversation
            </button>

            {/* Search input */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: '#9CA3AF', pointerEvents: 'none',
              }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search conversations..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px 10px 36px',
                  background: '#F5F3FF',
                  border: searchFocused ? '1px solid #6D4AFF' : '1px solid rgba(109,74,255,0.15)',
                  borderRadius: 12,
                  fontSize: 13,
                  color: '#1A1333',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Conversation cards — scrollable */}
          <div
            className="dc-scroll"
            style={{ flex: 1, overflowY: 'auto' }}
          >
            <div style={{ padding: '8px 16px', fontSize: 10, fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              RECENT
            </div>
            {convCards.map((card, idx) => {
              const isSelected = idx === 0; // Priya is selected by default
              return (
                <div
                  key={card.id}
                  onClick={() => idx === 0 && setMobileView('chat')}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(109,74,255,0.08), rgba(167,139,250,0.04))'
                      : 'transparent',
                    borderLeft: isSelected ? '3px solid #6D4AFF' : '3px solid transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(109,74,255,0.04)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: card.grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: typeof card.initials === 'string' && card.initials.length <= 2 ? 13 : 18,
                      fontWeight: 700, color: '#fff',
                    }}>
                      {card.initials}
                    </div>
                    {card.online && (
                      <div style={{
                        position: 'absolute', bottom: 1, right: 1,
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#34C38F',
                        border: '2px solid white',
                        animation: 'pulseGreen 2s infinite',
                      }} />
                    )}
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {card.name}
                        </span>
                        {card.badge && (
                          <span style={{
                            background: card.badge.bg, color: card.badge.color,
                            fontSize: 10, fontWeight: 600,
                            padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                          }}>
                            {card.badge.text}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 4 }}>
                        {card.unread > 0 && (
                          <span style={{
                            width: 16, height: 16, borderRadius: '50%',
                            background: '#6D4AFF', color: '#fff',
                            fontSize: 10, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {card.unread}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#6B7280' }}>{card.time}</span>
                      </div>
                    </div>
                    <p style={{
                      margin: 0, fontSize: 12, color: '#6B7280',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {card.lastMsg}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Talk to a Healer card */}
          <div style={{ flexShrink: 0, padding: '0 12px 0', position: 'relative' }}>
            <div
              onClick={() => navigate('/healers')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                borderRadius: 20,
                padding: 16,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Floating glow orb */}
              <div style={{
                position: 'absolute', right: -20, bottom: -20,
                width: 80, height: 80,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Talk to a Healer</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Book a professional session</div>
              </div>
              <div style={{
                position: 'relative', zIndex: 1,
                width: 32, height: 32, borderRadius: '50%',
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6D4AFF', fontWeight: 700, fontSize: 18, flexShrink: 0,
              }}>
                →
              </div>
            </div>
          </div>

          {/* User profile row */}
          <div style={{
            borderTop: '1px solid rgba(109,74,255,0.08)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5B841, #E89B20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {userInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.full_name || 'My Account'}
              </div>
              <div style={{ fontSize: 11, color: '#6D4AFF', cursor: 'pointer' }}>View profile ›</div>
            </div>
            <button style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(109,74,255,0.08)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#6B7280',
            }}>
              ⋯
            </button>
          </div>
        </div>

        {/* ─────────────────── CENTER CHAT AREA ─────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#FAF7FF',
          overflow: 'hidden',
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'rgba(250,247,255,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(109,74,255,0.1)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            zIndex: 10,
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                PR
              </div>
              <div style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 10, height: 10, borderRadius: '50%',
                background: '#34C38F', border: '2px solid white',
                animation: 'pulseGreen 2s infinite',
              }} />
            </div>
            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1333' }}>Priya</span>
                <span style={{
                  background: 'rgba(52,195,143,0.1)', color: '#34C38F',
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                }}>
                  AI Companion
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Your healing companion</div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['☆', '🔊', '⋯'].map((icon, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(109,74,255,0.07)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#6D4AFF',
                }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div style={{
            display: 'flex',
            gap: 4,
            padding: '10px 24px 0',
            borderBottom: '1px solid rgba(109,74,255,0.1)',
            background: 'rgba(250,247,255,0.97)',
            flexShrink: 0,
          }}>
            {[
              { id: 'chat',       label: '💬 Chat'          },
              { id: 'activities', label: '⚡ Quick Relief'   },
              { id: 'healing',    label: '🌿 Challenges'     },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px 10px 0 0',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  background: mainTab === tab.id ? '#fff' : 'transparent',
                  color: mainTab === tab.id ? '#6D4AFF' : '#6B7280',
                  borderBottom: mainTab === tab.id ? '2px solid #6D4AFF' : '2px solid transparent',
                  transition: 'all 0.18s',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ── */}
          {mainTab === 'activities' && (
            <div className="dc-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <ActivitySuggestions problem={activeMatch?.primary_problem} />
            </div>
          )}

          {mainTab === 'healing' && (
            <div className="dc-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              <GuidedHealing problem={activeMatch?.primary_problem} />
            </div>
          )}

          {/* Messages area — only shown when mainTab === 'chat' */}
          <div
            className="dc-scroll"
            style={{ flex: mainTab === 'chat' ? 1 : 0, overflowY: 'auto', padding: '0 24px 16px', display: mainTab === 'chat' ? 'block' : 'none' }}
          >
            {/* Welcome Hero Card — only shown when messages empty */}
            {messages.length === 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #F8F4FF 0%, #EDE5FF 40%, #E4D8FF 100%)',
                borderRadius: 20,
                margin: '16px 0',
                overflow: 'hidden',
                minHeight: 200,
                display: 'flex',
              }}>
                {/* Left */}
                <div style={{ flex: '0 0 55%', padding: '24px 28px' }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700, color: '#1A1333',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    marginBottom: 8,
                  }}>
                    {timeEmoji} {timeGreeting}, {firstName}
                  </div>
                  <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 280, lineHeight: 1.6, margin: '0 0 14px' }}>
                    I'm here to listen, understand and support you on your healing journey.
                  </p>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 10 }}>
                    How are you feeling right now?
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {moodChips.map(chip => (
                      <button
                        key={chip.label}
                        onClick={() => setSelectedMood(chip.label)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 50,
                          background: selectedMood === chip.label ? 'rgba(109,74,255,0.15)' : 'rgba(255,255,255,0.7)',
                          border: selectedMood === chip.label ? '1.5px solid #6D4AFF' : '1.5px solid rgba(109,74,255,0.2)',
                          color: selectedMood === chip.label ? '#6D4AFF' : '#4B5563',
                          fontSize: 13, fontWeight: 600,
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          boxShadow: selectedMood === chip.label ? '0 0 0 3px rgba(109,74,255,0.12)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {chip.emoji} {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Right — SVG */}
                <div style={{ flex: '0 0 45%' }}>
                  <WelcomeMeditation />
                </div>
              </div>
            )}

            {/* Date separator */}
            {messages.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 12px' }}>
                <span style={{
                  background: 'rgba(109,74,255,0.08)', color: '#9CA3AF',
                  fontSize: 11, padding: '4px 14px', borderRadius: 20,
                }}>
                  Today
                </span>
              </div>
            )}

            {/* Safety notice */}
            {!safetyDismissed[activeMatch?.id] && messages.length > 0 && (
              <SafetyNotice onDismiss={() => setSafetyDismissed(prev => ({ ...prev, [activeMatch.id]: true }))} />
            )}

            {/* Messages */}
            {messages.map((msg) => {
              const isMe = msg.from === 'me';
              return (
                <div
                  key={msg.id}
                  className="dc-msg"
                  style={{
                    display: 'flex',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {!isMe && (
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      PR
                    </div>
                  )}
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{
                      padding: '14px 18px',
                      fontSize: 14,
                      lineHeight: 1.65,
                      ...(isMe ? {
                        background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                        borderRadius: '20px 4px 20px 20px',
                        color: '#ffffff',
                        boxShadow: '0 2px 12px rgba(109,74,255,0.25)',
                      } : {
                        background: '#FFFFFF',
                        border: '1px solid rgba(109,74,255,0.1)',
                        borderRadius: '4px 20px 20px 20px',
                        color: '#1A1333',
                        boxShadow: '0 2px 12px rgba(109,74,255,0.07)',
                      }),
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      gap: 4,
                      marginTop: 4,
                    }}>
                      <span style={{
                        fontSize: 11,
                        color: isMe ? 'rgba(255,255,255,0.6)' : '#9CA3AF',
                      }}>
                        {fmt(msg.time)}
                      </span>
                      {isMe && (
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && <TypingIndicator grad={activeMatch?.grad} />}
            <div ref={bottomRef} />
          </div>

          {/* Quick Starters — only in chat tab */}
          {mainTab !== 'chat' ? null : <div style={{
            padding: '8px 24px',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            flexShrink: 0,
            background: '#FAF7FF',
          }}>
            {quickStarters.map((starter) => (
              <button
                key={starter}
                onClick={() => { setInput(starter.slice(starter.indexOf(' ') + 1)); sendMessage(starter.slice(starter.indexOf(' ') + 1)); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 50,
                  border: '1.5px solid rgba(109,74,255,0.2)',
                  background: '#fff',
                  fontSize: 12, fontWeight: 600, color: '#4B5563',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6D4AFF'; e.currentTarget.style.color = '#6D4AFF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(109,74,255,0.2)'; e.currentTarget.style.color = '#4B5563'; }}
              >
                {starter}
              </button>
            ))}
          </div>}

          {/* Input area — chat tab only */}
          {mainTab === 'chat' && <div style={{
            background: '#FFFFFF',
            borderTop: '1px solid rgba(109,74,255,0.1)',
            padding: '14px 24px',
            flexShrink: 0,
          }}>
            {/* Safety banner — shown above input when not dismissed */}
            {!safetyDismissed[activeMatch?.id] && messages.length === 0 && (
              <SafetyNotice onDismiss={() => setSafetyDismissed(prev => ({ ...prev, [activeMatch.id]: true }))} />
            )}

            {/* Input row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Share what's on your mind..."
                style={{
                  flex: 1,
                  background: '#F5F3FF',
                  border: '1.5px solid rgba(109,74,255,0.15)',
                  borderRadius: 16,
                  padding: '14px 18px',
                  fontSize: 14,
                  color: '#1A1333',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6D4AFF'}
                onBlur={e => e.target.style.borderColor = 'rgba(109,74,255,0.15)'}
              />
              {/* Send button */}
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6D4AFF, #5B21B6)',
                  border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() && !typing ? '0 4px 16px rgba(109,74,255,0.4)' : 'none',
                  opacity: !input.trim() || typing ? 0.45 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {/* Bottom action row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(109,74,255,0.07)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, cursor: 'pointer', color: '#6D4AFF',
                }}>
                  +
                </button>
                <button style={{
                  padding: '6px 14px', borderRadius: 20,
                  background: 'rgba(109,74,255,0.07)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#6D4AFF',
                  gap: 5, fontFamily: 'inherit',
                }}>
                  🎤 Voice note
                </button>
              </div>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>
                🔒 Anonymous &amp; encrypted
              </p>
            </div>
          </div>}
        </div>

        {/* ─────────────────── RIGHT WELLNESS PANEL ─────────────────────────── */}
        <div
          className="dc-right dc-scroll"
          style={{
            background: '#FFFFFF',
            borderLeft: '1px solid rgba(109,74,255,0.1)',
            overflowY: 'auto',
            padding: '20px 16px',
          }}
        >
          {/* Card 1 — Your Wellness Journey */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(109,74,255,0.1)',
            padding: 18,
            marginBottom: 14,
            boxShadow: '0 2px 20px rgba(109,74,255,0.08)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 14 }}>
              Your Wellness Journey
            </div>
            {/* Current Mood */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Current Mood
              </div>
              <span style={{
                background: 'rgba(109,74,255,0.08)',
                borderRadius: 20, padding: '5px 12px',
                fontSize: 13, fontWeight: 600, color: '#1A1333',
              }}>
                {selectedMood ? `${moodChips.find(m => m.label === selectedMood)?.emoji || ''} ${selectedMood}` : '🙂 Calm'}
              </span>
            </div>
            {/* Today's Check-in */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Today's Check-in</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6D4AFF' }}>3 / 5</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(109,74,255,0.1)', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #6D4AFF, #A78BFA)', borderRadius: 3 }} />
              </div>
            </div>
            {/* Weekly Progress */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Weekly Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6D4AFF' }}>72%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(109,74,255,0.1)', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #6D4AFF, #A78BFA)', borderRadius: 3 }} />
              </div>
            </div>
            {/* Current Stage */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Current Stage</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6D4AFF' }}>Healing ✨</span>
              </div>
              <LotusSmall size={20} />
            </div>
          </div>

          {/* Card 2 — Daily Affirmation */}
          <div style={{
            background: 'linear-gradient(135deg, #F8F4FF, #F3EEFF)',
            borderRadius: 16,
            border: '1px solid rgba(109,74,255,0.1)',
            padding: 18,
            marginBottom: 14,
            boxShadow: '0 2px 20px rgba(109,74,255,0.08)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 10 }}>
              Daily Affirmation
            </div>
            <div style={{ fontSize: 48, color: '#A78BFA', lineHeight: 0.5, marginBottom: 8 }}>"</div>
            <p style={{
              fontSize: 14, color: '#4B5563', fontStyle: 'italic',
              lineHeight: 1.7, margin: '0 0 12px',
            }}>
              {todayAffirmation}
            </p>
            <div style={{ textAlign: 'center', fontSize: 18 }}>💜</div>
          </div>

          {/* Card 3 — Tools For You */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(109,74,255,0.1)',
            padding: 18,
            marginBottom: 14,
            boxShadow: '0 2px 20px rgba(109,74,255,0.08)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 12 }}>
              Tools For You
            </div>
            {[
              { icon: '🧘', title: '2-Min Calm Breathing', sub: 'Relax your mind' },
              { icon: '📔', title: 'Reflection Journal', sub: 'Write your thoughts' },
              { icon: '🎵', title: 'Soothing Music', sub: 'Calm your soul' },
            ].map((tool, i, arr) => (
              <div
                key={tool.title}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(109,74,255,0.06)' : 'none',
                  cursor: 'pointer',
                  borderRadius: 10,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(109,74,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(109,74,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1333', marginBottom: 2 }}>{tool.title}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{tool.sub}</div>
                </div>
                <span style={{ color: '#A78BFA', fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>

          {/* Card 4 — Need Immediate Support */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.06), rgba(255,200,210,0.08))',
            borderRadius: 16,
            border: '1px solid rgba(244,114,182,0.2)',
            padding: 18,
            marginBottom: 14,
            boxShadow: '0 2px 20px rgba(109,74,255,0.08)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#BE185D', marginBottom: 6 }}>
              Need immediate support?
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 14px', lineHeight: 1.5 }}>
              You are not alone. Help is always here.
            </p>
            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #F472B6, #EC4899)',
              color: '#fff', fontWeight: 700,
              borderRadius: 12, padding: '10px',
              fontSize: 13, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              📞 View Crisis Resources
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
