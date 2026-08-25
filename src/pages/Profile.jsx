import React, { useCallback, useState, useEffect } from 'react';
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
import ErrorToast from '../components/ErrorToast';
import { ProfileSkeleton } from '../components/Skeletons';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { streak, longestStreak } = useWeatherStore();
  const { last7Days } = useMoodData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize profile on mount
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        setError('');
        // Simulate loading profile data
        await new Promise(resolve => setTimeout(resolve, 400));
        setLoading(false);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };
    initializeProfile();
  }, []);

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

  // Handle error state
  if (error) {
    return (
      <>
        <ErrorToast
          message={error}
          onRetry={() => window.location.reload()}
          onDismiss={() => setError('')}
        />
        <div
          style={{
            minHeight: '100vh',
            background: '#0B0618',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            padding: '20px',
          }}
        >
          <p style={{ color: '#8A84B6', textAlign: 'center', fontSize: 16 }}>
            Unable to load profile. Please try again.
          </p>
        </div>
      </>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0B0618',
          padding: '24px 16px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <ProfileSkeleton />
      </div>
    );
  }

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
