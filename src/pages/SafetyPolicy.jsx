import React from 'react';
import { Link } from 'react-router-dom';

const P  = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

const h2Style = {
  fontSize: 'clamp(17px,2.2vw,20px)', fontWeight: 700, color: '#E9D5FF',
  fontFamily: 'Playfair Display, Georgia, serif', margin: '40px 0 10px',
  paddingBottom: 8, borderBottom: '1px solid rgba(167,139,250,0.15)',
};
const pStyle  = { fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 14 };
const liStyle = { fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, marginBottom: 6 };

export default function SafetyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
            Safety Policy
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Last Updated: June 2026</p>
          <p style={pStyle}>
            At SoulConnect, your safety and wellbeing are our highest priority. Please read this page carefully so you understand what SoulConnect is, what it is not, and how we keep our community safe.
          </p>
        </div>

        {/* What SoulConnect Is */}
        <h2 style={h2Style}>What SoulConnect Is</h2>
        <p style={pStyle}>SoulConnect is a peer wellness and community support platform designed to help people:</p>
        <ul style={{ paddingLeft: 24, margin: '4px 0 14px' }}>
          {[
            'Connect with others experiencing similar life challenges',
            'Share experiences in a safe and supportive environment',
            'Participate in guided wellness activities and reflections',
            'Build meaningful support networks',
            'Access wellness education and community resources',
          ].map((item, i) => <li key={i} style={liStyle}>{item}</li>)}
        </ul>
        <p style={pStyle}>
          SoulConnect is a space for connection, healing, and growth — built on compassion, respect, and community.
        </p>

        {/* What SoulConnect Is NOT */}
        <h2 style={h2Style}>What SoulConnect Is Not</h2>
        <p style={pStyle}>
          SoulConnect is not a clinical, medical, or emergency service. We do not provide:
        </p>
        <ul style={{ paddingLeft: 24, margin: '4px 0 14px' }}>
          {[
            'Emergency or crisis intervention services',
            'Medical advice, diagnosis, or treatment',
            'Psychiatric care or psychotherapy',
            'Suicide prevention hotline services',
            'Mental health hospital or inpatient services',
            'Legal or financial advice',
          ].map((item, i) => <li key={i} style={liStyle}>{item}</li>)}
        </ul>
        <p style={pStyle}>
          Nothing on SoulConnect should be used as a substitute for professional medical, psychological, or emergency care.
        </p>

        {/* Emergency Situations */}
        <div style={{ margin: '32px 0', padding: '20px 24px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14 }}>
          <h2 style={{ ...h2Style, margin: '0 0 12px', borderBottom: 'none', color: '#FCA5A5' }}>Emergency Situations</h2>
          <p style={{ ...pStyle, marginBottom: 8 }}>
            If you or someone you know is in immediate danger or experiencing a mental health emergency, please contact emergency services immediately.
          </p>
          <p style={{ ...pStyle, marginBottom: 8 }}>
            SoulConnect is not equipped to respond to emergencies. If you are experiencing:
          </p>
          <ul style={{ paddingLeft: 24, margin: '4px 0 12px' }}>
            {[
              'Suicidal thoughts or thoughts of self-harm',
              'A mental health crisis',
              'A medical emergency',
              'Immediate danger to yourself or others',
            ].map((item, i) => <li key={i} style={liStyle}>{item}</li>)}
          </ul>
          <p style={{ fontSize: 15, color: '#FCA5A5', fontWeight: 600, marginBottom: 0 }}>
            Please call your local emergency services, a crisis hotline, or attend your nearest emergency department immediately.
          </p>
        </div>

        {/* Community Safety Principles */}
        <h2 style={h2Style}>Community Safety Principles</h2>
        <p style={pStyle}>Every member of the SoulConnect community is expected to uphold these principles:</p>
        <ul style={{ paddingLeft: 24, margin: '4px 0 14px' }}>
          {[
            'Respect — honour every person\'s journey and lived experience',
            'Privacy — what is shared in the community stays within the community',
            'Compassion — lead with empathy and kindness at all times',
            'Non-Judgment — all paths and experiences are valid',
            'Inclusion — everyone belongs here, regardless of background',
            'Honesty — engage authentically and with integrity',
          ].map((item, i) => <li key={i} style={liStyle}>{item}</li>)}
        </ul>

        {/* Unacceptable Behaviour */}
        <h2 style={h2Style}>Unacceptable Behaviour</h2>
        <p style={pStyle}>The following behaviours are not tolerated on SoulConnect:</p>
        <ul style={{ paddingLeft: 24, margin: '4px 0 14px' }}>
          {[
            'Harassment, bullying, or threatening behaviour toward any member',
            'Sharing content that promotes self-harm, suicide, or violence',
            'Discrimination based on race, gender, religion, sexuality, disability, or any other characteristic',
            'Sharing personal information of others without consent (doxxing)',
            'Spam, scams, or unsolicited commercial promotion',
            'Impersonation of other members, guides, or staff',
            'Sharing inappropriate, explicit, or harmful content',
            'Any activity that violates applicable laws',
          ].map((item, i) => <li key={i} style={liStyle}>{item}</li>)}
        </ul>
        <p style={pStyle}>
          Violations may result in removal from the platform without notice.
        </p>

        {/* Reporting */}
        <h2 style={h2Style}>Reporting a Concern</h2>
        <p style={pStyle}>
          If you witness or experience behaviour that violates our safety standards, please report it to us. All reports are handled confidentially.
        </p>
        <p style={pStyle}>
          We take every report seriously and aim to review concerns promptly. You can report a concern by contacting us directly at the email below.
        </p>
        <p style={pStyle}>
          SoulConnect reserves the right to remove any content or member that poses a risk to the safety and wellbeing of the community.
        </p>

        {/* Contact */}
        <div style={{ marginTop: 48, padding: '24px 28px', background: 'rgba(109,74,255,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#E9D5FF', marginBottom: 10 }}>Contact</h2>
          <p style={pStyle}>
            For safety-related questions or to report a concern, please contact:{' '}
            <a href="mailto:community@soulconnect.health" style={{ color: P, fontWeight: 600 }}>
              community@soulconnect.health
            </a>
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Your safety matters to us. We are committed to maintaining a safe, respectful, and supportive community for everyone.
          </p>
        </div>

      </div>
    </div>
  );
}
