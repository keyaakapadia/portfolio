// helpers for driving the app's own poster renderers from the console
window.loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
window.G = async (name, design, look, orient, seed = 412, custom = '') => {
  const sm = SAMPLES.find(s => s.name === name), img = await loadImg(sm.src);
  built.clear(); cache.clear();
  Object.assign(state, { custom, name, base: toBase(img), seed, history: [], orient, design, text: true });
  useLook(typeof look === 'number' ? look : LOOKS.findIndex(l => l.name === look));
  const cv = document.createElement('canvas'); DESIGNS[design].fn(cv, orient); return cv;
};
window.save = (cv, p, type = 'image/png') => fetch('/save?b64=1&p=' + encodeURIComponent(p), { method: 'POST', body: cv.toDataURL(type, .92) }).then(r => r.text());
window.saveText = (s, p) => fetch('/save?p=' + encodeURIComponent(p), { method: 'POST', body: s }).then(r => r.text());
window.ld = u => new Promise((res, rej) => { const s = document.createElement('script'); s.src = u + '?' + Date.now(); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
window.fit = img => (x, X, Y, w, h) => { const s = Math.max(w / img.width, h / img.height); x.drawImage(img, X + (w - img.width * s) / 2, Y + (h - img.height * s) / 2, img.width * s, img.height * s); };
window.loadPosters = async () => { window.P = {}; const ids = ['01-data-bloom-ladder','02-resin-passes-riso','03-petals-silhouette-matcha','04-glow-orb-neon','05-city-passes-cobalt','06-tubes-full-sunburn','07-steel-plate-blueprint','08-rust-marks-acid','09-wood-contact-forest','10-cubes-ladder-coral','11-stripes-outline-bubblegum','12-bloom-type-lagoon','w1-bloom-ladder','w2-petals-melt-lilac','w3-discs-ladder-sunburn','w4-tubes-passes-brick']; for (const id of ids) P[id] = await loadImg('/portfolio/posters/' + id + '.png'); };
