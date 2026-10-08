/**
 * Feel Pond data layer.
 *
 * The pond replaces SoulMatch's "browse profiles" model: people float one
 * anonymous line about what they feel ("a lotus"), and others respond to the
 * feeling ("I feel this too") rather than to a person. Identities are only
 * revealed if BOTH people later choose "Bloom together".
 *
 * Backend reality today: there are NO pond endpoints yet. Every call below
 * tries the intended endpoint first and, when it is missing:
 *   - in local development (import.meta.env.DEV) falls back to a sample
 *     fixture so the UI can be tried end to end, flagged with isMock;
 *   - in production returns an honest empty / unsupported result. Nothing
 *     here ever invents people in a production build.
 *
 * Intended endpoints for the backend team:
 *   GET  /pond/lotuses?problems=a,b      lotuses matching ANY of the problems
 *   POST /pond/lotuses                   { text, problems[], custom_label }
 *   POST /pond/lotuses/:id/resonate      opens an anonymous chat, returns { chat_id }
 *   POST /pond/chats/:id/bloom           records THIS user's yes; server reveals
 *                                        identities only once both said yes
 *   POST /pond/chats/:id/drift           ends the chat silently
 *   POST /pond/chats/:id/petal           one kindness petal per chat
 *   POST /pond/talk-now                  instant pairing queue
 *   GET  /pond/chats                     this user's open anonymous chats
 *   POST /pond/chats/:id/messages        { text }
 *
 * SCALE (100,000+ users): the server never sends the whole pond. Each user
 * gets a small personal window (about 9 lotuses) picked from lotuses that
 * share a problem, are fresh (last 3 days), are not theirs, are not from
 * blocked users, and are not yet "held" (a lotus stops showing once
 * LOTUS_CAPACITY people are already talking to its author). Lotuses nobody
 * has answered yet get a boost so every feeling is seen by someone.
 * "Show other lotuses" asks for the next window. Index lotuses by problem
 * tag + created_at so this stays a cheap query at any size.
 *
 * FREE PLAN: a free user can talk with FREE_CHAT_LIMIT different people from
 * the pond IN TOTAL (letting a chat drift does not free a spot). Premium has
 * no limit. The UI shows the limit, but the server must enforce it too.
 */
export const FREE_CHAT_LIMIT = 2;
export const LOTUS_CAPACITY = 3;
export const WINDOW_SIZE = 9;
import api from '../../services/api';

/* ── Matching ──────────────────────────────────────────────────
 * A lotus matches you when it shares AT LEAST ONE of your (up to) two
 * problems. Lotuses sharing both come first, then one, then related
 * problems, so the pond is never empty while the community is small.
 */
export const RELATED = {
  anxiety: ['sleep', 'self_doubt', 'burnout'],
  loneliness: ['heartbreak', 'feeling_lost', 'family'],
  burnout: ['career', 'sleep', 'anxiety'],
  career: ['burnout', 'self_doubt', 'feeling_lost'],
  self_doubt: ['career', 'anxiety', 'feeling_lost'],
  heartbreak: ['relationships', 'loneliness', 'grief'],
  family: ['relationships', 'loneliness', 'burnout'],
  feeling_lost: ['self_doubt', 'career', 'loneliness'],
  grief: ['heartbreak', 'loneliness', 'family'],
  relationships: ['heartbreak', 'family', 'loneliness'],
  sleep: ['anxiety', 'burnout'],
  other: [],
};

export function rankLotuses(input, mine = []) {
  const lotuses = input.filter(l => l.mine || l.guide || (l.responders || 0) < LOTUS_CAPACITY);
  const my = new Set(mine.filter(Boolean));
  if (my.size === 0) {
    return lotuses.map(l => ({ ...l, fit: 'all' }));
  }
  const related = new Set([...my].flatMap(p => RELATED[p] || []));
  return lotuses
    .map(l => {
      const shared = (l.problems || []).filter(p => my.has(p)).length;
      const near = (l.problems || []).some(p => related.has(p));
      const fit = shared >= 2 ? 'both' : shared === 1 ? 'one' : near ? 'related' : 'other';
      return { ...l, shared, fit };
    })
    .sort((a, b) => {
      const order = { both: 0, one: 1, related: 2, other: 3 };
      const unanswered = (x) => ((x.responders || 0) === 0 && !x.guide ? 0 : 1);
      return order[a.fit] - order[b.fit]
        || unanswered(a) - unanswered(b)
        || (b.createdAt || 0) - (a.createdAt || 0);
    });
}

/* ── Suggest problems for "Something else" text ─────────────── */
const KEYWORDS = [
  [/(job|work|boss|office|career|promotion|interview|salary)/i, 'career'],
  [/(tired|exhaust|drained|burn ?out|overwork)/i, 'burnout'],
  [/(alone|lonely|no friends|no one to talk|isolat|new city)/i, 'loneliness'],
  [/(anxious|anxiety|panic|worr|nervous|overthink)/i, 'anxiety'],
  [/(sleep|insomnia|night|3 ?am)/i, 'sleep'],
  [/(breakup|broke up|ex\b|heartbreak|cheat)/i, 'heartbreak'],
  [/(mom|dad|mother|father|parent|family|sibling|in.?laws)/i, 'family'],
  [/(passed away|died|loss|grief|funeral|miss (him|her|them))/i, 'grief'],
  [/(partner|marriage|husband|wife|boyfriend|girlfriend|relationship)/i, 'relationships'],
  [/(not good enough|doubt|confidence|imposter|worthless)/i, 'self_doubt'],
  [/(lost|no direction|purpose|stuck|what to do with my life)/i, 'feeling_lost'],
];

export function suggestProblems(text = '') {
  const out = [];
  for (const [re, id] of KEYWORDS) {
    if (re.test(text) && !out.includes(id)) out.push(id);
    if (out.length === 2) break;
  }
  return out;
}

/* ── Safety check before floating ───────────────────────────── */
const CRISIS = new RegExp([
  'suicid', 'self.?harm', 'no reason to live', 'not worth living', 'better off dead',
  '(kill|killing|hurt|hurting|harm|harming|cut|cutting|end|ending) my ?self',
  '(end|ending) (my life|it all)', 'want(ing)? to die', 'wish i (was|were) dead',
  "(don'?t|do not) want to (live|be alive|be here|wake up)",
  "can'?t go on", '(no ?one|nobody) would (miss|care)', 'disappear forever', 'stop existing', 'overdose',
].join('|'), 'i');
export function needsCrisisSupport(text = '') {
  return CRISIS.test(text);
}

/* ── API calls with dev-only fallback ───────────────────────── */
async function loadMock() {
  try { return await import('./soulpond.mock.dev.js'); } catch { return null; }
}

function isMissing(err) {
  const s = err?.response?.status;
  return !err?.response || s === 404 || s === 405 || s === 501;
}

export async function getLotuses(problems = []) {
  try {
    const res = await api.get('/pond/lotuses', { params: { problems: problems.join(',') } });
    const rows = Array.isArray(res?.data?.lotuses) ? res.data.lotuses : [];
    return { lotuses: rows, isMock: false, unsupported: false, error: null };
  } catch (err) {
    if (import.meta.env.DEV && isMissing(err)) {
      const m = await loadMock();
      if (m) return { lotuses: m.getMockLotuses(), isMock: true, unsupported: false, error: null };
    }
    return {
      lotuses: [],
      isMock: false,
      unsupported: isMissing(err),
      error: err?.response?.status === 401 ? 'auth' : null,
    };
  }
}

export async function floatLotus({ text, problems, customLabel }) {
  try {
    const res = await api.post('/pond/lotuses', { text, problems, custom_label: customLabel || null });
    return { lotus: res?.data?.lotus || null, isMock: false };
  } catch (err) {
    if (import.meta.env.DEV && isMissing(err)) {
      const m = await loadMock();
      if (m) return { lotus: m.addMockLotus({ text, problems, customLabel }), isMock: true };
    }
    throw err;
  }
}

export async function resonate(lotus) {
  try {
    const res = await api.post(`/pond/lotuses/${lotus.id}/resonate`);
    return { chatId: res?.data?.chat_id, isMock: false };
  } catch (err) {
    if (import.meta.env.DEV && isMissing(err)) return { chatId: `mock-${lotus.id}`, isMock: true };
    throw err;
  }
}

async function chatAction(chatId, action) {
  if (String(chatId).startsWith('mock-')) return { isMock: true };
  await api.post(`/pond/chats/${chatId}/${action}`);
  return { isMock: false };
}
export const bloom = (chatId) => chatAction(chatId, 'bloom');
export const drift = (chatId) => chatAction(chatId, 'drift');
export const givePetal = (chatId) => chatAction(chatId, 'petal');

/* ── Conversations ──────────────────────────────────────────── */
const DEV_CHATS_KEY = 'sc-pond-chats-dev';
function readDevChats() {
  try { return JSON.parse(localStorage.getItem(DEV_CHATS_KEY) || '[]'); } catch { return []; }
}
function writeDevChats(list) {
  try { localStorage.setItem(DEV_CHATS_KEY, JSON.stringify(list)); } catch { /* private mode */ }
}

export async function getChats() {
  try {
    const res = await api.get('/pond/chats');
    return { chats: Array.isArray(res?.data?.chats) ? res.data.chats : [], isMock: false };
  } catch (err) {
    if (import.meta.env.DEV && isMissing(err)) return { chats: readDevChats(), isMock: true };
    return { chats: [], isMock: false };
  }
}

/** Create (or reuse) the chat record for a lotus. */
export function rememberChat(chat) {
  if (!String(chat.id).startsWith('mock-')) return chat;
  const list = readDevChats();
  const existing = list.find(c => c.id === chat.id);
  if (existing) return existing;
  const next = [{ ...chat, status: 'open', messages: [], bloomed: false, updatedAt: Date.now() }, ...list];
  writeDevChats(next);
  return next[0];
}

export async function saveMessage(chatId, text) {
  if (!String(chatId).startsWith('mock-')) {
    await api.post(`/pond/chats/${chatId}/messages`, { text });
    return;
  }
  const list = readDevChats().map(c => (c.id === chatId
    ? { ...c, messages: [...(c.messages || []), { id: Date.now(), me: true, text }], updatedAt: Date.now() }
    : c));
  writeDevChats(list);
}

/** Share a photo in a pond chat. `image` is a compressed JPEG data URL
 *  (re-encoded on the device, so camera location data is already stripped).
 *  The backend needs to accept { image, text } on this endpoint. */
export async function saveImage(chatId, image, text = '') {
  if (!String(chatId).startsWith('mock-')) {
    await api.post(`/pond/chats/${chatId}/messages`, { text, image });
    return;
  }
  const list = readDevChats().map(c => (c.id === chatId
    ? { ...c, messages: [...(c.messages || []), { id: Date.now(), me: true, text, image }], updatedAt: Date.now() }
    : c));
  try {
    localStorage.setItem(DEV_CHATS_KEY, JSON.stringify(list));
  } catch {
    throw new Error('storage-full');
  }
}

/** Share a short voice note. `audio` is a data URL (webm or mp4), `duration` in seconds.
 *  The backend needs to accept { audio, duration } on this endpoint. */
export async function saveAudio(chatId, audio, duration) {
  if (!String(chatId).startsWith('mock-')) {
    await api.post(`/pond/chats/${chatId}/messages`, { text: '', audio, duration });
    return;
  }
  const list = readDevChats().map(c => (c.id === chatId
    ? { ...c, messages: [...(c.messages || []), { id: Date.now(), me: true, text: '', audio, duration }], updatedAt: Date.now() }
    : c));
  try {
    localStorage.setItem(DEV_CHATS_KEY, JSON.stringify(list));
  } catch {
    throw new Error('storage-full');
  }
}

export function markChat(chatId, patch) {
  if (!String(chatId).startsWith('mock-')) return;
  writeDevChats(readDevChats().map(c => (c.id === chatId ? { ...c, ...patch, updatedAt: Date.now() } : c)));
}
