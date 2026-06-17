/**
 * inject-static.js
 * Runs after `vite build`. Replaces the empty <div id="root"> in dist/index.html
 * with full static HTML so crawlers and link-preview bots see real content
 * without needing JavaScript.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distIndex = resolve(__dirname, '../dist/index.html');

const STATIC_HTML = `
<div id="root">
<div id="__static_shell__" style="font-family:system-ui,sans-serif;background:#09061a;color:#ede9fe;min-height:100vh;">

  <!-- NAV -->
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-bottom:1px solid rgba(139,92,246,0.15);">
    <strong style="font-size:20px;color:#ede9fe;">SoulConnect</strong>
    <div style="display:flex;gap:24px;font-size:14px;color:rgba(196,181,253,0.7);">
      <span>How it Works</span><span>Features</span><span>Healers</span><span>FAQ</span>
    </div>
  </nav>

  <!-- HERO -->
  <section style="max-width:800px;margin:0 auto;padding:80px 24px 64px;text-align:center;">
    <p style="font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#6ee7b7;margin-bottom:16px;">
      Peer Support for Real Life Struggles
    </p>
    <h1 style="font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;line-height:1.1;color:#ede9fe;margin-bottom:20px;">
      You Are Not Alone in This.
    </h1>
    <p style="font-size:1.1rem;color:rgba(196,181,253,0.75);line-height:1.75;max-width:580px;margin:0 auto 40px;">
      Connect with someone dealing with your exact struggle — breakup, anxiety, grief,
      or any of <strong style="color:#ede9fe;">25 specific challenges</strong>.
      Peer support that truly understands you.
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:48px;">
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Breakup</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Anxiety</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Depression</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Grief &amp; Loss</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Loneliness</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Marriage Problems</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Career Stress</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Trauma &amp; PTSD</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Panic Attacks</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Financial Stress</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">Sleep Problems</span>
      <span style="padding:6px 14px;border-radius:20px;font-size:13px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;">+15 more</span>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section style="background:rgba(255,255,255,0.02);padding:64px 24px;border-top:1px solid rgba(139,92,246,0.1);">
    <div style="max-width:900px;margin:0 auto;text-align:center;">
      <h2 style="font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:#ede9fe;margin-bottom:48px;">Start healing in 3 steps</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;text-align:left;">
        <div style="padding:28px;border-radius:16px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(139,92,246,0.6);margin-bottom:12px;">01</div>
          <h3 style="font-size:18px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Choose Your Problem</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.6;">Pick from 25 specific life challenges — from breakups to OCD to financial stress.</p>
        </div>
        <div style="padding:28px;border-radius:16px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(139,92,246,0.6);margin-bottom:12px;">02</div>
          <h3 style="font-size:18px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Get Matched Instantly</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.6;">Our algorithm finds someone dealing with the same issue within minutes.</p>
        </div>
        <div style="padding:28px;border-radius:16px;background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.15);">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(139,92,246,0.6);margin-bottom:12px;">03</div>
          <h3 style="font-size:18px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Heal Together</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.6;">Chat, meet up, or book a verified healer. You are never alone in this journey.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section style="padding:48px 24px;text-align:center;">
    <div style="max-width:700px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:24px;">
      <div><div style="font-size:28px;font-weight:900;color:#a78bfa;">12,000+</div><div style="font-size:12px;color:rgba(196,181,253,0.5);margin-top:4px;">People Helped</div></div>
      <div><div style="font-size:28px;font-weight:900;color:#a78bfa;">25</div><div style="font-size:12px;color:rgba(196,181,253,0.5);margin-top:4px;">Problem Categories</div></div>
      <div><div style="font-size:28px;font-weight:900;color:#a78bfa;">500+</div><div style="font-size:12px;color:rgba(196,181,253,0.5);margin-top:4px;">Verified Healers</div></div>
      <div><div style="font-size:28px;font-weight:900;color:#a78bfa;">50+</div><div style="font-size:12px;color:rgba(196,181,253,0.5);margin-top:4px;">Cities in India</div></div>
    </div>
  </section>

  <!-- FEATURES -->
  <section style="padding:64px 24px;background:rgba(255,255,255,0.015);border-top:1px solid rgba(139,92,246,0.1);">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:#ede9fe;text-align:center;margin-bottom:40px;">Why SoulConnect is different</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Peer Matching</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">We match you with someone dealing with your exact issue — same breakup, same anxiety, same grief. Not just "mental health" in general.</p>
        </div>
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Verified Healers</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">500+ certified therapists, counsellors, and wellness practitioners. Book a professional session when peer support isn't enough.</p>
        </div>
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Anonymous &amp; Safe</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">Your identity is never shared. All chats are encrypted. Share what you're going through without fear of judgement.</p>
        </div>
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Guided Healing</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">5-stage healing journey — Mirror, Explorer, Reframer, Action, Victory — tailored to your specific problem type.</p>
        </div>
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Support Circles</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">Small group meetups of 6-15 people. Anonymous, judgment-free, facilitated by trained hosts across Indian cities.</p>
        </div>
        <div style="padding:28px;border-radius:16px;border:1px solid rgba(139,92,246,0.15);">
          <h3 style="font-size:17px;font-weight:700;color:#ede9fe;margin-bottom:8px;">Quick Relief</h3>
          <p style="font-size:14px;color:rgba(196,181,253,0.6);line-height:1.65;">Instant coping activities personalised to your challenge — breathing exercises, grounding, journaling prompts and more.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section style="padding:64px 24px;max-width:700px;margin:0 auto;">
    <h2 style="font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;color:#ede9fe;text-align:center;margin-bottom:40px;">Frequently Asked Questions</h2>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="padding:20px 24px;border-radius:14px;border:1px solid rgba(139,92,246,0.2);">
        <h3 style="font-size:15px;font-weight:600;color:#ede9fe;margin-bottom:8px;">Is SoulConnect free to use?</h3>
        <p style="font-size:14px;color:rgba(196,181,253,0.65);line-height:1.65;">Yes. Peer matching, chat, and guided healing are completely free. Verified healer sessions are paid per booking.</p>
      </div>
      <div style="padding:20px 24px;border-radius:14px;border:1px solid rgba(139,92,246,0.2);">
        <h3 style="font-size:15px;font-weight:600;color:#ede9fe;margin-bottom:8px;">Is my identity kept anonymous?</h3>
        <p style="font-size:14px;color:rgba(196,181,253,0.65);line-height:1.65;">Completely. Your real name, phone, and social media are never shared with matches. You control what you reveal.</p>
      </div>
      <div style="padding:20px 24px;border-radius:14px;border:1px solid rgba(139,92,246,0.2);">
        <h3 style="font-size:15px;font-weight:600;color:#ede9fe;margin-bottom:8px;">Is this a replacement for therapy?</h3>
        <p style="font-size:14px;color:rgba(196,181,253,0.65);line-height:1.65;">No. SoulConnect is peer support — real people who understand your struggle. For clinical care, we connect you with verified therapists.</p>
      </div>
      <div style="padding:20px 24px;border-radius:14px;border:1px solid rgba(139,92,246,0.2);">
        <h3 style="font-size:15px;font-weight:600;color:#ede9fe;margin-bottom:8px;">Which cities is SoulConnect available in?</h3>
        <p style="font-size:14px;color:rgba(196,181,253,0.65);line-height:1.65;">Online matching works across India. In-person meetups are available in Mumbai, Delhi, Bangalore, Pune, Chennai, Hyderabad and 44 more cities.</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer style="padding:32px 24px;text-align:center;border-top:1px solid rgba(139,92,246,0.12);">
    <p style="font-size:13px;color:rgba(196,181,253,0.35);">© 2024 SoulConnect · soulconnect.health · support@soulconnect.health</p>
  </footer>

</div>
</div>`;

try {
  let html = readFileSync(distIndex, 'utf-8');

  if (html.includes('id="__static_shell__"')) {
    console.log('✓ Static shell already injected, skipping.');
    process.exit(0);
  }

  // Replace the empty root div with full static content
  html = html.replace(
    /<div id="root"><\/div>/,
    STATIC_HTML
  );

  // Also remove the old MutationObserver script if present
  html = html.replace(
    /<script>\s*\/\/ Hide static shell[\s\S]*?<\/script>/,
    ''
  );

  writeFileSync(distIndex, html, 'utf-8');
  console.log('✓ Static shell injected into dist/index.html');
  console.log('  Crawlers will now see full landing page content without JS.');
} catch (err) {
  console.error('✗ inject-static failed:', err.message);
  process.exit(1);
}
