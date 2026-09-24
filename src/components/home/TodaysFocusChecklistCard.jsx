import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/* ─────────────────────────────────────────────────────────────────────────────
   TODAY'S FOCUS — compact checklist card for the desktop Home sidebar
   (light theme). Same checklist and the same onStart action as before.
───────────────────────────────────────────────────────────────────────────── */
const FOCUS_CHECKLIST = [
  'Write 3 things you\'re grateful for',
  '5 minute breathing exercise',
  'Go for a short walk',
  'Be kind to yourself',
];

export default function TodaysFocusChecklistCard({ onStart }) {
  return (
    <Card className="p-4">
      <div className="mb-1 text-sm font-semibold text-foreground">Today's focus</div>
      <p className="mb-3 text-[13px] text-muted-foreground">Small steps. Big change.</p>
      <ul className="mb-4 space-y-2">
        {FOCUS_CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[13px] text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2E9E6E]" strokeWidth={2} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <Button className="w-full" onClick={onStart}>
        Start today <ArrowRight />
      </Button>
      <p className="mt-3 text-center text-xs italic text-muted-foreground">"Progress, not perfection."</p>
    </Card>
  );
}
