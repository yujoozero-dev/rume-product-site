/* ============================================================
   RUME — Bedroom floor planner
   Structural + functional base faithful to the MCP reference:
   hatch concrete walls, sliding windows, swing-door no-go arc,
   furniture arrangements, and 발광버섯 light clusters (군락).
   Restyled to the RUME palette.
   ============================================================ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const svg = $('#floorplan');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const C = { line: '#3a1c10', floor: '#f6efe1' };
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  const OUT = 40, SIZE = 620, WALL = 22, IN = OUT + WALL, INW = SIZE - WALL * 2;
  const x0 = IN, y0 = IN, x1 = IN + INW, y1 = IN + INW;

  function txt(x, y, s, rot) {
    const t = el('text', { x: x, y: y, 'text-anchor': 'middle', fill: '#9a8c7e', 'font-size': 13, 'font-family': 'Hanken Grotesk, sans-serif' });
    if (rot) t.setAttribute('transform', 'rotate(-90 ' + x + ' ' + y + ')');
    t.textContent = s; return t;
  }

  /* ---------- structure: walls, windows, door ---------- */
  function drawStructure() {
    const g = $('#structure-layer'); g.innerHTML = '';
    g.appendChild(el('rect', { x: OUT, y: OUT, width: SIZE, height: SIZE, fill: 'url(#wall-hatch)', stroke: C.line, 'stroke-width': 1.4 }));
    g.appendChild(el('rect', { x: IN, y: IN, width: INW, height: INW, fill: C.floor, stroke: C.line, 'stroke-width': 1 }));
    g.appendChild(txt(OUT + SIZE / 2, OUT - 14, '3.6 m'));
    g.appendChild(txt(OUT - 16, OUT + SIZE / 2, '3.6 m', true));
    // top sliding 2-panel window
    g.appendChild(el('rect', { x: 250, y: OUT - 1, width: 170, height: WALL + 2, fill: '#fff', stroke: C.line, 'stroke-width': 1 }));
    g.appendChild(el('line', { x1: 250, y1: OUT + WALL / 2, x2: 420, y2: OUT + WALL / 2, stroke: C.line, 'stroke-width': 0.8 }));
    g.appendChild(el('line', { x1: 335, y1: OUT, x2: 335, y2: OUT + WALL, stroke: C.line, 'stroke-width': 0.8 }));
    // right vertical window
    g.appendChild(el('rect', { x: x1 - 1, y: 150, width: WALL + 2, height: 230, fill: '#fff', stroke: C.line, 'stroke-width': 1 }));
    g.appendChild(el('line', { x1: x1 + WALL / 2, y1: 150, x2: x1 + WALL / 2, y2: 380, stroke: C.line, 'stroke-width': 0.8 }));
    // swing door bottom-right (no-go arc)
    const dx = 470, dw = 90;
    g.appendChild(el('rect', { x: dx, y: y1 - 1, width: dw, height: WALL + 2, fill: '#fff' }));
    g.appendChild(el('line', { x1: dx, y1: y1, x2: dx, y2: y1 - dw, stroke: C.line, 'stroke-width': 1.4 }));
    g.appendChild(el('path', { d: 'M ' + dx + ' ' + (y1 - dw) + ' A ' + dw + ' ' + dw + ' 0 0 1 ' + (dx + dw) + ' ' + y1, fill: 'none', stroke: C.line, 'stroke-width': 0.8, 'stroke-dasharray': '3,3' }));
  }

  /* ---------- furniture primitives ---------- */
  function bed(x, y, w, h) {
    return [
      el('rect', { x: x, y: y, width: w, height: h, fill: '#fff', stroke: C.line, 'stroke-width': 1.2, rx: 3 }),
      el('rect', { x: x + 8, y: y + 8, width: w - 16, height: h * 0.26, fill: 'none', stroke: C.line, 'stroke-width': 0.7, rx: 2 }),
      el('circle', { cx: x + w * 0.32, cy: y + h * 0.14, r: 7, fill: 'none', stroke: C.line, 'stroke-width': 0.7 }),
      el('circle', { cx: x + w * 0.68, cy: y + h * 0.14, r: 7, fill: 'none', stroke: C.line, 'stroke-width': 0.7 })
    ];
  }
  const box = (x, y, w, h) => el('rect', { x: x, y: y, width: w, height: h, fill: '#fff', stroke: C.line, 'stroke-width': 1, rx: 2 });

  /* ---------- furniture arrangements (respect walls/door) ---------- */
  const FURN = [
    function (g) { bed(x0 + 10, y0 + 10, 250, 300).forEach((n) => g.appendChild(n));
      g.appendChild(box(x0 + 10, y0 + 320, 52, 52)); g.appendChild(box(x0 + 10, y0 + 378, 52, 52));
      g.appendChild(box(x1 - 30, y0 + 120, 22, 200)); },
    function (g) { bed(x0 + 10, y1 - 310, 250, 300).forEach((n) => g.appendChild(n));
      g.appendChild(box(x0 + 270, y1 - 310, 52, 52)); g.appendChild(box(x0 + 270, y1 - 252, 52, 52));
      g.appendChild(box(x0 + 150, y0 + 8, 220, 22)); },
    function (g) { bed(x1 - 260, y0 + 40, 250, 300).forEach((n) => g.appendChild(n));
      g.appendChild(box(x1 - 312, y0 + 40, 46, 56)); g.appendChild(box(x1 - 312, y0 + 284, 46, 56));
      g.appendChild(box(x0 + 8, y1 - 240, 22, 200)); }
  ];

  /* ---------- mushroom light clusters (군락) ---------- */
  const LIGHTS = [
    [[330, 430, 30], [378, 418, 26], [300, 470, 24], [360, 478, 28], [410, 452, 22], [342, 505, 20], [392, 500, 18]],
    [[210, 250, 30], [255, 235, 24], [185, 290, 22], [250, 288, 26], [300, 265, 20]],
    [[470, 540, 32], [515, 520, 26], [450, 580, 24], [505, 580, 26], [545, 548, 22], [480, 608, 18]]
  ];

  let fi = 0, li = 0;

  function drawFurniture() {
    const g = $('#furniture-layer'); g.style.opacity = 0;
    setTimeout(() => { g.innerHTML = ''; FURN[fi](g); g.style.opacity = 1; }, 160);
  }
  function drawLights() {
    const g = $('#light-layer'); g.style.opacity = 0;
    setTimeout(() => {
      g.innerHTML = '';
      LIGHTS[li].forEach((p) => {
        const cx = p[0], cy = p[1], r = p[2];
        g.appendChild(el('circle', { cx: cx, cy: cy, r: r * 1.7, fill: 'url(#lightZone)' }));
        g.appendChild(el('circle', { cx: cx, cy: cy, r: r * 0.42, fill: '#FFE9C0', stroke: C.line, 'stroke-width': 0.7 }));
        g.appendChild(el('circle', { cx: cx, cy: cy, r: r * 0.16, fill: '#fff' }));
      });
      g.style.opacity = 1;
    }, 160);
  }

  let built = false;
  function drawPlan() { if (!built) { drawStructure(); built = true; } drawFurniture(); drawLights(); }

  /* ---------- controls ---------- */
  const bF = $('#btn-furniture'), bL = $('#btn-light'), bS = $('#btn-shuffle'), bB = $('#btn-buy');
  function flash(btn) { if (!btn) return; btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 600); }

  if (bF) bF.addEventListener('click', () => { fi = (fi + 1) % FURN.length; drawFurniture(); flash(bF);
    window.rumeToast && window.rumeToast('가구 배치 ' + (fi + 1) + ' / ' + FURN.length); });
  if (bL) bL.addEventListener('click', () => { li = (li + 1) % LIGHTS.length; drawLights(); flash(bL);
    window.rumeToast && window.rumeToast('조명 군락 ' + (li + 1) + ' / ' + LIGHTS.length + ' — ' + LIGHTS[li].length + '구 배치'); });
  if (bS) bS.addEventListener('click', () => {
    fi = Math.floor(Math.random() * FURN.length); li = Math.floor(Math.random() * LIGHTS.length);
    drawFurniture(); drawLights(); flash(bS);
    window.rumeToast && window.rumeToast('새로운 레이아웃을 생성했습니다');
  });
  if (bB) bB.addEventListener('click', (e) => {
    e.preventDefault();
    window.rumeAddToCart && window.rumeAddToCart('L', 'red');
    window.rumeToast && window.rumeToast('Rume - L 조명 세트를 담았습니다');
    setTimeout(() => { window.rumeOpenCart && window.rumeOpenCart(); }, 250);
  });

  drawPlan();
})();
