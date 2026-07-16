import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useCmsStore } from '../store/cms';
import api from '../services/api';

export default function CmsDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGuides();
  }, [filter]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cms/dashboard');
      setGuides(response.data || []);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#10B981';
      case 'draft':
        return '#8B5CF6';
      case 'in_review':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle size={16} />;
      case 'in_review':
        return <Clock size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleCreateGuide = () => {
    navigate('/cms/editor', { state: { mode: 'create' } });
  };

  const handleEditGuide = (guide) => {
    useCmsStore.setState({ currentGuide: guide });
    navigate(`/cms/editor/${guide.id}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#FFF', marginBottom: '8px' }}>
              Content Management
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              Manage guides, submit for review, and track published content
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Create Button & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['all', 'draft', 'in_review', 'published'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === f ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#A78BFA' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
              >
                {f.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <motion.button
            onClick={handleCreateGuide}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
              color: '#FFF',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Plus size={18} />
            New Guide
          </motion.button>
        </div>

        {/* Guides List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '14px' }}>Loading guides...</div>
          </div>
        ) : guides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '48px',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>No guides yet</p>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>Create your first guide to get started</p>
            <button
              onClick={handleCreateGuide}
              style={{
                padding: '10px 20px',
                background: 'rgba(124, 58, 237, 0.3)',
                border: '1px solid rgba(124, 58, 237, 0.5)',
                color: '#A78BFA',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Create Guide
            </button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleEditGuide(guide)}
                style={{
                  padding: '20px',
                  background: 'rgba(34, 18, 73, 0.72)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                whileHover={{ y: -4, borderColor: 'rgba(124, 58, 237, 0.5)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', margin: 0 }}>
                        {guide.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          background: `${getStatusColor(guide.status)}20`,
                          color: getStatusColor(guide.status),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        {getStatusIcon(guide.status)}
                        {guide.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0' }}>
                      {guide.excerpt || 'No description'}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>Category: {guide.category_name}</span>
                      <span>Views: {guide.view_count || 0}</span>
                      {guide.published_at && (
                        <span>Published: {new Date(guide.published_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGuide(guide);
                      }}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(124, 58, 237, 0.2)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        color: '#A78BFA',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
