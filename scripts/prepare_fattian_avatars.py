from __future__ import annotations

import sys
from pathlib import Path
from typing import Dict

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
AVATAR_DIR = ROOT / "game" / "assets" / "avatars" / "fattian"
TARGET_SIDE = 320
STATE_ORDER = ['idle', 'thrust', 'left', 'right', 'fire', 'special', 'victory']
SOURCE_FILES: Dict[str, str] = {
    'idle': 'Fattian Idle.png',
    'thrust': 'Fattianforward.png',
    'left': 'Fattianleft.png',
    'right': 'Fattianright.png',
    'fire': 'Fattian Firing.png',
    'special': 'Fattianability.png',
}
FALLBACKS: Dict[str, str] = {
    'victory': 'special',
}

def load_image(name: str) -> Image.Image:
    source_path = ROOT / name
    if not source_path.exists():
        raise FileNotFoundError(f"Missing source image: {source_path}")
    img = Image.open(source_path).convert('RGBA')
    return img

def fit_canvas(img: Image.Image, side: int = TARGET_SIDE) -> Image.Image:
    width, height = img.size
    if width == 0 or height == 0:
        return Image.new('RGBA', (side, side), (0, 0, 0, 0))
    scale = max(side / width, side / height) * 1.08
    new_size = (int(width * scale), int(height * scale))
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    width, height = img.size
    left = max(0, int((width - side) / 2))
    top = max(0, int((height - side) / 2) - int(side * 0.1))
    right = left + side
    bottom = top + side
    img = img.crop((left, top, right, bottom))
    return img

def build_state_image(state: str) -> Image.Image:
    if state in SOURCE_FILES:
        img = load_image(SOURCE_FILES[state])
    else:
        fallback = FALLBACKS.get(state)
        if not fallback:
            raise KeyError(f"No source or fallback defined for state '{state}'")
        img = load_image(SOURCE_FILES[fallback])
    return fit_canvas(img)

def main() -> int:
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    for state in STATE_ORDER:
        try:
            rendered = build_state_image(state)
        except Exception as exc:  # pylint: disable=broad-except
            print(f"Failed to generate '{state}': {exc}", file=sys.stderr)
            return 1
        out_path = AVATAR_DIR / f"{state}.png"
        rendered.save(out_path)
        print(f"Wrote {out_path.relative_to(ROOT)}")
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
