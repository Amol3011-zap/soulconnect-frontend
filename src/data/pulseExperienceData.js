/**
 * Pulse Experience Data
 *
 * Static definitions for the Global Pulse / "How Do You Feel?" flow:
 * 1. Problem Selection (multi-select, up to 2)
 * 2. Support Selection (single select)
 * 3. Summary
 * 4. Global Pulse with World Map (real aggregated data via pulseDataAdapter.js)
 */

export const PROBLEMS = [
  { id: 'anxiety', icon: '😟', label: 'Anxiety & Overthinking' },
  { id: 'relationships', icon: '💔', label: 'Relationship Problems' },
  { id: 'mood', icon: '🧠', label: 'Low Mood' },
  { id: 'loneliness', icon: '🫥', label: 'Loneliness & Disconnection' },
  { id: 'burnout', icon: '🔥', label: 'Burnout & Stress' },
  { id: 'family', icon: '👨‍👩‍👧', label: 'Family Problems' },
  { id: 'selfworth', icon: '🪞', label: 'Self-Worth & Confidence' },
  { id: 'identity', icon: '🌈', label: 'Identity & Acceptance' },
  { id: 'grief', icon: '😔', label: 'Grief & Loss' },
  { id: 'career', icon: '💼', label: 'Career & Life Pressure' },
  { id: 'sleep', icon: '😴', label: 'Sleep & Routine' },
  { id: 'other', icon: '❓', label: 'Something Else' },
];

export const SUPPORT_OPTIONS = [
  {
    id: 'talk',
    icon: '💬',
    label: 'Talk to Someone',
    description: 'Have a real conversation with someone who understands.',
    route: '/home',
  },
  {
    id: 'find_people',
    icon: '🤝',
    label: 'Find People Like Me',
    description: 'Connect with people going through something similar.',
    route: '/home',
  },
  {
    id: 'professional',
    icon: '🧑‍⚕️',
    label: 'Talk to a Professional',
    description: 'Explore professional support when you want it.',
    route: '/professionals',
  },
  {
    id: 'myself',
    icon: '🌱',
    label: 'Work Through It Myself',
    description: 'Reflection, small steps and tools you can use on your own.',
    route: '/stories',
  },
  {
    id: 'heard',
    icon: '👂',
    label: 'I Just Want to Be Heard',
    description: 'No advice. No fixing. Just someone who listens.',
    route: '/home',
  },
];

// Category colors — cosmetic design tokens (not usage data), shared by the
// legend, breakdown bars, map points, and tooltips. Must match
// app/services/pulse_aggregation.py's PROBLEM_LABELS keys.
export const PROBLEM_COLORS = {
  anxiety: '#4ADE80',
  mood: '#EF4444',
  loneliness: '#FBBF24',
  burnout: '#3B82F6',
  relationships: '#A855F7',
  selfworth: '#EC4899',
  identity: '#06B6D4',
  grief: '#8B5CF6',
  family: '#F97316',
  career: '#6366F1',
  sleep: '#14B8A6',
  other: '#94A3B8',
};
