import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import ThemeToggle from '../components/ThemeToggle';
import ActivitySuggestions from '../components/ActivitySuggestions';
import GuidedHealing from '../components/GuidedHealing';

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
  @keyframes dashStarPulse {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(1.7); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40% { transform: translateY(-6px); opacity: 1; }
  }
  @keyframes slideInChat {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGreen {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.0); }
    50%       { box-shadow: 0 0 0 4px rgba(52,211,153,0.2); }
  }
  .dash-scroll::-webkit-scrollbar { width: 4px; }
  .dash-scroll::-webkit-scrollbar-track { background: transparent; }
  .dash-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.25); border-radius: 4px; }
  .dash-msg-enter { animation: slideInChat 0.25s ease forwards; }
`;

// ── Background Particles ──────────────────────────────────────────────────────
const BG_PARTICLES = [
  { l: '5%',  t: '10%', s: 1.5, c: '#d4af37', d: 0 },
  { l: '18%', t: '72%', s: 1,   c: '#c4b5fd', d: 0.9 },
  { l: '32%', t: '28%', s: 2,   c: '#ffffff', d: 1.8 },
  { l: '47%', t: '85%', s: 1.5, c: '#d4af37', d: 0.5 },
  { l: '60%', t: '15%', s: 1,   c: '#c4b5fd', d: 2.3 },
  { l: '75%', t: '60%', s: 2,   c: '#ffffff', d: 1.1 },
  { l: '86%', t: '30%', s: 1.5, c: '#d4af37', d: 2.7 },
  { l: '93%', t: '80%', s: 1,   c: '#c4b5fd', d: 0.3 },
  { l: '12%', t: '45%', s: 1,   c: '#ffffff', d: 1.5 },
  { l: '65%', t: '90%', s: 2,   c: '#d4af37', d: 3.2 },
];

function BgParticles() {
  return (
    <>
      {BG_PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.l, top: p.t,
            width: p.s, height: p.s,
            borderRadius: '50%',
            background: p.c,
            animation: `dashStarPulse ${2.5 + (i % 3) * 0.6}s ease-in-out ${p.d}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

// ── Safety Notice ─────────────────────────────────────────────────────────────
function SafetyNotice({ onDismiss }) {
  return (
    <div style={{
      margin: '14px 16px 6px',
      borderRadius: 18,
      overflow: 'hidden',
      background: 'rgba(251,191,36,0.06)',
      border: '1px solid rgba(251,191,36,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <div>
              <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>
                Safety &amp; Privacy Notice
              </p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(251,191,36,0.72)', lineHeight: 1.6 }}>
                Never share your phone number, address, or social media with matches.
                Your safety is our priority. If you feel unsafe,{' '}
                <span style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  visit our Safety Center
                </span>.
                This is a peer support space — not a substitute for professional care.
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
              color: '#fbbf24', fontSize: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator({ grad }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '4px 16px', alignItems: 'flex-end', gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: grad || 'linear-gradient(135deg,#7c3aed,#6d28d9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0,
      }}>
        P
      </div>
      <div style={{
        padding: '10px 16px', borderRadius: '20px 20px 20px 4px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 14 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'rgba(168,85,247,0.8)',
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                boxShadow: '0 0 6px rgba(168,85,247,0.5)',
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
  const { logout }    = useAuthStore();
  const navigate      = useNavigate();
  const location      = useLocation();

  const [matches]              = useState(DEMO_MATCHES);
  const [activeMatch, setActiveMatch]         = useState(DEMO_MATCHES[0]);
  const [chatHistory, setChatHistory]         = useState({});
  const [conversationState, setConversationState] = useState({});
  const [input, setInput]                     = useState('');
  const [typing, setTyping]                   = useState(false);
  const [safetyDismissed, setSafetyDismissed] = useState({});
  const [showActivity, setShowActivity]       = useState(false);
  const [rightTab, setRightTab]               = useState('activities');
  const [mainTab, setMainTab]                 = useState('chat'); // 'chat' | 'relief' | 'healing'
  const [mobileView, setMobileView]           = useState('list');
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);
  const bottomRef = useRef(null);

  // Pre-select match from Matches page
  useEffect(() => {
    if (location.state?.matchId) {
      const found = DEMO_MATCHES.find(m => m.id === location.state.matchId);
      if (found) { setActiveMatch(found); setMobileView('chat'); }
    }
  }, [location.state]);

  // Init chat history
  useEffect(() => {
    const initHistory = {};
    const initState   = {};
    DEMO_MATCHES.forEach(m => {
      initHistory[m.id] = [
        {
          id: 1, from: 'bot',
          text: `Hi! 👋 I'm ${m.name}. SoulConnect just matched us and I'm honestly really glad — I don't always find it easy to connect with new people, but something about this felt right 😊`,
          time: new Date(Date.now() - 5 * 60000),
        },
        {
          id: 2, from: 'bot',
          text: `How are you doing today? And I mean that genuinely — not looking for "fine, thanks". What's actually going on with you? 💙`,
          time: new Date(Date.now() - 4 * 60000),
        },
      ];
      initState[m.id] = { userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false };
    });
    setChatHistory(initHistory);
    setConversationState(initState);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typing, activeMatch]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const text  = input.trim();
    setInput('');
    const msgId = Date.now();

    setChatHistory(prev => ({
      ...prev,
      [activeMatch.id]: [...(prev[activeMatch.id] || []), { id: msgId, from: 'me', text, time: new Date() }],
    }));

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
      setChatHistory(prev => ({
        ...prev,
        [activeMatch.id]: [...(prev[activeMatch.id] || []), { id: msgId + 1, from: 'bot', text: response, time: new Date() }],
      }));
    }, delay);
  };

  const messages        = chatHistory[activeMatch?.id] || [];
  const filteredMatches = matches.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const fmt             = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // ── Colour constants ───────────────────────────────────────────────────────
  const SIDEBAR_BG   = 'rgba(8, 2, 20, 0.97)';
  const CHAT_BG      = 'linear-gradient(180deg, #06010f 0%, #0d0425 50%, #080215 100%)';
  const BORDER_COLOR = 'rgba(124,58,237,0.15)';
  const GOLD         = '#d4af37';

  return (
    <>
      <style>{DASH_STYLES}</style>

      <div style={{
        display: 'flex',
        overflow: 'hidden',
        height: '100dvh',
        background: '#06010f',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>

        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <div
          className={mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
          style={{
            flexDirection: 'column',
            width: '100%',
            maxWidth: 320,
            flexShrink: 0,
            borderRight: `1px solid ${BORDER_COLOR}`,
            background: SIDEBAR_BG,
            display: mobileView === 'chat' ? 'none' : 'flex',
          }}
        >
          {/* Logo area */}
          <div style={{ padding: 'max(env(safe-area-inset-top,0px),20px) 20px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 12,
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                  boxShadow: '0 0 18px rgba(124,58,237,0.4)',
                }}>🌟</div>
                <span style={{
                  fontWeight: 800, fontSize: 16,
                  background: `linear-gradient(135deg, ${GOLD}, #fff9e0, ${GOLD})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>SoulConnect</span>
              </div>
              <ThemeToggle />
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: 'rgba(196,181,253,0.4)',
              }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search matches..."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                  borderRadius: 14, fontSize: 13,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(221,214,254,0.9)',
                  border: searchFocused
                    ? `1.5px solid rgba(212,175,55,0.45)`
                    : '1.5px solid rgba(255,255,255,0.08)',
                  outline: 'none',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {/* Demo notice */}
          <div style={{
            margin: '0 12px 12px',
            padding: '10px 14px',
            borderRadius: 14,
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#a855f7' }}>Demo Active</p>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(196,181,253,0.55)', lineHeight: 1.4 }}>
                Chat with Priya — a real-feeling AI companion
              </p>
            </div>
          </div>

          {/* Match list */}
          <div className="dash-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
            {filteredMatches.map(m => {
              const isActive = activeMatch?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => { setActiveMatch(m); setMobileView('chat'); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 12px', borderRadius: 16, marginBottom: 4,
                    textAlign: 'left', cursor: 'pointer',
                    background: isActive
                      ? 'rgba(124,58,237,0.12)'
                      : 'transparent',
                    border: isActive
                      ? '1.5px solid rgba(124,58,237,0.3)'
                      : '1.5px solid transparent',
                    borderLeft: isActive ? '3px solid rgba(124,58,237,0.7)' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.08)' : 'none',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: m.grad,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                      boxShadow: isActive ? '0 0 14px rgba(124,58,237,0.4)' : 'none',
                    }}>
                      {m.initials}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 11, height: 11, borderRadius: '50%',
                      background: m.online ? '#34d399' : '#6b7280',
                      border: '2px solid #08020f',
                      animation: m.online ? 'pulseGreen 2.5s ease-in-out infinite' : 'none',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: '#e2d9f3',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{m.name}</span>
                        {m.isDemo && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 6,
                            background: 'rgba(168,85,247,0.15)', color: '#a855f7',
                            flexShrink: 0,
                          }}>DEMO</span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, color: 'rgba(196,181,253,0.35)', flexShrink: 0, marginLeft: 4 }}>
                        {m.last_time}
                      </span>
                    </div>
                    <p style={{
                      margin: 0, fontSize: 11,
                      color: 'rgba(196,181,253,0.45)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{m.last_message}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div style={{
            padding: `16px 16px max(env(safe-area-inset-bottom,0px),16px)`,
            borderTop: `1px solid ${BORDER_COLOR}`,
          }}>
            <button
              onClick={() => navigate('/healers')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
                background: 'linear-gradient(135deg, #0891b2, #2563eb)',
                border: 'none', marginBottom: 8,
                boxShadow: '0 4px 20px rgba(8,145,178,0.3)',
              }}
            >
              <span style={{ fontSize: 20 }}>🧘</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>Talk to a Healer</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(186,230,253,0.8)' }}>Book a professional session</p>
              </div>
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                width: '100%', padding: '8px', borderRadius: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 500,
                color: 'rgba(196,181,253,0.35)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(196,181,253,0.65)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(196,181,253,0.35)'}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* ── MAIN CHAT AREA ──────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: mobileView === 'list' ? 'none' : 'flex',
            flexDirection: 'column',
            minWidth: 0,
            position: 'relative',
            background: CHAT_BG,
          }}
        >
          {/* Background particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <BgParticles />
          </div>

          {/* Chat header */}
          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: `max(env(safe-area-inset-top,0px),12px) 16px 12px`,
            borderBottom: `1px solid ${BORDER_COLOR}`,
            background: 'rgba(6,1,15,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            position: 'relative', zIndex: 10,
          }}>
            {/* Mobile back button */}
            <button
              onClick={() => setMobileView('list')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                color: '#e2d9f3', fontSize: 20,
                cursor: 'pointer',
                marginRight: 4,
              }}
              className="md:hidden"
            >
              ‹
            </button>

            {/* Match avatar with glow */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                background: activeMatch?.grad || '#7c3aed',
                opacity: 0.3, filter: 'blur(8px)',
              }} />
              <div style={{
                position: 'relative',
                width: 40, height: 40, borderRadius: '50%',
                background: activeMatch?.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                {activeMatch?.initials}
              </div>
              {activeMatch?.online && (
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#34d399',
                  border: '2px solid #06010f',
                  animation: 'pulseGreen 2.5s ease-in-out infinite',
                }} />
              )}
            </div>

            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>
                  {activeMatch?.name}
                </span>
                {activeMatch?.online && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#34d399', fontWeight: 500 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulseGreen 2s infinite' }} />
                    online
                  </span>
                )}
                {activeMatch?.isDemo && (
                  <span style={{
                    fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                    background: 'rgba(168,85,247,0.15)', color: '#a855f7',
                  }}>AI DEMO</span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(196,181,253,0.6)' }}>
                {PROBLEM_LABELS[activeMatch?.primary_problem]} · {activeMatch?.match_score}% match
                {activeMatch?.isDemo && ' · AI companion'}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => { setShowActivity(true); setRightTab('activities'); }}
                style={{
                  display: 'none',
                  alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 12,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: showActivity && rightTab === 'activities'
                    ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                    : 'rgba(255,255,255,0.06)',
                  color: showActivity && rightTab === 'activities' ? '#fff' : 'rgba(196,181,253,0.7)',
                  border: showActivity && rightTab === 'activities'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: showActivity && rightTab === 'activities'
                    ? '0 0 16px rgba(124,58,237,0.4)'
                    : 'none',
                }}
                className="hidden md:flex"
              >
                💡 Activities
              </button>
              <button
                onClick={() => { setShowActivity(true); setRightTab('healing'); }}
                style={{
                  display: 'none',
                  alignItems: 'center', gap: 6,
                  padding: '7px 12px', borderRadius: 12,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: showActivity && rightTab === 'healing'
                    ? `linear-gradient(135deg,${GOLD},#a855f7)`
                    : 'rgba(255,255,255,0.06)',
                  color: showActivity && rightTab === 'healing' ? '#fff' : 'rgba(196,181,253,0.7)',
                  border: showActivity && rightTab === 'healing'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: showActivity && rightTab === 'healing'
                    ? `0 0 16px rgba(212,175,55,0.35)`
                    : 'none',
                }}
                className="hidden md:flex"
              >
                🌟 Healing
              </button>
              <button style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(196,181,253,0.6)', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>⋯</button>
            </div>
          </div>

          {/* ── TAB BAR ── */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            gap: 6,
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(6,1,15,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative', zIndex: 10,
          }}>
            {[
              { key: 'chat',    icon: '💬', label: 'Chat' },
              { key: 'relief',  icon: '⚡', label: 'Quick Relief' },
              { key: 'healing', icon: '🌟', label: 'Guided Healing' },
            ].map(t => (
              <button key={t.key} onClick={() => setMainTab(t.key)} style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                background: mainTab === t.key
                  ? t.key === 'healing'
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(168,85,247,0.25))'
                    : t.key === 'relief'
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))'
                    : 'rgba(124,58,237,0.2)'
                  : 'rgba(255,255,255,0.04)',
                color: mainTab === t.key
                  ? t.key === 'healing' ? '#d4af37' : '#c4b5fd'
                  : 'rgba(196,181,253,0.4)',
                borderBottom: mainTab === t.key
                  ? `2px solid ${t.key === 'healing' ? '#d4af37' : '#7c3aed'}`
                  : '2px solid transparent',
                boxShadow: mainTab === t.key
                  ? t.key === 'healing'
                    ? '0 0 16px rgba(212,175,55,0.15)'
                    : '0 0 16px rgba(124,58,237,0.15)'
                  : 'none',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Messages scroll area */}
          <div
            className="dash-scroll"
            style={{
              display: mainTab === 'chat' ? undefined : 'none',
              flex: 1, overflowY: 'auto',
              position: 'relative', zIndex: 1,
            }}
          >
            {/* Safety notice */}
            {!safetyDismissed[activeMatch?.id] && (
              <SafetyNotice onDismiss={() => setSafetyDismissed(prev => ({ ...prev, [activeMatch.id]: true }))} />
            )}

            {/* Match reason banner */}
            <div style={{
              margin: '12px 16px',
              padding: '12px 16px',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: 'rgba(196,181,253,0.65)' }}>
                ✨ Why you were matched
              </p>
              <p style={{ margin: 0, fontSize: 11, fontStyle: 'italic', color: 'rgba(196,181,253,0.45)' }}>
                "{activeMatch?.match_reason}"
              </p>
            </div>

            {/* Messages */}
            <div style={{ padding: '0 16px 16px' }}>
              {messages.map((msg, i) => {
                const isMe      = msg.from === 'me';
                const showAvatar = !isMe && (i === 0 || messages[i - 1]?.from === 'me');
                return (
                  <div
                    key={msg.id}
                    className="dash-msg-enter"
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    {/* Bot avatar */}
                    {!isMe && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: activeMatch?.grad,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, color: '#fff',
                        flexShrink: 0,
                        opacity: showAvatar ? 1 : 0,
                      }}>
                        {activeMatch?.initials?.[0]}
                      </div>
                    )}

                    {/* Bubble */}
                    <div style={{ maxWidth: '70%', position: 'relative' }} className="group">
                      <div style={{
                        padding: '11px 16px',
                        fontSize: 13,
                        lineHeight: 1.65,
                        borderRadius: isMe
                          ? '20px 20px 4px 20px'
                          : '20px 20px 20px 4px',
                        ...(isMe ? {
                          background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                          color: '#ffffff',
                          boxShadow: '0 2px 20px rgba(124,58,237,0.35)',
                        } : {
                          background: 'rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#e2d9f3',
                        }),
                      }}>
                        {msg.text}
                      </div>
                      {/* Timestamp on hover */}
                      <p style={{
                        margin: '3px 4px 0',
                        fontSize: 10,
                        textAlign: isMe ? 'right' : 'left',
                        color: GOLD,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                        className="group-hover-timestamp"
                      >
                        {fmt(msg.time)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {typing && <TypingIndicator grad={activeMatch?.grad} />}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Relief tab content */}
          {mainTab === 'relief' && (
            <div className="dash-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <ActivitySuggestions
                problemType={activeMatch?.primary_problem || 'anxiety'}
                matchName={activeMatch?.name}
                onActivityComplete={() => {}}
              />
            </div>
          )}

          {/* Healing tab content */}
          {mainTab === 'healing' && (
            <div className="dash-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <GuidedHealing
                problemType={activeMatch?.primary_problem || 'anxiety'}
                matchName={activeMatch?.name || 'Your Match'}
                userId={activeMatch?.id}
              />
            </div>
          )}

          {/* Input bar — only in chat tab */}
          {mainTab === 'chat' && <div style={{
            flexShrink: 0,
            padding: `12px 16px max(env(safe-area-inset-bottom,0px),12px)`,
            borderTop: `1px solid ${BORDER_COLOR}`,
            background: 'rgba(6,1,15,0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            position: 'relative', zIndex: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Emoji button */}
              <button style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                fontSize: 17, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                😊
              </button>

              {/* Text input */}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder={`Message ${activeMatch?.name}...`}
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 20,
                  fontSize: 13,
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e2d9f3',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(16px)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                style={{
                  width: 42, height: 42, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #d4af37 0%, #a855f7 100%)',
                  border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() && !typing ? '0 0 20px rgba(212,175,55,0.35)' : 'none',
                  opacity: !input.trim() || typing ? 0.4 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (input.trim() && !typing) e.currentTarget.style.boxShadow = '0 0 30px rgba(212,175,55,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = input.trim() && !typing ? '0 0 20px rgba(212,175,55,0.35)' : 'none';
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 10, marginTop: 8, color: 'rgba(196,181,253,0.3)' }}>
              🔒 Anonymous &amp; encrypted ·{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Report</span>
            </p>
          </div>}
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        {showActivity && (
          <div
            className="hidden lg:flex"
            style={{
              flexDirection: 'column',
              width: 320,
              flexShrink: 0,
              borderLeft: `1px solid ${BORDER_COLOR}`,
              background: SIDEBAR_BG,
              overflowY: 'auto',
            }}
          >
            {/* Panel header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 16px 14px',
              borderBottom: `1px solid ${BORDER_COLOR}`,
              flexShrink: 0,
            }}>
              {/* Frosted pill tabs */}
              <div style={{
                display: 'flex', gap: 4, padding: 4,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <button
                  onClick={() => setRightTab('activities')}
                  style={{
                    padding: '6px 12px', borderRadius: 10,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    border: 'none',
                    background: rightTab === 'activities'
                      ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                      : 'transparent',
                    color: rightTab === 'activities' ? '#fff' : 'rgba(196,181,253,0.5)',
                    boxShadow: rightTab === 'activities' ? '0 0 12px rgba(124,58,237,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                  ⚡ Relief
                </button>
                <button
                  onClick={() => setRightTab('healing')}
                  style={{
                    padding: '6px 12px', borderRadius: 10,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    border: 'none',
                    background: rightTab === 'healing'
                      ? `linear-gradient(135deg,${GOLD},#a855f7)`
                      : 'transparent',
                    color: rightTab === 'healing' ? '#fff' : 'rgba(196,181,253,0.5)',
                    boxShadow: rightTab === 'healing' ? `0 0 12px rgba(212,175,55,0.35)` : 'none',
                    transition: 'all 0.2s',
                  }}>
                  🌟 Healing
                </button>
              </div>
              <button
                onClick={() => setShowActivity(false)}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(196,181,253,0.5)', fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                ✕
              </button>
            </div>

            {/* Panel content */}
            <div className="dash-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {rightTab === 'activities' && (
                <>
                  <ActivitySuggestions
                    problemType={activeMatch?.primary_problem || 'anxiety'}
                    matchName={activeMatch?.name}
                    onActivityComplete={() => {}}
                  />
                  <div style={{
                    borderRadius: 18, overflow: 'hidden', marginTop: 14,
                    background: 'linear-gradient(135deg,#0f0c29,#302b63)',
                    border: '1px solid rgba(124,58,237,0.3)',
                  }}>
                    <div style={{ padding: 16 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#fff' }}>Need more support?</p>
                      <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(196,181,253,0.7)' }}>Chat with a verified therapist or counsellor.</p>
                      <button
                        onClick={() => navigate('/healers')}
                        style={{
                          width: '100%', padding: '9px', borderRadius: 12,
                          fontSize: 12, fontWeight: 700, color: '#fff',
                          background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                          border: 'none', cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                        }}>
                        Browse Healers →
                      </button>
                    </div>
                  </div>
                  <div style={{
                    borderRadius: 18, overflow: 'hidden', marginTop: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ padding: 16 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#e2d9f3' }}>👥 Join a Meetup</p>
                      <p style={{ margin: '0 0 12px', fontSize: 11, color: 'rgba(196,181,253,0.5)' }}>Small group sessions for your challenge.</p>
                      <button
                        onClick={() => navigate('/meetups')}
                        style={{
                          width: '100%', padding: '9px', borderRadius: 12,
                          fontSize: 12, fontWeight: 600, color: 'rgba(196,181,253,0.8)',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                        }}>
                        See Upcoming Meetups
                      </button>
                    </div>
                  </div>
                </>
              )}

              {rightTab === 'healing' && (
                <GuidedHealing
                  problemType={activeMatch?.primary_problem || 'anxiety'}
                  matchName={activeMatch?.name || 'Your Match'}
                  userId={activeMatch?.id}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
