import React, { useState, useEffect } from 'react';
import { matchAPI } from '../services/api';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await matchAPI.findMatches();
      setMatches(response.data.matches || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await matchAPI.acceptMatch(userId);
      setMatches(matches.filter((m) => m.id !== userId));
      alert('Match accepted! You can now chat.');
    } catch (err) {
      console.error('Error accepting match:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin text-4xl mb-4">🔄</div>
        <p>Finding your match...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Match</h1>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No matches found yet.</p>
          <p className="text-gray-500">Come back in a few minutes!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{match.name}</h3>
                  <p className="text-gray-600">{match.distance_km}km away • {match.city}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{match.match_score}%</div>
                  <p className="text-sm text-gray-500">Match</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{match.match_reason}</p>
                {match.problem_context && (
                  <p className="text-gray-600 italic text-sm">"{match.problem_context}"</p>
                )}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  Skip
                </button>
                <button
                  onClick={() => handleAccept(match.id)}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
