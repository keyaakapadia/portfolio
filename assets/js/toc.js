// Case study contents: the list on the left follows the section you are reading.
(() => {
  const toc = document.querySelector('.toc');
  if (!toc) return;
  const list = toc.querySelector('ol');
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const secs = links.map(a => document.getElementById(a.hash.slice(1)));
  let cur = -1;

  const set = i => {
    if (i === cur) return;
    cur = i;
    links.forEach((a, j) => j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    // phones: the list is a sideways strip, so keep the current item in view.
    // Jump rather than animate, so it never interrupts the page's own smooth scroll.
    if (list.scrollWidth > list.clientWidth) {
      const a = links[i];
      list.scrollLeft = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
    }
  };

  // the current section is the last one whose heading has reached a line near the top;
  // at the very bottom the last sections can't reach it, so take the last one on screen
  const update = () => {
    const end = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const line = end ? innerHeight : Math.min(innerHeight * 0.25, 160);
    let i = 0;
    secs.forEach((s, j) => { if (s && s.getBoundingClientRect().top <= line) i = j; });
    set(i);
  };

  let raf = 0;
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
  addEventListener('resize', update);
  update();
})();
