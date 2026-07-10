import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ASSESSMENT_QUESTIONS = [
  { id: 1, text: 'How often do you experience this emotion?', scale: 5 },
  { id: 2, text: 'How intensely do you feel it?', scale: 5 },
  { id: 3, text: 'Does it affect your daily activities?', scale: 5 },
  { id: 4, text: 'How long does it typically last?', scale: 5 },
  { id: 5, text: 'Are you seeking support?', scale: 5 },
];

export default function AssessmentComponent({ guide, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    try {
      const score = calculateScore();
      setResult({
        score,
        interpretation: getInterpretation(score),
      });
      setSubmitted(true);

      // Log assessment
      await api.post('/assessments', {
        guide_id: guide.id,
        responses: responses,
        score: score,
      });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
  };

  const calculateScore = () => {
    const values = Object.values(responses).map((v) => parseInt(v));
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / (values.length * 5)) * 100);
  };

  const getInterpretation = (score) => {
    if (score < 30) return 'Low concern - you are managing well';
    if (score < 60) return 'Moderate concern - consider these strategies';
    if (score < 80) return 'High concern - these strategies are important';
    return 'Very high concern - please consider professional support';
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const isAnswered = responses[question.id] !== undefined;
  const isLastQuestion = currentQuestion === ASSESSMENT_QUESTIONS.length - 1;
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '32px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, color: '#FFF', fontSize: '24px', fontWeight: '600' }}>
            Quick Assessment
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            height: '4px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7C3AED 0%, #8B5CF6 100%)',
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
          </p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              {/* Question */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', margin: '0 0 24px 0' }}>
                  {question.text}
                </h3>

                {/* Scale */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '32px' }}>
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const value = (idx + 1).toString();
                    const isSelected = responses[question.id] === value;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleResponse(question.id, value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '16px 8px',
                          background: isSelected ? 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' : 'rgba(255,255,255,0.05)',
                          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: '#FFF',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.2s',
                        }}
                      >
                        {idx === 0 && 'Not at all'}
                        {idx === 2 && 'Neutral'}
                        {idx === 4 && 'Very much'}
                        {idx !== 0 && idx !== 2 && idx !== 4 && value}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  style={{
                    padding: '12px 16px',
                    background: currentQuestion === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: currentQuestion === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                    cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Previous
                </button>

                <motion.button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  whileHover={isAnswered ? { scale: 1.02 } : {}}
                  whileTap={isAnswered ? { scale: 0.98 } : {}}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: isAnswered ? 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' : 'rgba(124, 58, 237, 0.2)',
                    border: 'none',
                    color: '#FFF',
                    borderRadius: '8px',
                    cursor: isAnswered ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: isAnswered ? 1 : 0.5,
                  }}
                >
                  {isLastQuestion ? 'See Results' : 'Next'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              {/* Score */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2))',
                border: '2px solid rgba(124, 58, 237, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#A78BFA' }}>
                  {result.score}%
                </div>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FFF', margin: '0 0 12px 0' }}>
                Assessment Complete
              </h3>

              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0', lineHeight: '1.6' }}>
                {result.interpretation}
              </p>

              {/* Actions */}
              <div style={{ display: 'grid', gap: '12px' }}>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Close
                </motion.button>

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '12px 0 0 0' }}>
                  Your response has been saved. Come back anytime to track your progress.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
