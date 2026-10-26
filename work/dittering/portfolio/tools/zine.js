// the zine: 16 pages, A5 at 10 px per mm
var ZW = 1480, ZH = 2100, PADZ = 120;
var wrapT = (x, s, maxW) => { const out = []; let line = ''; for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; };
var para = (x, s, X, Y, W, size, o = {}) => { x.font = `${o.w || 400} ${size}px ${o.mono === false ? D_ : M_}`; x.letterSpacing = '0px'; const ls = wrapT(x, s, W); x.fillStyle = o.col || BR.ink; x.textAlign = 'left'; ls.forEach((l, i) => x.fillText(l, X, Y + i * size * (o.lh || 1.5))); return Y + ls.length * size * (o.lh || 1.5); };
var headZ = (x, lines, X, Y, size, cols) => lines.forEach((l, i) => txt(x, size, l, X, Y + i * size * .92, { col: cols[i % cols.length], ls: -size * .045 }));
var folio = (x, n, dark) => { txt(x, 22, String(n).padStart(2, '0'), ZW - PADZ, ZH - 70, { mono: 1, w: 500, align: 'right', col: dark ? BR.dim : '#12121488', ls: 3 }); txt(x, 22, 'SQUINT / A ZINE', PADZ, ZH - 70, { mono: 1, w: 500, col: dark ? BR.dim : '#12121488', ls: 3 }); };
var coverFill = (x, img, X, Y, w, h) => fit(img)(x, X, Y, w, h);
var mosaicAt = (srcCanvas, w, h, cell) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const t = document.createElement('canvas'); t.width = Math.max(1, Math.round(w / cell)); t.height = Math.max(1, Math.round(h / cell)); const tg = t.getContext('2d'); tg.imageSmoothingEnabled = true; tg.drawImage(srcCanvas, 0, 0, t.width, t.height); g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, w, h); return c; };

window.zinePages = async () => {
  await document.fonts.load('800 80px "Bricolage Grotesque"'); await document.fonts.load('400 20px "DM Mono"'); await document.fonts.load('500 20px "DM Mono"');
  const pages = [], mk = (bg) => cnv(ZW, ZH, bg), SP = [BR.tomato, BR.sun, BR.lagoon, BR.cobalt, BR.gum];
  const src = await G('Green petals', 'passes', 0, 'tall'); const petals = state.work; // original-colour working canvas
  const bloom = await loadImg(SAMPLES.find(s => s.name === 'Data bloom').src), tubes = await loadImg(SAMPLES.find(s => s.name === 'Light tubes').src);
  const sq = (img) => { const c = document.createElement('canvas'); c.width = c.height = 800; fit(img)(c.getContext('2d'), 0, 0, 800, 800); return c; };
  const LADDER = [1, 2, 4, 8, 16, 32, 64, 128];

  // 01 cover
  { const [c, x] = mk(BR.ink); fit(P['04-glow-orb-neon'])(x, 0, 0, ZW, ZH); x.fillStyle = 'rgba(18,18,20,.55)'; x.fillRect(0, 0, ZW, ZH);
    ladderBar(x, 0, ZH - 220, ZW, 220, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]);
    drawMark(x, PADZ, PADZ, 130, BR.tomato); txt(x, 24, 'ISSUE 01 / FREE / A5', ZW - PADZ, PADZ + 40, { mono: 1, w: 500, align: 'right', col: BR.paper, ls: 4 });
    headZ(x, ['Less', 'picture,', 'same', 'feeling.'], PADZ - 10, 700, 330, [BR.paper, BR.paper, BR.tomato, BR.tomato]); pages.push(c); }
  // 02 contents
  { const [c, x] = mk(BR.paper); txt(x, 26, 'INSIDE', PADZ, 190, { mono: 1, w: 500, ls: 5 });
    const items = [['03', 'The picture, at 1x'], ['05', 'What a picture is made of'], ['07', 'Two colours. All noise.'], ['09', 'Colour is the last thing a picture needs'], ['11', 'Hold to squint'], ['13', 'Wall of posters'], ['14', 'How it is made'], ['15', 'Colophon']];
    items.forEach(([n, t], i) => { const Y = 330 + i * 150; txt(x, 26, n, PADZ, Y, { mono: 1, w: 500, col: BR.tomato }); txt(x, 76, t, PADZ + 110, Y + 8, { ls: -3 }); x.fillStyle = '#12121422'; x.fillRect(PADZ, Y + 50, ZW - PADZ * 2, 2); });
    para(x, 'A small book about a small idea: take a picture, throw most of it away, and see how much of it is still there.', PADZ, 1650, 900, 34, { lh: 1.5 }); folio(x, 2); pages.push(c); }
  // 03 full bleed poster
  { const [c, x] = mk(BR.ink); fit(P['01-data-bloom-ladder'])(x, 0, 0, ZW, ZH); pages.push(c); }
  // 04 essay
  { const [c, x] = mk(BR.paper); txt(x, 26, '01  /  THE IDEA', PADZ, 190, { mono: 1, w: 500, ls: 5 });
    headZ(x, ['What a', 'picture is', 'made of.'], PADZ, 460, 200, [BR.ink, BR.ink, BR.tomato]);
    let y = 1000; y = para(x, 'A photograph is a lot of tiny squares. Millions of them, each one a colour you cannot see on its own.', PADZ, y, 1240, 40); y += 36;
    y = para(x, 'Squint asks a rude question: how many do you actually need? Cut the squares in half, then in half again. Replace a thousand colours with ten. Somewhere around 100 cells, the picture falls apart. Just before that, it is still a picture.', PADZ, y, 1240, 40); y += 36;
    para(x, 'That moment, just before it falls apart, is the whole project.', PADZ, y, 1240, 40, { w: 500 }); folio(x, 4); pages.push(c); }
  // 05 the ladder
  { const [c, x] = mk(BR.ink); txt(x, 26, '02  /  THE LADDER', PADZ, 190, { mono: 1, w: 500, ls: 5, col: BR.dim });
    const bc = document.createElement('canvas'); bc.width = 1240; bc.height = 190; LADDER.forEach((cell, i) => { const Y = 260 + i * 215; fit(bloom)(bc.getContext('2d'), 0, 0, 1240, 190); const m = mosaicAt(bc, 1240, 190, Math.max(1, cell * 0.7)); x.drawImage(m, PADZ, Y); txt(x, 26, cell + 'x', PADZ + 18, Y + 42, { mono: 1, w: 500, col: BR.paper }); });
    txt(x, 26, 'Same picture, eight cell sizes. Doubling each time.', PADZ, 2020, { mono: 1, w: 400, col: BR.paper }); pages.push(c); }
  // 06 full bleed
  { const [c, x] = mk(BR.ink); fit(P['02-resin-passes-riso'])(x, 0, 0, ZW, ZH); pages.push(c); }
  // 07 dither
  { const [c, x] = mk(BR.sun); txt(x, 26, '03  /  DITHER', PADZ, 190, { mono: 1, w: 500, ls: 5 }); headZ(x, ['Two', 'colours.', 'All noise.'], PADZ, 450, 230, [BR.ink, BR.ink, BR.paper]);
    // bayer matrix diagram
    const B = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]; const cs = 110, bx = PADZ, by = 1000;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { x.fillStyle = `rgb(${B[j][i] * 16},${B[j][i] * 16},${B[j][i] * 16})`; x.fillRect(bx + i * cs, by + j * cs, cs, cs); txt(x, 30, String(B[j][i]), bx + i * cs + cs / 2, by + j * cs + cs / 2 + 10, { mono: 1, w: 500, align: 'center', col: B[j][i] > 7 ? BR.ink : BR.paper }); }
    // grey ramp dithered by that matrix
    for (let j = 0; j < 4 * 4; j++) for (let i = 0; i < 70; i++) { const g = i / 70 * 16, ok = B[j % 4][i % 4] < g; x.fillStyle = ok ? BR.paper : BR.ink; x.fillRect(PADZ + 600 + i * 11 - 0, by + j * 27.5, 11, 27.5); }
    txt(x, 24, 'BAYER 4 x 4', bx, by + 4 * cs + 50, { mono: 1, w: 500, ls: 4 }); txt(x, 24, 'A GREY RAMP, BLACK OR WHITE ONLY', PADZ + 600, by + 4 * cs + 50, { mono: 1, w: 500, ls: 4 });
    para(x, 'Each cell gets a number. If the picture is brighter than the number, the cell is white. If not, black. That is the entire trick. Your eye does the averaging.', PADZ, 1620, 1240, 38); folio(x, 7); pages.push(c); }
  // 08 full bleed
  { const [c, x] = mk(BR.ink); fit(P['06-tubes-full-sunburn'])(x, 0, 0, ZW, ZH); pages.push(c); }
  // 09 colour looks
  { const [c, x] = mk(BR.paper); txt(x, 26, '04  /  COLOUR', PADZ, 190, { mono: 1, w: 500, ls: 5 }); headZ(x, ['Colour is the', 'last thing a', 'picture needs.'], PADZ, 380, 130, [BR.ink, BR.ink, BR.tomato]);
    const look = [1, 4, 5, 6, 7, 8, 9, 10, 14]; const tw = 380, th = 320; const ps = document.createElement('canvas'); ps.width = 380; ps.height = 320; fit(petals)(ps.getContext('2d'), 0, 0, 380, 320);
    look.forEach((li, i) => { const X = PADZ + (i % 3) * (tw + 50), Y = 800 + Math.floor(i / 3) * (th + 70); const t = document.createElement('canvas'); t.width = tw; t.height = th; const g = t.getContext('2d'); g.drawImage(ps, 0, 0, tw, th); applyLook(g, tw, th, LOOKS[li]); x.drawImage(mosaicAt(t, tw, th, 8), X, Y); txt(x, 18, LOOKS[li].name.toUpperCase(), X, Y + th + 28, { mono: 1, w: 500, ls: 2 }); });
    folio(x, 9); pages.push(c); }
  // 10 full bleed
  { const [c, x] = mk(BR.ink); fit(P['03-petals-silhouette-matcha'])(x, 0, 0, ZW, ZH); pages.push(c); }
  // 11 squint test
  { const [c, x] = mk(BR.ink); txt(x, 26, '05  /  THE TEST', PADZ, 190, { mono: 1, w: 500, ls: 5, col: BR.dim }); headZ(x, ['Hold', 'to squint.'], PADZ, 440, 260, [BR.paper, BR.tomato]);
    const bc = document.createElement('canvas'); bc.width = 1240; bc.height = 1000; fit(tubes)(bc.getContext('2d'), 0, 0, 1240, 1000); const mos = mosaicAt(bc, 1240, 1000, 40);
    x.drawImage(mos, PADZ, 780); x.save(); x.beginPath(); x.rect(PADZ + 620, 780, 620, 1000); x.clip(); x.filter = 'blur(22px)'; x.drawImage(mos, PADZ - 30, 750, 1300, 1060); x.restore();
    txt(x, 24, 'LEFT: CELLS', PADZ + 18, 1750, { mono: 1, w: 500, ls: 3, col: BR.paper }); txt(x, 24, 'RIGHT: SQUINTED', PADZ + 640, 1750, { mono: 1, w: 500, ls: 3, col: BR.paper });
    para(x, 'Look at the left side from across the room. It turns into the right side. Your eyes were always the dither algorithm.', PADZ, 1880, 1240, 34, { col: BR.paper }); folio(x, 11, true); pages.push(c); }
  // 12 wall of posters
  { const [c, x] = mk(BR.paper); const ids = ['05-city-passes-cobalt', '07-steel-plate-blueprint', '08-rust-marks-acid', '09-wood-contact-forest', '10-cubes-ladder-coral', '11-stripes-outline-bubblegum']; const w = 386, h = 546;
    txt(x, 26, '07  /  WALL OF POSTERS', PADZ, 190, { mono: 1, w: 500, ls: 5 }); headZ(x, ['Same picture.', 'Many ways out.'], PADZ, 400, 130, [BR.ink, BR.tomato]);
    ids.forEach((id, i) => { const X = PADZ + (i % 3) * (w + 40), Y = 640 + Math.floor(i / 3) * (h + 60); x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 20; x.shadowOffsetY = 10; x.fillStyle = '#fff'; x.fillRect(X, Y, w, h); x.restore(); fit(P[id])(x, X, Y, w, h); });
    para(x, 'Twelve layouts and seventeen colour schemes ship with the app. Click the poster to get another.', PADZ, 1900, 1240, 30);
    folio(x, 12); pages.push(c); }
  // 13 how it's made
  { const [c, x] = mk(BR.lagoon); txt(x, 26, '06  /  HOW IT IS MADE', PADZ, 190, { mono: 1, w: 500, ls: 5 }); headZ(x, ['Five steps.', 'No magic.'], PADZ, 440, 200, [BR.ink, BR.paper]);
    const steps = [['Look', 'Shrink the picture to a size where every cell can be counted.'], ['Count', 'Group the colours into about ten that do the most work.'], ['Name', 'Give each one a name. Tomato. Marigold. Deep chartreuse.'], ['Squash', 'Snap every cell to its nearest colour. Bigger cells, fewer decisions.'], ['Print', 'Set it as a poster, with the numbers on it.']];
    steps.forEach(([t, d], i) => { const Y = 800 + i * 230; txt(x, 40, String(i + 1), PADZ, Y + 40, { mono: 1, w: 500 }); txt(x, 90, t, PADZ + 110, Y + 50, { ls: -3 }); para(x, d, PADZ + 110, Y + 100, 1100, 30, { col: BR.ink }); });
    folio(x, 14); pages.push(c); }
  // 14 colophon
  { const [c, x] = mk(BR.ink); drawMark(x, PADZ, PADZ, 120, BR.tomato); txt(x, 26, 'COLOPHON', PADZ, 480, { mono: 1, w: 500, ls: 5, col: BR.dim });
    let y = 560; [['Set in', 'Bricolage Grotesque and DM Mono.'], ['Colour', 'Ink, paper, tomato, sun, lagoon, cobalt, gum.'], ['Made with', 'Squint, a canvas, and a lot of squares.'], ['Cells', 'About 1,110 per poster. Enough.'], ['By', 'Keya Kapadia, 2026.']].forEach(([a, b]) => { txt(x, 22, a.toUpperCase(), PADZ, y, { mono: 1, w: 500, ls: 4, col: BR.dim }); y = para(x, b, PADZ, y + 52, 1200, 42, { col: BR.paper, mono: false, w: 500 }) + 40; });
    ladderBar(x, 0, ZH - 300, ZW, 150, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]); folio(x, 15, true); pages.push(c); }
  // 15 pattern spread
  { const [c, x] = mk(BR.tomato); ladderBar(x, 0, 0, ZW, ZH, [BR.tomato, BR.tomato, BR.ink, BR.sun, BR.tomato, BR.paper]); pages.push(c); }
  // 16 back
  { const [c, x] = mk(BR.ink); drawMark(x, ZW / 2 - 200, 650, 400, BR.tomato); txt(x, 120, 'Squint', ZW / 2, 1250, { align: 'center', col: BR.paper, ls: -6 }); txt(x, 26, 'HOW SIMPLE CAN A PICTURE GET?', ZW / 2, 1350, { mono: 1, w: 500, ls: 5, align: 'center', col: BR.dim }); txt(x, 24, 'SQUINT.PICTURE', ZW / 2, 1950, { mono: 1, w: 500, ls: 5, align: 'center', col: BR.tomato }); pages.push(c); }
  return pages;
};
