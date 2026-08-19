import { hero } from "../data/assets";
import { FRAME_WIDTH, SECTION_TOP } from "../layout/frame";

const CLIP_LEFT = 30;
const CLIP_TOP = 180;
const CLIP_WIDTH = 1388;
const CLIP_HEIGHT = 400;

type WindLine = {
  className: string;
  top: number;
  left: number;
  width: number;
};

/** Global Figma coords: jet ~43–490, banner ~550–1410, y ~232–486. */
const WIND_BACK: WindLine[] = [
  { className: "plane-wind-line-a", top: 344, left: 78, width: 140 },
  { className: "plane-wind-line-b", top: 392, left: 102, width: 118 },
  { className: "plane-wind-line-c", top: 322, left: 458, width: 96 },
  { className: "plane-wind-line-d", top: 366, left: 476, width: 88 },
  { className: "plane-wind-line-e", top: 412, left: 492, width: 72 },
  { className: "plane-wind-line-f", top: 452, left: 590, width: 220 },
  { className: "plane-wind-line-j", top: 414, left: 86, width: 150 },
  { className: "plane-wind-line-k", top: 428, left: 120, width: 170 },
];

const WIND_MID: WindLine[] = [
  // Lower hero texture: stagger Y so it doesn't read as a single horizontal bar.
  { className: "plane-wind-line-n", top: 430, left: 120, width: 170 },
  { className: "plane-wind-line-q", top: 444, left: 980, width: 130 },
  { className: "plane-wind-line-o", top: 456, left: 380, width: 150 },
  { className: "plane-wind-line-p", top: 468, left: 720, width: 180 },
];

const WIND_FRONT: WindLine[] = [
  { className: "plane-wind-line-g", top: 260, left: 650, width: 260 },
  { className: "plane-wind-line-h", top: 282, left: 810, width: 210 },
  { className: "plane-wind-line-i", top: 268, left: 970, width: 180 },
];

function WindLayer({
  layerClass,
  lines,
}: {
  layerClass: string;
  lines: WindLine[];
}) {
  return (
    <div className={`plane-wind-layer ${layerClass}`}>
      {lines.map((line) => (
        <span
          key={line.className}
          className={`plane-wind-line ${line.className}`}
          style={{ top: line.top, left: line.left, width: line.width }}
        />
      ))}
    </div>
  );
}

/** Original-slice lockup (sky/stars punched) plus wind. No rectangular sky plate. */
export function PlaneWind() {
  return (
    <div
      aria-hidden
      className="plane-wind"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: FRAME_WIDTH,
        height: SECTION_TOP.about,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <WindLayer layerClass="plane-wind-back" lines={WIND_BACK} />
      <WindLayer layerClass="plane-wind-back" lines={WIND_MID} />
      <div
        className="plane-fly"
        style={{
          position: "absolute",
          left: CLIP_LEFT,
          top: CLIP_TOP,
          width: CLIP_WIDTH,
          height: CLIP_HEIGHT,
        }}
      >
        <img
          className="plane-lockup-art"
          src={hero.bannerPlane}
          alt=""
          width={CLIP_WIDTH}
          height={CLIP_HEIGHT}
        />
      </div>
      <WindLayer layerClass="plane-wind-front" lines={WIND_FRONT} />
    </div>
  );
}
