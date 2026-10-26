// Phone menu: the header links collapse into a hamburger that opens a full-width list.
(() => {
  const nav = document.querySelector('header.nav');
  if (!nav) return;
  const links = nav.querySelectorAll('.links a, .last a');
  if (!links.length) return;

  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'nav-menu');
  btn.innerHTML = '<span></span><span></span><span></span>';

  const menu = document.createElement('nav');
  menu.className = 'nav-menu';
  menu.id = 'nav-menu';
  menu.setAttribute('aria-label', 'Menu');
  links.forEach(a => {
    const c = a.cloneNode(true);
    if (a.closest('.last')) c.classList.add('ext');
    menu.appendChild(c);
  });

  nav.append(btn, menu);

  const set = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  addEventListener('resize', () => { if (innerWidth > 700) set(false); });
  addEventListener('pageshow', () => set(false));
})();
