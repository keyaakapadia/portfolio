document.querySelectorAll('.rotate').forEach(function(box){
  var imgs=box.querySelectorAll('img');
  if(imgs.length<2)return;
  var i=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  imgs[0].classList.add('on');
  if(reduce)return;
  setInterval(function(){
    imgs[i].classList.remove('on');
    i=(i+1)%imgs.length;
    imgs[i].classList.add('on');
  },2800);
});
