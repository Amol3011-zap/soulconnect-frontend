import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateMetaTags } from '../lib/metadata';

/**
 * MetaHead - Dynamically injects unique metadata for each route
 * Updates title, canonical, og:*, and twitter: tags
 */
export default function MetaHead() {
  const location = useLocation();

  useEffect(() => {
    const meta = generateMetaTags(location.pathname);

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
