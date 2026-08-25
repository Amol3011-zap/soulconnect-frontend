import React from 'react';
import { motion } from 'motion/react';

/**
 * Skeleton Loaders for SoulConnect
 * Matches the glassmorphic dark theme
 */

/**
 * CardSkeleton: Generic card placeholder
 */
export function CardSkeleton({ height = 160 }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: 20,
        height,
        marginBottom: 16,
      }}
    />
  );
}

/**
 * ListSkeleton: Multiple card placeholders
 */
export function ListSkeleton({ count = 5, cardHeight = 160 }) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} height={cardHeight} />
      ))}
    </div>
  );
}

/**
 * TextLineSkeleton: Text content placeholder
 */
export function TextLineSkeleton({ width = '100%', height = 12 }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        background: 'rgba(167, 139, 250, 0.1)',
        borderRadius: 4,
        height,
        width,
        marginBottom: 8,
      }}
    />
  );
}

/**
 * StoriesSkeleton: Story cards with titles and content
 */
export function StoriesSkeleton({ count = 3 }) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: 'rgba(34, 18, 73, 0.72)',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
          }}
        >
          {/* Avatar + Title */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.2)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: 12,
                  background: 'rgba(167, 139, 250, 0.15)',
                  borderRadius: 4,
                  marginBottom: 6,
                  width: '60%',
                }}
              />
              <div
                style={{
                  height: 10,
                  background: 'rgba(167, 139, 250, 0.08)',
                  borderRadius: 4,
                  width: '40%',
                }}
              />
            </div>
          </div>

          {/* Content lines */}
          <div
            style={{
              height: 12,
              background: 'rgba(167, 139, 250, 0.1)',
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 12,
              background: 'rgba(167, 139, 250, 0.1)',
              borderRadius: 4,
              marginBottom: 8,
              width: '90%',
            }}
          />
          <div
            style={{
              height: 12,
              background: 'rgba(167, 139, 250, 0.1)',
              borderRadius: 4,
              width: '70%',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * MessagesSkeleton: Chat/message list
 */
export function MessagesSkeleton({ count = 5 }) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.2)',
              flexShrink: 0,
            }}
          />

          {/* Message content */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 12,
                background: 'rgba(167, 139, 250, 0.15)',
                borderRadius: 4,
                marginBottom: 6,
                width: '30%',
              }}
            />
            <div
              style={{
                height: 10,
                background: 'rgba(167, 139, 250, 0.1)',
                borderRadius: 4,
                width: '70%',
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * ChatSkeleton: Individual chat messages
 */
export function ChatSkeleton({ count = 10 }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => {
        const isUser = i % 2 === 0;
        return (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                borderRadius: 16,
                height: 40,
                width: `${30 + Math.random() * 40}%`,
                maxWidth: '70%',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * ProfileSkeleton: User profile placeholder
 */
export function ProfileSkeleton() {
  return (
    <div style={{ width: '100%' }}>
      {/* Cover + Avatar */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          height: 200,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 20,
          marginBottom: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -24,
            left: 20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '4px solid rgba(34, 18, 73, 0.72)',
          }}
        />
      </motion.div>

      {/* Info section */}
      <div style={{ marginTop: 40, paddingBottom: 20 }}>
        <TextLineSkeleton width="40%" height={16} />
        <TextLineSkeleton width="60%" height={12} />
      </div>

      {/* Content cards */}
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} height={120} />
        ))}
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton: Home page content
 */
export function DashboardSkeleton() {
  return (
    <div style={{ width: '100%', padding: '16px' }}>
      {/* Soul Climate Orb section */}
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.15)',
          margin: '0 auto 32px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      />

      {/* Sections */}
      <ListSkeleton count={4} cardHeight={140} />
    </div>
  );
}
