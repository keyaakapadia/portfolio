// Wired page: borders and their backing take the colour behind the live embed, as the embed reports it.
(() => {
  const frame = document.querySelector('.wired-hero iframe');
  if (!frame) return;
  addEventListener('message', e => {
    if (e.source !== frame.contentWindow) return;
    const c = e.data && e.data.wiredBg;
    if (/^#[0-9a-f]{6}$/i.test(c)) document.documentElement.style.setProperty('--day', c);
  });
  const ask = () => { try { frame.contentWindow.postMessage({ wiredAsk: 1 }, '*'); } catch (e) {} };
  frame.addEventListener('load', ask);
  setInterval(ask, 2000);
})();
