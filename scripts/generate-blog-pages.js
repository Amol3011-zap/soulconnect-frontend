/**
 * generate-blog-pages.js - Static Prerendering for Blog Articles
 *
 * Runs after `vite build`. Generates static HTML files for each blog
 * article so non-JS crawlers get the real per-article title, description,
 * canonical, OG/Twitter tags, and Article JSON-LD — mirroring the same
 * pattern generate-emotion-pages.js uses for /explore/{slug}, and reusing
 * the exact metadata shape MetaHead.jsx already computes client-side for
 * /blog/:slug (see MetaHead.jsx's `location.pathname.startsWith('/blog/')`
 * branch) so there is exactly one source of per-article copy, not a second
 * hand-maintained one.
 *
 * FLOW:
 * 1. Import the real articles from src/data/articles.js (plain .js, no
 *    TS-import step needed).
 * 2. Read production index.html from dist/.
 * 3. For each article:
 *    - Create directory: dist/blog/{slug}/
 *    - Create file: dist/blog/{slug}/index.html
 *    - Strip the template's existing title/canonical/description/keywords/
 *      OG/Twitter tags, then inject article-specific metadata + Article
 *      JSON-LD in <head>
 *    - Preserve root div and app scripts
 * 4. Log results and statistics
 *
 * PRODUCTION URLs: https://soulconnect.health/blog/{slug}
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from '../src/data/articles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const distIndex = resolve(distDir, 'index.html');

function getBaseUrl() {
  // Always use production domain for SEO - canonical URLs must not vary
  return 'https://soulconnect.health';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Same as escapeHtml plus quote-escaping, for interpolation inside an
// HTML attribute value (content="...") rather than a text node — without
// this, a " in article title/description/excerpt/keywords breaks out of
// the attribute and can inject an arbitrary tag into the page's <head>.
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

/**
 * Pull the first few real paragraphs of the article's markdown body (skipping
 * the leading "# Title" heading, which we already render as an H1) so non-JS
 * crawlers see genuine article text, not just the generic homepage shell that
 * inject-static.js baked into the dist/index.html template this script reuses.
 */
function getIntroParagraphs(markdown, max = 2) {
  if (!markdown) return [];
  return markdown
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .slice(0, max);
}

/**
 * A tiny per-page content block (H1 + real excerpt/intro text from
 * articles.js) so non-JS crawlers see genuine, page-specific body content
 * for this article. React's createRoot still overwrites all of #root on
 * mount, so this has no effect on the live rendered app.
 */
function generatePageContent(article) {
  const intro = getIntroParagraphs(article.content);
  const introHtml = intro
    .map(
      (p) =>
        `<p style="font-size:1rem;color:rgba(196,181,253,0.7);line-height:1.75;margin-bottom:16px;">${escapeHtml(p)}</p>`
    )
    .join('');

  return `
  <section style="max-width:700px;margin:0 auto;padding:56px 24px 32px;text-align:center;">
    <h1 style="font-size:clamp(1.6rem,4vw,2.6rem);font-weight:900;color:#ede9fe;margin-bottom:16px;">${escapeHtml(
      article.title
    )}</h1>
    <p style="font-size:1.05rem;color:rgba(196,181,253,0.8);line-height:1.7;margin-bottom:20px;">${escapeHtml(article.excerpt)}</p>
    <div style="text-align:left;">${introHtml}</div>
  </section>`;
}

/**
 * Generate metadata HTML for head section.
 * Mirrors MetaHead.jsx's /blog/:slug branch exactly: title gets
 * " | SoulConnect Blog" appended, OG/Twitter descriptions use the
 * article's excerpt (not the longer SEO description), image falls back
 * to the shared OG image when the article doesn't have its own.
 */
function generateMetaHead(article, baseUrl) {
  const title = `${article.title} | SoulConnect Blog`;
  const canonicalUrl = `${baseUrl}/blog/${article.slug}`;
  const imageUrl = article.image || `${baseUrl}/og-image.png`;
  const keywords = (article.keywords || []).join(', ');

  const safeArticleTitle = escapeAttr(article.title);
  const safeDescription = escapeAttr(article.description);
  const safeExcerpt = escapeAttr(article.excerpt);
  const safeKeywords = escapeAttr(keywords);

  return `
    <!-- Article-Specific Metadata (Prerendered) -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${safeDescription}">
    <meta name="keywords" content="${safeKeywords}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph Tags -->
    <meta property="og:title" content="${safeArticleTitle}">
    <meta property="og:description" content="${safeExcerpt}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="SoulConnect">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeArticleTitle}">
    <meta name="twitter:description" content="${safeExcerpt}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:site" content="@soulconnect">

    <!-- Structured Data - Article -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": ${JSON.stringify(article.title)},
      "description": ${JSON.stringify(article.description)},
      "image": ${JSON.stringify(imageUrl)},
      "datePublished": ${JSON.stringify(article.publishedDate)},
      "dateModified": ${JSON.stringify(article.updatedDate || article.publishedDate)},
      "author": { "@type": "Organization", "name": ${JSON.stringify(article.author || 'SoulConnect')} },
      "publisher": {
        "@type": "Organization",
        "name": "SoulConnect",
        "logo": { "@type": "ImageObject", "url": "${baseUrl}/logo-icon-512.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "${canonicalUrl}" }
    }
    </script>

    <!-- Structured Data - Breadcrumb -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${baseUrl}" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${baseUrl}/blog" },
        { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(article.title)}, "item": "${canonicalUrl}" }
      ]
    }
    </script>
  `.trim();
}

async function generateBlogPages() {
  try {
    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📄 GENERATING BLOG ARTICLE PRERENDERED PAGES');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    if (!existsSync(distIndex)) {
      throw new Error(`Production build not found at ${distIndex}. Run 'npm run build' first.`);
    }

    const indexHtml = readFileSync(distIndex, 'utf-8');
    const baseUrl = getBaseUrl();

    console.log(`✓ Base URL: ${baseUrl}`);
    console.log(`✓ Reading template from: dist/index.html`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;
    const generatedPaths = [];

    for (const article of ARTICLES) {
      try {
        const articleDir = resolve(distDir, 'blog', article.slug);
        mkdirSync(articleDir, { recursive: true });

        const metaHead = generateMetaHead(article, baseUrl);

        // Strip the template's own title/canonical/description/keywords/
        // OG/Twitter tags before injecting the article-specific ones —
        // same dedup approach as generate-emotion-pages.js, to avoid
        // reintroducing the double-canonical bug on a second route family.
        let articleHtml = indexHtml
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

        articleHtml = articleHtml.replace('</head>', `  ${metaHead}\n  </head>`);

        // The reused template body (from inject-static.js's homepage shell)
        // has its own <h1>You Are Not Alone in This.</h1>. Demote it to <h2>
        // on this generated page only, so the page-specific <h1> injected
        // below (this article's real title) is the page's only H1. The
        // homepage's own dist/index.html is untouched — this only affects
        // dist/blog/{slug}/index.html.
        articleHtml = articleHtml.replace(
          /<h1 style="font-size:clamp\(2\.2rem,5vw,3\.8rem\)[^>]*>[\s\S]*?<\/h1>/,
          (match) => `<h2${match.slice(3, -5)}</h2>`
        );

        // Inject real per-article body content right inside #root so non-JS
        // crawlers see genuine page-specific text, not just the generic
        // homepage shell. Purely additive — React replaces #root on mount.
        articleHtml = articleHtml.replace(
          '<div id="root">',
          `<div id="root" data-blog-slug="${article.slug}">\n${generatePageContent(article)}`
        );

        const articlePagePath = resolve(articleDir, 'index.html');
        writeFileSync(articlePagePath, articleHtml, 'utf-8');

        generatedPaths.push(`/blog/${article.slug}/index.html`);
        successCount++;

        console.log(`  ✓ ${article.slug.padEnd(32)} -> dist/blog/${article.slug}/index.html`);
      } catch (err) {
        console.error(`  ✗ ${article.slug.padEnd(32)} FAILED: ${err.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 BLOG PRERENDERING COMPLETE');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`✓ Successfully generated: ${successCount} article pages`);
    if (errorCount > 0) {
      console.log(`✗ Failed: ${errorCount} article pages`);
    }
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('');
    console.error('✗ BLOG PRERENDERING FAILED');
    console.error('════════════════════════════════════════════════════════════');
    console.error(err.message);
    console.error('');
    process.exit(1);
  }
}

generateBlogPages();
