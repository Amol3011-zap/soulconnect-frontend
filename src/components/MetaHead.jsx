import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMetaTags } from '../lib/metadata';
import { getArticleBySlug } from '../data/articles';
import emotionContentLibrary from '../data/emotionContentLibrary';

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

    // Add schema for explore pages
    if (location.pathname.startsWith('/explore/') && location.pathname !== '/explore') {
      const emotionSlug = location.pathname.split('/explore/')[1];
      addArticleSchema(emotionSlug);
      addFAQSchema(emotionSlug);
      addBreadcrumbSchema(emotionSlug);
    } else {
      removeArticleSchema();
      removeFAQSchema();
      removeBreadcrumbSchema();
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
 * Add Article schema structured data for emotion detail pages
 */
function addArticleSchema(emotionSlug) {
  removeArticleSchema();

  const emotion = emotionContentLibrary.find(e => e.slug === emotionSlug);

  if (!emotion) {
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': emotion.seo?.title || emotion.displayName,
    'description': emotion.seo?.description,
    'url': `https://soulconnect.health/explore/${emotion.slug}`,
    'image': 'https://soulconnect.health/og-image.png',
    'datePublished': emotion.datePublished || '2024-01-01',
    'dateModified': emotion.lastReviewedDate || '2026-07-17',
    'author': {
      '@type': 'Organization',
      'name': 'SoulConnect'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SoulConnect',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://soulconnect.health/logo-icon-512.png'
      }
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'article-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove Article schema
 */
function removeArticleSchema() {
  const script = document.querySelector('script#article-schema');
  if (script) {
    script.remove();
  }
}

/**
 * Add FAQ schema structured data for emotion detail pages
 */
function addFAQSchema(emotionSlug) {
  removeFAQSchema(); // Remove existing schema first

  const emotion = emotionContentLibrary.find(e => e.slug === emotionSlug);

  if (!emotion || !emotion.faq || emotion.faq.length === 0) {
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: emotion.faq.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

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

/**
 * Add WebPage schema for emotion detail pages
 */
function addWebPageSchema() {
  removeWebPageSchema();

  const pathname = window.location.pathname;
  const emotionSlug = pathname.split('/explore/')[1];
  const emotionName = emotionSlug.charAt(0).toUpperCase() + emotionSlug.slice(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'url': `https://soulconnect.health${pathname}`,
    'name': `${emotionName} Support | SoulConnect`,
    'description': `Learn about ${emotionName} - understanding symptoms, coping strategies, and how to get support on SoulConnect's emotion library.`,
    'publisher': {
      '@type': 'Organization',
      'name': 'SoulConnect',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://soulconnect.health/logo.png'
      }
    },
    'isPartOf': {
      '@type': 'WebSite',
      'url': 'https://soulconnect.health',
      'name': 'SoulConnect'
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'webpage-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove WebPage schema
 */
function removeWebPageSchema() {
  const script = document.querySelector('script#webpage-schema');
  if (script) {
    script.remove();
  }
}

/**
 * Add BreadcrumbList schema for emotion detail pages
 */
function addBreadcrumbSchema(emotionSlug) {
  removeBreadcrumbSchema();

  const emotion = emotionContentLibrary.find(e => e.slug === emotionSlug);
  if (!emotion) {
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://soulconnect.health'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Emotion Library',
        'item': 'https://soulconnect.health/explore'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': emotion.displayName,
        'item': `https://soulconnect.health/explore/${emotion.slug}`
      }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'breadcrumb-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove BreadcrumbList schema
 */
function removeBreadcrumbSchema() {
  const script = document.querySelector('script#breadcrumb-schema');
  if (script) {
    script.remove();
  }
}

/**
 * Add Organization schema for SoulConnect
 */
function addOrganizationSchema() {
  removeOrganizationSchema();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'SoulConnect',
    'url': 'https://soulconnect.health',
    'logo': 'https://soulconnect.health/logo.png',
    'description': 'Peer support and mental health platform for anxiety, depression, grief, and emotional wellness in India',
    'sameAs': [
      'https://www.facebook.com/soulconnect',
      'https://www.instagram.com/soulconnect',
      'https://www.twitter.com/soulconnect'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Support',
      'url': 'https://soulconnect.health/contact'
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'organization-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Remove Organization schema
 */
function removeOrganizationSchema() {
  const script = document.querySelector('script#organization-schema');
  if (script) {
    script.remove();
  }
}
