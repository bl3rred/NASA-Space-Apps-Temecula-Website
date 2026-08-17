import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { TracksSection } from "./TracksSection";
import { SponsorsSection } from "./SponsorsSection";
import { FaqFooterSection } from "./FaqFooterSection";
import { CanvasNavHits } from "./Navigation";
import { FRAME_HEIGHT, FRAME_WIDTH, SLICES } from "../layout/frame";

type PageCanvasProps = {
  isMobile: boolean;
};

/** Fixed 1440 Figma canvas — slices plus overlay hit targets. */
export function PageCanvas({ isMobile }: PageCanvasProps) {
  return (
    <main
      className="page"
      style={{
        position: "relative",
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        overflow: "hidden",
        background: "#07173f",
        flexShrink: 0,
      }}
    >
      {SLICES.map((slice) => (
        <img
          key={slice.src}
          className="page-slice"
          src={slice.src}
          alt=""
          width={FRAME_WIDTH}
          height={slice.height}
          style={{
            position: "absolute",
            top: slice.top,
            left: 0,
            width: FRAME_WIDTH,
            height: slice.height,
            maxWidth: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
      {isMobile ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 800,
            width: FRAME_WIDTH - 800,
            height: 88,
            background: "#07173f",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ) : (
        <CanvasNavHits />
      )}
      <HeroSection />
      <AboutSection />
      <TracksSection />
      <SponsorsSection />
      <FaqFooterSection />
    </main>
  );
}
