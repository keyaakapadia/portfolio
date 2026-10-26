(function(){
  var root=new URL('../../index.html',document.currentScript.src).href;
  var norm=function(t){return t.trim().toLowerCase()};
  var works=document.querySelector('.sec-title + .works');
  var bar;
  function apply(tag){
    if(!works)return;
    var n=0;
    works.querySelectorAll('.work').forEach(function(w){
      var hit=!tag||[].some.call(w.querySelectorAll('.tag'),function(t){return norm(t.textContent)===tag});
      w.hidden=!hit;
      if(hit)n++;
    });
    if(!bar){
      bar=document.createElement('div');bar.className='tag-filter';
      works.parentNode.insertBefore(bar,works);
    }
    bar.hidden=!tag;
    if(tag){
      bar.innerHTML='<span>Showing <b></b> · '+n+' project'+(n==1?'':'s')+'</span><button type="button">Clear ✕</button>';
      bar.querySelector('b').textContent=tag;
      bar.querySelector('button').onclick=function(){history.replaceState(null,'',location.pathname+'#work');apply('')};
    }
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest('.tag');
    if(!el)return;
    e.preventDefault();e.stopPropagation();
    var tag=norm(el.textContent);
    if(works){
      history.replaceState(null,'','?tag='+encodeURIComponent(tag)+'#work');
      apply(tag);
      document.getElementById('work').scrollIntoView({behavior:'smooth'});
    }else location.href=root+'?tag='+encodeURIComponent(tag)+'#work';
  },true);
  var q=new URLSearchParams(location.search).get('tag');
  if(q)apply(norm(q));
})();
