// Composite Figma slices — visual source of truth for the 1440 desktop canvas.
// Bump SLICE_CACHE when restoring PNGs so browsers drop cached patched versions.
const SLICE_CACHE = "v12-native-zoom";

// Vite rewrites URLs in index.html and CSS at build time, but NOT runtime
// <img src> paths. Prefix with import.meta.env.BASE_URL so assets resolve
// under any deploy base: "/" on Vercel, "/REPO/" on GitHub Pages, "./" for
// the single relative build both platforms share.
const withBase = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const slices = {
  heroAbout: withBase(`/assets/slices/01-hero-about.png?${SLICE_CACHE}`),
  tracksSchedule: withBase(`/assets/slices/02-tracks-schedule.png?${SLICE_CACHE}`),
  sponsorsUnderground: withBase(`/assets/slices/03-sponsors-underground.png?${SLICE_CACHE}`),
  oceanFaqFooter: withBase(`/assets/slices/04-ocean-faq-footer.png?${SLICE_CACHE}`),
} as const;


export const hero = {
  bannerPlane: withBase(`/assets/hero/bannerPlane.png?${SLICE_CACHE}`),
  foreground: withBase(`/assets/hero/heroForeground.png?${SLICE_CACHE}`),
} as const;

export const particles = {
  dandelion: withBase(`/assets/particles/dandelion.png?${SLICE_CACHE}`),
} as const;
