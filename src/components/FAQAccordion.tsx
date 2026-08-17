import { useId, useState } from "react";

type FAQAccordionProps = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

/**
 * FAQAccordion — reusable toggle sized to the Figma FAQ bars (528×72 closed).
 */
export function FAQAccordion({ question, answer, defaultOpen = false }: FAQAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div
      className="faq-item"
      style={{
        width: 528,
        minHeight: 72,
        background: "rgba(7, 23, 63, 0.96)",
        border: "1px solid rgba(180, 210, 255, 0.35)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          minHeight: 72,
          background: "transparent",
          border: 0,
          padding: "14px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          textAlign: "left",
          color: "#ffffff",
          fontFamily: "var(--font-ui)",
          fontWeight: 500,
          fontSize: 20,
          lineHeight: 1.4,
        }}
      >
        <span style={{ flex: 1 }}>{question}</span>
        <span
          aria-hidden
          style={{
            fontSize: 28,
            lineHeight: 1,
            transition: "transform 0.2s ease",
            transform: open ? "rotate(45deg)" : "none",
            flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        hidden={!open}
        style={{
          padding: open ? "0 22px 18px" : 0,
          fontFamily: "var(--font-ui)",
          fontWeight: 400,
          fontSize: 18,
          lineHeight: 1.5,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {answer}
      </div>
    </div>
  );
}
