/**
 * static-page-root.js — shared by the prerender scripts
 * (generate-index-pages.js, generate-emotion-pages.js, generate-blog-pages.js).
 *
 * Those scripts reuse dist/index.html as their template. By the time they run,
 * inject-static.js has already filled that template's <div id="root"> with the
 * HOMEPAGE crawler body (the hidden #__static_shell__ block, with its own H1)
 * and its <head> carries homepage-only JSON-LD. Previously each generated page
 * kept all of that and only prepended its own content, so every /about,
 * /explore/{slug}, /blog/{slug} … page also contained the whole homepage body.
 *
 * pageRoot() rebuilds #root with ONLY:
 *   1. the loading screen (#app-shell) that precedes the homepage body, and
 *   2. this page's own crawler-readable content.
 * React's createRoot replaces everything inside #root on mount, exactly as
 * before, so the live app is unaffected.
 *
 * stripHomepageJsonLd() removes the homepage-specific structured data
 * (WebPage for "/", the homepage FAQPage and the homepage BreadcrumbList);
 * site-wide blocks (Organization, WebSite, …) are kept. Call it on the
 * template BEFORE injecting the page's own JSON-LD, or it strips that too.
 */

const ROOT_BLOCK = /<div id="root">([\s\S]*?)<\/div>\s*(<\/body>)/;
const HOMEPAGE_BODY_MARKER = '<!-- __static_shell__';
const HOMEPAGE_ONLY_JSONLD_TYPES = new Set(['WebPage', 'FAQPage', 'BreadcrumbList']);

export function pageRoot(templateHtml, rootAttrs, bodyHtml) {
  const m = templateHtml.match(ROOT_BLOCK);
  if (!m) {
    throw new Error('static-page-root: could not locate the <div id="root">…</div> block in dist/index.html.');
  }
  const inner = m[1];
  const cut = inner.indexOf(HOMEPAGE_BODY_MARKER);
  if (cut === -1) {
    // inject-static.js has not run (or its markup changed) — fail loud rather
    // than silently shipping a page without its loading screen or with the
    // homepage body still inside it.
    throw new Error('static-page-root: homepage crawler body marker not found in dist/index.html #root — run inject-static.js first.');
  }
  const loadingShell = inner.slice(0, cut).trimEnd();
  return templateHtml.replace(
    ROOT_BLOCK,
    () => `<div id="root"${rootAttrs ? ' ' + rootAttrs : ''}>\n${loadingShell}\n${bodyHtml}\n</div>\n  ${m[2]}`
  );
}

export function stripHomepageJsonLd(html) {
  return html.replace(/[ \t]*<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*\n?/g, (block, json) => {
    try {
      const data = JSON.parse(json);
      return HOMEPAGE_ONLY_JSONLD_TYPES.has(data['@type']) ? '' : block;
    } catch {
      return block;
    }
  });
}
