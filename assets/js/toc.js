// Case study progress (the top bar, or the rail on the index2 trial pages): each segment
// fills as you read through its section, and the one you are in is marked current.
(() => {
  const toc = document.querySelector('.toc, .og-rail');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const secs = links.map(a => document.getElementById(a.hash.slice(1)));
  if (secs.some(s => !s)) return;
  let cur = -1;

  const set = i => {
    if (i === cur) return;
    cur = i;
    links.forEach((a, j) => j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  };

  // reading line sits near the top; at the very bottom the last sections can't reach it,
  // so the line drops to the bottom edge and everything left fills
  const update = () => {
    const end = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const line = end ? innerHeight : Math.min(innerHeight * 0.2, 120);
    const tops = secs.map(s => s.getBoundingClientRect().top);
    const bottom = secs[secs.length - 1].getBoundingClientRect().bottom;
    let i = 0;
    tops.forEach((t, j) => {
      if (t <= line) i = j;
      const next = j + 1 < tops.length ? tops[j + 1] : bottom;
      const p = Math.min(1, Math.max(0, (line - t) / (next - t)));
      links[j].style.setProperty('--p', p.toFixed(3));
    });
    set(i);
  };

  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', update);
  update();
})();
