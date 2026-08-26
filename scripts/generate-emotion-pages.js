/**
 * generate-emotion-pages.js - Static Prerendering for Emotion Library
 *
 * Runs after `vite build`. Generates static HTML files for each emotion page.
 * Each page includes proper SEO metadata, OpenGraph tags, and Twitter cards.
 *
 * FLOW:
 * 1. Import the real emotion content from src/data/emotionContentLibrary.ts
 *    (the same source the live React app renders from) so this prerender
 *    list can never drift from what actually exists on the site.
 * 2. Read production index.html from dist/
 * 3. For each emotion:
 *    - Create directory: dist/explore/{slug}/
 *    - Create file: dist/explore/{slug}/index.html
 *    - Strip the template's existing title/canonical/description/keywords/
 *      OG/Twitter tags, then inject emotion-specific metadata in <head>
 *    - Preserve root div and app scripts
 * 4. Log results and statistics
 *
 * PRODUCTION URLs: https://soulconnect.health/explore/{slug}
 * LOCAL TESTING: Use localhost:5173/explore/{slug}
 *
 * NOTE ON THE .ts IMPORT: Node (v22.6+/23.6+, default-on in later v24.x)
 * supports importing TypeScript files with only type-erasable syntax via
 * `--experimental-strip-types`. emotionContentLibrary.ts has no enum/
 * namespace/parameter-property usage, so it qualifies. The npm build script
 * below passes the flag explicitly rather than relying on a given Node
 * version's default, since the deploy environment's exact Node version
 * isn't guaranteed.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { emotionContentLibrary } from '../src/data/emotionContentLibrary.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const distIndex = resolve(distDir, 'index.html');

/**
 * Derive the prerender list directly from the real content library —
 * the single source of truth also used by metadata.js and the live
 * ExploreEmotionDetail page. Do not hand-maintain a parallel copy here.
 */
const emotions = emotionContentLibrary.map((e) => ({
  slug: e.slug,
  title: e.seo.title.includes('SoulConnect') ? e.seo.title : `${e.seo.title} | SoulConnect`,
  description: e.seo.description,
  keywords: e.seo.keywords,
  image: `/og/${e.slug}.jpg`,
  color: '#7C3AED',
  displayName: e.displayName,
  heroSubtitle: e.hero?.subtitle || '',
  summary: e.summary || '',
  tips: (e.tips || []).slice(0, 3),
}));

/**
 * A tiny per-page content block (H1 + real summary/tips text from
 * emotionContentLibrary.ts) so non-JS crawlers see genuine, page-specific
 * body content for this emotion rather than only the generic homepage
 * shell that inject-static.js already baked into the dist/index.html
 * template this script reuses. React's createRoot still overwrites all of
 * #root on mount, same as it already does for the homepage shell, so this
 * has no effect on the real rendered app.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Same as escapeHtml plus quote-escaping, for interpolation inside an
// HTML attribute value (content="...") rather than a text node — without
// this, a " in emotion.title/description/keywords breaks out of the
// attribute and can inject an arbitrary tag into every prerendered page's
// <head>. Current data has no such characters, but the content source
// (emotionContentLibrary.ts) is ordinary marketing copy edited by hand,
// not a trust boundary this script should rely on staying quote-free.
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

function generatePageContent(emotion, baseUrl) {
  const tipsHtml = emotion.tips.length
    ? `<ul style="text-align:left;max-width:560px;margin:0 auto;padding-left:20px;color:rgba(196,181,253,0.75);line-height:1.8;">${emotion.tips
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join('')}</ul>`
    : '';

  return `
  <section style="max-width:700px;margin:0 auto;padding:56px 24px 32px;text-align:center;">
    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#ede9fe;margin-bottom:16px;">${escapeHtml(
      emotion.displayName
    )}: Support &amp; Healing</h1>
    ${emotion.heroSubtitle ? `<p style="font-size:1.05rem;color:rgba(196,181,253,0.8);line-height:1.7;margin-bottom:20px;">${escapeHtml(emotion.heroSubtitle)}</p>` : ''}
    ${emotion.summary ? `<p style="font-size:1rem;color:rgba(196,181,253,0.7);line-height:1.75;margin-bottom:24px;">${escapeHtml(emotion.summary)}</p>` : ''}
    ${tipsHtml}
    <p style="margin-top:28px;"><a href="${baseUrl}/explore/${emotion.slug}" style="color:#a78bfa;font-weight:600;text-decoration:none;">Get peer support for ${escapeHtml(emotion.displayName.toLowerCase())} &rarr;</a></p>
  </section>`;
}

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

  const safeTitle = escapeAttr(emotion.title);
  const safeDescription = escapeAttr(emotion.description);
  const safeKeywords = escapeAttr(emotion.keywords.join(', '));

  return `
    <!-- Emotion-Specific Metadata (Prerendered) -->
    <title>${escapeHtml(emotion.title)}</title>
    <meta name="description" content="${safeDescription}">
    <meta name="keywords" content="${safeKeywords}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph Tags -->
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="SoulConnect">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
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
          "name": ${JSON.stringify(emotion.title.replace(' | SoulConnect', ''))},
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

        // Prepare emotion page HTML.
        // Strip every tag the template already defines that we're about to
        // inject a replacement for — title, canonical, description, keywords,
        // and OG/Twitter — so the emotion page ends up with exactly one of
        // each instead of two conflicting copies (the previous version only
        // stripped <title>, which left a duplicate, conflicting canonical on
        // every prerendered explore page).
        let emotionHtml = indexHtml
          .replace(/<title>.*?<\/title>\s*\n?/s, '')
          .replace(/<link rel="canonical"[^>]*>\s*\n?/, '')
          .replace(/<meta name="description"[^>]*>\s*\n?/, '')
          .replace(/<meta name="keywords"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:title"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:description"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:url"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:image"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:image:width"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:image:height"[^>]*>\s*\n?/, '')
          .replace(/<meta property="og:image:alt"[^>]*>\s*\n?/, '')
          .replace(/<meta name="twitter:card"[^>]*>\s*\n?/, '')
          .replace(/<meta name="twitter:title"[^>]*>\s*\n?/, '')
          .replace(/<meta name="twitter:description"[^>]*>\s*\n?/, '')
          .replace(/<meta name="twitter:image"[^>]*>\s*\n?/, '');

        // Insert metadata before closing </head> tag
        emotionHtml = emotionHtml.replace(
          '</head>',
          `  ${metaHead}\n  </head>`
        );

        // The reused template body (from inject-static.js's homepage shell)
        // has its own <h1>You Are Not Alone in This.</h1>. Demote it to <h2>
        // on this generated page only, so the page-specific <h1> we inject
        // below (the real, unique heading for this emotion) is the page's
        // only H1 — avoiding a duplicate-H1 issue. The homepage's own
        // dist/index.html is untouched since this script only ever writes
        // to dist/explore/{slug}/index.html.
        emotionHtml = emotionHtml.replace(
          /<h1 style="font-size:clamp\(2\.2rem,5vw,3\.8rem\)[^>]*>[\s\S]*?<\/h1>/,
          (match) => `<h2${match.slice(3, -5)}</h2>`
        );

        // Add data attribute to root for client-side React to identify emotion page,
        // and inject real per-emotion body content right inside #root so non-JS
        // crawlers see genuine page-specific text, not just the generic homepage
        // shell. React's createRoot still replaces all of #root's contents on
        // mount, so this is purely additive for crawlers/pre-hydration and has
        // no effect on the live rendered app.
        emotionHtml = emotionHtml.replace(
          '<div id="root">',
          `<div id="root" data-emotion-slug="${emotion.slug}">\n${generatePageContent(emotion, baseUrl)}`
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
