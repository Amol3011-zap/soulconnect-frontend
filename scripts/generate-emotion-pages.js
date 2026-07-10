/**
 * generate-emotion-pages.js - Static Prerendering for Emotion Library
 *
 * Runs after `vite build`. Generates static HTML files for each emotion page.
 * Each page includes proper SEO metadata, OpenGraph tags, and Twitter cards.
 *
 * FLOW:
 * 1. Import emotions config from dist/data/emotions.ts (compiled to JS)
 * 2. Read production index.html from dist/
 * 3. For each emotion:
 *    - Create directory: dist/explore/{slug}/
 *    - Create file: dist/explore/{slug}/index.html
 *    - Inject emotion-specific metadata in <head>
 *    - Preserve root div and app scripts
 * 4. Log results and statistics
 *
 * PRODUCTION URLs: https://soulconnect.health/explore/{slug}
 * LOCAL TESTING: Use localhost:5173/explore/{slug}
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const distIndex = resolve(distDir, 'index.html');

/**
 * Emotions configuration - manually defined here to avoid import issues
 * Keep in sync with src/data/emotions.ts
 */
const emotions = [
  {
    slug: 'anxiety',
    title: 'Anxiety Support Community | Connect & Heal',
    description: 'Find peer support for anxiety, panic attacks, and worry. Connect with people experiencing similar struggles and discover evidence-based coping strategies on SoulConnect.',
    keywords: ['anxiety support', 'anxiety disorder', 'manage anxiety', 'anxiety help', 'stress relief'],
    image: '/og/anxiety.jpg',
    color: '#7C3AED'
  },
  {
    slug: 'depression',
    title: 'Depression Support & Peer Counseling | SoulConnect',
    description: 'Connect with others experiencing depression. Access peer support, healing resources, and verified therapists to help you through depressive episodes on SoulConnect.',
    keywords: ['depression support', 'depression help', 'manage depression', 'depression treatment', 'mental health'],
    image: '/og/depression.jpg',
    color: '#8B5CF6'
  },
  {
    slug: 'grief',
    title: 'Grief Support & Loss Counseling | Healing Community',
    description: 'Navigate grief and loss with compassionate peer support. Share your feelings about losing a loved one and heal together with others who understand your pain.',
    keywords: ['grief support', 'bereavement counseling', 'loss support', 'death of loved one', 'grief healing'],
    image: '/og/grief.jpg',
    color: '#A855F7'
  },
  {
    slug: 'stress',
    title: 'Stress Management & Relief | Peer Support Platform',
    description: 'Manage overwhelming stress with peer support and coping techniques. Connect with others facing similar pressures and find sustainable relief strategies.',
    keywords: ['stress management', 'stress relief', 'cope with stress', 'stress support', 'anxiety management'],
    image: '/og/stress.jpg',
    color: '#A855F7'
  },
  {
    slug: 'loneliness',
    title: 'Loneliness Support & Social Connection | SoulConnect',
    description: 'Combat loneliness with a supportive peer community. Find meaningful connections and discover ways to build lasting relationships and combat social isolation.',
    keywords: ['loneliness support', 'social isolation', 'connect with others', 'overcome loneliness', 'make friends'],
    image: '/og/loneliness.jpg',
    color: '#7C3AED'
  },
  {
    slug: 'anger',
    title: 'Anger Management Support & Emotional Control | SoulConnect',
    description: 'Develop healthy ways to manage anger and frustration. Connect with peers and learn evidence-based techniques for emotional regulation and impulse control.',
    keywords: ['anger management', 'control anger', 'anger support', 'emotional regulation', 'frustration management'],
    image: '/og/anger.jpg',
    color: '#EC4899'
  },
  {
    slug: 'self-doubt',
    title: 'Self-Doubt Support & Confidence Building | Peer Help',
    description: 'Overcome self-doubt and build confidence with peer support. Connect with others and develop a healthier relationship with self-esteem.',
    keywords: ['self-doubt support', 'lack of confidence', 'build confidence', 'self-esteem', 'self-worth'],
    image: '/og/self-doubt.jpg',
    color: '#8B5CF6'
  },
  {
    slug: 'relationship-issues',
    title: 'Relationship Support & Communication Help | SoulConnect',
    description: 'Improve relationships with peer guidance and communication strategies. Connect with others navigating similar challenges in marriage, dating, or partnerships.',
    keywords: ['relationship support', 'marriage counseling', 'dating advice', 'communication skills', 'relationship help'],
    image: '/og/relationship-issues.jpg',
    color: '#EC4899'
  },
  {
    slug: 'work-stress',
    title: 'Work Stress & Career Support | Professional Wellness',
    description: 'Manage work-related stress and career challenges. Find peer support from professionals dealing with similar workplace issues and burnout.',
    keywords: ['work stress', 'job stress', 'career support', 'workplace anxiety', 'professional stress'],
    image: '/og/work-stress.jpg',
    color: '#F97316'
  },
  {
    slug: 'financial-worry',
    title: 'Financial Stress Support & Money Anxiety Help | SoulConnect',
    description: 'Manage financial anxiety and money worries with peer support. Connect with others navigating debt, savings, and economic stress.',
    keywords: ['financial stress', 'money anxiety', 'financial help', 'debt support', 'money management'],
    image: '/og/financial-worry.jpg',
    color: '#10B981'
  },
  {
    slug: 'sleep-issues',
    title: 'Sleep Support & Insomnia Help | Better Sleep Community',
    description: 'Overcome insomnia and sleep problems with peer support. Discover sleep strategies and connect with others dealing with rest disturbances.',
    keywords: ['sleep support', 'insomnia help', 'sleep problems', 'sleep anxiety', 'sleep disorders'],
    image: '/og/sleep-issues.jpg',
    color: '#06B6D4'
  },
  {
    slug: 'panic-attacks',
    title: 'Panic Attack Support & Management | SoulConnect',
    description: 'Learn to manage panic attacks with peer support and coping strategies. Connect with others who understand the fear and physical symptoms of panic.',
    keywords: ['panic attacks', 'panic disorder', 'panic support', 'anxiety attacks', 'cope with panic'],
    image: '/og/panic-attacks.jpg',
    color: '#EF4444'
  },
  {
    slug: 'social-anxiety',
    title: 'Social Anxiety Support & Confidence | Peer Community',
    description: 'Overcome social anxiety with supportive peers. Connect with others who fear social situations and learn gradual exposure techniques together.',
    keywords: ['social anxiety', 'social phobia', 'anxiety in social situations', 'shyness support', 'social confidence'],
    image: '/og/social-anxiety.jpg',
    color: '#7C3AED'
  },
  {
    slug: 'perfectionism',
    title: 'Perfectionism Support & Balance | Breaking Free',
    description: 'Overcome perfectionism and achieve balance. Connect with peers and learn to embrace imperfection and self-compassion.',
    keywords: ['perfectionism support', 'perfectionist tendencies', 'performance anxiety', 'self-compassion', 'overcomplexity'],
    image: '/og/perfectionism.jpg',
    color: '#3B82F6'
  },
  {
    slug: 'overwhelm',
    title: 'Overwhelm Support & Coping Strategies | SoulConnect',
    description: 'Manage feeling overwhelmed with practical peer support. Learn to prioritize and regain control when everything feels like too much.',
    keywords: ['overwhelm support', 'feel overwhelmed', 'stress management', 'coping strategies', 'too much pressure'],
    image: '/og/overwhelm.jpg',
    color: '#F59E0B'
  },
  {
    slug: 'low-self-esteem',
    title: 'Low Self-Esteem Support & Confidence Building | SoulConnect',
    description: 'Build self-esteem with peer support and evidence-based strategies. Connect with others working on self-worth and positive self-image.',
    keywords: ['low self-esteem', 'build self-esteem', 'self-worth', 'confidence building', 'self-image'],
    image: '/og/low-self-esteem.jpg',
    color: '#8B5CF6'
  },
  {
    slug: 'burnout',
    title: 'Burnout Recovery & Prevention | Wellness Support',
    description: 'Recover from professional burnout with peer guidance. Learn sustainable recovery strategies and reconnect with purpose and energy.',
    keywords: ['burnout support', 'burnout recovery', 'work exhaustion', 'prevent burnout', 'emotional exhaustion'],
    image: '/og/burnout.jpg',
    color: '#F59E0B'
  },
  {
    slug: 'jealousy',
    title: 'Jealousy Support & Secure Attachment | SoulConnect',
    description: 'Manage jealousy in relationships with peer support. Learn to address insecurity and build trust with compassion.',
    keywords: ['jealousy support', 'manage jealousy', 'relationship jealousy', 'insecurity', 'trust in relationships'],
    image: '/og/jealousy.jpg',
    color: '#EC4899'
  },
  {
    slug: 'guilt',
    title: 'Guilt Support & Emotional Processing | Healing',
    description: 'Process guilt and regret with compassionate peer support. Learn to forgive yourself and move forward with healing.',
    keywords: ['guilt support', 'manage guilt', 'emotional guilt', 'forgive yourself', 'guilt processing'],
    image: '/og/guilt.jpg',
    color: '#8B5CF6'
  },
  {
    slug: 'shame',
    title: 'Shame Support & Self-Compassion | SoulConnect',
    description: 'Overcome shame with peer support and self-compassion strategies. Connect with others and heal from shame-based thinking patterns.',
    keywords: ['shame support', 'manage shame', 'shame resilience', 'self-compassion', 'shame healing'],
    image: '/og/shame.jpg',
    color: '#7C3AED'
  },
  {
    slug: 'trauma',
    title: 'Trauma Support & PTSD Help | Healing Community',
    description: 'Process trauma with supportive peers and professional guidance. Connect with others on healing journeys and access verified trauma-informed therapists.',
    keywords: ['trauma support', 'PTSD help', 'trauma healing', 'post-traumatic stress', 'trauma recovery'],
    image: '/og/trauma.jpg',
    color: '#EF4444'
  },
  {
    slug: 'addiction',
    title: 'Addiction Support & Recovery | Peer Community',
    description: 'Find peer support for addiction recovery. Connect with others in recovery journeys and access verified addiction counselors and support resources.',
    keywords: ['addiction support', 'addiction recovery', 'substance abuse help', 'recovery community', 'rehab support'],
    image: '/og/addiction.jpg',
    color: '#06B6D4'
  },
  {
    slug: 'body-image',
    title: 'Body Image Support & Self-Acceptance | SoulConnect',
    description: 'Build a healthy relationship with your body with peer support. Connect with others working on body acceptance and intuitive living.',
    keywords: ['body image support', 'body confidence', 'eating disorder support', 'self-acceptance', 'body positivity'],
    image: '/og/body-image.jpg',
    color: '#EC4899'
  },
  {
    slug: 'imposter-syndrome',
    title: 'Imposter Syndrome Support & Confidence | Career Help',
    description: 'Overcome imposter syndrome with peer validation and strategies. Connect with high-achievers sharing similar self-doubt despite their success.',
    keywords: ['imposter syndrome', 'imposter feelings', 'overcome self-doubt', 'career confidence', 'achievement anxiety'],
    image: '/og/imposter-syndrome.jpg',
    color: '#3B82F6'
  },
  {
    slug: 'purpose-meaning',
    title: 'Life Purpose & Meaning Support | Wellness Community',
    description: 'Discover life purpose and meaning with peer exploration. Connect with others seeking direction and fulfillment in their lives.',
    keywords: ['life purpose', 'find meaning', 'existential questions', 'life direction', 'personal fulfillment'],
    image: '/og/purpose-meaning.jpg',
    color: '#06B6D4'
  }
];

/**
 * Determine the base URL for social media previews
 * Always use production domain for canonical URLs
 * Never use localhost - canonical must always point to production
 */
function getBaseUrl() {
  // Always use production domain for SEO - canonical URLs must not vary
  return 'https://soulconnect.health';
}

/**
 * Generate metadata HTML for head section
 * Includes SEO tags, OpenGraph, Twitter, and canonical links
 */
function generateMetaHead(emotion, baseUrl) {
  const canonicalUrl = `${baseUrl}/explore/${emotion.slug}`;
  const ogImageUrl = `${baseUrl}${emotion.image}`;

  return `
    <!-- Emotion-Specific Metadata (Prerendered) -->
    <title>${emotion.title} | SoulConnect</title>
    <meta name="description" content="${emotion.description}">
    <meta name="keywords" content="${emotion.keywords.join(', ')}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph Tags -->
    <meta property="og:title" content="${emotion.title}">
    <meta property="og:description" content="${emotion.description}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="SoulConnect">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${emotion.title}">
    <meta name="twitter:description" content="${emotion.description}">
    <meta name="twitter:image" content="${ogImageUrl}">
    <meta name="twitter:site" content="@SoulConnect">

    <!-- Emotion Theme Color -->
    <meta name="theme-color" content="${emotion.color}">

    <!-- Structured Data - Breadcrumb -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "${baseUrl}"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Explore",
          "item": "${baseUrl}/explore"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${emotion.title.replace(' | SoulConnect', '')}",
          "item": "${canonicalUrl}"
        }
      ]
    }
    </script>
  `.trim();
}

/**
 * Main function: Generate all emotion pages
 */
async function generateEmotionPages() {
  try {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📄 GENERATING EMOTION LIBRARY PRERENDERED PAGES');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    // Step 1: Verify dist/index.html exists
    if (!existsSync(distIndex)) {
      throw new Error(`Production build not found at ${distIndex}. Run 'npm run build' first.`);
    }

    let indexHtml = readFileSync(distIndex, 'utf-8');
    const baseUrl = getBaseUrl();

    console.log(`✓ Base URL: ${baseUrl}`);
    console.log(`✓ Reading template from: dist/index.html`);
    console.log('');

    // Step 2: Process each emotion
    let successCount = 0;
    let errorCount = 0;
    const generatedPaths = [];

    for (const emotion of emotions) {
      try {
        // Create directory: dist/explore/{slug}/
        const emotionDir = resolve(distDir, 'explore', emotion.slug);
        mkdirSync(emotionDir, { recursive: true });

        // Generate metadata head
        const metaHead = generateMetaHead(emotion, baseUrl);

        // Prepare emotion page HTML
        // First remove any existing title tag to avoid duplicates
        let emotionHtml = indexHtml.replace(/<title>.*?<\/title>/s, '');

        // Insert metadata before closing </head> tag
        emotionHtml = emotionHtml.replace(
          '</head>',
          `  ${metaHead}\n  </head>`
        );

        // Add data attribute to root for client-side React to identify emotion page
        emotionHtml = emotionHtml.replace(
          '<div id="root">',
          `<div id="root" data-emotion-slug="${emotion.slug}">`
        );

        // Write emotion page
        const emotionPagePath = resolve(emotionDir, 'index.html');
        writeFileSync(emotionPagePath, emotionHtml, 'utf-8');

        generatedPaths.push(`/explore/${emotion.slug}/index.html`);
        successCount++;

        console.log(`  ✓ ${emotion.slug.padEnd(20)} -> dist/explore/${emotion.slug}/index.html`);
      } catch (err) {
        console.error(`  ✗ ${emotion.slug.padEnd(20)} FAILED: ${err.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 PRERENDERING COMPLETE');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`✓ Successfully generated: ${successCount} emotion pages`);
    if (errorCount > 0) {
      console.log(`✗ Failed: ${errorCount} emotion pages`);
    }
    console.log('');

    console.log('🎯 GENERATED PAGES:');
    generatedPaths.forEach((path) => {
      console.log(`   ${path}`);
    });
    console.log('');

    console.log('🔍 SOCIAL MEDIA OPTIMIZATION:');
    console.log('  ✓ OpenGraph tags injected (og:title, og:description, og:image)');
    console.log('  ✓ Twitter Card tags injected (twitter:card, twitter:image)');
    console.log('  ✓ Canonical URLs set for deduplication');
    console.log('  ✓ Breadcrumb schema for navigation context');
    console.log('  ✓ Theme colors for browser UI');
    console.log('');

    console.log('📱 PLATFORM COMPATIBILITY:');
    console.log('  ✓ Google Search - meta description, keywords, canonical');
    console.log('  ✓ Twitter/X - twitter:card with image preview');
    console.log('  ✓ WhatsApp - og:image, og:title, og:description');
    console.log('  ✓ Discord - og:image, og:title for embeds');
    console.log('  ✓ Facebook - og:image, og:type for sharing');
    console.log('');

    console.log('🚀 DEPLOYMENT:');
    console.log('  ✓ All files in dist/explore/ will be deployed to Vercel');
    console.log('  ✓ Static pages served with cache headers');
    console.log('  ✓ React app hydrates on emotion pages');
    console.log('');

    console.log('✨ Ready for deployment!');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    // Exit successfully
    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('✗ PRERENDERING FAILED');
    console.error('════════════════════════════════════════════════════════════');
    console.error(err.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Ensure npm run build completed successfully');
    console.error('  2. Check that dist/index.html exists');
    console.error('  3. Verify emotions array has valid data');
    console.error('════════════════════════════════════════════════════════════');
    console.error('');
    process.exit(1);
  }
}

// Execute
generateEmotionPages();
