import { nav } from "../data/content";
import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";
import { HeroForeground } from "../motion/HeroForeground";
import { PlaneWind } from "../motion/PlaneWind";

/** Hero overlay — PRE-REGISTER hit target over the illustrated instrument panel. */
export function HeroSection() {
  return (
    <section
      id="top"
      style={{
        position: "absolute",
        top: SECTION_TOP.hero,
        left: 0,
        width: FRAME_WIDTH,
        height: SECTION_TOP.about,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-label="Hero"
    >
      <h1 className="sr-only">NASA Space Apps Challenge — Temecula</h1>
      <PlaneWind />
      <HeroForeground />
      <a
        className="cta-hit"
        href={nav.register.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pre-register now"
        style={{
          position: "absolute",
          left: 555,
          top: 781,
          width: 246,
          height: 78,
          zIndex: 4,
          pointerEvents: "auto",
        }}
      />
    </section>
  );
}
