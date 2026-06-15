import React, { useState, useEffect } from 'react';
import { healerAPI } from '../services/api';

export default function Healers() {
  const [healers, setHealers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealers();
  }, []);

  const fetchHealers = async () => {
    try {
      const response = await healerAPI.listHealers();
      setHealers(response.data.healers || []);
    } catch (err) {
      console.error('Error fetching healers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading healers...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find a Healer</h1>

      {healers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No verified healers yet.</p>
          <p className="text-purple-600 font-semibold">Coming soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {healers.map((healer) => (
            <div key={healer.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                {healer.avatar_url && (
                  <img src={healer.avatar_url} alt={healer.name} className="w-16 h-16 rounded-full" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{healer.name}</h3>
                  <p className="text-yellow-500">
                    ⭐ {healer.rating?.toFixed(1)} ({healer.review_count} reviews)
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{healer.bio}</p>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {healer.specializations?.map((spec) => (
                    <span key={spec} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-gray-800">Rs.{healer.hourly_rate}/hr</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
