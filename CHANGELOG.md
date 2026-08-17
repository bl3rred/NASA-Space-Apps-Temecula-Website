# Changelog

## v1-stable — 2026-08-17

Safe rollback point before scroll/character animation work.

**Includes:**

- Four-slice composite layout (`public/assets/slices/`)
- Fill-width scale mode (`FRAME_WIDTH=1440`, `FRAME_HEIGHT=14623`)
- Mobile floating hamburger nav (no full-width top bar)
- Desktop nav opaque cover from x=800 (preserves top-left star)
- Transparent footer credit overlay on ruins art
- FAQ accordion HTML overlay

**Does not include:** GSAP animations, scroll transitions, or animated overlay layers.

To restore: `git checkout v1-stable`
