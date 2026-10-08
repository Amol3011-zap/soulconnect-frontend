import {
  Check, Heart,
  Activity, Droplets, Wind, Brain, Flower2,
  Users, Zap, Star, Moon, Monitor, Leaf,
  Target, Briefcase, BookOpen, Palette, Sparkles, Gift,
} from 'lucide-react';
import { CATEGORY_META } from '../../data/tinyWinsChallenges';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   TINY WIN ROW (Home). One tappable row per win.

   Design notes: the row is deliberately light. A soft tinted circle carries the
   category colour, the duration sits as a small pill so the person can see the
   cost before committing, and completing a win fills the circle rather than
   striking the text through, so a finished list reads as a row of green ticks
   instead of a list of crossed-out things.

   Contract is unchanged: onComplete(win.id).
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
      aria-label={isCompleted ? `${win.title}, done` : `${win.title}, mark as done`}
      className={cn(
        'group flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left',
        'transition-all duration-200 active:scale-[0.985]',
        isCompleted
          ? 'bg-[color:var(--sc-success-bg)]/60'
          : 'hover:bg-muted/70'
      )}
    >
      {/* Category mark. Fills with success colour once done. */}
      <span
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]',
          'transition-all duration-300'
        )}
        style={
          isCompleted
            ? { background: 'var(--sc-success)', color: '#fff' }
            : { background: `${color}1A`, color }
        }
        aria-hidden="true"
      >
        {isCompleted
          ? <Check className="h-5 w-5" strokeWidth={3} />
          : <IconComp className="h-[19px] w-[19px]" strokeWidth={2} />}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[15px] font-medium leading-snug transition-colors duration-200',
            isCompleted ? 'text-muted-foreground' : 'text-foreground'
          )}
        >
          {win.title}
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          <span
            className="inline-flex items-center rounded-full px-1.5 py-px text-[11px] font-semibold leading-[1.5]"
            style={{ background: `${color}14`, color }}
          >
            {win.duration || '2 min'}
          </span>
          <span className="truncate text-[11.5px] text-muted-foreground">{win.category}</span>
        </span>
      </span>

      {/* Affordance only — the whole row is the button. */}
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
          isCompleted
            ? 'border-transparent opacity-0'
            : 'border-border text-transparent group-hover:border-[color:var(--sc-purple)] group-hover:bg-[color:var(--sc-tint)]'
        )}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}
