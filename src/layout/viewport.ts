import { useEffect, useState } from "react";
import { FRAME_WIDTH } from "./frame";

export const MOBILE_BREAKPOINT = 768;

export type ViewportMetrics = {
  layoutWidth: number;
  layoutScale: number;
};

function readMetrics(): ViewportMetrics {
  if (typeof window === "undefined") {
    return { layoutWidth: FRAME_WIDTH, layoutScale: 1 };
  }

  const layoutWidth = window.innerWidth;
  const layoutScale = layoutWidth / FRAME_WIDTH;

  return { layoutWidth, layoutScale };
}

export function useViewportMetrics(): ViewportMetrics {
  const [metrics, setMetrics] = useState(() => readMetrics());

  useEffect(() => {
    const update = () => setMetrics(readMetrics());

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return metrics;
}
