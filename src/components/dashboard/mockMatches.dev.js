/**
 * DEVELOPMENT-ONLY sample matches.
 *
 * ⚠️  These are invented people. They exist so the SoulMatch section can be
 * designed and reviewed on localhost without a running backend.
 *
 * This module is only ever imported behind an `import.meta.env.DEV` guard
 * (see SoulMatchSection.jsx), so Vite tree-shakes it out of production
 * builds and real users can never see these profiles.
 *
 * Shape matches POST /api/matches/find exactly — see app/routes/matching.py.
 * `match_score` is on the backend's real 0-200 scale, so the percentages the
 * UI derives (94 / 91 / 87) come from the same maths production uses.
 */
/**
 * Illustrated avatars via DiceBear (open source, CC0 artwork, no API key).
 * Deliberately stylised, not photographs: these are invented profiles, so
 * showing a real person's face attached to a mental-health struggle would be
 * wrong even in a dev fixture. Rendered as `avatar_url`, which the real API
 * may also supply one day — MatchCard falls back to initials without it.
 */
const dicebear = (seed, bg) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}` +
  `&backgroundColor=${bg}&radius=50` +
  // Constrain to calm, neutral features — the default pool includes joke
  // accessories (pacifiers, wild expressions) that read badly next to a
  // mental-health struggle.
  '&mouth=smile,serious,default' +
  '&eyes=default,happy,squint' +
  '&eyebrows=default,defaultNatural,raisedExcitedNatural' +
  '&accessories=' +
  '&accessoriesProbability=0';

export const MOCK_MATCHES = [
  {
    id: 90001,
    name: 'Riya',
    age: 27,
    problem: 'Overthinking',
    problem_context: 'Anxiety',
    distance_km: 4.2,
    match_score: 188,
    city: 'Mumbai',
    match_reason: 'Trying to be kinder to myself every day.',
    avatar_url: dicebear('Meera42', 'ffd5dc'),
  },
  {
    id: 90002,
    name: 'Aarav',
    age: 29,
    problem: 'Burnout',
    problem_context: 'Career Pressure',
    distance_km: 9.1,
    match_score: 182,
    city: 'Bengaluru',
    match_reason: "Learning that my worth isn't defined by my work.",
    avatar_url: dicebear('Kabir17', 'c0aede'),
  },
  {
    id: 90003,
    name: 'Anonymous',
    age: 26,
    problem: 'Loneliness',
    problem_context: 'Self-Worth',
    distance_km: 21.5,
    match_score: 174,
    city: 'India',
    // Intentionally no avatar_url — exercises the initials fallback, and an
    // anonymous member should not have a face.
  },
];
