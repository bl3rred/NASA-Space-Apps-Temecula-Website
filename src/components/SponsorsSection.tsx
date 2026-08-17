import { sponsors } from "../data/content";
import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

/** Sponsors overlay — landmark only; illustration is in the slice. */
export function SponsorsSection() {
  return (
    <section
      id="sponsors"
      style={{
        position: "absolute",
        top: SECTION_TOP.sponsors,
        left: 0,
        width: FRAME_WIDTH,
        height: SECTION_TOP.faq - SECTION_TOP.sponsors,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-label="Sponsors"
    >
      <h2 className="sr-only">{sponsors.heading}</h2>
      <p className="sr-only">{sponsors.body}</p>
    </section>
  );
}
