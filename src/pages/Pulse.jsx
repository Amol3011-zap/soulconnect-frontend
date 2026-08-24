import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import ProblemSelection from '../components/Pulse/ProblemSelection';
import SupportSelection from '../components/Pulse/SupportSelection';
import PulseSummary from '../components/Pulse/PulseSummary';
import GlobalPulseNew from '../components/Pulse/GlobalPulseNew';

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
        background: 'linear-gradient(180deg, #0A0818 0%, #120B2E 50%, #0D0B1A 100%)',
        color: '#FFFFFF',
        fontFamily: 'Inter, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          right: '8%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(168,85,247,0.1)',
          background: 'rgba(8,8,18,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 600,
            padding: '8px 0',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
        >
          ← Back
        </button>

        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {step === 1 && 'Step 1 of 4'}
          {step === 2 && 'Step 2 of 4'}
          {step === 3 && 'Step 3 of 4'}
          {step === 4 && 'Your Pulse'}
        </div>

        <div style={{ width: '80px' }} />
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
          padding: step === 4 ? '32px' : '60px 32px',
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
