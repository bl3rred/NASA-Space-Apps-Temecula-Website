import type { CSSProperties } from "react";
import { FRAME_HEIGHT, FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

type Bubble = {
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  rise: number;
  sway: number;
};

/** Rise from ruins water toward the shark/surface; sides only (skip FAQ grid + credit). */
const BUBBLES: Bubble[] = [
  { left: 48, top: 14440, delay: 0.4, duration: 12.5, size: 12, rise: -2020, sway: 18 },
  { left: 118, top: 14510, delay: 2.1, duration: 9.4, size: 7, rise: -1880, sway: -14 },
  { left: 76, top: 14320, delay: 4.2, duration: 14.8, size: 18, rise: -1980, sway: 24 },
  { left: 142, top: 14180, delay: 1.2, duration: 11.0, size: 10, rise: -1680, sway: -20 },
  { left: 36, top: 13960, delay: 5.6, duration: 15.6, size: 21, rise: -1600, sway: 12 },
  { left: 98, top: 13740, delay: 3.0, duration: 8.2, size: 8, rise: -1360, sway: -16 },
  { left: 58, top: 13480, delay: 6.8, duration: 13.4, size: 15, rise: -1120, sway: 22 },
  { left: 1320, top: 14420, delay: 0.8, duration: 11.8, size: 16, rise: -2060, sway: -22 },
  { left: 1368, top: 14540, delay: 2.8, duration: 16.0, size: 9, rise: -2100, sway: 14 },
  { left: 1288, top: 14280, delay: 4.8, duration: 10.2, size: 20, rise: -1920, sway: -26 },
  { left: 1394, top: 14060, delay: 1.6, duration: 13.8, size: 11, rise: -1720, sway: 28 },
  { left: 1336, top: 13820, delay: 5.2, duration: 7.6, size: 6, rise: -1460, sway: -12 },
  { left: 1272, top: 13560, delay: 3.6, duration: 14.2, size: 17, rise: -1220, sway: 20 },
  { left: 1376, top: 13340, delay: 0.2, duration: 9.8, size: 13, rise: -980, sway: -18 },
  { left: 84, top: 14490, delay: 7.2, duration: 12.0, size: 22, rise: -2040, sway: 16 },
  { left: 1348, top: 14470, delay: 6.0, duration: 11.4, size: 14, rise: -1960, sway: -24 },
];

/**
 * Ocean bubbles only — wind particles live in AboutWindParticles at z0.
 * Never transforms the canvas wrapper or PNG slices.
 */
export function BiomeWeather() {
  return (
    <div
      aria-hidden
      className="biome-weather"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        zIndex: 3,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <filter id="biome-wobble">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        className="biome-band"
        style={{
          position: "absolute",
          top: SECTION_TOP.faq,
          left: 0,
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT - SECTION_TOP.faq,
        }}
      >
        {BUBBLES.map((bubble) => (
          <span
            key={`bubble-${bubble.left}-${bubble.top}`}
            className="biome-bubble"
            style={
              {
                left: bubble.left,
                top: bubble.top - SECTION_TOP.faq,
                width: bubble.size,
                height: bubble.size,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`,
                "--biome-rise": `${bubble.rise}px`,
                "--biome-sway": `${bubble.sway}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
