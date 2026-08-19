import { useLayoutEffect, useState, type CSSProperties } from "react";
import { DesktopStickyNav, MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH, VISIBLE_FRAME_HEIGHT } from "./layout/frame";
import { isMobileDevice, MOBILE_BREAKPOINT, useViewportMetrics } from "./layout/viewport";
import { useScrollSpy } from "./scroll/useScrollSpy";

export default function App() {
  const { layoutWidth, layoutScale } = useViewportMetrics();
  const isMobile = isMobileDevice() || layoutWidth < MOBILE_BREAKPOINT;
  const isLandscape =
    typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches;
  const useMobileDropdown = isMobile && !isLandscape;
  const activeSection = useScrollSpy(layoutScale);
  const [cssZoomSupported, setCssZoomSupported] = useState(true);

  useLayoutEffect(() => {
    setCssZoomSupported(CSS.supports("zoom", "1"));
  }, []);

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
