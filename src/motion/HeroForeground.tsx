import { hero } from "../data/assets";
import { FRAME_WIDTH } from "../layout/frame";

const FG_TOP = 600;
const FG_HEIGHT = 450;

/** Panel + wire arcs — meteors render beneath this overlay. */
export function HeroForeground() {
  return (
    <img
      aria-hidden
      className="hero-foreground"
      src={hero.foreground}
      alt=""
      width={FRAME_WIDTH}
      height={FG_HEIGHT}
      style={{
        position: "absolute",
        left: 0,
        top: FG_TOP,
        width: FRAME_WIDTH,
        height: FG_HEIGHT,
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
}
