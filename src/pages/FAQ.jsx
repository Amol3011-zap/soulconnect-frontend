import { useState } from 'react';
import { Link } from 'react-router-dom';

const P = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

const faqs = [
  {
    id: 1,
    question: 'What is SoulConnect?',
    answer: 'SoulConnect is a mental wellness platform where people can find emotional support through community, guided wellness activities, and connections with mental health professionals when needed. Whether you\'re feeling anxious, lonely, overwhelmed, grieving, or simply need someone to talk to, SoulConnect is designed to help you feel less alone in a safe and supportive environment. While professional support is available through verified practitioners, SoulConnect is not a replacement for emergency medical care or crisis intervention.'
  },
  {
    id: 2,
    question: 'Who is SoulConnect for?',
    answer: 'SoulConnect is for anyone looking for emotional support, meaningful connection, or tools to improve their mental well-being. Whether you\'re experiencing stress, anxiety, loneliness, burnout, relationship challenges, grief, or simply want to build healthier habits, the platform is designed to support your journey. If you\'re experiencing a mental health emergency or are at immediate risk of harm, please contact your local emergency services or a crisis helpline immediately.'
  },
  {
    id: 3,
    question: 'Is SoulConnect free to use?',
    answer: 'Yes. Many core features of SoulConnect are available free of charge, including exploring the platform, joining the community, participating in wellness challenges, and accessing educational mental health resources. Some optional services offered by independent mental health professionals or healers may require payment. Any paid services will always display pricing clearly before you book.'
  },
  {
    id: 4,
    question: 'Are therapy sessions or professional consultations paid?',
    answer: 'Professional consultations, therapy sessions, or healing sessions offered through independent practitioners may have their own fees. Pricing varies depending on the professional and the type of session. SoulConnect itself does not charge hidden fees, and you will always be able to review pricing before confirming a booking.'
  },
  {
    id: 5,
    question: 'How private is my information?',
    answer: 'Your privacy is extremely important to us. Personal information is handled according to our Privacy Policy, and we work to protect your data using modern security practices. You control what information you choose to share within the platform. While we strive to provide a safe environment, no online service can guarantee absolute security, so we encourage users not to share sensitive personal or financial information unnecessarily.'
  },
  {
    id: 6,
    question: 'How do I get started?',
    answer: 'Getting started is simple. Create your account, complete your profile, and explore the different areas of SoulConnect. You can browse community spaces, participate in wellness activities, read educational resources, or connect with professionals if you choose. The platform is designed so you can begin at your own pace based on your individual needs.'
  },
  {
    id: 7,
    question: 'Does SoulConnect replace therapy or medical treatment?',
    answer: 'No. SoulConnect is designed to complement—not replace—professional mental health care. The platform provides community support, wellness resources, and access to professionals where available. If you are experiencing severe symptoms, suicidal thoughts, or a mental health emergency, you should immediately contact emergency services or a qualified mental health professional.'
  },
  {
    id: 8,
    question: 'What mental health topics does SoulConnect support?',
    answer: 'SoulConnect provides resources and community support for a wide range of emotional well-being topics, including anxiety, stress, loneliness, burnout, grief, relationships, emotional wellness, mindfulness, meditation, self-care, and personal growth. The platform continues to expand its educational content and wellness programs to support different mental health journeys.'
  },
  {
    id: 9,
    question: 'How are professionals verified?',
    answer: 'Professionals listed on SoulConnect go through a verification process before appearing on the platform. Verification requirements may vary depending on the type of practitioner and applicable regulations. We encourage users to review each professional\'s profile, qualifications, and experience before booking a session. Verification does not replace your own judgment when choosing a provider.'
  },
  {
    id: 10,
    question: 'What should I do if I\'m in crisis or need immediate help?',
    answer: 'If you believe you or someone else is in immediate danger, call your local emergency services immediately. If you are in India and need urgent emotional support, you can contact Tele-MANAS (14416) or the Vandrevala Foundation (+91 9999 666 555) for confidential mental health support. SoulConnect is not an emergency or crisis response service and should not be used as a substitute for immediate medical assistance.'
  },
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontSize: 'clamp(28px,4vw,42px)',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Playfair Display, Georgia, serif',
            marginBottom: 8
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Find answers to common questions about SoulConnect, our services, privacy, and mental health support.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              style={{
                background: 'rgba(109,74,255,0.08)',
                border: '1px solid rgba(167,139,250,0.15)',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleExpand(faq.id)}
                style={{
                  width: '100%',
                  padding: 20,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(109,74,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}>
                  {faq.question}
                </h3>
                <div style={{
                  fontSize: 20,
                  color: P,
                  fontWeight: 'bold',
                  minWidth: 24,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  transform: expandedId === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ▼
                </div>
              </button>

              {/* Answer */}
              {expandedId === faq.id && (
                <div style={{
                  padding: '0 20px 20px',
                  borderTop: '1px solid rgba(167,139,250,0.1)',
                  animation: 'slideDown 0.3s ease',
                }}>
                  <p style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.8,
                    margin: 0,
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
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
            Still have questions?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
            Reach out to our support team — we're here to help.
          </p>
          <Link to="/contact" style={{
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
            Contact Support
          </Link>
        </div>

        {/* Animation Styles */}
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
              overflow: hidden;
            }
            to {
              opacity: 1;
              max-height: 500px;
              overflow: visible;
            }
          }
        `}</style>

        {/* FAQPage Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          })
        }} />
      </div>
    </div>
  );
}
