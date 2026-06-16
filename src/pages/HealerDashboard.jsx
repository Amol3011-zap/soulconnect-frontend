import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import ThemeToggle from '../components/ThemeToggle';

// ── Demo healing requests ──────────────────────────────────────────────────────
const DEMO_REQUESTS = [
  {
    id: 'req_001',
    userCode: 'SC#4821',
    age: 24, gender: 'Female', city: 'Mumbai',
    primaryProblem: 'Anxiety & Panic Attacks',
    problemIcon: '😰',
    details: 'Experiencing severe social anxiety, overthinking spirals before any social situation. Been going on for 2 years. Looking for CBT-based support.',
    preferredSession: 'Video',
    preferredLanguages: ['English', 'Hindi'],
    urgency: 'high',
    requestedAt: '10 min ago',
  },
  {
    id: 'req_002',
    userCode: 'SC#2197',
    age: 31, gender: 'Male', city: 'Bangalore',
    primaryProblem: 'Depression',
    problemIcon: '😢',
    details: 'Feeling persistently low for the past 6 months. Loss of interest in work and hobbies. Tried self-help but needs professional guidance now.',
    preferredSession: 'Video',
    preferredLanguages: ['English'],
    urgency: 'medium',
    requestedAt: '1h ago',
  },
  {
    id: 'req_003',
    userCode: 'SC#9043',
    age: 27, gender: 'Female', city: 'Delhi',
    primaryProblem: 'Grief & Loss',
    problemIcon: '🕯️',
    details: 'Lost a parent 3 months ago. Struggling to process grief while managing work responsibilities. First time seeking professional support.',
    preferredSession: 'Chat',
    preferredLanguages: ['English', 'Hindi'],
    urgency: 'medium',
    requestedAt: '2h ago',
  },
  {
    id: 'req_004',
    userCode: 'SC#6612',
    age: 19, gender: 'Male', city: 'Pune',
    primaryProblem: 'Low Confidence & Loneliness',
    problemIcon: '📉',
    details: 'First year of college, feeling isolated and extremely low confidence. Struggling to make friends and keep up with coursework.',
    preferredSession: 'Video',
    preferredLanguages: ['English', 'Marathi'],
    urgency: 'low',
    requestedAt: '3h ago',
  },
  {
    id: 'req_005',
    userCode: 'SC#3387',
    age: 38, gender: 'Female', city: 'Hyderabad',
    primaryProblem: 'Work & Career Stress',
    problemIcon: '💼',
    details: 'Burnout from a high-pressure corporate job. Panic attacks before presentations. Needs coping strategies and stress management.',
    preferredSession: 'Video',
    preferredLanguages: ['English', 'Telugu'],
    urgency: 'high',
    requestedAt: '5h ago',
  },
];

// ── Available time slots ───────────────────────────────────────────────────────
const TIME_SLOTS = {
  today: [
    { id: 't1', label: 'Today 3:00 PM', time: '15:00', period: 'Afternoon' },
    { id: 't2', label: 'Today 5:00 PM', time: '17:00', period: 'Evening' },
    { id: 't3', label: 'Today 7:00 PM', time: '19:00', period: 'Evening' },
  ],
  tomorrow: [
    { id: 'tm1', label: 'Tomorrow 10:00 AM', time: '10:00', period: 'Morning' },
    { id: 'tm2', label: 'Tomorrow 12:00 PM', time: '12:00', period: 'Afternoon' },
    { id: 'tm3', label: 'Tomorrow 4:00 PM', time: '16:00', period: 'Afternoon' },
    { id: 'tm4', label: 'Tomorrow 6:00 PM', time: '18:00', period: 'Evening' },
  ],
  dayAfter: [
    { id: 'da1', label: 'Thu 11:00 AM', time: '11:00', period: 'Morning' },
    { id: 'da2', label: 'Thu 2:00 PM', time: '14:00', period: 'Afternoon' },
    { id: 'da3', label: 'Thu 5:00 PM', time: '17:00', period: 'Evening' },
  ],
};

const URGENCY_CONFIG = {
  high:   { label: 'Urgent', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  medium: { label: 'Moderate', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  low:    { label: 'Not urgent', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
};

// ── Single request card ────────────────────────────────────────────────────────
function RequestCard({ request, onAccept, onDecline, accepted, declined }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const urgency = URGENCY_CONFIG[request.urgency];

  if (declined) {
    return (
      <div className="rounded-2xl p-4 border text-center" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Request from {request.userCode} declined.</p>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="rounded-2xl p-5 border" style={{ background: 'rgba(5,150,105,0.06)', borderColor: 'rgba(5,150,105,0.3)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: 'rgba(5,150,105,0.12)' }}>✅</div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Session confirmed with {request.userCode}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {request.primaryProblem} · {accepted}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

      {/* Urgency bar */}
      <div className="h-1" style={{ background: urgency.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'var(--bg-subtle)' }}>
              {request.problemIcon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{request.userCode}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: urgency.bg, color: urgency.color }}>
                  {urgency.label}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {request.age}y · {request.gender} · {request.city} · {request.requestedAt}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'linear-gradient(135deg,rgba(8,145,178,0.12),rgba(37,99,235,0.08))', color: '#0891b2' }}>
            {request.preferredSession}
          </span>
        </div>

        {/* Problem */}
        <div className="mb-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-subtle)' }}>
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Primary concern</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{request.primaryProblem}</p>
        </div>

        {/* Details (collapsible) */}
        <div className="mb-3">
          <p className={`text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
            style={{ color: 'var(--text-secondary)' }}>
            {request.details}
          </p>
          {request.details.length > 80 && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold mt-1 hover:opacity-70 transition-opacity"
              style={{ color: '#0891b2' }}>
              {expanded ? 'Show less ↑' : 'Read more ↓'}
            </button>
          )}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Speaks:</span>
          {request.preferredLanguages.map(lang => (
            <span key={lang} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
              {lang}
            </span>
          ))}
        </div>

        {/* Time slot picker */}
        <div className="mb-4">
          <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Choose your available slot</p>
          <div className="space-y-2">
            {Object.entries(TIME_SLOTS).map(([group, slots]) => (
              <div key={group}>
                <p className="text-xs font-medium mb-1 capitalize" style={{ color: 'var(--text-muted)' }}>
                  {group === 'today' ? 'Today' : group === 'tomorrow' ? 'Tomorrow' : 'Day after'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {slots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button key={slot.id}
                        onClick={() => setSelectedSlot(isSelected ? null : slot)}
                        className="text-xs px-3 py-1.5 rounded-xl font-medium border transition-all"
                        style={isSelected
                          ? { background: 'linear-gradient(135deg,#0891b2,#2563eb)', color: 'white', borderColor: 'transparent' }
                          : { background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }
                        }>
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {!selectedSlot && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Select a slot to accept this request</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDecline(request.id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
            style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            Decline
          </button>
          <button
            onClick={() => selectedSlot && onAccept(request.id, selectedSlot.label)}
            disabled={!selectedSlot}
            className="flex-2 flex-grow py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#0891b2,#2563eb)' }}>
            Accept → {selectedSlot ? selectedSlot.label : 'Pick a slot first'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Healer Dashboard ──────────────────────────────────────────────────────
export default function HealerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [acceptedRequests, setAcceptedRequests] = useState({});
  const [declinedRequests, setDeclinedRequests] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const healerName = user?.name || 'Healer';
  const pendingCount = DEMO_REQUESTS.filter(r => !acceptedRequests[r.id] && !declinedRequests.has(r.id)).length;

  const onAccept = (id, slotLabel) => {
    setAcceptedRequests(prev => ({ ...prev, [id]: slotLabel }));
  };

  const onDecline = (id) => {
    setDeclinedRequests(prev => new Set([...prev, id]));
  };

  const filteredRequests = DEMO_REQUESTS.filter(r => {
    if (filter === 'accepted') return acceptedRequests[r.id];
    if (filter === 'declined') return declinedRequests.has(r.id);
    if (filter === 'pending') return !acceptedRequests[r.id] && !declinedRequests.has(r.id);
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--nav-bg)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #0891b2, #2563eb)' }}>🧘</div>
            <div>
              <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>SoulConnect</span>
              <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>Healer Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {pendingCount} new {pendingCount === 1 ? 'request' : 'requests'}
              </div>
            )}
            <ThemeToggle />
            <button onClick={() => { logout(); navigate('/'); }}
              className="text-xs px-3 py-1.5 rounded-xl font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-subtle)' }}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* Welcome row */}
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text)' }}>
            Welcome back, {healerName} 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Review healing requests and confirm your availability for each session.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Pending', value: DEMO_REQUESTS.filter(r => !acceptedRequests[r.id] && !declinedRequests.has(r.id)).length, color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
            { label: 'Accepted', value: Object.keys(acceptedRequests).length, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            { label: 'Declined', value: declinedRequests.size, color: '#6b7280', bg: 'var(--bg-subtle)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-2xl p-4 text-center border"
              style={{ background: bg, borderColor: 'var(--border)' }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 mb-5 p-1 rounded-2xl w-fit"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'declined', label: 'Declined' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={filter === key
                ? { background: 'linear-gradient(135deg,#0891b2,#2563eb)', color: 'white' }
                : { color: 'var(--text-secondary)' }
              }>
              {label}
            </button>
          ))}
        </div>

        {/* Request list */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🌿</div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>No requests here</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>New healing requests will appear here when they come in.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                onAccept={onAccept}
                onDecline={onDecline}
                accepted={acceptedRequests[request.id]}
                declined={declinedRequests.has(request.id)}
              />
            ))}
          </div>
        )}

        {/* Info note at the bottom */}
        <div className="mt-8 rounded-2xl p-4 flex items-start gap-3 border"
          style={{ background: 'rgba(8,145,178,0.06)', borderColor: 'rgba(8,145,178,0.2)' }}>
          <span className="text-lg shrink-0">ℹ️</span>
          <div>
            <p className="text-xs font-bold mb-0.5" style={{ color: '#0891b2' }}>About these requests</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              User identities are anonymised for privacy. Once you accept a session, the user will be notified and a secure video/chat link will be shared with both parties. If a session is urgent, please prioritise it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
