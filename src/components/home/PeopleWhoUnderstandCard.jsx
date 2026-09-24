import { MapPin } from 'lucide-react';
import { scoreToPercent } from '../soulmatch/soulmatchData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

/* ─────────────────────────────────────────────────────────────────────────────
   PEOPLE WHO UNDERSTAND — compact match card for Home (light theme).
   Same data mapping as before: match_score -> %, problem/problem_context as
   shared-experience tags, match_reason/bio as the one-line statement.
   Not a dating card: no photo-first layout, no "like" affordances.
───────────────────────────────────────────────────────────────────────────── */
const AVATAR_TINTS = ['#F3E8FF', '#E0F2FE', '#FCE7F3', '#FEF3C7', '#DCFCE7', '#E0E7FF'];
const AVATAR_INKS  = ['#6B46C1', '#0369A1', '#BE185D', '#B45309', '#15803D', '#4338CA'];

export default function PeopleWhoUnderstandCard({ match, index = 0, onConnect, onDismiss }) {
  if (!match) return null;
  const matchPercent = scoreToPercent(match.match_score);
  const tags = [match.problem, match.problem_context].filter(Boolean).slice(0, 2);
  const statement = match.match_reason || match.bio || '';
  const location = match.city || match.location || 'India';
  const tint = AVATAR_TINTS[index % AVATAR_TINTS.length];
  const ink = AVATAR_INKS[index % AVATAR_INKS.length];

  return (
    <Card className="flex w-[248px] shrink-0 flex-col p-4 sm:w-auto sm:flex-1 sm:min-w-0">
      <div className="mb-3 flex items-center gap-3">
        <Avatar className="h-11 w-11">
          {match.avatar_url && <AvatarImage src={match.avatar_url} alt="" />}
          <AvatarFallback style={{ background: tint, color: ink }}>
            {match.name?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold text-foreground">
            {match.name}{match.age ? `, ${match.age}` : ''}
          </div>
          <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        {matchPercent != null && (
          <span className="shrink-0 rounded-full bg-[#E7F6EF] px-2 py-0.5 text-xs font-semibold text-[#1F7A55]">
            {matchPercent}%
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
      )}

      {statement && (
        <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">“{statement}”</p>
      )}

      <div className="mt-auto flex gap-2">
        <Button size="sm" className="flex-1" onClick={() => onConnect?.(match)}>Connect</Button>
        <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => onDismiss?.(match)}>
          Not now
        </Button>
      </div>
    </Card>
  );
}
