import { useState } from "react";
import { nav } from "../data/content";
import { FRAME_WIDTH } from "../layout/frame";
import { handleNavClick } from "../scroll/smoothScroll";
import type { SectionId } from "../scroll/scrollCoords";

/** Cover only the link row so stars on the left stay visible. */
const NAV_COVER_LEFT = 800;
const NAV_HITS: Array<{ href: string; left: number; width: number; section: SectionId }> = [
  { href: "#about", left: 823, width: 56, section: "about" },
  { href: "#tracks", left: 918, width: 62, section: "tracks" },
  { href: "#schedule", left: 1019, width: 82, section: "schedule" },
  { href: "#sponsors", left: 1140, width: 86, section: "sponsors" },
  { href: "#faq", left: 1265, width: 38, section: "faq" },
];

type CanvasNavHitsProps = {
  activeSection: SectionId;
  layoutScale: number;
};

/** Desktop HTML labels over the illustrated nav. Hidden on mobile. */
export function CanvasNavHits({ activeSection, layoutScale }: CanvasNavHitsProps) {
  return (
    <nav
      aria-label="Primary"
      style={{
        position: "absolute",
        top: 0,
        left: NAV_COVER_LEFT,
        width: FRAME_WIDTH - NAV_COVER_LEFT,
        height: 88,
        zIndex: 3,
        pointerEvents: "none",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "#07173f",
        }}
      />
      {NAV_HITS.map((hit) => {
        const link = nav.links.find((l) => l.href === hit.href);
        const isActive = activeSection === hit.section;
        return (
          <a
            key={hit.href}
            href={hit.href}
            aria-current={isActive ? "page" : undefined}
            onClick={(e) => handleNavClick(e, hit.href, layoutScale)}
            style={{
              position: "absolute",
              left: hit.left - NAV_COVER_LEFT,
              top: 0,
              width: hit.width,
              height: 88,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "#f5c542" : "#ffffff",
              fontFamily: "var(--font-ui)",
              fontWeight: isActive ? 700 : 500,
              fontSize: 16,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              pointerEvents: "auto",
              zIndex: 1,
              transition: "color 0.25s ease, font-weight 0.25s ease",
            }}
          >
            {link?.label ?? hit.href.slice(1)}
          </a>
        );
      })}
    </nav>
  );
}

type MobileNavProps = {
  visible: boolean;
  activeSection: SectionId;
  layoutScale: number;
};

/** Floating hamburger — no full-width header bar. */
export function MobileNav({ visible, activeSection, layoutScale }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <div
      className="nav-mobile-float"
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 150,
      }}
    >
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "rgba(7, 23, 63, 0.88)",
          border: "2px solid #ffffff",
          borderRadius: 8,
          padding: "10px 12px",
          color: "#ffffff",
          minWidth: 44,
          minHeight: 44,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{open ? "✕" : "☰"}</span>
      </button>

      {open ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "min(280px, calc(100vw - 24px))",
            background: "rgba(7, 23, 63, 0.96)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {nav.links.map((link) => {
            const section = link.href.slice(1) as SectionId;
            const isActive = activeSection === section;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  handleNavClick(e, link.href, layoutScale);
                  setOpen(false);
                }}
                style={{
                  color: isActive ? "#f5c542" : "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 18,
                  padding: "12px 8px",
                }}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={nav.register.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 8,
              color: "#07173f",
              background: "#f5c542",
              fontFamily: "var(--font-ui)",
              fontWeight: 700,
              fontSize: 16,
              textAlign: "center",
              borderRadius: 999,
              padding: "12px 16px",
            }}
          >
            Pre-register now
          </a>
        </div>
      ) : null}
    </div>
  );
}
