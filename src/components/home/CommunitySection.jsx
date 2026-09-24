import React from 'react';
import { ArrowRight, Brain, Heart, Leaf, MessageCircle, MessagesSquare, Sparkles, Sun, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsDark } from '../../store/theme';
import { lightenForDark } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   HOME · "From the community" — one calm card per story + a Share CTA.
   Presentation only: same STORIES data, same behaviour (tap a card / See all
   → Stories). Hearts and comment counts are display-only here, as before.
   Background accents are tiny inline SVGs (no images, no new deps), faded in
   from the right at low opacity and never behind the text's reading area.
───────────────────────────────────────────────────────────────────────────── */

const CATEGORY = {
  Growth:       { icon: Leaf,  ink: '#1F8A5B', bg: '#EDF8F2', line: '#C6E9D6', accent: 'leaf',
                  dark: { ink: '#86EFAC', bg: 'rgba(34,197,94,0.12)', line: 'rgba(34,197,94,0.28)' } },
  Overthinking: { icon: Brain, ink: '#6D4AD9', bg: '#F4F0FD', line: '#DCD0F7', accent: 'mountains',
                  dark: { ink: '#C4B5FD', bg: '#292052', line: 'rgba(167,139,250,0.3)' } },
  Motivation:   { icon: Sun,   ink: '#C26A0A', bg: '#FFF6EA', line: '#F5DDB8', accent: 'bloom',
                  dark: { ink: '#FCD34D', bg: 'rgba(245,158,11,0.12)', line: 'rgba(245,158,11,0.3)' } },
};
const FALLBACK = { icon: Sparkles, ink: 'var(--sc-purple-text)', bg: '#F4F0FD', line: '#DCD0F7', accent: null,
                   dark: { ink: '#C4B5FD', bg: '#292052', line: 'rgba(167,139,250,0.3)' } };

// Soft atmospheric accents. viewBox 160×120, anchored bottom-right. In dark
// mode the pastel glow washes are dropped so only the shapes remain.
function Accent({ kind, dark }) {
  if (kind === 'leaf') return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="scAccLeafGlow" cx="75%" cy="70%" r="60%"><stop offset="0%" stopColor="#E7F5DC" /><stop offset="100%" stopColor="#E7F5DC" stopOpacity="0" /></radialGradient>
      </defs>
      <linearGradient id="scAccLeafA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D8EEC9" /><stop offset="100%" stopColor="#9FCB8C" /></linearGradient>
      <linearGradient id="scAccLeafB" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4F3D9" /><stop offset="100%" stopColor="#B4D9A2" /></linearGradient>
      {!dark && <rect width="160" height="120" fill="url(#scAccLeafGlow)" />}
      <path d="M114 122 C113 98 117 76 128 52" stroke="#93C28A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M128 52 C146 46 160 28 160 6 C138 8 122 26 128 52Z" fill="url(#scAccLeafA)" />
      <path d="M128 52 C138 38 150 22 158 10" stroke="#EAF6E1" strokeWidth="1" fill="none" opacity="0.8" />
      <path d="M117 86 C98 84 82 70 78 50 C100 50 114 64 117 86Z" fill="url(#scAccLeafB)" />
      <path d="M121 72 C134 62 150 62 162 70 C150 84 134 84 121 72Z" fill="url(#scAccLeafA)" />
      <path d="M115 104 C104 100 96 92 94 82 C106 82 114 90 115 104Z" fill="#CFE7C2" />
    </svg>
  );
  if (kind === 'mountains') return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="scAccSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F6F1FF" stopOpacity="0" /><stop offset="100%" stopColor="#EFE7FD" /></linearGradient>
      </defs>
      {!dark && <rect width="160" height="120" fill="url(#scAccSky)" />}
      <circle cx="122" cy="40" r="13" fill="#FBF3E4" />
      <path d="M40 120 L92 66 L120 90 L140 72 L170 104 L170 120Z" fill="#D9CCF6" />
      <path d="M70 120 L112 84 L138 104 L160 94 L170 120Z" fill="#C4B3F0" />
    </svg>
  );
  if (kind === 'bloom') return (
    <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="scAccWarm" cx="80%" cy="55%" r="60%"><stop offset="0%" stopColor="#FFE9C7" /><stop offset="100%" stopColor="#FFE9C7" stopOpacity="0" /></radialGradient>
      </defs>
      {!dark && <rect width="160" height="120" fill="url(#scAccWarm)" />}
      <path d="M128 120 C128 100 130 82 134 64" stroke="#B9C98E" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="134" cy="52" rx="4.5" ry="11" fill="#FFFFFF" stroke="#F3E3C8" strokeWidth="0.8" transform={`rotate(${a} 134 60) translate(0 -2)`} />
      ))}
      <circle cx="134" cy="60" r="5" fill="#F2BF5B" />
    </svg>
  );
  return null;
}

function StoryCard({ story, onOpen, dark }) {
  const base = CATEGORY[story.tag] || FALLBACK;
  const cat = dark ? { ...base, ...base.dark } : base;
  const CatIcon = cat.icon;
  const anonymous = !story.name || story.name === 'Anonymous';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative block w-full overflow-hidden rounded-[20px] border border-[#EEEAF5] bg-card p-4 dark:border-border text-left shadow-[0_1px_2px_rgba(23,22,66,0.03),0_6px_20px_rgba(23,22,66,0.05)] transition-transform duration-150 active:scale-[0.99] sm:p-[18px]"
    >
      {cat.accent && (
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-full w-[50%] opacity-80 [filter:blur(0.3px)] dark:opacity-45"
          style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)' }}
        >
          <Accent kind={cat.accent} dark={dark} />
        </div>
      )}

      <div className="relative">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[12px] font-medium"
            style={{ color: cat.ink, background: cat.bg, borderColor: cat.line }}
          >
            <CatIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {story.tag}
          </span>
          <span className="text-[12px] text-muted-foreground">{story.time}</span>
        </div>

        <p className="line-clamp-3 pr-[18%] text-[16.5px] font-medium leading-[1.4] text-foreground sm:text-[17px]">
          {story.preview}
        </p>

        <div className="mt-3 flex items-center gap-4 text-[13px] text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback
                className="text-[12px]"
                style={anonymous ? { background: 'var(--sc-tint)', color: '#8B78D8' } : { background: `${story.avatarColor}1F`, color: dark ? lightenForDark(story.avatarColor) : story.avatarColor }}
              >
                {anonymous ? <UserRound className="h-4 w-4" aria-hidden="true" /> : story.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{story.name}</span>
          </span>
          <span className="flex items-center gap-1" aria-label={`${story.hearts} hearts`}>
            <Heart className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> {story.hearts}
          </span>
          <span className="flex items-center gap-1" aria-label={`${story.comments} comments`}>
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> {story.comments}
          </span>
        </div>
      </div>
    </button>
  );
}

function CommunitySection({ stories, onOpenStory, onSeeAll, onShare }) {
  const dark = useIsDark();
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[22px]">From the community</h2>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Real stories. Real people. A kinder, safer space.</p>
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="flex min-h-[44px] shrink-0 items-center gap-1 rounded-full bg-secondary px-4 text-[14px] font-medium text-[color:var(--sc-purple-text)] transition-colors hover:bg-[color:var(--sc-soft-hover)] active:scale-[0.98]"
        >
          See all <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-3">
        {stories.map((story, i) => (
          <StoryCard key={i} story={story} onOpen={onOpenStory} dark={dark} />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-[#ECE6F8] bg-[#F6F2FD] p-3.5 sm:p-4 dark:border-border dark:bg-popover">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary dark:bg-secondary dark:text-secondary-foreground shadow-[0_1px_2px_rgba(23,22,66,0.05)]" aria-hidden="true">
          <MessagesSquare className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug text-foreground">Share your story</div>
          <div className="text-[13px] leading-snug text-muted-foreground">Your experience might help someone today.</div>
        </div>
        <Button className="h-12 shrink-0 gap-1 px-4" onClick={onShare}>
          Share <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

export default React.memo(CommunitySection);
