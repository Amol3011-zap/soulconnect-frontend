import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';

export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      const response = await meetupAPI.listMeetups();
      setMeetups(response.data.meetups || []);
    } catch (err) {
      console.error('Error fetching meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading meetups...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Meetups</h1>

      {meetups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No meetups scheduled yet.</p>
          <p className="text-purple-600 font-semibold">More coming soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetups.map((meetup) => (
            <div key={meetup.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{meetup.title}</h3>
                  <p className="text-gray-600">📍 {meetup.location}</p>
                </div>
                <p className="text-yellow-500">⭐ {meetup.rating?.toFixed(1)}</p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{meetup.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(meetup.scheduled_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Attendees</p>
                  <p className="font-semibold text-gray-800">
                    {meetup.attendees}/{meetup.max_attendees}
                  </p>
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700">
                Join Meetup
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
