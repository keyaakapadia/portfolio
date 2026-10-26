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

  // Scroll reveals: one-shot, staggered by arrival order, cleaned up afterwards
  // so hover/active transforms and sticky children behave normally.
  const TEXT = '.hero-meta>*,.sec-title,.work,.play .p,.proj-intro>*,.bio p,.about-grid figure,.r,.feat>*,' +
    'footer .big,footer .col,.chapter,.process-heading,.ux-study,.ss-brand-board,.interaction-stage,.reflection';
  const MEDIA = '.block,.duo .block,.feat .thumb';
  const targets = [...document.querySelectorAll(TEXT + ',' + MEDIA)]
    .filter(el => el !== hero && !hero?.contains(el) && !el.closest('.rv-skip') &&
      !(el.matches(MEDIA) && el.closest(TEXT.split(',').filter(s => !s.startsWith('.hero')).join(',')) && el.closest('.work,.chapter,.ux-study,.ss-brand-board')));
  if (reduce.matches || !('IntersectionObserver' in window)) return pauseOffscreenVideo();

  targets.forEach(el => el.classList.add('rv', ...(el.matches(MEDIA) ? ['rv-media'] : [])));

  // Reveal by geometry on scroll rather than IntersectionObserver: an element clipped to nothing
  // can report as never intersecting, which left whole pages blank. Anything at or above the
  // fold is shown, and a timer guarantees nothing stays hidden.
  let pending = new Set(targets), batch = 0, tick = false;
  const show = el => {
    pending.delete(el);
    el.style.setProperty('--d', Math.min(batch++, 6) * 60 + 'ms');
    requestAnimationFrame(() => el.classList.add('in'));
    const done = () => el.classList.remove('rv', 'rv-media', 'in');
    el.addEventListener('transitionend', e => { if (e.target === el) done(); }, { once: true });
    setTimeout(done, 1600);
  };
  const check = () => {
    tick = false; batch = 0;
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const limit = atEnd ? Infinity : innerHeight * 0.92;
    pending.forEach(el => { if (el.getBoundingClientRect().top < limit) show(el); });
    if (!pending.size) { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); }
  };
  const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(check); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', onScroll);
  check();
  setTimeout(check, 400);
  // Safety net: never leave content hidden, whatever the browser does with scroll events.
  setTimeout(() => { pending.forEach(el => el.classList.remove('rv', 'rv-media', 'in')); pending.clear(); }, 6000);

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
