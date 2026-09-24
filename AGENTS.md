# SoulConnect Engineering Rules

## Core Principle

Preserve existing functionality before adding new functionality.

Inspect existing components, APIs, hooks, services and state before writing code.

## Never Rewrite Working Features

Do not rewrite working functionality simply to implement a UI change.

Especially protected components:

- Soul Climate
- Global Pulse
- SoulMatch
- Tiny Wins
- Soul Stories
- Messages
- Professionals
- Authentication

If a task is visual, prefer changing the parent layout/CSS rather than rewriting working business logic.

## No Fake Data

Never hardcode fake:

- users
- match scores
- mental-health statistics
- appointments
- therapists
- engagement numbers
- Global Pulse statistics

Use real API/database data or proper empty states.

## Security

Never:

- expose secrets
- expose database credentials
- weaken authentication
- bypass authorization
- disable security middleware
- log sensitive mental-health information
- expose private user data

## Health Data

Treat emotional check-ins, mental-health categories, conversations and related information as sensitive.

Do not unnecessarily log or expose it.

## Frontend

Reuse existing components before creating new ones.

Do not introduce a dependency when existing project code or native browser functionality is sufficient.

Do not install a UI library simply to solve a small styling problem.

Exception by decision (2026-09-24): shadcn/ui is the adopted component foundation for the logged-in app (`src/components/ui/`, see `docs/DESIGN_SYSTEM.md`). Add individual shadcn components only when a screen being migrated needs them.

## UI Changes

When implementing from a reference image:

1. Inspect existing implementation.
2. Identify existing reusable components.
3. Preserve business logic.
4. Reproduce the visual structure using existing components.
5. Test desktop.
6. Test mobile.
7. Check browser console.
8. Check API calls.

## Before Modifying Protected Components

Explicitly identify whether the requested change requires modifying the protected component.

If not, don't touch it.

## Completion Standard

Never claim a UI task is complete based only on source code.

Run the application and inspect the rendered result.
