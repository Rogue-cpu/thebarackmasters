from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "game" / "assets" / "ships" / "criminal.png"

def draw_criminal_sprite(path: Path, size: int = 96) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size // 2

    hull_color = (125, 34, 34, 255)
    edge_color = (214, 108, 92, 255)
    accent_color = (255, 210, 120, 255)
    shadow_color = (10, 10, 20, 120)

    shadow_bounds = (center - 28, center + 20, center + 28, center + 44)
    draw.ellipse(shadow_bounds, fill=shadow_color)

    body = (center - 18, center - 34, center + 18, center + 34)
    draw.rounded_rectangle(body, radius=14, fill=hull_color)

    prow = (
        (center - 12, center - 40),
        (center + 12, center - 40),
        (center + 4, center - 58),
        (center - 4, center - 58),
    )
    draw.polygon(prow, fill=hull_color)

    engine = (center - 16, center + 18, center + 16, center + 34)
    draw.rounded_rectangle(engine, radius=10, fill=hull_color)

    draw.rounded_rectangle(body, radius=14, outline=edge_color, width=3)

    for offset in (-8, 0, 8):
        draw.rectangle(
            (center - 6, center - 10 + offset, center + 6, center - 4 + offset),
            fill=(60, 13, 13, 255),
        )

    for dx in (-10, 0, 10):
        draw.rectangle(
            (center - 4 + dx, center + 10, center + 4 + dx, center + 16),
            fill=edge_color,
        )

    draw.rectangle((center - 20, center - 6, center + 20, center + 0), fill=(255, 230, 150, 140))

    for angle in (-60, -20, 20, 60):
        x = center + int(28 * math.cos(math.radians(angle)))
        y = center + int(28 * math.sin(math.radians(angle)))
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=accent_color)

    draw.rounded_rectangle(body, radius=14, outline=(30, 5, 5, 255), width=2)

    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def main() -> None:
    draw_criminal_sprite(OUTPUT)


if __name__ == "__main__":
    main()
