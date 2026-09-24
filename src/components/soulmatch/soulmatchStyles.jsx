import React from 'react';

/**
 * SoulMatch page styles — SoulConnect light theme. Authored mobile-first
 * (base rules target 393px), with min-width media queries for tablet and
 * desktop. Same class names as before; only the visual layer changed.
 *
 * Palette: bg #F7F5FB · card #FFFFFF · ink #171642 · ink-2 #69677D
 *          purple #8066D5 · soft #E5DDF5 · border #E7E3EF
 */
export default function SoulMatchStyles() {
  return (
    <style>{`
      .sm-page {
        max-width: 1080px;
        margin: 0 auto;
        padding: 20px 16px calc(32px + env(safe-area-inset-bottom, 0px));
        color: #171642;
        font-family: inherit;
      }

      /* ── Hero ── */
      .sm-hero { position: relative; margin-bottom: 20px; }
      .sm-eyebrow {
        display: inline-flex; align-items: center; gap: 6px;
        margin: 0 0 10px; padding: 4px 10px; border-radius: 999px;
        background: #E5DDF5; border: none;
        font-size: 12px; font-weight: 600; color: #5E47B8;
      }
      .sm-title {
        margin: 0;
        font-size: 24px; font-weight: 700; line-height: 1.2;
        letter-spacing: -0.01em; color: #171642;
      }
      .sm-sub { margin: 8px 0 0; font-size: 15px; line-height: 1.5; color: #69677D; }
      .sm-whisper {
        margin: 12px 0 0; padding-left: 12px;
        border-left: 2px solid #E5DDF5;
        font-size: 14px; line-height: 1.55; font-style: italic;
        color: #69677D;
      }
      .sm-hero-art { display: none; }
      .sm-orb { position: absolute; border-radius: 50%; }
      .sm-orb--a {
        width: 96px; height: 96px; right: 24px; top: 4px;
        background: radial-gradient(circle at 34% 30%, #FFFFFF, #CBBCF0 70%);
      }
      .sm-orb--b {
        width: 56px; height: 56px; right: 116px; top: 62px;
        background: radial-gradient(circle at 34% 30%, #FFFFFF, #F4C9DD 70%);
      }
      .sm-orb--c {
        width: 38px; height: 38px; right: 6px; top: 108px;
        background: radial-gradient(circle at 34% 30%, #FFFFFF, #BFE0F2 70%);
      }

      /* ── Tabs ── */
      .sm-tabs {
        display: flex; gap: 4px; margin-bottom: 16px;
        padding: 4px; border-radius: 16px;
        background: #EFEBF7;
        border: 1px solid #E7E3EF;
        overflow-x: auto; scrollbar-width: none;
      }
      .sm-tabs::-webkit-scrollbar { display: none; }
      .sm-tab {
        flex: 1; min-width: 96px; min-height: 44px;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 0 12px; border: none; border-radius: 12px;
        background: none; color: #69677D;
        font-family: inherit; font-size: 14px; font-weight: 600;
        cursor: pointer; white-space: nowrap;
        transition: background-color 0.15s ease, color 0.15s ease;
      }
      .sm-tab.is-on {
        background: #FFFFFF;
        color: #171642;
        box-shadow: 0 1px 2px rgba(23,22,66,0.06), 0 2px 8px rgba(23,22,66,0.05);
      }
      .sm-tab:focus-visible { outline: 2px solid #8066D5; outline-offset: 2px; }

      /* ── Setup ── */
      .sm-setup {
        padding: 18px 16px;
        border-radius: 20px;
        background: #FFFFFF;
        border: 1px solid #E7E3EF;
        box-shadow: 0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04);
        margin-bottom: 24px;
      }
      .sm-fieldset { border: none; margin: 0 0 18px; padding: 0; }
      .sm-legend { padding: 0; font-size: 17px; font-weight: 600; color: #171642; }
      .sm-hint { margin: 4px 0 0; font-size: 13px; color: #69677D; }
      .sm-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      .sm-chip {
        min-height: 44px; padding: 0 14px;
        border-radius: 999px;
        border: 1px solid #E7E3EF;
        background: #FFFFFF;
        color: #171642;
        font-family: inherit; font-size: 14px; font-weight: 500;
        cursor: pointer;
        transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
      }
      .sm-chip:hover { background: #F7F5FB; }
      .sm-chip:active { transform: scale(0.98); }
      .sm-chip.is-on {
        background: #E5DDF5;
        border-color: #8066D5;
        color: #4B3699;
      }
      .sm-chip:focus-visible { outline: 2px solid #8066D5; outline-offset: 2px; }
      .sm-find-btn { margin-top: 4px; }

      /* ── Sections ── */
      .sm-section-title { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; color: #171642; }
      .sm-section-sub { margin: 4px 0 14px; font-size: 13px; color: #69677D; }

      /* ── Cards ── */
      .sm-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .sm-list { display: grid; gap: 12px; }
      .sm-card {
        display: flex; flex-direction: column;
        padding: 16px;
        border-radius: 20px;
        background: #FFFFFF;
        border: 1px solid #E7E3EF;
        box-shadow: 0 1px 2px rgba(23,22,66,0.04), 0 4px 16px rgba(23,22,66,0.04);
      }
      .sm-card-name {
        margin: 0; font-size: 16px; font-weight: 600; color: #171642;
        letter-spacing: -0.01em; line-height: 1.3;
      }
      .sm-card-loc {
        margin: 2px 0 0; font-size: 13px; color: #69677D;
        display: flex; align-items: center; gap: 4px;
      }
      .sm-card-quote {
        margin: 0 0 10px; font-size: 14px; line-height: 1.55;
        color: #4A4760; font-style: italic;
      }
      .sm-card-need {
        margin: 0 0 12px; font-size: 13px;
        color: #1F7A55;
        display: flex; align-items: center; gap: 5px;
      }
      .sm-tags { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
      .sm-tags li {
        font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 999px;
        background: #E5DDF5; border: none;
        color: #4B3699; white-space: nowrap;
      }
      .sm-card-actions { display: flex; gap: 8px; margin-top: auto; }

      /* ── Buttons ── */
      .sm-btn {
        flex: 1; min-height: 48px;
        display: inline-flex; align-items: center; justify-content: center; gap: 7px;
        padding: 0 16px; border-radius: 999px;
        font-family: inherit; font-size: 15px; font-weight: 600;
        cursor: pointer;
        transition: transform 0.12s ease, background-color 0.15s ease;
      }
      .sm-btn:active { transform: scale(0.98); }
      .sm-btn:disabled { opacity: 0.6; cursor: default; }
      .sm-btn:focus-visible { outline: 2px solid #8066D5; outline-offset: 2px; }
      .sm-btn--primary {
        border: 1px solid #8066D5;
        background: #8066D5;
        color: #FFFFFF;
      }
      .sm-btn--primary:hover { background: #735ACB; }
      .sm-btn--ghost {
        border: 1px solid rgba(128,102,213,0.35);
        background: #FFFFFF;
        color: #5E47B8;
      }
      .sm-btn--ghost:hover { background: #F4F0FC; }
      .sm-btn--quiet {
        border: 1px solid transparent; background: none;
        color: #69677D; min-height: 44px; font-size: 14px;
      }
      .sm-btn--quiet:hover { color: #171642; }
      .sm-btn--sent {
        border: 1px solid #BFE5D2;
        background: #E7F6EF;
        color: #1F7A55;
      }
      .sm-icon-btn {
        width: 44px; height: 44px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        border-radius: 999px;
        border: 1px solid #E7E3EF;
        background: #FFFFFF;
        color: #69677D;
        cursor: pointer;
      }
      .sm-icon-btn:hover { background: #F7F5FB; color: #171642; }
      .sm-icon-btn:focus-visible { outline: 2px solid #8066D5; outline-offset: 2px; }

      /* ── Conversation starters ── */
      .sm-starters { margin: 4px 0 14px; }
      .sm-starters-title { margin: 0 0 8px; font-size: 13px; color: #69677D; }
      .sm-starter {
        display: inline-block; margin: 0 6px 6px 0; padding: 6px 11px;
        border-radius: 999px; background: #F7F5FB;
        border: 1px solid #E7E3EF;
        font-size: 13px; color: #171642;
      }

      /* ── Empty + notices ── */
      .sm-empty {
        padding: 32px 20px; text-align: center;
        border-radius: 20px;
        background: #FFFFFF;
        border: 1px solid #E7E3EF;
      }
      .sm-empty-icon {
        width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 14px;
        display: flex; align-items: center; justify-content: center;
        background: #E5DDF5; color: #8066D5;
        border: none;
      }
      .sm-empty-title { margin: 0; font-size: 17px; font-weight: 600; color: #171642; }
      .sm-empty-body {
        margin: 8px auto 18px; max-width: 380px;
        font-size: 14px; line-height: 1.6; color: #69677D;
      }
      .sm-empty-btn { max-width: 220px; margin: 0 auto; }

      .sm-notice {
        margin: 0 0 16px; padding: 10px 14px; border-radius: 14px;
        background: #F4F0FC;
        border: 1px solid #E5DDF5;
        font-size: 13px; color: #4B3699;
      }
      .sm-safety-note {
        margin: 16px 0 0; font-size: 12px; color: #69677D;
        display: flex; align-items: center; gap: 6px;
      }
      .sm-safety-note--foot { margin-top: 28px; justify-content: center; }
      .sm-dev-note {
        margin: 8px 0 0; font-size: 12px; font-weight: 600;
        color: #A56A12;
        display: flex; align-items: center; gap: 6px;
      }

      /* ── Detail sheet ── */
      .sm-overlay {
        position: fixed; inset: 0; z-index: 1000;
        display: flex; align-items: flex-end; justify-content: center;
        background: rgba(23,22,66,0.32);
      }
      .sm-sheet {
        width: 100%; max-width: 520px;
        max-height: 88vh; overflow-y: auto;
        padding: 20px 18px calc(24px + env(safe-area-inset-bottom, 0px));
        border-radius: 24px 24px 0 0;
        background: #FFFFFF;
        color: #171642;
        border: 1px solid #E7E3EF;
      }

      /* ── Shimmer ── */
      .sm-shimmer {
        background: linear-gradient(90deg, #EFEBF7 25%, #F7F5FB 37%, #EFEBF7 63%);
        background-size: 400% 100%;
        animation: smShimmer 1.5s ease-in-out infinite;
      }
      @keyframes smShimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

      /* ══ Tablet ══ */
      @media (min-width: 700px) {
        .sm-page { padding: 28px 24px 40px; }
        .sm-title { font-size: 28px; }
        .sm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sm-setup { padding: 20px; }
        .sm-overlay { align-items: center; }
        .sm-sheet { border-radius: 24px; padding: 24px; }
      }

      /* ══ Desktop ══ */
      @media (min-width: 1024px) {
        .sm-page { padding: 32px 32px 48px; }
        .sm-hero { display: grid; grid-template-columns: 1fr 220px; align-items: center; gap: 24px; }
        .sm-hero-art { display: block; position: relative; height: 180px; }
        .sm-title { font-size: 28px; }
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
