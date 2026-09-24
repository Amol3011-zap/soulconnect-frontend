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
        background: '#FFFFFF',
        border: '1px solid #E7E3EF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        backdropFilter: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#5E47B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
              color: '#5E47B8',
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
              border: '1px solid #DCD2F2',
              background: '#EFEAFB',
              color: '#171642',
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
              background: '#8066D5',
              color: '#171642',
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
        <div style={{ fontSize: 16, fontWeight: 600, color: '#171642', lineHeight: 1.5 }}>
          {currentChapter}
        </div>
      )}
    </motion.div>
  );
}
