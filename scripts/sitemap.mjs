/**
 * sitemap.mjs - Generates public/sitemap.xml from the real route list.
 *
 * Runs before `vite build` (see package.json). Pulls from the same sources
 * the live app and the other prerender scripts already use, so the sitemap
 * can't silently drift from what actually exists:
 *   - src/lib/metadata.js        -> every static public route + its canonical
 *   - src/data/articles.js       -> blog post slugs (/blog/:slug)
 *   - src/data/emotionContentLibrary.ts -> explore slugs (/explore/:slug)
 *
 * Only PUBLIC pages belong here. Anything gated behind login (DASHBOARD_PATHS
 * in App.jsx) or still closed (VITE_AUTH_OPEN) is deliberately excluded —
 * see EXCLUDED_PATHS below.
 *
 * lastmod uses each page's own "last reviewed/updated" data where the
 * content tracks it (blog posts, explore pages); everything else uses
 * today's date at build time, so lastmod stops going stale between manual
 * edits — it just reflects "this sitemap was generated on this day" per
 * the SEO brief's complaint about frozen 2026-07-17 / 2026-08-27 dates.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://soulconnect.health';
const today = new Date().toISOString().slice(0, 10);

// Routes present in src/lib/metadata.js that must NOT be in the sitemap:
// auth-gated, not-yet-launched, or dashboard-tier pages that happen to have
// metadata entries for when a logged-in user lands there directly.
const EXCLUDED_PATHS = new Set([
  '/professionals', // dashboard-tier (DASHBOARD_PATHS in App.jsx)
  '/healers',        // legacy, dashboard-tier
]);

// Per-path priority/changefreq overrides; anything not listed falls back
// to DEFAULT below. Keys must match src/lib/metadata.js routes exactly.
const OVERRIDES = {
  '/':              { priority: '1.0', changefreq: 'weekly' },
  '/about':         { priority: '0.8', changefreq: 'monthly' },
  '/how-it-works':  { priority: '0.8', changefreq: 'monthly' },
  '/trust-safety':  { priority: '0.8', changefreq: 'monthly' },
  '/crisis-support':{ priority: '0.9', changefreq: 'monthly' },
  '/faq':           { priority: '0.7', changefreq: 'monthly' },
  '/contact':       { priority: '0.7', changefreq: 'monthly' },
  '/pulse':         { priority: '0.6', changefreq: 'weekly' },
  '/explore':       { priority: '0.8', changefreq: 'weekly' },
  '/blog':          { priority: '0.7', changefreq: 'weekly' },
  '/community-rules': { priority: '0.5', changefreq: 'yearly' },
  '/guide-terms':     { priority: '0.4', changefreq: 'yearly' },
  '/report':          { priority: '0.3', changefreq: 'yearly' },
  '/privacy':         { priority: '0.5', changefreq: 'yearly' },
  '/terms':           { priority: '0.5', changefreq: 'yearly' },
  '/cookies':         { priority: '0.4', changefreq: 'yearly' },
  '/accessibility':   { priority: '0.4', changefreq: 'yearly' },
  '/safety':          { priority: '0.6', changefreq: 'monthly' },
};
const DEFAULT = { priority: '0.6', changefreq: 'monthly' };

function urlEntry(loc, { priority, changefreq, lastmod }) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const importFile = (relPath) => import(pathToFileURL(path.join(ROOT, relPath)).href);

  const { METADATA } = await importFile('src/lib/metadata.js');
  const { ARTICLES } = await importFile('src/data/articles.js');
  // emotionContentLibrary.ts has only type-erasable syntax, same as
  // generate-emotion-pages.js relies on — requires Node run with
  // --experimental-strip-types (already how this script is invoked; see
  // package.json's build script).
  const { default: emotionContentLibrary } = await importFile('src/data/emotionContentLibrary.ts');

  const staticPaths = Object.keys(METADATA)
    .filter((p) => !EXCLUDED_PATHS.has(p) && !p.startsWith('/explore/')) // /explore/:slug handled separately, from the content library directly
    .sort();

  const entries = [];

  entries.push('  <!-- Homepage -->');
  entries.push(urlEntry('/', { ...DEFAULT, ...OVERRIDES['/'], lastmod: today }));

  entries.push('');
  entries.push('  <!-- Public pages -->');
  for (const p of staticPaths) {
    if (p === '/') continue;
    entries.push(urlEntry(p, { ...DEFAULT, ...OVERRIDES[p], lastmod: today }));
  }

  entries.push('');
  entries.push('  <!-- Explore / Emotion Library -->');
  for (const emotion of emotionContentLibrary) {
    const lastmod = emotion.trustSafety?.lastReviewedDate || today;
    entries.push(urlEntry(`/explore/${emotion.slug}`, { priority: '0.7', changefreq: 'monthly', lastmod }));
  }

  entries.push('');
  entries.push('  <!-- Blog -->');
  for (const article of ARTICLES) {
    const lastmod = article.updatedDate || article.publishedDate || today;
    entries.push(urlEntry(`/blog/${article.slug}`, { priority: '0.6', changefreq: 'monthly', lastmod }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n${entries.join('\n')}\n\n</urlset>\n`;

  const outPath = path.join(ROOT, 'public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');

  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`✓ sitemap.xml generated: ${urlCount} URLs -> public/sitemap.xml`);
}

main().catch((err) => {
  console.error('sitemap.mjs failed:', err);
  process.exit(1);
});
