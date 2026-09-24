import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MOODS_5 } from '../../hooks/useMoodData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* Soul Climate check-in. Tapping a mood calls onMoodSelect(score), which
   saves today's check-in immediately (unchanged). The checked-in state is
   shown with a badge + selected tile, no animation. */
function MoodSelector({ mood, onMoodSelect, todayMoodMeta, onAddDetails }) {
  const checkedIn = Boolean(todayMoodMeta);

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] font-semibold leading-tight text-foreground">How are you feeling today?</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {checkedIn ? 'Saved for today. You can change it anytime.' : 'Tap the one closest to how you feel.'}
          </p>
        </div>
        {checkedIn && (
          <Badge className="shrink-0 gap-1 bg-[#E7F6EF] py-1 text-[#1F7A55]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Checked in
          </Badge>
        )}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2" role="radiogroup" aria-label="Today's mood">
        {MOODS_5.map((m) => {
          const on = mood === m.score;
          return (
            <button
              key={m.score}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onMoodSelect(m.score)}
              className={cn(
                'flex min-h-[72px] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 transition-colors duration-150 active:scale-[0.98]',
                on ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'
              )}
            >
              <span className="text-[26px] leading-none" aria-hidden="true">{m.emoji}</span>
              {/* wraps instead of truncating ("Not Good" → 2 lines on a 393px phone) */}
              <span className={cn('w-full text-center text-[11.5px] font-medium leading-tight', on ? 'text-[#4B3699]' : 'text-foreground')}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {onAddDetails && (
        <Button variant={checkedIn ? 'default' : 'secondary'} className="mt-4 w-full" onClick={onAddDetails}>
          {checkedIn ? 'Add details to today' : 'Log a full entry'}
        </Button>
      )}
    </Card>
  );
}

export default React.memo(MoodSelector);
