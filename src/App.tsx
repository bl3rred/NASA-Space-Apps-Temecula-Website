import { MobileNav } from "./components/Navigation";
import { PageCanvas } from "./components/PageCanvas";
import { FRAME_HEIGHT, FRAME_WIDTH } from "./layout/frame";
import { MOBILE_BREAKPOINT, useViewportWidth } from "./layout/viewport";

export default function App() {
  const width = useViewportWidth();
  const scale = width / FRAME_WIDTH;
  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <>
      <MobileNav visible={isMobile} />
      <div
        className="scale-frame"
        style={{
          position: "relative",
          width: "100%",
          height: FRAME_HEIGHT * scale,
          overflow: "hidden",
          background: "#07173f",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <PageCanvas isMobile={isMobile} />
        </div>
      </div>
    </>
  );
}
