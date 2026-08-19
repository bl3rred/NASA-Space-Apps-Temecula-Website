import { useState, type MouseEvent } from "react";
import { nav } from "../data/content";
import { handleNavClick } from "../scroll/smoothScroll";
import type { SectionId } from "../scroll/scrollCoords";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function CtaAnchor({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const external = isExternalHref(href);
  return (
    <a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

type StickyNavProps = {
  visible: boolean;
  activeSection: SectionId;
  layoutScale: number;
};

/** Desktop-style fixed header outside the scaled canvas. */
export function DesktopStickyNav({ visible, activeSection, layoutScale }: StickyNavProps) {
  if (!visible) return null;

  return (
    <nav className="nav-desktop-sticky" aria-label="Primary">
      {nav.links.map((link) => {
        const section = link.href.slice(1) as SectionId;
        const isActive = activeSection === section;
        return (
          <a
            key={link.href}
            className={isActive ? "nav-desktop-link is-active" : "nav-desktop-link"}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            onClick={(e) => handleNavClick(e, link.href, layoutScale)}
          >
            {link.label}
          </a>
        );
      })}
      <CtaAnchor className="nav-desktop-register" href={nav.register.href}>
        Pre-register
      </CtaAnchor>
      <CtaAnchor className="nav-desktop-mentor" href={nav.mentor.href}>
        {nav.mentor.label}
      </CtaAnchor>
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
                className="nav-mobile-link"
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
          <CtaAnchor
            className="nav-mobile-register"
            href={nav.register.href}
            onClick={() => setOpen(false)}
          >
            Pre-register now
          </CtaAnchor>
          <CtaAnchor
            className="nav-mobile-mentor"
            href={nav.mentor.href}
            onClick={() => setOpen(false)}
          >
            {nav.mentor.label}
          </CtaAnchor>
        </div>
      ) : null}
    </div>
  );
}
