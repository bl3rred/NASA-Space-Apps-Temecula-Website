import { useEffect, useState } from "react";
import { FRAME_WIDTH } from "./frame";

export const MOBILE_BREAKPOINT = 768;

export function useViewportWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? FRAME_WIDTH : window.innerWidth,
  );

  useEffect(() => {
    const update = () => {
      setWidth(Math.round(window.visualViewport?.width ?? window.innerWidth));
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return width;
}
