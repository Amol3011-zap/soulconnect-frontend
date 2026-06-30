import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ARTICLES } from '../data/articles';

const P = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

export default function Blog() {
  useEffect(() => {
    document.title = 'Mental Health & Wellness Articles | SoulConnect Blog';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = 'Read expert articles on anxiety, depression, grief, relationships, mindfulness and mental health. Science-backed guidance for your wellbeing journey.';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{ fontSize: 'clamp(32px,6vw,52px)', fontWeight: 800, color: '#fff', fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 16 }}>
            Mental Health & Wellness Articles
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 640, lineHeight: 1.6 }}>
            Expert-backed guidance on anxiety, depression, grief, relationships, and personal growth. Learn strategies that work.
          </p>
        </div>

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 32,
          marginTop: 48,
        }}>
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(109,74,255,0.08)',
                border: '1px solid rgba(167,139,250,0.15)',
                borderRadius: 16,
                padding: 24,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
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
              {/* Category Badge */}
              <div style={{
                display: 'inline-flex',
                width: 'fit-content',
                background: `rgba(${article.category === 'Mental Health' ? '167,139,250' : '251,191,36'},0.15)`,
                color: article.category === 'Mental Health' ? '#E9D5FF' : '#FCD34D',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
              }}>
                {article.category}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 10,
                lineHeight: 1.4,
                flex: 1,
              }}>
                {article.title}
              </h2>

              {/* Excerpt */}
              <p style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 16,
                lineHeight: 1.6,
              }}>
                {article.excerpt}
              </p>

              {/* Meta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 12,
                color: 'rgba(255,255,255,0.5)',
              }}>
                <span>📅 {new Date(article.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span>⏱ {article.readTime} min read</span>
              </div>

              {/* Tags */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      background: 'rgba(167,139,250,0.1)',
                      color: '#C4B5FD',
                      padding: '2px 8px',
                      borderRadius: 12,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                marginTop: 16,
                color: P,
                fontWeight: 600,
                fontSize: 13,
              }}>
                Read article →
              </div>
            </Link>
          ))}
        </div>

        {/* SEO Section */}
        <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(167,139,250,0.15)' }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 24,
            fontFamily: 'Playfair Display, Georgia, serif',
          }}>
            Why Read Mental Health Articles?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 24,
          }}>
            {[
              { icon: '🧠', title: 'Evidence-Based Guidance', desc: 'Articles grounded in psychological research and best practices' },
              { icon: '💙', title: 'Normalize Your Experience', desc: 'Learn you\'re not alone in what you\'re going through' },
              { icon: '🛠️', title: 'Practical Strategies', desc: 'Actionable techniques you can implement immediately' },
              { icon: '🤝', title: 'Peer Community', desc: 'Connect with others on similar journeys through SoulConnect' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(109,74,255,0.05)',
                border: '1px solid rgba(167,139,250,0.1)',
                borderRadius: 12,
                padding: 20,
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#E9D5FF', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* JSON-LD Schema for Blog */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'SoulConnect Mental Health & Wellness Blog',
            description: 'Expert articles on anxiety, depression, grief, relationships, mindfulness and mental health support',
            url: 'https://soulconnect.health/blog',
            blogPost: ARTICLES.map(article => ({
              '@type': 'BlogPosting',
              headline: article.title,
              description: article.excerpt,
              url: `https://soulconnect.health/blog/${article.slug}`,
              datePublished: article.publishedDate,
              dateModified: article.updatedDate,
              author: { '@type': 'Organization', name: article.author },
              keywords: article.keywords.join(','),
            })),
          })
        }} />
      </div>
    </div>
  );
}
