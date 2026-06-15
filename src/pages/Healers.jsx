import React, { useState, useEffect } from 'react';
import { healerAPI } from '../services/api';

const DEMO_HEALERS = [
  {
    id: 1, name: 'Dr. Priya Sharma', avatar_url: null, initials: 'PS',
    specializations: ['Anxiety & Panic', 'Depression', 'Trauma & PTSD'],
    bio: 'Clinical psychologist with 8 years of experience helping people overcome anxiety, depression, and trauma using evidence-based CBT and mindfulness approaches.',
    hourly_rate: 1200, total_rating: 4.9, review_count: 134, experience_years: 8,
    session_type: 'Video & Chat', languages: ['English', 'Hindi'],
    badge: 'Top Rated', badge_color: '#f59e0b',
  },
  {
    id: 2, name: 'Rahul Mehta', avatar_url: null, initials: 'RM',
    specializations: ['Relationships', 'Grief & Loss', 'Life Transitions'],
    bio: 'Certified counsellor specialising in relationship issues, grief processing, and life transitions. I create a warm, judgment-free space for you to heal.',
    hourly_rate: 800, total_rating: 4.7, review_count: 89, experience_years: 5,
    session_type: 'Video', languages: ['English', 'Hindi', 'Marathi'],
    badge: 'Most Popular', badge_color: '#7c3aed',
  },
  {
    id: 3, name: 'Meera Nair', avatar_url: null, initials: 'MN',
    specializations: ['Mindfulness', 'Sleep Issues', 'Anger Management'],
    bio: 'Yoga therapist and mindfulness coach blending ancient wisdom with modern psychology. Specialised in stress, sleep disorders, and emotional regulation.',
    hourly_rate: 600, total_rating: 4.8, review_count: 67, experience_years: 6,
    session_type: 'Video & In-person', languages: ['English', 'Malayalam', 'Hindi'],
    badge: 'New', badge_color: '#10b981',
  },
];

const GRAD_COLORS = [
  'linear-gradient(135deg, #7c3aed, #2563eb)',
  'linear-gradient(135deg, #0891b2, #2563eb)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #dc2626)',
];

function HealerCard({ healer, index }) {
  const grad = GRAD_COLORS[index % GRAD_COLORS.length];
  return (
    <div className="rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      {/* Top gradient bar */}
      <div className="h-1.5" style={{ background: grad }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ background: grad }}>
            {healer.avatar_url
              ? <img src={healer.avatar_url} alt={healer.name} className="w-full h-full rounded-2xl object-cover" />
              : healer.initials || healer.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{healer.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-semibold text-gray-700">{healer.total_rating?.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({healer.review_count} reviews)</span>
                </div>
              </div>
              {healer.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                  style={{ background: healer.badge_color || '#7c3aed' }}>
                  {healer.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{healer.bio}</p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(healer.specializations || []).slice(0, 3).map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium">
              {s}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Experience', value: `${healer.experience_years || '?'} yrs` },
            { label: 'Session', value: healer.session_type || 'Video' },
            { label: 'Languages', value: (healer.languages || ['English']).slice(0, 2).join(', ') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">₹{healer.hourly_rate}</span>
            <span className="text-xs text-gray-400 ml-1">/session</span>
          </div>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
            style={{ background: grad }}>
            Book Session →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Healers() {
  const [healers, setHealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Anxiety', 'Depression', 'Relationships', 'Trauma', 'Mindfulness'];

  useEffect(() => {
    fetchHealers();
  }, []);

  const fetchHealers = async () => {
    try {
      const response = await healerAPI.listHealers();
      const data = response.data.healers || [];
      setHealers(data.length > 0 ? data : DEMO_HEALERS);
    } catch {
      setHealers(DEMO_HEALERS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #0f3460 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(40px)' }} />
        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="text-xs font-semibold text-purple-200">Verified Professionals</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Healer</h1>
          <p className="text-purple-200 text-sm max-w-md">
            Connect with verified therapists, counsellors, and wellness practitioners who specialise in your area of need.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[['500+', 'Healers'], ['4.8★', 'Avg Rating'], ['10K+', 'Sessions']].map(([val, label]) => (
              <div key={label}>
                <div className="text-white font-bold text-lg">{val}</div>
                <div className="text-purple-300 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f ? 'text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300'
              }`}
              style={filter === f ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : {}}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {healers.map((healer, i) => (
              <HealerCard key={healer.id} healer={healer} index={i} />
            ))}
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-8 rounded-2xl p-6 flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Are you a healer or therapist?</h3>
            <p className="text-sm text-gray-600">Join our verified network and reach thousands of people who need your help.</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 rounded-xl font-semibold text-white text-sm hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
