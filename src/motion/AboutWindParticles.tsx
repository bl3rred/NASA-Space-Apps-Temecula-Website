import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import { particles } from "../data/assets";
import { FRAME_HEIGHT, FRAME_WIDTH, SECTION_TOP } from "../layout/frame";
import { useViewportMetrics } from "../layout/viewport";
import { figmaScrollY } from "../scroll/scrollCoords";

type ParticleKind = "leaf" | "dandelion";

type WindSlot = {
  id: number;
  generation: number;
  kind: ParticleKind;
  top: number;
  size: number;
  duration: number;
  delay: number;
  xEnd: number;
  rotate: number;
  rotateEnd: number;
  tone: "light" | "dark";
  y1: number;
  y2: number;
  y3: number;
  y4: number;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  opacity: number;
};

const POOL_SIZE = 6;
const SPAWN_X = -40;
const SPAWN_MIN_MS = 4000;
const SPAWN_MAX_MS = 9000;
const RECYCLE_MIN_MS = 0;
const RECYCLE_MAX_MS = 3000;

/** Hanging sign + body copy — keep leaves out of this band. */
const ABOUT_COPY_TOP = 3050;
const ABOUT_COPY_BOTTOM = 3650;

const GRASS_BANDS: { top: number; bottom: number; kind: ParticleKind }[] = [
  { top: 2920, bottom: 5750, kind: "leaf" },
  { top: SECTION_TOP.tracks, bottom: SECTION_TOP.schedule, kind: "dandelion" },
  // Schedule grass ends at ~comp 9140 where the dirt/underground transition
  // starts — cap above it so dandelions never spawn in the dirt.
  { top: SECTION_TOP.schedule, bottom: 9100, kind: "dandelion" },
];

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randSpawnDelay(): number {
  return rand(SPAWN_MIN_MS, SPAWN_MAX_MS);
}

function randRecycleDelay(): number {
  return rand(RECYCLE_MIN_MS, RECYCLE_MAX_MS);
}

function pickAboutSpawnY(visTop: number, visBot: number): number {
  const upperTop = visTop;
  const upperBot = Math.min(visBot, ABOUT_COPY_TOP);
  const lowerTop = Math.max(visTop, ABOUT_COPY_BOTTOM);
  const lowerBot = visBot;

  const upperSpan = Math.max(0, upperBot - upperTop);
  const lowerSpan = Math.max(0, lowerBot - lowerTop);

  if (upperSpan >= 40 && lowerSpan >= 40) {
    return Math.random() < 0.35 ? rand(upperTop, upperBot) : rand(lowerTop, lowerBot);
  }
  if (lowerSpan >= 40) return rand(lowerTop, lowerBot);
  if (upperSpan >= 40) return rand(upperTop, upperBot);
  return rand(visTop, visBot);
}

function pickSpawn(layoutScale: number): Omit<WindSlot, "id" | "generation"> | null {
  const vh = (window.visualViewport?.height ?? window.innerHeight) / layoutScale;
  const figmaTop = figmaScrollY(window.scrollY, layoutScale);
  const figmaBottom = figmaTop + vh;

  const hits = GRASS_BANDS.flatMap((band) => {
    const visTop = Math.max(band.top, figmaTop);
    const visBot = Math.min(band.bottom, figmaBottom);
    if (visBot - visTop < 40) return [];
    return [{ ...band, visTop, visBot }];
  });

  if (hits.length === 0) return null;

  const band = hits[Math.floor(Math.random() * hits.length)];
  const kind = band.kind;
  const size = kind === "dandelion" ? rand(40, 52) : rand(22, 28);
  const tone: "light" | "dark" = Math.random() < 0.5 ? "light" : "dark";
  const yScale = kind === "dandelion" ? 1.35 : 1.15;
  const xScale = kind === "dandelion" ? 0.7 : 1;

  const spawnY =
    kind === "leaf" ? pickAboutSpawnY(band.visTop, band.visBot) : rand(band.visTop, band.visBot);

  return {
    kind,
    top: spawnY,
    size,
    duration: kind === "dandelion" ? rand(18, 26) : rand(14, 20),
    delay: rand(0, 3),
    xEnd: rand(1380, 1520),
    rotate: rand(-18, 18),
    rotateEnd: kind === "dandelion" ? rand(-8, 10) : rand(-5, 22),
    tone,
    y1: rand(-22, -5) * yScale,
    y2: rand(5, 18) * yScale,
    y3: rand(-14, 4) * yScale,
    y4: rand(-4, 14) * yScale,
    x1: rand(8, 24) * xScale,
    x2: rand(-18, -5) * xScale,
    x3: rand(10, 26) * xScale,
    x4: rand(-14, 4) * xScale,
    opacity: kind === "leaf" ? 0.55 : 0.65,
  };
}

function LeafDoodle({ tone }: { tone: "light" | "dark" }) {
  const fill = tone === "dark" ? "var(--grass-dark)" : "var(--grass-light)";
  return (
    <svg viewBox="0 0 20 28" aria-hidden>
      <path
        d="M10 3C6.2 3.2 3.2 7.2 3 12.2C2.8 17.4 6.4 21.2 10 25C13.6 21.2 17.2 17.4 17 12.2C16.8 7.2 13.8 3.2 10 3Z"
        fill={fill}
      />
      <path
        d="M10 25C7.4 18.8 7.6 12.4 10 5.2C12.4 12.4 12.6 18.8 10 25Z"
        fill={tone === "dark" ? "var(--grass-light)" : "var(--grass-dark)"}
        opacity="0.35"
      />
      <path d="M10 25V3.4" stroke={fill} strokeWidth="1.15" strokeLinecap="round" />
      <path d="M10 25V27.4" stroke={fill} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DandelionArt() {
  return (
    <img
      className="biome-wind-dandelion-art"
      src={particles.dandelion}
      alt=""
      draggable={false}
    />
  );
}

function ParticleArt({ kind, tone }: { kind: ParticleKind; tone: "light" | "dark" }) {
  switch (kind) {
    case "leaf":
      return <LeafDoodle tone={tone} />;
    case "dandelion":
      return <DandelionArt />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

/**
 * Sparse gusty LTR wind: one spawn every 4–9s, layered X track + Y flutter/tumble.
 */
export function AboutWindParticles() {
  const { layoutScale } = useViewportMetrics();
  const scaleRef = useRef(layoutScale);
  scaleRef.current = layoutScale;

  const [slots, setSlots] = useState<(WindSlot | null)[]>(() =>
    Array.from({ length: POOL_SIZE }, () => null),
  );
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const timersRef = useRef<number[]>([]);
  const queueTimerRef = useRef<number | null>(null);

  const clearTimer = (index: number) => {
    const existing = timersRef.current[index];
    if (existing !== undefined) window.clearTimeout(existing);
  };

  const commitSlot = useCallback((index: number, spawn: Omit<WindSlot, "id" | "generation">) => {
    setSlots((prev) => {
      const next = [...prev];
      const current = next[index];
      next[index] = {
        ...spawn,
        id: index,
        generation: (current?.generation ?? 0) + 1,
      };
      return next;
    });
  }, []);

  const fillSlot = useCallback(
    (index: number, recycleDelay = 0) => {
      clearTimer(index);
      const timer = window.setTimeout(() => {
        const spawn = pickSpawn(scaleRef.current);
        if (!spawn) {
          fillSlot(index, 900);
          return;
        }
        commitSlot(index, spawn);
      }, recycleDelay);
      timersRef.current[index] = timer;
    },
    [commitSlot],
  );

  const spawnIntoEmpty = useCallback(() => {
    const emptyIndex = slotsRef.current.findIndex((slot) => slot === null);
    if (emptyIndex < 0) return;
    fillSlot(emptyIndex);
  }, [fillSlot]);

  const scheduleQueueSpawn = useCallback(() => {
    if (queueTimerRef.current !== null) {
      window.clearTimeout(queueTimerRef.current);
    }
    queueTimerRef.current = window.setTimeout(() => {
      queueTimerRef.current = null;
      spawnIntoEmpty();
      scheduleQueueSpawn();
    }, randSpawnDelay());
  }, [spawnIntoEmpty]);

  useEffect(() => {
    scheduleQueueSpawn();
    return () => {
      if (queueTimerRef.current !== null) {
        window.clearTimeout(queueTimerRef.current);
      }
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [scheduleQueueSpawn]);

  function handleEnded(event: AnimationEvent<HTMLSpanElement>, index: number) {
    if (event.animationName !== "biome-wind-track") return;
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    fillSlot(index, randRecycleDelay());
  }

  return (
    <div
      aria-hidden
      className="about-wind-pool"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {slots.map((slot, index) => {
        if (!slot) return null;
        const heightScale = slot.kind === "dandelion" ? 1.55 : 1.4;
        const trackStyle = {
          "--wind-duration": `${slot.duration}s`,
          "--wind-delay": `${slot.delay}s`,
          "--wind-x-end": `${slot.xEnd}px`,
          "--wind-opacity": `${slot.opacity}`,
        } as CSSProperties;
        const bodyStyle = {
          "--wind-rotate-start": `${slot.rotate}deg`,
          "--wind-rotate-end": `${slot.rotateEnd}deg`,
          "--wind-y1": `${slot.y1}px`,
          "--wind-y2": `${slot.y2}px`,
          "--wind-y3": `${slot.y3}px`,
          "--wind-y4": `${slot.y4}px`,
          "--wind-x1": `${slot.x1}px`,
          "--wind-x2": `${slot.x2}px`,
          "--wind-x3": `${slot.x3}px`,
          "--wind-x4": `${slot.x4}px`,
        } as CSSProperties;

        return (
          <span
            key={`${slot.id}-${slot.generation}`}
            className={`biome-wind-leaf biome-wind-leaf--${slot.kind}`}
            style={{
              left: SPAWN_X,
              top: slot.top,
              width: slot.size,
              height: Math.round(slot.size * heightScale),
            }}
          >
            <span
              className="biome-wind-track"
              style={trackStyle}
              onAnimationEnd={(event) => handleEnded(event, index)}
            >
              <span className="biome-wind-body" style={bodyStyle}>
                <ParticleArt kind={slot.kind} tone={slot.tone} />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
