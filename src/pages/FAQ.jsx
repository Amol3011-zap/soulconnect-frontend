import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import Footer from '../components/Footer';

/* "Dawn" palette — same tokens as the landing page */
const P          = '#6B4FA0';
const DARK       = '#221B3A';
const NAVY_SOFT  = '#5B5470';
const GOLD_TXT   = '#8A6A3E';
const CREAM      = '#FAF8FC';
const CREAM_2    = '#F3EFF9';
const LILAC_LINE = '#E6DDF3';
const SF = '"Playfair Display",Georgia,serif';
const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";
const BG = `linear-gradient(180deg, ${CREAM_2} 0px, ${CREAM} 460px)`;

// Soft tints cycled down the list (same family as the Explore cards)
const TINTS = [
  { fg: '#6B4FA0', wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'] },
  { fg: '#3F7A5E', wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'] },
  { fg: '#9A5A3A', wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'] },
  { fg: '#8A6A3E', wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'] },
];

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

const css = `
  .fq-back{transition:color .15s;}
  .fq-back:hover{color:${DARK}!important;}
  .fq-item{transition:box-shadow .2s ease, transform .2s ease;}
  .fq-item:hover{box-shadow:0 10px 24px rgba(34,27,58,0.06)!important;}
  .fq-q:focus-visible{outline:3px solid #C9B8E8;outline-offset:-3px;border-radius:16px;}
  .fq-btn{transition:background .2s, transform .2s;}
  .fq-btn:hover{background:#5A4190!important;transform:translateY(-1px);}
  .fq-btn:focus-visible,.fq-back:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: F, color: DARK }}>
      <style>{css}</style>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link to="/" className="fq-back" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GOLD_TXT, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Help centre
          </p>
          <h1 style={{
            fontSize: 'clamp(30px,4.4vw,46px)',
            fontWeight: 700,
            color: DARK,
            fontFamily: SF,
            letterSpacing: '-0.02em',
            lineHeight: 1.12,
            margin: '0 0 14px',
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 17, color: NAVY_SOFT, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>
            Find answers to common questions about SoulConnect, our services, privacy, and mental health support.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, i) => {
            const open = expandedId === faq.id;
            const t = TINTS[i % TINTS.length];
            return (
              <div
                key={faq.id}
                className="fq-item"
                style={{
                  borderRadius: 16,
                  border: '1.5px solid transparent',
                  background: open
                    ? `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF 70px) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`
                    : `linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(150deg, ${t.edge[1]} 0%, ${LILAC_LINE} 50%, ${t.edge[2]} 100%) border-box`,
                  boxShadow: open ? '0 12px 28px rgba(34,27,58,0.06)' : '0 2px 10px rgba(34,27,58,0.03)',
                  overflow: 'hidden',
                }}
              >
                {/* Question Button */}
                <button
                  className="fq-q"
                  onClick={() => toggleExpand(faq.id)}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${faq.id}`}
                  style={{
                    width: '100%',
                    padding: '20px 22px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 14,
                    fontFamily: 'inherit',
                  }}
                >
                  <h3 style={{
                    fontSize: 16.5,
                    fontWeight: 700,
                    color: DARK,
                    margin: 0,
                    textAlign: 'left',
                    lineHeight: 1.5,
                  }}>
                    {faq.question}
                  </h3>
                  <span style={{
                    flexShrink: 0,
                    width: 32, height: 32, borderRadius: '50%',
                    background: open ? t.wash : CREAM_2,
                    border: `1px solid ${open ? t.edge[1] : LILAC_LINE}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.25s ease, background .2s',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>
                    <ChevronDown size={17} strokeWidth={2} color={open ? t.fg : P} />
                  </span>
                </button>

                {/* Answer */}
                {open && (
                  <div id={`faq-answer-${faq.id}`} style={{
                    padding: '0 22px 22px',
                    animation: 'slideDown 0.25s ease',
                  }}>
                    <div style={{ height: 1, background: LILAC_LINE, margin: '0 0 16px' }} />
                    <p style={{
                      fontSize: 15.5,
                      color: NAVY_SOFT,
                      lineHeight: 1.8,
                      margin: 0,
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: 56,
          padding: 'clamp(28px,4vw,40px)',
          borderRadius: 22,
          border: '1.5px solid transparent',
          background: `linear-gradient(160deg, #FBF1EC 0%, ${CREAM_2} 60%, #F1ECF9 100%) padding-box, linear-gradient(150deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box`,
          boxShadow: '0 16px 40px rgba(107,79,160,0.08)',
          textAlign: 'center',
        }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: '#FFFFFF', border: '1px solid #DCD0F0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <MessageCircleQuestion size={22} strokeWidth={1.6} color={P} />
          </span>
          <h2 style={{ fontFamily: SF, fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: DARK, margin: '0 0 10px', letterSpacing: '-0.015em' }}>
            Still have questions?
          </h2>
          <p style={{ fontSize: 16, color: NAVY_SOFT, margin: '0 0 22px', lineHeight: 1.6 }}>
            Reach out to our support team — we're here to help.
          </p>
          <Link to="/contact" className="fq-btn" style={{
            display: 'inline-block',
            background: P,
            color: '#FFFFFF',
            padding: '14px 30px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(107,79,160,0.18)',
          }}>
            Contact Support
          </Link>
        </div>

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

      {/* Footer */}
      <Footer />
    </div>
  );
}
