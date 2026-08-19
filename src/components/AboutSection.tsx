import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

const TOP = SECTION_TOP.about;

/** About landmark — painted slice is visual truth; no HTML slabs over glyphs. */
export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        position: "absolute",
        top: TOP,
        left: 0,
        width: FRAME_WIDTH,
        height: SECTION_TOP.tracks - TOP,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-label="About NASA Space Apps"
    >
      <h2 className="sr-only">About NASA Space Apps</h2>
    </section>
  );
}
