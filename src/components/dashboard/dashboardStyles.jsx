import React from 'react';

/**
 * Shared styles for the redesigned dashboard sections.
 *
 * Kept as one injected <style> block (rather than Tailwind utilities) to match
 * the codebase convention in docs/DESIGN_SYSTEM.md: inline styles + CSS vars,
 * glass surfaces, ambient coloured shadows, no flat blacks.
 */
export default function DashboardStyles() {
  return (
    <style>{`
      /* ── Surfaces ─────────────────────────────────────────────── */
      .sc-panel {
        background: linear-gradient(160deg, rgba(38,22,78,0.72) 0%, rgba(24,14,52,0.78) 100%);
        border: 1px solid rgba(167,139,250,0.14);
        border-radius: 20px;
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        box-shadow: 0 10px 34px rgba(76,29,149,0.24), inset 0 1px 0 rgba(255,255,255,0.05);
      }

      .sc-match-card {
        display: flex;
        flex-direction: column;
        padding: 20px;
        background: linear-gradient(160deg, rgba(41,24,84,0.78) 0%, rgba(25,15,55,0.82) 100%);
        border: 1px solid rgba(167,139,250,0.16);
        border-radius: 20px;
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        box-shadow: 0 10px 30px rgba(76,29,149,0.22), inset 0 1px 0 rgba(255,255,255,0.06);
        transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.28s ease;
      }
      .sc-match-card:hover {
        transform: translateY(-3px);
        border-color: rgba(167,139,250,0.3);
        box-shadow: 0 18px 44px rgba(76,29,149,0.34), inset 0 1px 0 rgba(255,255,255,0.08);
      }

      /* ── Match grid → carousel on mobile ──────────────────────── */
      .sc-match-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      /* ── Buttons ──────────────────────────────────────────────── */
      .sc-match-btn {
        flex: 1;
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 0 14px;
        border-radius: 14px;
        font-family: inherit;
        font-size: 13.5px;
        font-weight: 650;
        cursor: pointer;
        transition: transform 0.14s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      }
      .sc-match-btn:active { transform: scale(0.97); }
      .sc-match-btn:disabled { opacity: 0.6; cursor: default; }
      .sc-match-btn:focus-visible {
        outline: 2px solid #C4B5FD;
        outline-offset: 2px;
      }

      .sc-match-btn--primary {
        border: 1px solid rgba(167,139,250,0.4);
        background: linear-gradient(135deg, rgba(124,58,237,0.95) 0%, rgba(139,92,246,0.85) 100%);
        color: #fff;
        box-shadow: 0 6px 18px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
      }
      .sc-match-btn--primary:hover:not(:disabled) {
        box-shadow: 0 10px 26px rgba(124,58,237,0.48), inset 0 1px 0 rgba(255,255,255,0.22);
      }

      .sc-match-btn--ghost {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.05);
        color: rgba(226,222,255,0.75);
      }
      .sc-match-btn--ghost:hover:not(:disabled) {
        background: rgba(255,255,255,0.09);
        color: #E2DEFF;
      }

      .sc-link-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        min-height: 44px;
        padding: 0 6px;
        border: none;
        background: none;
        color: #A78BFA;
        font-family: inherit;
        font-size: 13px;
        font-weight: 650;
        cursor: pointer;
        border-radius: 10px;
        transition: color 0.2s ease;
      }
      .sc-link-btn:hover { color: #DDD6FE; }
      .sc-link-btn:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      /* ── Tiny Wins compact tiles ──────────────────────────────── */
      /* Section container — one bordered panel holding header + tiles */
      .tw-panel {
        padding: 18px 20px 20px;
        border: 1px solid rgba(167,139,250,0.12);
        border-radius: 22px;
        background: linear-gradient(160deg, rgba(30,18,64,0.55) 0%, rgba(20,12,44,0.62) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 28px rgba(76,29,149,0.16), inset 0 1px 0 rgba(255,255,255,0.04);
      }

      /* One row of 5, stretched to fill the panel width. */
      .tw-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
      }

      .tw-tile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        min-height: 118px;
        padding: 14px;
        text-align: left;
        font-family: inherit;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04);
        transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), border-color 0.22s ease, box-shadow 0.22s ease;
      }
      .tw-tile:hover:not([aria-pressed="true"]) {
        transform: translateY(-2px);
        border-color: rgba(167,139,250,0.28);
        box-shadow: 0 12px 28px rgba(76,29,149,0.3), inset 0 1px 0 rgba(255,255,255,0.07);
      }
      .tw-tile:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      .tw-tile-icon {
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .tw-tile-label {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.35;
        letter-spacing: -0.005em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tw-tile-foot {
        margin-top: auto;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      /* Narrow desktop / tablet — fewer columns so tiles keep their width */
      @media (max-width: 1280px) {
        .tw-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
      @media (max-width: 1040px) {
        .tw-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      /* Mobile — horizontal snap strip, matches the match carousel */
      @media (max-width: 768px) {
        .tw-grid {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          margin: 0 -16px;
          padding: 4px 16px 8px;
        }
        .tw-grid::-webkit-scrollbar { display: none; }
        .tw-grid > * {
          flex: 0 0 138px;
          scroll-snap-align: start;
        }
        .tw-tile:hover { transform: none; }
        /* Tighter panel on mobile; carousel bleeds to the panel's inner edge */
        .tw-panel { padding: 16px 14px 16px; border-radius: 18px; }
        .tw-panel .tw-grid { margin: 0 -14px; padding: 4px 14px 8px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .tw-tile { transition: none; }
        .tw-tile:hover { transform: none; }
      }

      /* ══ Right sidebar cards ═══════════════════════════════════ */
      .rs-stack { display: flex; flex-direction: column; gap: 12px; }

      .rs-card { padding: 16px 15px; }

      .rs-card-title {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14.5px;
        font-weight: 700;
        color: #F5F3FF;
        letter-spacing: -0.01em;
      }

      .rs-muted {
        font-size: 12.5px;
        line-height: 1.55;
        color: rgba(196,181,253,0.62);
      }

      /* — Today's Focus — */
      .rs-focus-headline {
        margin: 0 0 14px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 21px;
        font-style: italic;
        font-weight: 600;
        line-height: 1.25;
        color: #F5F3FF;
      }

      .rs-check-list { list-style: none; margin: 0 0 14px; padding: 0; }

      .rs-check-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 9px;
        min-height: 34px;
        padding: 3px 0;
        background: none;
        border: none;
        text-align: left;
        font-family: inherit;
        cursor: pointer;
      }
      .rs-check-item:disabled { cursor: default; }
      .rs-check-item:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; border-radius: 8px; }

      .rs-check-box {
        width: 18px; height: 18px;
        flex-shrink: 0;
        border-radius: 50%;
        border: 1.6px solid rgba(255,255,255,0.26);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: background 0.2s ease, border-color 0.2s ease;
      }
      .rs-check-box.is-done {
        background: linear-gradient(145deg, #34D399, #10B981);
        border-color: transparent;
        box-shadow: 0 0 10px rgba(16,185,129,0.45);
      }

      .rs-check-label {
        font-size: 12.5px;
        line-height: 1.4;
        color: rgba(226,222,255,0.84);
      }
      .rs-check-label.is-done { color: rgba(134,239,172,0.9); }

      .rs-quote-line {
        margin: 12px 0 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 12.5px;
        font-style: italic;
        color: rgba(196,181,253,0.6);
      }

      /* — Buttons — */
      .rs-btn {
        width: 100%;
        min-height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 0 16px;
        border-radius: 14px;
        font-family: inherit;
        font-size: 13.5px;
        font-weight: 650;
        cursor: pointer;
        transition: transform 0.14s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .rs-btn:active { transform: scale(0.975); }
      .rs-btn:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      .rs-btn--primary {
        border: 1px solid rgba(167,139,250,0.4);
        background: linear-gradient(135deg, #6D4AFF 0%, #8B5CF6 100%);
        color: #fff;
        box-shadow: 0 6px 18px rgba(124,58,237,0.34), inset 0 1px 0 rgba(255,255,255,0.18);
      }
      .rs-btn--primary:hover {
        box-shadow: 0 10px 26px rgba(124,58,237,0.46), inset 0 1px 0 rgba(255,255,255,0.22);
      }

      .rs-btn--ghost {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.05);
        color: rgba(226,222,255,0.8);
      }
      .rs-btn--ghost:hover { background: rgba(255,255,255,0.09); color: #E2DEFF; }

      .rs-link {
        min-height: 44px;
        padding: 0 4px;
        border: none;
        background: none;
        color: #A78BFA;
        font-family: inherit;
        font-size: 12.5px;
        font-weight: 650;
        cursor: pointer;
        border-radius: 8px;
      }
      .rs-link:hover { color: #DDD6FE; }
      .rs-link:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      .rs-icon-btn {
        width: 48px; height: 48px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        border: 1px solid rgba(167,139,250,0.4);
        background: linear-gradient(135deg, rgba(124,58,237,0.95), rgba(139,92,246,0.85));
        color: #fff;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(124,58,237,0.35);
        transition: transform 0.14s ease;
      }
      .rs-icon-btn:active { transform: scale(0.94); }
      .rs-icon-btn:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      /* — Inspiration card — */
      .rs-inspire { padding: 0; overflow: hidden; position: relative; }
      .rs-inspire-scene {
        position: relative;
        height: 104px;
        background:
          radial-gradient(ellipse 60% 80% at 72% 88%, rgba(251,191,36,0.34) 0%, transparent 62%),
          radial-gradient(ellipse 90% 70% at 30% 0%, rgba(167,139,250,0.30) 0%, transparent 66%),
          linear-gradient(180deg, #2A1857 0%, #3B1E63 45%, #6D3A6A 78%, #A9615C 100%);
      }
      .rs-inspire-ridge {
        position: absolute;
        left: 0; right: 0; bottom: -1px;
        width: 100%; height: 62px;
        display: block;
      }
      .rs-inspire-body {
        position: relative;
        padding: 14px 15px 16px;
        background: linear-gradient(180deg, rgba(8,5,20,0.94) 0%, rgba(16,9,36,0.9) 100%);
      }
      .rs-inspire-quote {
        margin: 0;
        font-family: "Playfair Display", Georgia, serif;
        font-size: 14.5px;
        font-style: italic;
        line-height: 1.5;
        color: #F5F3FF;
      }
      .rs-inspire-sprout { display: block; margin-top: 8px; font-size: 16px; }

      /* ══ Tablet + mobile: the rail becomes part of the feed ══ */
      @media (max-width: 1100px) {
        .rs-stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin: 0 32px 20px;
        }
      }
      @media (max-width: 768px) {
        .rs-stack {
          grid-template-columns: 1fr;
          gap: 12px;
          margin: 0 16px calc(20px + env(safe-area-inset-bottom, 0px));
        }
        .rs-focus-headline { font-size: 20px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .rs-btn, .rs-icon-btn, .rs-check-box { transition: none; }
      }

      /* ── Skeleton shimmer ─────────────────────────────────────── */
      .sc-shimmer {
        background: linear-gradient(90deg,
          rgba(167,139,250,0.07) 25%,
          rgba(167,139,250,0.16) 37%,
          rgba(167,139,250,0.07) 63%);
        background-size: 400% 100%;
        animation: scShimmer 1.5s ease-in-out infinite;
      }
      @keyframes scShimmer {
        0%   { background-position: 100% 50%; }
        100% { background-position: 0 50%; }
      }

      /* ══ Tablet — 2 columns ══ */
      @media (max-width: 1100px) {
        .sc-match-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      /* ══ Mobile ≤768px — horizontal snap carousel ══ */
      @media (max-width: 768px) {
        /* Keep the section header on one row: title left, View All right */
        .sc-section-head { flex-wrap: nowrap !important; align-items: center !important; }
        .sc-section-head .sc-link-btn { flex-shrink: 0; }

        .sc-match-grid {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          /* bleed to screen edges so cards peek, without page overflow */
          margin: 0 -16px;
          padding: 4px 16px 10px;
        }
        .sc-match-grid::-webkit-scrollbar { display: none; }
        .sc-match-grid > * {
          flex: 0 0 82%;
          max-width: 320px;
          scroll-snap-align: start;
        }
        .sc-match-card:hover { transform: none; }
      }

      /* ── Reduced motion ───────────────────────────────────────── */
      @media (prefers-reduced-motion: reduce) {
        .sc-shimmer { animation: none; }
        .sc-match-card { transition: none; }
        .sc-match-card:hover { transform: none; }
      }
    `}</style>
  );
}
