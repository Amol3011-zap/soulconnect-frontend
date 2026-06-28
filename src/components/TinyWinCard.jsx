import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORY_META } from '../data/tinyWinsChallenges';

// ── Difficulty pill config ────────────────────────────────────────────────────
const DIFFICULTY_STYLE = {
  easy: {
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    color: '#10B981',
    label: 'Easy',
  },
  medium: {
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    color: '#A855F7',
    label: 'Medium',
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryBubble({ category }) {
  const meta = CATEGORY_META[category] || {};
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: meta.bg || 'rgba(139,92,246,0.15)',
        border: `1px solid ${meta.color ? meta.color + '4D' : 'rgba(139,92,246,0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        flexShrink: 0,
      }}
    >
      {meta.icon || '✨'}
    </div>
  );
}

function DurationPill({ duration }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: '#B8B4D8',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '2px 9px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
    >
      {duration}
    </span>
  );
}

function DifficultyPill({ difficulty }) {
  const style = DIFFICULTY_STYLE[difficulty] || DIFFICULTY_STYLE.easy;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 20,
        padding: '2px 9px',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {style.label}
    </span>
  );
}

function FavoriteButton({ isFavorite, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        background: isFavorite ? 'rgba(244,197,66,0.12)' : 'rgba(255,255,255,0.05)',
        border: isFavorite ? '1px solid rgba(244,197,66,0.35)' : '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: 15,
        flexShrink: 0,
        transition: 'background 0.2s, border 0.2s',
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
    >
      {isFavorite ? '🔖' : '📑'}
    </motion.button>
  );
}

// ── Completion overlay content ────────────────────────────────────────────────

function CompletionState() {
  return (
    <motion.div
      key="completion"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        marginTop: 14,
        padding: '10px 14px',
        borderRadius: 14,
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* Checkmark with spring pop */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.05 }}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.2)',
          border: '1.5px solid rgba(139,92,246,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(139,92,246,0.35)',
        }}
      >
        ✓
      </motion.div>

      {/* Reflection text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        style={{
          margin: 0,
          fontSize: 13,
          color: '#E2DEFF',
          lineHeight: 1.45,
          fontStyle: 'italic',
          fontWeight: 400,
        }}
      >
        You chose yourself today.
      </motion.p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TinyWinCard({
  challenge,
  isCompleted,
  isSkipped,
  isFavorite,
  onComplete,
  onSkip,
  onFavorite,
  index = 0,
  showInfo = false,
}) {
  const [infoOpen, setInfoOpen] = useState(showInfo);

  if (!challenge) return null;

  const { id, title, description, category, duration, difficulty, tip } = challenge;

  // ── Card style (glass + conditional completed tint) ───────────────────────
  const cardBg = isCompleted
    ? 'rgba(139,92,246,0.12)'
    : 'rgba(33,16,68,0.6)';
  const cardBorder = isCompleted
    ? '1px solid rgba(139,92,246,0.4)'
    : '1px solid rgba(255,255,255,0.1)';
  const cardBoxShadow = isCompleted
    ? '0 0 0 1px rgba(139,92,246,0.15), 0 8px 32px rgba(0,0,0,0.35)'
    : '0 4px 24px rgba(0,0,0,0.3)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isSkipped ? 0.45 : 1,
        y: 0,
        boxShadow: cardBoxShadow,
      }}
      transition={{
        opacity: { duration: 0.35, delay: index * 0.1 },
        y: { duration: 0.4, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] },
        layout: { duration: 0.3 },
      }}
      style={{
        borderRadius: 24,
        background: cardBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: cardBorder,
        padding: '18px 20px',
        fontFamily: "'Inter', sans-serif",
        transition: 'background 0.3s, border 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle inner highlight strip ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          borderRadius: '24px 24px 0 0',
        }}
      />

      {/* ── TOP ROW ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <CategoryBubble category={category} />

        {/* Title */}
        <p
          style={{
            margin: 0,
            flex: 1,
            fontSize: 15,
            fontWeight: 600,
            color: isCompleted ? '#E2DEFF' : '#fff',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </p>

        {/* Duration pill */}
        {duration && <DurationPill duration={duration} />}

        {/* Favorite / bookmark */}
        <FavoriteButton isFavorite={isFavorite} onClick={() => onFavorite?.(id)} />
      </div>

      {/* ── DESCRIPTION ──────────────────────────────────────────────────── */}
      {description && (
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: 13.5,
            color: '#B8B4D8',
            lineHeight: 1.55,
            paddingLeft: 2,
          }}
        >
          {description}
        </p>
      )}

      {/* ── EXPANDABLE TIP ───────────────────────────────────────────────── */}
      {tip && (
        <>
          <button
            onClick={() => setInfoOpen(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: 6,
              fontSize: 12,
              color: '#8A84B6',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 10 }}>{infoOpen ? '▾' : '▸'}</span>
            {infoOpen ? 'Hide tip' : 'Show tip'}
          </button>

          <AnimatePresence>
            {infoOpen && (
              <motion.div
                key="tip"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    padding: '9px 12px',
                    borderRadius: 12,
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    fontSize: 12.5,
                    color: '#B8B4D8',
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  {tip}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── BOTTOM ROW ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: description ? 0 : 4,
        }}
      >
        {/* Difficulty pill */}
        {difficulty && <DifficultyPill difficulty={difficulty} />}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Skip link (only when not completed) */}
        {!isCompleted && (
          <button
            onClick={() => onSkip?.(id)}
            disabled={isSkipped}
            style={{
              background: 'none',
              border: 'none',
              cursor: isSkipped ? 'default' : 'pointer',
              padding: '4px 2px',
              fontSize: 12,
              color: isSkipped ? '#8A84B6' : '#8A84B6',
              opacity: isSkipped ? 0.5 : 1,
              fontFamily: 'inherit',
              textDecoration: isSkipped ? 'none' : 'underline',
              textUnderlineOffset: 2,
              transition: 'opacity 0.2s',
            }}
          >
            {isSkipped ? 'Skipped' : 'Skip'}
          </button>
        )}

        {/* Complete button */}
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 14,
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.4)',
              color: '#10B981',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
          >
            ✓ Done
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onComplete?.(id)}
            style={{
              padding: '7px 18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              border: '1px solid rgba(168,85,247,0.4)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              boxShadow: '0 2px 12px rgba(139,92,246,0.35)',
              transition: 'box-shadow 0.2s',
            }}
          >
            Complete ✓
          </motion.button>
        )}
      </div>

      {/* ── COMPLETION STATE ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isCompleted && <CompletionState key={`completion-${id}`} />}
      </AnimatePresence>
    </motion.div>
  );
}
