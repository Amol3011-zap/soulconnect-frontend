import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/* Recent entries — quiet list rows (was tinted blocks). Same 10-entry
   window, same mood-label mapping, same onDelete(date) contract. */
const MOODS_MAP = {
  1: { emoji: '😭', label: 'Awful', color: '#EF4444' },
  3: { emoji: '😔', label: 'Not Good', color: '#F97316' },
  5: { emoji: '😐', label: 'Okay', color: '#F59E0B' },
  7: { emoji: '🙂', label: 'Good', color: '#10B981' },
  9: { emoji: '😁', label: 'Amazing', color: '#6D4AFF' },
};

function getMoodLabel(score) {
  return Object.entries(MOODS_MAP).reduce(([bs, bm], [s, m]) =>
    Math.abs(parseInt(s) - score) < Math.abs(parseInt(bs) - score) ? [s, m] : [bs, bm]
  )[1];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RecentEntries({ allEntries, onDelete }) {
  const recent = allEntries.slice(0, 10).filter((e) => e.mood);

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-[18px] font-semibold text-foreground">Recent entries</h2>
      {recent.length === 0 ? (
        <p className="mt-1 text-[13px] text-muted-foreground">No entries yet. Your first check-in will show up here.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {recent.map((entry) => {
            const m = getMoodLabel(entry.mood);
            const preview = entry.reflection
              ? entry.reflection.substring(0, 60) + (entry.reflection.length > 60 ? '…' : '')
              : null;
            return (
              <li key={entry.date} className="flex items-center gap-3 py-2.5">
                <span className="text-[24px] leading-none" aria-hidden="true">{m.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-foreground">{m.label}</span>
                    <span className="text-[12px] text-muted-foreground">{formatDate(entry.date)}</span>
                  </div>
                  {preview && <p className="truncate text-[13px] text-muted-foreground">{preview}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(entry.date)}
                  aria-label={`Delete ${formatDate(entry.date)} entry`}
                >
                  <Trash2 />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default React.memo(RecentEntries);
