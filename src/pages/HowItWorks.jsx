import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, UserPlus, IdCard, MessagesSquare, Leaf, Stethoscope, Lock, ShieldCheck,
} from 'lucide-react';

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

// Soft tints, cycled across the steps (same family as the Explore cards)
const TINTS = [
  { bg: '#F1ECF9', fg: '#6B4FA0', wash: '#F7F3FC', edge: ['#A992DA', '#DCD0F0', '#EFE9F8'] },
  { bg: '#E7F1EC', fg: '#3F7A5E', wash: '#F1F8F4', edge: ['#86BBA2', '#D3E7DC', '#EAF3EE'] },
  { bg: '#FBEEE6', fg: '#9A5A3A', wash: '#FEF6F1', edge: ['#E0A585', '#F3DACC', '#FAEEE7'] },
  { bg: '#F6EFE2', fg: '#8A6A3E', wash: '#FCF8F0', edge: ['#D6B27A', '#EEDFC4', '#F7F0E3'] },
];

const steps = [
  {
    number: 1,
    Icon: UserPlus,
    title: 'Join the Community',
    description: 'Create your free account in just a few minutes.',
    details: 'Whether you\'re looking for support, connection, or personal growth, SoulConnect is designed to help you take the first step in a safe and welcoming environment.',
  },
  {
    number: 2,
    Icon: IdCard,
    title: 'Complete Your Profile',
    description: 'Tell us a little about yourself.',
    details: 'You can share: Your interests, Challenges you\'re facing, Wellness goals, Preferred language, Support preferences. You decide how much information to share.',
  },
  {
    number: 3,
    Icon: MessagesSquare,
    title: 'Explore Community Spaces',
    description: 'Join discussions with people who understand what you\'re going through.',
    details: 'Explore topics like: Anxiety, Stress, Burnout, Loneliness, Relationships, Grief, Self-care, Meditation, Personal growth',
  },
  {
    number: 4,
    Icon: Leaf,
    title: 'Participate in Wellness Activities',
    description: 'Build healthy habits through guided activities such as:',
    details: 'Daily breathing exercises, Meditation sessions, Journaling prompts, Gratitude challenges, Mindfulness practices, Community healing circles',
  },
  {
    number: 5,
    Icon: Stethoscope,
    title: 'Connect with Professionals (Optional)',
    description: 'If you need additional support, you can browse independent mental health professionals and wellness practitioners available through the platform.',
    details: 'Review their profiles, experience, and available services before choosing what feels right for you.',
  },
  {
    number: 6,
    Icon: Lock,
    title: 'Protect Your Privacy',
    description: 'Your privacy matters.',
    details: 'SoulConnect is designed to help you control what you share. You can choose how much personal information you make visible, and we encourage everyone to respect the privacy of others within the community.',
  },
  {
    number: 7,
    Icon: ShieldCheck,
    title: 'Stay Safe',
    description: 'SoulConnect is built around respectful, supportive conversations.',
    details: 'Community guidelines, moderation tools, and reporting features help create a positive environment for everyone. If you\'re experiencing a mental health emergency, please contact your local emergency services or a crisis helpline immediately.',
  },
];

const css = `
  .hw-back{transition:color .15s;}
  .hw-back:hover{color:${DARK}!important;}
  .hw-card{transition:transform .2s ease, box-shadow .2s ease;}
  .hw-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(34,27,58,0.07)!important;}
  .hw-btn{transition:background .2s, transform .2s;}
  .hw-btn:hover{background:#5A4190!important;transform:translateY(-1px);}
  .hw-btn:focus-visible,.hw-back:focus-visible{outline:3px solid #C9B8E8;outline-offset:3px;}
  @media(max-width:640px){
    .hw-rail{display:none!important;}
    .hw-row{grid-template-columns:1fr!important;}
  }
`;

export default function HowItWorks() {
  useEffect(() => {
    document.title = 'How SoulConnect Works | Step-by-Step Guide';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Learn how to use SoulConnect in 7 simple steps. Join a supportive community, find wellness resources, and connect with professionals.';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: F, color: DARK }}>
      <style>{css}</style>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 80px' }}>
        <Link to="/" className="hw-back" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GOLD_TXT, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Your path forward
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
            How SoulConnect Works
          </h1>
          <p style={{ fontSize: 17, color: NAVY_SOFT, lineHeight: 1.65, margin: 0 }}>
            A 7-step guide to finding support, connection, and personal growth
          </p>
        </div>

        {/* Steps — a vertical path: number on the left, card on the right */}
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
          <span aria-hidden="true" className="hw-rail" style={{
            position: 'absolute', left: 23, top: 24, bottom: 24, width: 2,
            background: 'linear-gradient(180deg, #DCD0F0 0%, #EEDFC4 50%, #D3E7DC 100%)',
            borderRadius: 2,
          }} />
          {steps.map((step, i) => {
            const t = TINTS[i % TINTS.length];
            const Icon = step.Icon;
            return (
              <li key={step.number} className="hw-row" style={{
                display: 'grid', gridTemplateColumns: '48px 1fr', gap: 22,
                marginBottom: i === steps.length - 1 ? 0 : 20, position: 'relative',
              }}>
                {/* Step number */}
                <div className="hw-rail" style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#FFFFFF',
                  border: `1.5px solid ${t.edge[0]}`,
                  boxShadow: `0 0 0 5px ${CREAM}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SF, fontSize: 20, fontWeight: 700, color: t.fg,
                  position: 'relative', zIndex: 1,
                }}>
                  {step.number}
                </div>

                <div className="hw-card" style={{
                  padding: '24px 26px',
                  borderRadius: 18,
                  border: '1.5px solid transparent',
                  background: `linear-gradient(180deg, ${t.wash} 0%, #FFFFFF 70px) padding-box, linear-gradient(150deg, ${t.edge[0]} 0%, ${t.edge[1]} 45%, ${t.edge[2]} 100%) border-box`,
                  boxShadow: '0 2px 12px rgba(34,27,58,0.03)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{
                      flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: t.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={19} strokeWidth={1.7} color={t.fg} />
                    </span>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK, margin: 0, lineHeight: 1.35 }}>
                      {step.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: 15.5, color: '#3A3350', margin: '0 0 8px', lineHeight: 1.6, fontWeight: 500 }}>
                    {step.description}
                  </p>

                  <p style={{ fontSize: 14.5, color: NAVY_SOFT, lineHeight: 1.7, margin: 0 }}>
                    {step.details}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

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
          <h2 style={{ fontFamily: SF, fontSize: 'clamp(22px,3vw,28px)', fontWeight: 700, color: DARK, margin: '0 0 10px', letterSpacing: '-0.015em' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: 16, color: NAVY_SOFT, margin: '0 0 22px', lineHeight: 1.6 }}>
            Join SoulConnect today and connect with a supportive community
          </p>
          <Link to="/" className="hw-btn" style={{
            display: 'inline-block',
            background: P,
            color: '#FFFFFF',
            padding: '14px 32px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(107,79,160,0.18)',
          }}>
            Get Started
          </Link>
        </div>

      </div>
    </div>
  );
}
