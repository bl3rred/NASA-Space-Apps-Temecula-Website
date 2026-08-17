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

export const SLICES = [
  { src: slices.heroAbout, top: 0, height: 4007 },
  { src: slices.tracksSchedule, top: 4007, height: 5487 },
  { src: slices.sponsorsUnderground, top: 9494, height: 3364 },
  { src: slices.oceanFaqFooter, top: 12858, height: 1765 },
] as const;

export function localY(sectionTop: number, globalY: number): number {
  return globalY - sectionTop;
}
