import { faq, footer } from "../data/content";
import { FAQAccordion } from "./FAQAccordion";
import { FRAME_HEIGHT, FRAME_WIDTH, SECTION_TOP, localY } from "../layout/frame";

const TOP = SECTION_TOP.faq;

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
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-label="Frequently asked questions"
    >
      <h2 className="sr-only">{faq.heading}</h2>
      <div
        className="faq-grid"
        style={{
          position: "absolute",
          left: 180,
          top: localY(TOP, 13176),
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {faq.leftColumn.map((item) => (
            <FAQAccordion key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
