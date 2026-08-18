import { slices } from "../data/assets";

/** Figma frame `4003:2` — desktop canvas (global Y). */
export const FRAME_WIDTH = 1440;
export const FRAME_HEIGHT = 14623;

export const SECTION_TOP = {
  hero: 0,
  about: 2247,
  tracks: 5851,
  schedule: 7791,
  sponsors: 9494,
  faq: 12858,
} as const;

/** Overlap at PNG joins to hide subpixel hairlines during scale. */
export const SLICE_SEAM_OVERLAP = 1;

const SLICE_JOINS = [0, 4007, 9494, 12858] as const;

export const SLICES = [
  { src: slices.heroAbout, top: SLICE_JOINS[0], height: 4007 },
  {
    src: slices.tracksSchedule,
    top: SLICE_JOINS[1] - SLICE_SEAM_OVERLAP,
    height: 5487,
  },
  {
    src: slices.sponsorsUnderground,
    top: SLICE_JOINS[2] - SLICE_SEAM_OVERLAP,
    height: 3364,
  },
  {
    src: slices.oceanFaqFooter,
    top: SLICE_JOINS[3] - SLICE_SEAM_OVERLAP,
    height: 1765,
  },
] as const;

export function localY(sectionTop: number, globalY: number): number {
  return globalY - sectionTop;
}
