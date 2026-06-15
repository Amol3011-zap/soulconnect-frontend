import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';

const DEMO_MEETUPS = [
  {
    id: 1, title: 'Anxiety Support Circle', location_name: 'The Mindful Space, Bandra', city: 'Mumbai',
    description: 'A safe, anonymous group session for people managing anxiety. Share, listen, and heal together in a guided group setting.',
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 90, attendees: 5, max_attendees: 8, avg_rating: 4.8, review_count: 24,
    problem_type: 'anxiety', status: 'upcoming', icon: '😰', color: 'linear-gradient(135deg, #7c3aed, #2563eb)',
  },
  {
    id: 2, title: 'Grief & Loss — Finding Light', location_name: 'Heal Hub, Koramangala', city: 'Bangalore',
    description: 'A compassionate gathering for those navigating loss. Share memories, find solidarity, and begin the journey back to hope.',
    scheduled_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 120, attendees: 3, max_attendees: 6, avg_rating: 4.9, review_count: 18,
    problem_type: 'grief_loss', status: 'upcoming', icon: '🕯️', color: 'linear-gradient(135deg, #0891b2, #2563eb)',
  },
  {
    id: 3, title: 'Confidence & Self-Worth Workshop', location_name: 'Online (Zoom)', city: 'Online',
    description: 'Interactive workshop to rebuild confidence through peer exercises, group sharing, and practical techniques.',
    scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60, attendees: 11, max_attendees: 15, avg_rating: 4.7, review_count: 41,
    problem_type: 'lack_of_confidence', status: 'upcoming', icon: '💪', color: 'linear-gradient(135deg, #059669, #0891b2)',
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function SpotsBar({ current, max }) {
  const pct = (current / max) * 100;
  const left = max - current;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{current} joined</span>
        <span className={left <= 2 ? 'text-red-500 font-semibold' : 'text-gray-500'}>{left} spot{left !== 1 ? 's' : ''} left</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? '#ef4444' : 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
      </div>
    </div>
  );
}

export default function Meetups() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Online', 'Mumbai', 'Delhi', 'Bangalore'];

  useEffect(() => { fetchMeetups(); }, []);

  const fetchMeetups = async () => {
    try {
      const response = await meetupAPI.listMeetups();
      const data = response.data.meetups || [];
      setMeetups(data.length > 0 ? data : DEMO_MEETUPS);
    } catch {
      setMeetups(DEMO_MEETUPS);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (meetupId) => {
    setJoining(meetupId);
    try {
      await meetupAPI.joinMeetup(meetupId);
      setMeetups((prev) => prev.map((m) => m.id === meetupId ? { ...m, attendees: m.attendees + 1 } : m));
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #052533 0%, #1b4d69 50%, #0f3460 100%)' }}>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)', filter: 'blur(40px)' }} />
        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-cyan-200">Small Groups · Safe Space</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Peer Support Meetups</h1>
          <p className="text-cyan-200 text-sm max-w-md">
            Intimate group sessions of 6–15 people. Anonymous, judgment-free, facilitated by trained hosts.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[['8 max', 'Per group'], ['Anonymous', 'Always'], ['Free', 'to join']].map(([val, label]) => (
              <div key={label}>
                <div className="text-white font-bold text-lg">{val}</div>
                <div className="text-cyan-300 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-300'
              }`}
              style={filter === f ? { background: 'linear-gradient(135deg, #0891b2, #2563eb)' } : {}}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {meetups.map((meetup) => (
              <div key={meetup.id} className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-1.5" style={{ background: meetup.color || 'linear-gradient(135deg, #7c3aed, #2563eb)' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: meetup.color ? meetup.color.replace('135deg', '135deg') : '#ede9fe' }}>
                        {meetup.icon || '👥'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{meetup.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">📍 {meetup.location_name || meetup.city}</span>
                          {meetup.avg_rating > 0 && (
                            <span className="text-xs text-yellow-500 font-semibold">★ {meetup.avg_rating?.toFixed(1)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                      Upcoming
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{meetup.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(meetup.scheduled_time)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                      <p className="text-sm font-semibold text-gray-800">{meetup.duration_minutes} min</p>
                    </div>
                  </div>

                  <SpotsBar current={meetup.attendees || 0} max={meetup.max_attendees || 8} />

                  <button
                    onClick={() => handleJoin(meetup.id)}
                    disabled={joining === meetup.id || (meetup.attendees >= meetup.max_attendees)}
                    className="mt-4 w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: meetup.color || 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                    {joining === meetup.id
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Joining...</>
                      : meetup.attendees >= meetup.max_attendees ? 'Full — Join Waitlist' : 'Reserve My Spot →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
