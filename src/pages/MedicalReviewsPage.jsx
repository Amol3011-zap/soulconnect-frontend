import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function MedicalReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/medical-reviews/pending');
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReview) return;

    try {
      setSubmitting(true);
      await api.post(`/medical-reviews/${selectedReview.id}/approve`);
      setReviews(reviews.filter((r) => r.id !== selectedReview.id));
      setSelectedReview(null);
      setComments('');
    } catch (error) {
      console.error('Failed to approve review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReview) return;

    try {
      setSubmitting(true);
      await api.post(`/medical-reviews/${selectedReview.id}/reject`, {
        comments,
      });
      setReviews(reviews.filter((r) => r.id !== selectedReview.id));
      setSelectedReview(null);
      setComments('');
    } catch (error) {
      console.error('Failed to reject review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}>
      {/* Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', color: '#FFF', margin: 0 }}>
          Medical Reviews
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '8px 0 0 0' }}>
          Review guides for medical accuracy and approve for publication
        </p>
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedReview ? '1fr 1fr' : '1fr', gap: '32px', padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Reviews List */}
        <div>
          <h2 style={{ color: '#A78BFA', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Pending Reviews ({reviews.length})
          </h2>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
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
              <CheckCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>All caught up!</p>
              <p style={{ fontSize: '14px' }}>No pending reviews at the moment</p>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  whileHover={{ y: -2 }}
                  style={{
                    padding: '16px',
                    background: selectedReview?.id === review.id ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: selectedReview?.id === review.id ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <AlertCircle size={20} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 4px 0', color: '#FFF', fontSize: '14px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {review.guide_title}
                      </h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                        Submitted {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Review Detail */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(34, 18, 73, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              position: 'sticky',
              top: '32px',
            }}
          >
            <h2 style={{ color: '#FFF', fontSize: '20px', fontWeight: '600', marginBottom: '24px', margin: 0 }}>
              {selectedReview.guide_title}
            </h2>

            {/* Guide Content Preview */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ fontSize: '12px', color: '#A78BFA', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Guide Content
              </h3>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                <p>
                  This is where the full guide content would display for medical review. The reviewer should verify:
                </p>
                <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
                  <li>Medical accuracy of all claims</li>
                  <li>Evidence-based recommendations</li>
                  <li>Appropriate disclaimers</li>
                  <li>No harmful advice</li>
                  <li>Professional tone</li>
                </ul>
              </div>
            </div>

            {/* Reviewer Comments */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '500' }}>
                Reviewer Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments or concerns..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <motion.button
                onClick={handleReject}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: submitting ? 0.5 : 1,
                }}
              >
                <XCircle size={16} />
                {submitting ? 'Processing...' : 'Request Revisions'}
              </motion.button>

              <motion.button
                onClick={handleApprove}
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  border: 'none',
                  color: '#FFF',
                  borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: submitting ? 0.5 : 1,
                }}
              >
                <CheckCircle size={16} />
                {submitting ? 'Processing...' : 'Approve'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
