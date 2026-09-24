import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { useWeatherStore, isCheckedInToday } from '../store/weather';
import { useTinyWinsStore } from '../store/tinyWins';
import ErrorToast from '../components/ErrorToast';
import { Search, Bell, Video, ChevronRight, ArrowRight, Check, Moon, Sun } from 'lucide-react';
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
import CommunitySection from '../components/home/CommunitySection';
import TodaysFocusChecklistCard from '../components/home/TodaysFocusChecklistCard';
import SoulClimateCard from '../components/home/SoulClimateCard';
import LotusMark from '../components/LotusMark';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIsDark, useThemeStore } from '../store/theme';
import { STORIES } from '../components/home/storiesData';

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDark = useIsDark();
  const toggleTheme = useThemeStore((s) => s.toggle);
  const { todayEntry, showModal, checkIn, syncToday } = useWeatherStore();
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

  // Soul Climate: one check-in per LOCAL calendar day. dayKey re-renders the
  // card at local midnight (and when the app returns to the foreground) so
  // yesterday's check-in never carries over; syncToday asks the server when
  // that's enabled (other devices, logout/login).
  const [dayKey, setDayKey] = useState(() => new Date().toDateString());
  useEffect(() => {
    const refresh = () => { setDayKey(new Date().toDateString()); syncToday(userId); };
    const now = new Date();
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5) - now;
    const t = setTimeout(refresh, msToMidnight);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    syncToday(userId);
    return () => { clearTimeout(t); document.removeEventListener('visibilitychange', onVisible); };
  }, [dayKey, userId, syncToday]);
  const todayMood = isCheckedInToday(todayEntry, userId) ? todayEntry.weather : null;
  const selectedWeather = todayMood;

  const handleSoulClimateCheckIn = useCallback((id) => checkIn(id, userId), [checkIn, userId]);

  // Companion "emotional weather" shortcut: bring the Soul Climate card into view.
  const soulClimateRef = useRef(null);
  const handleCheckIn = useCallback(() => {
    soulClimateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Community section: every tap still leads to Stories, as before
  const goToStories = useCallback(() => navigate('/stories'), [navigate]);

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
          background: var(--sc-card);
          border-left: 1px solid var(--sc-border);
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
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Light mode' : 'Dark mode'}>
                {isDark ? <Sun className="!h-5 !w-5" /> : <Moon className="!h-5 !w-5" />}
              </Button>
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

          {/* 2 · Soul Climate — compact daily check-in card */}
          <div ref={soulClimateRef}>
            <SoulClimateCard
              key={dayKey}
              todayMood={todayMood}
              tinyStep={(dailyWins.find(w => !completedToday.includes(w.id)) || dailyWins[0])?.title || 'Take 5 minutes for something you enjoy.'}
              onCheckIn={handleSoulClimateCheckIn}
              onOpenTinyStep={() => navigate('/tiny-wins')}
              dark={isDark}
            />
          </div>

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
                    <p className="px-3 pb-2 pt-1 text-[13px] text-[color:var(--sc-success-text)]">All done for today — that's real progress.</p>
                  )}
                </>
              ) : (
                <div className="space-y-2 p-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
              )}
            </Card>
          </section>

          {/* 5 · From the community */}
          <CommunitySection
            stories={STORIES}
            onOpenStory={goToStories}
            onSeeAll={goToStories}
            onShare={goToStories}
          />

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
                  <AvatarFallback className="bg-[color:var(--sc-tint)] text-[17px] text-[color:var(--sc-purple-text)]">{FEATURED_PROFESSIONAL.initials}</AvatarFallback>
                </Avatar>
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-[color:var(--sc-success)] text-white"
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-base font-semibold text-[color:var(--sc-purple-deep)]">M</span>
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

        <Card className="relative overflow-hidden bg-[color:var(--sc-warm)] p-5 text-center">
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
