(function(){
app.beginUndoGroup('Smallstop realistic phones');
var base='/Users/keyaa/Desktop/portfolio/work/smallstop/';var p=app.project||app.newProject();
for(var qi=1;qi<=p.renderQueue.numItems;qi++)if(p.renderQueue.item(qi).status===RQItemStatus.QUEUED)p.renderQueue.item(qi).render=false;
var c=p.items.addComp('Smallstop — realistic phones and side captions',1440,1000,1,12,24);
c.layers.addSolid([.98,.965,.914],'Warm cream',1440,1000,1,12);
var f=p.importFile(new ImportOptions(new File(base+'assets/phones-cutout.png')));var l=c.layers.add(f);l.name='Photoreal phone mockups — original screens';var s=Math.min(910/f.width,930/f.height)*100;l.property('Scale').setValue([s,s]);l.property('Position').setValueAtTime(0,[1000,515]);l.property('Position').setValueAtTime(6,[980,485]);l.property('Position').setValueAtTime(12,[1000,515]);l.property('Rotation').setValueAtTime(0,-2);l.property('Rotation').setValueAtTime(6,1);l.property('Rotation').setValueAtTime(12,-2);
function caption(txt,y,size,start,end,color){var t=c.layers.addText(txt);var d=t.property('Source Text').value;d.font='SaansTRIAL-Regular';d.fontSize=size;d.fillColor=color;d.leading=size*1.2;t.property('Source Text').setValue(d);t.property('Position').setValueAtTime(start,[90,y+14]);t.property('Position').setValueAtTime(start+.6,[90,y]);t.inPoint=start;t.outPoint=end;t.property('Opacity').setValueAtTime(start,0);t.property('Opacity').setValueAtTime(start+.5,100);t.property('Opacity').setValueAtTime(end-.45,100);t.property('Opacity').setValueAtTime(end,0);return t;}
var ink=[.14,.15,.12],muted=[.40,.43,.35];
caption('A familiar route.',440,42,0,4,ink);caption('Choose it together.\rKnow what comes next.',495,24,0,4,muted);
caption('One stop at a time.',440,42,4,8,ink);caption('A clear count.\rA little less to hold in mind.',495,24,4,8,muted);
caption('Help stays close.',440,42,8,12,ink);caption('Room to pause.\rA simple way back to the ride.',495,24,8,12,muted);
var q=p.renderQueue.items.add(c),om=q.outputModule(1),ts=om.templates,chosen='';for(var j=0;j<ts.length;j++)if(ts[j].indexOf('H.264')>=0){chosen=ts[j];break;}if(chosen)om.applyTemplate(chosen);om.file=new File(base+'motion/smallstop-real-phones.'+(chosen?'mp4':'mov'));p.save(new File(base+'motion/smallstop-real-phones.aep'));c.openInViewer();app.endUndoGroup();p.renderQueue.render();
})();
