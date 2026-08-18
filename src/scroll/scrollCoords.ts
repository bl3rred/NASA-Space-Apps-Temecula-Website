import { SECTION_TOP } from "../layout/frame";

export type SectionId = keyof typeof SECTION_TOP;

export function figmaScrollY(pageScrollY: number, layoutScale: number): number {
  return pageScrollY / layoutScale;
}

export function sectionScrollTop(figmaY: number, layoutScale: number): number {
  return figmaY * layoutScale;
}

export const SECTION_IDS: SectionId[] = [
  "hero",
  "about",
  "tracks",
  "schedule",
  "sponsors",
  "faq",
];

export function activeSectionId(figmaY: number): SectionId {
  let current: SectionId = "hero";
  for (const id of SECTION_IDS) {
    if (figmaY >= SECTION_TOP[id] - 120) {
      current = id;
    }
  }
  return current;
}
