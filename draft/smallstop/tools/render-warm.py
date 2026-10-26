"""Original code-drawn Smallstop product film and mockups. No external UI assets."""
from pathlib import Path
from functools import lru_cache
import math,sys
sys.path.insert(0,'/tmp/smallstop-render-deps')
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[3]; A=ROOT/'work/smallstop/assets'; F=ROOT/'Saans Font Trial'
INK='#24251f'; PAPER='#faf6e9'; SAGE='#a5b67d'; PALE='#e6ecd8'; PINK='#efbdd8'; BUTTER='#f3dc78'; MUTED='#686b59'
W,H=390,780
@lru_cache(None)
def font(n,b=False):return ImageFont.truetype(str(F/('SaansTRIAL-Medium.ttf' if b else 'SaansTRIAL-Regular.ttf')),n)
def text(im,xy,s,n=16,c=INK,b=False,anchor=None):ImageDraw.Draw(im).multiline_text(xy,s,font=font(n,b),fill=c,spacing=5,anchor=anchor)
def box(im,xy,c,r=22,outline=None,width=1):ImageDraw.Draw(im).rounded_rectangle(xy,r,fill=c,outline=outline,width=width)
def face(im,x,y,r=32,c=SAGE):
 d=ImageDraw.Draw(im);d.ellipse((x-r,y-r,x+r,y+r),fill=c)
 for xx in [x-r*.28,x+r*.28]:d.ellipse((xx-3,y-7,xx+3,y+1),fill=INK)
 d.arc((x-12,y-6,x+12,y+14),10,170,fill=INK,width=3)
def base():
 im=Image.new('RGB',(W,H),PAPER);text(im,(26,18),'9:41',13,b=True);box(im,(148,12,242,34),INK,12);text(im,(316,18),'•••',14)
 text(im,(26,63),'smallstop ↗',21);box(im,(145,764,245,768),INK,3);return im
def nav(im,active='Ride'):
 box(im,(20,694,370,754),INK,26)
 for i,label in enumerate(['Ride','Practice','Passport']):
  x=28+i*113
  if label==active:box(im,(x,701,x+108,747),PINK,20)
  text(im,(x+54,715),label,14,INK if label==active else PAPER,anchor='ma')
def btn(im,y,label,c=INK,press=0):
 p=round(press*4);box(im,(26+p,y+p,364-p,y+54-p),c,24);text(im,(195,y+17),label,16,PAPER if c==INK else INK,True,'ma')
def ring(im,x,y,t,at):
 q=t-at
 if 0<q<.6:
  r=12+q*32;d=ImageDraw.Draw(im);d.ellipse((x-r,y-r,x+r,y+r),outline=INK,width=2)
def route(im,y=195):
 box(im,(26,y,364,y+132),PALE,25);d=ImageDraw.Draw(im);d.ellipse((44,y+38,99,y+93),fill=SAGE);text(im,(71,y+48),'1',27,anchor='ma')
 text(im,(116,y+21),'School route',12,MUTED);text(im,(116,y+41),'79 St',35,b=True);text(im,(116,y+88),'Downtown · 4 stops',14,MUTED);text(im,(327,y+45),'↘',26)
def ui(name,t=0):
 im=base()
 if name in ['home','welcome','parent']:
  text(im,(26,113),'Let’s get ready.',34,b=True);text(im,(26,157),'A little practice before a big day.',15,MUTED);route(im)
  box(im,(26,347,364,515),PINK,25);text(im,(46,366),'01',64);text(im,(46,444),'Check the route with\nyour grown-up.',18);face(im,315,400,26,'#dda0c3')
  text(im,(28,539),'Familiar places',15,b=True);text(im,(28,567),'School   ·   Soccer   ·   Grandma’s',14,MUTED)
  btn(im,613,'Start my ride →',INK,max(0,1-abs(t-1.7)/.15));ring(im,290,639,t,1.7);nav(im)
 elif name=='practice':
  text(im,(26,113),'Spot the right sign.',31,b=True);text(im,(26,157),'Your school is downtown.',15,MUTED)
  box(im,(26,197,364,204),'#e4e4d5',4);box(im,(26,197,round(160+min(t/3,1)*204),204),SAGE,4)
  for i,(y,title,sub) in enumerate([(238,'Uptown & The Bronx ↑','Across the street'),(380,'Downtown & Brooklyn ↓','On this side')]):
   selected=i==1 and t>2;box(im,(26,y,364,y+122),PALE if selected else '#eeeadc',22, SAGE if selected else None,3);box(im,(40,y+15,350,y+68),INK,13);text(im,(54,y+32),title,17,PAPER,b=True);text(im,(44,y+87),'That’s it. Toward school.' if selected else sub,14,MUTED)
  face(im,55,555,28);text(im,(96,535),'You found it!' if t>2 else 'Take your time.',21,b=True);text(im,(96,566),'Look for the direction.',14,MUTED);btn(im,613,'Keep practicing' if t>2 else 'Check the sign');nav(im,'Practice');ring(im,298,424,t,2)
 elif name=='ride':
  count=max(0,3-int(t/1.3));text(im,(26,113),'One stop at a time.',30,b=True);text(im,(26,157),'Downtown · Local · Saved route',14,MUTED)
  box(im,(26,195,364,374),PALE,25);text(im,(48,213),str(count),100);text(im,(157,257),'stops to go' if count!=1 else 'stop to go',24,b=True);text(im,(157,302),'Get off at 79 St',15,MUTED)
  d=ImageDraw.Draw(im);d.line((49,414,49,551),fill='#ced6b7',width=5)
  for i,(y,s) in enumerate([(412,'103 St'),(457,'96 St'),(502,'86 St'),(547,'79 St')]):
   d.ellipse((41,y-8,57,y+8),fill=SAGE if i<=3-count else PAPER,outline=SAGE,width=2);text(im,(78,y-11),s,19);text(im,(330,y-7),'Here' if i==3-count else '',12,MUTED,anchor='ra')
  btn(im,591,'The doors opened' if count else 'You made it →');btn(im,656,'I need a little help',PINK);ring(im,285,618,t,1.3);ring(im,285,618,t,2.6)
 elif name=='calm':
  text(im,(26,113),'A little breathing room.',28,b=True);text(im,(26,157),'A pause is part of the journey.',15,MUTED)
  r=100+15*math.sin(t*math.pi/2);d=ImageDraw.Draw(im);d.ellipse((195-r,340-r,195+r,340+r),fill=PALE);face(im,195,340,64,SAGE)
  text(im,(195,478),'Breathe in…' if math.sin(t*math.pi/2)>0 else 'And breathe out.',28,b=True,anchor='ma');text(im,(195,526),'Stay away from the doors.\nListen for the conductor.',16,MUTED,anchor='ma');btn(im,635,'Back to my ride');
 else:
  text(im,(26,113),'Look how far you’ve come.',27,b=True);text(im,(26,155),'Your ride passport',15,MUTED);box(im,(26,195,364,302),SAGE,25);face(im,79,247,33,PAPER);text(im,(134,214),'Maya',30,b=True);text(im,(134,258),'One familiar ride at a time.',13)
  for i,(x,y,label) in enumerate([(85,378,'110 St'),(195,378,'79 St'),(305,378,'96 St'),(85,491,'72 St'),(195,491,'86 St'),(305,491,'Next')]):
   if t>=i*.25:
    p=min(1,(t-i*.25)/.3);r=43*(.8+.2*p);d=ImageDraw.Draw(im);d.ellipse((x-r,y-r,x+r,y+r),fill=[PINK,BUTTER,PALE][i%3]);text(im,(x,y-9),label,19,b=True,anchor='ma')
  text(im,(26,572),'Small wins count.',23,b=True);text(im,(26,612),'Sign spotter  ·  Calm in the tunnel',14,MUTED);nav(im,'Passport')
 return im

def device(canvas,screen,x,y,h=650,angle=0):
 w=round(h*W/H);p=Image.new('RGBA',(w+18,h+18));box(p,(0,0,w+17,h+17),INK,round(w*.13));s=screen.resize((w,h),Image.Resampling.LANCZOS);mask=Image.new('L',(w,h));box(mask,(0,0,w-1,h-1),255,round(w*.11));p.paste(s,(9,9),mask)
 if angle:p=p.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
 canvas.paste(p,(round(x),round(y)),p)
def composition(name,t=0):
 im=Image.new('RGB',(1280,800),PAPER);d=ImageDraw.Draw(im)
 if name=='intro':
  box(im,(40,200,1240,670),PALE,32);text(im,(68,55),'smallstop ↗',36);text(im,(70,257),'Big city.\nSmall steps.',67,b=True);text(im,(73,447),'A companion for\nthe way there.',23,MUTED)
  device(im,ui('practice',3),650,100+math.sin(t)*5,540,8);device(im,ui('home',0),880,139-math.sin(t)*5,550,-8)
  text(im,(73,718),'Prepare together. Practice a little. Find your feet.',19,MUTED)
 else:
  titles={'practice':('01 / Practice','A familiar sign.\nA little more sure.','Try the decision before the platform.'),'ride':('02 / Ride','Less to read.\nMore room to notice.','One route. One stop. One next action.'),'calm':('03 / Reassure','A pause.\nA breath.\nBack to your ride.','Help stays close, without losing your place.'),'passport':('04 / Grow','Small wins.\nA growing world.','Collect familiarity, one station at a time.')}
  label,title,sub=titles[name];bg={'practice':PALE,'ride':BUTTER,'calm':PINK,'passport':PALE}[name];box(im,(620,45,1230,755),bg,32)
  text(im,(65,55),'smallstop ↗',30);text(im,(65,195),label,16,MUTED);text(im,(62,250),title,54,b=True);text(im,(65,485),sub,18,MUTED);text(im,(65,700),'A familiar journey, at your pace.',16,MUTED)
  device(im,ui(name,t),750,63,660,0)
  for i,n in enumerate(['practice','ride','calm','passport']):box(im,(65+i*66,638,111+i*66,643),INK if n==name else '#d4d8c6',2)
 return im

def encode(name,fn,seconds,size):
 out=imageio_ffmpeg.write_frames(str(A/name),size,fps=24,codec='libx264',pix_fmt_in='rgb24',pix_fmt_out='yuv420p',quality=8,macro_block_size=2,output_params=['-movflags','+faststart','-preset','fast']);out.send(None)
 for i in range(round(seconds*24)):out.send(fn(i/24).convert('RGB').tobytes())
 out.close();print(name,flush=True)
if __name__=='__main__':
 for name in ['home','welcome','practice','ride','calm','passport','parent','arrived']:
  ui(name,3 if name=='practice' else .9).save(A/f'warm-{name}.jpg',quality=95)
  encode(f'warm-{name}.mp4',lambda t,n=name:ui(n,t),5,(W,H))
 scenes=['intro','practice','ride','calm','passport'];duration=5
 def movie(t):
  index=min(4,int(t/duration));local=t%duration;im=composition(scenes[index],local)
  if local>4.55:
   p=(local-4.55)/.45;p=p*p*(3-2*p);im=Image.blend(im,composition(scenes[(index+1)%5],0),p)
  return im
 encode('smallstop-film.mp4',movie,25,(1280,800));composition('intro',0).save(A/'smallstop-film-poster.jpg',quality=95);composition('intro',0).save(A/'warm-cover.jpg',quality=95)
 board=Image.new('RGB',(1200,1000),PALE);text(board,(55,50),'One companion. Every step.',43,b=True);device(board,ui('home'),90,170,690,-5);device(board,ui('practice',3),440,210,690,4);device(board,ui('passport',3),790,165,690,-3);board.save(A/'warm-design-board.jpg',quality=95)
 print('All warm assets complete',flush=True)
