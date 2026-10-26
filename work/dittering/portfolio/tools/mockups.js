// scene mockups, all drawn from scratch on canvas so nothing is borrowed
var nz = (x, X, Y, W, H, amt, seed = 1, tint = [0, 0, 0]) => {
  const id = x.getImageData(X, Y, W, H), d = id.data, r = rng(seed);
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * amt; d[i] += n + tint[0]; d[i + 1] += n + tint[1]; d[i + 2] += n + tint[2]; }
  x.putImageData(id, X, Y);
};
// soft low-frequency blotches (stone, concrete, stains)
var blotch = (x, X, Y, W, H, scale, amt, seed, col = [0, 0, 0]) => {
  const c = document.createElement('canvas'); c.width = Math.ceil(W / 4); c.height = Math.ceil(H / 4); const g = c.getContext('2d'), id = g.createImageData(c.width, c.height);
  for (let j = 0; j < c.height; j++) for (let i = 0; i < c.width; i++) {
    const v = vnoise(i / scale * 4, j / scale * 4, seed) * .6 + vnoise(i / scale * 8, j / scale * 8, seed + 5) * .3 + vnoise(i / scale * 16, j / scale * 16, seed + 9) * .1;
    const k = (j * c.width + i) * 4; id.data[k] = col[0]; id.data[k + 1] = col[1]; id.data[k + 2] = col[2]; id.data[k + 3] = Math.max(0, (v - .35) * 2) * amt * 255;
  }
  g.putImageData(id, 0, 0); x.imageSmoothingEnabled = true; x.drawImage(c, X, Y, W, H);
};
var shade = (x, pts, col, blur = 0) => { x.save(); x.filter = blur ? `blur(${blur}px)` : 'none'; x.fillStyle = col; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); x.restore(); };
var rect = (x, X, Y, W, H, col) => { x.fillStyle = col; x.fillRect(X, Y, W, H); };

/* ---------- 1. yellow outdoor poster (also the video scene) ---------- */
window.YW = 1920; window.YH = 1280;
window.yellowBG = () => {
  const c = document.createElement('canvas'); c.width = YW; c.height = YH; const x = c.getContext('2d');
  rect(x, 0, 0, YW, YH, '#e9e7e0');
  // render panels
  for (let i = 0; i < 6; i++) { rect(x, 560, 0 + i * 215, 800, 3, '#00000018'); rect(x, 560, 2 + i * 215, 800, 2, '#ffffff66'); }
  rect(x, 560, 0, 3, YH, '#00000014');
  blotch(x, 540, 0, 840, 1100, 260, .16, 3, [150, 140, 120]); nz(x, 540, 0, 840, 1100, 10, 2);
  // dark door openings left and right
  rect(x, 0, 120, 470, 1000, '#0c0d0e'); rect(x, 1450, 120, 470, 1000, '#0c0d0e');
  rect(x, 60, 330, 330, 780, '#15181a'); rect(x, 100, 380, 250, 690, '#0f2a24'); rect(x, 1530, 330, 330, 780, '#15181a'); rect(x, 1570, 380, 250, 690, '#0f2a24');
  const door = (X) => { x.strokeStyle = '#2b3a38'; x.lineWidth = 6; x.strokeRect(X + 110, 395, 230, 660); x.strokeRect(X + 135, 420, 180, 250); x.strokeRect(X + 135, 710, 180, 310); };
  door(0); door(1470);
  // stone pillars
  const pillar = (X, W) => { rect(x, X, 0, W, 1140, '#b6b0a2'); blotch(x, X, 0, W, 1140, 90, .5, X, [110, 104, 90]); nz(x, X, 0, W, 1140, 34, X, [0, 0, 0]); rect(x, X, 0, 6, 1140, '#ffffff30'); rect(x, X + W - 8, 0, 8, 1140, '#00000025'); };
  pillar(430, 130); pillar(1360, 120);
  // base blocks and plinth
  rect(x, 400, 1050, 1170 + 0, 120, '#c4beb0'); rect(x, 300, 1060, 150, 100, '#b3ad9f'); rect(x, 1430, 1060, 190, 100, '#b3ad9f');
  rect(x, 0, 1150, YW, 130, '#d9d4c8'); // pavement
  for (let j = 0; j < 8; j++) for (let i = 0; i < 40; i++) { const ox = (j % 2) * 24; x.fillStyle = `hsl(40 8% ${68 + (hash2(i, j, 4) * 14)}%)`; x.beginPath(); x.ellipse(i * 48 + ox, 1160 + j * 17, 21, 7, 0, 0, 7); x.fill(); }
  rect(x, 400, 1148, 1180, 6, '#00000030');
  return c;
};
window.drawYellow = (x, bg, poster, opt = {}) => {
  const fx = 700, fy = 150, fw = 520, fh = 830; // frame (white lightbox edge)
  x.drawImage(bg, 0, 0);
  // wall shadow of frame (hard, cast down-left)
  shade(x, [[fx - 90, fy + 40], [fx + fw - 90, fy + 40], [fx + fw - 90, fy + fh + 40], [fx - 90, fy + fh + 40]], 'rgba(40,36,30,.42)', 2);
  // frame
  rect(x, fx - 10, fy - 10, fw + 20, fh + 20, '#f6f5f1'); rect(x, fx - 10, fy - 10, 4, fh + 20, '#ffffff'); rect(x, fx + fw + 6, fy - 10, 4, fh + 20, '#cfcdc6'); rect(x, fx - 10, fy + fh + 6, fw + 20, 4, '#cfcdc6');
  rect(x, fx, fy, fw, fh, '#141414');
  const px = fx + 8, py = fy + 8, pw = fw - 16, ph = fh - 16;
  x.save(); x.beginPath(); x.rect(px, py, pw, ph); x.clip(); poster(x, px, py, pw, ph); x.restore();
  // glass reflection
  const g = x.createLinearGradient(px, py, px + pw, py + ph); g.addColorStop(0, 'rgba(255,255,255,.14)'); g.addColorStop(.35, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.05)'); x.fillStyle = g; x.fillRect(px, py, pw, ph);
  // light box glow: the poster lights the wall a little
  if (opt.glow) { x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(60px)'; x.globalAlpha = .25; poster(x, fx - 40, fy - 40, fw + 80, fh + 80); x.restore(); }
  // sunlight: a hard diagonal shadow from the roof line crosses the wall, the frame and the poster
  x.save(); x.globalCompositeOperation = 'multiply';
  shade(x, [[1180, 0], [1920, 0], [1920, 1140], [1620, 1140], [1010, 560], [930, 380], [1000, 150], [1090, 60]], 'rgba(150,150,170,.62)', 3);
  shade(x, [[0, 0], [620, 0], [560, 120], [0, 120]], 'rgba(160,160,180,.55)', 3);
  x.restore();
  // warm sun patch
  x.save(); x.globalCompositeOperation = 'soft-light'; const w = x.createLinearGradient(0, 0, YW, YH); w.addColorStop(0, 'rgba(255,230,160,.55)'); w.addColorStop(.6, 'rgba(255,230,160,0)'); x.fillStyle = w; x.fillRect(0, 0, YW, YH); x.restore();
  // frame shadow on pavement
  shade(x, [[fx - 70, 1150], [fx + fw - 90, 1150], [fx + fw + 20, 1190], [fx - 10, 1190]], 'rgba(30,26,22,.25)', 6);
};

/* ---------- 2. wheatpasted wall ---------- */
window.wheatScene = async (imgs, W = 2400, H = 1800) => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  rect(x, 0, 0, W, H, '#8d8f90'); blotch(x, 0, 0, W, H, 300, .5, 11, [60, 62, 64]); blotch(x, 0, 0, W, H, 120, .4, 12, [190, 192, 194]); nz(x, 0, 0, W, H, 26, 5);
  // panel seams and tie holes
  for (let i = 0; i <= W; i += 400) { rect(x, i, 0, 3, H, '#00000030'); rect(x, i + 3, 0, 2, H, '#ffffff22'); }
  for (let j = 0; j <= H; j += 300) { rect(x, 0, j, W, 3, '#00000028'); }
  for (let i = 200; i < W; i += 400) for (let j = 150; j < H; j += 300) { x.fillStyle = '#4a4c4e'; x.beginPath(); x.arc(i, j, 6, 0, 7); x.fill(); x.fillStyle = '#ffffff30'; x.beginPath(); x.arc(i + 1, j + 2, 6, 0, 3); x.fill(); }
  // paste poster with creases, torn edge, and glue stain
  const paste = (img, X, Y, w, h, rot, seed) => {
    const r = rng(seed);
    // glue / torn paper behind
    x.save(); x.translate(X + w / 2, Y + h / 2); x.rotate(rot);
    x.fillStyle = 'rgba(235,233,225,.9)'; x.beginPath(); const m = 30;
    for (let i = 0; i <= 40; i++) x.lineTo(-w / 2 - m * r() + i * (w + 2 * m) / 40 - 0, -h / 2 - 10 - m * r() * 1.4); for (let j = 0; j <= 30; j++) x.lineTo(w / 2 + m * r(), -h / 2 + j * h / 30 + r() * 12); for (let i = 40; i >= 0; i--) x.lineTo(-w / 2 + i * w / 40, h / 2 + m * r()); for (let j = 30; j >= 0; j--) x.lineTo(-w / 2 - m * r(), -h / 2 + j * h / 30);
    x.fill(); x.restore();
    // shadow
    x.save(); x.translate(X + w / 2, Y + h / 2); x.rotate(rot); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 24; x.shadowOffsetX = 10; x.shadowOffsetY = 14; x.fillStyle = '#000'; x.fillRect(-w / 2, -h / 2, w, h); x.restore();
    // art with wrinkles: draw art, then overlay crease lines & light
    const a = document.createElement('canvas'); a.width = w; a.height = h; const g = a.getContext('2d'); g.drawImage(img, 0, 0, w, h);
    g.globalCompositeOperation = 'multiply';
    const wr = g.createImageData(w, h), d = wr.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const v = vnoise(i / 70, j / 70, seed) * .6 + vnoise(i / 18, j / 22, seed + 1) * .3 + vnoise(i / 5, j / 5, seed + 2) * .1, ridge = Math.abs(vnoise(i / 90, j / 120, seed + 7) - .5) < .012 ? .1 : 0;
      const k = (j * w + i) * 4, s = 255 * (.86 + v * .22 - ridge); d[k] = d[k + 1] = d[k + 2] = Math.min(255, s); d[k + 3] = 255;
    }
    const wc = document.createElement('canvas'); wc.width = w; wc.height = h; wc.getContext('2d').putImageData(wr, 0, 0); g.drawImage(wc, 0, 0); g.globalCompositeOperation = 'source-over';
    // glossy highlights
    const hg = g.createLinearGradient(0, 0, w, h); hg.addColorStop(0, 'rgba(255,255,255,.2)'); hg.addColorStop(.5, 'rgba(255,255,255,0)'); hg.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = hg; g.fillRect(0, 0, w, h);
    // ragged edge mask
    g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 90; i++) { g.fillRect(r() * w, 0, 3 + r() * 14, r() * 10); g.fillRect(r() * w, h - r() * 9, 3 + r() * 14, 10); g.fillRect(0, r() * h, r() * 8, 3 + r() * 14); g.fillRect(w - r() * 8, r() * h, 10, 3 + r() * 14); }
    x.save(); x.translate(X + w / 2, Y + h / 2); x.rotate(rot); x.drawImage(a, -w / 2, -h / 2); x.restore();
  };
  paste(imgs[0], -60, 420, 760, 1075, -.01, 3); paste(imgs[1], 860, 560, 1000, 707, .006, 8); paste(imgs[2], 1960, 360, 760, 1075, .012, 6);
  // sun stripes
  x.save(); x.globalCompositeOperation = 'multiply'; for (let i = 0; i < 7; i++) { const X0 = i * 400 - 100, g = x.createLinearGradient(X0, 0, X0 + 160, 0); g.addColorStop(0, 'rgba(60,64,70,0)'); g.addColorStop(.3, 'rgba(60,64,70,.38)'); g.addColorStop(.7, 'rgba(60,64,70,.38)'); g.addColorStop(1, 'rgba(60,64,70,0)'); x.fillStyle = g; x.save(); x.transform(1, 0, .08, 1, 0, 0); x.fillRect(X0, 0, 160, H); x.restore(); } x.restore();
  const v = x.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.35)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  return c;
};

/* ---------- 3. freestanding sign by a hedge ---------- */
window.signScene = (poster, W = 2048, H = 2048) => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  // facade: sky-glass and fins
  rect(x, 0, 0, W, H, '#b9bcbc');
  for (let i = 0; i < 6; i++) { const X = i * 360 - 60; rect(x, X, 0, 220, 1200, '#2d3f50'); const g = x.createLinearGradient(X, 0, X + 220, 0); g.addColorStop(0, '#3a5166'); g.addColorStop(1, '#1d2b38'); x.fillStyle = g; x.fillRect(X, 0, 220, 1200); rect(x, X + 200, 0, 8, 1200, '#ffffff20'); }
  x.save(); x.globalAlpha = .5; const sky = x.createLinearGradient(0, 0, 0, 900); sky.addColorStop(0, '#9fc6ee'); sky.addColorStop(1, '#e8f1fa'); x.fillStyle = sky; for (let i = 0; i < 6; i++) x.fillRect(i * 360 - 60 + 20, 120 + (i % 2) * 40, 180, 700); x.restore();
  for (let i = 0; i < 40; i++) { const X = i * 52 - 20; rect(x, X, 0, 22, 1180, i % 2 ? '#8f9494' : '#a8adad'); rect(x, X, 0, 3, 1180, '#ffffff55'); }
  for (let j = 0; j < 5; j++) rect(x, 0, 220 + j * 210, W, 14, '#d4d6d4'), rect(x, 0, 234 + j * 210, W, 6, '#00000025');
  // hedge
  rect(x, 0, 1100, W, 520, '#2f5a1c'); for (let i = 0; i < 4200; i++) { const X = Math.random() * W, Y = 1040 + Math.random() * 520, l = 32 + Math.random() * 40; x.fillStyle = `hsl(${88 + Math.random() * 30} ${50 + Math.random() * 25}% ${14 + Math.random() * 34}%)`; x.beginPath(); x.ellipse(X, Y, 16, 9, Math.random() * 3, 0, 7); x.fill(); }
  // planter wall
  rect(x, 0, 1600, W, 450, '#c9c6bf'); blotch(x, 0, 1600, W, 450, 200, .5, 21, [120, 116, 104]); nz(x, 0, 1600, W, 450, 16, 4); rect(x, 0, 1600, W, 8, '#ffffff66'); rect(x, 0, 1608, W, 10, '#00000030');
  // sign
  const fx = 520, fy = 160, fw = 900, fh = 1280;
  shade(x, [[fx + fw + 20, fy + 40], [fx + fw + 150, fy + 90], [fx + fw + 150, fy + fh + 100], [fx + fw + 20, fy + fh]], 'rgba(10,30,5,.4)', 12);
  rect(x, fx, fy, fw, fh, '#cfd2d3'); const mg = x.createLinearGradient(fx, 0, fx + fw, 0); mg.addColorStop(0, '#f2f4f5'); mg.addColorStop(.1, '#aeb3b5'); mg.addColorStop(.9, '#d9dcdd'); mg.addColorStop(1, '#8c9193'); x.fillStyle = mg; x.fillRect(fx, fy, fw, fh);
  // side thickness
  rect(x, fx + fw, fy - 8, 100, fh + 16, '#9ca1a3'); const sg = x.createLinearGradient(fx + fw, 0, fx + fw + 100, 0); sg.addColorStop(0, '#d5d8d9'); sg.addColorStop(1, '#6a6f71'); x.fillStyle = sg; x.fillRect(fx + fw, fy - 4, 100, fh + 8);
  const pm = 36; poster(x, fx + pm, fy + pm, fw - pm * 2, fh - pm * 2);
  const gl = x.createLinearGradient(fx, fy, fx + fw, fy + fh); gl.addColorStop(0, 'rgba(255,255,255,.18)'); gl.addColorStop(.4, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.fillRect(fx + pm, fy + pm, fw - pm * 2, fh - pm * 2);
  // legs and brackets
  rect(x, fx + 140, fy + fh, 60, 190, '#a9aeb0'); rect(x, fx + fw - 220, fy + fh, 60, 190, '#a9aeb0'); rect(x, fx + 100, 1560, 140, 140, '#c2c4c3'); rect(x, fx + fw - 260, 1560, 140, 140, '#c2c4c3');
  [[fx + 130, 1600], [fx + 170, 1650], [fx + fw - 230, 1600], [fx + fw - 190, 1650]].forEach(([a, b]) => { x.fillStyle = '#6b6e70'; x.beginPath(); x.arc(a + 14, b + 14, 9, 0, 7); x.fill(); });
  shade(x, [[fx - 30, 1660], [fx + fw + 160, 1660], [fx + fw + 260, 1740], [fx + 20, 1740]], 'rgba(0,0,0,.18)', 14);
  x.save(); x.globalCompositeOperation = 'soft-light'; const w = x.createLinearGradient(0, 0, W, H); w.addColorStop(0, 'rgba(255,240,200,.5)'); w.addColorStop(1, 'rgba(0,0,0,.2)'); x.fillStyle = w; x.fillRect(0, 0, W, H); x.restore();
  return c;
};

/* ---------- 4. phones + laptop with the app on screen ---------- */
window.deviceScene = (posters, W = 2400, H = 1600) => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1b1b1f'); bg.addColorStop(1, '#0b0b0d'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
  ladderBar(x, 0, H - 60, W, 60, [BR.ink, '#3a0ca3', BR.cobalt, BR.gum, BR.tomato, BR.sun, BR.paper]);
  const cover = (src, X, Y, w, h) => { const s = Math.max(w / src.width, h / src.height); x.save(); x.beginPath(); x.rect(X, Y, w, h); x.clip(); x.drawImage(src, X + (w - src.width * s) / 2, Y + (h - src.height * s) / 2, src.width * s, src.height * s); x.restore(); };
  // laptop
  const lx = 140, ly = 220, lw = 1500, lh = 940;
  x.fillStyle = '#2a2a2e'; x.beginPath(); x.roundRect(lx, ly, lw, lh, 28); x.fill(); x.fillStyle = '#000'; x.beginPath(); x.roundRect(lx + 18, ly + 18, lw - 36, lh - 36, 14); x.fill();
  const sx = lx + 18, sy = ly + 18, sw = lw - 36, sh = lh - 36; rect(x, sx, sy, sw, sh, '#14100f');
  drawMark(x, sx + 36, sy + 28, 40, BR.tomato); txt(x, 34, 'Squint', sx + 90, sy + 62, { col: BR.paper, ls: -1 });
  const pw = sh - 230, ph = pw / 1.414; cover(posters[0], sx + (sw - ph * 1.414) / 2 + 0, sy + 90, ph * 1.414, ph); // wide
  const dockX = sx + sw / 2 - 330, dockY = sy + sh - 110; x.fillStyle = '#26262a'; x.beginPath(); x.roundRect(dockX, dockY, 660, 70, 35); x.fill();
  [0, 1, 2, 3, 4, 5].forEach(i => { x.fillStyle = [BR.paper, BR.tomato, BR.sun, BR.lagoon, BR.cobalt, BR.gum][i]; x.beginPath(); x.arc(dockX + 70 + i * 104, dockY + 35, i === 0 ? 14 : 20, 0, 7); x.fill(); });
  rect(x, lx - 80, ly + lh, lw + 160, 30, '#3a3a40'); x.fillStyle = '#4a4a50'; x.beginPath(); x.roundRect(lx + lw / 2 - 120, ly + lh, 240, 12, 6); x.fill();
  // phones
  const phone = (X, Y, w, h, art) => { x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 50; x.shadowOffsetY = 24; x.fillStyle = '#2b2b30'; x.beginPath(); x.roundRect(X, Y, w, h, 64); x.fill(); x.restore(); x.save(); x.beginPath(); x.roundRect(X + 14, Y + 14, w - 28, h - 28, 52); x.clip(); rect(x, X, Y, w, h, BR.ink); art(X + 14, Y + 14, w - 28, h - 28); x.restore(); x.fillStyle = '#000'; x.beginPath(); x.roundRect(X + w / 2 - 60, Y + 30, 120, 34, 17); x.fill(); };
  phone(1720, 320, 520, 1060, (X, Y, w, h) => { cover(posters[1], X, Y, w, h); });
  phone(1500, 560, 440, 900, (X, Y, w, h) => { rect(x, X, Y, w, h, BR.ink); drawMark(x, X + 40, Y + 120, 54, BR.tomato); txt(x, 64, 'Pick a', X + 40, Y + 260, { col: BR.paper, ls: -3 }); txt(x, 64, 'picture', X + 40, Y + 326, { col: BR.paper, ls: -3 });
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => cover(posters[2 + i + j * 2] || posters[2], X + 40 + i * 180, Y + 400 + j * 200, 170, 190)); });
  return c;
};

/* ---------- 5. stationery flat lay ---------- */
window.stationeryScene = (art, W = 2400, H = 1600) => {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  rect(x, 0, 0, W, H, '#d8d3c8'); blotch(x, 0, 0, W, H, 280, .35, 31, [255, 255, 255]); nz(x, 0, 0, W, H, 18, 9);
  const sh = (X, Y, w, h, rot, fn) => { x.save(); x.translate(X + w / 2, Y + h / 2); x.rotate(rot); x.shadowColor = 'rgba(40,30,20,.35)'; x.shadowBlur = 36; x.shadowOffsetX = 12; x.shadowOffsetY = 22; x.fillStyle = '#fff'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent'; x.translate(-w / 2, -h / 2); x.save(); x.beginPath(); x.rect(0, 0, w, h); x.clip(); fn(w, h); x.restore(); x.restore(); };
  // letterhead A4
  sh(160, 120, 900, 1273, -.03, (w, h) => { rect(x, 0, 0, w, h, BR.paper); drawMark(x, 70, 70, 80, BR.tomato); txt(x, 70, 'Squint', 170, 135, { col: BR.ink, ls: -3 });
    txt(x, 20, 'HELLO@SQUINT.PICTURE', 70, 280, { mono: 1, w: 500, ls: 3, col: BR.dim }); txt(x, 26, 'Dear whoever sent us that blurry photo,', 70, 420, { mono: 1, w: 400 });
    for (let i = 0; i < 9; i++) rect(x, 70, 480 + i * 44, 60 + (i * 97 % 600) + 160, 14, '#12121422');
    ladderBar(x, 0, h - 90, w, 90, [BR.paper, BR.sun, BR.tomato, BR.gum, BR.cobalt, '#3a0ca3', BR.ink]); });
  // envelope
  sh(1180, 150, 1000, 520, .025, (w, h) => { rect(x, 0, 0, w, h, BR.tomato); x.fillStyle = '#e24a28'; x.beginPath(); x.moveTo(0, 0); x.lineTo(w / 2, h * .55); x.lineTo(w, 0); x.closePath(); x.fill(); drawMark(x, w / 2 - 55, h * .56, 110, BR.ink); txt(x, 20, 'SQUINT.PICTURE', 40, h - 40, { mono: 1, w: 500, ls: 3, col: BR.ink }); });
  // business cards
  const card = (X, Y, rot, ink, fg, back) => sh(X, Y, 700, 400, rot, (w, h) => { rect(x, 0, 0, w, h, ink); if (back) { drawMark(x, w / 2 - 90, h / 2 - 90, 180, fg); } else { txt(x, 54, 'Keya Kapadia', 50, 110, { col: fg, ls: -2 }); txt(x, 20, 'MAKER OF SQUINT', 50, 150, { mono: 1, w: 500, ls: 4, col: fg }); txt(x, 20, 'kapak530@newschool.edu', 50, h - 50, { mono: 1, w: 400, col: fg }); ladderBar(x, w - 220, 0, 220, h * .6, [ink, BR.cobalt, BR.gum, BR.sun, fg]); } });
  card(1180, 760, -.04, BR.ink, BR.paper, false); card(1500, 1000, .05, BR.tomato, BR.ink, true); card(1020, 1130, .02, BR.paper, BR.ink, false);
  // stickers
  [[2020, 760, BR.sun], [1900, 1180, BR.lagoon], [2150, 1050, BR.gum]].forEach(([X, Y, col], i) => { x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 16; x.shadowOffsetY = 8; x.fillStyle = col; x.beginPath(); x.arc(X, Y, 100, 0, 7); x.fill(); x.restore(); drawMark(x, X - 60, Y - 60, 120, BR.ink); });
  return c;
};
