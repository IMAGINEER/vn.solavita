#!/usr/bin/env bash
# Compress the SolaHome project videos into a web-safe MP4.
#
#   bash scripts/compress-videos.sh                  # the three project videos
#   bash scripts/compress-videos.sh path/to/clip.mp4 # any file
#
# Output is written next to the source as "<name>-web.mp4".
# The source files are never modified.
#
# Web profile used here:
#   - MP4 container, H.264, yuv420p — required for Safari / iOS / Chrome;
#     10-bit or 4:2:2 sources will not play in a browser without it
#   - capped at 1920x1080, never upscaled, aspect ratio preserved
#   - CRF 23 (visually transparent for screen content)
#   - AAC-LC 128 kbps, 48 kHz, stereo
#   - +faststart, so the moov atom sits at the front and the file starts
#     playing before it has finished downloading
#
# Encoder: libx264 when the ffmpeg build has it, otherwise h264_nvenc
# (NVIDIA). If neither is available the script stops and tells you how to
# get a full build.
#
# Tune the output with env vars, e.g. a much smaller mobile file:
#   CRF=26 MAX_W=1280 MAX_H=720 bash scripts/compress-videos.sh
set -euo pipefail

VIDEOS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/videos"

MAX_W="${MAX_W:-1920}"
MAX_H="${MAX_H:-1080}"
CRF="${CRF:-23}"
PRESET="${PRESET:-slow}"
AUDIO_BITRATE="${AUDIO_BITRATE:-128k}"

# 1. ffmpeg on PATH, 2. the build bundled with JianyingPro (CapCut).
FFMPEG="${FFMPEG:-}"
if [ -z "$FFMPEG" ]; then
  if command -v ffmpeg >/dev/null 2>&1; then
    FFMPEG="$(command -v ffmpeg)"
  else
    for candidate in \
      "/d/JianyingPro/11.3.0.14362/ffmpeg.exe" \
      "/c/Program Files/JianyingPro/ffmpeg.exe" \
      "/usr/local/bin/ffmpeg" \
      "/opt/homebrew/bin/ffmpeg"; do
      if [ -x "$candidate" ]; then
        FFMPEG="$candidate"
        break
      fi
    done
  fi
fi

if [ -z "$FFMPEG" ]; then
  echo "ffmpeg not found. Install it, or point FFMPEG at the binary:" >&2
  echo "  FFMPEG=/path/to/ffmpeg bash scripts/compress-videos.sh" >&2
  exit 1
fi

echo "ffmpeg: $FFMPEG"
"$FFMPEG" -hide_banner -version | head -1

# Pick an H.264 encoder this build actually has.
ENCODERS="$("$FFMPEG" -hide_banner -encoders 2>/dev/null || true)"
if printf '%s' "$ENCODERS" | grep -q "libx264"; then
  VIDEO_OPTS=(-c:v libx264 -profile:v high -level 4.1 -preset "$PRESET" -crf "$CRF")
elif printf '%s' "$ENCODERS" | grep -q "h264_nvenc"; then
  VIDEO_OPTS=(-c:v h264_nvenc -preset p5 -tune hq -rc vbr -cq "$CRF" -b:v 0 -profile:v high)
else
  echo >&2
  echo "This ffmpeg build has no H.264 encoder (no libx264, no h264_nvenc)." >&2
  echo "Install a full build and re-run, e.g.:" >&2
  echo "  winget install --id Gyan.FFmpeg -e" >&2
  echo "  FFMPEG=/path/to/ffmpeg.exe bash scripts/compress-videos.sh" >&2
  exit 1
fi
echo "encoder: ${VIDEO_OPTS[*]}"
echo

if [ "$#" -gt 0 ]; then
  sources=("$@")
else
  sources=(
    "$VIDEOS_DIR/越南-胡志明-项目2.mp4"
    "$VIDEOS_DIR/越南-胡志明市.mp4"
    "$VIDEOS_DIR/越南河内案例视频.mp4"
  )
fi

for src in "${sources[@]}"; do
  if [ ! -f "$src" ]; then
    echo "skip (not found): $src"
    continue
  fi

  out="${src%.*}-web.mp4"
  echo "=== $(basename "$src") ==="

  # Probe the source so the before/after numbers are comparable.
  "$FFMPEG" -hide_banner -i "$src" 2>&1 | grep -E "Duration|Stream #" || true

  "$FFMPEG" -hide_banner -y -i "$src" \
    -map 0:v:0 -map 0:a:0? \
    -vf "scale='min(${MAX_W},iw)':'min(${MAX_H},ih)':force_original_aspect_ratio=decrease,format=yuv420p" \
    "${VIDEO_OPTS[@]}" \
    -c:a aac -b:a "$AUDIO_BITRATE" -ar 48000 -ac 2 \
    -movflags +faststart \
    "$out"

  before=$(du -m "$src" | cut -f1)
  after=$(du -m "$out" | cut -f1)
  echo "done: $out  (${before} MB -> ${after} MB)"
  echo
done

echo "All done. The -web.mp4 files sit next to their sources in public/videos."
