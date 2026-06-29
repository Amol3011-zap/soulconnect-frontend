import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useStoriesStore } from '../store/stories';
import { STORIES_DB } from '../data/storiesDB';
import { GradientAvatar } from './Stories';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
const BG       = '#080812';
const CARD     = 'rgba(34,18,73,0.72)';
const PURPLE   = '#8B5CF6';
const GOLD     = '#F4C542';
const TEXT_DIM = '#8A84B6';
const TEXT_MID = '#B8B4D8';

/* ─── Empty State ────────────────────────────────────────────────────────────── */
function EmptyState() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 380, margin: '0 auto' }}
    >
      {/* Illustration */}
      <div style={{ marginBottom: 24 }}>
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <defs>
            <radialGradient id="saveEmptyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#saveEmptyGlow)" />
          <rect x="30" y="22" width="60" height="76" rx="10" fill="rgba(34,18,73,0.9)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
          <rect x="38" y="34" width="44" height="5" rx="2.5" fill="rgba(139,92,246,0.35)" />
          <rect x="38" y="45" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="38" y="54" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="38" y="63" width="30" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          {/* Bookmark icon in the center bottom */}
          <path d="M52 78 L52 98 L60 93 L68 98 L68 78 Z" fill="rgba(139,92,246,0.5)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Stars */}
          <circle cx="22" cy="30" r="2" fill="#F4C542" opacity="0.7" />
          <circle cx="98" cy="45" r="1.5" fill="#A78BFA" opacity="0.6" />
          <circle cx="18" cy="78" r="1.5" fill="#F4C542" opacity="0.5" />
          <circle cx="102" cy="72" r="2" fill="#E9D5FF" opacity="0.5" />
        </svg>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
        No saved stories yet
      </h2>
      <p style={{ fontSize: 14, color: TEXT_DIM, margin: '0 0 28px', lineHeight: 1.65 }}>
        When you find stories that resonate with you, tap the bookmark icon to save them here for reading anytime.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => useNavigate()('/stories')}
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none', borderRadius: 16, color: '#fff', fontWeight: 700, fontSize: 15,
          padding: '14px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
        }}
      >
        <BookOpen size={16} /> Browse Stories
      </motion.button>
    </motion.div>
  );
}

function EmptyStateWithNav() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 380, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 24 }}>
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <defs>
            <radialGradient id="saveEmptyGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="url(#saveEmptyGlow2)" />
          <rect x="30" y="22" width="60" height="76" rx="10" fill="rgba(34,18,73,0.9)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" />
          <rect x="38" y="34" width="44" height="5" rx="2.5" fill="rgba(139,92,246,0.35)" />
          <rect x="38" y="45" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="38" y="54" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
          <rect x="38" y="63" width="30" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <path d="M52 78 L52 98 L60 93 L68 98 L68 78 Z" fill="rgba(139,92,246,0.5)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="22" cy="30" r="2" fill="#F4C542" opacity="0.7" />
          <circle cx="98" cy="45" r="1.5" fill="#A78BFA" opacity="0.6" />
          <circle cx="18" cy="78" r="1.5" fill="#F4C542" opacity="0.5" />
          <circle cx="102" cy="72" r="2" fill="#E9D5FF" opacity="0.5" />
        </svg>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
        No saved stories yet
      </h2>
      <p style={{ fontSize: 14, color: TEXT_DIM, margin: '0 0 28px', lineHeight: 1.65 }}>
        When you find stories that resonate with you, tap the bookmark icon to save them here for reading anytime.
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => navigate('/stories')}
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          border: 'none', borderRadius: 16, color: '#fff', fontWeight: 700, fontSize: 15,
          padding: '14px 28px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
        }}
      >
        <BookOpen size={16} /> Browse Stories →
      </motion.button>
    </motion.div>
  );
}

/* ─── Saved Story Card ───────────────────────────────────────────────────────── */
function SavedStoryCard({ story, index }) {
  const navigate = useNavigate();
  const { toggleSave } = useStoriesStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: CARD, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22,
        padding: '16px 16px 14px', marginBottom: 10,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.45)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }} />

      {/* Author + Unsave */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <GradientAvatar name={story.authorName} isAnon={story.isAnon} size={36} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{story.authorName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: TEXT_DIM }}>{story.time}</span>
              <span style={{ fontSize: 11, color: TEXT_DIM }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: TEXT_DIM }}>
                <Clock size={10} /> {story.readTime}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleSave(story.id)}
          title="Remove from saved"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
        >
          <Bookmark size={16} color={PURPLE} fill={PURPLE} />
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{
          background: `${story.categoryColor}1A`, border: `1px solid ${story.categoryColor}40`,
          color: story.categoryColor, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '2px 10px',
        }}>
          {story.category}
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: TEXT_MID, fontSize: 11, borderRadius: 20, padding: '2px 10px',
        }}>
          {story.moodEmoji} {story.mood}
        </span>
      </div>

      {/* Title + Preview */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 7px', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
        {story.title}
      </h3>
      <p style={{
        fontSize: 13, color: TEXT_MID, lineHeight: 1.65, margin: '0 0 14px',
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
      }}>
        {story.preview}
      </p>

      {/* Read button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/story/${story.id}`)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 12, padding: '8px 16px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#C4B5FD',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; }}
      >
        Read Full Story <ArrowRight size={14} />
      </motion.button>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function SavedStories() {
  const navigate = useNavigate();
  const { savedIds, userStories } = useStoriesStore();

  const savedStories = useMemo(() => {
    const all = [...userStories, ...STORIES_DB];
    return savedIds
      .map(id => all.find(s => s.id === id))
      .filter(Boolean);
  }, [savedIds, userStories]);

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px 32px', paddingBottom: 80,
    }}>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '30vh', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              }}>
                <Bookmark size={20} color="#fff" fill="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                  Saved Stories
                </h1>
                <p style={{ fontSize: 13, color: TEXT_DIM, margin: '2px 0 0' }}>
                  {savedStories.length > 0
                    ? `${savedStories.length} ${savedStories.length === 1 ? 'story' : 'stories'} saved`
                    : 'Your reading collection'}
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/stories')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '9px 16px',
                color: '#E2DEFF', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 600,
              }}
            >
              Browse Stories <ArrowRight size={14} />
            </motion.button>
          </div>

          {savedStories.length > 0 && (
            <div style={{
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 16, padding: '12px 16px', marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>💜</span>
              <p style={{ fontSize: 13, color: TEXT_MID, margin: 0, lineHeight: 1.5 }}>
                These are stories that moved you. Return to them whenever you need to feel less alone.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Story List ── */}
        <AnimatePresence mode="popLayout">
          {savedStories.length === 0 ? (
            <EmptyStateWithNav />
          ) : (
            savedStories.map((story, i) => (
              <SavedStoryCard key={story.id} story={story} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
