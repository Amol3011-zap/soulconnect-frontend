import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Settings, BookmarkIcon, TrendingUp, Heart } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUserProfileStore } from '../store/userProfile';
import api from '../services/api';

export default function UserProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const profile = useUserProfileStore((state) => state.profile);
  const savedGuides = useUserProfileStore((state) => state.savedGuides);
  const assessmentHistory = useUserProfileStore((state) => state.assessmentHistory);
  const setProfile = useUserProfileStore((state) => state.setProfile);
  const setSavedGuides = useUserProfileStore((state) => state.setSavedGuides);
  const setAssessmentHistory = useUserProfileStore((state) => state.setAssessmentHistory);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchSavedGuides();
    fetchAssessmentHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchSavedGuides = async () => {
    try {
      // TODO: Implement backend endpoint for saved guides
      setSavedGuides([]);
    } catch (error) {
      console.error('Failed to fetch saved guides:', error);
    }
  };

  const fetchAssessmentHistory = async () => {
    try {
      // TODO: Implement backend endpoint for assessment history
      setAssessmentHistory([]);
    } catch (error) {
      console.error('Failed to fetch assessment history:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.put('/users/me', formData);
      setProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', margin: 0 }}>
                  Your Profile
                </h1>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '8px 0 0 0' }}>
                  Manage your wellness journey
                </p>
              </div>

              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '48px' }}>
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Profile Card */}
            <div style={{
              padding: '24px',
              background: 'rgba(34, 18, 73, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              textAlign: 'center',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                👤
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                {authUser?.email?.split('@')[0]}
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {authUser?.email}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'grid', gap: '8px' }}>
              {['overview', 'saved', 'assessments', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 16px',
                    background: activeTab === tab ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: activeTab === tab ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: activeTab === tab ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    textAlign: 'left',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                  Your Wellness Journey
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                  {/* Stats */}
                  {[
                    { label: 'Guides Saved', value: savedGuides.length, icon: '📚' },
                    { label: 'Assessments', value: assessmentHistory.length, icon: '📊' },
                    { label: 'Days Active', value: '12', icon: '📅' },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ y: -4 }}
                      style={{
                        padding: '24px',
                        background: 'rgba(34, 18, 73, 0.72)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#A78BFA', marginBottom: '4px' }}>
                        {stat.value}
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div style={{
                  padding: '24px',
                  background: 'rgba(34, 18, 73, 0.72)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', margin: '0 0 16px 0' }}>
                    Recent Activity
                  </h3>

                  {assessmentHistory.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
                      No assessments yet. Take one to get started!
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {assessmentHistory.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Assessment completed
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                  Saved Guides
                </h2>

                {savedGuides.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      padding: '64px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <BookmarkIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px', margin: 0 }}>No saved guides yet</p>
                    <p style={{ fontSize: '13px', margin: '8px 0 0 0' }}>
                      Explore the emotion library and save guides you find helpful
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {savedGuides.map((guide) => (
                      <motion.div
                        key={guide.id}
                        whileHover={{ x: 8 }}
                        style={{
                          padding: '20px',
                          background: 'rgba(34, 18, 73, 0.72)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                          {guide.title}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                          Saved {new Date(guide.savedAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assessments' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                  Assessment History
                </h2>

                {assessmentHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      padding: '64px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <TrendingUp size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px', margin: 0 }}>No assessments yet</p>
                    <p style={{ fontSize: '13px', margin: '8px 0 0 0' }}>
                      Take assessments in guides to track your emotional wellness
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {assessmentHistory.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          padding: '20px',
                          background: 'rgba(34, 18, 73, 0.72)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 100px',
                          gap: '20px',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                            Assessment completed
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
                            {new Date(item.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#FFF',
                        }}>
                          {item.score}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                  Settings
                </h2>

                <div style={{
                  padding: '24px',
                  background: 'rgba(34, 18, 73, 0.72)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  display: 'grid',
                  gap: '24px',
                }}>
                  {/* Notifications */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
                      Notifications
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                        Receive push notifications about new guides
                      </label>
                    </div>
                  </div>

                  {/* Email Updates */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        defaultChecked={false}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                        Subscribe to weekly wellness tips via email
                      </label>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
                      Theme
                    </label>
                    <select
                      defaultValue="dark"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#FFF',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Save Settings
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
