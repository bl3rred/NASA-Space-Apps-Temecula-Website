# Changelog

## v2.9 — star glow, plane motion, About match (2026-08-17)

- Illustrated stars use a gold radial glow on Figma sprites only (no extra dots)
- Hero jet+banner bob in a clipped window over an inpainted sky patch (slice stays still)
- About matches the painted Figma slice (no HTML slabs or doubled glyphs)

## v2.8 — slim motion + sharp About (2026-08-17)

- Kept nav underlines, register CTA pulse, and FAQ height expand; removed ocean bubbles and in-view fades
- Star twinkles sit on Figma sprite positions plus a few scattered extras (no left-side grid)
- Wind streaks + light banner flutter around the NASA SPACE APPS plane (slice stays still)
- About copy: opaque covers + sharp HTML at Figma coords (NASA logo uncovered)

## v2.7 — overlay-only polish motion (2026-08-17)

- Nav hover underline, mobile menu fade, register CTA pulse, FAQ height expand
- Ambient sky twinkles (hero Y only) and ocean bubbles in slice 04 local coords
- FAQ/footer in-view stagger via IntersectionObserver
- No canvas `scale`/`translate` for motion; `prefers-reduced-motion` keeps overlays static

## v2-no-anim — snapshot (2026-08-17)

Static fill-width page after FAQ overlay, 1px slice seams, and zoom/layout fixes. **No** canvas scroll transitions, GSAP, or ambient overlays.

**Includes:** clip-wrapper scale from `top left`, `innerWidth` layout scale, HTML FAQ accordion, native nav smooth scroll.

To restore this snapshot: `git checkout v2-no-anim`

## v2.6 — remove transitions + stable zoom (2026-08-17)

- Removed scroll transitions, ocean bubbles, and GSAP/ScrollTrigger entirely
- Stable fill-width scale from `window.innerWidth` only (no `visualViewport` counter-pan)
- Static centered canvas — browser pinch/Ctrl+zoom works natively without JS fighting layout

## v2.5 — polish scroll + pinch + slice seams (2026-08-17)

- Replaced nauseating `power2.in` fall (10% scale snap) with sin-envelope transitions (~3% scale peak, zero at zone edges)
- Blend overlapping transition zones for smooth handoffs; land settle capped at ±12px
- Pinch fix: flex-centered canvas + `visualViewport` counter-pan on scale-frame (not translateX -50% hack)
- 1px PNG slice overlap at joins (4006 / 9493 / 12857) + anti-gap CSS on `.page-slice`
- Softer ocean bubbles (max opacity 0.45, slower drift)

## v2.4 — section scroll transitions + pinch fix (2026-08-17)

- Removed zoom notice banner
- Centered canvas (`top center` origin, `translateX(-50%)`) with `visualViewport` offset compensation to reduce blank side gaps on trackpad pinch
- Per-section scroll-scrubbed transitions: fall scale at Hero→About, land rush/settle at Tracks/Schedule/Sponsors, ocean bubble overlay approaching FAQ
- Replaced generic 24px translate boost with `sectionTransitions.ts` + `sectionTransitionScroll.tsx`

## v2.3 — scroll boost + zoom (2026-08-17)

- Replaced forced sine scale "dive" with 1:1 scroll-synced translate boost in section transition zones
- Added `useViewportMetrics` with `visualViewport` listeners + debounced `ScrollTrigger.refresh` on zoom/resize
- Nav links use native `scrollTo({ behavior: 'smooth' })` (user-interruptible)
- Optional dismissible notice when browser zoom is likely != 100%
- FAQ contact answer: "We'll get back to you as soon as possible."

## v2.2 — revert + section dive (2026-08-17)

- Reverted hybrid overlay/patch experiments (v2 / v2.1) back to **v1-stable** slice visuals
- Restored unpatched slices; originals kept in `public/assets/slices-original/`
- FAQ: opaque covers over baked PNG bars + aligned HTML accordion
- Removed `src/animations/`, `src/components/animated/`, `patch-slices`, `public/assets/animated/`, and `sharp`

## v1-stable — 2026-08-17

Safe rollback point before scroll/character animation work.

**Includes:**

- Four-slice composite layout (`public/assets/slices/`)
- Fill-width scale mode (`FRAME_WIDTH=1440`, `FRAME_HEIGHT=14623`)
- Mobile floating hamburger nav (no full-width top bar)
- Desktop nav opaque cover from x=800 (preserves top-left star)
- Transparent footer credit overlay on ruins art
- FAQ accordion HTML overlay

**Does not include:** per-character overlay PNGs or slice patching.

To restore slice-only baseline: `git checkout v1-stable`
