@echo off
rem Compress the SolaHome project videos into a web-safe MP4.
rem
rem   Double-click this file, or run it from cmd:
rem     scripts\compress-videos.bat
rem
rem Output is written next to each source as "<name>-web.mp4".
rem The source files are never modified.
rem
rem Web profile: MP4 / H.264 / yuv420p / max 1920x1080 (no upscale) /
rem CRF 23 / preset slow / AAC 128 kbps 48 kHz / +faststart.
rem
rem Encoder: libx264 when the ffmpeg build has it, otherwise h264_nvenc
rem (NVIDIA). See scripts/compress-videos.sh for the Git Bash version.
setlocal enabledelayedexpansion

set "VIDEOS_DIR=%~dp0..\public\videos"
set "MAX_W=1920"
set "MAX_H=1080"
set "CRF=23"
set "PRESET=slow"
set "AUDIO_BITRATE=128k"

rem 1. ffmpeg on PATH, 2. the build bundled with JianyingPro (CapCut).
set "FFMPEG="
for /f "delims=" %%i in ('where ffmpeg 2^>nul') do (
  if not defined FFMPEG set "FFMPEG=%%i"
)
if not defined FFMPEG (
  if exist "D:\JianyingPro\11.3.0.14362\ffmpeg.exe" set "FFMPEG=D:\JianyingPro\11.3.0.14362\ffmpeg.exe"
)
if not defined FFMPEG (
  if exist "C:\Program Files\JianyingPro\ffmpeg.exe" set "FFMPEG=C:\Program Files\JianyingPro\ffmpeg.exe"
)
if not defined FFMPEG (
  echo ffmpeg not found. Install it or edit FFMPEG in this script.
  exit /b 1
)

echo ffmpeg: %FFMPEG%

rem Pick an H.264 encoder this build actually has.
set "ENCFILE=%TEMP%\ff_encoders_%RANDOM%.txt"
"%FFMPEG%" -hide_banner -encoders > "%ENCFILE%" 2>&1
set "ENC="
findstr /C:"libx264" "%ENCFILE%" >nul && set "ENC=libx264"
if not defined ENC findstr /C:"h264_nvenc" "%ENCFILE%" >nul && set "ENC=h264_nvenc"
del /q "%ENCFILE%" >nul 2>&1

if not defined ENC (
  echo.
  echo This ffmpeg build has no H.264 encoder ^(no libx264, no h264_nvenc^).
  echo Install a full build and re-run, e.g.  winget install --id Gyan.FFmpeg -e
  exit /b 1
)
echo encoder: !ENC!
echo.

call :compress "%VIDEOS_DIR%\越南-胡志明-项目2.mp4"
call :compress "%VIDEOS_DIR%\越南-胡志明市.mp4"
call :compress "%VIDEOS_DIR%\越南河内案例视频.mp4"

echo.
echo All done. The -web.mp4 files sit next to their sources in public\videos.
exit /b 0

:compress
set "SRC=%~1"
if not exist "%SRC%" (
  echo skip ^(not found^): %SRC%
  exit /b 0
)
set "OUT=%~dpn1-web.mp4"
echo === %~nx1 ===
if /i "!ENC!"=="libx264" (
  set "VOPTS=-c:v libx264 -profile:v high -level 4.1 -preset %PRESET% -crf %CRF%"
) else (
  set "VOPTS=-c:v h264_nvenc -preset p5 -tune hq -rc vbr -cq %CRF% -b:v 0 -profile:v high"
)
"%FFMPEG%" -hide_banner -y -i "%SRC%" ^
  -map 0:v:0 -map 0:a:0? ^
  -vf "scale='min(%MAX_W%,iw)':'min(%MAX_H%,ih)':force_original_aspect_ratio=decrease,format=yuv420p" ^
  !VOPTS! ^
  -c:a aac -b:a %AUDIO_BITRATE% -ar 48000 -ac 2 ^
  -movflags +faststart ^
  "%OUT%"
if errorlevel 1 (
  echo FAILED: %SRC%
  exit /b 1
)
echo done: %OUT%
echo.
exit /b 0
