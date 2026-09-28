/**
 * SoulConnect avatars with moods.
 *
 * Every avatar has 6 expressions. The person chooses the look once and can
 * change the mood any time, so their avatar shows how they feel today.
 * Only the person decides the mood; nothing is set automatically.
 *
 * Images live in /public/avatars/soul-<id>-<mood>.svg (placeholders). To use
 * final 3D art, keep the same file names (or update `src` below).
 */
import { useAuthStore } from '../store/auth';
import { userAPI } from '../services/api';

export const MOODS = [
  { id: 'happy', label: 'Happy', hint: 'Feeling good today' },
  { id: 'calm', label: 'Okay', hint: 'Steady, just okay' },
  { id: 'sad', label: 'Sad', hint: 'A heavy day' },
  { id: 'lonely', label: 'Lonely', hint: 'Wishing someone was around' },
  { id: 'stressed', label: 'Stressed', hint: 'Too much on my mind' },
  { id: 'low', label: 'Low', hint: 'Tired of everything' },
];

export const AVATARS = [
  { id: 'a01', label: 'Bun and earrings' },
  { id: 'a02', label: 'Short hair' },
  { id: 'a03', label: 'Long hair and glasses' },
  { id: 'a04', label: 'Curly hair and beard' },
  { id: 'a05', label: 'Beanie and freckles' },
  { id: 'a06', label: 'Curly hair and freckles' },
  { id: 'a07', label: 'Long hair' },
  { id: 'a08', label: 'Short hair and beard' },
  { id: 'a09', label: 'Hijab' },
  { id: 'a10', label: 'Bun and glasses' },
  { id: 'a11', label: 'Curly auburn hair' },
  { id: 'a12', label: 'Short hair and glasses' },
];

const KEY = 'sc-avatar-id';
const MOOD_KEY = 'sc-avatar-mood';
const isMood = (m) => MOODS.some((x) => x.id === m);

export function avatarSrc(id, mood = 'calm') {
  if (!AVATARS.some((a) => a.id === id)) return null;
  return `/avatars/soul-${id}-${isMood(mood) ? mood : 'calm'}.svg`;
}

export function currentAvatarId(user) {
  if (user?.avatar_id && AVATARS.some((a) => a.id === user.avatar_id)) return user.avatar_id;
  try { const id = localStorage.getItem(KEY); if (AVATARS.some((a) => a.id === id)) return id; } catch { /* private mode */ }
  return null;
}

export function currentMood(user) {
  if (isMood(user?.avatar_mood)) return user.avatar_mood;
  try { const m = localStorage.getItem(MOOD_KEY); if (isMood(m)) return m; } catch { /* private mode */ }
  return 'calm';
}

/** Save look + mood on this device now, and on the account when the backend supports it. */
export async function saveAvatar(id, mood) {
  try { localStorage.setItem(KEY, id); if (mood) localStorage.setItem(MOOD_KEY, mood); } catch { /* private mode */ }
  const { user } = useAuthStore.getState();
  useAuthStore.setState({ user: { ...(user || {}), avatar_id: id, ...(mood ? { avatar_mood: mood } : {}) } });
  try {
    await userAPI.updateProfile({ avatar_id: id, ...(mood ? { avatar_mood: mood } : {}) });
    return { synced: true };
  } catch {
    // TODO(backend): accept avatar_id and avatar_mood on PUT /users/me.
    return { synced: false };
  }
}
