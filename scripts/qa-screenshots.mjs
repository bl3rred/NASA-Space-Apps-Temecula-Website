import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "qa");
mkdirSync(OUT, { recursive: true });

const HERO_TOP_CROP = 150;
const FRAME_HEIGHT = 14623;
const VISIBLE_FRAME_HEIGHT = FRAME_HEIGHT - HERO_TOP_CROP;

const SCROLL = {
  aboutViewport: 3220 - HERO_TOP_CROP,
  tracksGrass: 6100 - HERO_TOP_CROP,
  stickyNav: 2400 - HERO_TOP_CROP,
  sharkSeam: 12740 - HERO_TOP_CROP,
  oceanViewport: 13100 - HERO_TOP_CROP,
};

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 60000 });
await page.waitForSelector(".page-slice");
await new Promise((r) => setTimeout(r, 1200));

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: resolve(OUT, "hero.png") });

await page.screenshot({
  path: resolve(OUT, "hero-crop-top.png"),
  clip: { x: 0, y: 0, width: 1440, height: 80 },
});

const maxScroll = await page.evaluate(() =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
);
await page.evaluate((y) => window.scrollTo(0, y), maxScroll);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({
  path: resolve(OUT, "footer-bottom.png"),
  clip: { x: 0, y: 780, width: 1440, height: 120 },
});

const about = await page.$("#about");
if (about) {
  await about.scrollIntoView();
  await new Promise((r) => setTimeout(r, 600));
  await about.screenshot({ path: resolve(OUT, "about-section.png") });
}

await page.evaluate((y) => window.scrollTo(0, y), SCROLL.aboutViewport);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: resolve(OUT, "about-viewport.png") });

await page.evaluate((y) => window.scrollTo(0, y), SCROLL.tracksGrass);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: resolve(OUT, "tracks-grass.png") });

await page.evaluate((y) => window.scrollTo(0, y), SCROLL.stickyNav);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: resolve(OUT, "sticky-nav.png") });

await page.evaluate((y) => window.scrollTo(0, y), SCROLL.sharkSeam);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: resolve(OUT, "shark-seam.png") });

await page.evaluate((y) => window.scrollTo(0, y), SCROLL.oceanViewport);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: resolve(OUT, "ocean-viewport.png") });

await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));
const plane = await page.evaluate(() => {
  const canvas = document.querySelector(".page");
  const rect = canvas?.getBoundingClientRect();
  const scale = (rect?.width ?? 1440) / 1440;
  return { x: 30 * scale, y: 30 * scale, w: 1388 * scale, h: 400 * scale };
});
await page.screenshot({
  path: resolve(OUT, "plane-clip.png"),
  clip: {
    x: Math.max(0, plane.x),
    y: Math.max(0, plane.y),
    width: Math.min(1440, plane.w),
    height: Math.min(900, plane.h),
  },
});

await browser.close();
console.log(
  `wrote qa/hero.png, hero-crop-top.png, footer-bottom.png, about-section.png, about-viewport.png, tracks-grass.png, sticky-nav.png, shark-seam.png, ocean-viewport.png, plane-clip.png (crop ${HERO_TOP_CROP}px, visible ${VISIBLE_FRAME_HEIGHT}px)`,
);
