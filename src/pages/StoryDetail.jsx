import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Bookmark, Share2, Clock, MessageCircle,
  ChevronRight, Send, Eye, EyeOff, Tag,
} from 'lucide-react';
import { useStoriesStore } from '../store/stories';
import { STORIES_DB, REPLIES_DB } from '../data/storiesDB';
import { GradientAvatar } from './Stories';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
const BG       = '#080812';
const CARD     = 'rgba(34,18,73,0.72)';
const PURPLE   = '#8B5CF6';
const GOLD     = '#F4C542';
const TEXT_DIM = '#8A84B6';
const TEXT_MID = '#B8B4D8';

const SUPPORT_REACTIONS = [
  { key: 'understand',     emoji: '🤝', label: 'I Understand' },
  { key: 'sendingSupport', emoji: '💜', label: 'Sending Support' },
  { key: 'notAlone',       emoji: '🌱', label: "You're Not Alone" },
  { key: 'stayStrong',     emoji: '🙏', label: 'Stay Strong' },
];

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
function Toast({ message, visible }) {
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
            zIndex: 9999, whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Related Story Card ─────────────────────────────────────────────────────── */
function RelatedCard({ story }) {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/story/${story.id}`)}
      style={{
        background: CARD, backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18,
        padding: '14px', cursor: 'pointer', flex: '1 1 0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          background: `${story.categoryColor}1A`, border: `1px solid ${story.categoryColor}40`,
          color: story.categoryColor, fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '2px 8px',
        }}>
          {story.category}
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 6px', lineHeight: 1.35,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {story.title}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: TEXT_DIM }}>
        <Clock size={10} /> {story.readTime}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reactions, savedIds, replies: storeReplies, toggleSave, setReaction, addReply } = useStoriesStore();
  const { userStories } = useStoriesStore();

  const [replyText, setReplyText] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  }, []);

  // Find story
  const story = useMemo(() => {
    return [...userStories, ...STORIES_DB].find(s => s.id === id);
  }, [id, userStories]);

  const currentReaction = story ? reactions[story.id] : null;
  const isSaved = story ? savedIds.includes(story.id) : false;

  // Replies
  const dbReplies = useMemo(() => story ? REPLIES_DB.filter(r => r.storyId === story.id) : [], [story]);
  const userReplies = story ? (storeReplies[story.id] || []) : [];
  const allReplies = [...userReplies, ...dbReplies];

  // Related stories (same category, different id, max 3)
  const relatedStories = useMemo(() => {
    if (!story) return [];
    return STORIES_DB
      .filter(s => s.category === story.category && s.id !== story.id)
      .slice(0, 3);
  }, [story]);

  // Next story
  const nextStory = useMemo(() => {
    if (!story) return null;
    const idx = STORIES_DB.findIndex(s => s.id === story.id);
    if (idx === -1) return STORIES_DB[0];
    return STORIES_DB[(idx + 1) % STORIES_DB.length];
  }, [story]);

  const getReactionCount = (key) => {
    if (!story) return 0;
    const base = story[key] || 0;
    if (currentReaction === key) return base + 1;
    return base;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied! 🔗');
    } catch {
      showToast('Link copied! 🔗');
    }
  };

  const handleReply = () => {
    if (!replyText.trim() || !story) return;
    addReply(story.id, {
      id: `ur-${Date.now()}`,
      storyId: story.id,
      authorId: null,
      authorName: isAnon ? 'Anonymous Soul' : 'You',
      isAnon,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
    });
    setReplyText('');
    showToast('Your support has been shared 💜');
  };

  if (!story) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Story not found</h2>
          <p style={{ color: TEXT_DIM, fontSize: 14, margin: '0 0 20px' }}>This story may have been removed or doesn't exist.</p>
          <button
            onClick={() => navigate('/stories')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)', border: 'none',
              borderRadius: 14, color: '#fff', fontWeight: 600, fontSize: 14,
              padding: '12px 24px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Toast message={toast.message} visible={toast.visible} />

      {/* Glow background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '40vh', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Back button ── */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
            color: '#E2DEFF', padding: '8px 14px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={15} /> Back to Stories
        </motion.button>

        {/* ── Story Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            background: CARD, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
            padding: '24px 24px 20px', marginBottom: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }} />

          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <GradientAvatar name={story.authorName} isAnon={story.isAnon} size={46} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{story.authorName}</span>
                  {story.isAnon && (
                    <span style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA', fontSize: 10, fontWeight: 600, borderRadius: 20, padding: '1px 8px' }}>
                      Anonymous
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 12, color: TEXT_DIM }}>{story.time}</span>
                  <span style={{ fontSize: 12, color: TEXT_DIM }}>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT_DIM }}>
                    <Clock size={11} /> {story.readTime}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleSave(story.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                <Bookmark size={18} color={isSaved ? PURPLE : TEXT_DIM} fill={isSaved ? PURPLE : 'none'} />
              </button>
              <button onClick={handleShare} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                <Share2 size={17} color={TEXT_DIM} />
              </button>
            </div>
          </div>

          {/* Category + Mood badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{
              background: `${story.categoryColor}1A`, border: `1px solid ${story.categoryColor}40`,
              color: story.categoryColor, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: '3px 12px',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Tag size={10} /> {story.category}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: TEXT_MID, fontSize: 11, fontWeight: 500, borderRadius: 20, padding: '3px 12px',
            }}>
              {story.moodEmoji} {story.mood}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 20px',
            lineHeight: 1.25, letterSpacing: '-0.02em',
          }}>
            {story.title}
          </h1>

          {/* Full content */}
          <div style={{ fontSize: 17, color: TEXT_MID, lineHeight: 1.85, margin: '0 0 24px' }}>
            {story.content.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ margin: '0 0 18px' }}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {story.tags.map(tag => (
                <span key={tag} style={{
                  background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
                  color: '#A78BFA', fontSize: 11, fontWeight: 500, borderRadius: 20, padding: '3px 10px',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Support reactions */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18 }}>
            <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 12, fontWeight: 600 }}>OFFER SUPPORT</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SUPPORT_REACTIONS.map(r => {
                const isActive = currentReaction === r.key;
                return (
                  <motion.button
                    key={r.key}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setReaction(story.id, r.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      background: isActive ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.05)',
                      border: isActive ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 20, padding: '8px 16px', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                      boxShadow: isActive ? '0 0 12px rgba(139,92,246,0.25)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{r.emoji}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#C4B5FD' : TEXT_MID }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 11, color: isActive ? '#A78BFA' : TEXT_DIM }}>
                        {getReactionCount(r.key)}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Replies Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: CARD, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
            padding: '24px', marginBottom: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <MessageCircle size={18} color={PURPLE} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>
              Support Replies ({allReplies.length})
            </h2>
          </div>

          {/* Replies list */}
          <div style={{ marginBottom: 20 }}>
            {allReplies.length === 0 ? (
              <p style={{ fontSize: 14, color: TEXT_DIM, textAlign: 'center', padding: '24px 0' }}>
                Be the first to offer support 💜
              </p>
            ) : (
              allReplies.map((reply, i) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ display: 'flex', gap: 12, marginBottom: 18, paddingBottom: 18, borderBottom: i < allReplies.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <GradientAvatar name={reply.authorName} isAnon={reply.isAnon} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{reply.authorName}</span>
                      {reply.isAnon && (
                        <span style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA', fontSize: 9, fontWeight: 600, borderRadius: 20, padding: '1px 6px' }}>Anon</span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, color: TEXT_MID, margin: 0, lineHeight: 1.6 }}>{reply.content}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Reply input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}>
            <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 12, fontWeight: 600 }}>ADD YOUR SUPPORT</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write something kind and supportive..."
                  rows={3}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14, padding: '12px 14px', resize: 'none',
                    fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#E2DEFF',
                    lineHeight: 1.6, outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  onClick={() => setIsAnon(a => !a)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM, fontSize: 12, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}
                >
                  {isAnon ? <EyeOff size={12} /> : <Eye size={12} />}
                  {isAnon ? 'Posting anonymously · click to change' : 'Posting as You · click to anonymize'}
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReply}
                disabled={!replyText.trim()}
                style={{
                  background: replyText.trim() ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'rgba(255,255,255,0.06)',
                  border: 'none', borderRadius: 14, padding: '12px 16px', cursor: replyText.trim() ? 'pointer' : 'default',
                  color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                  boxShadow: replyText.trim() ? '0 4px 14px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                <Send size={15} /> Send
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Related Stories ── */}
        {relatedStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Related Stories</h3>
              <button
                onClick={() => navigate('/stories')}
                style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                See All <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {relatedStories.map(s => <RelatedCard key={s.id} story={s} />)}
            </div>
          </motion.div>
        )}

        {/* ── Next Story ── */}
        {nextStory && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/story/${nextStory.id}`)}
            style={{
              width: '100%', background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.15))',
              border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20,
              padding: '18px 20px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Next Story</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>{nextStory.title}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> {nextStory.readTime} · {nextStory.category}
              </div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              <ChevronRight size={20} color="#fff" />
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
}
