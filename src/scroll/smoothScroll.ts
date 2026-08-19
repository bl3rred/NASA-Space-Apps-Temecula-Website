import type { MouseEvent } from "react";
import { SECTION_TOP } from "../layout/frame";
import { navScrollFigmaY, sectionScrollTop, type SectionId } from "./scrollCoords";

let scrollAnimationFrame: number | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeInOutCubic(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function animateScrollTo(targetY: number): void {
  if (scrollAnimationFrame !== null) {
    window.cancelAnimationFrame(scrollAnimationFrame);
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) {
    window.scrollTo({ top: targetY, behavior: "auto" });
    return;
  }

  // Give mobile the same deliberate, readable travel as the desktop version;
  // the longer duration prevents large scaled jumps from looking stuttery.
  const duration = Math.min(1400, Math.max(850, Math.abs(distance) * 0.3));
  const startedAt = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo({
      top: startY + distance * easeInOutCubic(progress),
      behavior: "auto",
    });

    if (progress < 1) {
      scrollAnimationFrame = window.requestAnimationFrame(step);
    } else {
      scrollAnimationFrame = null;
    }
  };

  scrollAnimationFrame = window.requestAnimationFrame(step);
}

export function smoothScrollToSection(sectionId: SectionId, layoutScale: number): void {
  const targetY = sectionScrollTop(navScrollFigmaY(sectionId, layoutScale), layoutScale);

  if (prefersReducedMotion()) {
    window.scrollTo({ top: targetY, behavior: "auto" });
  } else {
    animateScrollTo(targetY);
  }
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
