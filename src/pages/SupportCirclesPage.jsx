import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Heart, MessageCircle, Plus, User2 } from 'lucide-react';

const SUPPORT_CIRCLES = [
  {
    id: 1,
    name: 'Anxiety Support Circle',
    description: 'A safe space for people managing anxiety together',
    members: 342,
    category: 'Anxiety',
    emoji: '🧠',
    isJoined: false,
    posts: 128,
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sleep Warriors',
    description: 'Support group for better sleep and rest',
    members: 287,
    category: 'Sleep',
    emoji: '🌙',
    isJoined: true,
    posts: 95,
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'Grief and Loss',
    description: 'A compassionate community for grieving',
    members: 156,
    category: 'Grief',
    emoji: '💔',
    isJoined: false,
    posts: 67,
    lastActive: '3 hours ago',
  },
  {
    id: 4,
    name: 'Stress Busters',
    description: 'Practical strategies and support for stress relief',
    members: 425,
    category: 'Stress',
    emoji: '⚡',
    isJoined: false,
    posts: 203,
    lastActive: 'Now',
  },
  {
    id: 5,
    name: 'Self-Love Journey',
    description: 'Building self-esteem and self-compassion',
    members: 198,
    category: 'Self-Esteem',
    emoji: '💚',
    isJoined: true,
    posts: 82,
    lastActive: '30 minutes ago',
  },
  {
    id: 6,
    name: 'Relationship Wellness',
    description: 'Support for healthy relationships and boundaries',
    members: 267,
    category: 'Relationships',
    emoji: '👥',
    isJoined: false,
    posts: 145,
    lastActive: '10 minutes ago',
  },
];

export default function SupportCirclesPage() {
  const [circles, setCircles] = useState(SUPPORT_CIRCLES);
  const [filter, setFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  const handleJoin = (circleId) => {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === circleId ? { ...c, isJoined: !c.isJoined } : c
      )
    );
  };

  const filteredCircles = circles.filter((circle) => {
    const matchesFilter = filter === 'all' || (filter === 'joined' && circle.isJoined) || (filter === 'browse' && !circle.isJoined);
    const matchesSearch = circle.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      circle.category.toLowerCase().includes(searchInput.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const joinedCount = circles.filter((c) => c.isJoined).length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '64px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#FFF', margin: '0 0 16px 0' }}>
              Support Circles
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: '0 0 32px 0', maxWidth: '600px' }}>
              Connect with others on similar emotional journeys in a safe, supportive community
            </p>

            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(34, 18, 73, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              maxWidth: '500px',
            }}>
              <MessageCircle size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
              <input
                type="text"
                placeholder="Search circles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#FFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {[
              { label: 'Your Circles', value: joinedCount, icon: '👥' },
              { label: 'Total Members', value: circles.reduce((sum, c) => sum + c.members, 0).toLocaleString(), icon: '💜' },
              { label: 'Active Discussions', value: circles.reduce((sum, c) => sum + c.posts, 0), icon: '💬' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                style={{
                  padding: '24px',
                  background: 'rgba(34, 18, 73, 0.72)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#A78BFA', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
            {['all', 'joined', 'browse'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  background: filter === f ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: filter === f ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: filter === f ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {f === 'all' && 'All Circles'}
                {f === 'joined' && 'My Circles'}
                {f === 'browse' && 'Browse All'}
              </button>
            ))}
          </div>

          {/* Circles Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredCircles.map((circle, index) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                style={{
                  padding: '28px',
                  background: 'rgba(34, 18, 73, 0.72)',
                  backdropFilter: 'blur(24px)',
                  border: circle.isJoined ? '2px solid #7C3AED' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                    {circle.emoji}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 8px 0' }}>
                    {circle.name}
                  </h3>
                  {circle.isJoined && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        background: '#7C3AED20',
                        color: '#A78BFA',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Joined
                    </div>
                  )}

                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    {circle.description}
                  </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px',
                      color: 'rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Users size={14} />
                    {circle.members} members
                  </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px',
                      color: 'rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <MessageCircle size={14} />
                    {circle.posts} posts
                  </div>
                </div>

                {/* Last Active */}
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Active {circle.lastActive}
                </p>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoin(circle.id)}
                  style={{
                    marginTop: 'auto',
                    padding: '10px 16px',
                    background: circle.isJoined ? 'rgba(124, 58, 237, 0.2)' : 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                    color: '#FFF',
                    border: circle.isJoined ? '1px solid rgba(124, 58, 237, 0.5)' : 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {circle.isJoined ? (
                    <>
                      <Heart size={14} fill="currentColor" />
                      In Circle
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Join Circle
                    </>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCircles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '64px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: '0 0 8px 0' }}>
                {searchInput ? 'No circles found' : 'No circles match your filters'}
              </p>
              <p style={{ fontSize: '13px', margin: 0 }}>
                {searchInput ? `Try different search terms` : 'Explore and join communities'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
