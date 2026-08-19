// Composite Figma slices — visual source of truth for the 1440 desktop canvas.
// Bump SLICE_CACHE when restoring PNGs so browsers drop cached patched versions.
const SLICE_CACHE = "v8-cockpit-goggles";

export const slices = {
  heroAbout: `/assets/slices/01-hero-about.png?${SLICE_CACHE}`,
  tracksSchedule: `/assets/slices/02-tracks-schedule.png?${SLICE_CACHE}`,
  sponsorsUnderground: `/assets/slices/03-sponsors-underground.png?${SLICE_CACHE}`,
  oceanFaqFooter: `/assets/slices/04-ocean-faq-footer.png?${SLICE_CACHE}`,
} as const;

export const hero = {
  bannerPlane: `/assets/hero/bannerPlane.png?${SLICE_CACHE}`,
  foreground: `/assets/hero/heroForeground.png?${SLICE_CACHE}`,
} as const;

export const particles = {
  dandelion: `/assets/particles/dandelion.png?${SLICE_CACHE}`,
} as const;
