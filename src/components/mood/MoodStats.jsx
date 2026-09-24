import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/* Soul Climate stats — one compact card (was four tall emoji tiles).
   Same four numbers from useMoodData; wellness gets a progress bar. */
function MoodStats({ streak, longestStreak, wellnessScore, totalEntries }) {
  const stats = [
    { label: 'Current streak', value: streak, unit: streak === 1 ? 'day' : 'days' },
    { label: 'Longest streak', value: longestStreak, unit: longestStreak === 1 ? 'day' : 'days' },
    { label: 'Total entries', value: totalEntries },
  ];

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-medium text-muted-foreground">Wellness score</span>
          <span className="text-[20px] font-bold leading-none text-foreground">
            {wellnessScore}<span className="text-[13px] font-medium text-muted-foreground">/100</span>
          </span>
        </div>
        <Progress value={wellnessScore} className="mt-2" aria-label="Wellness score" />
      </div>
      <div className="grid grid-cols-3 border-t border-border pt-3">
        {stats.map((s, i) => (
          <div key={s.label} className={i === 0 ? 'pr-2' : 'border-l border-border px-2'}>
            <div className="text-[20px] font-bold leading-tight text-foreground">
              {s.value}
              {s.unit && <span className="ml-1 text-[12px] font-medium text-muted-foreground">{s.unit}</span>}
            </div>
            <div className="text-[12px] leading-snug text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default React.memo(MoodStats);
