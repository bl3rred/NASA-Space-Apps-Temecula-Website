import { schedule, tracks } from "../data/content";
import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

/** Tracks + schedule overlays — landmarks only; illustration is in the slice. */
export function TracksSection() {
  return (
    <>
      <section
        id="tracks"
        style={{
          position: "absolute",
          top: SECTION_TOP.tracks,
          left: 0,
          width: FRAME_WIDTH,
          height: SECTION_TOP.schedule - SECTION_TOP.tracks,
          zIndex: 1,
          pointerEvents: "none",
        }}
        aria-label="Tracks"
      >
        <h2 className="sr-only">{tracks.heading}</h2>
        <ul className="sr-only">
          {tracks.cards.map((card, i) => (
            <li key={i}>{card.title}</li>
          ))}
        </ul>
      </section>
      <section
        id="schedule"
        style={{
          position: "absolute",
          top: SECTION_TOP.schedule,
          left: 0,
          width: FRAME_WIDTH,
          height: SECTION_TOP.sponsors - SECTION_TOP.schedule,
          zIndex: 1,
          pointerEvents: "none",
        }}
        aria-label="Schedule"
      >
        <h2 className="sr-only">{schedule.heading}</h2>
        <p className="sr-only">{schedule.body}</p>
      </section>
    </>
  );
}
