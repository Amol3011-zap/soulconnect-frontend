import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SearchInput from './SearchInput';
import SearchCategory from './SearchCategory';

const MOCK_DATA = {
  people: [
    { id: 1, name: 'Aarav',  sub: 'Soul Traveler',   avatar: 'A',  avatarColor: '#7C3AED', route: '/community' },
    { id: 2, name: 'Ananya', sub: 'Healing Journey',  avatar: 'An', avatarColor: '#D97706', route: '/community' },
    { id: 3, name: 'Riya',   sub: 'Mindful Living',   avatar: 'R',  avatarColor: '#059669', route: '/community' },
    { id: 4, name: 'Arjun',  sub: 'Inner Peace',      avatar: 'Ar', avatarColor: '#0891B2', route: '/community' },
  ],
  circles: [
    { id: 1, name: 'Anxiety Support',    sub: '234 members', emoji: '💙', route: '/community' },
    { id: 2, name: 'Meditation Circle',  sub: '512 members', emoji: '🧘', route: '/meditate'  },
    { id: 3, name: 'Overthinking',       sub: '189 members', emoji: '🌀', route: '/community' },
    { id: 4, name: 'Grief & Loss',       sub: '97 members',  emoji: '🌿', route: '/community' },
  ],
  professionals: [
    { id: 1, name: 'Dr. Meera Sharma', sub: 'Therapist · 4.9★',    avatar: 'M', avatarColor: '#7C3AED', route: '/professionals' },
    { id: 2, name: 'Dr. Rahul Patel',  sub: 'Counselor · 4.8★',    avatar: 'R', avatarColor: '#0891B2', route: '/professionals' },
    { id: 3, name: 'Dr. Priya Nair',   sub: 'Psychologist · 4.7★', avatar: 'P', avatarColor: '#D97706', route: '/professionals' },
  ],
  stories: [
    { id: 1, name: 'Small Steps Matter',     sub: 'by Aarav · 2h ago',     emoji: '🌱', route: '/stories' },
    { id: 2, name: 'Finding Hope Again',     sub: 'by Ananya · 5h ago',    emoji: '🌤', route: '/stories' },
    { id: 3, name: 'The Art of Letting Go',  sub: 'by Riya · Yesterday',   emoji: '🍃', route: '/stories' },
    { id: 4, name: 'I Finally Said No',      sub: 'by Anonymous · 3h ago', emoji: '💜', route: '/stories' },
  ],
};

function filterData(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return {
    people:        MOCK_DATA.people.filter(i => i.name.toLowerCase().includes(q)),
    circles:       MOCK_DATA.circles.filter(i => i.name.toLowerCase().includes(q)),
    professionals: MOCK_DATA.professionals.filter(i => i.name.toLowerCase().includes(q)),
    stories:       MOCK_DATA.stories.filter(i => i.name.toLowerCase().includes(q)),
  };
}

function hasResults(results) {
  return results && Object.values(results).some(arr => arr.length > 0);
}

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const results = filterData(query);
  const showDefault = !query.trim();

  useEffect(() => {
    if (!isOpen) { setQuery(''); return; }
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(4,2,20,0.78)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Centering shell */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2001,
            display: 'flex', justifyContent: 'center',
            padding: '56px 16px 0',
            pointerEvents: 'none',
          }}>
            <motion.div
              key="search-modal"
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                width: '100%', maxWidth: 560,
                maxHeight: '76vh',
                background: 'linear-gradient(145deg, rgba(22,10,54,0.99) 0%, rgba(40,18,88,0.97) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(168,85,247,0.25)',
                borderRadius: 24,
                padding: '20px 20px 12px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.18)',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                position: 'relative',
              }}
            >
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, #7C3AED, #A855F7, #F4C542, transparent)',
                borderRadius: '24px 24px 0 0',
              }} />

              <SearchInput value={query} onChange={setQuery} onClear={() => setQuery('')} />

              {/* Default state */}
              {showDefault && (
                <>
                  <div style={{
                    fontSize: 11, color: '#8A84B6', fontWeight: 500,
                    padding: '0 12px', marginBottom: 12,
                  }}>
                    Suggested
                  </div>
                  <SearchCategory label="People"      items={MOCK_DATA.people.slice(0, 3)}        onClose={onClose} />
                  <SearchCategory label="Circles"     items={MOCK_DATA.circles.slice(0, 2)}       onClose={onClose} />
                  <SearchCategory label="Soul Stories" items={MOCK_DATA.stories.slice(0, 2)}      onClose={onClose} />
                </>
              )}

              {/* Results */}
              {!showDefault && hasResults(results) && (
                <>
                  <SearchCategory label="People"        items={results.people}        onClose={onClose} />
                  <SearchCategory label="Circles"       items={results.circles}       onClose={onClose} />
                  <SearchCategory label="Professionals" items={results.professionals} onClose={onClose} />
                  <SearchCategory label="Soul Stories"  items={results.stories}       onClose={onClose} />
                </>
              )}

              {/* No results */}
              {!showDefault && !hasResults(results) && (
                <div style={{ textAlign: 'center', padding: '28px 0 16px', color: '#8A84B6' }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#B8B4D8', marginBottom: 4 }}>
                    No results found
                  </div>
                  <div style={{ fontSize: 12 }}>Try a different search term</div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
