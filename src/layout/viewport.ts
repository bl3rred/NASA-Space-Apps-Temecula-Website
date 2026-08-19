import { useEffect, useState } from "react";
import { FRAME_WIDTH } from "./frame";

export const MOBILE_BREAKPOINT = 768;

export type ViewportMetrics = {
  layoutWidth: number;
  layoutScale: number;
};

const MOBILE_USER_AGENT = /Mobi|Android|iPhone|iPad|iPod/i;

/** True for phones/tablets; narrow desktop windows still use the breakpoint fallback. */
export function isMobileDevice(): boolean {
  return typeof navigator !== "undefined" && MOBILE_USER_AGENT.test(navigator.userAgent);
}

/**
 * Use the layout viewport, not the visual viewport. Browser pinch zoom changes
 * the visual viewport but leaves this value stable, so zoom cannot rebuild the
 * React canvas. Orientation updates are sampled after the browser settles.
 */
function readMetrics(): ViewportMetrics {
  if (typeof window === "undefined") {
    return { layoutWidth: FRAME_WIDTH, layoutScale: 1 };
  }

  const layoutWidth = window.innerWidth || document.documentElement?.clientWidth || FRAME_WIDTH;
  return { layoutWidth, layoutScale: layoutWidth / FRAME_WIDTH };
}

export function useViewportMetrics(): ViewportMetrics {
  const [metrics, setMetrics] = useState(() => readMetrics());

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];

    const update = () => {
      setMetrics((previous) => {
        const next = readMetrics();
        return previous.layoutWidth === next.layoutWidth ? previous : next;
      });
    };

    const onMobileOrientationChange = () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers = [250, 650].map((delay) => setTimeout(update, delay));
    };

    if (isMobileDevice()) {
      // Do not subscribe to mobile resize: pinch zoom can emit resize-like
      // signals in some browsers. Only real orientation changes resize layout.
      window.addEventListener("orientationchange", onMobileOrientationChange);
      window.screen.orientation?.addEventListener("change", onMobileOrientationChange);
    } else {
      window.addEventListener("resize", update);
      window.addEventListener("orientationchange", update);
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      window.removeEventListener("orientationchange", onMobileOrientationChange);
      window.screen.orientation?.removeEventListener("change", onMobileOrientationChange);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return metrics;
}
