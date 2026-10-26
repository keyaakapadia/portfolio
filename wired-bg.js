// Wired page: the whole page takes the live embed's background colour as it shifts through the day.
(() => {
  const frame = document.querySelector('.wired-hero iframe');
  if (!frame) return;
  const root = document.documentElement.style;
  let last = '';
  const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const apply = hex => {
    if (hex === last) return;
    last = hex;
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    const dark = lum(rgb) < 0.45;
    const ink = dark ? '#fff' : '#000';
    root.setProperty('--bg', hex);
    root.setProperty('--ink', ink);
    root.setProperty('--muted', dark ? 'rgba(255,255,255,.62)' : 'rgba(0,0,0,.55)');
    root.setProperty('--line', dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.16)');
    root.setProperty('--hatch', dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.05)');
  };
  const read = () => {
    try {
      const c = frame.contentWindow.eval('PAL && PAL.bg');
      if (c && c.length === 3) apply('#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join(''));
    } catch (e) {}
  };
  read();
  setInterval(read, 500);
  frame.addEventListener('load', read);
})();
