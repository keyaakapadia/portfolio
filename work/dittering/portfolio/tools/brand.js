// brand assets for Squint. Runs inside the app page so the fonts and helpers are there.
window.BR = { ink: '#121214', paper: '#F1EFE8', tomato: '#FF5A36', sun: '#FFC21A', lagoon: '#2FD3B5', cobalt: '#6A7BFF', gum: '#FF7AC8', dim: '#8F8E8A' };
var D_ = '"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif', M_ = '"DM Mono",ui-monospace,Menlo,monospace';
var B4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

// the mark: a ring on a 20 x 20 grid, dithered at its edge (same ring as the landing page)
window.markCells = (n = 20) => {
  const cells = [], c = (n - 1) / 2;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const r = Math.hypot(x - c, y - c), inner = 4.2, outer = 8.6;
    let v = r < inner ? 0 : r < outer ? 1 : 0;
    const edge = Math.min(Math.abs(r - inner), Math.abs(r - outer));
    if (edge < 1.3) v = ((B4[y % 4][x % 4] + .5) / 16) < (1 - edge / 1.3) * .75 + .25 ? (r > (inner + outer) / 2 ? (r < outer + 1 ? 1 : 0) : (r > inner - 1 ? 1 : 0)) : 0;
    if (v) cells.push([x, y]);
  }
  // the ring resolves left to right: coarse blocks on the left, single cells on the right
  return cells;
};
window.markSVG = (fill, bg) => {
  const n = 20, cells = markCells(n);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">`;
  if (bg) s += `<rect width="${n}" height="${n}" fill="${bg}"/>`;
  s += `<g fill="${fill}">` + cells.map(([x, y]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`).join('') + '</g></svg>';
  return s;
};
window.drawMark = (c, x, y, size, fill) => {
  const n = 20, u = size / n; c.fillStyle = fill;
  for (const [cx, cy] of markCells(n)) c.fillRect(Math.round(x + cx * u), Math.round(y + cy * u), Math.ceil(u) + 0, Math.ceil(u) + 0);
};
window.cnv = (w, h, bg) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (bg) { x.fillStyle = bg; x.fillRect(0, 0, w, h); } return [c, x]; };
window.txt = (x, s, t, px, py, o = {}) => {
  x.font = `${o.w || 800} ${s}px ${o.mono ? M_ : D_}`; x.fillStyle = o.col || BR.ink; x.textAlign = o.align || 'left'; x.textBaseline = o.base || 'alphabetic';
  if (o.ls) x.letterSpacing = o.ls + 'px'; else x.letterSpacing = '0px';
  x.fillText(t, px, py);
};
window.dots = (x, X, Y, W, H, cell, cols, seed = 3) => {   // a dithered colour field
  const r = rng(seed);
  for (let j = 0; j < H / cell; j++) for (let i = 0; i < W / cell; i++) { x.fillStyle = cols[Math.floor(r() * cols.length)]; x.fillRect(X + i * cell, Y + j * cell, cell, cell); }
};
// a gradient resolved into blocks: cell size grows with x
window.ladderBar = (x, X, Y, W, H, cols) => {
  // cells grow left to right (1, 2, 4 ... px steps); colour runs along x, dithered by a Bayer matrix at every size
  const sizes = [4, 4, 6, 6, 8, 10, 14, 20, 28, 40, 60]; let px = 0, si = 0; const seg = W / sizes.length;
  while (px < W) {
    const cell = sizes[Math.min(sizes.length - 1, Math.floor(px / seg))], n = cols.length - 1;
    for (let j = 0; j < H; j += cell) {
      const t = (px / W) * n + ((B4[(j / cell | 0) % 4][(px / cell | 0) % 4] / 16) - .5) * 1.6;
      x.fillStyle = cols[clamp(Math.round(t), 0, n)]; x.fillRect(X + px, Y + j, Math.min(cell, W - px), Math.min(cell, H - j));
    }
    px += cell;
  }
};
window.buildBrand = async () => {
  await document.fonts.load('800 80px "Bricolage Grotesque"'); await document.fonts.load('500 20px "Bricolage Grotesque"'); await document.fonts.load('400 16px "DM Mono"'); await document.fonts.load('500 16px "DM Mono"');
  const out = {};
  // ---- logo files
  await fetch('/save?p=portfolio/brand/squint-mark-tomato.svg', { method: 'POST', body: markSVG(BR.tomato) });
  await fetch('/save?p=portfolio/brand/squint-mark-ink.svg', { method: 'POST', body: markSVG(BR.ink) });
  await fetch('/save?p=portfolio/brand/squint-mark-paper.svg', { method: 'POST', body: markSVG(BR.paper, BR.ink) });
  // lockup png on three grounds
  for (const [name, bg, fg, accent] of [['ink', BR.ink, BR.paper, BR.tomato], ['paper', BR.paper, BR.ink, BR.tomato], ['tomato', BR.tomato, BR.ink, BR.paper]]) {
    const [c, x] = cnv(2400, 900, bg); drawMark(x, 300, 250, 400, accent === bg ? fg : accent);
    txt(x, 420, 'Squint', 800, 640, { col: fg, ls: -18 });
    await save(c, `portfolio/brand/squint-lockup-${name}.png`);
  }
  { const [c, x] = cnv(1024, 1024, BR.ink); drawMark(x, 192, 192, 640, BR.tomato); await save(c, 'portfolio/brand/app-icon.png'); }
  { const [c, x] = cnv(512, 512, BR.tomato); drawMark(x, 96, 96, 320, BR.ink); await save(c, 'portfolio/brand/avatar.png'); }

  // ---- palette board
  {
    const [c, x] = cnv(2400, 1400, BR.paper);
    txt(x, 26, 'COLOUR', 120, 130, { mono: 1, w: 500, ls: 4 }); txt(x, 110, 'Seven flat colours.', 120, 250, { ls: -4 });
    txt(x, 24, 'No gradients in the brand. When a gradient is needed it is resolved into cells.', 120, 310, { mono: 1, w: 400, col: BR.dim });
    const sw = [['Ink', BR.ink, BR.paper, 'Wall. Text. 60%'], ['Paper', '#F1EFE8', BR.ink, 'Ground. 25%'], ['Tomato', BR.tomato, BR.ink, 'The one loud thing. 8%'], ['Sun', BR.sun, BR.ink, 'Posters, signs. 4%'], ['Lagoon', BR.lagoon, BR.ink, 'Data. 1%'], ['Cobalt', BR.cobalt, BR.paper, 'Data. 1%'], ['Gum', BR.gum, BR.ink, 'Data. 1%']];
    sw.forEach(([n, hex, fg, role], i) => {
      const w = 290, X = 120 + i * 308, Y = 400, H = i < 2 ? 620 : i === 2 ? 620 : 620;
      x.fillStyle = hex; x.fillRect(X, Y, w, H); if (hex === '#F1EFE8') { x.strokeStyle = BR.ink; x.lineWidth = 3; x.strokeRect(X + 1.5, Y + 1.5, w - 3, H - 3); }
      txt(x, 44, n, X + 24, Y + H - 110, { col: fg }); txt(x, 20, hex.toUpperCase(), X + 24, Y + H - 72, { mono: 1, w: 500, col: fg }); txt(x, 17, role, X + 24, Y + H - 40, { mono: 1, w: 400, col: fg });
    });
    txt(x, 26, 'THE LADDER', 120, 1130, { mono: 1, w: 500, ls: 4 });
    ladderBar(x, 120, 1170, 2160, 150, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]);
    await save(c, 'portfolio/brand/palette.png');
  }

  // ---- type specimen
  {
    const [c, x] = cnv(2400, 1500, BR.ink);
    txt(x, 26, 'TYPE', 120, 130, { mono: 1, w: 500, ls: 4, col: BR.dim });
    txt(x, 560, 'Aa', 100, 640, { col: BR.paper, ls: -20 });
    txt(x, 64, 'Bricolage Grotesque', 1000, 250, { col: BR.paper, ls: -2 }); txt(x, 24, 'Display and headings. 800, tight (-4%). Sentence case, always.', 1000, 300, { mono: 1, w: 400, col: BR.dim });
    txt(x, 150, 'Less picture,', 1000, 520, { col: BR.paper, ls: -7 }); txt(x, 150, 'same feeling.', 1000, 660, { col: BR.tomato, ls: -7 });
    x.fillStyle = BR.dim; x.fillRect(120, 760, 2160, 2);
    txt(x, 64, 'DM Mono', 120, 880, { mono: 1, w: 500, col: BR.paper }); txt(x, 24, 'Captions, numbers, UI. 400 and 500, 13 to 15 px on screen.', 120, 930, { mono: 1, w: 400, col: BR.dim });
    txt(x, 38, '1x   2x   4x   8x   16x   32x   64x   128x', 120, 1050, { mono: 1, w: 500, col: BR.sun });
    txt(x, 26, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ  abcdefghijklmnopqrstuvwxyz  0123456789', 120, 1130, { mono: 1, w: 400, col: BR.paper });
    txt(x, 26, '100 cells are enough to recognise it.', 120, 1200, { mono: 1, w: 400, col: BR.lagoon });
    txt(x, 24, 'HIERARCHY', 1000, 880, { mono: 1, w: 500, ls: 4, col: BR.dim });
    txt(x, 90, 'Headline 96 / .9', 1000, 990, { col: BR.paper, ls: -4 }); txt(x, 40, 'Subhead 40 / 1.0', 1000, 1050, { w: 500, col: BR.paper, ls: -1 }); txt(x, 22, 'Caption 13 mono, uppercase, +4 tracking', 1000, 1100, { mono: 1, col: BR.dim });
    await save(c, 'portfolio/brand/type-specimen.png');
  }

  // ---- brand board
  {
    const [c, x] = cnv(3000, 2000, BR.ink);
    drawMark(x, 140, 140, 360, BR.tomato); txt(x, 330, 'Squint', 560, 440, { col: BR.paper, ls: -14 });
    txt(x, 40, 'How simple can a picture get? How elaborate can you make it?', 140, 640, { mono: 1, w: 400, col: BR.paper });
    txt(x, 24, 'BRAND GUIDELINES  /  V1', 140, 1900, { mono: 1, w: 500, ls: 4, col: BR.dim });
    // the mark, with construction
    const MX = 140, MY = 760, MS = 520; x.fillStyle = '#1c1c20'; x.fillRect(MX, MY, 1100, 1020);
    drawMark(x, MX + 290, MY + 100, MS, BR.tomato);
    x.strokeStyle = '#ffffff22'; x.lineWidth = 2; for (let i = 0; i <= 20; i++) { x.beginPath(); x.moveTo(MX + 290 + i * MS / 20, MY + 100); x.lineTo(MX + 290 + i * MS / 20, MY + 100 + MS); x.moveTo(MX + 290, MY + 100 + i * MS / 20); x.lineTo(MX + 290 + MS, MY + 100 + i * MS / 20); x.stroke(); }
    txt(x, 24, 'THE MARK', MX + 40, MY + 700, { mono: 1, w: 500, ls: 4, col: BR.dim });
    txt(x, 26, 'A ring on a 20 x 20 grid. Its edge is ordered-dithered,', MX + 40, MY + 760, { mono: 1, w: 400, col: BR.paper }); txt(x, 26, 'so it is never quite a circle and never quite not.', MX + 40, MY + 800, { mono: 1, w: 400, col: BR.paper });
    txt(x, 26, 'Keep a cell of clear space on every side. Minimum 24 px.', MX + 40, MY + 880, { mono: 1, w: 400, col: BR.dim });
    // palette strip
    const px = 1340; txt(x, 24, 'COLOUR', px, 800, { mono: 1, w: 500, ls: 4, col: BR.dim });
    [[BR.paper, 'Paper'], [BR.tomato, 'Tomato'], [BR.sun, 'Sun'], [BR.lagoon, 'Lagoon'], [BR.cobalt, 'Cobalt'], [BR.gum, 'Gum']].forEach(([h, n], i) => { x.fillStyle = h; x.fillRect(px + i * 270, 830, 250, 330); txt(x, 26, n, px + i * 270 + 18, 1120, { col: BR.ink, w: 800 }); });
    // type
    txt(x, 24, 'TYPE', px, 1260, { mono: 1, w: 500, ls: 4, col: BR.dim }); txt(x, 150, 'Less picture,', px, 1400, { col: BR.paper, ls: -7 }); txt(x, 150, 'same feeling.', px, 1540, { col: BR.tomato, ls: -7 });
    txt(x, 28, 'Bricolage Grotesque 800 for words. DM Mono for everything that is a number.', px, 1610, { mono: 1, w: 400, col: BR.paper });
    // voice
    txt(x, 24, 'VOICE', px, 1710, { mono: 1, w: 500, ls: 4, col: BR.dim });
    txt(x, 28, 'Plain, a bit dry. Says what the picture did. "10 colours, and every one showed up."', px, 1760, { mono: 1, w: 400, col: BR.paper });
    txt(x, 28, 'Never "magical", never "AI-powered". It is arithmetic and it is fun.', px, 1805, { mono: 1, w: 400, col: BR.paper });
    // ladder footer
    ladderBar(x, 1340, 1850, 1520, 90, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]);
    await save(c, 'portfolio/brand/brand-board.png');
  }

  // ---- social banner
  {
    const [c, x] = cnv(3000, 1000, BR.ink);
    ladderBar(x, 1500, 0, 1500, 1000, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]);
    drawMark(x, 140, 150, 300, BR.tomato); txt(x, 240, 'Squint', 480, 390, { col: BR.paper, ls: -10 });
    txt(x, 42, 'Drop a picture. Watch it get simpler.', 150, 640, { mono: 1, w: 400, col: BR.paper });
    await save(c, 'portfolio/brand/social-banner.png');
  }
  return 'brand done';
};
