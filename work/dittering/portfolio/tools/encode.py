from pathlib import Path
import subprocess,sys
try:
 import imageio_ffmpeg
except ImportError:
 sys.path.insert(0,'/tmp/squint-video-deps')
import imageio_ffmpeg
r=Path(__file__).resolve().parents[1]
for d in sorted((r/'video/frames').iterdir()):
 if len(list(d.glob('*.jpg')))!=144: continue
 if len(sys.argv)>1 and d.name not in sys.argv[1:]: continue
 subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error','-framerate','24','-i',str(d/'%04d.jpg'),'-c:v','libx264','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(r/'video'/f'{d.name}.mp4')],check=True)
 print(d.name,flush=True)
