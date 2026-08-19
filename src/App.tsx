import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { DesktopStickyNav, MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH, VISIBLE_FRAME_HEIGHT } from "./layout/frame";
import { isMobileDevice, MOBILE_BREAKPOINT, useViewportMetrics } from "./layout/viewport";
import { useScrollSpy } from "./scroll/useScrollSpy";

type Orientation = "portrait" | "landscape";

function readOrientation(): Orientation {
  return window.matchMedia("(orientation: landscape)").matches ? "landscape" : "portrait";
}

export default function App() {
  const { layoutWidth, layoutScale } = useViewportMetrics();
  const isMobile = isMobileDevice() || layoutWidth < MOBILE_BREAKPOINT;
  const isLandscape =
    typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches;
  const useMobileDropdown = isMobile && !isLandscape;
  const activeSection = useScrollSpy(layoutScale);
  const [cssZoomSupported, setCssZoomSupported] = useState(true);
  const orientationAnchor = useRef<{
    scrollY: number;
    layoutScale: number;
    orientation: Orientation;
  } | null>(null);
  const layoutScaleRef = useRef(layoutScale);
  const stableOrientation = useRef<Orientation>(readOrientation());
  const lastScrollY = useRef(0);
  const clearOrientationAnchorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  layoutScaleRef.current = layoutScale;

  useLayoutEffect(() => {
    setCssZoomSupported(CSS.supports("zoom", "1"));
  }, []);

  useEffect(() => {
    const updateLastScrollY = () => {
      // Ignore the browser's automatic orientation scroll adjustment. The
      // cached value must remain the last position in the old orientation.
      if (readOrientation() !== stableOrientation.current) return;
      lastScrollY.current = window.scrollY;
    };

    updateLastScrollY();
    window.addEventListener("scroll", updateLastScrollY, { passive: true });
    return () => window.removeEventListener("scroll", updateLastScrollY);
  }, []);

  useEffect(() => {
    // Orientation is the only non-mobile resize path handled here. Keeping
    // this listener independent of user-agent detection also covers browsers
    // that expose a desktop-style mobile UA.
    const captureOrientationAnchor = () => {
      const orientation = readOrientation();
      const pendingAnchor = orientationAnchor.current;

      // Safari and Chrome can emit both orientation events for one rotation.
      // Keep the first pre-rotation scroll position until the new scale settles.
      if (pendingAnchor?.orientation === orientation && pendingAnchor.layoutScale !== layoutScaleRef.current) {
        return;
      }

      orientationAnchor.current = {
        scrollY: lastScrollY.current,
        layoutScale: layoutScaleRef.current,
        orientation,
      };

      if (clearOrientationAnchorTimer.current !== null) {
        clearTimeout(clearOrientationAnchorTimer.current);
      }
      clearOrientationAnchorTimer.current = setTimeout(() => {
        stableOrientation.current = orientation;
        orientationAnchor.current = null;
        clearOrientationAnchorTimer.current = null;
      }, 1500);
    };

    const orientationMediaQuery = window.matchMedia("(orientation: landscape)");
    window.addEventListener("orientationchange", captureOrientationAnchor, { passive: true });
    window.screen.orientation?.addEventListener("change", captureOrientationAnchor);
    orientationMediaQuery.addEventListener("change", captureOrientationAnchor);

    return () => {
      window.removeEventListener("orientationchange", captureOrientationAnchor);
      window.screen.orientation?.removeEventListener("change", captureOrientationAnchor);
      orientationMediaQuery.removeEventListener("change", captureOrientationAnchor);
      if (clearOrientationAnchorTimer.current !== null) {
        clearTimeout(clearOrientationAnchorTimer.current);
        clearOrientationAnchorTimer.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    const anchor = orientationAnchor.current;
    if (!anchor) return;

    stableOrientation.current = anchor.orientation;
    if (anchor.layoutScale === layoutScale) return;

    const targetY = Math.max(0, anchor.scrollY * (layoutScale / anchor.layoutScale));
    window.scrollTo({ top: targetY, behavior: "auto" });

    // Apply once more after the browser commits its orientation layout. This
    // handles Safari/Chrome correcting scroll bounds one frame after React.
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [layoutScale]);

  return (
    <>
      <DesktopStickyNav
        visible={!isMobile || isLandscape}
        activeSection={activeSection}
        layoutScale={layoutScale}
      />
      <MobileNav visible={useMobileDropdown} activeSection={activeSection} layoutScale={layoutScale} />
      <div
        className="scale-frame"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
          background: "#07173f",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: VISIBLE_FRAME_HEIGHT * layoutScale,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            className={cssZoomSupported ? "canvas-layout-scale" : "canvas-transform-scale"}
            style={{
              "--canvas-scale": layoutScale,
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
            } as CSSProperties}
          >
            <PageCanvas />
          </div>
        </div>
      </div>
    </>
  );
}
