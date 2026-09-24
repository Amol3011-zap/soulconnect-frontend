# SoulConnect Design System

```
                    SOULCONNECT
                         │
              SoulConnect Design System
                         │
        ┌────────────────┴────────────────┐
   Visual Language                  Interaction
   Colors · Typography              shadcn/ui
   Lotus · Photography              React
   Spacing · Cards                  Tailwind
   Branding                         Router
        └──────────────┬──────────────────┘
                   Mobile PWA
```

**Decision (2026-09-24): shadcn/ui is the component foundation for the
logged-in app, and the UI migrates to it gradually — screen by screen, never a
big-bang rewrite.** shadcn gives us accessible, unstyled-by-intent primitives;
SoulConnect supplies the visual language on top. The result must look like
SoulConnect, never like a default shadcn demo.

Scope: the logged-in app (everything rendered inside `DashboardLayout`).
The public marketing pages (Landing, About, etc.) keep their own dark,
illustrated brand design and are not part of this migration.

---

## 1. Visual Language

### Colors — light app palette

| Token | Hex | Use |
|---|---|---|
| Background | `#F7F5FB` | page background |
| Section | `#EFEBF7` | secondary sections, segmented-control track |
| Card | `#FFFFFF` | cards, sheets, nav bars |
| Warm neutral | `#FAF7F2` | quiet highlight cards (quotes, reflections) |
| Ink | `#171642` | primary text |
| Ink 2 | `#69677D` | secondary text |
| Purple | `#8066D5` | primary actions, active states, links |
| Purple text | `#5E47B8` | purple text on white (contrast-safe) |
| Soft purple | `#E5DDF5` | active pill, selected chip, tags |
| Border | `#E7E3EF` | every hairline border |
| Success | `#2E9E6E` / bg `#E7F6EF` | completed, available |
| Warm label | `#A56A12` | small gold-family labels on white |

Purple is an **accent**, not a surface. No screen should be mostly purple.

These live in `src/index.css` under `.sc-app` (the `DashboardLayout` root),
both as shadcn HSL variables (`--primary`, `--border`, …) and as named
`--sc-*` tokens, and in `tailwind.config.js` as `bg-primary`, `text-foreground`,
`border-border`, `bg-sc-warm`, etc. Because they're scoped to `.sc-app`, they
can never restyle the public pages.

### Typography

Font: Plus Jakarta Sans (already loaded), inherited everywhere. Never
hardcode `Inter` — it isn't loaded and falls back to Arial.

| Role | Size | Weight |
|---|---|---|
| Page title | 24–28px | 700 |
| Section title | 18–22px | 600 |
| Card title | 16–17px | 600 |
| Body | 15–17px | 400–500 |
| Supporting | 13–15px | 400 |
| Button | 15–16px | 600 |

Large display type (40px+) belongs to marketing pages only, never inside the app.

### Spacing

Scale: **8 · 12 · 16 · 20 · 24 · 32**. Card padding 16–20px. Gap between
sections 24px on mobile. Every gap has a reason; no filler whitespace.

### Cards

White, `1px solid #E7E3EF`, radius 16–20px, padding 16–20px, and a barely-there
shadow: `0 1px 2px rgba(23,22,66,.04), 0 4px 16px rgba(23,22,66,.04)`.
Use `<Card>` from `@/components/ui/card` — it already encodes all of this.

### Lotus

The lotus is decoration, never navigation. Use `<LotusMark>`
(`src/components/LotusMark.jsx`): SVG, `aria-hidden`, `pointer-events:none`,
absolutely positioned so it never takes part in layout, float stops under
`prefers-reduced-motion`. Subtle on mobile (behind a header, in empty
states), more prominent on desktop.

### Photography & illustration

Warm, natural, real. Existing illustrations (e.g. the Stories featured scene)
may stay as artwork inside a white card. No stock "AI" imagery.

### Forbidden in the app

- ❌ Dark full-screen backgrounds, glassmorphism, `backdrop-filter` blur on cards
- ❌ Neon glows, purple gradients on surfaces, black/heavy shadows
- ❌ Emoji as UI icons (use Lucide; emoji are fine *as content*, e.g. mood options)
- ❌ Marketing-size headings on app screens
- ❌ Fake data (see `AGENTS.md`)
- ❌ `framer-motion` imports (use `motion/react`)

---

## 2. Interaction layer

### shadcn/ui

Components live in `src/components/ui/`, imported via the `@/` alias
(`@/components/ui/button`). Config: `components.json` (style `new-york`,
JSX not TSX, Lucide icons). The helper `cn()` is in `src/lib/utils.js`.

**Tailwind is v3 (3.4.x).** The latest shadcn CLI targets Tailwind v4. To add
a component, use the v3-compatible CLI and then restyle it with the tokens above:

```bash
cd frontend
npx shadcn@2.3.0 add dialog
```

`tailwind-merge` is pinned to v2 for the same reason — don't upgrade it to v3
while on Tailwind v3.

Installed today:

| Component | SoulConnect adaptation |
|---|---|
| `Button` | pill shape, 48px tall by default; variants `default` (purple), `secondary` (white + purple border), `soft`, `ghost`, `outline`, `destructive`, `link`; `active:scale-[0.98]` |
| `Card` (+ Header/Title/Description/Content/Footer) | the SoulConnect card above |
| `Badge` | `default` (soft purple), `outline`, `solid`, `warm` |
| `Avatar` | soft tinted fallback |
| `Input` | 48px, 16px text (no iOS zoom), rounded-2xl |
| `Skeleton` | page-shaped loading; stops under reduced motion |
| `Progress` | purple on soft purple |
| `Dialog` | added via the CLI; `sc-portal` class so tokens reach the portal, z 1000+ above the bottom nav, light scrim, 24px radius, 44px close target, scrolls within `100dvh` |

Add the rest **only when a screen being migrated needs it**: Sheet,
Tabs, Form, Select, DropdownMenu, AlertDialog.

**Portals:** Radix portals (Dialog, and later Sheet/Select/DropdownMenu) render
on `<body>`, outside `.sc-app`. The tokens are therefore also defined on
`.sc-portal` in `src/index.css`; add `sc-portal` to the overlay/content of
every portalled component you install, and a z-index above 999 (bottom nav). Don't install unused components.

### Styling rule

- **New and migrated code:** Tailwind classes + shadcn components, using the
  semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`,
  `bg-primary`…). Raw hex only for one-off data colours (e.g. a category tint).
- **Not-yet-migrated code:** existing inline styles stay until that screen is
  migrated. Don't mix: when you touch a screen for migration, move the whole
  screen's visual layer, not half of it.

### Motion

`motion/react` only. 150–220ms, `opacity`/`transform` only, never height or
layout. Press feedback `scale(0.98)`. Respect `prefers-reduced-motion`.

**Navigation must never flash.** `DashboardLayout` holds one `<Suspense>`
around `<Outlet/>`, the router uses `v7_startTransition`, primary tab chunks are
preloaded on idle (`App.jsx`), and the route fade starts at 0.88 opacity. Do
not add per-route `<Suspense fallback={<PageLoader/>}>`, full-screen spinners,
or page fade-from-zero animations inside the app.

### Icons

Lucide React only, stroke 2, 16–20px in UI, 21px in the bottom nav.

---

## 3. Mobile PWA

Primary target 393×852 (iPhone 15 Pro); must also work at 320–430px, tablet
and desktop (see the responsive checklist in `CLAUDE.md` / memory).

- One shared top bar (60px + safe area) and one bottom nav (56px targets +
  safe area), both in `DashboardLayout`. Pages don't render their own app headers.
- 48×48px minimum touch targets. No hover-only affordances.
- One scroll container (the page). No nested scrolling except deliberate
  horizontal carousels.
- `env(safe-area-inset-*)` on anything fixed.
- Client-side navigation only — never `window.location.href` for in-app routes.

Open item: `public/manifest.json` and `index.html` `theme-color` still use the
dark values (`#0D0B1A` / `#8B5CF6`). Switching them to the light palette also
changes the installed-app splash and the public site, so it's a deliberate
separate change.

---

## 4. Migration tracker

"Light" = visually converted in place (inline styles, light palette).
"shadcn" = rebuilt on `@/components/ui`. Business logic stays untouched in
both (see `AGENTS.md` protected components).

| Screen / area | Status | Notes |
|---|---|---|
| App shell (`DashboardLayout`) | Light | top bar + bottom nav in scoped CSS; move to shadcn `Sheet`/nav when menu is built |
| Home | **shadcn** | Card/Button/Badge/Progress/Skeleton; People + Tiny Win cards migrated |
| Home desktop sidebar | **shadcn** | Today's focus, Global Pulse card, upcoming session |
| Profile | Light | header, stats, activity, settings list — next candidates |
| Stories | Light | featured illustration intentionally stays dark artwork |
| Community | Light | |
| Messages | Light | |
| Soul Climate (`/mood`) | **shadcn** | Card/Button/Badge/Progress/Skeleton/Dialog — see note below |
| Tiny Wins | Light | "undefined min" data bug (pre-existing) |
| Professionals | Light | |
| SoulMatch | Light | styles in `soulmatchStyles.jsx` (class-based) |
| Modals & toasts | Light | EmotionWeatherModal, Search, Notifications, FloatingCompanion, ErrorToast |
| Global Pulse page (`/pulse`) | Not started | public route, 3D globe; keep globe, restyle surrounding UI |
| Chat (`/chat`) | Not started | full-screen layout |

Suggested order: ~~Soul Climate~~ → Profile → Tiny Wins → Community →
Messages → Stories → Professionals → SoulMatch → Chat → Global Pulse.

### Migration notes

**Soul Climate — 2026-09-24.** `pages/MoodTracker.jsx` and
`components/mood/{MoodSelector,MoodStats,MoodBreakdown,RecentEntries}.jsx`.
- Removed the 28px "Welcome back, {name} 👋" heading. On mobile the shared top
  bar already titles the screen; desktop gets a 28px "Soul Climate" header
  with the Log mood action.
- Four tall emoji stat tiles → one compact card: wellness score with a
  `Progress` bar + current streak / longest streak / total entries.
- Check-in: 5 mood tiles (radiogroup, 72px tall, labels wrap instead of
  truncating). Checked-in state = green "Checked in" badge + selected tile +
  helper text; no animation.
- The custom 7-step "Log mood" modal → shadcn `Dialog` (focus trap, Esc,
  labelled title); steps, state setters and save flow unchanged.
- Chart, insights, breakdown, recent entries → `Card`s; delete is a 44px icon
  button with an aria-label.
- Layout: single column on mobile (check-in → stats → chart → insights →
  breakdown → recent); two columns at ≥1024px via CSS grid areas.
- Removed a fake 400ms "Simulate loading" delay that flashed a skeleton on
  every visit (the data is local and synchronous).
- Fixed a pre-existing breakdown bug: a single mood at 100% drew no donut.
- Business logic unchanged: `useMoodData` (local store), `handleSave`,
  `handleDeleteEntry` and the activity-log call are untouched.

---

## 5. Pre-ship checklist (every migrated screen)

- [ ] Uses `@/components/ui` + tokens; no dark/glass remnants
- [ ] Headings within the type scale; spacing on the 8-based scale
- [ ] Primary action visible without scrolling on 393×852 and 393×700
- [ ] 48px touch targets, visible focus states, reduced-motion respected
- [ ] No horizontal scroll at 320–430, 768, 1024, 1440, 1920
- [ ] Tab switch into and out of the screen: no blink, no spinner, no reload
- [ ] No console errors; no new API calls; no fake data
- [ ] Business logic unchanged (diff shows only the visual layer)

## Golden rule

Premium comes from spacing, typography and hierarchy — not effects. The user
should feel calmer the moment the screen appears.
