import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opens mail client as fallback — replace with API call when backend ready
    const mailto = `mailto:hello@soulconnect.health?subject=${encodeURIComponent(form.subject || 'Contact from website')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 15,
    border: '1.5px solid rgba(109,74,255,0.15)', background: '#fff',
    color: '#1A1333', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6D4AFF', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#1A1333', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
          Contact Us
        </h1>
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7, marginBottom: 48 }}>
          We'd love to hear from you. Whether you have a question, feedback, or just want to say hello — reach out.
        </p>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 48 }}>
          {[
            { icon: '🆘', title: 'Crisis Support', desc: 'Immediate help resources', to: '/crisis-support' },
            { icon: '🚨', title: 'Report a Concern', desc: 'Safety or abuse reports', to: '/report' },
            { icon: '🛡', title: 'Safety Policy', desc: 'Our community standards', to: '/safety' },
            { icon: '📋', title: 'Guide Application', desc: 'Join as a wellness guide', href: 'mailto:guides@soulconnect.health' },
          ].map((item, i) => (
            item.to
              ? <Link key={i} to={item.to} style={{ display: 'block', background: '#fff', border: '1.5px solid rgba(109,74,255,0.1)', borderRadius: 16, padding: '18px 20px', textDecoration: 'none', transition: 'box-shadow 0.2s' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.desc}</div>
                </Link>
              : <a key={i} href={item.href} style={{ display: 'block', background: '#fff', border: '1.5px solid rgba(109,74,255,0.1)', borderRadius: 16, padding: '18px 20px', textDecoration: 'none' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1333', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.desc}</div>
                </a>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(109,74,255,0.1)', borderRadius: 24, padding: 'clamp(24px,4vw,40px)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1333', marginBottom: 6 }}>Send us a message</h2>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 28 }}>We aim to respond within 2 business days.</p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💜</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1333', marginBottom: 10 }}>Message sent!</h3>
              <p style={{ fontSize: 15, color: '#6B7280' }}>Your email client should have opened. If not, email us at <strong>hello@soulconnect.health</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Your Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="What should we call you?" required style={inputStyle}
                    onFocus={e => e.target.style.borderColor='#6D4AFF'}
                    onBlur={e => e.target.style.borderColor='rgba(109,74,255,0.15)'}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="your@email.com" required style={inputStyle}
                    onFocus={e => e.target.style.borderColor='#6D4AFF'}
                    onBlur={e => e.target.style.borderColor='rgba(109,74,255,0.15)'}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Subject</label>
                <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                  placeholder="What is this about?" style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#6D4AFF'}
                  onBlur={e => e.target.style.borderColor='rgba(109,74,255,0.15)'}/>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  placeholder="Share what's on your mind..." required rows={5}
                  style={{...inputStyle, resize: 'vertical'}}
                  onFocus={e => e.target.style.borderColor='#6D4AFF'}
                  onBlur={e => e.target.style.borderColor='rgba(109,74,255,0.15)'}/>
              </div>
              <button type="submit" style={{
                padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg,#6D4AFF,#A78BFA)', color: '#fff',
                border: 'none', cursor: 'pointer',
              }}>
                Send Message →
              </button>
              <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                Or email us directly at <strong>hello@soulconnect.health</strong>
              </p>
            </form>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 32, padding: '16px 20px', borderRadius: 12, background: 'rgba(109,74,255,0.04)', border: '1px solid rgba(109,74,255,0.1)', fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>
          ⚕️ <strong>Not for crisis situations.</strong> If you are in immediate danger or experiencing a mental health crisis, please do not wait for an email response.{' '}
          <Link to="/crisis-support" style={{ color: '#6D4AFF', fontWeight: 600 }}>View Crisis Resources →</Link>
        </div>
      </div>
    </div>
  );
}
