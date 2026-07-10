import React from 'react';
import { motion } from 'motion/react';

export default function GuidePreview({ guide }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'rgba(34, 18, 73, 0.72)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Preview Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#FFF', fontSize: '14px', fontWeight: '600' }}>
          Preview
        </h3>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
          See how your guide will look
        </p>
      </div>

      {/* Preview Content */}
      <div style={{ padding: '24px', maxHeight: '600px', overflowY: 'auto' }}>
        {/* Featured Image */}
        {guide.featured_image_url && (
          <img
            src={guide.featured_image_url}
            alt={guide.title}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          />
        )}

        {/* Title */}
        <h1 style={{ margin: '0 0 12px 0', color: '#FFF', fontSize: '24px', fontWeight: '700' }}>
          {guide.title || 'Untitled Guide'}
        </h1>

        {/* Meta Description */}
        {guide.meta_description && (
          <p style={{ margin: '0 0 20px 0', color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
            {guide.meta_description}
          </p>
        )}

        {/* SEO Preview */}
        <div style={{
          padding: '16px',
          background: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '12px',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
            <strong>Search Preview</strong>
          </div>
          <div style={{ color: '#7C3AED', marginBottom: '4px', wordBreak: 'break-word' }}>
            soulconnect.health › guides › {guide.title?.toLowerCase().replace(/\s+/g, '-') || 'guide'}
          </div>
          <div style={{ color: '#FFF', marginBottom: '4px', fontWeight: '500', wordBreak: 'break-word' }}>
            {guide.seo_title || guide.title || 'Untitled'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', wordBreak: 'break-word' }}>
            {guide.meta_description || 'No description'}
          </div>
        </div>

        {/* Content Sections */}
        <div>
          {guide.content_json?.introduction && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#FFF', fontSize: '16px', fontWeight: '600' }}>
                Introduction
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.6' }}>
                {guide.content_json.introduction}
              </p>
            </div>
          )}

          {guide.content_json?.what_is && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#FFF', fontSize: '16px', fontWeight: '600' }}>
                What Is {guide.title}?
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.6' }}>
                {guide.content_json.what_is}
              </p>
            </div>
          )}

          {guide.content_json?.why_feel && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#FFF', fontSize: '16px', fontWeight: '600' }}>
                Why Do We Feel It?
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.6' }}>
                {guide.content_json.why_feel}
              </p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: guide.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
              color: guide.status === 'published' ? '#10B981' : '#A78BFA',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'capitalize',
            }}
          >
            {guide.status.replace('_', ' ')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
