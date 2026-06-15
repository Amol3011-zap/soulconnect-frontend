import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { userAPI } from '../services/api';

const PROBLEM_LABELS = {
  anxiety: 'Anxiety', depression: 'Depression', ocd_intrusive_thoughts: 'OCD',
  ptsd_trauma: 'PTSD / Trauma', phobias: 'Phobias', panic_attacks: 'Panic Attacks',
  self_harm: 'Self-Harm', relationship_breakup: 'Relationship Breakup', divorce: 'Divorce',
  marriage_problems: 'Marriage Problems', family_relationships: 'Family Relationships',
  trust_issues: 'Trust Issues', loneliness: 'Loneliness', lack_of_confidence: 'Lack of Confidence',
  grief_loss: 'Grief / Loss', work_career_stress: 'Work Stress', financial_stress: 'Financial Stress',
  addiction_substance_abuse: 'Addiction', sleep_problems: 'Sleep Problems',
  anger_management: 'Anger Management', identity_sexual_orientation: 'Identity & Orientation',
  health_anxiety: 'Health Anxiety', eating_disorders: 'Eating Disorders', bullying_harassment: 'Bullying',
};

export default function Account() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

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

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  const initials = profile?.name ? profile.name.slice(0, 2).toUpperCase() : '??';
  const primaryLabel = PROBLEM_LABELS[profile?.primary_problem] || profile?.primary_problem || '—';

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden mb-6"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #0f3460 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(30px)' }} />
        <div className="max-w-lg mx-auto px-6 py-8 relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #a855f7, #2563eb)' }}>
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile?.name || 'Anonymous'}</h1>
            <p className="text-purple-200 text-sm mt-0.5">{profile?.city}{profile?.country ? `, ${profile.country}` : ''}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white border border-white/20">
                🌱 Seeking Support
              </span>
              {profile?.primary_problem && (
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-500/30 text-purple-100 border border-purple-400/30">
                  {primaryLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Profile Details</h2>
            <button className="text-xs text-purple-600 font-semibold hover:underline">Edit</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: 'Phone', value: profile?.phone ? `+91 ${profile.phone}` : '—', icon: '📱' },
              { label: 'Age', value: profile?.age ? `${profile.age} years` : '—', icon: '🎂' },
              { label: 'Gender', value: profile?.gender ? profile.gender.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—', icon: '👤' },
              { label: 'Location', value: [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || '—', icon: '📍' },
              { label: 'Primary Focus', value: primaryLabel, icon: '🎯' },
              ...(profile?.secondary_problems?.length ? [{ label: 'Also dealing with', value: profile.secondary_problems.map(p => PROBLEM_LABELS[p] || p).join(', '), icon: '➕' }] : []),
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-lg shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="rounded-2xl border border-purple-100 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #faf5ff, #eff6ff)' }}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h2 className="font-bold text-gray-900">Free Plan</h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-semibold">Current</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Upgrade to Premium for priority matching, unlimited meetups, and healer discounts.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'Priority Matching', free: false },
                { label: 'Unlimited Meetups', free: false },
                { label: 'Healer Discount 20%', free: false },
                { label: 'Basic Matching', free: true },
              ].map(({ label, free }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs">
                  <span className={free ? 'text-green-500' : 'text-gray-300'}>
                    {free ? '✓' : '✗'}
                  </span>
                  <span className={free ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/premium')}
              className="w-full py-2.5 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              Upgrade to Premium ⭐
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {[
            { icon: '🔒', label: 'Privacy & Safety', sub: 'Control who sees your info' },
            { icon: '🔔', label: 'Notifications', sub: 'Manage alerts' },
            { icon: '🆘', label: 'Crisis Resources', sub: '24/7 helplines & support' },
            { icon: '💬', label: 'Help & Support', sub: 'Contact the team' },
          ].map(({ icon, label, sub }, i, arr) => (
            <button key={label}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <span className="text-xl shrink-0">{icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <span className="text-gray-300 text-sm">›</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl font-semibold text-red-500 bg-white border border-red-100 hover:bg-red-50 transition-colors text-sm">
          Sign Out
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">SoulConnect v1.0 · Your data is private & encrypted</p>
      </div>
    </div>
  );
}
