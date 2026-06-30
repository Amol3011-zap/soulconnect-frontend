import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, getRelatedArticles } from '../data/articles';

const P = '#A78BFA';
const BG = 'linear-gradient(155deg,#06011A 0%,#130530 40%,#1E0848 70%,#06011A 100%)';

export default function BlogDetail() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const relatedArticles = article ? getRelatedArticles(article.id) : [];

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | SoulConnect Blog`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = article.description;

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [article]);

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Article not found</h1>
          <Link to="/blog" style={{ color: P, fontWeight: 600 }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: P, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 40 }}>
          ← Back to Blog
        </Link>

        {/* Header */}
        <article style={{ marginBottom: 48 }}>
          {/* Category */}
          <div style={{
            display: 'inline-flex',
            background: `rgba(${article.category === 'Mental Health' ? '167,139,250' : '251,191,36'},0.15)`,
            color: article.category === 'Mental Health' ? '#E9D5FF' : '#FCD34D',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {article.category}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(28px,5vw,44px)',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'Playfair Display, Georgia, serif',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            {article.title}
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 24,
            paddingBottom: 24,
            borderBottom: '1px solid rgba(167,139,250,0.15)',
          }}>
            <span>📅 {new Date(article.publishedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>✍️ {article.author}</span>
            <span>⏱ {article.readTime} min read</span>
          </div>

          {/* Content */}
          <div style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.75)',
            marginBottom: 48,
          }}>
            {article.content.split('\n\n').map((paragraph, i) => {
              // Check if it's a heading
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)[0].length;
                const text = paragraph.replace(/^#+\s/, '');
                const sizes = { 1: 32, 2: 24, 3: 20, 4: 18 };
                const colors = { 1: '#fff', 2: '#E9D5FF', 3: '#E9D5FF', 4: '#E9D5FF' };
                const margins = { 1: '40px 0 20px', 2: '32px 0 16px', 3: '24px 0 12px', 4: '16px 0 8px' };

                return (
                  <h2 key={i} style={{
                    fontSize: sizes[level],
                    fontWeight: 700,
                    color: colors[level],
                    margin: margins[level],
                    fontFamily: level === 1 ? 'Playfair Display, Georgia, serif' : 'Plus Jakarta Sans',
                  }}>
                    {text}
                  </h2>
                );
              }

              // Check if it's a list
              if (paragraph.startsWith('-')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('-'));
                return (
                  <ul key={i} style={{ paddingLeft: 24, marginBottom: 16, listStyleType: 'disc' }}>
                    {items.map((item, j) => (
                      <li key={j} style={{ marginBottom: 8, color: 'rgba(255,255,255,0.75)' }}>
                        {item.replace(/^-\s/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={i} style={{ marginBottom: 16 }}>
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            paddingTop: 24,
            borderTop: '1px solid rgba(167,139,250,0.15)',
            marginBottom: 48,
          }}>
            {article.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 13,
                  background: 'rgba(167,139,250,0.1)',
                  color: '#C4B5FD',
                  padding: '4px 12px',
                  borderRadius: 14,
                  fontWeight: 500,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            background: 'rgba(109,74,255,0.15)',
            border: `2px solid ${P}`,
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Need support on this topic?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
              Connect with peers experiencing similar challenges or book a session with a professional therapist.
            </p>
            <Link to="/" style={{
              display: 'inline-block',
              background: P,
              color: '#120B2E',
              padding: '10px 24px',
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Get Support
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px solid rgba(167,139,250,0.15)' }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 32,
              fontFamily: 'Playfair Display, Georgia, serif',
            }}>
              Related Articles
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
            }}>
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(109,74,255,0.08)',
                    border: '1px solid rgba(167,139,250,0.15)',
                    borderRadius: 12,
                    padding: 16,
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
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>
                    {related.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
                    {related.excerpt}
                  </p>
                  <div style={{ color: P, fontWeight: 600, fontSize: 12 }}>
                    Read →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* JSON-LD Schema for Article */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            image: article.image,
            datePublished: article.publishedDate,
            dateModified: article.updatedDate,
            author: {
              '@type': 'Organization',
              name: article.author,
              url: 'https://soulconnect.health',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SoulConnect',
              url: 'https://soulconnect.health',
              logo: {
                '@type': 'ImageObject',
                url: 'https://soulconnect.health/logo-icon-512.png',
                width: 512,
                height: 512,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://soulconnect.health/blog/${article.slug}`,
            },
            keywords: article.keywords.join(','),
            wordCount: article.content.split(/\s+/).length,
            articleBody: article.content,
          })
        }} />
      </div>
    </div>
  );
}
