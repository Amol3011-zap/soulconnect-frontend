import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useMoodData, MOODS_5, EMOTION_TAGS } from '../hooks/useMoodData';
import MoodSelector from '../components/mood/MoodSelector';
import MoodStats from '../components/mood/MoodStats';
import MoodBreakdown from '../components/mood/MoodBreakdown';
import RecentEntries from '../components/mood/RecentEntries';
import ErrorToast from '../components/ErrorToast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   SOUL CLIMATE (/mood) — migrated to the shadcn foundation (2026-09-24).
   Data and behaviour are unchanged: everything still comes from useMoodData
   (local, per-device store). Only the visual layer moved to @/components/ui.
   Mobile (single column): check-in → stats → 7-day chart → insights →
   breakdown → recent entries. Desktop ≥1024px: two columns via grid areas.
───────────────────────────────────────────────────────────────────────────── */

// ── 7-day mood chart (same maths as before, light colours) ─────────────────
function MoodChart({ last7Days }) {
  const days = 7;
  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  const labels = dates.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3));
  const values = dates.map(d => last7Days.find(e => e.date === d)?.mood || null);

  const emojis = { 1: '😭', 3: '😔', 5: '😐', 7: '🙂', 9: '😁' };
  const W = 460, H = 110, px = 24, py = 14;
  const xS = (W - 2 * px) / (days - 1);
  const yR = H - 2 * py;
  const coords = values.map((v, i) => (v != null ? { x: px + i * xS, y: py + yR - ((v - 1) / 9) * yR, v } : null));
  const valid = coords.filter(Boolean);
  const pathD = valid.length >= 2
    ? valid.map((p, i) => {
        if (i === 0) return `M${p.x},${p.y}`;
        const prev = valid[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
      }).join(' ')
    : '';
  const areaD = valid.length >= 2
    ? `${pathD} L${valid[valid.length - 1].x},${H - py} L${valid[0].x},${H - py} Z`
    : '';

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-[18px] font-semibold text-foreground">Your last 7 days</h2>
      <p className="mb-3 mt-1 text-[13px] text-muted-foreground">
        {valid.length ? 'How your check-ins have moved this week.' : 'Check in on a few days to see your pattern.'}
      </p>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} className="block overflow-visible" role="img" aria-label="Mood over the last 7 days">
        <defs>
          <linearGradient id="scMoodArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8066D5" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#8066D5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[3, 5, 7, 9].map(v => {
          const y = py + yR - ((v - 1) / 9) * yR;
          return <line key={v} x1={px} y1={y} x2={W - px} y2={y} stroke="var(--sc-surface)" strokeWidth="1" />;
        })}
        {areaD && <path d={areaD} fill="url(#scMoodArea)" />}
        {pathD && <path d={pathD} fill="none" stroke="#8066D5" strokeWidth="2.5" strokeLinecap="round" />}
        {coords.map((p, i) =>
          p ? (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#8066D5" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 13} textAnchor="middle" fontSize="12">{emojis[p.v] || ''}</text>
            </g>
          ) : (
            <circle key={i} cx={px + i * xS} cy={H / 2} r="3" fill="var(--sc-border)" />
          )
        )}
        {labels.map((l, i) => (
          <text key={i} x={px + i * xS} y={H + 18} textAnchor="middle" fontSize="12" fontWeight="500" fill="var(--sc-text-2)">{l}</text>
        ))}
      </svg>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function MoodTracker() {
  const moodData = useMoodData();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Mood data is local (useMoodData reads the on-device store synchronously),
  // so there is nothing to wait for. The previous version faked a 400ms
  // "loading" delay, which flashed a skeleton on every visit to this tab.
  const [loading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveAndRefresh = useCallback(async () => {
    try {
      await moodData.handleSave();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error saving mood:', err);
      setError('Failed to save mood. Please try again.');
    }
  }, [moodData]);

  const openLog = useCallback(() => { setModalStep(1); setShowModal(true); }, []);

  const totalEntries = Object.keys(moodData.store).filter(k => moodData.store[k]?.mood).length;

  // Error state (light, in-flow — the app shell stays mounted around it)
  if (error) {
    return (
      <>
        <ErrorToast message={error} onRetry={() => window.location.reload()} onDismiss={() => setError('')} />
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-center text-base text-muted-foreground">Unable to load Soul Climate. Please try again.</p>
        </div>
      </>
    );
  }

  // Loading: page-shaped skeleton, no full-screen spinner
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-5 sm:px-8">
        <Skeleton className="h-48 w-full rounded-[20px]" />
        <Skeleton className="h-28 w-full rounded-[20px]" />
        <Skeleton className="h-44 w-full rounded-[20px]" />
      </div>
    );
  }

  // Back / Next row shared by dialog steps 2–7 (render helper, not a component)
  const stepNav = (back, onNext, nextLabel = 'Next') => (
    <div className="mt-2 flex gap-3">
      <Button variant="secondary" className="flex-1" onClick={() => setModalStep(back)}>Back</Button>
      <Button className="flex-1" onClick={onNext}>{nextLabel}</Button>
    </div>
  );

  // Range step (energy / stress / sleep / water) — same state setters as before
  const rangeStep = ({ title, value, min, max, onChange, back, next }) => (
    <>
      <DialogTitle>{title}</DialogTitle>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="my-4 h-12 w-full cursor-pointer accent-[#8066D5]"
        aria-label={title}
      />
      {stepNav(back, () => setModalStep(next))}
    </>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-5 sm:px-8 sm:pt-8">
      <style>{`
        .sc-climate { display: grid; gap: 16px;
          grid-template-areas: "checkin" "stats" "chart" "insights" "breakdown" "recent"; }
        .sc-climate > [data-area] { min-width: 0; }
        @media (min-width: 1024px) {
          .sc-climate { gap: 20px; align-items: start;
            grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
            grid-template-areas: "checkin stats" "chart insights" "recent breakdown"; }
        }
      `}</style>

      {/* Desktop page header (on mobile the shared top bar already says "Soul Climate") */}
      <div className="mb-5 hidden items-end justify-between gap-4 min-[769px]:flex">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.01em] text-foreground">Soul Climate</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">Notice how you feel, day by day.</p>
        </div>
        <Button onClick={openLog}><Plus /> Log mood</Button>
      </div>

      <div className="sc-climate">
        <div data-area style={{ gridArea: 'checkin' }}>
          <MoodSelector
            mood={moodData.mood}
            onMoodSelect={moodData.handleMoodSelect}
            todayMoodMeta={moodData.todayMoodMeta}
            onAddDetails={openLog}
          />
        </div>

        <div data-area style={{ gridArea: 'stats' }}>
          <MoodStats
            streak={moodData.streak}
            longestStreak={moodData.longestStreak}
            wellnessScore={moodData.wellnessScore}
            totalEntries={totalEntries}
          />
        </div>

        <div data-area style={{ gridArea: 'chart' }}>
          <MoodChart last7Days={moodData.last7Days} />
        </div>

        <div data-area style={{ gridArea: 'insights' }}>
          <Card className="p-4 sm:p-5">
            <h2 className="mb-2 text-[18px] font-semibold text-foreground">Your insights</h2>
            <ul className="divide-y divide-border">
              {moodData.insights.slice(0, 3).map((insight, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5">
                  <span className="text-[20px] leading-none" aria-hidden="true">{insight.emoji}</span>
                  <p className="text-[14px] leading-relaxed text-foreground">{insight.text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div data-area style={{ gridArea: 'breakdown' }} key={refreshTrigger}>
          <MoodBreakdown moodBreakdown={moodData.moodBreakdown} />
        </div>

        <div data-area style={{ gridArea: 'recent' }}>
          <RecentEntries allEntries={moodData.allEntries} onDelete={moodData.handleDeleteEntry} />
        </div>
      </div>

      {/* ═══ LOG MOOD — 7 steps, same flow and state as before ═══ */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--sc-purple-text)]">
              Step {modalStep} of 7
            </DialogDescription>
            <Progress value={(modalStep / 7) * 100} aria-label="Log mood progress" />
          </DialogHeader>

          {modalStep === 1 && (
            <>
              <DialogTitle>How are you feeling?</DialogTitle>
              <div className="grid grid-cols-2 gap-2">
                {MOODS_5.map(m => (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => { moodData.handleMoodSelect(m.score); setModalStep(2); }}
                    className={cn(
                      'flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 transition-colors active:scale-[0.98]',
                      moodData.mood === m.score ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-muted'
                    )}
                  >
                    <span className="text-[28px] leading-none" aria-hidden="true">{m.emoji}</span>
                    <span className="text-[14px] font-medium text-foreground">{m.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {modalStep === 2 && (
            <>
              <DialogTitle>What emotions are there?</DialogTitle>
              <div className="flex flex-wrap gap-2">
                {EMOTION_TAGS.map(tag => {
                  const on = moodData.emotions.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => moodData.handleEmotion(tag.id)}
                      className={cn(
                        'flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition-colors',
                        on ? 'border-primary bg-secondary text-[color:var(--sc-purple-deep)]' : 'border-border bg-card text-foreground hover:bg-muted'
                      )}
                    >
                      <span aria-hidden="true">{tag.emoji}</span>{tag.label}
                    </button>
                  );
                })}
              </div>
              {stepNav(1, () => setModalStep(3))}
            </>
          )}

          {modalStep === 3 && rangeStep({ title: `Energy level: ${moodData.energy}/10`, value: moodData.energy, min: 1, max: 10, onChange: moodData.setEnergy, back: 2, next: 4 })}
          {modalStep === 4 && rangeStep({ title: `Stress level: ${moodData.stress}/10`, value: moodData.stress, min: 1, max: 10, onChange: moodData.setStress, back: 3, next: 5 })}
          {modalStep === 5 && rangeStep({ title: `Sleep: ${moodData.sleepHours} hours`, value: moodData.sleepHours, min: 0, max: 12, onChange: moodData.setSleepHours, back: 4, next: 6 })}
          {modalStep === 6 && rangeStep({ title: `Water: ${moodData.waterIntake} glasses`, value: moodData.waterIntake, min: 0, max: 8, onChange: moodData.setWaterIntake, back: 5, next: 7 })}

          {modalStep === 7 && (
            <>
              <DialogTitle>Anything on your mind?</DialogTitle>
              <textarea
                value={moodData.reflection}
                onChange={e => moodData.setReflection(e.target.value)}
                placeholder="What's on your mind today? Share your thoughts..."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-input bg-card p-3.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {stepNav(6, async () => { await handleSaveAndRefresh(); setShowModal(false); }, moodData.saved ? 'Saved' : 'Save entry')}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
