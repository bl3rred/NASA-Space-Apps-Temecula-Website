"""Extract hero lockup, foreground panel, and inpaint the slice."""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SLICE_ORIGINAL = ROOT / "public/assets/slices-original/01-hero-about.png"
SLICE_OUT = ROOT / "public/assets/slices/01-hero-about.png"
HERO = ROOT / "public/assets/hero"

# left, top, width, height — expanded so banner-adjacent stars sit inside the window
CLIP = (30, 180, 1388, 400)
# Cat cockpit / goggles — never star-punch inside this lockup-local rect
COCKPIT_CLIP = (180, 60, 240, 160)
# Instrument panel + wire arcs band (meteors render behind this overlay)
FOREGROUND = (0, 600, 1440, 450)
NAVY = (7, 23, 63)


def is_sky_pixel(r: int, g: int, b: int) -> bool:
    return r < 28 and g < 42 and b < 90 and b > r + 10 and b > g


def is_star_pixel(r: int, g: int, b: int) -> bool:
    return r >= 160 and g >= 140 and b <= 160 and (r - b) > 25


def in_cockpit_clip(x: int, y: int) -> bool:
    left, top, width, height = COCKPIT_CLIP
    return left <= x < left + width and top <= y < top + height


def extract_lockup(slice_clip: Image.Image) -> Image.Image:
    """Keep jet, ropes, banner, and text. Punch sky and stars — stars stay on the slice."""
    rgb = slice_clip.convert("RGB")
    src = rgb.load()
    w, h = rgb.size
    sky = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def try_enqueue(x: int, y: int) -> None:
        if sky[y][x]:
            return
        if not is_sky_pixel(*src[x, y]):
            return
        sky[y][x] = True
        queue.append((x, y))

    for x in range(w):
        try_enqueue(x, 0)
        try_enqueue(x, h - 1)
    for y in range(h):
        try_enqueue(0, y)
        try_enqueue(w - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                try_enqueue(nx, ny)

    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dest = overlay.load()
    star_mask = Image.new("L", (w, h), 0)
    star_px = star_mask.load()
    for y in range(h):
        for x in range(w):
            if in_cockpit_clip(x, y):
                continue
            if is_star_pixel(*src[x, y]):
                star_px[x, y] = 255
    star_mask = star_mask.filter(ImageFilter.MaxFilter(5))
    star_px = star_mask.load()
    for y in range(h):
        for x in range(w):
            if in_cockpit_clip(x, y):
                star_px[x, y] = 0
    for y in range(h):
        for x in range(w):
            if sky[y][x] or star_px[x, y]:
                continue
            r, g, b = src[x, y]
            dest[x, y] = (r, g, b, 255)
    return overlay


def lockup_cover(overlay: Image.Image) -> Image.Image:
    """Opaque navy everywhere lockup alpha is non-transparent, dilated for bob fringe."""
    alpha = overlay.split()[3]
    mask = alpha.point(lambda a: 255 if a > 8 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(5))
    cover = Image.new("RGBA", overlay.size, (*NAVY, 0))
    cover.putalpha(mask)
    return cover


def flood_sky_mask(rgb: Image.Image) -> list[list[bool]]:
    """Return sky-connected pixels for a crop (edges seeded)."""
    src = rgb.load()
    w, h = rgb.size
    sky = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    def try_enqueue(x: int, y: int) -> None:
        if sky[y][x]:
            return
        if not is_sky_pixel(*src[x, y]):
            return
        sky[y][x] = True
        queue.append((x, y))

    for x in range(w):
        try_enqueue(x, 0)
        try_enqueue(x, h - 1)
    for y in range(h):
        try_enqueue(0, y)
        try_enqueue(w - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                try_enqueue(nx, ny)

    return sky


def punch_sky_and_stars(rgba: Image.Image) -> Image.Image:
    """Keep only non-sky art; sky and stars become transparent."""
    rgb = rgba.convert("RGB")
    src = rgb.load()
    w, h = rgb.size
    sky = flood_sky_mask(rgb)
    star_mask = Image.new("L", (w, h), 0)
    star_px = star_mask.load()
    for y in range(h):
        for x in range(w):
            if is_star_pixel(*src[x, y]):
                star_px[x, y] = 255
    star_mask = star_mask.filter(ImageFilter.MaxFilter(5))
    star_px = star_mask.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dest = out.load()
    for y in range(h):
        for x in range(w):
            if sky[y][x] or star_px[x, y]:
                continue
            r, g, b = src[x, y]
            dest[x, y] = (r, g, b, 255)
    return out


def extract_foreground(slice_im: Image.Image) -> Image.Image:
    """Crop panel + wire arcs; punch sky so meteors show through open sky."""
    left, top, width, height = FOREGROUND
    box = (left, top, left + width, top + height)
    crop = slice_im.crop(box)
    return punch_sky_and_stars(crop.convert("RGBA"))


def inpaint_slice(
    slice_im: Image.Image,
    overlay: Image.Image,
    foreground: Image.Image,
) -> Image.Image:
    """Navy-fill lockup art and opaque panel/wires only. Leave slice stars and sky."""
    out = slice_im.convert("RGB").copy()
    clip_left, clip_top, clip_w, clip_h = CLIP
    alpha = overlay.split()[3]
    mask = alpha.point(lambda a: 255 if a > 8 else 0).filter(ImageFilter.MaxFilter(5))
    mask_px = mask.load()
    out_px = out.load()

    for y in range(clip_h):
        for x in range(clip_w):
            if mask_px[x, y]:
                out_px[clip_left + x, clip_top + y] = NAVY

    fg_left, fg_top, fg_w, fg_h = FOREGROUND
    fg_alpha = foreground.split()[3].load()
    for y in range(fg_h):
        for x in range(fg_w):
            if fg_alpha[x, y] > 8:
                out_px[fg_left + x, fg_top + y] = NAVY

    return out


def main() -> None:
    slice_im = Image.open(SLICE_ORIGINAL).convert("RGB")
    clip_box = (CLIP[0], CLIP[1], CLIP[0] + CLIP[2], CLIP[1] + CLIP[3])
    slice_clip = slice_im.crop(clip_box)
    overlay = extract_lockup(slice_clip)
    cover = lockup_cover(overlay)
    foreground = extract_foreground(slice_im)
    inpainted = inpaint_slice(slice_im, overlay, foreground)

    overlay.save(HERO / "bannerPlane.png")
    cover.save(HERO / "heroLockupCover.png")
    foreground.save(HERO / "heroForeground.png")
    inpainted.save(SLICE_OUT)
    print(
        "bannerPlane",
        overlay.size,
        "heroForeground",
        foreground.size,
        "slice",
        SLICE_OUT,
    )


if __name__ == "__main__":
    main()
