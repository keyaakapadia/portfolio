(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.documentElement.classList.add('has-cursor');
  const cur = document.createElement('div');
  cur.id = 'cur';
  cur.innerHTML = '<span class="dot"></span><span class="label"><kbd>⌘Z</kbd> is part of the process</span>';
  document.body.appendChild(cur);

  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); });
  document.addEventListener('mouseleave', () => cur.classList.remove('on'));
  (function loop() {
    x += (tx - x) * 0.28; y += (ty - y) * 0.28;
    cur.style.transform = `translate(${x}px,${y}px)`;
    requestAnimationFrame(loop);
  })();

  // pill over work + media, ring over links
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('.work, .p, .block, .thumb');
    cur.classList.toggle('pill', !!t);
    cur.classList.toggle('ring', !t && !!e.target.closest('a'));
  });

  // pressing the real shortcut flashes the pill
  let timer;
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      cur.classList.add('pill', 'flash');
      clearTimeout(timer);
      timer = setTimeout(() => cur.classList.remove('flash'), 900);
    }
  });
})();
