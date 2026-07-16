import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMetaTags } from '../lib/metadata';
import { getArticleBySlug } from '../data/articles';

/**
 * MetaHead - Dynamically injects unique metadata for each route
 * Updates title, canonical, og:*, and twitter: tags
 * Supports dynamic blog article pages
 */
export default function MetaHead() {
  const location = useLocation();

  useEffect(() => {
    let meta;

    // Handle blog article detail pages (/blog/:slug)
    if (location.pathname.startsWith('/blog/')) {
      const slug = location.pathname.split('/blog/')[1];
      const article = getArticleBySlug(slug);

      if (article) {
        const imageUrl = article.image || 'https://soulconnect.health/og-image.png';
        meta = {
          title: `${article.title} | SoulConnect Blog`,
          description: article.description,
          canonical: `https://soulconnect.health/blog/${article.slug}`,
          keywords: article.keywords.join(', '),
          og: {
            title: article.title,
            description: article.excerpt,
            url: `https://soulconnect.health/blog/${article.slug}`,
            image: imageUrl,
            type: 'article',
            locale: 'en_IN',
          },
          twitter: {
            title: article.title,
            description: article.excerpt,
            image: imageUrl,
          },
        };
      } else {
        // Fallback to generated tags if article not found
        meta = generateMetaTags(location.pathname);
      }
    } else {
      // Use standard metadata generation for other routes
      meta = generateMetaTags(location.pathname);
    }

    // Update title
    document.title = meta.title;

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = meta.canonical;

    // Update or create meta description
    updateOrCreateMeta('description', meta.description);

    // Update or create meta keywords
    updateOrCreateMeta('keywords', meta.keywords);

    // Update Open Graph tags
    updateOrCreateMeta('og:title', meta.og.title, 'property');
    updateOrCreateMeta('og:description', meta.og.description, 'property');
    updateOrCreateMeta('og:url', meta.og.url, 'property');
    updateOrCreateMeta('og:image', meta.og.image, 'property');
    updateOrCreateMeta('og:type', meta.og.type, 'property');
    updateOrCreateMeta('og:locale', meta.og.locale, 'property');

    // Update Twitter Card tags
    updateOrCreateMeta('twitter:title', meta.twitter.title);
    updateOrCreateMeta('twitter:description', meta.twitter.description);
    updateOrCreateMeta('twitter:image', meta.twitter.image);
    updateOrCreateMeta('twitter:card', 'summary_large_image');

    // Add FAQ schema for emotion detail pages
    if (location.pathname.startsWith('/explore/') && location.pathname !== '/explore') {
      addFAQSchema();
    } else {
      removeFAQSchema();
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

/**
 * Helper to update or create a meta tag
 */
function updateOrCreateMeta(name, content, attribute = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Add FAQ schema structured data for emotion detail pages
 */
function addFAQSchema() {
  removeFAQSchema(); // Remove existing schema first

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  };

  // This will be populated with actual FAQ data from the emotion pages
  // The FAQ schema helps Google understand Q&A sections and display them in search results

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'faq-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove FAQ schema structured data
 */
function removeFAQSchema() {
  const script = document.querySelector('script#faq-schema');
  if (script) {
    script.remove();
  }
}
