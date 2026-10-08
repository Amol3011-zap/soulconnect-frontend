/**
 * SameFeel avatars with moods.
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

/* ── Felt cartoon avatars (single image each, no mood variants) ── */
import feltAmazing from '../assets/felt-avatars/felt-amazing.png';
import feltExcited from '../assets/felt-avatars/felt-excited.png';
import feltGood from '../assets/felt-avatars/felt-good.png';
import feltOkay from '../assets/felt-avatars/felt-okay.png';
import feltNotGood from '../assets/felt-avatars/felt-notgood.png';
import feltAwful from '../assets/felt-avatars/felt-awful.png';
import feltCurious from '../assets/felt-avatars/felt-curious.png';
import feltPeaceful from '../assets/felt-avatars/felt-peaceful.png';

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

/** Felt cartoon characters (no mood variants, one image each). */
export const FELT_AVATARS = {
  'f01': { label: 'Sunny',   img: feltAmazing },
  'f02': { label: 'Sparky',  img: feltExcited },
  'f03': { label: 'Clover',  img: feltGood },
  'f04': { label: 'Mellow',  img: feltOkay },
  'f05': { label: 'Misty',   img: feltNotGood },
  'f06': { label: 'Grumble', img: feltAwful },
  'f07': { label: 'Boo',     img: feltCurious },
  'f08': { label: 'Dreamy',  img: feltPeaceful },
};
export const FELT_AVATAR_LIST = Object.entries(FELT_AVATARS).map(([id, v]) => ({ id, ...v }));
export const isFeltAvatar = (id) => id in FELT_AVATARS;
export const feltAvatarSrc = (id) => FELT_AVATARS[id]?.img || null;

/** Combined list: illustrated personas + felt characters. */
export const ALL_AVATARS = [...AVATARS, ...FELT_AVATAR_LIST];

/** Soul Climate check-in (weather) to avatar mood, so the Home card and profile match. */
export const WEATHER_TO_MOOD = {
  'clear-sky': 'happy',
  hope: 'calm',
  blooming: 'happy',
  fog: 'low',
  'heavy-rain': 'sad',
  storm: 'stressed',
};

const KEY = 'sc-avatar-id';
const MOOD_KEY = 'sc-avatar-mood';
const isMood = (m) => MOODS.some((x) => x.id === m);

export function avatarSrc(id, mood = 'calm') {
  if (isFeltAvatar(id)) return feltAvatarSrc(id);
  if (!AVATARS.some((a) => a.id === id)) return null;
  return `/avatars/soul-${id}-${isMood(mood) ? mood : 'calm'}.svg`;
}

export function currentAvatarId(user) {
  if (user?.avatar_id && ALL_AVATARS.some((a) => a.id === user.avatar_id)) return user.avatar_id;
  try { const id = localStorage.getItem(KEY); if (ALL_AVATARS.some((a) => a.id === id)) return id; } catch { /* private mode */ }
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
