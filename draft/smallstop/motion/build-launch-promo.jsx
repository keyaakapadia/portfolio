(function(){
app.beginUndoGroup('Smallstop launch promo');
var b='/Users/keyaa/Desktop/portfolio/work/smallstop/',p=app.project||app.newProject();
for(var q=1;q<=p.renderQueue.numItems;q++)if(p.renderQueue.item(q).status===RQItemStatus.QUEUED)p.renderQueue.item(q).render=false;
var c=p.items.addComp('Smallstop — launch promo',1920,1080,1,25,60),cream=[.98,.965,.914],ink=[.12,.13,.10],sage=[.65,.72,.48],pink=[.92,.72,.82];
function ease(x,io){var a=io?.77:.23,bb=io?.175:.32,lo=0,hi=1,t;for(var n=0;n<24;n++){t=(lo+hi)/2;var v=3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*bb+t*t*t;if(v<x)lo=t;else hi=t;}return (io?0:3*(1-t)*(1-t)*t)+3*(1-t)*t*t+t*t*t;}
function move(l,prop,t,d,a,z,io){var pr=l.property(prop);for(var k=0;k<=30;k++){var f=ease(k/30,io),v;if(a instanceof Array){v=[];for(var j=0;j<a.length;j++)v.push(a[j]+(z[j]-a[j])*f);}else v=a+(z-a)*f;pr.setValueAtTime(t+d*k/30,v);}}
function bg(col,s,e){var l=c.layers.addSolid(col,'Brand background',1920,1080,1,25);l.inPoint=s;l.outPoint=e;return l;}
function txt(str,size,xy,s,e,col){var l=c.layers.addText(str),d=l.property('Source Text').value;d.font='SaansTRIAL-Regular';d.fontSize=size;d.fillColor=col||ink;d.justification=ParagraphJustification.CENTER_JUSTIFY;l.property('Source Text').setValue(d);l.property('Position').setValue(xy);l.inPoint=s;l.outPoint=e;return l;}
function cap(str,s,e){var l=txt(str,38,[960,1000],s,e,ink);move(l,'Opacity',s,.2,0,100);move(l,'Opacity',e-.2,.2,100,0);}
var shell=p.importFile(new ImportOptions(new File(b+'assets/phone-real-shell.png'))),pcs={};
var names=['home','practice','ride','passport'];
for(var i=0;i<4;i++){var pc=p.items.addComp('Launch phone — '+names[i],1080,1440,1,25,60);var bod=pc.layers.add(shell);bod.property('Position').setValue([540,720]);bod.property('Scale').setValue([1080/shell.width*100,1440/shell.height*100]);var f=p.importFile(new ImportOptions(new File(b+'assets/warm-'+names[i]+'.mp4'))),sc=pc.layers.add(f);sc.timeRemapEnabled=true;sc.property('ADBE Time Remapping').expression='Math.min(time,4.95)';sc.outPoint=25;sc.property('Scale').setValue([574/390*100,1148/780*100]);sc.property('Position').setValue([540,720]);pcs[names[i]]=pc;}
function phone(name,s,e,xy,scale,rot){var l=c.layers.add(pcs[name]);l.startTime=s;l.inPoint=s;l.outPoint=e;l.property('Position').setValue(xy);l.property('Scale').setValue([scale,scale]);l.property('Rotation').setValue(rot||0);return l;}
bg(cream,0,7);var brand=txt('smallstop.',260,[960,615],0,3.2);move(brand,'Position',0,.6,[960,700],[960,615]);
var a=phone('ride',0,3.2,[1780,220],36,12);move(a,'Position',0,.7,[2200,-300],[1780,220]);var bb=phone('passport',.06,3.2,[160,960],30,-12);move(bb,'Position',.06,.7,[-350,1400],[160,960]);
var hero=phone('home',1.7,7,[970,520],65,-4);move(hero,'Position',1.7,1.1,[970,1800],[970,520]);move(hero,'Position',6.4,.6,[970,520],[970,-1250],true);
var l=phone('ride',3.06,7,[370,650],43,-9);move(l,'Position',3.06,.75,[-600,650],[370,650]);move(l,'Position',6.4,.6,[370,650],[-650,650],true);
var r=phone('passport',3.12,7,[1550,390],34,10);move(r,'Position',3.12,.75,[1550,-750],[1550,390]);move(r,'Position',6.4,.6,[1550,390],[2350,390],true);cap('A familiar way forward',4,6.4);
bg(pink,7,12);var pr=phone('practice',7,12,[1480,550],104,0);move(pr,'Scale',7,.7,[82,82],[104,104]);move(pr,'Position',7,.7,[1480,800],[1480,550]);cap('Practice before you go',8,11.4);move(pr,'Scale',11.4,.6,[104,104],[155,155],true);move(pr,'Opacity',11.75,.25,100,0);
bg(sage,12,17);var benefit=txt('Little steps.\rBig confidence.',150,[630,420],12,17);move(benefit,'Position',12,.6,[400,420],[630,420]);
var ride=phone('ride',12.06,17,[1530,610],78,7);move(ride,'Position',12.06,.8,[2300,-400],[1530,610]);
var pass=phone('passport',13.4,17,[320,980],39,-12);move(pass,'Position',13.4,.7,[-500,1400],[320,980]);
var home=phone('home',14.1,17,[970,1020],31,8);move(home,'Position',14.1,.7,[970,1800],[970,1020]);move(ride,'Position',16.4,.6,[1530,610],[1330,530],true);
bg(cream,17,21);var h=phone('ride',17,21,[1220,520],65,0);move(h,'Position',17,.7,[1420,570],[1220,520]);var p2=phone('passport',17.06,21,[660,590],43,-8);move(p2,'Position',17.06,.7,[270,700],[660,590]);cap('One stop at a time',18,20.6);move(h,'Position',20.5,.5,[1220,520],[1220,-1200],true);move(p2,'Position',20.5,.5,[660,590],[660,1600],true);
bg(sage,21,25);var end=txt('smallstop ↗',245,[960,620],21,25);move(end,'Position',21,.7,[960,760],[960,620]);move(end,'Opacity',21,.3,0,100);
var rq=p.renderQueue.items.add(c),om=rq.outputModule(1),ts=om.templates;for(var n=0;n<ts.length;n++)if(ts[n].indexOf('H.264')>=0){om.applyTemplate(ts[n]);break;}om.file=new File(b+'motion/smallstop-launch-final.mp4');p.save(new File(b+'motion/smallstop-launch-final.aep'));c.openInViewer();app.endUndoGroup();p.renderQueue.render();
})();
