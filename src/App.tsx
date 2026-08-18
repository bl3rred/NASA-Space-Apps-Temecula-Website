import { MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./layout/frame";
import { MOBILE_BREAKPOINT, useViewportMetrics } from "./layout/viewport";
import { useScrollSpy } from "./scroll/useScrollSpy";

export default function App() {
  const { layoutWidth, layoutScale } = useViewportMetrics();
  const isMobile = layoutWidth < MOBILE_BREAKPOINT;
  const activeSection = useScrollSpy(layoutScale);

  return (
    <>
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
            height: FRAME_HEIGHT * layoutScale,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              transform: `scale(${layoutScale})`,
              transformOrigin: "top left",
            }}
          >
            <PageCanvas isMobile={isMobile} activeSection={activeSection} layoutScale={layoutScale} />
          </div>
        </div>
      </div>
    </>
  );
}
