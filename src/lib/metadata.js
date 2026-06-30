/**
 * Centralized metadata configuration for all public pages
 * Each route has unique: title, description, og:*, canonical
 */

export const METADATA = {
  '/': {
    title: 'SoulConnect | Peer Support for Mental Health & Wellness',
    description: 'Find support, connection, and community for anxiety, depression, grief, and mental health challenges. Join India\'s peer support and healing platform.',
    canonical: 'https://soulconnect.health/',
    ogType: 'website',
    keywords: 'peer support india, mental health support, anxiety support group, depression help, grief counselling, online community, peer counseling',
  },
  '/about': {
    title: 'About SoulConnect | Our Mission & Values',
    description: 'Learn about SoulConnect\'s peer support platform, our mission to build compassionate communities, and how we\'re changing mental health support in India.',
    canonical: 'https://soulconnect.health/about',
    ogType: 'website',
    keywords: 'about soulconnect, peer support mission, mental health community, healing platform india',
  },
  '/crisis-support': {
    title: 'Crisis Support Resources | Immediate Mental Health Help',
    description: 'Emergency crisis support resources for India. Immediate helplines (iCall, Vandrevala, Tele-MANAS, AASRA) available 24/7. Get help now.',
    canonical: 'https://soulconnect.health/crisis-support',
    ogType: 'website',
    keywords: 'crisis support, mental health emergency, suicide prevention india, crisis helpline, emergency mental health',
  },
  '/safety': {
    title: 'Safety & Moderation | SoulConnect Community Standards',
    description: 'How SoulConnect ensures community safety through moderation, anonymous peer support, and clear safety guidelines for all members.',
    canonical: 'https://soulconnect.health/safety',
    ogType: 'website',
    keywords: 'community safety, moderation standards, peer support safety, anonymous support',
  },
  '/contact': {
    title: 'Contact SoulConnect | Get in Touch',
    description: 'Contact SoulConnect for support, feedback, or inquiries. Reach our community team via email. We\'re here to help.',
    canonical: 'https://soulconnect.health/contact',
    ogType: 'website',
    keywords: 'contact us, support, feedback, soulconnect team',
  },
  '/privacy': {
    title: 'Privacy Policy | Data Protection & Your Rights',
    description: 'SoulConnect Privacy Policy. Learn how we protect your personal data, respect your anonymity, and comply with privacy regulations in India.',
    canonical: 'https://soulconnect.health/privacy',
    ogType: 'website',
    keywords: 'privacy policy, data protection, gdpr, dpdpa 2023, user privacy',
  },
  '/terms': {
    title: 'Terms of Service | SoulConnect User Agreement',
    description: 'SoulConnect Terms of Service. Read our user agreement, community guidelines, and terms governing your use of our peer support platform.',
    canonical: 'https://soulconnect.health/terms',
    ogType: 'website',
    keywords: 'terms of service, user agreement, terms and conditions, community guidelines',
  },
  '/cookies': {
    title: 'Cookie Policy | SoulConnect',
    description: 'SoulConnect Cookie Policy. Understand how we use cookies and tracking technologies to improve your experience.',
    canonical: 'https://soulconnect.health/cookies',
    ogType: 'website',
    keywords: 'cookie policy, tracking, analytics, user preferences',
  },
  '/accessibility': {
    title: 'Accessibility Statement | SoulConnect',
    description: 'SoulConnect Accessibility Statement. We\'re committed to making our platform accessible to everyone.',
    canonical: 'https://soulconnect.health/accessibility',
    ogType: 'website',
    keywords: 'accessibility, wcag, inclusive design, disability support',
  },
  '/community-rules': {
    title: 'Community Guidelines | SoulConnect',
    description: 'SoulConnect Community Guidelines. Learn about respectful peer support, moderation, and how to create a safe, inclusive community.',
    canonical: 'https://soulconnect.health/community-rules',
    ogType: 'website',
    keywords: 'community guidelines, code of conduct, respectful support',
  },
  '/guide-terms': {
    title: 'Guide & Support Terms | SoulConnect',
    description: 'Terms for guides and support circle hosts on SoulConnect. Responsibilities and guidelines for facilitating peer support.',
    canonical: 'https://soulconnect.health/guide-terms',
    ogType: 'website',
    keywords: 'guide terms, support circle, host guidelines, facilitation',
  },
  '/report': {
    title: 'Report a Concern | SoulConnect Safety',
    description: 'Report community concerns or safety issues on SoulConnect. Our moderation team reviews all reports promptly.',
    canonical: 'https://soulconnect.health/report',
    ogType: 'website',
    keywords: 'report concern, safety issue, moderation, community safety',
  },
  '/professionals': {
    title: 'Professional Therapists & Healers | Book Sessions',
    description: 'Browse verified therapists, counsellors, and wellness professionals on SoulConnect. Book confidential sessions starting at ₹600.',
    canonical: 'https://soulconnect.health/professionals',
    ogType: 'website',
    keywords: 'therapist booking, online counselling, mental health professionals, therapy sessions',
  },
  '/healers': {
    title: 'Verified Healers & Support Practitioners | SoulConnect',
    description: 'Connect with verified therapists, counsellors, life coaches, and wellness practitioners. Anonymous, confidential support.',
    canonical: 'https://soulconnect.health/healers',
    ogType: 'website',
    keywords: 'verified therapist, counsellor, psychologist, wellness coach, online therapy',
  },
  '/blog': {
    title: 'Mental Health & Wellness Articles | SoulConnect Blog',
    description: 'Read expert articles on anxiety, depression, grief, relationships, mindfulness and mental health. Science-backed guidance for your wellbeing journey.',
    canonical: 'https://soulconnect.health/blog',
    ogType: 'website',
    keywords: 'mental health articles, anxiety help, depression support, grief counseling, mindfulness, wellness tips',
  },
};

/**
 * Get metadata for a route
 * Falls back to homepage metadata if route not found
 */
export function getMetadata(pathname) {
  return METADATA[pathname] || METADATA['/'];
}

/**
 * Generate HTML meta tags for a route
 */
export function generateMetaTags(pathname) {
  const meta = getMetadata(pathname);
  const imageUrl = 'https://soulconnect.health/og-image.png';

  return {
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    keywords: meta.keywords,
    og: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      image: imageUrl,
      type: meta.ogType,
      locale: 'en_IN',
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      image: imageUrl,
    },
  };
}
