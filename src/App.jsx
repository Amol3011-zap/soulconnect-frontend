import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useThemeStore } from './store/theme';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Healers from './pages/Healers';
import Meetups from './pages/Meetups';
import Premium from './pages/Premium';
import Account from './pages/Account';

import Navbar from './components/Navbar';
import CrisisResources from './components/CrisisResources';

function AppInner() {
  const { token } = useAuthStore();
  const location = useLocation();
  const hideNav = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {token && !hideNav && <Navbar />}
      <CrisisResources />

      <Routes>
        <Route path="/" element={<Landing />} />

        {!token ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat/:matchId" element={<Chat />} />
            <Route path="/healers" element={<Healers />} />
            <Route path="/meetups" element={<Meetups />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
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
