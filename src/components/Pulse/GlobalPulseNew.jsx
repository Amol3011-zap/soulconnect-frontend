import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SUPPORT_OPTIONS } from '../../data/pulseExperienceData';
import { fetchGlobalPulse, submitCheckIn } from '../../data/pulseDataAdapter';
import { getLocaleCountryHint } from '../../lib/localeCountry';
import PulseMapStage from './PulseMapStage';
import PulseStatsPanel from './PulseStatsPanel';
import './globalPulse.css';

const P = '#7C3AED';
const LAV = '#A78BFA';

function GlobalPulseNew({ problems, support, onNavigate }) {
  const [selectedIso, setSelectedIso] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const hasSubmitted = useRef(false);
  const supportOption = SUPPORT_OPTIONS.find((s) => s.id === support);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Record this check-in first so it's reflected in the aggregate the
      // user is about to see, then load the real snapshot. Fire-and-forget
      // on failure — a failed check-in shouldn't block viewing the pulse.
      if (!hasSubmitted.current) {
        hasSubmitted.current = true;
        try {
          await submitCheckIn(problems, getLocaleCountryHint(), null);
        } catch {
          // Non-fatal: the user still gets to see the global snapshot.
        }
      }

      try {
        const data = await fetchGlobalPulse();
        if (!cancelled) {
          setSnapshot(data);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || 'Could not load Global Pulse data.');
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [problems]);

  const handleNavigate = () => {
    onNavigate(supportOption.route);
  };

  const handleRetry = () => {
    setLoadError(null);
    setSnapshot(null);
    fetchGlobalPulse()
      .then(setSnapshot)
      .catch((err) => setLoadError(err?.message || 'Could not load Global Pulse data.'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
      }}
    >
      {/* Main headline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ textAlign: 'center' }}
      >
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.03em',
            marginBottom: '10px',
          }}
        >
          You are <span style={{ color: P }}>not the only one</span>.
        </h1>
        <p
          style={{
            fontSize: '17px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          See how many people around the world are dealing with similar challenges.
        </p>
      </motion.div>

      {/* Main content: stats (left ~27%) + world map hero (right ~73%) */}
      {loadError ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            padding: '64px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(168,85,247,0.15)',
            backgroundColor: 'rgba(34,18,73,0.4)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            {loadError}
          </p>
          <button
            onClick={handleRetry}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: `1px solid ${P}`,
              backgroundColor: 'transparent',
              color: LAV,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      ) : !snapshot ? (
        <div
          className="pulse-main-grid"
          style={{ opacity: 0.5 }}
          aria-busy="true"
          aria-label="Loading Global Pulse data"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[120, 90, 90].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: '16px', backgroundColor: 'rgba(168,85,247,0.08)' }} />
            ))}
          </div>
          <div style={{ borderRadius: '20px', backgroundColor: 'rgba(168,85,247,0.06)' }} />
        </div>
      ) : snapshot.total === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '72px 24px',
            borderRadius: '20px',
            border: '1px solid rgba(168,85,247,0.15)',
            backgroundColor: 'rgba(34,18,73,0.4)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: LAV, margin: 0 }}>
            Global Pulse
          </p>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            You're early.
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '380px', lineHeight: 1.6 }}>
            Your check-in can help reveal what people around the world are experiencing. Come back soon to see the full picture.
          </p>
        </div>
      ) : (
        <div className="pulse-main-grid">
          <PulseStatsPanel problems={problems} snapshot={snapshot} />
          <PulseMapStage
            problems={problems}
            snapshot={snapshot}
            selectedIso={selectedIso}
            onSelectCountry={setSelectedIso}
          />
        </div>
      )}

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pulse-cta-grid"
        style={{ paddingTop: '24px', borderTop: '1px solid rgba(168,85,247,0.1)' }}
      >
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
            Different lives. Similar struggles.
          </h3>
          <p style={{ fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
            You do not have to figure everything out on your own.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <motion.button
            onClick={handleNavigate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '15px 30px',
              borderRadius: '16px',
              border: 'none',
              background: `linear-gradient(135deg, ${P} 0%, ${LAV} 100%)`,
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 12px 32px rgba(124,58,237,0.4)',
              transition: 'all 0.2s ease-out',
              whiteSpace: 'nowrap',
            }}
          >
            Find My Circle 💜
          </motion.button>
          <motion.button
            onClick={handleNavigate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '13px 30px',
              borderRadius: '16px',
              border: '1px solid rgba(168,85,247,0.3)',
              backgroundColor: 'transparent',
              color: LAV,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease-out',
              whiteSpace: 'nowrap',
            }}
          >
            Explore other support options →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GlobalPulseNew;
