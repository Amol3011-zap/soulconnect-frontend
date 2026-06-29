import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Star, Volume2, MoreHorizontal,
  Send, Mic, Bookmark, ChevronRight, ExternalLink,
  LogOut, User,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { journeyAPI } from '../services/api';
import ActivitySuggestions from '../components/ActivitySuggestions';
import GuidedHealing from '../components/GuidedHealing';
import DailyChallenges from '../components/DailyChallenges';

// ─── Crisis phrase detection ───────────────────────────────────────────────────
const CRISIS_PHRASES = [
  'i want to die','want to die','kill myself','end my life','end it all',
  'i want to hurt myself','hurt myself','harm myself','self harm','selfharm',
  'nobody would miss me','no one would miss me','nobody cares',
  "i can't go on",'cant go on','cannot go on','i give up on life',
  'not worth living','thinking about suicide','suicidal','sucide','suicide',
  'i want to disappear forever','want to stop existing','want to end it',
];
function detectCrisis(text) {
  const l = text.toLowerCase();
  return CRISIS_PHRASES.some(p => l.includes(p));
}

// ─── Crisis Popup ─────────────────────────────────────────────────────────────
function CrisisPopup({ onClose, onNavigate }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          background: '#1A1033', borderRadius: 28, padding: '36px 30px',
          maxWidth: 420, width: '100%',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.2)',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, margin: '0 auto 18px',
          boxShadow: '0 8px 28px rgba(109,74,255,0.4)',
        }}>💜</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          We hear you
        </h2>
        <p style={{ color: 'rgba(196,181,253,0.8)', fontSize: 14, lineHeight: 1.75, margin: '0 0 22px' }}>
          What you're feeling matters. You don't have to carry this alone. Trained professionals are ready to help right now.
        </p>
        <div style={{
          background: 'rgba(251,191,36,0.1)', borderRadius: 12, padding: '12px 16px',
          marginBottom: 20, border: '1px solid rgba(251,191,36,0.25)',
        }}>
          <p style={{ margin: 0, color: '#FCD34D', fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>
            🚨 If you're in immediate danger — call <strong>112 / 911 / 999</strong>
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <button onClick={() => onNavigate('/crisis-support')} style={{
            background: 'linear-gradient(135deg,#DC2626,#B91C1C)', color: '#fff',
            border: 'none', borderRadius: 99, padding: '14px', fontSize: 15,
            fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 16px rgba(220,38,38,0.35)',
          }}>🆘 Crisis Support &amp; Helplines</button>
          <button onClick={() => onNavigate('/professionals')} style={{
            background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: '#fff',
            border: 'none', borderRadius: 99, padding: '14px', fontSize: 15,
            fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}>🧘 Find Professional Support</button>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'rgba(196,181,253,0.5)',
          fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          textDecoration: 'underline',
        }}>I'm okay, continue chatting</button>
      </motion.div>
    </div>
  );
}

// ─── Demo matches ──────────────────────────────────────────────────────────────
const DEMO_MATCHES = [
  {
    id: 101, name: 'Soul Guide', initials: 'SG', age: null, city: null,
    primary_problem: 'anxiety', match_score: 100,
    last_message: 'Hi 💜 I\'m here for you. How are you feeling today?',
    last_time: 'Just now', online: true,
    grad: 'linear-gradient(135deg, #7C3AED, #A855F7)',
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

// ─── Conversation AI ───────────────────────────────────────────────────────────
function detectSentiment(text) {
  const lower = text.toLowerCase().trim();
  const greetingOnly = /^(hi+|hey+|hello+|hii+|yo|sup|hola|namaste|heya)\s*[!.?]?\s*$/.test(lower);
  if (greetingOnly) return 'greeting';
  const negativeWords = [
    'bad','not good','terrible','awful','tired','struggling','sad','low','down','hurt','pain',
    'cry','crying','scared','anxious','depressed','lonely','alone','lost','broken','numb',
    'hopeless','worthless','empty','exhausted','overwhelmed','stressed','fail','nothing matters',
    'nobody cares','hate myself','hate this','mess','horrible','worst','not okay','not fine',
    "can't","don't know",'give up','no point','pointless','dark','suffocating','heavy','invisible',
  ];
  for (const word of negativeWords) { if (lower.includes(word)) return 'negative'; }
  const positiveWords = [
    'good','great','fine','okay','well','happy','amazing','awesome','better','nice','wonderful',
    'fantastic','excited','grateful','blessed','loved','peaceful','calm','thankful','hopeful',
  ];
  for (const word of positiveWords) { if (lower.includes(word)) return 'positive'; }
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
  } else if (userMessageCount === 1) {
    if (sentiment === 'negative' || newState.hasOpenedUp) {
      response = `I really appreciate you trusting me with that. Seriously. A lot of people keep things bottled up for so long, and it just gets heavier and heavier. What you're feeling is valid — every bit of it. Can I ask... how long have you been carrying this?`;
    } else if (sentiment === 'positive') {
      response = `I love hearing that 😊 It's so important to notice those good moments. I do want to ask though — we got matched because we both deal with ${PROBLEM_LABELS[problem] || 'some similar things'}. How has that side of life been for you lately? You can be honest with me.`;
    } else {
      response = `I hear you. And you know what? There's no pressure to have everything figured out. Sometimes just being able to say something out loud to someone who gets it... that helps more than we think. What's been the hardest part for you lately?`;
    }
  } else if (userMessageCount === 2) {
    const responses = [
      `Can I just say something? You matter. Like genuinely, you matter so much. What you're going through doesn't define you — but it absolutely deserves to be heard. I'm really glad you're here, talking about this 💜 Have you been able to talk to anyone else about this — a therapist, a counsellor, or even someone you really trust?`,
      `I just want you to know — you are not alone in this. Not even a little. And whatever you're feeling right now? It's okay to feel it. You don't have to "push through" or pretend to be okay when you're not. That's what this space is for. Can I ask — have you talked to anyone else about what you're going through?`,
      `Something you said really hit me. The fact that you're talking about this? That's brave. Real bravery. 💙 Have you ever spoken to a therapist or counsellor about any of this?`,
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
    newState.askedAboutTherapist = true;
  } else if (userMessageCount === 3) {
    const saidNo = lower.includes('no') || lower.includes('not') || lower.includes('never') || lower.includes("haven't") || lower.includes("nope");
    const saidYes = lower.includes('yes') || lower.includes('yeah') || lower.includes('therapist') || lower.includes('counsell') || lower.includes('therapy');
    if (askedAboutTherapist && saidNo) {
      response = `That's completely okay — so many people haven't, and it can feel like a big, scary step. But here's the thing... you deserve more than just surviving. You deserve to actually heal 💙 Is there anything that's holding you back from reaching out to someone? No judgment at all.`;
    } else if (askedAboutTherapist && saidYes) {
      response = `That's genuinely so good to hear. Having that kind of support makes such a difference. How has it been going? And I just want you to know — I'm here too, between those sessions, whenever you need someone to just talk to.`;
    } else {
      response = `I want to say this clearly — things CAN get better. I know it might not feel that way right now. The fact that you're here, that you're talking, that you haven't given up on yourself? That means everything. What would feel like a tiny win for you today?`;
    }
  } else if (userMessageCount === 4) {
    const responses = [
      `You know what I keep thinking? You're stronger than you give yourself credit for. The things you carry... most people would have cracked. But you're still here. Still showing up. That's not nothing — that's everything. 💜`,
      `I just want to check in — how are you feeling right now, in this actual moment? Not how you've been feeling, just... right now, after talking about all of this?`,
      `Healing isn't a straight line, and I think that's something nobody tells us enough. But I want you to know — I'm not going anywhere. I'm here for you. 💙`,
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  } else {
    if (lower.includes('give up') || lower.includes('no point') || lower.includes('end it')) {
      response = `Hey — please hear me. I'm right here. What you're feeling right now is real and heavy, and I'm not going to brush it off. But please don't give up. Not today. Will you tell me what's going on right now? If you need immediate support, please reach out to iCall: 9152987821 — they're kind and they listen. 💙`;
    } else if (lower.includes('thank') || lower.includes('helped')) {
      response = `You don't have to thank me — this is what I'm here for. How are you feeling now compared to when we started talking?`;
    } else if (lower.includes('better') || lower.includes('feel okay')) {
      response = `I'm so, so glad to hear that 😊 Hold onto that feeling. And remember — on the days it doesn't feel that way, come back here. You're not doing this alone anymore.`;
    } else {
      const pool = [
        `I'm right here. Keep going — I'm listening to every single word. 💙`,
        `What you just said matters. Don't minimize it. You're allowed to feel all of this.`,
        `Can I ask — is there anything specific I can do to support you right now?`,
        `You are so loved. I mean that. And you will get through this. 💜`,
        `Thank you for trusting me with this. How are you feeling right now, after saying all of that out loud?`,
        `One day at a time. Sometimes one hour at a time. And today — you talked. That's a win. A real one.`,
        `Is there anything you've been holding back from saying? You can say it here. No judgment, ever.`,
      ];
      response = pool[Math.floor(Math.random() * pool.length)];
    }
    if (userMessageCount === 8 && !newState.askedAboutTherapist) {
      response += ` Also — you deserve professional support too, not just peer support. Have you ever considered talking to a therapist?`;
      newState.askedAboutTherapist = true;
    }
  }
  return { response, newState };
}

// ─── Safety Notice ─────────────────────────────────────────────────────────────
function SafetyNotice({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      style={{
        margin: '0 20px 12px',
        borderRadius: 14,
        background: 'rgba(251,191,36,0.06)',
        border: '1px solid rgba(251,191,36,0.2)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 14px',
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#FCD34D' }}>
          Safety &amp; Privacy Notice
        </p>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(253,211,77,0.75)', lineHeight: 1.6 }}>
          Never share your phone number, address, or social media with matches.
          Your safety is our priority. If you feel unsafe,{' '}
          <Link to="/safety" style={{ fontWeight: 600, color: '#FCD34D', textDecoration: 'underline' }}>
            visit our Safety Center
          </Link>.
          This is a peer support space — not a substitute for professional care.
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss safety notice"
        style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(251,191,36,0.1)', border: 'none',
          color: '#FCD34D', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >✕</button>
    </motion.div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '4px 0 12px' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: '#fff', fontWeight: 800,
        boxShadow: '0 0 14px rgba(124,58,237,0.5)',
      }}>SG</div>
      <div style={{
        padding: '14px 18px', borderRadius: '4px 20px 20px 20px',
        background: '#1A1033',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 14 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%', background: '#A78BFA',
              animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Conversation Card ─────────────────────────────────────────────────────────
function ConvCard({ conv, isActive, onClick }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 14px', borderRadius: 16, cursor: 'pointer',
        background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
        border: isActive ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
        boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
        transition: 'all 0.2s ease',
        marginBottom: 4,
      }}
    >
      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: conv.grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: conv.initials.length > 2 ? 18 : 13,
          fontWeight: 800, color: '#fff',
          boxShadow: isActive ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
        }}>
          {conv.initials}
        </div>
        {conv.online && (
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #110C22',
            boxShadow: '0 0 6px rgba(16,185,129,0.7)',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#E2DEFF' : '#C4B5FD', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
            {conv.name}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(139,116,230,0.5)', flexShrink: 0 }}>
            {conv.time}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(139,116,230,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
            {conv.lastMsg}
          </span>
          {conv.unread > 0 && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#fff',
            }}>
              {conv.unread}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isBot, fmt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        display: 'flex',
        flexDirection: isBot ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        gap: 10,
        marginBottom: 20,
      }}
    >
      {/* Avatar */}
      {isBot && (
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#fff',
          boxShadow: '0 0 12px rgba(124,58,237,0.45)',
        }}>SG</div>
      )}

      <div style={{ maxWidth: '68%', minWidth: 0 }}>
        <div style={{
          padding: '13px 18px',
          borderRadius: isBot ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
          background: isBot
            ? '#1A1033'
            : 'linear-gradient(135deg,#7C3AED,#A855F7)',
          border: isBot ? '1px solid rgba(139,92,246,0.2)' : 'none',
          boxShadow: isBot
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(124,58,237,0.4)',
          color: '#E2DEFF',
          fontSize: 14, lineHeight: 1.65,
          fontFamily: 'Inter, sans-serif',
          wordBreak: 'break-word',
        }}>
          {msg.text}
        </div>
        <div style={{
          fontSize: 10, color: 'rgba(139,116,230,0.45)',
          marginTop: 5,
          textAlign: isBot ? 'left' : 'right',
          paddingLeft: isBot ? 4 : 0,
          paddingRight: isBot ? 0 : 4,
          display: 'flex', alignItems: 'center', gap: 4,
          justifyContent: isBot ? 'flex-start' : 'flex-end',
        }}>
          {fmt(msg.time)}
          {!isBot && <span style={{ color: '#A78BFA' }}>✓</span>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Date Separator ───────────────────────────────────────────────────────────
function DateSeparator({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      margin: '8px 0 20px',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.12)' }} />
      <span style={{
        fontSize: 11, fontWeight: 600, color: 'rgba(139,116,230,0.5)',
        background: '#0B0816', padding: '4px 14px', borderRadius: 20,
        border: '1px solid rgba(139,92,246,0.12)',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.12)' }} />
    </div>
  );
}

// ─── Suggestion Chips ─────────────────────────────────────────────────────────
const SUGGESTION_CHIPS = [
  { emoji: '🙂', label: 'Today felt difficult' },
  { emoji: '🌿', label: 'Help me relax' },
  { emoji: '💜', label: 'I need someone to listen' },
  { emoji: '🙏', label: 'Give me a small challenge' },
  { emoji: '✨', label: 'Inspire me' },
];

// ─── Daily Reflections ────────────────────────────────────────────────────────
const DAILY_REFLECTIONS = [
  { lines: ['Take a deep breath.', 'You are doing better', 'than you think.', 'Keep going.'] },
  { lines: ['You are enough,', 'exactly as you are.', 'Healing is not linear,', 'and every step matters.'] },
  { lines: ['Be gentle with yourself.', 'You are growing', 'even when it', "doesn't feel like it."] },
  { lines: ['You don\'t have to be', 'positive all the time.', 'All feelings', 'are valid here.'] },
  { lines: ['Healing takes courage.', 'We all have it,', 'even if we have', 'to dig a little.'] },
  { lines: ['You are braver', 'than you believe,', 'stronger than you seem,', 'and more loved than you know.'] },
  { lines: ['Every day is', 'a new beginning.', 'Take a breath,', 'and start again.'] },
];

// ─── Spotify Playlists ────────────────────────────────────────────────────────
const SPOTIFY_PLAYLISTS = [
  { title: 'Deep Focus', desc: 'Concentration & clarity', color: '#1DB954', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', gradient: 'linear-gradient(135deg,#064e3b,#065f46)' },
  { title: 'Calm & Relax', desc: 'Unwind your mind', color: '#60A5FA', url: 'https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY', gradient: 'linear-gradient(135deg,#0c4a6e,#1e3a5f)' },
  { title: 'Peaceful Sleep', desc: 'Drift into rest', color: '#A78BFA', url: 'https://open.spotify.com/playlist/37i9dQZF1DWStC7KB3JVCy', gradient: 'linear-gradient(135deg,#1e1b4b,#312e81)' },
  { title: 'Nature Healing', desc: 'Sounds of earth', color: '#34D399', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx', gradient: 'linear-gradient(135deg,#064e3b,#14532d)' },
];

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMatch, setActiveMatch] = useState(DEMO_MATCHES[0]);
  const [messages, setMessages] = useState([
    {
      id: 'seed', from: 'bot',
      text: `Hi ${user?.full_name?.split(' ')[0] || 'friend'} 💜\nI'm here for you.\nHow are you feeling today?`,
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [conversationState, setConversationState] = useState({
    101: { userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false },
  });
  const [safetyDismissed, setSafetyDismissed] = useState(false);
  const [mainTab, setMainTab] = useState('chat');
  const [showCrisisPopup, setShowCrisisPopup] = useState(false);
  const [filterTab, setFilterTab] = useState('All');

  const bottomRef = useRef(null);
  const chatLoggedRef = useRef(false);
  const inputRef = useRef(null);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Friend';
  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  const fmt = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const todayReflection = DAILY_REFLECTIONS[new Date().getDay()];

  const convCards = [
    {
      id: 'soul', name: 'Soul Guide', initials: 'SG',
      grad: 'linear-gradient(135deg,#7C3AED,#A855F7)',
      online: true, time: 'Just now',
      lastMsg: "Hi 💜 I'm here for you.",
      unread: 0,
    },
    {
      id: 'anxiety', name: 'Anxiety Support Circle', initials: '👥',
      grad: 'linear-gradient(135deg,#6D28D9,#4338CA)',
      online: false, time: '4:45 PM',
      lastMsg: 'Riya: Thank you everyone…',
      unread: 4,
    },
    {
      id: 'mindful', name: 'Mindfulness Group', initials: '🌿',
      grad: 'linear-gradient(135deg,#059669,#10B981)',
      online: false, time: 'Yesterday',
      lastMsg: 'Aman: Great session today 🙏',
      unread: 0,
    },
    {
      id: 'healing', name: 'Healing Circle', initials: '💗',
      grad: 'linear-gradient(135deg,#BE185D,#EC4899)',
      online: false, time: 'Yesterday',
      lastMsg: 'Neha: Sending love to all 💜',
      unread: 0,
    },
    {
      id: 'meera', name: 'Dr. Meera Sharma', initials: 'MS',
      grad: 'linear-gradient(135deg,#0891B2,#0E7490)',
      online: false, time: 'Saturday',
      lastMsg: 'See you tomorrow at 11 AM',
      unread: 0,
    },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (location.state?.tab) setMainTab(location.state.tab);
  }, [location.state]);

  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || typing) return;
    setInput('');
    if (detectCrisis(text)) setShowCrisisPopup(true);

    const msgId = Date.now();
    setMessages(prev => [...prev, { id: msgId, from: 'me', text, time: new Date() }]);

    const currentState = conversationState[activeMatch.id] || {
      userMessageCount: 0, mood: 'unknown', hasOpenedUp: false, askedAboutTherapist: false,
    };
    const { response, newState } = getBotResponse(text, activeMatch.primary_problem, currentState, activeMatch.name);
    setConversationState(prev => ({ ...prev, [activeMatch.id]: newState }));

    const delay = newState.hasOpenedUp ? 2000 + Math.random() * 1500 : 1200 + Math.random() * 1000;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { id: msgId + 1, from: 'bot', text: response, time: new Date() }]);
      if (!chatLoggedRef.current) {
        chatLoggedRef.current = true;
        journeyAPI.logActivity({ activity_type: 'chat_session', duration_minutes: 0, intensity: 5, notes: 'Auto-logged' }).catch(() => {});
      }
    }, delay);
  };

  const TABS = [
    { key: 'chat', label: '💬 Chat' },
    { key: 'calm', label: '🌿 Calm' },
    { key: 'activities', label: '🎯 Activities' },
  ];

  const FILTER_TABS = ['All', 'Unread', 'Groups', 'Professionals'];

  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%,80%,100% { transform: translateY(0); opacity:0.5; }
          40% { transform: translateY(-6px); opacity:1; }
        }
        @keyframes onlinePulse {
          0%,100% { box-shadow:0 0 0 0 rgba(16,185,129,0); }
          50% { box-shadow:0 0 0 4px rgba(16,185,129,0.25); }
        }
        .dc-input-bar:focus-within {
          border-color: rgba(139,92,246,0.5) !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important;
        }
        .dc-chip:hover {
          background: rgba(139,92,246,0.2) !important;
          border-color: rgba(139,92,246,0.45) !important;
          transform: translateY(-1px);
        }
        .dc-conv:hover { background: rgba(139,92,246,0.07) !important; }
        .dc-msg-area::-webkit-scrollbar { width: 3px; }
        .dc-msg-area::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 3px; }
        .dc-msg-area::-webkit-scrollbar-track { background: transparent; }
        .dc-sidebar-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 1100px) {
          .dc-right-panel { display: none !important; }
        }
        @media (max-width: 900px) {
          .dc-left-sidebar { display: none !important; }
        }
      `}</style>

      {showCrisisPopup && (
        <CrisisPopup
          onClose={() => setShowCrisisPopup(false)}
          onNavigate={(path) => { setShowCrisisPopup(false); navigate(path); }}
        />
      )}

      {/* ══ Root layout ══ */}
      <div style={{
        position: 'fixed', inset: 0,
        display: 'grid',
        gridTemplateColumns: '272px 1fr 300px',
        background: '#0B0816',
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}>

        {/* ══════════════════════════════════════════
            LEFT SIDEBAR
        ══════════════════════════════════════════ */}
        <aside className="dc-left-sidebar" style={{
          background: '#110C22',
          borderRight: '1px solid rgba(139,92,246,0.1)',
          display: 'flex', flexDirection: 'column',
          height: '100vh', overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '22px 18px 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, boxShadow: '0 0 14px rgba(124,58,237,0.5)',
              }}>🪷</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#E2DEFF', letterSpacing: '-0.02em' }}>SoulConnect</div>
                <div style={{ fontSize: 9, color: 'rgba(139,116,230,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  HEAL · CONNECT · GROW
                </div>
              </div>
            </div>

            {/* New Conversation */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ boxShadow: '0 6px 24px rgba(124,58,237,0.5)' }}
              onClick={() => { setMainTab('chat'); inputRef.current?.focus(); }}
              style={{
                width: '100%', padding: '11px 16px',
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                border: 'none', borderRadius: 14, color: '#fff',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                marginBottom: 14,
              }}
            >
              <Plus size={15} /> New Conversation
            </motion.button>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(139,92,246,0.12)',
              borderRadius: 12, padding: '9px 12px',
            }}>
              <Search size={13} color="rgba(139,116,230,0.5)" />
              <input
                placeholder="Search conversations..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontSize: 12, color: '#C4B5FD', fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{
            display: 'flex', gap: 4, padding: '0 14px 12px',
            flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {FILTER_TABS.map(f => (
              <button
                key={f}
                onClick={() => setFilterTab(f)}
                style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 20,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  background: filterTab === f ? 'rgba(139,92,246,0.2)' : 'transparent',
                  border: filterTab === f ? '1px solid rgba(139,92,246,0.4)' : '1px solid transparent',
                  color: filterTab === f ? '#C4B5FD' : 'rgba(139,116,230,0.5)',
                  transition: 'all 0.15s',
                }}
              >{f}</button>
            ))}
          </div>

          {/* CONVERSATIONS label */}
          <div style={{ padding: '0 18px 8px', flexShrink: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(139,116,230,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              CONVERSATIONS
            </span>
          </div>

          {/* Conversation list */}
          <div className="dc-sidebar-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
            {convCards.map(conv => (
              <ConvCard
                key={conv.id}
                conv={conv}
                isActive={conv.id === 'soul'}
                onClick={() => {}}
              />
            ))}
          </div>

          {/* Book Professional Support */}
          <div style={{ padding: '12px 14px 10px', flexShrink: 0 }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate('/professionals')}
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.15))',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 16, padding: '12px 14px',
                cursor: 'pointer', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>👨‍⚕️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E2DEFF' }}>Book Professional Support</div>
                <div style={{ fontSize: 10, color: 'rgba(196,181,253,0.6)' }}>Talk to a verified professional</div>
              </div>
              <ChevronRight size={14} color="rgba(139,116,230,0.6)" />
            </motion.div>

            {/* My Account */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 14,
              border: '1px solid rgba(139,92,246,0.1)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>
                {userInitials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E2DEFF' }}>My Account</div>
                <div
                  onClick={() => navigate('/profile')}
                  style={{ fontSize: 10, color: '#A78BFA', cursor: 'pointer' }}
                >View profile ›</div>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(139,116,230,0.4)', padding: 4,
                }}
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            MAIN CHAT AREA
        ══════════════════════════════════════════ */}
        <main style={{
          display: 'flex', flexDirection: 'column',
          background: '#0B0816', height: '100vh', overflow: 'hidden',
          borderRight: '1px solid rgba(139,92,246,0.08)',
        }}>
          {/* Header */}
          <div style={{
            padding: '0 24px',
            borderBottom: '1px solid rgba(139,92,246,0.1)',
            background: 'rgba(17,12,34,0.8)',
            backdropFilter: 'blur(20px)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 64,
            }}>
              {/* Left: avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7C3AED,#A855F7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#fff',
                    boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                  }}>SG</div>
                  <div style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 10, height: 10, borderRadius: '50%',
                    background: '#10B981', border: '2px solid #0B0816',
                    animation: 'onlinePulse 2s ease infinite',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#E2DEFF', letterSpacing: '-0.01em' }}>
                    Soul Guide 💜
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(139,116,230,0.6)' }}>
                    Your healing companion
                  </div>
                </div>
              </div>

              {/* Right: action icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[
                  { icon: Star, label: 'Favourite' },
                  { icon: Volume2, label: 'Sound' },
                  { icon: MoreHorizontal, label: 'More' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    title={label}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(139,92,246,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <Icon size={15} color="rgba(196,181,253,0.7)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 1 }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setMainTab(tab.key)}
                  style={{
                    padding: '10px 20px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    fontSize: 13, fontWeight: mainTab === tab.key ? 700 : 500,
                    color: mainTab === tab.key ? '#A78BFA' : 'rgba(139,116,230,0.5)',
                    borderBottom: mainTab === tab.key ? '2px solid #8B5CF6' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Chat tab ── */}
          {mainTab === 'chat' && (
            <>
              {/* Messages area */}
              <div
                className="dc-msg-area"
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '20px 24px 10px',
                  scrollbarWidth: 'thin',
                }}
              >
                {/* Safety Notice */}
                <AnimatePresence>
                  {!safetyDismissed && (
                    <SafetyNotice onDismiss={() => setSafetyDismissed(true)} />
                  )}
                </AnimatePresence>

                <DateSeparator label="Today" />

                {messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isBot={msg.from === 'bot'}
                    fmt={fmt}
                  />
                ))}

                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Suggestion chips */}
              <div style={{
                padding: '10px 24px 0',
                display: 'flex', gap: 7, flexWrap: 'wrap',
                flexShrink: 0,
              }}>
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    className="dc-chip"
                    onClick={() => sendMessage(`${chip.emoji} ${chip.label}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '7px 14px', borderRadius: 20,
                      background: 'rgba(139,92,246,0.08)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: '#C4B5FD', fontSize: 12, fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* Message input bar */}
              <div style={{ padding: '12px 20px 16px', flexShrink: 0 }}>
                <div
                  className="dc-input-bar"
                  style={{
                    background: '#1A1033',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: 20,
                    padding: '4px 6px 4px 16px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Tell me what's on your mind..."
                      style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: '#E2DEFF', fontSize: 14, fontFamily: 'Inter, sans-serif',
                        padding: '10px 0',
                      }}
                    />
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={sendMessage}
                      disabled={!input.trim() || typing}
                      style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        background: input.trim() && !typing
                          ? 'linear-gradient(135deg,#7C3AED,#A855F7)'
                          : 'rgba(139,92,246,0.15)',
                        border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: input.trim() && !typing ? '0 4px 14px rgba(124,58,237,0.45)' : 'none',
                      }}
                    >
                      <Send size={16} color={input.trim() && !typing ? '#fff' : 'rgba(139,116,230,0.4)'} />
                    </motion.button>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 4px 8px',
                  }}>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(139,116,230,0.5)', fontSize: 11,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <Mic size={12} /> Voice Reflection
                    </button>
                    <div style={{ fontSize: 10, color: 'rgba(139,116,230,0.35)' }}>
                      🔒 Anonymous · Encrypted · Private
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10, color: 'rgba(139,116,230,0.35)',
                    padding: '0 4px 6px', textAlign: 'center',
                  }}>
                    Everything shared here stays private and secure.
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Calm tab ── */}
          {mainTab === 'calm' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <GuidedHealing />
            </div>
          )}

          {/* ── Activities tab ── */}
          {mainTab === 'activities' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <ActivitySuggestions />
              <DailyChallenges />
            </div>
          )}
        </main>

        {/* ══════════════════════════════════════════
            RIGHT SIDEBAR
        ══════════════════════════════════════════ */}
        <aside className="dc-right-panel" style={{
          background: '#110C22',
          height: '100vh', overflowY: 'auto',
          padding: '20px 16px',
          borderLeft: '1px solid rgba(139,92,246,0.08)',
          scrollbarWidth: 'none',
        }}>

          {/* ── Card 1: Today's Reflection ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              background: 'linear-gradient(145deg, #1A1033, #200E45)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 22,
              padding: '20px',
              marginBottom: 14,
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg,#7C3AED,#A855F7,#F4C542,transparent)',
              borderRadius: '22px 22px 0 0',
            }} />

            {/* Decorative plant glow */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 100, height: 100,
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)',
              filter: 'blur(16px)', pointerEvents: 'none',
            }} />

            <div style={{ fontSize: 11, fontWeight: 700, color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              ✨ Today's Reflection
            </div>

            {/* Quote mark */}
            <div style={{ fontSize: 28, color: 'rgba(139,92,246,0.4)', lineHeight: 1, marginBottom: 8, fontFamily: 'Georgia, serif' }}>❝</div>

            {/* Reflection lines */}
            <div style={{ marginBottom: 18 }}>
              {todayReflection.lines.map((line, i) => (
                <p key={i} style={{
                  margin: '0 0 2px',
                  fontSize: i === 0 ? 17 : 15,
                  fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? '#E2DEFF' : 'rgba(196,181,253,0.75)',
                  lineHeight: 1.5,
                  fontStyle: i > 0 ? 'italic' : 'normal',
                }}>{line}</p>
              ))}
            </div>

            <div style={{ fontSize: 20 }}>💜</div>
          </motion.div>

          {/* ── Card 2: Calm Sounds on Spotify ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: '#1A1033',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 22,
              padding: '18px',
              marginBottom: 14,
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#1DB954',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>🎵</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E2DEFF' }}>Calm Sounds on Spotify</div>
                </div>
              </div>
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 10, color: '#1DB954', fontWeight: 600,
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
                }}
              >
                Open in Spotify <ExternalLink size={10} />
              </a>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(139,116,230,0.55)', margin: '0 0 12px' }}>
              Handpicked playlists to help you relax and breathe.
            </p>

            {/* Playlist grid 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SPOTIFY_PLAYLISTS.map(pl => (
                <a
                  key={pl.title}
                  href={pl.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: pl.gradient,
                      borderRadius: 14,
                      padding: '14px 12px',
                      position: 'relative', overflow: 'hidden',
                      cursor: 'pointer', minHeight: 72,
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Play button */}
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 26, height: 26, borderRadius: '50%',
                      background: '#1DB954',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10,
                    }}>▶</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                      {pl.title}
                    </div>
                  </motion.div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Card 3: Recommended Story ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{
              background: '#1A1033',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 22,
              padding: '18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E2DEFF' }}>Recommended Story</div>
              <button
                onClick={() => navigate('/stories')}
                style={{
                  background: 'none', border: 'none', color: '#A78BFA',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >View all</button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Story image */}
              <div style={{
                width: 72, height: 72, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg,#1A0A3E,#4C1D95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              }}>🌅</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Category badge */}
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#A78BFA', fontSize: 9, fontWeight: 700,
                  borderRadius: 20, padding: '2px 8px', marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>Healing</span>

                <div
                  onClick={() => navigate('/stories')}
                  style={{
                    fontSize: 13, fontWeight: 700, color: '#E2DEFF',
                    cursor: 'pointer', lineHeight: 1.35, marginBottom: 6,
                  }}
                >
                  Small Steps Matter
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'rgba(139,116,230,0.5)' }}>3 min read</span>
                  <button style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(139,116,230,0.5)', padding: 0,
                  }}>
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </aside>
      </div>
    </>
  );
}
