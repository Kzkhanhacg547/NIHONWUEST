# Survival Mode UI Redesign

## Files
- `page.tsx` → replace the existing Survival Mode `page.tsx`.
- `SurvivalClient.tsx` → replace the existing `SurvivalClient.tsx`.
- `src/assets/survival/` → copy this folder into the project's `src/assets/survival/`.

## Required asset aliases
This implementation expects the existing Next.js `@/*` alias to point to `src/*`.

The UI uses imported static images, not `/public` paths:
- `japan-hero.webp`
- `ramen.webp`
- `konbini.webp`
- `station.webp`
- `hotel.webp`
- `sakura-strip.webp`

## What changed
- Premium Sakura / Fuji visual system.
- Glassmorphism hero and stats.
- 4-column scenario cards on desktop.
- Real image assets wired into the scenario cards and dialogue scene.
- Existing dialogue, scoring, speech recognition, progress API and sound/theme logic are preserved.
