import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ProblemSelection from '../components/Pulse/ProblemSelection';
import SupportSelection from '../components/Pulse/SupportSelection';
import PulseSummary from '../components/Pulse/PulseSummary';
import GlobalPulseNew from '../components/Pulse/GlobalPulseNew';
import { ArrowLeft } from 'lucide-react';
import { P, DARK, GOLD_TXT, CREAM, CREAM_2, LILAC_LINE, F, pulseCss } from '../components/Pulse/pulseTheme';

/**
 * Pulse Page
 *
 * New 4-step flow:
 * 1. Select problems (multi-select, up to 2)
 * 2. Select support preference
 * 3. Show summary
 * 4. Show global pulse with world map
 */
function Pulse() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [selectedSupport, setSelectedSupport] = useState(null);

  const handleProblemsSelect = (problems) => {
    setSelectedProblems(problems);
    setStep(2);
  };

  const handleSupportSelect = (supportId) => {
    setSelectedSupport(supportId);
    setStep(3);
  };

  const handleViewPulse = () => {
    setStep(4);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 50% 0%, #FBF1EC 0%, rgba(251,241,236,0) 55%), linear-gradient(180deg, ${CREAM_2} 0%, ${CREAM} 520px)`,
        color: DARK,
        fontFamily: F,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{pulseCss}</style>

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '16px clamp(16px,4vw,32px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          borderBottom: `1px solid ${LILAC_LINE}`,
          background: 'rgba(250,248,252,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={handleBack}
          className="pl-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: P,
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600,
            padding: '8px 0',
            fontFamily: 'inherit',
            minWidth: 80,
          }}
        >
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: GOLD_TXT,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
            }}
          >
            {step === 1 && 'Step 1 of 4'}
            {step === 2 && 'Step 2 of 4'}
            {step === 3 && 'Step 3 of 4'}
            {step === 4 && 'Your Pulse'}
          </div>
          {/* Progress */}
          <div aria-hidden="true" style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                style={{
                  width: n === step ? 22 : 8,
                  height: 6,
                  borderRadius: 999,
                  background: n <= step ? P : '#DCD0F0',
                  opacity: n < step ? 0.55 : 1,
                  transition: 'all .3s ease',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ minWidth: 80 }} />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: step === 4 ? 'clamp(24px,4vw,40px) clamp(16px,3vw,32px)' : 'clamp(36px,6vw,64px) clamp(16px,4vw,32px)',
          overflow: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: step === 4 ? '1400px' : '900px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <ProblemSelection key="problems" onSelect={handleProblemsSelect} />
            )}

            {step === 2 && (
              <SupportSelection key="support" onSelect={handleSupportSelect} />
            )}

            {step === 3 && (
              <PulseSummary
                key="summary"
                problems={selectedProblems}
                support={selectedSupport}
                onContinue={handleViewPulse}
              />
            )}

            {step === 4 && (
              <GlobalPulseNew
                key="pulse"
                problems={selectedProblems}
                support={selectedSupport}
                onNavigate={handleNavigate}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Pulse;
