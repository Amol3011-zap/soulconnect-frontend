import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight, CloudFog, CloudLightning, CloudRain, CloudSun, Flower2, Sprout, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoodCharacter, MoodScene, MOOD_META } from './SoulClimateArt';

/* ─────────────────────────────────────────────────────────────────────────────
   HOME · Soul Climate — a compact card with two states:
     1. not checked in today → pick a mood (3×2) → "Add to your check-in"
     2. checked in           → "Today's Soul Climate" + mood scene + quote
   One check-in per local calendar day (store/weather.js decides).
───────────────────────────────────────────────────────────────────────────── */

const MOODS = ['clear-sky', 'hope', 'blooming', 'fog', 'heavy-rain', 'storm'];

// Per-mood palette: tile tint, card wash after selecting / checking in, icon.
const TONE = {
  'clear-sky':  { tile: 'linear-gradient(160deg,#FFF9DF 0%,#FFF0C2 100%)', wash: 'linear-gradient(160deg,#FFFBEB 0%,#FFF1C4 100%)', ring: '#F3D57A', icon: Sun,            iconColor: '#F2A712' },
  hope:         { tile: 'linear-gradient(160deg,#FFF3E6 0%,#FFE2C7 100%)', wash: 'linear-gradient(160deg,#FFF6EC 0%,#FBE3F0 100%)', ring: '#F5C79B', icon: CloudSun,       iconColor: '#EC8A2E' },
  blooming:     { tile: 'linear-gradient(160deg,#FFF0F6 0%,#FFDDEC 100%)', wash: 'linear-gradient(160deg,#FFF3F8 0%,#FBE0F0 100%)', ring: '#F4B5D2', icon: Flower2,        iconColor: '#E0609F' },
  fog:          { tile: 'linear-gradient(160deg,#F6F4FC 0%,#E9E5F7 100%)', wash: 'linear-gradient(160deg,#F7F6FB 0%,#E8E5F3 100%)', ring: '#D3CCEB', icon: CloudFog,       iconColor: '#8B82B8' },
  'heavy-rain': { tile: 'linear-gradient(160deg,#F1FAEC 0%,#E1F2D8 100%)', wash: 'linear-gradient(160deg,#F2F6FE 0%,#E5E6FA 100%)', ring: '#BFD9EE', icon: CloudRain,      iconColor: '#5C7FD6' },
  storm:        { tile: 'linear-gradient(160deg,#FCFAF7 0%,#F2EEE8 100%)', wash: 'linear-gradient(160deg,#F4F2FC 0%,#E3DFF6 100%)', ring: '#CFC8EC', icon: CloudLightning, iconColor: '#7C6AD6' },
};
const BASE_WASH = 'linear-gradient(160deg,#FFFCF1 0%,#FFF4D6 100%)';
const FADE = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

function SoulClimateCard({ todayMood, tinyStep, onCheckIn, onOpenTinyStep, dark = false }) {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = useCallback(async () => {
    if (saving) return;
    if (!selected) { setError('Pick the mood that feels closest first.'); return; }
    setSaving(true); setError('');
    const res = await onCheckIn(selected);
    setSaving(false);
    if (!res?.ok) setError(res?.message || "Couldn't save your check-in. Please try again.");
  }, [selected, saving, onCheckIn]);

  // Arrow keys move through the mood grid (radiogroup pattern).
  const onGridKey = useCallback((e) => {
    const i = Math.max(0, MOODS.indexOf(selected));
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = MOODS[(i + step + MOODS.length) % MOODS.length];
    setSelected(next);
    e.currentTarget.querySelector(`[data-mood="${next}"]`)?.focus();
  }, [selected]);

  const shown = todayMood || selected;
  const cardStyle = dark
    ? { background: 'hsl(var(--card))' }
    : { background: shown ? TONE[shown].wash : BASE_WASH, borderColor: shown ? TONE[shown].ring : '#F3E3B0' };

  return (
    <section
      aria-label="Soul Climate"
      className="relative mb-6 overflow-hidden rounded-[24px] border border-border p-4 shadow-[0_1px_2px_rgba(120,90,20,0.04),0_8px_24px_rgba(190,150,40,0.10)] transition-[background,border-color] duration-300 dark:shadow-none sm:p-5"
      style={cardStyle}
    >
      <AnimatePresence mode="wait" initial={false}>
        {todayMood ? (
          <motion.div key="done" {...FADE}>
            <CheckedIn mood={todayMood} tinyStep={tinyStep} onOpenTinyStep={onOpenTinyStep} dark={dark} />
          </motion.div>
        ) : (
          <motion.div key="pick" {...FADE}>
            <h2 className="text-[20px] font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[22px]">How are you feeling today?</h2>
            <p className="mt-1 text-[13.5px] text-muted-foreground">Pick what's closest — it shapes today's small steps.</p>

            <div role="radiogroup" aria-label="Today's mood" onKeyDown={onGridKey} className="mt-3.5 grid grid-cols-3 gap-2.5">
              {MOODS.map((id) => {
                const on = selected === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on || (!selected && id === MOODS[0]) ? 0 : -1}
                    data-mood={id}
                    onClick={() => { setSelected(id); setError(''); }}
                    className={cn(
                      'relative flex min-h-[104px] flex-col items-center justify-center gap-0.5 rounded-[18px] border px-1 pb-2 pt-2 transition-[transform,box-shadow,border-color] duration-150 active:scale-[0.97]',
                      on
                        ? 'border-2 border-primary shadow-[0_6px_16px_rgba(128,102,213,0.25)] dark:bg-[rgba(139,92,246,0.14)]'
                        : 'border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(120,90,20,0.06)] dark:border-border dark:bg-muted dark:shadow-none'
                    )}
                    style={dark ? undefined : { background: TONE[id].tile }}
                  >
                    <MoodCharacter mood={id} size={62} />
                    <span className="text-[13.5px] font-semibold leading-tight text-foreground">{MOOD_META[id].label}</span>
                    {on && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white" aria-hidden="true">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Button className="mt-3.5 w-full" onClick={submit} disabled={saving} aria-busy={saving || undefined}>
              {saving ? 'Saving…' : 'Add to your check-in'}
            </Button>
            {error && <p role="alert" className="mt-2 text-center text-[13px] text-destructive">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CheckedIn({ mood, tinyStep, onOpenTinyStep, dark }) {
  const meta = MOOD_META[mood] || MOOD_META['clear-sky'];
  const { icon: Icon, iconColor } = TONE[mood] || TONE['clear-sky'];
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[20px] font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[22px]">Today's Soul Climate</h2>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[rgba(46,158,110,0.25)] bg-white/85 px-2.5 py-1 text-[12.5px] font-semibold text-[color:var(--sc-success-text)] dark:border-[rgba(34,197,94,0.3)] dark:bg-[color:var(--sc-success-bg)]">
          Checked in <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,46%)_minmax(0,1fr)] items-center gap-3">
        <div className="h-[132px] overflow-hidden rounded-[18px] sm:h-[148px]">
          <MoodScene mood={mood} dark={dark} />
        </div>
        <div className="min-w-0 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Icon className="h-6 w-6 shrink-0" style={{ color: iconColor }} strokeWidth={2} aria-hidden="true" />
            <span className="text-[24px] font-bold leading-none tracking-[-0.01em] text-foreground sm:text-[26px]">{meta.label}</span>
          </div>
          <p className="mt-2.5 text-[15px] font-medium leading-snug text-foreground/90">“{meta.quote}”</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenTinyStep}
        className="mt-3 flex min-h-[56px] w-full items-center gap-3 rounded-[16px] border border-white/80 bg-white/75 p-3 text-left shadow-[0_1px_3px_rgba(120,90,20,0.06)] transition-transform active:scale-[0.99] dark:border-border dark:bg-muted dark:shadow-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--sc-success-bg)] text-[color:var(--sc-success)]" aria-hidden="true">
          <Sprout className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-foreground">Today's tiny step</span>
          <span className="block truncate text-[13px] text-muted-foreground">{tinyStep}</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-[0_1px_4px_rgba(23,22,66,0.1)] dark:bg-card" aria-hidden="true">
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </button>
    </>
  );
}

export default React.memo(SoulClimateCard);
