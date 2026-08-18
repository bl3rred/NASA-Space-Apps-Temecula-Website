import { useEffect, useState } from "react";
import { activeSectionId, figmaScrollY, type SectionId } from "./scrollCoords";

export function useScrollSpy(layoutScale: number): SectionId {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const update = () => {
      setActive(activeSectionId(figmaScrollY(window.scrollY, layoutScale)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.visualViewport?.addEventListener("scroll", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [layoutScale]);

  return active;
}
