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

  // iOS Safari can report the pre-rotation innerWidth during an orientation
  // change and sometimes never fires `resize` afterward, leaving navy bars
  // down the sides in landscape. visualViewport.width always reflects the
  // actual visible width (rotation, dynamic toolbar, pinch zoom), so prefer
  // it whenever it differs from innerWidth. Width-only: we never touch
  // height/offset, so address-bar collapse can't make the canvas counter-pan.
  const vv = window.visualViewport;
  const inner = window.innerWidth;
  const layoutWidth =
    vv && vv.width > 0 && Math.abs(vv.width - inner) > 0.5 ? vv.width : inner;
  const layoutScale = layoutWidth / FRAME_WIDTH;

  return { layoutWidth, layoutScale };
}

export function useViewportMetrics(): ViewportMetrics {
  const [metrics, setMetrics] = useState(() => readMetrics());

  useEffect(() => {
    const timers: number[] = [];

    // Return the previous object when nothing changed so React skips re-render
    // (e.g. visualViewport fires on address-bar collapse where width is stable).
    const update = () => {
      setMetrics((prev) => {
        const next = readMetrics();
        return prev.layoutWidth === next.layoutWidth &&
          prev.layoutScale === next.layoutScale
          ? prev
          : next;
      });
    };

    const onOrientationChange = () => {
      // innerWidth is stale synchronously during `orientationchange`; re-measure
      // after the rotation settles (some browsers never fire `resize`).
      timers.push(window.setTimeout(update, 250));
      timers.push(window.setTimeout(update, 600));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", onOrientationChange);

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", onOrientationChange);
      if (vv) {
        vv.removeEventListener("resize", update);
      }
    };
  }, []);

  return metrics;
}
