import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useWeatherStore } from '../store/weather';
import { useTinyWinsStore } from '../store/tinyWins';
import { useStoriesStore } from '../store/stories';
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
  const { streak } = useWeatherStore();
  const { totalWins } = useTinyWinsStore();
  const { userStories } = useStoriesStore();

  const journalEntries = 34;
  const peopleHelped = 19;
  const connections = 8;

  const MENU_ITEMS = [
    { icon: '⚙️', label: 'Settings', action: () => navigate('/account') },
    { icon: '🛡️', label: 'Privacy & Safety', action: () => navigate('/privacy') },
    { icon: '❓', label: 'Help & Support', action: () => navigate('/safety') },
  ];

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
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        streak={streak}
        onEditClick={() => navigate('/account')}
      />

      {/* Life Chapter */}
      <LifeChapterCard />

      {/* Stats Grid */}
      <StatsGrid
        totalWins={totalWins}
        journalEntries={journalEntries}
        peopleHelped={peopleHelped}
        connections={connections}
      />

      {/* Weekly Mood */}
      <WeeklyMood onViewFull={() => navigate('/mood')} />

      {/* Recent Activity */}
      <RecentActivity onViewAll={() => {}} />

      {/* Achievements */}
      <Achievements onViewAll={() => {}} />

      {/* My Circle */}
      <MyCircle connectionCount={connections} />

      {/* Settings */}
      <SettingsList
        items={MENU_ITEMS}
        onLogout={() => {
          logout();
          navigate('/');
        }}
      />
    </div>
  );
}
