(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const mq = matchMedia('(min-width: 901px)');
  // Hide the native cursor only while the custom one is showing, so the
  // pointer can never vanish (narrow windows, iframes, leaving the page).
  const root = document.documentElement;
  const cur = document.createElement('div');
  cur.id = 'cur';
  cur.innerHTML = '<span class="dot"></span><span class="label"><kbd>⌘Z</kbd> is part of the process</span>';
  document.body.appendChild(cur);

  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  const native = () => { root.classList.remove('has-cursor'); cur.classList.remove('on'); };
  addEventListener('mousemove', e => {
    if (!mq.matches || e.target.closest('iframe, input, textarea, select, video[controls]')) return native();
    tx = e.clientX; ty = e.clientY;
    root.classList.add('has-cursor'); cur.classList.add('on');
  });
  document.addEventListener('mouseleave', native);
  addEventListener('blur', native);
  addEventListener('resize', () => { if (!mq.matches) native(); });
  // Only run the frame loop while the cursor is still catching up.
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  function loop() {
    const k = still.matches ? 1 : 0.28;
    x += (tx - x) * k; y += (ty - y) * k;
    cur.style.transform = `translate(${x}px,${y}px)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
  }
  addEventListener('mousemove', () => { if (!raf) raf = requestAnimationFrame(loop); });

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
