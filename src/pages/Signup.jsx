import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { authAPI } from '../services/api';

const PROBLEMS = [
  { value: 'anxiety', label: 'Anxiety', icon: '😰' },
  { value: 'depression', label: 'Depression', icon: '😢' },
  { value: 'ocd_intrusive_thoughts', label: 'OCD / Intrusive Thoughts', icon: '🔄' },
  { value: 'ptsd_trauma', label: 'PTSD / Trauma', icon: '⚠️' },
  { value: 'phobias', label: 'Phobias', icon: '😨' },
  { value: 'panic_attacks', label: 'Panic Attacks', icon: '💓' },
  { value: 'self_harm', label: 'Self-Harm / Suicidal Thoughts', icon: '🆘' },
  { value: 'relationship_breakup', label: 'Relationship Breakup', icon: '💔' },
  { value: 'divorce', label: 'Divorce', icon: '📋' },
  { value: 'marriage_problems', label: 'Marriage Problems', icon: '💑' },
  { value: 'family_relationships', label: 'Family Relationships', icon: '👨‍👩‍👧' },
  { value: 'trust_issues', label: 'Trust Issues', icon: '🤝' },
  { value: 'unrequited_love', label: 'Unrequited Love', icon: '💭' },
  { value: 'loneliness', label: 'Loneliness', icon: '😔' },
  { value: 'lack_of_confidence', label: 'Lack of Confidence', icon: '📉' },
  { value: 'bullying_harassment', label: 'Bullying / Harassment', icon: '😠' },
  { value: 'grief_loss', label: 'Grief / Loss', icon: '🕯️' },
  { value: 'work_career_stress', label: 'Work / Career Stress', icon: '💼' },
  { value: 'financial_stress', label: 'Financial Stress', icon: '💸' },
  { value: 'identity_sexual_orientation', label: 'Identity / Sexual Orientation', icon: '🌈' },
  { value: 'addiction_substance_abuse', label: 'Addiction / Substance Abuse', icon: '⚕️' },
  { value: 'health_anxiety', label: 'Health Anxiety', icon: '🏥' },
  { value: 'sleep_problems', label: 'Sleep Problems', icon: '😴' },
  { value: 'eating_disorders', label: 'Eating Disorders', icon: '🍽️' },
  { value: 'anger_management', label: 'Anger Management', icon: '😤' },
];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [primaryProblem, setPrimaryProblem] = useState('');
  const [secondaryProblems, setSecondaryProblems] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleSignup = async () => {
    if (!phone || !name || !primaryProblem) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.signup({
        phone,
        name,
        primary_problem: primaryProblem,
        secondary_problems: secondaryProblems,
        latitude: location?.latitude || 19.0760,
        longitude: location?.longitude || 72.8777,
        address: 'Mumbai, India',
        city: 'Mumbai',
        distance_preference: 10,
        timezone: 'Asia/Kolkata',
      });

      setAuth(response.data, response.data.access_token);
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">SoulConnect</h1>
        <p className="text-gray-600 mb-6">Find your people, heal together</p>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${s <= step ? 'bg-purple-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-600"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-purple-600"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">What's your main problem?</label>

            <div className="grid grid-cols-2 gap-2 mb-6 max-h-64 overflow-y-auto">
              {PROBLEMS.map((prob) => (
                <button
                  key={prob.value}
                  onClick={() => setPrimaryProblem(prob.value)}
                  className={`p-3 rounded-lg text-sm text-center transition-all ${
                    primaryProblem === prob.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-lg">{prob.icon}</div>
                  <div className="text-xs">{prob.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!primaryProblem}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-2"><strong>Phone:</strong> {phone}</p>
              <p className="text-sm text-gray-600 mb-2"><strong>Name:</strong> {name}</p>
              <p className="text-sm text-gray-600">
                <strong>Problem:</strong> {PROBLEMS.find((p) => p.value === primaryProblem)?.label}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our Terms & Crisis Resources
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
