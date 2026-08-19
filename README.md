# NASA Space Apps Challenge — Temecula Landing Page

A single-page, vertically-scrolling landing page for the NASA Space Apps Challenge hackathon in Temecula, CA. Implemented from the Figma frame **"Main 8_12 — DEV HANDOFF — CLEAN"** (`4003:2`).

The page follows a thematic vertical journey: **space → sky → grass → underground → deep sea**, with each environment transition preserved as overlapping illustrated artwork.

## Tech stack

- **React 18 + TypeScript** — semantic, reusable section components
- **Vite 5** — dev server and build
- **Plain CSS** with design tokens (CSS custom properties) — no Tailwind, no UI library
- **Google Fonts** — Koulen (display), Margarine (body), Space Grotesk + Source Sans 3 (UI)

## Getting started

```bash
npm install
npm run fetch-assets   # downloads every illustration from Figma into /public/assets (one-time)
npm run dev            # http://localhost:5173
npm run build          # type-check + production build to /dist
npm run preview        # serve the production build
```

The Figma asset URLs embedded in `src/data/assets.ts` expire ~7 days after generation. `npm run fetch-assets` downloads all 69 assets into `public/assets/<group>/` and `assets.ts` already points at those local paths, so the project is self-contained and works offline.

## Section hierarchy (in order)

The page is a single 1440×14734 illustrated canvas. Each numbered section is a semantic `<section>` component positioned at its source offset, with `overflow: visible` so decorative artwork bleeds across section boundaries exactly as in the Figma frame.

| #   | Section                              | Component                  | Top  | Height |
|-----|--------------------------------------|----------------------------|------|--------|
| 01  | Hero (space)                         | `HeroSection`              | 0    | 2247   |
| 02  | Sky transition                       | folded into `HeroSection`   | —    | —      |
| 03  | About                                | `AboutSection`             | 2247 | 3604   |
| 04  | About → Tracks transition (rocket)  | folded into `AboutSection` | —    | —      |
| 05  | Tracks                               | `TracksSection` + `TrackCard` | 5851 | 3239 |
| 06  | Schedule                            | `ScheduleSection`          | 9090 | 1368   |
| 07  | Sponsors                            | `SponsorsSection`          | 10458| 2400   |
| 08  | Underground transition              | folded into `SponsorsSection` | —  | —      |
| 09  | Ocean transition                    | folded into `FaqFooterSection` | — | —     |
| 10  | FAQ + Footer                        | `FaqFooterSection` + `FAQAccordion` | 12858 | 1876 |

## Reusable components

- **`Navigation`** — sticky top bar, transparent over the hero, translucent blur on scroll. Links + Register CTA + mobile toggle.
- **`TrackCard`** — a single brown "Coming Soon" card with vine decorations. Reused 6× in the tracks grid.
- **`FAQAccordion`** — a single accessible toggle (`aria-expanded` / `aria-controls`, native `<button>`). Reused 10× across two FAQ columns.
- **`Asset` / `Star` / `Spark` / `Section`** (`primitives.tsx`) — generic decorative-asset wrappers that preserve the outer box and inner leaf dimensions separately so illustrations are never stretched. Used for every illustration/image layer treated as a visual asset.

## Design decisions

- **Illustrations are assets, not components.** Per the handoff, illustration/image layers are rendered via the `Asset` primitive using the exported Figma PNGs/SVGs. No decorative vector is recreated as a standalone React component.
- **Overlapping artwork preserved.** Sections use `overflow: visible` and absolute positioning matching the source frame, so clouds, vines, rocket, submarine, and ruins overlap across section boundaries as designed.
- **Responsive scaling.** The 1440px canvas scales down on narrower viewports via a CSS transform (composition stays intact rather than reflowing), and centers on wider screens.
- **Accessibility.** Semantic landmarks (`<header>`, `<nav>`, `<section>`, `<footer>`), a visually-hidden `<h1>`, heading hierarchy, focus-visible outlines, `prefers-reduced-motion` support, and ARIA on the accordion.

## Project structure

```
src/
  main.tsx
  App.tsx                      # assembles the canvas + responsive scaling
  data/
    assets.ts                  # central asset registry (local paths)
    content.ts                  # all copy from the Figma frame
  styles/
    global.css                  # design tokens + base styles
  components/
    primitives.tsx              # Asset, Star, Spark, Section helpers
    Navigation.tsx
    HeroSection.tsx            # 01 + 02
    AboutSection.tsx           # 03 + 04
    TracksSection.tsx          # 05
    TrackCard.tsx
    ScheduleSection.tsx        # 06
    SponsorsSection.tsx        # 07 + 08
    FaqFooterSection.tsx       # 09 + 10
    FAQAccordion.tsx
public/
  assets/                      # downloaded illustrations (69 files)
scripts/
  fetch-assets.mjs             # asset downloader
```

## Notes

- The NASA Space Apps local-event logo asset shipped from Figma as a template with editing instructions baked in; it is masked to a circular crop showing only the badge.
- Track cards and the schedule/sponsors panels show "Coming Soon" / "To be announced" placeholders, matching the source frame's state at handoff.

## Deploying to both Vercel and GitHub Pages

The build uses a **relative base** (`base: "./"` in `vite.config.ts`), so the **same `dist/` artifact works on any host** — Vercel serves it from `/`, GitHub Pages from `/REPO/`. No per-platform env vars or separate builds are needed.

Runtime asset paths in `src/data/assets.ts` are prefixed with `import.meta.env.BASE_URL` (the `withBase` helper), so `<img src>` URLs resolve correctly under both bases. Vite rewrites the `index.html` favicon/script/style URLs automatically.

### Vercel

1. Import the repo in Vercel (framework preset: **Vite**).
2. Build command: `npm run build` · Output directory: `dist` — these are the defaults; nothing to change.

### GitHub Pages

1. One-time: **Repo → Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
2. Push to `master` (or run the workflow manually from the Actions tab). `.github/workflows/deploy.yml` runs `npm run build` and publishes `dist/` to `https://ORG.github.io/REPO/`.

### Can't-use-Actions alternative (push to a `gh-pages` branch)

If you prefer deploying from a branch instead of Actions, build once locally with `npm run build` and publish the `dist/` folder to the `gh-pages` branch; then set Pages **Source: "Deploy from a branch" → `gh-pages`**.

### Notes

- `vite.config.ts` still honors `VITE_BASE` if you ever want a canonical absolute base (e.g. `VITE_BASE=/REPO/ npm run build`). Be aware that on Windows/Git Bash a leading-slash value can be mangled into a Windows path (`/Program Files/Git/...`), which is why the relative base is the default.
- The `og:image`, canonical URL, and `sitemap.xml` are hardcoded to the GitHub Pages URL (`https://bl3rred.github.io/NASA-Space-Apps-Temecula-Website/`). That is correct for Pages; on Vercel sharing previews will reference the Pages-hosted image, which still renders. Make these env-driven if you want per-platform SEO/OG URLs.
- `public/404.html` is a branded "Lost in space" 404 that shows a message and a home link, then redirects to the site root after a 5-second countdown (`location.replace`, so Back doesn't loop). It works at any path depth on GitHub Pages; on Vercel it falls back to the host root. Because the Vite base is relative, the repo path is hardcoded there — keep it in sync with the canonical URLs above if the repo is renamed.
