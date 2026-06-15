import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Healers from './pages/Healers';
import Meetups from './pages/Meetups';
import Premium from './pages/Premium';
import Account from './pages/Account';

import Navbar from './components/Navbar';
import CrisisResources from './components/CrisisResources';

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {token && <Navbar />}
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
              <Route path="/matches" element={<Matches />} />
              <Route path="/chat/:matchId" element={<Chat />} />
              <Route path="/healers" element={<Healers />} />
              <Route path="/meetups" element={<Meetups />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Navigate to="/matches" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
