import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';
import { useWeatherStore } from './store/weather';
import EmotionWeatherModal from './components/emotional-weather/EmotionWeatherModal';
import DashboardLayout from './components/DashboardLayout';

// ── Eager imports (critical path) ────────────────────────────────────────────
import Landing from './pages/Landing';
import Login from './pages/Login';
import HealerDashboard from './pages/HealerDashboard';
import SafetyOnboarding, { useNeedsOnboarding } from './pages/SafetyOnboarding';

// ── Lazy imports ──────────────────────────────────────────────────────────────
const Signup        = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const TermsPrivacy  = lazy(() => import('./pages/TermsPrivacy'));
const SafetyPolicy  = lazy(() => import('./pages/SafetyPolicy'));
const CrisisSupport = lazy(() => import('./pages/CrisisSupport'));
const GuideTerms    = lazy(() => import('./pages/GuideTerms'));
const CommunityRules = lazy(() => import('./pages/CommunityRules'));
const ReportConcern = lazy(() => import('./pages/ReportConcern'));
const About         = lazy(() => import('./pages/About'));
const CookiePolicy  = lazy(() => import('./pages/CookiePolicy'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const Contact       = lazy(() => import('./pages/Contact'));
const Privacy       = lazy(() => import('./pages/Privacy'));

// Full-screen experiences (no sidebar)
const Dashboard     = lazy(() => import('./pages/Dashboard'));    // /chat
const Chat          = lazy(() => import('./pages/Chat'));          // /chat/:id
const GroupChat     = lazy(() => import('./pages/GroupChat'));     // /groups
const TinyWins      = lazy(() => import('./pages/TinyWins'));     // /tiny-wins

// Dashboard pages (inside DashboardLayout)
const Home          = lazy(() => import('./pages/Home'));
const Stories       = lazy(() => import('./pages/Stories'));
const Community     = lazy(() => import('./pages/Community'));
const Messages      = lazy(() => import('./pages/Messages'));
// Journal removed for MVP — see FEATURE_FLAGS.js for v2 Reflection roadmap
const Meditate      = lazy(() => import('./pages/Meditations'));
const Professionals = lazy(() => import('./pages/Professionals'));
const Profile       = lazy(() => import('./pages/Profile'));

// Soul Stories sub-pages
const StoryDetail        = lazy(() => import('./pages/StoryDetail'));
const SavedStories       = lazy(() => import('./pages/SavedStories'));
const NotificationPage   = lazy(() => import('./pages/NotificationPage'));

// Legacy pages kept for backward compat
const Healers       = lazy(() => import('./pages/Healers'));
const Meetups       = lazy(() => import('./pages/Meetups'));
const Premium       = lazy(() => import('./pages/Premium'));
const Account       = lazy(() => import('./pages/Account'));
const Onboarding    = lazy(() => import('./pages/Onboarding'));
const SoulJourney   = lazy(() => import('./pages/SoulJourney'));
const Matches       = lazy(() => import('./pages/Matches'));

import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import MetaHead from './components/MetaHead';

const HIDE_FLOAT_PATHS = ['/safety', '/report', '/community-rules', '/guide-terms'];
const LAUNCH_READY = import.meta.env.VITE_LAUNCH_READY === 'true';

// Routes that use DashboardLayout
const DASHBOARD_PATHS = [
  '/home', '/stories', '/community', '/messages',
  '/meditate', '/professionals', '/profile', '/tiny-wins',
  '/story', '/saved',
  // legacy aliases still routed through layout
  '/dashboard', '/healers', '/meetups', '/premium',
  '/account', '/onboarding', '/journey',
  // old routes now redirected
  '/journal', '/mood', '/matches', '/circles', '/meditations', '/challenges', '/resources',
];

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0D0B1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '2px solid rgba(139,92,246,0.2)',
        borderTopColor: '#8B5CF6',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const S = (C) => <Suspense fallback={<PageLoader />}><C /></Suspense>;

function AppInner() {
  const { token, user, role } = useAuthStore();
  const location = useLocation();
  const isHealer = role === 'healer' || user?.role === 'healer';
  const needsOnboarding = useNeedsOnboarding();
  const [onboardingDone, setOnboardingDone] = useState(!needsOnboarding);
  const { showModal, checkTodayAndInit } = useWeatherStore();

  const userId = user?.id || user?.user_id;
  useEffect(() => {
    if (token && userId) checkTodayAndInit(userId);
  }, [token, userId]);

  const isDashboard = DASHBOARD_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));
  const isFullScreen = location.pathname === '/chat' || location.pathname.startsWith('/chat/') || location.pathname === '/groups';

  const hideNav = location.pathname === '/' || isDashboard || isFullScreen || isHealer;
  const hideBottomNav = location.pathname === '/' || isFullScreen || isDashboard || !LAUNCH_READY || isHealer;

  const showOnboarding = false;

  const safetyRoutes = (
    <>
      <Route path="/safety"          element={<Suspense fallback={<PageLoader />}><SafetyPolicy /></Suspense>} />
      <Route path="/crisis-support"  element={<Suspense fallback={<PageLoader />}><CrisisSupport /></Suspense>} />
      <Route path="/guide-terms"     element={<Suspense fallback={<PageLoader />}><GuideTerms /></Suspense>} />
      <Route path="/community-rules" element={<Suspense fallback={<PageLoader />}><CommunityRules /></Suspense>} />
      <Route path="/report"          element={<Suspense fallback={<PageLoader />}><ReportConcern /></Suspense>} />
      <Route path="/about"           element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
      <Route path="/cookies"         element={<Suspense fallback={<PageLoader />}><CookiePolicy /></Suspense>} />
      <Route path="/accessibility"   element={<Suspense fallback={<PageLoader />}><Accessibility /></Suspense>} />
      <Route path="/contact"         element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
      <Route path="/privacy"         element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
    </>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <MetaHead />

      {showOnboarding && <SafetyOnboarding onComplete={() => setOnboardingDone(true)} />}

      {token && !hideNav && LAUNCH_READY && <Navbar />}

      <AnimatePresence>
        {token && LAUNCH_READY && showModal && <EmotionWeatherModal />}
      </AnimatePresence>

      <div style={{ paddingTop: token && !hideNav && LAUNCH_READY ? 80 : 0 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          {safetyRoutes}

          {!token || !LAUNCH_READY ? (
            <>
              <Route path="/signup"          element={<Suspense fallback={<PageLoader />}><Signup /></Suspense>} />
              <Route path="/login"           element={<Login />} />
              <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
              <Route path="/terms"           element={<Suspense fallback={<PageLoader />}><TermsPrivacy /></Suspense>} />
              <Route path="*"                element={<Navigate to="/" replace />} />
            </>
          ) : isHealer ? (
            <>
              <Route path="/healer-dashboard" element={<HealerDashboard />} />
              <Route path="*" element={<Navigate to="/healer-dashboard" replace />} />
            </>
          ) : (
            <>
              {/* Full-screen (no sidebar) */}
              <Route path="/chat"          element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
              <Route path="/chat/:matchId" element={<Suspense fallback={<PageLoader />}><Chat /></Suspense>} />
              <Route path="/groups"        element={<Suspense fallback={<PageLoader />}><GroupChat /></Suspense>} />
              <Route path="/terms"         element={<Suspense fallback={<PageLoader />}><TermsPrivacy /></Suspense>} />

              {/* Dashboard routes — all inside persistent sidebar layout */}
              <Route element={<DashboardLayout />}>
                {/* Primary nav */}
                <Route path="/home"          element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
                <Route path="/stories"       element={<Suspense fallback={<PageLoader />}><Stories /></Suspense>} />
                <Route path="/community"     element={<Suspense fallback={<PageLoader />}><Community /></Suspense>} />
                <Route path="/messages"      element={<Suspense fallback={<PageLoader />}><Messages /></Suspense>} />
                <Route path="/meditate"      element={<Suspense fallback={<PageLoader />}><Meditate /></Suspense>} />
                <Route path="/professionals" element={<Suspense fallback={<PageLoader />}><Professionals /></Suspense>} />
                <Route path="/profile"       element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
                <Route path="/tiny-wins"    element={<Suspense fallback={<PageLoader />}><TinyWins /></Suspense>} />
                <Route path="/story/:id"   element={<Suspense fallback={<PageLoader />}><StoryDetail /></Suspense>} />
                <Route path="/saved"         element={<Suspense fallback={<PageLoader />}><SavedStories /></Suspense>} />
                <Route path="/notifications" element={<Suspense fallback={<PageLoader />}><NotificationPage /></Suspense>} />

                {/* Legacy pages inside layout */}
                <Route path="/healers"       element={<Suspense fallback={<PageLoader />}><Healers /></Suspense>} />
                <Route path="/meetups"       element={<Suspense fallback={<PageLoader />}><Meetups /></Suspense>} />
                <Route path="/premium"       element={<Suspense fallback={<PageLoader />}><Premium /></Suspense>} />
                <Route path="/onboarding"    element={<Suspense fallback={<PageLoader />}><Onboarding /></Suspense>} />
                <Route path="/journey"       element={<Suspense fallback={<PageLoader />}><SoulJourney /></Suspense>} />
                <Route path="/dashboard"     element={<Suspense fallback={<PageLoader />}><Matches /></Suspense>} />

                {/* Redirects from old / removed routes */}
                <Route path="/journal"       element={<Navigate to="/home"          replace />} />
                <Route path="/journal/*"     element={<Navigate to="/home"          replace />} />
                <Route path="/mood"          element={<Navigate to="/home"          replace />} />
                <Route path="/account"       element={<Navigate to="/profile"       replace />} />
                <Route path="/matches"       element={<Navigate to="/home"          replace />} />
                <Route path="/circles"       element={<Navigate to="/community"     replace />} />
                <Route path="/meditations"   element={<Navigate to="/meditate"      replace />} />
                <Route path="/challenges"    element={<Navigate to="/home"          replace />} />
                <Route path="/resources"     element={<Navigate to="/home"          replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          )}
        </Routes>
      </div>

      {token && !hideBottomNav && (
        <div className="sc-bottom-nav">
          <MobileBottomNav />
        </div>
      )}
    </div>
  );
}

function App() {
  const { init } = useThemeStore();
  useEffect(() => {
    init();
    const shell = document.getElementById('app-shell');
    if (shell) {
      shell.style.opacity = '0';
      setTimeout(() => shell.remove(), 200);
    }
  }, []);

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default function AppWithAnalytics() {
  return (
    <>
      <App />
      <Analytics />
    </>
  );
}
