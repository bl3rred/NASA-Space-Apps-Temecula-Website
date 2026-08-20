import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { DesktopStickyNav, MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH, VISIBLE_FRAME_HEIGHT } from "./layout/frame";
import { isMobileDevice, MOBILE_BREAKPOINT, useViewportMetrics } from "./layout/viewport";
import { figmaScrollY, sectionScrollTop } from "./scroll/scrollCoords";
import { useScrollSpy } from "./scroll/useScrollSpy";

type Orientation = "portrait" | "landscape";

// Keep the same artwork point near the upper-middle of the next orientation.
// This makes the short landscape viewport feel like a focused slice of the
// taller portrait viewport instead of always aligning at opposite top edges.
const ORIENTATION_ANCHOR_RATIO = 0.4;

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
  const orientationAnchor = useRef<{ figmaY: number; orientation: Orientation } | null>(null);
  const layoutScaleRef = useRef(layoutScale);
  const logicalFigmaY = useRef(
    figmaScrollY(typeof window !== "undefined" ? window.scrollY : 0, layoutScale),
  );
  const viewportHeightRef = useRef(
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const orientationTransition = useRef(false);
  const userInputDuringOrientation = useRef(false);
  const programmaticTargetY = useRef<number | null>(null);
  const clearOrientationAnchorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  layoutScaleRef.current = layoutScale;

  useLayoutEffect(() => {
    setCssZoomSupported(CSS.supports("zoom", "1"));
  }, []);

  useEffect(() => {
    const updateLogicalPosition = () => {
      // Ignore the browser's automatic orientation scroll adjustment. If the
      // user actually starts interacting, hand control back immediately.
      if (orientationTransition.current) {
        if (!userInputDuringOrientation.current) return;
        orientationTransition.current = false;
        orientationAnchor.current = null;
        programmaticTargetY.current = null;
      }

      const targetY = programmaticTargetY.current;
      if (targetY !== null) {
        if (Math.abs(window.scrollY - targetY) <= 2) {
          programmaticTargetY.current = null;
          return;
        }
        programmaticTargetY.current = null;
      }

      logicalFigmaY.current = figmaScrollY(window.scrollY, layoutScaleRef.current);
    };

    updateLogicalPosition();
    window.addEventListener("scroll", updateLogicalPosition, { passive: true });
    return () => window.removeEventListener("scroll", updateLogicalPosition);
  }, []);

  useEffect(() => {
    const markUserInput = () => {
      if (orientationTransition.current) userInputDuringOrientation.current = true;
    };

    window.addEventListener("touchstart", markUserInput, { passive: true });
    window.addEventListener("pointerdown", markUserInput, { passive: true });
    window.addEventListener("wheel", markUserInput, { passive: true });
    return () => {
      window.removeEventListener("touchstart", markUserInput);
      window.removeEventListener("pointerdown", markUserInput);
      window.removeEventListener("wheel", markUserInput);
    };
  }, []);

  useEffect(() => {
    // Orientation is the only non-mobile resize path handled here. Keeping
    // this listener independent of user-agent detection also covers browsers
    // that expose a desktop-style mobile UA.
    let observedOrientation = readOrientation();

    const captureOrientationAnchor = () => {
      const orientation = readOrientation();
      observedOrientation = orientation;
      const pendingAnchor = orientationAnchor.current;

      // Safari and Chrome can emit several orientation events for one
      // rotation. Keep the first logical artwork position until it settles.
      if (pendingAnchor?.orientation === orientation) return;

      orientationTransition.current = true;
      userInputDuringOrientation.current = false;
      programmaticTargetY.current = null;
      orientationAnchor.current = {
        figmaY:
          logicalFigmaY.current +
          (viewportHeightRef.current / layoutScaleRef.current) * ORIENTATION_ANCHOR_RATIO,
        orientation,
      };

      if (clearOrientationAnchorTimer.current !== null) {
        clearTimeout(clearOrientationAnchorTimer.current);
      }
      clearOrientationAnchorTimer.current = setTimeout(() => {
        const settledAnchor = orientationAnchor.current;
        if (settledAnchor && !userInputDuringOrientation.current) {
          const viewportFigmaHeight = window.innerHeight / layoutScaleRef.current;
          const targetTopFigmaY =
            settledAnchor.figmaY - viewportFigmaHeight * ORIENTATION_ANCHOR_RATIO;
          const targetY = sectionScrollTop(targetTopFigmaY, layoutScaleRef.current);
          logicalFigmaY.current = targetTopFigmaY;
          programmaticTargetY.current = targetY;
          window.scrollTo({ top: targetY, behavior: "auto" });
        }

        viewportHeightRef.current = window.innerHeight;
        orientationAnchor.current = null;
        clearOrientationAnchorTimer.current = null;

        // Keep ignoring late compositor scroll corrections for two frames;
        // otherwise Safari can write one final rounded offset into the logical
        // anchor and the next rotation starts slightly higher.
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            orientationTransition.current = false;
          });
        });
      }, 1500);
    };

    const captureOrientationFromResize = () => {
      const orientation = readOrientation();
      if (orientation === observedOrientation) return;
      captureOrientationAnchor();
    };

    const orientationMediaQuery = window.matchMedia("(orientation: landscape)");
    window.addEventListener("orientationchange", captureOrientationAnchor, { passive: true });
    window.screen.orientation?.addEventListener("change", captureOrientationAnchor);
    window.addEventListener("resize", captureOrientationFromResize);
    orientationMediaQuery.addEventListener("change", captureOrientationAnchor);

    return () => {
      window.removeEventListener("orientationchange", captureOrientationAnchor);
      window.screen.orientation?.removeEventListener("change", captureOrientationAnchor);
      window.removeEventListener("resize", captureOrientationFromResize);
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

    const viewportFigmaHeight = window.innerHeight / layoutScale;
    const targetTopFigmaY =
      anchor.figmaY - viewportFigmaHeight * ORIENTATION_ANCHOR_RATIO;
    const targetY = sectionScrollTop(targetTopFigmaY, layoutScale);
    logicalFigmaY.current = targetTopFigmaY;
    viewportHeightRef.current = window.innerHeight;
    programmaticTargetY.current = targetY;
    window.scrollTo({ top: targetY, behavior: "auto" });

    // Apply once more after the browser commits its orientation layout. The
    // logical Figma coordinate stays fixed, so repeated rotations do not
    // accumulate rounding from the previous orientation's scrollTop.
    const frame = window.requestAnimationFrame(() => {
      programmaticTargetY.current = targetY;
      window.scrollTo({ top: targetY, behavior: "auto" });
      viewportHeightRef.current = window.innerHeight;
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
