// Downloads every Figma asset referenced in src/data/assets.ts into public/assets.
// Run with: node scripts/fetch-assets.mjs
// Node 18+ required (built-in fetch). Idempotent: skips files that already exist.

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS_FILE = join(ROOT, "src", "data", "assets.ts");
const OUT_DIR = join(ROOT, "public", "assets");

// Parse the assets.ts file: pull out the nested `group: { key: "url" }` structure.
async function parseAssets() {
  const src = await readFile(ASSETS_FILE, "utf8");
  const entries = [];
  let currentGroup = null;
  const groupRe = /^\s{2}(\w+):\s*\{/gm;
  const lineRe = /^\s{4}(\w+):\s*"([^"]+)"/gm;
  // Walk line by line to track the current group.
  for (const rawLine of src.split(/\r?\n/)) {
    const g = /^\s{2}(\w+):\s*\{\s*$/.exec(rawLine);
    if (g) {
      currentGroup = g[1];
      continue;
    }
    if (/^\s{2}\}/.test(rawLine)) {
      currentGroup = null;
      continue;
    }
    const m = /^\s{4}(\w+):\s*"(https:\/\/[^"]+)"/.exec(rawLine);
    if (m && currentGroup) {
      entries.push({ group: currentGroup, name: m[1], url: m[2] });
    }
  }
  // Fallback: regex sweep if the line-by-line parse missed anything.
  if (entries.length === 0) {
    let g2 = groupRe.exec(src);
    while (g2) {
      const group = g2[1];
      const blockStart = g2.index + g2[0].length;
      const blockEnd = src.indexOf("},", blockStart);
      const block = src.slice(blockStart, blockEnd === -1 ? undefined : blockEnd);
      let lm = lineRe.exec(block);
      while (lm) {
        entries.push({ group, name: lm[1], url: lm[2] });
        lm = lineRe.exec(block);
      }
      g2 = groupRe.exec(src);
    }
  }
  return entries;
}

function extFor(url) {
  if (url.endsWith(".svg")) return "svg";
  if (url.endsWith(".png")) return "png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "jpg";
  return "png";
}

async function download(entry) {
  const dir = join(OUT_DIR, entry.group);
  const ext = extFor(entry.url);
  const file = join(dir, `${entry.name}.${ext}`);
  if (existsSync(file)) {
    return { ...entry, file, status: "skip" };
  }
  try {
    const res = await fetch(entry.url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dir, { recursive: true });
    await writeFile(file, buf);
    return { ...entry, file, status: "ok", bytes: buf.length };
  } catch (err) {
    return { ...entry, file, status: "error", error: String(err) };
  }
}

const entries = await parseAssets();
console.log(`Found ${entries.length} assets to fetch.`);

let ok = 0, skip = 0, err = 0;
const CONCURRENCY = 8;
let i = 0;
async function worker() {
  while (i < entries.length) {
    const idx = i++;
    const r = await download(entries[idx]);
    if (r.status === "ok") {
      ok++;
      console.log(`  + ${r.group}/${r.name} (${r.bytes} bytes)`);
    } else if (r.status === "skip") {
      skip++;
    } else {
      err++;
      console.error(`  ! ${r.group}/${r.name}: ${r.error}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\nDone. ok=${ok} skip=${skip} error=${err}`);
if (err > 0) process.exitCode = 1;
