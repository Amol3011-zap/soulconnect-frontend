// Vercel Edge Middleware — runs before the SPA rewrite in vercel.json.
//
// Why this exists: vercel.json can only 307-redirect /login, /signup, etc.
// to /maintenance, but /maintenance isn't a real page — it falls through
// the SPA catch-all and serves index.html with a 200. Google indexes that
// as a duplicate homepage at four extra URLs, and nothing ever tells a
// crawler "this isn't ready yet, check back later". This returns a real
// 503 with Retry-After instead, for exactly the paths that are gated.
//
// Also applies X-Robots-Tag: noindex, nofollow to every one of those paths
// so that even if something still returns a 200 for them in the future
// (e.g. VITE_AUTH_OPEN flips without this file being updated), search
// engines are told not to index them.
//
// Toggle: set MAINTENANCE_MODE=false as a Vercel env var once accounts are
// open (same moment vercel.json's redirects and App.jsx's AUTH_OPEN flip).

export const config = {
  matcher: ['/login', '/signup', '/register', '/dashboard/:path*'],
};

const RETRY_AFTER_SECONDS = 3600; // 1 hour — matches "come back soon", not a hard promise

const MAINTENANCE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SoulConnect — Coming Soon</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#FAF8FC; color:#221B3A; font-family:'Plus Jakarta Sans',system-ui,sans-serif; text-align:center; }
  .card { max-width:420px; padding:32px; }
  h1 { font-size:22px; margin:0 0 12px; }
  p { color:#5B5470; font-size:15px; line-height:1.6; margin:0; }
  a { color:#6B4FA0; }
</style>
</head>
<body>
  <div class="card">
    <h1>We're not quite ready yet</h1>
    <p>SoulConnect is still in private launch preparation. Check back soon, or visit <a href="/">the homepage</a>.</p>
  </div>
</body>
</html>`;

export default function middleware() {
  const maintenanceOn = process.env.MAINTENANCE_MODE !== 'false';
  if (!maintenanceOn) return; // fall through to normal SPA routing once launched

  return new Response(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'retry-after': String(RETRY_AFTER_SECONDS),
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
