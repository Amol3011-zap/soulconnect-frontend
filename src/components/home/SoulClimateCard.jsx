import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronRight, CloudFog, CloudLightning, CloudRain, CloudSun, Flower2, Sprout, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoodCharacter, MoodScene, MOOD_META } from './SoulClimateArt';
import { useAuthStore } from '../../store/auth';
import { WEATHER_TO_MOOD, avatarSrc, currentAvatarId, saveAvatar, isFeltAvatar } from '../../data/avatars';
import AvatarPicker from '../AvatarPicker';
import feltAmazing from '../../assets/mood/mood-amazing.png';
import feltGood from '../../assets/mood/mood-good.png';
import feltOkay from '../../assets/mood/mood-okay.png';
import feltNotGood from '../../assets/mood/mood-notgood.png';
import feltAwful from '../../assets/mood/mood-awful.png';

// New felt-avatar faces (added alongside the original illustrated
// MoodCharacter/MoodScene system below, which stays fully intact and is
// still used for the post-check-in "Today's Soul Climate" scene, and as a
// fallback here for any weather mood without a felt image).
const WEATHER_TO_FELT = {
  'clear-sky':  feltAmazing,
  blooming:     feltAmazing,
  hope:         feltGood,
  fog:          feltOkay,
  'heavy-rain': feltNotGood,
  storm:        feltAwful,
};

// The person's own avatar (if they picked one) wearing the mood of this weather.
function useMyAvatar() {
  const user = useAuthStore((s) => s.user);
  return currentAvatarId(user);
}
function MoodFace({ mood, avatarId, size }) {
  // Felt avatars take priority in this picker grid now (per request); the
  // personalized "Choose your look" avatar still drives the post-check-in
  // "Today's Soul Climate" scene and the rest of the app untouched (see
  // CheckedIn below, which calls avatarSrc directly and never goes through
  // this component).
  const felt = WEATHER_TO_FELT[mood];
  if (felt) {
    return <img src={felt} alt="" width={size} height={size} draggable="false"
      className="block object-contain" style={{ width: size, height: size }} />;
  }
  if (avatarId) {
    return <img src={avatarSrc(avatarId, WEATHER_TO_MOOD[mood])} alt="" width={size} height={size} draggable="false"
      className="block rounded-[16px] shadow-[0_2px_8px_rgba(60,40,110,0.15)]" style={{ width: size, height: size }} />;
  }
  return <MoodCharacter mood={mood} size={size} />;
}
const FLOAT_CSS = `@keyframes scAvBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
.sc-av-breathe{animation:scAvBreathe 5s ease-in-out infinite;transform-origin:50% 60%}
@media (prefers-reduced-motion:reduce){.sc-av-breathe{animation:none}}`;

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

// Dark mode keeps the mood colour instead of falling back to the plain card.
// Same hue as the light wash, dropped in lightness so white text still reads
// and the card does not glare at 3am.
const DARK_TONE = {
  'clear-sky':  { tile: 'linear-gradient(160deg,#3B3218 0%,#2F2812 100%)', wash: 'linear-gradient(160deg,#3B3218 0%,#312813 100%)', ring: '#6E5C2A' },
  hope:         { tile: 'linear-gradient(160deg,#412B1B 0%,#352135 100%)', wash: 'linear-gradient(160deg,#412B1B 0%,#3A2234 100%)', ring: '#7C5637' },
  blooming:     { tile: 'linear-gradient(160deg,#3E2031 0%,#36203B 100%)', wash: 'linear-gradient(160deg,#3E2031 0%,#36203B 100%)', ring: '#7E4067' },
  fog:          { tile: 'linear-gradient(160deg,#2C2845 0%,#262243 100%)', wash: 'linear-gradient(160deg,#2C2845 0%,#262243 100%)', ring: '#514A7A' },
  'heavy-rain': { tile: 'linear-gradient(160deg,#202B49 0%,#232149 100%)', wash: 'linear-gradient(160deg,#202B49 0%,#232149 100%)', ring: '#405691' },
  storm:        { tile: 'linear-gradient(160deg,#2D2551 0%,#262051 100%)', wash: 'linear-gradient(160deg,#2D2551 0%,#262051 100%)', ring: '#5A4D98' },
};
const DARK_BASE_WASH = 'linear-gradient(160deg,#302A1A 0%,#272214 100%)';
const FADE = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

function SoulClimateCard({ todayMood, tinyStep, onCheckIn, onOpenTinyStep, dark = false }) {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const avatarId = useMyAvatar();

  const submit = useCallback(async () => {
    if (saving) return;
    if (!selected) { setError('Pick the mood that feels closest first.'); return; }
    setSaving(true); setError('');
    const res = await onCheckIn(selected);
    setSaving(false);
    // Keep the profile avatar's mood in step with today's check-in.
    if (res?.ok && avatarId && WEATHER_TO_MOOD[selected]) saveAvatar(avatarId, WEATHER_TO_MOOD[selected]);
    if (!res?.ok) setError(res?.message || "Couldn't save your check-in. Please try again.");
  }, [selected, saving, onCheckIn, avatarId]);

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
  const palette = dark ? DARK_TONE : TONE;
  const cardStyle = {
    background: shown ? palette[shown].wash : (dark ? DARK_BASE_WASH : BASE_WASH),
    borderColor: shown ? palette[shown].ring : (dark ? '#3C3526' : '#F3E3B0'),
  };

  return (
    <section
      aria-label="Soul Climate"
      className="relative mb-6 overflow-hidden rounded-[24px] border border-border p-4 shadow-[0_1px_2px_rgba(120,90,20,0.04),0_8px_24px_rgba(190,150,40,0.10)] transition-[background,border-color] duration-300 dark:shadow-none sm:p-5"
      style={cardStyle}
    >
      <AnimatePresence mode="wait" initial={false}>
        {todayMood ? (
          <motion.div key="done" {...FADE}>
            <CheckedIn mood={todayMood} tinyStep={tinyStep} onOpenTinyStep={onOpenTinyStep} dark={dark} avatarId={avatarId} />
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
                    style={{ background: palette[id].tile }}
                  >
                    <MoodFace mood={id} avatarId={avatarId} size={62} />
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

function CheckedIn({ mood, tinyStep, onOpenTinyStep, dark, avatarId }) {
  const meta = MOOD_META[mood] || MOOD_META['clear-sky'];
  const [pickerOpen, setPickerOpen] = useState(false);
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
        <div className="relative h-[132px] overflow-hidden rounded-[18px] sm:h-[148px]">
          {(avatarId && isFeltAvatar(avatarId)) || (!avatarId && WEATHER_TO_FELT[mood]) ? (
            <button type="button" onClick={() => setPickerOpen(true)} aria-label="Change your avatar"
              className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] border-0 bg-transparent p-0">
              <MoodScene mood={mood} dark={dark} />
              <img src={avatarId ? avatarSrc(avatarId) : WEATHER_TO_FELT[mood]} alt={avatarId ? 'Your avatar today' : ''} draggable="false"
                className="absolute h-[62%] w-[62%] object-contain drop-shadow-[0_6px_14px_rgba(60,40,110,0.25)]" />
            </button>
          ) : avatarId ? (
            <>
              <style>{FLOAT_CSS}</style>
              <button type="button" onClick={() => setPickerOpen(true)} aria-label="Change your avatar"
                className="absolute inset-0 block h-full w-full overflow-hidden rounded-[18px] p-0">
                <img src={avatarSrc(avatarId, WEATHER_TO_MOOD[mood])} alt="Your avatar today" draggable="false"
                  className="sc-av-breathe block h-full w-full object-cover" style={{ objectPosition: '50% 38%' }} />
              </button>
            </>
          ) : (
            <>
              <MoodScene mood={mood} dark={dark} />
              <button type="button" onClick={() => setPickerOpen(true)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-primary shadow-[0_2px_8px_rgba(60,40,110,0.15)]">
                Use my avatar
              </button>
            </>
          )}
        </div>
        <AvatarPicker open={pickerOpen} current={avatarId} currentMood={WEATHER_TO_MOOD[mood] || 'calm'}
          onClose={() => setPickerOpen(false)} />
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
        className="mt-3 flex min-h-[56px] w-full items-center gap-3 rounded-[16px] border border-white/80 bg-white/75 p-3 text-left shadow-[0_1px_3px_rgba(120,90,20,0.06)] transition-transform active:scale-[0.99] dark:border-white/15 dark:bg-white/10 dark:shadow-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--sc-success-bg)] text-[color:var(--sc-success)]" aria-hidden="true">
          <Sprout className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-foreground">Today's tiny step</span>
          <span className="block truncate text-[13px] text-muted-foreground">{tinyStep}</span>
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-[0_1px_4px_rgba(23,22,66,0.1)] dark:bg-white/15" aria-hidden="true">
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </button>
    </>
  );
}

export default React.memo(SoulClimateCard);
