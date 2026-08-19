import { useEffect, useRef, useState } from "react";
import { activeSectionId, figmaScrollY, type SectionId } from "./scrollCoords";

export function useScrollSpy(layoutScale: number): SectionId {
  const [active, setActive] = useState<SectionId>("hero");
  const activeRef = useRef(active);

  useEffect(() => {
    let frame: number | null = null;

    const update = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const next = activeSectionId(figmaScrollY(window.scrollY, layoutScale));
        if (next === activeRef.current) return;
        activeRef.current = next;
        setActive(next);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [layoutScale]);

  return active;
}
