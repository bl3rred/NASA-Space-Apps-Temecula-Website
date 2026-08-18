import { faq, footer } from "../data/content";
import { FAQAccordion } from "./FAQAccordion";
import { FRAME_HEIGHT, FRAME_WIDTH, SECTION_TOP, localY } from "../layout/frame";

const TOP = SECTION_TOP.faq;
const FAQ_GRID_LEFT = 180;
const FAQ_GRID_TOP = localY(TOP, 13176);
const FAQ_BAR_WIDTH = 528;
const FAQ_BAR_HEIGHT = 72;
const FAQ_COLUMN_GAP = 24;
const FAQ_ROW_GAP = 18;

const FAQ_LEFT_COUNT = faq.leftColumn.length;
const FAQ_RIGHT_COUNT = faq.rightColumn.length;
const FAQ_ROW_COUNT = Math.max(FAQ_LEFT_COUNT, FAQ_RIGHT_COUNT);

function faqBarTop(rowIndex: number): number {
  return FAQ_GRID_TOP + rowIndex * (FAQ_BAR_HEIGHT + FAQ_ROW_GAP);
}

/** Opaque covers hiding baked FAQ bars in slice 04 so only HTML accordion shows. */
function FaqBarCovers() {
  const covers: Array<{ key: string; left: number; top: number }> = [];

  for (let row = 0; row < FAQ_ROW_COUNT; row += 1) {
    if (row < FAQ_LEFT_COUNT) {
      covers.push({
        key: `left-${row}`,
        left: FAQ_GRID_LEFT,
        top: faqBarTop(row),
      });
    }
    if (row < FAQ_RIGHT_COUNT) {
      covers.push({
        key: `right-${row}`,
        left: FAQ_GRID_LEFT + FAQ_BAR_WIDTH + FAQ_COLUMN_GAP,
        top: faqBarTop(row),
      });
    }
  }

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {covers.map((cover) => (
        <div
          key={cover.key}
          style={{
            position: "absolute",
            left: cover.left,
            top: cover.top,
            width: FAQ_BAR_WIDTH,
            height: FAQ_BAR_HEIGHT,
            background: "#07173f",
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}

/** FAQ overlay — live accordion covering the slice bars. Footer credit is HTML for contrast. */
export function FaqFooterSection() {
  return (
    <section
      id="faq"
      style={{
        position: "absolute",
        top: TOP,
        left: 0,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT - TOP,
        zIndex: 2,
        pointerEvents: "none",
      }}
      aria-label="Frequently asked questions"
    >
      <h2 className="sr-only">{faq.heading}</h2>
      <FaqBarCovers />
      <div
        className="faq-grid"
        style={{
          position: "absolute",
          left: FAQ_GRID_LEFT,
          top: FAQ_GRID_TOP,
          display: "flex",
          gap: FAQ_COLUMN_GAP,
          alignItems: "flex-start",
          pointerEvents: "auto",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: FAQ_ROW_GAP }}>
          {faq.leftColumn.map((item) => (
            <FAQAccordion key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: FAQ_ROW_GAP }}>
          {faq.rightColumn.map((item) => (
            <FAQAccordion key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 50,
          lineHeight: 1.1,
          color: "#ffffff",
          textAlign: "center",
          background: "transparent",
          pointerEvents: "none",
        }}
      >
        {footer.credit}
      </p>
    </section>
  );
}
