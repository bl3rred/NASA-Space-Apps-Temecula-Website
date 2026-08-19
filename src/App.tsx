import { DesktopStickyNav, MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH, HERO_TOP_CROP, VISIBLE_FRAME_HEIGHT } from "./layout/frame";
import { MOBILE_BREAKPOINT, useViewportMetrics } from "./layout/viewport";
import { useScrollSpy } from "./scroll/useScrollSpy";

export default function App() {
  const { layoutWidth, layoutScale } = useViewportMetrics();
  const isMobile = layoutWidth < MOBILE_BREAKPOINT;
  const activeSection = useScrollSpy(layoutScale);

  return (
    <>
      <DesktopStickyNav visible={!isMobile} activeSection={activeSection} layoutScale={layoutScale} />
      <MobileNav visible={isMobile} activeSection={activeSection} layoutScale={layoutScale} />
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
            width: layoutWidth,
            height: VISIBLE_FRAME_HEIGHT * layoutScale,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              transform: `scale(${layoutScale}) translateY(-${HERO_TOP_CROP}px)`,
              transformOrigin: "top left",
            }}
          >
            <PageCanvas />
          </div>
        </div>
      </div>
    </>
  );
}
