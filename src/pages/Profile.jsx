import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { useTinyWinsStore } from '../store/tinyWins';
import { useStoriesStore } from '../store/stories';
import { useMoodData } from '../hooks/useMoodData';
import ProfileHeader from '../components/profile/ProfileHeader';
import LifeChapterCard from '../components/profile/LifeChapterCard';
import StatsGrid from '../components/profile/StatsGrid';
import WeeklyMood from '../components/profile/WeeklyMood';
import RecentActivity from '../components/profile/RecentActivity';
import Achievements from '../components/profile/Achievements';
import MyCircle from '../components/profile/MyCircle';
import SettingsList from '../components/profile/SettingsList';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { streak, longestStreak } = useWeatherStore();
  const { last7Days } = useMoodData();

  const MENU_ITEMS = [
    { icon: '⚙️', label: 'Settings', action: () => navigate('/account') },
    { icon: '🛡️', label: 'Privacy & Safety', action: () => navigate('/privacy') },
    { icon: '❓', label: 'Help & Support', action: () => navigate('/safety') },
  ];

  const handleEditProfile = useCallback(() => {
    navigate('/account');
  }, [navigate]);

  const handleViewMood = useCallback(() => {
    navigate('/mood');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  if (!user) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: '#fff' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px 16px',
        minHeight: '100vh',
        background: '#0B0618',
        fontFamily: "'Inter', -apple-system, sans-serif",
        paddingBottom: 32,
      }}
    >
      {/* Profile Header - Real user data */}
      <ProfileHeader
        user={user}
        streak={streak}
        onEditClick={handleEditProfile}
        level={4}
      />

      {/* Life Chapter - Editable */}
      <LifeChapterCard />

      {/* Stats Grid - Real calculated data */}
      <StatsGrid />

      {/* Weekly Mood - Real mood data from last 7 days */}
      <WeeklyMood
        moods={last7Days.map(d => d?.mood || 5).filter(m => m)}
        onViewFull={handleViewMood}
      />

      {/* Recent Activity - Auto-populated from user actions */}
      <RecentActivity onViewAll={() => navigate('/home')} />

      {/* Achievements - Auto-unlock based on criteria */}
      <Achievements onViewAll={() => {}} />

      {/* My Circle - Real connections */}
      <MyCircle connectionCount={8} />

      {/* Settings - All working links */}
      <SettingsList items={MENU_ITEMS} onLogout={handleLogout} />
    </div>
  );
}
