"""
Erzeugt alle Icon-Groessen fuer Microsoft Store (MSIX) und PWA aus icon-512.png.

Aufruf:
    python scripts/make-store-icons.py

Quelle:  store-assets/icon-512.png
Ziele:   public/icons/*.png        (PWA / Web-App-Manifest)
         store-assets/msix/*.png   (MSIX-Paket + Store-Listing)
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "store-assets" / "icon-512.png"
PWA_DIR = ROOT / "public" / "icons"
MSIX_DIR = ROOT / "store-assets" / "msix"

BG = (5, 8, 17, 255)  # #050811 - Hintergrundfarbe der App


def save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}")


def maskable(base: Image.Image, size: int, scale: float = 0.78) -> Image.Image:
    """Icon mit Sicherheitsrand auf Hintergrund - fuer maskierbare PWA-Icons."""
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * scale)
    resized = base.resize((inner, inner), Image.LANCZOS)
    offset = (size - inner) // 2
    canvas.paste(resized, (offset, offset), resized)
    return canvas


def letterbox(base: Image.Image, width: int, height: int, scale: float = 0.86) -> Image.Image:
    """Quadratisches Icon unverzerrt auf breite Flaeche setzen."""
    canvas = Image.new("RGBA", (width, height), BG)
    inner = min(int(height * scale), int(width * scale))
    resized = base.resize((inner, inner), Image.LANCZOS)
    canvas.paste(resized, ((width - inner) // 2, (height - inner) // 2), resized)
    return canvas


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Quelldatei fehlt: {SRC}")

    base = Image.open(SRC).convert("RGBA")
    if base.size != (512, 512):
        base = base.resize((512, 512), Image.LANCZOS)

    print("PWA-Icons:")
    save(base.resize((192, 192), Image.LANCZOS), PWA_DIR / "icon-192.png")
    save(base, PWA_DIR / "icon-512.png")
    save(maskable(base, 192), PWA_DIR / "icon-maskable-192.png")
    save(maskable(base, 512), PWA_DIR / "icon-maskable-512.png")

    print("MSIX-Assets:")
    # Quadratische Assets laut Microsoft-Doku
    save(base.resize((44, 44), Image.LANCZOS), MSIX_DIR / "Square44x44Logo.png")
    save(base.resize((50, 50), Image.LANCZOS), MSIX_DIR / "StoreLogo.png")
    save(base.resize((150, 150), Image.LANCZOS), MSIX_DIR / "Square150x150Logo.png")
    save(base.resize((310, 310), Image.LANCZOS), MSIX_DIR / "Square310x310Logo.png")

    # Store-Listing-Logo (300x300) fuer das Partner Center
    save(base.resize((300, 300), Image.LANCZOS), MSIX_DIR / "StoreListingLogo-300.png")

    # Breite Assets: nicht verzerren, sondern auf Hintergrund zentrieren
    save(letterbox(base, 310, 150), MSIX_DIR / "Wide310x150Logo.png")
    save(letterbox(base, 620, 300), MSIX_DIR / "SplashScreen.png")


if __name__ == "__main__":
    main()
