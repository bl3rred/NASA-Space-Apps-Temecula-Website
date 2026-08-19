"""Feather the hard navy-to-sky edge in the patched hero slice.

The patched 01-hero-about.png repaints the hero sky as solid navy (#07173f)
down to y=EDGE, where it cuts off into the original lighter sky. Downscaled,
that 1px hard boundary renders as a visible dark line above the clouds.
This blends the navy into the sky color of each column over FEATHER rows,
restoring a smooth gradient like the original artwork.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SLICE = ROOT / "public/assets/slices/01-hero-about.png"

NAVY = np.array([7, 23, 63])  # #07173f
EDGE = 1050  # first row of original (un-darkened) sky
FEATHER = 60  # rows [EDGE-FEATHER, EDGE) blend navy -> sky


def main() -> None:
    arr = np.array(Image.open(SLICE).convert("RGB")).astype(np.int16)
    start = EDGE - FEATHER
    band = arr[start:EDGE]

    # Per-column blend target = sky color just below the edge (median of 4 rows).
    target = np.median(arr[EDGE : EDGE + 4], axis=0)

    # Smoothstep 0->1 across the feather band.
    t = np.linspace(0.0, 1.0, FEATHER)
    s = t * t * (3 - 2 * t)

    # Blend only pixels that are still the navy repaint, so art stays untouched.
    navy_mask = np.abs(band - NAVY).max(axis=2) <= 24
    weight = (s[:, None] * navy_mask)[:, :, None]
    blended = band * (1 - weight) + target * weight
    band[:] = np.where(navy_mask[:, :, None], blended, band)

    Image.fromarray(arr.astype(np.uint8)).save(SLICE)
    print(f"feathered rows {start}..{EDGE - 1} of {SLICE.name}")


if __name__ == "__main__":
    main()
