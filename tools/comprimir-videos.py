"""Comprime los reels de videos-originales/ para la web y saca su portada.

Uso:  python tools/comprimir-videos.py          (solo procesa los que faltan)
      python tools/comprimir-videos.py --todo   (los rehace todos)

El orden de cada sección sale del número del nombre del archivo
("Bienes raices 1.mp4" -> inmobiliaria-1.mp4).
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "videos-originales"
VIDEO = ROOT / "assets" / "video"
POSTER = ROOT / "assets" / "poster"
SECCIONES = {
    "1-bienes-raices": "inmobiliaria",
    "2-influencers": "creadores",
    "3-empresas": "marcas",
    "4-motion-graphics": "motion",
}
EXT = {".mp4", ".mov", ".m4v"}


def numero(path):
    nums = re.findall(r"\d+", path.stem)
    return int(nums[-1]) if nums else 0


def run(args):
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", *args], check=True)


def main():
    rehacer = "--todo" in sys.argv
    VIDEO.mkdir(parents=True, exist_ok=True)
    POSTER.mkdir(parents=True, exist_ok=True)
    for carpeta, slug in SECCIONES.items():
        archivos = sorted((p for p in (SRC / carpeta).glob("*") if p.suffix.lower() in EXT), key=numero)
        for i, src in enumerate(archivos, 1):
            out = VIDEO / f"{slug}-{i}.mp4"
            poster = POSTER / f"{slug}-{i}.jpg"
            if rehacer or not out.exists():
                run([
                    "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?",
                    "-vf", "scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=30",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-ac", "2",
                    "-movflags", "+faststart", str(out),
                ])
                print(f"OK  {out.name}  <-  {src.name}  ({out.stat().st_size / 1e6:.1f} MB)")
            if rehacer or not poster.exists():
                # portada a un 35 % del vídeo: evita el negro del primer fotograma
                dur = float(subprocess.run(
                    ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)],
                    capture_output=True, text=True, check=True).stdout.strip() or 2)
                run(["-ss", f"{dur * 0.35:.2f}", "-i", str(out), "-frames:v", "1", "-q:v", "5", str(poster)])


if __name__ == "__main__":
    main()
