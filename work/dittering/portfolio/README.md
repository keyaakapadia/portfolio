# Squint portfolio assets

Open `index.html` for the updated case study.

- `mockups/`: replacement PNG stills, ready to use.
- `video/`: eight matching 6-second, 1200 × 800, 24 fps H.264 MP4 loops.
- `zine/`: refreshed Field Notes edition: 16 individual page images, a reading PDF and a spread PDF. Spread PDF is for screen reading, not imposed for saddle-stitch printing.
- `archive/originals/`: preserved original mockups, video, GIF, zine pages and PDFs.

The motion scenes use the project's actual poster artwork. The screen scene is a product presentation concept. Videos include playback controls; the case study pauses offscreen videos and respects reduced-motion preferences.

To recreate assets, run `tools/refresh.py` with Python, Pillow, NumPy and ReportLab. `--zine-only` rebuilds only the zine. `tools/encode.py` encodes the rendered frames with imageio-ffmpeg. Frame images are temporary and excluded from the final asset folders.
