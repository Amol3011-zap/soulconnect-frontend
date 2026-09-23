/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLES — extracted verbatim from Home.jsx
───────────────────────────────────────────────────────────────────────────── */
export default function FloatingParticles({ count = 14 }) {
  // Skip all particles on mobile — 14 simultaneous CSS animations cause repaints
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  if (isMobile) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 1.5 + (i % 3) * 0.8,
    left: `${(i * 7.3 + 8) % 92}%`,
    top:  `${(i * 11.7 + 4) % 88}%`,
    duration: 8 + (i % 6) * 1.8,
    delay: i * 0.55,
    opacity: 0.12 + (i % 4) * 0.05,
    color: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#F4C542' : '#C4B5FD',
  }));
  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            left: p.left, top: p.top,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}
