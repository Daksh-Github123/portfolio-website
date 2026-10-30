"""Render certificate PDFs to WebP with signatures / ID codes blurred.

Regions are fractions of page width/height: (x0, y0, x1, y1).
Sources are PDFs, or WebP images when no PDF exists.
Usage: python3.13 -I redact_certs.py <src_pdf_dir> <out_dir> <tmp_dir>
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageFilter

ROBOPRENR_SIG = [(0.74, 0.755, 0.905, 0.855)]

REGIONS = {
    "roboprenr-advanced-electronics": ROBOPRENR_SIG,
    "roboprenr-ai-robotics": ROBOPRENR_SIG,
    "roboprenr-autonomous-robotics": ROBOPRENR_SIG,
    "roboprenr-iot": ROBOPRENR_SIG,
    "roboprenr-pcb-designing": ROBOPRENR_SIG,
    "2025-wro-future-engineers": [(0.39, 0.765, 0.61, 0.845)],
    # signature + "Scan to Verify" QR code
    "2025-icode-hackathon-nationals": [(0.185, 0.695, 0.315, 0.775), (0.465, 0.685, 0.57, 0.815)],
    # two rotated issuer signatures
    "2026-mate-rov-worlds-participation": [(0.63, 0.285, 0.708, 0.445), (0.63, 0.54, 0.708, 0.705)],
    # three signatures with their signature ID codes (source is an image, not a PDF)
    "2025-nrl-participation": [(0.235, 0.63, 0.445, 0.725), (0.475, 0.64, 0.595, 0.725), (0.65, 0.645, 0.815, 0.725)],
}

MAX_SIDE = 1600


def main(src_dir: Path, out_dir: Path, tmp_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_dir.mkdir(parents=True, exist_ok=True)
    for name, regions in REGIONS.items():
        pdf = src_dir / f"{name}.pdf"
        if pdf.exists():
            stem = tmp_dir / name
            subprocess.run(["pdftoppm", "-r", "130", "-png", "-singlefile", str(pdf), str(stem)], check=True)
            img = Image.open(f"{stem}.png").convert("RGB")
        else:
            img = Image.open(src_dir / f"{name}.webp").convert("RGB")
        w, h = img.size
        for x0, y0, x1, y1 in regions:
            box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
            patch = img.crop(box).filter(ImageFilter.GaussianBlur(radius=max(8, w // 120)))
            img.paste(patch, box)
        scale = MAX_SIDE / max(w, h)
        if scale < 1:
            img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        dest = out_dir / f"{name}.webp"
        img.save(dest, "WEBP", quality=78, method=6)
        print(f"{dest.name}: {img.size[0]}x{img.size[1]}, {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
