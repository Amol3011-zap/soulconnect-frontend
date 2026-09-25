import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Lock, HeartHandshake, ShieldCheck, BadgeCheck, LifeBuoy, Handshake,
  KeyRound, Sprout, Phone,
} from 'lucide-react';

/* "Dawn" palette — same tokens as the landing page */
const P          = '#6B4FA0';
const DARK       = '#221B3A';
const NAVY_SOFT  = '#5B5470';
const GOLD_TXT   = '#8A6A3E';
const CREAM      = '#FAF8FC';
const CREAM_2    = '#F3EFF9';
const SF = '"Playfair Display",Georgia,serif';
const F  = "'Plus Jakarta Sans',Inter,system-ui,sans-serif";
const BG = `linear-gradient(180deg, ${CREAM_2} 0px, ${CREAM} 460px)`;

// Soft tints, cycled across the cards (same family as the Explore cards)
const TINTS = [
  { bg: '#F1ECF9', fg: '#6B4FA0', wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'], dot: '#8F77C5' },
  { bg: '#E7F1EC', fg: '#3F7A5E', wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'], dot: '#3F7A5E' },
  { bg: '#FBEEE6', fg: '#9A5A3A', wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'], dot: '#C98A6B' },
  { bg: '#F6EFE2', fg: '#8A6A3E', wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'], dot: '#B08A52' },
];

const sections = [
  {
    Icon: Lock,
    title: 'Your Privacy Matters',
    subsections: [
      {
        heading: 'Your personal information belongs to you.',
        content: 'We are committed to protecting your privacy and giving you control over what you choose to share on SoulConnect.'
      },
      {
        heading: 'You decide what information appears on your profile.',
        content: 'We encourage users not to share sensitive personal information publicly. Read our Privacy Policy to learn how your data is handled.'
      }
    ]
  },
  {
    Icon: HeartHandshake,
    title: 'A Respectful Community',
    subsections: [
      {
        heading: 'SoulConnect is built around empathy, kindness, and respect.',
        content: 'Everyone is expected to:'
      },
      {
        items: [
          'Treat others respectfully',
          'Avoid harassment or discrimination',
          'Respect personal boundaries',
          'Support others without judgment'
        ],
        content: 'Content that violates our Community Guidelines may be removed.'
      }
    ]
  },
  {
    Icon: ShieldCheck,
    title: 'Community Moderation',
    subsections: [
      {
        heading: 'To help maintain a safe environment, SoulConnect uses moderation tools and reporting features.',
        content: 'Users can:'
      },
      {
        items: [
          'Report inappropriate content',
          'Block unwanted interactions',
          'Flag harmful behavior'
        ],
        content: 'Our team reviews reports to help keep the community safe.'
      }
    ]
  },
  {
    Icon: BadgeCheck,
    title: 'Verified Professionals',
    subsections: [
      {
        heading: 'Where professional services are offered, practitioners go through a verification process before appearing on the platform.',
        content: 'Users should always review a professional\'s profile, qualifications, and experience before booking a session.'
      }
    ]
  },
  {
    Icon: LifeBuoy,
    title: 'Peer Support, Not Emergency Care',
    subsections: [
      {
        heading: 'SoulConnect provides peer support, wellness resources, and access to professionals where available.',
        content: 'It is not an emergency service and should not be used as a substitute for urgent medical or psychiatric care.'
      },
      {
        heading: 'If you are in immediate danger or experiencing a mental health crisis, contact your local emergency services or a crisis helpline immediately.'
      }
    ]
  },
  {
    Icon: Handshake,
    title: 'Transparency',
    subsections: [
      {
        heading: 'We believe trust is earned through honesty.',
        content: 'We do not intentionally display misleading statistics, fake testimonials, or fabricated reviews. Our goal is to build a supportive community through genuine experiences and meaningful connections.'
      }
    ]
  },
  {
    Icon: KeyRound,
    title: 'Account & Data Security',
    subsections: [
      {
        heading: 'We continuously work to protect user accounts and platform security using industry-standard security practices.',
        content: 'To help keep your account safe:'
      },
      {
        items: [
          'Use a strong password.',
          'Never share your login credentials.',
          'Contact us if you believe your account has been compromised.'
        ]
      }
    ]
  },
  {
    Icon: Sprout,
    title: 'Your Well-being Comes First',
    subsections: [
      {
        heading: 'We encourage users to seek professional support whenever it is needed.',
        content: 'SoulConnect is designed to complement—not replace—professional mental health care.'
      }
    ]
  }
];

const CRISIS_LINES = [
  { name: 'Tele-MANAS', number: '14416', desc: '24/7 Mental Health Support' },
  { name: 'Vandrevala Foundation', number: '+91 9999 666 555', desc: 'Crisis Support' },
  { name: 'iCall', number: '9152987821', desc: 'Mental Health Support' },
  { name: 'AASRA', number: '9820466726', desc: 'Suicide Prevention' },
];

const css = `
  .ts-back{transition:color .15s;}
  .ts-back:hover{color:${DARK}!important;}
  .ts-card{transition:transform .2s ease, box-shadow .2s ease;}
  .ts-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(34,27,58,0.07)!important;}
  .ts-btn-p{transition:background .2s, transform .2s;}
  .ts-btn-p:hover{background:#5A4190!important;transform:translateY(-1px);}
  .ts-btn-s{transition:background .2s, border-color .2s, transform .2s;}
  .ts-btn-s:hover{background:${CREAM_2}!important;border-color:#C9B8E8!important;transform:translateY(-1px);}
  .ts-tel{transition:border-color .2s, box-shadow .2s;}
  .ts-tel:hover{border-color:#E0A585!important;box-shadow:0 8px 20px rgba(154,63,42,0.08);}
  a:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
`;

export default function TrustSafety() {
  useEffect(() => {
    document.title = 'Trust & Safety | SoulConnect Community Standards';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Learn about SoulConnect\'s commitment to privacy, community safety, moderation, and your well-being. Verified professionals, transparent practices, and your control over your data.';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: F, color: DARK }}>
      <style>{css}</style>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link to="/" className="ts-back" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GOLD_TXT, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Our commitment
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
            Trust &amp; Safety
          </h1>
          <p style={{ fontSize: 17, color: NAVY_SOFT, lineHeight: 1.65, margin: 0 }}>
            Your privacy, safety, and well-being are our highest priorities
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 22 }}>
          {sections.map((section, i) => {
            const t = TINTS[i % TINTS.length];
            const Icon = section.Icon;
            return (
              <div
                key={i}
                className="ts-card"
                style={{
                  padding: '26px 26px 24px',
                  borderRadius: 18,
                  border: '1.5px solid transparent',
                  background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF 80px) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
                  boxShadow: '0 2px 12px rgba(34,27,58,0.03)',
                }}
              >
                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{
                    flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: t.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} strokeWidth={1.7} color={t.fg} />
                  </span>
                  <h2 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: DARK,
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {section.title}
                  </h2>
                </div>

                {/* Subsections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {section.subsections.map((sub, j) => (
                    <div key={j}>
                      {sub.heading && (
                        <h3 style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: '#3A3350',
                          margin: 0,
                          marginBottom: sub.content || sub.items ? 8 : 0,
                          lineHeight: 1.55,
                        }}>
                          {sub.heading}
                        </h3>
                      )}

                      {sub.items && (
                        <ul style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          marginBottom: sub.content ? 10 : 0,
                        }}>
                          {sub.items.map((item, k) => (
                            <li key={k} style={{
                              fontSize: 14.5,
                              color: NAVY_SOFT,
                              marginBottom: 7,
                              paddingLeft: 18,
                              position: 'relative',
                              lineHeight: 1.55,
                            }}>
                              <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 8, width: 7, height: 7, borderRadius: '50%', background: t.dot }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {sub.content && (
                        <p style={{
                          fontSize: 14.5,
                          color: NAVY_SOFT,
                          lineHeight: 1.65,
                          margin: 0,
                        }}>
                          {sub.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Section — warm and clearly visible, without alarm-red */}
        <div style={{
          marginTop: 44,
          padding: 'clamp(24px,4vw,32px)',
          background: '#FDF2EC',
          border: '1.5px solid #EDC3AE',
          borderRadius: 20,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#8A3A24', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFFFF', border: '1px solid #EDC3AE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LifeBuoy size={19} strokeWidth={1.8} color="#B5553A" />
            </span>
            Need Immediate Help?
          </h2>
          <p style={{ fontSize: 15, color: '#5A4238', margin: '0 0 18px', lineHeight: 1.65 }}>
            If you or someone you know is experiencing a mental health crisis, contact emergency services immediately or reach out to:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
            {CRISIS_LINES.map((crisis, idx) => (
              <a
                key={idx}
                className="ts-tel"
                href={`tel:${crisis.number.replace(/\s+/g, '')}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: '#FFFFFF',
                  border: '1px solid #F1D6C8',
                  borderRadius: 14,
                  padding: '14px 16px',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#9A4A30', marginBottom: 4 }}>
                  {crisis.name}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Phone size={15} strokeWidth={1.9} color="#B5553A" />
                  {crisis.number}
                </div>
                <div style={{ fontSize: 13, color: '#6E5A52' }}>
                  {crisis.desc}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: 44,
          padding: 'clamp(28px,4vw,40px)',
          borderRadius: 22,
          border: '1.5px solid transparent',
          background: `linear-gradient(160deg, #FBF1EC 0%, ${CREAM_2} 60%, #F1ECF9 100%) padding-box, linear-gradient(150deg, #D4B07A 0%, #E7D3E4 45%, #9C86CC 100%) border-box`,
          boxShadow: '0 16px 40px rgba(107,79,160,0.08)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: SF, fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: DARK, margin: '0 0 10px', letterSpacing: '-0.015em' }}>
            More Questions?
          </h2>
          <p style={{ fontSize: 16, color: NAVY_SOFT, margin: '0 0 22px', lineHeight: 1.6 }}>
            Check our FAQ or contact our support team for more information
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/faq" className="ts-btn-p" style={{
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
              Visit FAQ
            </Link>
            <Link to="/contact" className="ts-btn-s" style={{
              display: 'inline-block',
              background: '#FFFFFF',
              color: P,
              padding: '14px 30px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              border: '1px solid #DCD0F0',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
