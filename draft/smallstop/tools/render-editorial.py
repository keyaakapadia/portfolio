import sys,subprocess
sys.path.insert(0,'/tmp/smallstop-render-deps')
import imageio_ffmpeg
f=imageio_ffmpeg.get_ffmpeg_exe()
a='/Users/keyaa/Desktop/portfolio/work/smallstop/assets/'
args=[f,'-y','-loop','1','-i',a+'handheld-editorial.png','-loop','1','-i',a+'pain-paper.png','-i',a+'warm-practice.mp4']
filters="[0:v]scale=1400:-1,crop=1280:800,zoompan=z='1+0.00035*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=144:s=1280x800:fps=24,trim=duration=6,settb=1/24,setpts=N,fps=24[a];[1:v]scale=1400:-1,crop=1280:800,zoompan=z='1+0.0003*on':d=72:s=1280x800:fps=24,trim=duration=3,settb=1/24,setpts=N,fps=24[b];[2:v]scale=-2:720,pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0xfaf6e9,fps=24,trim=duration=4,settb=1/24,setpts=N,fps=24[c];[a][b]xfade=transition=fade:duration=0.6:offset=5.4[ab];[ab][c]xfade=transition=fade:duration=0.6:offset=7.8,format=yuv420p[v]"
subprocess.run(args+['-filter_complex',filters,'-map','[v]','-an','-c:v','libx264','-preset','fast','-crf','22','-movflags','+faststart',a+'editorial-film.mp4'],check=True)
