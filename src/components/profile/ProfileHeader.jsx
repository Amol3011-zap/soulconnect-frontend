import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useMoodData } from '../../hooks/useMoodData';
import AvatarPicker from '../AvatarPicker';
import { avatarSrc, currentAvatarId, currentMood } from '../../data/avatars';

export default function ProfileHeader({ user, streak, onEditClick, level = 4 }) {
  const { store: moodStore } = useMoodData();
  const [todayMood, setTodayMood] = useState(null);
  const [avatarId, setAvatarId] = useState(() => currentAvatarId(user));
  const [picking, setPicking] = useState(false);
  const [mood, setMood] = useState(() => currentMood(user));
  const avatar = avatarSrc(avatarId, mood);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setTodayMood(moodStore[today]?.mood);
  }, [moodStore]);

  const initials = (user?.full_name || user?.name || 'S')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const moodEmoji = { 1: '😭', 3: '😔', 5: '😐', 7: '🙂', 9: '😁' };

  const getMoodEmoji = (score) => {
    if (!score) return '😊';
    return Object.entries(moodEmoji).reduce(([bestScore, bestEmoji], [s, emoji]) =>
      Math.abs(parseInt(s) - score) < Math.abs(parseInt(bestScore) - score)
        ? [s, emoji]
        : [bestScore, bestEmoji]
    )[1];
  };

  const getMoodLabel = (score) => {
    if (!score) return 'No mood logged';
    const moodLabels = { 1: 'Awful', 3: 'Not Good', 5: 'Okay', 7: 'Good', 9: 'Amazing' };
    return Object.entries(moodLabels).reduce(([bestScore, bestLabel], [s, label]) =>
      Math.abs(parseInt(s) - score) < Math.abs(parseInt(bestScore) - score)
        ? [s, label]
        : [bestScore, bestLabel]
    )[1];
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'var(--sc-card)',
        border: '1px solid var(--sc-border)',
        borderRadius: 24,
        padding: '20px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backdropFilter: 'none',
      }}
    >
      {/* Left: Avatar + Online */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setPicking(true)}
          aria-label={avatar ? 'Change your avatar' : 'Choose your avatar'}
          style={{ padding: 0, border: 0, background: 'none', cursor: 'pointer', display: 'block', borderRadius: '50%' }}
        >
          {avatar ? (
            <img src={avatar} alt="" style={{ width: 68, height: 68, borderRadius: '50%', display: 'block', background: 'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #F4EEFB 60%, #E6DCF6 100%)', border: '2px solid #E6DDF3' }} />
          ) : user?.avatar_url ? (
            <img src={user.avatar_url} alt="" style={{ width: 68, height: 68, borderRadius: '50%', border: '2px solid var(--sc-border)', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#C9B8E8,#F3D9C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', border: '2px solid #E6DDF3' }}>
              {initials}
            </div>
          )}
          <span style={{ position: 'absolute', left: -4, bottom: -4, padding: '2px 7px', borderRadius: 999, background: '#6B4FA0', color: '#fff', fontSize: 10, fontWeight: 700, border: '2px solid #fff', whiteSpace: 'nowrap' }}>
            {avatar ? 'Mood' : 'Pick'}
          </span>
        </button>
        {/* Online indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #fff',
          }}
        />
      </div>

      {/* Center: Name + Mood + Streak */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--sc-text)', marginBottom: 4 }}>
          {user?.full_name || user?.name || 'Soul Traveler'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--sc-text-2)', marginBottom: 8 }}>
          {user?.bio || 'You are more than what you’re going through.'}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--sc-text-2)' }}>
            <span>{getMoodEmoji(todayMood)}</span>
            <span>{getMoodLabel(todayMood)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--sc-text-2)' }}>
            <span>🔥</span>
            <span>{streak || 0}d Streak</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--sc-text-2)' }}>
            <span>🌱</span>
            <span>Level {level}</span>
          </div>
        </div>
      </div>

      {/* Right: Edit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEditClick}
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid var(--sc-line)',
          background: 'var(--sc-tint)',
          color: 'var(--sc-purple-text)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
          flexShrink: 0,
        }}
      >
        ✏️ Edit
      </motion.button>
      <AvatarPicker open={picking} current={avatarId} currentMood={mood} onClose={() => setPicking(false)} onSaved={(id, m) => { setAvatarId(id); setMood(m); }} />
    </motion.div>
  );
}
