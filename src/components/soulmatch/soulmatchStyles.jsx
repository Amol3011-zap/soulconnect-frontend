import React from 'react';

/**
 * SoulMatch page styles — authored mobile-first (base rules target 393px),
 * with min-width media queries scaling up to tablet and desktop.
 */
export default function SoulMatchStyles() {
  return (
    <style>{`
      .sm-page {
        max-width: 1080px;
        margin: 0 auto;
        padding: 20px 16px calc(32px + env(safe-area-inset-bottom, 0px));
        color: #F5F3FF;
        font-family: 'Inter', -apple-system, sans-serif;
      }

      /* ── Hero ── */
      .sm-hero { position: relative; margin-bottom: 22px; }
      .sm-eyebrow {
        display: inline-flex; align-items: center; gap: 6px;
        margin: 0 0 10px; padding: 5px 11px; border-radius: 999px;
        background: rgba(139,92,246,0.18);
        border: 1px solid rgba(167,139,250,0.32);
        font-size: 11.5px; font-weight: 650; color: #DDD6FE;
      }
      .sm-title {
        margin: 0; font-family: "Playfair Display", Georgia, serif;
        font-size: 27px; font-weight: 700; line-height: 1.18;
        letter-spacing: -0.02em; color: #F8F6FF;
      }
      .sm-sub { margin: 9px 0 0; font-size: 14px; line-height: 1.55; color: rgba(196,181,253,0.78); }
      .sm-whisper {
        margin: 14px 0 0; padding-left: 12px;
        border-left: 2px solid rgba(167,139,250,0.4);
        font-size: 13px; line-height: 1.6; font-style: italic;
        color: rgba(196,181,253,0.6);
      }
      .sm-hero-art { display: none; }
      .sm-orb { position: absolute; border-radius: 50%; filter: blur(0.5px); }
      .sm-orb--a {
        width: 96px; height: 96px; right: 24px; top: 4px;
        background: radial-gradient(circle at 34% 30%, #DDD6FE, #7C3AED 70%);
        box-shadow: 0 12px 40px rgba(124,58,237,0.5);
      }
      .sm-orb--b {
        width: 56px; height: 56px; right: 116px; top: 62px;
        background: radial-gradient(circle at 34% 30%, #FBCFE8, #DB2777 70%);
        box-shadow: 0 10px 30px rgba(219,39,119,0.4);
      }
      .sm-orb--c {
        width: 38px; height: 38px; right: 6px; top: 108px;
        background: radial-gradient(circle at 34% 30%, #BAE6FD, #0284C7 70%);
        box-shadow: 0 8px 24px rgba(2,132,199,0.4);
      }

      /* ── Tabs ── */
      .sm-tabs {
        display: flex; gap: 6px; margin-bottom: 18px;
        padding: 5px; border-radius: 16px;
        background: rgba(30,18,64,0.6);
        border: 1px solid rgba(167,139,250,0.14);
        overflow-x: auto; scrollbar-width: none;
      }
      .sm-tabs::-webkit-scrollbar { display: none; }
      .sm-tab {
        flex: 1; min-width: 96px; min-height: 44px;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 0 12px; border: none; border-radius: 12px;
        background: none; color: rgba(196,181,253,0.7);
        font-family: inherit; font-size: 13px; font-weight: 600;
        cursor: pointer; white-space: nowrap;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .sm-tab.is-on {
        background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(139,92,246,0.75));
        color: #fff;
        box-shadow: 0 4px 14px rgba(124,58,237,0.32);
      }
      .sm-tab:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      /* ── Setup ── */
      .sm-setup {
        padding: 18px 16px;
        border-radius: 20px;
        background: linear-gradient(160deg, rgba(38,22,78,0.66), rgba(24,14,52,0.74));
        border: 1px solid rgba(167,139,250,0.14);
        margin-bottom: 26px;
      }
      .sm-fieldset { border: none; margin: 0 0 18px; padding: 0; }
      .sm-legend { padding: 0; font-size: 15px; font-weight: 700; color: #F5F3FF; }
      .sm-hint { margin: 6px 0 0; font-size: 12.5px; color: rgba(196,181,253,0.6); }
      .sm-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .sm-chip {
        min-height: 44px; padding: 0 14px;
        border-radius: 999px;
        border: 1px solid rgba(167,139,250,0.24);
        background: rgba(139,92,246,0.1);
        color: rgba(226,222,255,0.84);
        font-family: inherit; font-size: 13px; font-weight: 600;
        cursor: pointer;
        transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
      }
      .sm-chip:active { transform: scale(0.97); }
      .sm-chip.is-on {
        background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(139,92,246,0.72));
        border-color: rgba(196,181,253,0.55);
        color: #fff;
        box-shadow: 0 4px 14px rgba(124,58,237,0.3);
      }
      .sm-chip:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }
      .sm-find-btn { margin-top: 4px; }

      /* ── Sections ── */
      .sm-section-title { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.01em; }
      .sm-section-sub { margin: 6px 0 16px; font-size: 13px; color: rgba(196,181,253,0.62); }

      /* ── Cards ── */
      .sm-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      .sm-list { display: grid; gap: 14px; }
      .sm-card {
        display: flex; flex-direction: column;
        padding: 18px;
        border-radius: 20px;
        background: linear-gradient(160deg, rgba(41,24,84,0.78), rgba(25,15,55,0.82));
        border: 1px solid rgba(167,139,250,0.16);
        box-shadow: 0 10px 30px rgba(76,29,149,0.2);
      }
      .sm-card-name {
        margin: 0; font-size: 15.5px; font-weight: 700; color: #F5F3FF;
        letter-spacing: -0.01em; line-height: 1.3;
      }
      .sm-card-loc {
        margin: 4px 0 0; font-size: 12px; color: rgba(196,181,253,0.68);
        display: flex; align-items: center; gap: 4px;
      }
      .sm-card-quote {
        margin: 0 0 10px; font-size: 13px; line-height: 1.6;
        color: rgba(226,222,255,0.7); font-style: italic;
      }
      .sm-card-need {
        margin: 0 0 14px; font-size: 12px;
        color: rgba(94,234,212,0.85);
        display: flex; align-items: center; gap: 5px;
      }
      .sm-tags { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-wrap: wrap; gap: 7px; }
      .sm-tags li {
        font-size: 11px; font-weight: 600; padding: 5px 10px; border-radius: 999px;
        background: rgba(139,92,246,0.14); border: 1px solid rgba(167,139,250,0.3);
        color: #DDD6FE; white-space: nowrap;
      }
      .sm-card-actions { display: flex; gap: 9px; margin-top: auto; }

      /* ── Buttons ── */
      .sm-btn {
        flex: 1; min-height: 48px;
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        padding: 0 14px; border-radius: 14px;
        font-family: inherit; font-size: 13.5px; font-weight: 650;
        cursor: pointer;
        transition: transform 0.14s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .sm-btn:active { transform: scale(0.975); }
      .sm-btn:disabled { opacity: 0.6; cursor: default; }
      .sm-btn:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }
      .sm-btn--primary {
        border: 1px solid rgba(167,139,250,0.4);
        background: linear-gradient(135deg, #6D4AFF, #8B5CF6);
        color: #fff;
        box-shadow: 0 6px 18px rgba(124,58,237,0.34);
      }
      .sm-btn--ghost {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.05);
        color: rgba(226,222,255,0.8);
      }
      .sm-btn--ghost:hover { background: rgba(255,255,255,0.09); }
      .sm-btn--quiet {
        border: 1px solid transparent; background: none;
        color: rgba(196,181,253,0.6); min-height: 44px; font-size: 12.5px;
      }
      .sm-btn--quiet:hover { color: #DDD6FE; }
      .sm-btn--sent {
        border: 1px solid rgba(16,185,129,0.35);
        background: rgba(16,185,129,0.12);
        color: #6EE7B7;
      }
      .sm-icon-btn {
        width: 44px; height: 44px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: rgba(226,222,255,0.7);
        cursor: pointer;
      }
      .sm-icon-btn:hover { background: rgba(255,255,255,0.1); color: #E2DEFF; }
      .sm-icon-btn:focus-visible { outline: 2px solid #C4B5FD; outline-offset: 2px; }

      /* ── Conversation starters ── */
      .sm-starters { margin: 4px 0 14px; }
      .sm-starters-title { margin: 0 0 8px; font-size: 12px; color: rgba(196,181,253,0.6); }
      .sm-starter {
        display: inline-block; margin: 0 6px 6px 0; padding: 6px 11px;
        border-radius: 999px; background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        font-size: 11.5px; color: rgba(226,222,255,0.75);
      }

      /* ── Empty + notices ── */
      .sm-empty {
        padding: 36px 22px; text-align: center;
        border-radius: 20px;
        background: linear-gradient(160deg, rgba(38,22,78,0.55), rgba(24,14,52,0.62));
        border: 1px solid rgba(167,139,250,0.12);
      }
      .sm-empty-icon {
        width: 58px; height: 58px; border-radius: 50%; margin: 0 auto 16px;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle at 35% 30%, rgba(167,139,250,0.35), rgba(124,58,237,0.12));
        border: 1px solid rgba(167,139,250,0.22);
      }
      .sm-empty-title { margin: 0; font-size: 16px; font-weight: 700; color: #EDE9FE; }
      .sm-empty-body {
        margin: 9px auto 18px; max-width: 380px;
        font-size: 13.5px; line-height: 1.65; color: rgba(196,181,253,0.62);
      }
      .sm-empty-btn { max-width: 200px; margin: 0 auto; }

      .sm-notice {
        margin: 0 0 16px; padding: 10px 14px; border-radius: 12px;
        background: rgba(139,92,246,0.12);
        border: 1px solid rgba(167,139,250,0.24);
        font-size: 12.5px; color: #DDD6FE;
      }
      .sm-safety-note {
        margin: 16px 0 0; font-size: 11.5px; color: rgba(196,181,253,0.45);
        display: flex; align-items: center; gap: 6px;
      }
      .sm-safety-note--foot { margin-top: 28px; justify-content: center; }
      .sm-dev-note {
        margin: 8px 0 0; font-size: 11px; font-weight: 600;
        color: rgba(251,191,36,0.85);
        display: flex; align-items: center; gap: 6px;
      }

      /* ── Detail sheet ── */
      .sm-overlay {
        position: fixed; inset: 0; z-index: 1000;
        display: flex; align-items: flex-end; justify-content: center;
        background: rgba(6,4,16,0.72);
        backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      }
      .sm-sheet {
        width: 100%; max-width: 520px;
        max-height: 88vh; overflow-y: auto;
        padding: 22px 18px calc(24px + env(safe-area-inset-bottom, 0px));
        border-radius: 24px 24px 0 0;
        background: linear-gradient(170deg, #241452 0%, #170C39 100%);
        border: 1px solid rgba(167,139,250,0.2);
      }

      /* ── Shimmer ── */
      .sm-shimmer {
        background: linear-gradient(90deg,
          rgba(167,139,250,0.07) 25%, rgba(167,139,250,0.16) 37%, rgba(167,139,250,0.07) 63%);
        background-size: 400% 100%;
        animation: smShimmer 1.5s ease-in-out infinite;
      }
      @keyframes smShimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

      /* ══ Tablet ══ */
      @media (min-width: 700px) {
        .sm-page { padding: 28px 24px 40px; }
        .sm-title { font-size: 34px; }
        .sm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sm-setup { padding: 22px 20px; }
        .sm-overlay { align-items: center; }
        .sm-sheet { border-radius: 24px; padding: 26px 24px; }
      }

      /* ══ Desktop ══ */
      @media (min-width: 1024px) {
        .sm-page { padding: 34px 32px 48px; }
        .sm-hero { display: grid; grid-template-columns: 1fr 220px; align-items: center; gap: 24px; }
        .sm-hero-art { display: block; position: relative; height: 180px; }
        .sm-title { font-size: 38px; }
        .sm-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .sm-tabs { max-width: 420px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .sm-shimmer { animation: none; }
        .sm-btn, .sm-chip, .sm-tab { transition: none; }
      }
    `}</style>
  );
}
