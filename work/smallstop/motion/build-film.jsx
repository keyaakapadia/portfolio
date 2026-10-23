(function(){
app.beginUndoGroup('Smallstop editorial film');
var root='/Users/keyaa/Desktop/portfolio/work/smallstop/';
var p=app.project||app.newProject();
var c=p.items.addComp('Smallstop — a familiar way',1280,800,1,12,24);
c.bgColor=[.98,.965,.914];
function footage(file){return p.importFile(new ImportOptions(new File(root+'assets/'+file)));}
function shot(file,start,end,zoom){var f=footage(file),l=c.layers.add(f);l.startTime=start;l.inPoint=start;l.outPoint=end;var s=Math.max(1280/f.width,800/f.height)*100;l.property('Scale').setValueAtTime(start,[s,s]);l.property('Scale').setValueAtTime(end,[s*zoom,s*zoom]);l.property('Position').setValue([640,400]);if(start>0){l.property('Opacity').setValueAtTime(start,0);l.property('Opacity').setValueAtTime(start+.6,100);}return l;}
shot('handheld-editorial.png',0,6.2,1.07);
shot('pain-paper.png',5.6,8.6,1.04);
shot('warm-practice.mp4',8,10.6,1);
shot('handheld-editorial.png',10,12,1.02);
var t=c.layers.addText('smallstop ↗');var td=t.property('Source Text').value;td.font='SaansTRIAL-Medium';td.fontSize=38;td.fillColor=[.98,.965,.914];t.property('Source Text').setValue(td);t.property('Position').setValue([55,70]);t.outPoint=5.6;
var rq=p.renderQueue.items.add(c);rq.outputModule(1).file=new File(root+'motion/smallstop-editorial.mov');
p.save(new File(root+'motion/smallstop-editorial.aep'));c.openInViewer();app.endUndoGroup();
})();
