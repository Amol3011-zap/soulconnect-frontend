import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SUPPORT_OPTIONS } from '../../data/pulseExperienceData';
import { fetchGlobalPulse, submitCheckIn } from '../../data/pulseDataAdapter';
import { getLocaleCountryHint } from '../../lib/localeCountry';
import PulseMapStage from './PulseMapStage';
import PulseStatsPanel from './PulseStatsPanel';
import './globalPulse.css';
import { Heart, ArrowRight } from 'lucide-react';
import { P, DARK, NAVY_SOFT, GOLD_TXT, CREAM_2, LILAC_LINE, SF, GOLD_EDGE } from './pulseTheme';

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
            fontFamily: SF,
            fontSize: 'clamp(30px, 4.6vw, 48px)',
            fontWeight: 700,
            color: DARK,
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          You are <span style={{ color: P }}>not the only one</span>.
        </h1>
        <p
          style={{
            fontSize: '17px',
            fontWeight: 400,
            color: NAVY_SOFT,
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
            border: `1.5px solid ${LILAC_LINE}`,
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600, color: DARK, margin: 0 }}>
            {loadError}
          </p>
          <button
            onClick={handleRetry}
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              border: `1.5px solid #DCD0F0`,
              backgroundColor: '#FFFFFF',
              color: P,
              fontFamily: 'inherit',
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
          style={{ opacity: 0.8 }}
          aria-busy="true"
          aria-label="Loading Global Pulse data"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[120, 90, 90].map((h, i) => (
              <div key={i} style={{ height: h, borderRadius: '16px', backgroundColor: '#EFE9F8' }} />
            ))}
          </div>
          <div style={{ borderRadius: '20px', backgroundColor: CREAM_2 }} />
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
            border: `1.5px solid ${LILAC_LINE}`,
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_TXT, margin: 0 }}>
            Global Pulse
          </p>
          <h3 style={{ fontFamily: SF, fontSize: '24px', fontWeight: 700, color: DARK, margin: 0 }}>
            You're early.
          </h3>
          <p style={{ fontSize: '14.5px', color: NAVY_SOFT, margin: 0, maxWidth: '380px', lineHeight: 1.65 }}>
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
        style={{
          padding: 'clamp(24px,3vw,32px) clamp(22px,3vw,36px)',
          borderRadius: 22,
          border: '1.5px solid transparent',
          background: `linear-gradient(160deg, #FBF1EC 0%, ${CREAM_2} 60%, #F1ECF9 100%) padding-box, ${GOLD_EDGE}`,
          boxShadow: '0 16px 40px rgba(107,79,160,0.08)',
        }}
      >
        <div>
          <h3 style={{ fontFamily: SF, fontSize: 'clamp(21px,2.4vw,26px)', fontWeight: 700, color: DARK, margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            Different lives. Similar struggles.
          </h3>
          <p style={{ fontSize: '15px', fontWeight: 400, color: NAVY_SOFT, margin: 0, lineHeight: 1.6 }}>
            You do not have to figure everything out on your own.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={handleNavigate}
            className="pl-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '15px 30px',
              borderRadius: '14px',
              border: 'none',
              background: P,
              color: '#FFFFFF',
              fontSize: '15.5px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(107,79,160,0.22)',
              whiteSpace: 'nowrap',
            }}
          >
            Find My Circle
            <Heart size={17} strokeWidth={2} fill="#E7D3E4" color="#FFFFFF" />
          </button>
          <button
            onClick={handleNavigate}
            className="pl-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '13px 30px',
              borderRadius: '14px',
              border: '1.5px solid #DCD0F0',
              backgroundColor: '#FFFFFF',
              color: P,
              fontSize: '14.5px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Explore other support options
            <ArrowRight size={16} strokeWidth={1.9} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GlobalPulseNew;
