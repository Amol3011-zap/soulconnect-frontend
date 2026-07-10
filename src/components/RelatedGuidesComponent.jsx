import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function RelatedGuidesComponent({ guideId }) {
  const navigate = useNavigate();
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedGuides();
  }, [guideId]);

  const fetchRelatedGuides = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/seo/internal-links/${guideId}`);
      setRelatedGuides(res.data?.slice(0, 4) || []);
    } catch (error) {
      console.error('Failed to fetch related guides:', error);
      setRelatedGuides([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        position: 'sticky',
        top: '32px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
        Related Guides
      </h3>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Loading...</div>
      ) : relatedGuides.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
          No related guides yet
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {relatedGuides.map((guide) => (
            <motion.button
              key={guide.to_guide_id}
              onClick={() => navigate(`/guides/${guide.target_slug}`)}
              whileHover={{ x: 4 }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFF',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {guide.target_title}
              </span>
              <ArrowRight size={14} style={{ flexShrink: 0 }} />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
