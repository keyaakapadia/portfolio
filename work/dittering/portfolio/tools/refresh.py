from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import numpy as np, math, sys
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
R=Path(__file__).resolve().parents[1]
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
MONO='/System/Library/Fonts/Menlo.ttc'
def font(s,b=False): return ImageFont.truetype(BOLD if b else MONO,s)
posters=[Image.open(p).convert('RGB') for p in sorted((R/'posters').glob('*.png'))]
files=sorted((R/'posters').glob('*.png'))
# A new editorial edition: generous margins, large typography, full artwork, quiet folios.
PW,PH=1000,1418
pages=[]
for i in range(16):
 bg='#f1efe8' if i%4!=0 else '#121214'
 im=Image.new('RGB',(PW,PH),bg); d=ImageDraw.Draw(im); fg='#121214' if bg!='#121214' else '#f1efe8'
 d.text((58,38),'SQUINT / FIELD NOTES',font=font(15),fill=fg)
 d.line((58,76,942,76),fill=fg,width=1)
 if i==0:
  d.text((52,125),'Less picture.',font=font(112,True),fill=fg)
  d.text((52,246),'Same feeling.',font=font(105,True),fill='#ff5a36')
  art=posters[12].copy(); art.thumbnail((884,760)); im.paste(art,((PW-art.width)//2,450))
  d.text((58,1290),'01 / STUDIES IN COLOUR & RESOLUTION',font=font(20),fill=fg)
 elif i==1:
  for j,line in enumerate(['Look closer.', 'Then take', 'something away.']): d.text((54,140+j*112),line,font=font(89,True),fill=fg)
  lines=['A photograph becomes a grid.','The grid becomes a handful of colours.','What survives is the feeling.', '', 'Thirteen studies from Squint:', 'a tool for finding how little a picture needs.']
  for j,line in enumerate(lines): d.text((58,590+j*42),line,font=font(25),fill=fg)
  for j,col in enumerate(['#121214','#6a7bff','#ff7ac8','#ff5a36','#ffc21a','#2fd3b5']): d.rectangle((58+j*147,1090,205+j*147,1235),fill=col)
 elif i==15:
  for j,line in enumerate(['Keep the', 'feeling.']): d.text((52,170+j*170),line,font=font(145,True),fill='#ff5a36')
  d.text((58,850),'LOOK / COUNT / NAME / SQUASH / PRINT',font=font(23),fill=fg)
  d.text((58,1180),'CONCEPT, DESIGN & BUILD',font=font(18),fill=fg)
  d.text((58,1220),'Keya Kapadia / 2026',font=font(30,True),fill=fg)
 else:
  k=i-2; title=files[k].stem.split('-',1)[1].replace('-',' ').title()
  d.text((58,109),f'{k+1:02d}',font=font(75,True),fill='#ff5a36')
  d.text((58,211),title,font=font(43,True),fill=fg)
  art=posters[k].copy(); art.thumbnail((884,980)); im.paste(art,((PW-art.width)//2,315+(980-art.height)//2))
 d.line((58,1348,942,1348),fill=fg,width=1)
 d.text((58,1370),'SQUINT.PICTURE',font=font(14),fill=fg)
 d.text((900,1370),f'{i+1:02d}',font=font(14),fill=fg)
 im.save(R/'zine'/f'page-{i+1:02d}.png'); pages.append(im)
for spread in [False,True]:
 c=canvas.Canvas(str(R/'zine'/('squint-zine-spreads.pdf' if spread else 'squint-zine-reading.pdf')),pagesize=((PW*2 if spread else PW)*.42,PH*.42))
 c.setTitle('Squint - Field Notes / 2026'); c.setAuthor('Keya Kapadia')
 for i in range(0,16,2 if spread else 1):
  c.drawImage(ImageReader(pages[i]),0,0,PW*.42,PH*.42)
  if spread: c.drawImage(ImageReader(pages[i+1]),PW*.42,0,PW*.42,PH*.42)
  c.showPage()
 c.save()
# Motion scenes, rendered from the original artwork with perspective and material shading.
if '--zine-only' in sys.argv: sys.exit(0)
W,H=1200,800
Y,X=np.mgrid[0:H,0:W]
def background(color):
 a=np.array(Image.new('RGB',(W,H),color)).astype(float)
 light=(1-((X-W*.34)**2/(W*1.1)**2+(Y-H*.25)**2/(H*1.2)**2))*18-12
 return Image.fromarray(np.uint8(np.clip(a+light[:,:,None],0,255))).convert('RGBA')
def card(scene,art,cx,cy,w,h,angle=0,tilt=0,frame=0):
 # Project a physical card, with an off-axis view and a soft contact shadow.
 tex=art.resize((int(w),int(h)),Image.Resampling.LANCZOS).convert('RGBA')
 if frame:
  f=Image.new('RGBA',(int(w)+frame*2,int(h)+frame*2),'#242426'); f.paste(tex,(frame,frame)); tex=f
 tw,th=tex.size
 pts=np.array([[0,0],[tw,0],[tw,th],[0,th]],float)
 dest=np.array([[cx-w/2,cy-h/2+tilt],[cx+w/2,cy-h/2-tilt],[cx+w/2,cy+h/2+tilt],[cx-w/2,cy+h/2-tilt]])
 a=math.radians(angle); rot=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])
 dest=(dest-[cx,cy])@rot.T+[cx,cy]
 mat=[];rhs=[]
 for (u,v),(xx,yy) in zip(pts,dest):
  mat.extend([[xx,yy,1,0,0,0,-u*xx,-u*yy],[0,0,0,xx,yy,1,-v*xx,-v*yy]]);rhs.extend([u,v])
 coeff=np.linalg.solve(mat,rhs)
 layer=tex.transform((W,H),Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)
 shadow=Image.new('RGBA',(W,H)); sd=ImageDraw.Draw(shadow); sd.polygon([(float(xx+12),float(yy+26)) for xx,yy in dest],fill=(10,8,6,85)); shadow=shadow.filter(ImageFilter.GaussianBlur(16))
 scene.alpha_composite(shadow); scene.alpha_composite(layer)
def label(im,num,name):
 d=ImageDraw.Draw(im); d.text((38,30),'SQUINT / '+name,font=font(12),fill='#89877f');d.text((1110,30),num,font=font(12),fill='#89877f')
scenes=['poster-lineup','outdoor-poster-yellow','billboard-sign','wheatpaste-wall','zine-flatlay','zine-spreads','app-devices','stationery']
for idx,name in enumerate(scenes):
 folder=R/'video'/'frames'/name; folder.mkdir(parents=True,exist_ok=True)
 for n in range(144):
  t=n/144*math.tau; s=math.sin(t); co=math.cos(t)
  im=background(['#dedbd2','#dbd6c9','#c9c9c0','#b6b7b0','#ded8ce','#252529','#171719','#e4dfd4'][idx]); label(im,f'{idx+1:02d}',name.replace('-',' ').upper())
  if idx==0:
   for j in range(5): card(im,posters[j],112+j*244+6*s,410+18*math.sin(t+j*.6),210,300 if j%2 else 380,(-3+j*1.5)+s,8*co)
  elif idx==1:
   # Three colour studies dissolve through a physical gallery frame.
   p=(n/144*3); k=int(p); mix=(1-math.cos((p-k)*math.pi))/2
   art=Image.blend(posters[[0,3,11][k%3]].resize((600,850)),posters[[0,3,11][(k+1)%3]].resize((600,850)),mix)
   card(im,art,600+12*s,410,394,558,-2+co,10*s,12)
  elif idx==2:
   d=ImageDraw.Draw(im);d.rectangle((540,650,660,756),fill='#353537');d.ellipse((450,730,750,755),fill='#555552')
   card(im,posters[4],600,390,398,565,-2+s,18*co,16)
  elif idx==3:
   for j in range(3): card(im,posters[j+5],180+j*420,405+12*math.sin(t+j),350,497,(-3+j*3)+s,6*co)
  elif idx==4:
   card(im,pages[0],245+5*s,425,310,440,-11+co,6*s)
   card(im,pages[2],690,405,310,440,4+s,5*co)
   card(im,pages[3],995,426,310,440,4+s,-5*co)
   d=ImageDraw.Draw(im);d.line((845,202,815,645),fill=(30,25,20,80),width=2)
  elif idx==5:
   for j in range(4):
    col=j%2;row=j//2
    for side in range(2): card(im,pages[4+j*2+side],210+col*590+side*190,235+row*350+8*s,190,270,(-3 if col==0 else 3)+co,3*s)
  elif idx==6:
   # A product-style desktop stage and two portrait screens.
   art=Image.new('RGB',(900,590),'#0d0d10'); art.paste(posters[12].resize((650,460)),(125,65));d=ImageDraw.Draw(art);d.text((24,16),'Squint',font=font(22,True),fill='#ff5a36')
   card(im,art,430,370,700,459,-2+s,9*co,12)
   d=ImageDraw.Draw(im); d.rounded_rectangle((260,615,600,629),radius=6,fill='#68686d')
   card(im,posters[2],960,420,220,420,5+s,9*co,10)
  else:
   letter=Image.new('RGB',(600,850),'#f1efe8');d=ImageDraw.Draw(letter); d.text((45,55),'Squint',font=font(68,True),fill='#ff5a36');d.text((45,225),'Less picture.\nSame feeling.',font=font(42,True),fill='#121214')
   for j in range(7):d.line((45,440+j*25,480-(j%3)*40,440+j*25),fill='#c3c0b7',width=3)
   card(im,letter,350,410,400,566,-7+s,6*co)
   for j,col in enumerate(['#ff5a36','#121214','#ffc21a']):
    art=Image.new('RGB',(550,310),col);d=ImageDraw.Draw(art);d.text((35,45),'Squint',font=font(70,True),fill='#f1efe8' if j==1 else '#121214');d.text((35,252),'SQUINT.PICTURE',font=font(18),fill='#f1efe8' if j==1 else '#121214')
    card(im,art,850+j*18,230+j*180,360,203,6-j*6+s,5*co)
  im=im.convert('RGB')
  if n==0: im.save(R/'mockups'/f'{name}.png')
  im.save(folder/f'{n:04d}.jpg',quality=91)
 print(name,flush=True)
