import { FRAME_HEIGHT, HERO_TOP_CROP, SECTION_TOP } from "../layout/frame";

export type SectionId = keyof typeof SECTION_TOP;

/** Branch + cat at top of a 1440×~900 viewport, then ABOUT sign and body copy. */
const ABOUT_NAV_Y = 3220;
const ABOUT_NAV_BASE_VH = 900;

export function figmaScrollY(pageScrollY: number, layoutScale: number): number {
  return pageScrollY / layoutScale + HERO_TOP_CROP;
}

export function viewportFigmaHeight(layoutScale: number): number {
  if (typeof window === "undefined") return ABOUT_NAV_BASE_VH;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  return vh / layoutScale;
}

export function sectionScrollTop(figmaY: number, layoutScale: number): number {
  return Math.max(0, (figmaY - HERO_TOP_CROP) * layoutScale);
}

export const SECTION_IDS: SectionId[] = [
  "hero",
  "about",
  "tracks",
  "schedule",
  "sponsors",
  "faq",
];

/** About nav: match attached framing; pull back slightly on tall mobile viewports. */
export function aboutNavScrollFigmaY(layoutScale: number): number {
  const vh = viewportFigmaHeight(layoutScale);
  return ABOUT_NAV_Y - Math.max(0, (vh - ABOUT_NAV_BASE_VH) * 0.12);
}

/** Visual anchor Y for nav clicks (may differ from SECTION_TOP for scroll spy). */
export function navScrollFigmaY(sectionId: SectionId, layoutScale = 1): number {
  if (sectionId === "hero") return HERO_TOP_CROP;
  if (sectionId === "about") return aboutNavScrollFigmaY(layoutScale);
  return SECTION_TOP[sectionId];
}

export function activeSectionId(figmaY: number): SectionId {
  let current: SectionId = "hero";
  for (const id of SECTION_IDS) {
    if (figmaY >= SECTION_TOP[id] - 120) {
      current = id;
    }
  }
  return current;
}

export { FRAME_HEIGHT, HERO_TOP_CROP };
