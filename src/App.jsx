import React, { useEffect } from 'react';
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

import Navbar from './components/Navbar';

function AppInner() {
  const { token, user, role } = useAuthStore();
  const location = useLocation();
  const isHealer = role === 'healer' || user?.role === 'healer';

  // Pages that manage their own header/nav
  const hideNav = location.pathname === '/chat' || location.pathname === '/groups' || location.pathname === '/' || location.pathname === '/mood' || isHealer;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {token && !hideNav && <Navbar />}

      {/* Top nav spacer — pushes content down on desktop when top navbar is visible */}
      <div style={{ paddingTop: token && !hideNav ? 80 : 0 }}>

      <Routes>
        <Route path="/" element={<Landing />} />

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
