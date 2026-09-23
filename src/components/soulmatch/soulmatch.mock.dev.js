/**
 * DEVELOPMENT-ONLY SoulMatch fixtures.
 *
 * ⚠️  Invented people. Imported only behind `import.meta.env.DEV` guards in
 * soulmatchData.js, so Vite strips this module from production builds and real
 * users can never see these profiles.
 *
 * Shapes mirror the real endpoints (app/routes/matching.py). `match_score` is
 * on the backend's genuine 0-200 scale so displayed percentages come from the
 * same arithmetic production uses.
 */

const avatar = (seed, bg) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}` +
  `&backgroundColor=${bg}&radius=50` +
  '&mouth=smile,serious,default&eyes=default,happy,squint' +
  '&eyebrows=default,defaultNatural&accessories=&accessoriesProbability=0';

export const MOCK_SOULMATCHES = [
  {
    id: 90001, name: 'Riya', age: 27, city: 'Mumbai',
    problem: 'Career Pressure', problem_context: 'Self-Doubt',
    match_score: 184, distance_km: 4.2,
    match_reason: 'Trying to figure out what I really want from life.',
    support_need: 'Someone to listen',
    avatar_url: avatar('Meera42', 'ffd5dc'),
  },
  {
    id: 90002, name: 'Aarav', age: 29, city: 'Bengaluru',
    problem: 'Burnout', problem_context: 'Career Pressure',
    match_score: 176, distance_km: 9.1,
    match_reason: "Learning that my worth isn't defined by my work.",
    support_need: 'Someone like me',
    avatar_url: avatar('Kabir17', 'c0aede'),
  },
  {
    id: 90003, name: 'Anonymous', age: 26, city: 'India',
    problem: 'Loneliness', problem_context: 'Self-Worth',
    match_score: 168,
    match_reason: 'Taking things slowly and focusing on myself.',
    support_need: 'Just be heard',
  },
  {
    id: 90004, name: 'Neha', age: 24, city: 'Pune',
    problem: 'Feeling Lost', problem_context: 'Anxiety',
    match_score: 160, distance_km: 15.4,
    match_reason: 'Some days I just need someone who gets it.',
    support_need: 'Friendship',
    avatar_url: avatar('Anaya8', 'd1d4f9'),
  },
  {
    id: 90005, name: 'Anonymous', age: 31, city: 'Delhi',
    problem: 'Family Pressure', problem_context: 'Feeling Lost',
    match_score: 152,
    match_reason: 'Trying to set boundaries without guilt.',
    support_need: 'Someone to share experiences with',
  },
  {
    id: 90006, name: 'Ishaan', age: 28, city: 'Hyderabad',
    problem: 'Sleep & Routine', problem_context: 'Burnout',
    match_score: 144, distance_km: 32.0,
    match_reason: 'Small routines have helped me more than big changes.',
    support_need: 'Accountability partner',
    avatar_url: avatar('Rohan23', 'b6e3f4'),
  },
];

export const MOCK_REQUESTS = [
  {
    id: 80001,
    display_name: 'Anonymous',
    note: 'Interested in connecting around career pressure and self-doubt.',
    tags: ['Career Pressure', 'Self-Doubt'],
    requested_at: new Date(Date.now() - 6 * 3600e3).toISOString(),
  },
  {
    id: 80002,
    display_name: 'Anonymous',
    note: 'Going through something similar and would value someone to talk to.',
    tags: ['Loneliness'],
    requested_at: new Date(Date.now() - 2 * 86400e3).toISOString(),
  },
];

export const MOCK_CONNECTIONS = [
  {
    id: 70001, name: 'Riya',
    tags: ['Career Pressure', 'Self-Doubt'],
    connectedAt: new Date(Date.now() - 3 * 86400e3).toISOString(),
    avatar_url: avatar('Meera42', 'ffd5dc'),
  },
  {
    id: 70002, name: 'Anonymous',
    tags: ['Loneliness'],
    connectedAt: new Date(Date.now() - 11 * 86400e3).toISOString(),
  },
];
