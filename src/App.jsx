import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import ForgotPassword from './pages/ForgotPassword';
import TermsPrivacy from './pages/TermsPrivacy';
import Chat from './pages/Chat';
import Healers from './pages/Healers';
import Meetups from './pages/Meetups';
import Premium from './pages/Premium';
import Account from './pages/Account';
import MoodTracker from './pages/MoodTracker';
import HealerDashboard from './pages/HealerDashboard';
import GroupChat from './pages/GroupChat';
import Onboarding from './pages/Onboarding';
import SoulJourney from './pages/SoulJourney';
import SafetyPolicy from './pages/SafetyPolicy';
import CrisisSupport from './pages/CrisisSupport';
import GuideTerms from './pages/GuideTerms';
import CommunityRules from './pages/CommunityRules';
import ReportConcern from './pages/ReportConcern';
import SafetyOnboarding, { useNeedsOnboarding } from './pages/SafetyOnboarding';

import Navbar from './components/Navbar';
import SafetyFloatButton from './components/SafetyFloatButton';

// Pages where the SafetyFloatButton is redundant (already have full crisis UI)
const HIDE_FLOAT_PATHS = ['/crisis-support', '/safety', '/report', '/community-rules', '/guide-terms'];

function AppInner() {
  const { token, user, role } = useAuthStore();
  const location = useLocation();
  const isHealer = role === 'healer' || user?.role === 'healer';
  const needsOnboarding = useNeedsOnboarding();
  const [onboardingDone, setOnboardingDone] = useState(!needsOnboarding);

  // Pages that manage their own header/nav
  const hideNav = location.pathname === '/chat' || location.pathname === '/groups' || location.pathname === '/' || location.pathname === '/mood' || isHealer;

  // Hide float button on safety pages (they have their own UI) and landing
  const hideFloat = HIDE_FLOAT_PATHS.includes(location.pathname) || location.pathname === '/';

  // Trust & safety routes accessible to everyone (logged-in or not)
  const safetyRoutes = (
    <>
      <Route path="/safety" element={<SafetyPolicy />} />
      <Route path="/crisis-support" element={<CrisisSupport />} />
      <Route path="/guide-terms" element={<GuideTerms />} />
      <Route path="/community-rules" element={<CommunityRules />} />
      <Route path="/report" element={<ReportConcern />} />
    </>
  );

  // Show safety onboarding for ALL first-time visitors (logged-in or not),
  // except healers and safety pages (which already have full crisis UI)
  const isSafetyPage = HIDE_FLOAT_PATHS.includes(location.pathname);
  const showOnboarding = !isHealer && !onboardingDone && !isSafetyPage;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Safety onboarding gate — overlays everything for users who haven't acknowledged */}
      {showOnboarding && (
        <SafetyOnboarding onComplete={() => setOnboardingDone(true)} />
      )}

      {token && !hideNav && <Navbar />}

      {/* Top nav spacer — pushes content down on desktop when top navbar is visible */}
      <div style={{ paddingTop: token && !hideNav ? 80 : 0 }}>

      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Trust & Safety — always accessible */}
        {safetyRoutes}

        {!token ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsPrivacy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : isHealer ? (
          <>
            {/* Healers only see their request dashboard */}
            <Route path="/healer-dashboard" element={<HealerDashboard />} />
            <Route path="*" element={<Navigate to="/healer-dashboard" replace />} />
          </>
        ) : (
          <>
            {/* Regular user routes */}
            <Route path="/terms" element={<TermsPrivacy />} />
            <Route path="/dashboard" element={<Matches />} />
            <Route path="/chat" element={<Dashboard />} />
            <Route path="/matches" element={<Navigate to="/dashboard" replace />} />
            <Route path="/groups" element={<GroupChat />} />
            <Route path="/chat/:matchId" element={<Chat />} />
            <Route path="/healers" element={<Healers />} />
            <Route path="/meetups" element={<Meetups />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/account" element={<Account />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/journey" element={<SoulJourney />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
      </div>

      {/* Global floating safety button — visible on all pages except landing & safety pages */}
      {!hideFloat && !showOnboarding && <SafetyFloatButton />}
    </div>
  );
}

function App() {
  const { init } = useThemeStore();
  useEffect(() => { init(); }, []);

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
