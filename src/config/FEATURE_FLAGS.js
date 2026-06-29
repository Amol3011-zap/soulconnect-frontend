/**
 * SoulConnect Feature Flags
 *
 * Controls which features are active in the current build.
 * Toggle flags here — do NOT expose disabled features in the UI.
 *
 * MVP (v1.0) — active features:
 *   Soul Climate, Tiny Wins, Healing Tree, Stories, Circles,
 *   Professionals, Messages, Profile
 *
 * v2 roadmap:
 *   REFLECTION — Private journaling + AI insights
 */

export const FEATURES = {
  // ── Active MVP features ───────────────────────────────────────────────────
  SOUL_CLIMATE:   true,
  TINY_WINS:      true,
  HEALING_TREE:   true,
  STORIES:        true,
  CIRCLES:        true,
  PROFESSIONALS:  true,
  MESSAGES:       true,
  PROFILE:        true,

  // ── v2 — NOT active, NOT exposed in UI ───────────────────────────────────
  // To re-enable: set to true, add route in App.jsx, add nav item in DashboardLayout.jsx
  REFLECTION:     false,   // Private journaling + AI reflection (v2)
  VOICE_JOURNAL:  false,   // Voice-to-text journaling (v2)
  LETTERS:        false,   // Letters to future/past self (v2)
};
