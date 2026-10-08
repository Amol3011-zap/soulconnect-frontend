/* ─────────────────────────────────────────────────────────────────────────────
   SameFeel · password policy

   Follows NIST SP 800-63B Rev 4, which is deliberately NOT the old
   "one capital, one number, one symbol" rule. Rev 4 says a service SHALL NOT
   impose composition rules, because they produce predictable passwords like
   Soulconnect@123 and push people into reusing one password everywhere.
   What actually works is length plus a breach check.

   So:
     · 12 character minimum, 64 maximum, every character allowed including spaces
     · no composition requirements
     · rejected if it appears in a known breach (Have I Been Pwned, k-anonymity)
     · rejected if it contains the person's own name, phone or "soulconnect"

   DEV / MOCK MODE
   In development the rules are advisory: anything 4+ characters passes so you
   can type test data freely. Production always enforces. The switch is
   import.meta.env.DEV, which Vite resolves at build time, so a production
   bundle physically cannot contain the lenient path.

   IMPORTANT: this is UX only. Anything here is bypassable with curl, so the
   Node backend has to apply the same rules independently before hashing.
   ───────────────────────────────────────────────────────────────────────────── */

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 64;

const DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
const DEV_MIN = 4;

/** Obvious junk, kept tiny — the breach check does the real work. */
const OBVIOUS = [
  'password', '123456', '12345678', '123456789', 'qwerty', '111111',
  'iloveyou', 'admin', 'welcome', 'abc123', 'letmein', 'soulconnect',
];

/**
 * Synchronous rules. Returns '' when acceptable, otherwise a message to show.
 * @param {string} pw
 * @param {{name?: string, phone?: string, email?: string}} [context]
 */
export function checkPassword(pw, context = {}) {
  const value = pw || '';

  if (DEV) {
    // Mock-friendly: just enough to catch an empty field.
    return value.length >= DEV_MIN ? '' : `Password must be at least ${DEV_MIN} characters`;
  }

  if (value.length < PASSWORD_MIN) {
    return `Use at least ${PASSWORD_MIN} characters. A few ordinary words together works well.`;
  }
  if (value.length > PASSWORD_MAX) {
    return `Passwords can be up to ${PASSWORD_MAX} characters.`;
  }

  const lower = value.toLowerCase();
  if (OBVIOUS.some(bad => lower.includes(bad))) {
    return 'That is a very common password. Please choose something else.';
  }

  // Your own details are the first thing anyone guesses.
  const { name, phone, email } = context;
  const parts = [
    ...(name ? name.toLowerCase().split(/\s+/) : []),
    ...(email ? [email.toLowerCase().split('@')[0]] : []),
    ...(phone ? [String(phone).replace(/\D/g, '')] : []),
  ].filter(p => p && p.length >= 4);
  if (parts.some(p => lower.includes(p))) {
    return 'Please do not use your name, email or phone number in your password.';
  }

  return '';
}

/**
 * Breach check via the Have I Been Pwned range API.
 *
 * k-anonymity: only the first five characters of the SHA-1 go over the wire,
 * so neither we nor HIBP ever sees the password or its full hash.
 *
 * Fails open on purpose. If the network is down or the API is unreachable we
 * let the signup through rather than blocking someone from creating an account,
 * since the length rules have already applied.
 *
 * @returns {Promise<string>} '' when fine, otherwise a message.
 */
export async function checkPasswordBreached(pw) {
  if (DEV) return '';
  if (!pw || typeof crypto?.subtle?.digest !== 'function') return '';

  try {
    const bytes = new TextEncoder().encode(pw);
    const digest = await crypto.subtle.digest('SHA-1', bytes);
    const hash = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    });
    if (!res.ok) return '';

    const body = await res.text();
    const hit = body.split('\n').some(line => line.split(':')[0]?.trim() === suffix);
    return hit
      ? 'This password has appeared in a known data breach. Please pick a different one.'
      : '';
  } catch {
    return ''; // fail open
  }
}

/**
 * 0..4 for the strength meter. Length led, because length is what matters.
 * Variety nudges it up slightly but is never required.
 */
export function passwordStrength(pw) {
  const value = pw || '';
  if (!value) return 0;

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (value.length >= 16) score += 1;

  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/]
    .filter(re => re.test(value)).length;
  if (classes >= 3 && value.length >= 10) score += 1;

  if (OBVIOUS.some(bad => value.toLowerCase().includes(bad))) score = Math.min(score, 1);

  return Math.min(score, 4);
}

export const STRENGTH_LABELS = ['', 'Weak', 'Okay', 'Good', 'Strong'];
