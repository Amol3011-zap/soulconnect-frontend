/**
 * Selectable options for the SoulMatch setup card.
 *
 * Wording is deliberately experience-based ("Career Pressure", "Feeling Lost")
 * rather than clinical — SoulMatch describes what someone is going through,
 * it does not label or diagnose anyone.
 */

export const STRUGGLES = [
  { id: 'anxiety',       label: 'Anxiety' },
  { id: 'loneliness',    label: 'Loneliness' },
  { id: 'burnout',       label: 'Burnout' },
  { id: 'career',        label: 'Career Pressure' },
  { id: 'self_doubt',    label: 'Self-Doubt' },
  { id: 'heartbreak',    label: 'Heartbreak' },
  { id: 'family',        label: 'Family Pressure' },
  { id: 'feeling_lost',  label: 'Feeling Lost' },
  { id: 'grief',         label: 'Grief' },
  { id: 'relationships', label: 'Relationship Challenges' },
  { id: 'sleep',         label: 'Sleep & Routine' },
  { id: 'other',         label: 'Something Else' },
];

export const SUPPORT_NEEDS = [
  { id: 'listen',       label: 'Someone to listen' },
  { id: 'like_me',      label: 'Someone like me' },
  { id: 'friendship',   label: 'Friendship' },
  { id: 'accountability', label: 'Accountability partner' },
  { id: 'share',        label: 'Someone to share experiences with' },
  { id: 'heard',        label: 'Just be heard' },
];

/** Conversation starters offered when a connection opens (§12). */
export const CONVERSATION_STARTERS = [
  'What has been on your mind lately?',
  'What are you trying to get through right now?',
  'What do you wish people understood about you?',
  'Do you want advice, or would you rather someone just listen?',
];
