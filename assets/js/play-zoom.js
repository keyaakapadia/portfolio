// Click an image to see it large. The picture grows out of its own thumbnail
// and shrinks back into it, so you always know where it came from.
(() => {
  const items = [...document.querySelectorAll('a[data-zoom]')];
  if (!items.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const dlg = document.createElement('dialog');
  dlg.className = 'zoom-dlg';
  dlg.innerHTML = '<img alt=""><p class="zoom-cap"></p><button type="button" class="zoom-x" aria-label="Close">Close</button>';
  document.body.appendChild(dlg);
  const big = dlg.querySelector('img'), cap = dlg.querySelector('.zoom-cap');
  let from = null, idx = 0;

  const fit = () => {
    const r = from.getBoundingClientRect(), b = big.getBoundingClientRect();
    return `translate(${r.left - b.left}px,${r.top - b.top}px) scale(${r.width / b.width},${r.height / b.height})`;
  };
  const show = i => {
    idx = (i + items.length) % items.length;
    from = items[idx].querySelector('img');
    big.src = from.currentSrc || from.src;
    big.alt = from.alt;
    cap.textContent = items[idx].querySelector('h2')?.textContent || '';
  };
  const open = i => {
    show(i);
    dlg.showModal();
    if (reduce.matches) return;
    big.animate([{ transform: fit(), opacity: .6 }, { transform: 'none', opacity: 1 }],
      { duration: 380, easing: 'cubic-bezier(.23,1,.32,1)' });
    dlg.animate([{ backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,.96)' }], { duration: 240, easing: 'ease-out' });
  };
  const close = () => {
    if (!dlg.open) return;
    if (reduce.matches || !from) return dlg.close();
    big.animate([{ transform: 'none' }, { transform: fit() }], { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)' })
      .finished.then(() => dlg.close(), () => dlg.close());
  };
  items.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); open(i); }));
  dlg.addEventListener('click', e => { if (e.target !== big) close(); });
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
})();
