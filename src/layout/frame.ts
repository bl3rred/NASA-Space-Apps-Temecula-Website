import { slices } from "../data/assets";

/** Figma frame `4003:2` — desktop canvas (global Y). */
export const FRAME_WIDTH = 1440;
export const FRAME_HEIGHT = 14623;

/** Top of composition clipped off — stars hidden at scroll 0 without landing scroll. */
export const HERO_TOP_CROP = 150;
export const VISIBLE_FRAME_HEIGHT = FRAME_HEIGHT - HERO_TOP_CROP;

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
/** Extra tuck at the underground → ocean join (shark hairline). */
export const OCEAN_SEAM_OVERLAP = 2;

const SLICE_JOINS = [0, 4007, 9494, 12858] as const;

export const SLICES = [
  { src: slices.heroAbout, top: SLICE_JOINS[0], height: 4007, zIndex: 0 },
  {
    src: slices.tracksSchedule,
    top: SLICE_JOINS[1] - SLICE_SEAM_OVERLAP,
    height: 5487,
    zIndex: 0,
  },
  {
    // slice03 has one extra row prepended (copy of the tracks slice's last row)
    // so this join gets a true 1px overlap like joins at 4007 and 12858.
    src: slices.sponsorsUnderground,
    top: SLICE_JOINS[2] - SLICE_SEAM_OVERLAP - 1,
    height: 3365,
    zIndex: 1,
  },
  {
    src: slices.oceanFaqFooter,
    top: SLICE_JOINS[3] - OCEAN_SEAM_OVERLAP,
    height: 1765,
    zIndex: 0,
  },
] as const;

export function localY(sectionTop: number, globalY: number): number {
  return globalY - sectionTop;
}
