"""Frame-rendered UI motion studies based on Ride Ready's Figma components.
All counters, selections, button responses, breathing and stamps animate independently.
Run with Pillow and imageio-ffmpeg available. Assets remain local.
"""
import math,sys
from functools import lru_cache
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[3];A=ROOT/'work/smallstop/assets';F=ROOT/'Saans Font Trial'
W,H=390,844
INK='#1b1b1f';MUTED='#6e685c';YELLOW='#ffcf55';RED='#ee352e';GREEN='#00933c'
@lru_cache(None)
def font(size,bold=False):return ImageFont.truetype(str(F/('SaansTRIAL-Bold.ttf' if bold else 'SaansTRIAL-Regular.ttf')),size)
def txt(im,xy,s,size=16,color=INK,bold=False,anchor=None):ImageDraw.Draw(im).multiline_text(xy,s,font=font(size,bold),fill=color,spacing=4,anchor=anchor)
def rr(im,box,fill,r=18,outline=None,width=1):
 if isinstance(fill,str) and len(fill)==9:
  from PIL import ImageColor
  lay=Image.new('RGBA',im.size);ImageDraw.Draw(lay).rounded_rectangle(box,r,ImageColor.getrgb(fill),outline,width);im.paste(lay,(0,0),lay)
 else:ImageDraw.Draw(im).rounded_rectangle(box,r,fill,outline,width)
def dot(im,xy,size=60,mood='happy',rotation=0):
 art=DOT[mood].resize((round(size),round(size)),Image.Resampling.LANCZOS)
 if rotation:art=art.rotate(rotation,Image.Resampling.BICUBIC,expand=True)
 im.paste(art,(round(xy[0]-art.width/2),round(xy[1]-art.height/2)),art)
ICONS={n:Image.open(A/f'icon-{n}.png').convert('RGBA') for n in ['ride','practice','passport']}
DOT={m:Image.open(A/f'dot-{m}.png').convert('RGBA') for m in ['happy','calm','cheer']}
def gradient(top,bottom):
 from PIL import ImageColor
 a=ImageColor.getrgb(top);b=ImageColor.getrgb(bottom);im=Image.new('RGB',(W,H));d=ImageDraw.Draw(im)
 for y in range(H):d.line((0,y,W,y),fill=tuple(round(a[i]+(b[i]-a[i])*y/H) for i in range(3)))
 return im
LIGHT=gradient('#fff3d6','#ffede6');DARK=gradient('#252f6a','#19142e')
def base(dark=False):
 im=(DARK if dark else LIGHT).copy();col='#ffffff' if dark else INK
 txt(im,(32,15),'8:02',16,col,True);d=ImageDraw.Draw(im)
 for x,h in [(300,5),(305,8),(310,12),(315,15)]:d.rectangle((x,30-h,x+2,30),fill=col)
 rr(im,(335,18,360,30),None,3,col);rr(im,(338,21,354,27),col,1);d.rectangle((362,22,364,26),fill=col)
 rr(im,(128,830,262,835),col,3)
 return im

def button(im,y,label,kind='primary',pressed=0):
 colors={'primary':('#282831','#ffffff'),'go':('#009f44','#ffffff'),'help':('#ff6b25','#ffffff'),'light':('#fff9ed',INK)}
 bg,fg=colors[kind];x=24+pressed*5;w=342-pressed*10
 rr(im,(x,y+pressed*2,x+w,y+60-pressed*2),bg,18)
 txt(im,(195,y+18),label,18,fg,True,'ma')
def press(t,at):return max(0,1-abs(t-at)/.16)
def tap(im,x,y,t,at):
 q=t-at
 if -.3<q<.5:
  alpha=max(0,1-abs(q)/.5);r=13+max(0,q)*35
  lay=Image.new('RGBA',im.size);d=ImageDraw.Draw(lay);d.ellipse((x-r,y-r,x+r,y+r),fill=(255,255,255,int(60*alpha)),outline=(20,40,62,int(140*alpha)),width=2);im.paste(lay,(0,0),lay)
def bullet(im,x,y,n='1',size=40):
 ImageDraw.Draw(im).ellipse((x,y,x+size,y+size),fill=RED);txt(im,(x+size/2,y+size*.16),n,int(size*.6),'white',True,'ma')
def transition(a,b,p):
 p=max(0,min(1,p));e=1-(1-p)**3;x=round(W*e);im=Image.new('RGB',(W,H));im.paste(a,(-round(x*.22),0));im.paste(b,(W-x,0));return im

def home_static(t=0):
 im=base();txt(im,(24,62),'Good morning,',16,MUTED);txt(im,(24,85),'Maya',32,INK,True);dot(im,(338,88),56)
 rr(im,(24,133,366,409),'white',24);rr(im,(44,153,171,182),'#ffe3a3',15);txt(im,(56,159),'TODAY · SCHOOL',11,INK,True)
 bullet(im,44,201,size=60);txt(im,(118,199),'To 79 St',27,INK,True);txt(im,(118,235),'Leave by 7:40 · about 18 min\ndoor to door',13,MUTED)
 txt(im,(44,282),'● Good service on the 1 right now',13,GREEN)
 for x in range(44,346,12):ImageDraw.Draw(im).line((x,313,x+6,313),fill='#c9bfaa',width=2)
 # Ticket notches travel with the perforation.
 for x in [24,366]:ImageDraw.Draw(im).ellipse((x-12,301,x+12,325),fill='#fff5e4')
 p=press(t,1.6);rr(im,(44+p*4,332+p*2,346-p*4,392-p*2),GREEN,18);txt(im,(195,350),'Start my ride',18,'white',True,'ma')
 rr(im,(24,429,366,515),'white',22);rr(im,(40,447,81,489),'#ffe3a3',12);art=ICONS['ride'].resize((24,24));im.paste(art,(48,455),art);txt(im,(96,445),'My rides',17,INK,True);txt(im,(96,471),'School, soccer, Grandma’s',13,MUTED)
 rr(im,(24,535,366,637),'white',24);txt(im,(44,551),'Route Quest',18,INK,True);txt(im,(44,580),'5 of 6 levels done',13,MUTED);rr(im,(44,607,346,615),'#efe7d7',4);rr(im,(44,607,296,615),'#63bf83',4)
 button(im,664,'Uh-oh! I need help','help');txt(im,(195,734),'Works underground, even with no signal.',12,MUTED,anchor='ma')
 tabs(im,'My Ride');tap(im,293,362,t,1.6);return im

def tabs(im,active):
 rr(im,(0,758,390,844),'#fffaf7',24)
 for x,label,icon in [(65,'My Ride','ride'),(195,'Practice','practice'),(325,'Passport','passport')]:
  if label==active:rr(im,(x-30,769,x+30,800),'#eee9e6',18)
  art=ICONS[icon].resize((24,24));im.paste(art,(x-12,773),art);txt(im,(x,805),label,11,INK if label==active else '#8f897c',label==active,'ma')
 rr(im,(128,830,262,835),INK,3)

def welcome(t):
 im=base();d=ImageDraw.Draw(im)
 for y,c in [(275,RED),(325,'#0039a6'),(375,GREEN)]:
  d.line((-30,y+60,420,y-20),fill=c,width=24)
  for x in [60,320]:d.ellipse((x-7,y+44-x*.17,x+7,y+58-x*.17),fill='white',outline=INK,width=3)
 dot(im,(195,309+math.sin(t*2)*3),150,'happy',math.sin(t*2)*3)
 txt(im,(195,406),'Hi! I’m Dot.',38,INK,True,'ma');txt(im,(195,465),'I’ll help you learn your subway rides,\none step at a time, until you can\ndo them all by yourself.',17,MUTED,anchor='ma')
 button(im,726,'Let’s set it up',pressed=press(t,2));txt(im,(195,800),'Set it up with a grown-up.',13,MUTED,anchor='ma');tap(im,295,754,t,2)
 if t>2.15:return transition(im,home_static(),(t-2.15)/.45)
 return im

def practice(t):
 im=base();d=ImageDraw.Draw(im);d.line((70,73,354,73),fill='#ded7c5',width=6);d.line((70,73,212+max(0,min(1,(t-5)/.4))*70,73),fill='#0039a6',width=6)
 for x in [70,141,212,283,354]:d.ellipse((x-6,67,x+6,79),fill='#0039a6' if x<=212 else '#fff',outline='#c9bfaa')
 dot(im,(212+max(0,min(1,(t-5)/.4))*70,73),30);txt(im,(62,97),'LEVEL 2 · QUESTION 3 OF 5',11,MUTED,True)
 dot(im,(52,153),54);txt(im,(92,133),'Your school is downtown,\ntoward Brooklyn.',16,MUTED);txt(im,(24,200),'Which stairs do you\ntake?',28,INK,True)
 correct=t>3;wrong=1.4<t<2.4
 shake=round(math.sin((t-1.4)*45)*5*max(0,1-(t-1.4)/.4)) if 1.4<t<1.8 else 0
 for y,label,sub,x in [(286,'Uptown & The Bronx','Station entrance across the street',shake),(448,'Downtown & Brooklyn','Entrance on this side of the street',0)]:
  selected=correct and y==448
  rr(im,(24+x,y,366+x,y+140),'#e9f6ed' if selected else 'white',24,GREEN if selected else '#fff',3)
  rr(im,(44+x,y+20,346+x,y+73),INK,11);bullet(im,58+x,y+32,size=28);txt(im,(97+x,y+37),label,16,'white',True)
  txt(im,(44+x,y+93),'Yes! These stairs go toward school.' if selected else sub,13,GREEN if selected else MUTED,selected)
 if wrong:txt(im,(195,612),'Try again. Look for Downtown.',14,'#b44827',True,'ma')
 elif correct:
  dot(im,(51,678),45+math.sin(min(1,(t-3)/.35)*math.pi)*6,'cheer');rr(im,(87,641,366,715),'white',20);txt(im,(103,655),'You’ve got it! Always read\nthe direction on the sign.',14)
 else:txt(im,(195,651),'Look at the direction, not just the number.',13,MUTED,anchor='ma')
 button(im,744,'Next question' if correct else 'Choose your answer',pressed=press(t,5));tap(im,290,338,t,1.4);tap(im,289,500,t,3);tap(im,286,774,t,5)
 if t>5.35:return transition(im,ride(0),(t-5.35)/.5)
 return im

def ride(t):
 if t>6.6:return transition(ride(6.5),arrived(max(0,t-7)),(t-6.6)/.5)
 im=base(True);rr(im,(24,59,204,98),'#ffffff20',20);bullet(im,30,65,size=28);txt(im,(67,70),'Downtown · Local',13,'white',True);txt(im,(288,73),'STEP 3 OF 4',11,'#bac3e2',True)
 stage=min(3,max(0,int((t+.2)/2)));count=3-stage
 led=['96 ST','86 ST','79 ST','79 ST'][stage];rr(im,(24,115,366,159),'#0c0d10',12,'#45444a',2);txt(im,(42,128),('● NEXT STOP · ' if count else '● YOU’RE HERE · ')+led,14,'#ffab26',True)
 rr(im,(24,176,140,325),'#ffffff12',18)
 # Roll each number in a clipped window rather than dissolve whole screens.
 layer=Image.new('RGBA',(116,149));ld=ImageDraw.Draw(layer);u=(t+.2)%2;progress=min(1,u/.32);e=1-(1-progress)**3
 if stage>0 and progress<1:
  ld.text((58,14-round(e*149)),str(count+1),font=font(100,True),fill='white',anchor='ma');ld.text((58,163-round(e*149)),str(count),font=font(100,True),fill='white',anchor='ma')
 else:ld.text((58,14),str(count),font=font(100,True),fill='white',anchor='ma')
 im.paste(layer,(24,176),layer);txt(im,(157,202),'stop to go' if count==1 else 'stops to go' if count else 'you made it!',24,'white',True);txt(im,(157,243),'Get off at 79 St',15,'#bac3d9');dot(im,(178,288),42,'calm')
 d=ImageDraw.Draw(im);d.line((38,353,38,511),fill=RED,width=7)
 for i,(y,label) in enumerate([(353,'103 St'),(405,'96 St'),(457,'86 St'),(509,'79 St')]):
  passed=i<=stage;d.ellipse((29,y-9,47,y+9),fill=RED if passed else '#20234c',outline=RED,width=4);txt(im,(68,y-12),label,18,'#8991b3' if passed else 'white',i==stage+1)
  if i==stage+1:rr(im,(315,y-13,366,y+14),'#ffbc00',14);txt(im,(341,y-6),'NEXT',10,INK,True,'ma')
 rr(im,(24,548,366,635),'#ffffff16',18);txt(im,(40,565),'No signal in the tunnel? Tap below\neach time the doors open, and Dot\nkeeps count.',14,'#c6c9e0')
 p=max(press(t,a) for a in [1.8,3.8,5.8]);button(im,685,'The doors opened','light',p);button(im,760,'Uh-oh','help')
 for a in [1.8,3.8,5.8]:tap(im,299,715,t,a)
 return im

def calm(t):
 im=base(True);txt(im,(28,65),'‹  Uh-oh',15,'#b9c3dc',True)
 u=(t%8)/8;e=(1-math.cos(u*2*math.pi))/2;r=74+e*34;d=ImageDraw.Draw(im)
 for angle in range(0,360,7):
  a=angle*math.pi/180;x=195+111*math.cos(a);y=215+111*math.sin(a);d.ellipse((x-1,y-1,x+1,y+1),fill='#737fb5')
 d.ellipse((195-r,215-r,195+r,215+r),fill='#394780');dot(im,(195,215),82+e*10,'calm')
 txt(im,(195,349),'Breathe in with Dot…' if u<.5 else '…and slowly breathe out.',15,'#c3cbe2',anchor='ma')
 txt(im,(195,389),'The train stopped in\nthe tunnel.',26,'white',True,'ma');txt(im,(195,465),'This happens a lot. It’s usually train\ntraffic ahead, and it moves again soon.',15,'#c0c6df',anchor='ma')
 rr(im,(24,530,366,659),'white',24);txt(im,(44,551),'1.  Stay on the train. Keep away\n     from the doors.\n2.  Listen for the conductor’s\n     announcement.',14,INK)
 rr(im,(61,682,329,721),'#ffffff12',20);txt(im,(195,694),'Saved guidance · available offline',12,'white',True,'ma')
 button(im,760,'The train is moving again','light',press(t,9));tap(im,299,790,t,9)
 if t>9.2:return transition(im,ride(0),(t-9.2)/.5)
 return im

def stamp(im,cx,cy,label,small,scale=1,angle=-8):
 side=150;lay=Image.new('RGBA',(side,side));d=ImageDraw.Draw(lay)
 for a in range(0,360,14):d.arc((7,7,143,143),a,a+8,fill=RED,width=3)
 d.text((75,52),label,font=font(25,True),fill=RED,anchor='ma');d.text((75,87),small,font=font(8,True),fill=RED,anchor='ma')
 lay=lay.resize((max(1,round(side*scale)),max(1,round(side*scale))),Image.Resampling.LANCZOS).rotate(angle,Image.Resampling.BICUBIC,expand=True);im.paste(lay,(round(cx-lay.width/2),round(cy-lay.height/2)),lay)

def arrived(t):
 im=base();dot(im,(195,145),105,'cheer',math.sin(min(t,1)*math.pi*2)*5*max(0,1-t));txt(im,(195,229),'You made it!',36,INK,True,'ma');txt(im,(195,281),'Hello, 79 St. Hello, school.',17,MUTED,anchor='ma')
 rr(im,(24,329,366,598),'white',24)
 q=max(0,min(1,(t-.35)/.55));scale=1+.28*math.exp(-q*5)*math.cos(q*12)
 if t>.35:stamp(im,195,450,'79 St','SCHOOL · NEW STAMP',scale,-8+12*(1-q))
 txt(im,(195,562),'A new stop in your passport.',14,MUTED,anchor='ma')
 if t>1.2:
  q=min(1,(t-1.2)/.3);dy=round(12*(1-q));rr(im,(66,624+dy,324,676+dy),'#ffe3a3',22);txt(im,(195,641+dy),'One more ride. One more win.',13,INK,True,'ma')
 button(im,744,'Open my passport',pressed=press(t,3.2));tap(im,290,775,t,3.2)
 if t>3.4:return transition(im,passport(t-3.8),(t-3.4)/.4)
 return im

def passport(t):
 im=base();txt(im,(24,63),'My Ride Passport',28,INK,True);rr(im,(24,110,366,234),'#164ab4',24);dot(im,(78,170),65);txt(im,(125,129),'RIDER ID · NYC',10,'#d3e4ff');txt(im,(125,150),'Maya',26,'white',True);txt(im,(125,188),'Smallstop explorer',13,'white');txt(im,(24,261),'STATION STAMPS',11,MUTED,True)
 for i,(x,y,label,sub) in enumerate([(76,345,'110 St','HOME'),(195,345,'79 St','SCHOOL'),(314,345,'96 St','EXPLORER'),(76,465,'72 St','UH-OH HERO'),(195,465,'86 St','SOCCER')]):
  q=max(0,min(1,(t-i*.22)/.45));scale=.63+(.13*math.sin(q*math.pi)) if q<1 else .63
  if t>i*.22:stamp(im,x,y,label,sub,scale,(-1 if i%2 else 1)*8)
 txt(im,(24,551),'LITTLE WINS',11,MUTED,True)
 for i,(y,label) in enumerate([(584,'First solo ride'),(637,'Calm in the tunnel')]):
  q=min(1,max(0,(t-1.5-i*.25)/.35));dy=round((1-q)*10)
  if q:rr(im,(24,y+dy,310,y+43+dy),'#ffe3a3',22);txt(im,(44,y+12+dy),label,14,INK,True)
 tabs(im,'Passport');return im

def home(t):
 if t<2:return home_static(t)
 return transition(home_static(1.9),ride(max(0,t-2.45)),(t-2)/.45)

def parent(t):
 im=base();bg=gradient('#faf8f1','#e7edf7');bg.paste(im.crop((0,0,390,45)),(0,0));im=bg
 rr(im,(24,59,258,84),INK,14);txt(im,(36,65),'GROWN-UP VIEW · RIDE REQUEST',10,'white',True)
 txt(im,(24,106),'Maya wants to ride to\nPriya’s house',27,INK,True)
 rr(im,(24,181,366,281),'white',24);rr(im,(42,199,82,239),'#ffe3a3',20);txt(im,(62,210),'M',16,INK,True,'ma');txt(im,(94,199),'Maya says',11,MUTED,True);txt(im,(94,221),'“Can I go to Priya’s to finish\nour science project?”',15)
 for x,a,b in [(24,'Saturday','2:00 PM'),(141,'About','10 min'),(258,'Route','New')]:
  rr(im,(x,297,x+108,361),'white',18);txt(im,(x+14,309),a,12,MUTED);txt(im,(x+14,330),b,17,INK,True)
 rr(im,(24,378,366,592),'white',24);bullet(im,42,396);txt(im,(94,408),'Downtown 1 train · 2 stops',16,INK,True)
 d=ImageDraw.Draw(im);d.line((55,463,55,560),fill=RED,width=7)
 for y,a,b in [(463,'110 St','Home'),(511,'103 St',''),(560,'96 St','Priya’s house · 2 blocks')]:
  d.ellipse((44,y-11,66,y+11),fill=RED if y!=511 else 'white',outline=RED,width=3);txt(im,(84,y-14),a,17,INK,True)
  if b:txt(im,(84,y+7),b,11,MUTED)
 dot(im,(51,643),50);rr(im,(87,613,366,684),'white',20);txt(im,(103,626),'This is a new route. Try a\npractice ride together first.',14)
 button(im,704,'Approve ride','go');rr(im,(24,775,190,827),'#fff9ed',18);rr(im,(201,775,366,827),'#fff9ed',18)
 p=press(t,2.3);rr(im,(24+p*4,775+p*2,190-p*4,827-p*2),'#fff9ed',18,'#d9cbae');txt(im,(107,793),'Practice first',16,INK,True,'ma');txt(im,(284,793),'Not this time',16,INK,True,'ma');tap(im,122,799,t,2.3)
 if t>2.55:
  next=base();dot(next,(195,170),110,'cheer');txt(next,(195,270),'One ride, together.',31,INK,True,'ma');txt(next,(195,322),'A new route. A familiar grown-up.\nA chance to practice before going solo.',16,MUTED,anchor='ma')
  rr(next,(24,411,366,575),'white',24);txt(next,(44,434),'PRACTICE RIDE PLANNED',11,GREEN,True);txt(next,(44,468),'Saturday · 2:00 PM',23,INK,True);txt(next,(44,511),'110 St → 96 St\nTo Priya’s house with Mom',15,MUTED);button(next,742,'Back to my rides')
  return transition(im,next,(t-2.55)/.45)
 return im

FEATURES={'parent':(parent,7),'welcome':(welcome,5),'home':(home,8),'practice':(practice,7),'ride':(ride,9),'calm':(calm,11),'passport':(passport,6),'arrived':(arrived,6)}
def writer(name,size):
 out=imageio_ffmpeg.write_frames(str(A/name),size,fps=30,codec='libx264',quality=8,macro_block_size=2,pix_fmt_in='rgb24',pix_fmt_out='yuv420p',output_params=['-movflags','+faststart','-preset','fast']);out.send(None);return out
for name,(fn,seconds) in FEATURES.items():
 if len(sys.argv)>1 and name!=sys.argv[1]:continue
 out=writer('feature-'+name+'.mp4',(W,H));fn(.8).save(A/('feature-'+name+'.jpg'),quality=94)
 for i in range(seconds*30):out.send(fn(i/30).tobytes())
 out.close();print('Rendered microinteractions:',name,flush=True)

if len(sys.argv)>1 and sys.argv[1]!='films':sys.exit(0)

# Compose the same moving UI, not a sequence of still images, into editorial films.
SCENES=[('welcome','Meet your\ntravel buddy.','A familiar face, from the first hello.'),('practice','Practice here.\nFeel ready\nout there.','Recognize the sign. Choose a direction.'),('ride','Three. Two.\nYour stop.','A tap, a rolling counter, a clear next step.'),('calm','A pause.\nA breath.\nYou’ve got this.','A breathing cue that grows and settles.'),('arrived','A small win.\nA big feeling.','A stamp lands. Confidence grows.')]
def layout(name,title,sub,t,dark=False):
 bg='#14283e' if dark else '#e8edf0';fg='#faf9f5' if dark else '#14283e';im=Image.new('RGB',(1200,800),bg)
 txt(im,(65,53),'smallstop',32,fg,True);txt(im,(65,210),title,59,fg,True);txt(im,(68,460),sub,17,'#c0cbd3' if dark else '#526577');txt(im,(68,730),'SMALL STEPS. BIG CITY.',11,fg)
 rr(im,(744,63,1050,743),'#242a31',42);screen=FEATURES[name][0](t).resize((284,615),Image.Resampling.LANCZOS);mask=Image.new('L',(284,615));ImageDraw.Draw(mask).rounded_rectangle((0,0,283,614),32,fill=255);im.paste(screen,(755,94),mask)
 for i,label in enumerate(['LEARN','RIDE','GROW']):
  x=68+i*120;rr(im,(x,630,x+100,665),'#ffcf55' if i==(0 if name in ['welcome','practice'] else 1 if name in ['ride','calm'] else 2) else '#ffffff20',18);txt(im,(x+15,641),label,10,fg,True)
 return im
out=writer('journey.mp4',(1200,800))
for name,title,sub in SCENES:
 duration=FEATURES[name][1]
 for i in range(duration*30):out.send(layout(name,title,sub,i/30).tobytes())
out.close();layout(*SCENES[1],.8).save(A/'journey-poster.jpg',quality=94);layout(*SCENES[0],.8).save(A/'cover.jpg',quality=94)
out=writer('calm.mp4',(1200,800))
for i in range(11*30):out.send(layout(*SCENES[3],i/30,True).tobytes())
out.close();layout(*SCENES[3],.8,True).save(A/'calm-poster.jpg',quality=94)
print('Rendered editorial feature films.',flush=True)
