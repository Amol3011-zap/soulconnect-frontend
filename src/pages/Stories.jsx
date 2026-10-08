import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  PenLine, Bookmark, Share2, MessageCircle, RefreshCw,
  ChevronRight, Clock, ChevronDown, AlertTriangle,
  Tag, Smile, ArrowUpRight, Sparkles, Search, MoreHorizontal,
  Users, Send, X, Eye, EyeOff, Trash2, Flag, Star,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useStoriesStore } from '../store/stories';
import { STORIES_DB, REPLIES_DB } from '../data/storiesDB';
import ErrorToast from '../components/ErrorToast';
import { StoriesSkeleton } from '../components/Skeletons';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
const BG       = 'var(--sc-bg)';
const CARD     = 'var(--sc-card)';
const BORDER   = 'var(--sc-border)';
const PURPLE   = '#8066D5';
const GOLD     = 'var(--sc-gold-text)';
const TEXT_DIM = 'var(--sc-text-2)';
const TEXT_MID = 'var(--sc-text-3)';
const GLASS_BTN = {
  background: 'var(--sc-bg)',
  border: '1px solid var(--sc-border)',
  borderRadius: 12, color: 'var(--sc-text)',
  cursor: 'pointer', fontFamily: 'inherit',
};

/* ─── Static data ────────────────────────────────────────────────────────────── */
const PROMPTS = [
  'What do you wish someone understood about today?',
  "What's one small victory you're proud of?",
  'What helped you through a difficult moment?',
  'What are you feeling right now?',
  "What's something you wish you could say out loud?",
  'What would you tell your past self?',
  'What does healing look like for you today?',
  'When did you last feel truly at peace?',
  'What is one thing you forgive yourself for?',
  'What emotion have you been afraid to name?',
  'What support did you wish you had gotten earlier?',
  'What has your hardest chapter taught you?',
  'What would you say to someone going through what you survived?',
  'When did you last feel proud of yourself?',
  'What does a good day look like for you now?',
  'What boundary changed your life?',
  'What does rest mean to you?',
  'Which relationship has taught you the most?',
  'What do you know now that your younger self needed to hear?',
  'How has struggle made you more compassionate?',
  'What small act of kindness do you still remember?',
  'What do you wish mental health conversations talked about more?',
  'When did you first realise you were going to be okay?',
  'What gives you strength on the hardest days?',
  'What would your future self thank you for today?',
];

const VISIBILITY_OPTIONS = ['Anonymous', 'Public', 'Community Only'];
const CATEGORIES = ['Growth', 'Anxiety', 'Grief', 'Burnout', 'Relationships', 'Gratitude', 'Motivation', 'Overthinking', 'Depression', 'Meditation', 'Self Care'];
const MOODS = ['Hopeful', 'Overwhelmed', 'Grateful', 'Sad', 'Peaceful', 'Confused', 'Proud', 'Angry', 'Numb', 'Relieved'];
const TRIGGER_WARNINGS = ['None', 'Mental Health', 'Loss', 'Trauma', 'Relationship', 'Substance Use', 'Self-Harm'];

const TRENDING = [
  { topic: 'Burnout',       count: '1.2K', emoji: '🔥', color: '#F97316' },
  { topic: 'Anxiety',       count: '2.8K', emoji: '😔', color: '#3B82F6' },
  { topic: 'Gratitude',     count: '923',  emoji: '🙏', color: 'var(--sc-gold-text)' },
  { topic: 'Relationships', count: '1.5K', emoji: '💜', color: 'var(--sc-purple-text)' },
  { topic: 'Meditation',    count: '1.1K', emoji: '🧘', color: '#2DD4BF' },
  { topic: 'Growth',        count: '876',  emoji: '🌱', color: '#10B981' },
  { topic: 'Grief',         count: '634',  emoji: '🌧', color: '#6366F1' },
];

const FILTER_TABS = [
  { label: 'For You',       emoji: '✨' },
  { label: 'Growth',        emoji: '🌱' },
  { label: 'Anxiety',       emoji: '😔' },
  { label: 'Relationships', emoji: '💜' },
  { label: 'Burnout',       emoji: '🔥' },
  { label: 'Meditation',    emoji: '🧘' },
  { label: 'Gratitude',     emoji: '🙏' },
  { label: 'Latest',        emoji: '👀' },
];

const SUPPORT_REACTIONS = [
  { key: 'understand',      emoji: '🤝', label: 'I Understand' },
  { key: 'sendingSupport',  emoji: '💜', label: 'Sending Support' },
  { key: 'notAlone',        emoji: '🌱', label: "You're Not Alone" },
  { key: 'stayStrong',      emoji: '🙏', label: 'Stay Strong' },
];

const CATEGORY_COLORS = {
  'Anxiety': '#3B82F6',
  'Burnout': '#F97316',
  'Grief': '#6366F1',
  'Growth': '#10B981',
  'Relationships': '#A855F7',
  'Gratitude': '#F4C542',
  'Motivation': '#F59E0B',
  'Overthinking': '#8B5CF6',
  'Depression': '#6366F1',
  'Meditation': '#2DD4BF',
  'Self Care': '#EC4899',
};

/* ─── SVG Illustrations ──────────────────────────────────────────────────────── */
function FeatherIllustration() {
  return (
    <svg viewBox="0 0 110 140" width="110" height="140" aria-hidden="true">
      <defs>
        <radialGradient id="feathrGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="feathrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="inkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D1260" />
          <stop offset="100%" stopColor="#1A0A3E" />
        </linearGradient>
      </defs>
      <ellipse cx="55" cy="70" rx="50" ry="55" fill="url(#feathrGlow)" />
      <path d="M55 15 Q48 65 42 118" stroke="url(#feathrGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M54 20 Q38 30 30 42" stroke="#A78BFA" strokeWidth="1.2" fill="none" opacity="0.85" strokeLinecap="round" />
      <path d="M53 28 Q35 36 26 50" stroke="#A78BFA" strokeWidth="1.2" fill="none" opacity="0.8" strokeLinecap="round" />
      <path d="M52 37 Q32 43 24 58" stroke="#A78BFA" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round" />
      <path d="M51 46 Q32 51 24 66" stroke="#9D4EDD" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M50 55 Q33 59 26 73" stroke="#9D4EDD" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M49 64 Q34 67 28 80" stroke="#7C3AED" strokeWidth="0.9" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M55 22 Q66 28 74 36" stroke="#C4B5FD" strokeWidth="1.2" fill="none" opacity="0.8" strokeLinecap="round" />
      <path d="M54 31 Q67 36 76 45" stroke="#C4B5FD" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round" />
      <path d="M53 40 Q66 44 74 54" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M52 50 Q64 53 72 63" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M51 59 Q62 62 70 71" stroke="#9D4EDD" strokeWidth="0.9" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M30 108 Q30 100 40 100 L64 100 Q74 100 74 108 L70 128 Q70 132 55 132 Q40 132 34 128 Z" fill="url(#inkGrad)" />
      <path d="M34 103 Q55 108 74 103" stroke="rgba(139,92,246,0.4)" strokeWidth="1" fill="none" />
      <ellipse cx="55" cy="100" rx="14" ry="4" fill="rgba(139,92,246,0.35)" />
      <ellipse cx="45" cy="118" rx="5" ry="3" fill="rgba(139,92,246,0.2)" transform="rotate(-10,45,118)" />
      <circle cx="82" cy="28" r="2.5" fill="#F4C542" opacity="0.9" />
      <circle cx="18" cy="45" r="1.8" fill="#E9D5FF" opacity="0.7" />
      <circle cx="85" cy="70" r="1.5" fill="#A78BFA" opacity="0.6" />
      <circle cx="22" cy="88" r="1.2" fill="#F4C542" opacity="0.5" />
    </svg>
  );
}

function HeartChatIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" aria-hidden="true">
      <defs>
        <radialGradient id="chatBubbleGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.95" />
        </radialGradient>
        <filter id="chatGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="50" cy="85" rx="36" ry="8" fill="rgba(139,92,246,0.25)" />
      <rect x="12" y="15" width="76" height="58" rx="18" fill="url(#chatBubbleGrad)" filter="url(#chatGlow)" />
      <path d="M38 73 L50 82 L62 73" fill="url(#chatBubbleGrad)" />
      <path d="M50 45 C50 38 40 32 34 38 C28 44 34 52 50 60 C66 52 72 44 66 38 C60 32 50 38 50 45Z" fill="rgba(255,255,255,0.92)" />
      <rect x="12" y="15" width="76" height="58" rx="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </svg>
  );
}

function SunsetSilhouette() {
  return (
    <svg viewBox="0 0 280 160" width="100%" height="160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A0A3E" />
          <stop offset="40%" stopColor="#4C1D95" />
          <stop offset="70%" stopColor="#7C2D8F" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="70%" r="35%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="280" height="160" fill="url(#skyGrad)" />
      <ellipse cx="140" cy="135" rx="80" ry="40" fill="url(#sunGlow)" />
      <ellipse cx="60" cy="50" rx="30" ry="10" fill="rgba(124,58,237,0.35)" />
      <ellipse cx="210" cy="40" rx="22" ry="8" fill="rgba(168,85,247,0.3)" />
      <ellipse cx="170" cy="60" rx="18" ry="7" fill="rgba(196,181,253,0.2)" />
      <path d="M0 130 Q140 115 280 130 L280 160 L0 160Z" fill="#0D0820" />
      <circle cx="140" cy="108" r="7" fill="#0D0820" />
      <path d="M140 115 L140 138" stroke="#0D0820" strokeWidth="5" strokeLinecap="round" />
      <path d="M125 125 L140 120 L155 125" stroke="#0D0820" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M140 138 L130 152 M140 138 L150 152" stroke="#0D0820" strokeWidth="4" strokeLinecap="round" />
      <circle cx="30" cy="20" r="1.5" fill="#FDE68A" opacity="0.8" />
      <circle cx="80" cy="12" r="1" fill="#FDE68A" opacity="0.6" />
      <circle cx="200" cy="18" r="1.5" fill="#FDE68A" opacity="0.7" />
      <circle cx="250" cy="10" r="1" fill="#E9D5FF" opacity="0.6" />
    </svg>
  );
}

/* ─── Gradient Avatar ────────────────────────────────────────────────────────── */
const AVATAR_PALETTES = [
  ['#7C3AED', '#A855F7'], ['#D97706', '#F59E0B'], ['#EC4899', '#F472B6'],
  ['#2DD4BF', '#06B6D4'], ['#10B981', '#34D399'], ['#6366F1', '#818CF8'],
];

export function GradientAvatar({ name, isAnon, size = 40 }) {
  if (isAnon) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: 'var(--sc-purple-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.42),
      }}>
        🪷
      </div>
    );
  }
  const pair = AVATAR_PALETTES[(name || 'A').charCodeAt(0) % AVATAR_PALETTES.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.38), fontWeight: 700, color: '#FFFFFF',
    }}>
      {(name || 'A')[0].toUpperCase()}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--sc-card)', backdropFilter: 'none',
            border: '1px solid rgba(244,197,66,0.35)', borderRadius: 16,
            color: GOLD, padding: '12px 24px', fontSize: 14, fontWeight: 600,
            zIndex: 9999, whiteSpace: 'nowrap',
            boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Page styles (theme aware, mobile first) ───────────────────────────────── */
const STORIES_CSS = `
.st-root{--st-pad:32px;max-width:760px;margin:0 auto;padding:24px var(--st-pad) 120px;box-sizing:border-box}
.st-root ::-webkit-scrollbar{display:none}
.st-card{background:var(--sc-card);border:1px solid var(--sc-border);border-radius:20px;box-shadow:0 1px 2px rgba(23,22,66,.04),0 6px 20px rgba(23,22,66,.04)}
.st-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.st-head h1{font-size:26px;font-weight:800;color:var(--sc-text);margin:0;letter-spacing:-.02em;line-height:1.15}
.st-head p{font-size:13.5px;color:var(--sc-text-2);margin:4px 0 0}
.st-ghost{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 14px;border-radius:12px;border:1px solid var(--sc-border);background:var(--sc-card);color:var(--sc-text);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0}
.st-search{display:flex;align-items:center;gap:10px;height:46px;padding:0 14px;border-radius:14px;background:var(--sc-card);border:1px solid var(--sc-border);margin-bottom:16px}
.st-search:focus-within{border-color:var(--sc-purple);box-shadow:0 0 0 4px rgba(128,102,213,.12)}
.st-search input{flex:1;min-width:0;background:none;border:0;outline:none;font-family:inherit;font-size:14px;color:var(--sc-text)}
.st-section{display:flex;align-items:center;justify-content:space-between;margin:22px 0 10px}
.st-section h2{font-size:15px;font-weight:700;color:var(--sc-text);margin:0}
.st-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--sc-gold-text)}
.st-link{display:inline-flex;align-items:center;gap:4px;background:none;border:0;padding:0;font-family:inherit;font-size:13px;font-weight:700;color:var(--sc-purple-text);cursor:pointer}
.st-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 20px;border:0;border-radius:12px;background:var(--sc-purple-fill);color:#fff;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer}
.st-primary:disabled{opacity:.5;cursor:default}

/* Composer */
.st-composer{padding:14px;margin-bottom:12px}
.st-composer-row{display:flex;align-items:center;gap:12px;cursor:text}
.st-fake{flex:1;min-width:0;min-height:44px;display:flex;align-items:center;padding:10px 14px;border-radius:14px;background:var(--sc-bg);border:1px solid var(--sc-border);font-size:14px;line-height:1.4;color:var(--sc-text-2)}
.st-pen{width:44px;height:44px;border-radius:14px;border:0;background:var(--sc-purple-fill);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer}
.st-composer-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--sc-border);font-size:12px;color:var(--sc-text-2)}
.st-composer-foot span{display:inline-flex;align-items:center;gap:6px;min-width:0}
.st-composer-foot .st-link{font-size:12px;font-weight:600;flex-shrink:0}
.st-textarea{width:100%;box-sizing:border-box;min-height:130px;margin:10px 0 12px;padding:12px 14px;border-radius:14px;background:var(--sc-bg);border:1px solid var(--sc-line);resize:vertical;outline:none;font-family:inherit;font-size:15px;line-height:1.6;color:var(--sc-text)}
.st-textarea:focus{border-color:var(--sc-purple);box-shadow:0 0 0 4px rgba(128,102,213,.12)}
.st-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.st-chip{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;border:1px solid var(--sc-border);background:var(--sc-bg);font-family:inherit;font-size:12.5px;font-weight:500;color:var(--sc-text-3);cursor:pointer;white-space:nowrap}
.st-chip.is-set{background:var(--sc-tint);border-color:var(--sc-line);color:var(--sc-purple-text);font-weight:600}
.st-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:200;min-width:190px;max-height:280px;overflow-y:auto;padding:6px;border-radius:14px;background:var(--sc-card);border:1px solid var(--sc-line);box-shadow:0 10px 30px rgba(23,22,66,.14)}
.st-menu button{display:block;width:100%;text-align:left;padding:9px 12px;border:0;border-radius:10px;background:none;font-family:inherit;font-size:14px;color:var(--sc-text);cursor:pointer}
.st-menu button:hover,.st-menu button.is-on{background:var(--sc-tint)}
.st-menu button.is-on{color:var(--sc-purple-text);font-weight:600}
.st-actions{display:flex;align-items:center;justify-content:space-between;gap:10px}
.st-actions small{font-size:12px;color:var(--sc-text-2)}
.st-cancel{background:none;border:0;font-family:inherit;font-size:14px;font-weight:600;color:var(--sc-text-2);cursor:pointer;padding:0 6px}

/* Featured */
.st-featured{position:relative;overflow:hidden;padding:18px;cursor:pointer;background:linear-gradient(135deg,var(--sc-tint) 0%,var(--sc-card) 70%)}
.st-featured::after{content:'';position:absolute;right:-40px;top:-40px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(244,197,66,.22),transparent 70%);pointer-events:none}
.st-featured-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
.st-gold{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:999px;background:rgba(244,197,66,.16);border:1px solid rgba(201,150,40,.3);font-size:11.5px;font-weight:700;color:var(--sc-gold-text)}
.st-featured h3{font-size:19px;font-weight:800;line-height:1.3;letter-spacing:-.01em;color:var(--sc-text);margin:0 0 6px}
.st-featured p{font-size:13.5px;line-height:1.6;color:var(--sc-text-3);margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.st-meta{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--sc-text-2)}
.st-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.st-spacer{flex:1}
.st-pill{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;font-size:11.5px;font-weight:600}

/* Daily prompt */
.st-prompt{display:flex;align-items:center;gap:14px;padding:14px 16px;margin-top:12px}
.st-prompt-ic{width:44px;height:44px;border-radius:14px;background:var(--sc-tint);color:var(--sc-purple-text);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.st-prompt b{display:block;font-size:14.5px;line-height:1.4;color:var(--sc-text);margin:3px 0 2px}
.st-prompt small{font-size:12px;color:var(--sc-text-2)}
.st-prompt .st-ghost{height:36px;padding:0 12px}

/* Trending */
.st-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1 * var(--st-pad));padding:2px var(--st-pad) 4px}
.st-topic{flex-shrink:0;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:12px;border:1px solid var(--sc-border);background:var(--sc-card);font-family:inherit;cursor:pointer}
.st-topic b{font-size:13px;font-weight:600;color:var(--sc-text)}
.st-topic small{font-size:11.5px;color:var(--sc-text-2)}

/* Filter bar */
.st-filter{position:sticky;top:0;z-index:40;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:14px calc(-1 * var(--st-pad)) 12px;padding:10px var(--st-pad);background:var(--sc-bg)}
.st-tab{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--sc-border);background:var(--sc-card);font-family:inherit;font-size:13px;font-weight:500;color:var(--sc-text-3);cursor:pointer;transition:background .15s,color .15s}
.st-tab.is-on{background:var(--sc-purple-fill);border-color:transparent;color:#fff;font-weight:700}

/* Floating button: pill on desktop, round and above the bottom nav on phones */
.st-fab{position:fixed;right:28px;bottom:28px;z-index:200;display:flex;align-items:center;gap:8px;height:50px;padding:0 22px;border:0;border-radius:16px;background:var(--sc-purple-fill);color:#fff;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 10px 24px rgba(94,71,184,.28)}
@media(max-width:768px){
  .st-root{--st-pad:16px;padding:16px var(--st-pad) 140px}
  .st-head h1{font-size:24px}
  .st-fab{right:16px;bottom:calc(104px + env(safe-area-inset-bottom,0px));width:52px;height:52px;padding:0;border-radius:50%;justify-content:center}
  .st-fab span{display:none}
}
`;

/* ─── Composer Card ──────────────────────────────────────────────────────────── */
function ComposerCard({ onShare, triggerOpen, onTriggerConsumed }) {
  const { drafts, setDraft, clearDraft } = useStoriesStore();
  const { user } = useAuthStore();
  const [focused, setFocused] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const [openDrop, setOpenDrop] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setPromptIdx(i => (i + 1) % PROMPTS.length), 15000);
    return () => clearInterval(t);
  }, []);

  const open = () => {
    setFocused(true);
    setTimeout(() => textareaRef.current?.focus(), 60);
  };

  // Open composer when triggered externally (floating button, daily prompt)
  useEffect(() => {
    if (!triggerOpen) return;
    open();
    onTriggerConsumed?.();
  }, [triggerOpen]);

  const Dropdown = ({ id, icon: Icon, value, options, placeholder, onSelect }) => (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className={`st-chip${value ? ' is-set' : ''}`}
        onClick={(e) => { e.stopPropagation(); setOpenDrop(openDrop === id ? null : id); }}
      >
        {Icon && <Icon size={13} />}
        {value || placeholder}
        <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {openDrop === id && (
          <motion.div
            className="st-menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {options.map(o => (
              <button
                key={o}
                type="button"
                className={value === o ? 'is-on' : ''}
                onClick={(e) => { e.stopPropagation(); onSelect(o); setOpenDrop(null); }}
              >
                {o}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleShare = () => {
    if (!drafts.content.trim()) {
      textareaRef.current?.focus();
      return;
    }
    onShare({
      content: drafts.content,
      visibility: drafts.visibility,
      category: drafts.category,
      mood: drafts.mood,
      trigger: drafts.trigger,
    });
    clearDraft();
    setFocused(false);
  };

  return (
    <div className="st-card st-composer" onClick={() => setOpenDrop(null)}>
      {!focused ? (
        <>
          <div className="st-composer-row" onClick={open} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') open(); }} aria-label="Write your story">
            <GradientAvatar name={user?.name || 'You'} isAnon={false} size={40} />
            <div className="st-fake">
              <AnimatePresence mode="wait">
                <motion.span
                  key={promptIdx}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                >
                  {PROMPTS[promptIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="st-pen" aria-hidden="true"><PenLine size={18} /></span>
          </div>
          <div className="st-composer-foot">
            <span><Sparkles size={13} color={PURPLE} /> Someone may need to hear your story.</span>
            <button type="button" className="st-link"
              onClick={e => { e.stopPropagation(); setPromptIdx(i => (i + 1) % PROMPTS.length); }}>
              <RefreshCw size={12} /> New prompt
            </button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <span className="st-eyebrow">Share your story</span>
          <textarea
            ref={textareaRef}
            className="st-textarea"
            value={drafts.content}
            onChange={e => setDraft({ content: e.target.value })}
            placeholder={PROMPTS[promptIdx]}
            rows={5}
          />
          <div className="st-chips" onClick={e => e.stopPropagation()}>
            <Dropdown id="vis"     icon={Users}         value={drafts.visibility} options={VISIBILITY_OPTIONS} placeholder="Visibility"      onSelect={v => setDraft({ visibility: v })} />
            <Dropdown id="cat"     icon={Tag}           value={drafts.category}   options={CATEGORIES}         placeholder="Category"        onSelect={v => setDraft({ category: v })} />
            <Dropdown id="mood"    icon={Smile}         value={drafts.mood}       options={MOODS}              placeholder="Mood"            onSelect={v => setDraft({ mood: v })} />
            <Dropdown id="trigger" icon={AlertTriangle} value={drafts.trigger}    options={TRIGGER_WARNINGS}   placeholder="Trigger warning" onSelect={v => setDraft({ trigger: v })} />
          </div>
          <div className="st-actions">
            <small>{drafts.content.trim() ? `${drafts.content.trim().split(/\s+/).length} words` : 'Take your time'}</small>
            <div className="st-row">
              <button type="button" className="st-cancel" onClick={() => { setFocused(false); clearDraft(); }}>Cancel</button>
              <motion.button whileTap={{ scale: 0.97 }} type="button" className="st-primary"
                onClick={handleShare} disabled={!drafts.content.trim()}>
                <Send size={15} /> Share
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Featured Story Card ────────────────────────────────────────────────────── */
function FeaturedStoryCard({ story, onNavigate }) {
  if (!story) return null;
  return (
    <div className="st-card st-featured" onClick={() => onNavigate(story.id)} role="link" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onNavigate(story.id); }}>
      <div className="st-featured-top">
        <span className="st-gold"><Star size={12} fill="currentColor" /> Featured today</span>
        <span className="st-meta"><Clock size={12} /> {story.readTime}</span>
      </div>
      <h3>{story.title}</h3>
      <p>{story.preview}</p>
      <div className="st-row">
        <span className="st-pill" style={{ background: `${story.categoryColor}1A`, color: story.categoryColor }}>{story.category}</span>
        <span className="st-meta">🤝 {story.understand}</span>
        <span className="st-spacer" />
        <span className="st-link">Read story <ArrowUpRight size={14} /></span>
      </div>
    </div>
  );
}

/* ─── Daily Prompt Card ──────────────────────────────────────────────────────── */
function DailyPromptCard({ onWrite }) {
  return (
    <div className="st-card st-prompt">
      <span className="st-prompt-ic"><Sparkles size={20} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="st-eyebrow">Today's prompt</span>
        <b>What is one thing you forgive yourself for today?</b>
        <small>2,438 people answered today</small>
      </div>
      <button type="button" className="st-ghost" onClick={onWrite}>Answer</button>
    </div>
  );
}

/* ─── Trending Topics ────────────────────────────────────────────────────────── */
function TrendingTopics({ onSelect }) {
  return (
    <>
      <div className="st-section"><h2>Trending topics</h2></div>
      <div className="st-scroll">
        {TRENDING.map(t => (
          <button key={t.topic} type="button" className="st-topic" onClick={() => onSelect(t.topic)}>
            <span style={{ fontSize: 16 }}>{t.emoji}</span>
            <b>{t.topic}</b>
            <small>{t.count}</small>
          </button>
        ))}
      </div>
    </>
  );
}

/* ─── Filter Bar ─────────────────────────────────────────────────────────────── */
function FilterBar({ active, setActive }) {
  return (
    <div className="st-filter" role="tablist">
      {FILTER_TABS.map(tab => (
        <button
          key={tab.label}
          type="button"
          role="tab"
          aria-selected={active === tab.label}
          className={`st-tab${active === tab.label ? ' is-on' : ''}`}
          onClick={() => setActive(tab.label)}
        >
          <span>{tab.emoji}</span>{tab.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Replies Panel ──────────────────────────────────────────────────────────── */
function RepliesPanel({ storyId, onClose }) {
  const { replies: storeReplies, addReply } = useStoriesStore();
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);

  const dbReplies = useMemo(() => REPLIES_DB.filter(r => r.storyId === storyId), [storyId]);
  const userReplies = storeReplies[storyId] || [];
  const allReplies = [...userReplies, ...dbReplies];

  const handleSubmit = () => {
    if (!text.trim()) return;
    addReply(storyId, {
      id: `ur-${Date.now()}`,
      storyId,
      authorId: null,
      authorName: isAnon ? 'Anonymous Soul' : 'You',
      isAnon,
      content: text.trim(),
      createdAt: new Date().toISOString(),
    });
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div style={{
        background: 'var(--sc-bg)', backdropFilter: 'none',
        border: '1px solid var(--sc-line)', borderRadius: 16,
        padding: '16px', marginTop: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sc-text)' }}>Support Replies ({allReplies.length})</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM }}>
            <X size={16} />
          </button>
        </div>

        {/* Reply list */}
        <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 12 }}>
          {allReplies.length === 0 ? (
            <p style={{ fontSize: 13, color: TEXT_DIM, textAlign: 'center', padding: '16px 0' }}>
              Be the first to offer support 💜
            </p>
          ) : (
            allReplies.map((reply) => (
              <div key={reply.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <GradientAvatar name={reply.authorName} isAnon={reply.isAnon} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sc-text)' }}>{reply.authorName}</span>
                    {reply.isAnon && (
                      <span style={{ background: 'var(--sc-tint)', border: '1px solid var(--sc-line)', color: 'var(--sc-purple-text)', fontSize: 9, fontWeight: 600, borderRadius: 20, padding: '1px 6px' }}>Anon</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: TEXT_MID, margin: 0, lineHeight: 1.55 }}>{reply.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply input */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a supportive reply..."
              rows={2}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--sc-bg)', border: '1px solid var(--sc-border)',
                borderRadius: 12, padding: '10px 12px', resize: 'none',
                fontFamily: 'inherit', fontSize: 13, color: 'var(--sc-text)',
                outline: 'none',
              }}
            />
            <button
              onClick={() => setIsAnon(a => !a)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM, fontSize: 11, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}
            >
              {isAnon ? <EyeOff size={11} /> : <Eye size={11} />}
              {isAnon ? 'Posting anonymously' : 'Posting as You'}
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? 'var(--sc-purple-fill)' : 'var(--sc-border)',
              border: 'none', borderRadius: 12, padding: '10px 14px', cursor: text.trim() ? 'pointer' : 'default',
              color: text.trim() ? '#fff' : 'var(--sc-text-2)', flexShrink: 0,
            }}
          >
            <Send size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Story Card ─────────────────────────────────────────────────────────────── */
function StoryCard({ story, index, userStoryIds, toast }) {
  const navigate = useNavigate();
  const { reactions, savedIds, toggleSave, setReaction, hideStory, deleteStory } = useStoriesStore();
  const [expanded, setExpanded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isOwnStory = userStoryIds.includes(story.id);
  const currentReaction = reactions[story.id];
  const isSaved = savedIds.includes(story.id);

  const getReactionCount = (key) => {
    const base = story[key] || 0;
    if (currentReaction === key) return base + 1;
    return base;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/story/${story.id}`);
      toast('Link copied! 🔗');
    } catch {
      toast('Link copied! 🔗');
    }
  };

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: CARD, backdropFilter: 'none', WebkitBackdropFilter: 'none',
        border: '1px solid var(--sc-border)', borderRadius: 22,
        padding: 16, marginBottom: 12,
        position: 'relative', overflow: 'visible',
        boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(23,22,66,0.05), 0 10px 28px rgba(23,22,66,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'transparent', borderRadius: '22px 22px 0 0' }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GradientAvatar name={story.authorName} isAnon={story.isAnon} size={38} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--sc-text)' }}>{story.authorName}</span>
              {story.isAnon && (
                <span style={{ background: 'var(--sc-tint)', border: '1px solid var(--sc-line)', color: 'var(--sc-purple-text)', fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '1px 7px' }}>
                  Anonymous
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: TEXT_DIM }}>{story.time}</span>
              <span style={{ fontSize: 11, color: TEXT_DIM }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: TEXT_DIM }}>
                <Clock size={10} /> {story.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => toggleSave(story.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Bookmark size={16} color={isSaved ? PURPLE : TEXT_DIM} fill={isSaved ? PURPLE : 'none'} />
          </button>
          <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Share2 size={15} color={TEXT_DIM} />
          </button>
          {/* Three-dot menu */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setShowMenu(m => !m)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <MoreHorizontal size={16} color={TEXT_DIM} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                    background: 'var(--sc-card)', backdropFilter: 'none',
                    border: '1px solid var(--sc-line)', borderRadius: 14,
                    padding: '6px', zIndex: 300, minWidth: 160,
                    boxShadow: '0 8px 28px rgba(23,22,66,0.12)',
                  }}
                >
                  {[
                    { icon: Bookmark, label: isSaved ? 'Unsave' : 'Save', action: () => { toggleSave(story.id); setShowMenu(false); } },
                    { icon: EyeOff, label: 'Hide Story', action: () => { hideStory(story.id); setShowMenu(false); } },
                    { icon: Flag, label: 'Report', action: () => { toast('Story reported'); setShowMenu(false); } },
                    ...(isOwnStory ? [{ icon: Trash2, label: 'Delete', action: () => { deleteStory(story.id); setShowMenu(false); }, danger: true }] : []),
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', textAlign: 'left',
                        background: 'none', border: 'none', padding: '9px 12px',
                        fontSize: 13, color: item.danger ? '#DC2626' : 'var(--sc-text)',
                        borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(248,113,113,0.1)' : 'var(--sc-tint)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <item.icon size={13} />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Category + Mood */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{
          background: `${story.categoryColor}1A`, border: `1px solid ${story.categoryColor}40`,
          color: story.categoryColor, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '2px 10px',
        }}>
          {story.category}
        </span>
        <span style={{
          background: 'var(--sc-bg)', border: '1px solid var(--sc-border)',
          color: TEXT_MID, fontSize: 11, fontWeight: 500, borderRadius: 20, padding: '2px 10px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {story.moodEmoji} {story.mood}
        </span>
      </div>

      {/* Title */}
      <h3
        onClick={() => navigate(`/story/${story.id}`)}
        style={{ fontSize: 15, fontWeight: 700, color: 'var(--sc-text)', margin: '0 0 8px', lineHeight: 1.35, cursor: 'pointer', letterSpacing: '-0.01em' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--sc-purple-text)'}
        onMouseLeave={e => e.currentTarget.style.color = ''}
      >
        {story.title}
      </h3>

      {/* Content preview */}
      <div style={{ marginBottom: 12 }}>
        <p
          style={{
            fontSize: 13, color: TEXT_MID, lineHeight: 1.65, margin: 0,
            overflow: expanded ? 'visible' : 'hidden',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? 'none' : 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {expanded ? story.content : story.preview}
        </p>

        {!expanded && (
          <button
            onClick={() => navigate(`/story/${story.id}`)}
            style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 0 0', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            Read More <ChevronRight size={13} />
          </button>
        )}
      </div>

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '0 0 10px', fontFamily: 'inherit' }}
        >
          Show Less ↑
        </button>
      )}

      {/* Reactions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {SUPPORT_REACTIONS.map(r => {
          const isActive = currentReaction === r.key;
          return (
            <motion.button
              key={r.key}
              whileTap={{ scale: 0.93 }}
              onClick={() => setReaction(story.id, r.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: isActive ? 'var(--sc-tint)' : 'var(--sc-bg)',
                border: isActive ? '1px solid var(--sc-line)' : '1px solid var(--sc-border)',
                borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 13 }}>{r.emoji}</span>
              <span style={{ fontSize: 11, color: isActive ? 'var(--sc-purple-text)' : TEXT_DIM, fontWeight: isActive ? 700 : 500 }}>
                {getReactionCount(r.key)}
              </span>
            </motion.button>
          );
        })}
        <button
          onClick={() => setShowReplies(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: showReplies ? 'var(--sc-tint)' : 'var(--sc-bg)',
            border: showReplies ? '1px solid var(--sc-line)' : '1px solid var(--sc-border)',
            borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <MessageCircle size={12} color={showReplies ? 'var(--sc-purple-text)' : TEXT_DIM} />
          <span style={{ fontSize: 11, color: showReplies ? 'var(--sc-purple-text)' : TEXT_DIM }}>
            {story.replyCount || 0} Support Replies
          </span>
        </button>
      </div>

      {/* Replies Panel */}
      <AnimatePresence>
        {showReplies && (
          <RepliesPanel storyId={story.id} onClose={() => setShowReplies(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── AI Insight Card ────────────────────────────────────────────────────────── */
function AIInsightCard() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.35 }}
      style={{
        background: 'var(--sc-card)',
        border: '1px solid var(--sc-border)', borderRadius: 20,
        padding: '16px 18px', marginBottom: 10,
        boxShadow: '0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'var(--sc-purple-fill)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          boxShadow: 'none',
        }}>🧠</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sc-text)' }}>AI Insight</div>
          <div style={{ fontSize: 11, color: TEXT_DIM }}>Based on what you've been reading</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: TEXT_MID, margin: '0 0 12px', lineHeight: 1.6 }}>
        You've been reading about anxiety and burnout. A short breathing exercise might help right now.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: 'Meditate', path: '/meditate' },
          { label: 'Tiny Win', path: '/tiny-wins' },
          { label: 'Community', path: '/community' },
        ].map(({ label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{ ...GLASS_BTN, padding: '6px 13px', fontSize: 12, fontWeight: 500, borderRadius: 20 }}>
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────────── */
function EmptyState({ filter, search }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '60px 20px' }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sc-text)', margin: '0 0 8px' }}>
        {search ? 'No stories found' : `No ${filter} stories yet`}
      </h3>
      <p style={{ fontSize: 14, color: TEXT_DIM, margin: '0 0 20px', lineHeight: 1.6 }}>
        {search
          ? `Nothing matched "${search}". Try a different search.`
          : 'Be the first to share your story in this category.'}
      </p>
    </motion.div>
  );
}

/* ─── Floating Action Button ─────────────────────────────────────────────────── */
function FloatingShareButton({ onClick }) {
  return (
    <motion.button
      type="button"
      className="st-fab"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 320, damping: 22 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label="Share your story"
    >
      <PenLine size={18} />
      <span>Share Story</span>
    </motion.button>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function Stories() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userStories, hiddenIds, addStory } = useStoriesStore();

  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [visibleCount, setVisibleCount] = useState(10);
  const [composerOpen, setComposerOpen] = useState(false);
  const sentinelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3200);
  }, []);


  // Merge feed
  const allStories = useMemo(() => {
    return [...userStories, ...STORIES_DB].filter(s => !hiddenIds.includes(s.id));
  }, [userStories, hiddenIds]);

  // Filter + search
  const filteredStories = useMemo(() => {
    let list = allStories;

    if (activeFilter === 'Latest') {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeFilter !== 'For You') {
      list = list.filter(s => s.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q) ||
        s.authorName?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allStories, activeFilter, searchQuery]);

  const visibleStories = filteredStories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStories.length;
  const userStoryIds = useMemo(() => userStories.map(s => s.id), [userStories]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore) setVisibleCount(c => c + 10); },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const handleComposerShare = ({ content, visibility, category, mood, trigger }) => {
    const cat = category || 'Growth';
    const newStory = {
      id: `us-${Date.now()}`,
      title: content.split('\n')[0].slice(0, 80) || 'My Story',
      category: cat,
      categoryColor: CATEGORY_COLORS[cat] || PURPLE,
      mood: mood || 'Hopeful',
      moodEmoji: '✨',
      tags: [cat.toLowerCase()],
      content,
      preview: content.slice(0, 220).trim() + (content.length > 220 ? '…' : ''),
      authorId: user?.id || 'me',
      authorName: visibility === 'Anonymous' ? 'Anonymous Soul' : (user?.name || 'You'),
      isAnon: visibility === 'Anonymous',
      createdAt: new Date().toISOString(),
      time: 'just now',
      readTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
      understand: 0, sendingSupport: 0, notAlone: 0, stayStrong: 0,
      replyCount: 0,
    };
    addStory(newStory);
    showToast('🌱 Your story has been shared!');
  };

  const openComposer = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.dash-content-wrapper')?.scrollTo?.({ top: 0, behavior: 'smooth' });
    setTimeout(() => setComposerOpen(true), 350);
  };

  const handleTrendingSelect = (topic) => {
    setActiveFilter(topic);
    setSearchQuery('');
  };

  const featuredStory = STORIES_DB[0];

  if (error) {
    return (
      <>
        <ErrorToast
          message={error}
          onRetry={() => window.location.reload()}
          onDismiss={() => setError('')}
        />
        <div className="stories-root" style={{
          minHeight: '100vh', background: BG,
          fontFamily: 'inherit',
          padding: '24px 32px', paddingBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ color: TEXT_DIM, textAlign: 'center', fontSize: 16 }}>
            Unable to load stories. Please try again.
          </p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="stories-root st-root" style={{ minHeight: '100vh', background: BG, position: 'relative' }}>
        <style>{STORIES_CSS}</style>
        <StoriesSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="stories-root st-root" style={{ minHeight: '100vh', background: BG, position: 'relative' }}>
      <style>{STORIES_CSS}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Header ── */}
      <div className="st-head">
        <div>
          <h1>Soul Stories</h1>
          <p>Real stories. Real people. Real healing.</p>
        </div>
        <button type="button" className="st-ghost" onClick={() => navigate('/saved')}>
          <Bookmark size={15} /> Saved
        </button>
      </div>

      <div className="st-search">
        <Search size={16} color={TEXT_DIM} />
        <input
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setVisibleCount(10); }}
          placeholder="Search stories, authors, categories"
          aria-label="Search stories"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM, display: 'flex' }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Composer ── */}
      <ComposerCard
        onShare={handleComposerShare}
        triggerOpen={composerOpen}
        onTriggerConsumed={() => setComposerOpen(false)}
      />

      {/* ── Featured Story ── */}
      <FeaturedStoryCard story={featuredStory} onNavigate={(id) => navigate(`/story/${id}`)} />

      {/* ── Daily Prompt ── */}
      <DailyPromptCard onWrite={openComposer} />

      {/* ── Trending Topics ── */}
      <TrendingTopics onSelect={handleTrendingSelect} />

      {/* ── Filter Bar ── */}
      <FilterBar active={activeFilter} setActive={(f) => { setActiveFilter(f); setVisibleCount(10); }} />

      {/* ── Story Feed ── */}
      <AnimatePresence mode="popLayout">
        {visibleStories.length === 0 ? (
          <EmptyState filter={activeFilter} search={searchQuery} />
        ) : (
          visibleStories.map((story, i) => (
            <React.Fragment key={story.id}>
              <StoryCard
                story={story}
                index={i}
                userStoryIds={userStoryIds}
                toast={showToast}
              />
              {i === 2 && <AIInsightCard />}
            </React.Fragment>
          ))
        )}
      </AnimatePresence>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--sc-line)', borderTopColor: PURPLE, animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Floating Button ── */}
      <FloatingShareButton onClick={openComposer} />
    </div>
  );
}
