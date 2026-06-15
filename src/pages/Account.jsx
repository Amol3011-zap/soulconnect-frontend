import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { userAPI } from '../services/api';

export default function Account() {
  const { logout } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="text-lg font-semibold">{profile?.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="text-lg font-semibold">{profile?.phone}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Main Issue</p>
            <p className="text-lg font-semibold">{profile?.primary_problem}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">City</p>
            <p className="text-lg font-semibold">{profile?.city}</p>
          </div>
        </div>

        <button className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700">
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Subscriptions</h2>
        <p className="text-gray-600 mb-4">No active subscriptions</p>
        <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700">
          Upgrade to Premium
        </button>
      </div>

      <button
        onClick={() => {
          logout();
          window.location.href = '/';
        }}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
