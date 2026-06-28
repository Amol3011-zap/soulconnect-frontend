# SoulConnect Design System

## Core Design Tokens

### Colors
- Background: `#080812` (deep), `#0D0B1A` (base), `#0A0818` (rich)
- Card glass: `rgba(34,18,73,0.72)` + `backdrop-filter: blur(24px)`
- Purple accent: `#7C3AED`, `#8B5CF6`, `#A855F7`, `#A78BFA`, `#C084FC`
- Text primary: `#FFFFFF`
- Text secondary: `#E2DEFF`
- Text muted: `rgba(255,255,255,0.6)`
- Gold: `#F4C542`, `#F59E0B`
- Success: `#10B981`
- Border: `rgba(255,255,255,0.08)` | `rgba(168,85,247,0.18)`

### Typography
- Font: Inter, -apple-system, sans-serif
- H1: 28–32px, weight 800, letter-spacing -0.02em
- H2: 22–24px, weight 700
- Body: 14px, weight 400, line-height 1.6
- Small: 12px, weight 500
- Label: 11px, weight 700, uppercase, letter-spacing 0.1em

### Spacing
- Base unit: 8px
- Card padding: 20–28px
- Section gap: 16–24px
- Component gap: 12–16px

### Border Radius
- Cards: 24–28px
- Buttons: 14–18px
- Pills: 20px (full round)
- Inputs: 18px

### Shadows
- Card: `0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(140,82,255,0.18)`
- Button: `0 4px 20px rgba(139,92,246,0.4)`
- Purple glow: `0 0 40px rgba(124,58,237,0.3)`
- Gold glow: `0 0 30px rgba(244,197,66,0.2)`

---

# Premium Visual Language

SoulConnect must never feel like a dashboard.

It should feel like a premium native wellness application.

Every screen should evoke calm, warmth and emotional safety.

---

## Light Is Part of the Interface

Light is a design element.

Every major illustration should emit subtle ambient light.

Examples:
- Soul Climate Orb
- Healing Tree
- Tiny Wins
- Meditation Illustration
- Lotus
- AI Insight

The surrounding card should softly glow based on the illustration.

Never use harsh bloom. Glow should feel natural.

---

## Floating Elements

Primary illustrations should never look static.

Apply slow floating animations:
- 3–8px vertical movement
- Duration: 6–12 seconds
- Ease In Out

Examples: Soul Climate Orb, Healing Tree, Lotus, Particles

---

## Depth

Every card should feel layered:

```
Background
  ↓ Glass Layer
  ↓ Illustration
  ↓ Glow
  ↓ Content
  ↓ Floating Particles
```

Never use flat containers.

---

## Glassmorphism

Cards should use premium glass:

```css
background: rgba(34,18,73,0.72);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255,255,255,0.08);
box-shadow: 0 0 40px rgba(140,82,255,0.18), 0 8px 32px rgba(0,0,0,0.4);
```

Always add soft inner highlight on top edge:
```css
/* Pseudo-element or child div */
height: 1px;
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
```

Never use opaque boxes.

---

## Shadows

Avoid black shadows. Only use colored ambient shadows:

- Purple Glow: `rgba(124,58,237,0.18)`, blur 30–60px
- Gold Glow: `rgba(244,197,66,0.12)`, blur 30–40px
- Base depth: `rgba(0,0,0,0.4)`, blur 32px

---

## Backgrounds

Never use flat backgrounds. Always layer gradients:

```css
background:
  radial-gradient(ellipse 70% 50% at 15% 0%, rgba(124,58,237,0.14) 0%, transparent 55%),
  radial-gradient(ellipse 50% 60% at 85% 100%, rgba(168,85,247,0.09) 0%, transparent 55%),
  radial-gradient(ellipse 40% 70% at 90% 25%, rgba(76,29,149,0.11) 0%, transparent 50%),
  #080812;
```

Add animated aurora layers for hero cards.

---

## Particles

Use subtle floating particles:
- Tiny glowing dots (1.5–4px)
- Opacity: 15–35%
- Random slow movement via CSS keyframes
- Colors: `#A78BFA`, `#F4C542`, `#C4B5FD`
- Never resemble stars in space
- Should feel magical and peaceful

```css
@keyframes particleDrift {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(6px, -10px); }
  66%       { transform: translate(-4px, 6px); }
}
```

---

## Motion

Use `motion/react` (import from `'motion/react'`). Never use `framer-motion`.

Motion should feel alive, never distracting:

- **Hover**: Lift (translateY -2 to -4px), Scale 1.02, Glow increase
- **Page transitions**: Fade + slide, `duration: 0.24s`, `ease: [0.23, 1, 0.32, 1]`
- **Cards entry**: `opacity 0→1`, `y 20→0`, stagger `index * 0.08s`
- **Illustrations**: Breathing/floating animation 6–12s loop
- **Buttons**: `whileTap={{ scale: 0.96 }}`
- **Spring animations**: `stiffness: 280–420`, `damping: 20–26`

---

## Borders

Never use harsh borders. Use:
- `rgba(255,255,255,0.08)` — default card border
- `rgba(168,85,247,0.18)` — purple accent border
- `rgba(168,85,247,0.4)` — active/selected border

---

## Icons

- Use **Lucide React only**
- Stroke width: `2px`
- Consistent sizing within context (16–20px UI, 18–24px nav)
- Primary/active icons may have subtle glow via `filter: drop-shadow(0 0 6px rgba(196,181,253,0.6))`

---

## Hero Components

Each screen should contain ONE visual hero element:

| Screen | Hero |
|--------|------|
| Home | Soul Climate Orb |
| Stories | Featured Story Card |
| Journal | Journal Timeline |
| Meditation | Breathing Orb |
| Profile | Healing Tree |
| Tiny Wins | Progress Ring / Tree |

The hero should naturally draw attention first.

---

## Buttons

### Primary (Purple Gradient)
```css
background: linear-gradient(135deg, #7C3AED, #A855F7);
border-radius: 14px;
box-shadow: 0 4px 20px rgba(124,58,237,0.45);
color: #fff;
font-weight: 700;
```

Hover: lift 2px, increase shadow
Active: scale 0.96 (whileTap)

### Secondary (Glass)
```css
background: rgba(255,255,255,0.07);
border: 1px solid rgba(255,255,255,0.12);
border-radius: 12px;
color: #E2DEFF;
```

---

## Sidebar

Premium glass sidebar:
```css
background: rgba(8,6,22,0.92);
backdrop-filter: blur(28px);
border-right: 1px solid rgba(255,255,255,0.06);
```

Active nav item:
```css
background: linear-gradient(135deg, rgba(124,58,237,0.75), rgba(168,85,247,0.55));
box-shadow: 0 0 20px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
border: 1px solid rgba(168,85,247,0.3);
```

---

## Scrollbar

Custom thin purple scrollbar:
```css
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(139,92,246,0.35);
  border-radius: 10px;
}
```

---

## Mobile First

Primary target: iPhone 15 Pro (393×852).

Rules:
- 48px minimum touch targets
- Cards stack vertically on mobile
- Bottom navigation for primary routes
- No hover-only interactions
- Padding: 16–20px horizontal on mobile
- `padding-bottom: 90–100px` when bottom nav is present

---

## Performance

- Lazy load all page components
- Use `React.memo` for pure display components
- Use `useCallback` for handlers in lists
- Animate with `will-change: transform` only when needed
- Target 60 FPS — never animate layout-triggering properties

---

## Premium Feeling Checklist

Before shipping any screen:

- [ ] Does it feel luxurious?
- [ ] Does it feel calm?
- [ ] Does it feel emotionally safe?
- [ ] Does it look like a native app?
- [ ] Does every illustration emit subtle light?
- [ ] Does the interface breathe (enough whitespace)?
- [ ] Would this sit beside Apple Health, Calm, or Headspace comfortably?

If any answer is "No" — redesign before shipping.

---

## Forbidden

Do not use:
- ❌ Flat cards (no glassmorphism)
- ❌ Bootstrap or Tailwind utility class styling
- ❌ Sharp edges (< 12px border-radius on cards)
- ❌ Neon/harsh glow effects
- ❌ Black box-shadows
- ❌ Generic dashboard layouts
- ❌ Loud or saturated gradients
- ❌ Crowded spacing (< 12px gaps)
- ❌ More than one primary CTA per section
- ❌ Inconsistent icon libraries (Lucide only)
- ❌ `framer-motion` imports (use `motion/react`)

---

## Golden Rule

Every screen should feel like opening a beautifully crafted premium mobile application.

The user should feel calmer the moment the screen appears.
