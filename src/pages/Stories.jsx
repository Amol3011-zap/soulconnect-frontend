import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  PenLine, Bookmark, Share2, MessageCircle, RefreshCw,
  ChevronRight, Clock, Users, ChevronDown, AlertTriangle,
  Tag, Smile, ArrowUpRight, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

/* ─── Design tokens ────────────────────────────────────────────────────────── */
const BG       = '#080812';
const CARD     = 'rgba(34,18,73,0.72)';
const BORDER   = 'rgba(255,255,255,0.08)';
const PURPLE   = '#8B5CF6';
const GOLD     = '#F4C542';
const TEXT_DIM = '#8A84B6';
const TEXT_MID = '#B8B4D8';
const GLASS_BTN = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, color: '#E2DEFF',
  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
};

/* ─── Static data ───────────────────────────────────────────────────────────── */
const PROMPTS = [
  'What do you wish someone understood about today?',
  "What's one small victory you're proud of?",
  'What helped you through a difficult moment?',
  'What are you feeling right now?',
  "What's something you wish you could say out loud?",
  'What would you tell your past self?',
];

const VISIBILITY_OPTIONS = ['Anonymous', 'Public', 'Community Only'];
const CATEGORIES = ['Growth', 'Anxiety', 'Grief', 'Burnout', 'Relationships', 'Gratitude', 'Motivation', 'Overthinking'];
const MOODS = ['Hopeful', 'Overwhelmed', 'Grateful', 'Sad', 'Peaceful', 'Confused', 'Proud'];
const TRIGGER_WARNINGS = ['None', 'Mental Health', 'Loss', 'Trauma', 'Relationship'];

const TRENDING = [
  { topic: 'Burnout',       count: '1.2K', emoji: '🔥', color: '#F97316' },
  { topic: 'Anxiety',       count: '2.8K', emoji: '😔', color: '#3B82F6' },
  { topic: 'Gratitude',     count: '923',  emoji: '🙏', color: '#F4C542' },
  { topic: 'Relationships', count: '1.5K', emoji: '💜', color: '#A855F7' },
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

const STORIES = [
  {
    id: 1, name: 'Anonymous Soul', isAnon: true,
    time: '2h ago', readTime: '2 min read',
    category: 'Anxiety', categoryColor: '#3B82F6',
    mood: 'Overwhelmed', moodEmoji: '😔',
    preview: "Today I finally said no without feeling guilty. For years I've been saying yes to everything and everyone, putting myself last. Today something shifted inside me and I realised my peace matters too.",
    understand: 128, support: 54, replies: 32, saved: false,
  },
  {
    id: 2, name: 'Riya M.', isAnon: false, avatarColors: ['#7C3AED', '#A855F7'],
    time: '5h ago', readTime: '3 min read',
    category: 'Overthinking', categoryColor: '#8B5CF6',
    mood: 'Hopeful', moodEmoji: '🌤',
    preview: "After weeks of overthinking, I chose to let it go. It wasn't easy — my mind kept pulling me back. But I realized that not every thought deserves my full attention or my energy.",
    understand: 96, support: 43, replies: 18, saved: true,
  },
  {
    id: 3, name: 'Arjun K.', isAnon: false, avatarColors: ['#D97706', '#F59E0B'],
    time: '9h ago', readTime: '2 min read',
    category: 'Motivation', categoryColor: '#F59E0B',
    mood: 'Proud', moodEmoji: '😊',
    preview: "Small steps every day really do change everything. Six months ago I couldn't get out of bed. Today I went for a walk and it felt like flying. Recovery is not linear but it is real.",
    understand: 112, support: 67, replies: 24, saved: false,
  },
  {
    id: 4, name: 'Priya S.', isAnon: false, avatarColors: ['#EC4899', '#F472B6'],
    time: '1d ago', readTime: '4 min read',
    category: 'Anxiety', categoryColor: '#3B82F6',
    mood: 'Peaceful', moodEmoji: '🌸',
    preview: "Therapy changed my relationship with fear. I used to run from every anxious thought. Now I sit with them and breathe through them. It doesn't make them disappear — it makes me stronger.",
    understand: 203, support: 88, replies: 41, saved: false,
  },
  {
    id: 5, name: 'Anonymous Soul', isAnon: true,
    time: '2d ago', readTime: '2 min read',
    category: 'Grief', categoryColor: '#6366F1',
    mood: 'Sad', moodEmoji: '🌧',
    preview: "Missing you gets easier, but it never fully goes away. That's okay. I've learned that grief is just love with nowhere to go. I'm letting it flow instead of blocking it.",
    understand: 341, support: 142, replies: 67, saved: true,
  },
  {
    id: 6, name: 'Mehul D.', isAnon: false, avatarColors: ['#2DD4BF', '#06B6D4'],
    time: '3d ago', readTime: '3 min read',
    category: 'Burnout', categoryColor: '#F97316',
    mood: 'Grateful', moodEmoji: '🙏',
    preview: "I quit a job that was killing me slowly. Best decision of my life. Rest is not laziness. Rest is resistance. If you're burnt out, please know — you deserve to pause.",
    understand: 178, support: 91, replies: 29, saved: false,
  },
];

/* ─── SVG Illustrations ─────────────────────────────────────────────────────── */
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
      {/* Glow */}
      <ellipse cx="55" cy="70" rx="50" ry="55" fill="url(#feathrGlow)" />
      {/* Feather shaft */}
      <path d="M55 15 Q48 65 42 118" stroke="url(#feathrGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Feather barbs left */}
      <path d="M54 20 Q38 30 30 42" stroke="#A78BFA" strokeWidth="1.2" fill="none" opacity="0.85" strokeLinecap="round" />
      <path d="M53 28 Q35 36 26 50" stroke="#A78BFA" strokeWidth="1.2" fill="none" opacity="0.8" strokeLinecap="round" />
      <path d="M52 37 Q32 43 24 58" stroke="#A78BFA" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round" />
      <path d="M51 46 Q32 51 24 66" stroke="#9D4EDD" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M50 55 Q33 59 26 73" stroke="#9D4EDD" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M49 64 Q34 67 28 80" stroke="#7C3AED" strokeWidth="0.9" fill="none" opacity="0.55" strokeLinecap="round" />
      {/* Feather barbs right */}
      <path d="M55 22 Q66 28 74 36" stroke="#C4B5FD" strokeWidth="1.2" fill="none" opacity="0.8" strokeLinecap="round" />
      <path d="M54 31 Q67 36 76 45" stroke="#C4B5FD" strokeWidth="1.1" fill="none" opacity="0.75" strokeLinecap="round" />
      <path d="M53 40 Q66 44 74 54" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M52 50 Q64 53 72 63" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.65" strokeLinecap="round" />
      <path d="M51 59 Q62 62 70 71" stroke="#9D4EDD" strokeWidth="0.9" fill="none" opacity="0.55" strokeLinecap="round" />
      {/* Ink pot */}
      <path d="M30 108 Q30 100 40 100 L64 100 Q74 100 74 108 L70 128 Q70 132 55 132 Q40 132 34 128 Z" fill="url(#inkGrad)" />
      <path d="M34 103 Q55 108 74 103" stroke="rgba(139,92,246,0.4)" strokeWidth="1" fill="none" />
      <ellipse cx="55" cy="100" rx="14" ry="4" fill="rgba(139,92,246,0.35)" />
      {/* Ink shimmer */}
      <ellipse cx="45" cy="118" rx="5" ry="3" fill="rgba(139,92,246,0.2)" transform="rotate(-10,45,118)" />
      {/* Sparkles */}
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
      <path d="M50 45 C50 38 40 32 34 38 C28 44 34 52 50 60 C66 52 72 44 66 38 C60 32 50 38 50 45Z"
        fill="rgba(255,255,255,0.92)" />
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
      {/* Clouds */}
      <ellipse cx="60" cy="50" rx="30" ry="10" fill="rgba(124,58,237,0.35)" />
      <ellipse cx="210" cy="40" rx="22" ry="8" fill="rgba(168,85,247,0.3)" />
      <ellipse cx="170" cy="60" rx="18" ry="7" fill="rgba(196,181,253,0.2)" />
      {/* Ground */}
      <path d="M0 130 Q140 115 280 130 L280 160 L0 160Z" fill="#0D0820" />
      {/* Person silhouette */}
      <circle cx="140" cy="108" r="7" fill="#0D0820" />
      <path d="M140 115 L140 138" stroke="#0D0820" strokeWidth="5" strokeLinecap="round" />
      <path d="M125 125 L140 120 L155 125" stroke="#0D0820" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M140 138 L130 152 M140 138 L150 152" stroke="#0D0820" strokeWidth="4" strokeLinecap="round" />
      {/* Stars */}
      <circle cx="30" cy="20" r="1.5" fill="#FDE68A" opacity="0.8" />
      <circle cx="80" cy="12" r="1" fill="#FDE68A" opacity="0.6" />
      <circle cx="200" cy="18" r="1.5" fill="#FDE68A" opacity="0.7" />
      <circle cx="250" cy="10" r="1" fill="#E9D5FF" opacity="0.6" />
    </svg>
  );
}

/* ─── Gradient Avatar ───────────────────────────────────────────────────────── */
const AVATAR_PALETTES = [
  ['#7C3AED', '#A855F7'], ['#D97706', '#F59E0B'], ['#EC4899', '#F472B6'],
  ['#2DD4BF', '#06B6D4'], ['#10B981', '#34D399'], ['#6366F1', '#818CF8'],
];

function GradientAvatar({ name, isAnon, size = 40 }) {
  if (isAnon) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #3B0764, #6D28D9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.42),
        boxShadow: '0 0 14px rgba(109,40,217,0.5)',
      }}>
        🪷
      </div>
    );
  }
  const pair = AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.38), fontWeight: 700, color: '#fff',
      boxShadow: `0 0 12px ${pair[0]}55`,
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

/* ─── Composer Card ─────────────────────────────────────────────────────────── */
function ComposerCard({ onShare }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [visibility, setVisibility] = useState('Anonymous');
  const [category, setCategory] = useState('Category');
  const [mood, setMood] = useState('Mood');
  const [trigger, setTrigger] = useState('Trigger Warning');
  const [openDrop, setOpenDrop] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setPromptIdx(i => (i + 1) % PROMPTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const Dropdown = ({ id, icon: Icon, value, options, onSelect }) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpenDrop(openDrop === id ? null : id)}
        style={{
          ...GLASS_BTN, display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', fontSize: 12, fontWeight: 500, borderRadius: 20,
          whiteSpace: 'nowrap',
        }}
      >
        {Icon && <Icon size={12} color={TEXT_DIM} />}
        <span style={{ color: TEXT_MID }}>{value}</span>
        <ChevronDown size={11} color={TEXT_DIM} />
      </button>
      <AnimatePresence>
        {openDrop === id && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0,
              background: 'rgba(20,10,50,0.98)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14,
              padding: '6px', zIndex: 100, minWidth: 160,
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            {options.map(o => (
              <button
                key={o}
                onClick={() => { onSelect(o); setOpenDrop(null); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', padding: '8px 12px',
                  fontSize: 13, color: value === o ? '#C4B5FD' : TEXT_MID,
                  fontWeight: value === o ? 600 : 400,
                  borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {o}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: 'linear-gradient(145deg, rgba(26,10,62,0.96), rgba(45,16,96,0.92))',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: 24, padding: '22px 22px 20px',
        marginBottom: 16, position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.1)',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start',
      }}
      onClick={() => setOpenDrop(null)}
    >
      {/* Inner highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />

      {/* Left: Text + controls */}
      <div>
        <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Share Your Story</div>
        <div style={{ fontSize: 13, color: TEXT_MID, marginBottom: 14 }}>Someone may need to hear what you've been through.</div>

        {/* Rotating prompt */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 16, padding: '12px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, cursor: 'text',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Sparkles size={14} color={PURPLE} style={{ flexShrink: 0, marginTop: 2 }} />
            <AnimatePresence mode="wait">
              <motion.span
                key={promptIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.55 }}
              >
                {PROMPTS[promptIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setPromptIdx(i => (i + 1) % PROMPTS.length); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}
          >
            <RefreshCw size={14} color={TEXT_DIM} />
          </button>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16, alignItems: 'center' }}
          onClick={e => e.stopPropagation()}>
          {/* Visibility */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenDrop(openDrop === 'vis' ? null : 'vis')}
              style={{
                ...GLASS_BTN, display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', fontSize: 12, borderRadius: 20,
              }}
            >
              <Users size={12} color={TEXT_DIM} />
              <span style={{ color: TEXT_MID }}>{visibility}</span>
              <ChevronDown size={11} color={TEXT_DIM} />
            </button>
            <AnimatePresence>
              {openDrop === 'vis' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
                    background: 'rgba(20,10,50,0.98)', backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14,
                    padding: '6px', minWidth: 150, boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {VISIBILITY_OPTIONS.map(o => (
                    <button key={o} onClick={() => { setVisibility(o); setOpenDrop(null); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 12px', fontSize: 13, color: visibility === o ? '#C4B5FD' : TEXT_MID, fontWeight: visibility === o ? 600 : 400, borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >{o}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Dropdown id="cat" icon={Tag} value={category} options={CATEGORIES} onSelect={setCategory} />
          <Dropdown id="mood" icon={Smile} value={mood} options={MOODS} onSelect={setMood} />
          <Dropdown id="trigger" icon={AlertTriangle} value={trigger} options={TRIGGER_WARNINGS} onSelect={setTrigger} />
        </div>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onShare}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            border: 'none', borderRadius: 14, color: '#fff',
            fontWeight: 700, fontSize: 14, padding: '11px 24px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          Share Story ✍️
        </motion.button>
      </div>

      {/* Right: Feather illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 4 }}>
        <FeatherIllustration />
      </div>
    </motion.div>
  );
}

/* ─── Featured Story Card ───────────────────────────────────────────────────── */
function FeaturedStoryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderRadius: 24, overflow: 'hidden',
        border: '1px solid rgba(139,92,246,0.2)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.1)',
        cursor: 'pointer', position: 'relative', marginBottom: 12,
      }}
    >
      {/* Hero image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <SunsetSilhouette />
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(244,197,66,0.15)', border: '1px solid rgba(244,197,66,0.4)',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, fontWeight: 700, color: GOLD, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          ⭐ Featured Story Today
        </div>
      </div>
      {/* Content */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(20,8,52,0.97), rgba(8,6,18,0.98))',
        padding: '20px 20px 18px', borderTop: '1px solid rgba(139,92,246,0.1)',
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          The day I finally asked for help
        </h2>
        <p style={{ fontSize: 13, color: TEXT_MID, margin: '0 0 14px', lineHeight: 1.6 }}>
          Sometimes the bravest thing you can do is admit you're not okay.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '3px 10px' }}>Anxiety</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT_DIM }}>
              <Clock size={11} /> 3 min read
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT_DIM }}>
              🤝 2.3K
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none',
              borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 13,
              padding: '9px 18px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
            }}
          >
            Read Story <ArrowUpRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Daily Prompt Card ─────────────────────────────────────────────────────── */
function DailyPromptCard({ onWrite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: CARD, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(139,92,246,0.18)', borderRadius: 24,
        padding: '20px 20px', marginBottom: 20, position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.2), transparent)' }} />

      <div>
        <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          ✨ Today's Prompt
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
          "What is one thing you forgive yourself for today?"
        </p>
        <p style={{ fontSize: 12, color: TEXT_DIM, margin: '0 0 14px' }}>
          2,438 people answered today
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onWrite}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none',
            borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 13,
            padding: '9px 18px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          }}
        >
          Write Response <ArrowUpRight size={14} />
        </motion.button>
      </div>

      <div style={{ flexShrink: 0 }}>
        <HeartChatIllustration />
      </div>
    </motion.div>
  );
}

/* ─── Trending Topics ───────────────────────────────────────────────────────── */
function TrendingTopics({ onSelect }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Trending Topics</span>
        <button style={{ background: 'none', border: 'none', fontSize: 13, color: '#A78BFA', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          View All
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
        {TRENDING.map((t, i) => (
          <motion.button
            key={t.topic}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 + i * 0.04, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(t.topic)}
            style={{
              flexShrink: 0, background: CARD, backdropFilter: 'blur(20px)',
              border: `1px solid ${t.color}25`,
              borderRadius: 18, padding: '12px 18px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              minWidth: 110, transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color + '55'; e.currentTarget.style.boxShadow = `0 6px 24px rgba(0,0,0,0.4), 0 0 16px ${t.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.color + '25'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'; }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{t.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{t.topic}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM }}>{t.count} Stories</div>
          </motion.button>
        ))}
        {/* Chevron hint */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', paddingRight: 4 }}>
          <ChevronRight size={18} color={TEXT_DIM} />
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Bar ────────────────────────────────────────────────────────────── */
function FilterBar({ active, setActive }) {
  return (
    <div style={{
      display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
      paddingBottom: 4, marginBottom: 16,
      position: 'sticky', top: 0, zIndex: 40,
      background: 'linear-gradient(180deg, rgba(8,8,18,0.95) 80%, transparent)',
      backdropFilter: 'blur(12px)', marginLeft: -32, marginRight: -32,
      padding: '10px 32px 10px',
    }}>
      {FILTER_TABS.map(tab => {
        const isActive = active === tab.label;
        return (
          <button
            key={tab.label}
            onClick={() => setActive(tab.label)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: isActive ? 700 : 500,
              background: isActive
                ? 'linear-gradient(135deg, #7C3AED, #A855F7)'
                : 'rgba(255,255,255,0.06)',
              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.09)',
              color: isActive ? '#fff' : TEXT_MID,
              boxShadow: isActive ? '0 4px 14px rgba(124,58,237,0.4)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Story Card ────────────────────────────────────────────────────────────── */
const SUPPORT_REACTIONS = [
  { key: 'understand', emoji: '🤝', label: 'I Understand', field: 'understand' },
  { key: 'support',    emoji: '💜', label: 'Sending Support', field: 'support' },
];

function StoryCard({ story, index, onSave, onReact }) {
  const [expanded, setExpanded] = useState(false);
  const [reacted, setReacted] = useState(null);

  const handleReact = (key) => {
    if (reacted === key) { setReacted(null); onReact(story.id, key, -1); }
    else {
      if (reacted) onReact(story.id, reacted, -1);
      setReacted(key);
      onReact(story.id, key, 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 + index * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: CARD, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22,
        padding: '16px 16px 14px', marginBottom: 10,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.45), 0 0 24px rgba(124,58,237,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)'; }}
    >
      {/* Inner top highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

      {/* Top row: avatar + meta + save */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GradientAvatar name={story.name} isAnon={story.isAnon} size={38} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{story.name}</span>
              {story.isAnon && (
                <span style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA', fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '1px 7px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => onSave(story.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Bookmark size={16} color={story.saved ? PURPLE : TEXT_DIM} fill={story.saved ? PURPLE : 'none'} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Share2 size={15} color={TEXT_DIM} />
          </button>
        </div>
      </div>

      {/* Category + Mood badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{
          background: `${story.categoryColor}1A`, border: `1px solid ${story.categoryColor}40`,
          color: story.categoryColor, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '2px 10px',
        }}>
          {story.category}
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: TEXT_MID, fontSize: 11, fontWeight: 500, borderRadius: 20, padding: '2px 10px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {story.moodEmoji} {story.mood}
        </span>
      </div>

      {/* Story preview */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <p style={{
          fontSize: 13, color: TEXT_MID, lineHeight: 1.65, margin: 0,
          overflow: expanded ? 'visible' : 'hidden',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'none' : 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {story.preview}
        </p>
        {!expanded && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 28,
            background: 'linear-gradient(transparent, rgba(34,18,73,0.9))',
            display: 'flex', alignItems: 'flex-end',
          }}>
            <button
              onClick={() => setExpanded(true)}
              style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'Inter, sans-serif' }}
            >
              Read More
            </button>
          </div>
        )}
      </div>

      {/* Reactions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {SUPPORT_REACTIONS.map(r => {
          const isReacted = reacted === r.key;
          return (
            <motion.button
              key={r.key}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleReact(r.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: isReacted ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: isReacted ? '1px solid rgba(139,92,246,0.45)' : '1px solid rgba(255,255,255,0.09)',
                borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 13 }}>{r.emoji}</span>
              <span style={{ fontSize: 11, color: isReacted ? '#C4B5FD' : TEXT_DIM, fontWeight: isReacted ? 600 : 400 }}>
                {story[r.field]}
              </span>
            </motion.button>
          );
        })}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          <MessageCircle size={12} color={TEXT_DIM} />
          <span style={{ fontSize: 11, color: TEXT_DIM }}>{story.replies} Support Replies</span>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── AI Insight Card ───────────────────────────────────────────────────────── */
function AIInsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.35 }}
      style={{
        background: 'linear-gradient(145deg, rgba(20,8,52,0.9), rgba(34,14,80,0.85))',
        border: '1px solid rgba(168,85,247,0.2)', borderRadius: 22,
        padding: '16px 18px', marginBottom: 10,
        boxShadow: '0 6px 24px rgba(0,0,0,0.35), 0 0 20px rgba(124,58,237,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          boxShadow: '0 0 12px rgba(124,58,237,0.5)',
        }}>🧠</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Insight</div>
          <div style={{ fontSize: 11, color: TEXT_DIM }}>Based on what you've been reading</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: TEXT_MID, margin: '0 0 12px', lineHeight: 1.6 }}>
        You've been reading about anxiety and burnout. A short breathing exercise might help right now.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Meditate', 'Tiny Win', 'Community'].map(action => (
          <button key={action} style={{
            ...GLASS_BTN, padding: '6px 13px', fontSize: 12, fontWeight: 500, borderRadius: 20,
          }}>
            {action}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Floating Action Button ────────────────────────────────────────────────── */
function FloatingShareButton({ onClick }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(124,58,237,0.6)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 200,
        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
        border: 'none', borderRadius: 20, color: '#fff',
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14,
        padding: '14px 22px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 32px rgba(124,58,237,0.55), 0 0 20px rgba(168,85,247,0.3)',
      }}
    >
      <PenLine size={16} />
      Share Story
    </motion.button>
  );
}

/* ─── Toast ─────────────────────────────────────────────────────────────────── */
function Toast({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          style={{
            position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(34,18,73,0.95)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(244,197,66,0.35)', borderRadius: 16,
            color: GOLD, padding: '12px 24px', fontSize: 14, fontWeight: 600,
            zIndex: 999, whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          🌱 Stories posting opens soon — stay tuned!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function Stories() {
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [stories, setStories] = useState(STORIES);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  }, []);

  const handleSave = useCallback((id) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, saved: !s.saved } : s));
  }, []);

  const handleReact = useCallback((id, key, delta) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, [key]: s[key] + delta } : s));
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px 32px', paddingBottom: 110,
      position: 'relative',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .stories-wrap { padding: 16px 16px 110px !important; }
        }
        .stories-wrap { padding: 24px 32px 110px; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <Toast visible={showToast} />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}
      >
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Soul Stories</h1>
          <p style={{ fontSize: 13, color: TEXT_DIM, margin: '4px 0 0' }}>Real stories. Real people. Real healing.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={triggerToast}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none',
            borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 14,
            padding: '10px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
            flexShrink: 0,
          }}
        >
          <PenLine size={15} />+ Share Story
        </motion.button>
      </motion.div>

      {/* ── Composer ── */}
      <ComposerCard onShare={triggerToast} />

      {/* ── Featured Story ── */}
      <FeaturedStoryCard />

      {/* ── Daily Prompt ── */}
      <DailyPromptCard onWrite={triggerToast} />

      {/* ── Trending Topics ── */}
      <TrendingTopics onSelect={setActiveFilter} />

      {/* ── Filter Bar ── */}
      <FilterBar active={activeFilter} setActive={setActiveFilter} />

      {/* ── Story Feed ── */}
      <div>
        {stories.map((story, i) => (
          <React.Fragment key={story.id}>
            <StoryCard
              story={story}
              index={i}
              onSave={handleSave}
              onReact={handleReact}
            />
            {/* AI insight card after 3rd story */}
            {i === 2 && <AIInsightCard />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Floating Button ── */}
      <FloatingShareButton onClick={triggerToast} />
    </div>
  );
}
