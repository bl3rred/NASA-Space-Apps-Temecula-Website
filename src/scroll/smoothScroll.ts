import type { MouseEvent } from "react";
import { SECTION_TOP } from "../layout/frame";
import { navScrollFigmaY, sectionScrollTop, type SectionId } from "./scrollCoords";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function smoothScrollToSection(sectionId: SectionId, layoutScale: number): void {
  const targetY = sectionScrollTop(navScrollFigmaY(sectionId, layoutScale), layoutScale);
  window.scrollTo({
    top: targetY,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export function handleNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  layoutScale: number,
): void {
  if (!href.startsWith("#") || href.length < 2) return;

  const raw = href.slice(1);
  const sectionId = (raw === "top" ? "hero" : raw) as SectionId;
  if (!(sectionId in SECTION_TOP)) return;

  event.preventDefault();
  smoothScrollToSection(sectionId, layoutScale);
  history.replaceState(null, "", href);
}
