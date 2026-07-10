import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, BookOpen, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [recentGuides, setRecentGuides] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const guidesRes = await api.get('/guides?limit=10');
      setRecentGuides(guidesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '18px' }}>Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '40px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', margin: '0 0 12px 0' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Manage content, users, and monitor platform health
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '48px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
            Loading dashboard...
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
              }}
            >
              {[
                { label: 'Total Guides', value: stats?.guides || 0, icon: BookOpen, color: '#7C3AED' },
                { label: 'Active Users', value: stats?.users || 0, icon: Users, color: '#8B5CF6' },
                { label: 'Categories', value: 25, icon: TrendingUp, color: '#A855F7' },
                { label: 'Total Assessments', value: stats?.assessments || 0, icon: BarChart3, color: '#D946EF' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4 }}
                    style={{
                      padding: '24px',
                      background: 'rgba(34, 18, 73, 0.72)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 8px 0', fontWeight: '500' }}>
                          {stat.label}
                        </p>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#A78BFA', margin: 0 }}>
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </div>
                      </div>
                      <Icon
                        size={24}
                        style={{ color: stat.color, opacity: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Tabs */}
            <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              {['overview', 'guides', 'users', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px',
                    background: activeTab === tab ? 'rgba(124, 58, 237, 0.2)' : 'none',
                    border: activeTab === tab ? 'none' : 'none',
                    borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                    color: activeTab === tab ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 20px 0' }}>
                    Recent Activity
                  </h3>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {recentGuides.slice(0, 5).map((guide, idx) => (
                      <motion.div
                        key={guide.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          padding: '16px',
                          background: 'rgba(34, 18, 73, 0.72)',
                          backdropFilter: 'blur(24px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', margin: '0 0 4px 0' }}>
                            {guide.title}
                          </h4>
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                            {guide.status.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={14} />
                            {guide.view_count || 0}
                          </div>
                          <span>{new Date(guide.created_at).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'guides' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 20px 0' }}>
                    Guide Management
                  </h3>

                  <div style={{
                    padding: '32px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>Guide management tools coming soon</p>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 20px 0' }}>
                    User Management
                  </h3>

                  <div style={{
                    padding: '32px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>User management tools coming soon</p>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 20px 0' }}>
                    Platform Analytics
                  </h3>

                  <div style={{
                    padding: '32px',
                    background: 'rgba(34, 18, 73, 0.72)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    <BarChart3 size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', margin: 0 }}>Analytics dashboard coming soon</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
