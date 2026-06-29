import React from 'react';
import { motion } from 'motion/react';
import CompanionAvatar from './CompanionAvatar';
import CompanionActions from './CompanionActions';

/* ─────────────────────────────────────────────────────────
   AICompanionCard — Hero right card
   Props:
     firstName     — string
     greeting      — string ("Good Morning" | "Good Afternoon" | "Good Evening")
     checkedInDays — number (streak or recent days)
     onReflection  — () => void
     onCheckIn     — () => void
───────────────────────────────────────────────────────── */

function FloatingParticlesSmall() {
  const pts = [
    { id: 0, size: 2,   left: '8%',  top: '14%', dur: 9,  delay: 0,    opacity: 0.25, color: '#A78BFA' },
    { id: 1, size: 1.5, left: '88%', top: '10%', dur: 11, delay: 1.2,  opacity: 0.2,  color: '#F4C542' },
    { id: 2, size: 2.5, left: '18%', top: '75%', dur: 10, delay: 0.6,  opacity: 0.18, color: '#C4B5FD' },
    { id: 3, size: 1.5, left: '78%', top: '80%', dur: 13, delay: 2,    opacity: 0.22, color: '#A78BFA' },
    { id: 4, size: 2,   left: '50%', top: '88%', dur: 8,  delay: 0.4,  opacity: 0.15, color: '#F4C542' },
    { id: 5, size: 1.5, left: '65%', top: '22%', dur: 12, delay: 1.8,  opacity: 0.18, color: '#C4B5FD' },
    { id: 6, size: 2,   left: '35%', top: '6%',  dur: 10, delay: 3,    opacity: 0.16, color: '#A78BFA' },
    { id: 7, size: 1.5, left: '92%', top: '55%', dur: 14, delay: 0.9,  opacity: 0.14, color: '#F4C542' },
  ];
  return (
    <>
      {pts.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, opacity: p.opacity,
            left: p.left, top: p.top,
            animation: `companionParticleDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

export default function AICompanionCard({
  firstName = 'Friend',
  greeting  = 'Good Afternoon',
  checkedInDays = 0,
  onReflection,
  onCheckIn,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: 'linear-gradient(145deg, rgba(26,10,62,0.95) 0%, rgba(50,20,100,0.9) 55%, rgba(20,8,52,0.95) 100%)',
        border: '1px solid rgba(168,85,247,0.22)',
        borderRadius: 28,
        padding: '24px 22px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        minHeight: 340,
      }}
    >
      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <FloatingParticlesSmall />
      </div>

      {/* Top shine */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.35), rgba(244,197,66,0.2), transparent)',
      }} />

      {/* Background aurora blobs */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -30, left: -30,
        width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 65%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      {/* Card label */}
      <div style={{
        alignSelf: 'flex-start',
        fontSize: 11, fontWeight: 700,
        color: '#F4C542', textTransform: 'uppercase', letterSpacing: '0.1em',
        zIndex: 1,
      }}>
        🤖 AI COMPANION
      </div>

      {/* Floating avatar */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ zIndex: 1 }}
      >
        <CompanionAvatar size={148} />
      </motion.div>

      {/* Message block */}
      <div style={{ zIndex: 1, textAlign: 'center', paddingBottom: 2 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          {greeting} 👋
        </div>
        <p style={{ fontSize: 13, color: 'rgba(196,181,253,0.8)', margin: 0, lineHeight: 1.75, maxWidth: 280 }}>
          {checkedInDays > 0
            ? `You've checked in ${checkedInDays} day${checkedInDays > 1 ? 's' : ''} in a row.`
            : 'Today you came back again.'
          }<br />
          Small steps become lasting habits.<br />
          <span style={{ color: '#F4C542', fontWeight: 600 }}>I'm proud of you.</span>
        </p>
      </div>

      {/* Actions */}
      <div style={{ zIndex: 1, width: '100%' }}>
        <CompanionActions
          onReflection={onReflection}
          onCheckIn={onCheckIn}
        />
      </div>

      {/* Footer tagline */}
      <p style={{
        zIndex: 1,
        fontSize: 11, color: 'rgba(139,116,230,0.6)',
        margin: 0, textAlign: 'center', lineHeight: 1.5,
        fontStyle: 'italic',
      }}>
        Your companion remembers your progress and offers gentle guidance every day.
      </p>
    </motion.div>
  );
}
