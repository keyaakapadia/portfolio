(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Cross-page: the thumbnail you clicked becomes the project's first image.
  // Only forward navigation from a work card; everything else just cross-fades.
  const KEY = 'vt-proj';
  addEventListener('click', e => {
    const card = e.target.closest('a.work');
    const media = card && card.querySelector('.thumb');
    if (!media || reduce.matches) return;
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    media.style.viewTransitionName = 'proj';
  });
  addEventListener('pageshow', e => {
    if (e.persisted) document.querySelectorAll('.thumb').forEach(t => t.style.viewTransitionName = '');
  });

  let hero = null;
  try {
    if (sessionStorage.getItem(KEY) && !reduce.matches) {
      sessionStorage.removeItem(KEY);
      hero = document.querySelector('.proj .block, .proj-hero, main .block');
      if (hero) hero.style.viewTransitionName = 'proj';
    }
  } catch {}
  if (hero) addEventListener('pagereveal', e => {
    if (e.viewTransition) e.viewTransition.finished.finally(() => hero.style.viewTransitionName = '');
    else hero.style.viewTransitionName = '';
  });

  pauseOffscreenVideo();

  // Looping thumbnails only play while visible: saves battery and main-thread time.
  function pauseOffscreenVideo() {
    const vids = [...document.querySelectorAll('video[autoplay][loop]')];
    if (!vids.length) return;
    if (reduce.matches) return vids.forEach(v => v.pause());
    const vio = new IntersectionObserver(es => es.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.1 });
    vids.forEach(v => vio.observe(v));
  }
})();
