## Learned User Preferences

- Match the Figma frame 1:1 for desktop composition; treat Figma as visual truth over reconstructed layout approximations.
- Treat illustration and image layers as visual assets, not independent UI components; do not recreate decorative vectors as standalone React components unless necessary.
- After the desktop match is approved, use full-width scaling with no navy side bars so the 1440 composition fills the viewport on every device, including mobile.
- Drop Figma reference screenshots at the project root rather than attaching them in chat.
- On mobile, use a floating hamburger only — no full-width top nav bar; cover the illustrated nav strip on mobile.
- Fix illegible baked-in slice text with crops or opaque covers, not duplicate HTML overlays stacked on the slice.
- Nav legibility cover: opaque backing only from x=800 for right-side links, not full width (preserves top-left star).
- Footer credit: transparent HTML overlay anchored at the bottom of the page on the ruins art.

## Learned Workspace Facts

- NASA Space Apps Challenge Temecula landing page from Figma file `F3DmtMEPnGhltpf4EaR1eW`, frame Main 8_12 — DEV HANDOFF — CLEAN (`4003:2`), canvas 1440×14623 (ocean slice cropped below footer ruins; baked footer text removed from slice).
- Stack is React 18 + TypeScript + Vite + plain CSS (no Tailwind); fonts are Koulen, Margarine, Space Grotesk, and Source Sans 3.
- Visual composition is four composite PNG slices plus overlay hit targets in `src/layout/frame.ts`, not independently reconstructed decorative layers.
- Chosen product layout is fill-width (`scale` / `VITE_LAYOUT=scale`): scale the 1440 canvas to viewport width. Center-plus-edge-bleed (`bleed`) was rejected.
- Figma 100% zoom reference screenshots live at the project root: `top.png`, `tracks - skyrocket.png`, `schedule-ocean.png`, `ocean.png`.
- `npm run fetch-assets` downloads Figma illustrations into `public/assets`; embedded Figma asset URLs expire.
