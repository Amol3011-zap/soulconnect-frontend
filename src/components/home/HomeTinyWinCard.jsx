import {
  Check, Heart,
  Activity, Droplets, Wind, Brain, Flower2,
  Users, Zap, Star, Moon, Monitor, Leaf,
  Target, Briefcase, BookOpen, Palette, Sparkles, Gift,
} from 'lucide-react';
import { CATEGORY_META } from '../../data/tinyWinsChallenges';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   TINY WIN ROW (Home, light theme). One compact tappable row per win:
   category icon · title · category · check. Tapping completes the win
   (same onComplete(win.id) contract as before); completed rows stay visible
   with a quiet checked state.
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_ICONS = {
  'Movement': Activity, 'Body': Droplets, 'Breathing': Wind, 'Mind': Brain,
  'Meditation': Flower2, 'Connection': Users, 'Confidence': Zap, 'Gratitude': Star,
  'Sleep': Moon, 'Digital Wellbeing': Monitor, 'Nature': Leaf, 'Focus': Target,
  'Relationships': Heart, 'Work': Briefcase, 'Learning': BookOpen,
  'Creativity': Palette, 'Self Care': Sparkles, 'Kindness': Gift,
};

export default function HomeTinyWinCard({ win, isCompleted, onComplete }) {
  if (!win) return null;
  const meta = CATEGORY_META[win.category] || {};
  const IconComp = CATEGORY_ICONS[win.category] || Sparkles;
  const color = meta.color || '#8066D5';

  return (
    <button
      type="button"
      onClick={() => !isCompleted && onComplete(win.id)}
      aria-pressed={isCompleted}
      className={cn(
        'flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-150 active:scale-[0.99]',
        isCompleted ? 'bg-[#F2FAF6]' : 'hover:bg-muted'
      )}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${color}1F`, color }}
        aria-hidden="true"
      >
        <IconComp className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-[15px] font-medium leading-snug', isCompleted ? 'text-muted-foreground line-through decoration-[#9AD3B9]' : 'text-foreground')}>
          {win.title}
        </span>
        <span className="block text-xs text-muted-foreground">{win.category}</span>
      </span>
      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
          isCompleted ? 'border-[#2E9E6E] bg-[#2E9E6E] text-white' : 'border-border bg-card text-transparent'
        )}
        aria-hidden="true"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    </button>
  );
}
