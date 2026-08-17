import { about } from "../data/content";
import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

/** About overlay — landmark + screen-reader copy (art lives in the slice). */
export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        position: "absolute",
        top: SECTION_TOP.about,
        left: 0,
        width: FRAME_WIDTH,
        height: SECTION_TOP.tracks - SECTION_TOP.about,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-label="About NASA Space Apps"
    >
      <h2 className="sr-only">{about.heading}</h2>
      <p className="sr-only">{about.introHeading}</p>
      {about.introBody.map((p) => (
        <p key={p} className="sr-only">
          {p}
        </p>
      ))}
      {about.localBody.map((p) => (
        <p key={p} className="sr-only">
          {p}
        </p>
      ))}
      <p className="sr-only">{about.impactHeading}</p>
      {about.impactStats.map((s) => (
        <p key={s} className="sr-only">
          {s}
        </p>
      ))}
    </section>
  );
}
