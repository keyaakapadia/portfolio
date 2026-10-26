// Wired page: borders take the main colour of the day, read from the live embed.
(() => {
  const frame = document.querySelector('.wired-hero iframe');
  if (!frame) return;
  let last = '';
  const read = () => {
    try {
      const c = frame.contentWindow.eval('IMG_COLORS && IMG_COLORS[0]');
      if (!c || c.length !== 3) return;
      const hex = '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
      if (hex !== last) { last = hex; document.documentElement.style.setProperty('--day', hex); }
    } catch (e) {}
  };
  read();
  setInterval(read, 1000);
  frame.addEventListener('load', read);
})();
