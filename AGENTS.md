## Learned User Preferences

- Match the Figma frame 1:1 for desktop composition; treat Figma as visual truth over reconstructed layout approximations. Keep slice text (especially About) as sharp as Figma; do not blur or cover original art with overlay experiments.
- Treat illustration and image layers as visual assets, not independent UI components; do not recreate decorative vectors as standalone React components unless necessary.
- After the desktop match is approved, use full-width scaling with no navy side bars so the 1440 composition fills the viewport on every device, including mobile. Pinch/trackpad zoom must stay on the composition — no blank-background pan, leftover blue bar, or stuck zoom. Hide the top row of hero stars via layout crop (`HERO_TOP_CROP`, currently 150px) — clip the scaled canvas, not landing scroll or a navy band.
- Drop Figma reference screenshots at the project root rather than attaching them in chat.
- On mobile, use a floating hamburger only — no full-width top nav bar; cover the illustrated nav strip on mobile.
- Fix illegible baked-in slice text with crops or opaque covers, not duplicate HTML overlays stacked on the slice. Nav legibility cover: opaque backing only from x=800 for right-side links, not full width (preserves top-left star).
- Footer credit: transparent HTML overlay anchored at the bottom of the page on the ruins art.
- Reject per-character overlay animations on composite slices; keep v1-stable slice-only visuals as the base when overlay experiments break the page.
- FAQ interactivity: opaque covers over baked PNG FAQ bars in slice 04, with HTML FAQAccordion aligned to Figma coords on top.
- Overlay-only motion: never transform the canvas wrapper or PNG slices for scroll effects. Keep FAQ height expand, register CTA, and nav underlines. Plane/banner may use wind or slight simulated motion; do not add canvas dive or other scroll-hijack transitions. Ambient overlay particles (leaves, dandelions, bubbles) are allowed; they must sit behind text and hero lockups, spawn in gradually (not all visible on load), and use gusty staggered left-to-right wind — not a convoy. Leaves must stay off About body copy.
- Existing Figma stars should glow like the pre-register CTA — do not place twinkle sprites on them. Extra ambient sky stars must be sparse and dispersed, not lined up on one side. Do not add shooting stars or meteors.
- About nav jump should land on the branch/cat plus About copy, not sky — frame the full copy with the cat at least half visible, preferring lower rather than too high.

## Learned Workspace Facts

- NASA Space Apps Challenge Temecula landing page from Figma file `F3DmtMEPnGhltpf4EaR1eW`, frame Main 8_12 — DEV HANDOFF — CLEAN (`4003:2`), canvas 1440×14623 (ocean slice cropped below footer ruins; baked footer text removed from slice).
- Stack is React 18 + TypeScript + Vite + plain CSS (no Tailwind); fonts are Koulen, Margarine, Space Grotesk, and Source Sans 3.
- Visual composition is four composite PNG slices plus overlay hit targets in `src/layout/frame.ts`, not independently reconstructed decorative layers.
- Chosen product layout is fill-width (`scale` / `VITE_LAYOUT=scale`): scale the 1440 canvas to viewport width. Center-plus-edge-bleed (`bleed`) was rejected.
- Figma 100% zoom reference screenshots live at the project root: `top.png`, `tracks - skyrocket.png`, `schedule-ocean.png`, `ocean.png`.
- `npm run fetch-assets` downloads Figma illustrations into `public/assets`; embedded Figma asset URLs expire.
- Tag **`v1-stable`** is the pre-animation rollback point; unpatched slice originals live in `public/assets/slices-original/`.
- Tag **`v2-no-anim`** is the post-FAQ, post-zoom-fix, no-motion snapshot (fill-width clip scale, no canvas transforms for animation). Restore with `git checkout v2-no-anim`.
- Slice seam at y=4007 (01-hero-about → 02-tracks-schedule join): restore original slices and use 1px overlap to hide subpixel gaps.
- FAQ question bars are baked into slice 04; working expand/collapse requires aligned HTML accordion plus opaque covers hiding the PNG bars.
- FAQ remaining-question copy should say we will get back as soon as possible, not reply within a day.
- Wind particles: leaves through About down to the grass above sponsors but not over About body copy; larger dandelions in grassy tracks/schedule. Travel left-to-right from one side with gusty staggered paths (not a straight convoy). Particles must continue through tracks/schedule, not only the hero/About.
