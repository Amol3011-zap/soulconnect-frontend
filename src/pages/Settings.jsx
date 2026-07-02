import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import { useSettingsStore } from '../store/settings';
import { userAPI, authAPI } from '../services/api';
import { ChevronRight, Search, Lock, LogOut, Trash2 } from 'lucide-react';

const TRIGGER_TOPICS = ['Suicide', 'Self Harm', 'Grief', 'Breakups', 'Addiction', 'Burnout', 'Bullying', 'Abuse'];
const NOTIFICATION_TYPES = ['pushNotifications', 'emailNotifications', 'moodReminder', 'journalReminder', 'breathingReminder', 'challengeReminder', 'messageNotifications', 'friendRequestNotifications', 'communityReplyNotifications', 'weeklyReport', 'monthlyReport'];

function SettingSwitch({ label, description, value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)' }}>
            {description}
          </div>
        )}
      </div>
      <motion.button
        onClick={onChange}
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          background: value ? '#7C3AED' : 'rgba(139, 92, 246, 0.2)',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: value ? 24 : 4,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: value ? 18 : 0 }}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            left: value ? 'auto' : 2,
            right: value ? 2 : 'auto',
          }}
        />
      </motion.button>
    </motion.div>
  );
}

function SettingSelect({ label, description, value, onChange, options }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)' }}>
            {description}
          </div>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'rgba(124, 58, 237, 0.1)',
          color: '#fff',
          fontSize: 12,
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#171126', color: '#fff' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

function SettingsGroup({ title, icon, children, searchQuery = '' }) {
  if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase()) && !children.props?.children?.some?.((child) => child?.props?.label?.toLowerCase?.().includes(searchQuery.toLowerCase()))) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div
        style={{
          padding: '16px',
          background: 'rgba(124, 58, 237, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {title}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const settings = useSettingsStore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pwData, setPwData] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (pwData.new.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }

    if (pwData.new !== pwData.confirm) {
      setPwError('Passwords do not match');
      return;
    }

    setPwLoading(true);
    try {
      await authAPI.changePassword(pwData.current, pwData.new);
      setPwSuccess('Password changed successfully!');
      setPwData({ current: '', new: '', confirm: '' });
      setTimeout(() => {
        setShowChangePassword(false);
        setPwSuccess('');
      }, 2000);
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This would call a delete account API
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
        Loading settings...
      </div>
    );
  }

  const filteredSettings = searchQuery.toLowerCase();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0618',
        fontFamily: "'Inter', -apple-system, sans-serif",
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '20px 16px 24px',
          background: 'linear-gradient(135deg, rgba(34, 18, 73, 0.72), rgba(124, 58, 237, 0.1))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
              ⚙️ Settings
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(184, 180, 216, 0.7)', margin: 0 }}>
              Manage your SoulConnect experience
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 12,
            }}
          >
            <Search size={16} color="rgba(184, 180, 216, 0.6)" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 12,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Settings Content */}
      <div style={{ padding: '20px 16px', maxWidth: 700, margin: '0 auto' }}>
        <AnimatePresence>
          {/* Account Settings */}
          {(!filteredSettings || 'account'.includes(filteredSettings) || 'profile'.includes(filteredSettings) || 'password'.includes(filteredSettings)) && (
            <SettingsGroup title="Account" icon="👤" searchQuery={filteredSettings}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <motion.button
                  onClick={() => navigate('/account')}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                  whileHover={{ background: 'rgba(124, 58, 237, 0.1)' }}
                >
                  <div>
                    <div style={{ color: '#fff' }}>Edit Profile</div>
                    <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                      Name, bio, avatar
                    </div>
                  </div>
                  <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />
                </motion.button>

                <motion.button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                  whileHover={{ background: 'rgba(124, 58, 237, 0.1)' }}
                >
                  <div>
                    <div style={{ color: '#fff' }}>Change Password</div>
                    <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                      Update your login password
                    </div>
                  </div>
                  <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />
                </motion.button>

                {/* Change Password Form */}
                <AnimatePresence>
                  {showChangePassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        padding: '14px 16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          { label: 'Current Password', key: 'current' },
                          { label: 'New Password', key: 'new' },
                          { label: 'Confirm Password', key: 'confirm' },
                        ].map(({ label, key }) => (
                          <div key={key}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(184, 180, 216, 0.8)', display: 'block', marginBottom: 4 }}>
                              {label}
                            </label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={pwData[key]}
                              onChange={(e) => setPwData({ ...pwData, [key]: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 10,
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                background: 'rgba(124, 58, 237, 0.1)',
                                color: '#fff',
                                fontSize: 12,
                                fontFamily: 'inherit',
                                outline: 'none',
                                boxSizing: 'border-box',
                              }}
                            />
                          </div>
                        ))}
                        {pwError && <div style={{ fontSize: 11, color: '#EF4444' }}>⚠️ {pwError}</div>}
                        {pwSuccess && <div style={{ fontSize: 11, color: '#10B981' }}>✅ {pwSuccess}</div>}
                        <div style={{ display: 'flex', gap: 10 }}>
                          <motion.button
                            type="submit"
                            disabled={pwLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: 10,
                              border: 'none',
                              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: pwLoading ? 'not-allowed' : 'pointer',
                              opacity: pwLoading ? 0.6 : 1,
                              fontFamily: 'inherit',
                            }}
                          >
                            {pwLoading ? 'Saving...' : 'Save Password'}
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setShowChangePassword(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 10,
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              background: 'rgba(124, 58, 237, 0.1)',
                              color: '#A78BFA',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: 'left',
                  }}
                  whileHover={{ background: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <div>
                    <div style={{ color: '#EF4444' }}>Delete Account</div>
                    <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                      Permanently delete your account
                    </div>
                  </div>
                  <Trash2 size={16} color="#EF4444" />
                </motion.button>
              </motion.div>
            </SettingsGroup>
          )}

          {/* Privacy & Safety */}
          {(!filteredSettings || 'privacy'.includes(filteredSettings) || 'safety'.includes(filteredSettings)) && (
            <SettingsGroup title="Privacy & Safety" icon="🔒" searchQuery={filteredSettings}>
              <SettingSwitch
                label="Private Profile"
                description="Only approved followers can see your profile"
                value={settings.privateProfile}
                onChange={() => settings.updateSetting('privateProfile', !settings.privateProfile)}
              />
              <SettingSwitch
                label="Hide Online Status"
                description="Others won't see when you're active"
                value={settings.hideOnlineStatus}
                onChange={() => settings.updateSetting('hideOnlineStatus', !settings.hideOnlineStatus)}
              />
              <SettingSwitch
                label="Hide Last Seen"
                description="Hide when you were last online"
                value={settings.hideLastSeen}
                onChange={() => settings.updateSetting('hideLastSeen', !settings.hideLastSeen)}
              />
              <SettingSwitch
                label="Allow Friend Requests"
                description="Accept new connection requests"
                value={settings.allowFriendRequests}
                onChange={() => settings.updateSetting('allowFriendRequests', !settings.allowFriendRequests)}
              />
              <SettingSwitch
                label="Allow Direct Messages"
                description="Receive direct messages from followers"
                value={settings.allowDirectMessages}
                onChange={() => settings.updateSetting('allowDirectMessages', !settings.allowDirectMessages)}
              />
            </SettingsGroup>
          )}

          {/* Emotional Safety */}
          {(!filteredSettings || 'emotional'.includes(filteredSettings) || 'safety'.includes(filteredSettings)) && (
            <SettingsGroup title="Emotional Safety" icon="💜" searchQuery={filteredSettings}>
              <SettingSwitch
                label="Safe Mode"
                description="Hide potentially triggering content"
                value={settings.safeMode}
                onChange={() => settings.updateSetting('safeMode', !settings.safeMode)}
              />
              <SettingSwitch
                label="Anonymous Mode"
                description="Browse without showing your profile"
                value={settings.anonymousMode}
                onChange={() => settings.updateSetting('anonymousMode', !settings.anonymousMode)}
              />
              <SettingSwitch
                label="Pause Friend Requests"
                description="Temporarily disable new connections"
                value={settings.pauseFriendRequests}
                onChange={() => settings.updateSetting('pauseFriendRequests', !settings.pauseFriendRequests)}
              />
              <SettingSwitch
                label="Pause Conversations"
                description="Take a break from messaging"
                value={settings.pauseConversations}
                onChange={() => settings.updateSetting('pauseConversations', !settings.pauseConversations)}
              />
              <SettingSwitch
                label="Reduce Notifications"
                description="Minimize notification frequency"
                value={settings.reduceNotifications}
                onChange={() => settings.updateSetting('reduceNotifications', !settings.reduceNotifications)}
              />
              <SettingSwitch
                label="Show Crisis Resources"
                description="Always available on home screen"
                value={settings.showCrisisResources}
                onChange={() => settings.updateSetting('showCrisisResources', !settings.showCrisisResources)}
              />

              {/* Trigger Topics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '14px 16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 10 }}>
                  Topics to Hide
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {TRIGGER_TOPICS.map((topic) => (
                    <motion.button
                      key={topic}
                      onClick={() => {
                        if (settings.triggerTopics.includes(topic)) {
                          settings.removeTriggerTopic(topic);
                        } else {
                          settings.addTriggerTopic(topic);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: settings.triggerTopics.includes(topic)
                          ? '2px solid #7C3AED'
                          : '1px solid rgba(139, 92, 246, 0.3)',
                        background: settings.triggerTopics.includes(topic)
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </SettingsGroup>
          )}

          {/* Notifications */}
          {(!filteredSettings || 'notification'.includes(filteredSettings)) && (
            <SettingsGroup title="Notifications" icon="🔔" searchQuery={filteredSettings}>
              <SettingSwitch
                label="Push Notifications"
                description="Receive browser notifications"
                value={settings.pushNotifications}
                onChange={() => settings.updateSetting('pushNotifications', !settings.pushNotifications)}
              />
              <SettingSwitch
                label="Email Notifications"
                description="Receive emails from SoulConnect"
                value={settings.emailNotifications}
                onChange={() => settings.updateSetting('emailNotifications', !settings.emailNotifications)}
              />
              <SettingSwitch
                label="Mood Reminder"
                description="Daily reminder to log your mood"
                value={settings.moodReminder}
                onChange={() => settings.updateSetting('moodReminder', !settings.moodReminder)}
              />
              <SettingSwitch
                label="Journal Reminder"
                description="Reminder to write in your journal"
                value={settings.journalReminder}
                onChange={() => settings.updateSetting('journalReminder', !settings.journalReminder)}
              />
              <SettingSwitch
                label="Messages"
                description="New message notifications"
                value={settings.messageNotifications}
                onChange={() => settings.updateSetting('messageNotifications', !settings.messageNotifications)}
              />
              <SettingSwitch
                label="Community Replies"
                description="Replies to your posts"
                value={settings.communityReplyNotifications}
                onChange={() => settings.updateSetting('communityReplyNotifications', !settings.communityReplyNotifications)}
              />
              <SettingSwitch
                label="Weekly Report"
                description="Summary of your week"
                value={settings.weeklyReport}
                onChange={() => settings.updateSetting('weeklyReport', !settings.weeklyReport)}
              />

              <SettingSelect
                label="Reminder Time"
                description="When to send reminders"
                value={settings.reminderTime}
                onChange={(value) => settings.updateSetting('reminderTime', value)}
                options={[
                  { label: '8:00 AM', value: '08:00' },
                  { label: '9:00 AM', value: '09:00' },
                  { label: '12:00 PM', value: '12:00' },
                  { label: '3:00 PM', value: '15:00' },
                  { label: '6:00 PM', value: '18:00' },
                  { label: '9:00 PM', value: '21:00' },
                ]}
              />
            </SettingsGroup>
          )}

          {/* Appearance */}
          {(!filteredSettings || 'appearance'.includes(filteredSettings) || 'theme'.includes(filteredSettings)) && (
            <SettingsGroup title="Appearance" icon="🎨" searchQuery={filteredSettings}>
              <SettingSwitch
                label="Dark Mode"
                description="Use dark theme (currently enabled)"
                value={dark}
                onChange={toggle}
              />
              <SettingSelect
                label="Font Size"
                description="Adjust text size"
                value={settings.fontSize}
                onChange={(value) => settings.updateSetting('fontSize', value)}
                options={[
                  { label: 'Small', value: 'small' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Large', value: 'large' },
                ]}
              />
              <SettingSwitch
                label="Reduce Motion"
                description="Minimize animations"
                value={settings.reduceMotion}
                onChange={() => settings.updateSetting('reduceMotion', !settings.reduceMotion)}
              />
              <SettingSwitch
                label="High Contrast"
                description="Increase text contrast"
                value={settings.highContrast}
                onChange={() => settings.updateSetting('highContrast', !settings.highContrast)}
              />
              <SettingSwitch
                label="Compact Mode"
                description="Use compact spacing"
                value={settings.compactMode}
                onChange={() => settings.updateSetting('compactMode', !settings.compactMode)}
              />
            </SettingsGroup>
          )}

          {/* Help & Support */}
          {(!filteredSettings || 'help'.includes(filteredSettings) || 'support'.includes(filteredSettings)) && (
            <SettingsGroup title="Help & Support" icon="❤️" searchQuery={filteredSettings}>
              <motion.button
                onClick={() => navigate('/safety')}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%',
                }}
                whileHover={{ background: 'rgba(124, 58, 237, 0.1)' }}
              >
                <div>
                  <div>Help Center</div>
                  <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                    FAQs and tutorials
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/crisis-support')}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%',
                }}
                whileHover={{ background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <div>
                  <div>Crisis Resources</div>
                  <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                    24/7 helplines & support
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/privacy')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                  width: '100%',
                }}
                whileHover={{ background: 'rgba(124, 58, 237, 0.1)' }}
              >
                <div>
                  <div>Privacy Policy</div>
                  <div style={{ fontSize: 11, color: 'rgba(184, 180, 216, 0.6)', marginTop: 2 }}>
                    How we protect your data
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(184, 180, 216, 0.5)" />
              </motion.button>
            </SettingsGroup>
          )}

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              logout();
              navigate('/');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 24,
              border: '1px solid rgba(239, 68, 68, 0.25)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 40,
            }}
          >
            <LogOut size={16} />
            Log Out
          </motion.button>
        </AnimatePresence>

        {/* Delete Account Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(34, 18, 73, 0.95)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 24,
                  padding: 24,
                  maxWidth: 400,
                  backdropFilter: 'blur(32px)',
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#EF4444', margin: '0 0 8px' }}>
                  Delete Account?
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(184, 180, 216, 0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <motion.button
                    onClick={() => setShowDeleteConfirm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      background: 'rgba(124, 58, 237, 0.1)',
                      color: '#A78BFA',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteAccount}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: 'none',
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Delete Account
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
