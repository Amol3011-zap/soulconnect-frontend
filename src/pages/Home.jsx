import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { useTinyWinsStore } from '../store/tinyWins';
import ErrorToast from '../components/ErrorToast';
import { Search, Bell, Heart, MessageCircle, Video, ChevronRight, ArrowRight, Check } from 'lucide-react';
import AICompanionCard from '../components/AICompanionCard';
import AIInsightCard from '../components/AIInsightCard';
import FloatingCompanion from '../components/FloatingCompanion';
import TodaysReflectionModal from '../components/TodaysReflectionModal';
import ProgressModal from '../components/ProgressModal';
import WeeklyInsightsModal from '../components/WeeklyInsightsModal';
import SearchModal from '../components/SearchModal';
import NotificationDropdown from '../components/NotificationDropdown';
import EmotionWeatherModal from '../components/emotional-weather/EmotionWeatherModal';
import GlobalPulseCard from '../components/dashboard/GlobalPulseCard';
import { useReflections } from '../hooks/useReflections';
import { getSoulMatches } from '../components/soulmatch/soulmatchData';
import BreathingSession from '../components/BreathingSession';
import OnboardingModal from '../components/OnboardingModal';
import { onboardingAPI } from '../services/api';

import HomeTinyWinCard from '../components/home/HomeTinyWinCard';
import ReflectionToast from '../components/home/ReflectionToast';
import PeopleWhoUnderstandCard from '../components/home/PeopleWhoUnderstandCard';
import TodaysFocusChecklistCard from '../components/home/TodaysFocusChecklistCard';
import { WEATHER_OPTIONS } from '../components/home/homeStyles';
import LotusMark from '../components/LotusMark';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { STORIES } from '../components/home/storiesData';

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { todayEntry, submitWeather, showModal } = useWeatherStore();
  const {
    dailyWins, completedToday, checkAndRefresh, completeWin,
    totalWins, showReflection, reflectionText, dismissReflection,
    getWeeklyStats,
  } = useTinyWinsStore();

  const userId    = user?.id || user?.user_id || 1;
  const firstName = user?.name?.split(' ')[0] || 'Friend';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingDone, setBreathingDone] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState(todayEntry?.weather || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);

  // Today's Reflection modal
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [reflectionSavedToast, setReflectionSavedToast] = useState(false);
  const { todayReflection, saveReflection, isExisting } = useReflections();

  // Companion modals
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [weeklyInsightsOpen, setWeeklyInsightsOpen] = useState(false);

  // Search + Notifications
  const [searchOpen, setSearchOpen]   = useState(false);
  const [notifOpen,  setNotifOpen]    = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const bellRef = useRef(null);

  // Ref for "Continue Journey" smooth scroll to Today's Focus card
  const todaysFocusRef = useRef(null);

  // Check if user completed onboarding and initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        // Check localStorage first (fast path)
        const onboardingDone = localStorage.getItem('onboarding-completed');
        if (onboardingDone === 'true') {
          setShowOnboarding(false);
          setLoading(false);
          return;
        }

        // Check API
        try {
          const res = await onboardingAPI.getStatus();
          if (res.data.completed) {
            localStorage.setItem('onboarding-completed', 'true');
            setShowOnboarding(false);
          } else {
            setShowOnboarding(true);
          }
        } catch (err) {
          // If API fails, don't show onboarding (user likely already completed it)
          setShowOnboarding(false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load dashboard. Please refresh.');
        setLoading(false);
      }
    };
    initializeDashboard();
  }, []);

  function handleReflectionSaved() {
    setReflectionSavedToast(true);
    setTimeout(() => setReflectionSavedToast(false), 4000);
  }

  // Initialize Tiny Wins for today
  useEffect(() => {
    const weatherId = todayEntry?.weather || 'clear-sky';
    checkAndRefresh(weatherId);
  }, [todayEntry?.weather]);

  // Load SoulMatches
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await getSoulMatches({});
        setMatches(res.matches?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error loading matches:', err);
      }
    };
    loadMatches();
  }, []);

  // Sync selectedWeather with todayEntry when it updates
  useEffect(() => {
    if (todayEntry?.weather) {
      setSelectedWeather(todayEntry.weather);
    }
  }, [todayEntry?.weather]);

  const handleWeatherSelect = useCallback((id) => {
    setSelectedWeather(id);
    submitWeather(id, userId);
  }, [userId, submitWeather]);

  const handleCheckIn = useCallback(() => {
    useWeatherStore.setState({ showModal: true });
  }, []);

  const weeklyStats = getWeeklyStats();
  const completedCount = completedToday.length;
  const allDone = completedCount >= 3 && dailyWins.length > 0;


  // Section header used by every Home block: 18px title + optional "See all".
  // A plain render helper, not a nested component, so React never remounts it.
  const sectionHeader = ({ title, sub, to, right }) => (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[18px] font-semibold leading-tight text-foreground">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] text-muted-foreground">{sub}</p>}
      </div>
      {right}
      {to && (
        <button
          type="button"
          onClick={() => navigate(to)}
          className="-mr-2 flex min-h-[44px] shrink-0 items-center gap-0.5 rounded-full px-2 text-sm font-semibold text-primary hover:bg-secondary"
        >
          See all <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  // Handle error state (light, in-flow; the shell stays mounted around it)
  if (error) {
    return (
      <>
        <ErrorToast
          message={error}
          onRetry={() => window.location.reload()}
          onDismiss={() => setError('')}
        />
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <p className="text-center text-base text-muted-foreground">Unable to load your home. Please try again.</p>
        </div>
      </>
    );
  }

  // Loading: page-shaped skeleton, no full-screen spinner
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-5 sm:px-8">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-44 w-full rounded-[20px]" />
        <Skeleton className="h-40 w-full rounded-[20px]" />
      </div>
    );
  }

  // Check-in card tint per weather — soft versions of the original Soul
  // Climate gradients (sun = warm yellow, hope = lavender→peach, etc.),
  // kept light so text stays readable on the light theme.
  const WEATHER_TINT = {
    'clear-sky':  { bg: 'linear-gradient(160deg, #FFF7D6 0%, #FDE68A 55%, #FBBF24 100%)', accent: '#F59E0B', ink: '#92400E' },
    'hope':       { bg: 'linear-gradient(160deg, #EDE4FF 0%, #F3D9FF 45%, #FFD3B0 100%)', accent: '#C084FC', ink: '#6B21A8' },
    'blooming':   { bg: 'linear-gradient(160deg, #FFE4F1 0%, #FBCFE8 55%, #F4A5CF 100%)', accent: '#EC4899', ink: '#9D174D' },
    'fog':        { bg: 'linear-gradient(160deg, #F3F4F6 0%, #E5E7EB 55%, #C9CDD4 100%)', accent: '#9CA3AF', ink: '#374151' },
    'heavy-rain': { bg: 'linear-gradient(160deg, #E0EDFF 0%, #BFDBFE 55%, #93C5FD 100%)', accent: '#3B82F6', ink: '#1E40AF' },
    'storm':      { bg: 'linear-gradient(160deg, #EDE7FF 0%, #D6CAFB 55%, #B9A4F5 100%)', accent: '#7C3AED', ink: '#4C1D95' },
  };
  // Gloss: a white sheen over the top of the card (extra background layer,
  // no extra DOM), a bright top edge and a soft shadow in the weather colour.
  const glossy = (t) => ({
    background: `linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.18) 38%, rgba(255,255,255,0) 60%), ${t.bg}`,
    borderColor: 'rgba(255,255,255,0.9)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 ${t.accent}33, 0 10px 28px ${t.accent}40, 0 2px 6px ${t.accent}26`,
  });
  const tint = selectedWeather ? WEATHER_TINT[selectedWeather] : null;

  // Featured professional for the Home "Support when you need it" card.
  // PLACEHOLDER content specified by the design brief — not a real record.
  // Replace with the first result of healerAPI.listHealers() before launch
  // (frontend/AGENTS.md: no fake therapists in production).
  const FEATURED_PROFESSIONAL = {
    name: 'Dr. Ananya Sharma',
    role: 'Therapist',
    experience: '6+ years',
    tags: ['Anxiety', 'Self-Doubt'],
    photo: null,
    initials: 'AS',
  };

  return (
    <>
      <style>{`
        .home-main { margin-right: 300px; }
        .home-right-sidebar {
          position: fixed; right: 0; top: 0; bottom: 0; width: 300px;
          background: #FFFFFF;
          border-left: 1px solid #E7E3EF;
          display: flex; flex-direction: column; gap: 12px;
          padding: 24px 16px 20px;
          z-index: 50;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        @media (max-width: 1100px) {
          .home-right-sidebar { display: none; }
          .home-main { margin-right: 0; }
        }
        @media (max-width: 768px) {
          .home-desktop-only { display: none !important; }
        }
      `}</style>

      {/* ── Breathing overlay ── */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingSession
            onClose={() => setShowBreathing(false)}
            onComplete={() => { setBreathingDone(true); setShowBreathing(false); }}
          />
        )}
      </AnimatePresence>

      {/* ── Tiny Wins reflection toast ── */}
      <AnimatePresence>
        {showReflection && (
          <ReflectionToast key="reflection" text={reflectionText} onDismiss={dismissReflection} />
        )}
      </AnimatePresence>

      {/* ── Reflection saved success toast ── */}
      <AnimatePresence>
        {reflectionSavedToast && (
          <ReflectionToast
            key="refl-saved"
            text="Reflection saved. Keep showing up for yourself."
            onDismiss={() => setReflectionSavedToast(false)}
          />
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {showModal && <EmotionWeatherModal />}
      </AnimatePresence>

      <TodaysReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSaved={handleReflectionSaved}
        saveReflection={saveReflection}
        initialValue={todayReflection}
        isExisting={isExisting}
        userName={firstName}
        winsToday={completedToday.length}
        hasCheckedIn={Boolean(todayEntry)}
      />

      <ProgressModal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        streak={todayEntry ? 4 : 0}
        totalWins={totalWins}
        winsToday={completedCount}
        storiesCount={0}
        daysActive={todayEntry ? 4 : 1}
        currentWeather={selectedWeather}
      />

      <WeeklyInsightsModal
        isOpen={weeklyInsightsOpen}
        onClose={() => setWeeklyInsightsOpen(false)}
        weeklyStats={weeklyStats}
        checkInsThisWeek={todayEntry ? 4 : 0}
        storiesThisWeek={0}
      />

      {/* ════════════════════ MAIN CONTENT ════════════════════ */}
      <div className="home-main">
        <div className="mx-auto max-w-3xl px-4 pb-[120px] pt-5 sm:px-8 sm:pt-8 min-[769px]:pb-8">

          {/* 1 · Greeting (the brand + bell live in the shared top bar on mobile) */}
          <header className="relative mb-5 flex items-start justify-between gap-3">
            <LotusMark size={132} className="absolute -right-3 -top-7 opacity-60 sm:hidden" />
            <div className="relative min-w-0">
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[28px]">
                {greeting}, {firstName}
              </h1>
              <p className="mt-1 text-[15px] text-muted-foreground">Take a deep breath. You've got this.</p>
            </div>
            <div className="home-desktop-only relative flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="!h-5 !w-5" />
              </Button>
              <div ref={bellRef} className="relative">
                <Button variant="ghost" size="icon" onClick={() => setNotifOpen(prev => !prev)} aria-label="Notifications" aria-expanded={notifOpen}>
                  <Bell className="!h-5 !w-5" />
                </Button>
                <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} anchorRef={bellRef} />
              </div>
            </div>
          </header>

          {/* 2 · Check-in — compact, immediately actionable */}
          <Card
            className="relative mb-6 p-4 transition-[background,box-shadow] duration-300 sm:p-5"
            style={tint ? glossy(tint) : undefined}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[18px] font-semibold leading-tight text-foreground">How are you feeling today?</h2>
              {selectedWeather && (
                <Badge className="shrink-0 whitespace-nowrap" style={tint ? { background: 'rgba(255,255,255,0.75)', color: tint.ink } : undefined}>Checked in</Badge>
              )}
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">Pick what's closest — it shapes today's small steps.</p>
            <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Today's mood">
              {WEATHER_OPTIONS.map((o) => {
                const on = selectedWeather === o.id;
                const t = WEATHER_TINT[o.id];
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => handleWeatherSelect(o.id)}
                    className={cn(
                      'flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl border px-1 text-[13px] font-medium leading-tight transition-colors duration-150 active:scale-[0.98]',
                      on ? 'border-2' : 'border-border bg-card/80 text-foreground hover:bg-muted'
                    )}
                    style={on && t
                      ? { borderColor: t.accent, background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.8) 100%)', color: t.ink, boxShadow: `0 4px 12px ${t.accent}40, inset 0 1px 0 #FFFFFF` }
                      : tint ? { background: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.8)' } : undefined}
                  >
                    <span aria-hidden="true" className="text-base leading-none">{o.emoji}</span>
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
            <Button className="mt-3 w-full" onClick={handleCheckIn}>
              {selectedWeather ? 'Add to your check-in' : 'Check in'}
            </Button>
          </Card>

          {/* 3 · People who understand */}
          <section className="mb-6">
            {sectionHeader({ title: 'People who understand', sub: 'Going through something similar', to: '/matches' })}
            {matches.length > 0 ? (
              <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&>*]:snap-start">
                {matches.map((match, i) => (
                  <PeopleWhoUnderstandCard key={match.id || i} match={match} index={i} onConnect={() => navigate('/matches')} />
                ))}
              </div>
            ) : (
              <Card className="flex items-center gap-3 p-4">
                <Skeleton className="h-11 w-11 rounded-full" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-2/3" /></div>
              </Card>
            )}
          </section>

          {/* 4 · Today's small step (Tiny Wins) */}
          <section className="mb-6">
            {sectionHeader({ title: "Today's small step", to: '/tiny-wins' })}
            <Card className="p-2">
              {dailyWins.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 px-3 pb-1 pt-2">
                    <Progress value={(completedCount / Math.max(dailyWins.length, 1)) * 100} className="flex-1" aria-label="Tiny wins completed today" />
                    <span className="shrink-0 text-[13px] font-medium text-muted-foreground">{completedCount} / {dailyWins.length} today</span>
                  </div>
                  {dailyWins.map((win) => (
                    <HomeTinyWinCard key={win.id} win={win} isCompleted={completedToday.includes(win.id)} onComplete={completeWin} />
                  ))}
                  {allDone && (
                    <p className="px-3 pb-2 pt-1 text-[13px] text-[#1F7A55]">All done for today — that's real progress.</p>
                  )}
                </>
              ) : (
                <div className="space-y-2 p-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              )}
            </Card>
          </section>

          {/* 5 · From the community */}
          <section className="mb-6">
            {sectionHeader({ title: 'From the community', to: '/stories' })}
            <Card className="divide-y divide-border overflow-hidden">
              {STORIES.map((story, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate('/stories')}
                  className="block w-full px-4 py-3.5 text-left transition-colors hover:bg-muted active:bg-muted"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <Badge variant="outline" style={{ color: story.tagColor, borderColor: `${story.tagColor}55` }}>{story.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{story.time}</span>
                  </div>
                  <p className="line-clamp-2 text-[15px] leading-snug text-foreground">{story.preview}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{story.name}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {story.hearts}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {story.comments}</span>
                  </div>
                </button>
              ))}
            </Card>
          </section>

          {/* 6 · Support when you need it (professionals) */}
          <section>
            {sectionHeader({
              title: 'Support when you need it',
              sub: "Connect with verified professionals who understand what you're going through.",
              to: '/professionals',
            })}
            <Card className="flex items-center gap-2.5 p-3 sm:gap-4 sm:p-4">
              <div className="relative shrink-0">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                  {FEATURED_PROFESSIONAL.photo && <AvatarImage src={FEATURED_PROFESSIONAL.photo} alt="" />}
                  <AvatarFallback className="bg-[#EFEAFB] text-[17px] text-[#5E47B8]">{FEATURED_PROFESSIONAL.initials}</AvatarFallback>
                </Avatar>
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#2E9E6E] text-white"
                  aria-label="Verified professional"
                  role="img"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold leading-snug text-foreground sm:text-[16px]">{FEATURED_PROFESSIONAL.name}</div>
                <div className="truncate text-[13px] text-muted-foreground">{FEATURED_PROFESSIONAL.role} · {FEATURED_PROFESSIONAL.experience}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {FEATURED_PROFESSIONAL.tags.map(t => <Badge key={t} className="px-2 py-0.5 text-[11px] sm:text-[11.5px]">{t}</Badge>)}
                </div>
              </div>
              <Button
                variant="soft"
                className="h-12 shrink-0 gap-0.5 px-3 text-[13px] sm:gap-1 sm:px-5 sm:text-[14px] [&_svg]:!size-3.5 sm:[&_svg]:!size-4"
                onClick={() => navigate('/professionals')}
              >
                View profile <ArrowRight />
              </Button>
            </Card>
          </section>
        </div>
      </div>

      {/* ════════════════════ RIGHT SIDEBAR (desktop ≥1100px) ════════════════════ */}
      <aside className="home-right-sidebar" aria-label="Today">
        <div ref={todaysFocusRef}>
          <TodaysFocusChecklistCard onStart={() => setShowBreathing(true)} />
        </div>

        <GlobalPulseCard />

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Upcoming session</span>
            <button type="button" onClick={() => navigate('/professionals')} className="text-sm font-semibold text-primary">View all</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-base font-semibold text-[#4B3699]">M</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">Dr. Meera Sharma</div>
              <div className="text-xs text-muted-foreground">Clinical Psychologist</div>
              <div className="text-xs text-muted-foreground">Tomorrow, 11:00 AM</div>
            </div>
            <Button size="icon" className="h-10 w-10" onClick={() => navigate('/professionals')} aria-label="Join video session">
              <Video />
            </Button>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-[#FAF7F2] p-5 text-center">
          <LotusMark size={72} className="mx-auto mb-1" />
          <p className="text-sm italic leading-relaxed text-foreground">"Healing is not a destination, it's a journey."</p>
        </Card>
      </aside>

      <FloatingCompanion
        onReflection={() => setReflectionModalOpen(true)}
        onBreathing={() => setShowBreathing(true)}
        onEmotionalWeather={handleCheckIn}
        onSupport={() => navigate('/professionals')}
      />

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
