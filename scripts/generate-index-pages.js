/**
 * generate-index-pages.js - Static Prerendering for Public Index Routes
 *
 * Runs after `vite build`. Generates static HTML files for the public
 * "hub"/"index" routes that have no dynamic slug of their own — /pulse,
 * /blog, and /explore — mirroring the same file-based prerender pattern
 * generate-emotion-pages.js and generate-blog-pages.js already use for
 * /explore/{slug} and /blog/{slug}.
 *
 * WHY THIS SCRIPT EXISTS: Vercel's rewrite in vercel.json only falls back
 * to /index.html when no matching static file exists at the requested
 * path. generate-emotion-pages.js and generate-blog-pages.js write
 * dist/explore/{slug}/index.html and dist/blog/{slug}/index.html, so those
 * URLs get page-specific metadata. But nothing wrote dist/pulse/index.html,
 * dist/blog/index.html, or dist/explore/index.html — so those three routes
 * silently fell through to the homepage's dist/index.html and served the
 * homepage's title/description/canonical/OG tags to crawlers. This script
 * closes that gap using the exact same technique.
 *
 * SOURCE OF TRUTH: title/description/canonical/keywords for all three
 * routes come from src/lib/metadata.js — the same METADATA map MetaHead.jsx
 * reads client-side — so there is exactly one hand-maintained copy of this
 * metadata, not a second one that can drift (see CLAUDE.md's warning about
 * inject-static.js drifting from the app). Link lists (blog articles,
 * emotion categories) come from src/data/articles.js and
 * src/data/emotionContentLibrary.ts, the same sources the live pages and
 * the other two generator scripts already use.
 *
 * PRIVACY: /pulse's body content is deliberately static marketing copy
 * only. It must never include check-in counts, category breakdowns, or
 * geography — those are live, privacy-gated aggregates served by the
 * backend (see app/services/pulse_aggregation.py's threshold/delay model)
 * and must not be baked into a static file that bypasses that gating.
 *
 * FAIL-LOUD: PUBLIC_INDEX_ROUTES below is the exhaustive list of index-style
 * routes this script is responsible for. If metadata.js is missing an entry
 * for one of them, or a route in this list has no content builder, the
 * script throws and the build fails rather than silently reusing homepage
 * metadata again.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { METADATA } from '../src/lib/metadata.js';
import { ARTICLES } from '../src/data/articles.js';
import { emotionContentLibrary } from '../src/data/emotionContentLibrary.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const distIndex = resolve(distDir, 'index.html');

function getBaseUrl() {
  return 'https://soulconnect.health';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

/**
 * The route table this script is required to cover. Each entry names the
 * route, the directory to write it under, and the function that builds its
 * page-specific <div id="root"> body content (H1 + real crawlable text).
 * Adding a new public index-style route means adding a row here — the
 * fail-loud check below ensures a missing metadata.js entry or a route left
 * out of this file is a hard build failure, not a silent fallback to the
 * homepage shell.
 */
const PUBLIC_INDEX_ROUTES = [
  { route: '/pulse', dir: 'pulse', buildBody: buildPulseBody, jsonLd: buildPulseJsonLd },
  { route: '/blog', dir: 'blog', buildBody: buildBlogIndexBody, jsonLd: buildBlogIndexJsonLd },
  { route: '/explore', dir: 'explore', buildBody: buildExploreHubBody, jsonLd: buildExploreHubJsonLd },
];

function breadcrumbJsonLd(baseUrl, name, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name, item: `${baseUrl}${path}` },
    ],
  };
}

// --- /pulse -----------------------------------------------------------

function buildPulseBody(baseUrl) {
  // Static marketing copy only — no live check-in counts, category
  // breakdowns, or geography. Those are privacy-gated aggregates served
  // at runtime by GET /api/pulse/global and must stay that way.
  return `
  <section style="max-width:700px;margin:0 auto;padding:56px 24px 32px;text-align:center;">
    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#ede9fe;margin-bottom:16px;">Global Pulse: How India Is Feeling Right Now</h1>
    <p style="font-size:1.05rem;color:rgba(196,181,253,0.8);line-height:1.7;margin-bottom:20px;">An anonymous, aggregate look at how people across India are feeling right now — no name or email required.</p>
    <p style="font-size:1rem;color:rgba(196,181,253,0.7);line-height:1.75;margin-bottom:24px;">Check in privately with what you're going through, then see community-wide emotional trends on a live map. Individual check-ins are never shown — only aggregated, privacy-protected patterns across the community.</p>
    <p style="margin-top:28px;"><a href="${baseUrl}/pulse" style="color:#a78bfa;font-weight:600;text-decoration:none;">Check in anonymously &rarr;</a></p>
  </section>`;
}

function buildPulseJsonLd(baseUrl) {
  return [breadcrumbJsonLd(baseUrl, 'Global Pulse', '/pulse')];
}

// --- /blog (index) ------------------------------------------------------

function buildBlogIndexBody(baseUrl) {
  const articleLinks = ARTICLES.map(
    (a) => `
        <article style="padding:24px;border-radius:14px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);text-align:left;">
          <h2 style="font-size:16px;font-weight:700;color:#ede9fe;margin-bottom:8px;">
            <a href="${baseUrl}/blog/${a.slug}" style="color:inherit;text-decoration:none;">${escapeHtml(a.title)}</a>
          </h2>
          <p style="font-size:13px;color:rgba(196,181,253,0.5);margin-bottom:8px;">${escapeHtml(a.readTime ? `${a.readTime} min read` : '')}</p>
          <p style="font-size:14px;color:rgba(196,181,253,0.7);line-height:1.6;margin-bottom:12px;">${escapeHtml(a.excerpt)}</p>
          <a href="${baseUrl}/blog/${a.slug}" style="font-size:13px;color:#a78bfa;text-decoration:none;font-weight:600;">Read Article &rarr;</a>
        </article>`
  ).join('');

  return `
  <section style="max-width:1000px;margin:0 auto;padding:56px 24px 32px;text-align:center;">
    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#ede9fe;margin-bottom:16px;">Mental Health &amp; Wellness Articles</h1>
    <p style="font-size:1.05rem;color:rgba(196,181,253,0.8);line-height:1.7;margin-bottom:40px;">Science-backed guidance on anxiety, depression, grief, relationships, and mindfulness for your wellbeing journey.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;">${articleLinks}
    </div>
  </section>`;
}

function buildBlogIndexJsonLd(baseUrl) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SoulConnect Blog',
      url: `${baseUrl}/blog`,
      description: METADATA['/blog'].description,
      hasPart: ARTICLES.map((a) => ({
        '@type': 'Article',
        headline: a.title,
        url: `${baseUrl}/blog/${a.slug}`,
      })),
    },
    breadcrumbJsonLd(baseUrl, 'Blog', '/blog'),
  ];
}

// --- /explore (hub) -------------------------------------------------------

function buildExploreHubBody(baseUrl) {
  const emotionLinks = emotionContentLibrary
    .map(
      (e) =>
        `<a href="${baseUrl}/explore/${e.slug}" style="display:block;padding:14px 18px;border-radius:12px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);color:#ede9fe;text-decoration:none;font-size:14px;font-weight:600;">${escapeHtml(e.displayName)}</a>`
    )
    .join('');

  return `
  <section style="max-width:1000px;margin:0 auto;padding:56px 24px 32px;text-align:center;">
    <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#ede9fe;margin-bottom:16px;">Emotion Library: Support for Every Struggle</h1>
    <p style="font-size:1.05rem;color:rgba(196,181,253,0.8);line-height:1.7;margin-bottom:40px;">Expert-reviewed guides, coping strategies, and peer support resources for anxiety, depression, stress, grief, and ${emotionContentLibrary.length - 4} more specific life challenges.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;text-align:left;">${emotionLinks}
    </div>
  </section>`;
}

function buildExploreHubJsonLd(baseUrl) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Emotion Library',
      url: `${baseUrl}/explore`,
      description: METADATA['/explore'].description,
      hasPart: emotionContentLibrary.map((e) => ({
        '@type': 'WebPage',
        name: e.displayName,
        url: `${baseUrl}/explore/${e.slug}`,
      })),
    },
    breadcrumbJsonLd(baseUrl, 'Explore', '/explore'),
  ];
}

// --- shared head/meta assembly -------------------------------------------

function generateMetaHead(meta, jsonLdBlocks) {
  const safeTitle = escapeAttr(meta.title);
  const safeDescription = escapeAttr(meta.description);
  const safeKeywords = escapeAttr(meta.keywords || '');
  const canonicalUrl = meta.canonical;
  const ogImageUrl = `${getBaseUrl()}/og-image.png`;

  const jsonLdScripts = jsonLdBlocks
    .map((block) => `<script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n</script>`)
    .join('\n');

  return `
    <!-- Route-Specific Metadata (Prerendered) -->
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${safeDescription}">
    <meta name="keywords" content="${safeKeywords}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph Tags -->
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:type" content="${meta.ogType || 'website'}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="SoulConnect">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${ogImageUrl}">
    <meta name="twitter:site" content="@soulconnect">

    <!-- Structured Data -->
    ${jsonLdScripts}
  `.trim();
}

async function generateIndexPages() {
  try {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📄 GENERATING PUBLIC INDEX-ROUTE PRERENDERED PAGES');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    if (!existsSync(distIndex)) {
      throw new Error(`Production build not found at ${distIndex}. Run 'npm run build' first.`);
    }

    const indexHtml = readFileSync(distIndex, 'utf-8');
    const baseUrl = getBaseUrl();

    let successCount = 0;
    const generatedPaths = [];

    for (const { route, dir, buildBody, jsonLd } of PUBLIC_INDEX_ROUTES) {
      // Fail loud: this route is in our required list but metadata.js has
      // no entry for it — refuse to fall back to homepage metadata again.
      const meta = METADATA[route];
      if (!meta) {
        throw new Error(
          `Missing metadata.js entry for required public route "${route}". ` +
          `Add it to src/lib/metadata.js before this route can be prerendered — ` +
          `refusing to silently serve homepage metadata for it.`
        );
      }
      if (meta.canonical !== `${baseUrl}${route}`) {
        throw new Error(
          `metadata.js canonical for "${route}" is "${meta.canonical}", expected "${baseUrl}${route}". ` +
          `Fix the canonical in metadata.js before building.`
        );
      }

      const pageDir = resolve(distDir, dir);
      mkdirSync(pageDir, { recursive: true });

      const metaHead = generateMetaHead(meta, jsonLd(baseUrl));

      let pageHtml = indexHtml
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

      pageHtml = pageHtml.replace('</head>', `  ${metaHead}\n  </head>`);

      // Demote the reused homepage shell's own <h1> to <h2> so the
      // page-specific <h1> injected below is this page's only H1 — same
      // approach as generate-emotion-pages.js / generate-blog-pages.js.
      pageHtml = pageHtml.replace(
        /<h1 style="font-size:clamp\(2\.2rem,5vw,3\.8rem\)[^>]*>[\s\S]*?<\/h1>/,
        (match) => `<h2${match.slice(3, -5)}</h2>`
      );

      pageHtml = pageHtml.replace(
        '<div id="root">',
        `<div id="root" data-static-route="${dir}">\n${buildBody(baseUrl)}`
      );

      const pagePath = resolve(pageDir, 'index.html');
      writeFileSync(pagePath, pageHtml, 'utf-8');

      generatedPaths.push(`${dir}/index.html`);
      successCount++;
      console.log(`  ✓ ${route.padEnd(12)} -> dist/${dir}/index.html`);
    }

    console.log('');
    console.log(`✓ Successfully generated: ${successCount} index-route pages`);
    console.log('');
    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('✗ INDEX-ROUTE PRERENDERING FAILED');
    console.error('════════════════════════════════════════════════════════════');
    console.error(err.message);
    console.error('');
    process.exit(1);
  }
}

generateIndexPages();
