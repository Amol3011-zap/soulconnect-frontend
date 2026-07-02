import React, { useState } from 'react';
import { motion } from 'motion/react';

const CHAPTER_EXAMPLES = [
  '🌱 Learning to manage anxiety',
  '💜 Finding my people',
  '🚀 Building confidence',
  '🌊 Processing loss',
  '💪 Rediscovering myself',
  '✨ Healing from heartbreak',
];

export default function LifeChapterCard() {
  const [currentChapter, setCurrentChapter] = useState(CHAPTER_EXAMPLES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentChapter);

  const handleSave = () => {
    setCurrentChapter(editValue);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Current Chapter
        </span>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: 'none',
              background: 'transparent',
              color: '#A78BFA',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
            }}
          >
            Edit
          </motion.button>
        )}
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter your current chapter..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'rgba(124, 58, 237, 0.1)',
              color: '#fff',
              fontSize: 12,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Save
          </motion.button>
        </div>
      ) : (
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
          {currentChapter}
        </div>
      )}
    </motion.div>
  );
}
