import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const P = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

const steps = [
  {
    number: 1,
    title: 'Join the Community',
    description: 'Create your free account in just a few minutes.',
    details: 'Whether you\'re looking for support, connection, or personal growth, SoulConnect is designed to help you take the first step in a safe and welcoming environment.',
  },
  {
    number: 2,
    title: 'Complete Your Profile',
    description: 'Tell us a little about yourself.',
    details: 'You can share: Your interests, Challenges you\'re facing, Wellness goals, Preferred language, Support preferences. You decide how much information to share.',
  },
  {
    number: 3,
    title: 'Explore Community Spaces',
    description: 'Join discussions with people who understand what you\'re going through.',
    details: 'Explore topics like: Anxiety, Stress, Burnout, Loneliness, Relationships, Grief, Self-care, Meditation, Personal growth',
  },
  {
    number: 4,
    title: 'Participate in Wellness Activities',
    description: 'Build healthy habits through guided activities such as:',
    details: 'Daily breathing exercises, Meditation sessions, Journaling prompts, Gratitude challenges, Mindfulness practices, Community healing circles',
  },
  {
    number: 5,
    title: 'Connect with Professionals (Optional)',
    description: 'If you need additional support, you can browse independent mental health professionals and wellness practitioners available through the platform.',
    details: 'Review their profiles, experience, and available services before choosing what feels right for you.',
  },
  {
    number: 6,
    title: 'Protect Your Privacy',
    description: 'Your privacy matters.',
    details: 'SoulConnect is designed to help you control what you share. You can choose how much personal information you make visible, and we encourage everyone to respect the privacy of others within the community.',
  },
  {
    number: 7,
    title: 'Stay Safe',
    description: 'SoulConnect is built around respectful, supportive conversations.',
    details: 'Community guidelines, moderation tools, and reporting features help create a positive environment for everyone. If you\'re experiencing a mental health emergency, please contact your local emergency services or a crisis helpline immediately.',
  },
];

export default function HowItWorks() {
  useEffect(() => {
    document.title = 'How SoulConnect Works | Step-by-Step Guide';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Learn how to use SoulConnect in 7 simple steps. Join a supportive community, find wellness resources, and connect with professionals.';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{
            fontSize: 'clamp(28px,4vw,42px)',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Playfair Display, Georgia, serif',
            marginBottom: 16
          }}>
            🌿 How SoulConnect Works
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            A 7-step guide to finding support, connection, and personal growth
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(109,74,255,0.08)',
                border: '1px solid rgba(167,139,250,0.15)',
                borderRadius: 16,
                padding: 28,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(109,74,255,0.12)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(109,74,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.15)';
              }}
            >
              {/* Step Number */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${P}, #C4B5FD)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#120B2E',
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 16,
              }}>
                {step.number}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 10,
                lineHeight: 1.4,
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 12,
                lineHeight: 1.6,
              }}>
                {step.description}
              </p>

              {/* Details */}
              <p style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
              }}>
                {step.details}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: 64,
          padding: 32,
          background: 'rgba(109,74,255,0.15)',
          border: `2px solid ${P}`,
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            Join SoulConnect today and connect with a supportive community
          </p>
          <Link to="/" style={{
            display: 'inline-block',
            background: P,
            color: '#120B2E',
            padding: '12px 28px',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
