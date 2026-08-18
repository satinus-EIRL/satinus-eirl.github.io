/**
 * HEX N10 — Silhouette Canvas
 * Supports multiple instances: hex-canvas, hex-canvas-2, etc.
 * © 2025-2026 Satinus E.I.R.L.
 */
(function () {
  'use strict';

  function initHex(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const DPR   = Math.min(window.devicePixelRatio || 1, 2);
  const SIZE  = parseInt(canvas.dataset.size || '200', 10);
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const N  = 10;
  const R  = SIZE * 0.42;

  // ── Pointy-top hex vertex at ring radius r, index i ──
  function vertex(r, i) {
    const a = (60 * i - 30) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  // ── Grid point formula for sector subdivision ──
  // P(r,j) = A + (r/N)*(B-A) + (j/N)*(C-B)
  function P(r, j, A, B, C) {
    return {
      x: A.x + (r / N) * (B.x - A.x) + (j / N) * (C.x - B.x),
      y: A.y + (r / N) * (B.y - A.y) + (j / N) * (C.y - B.y),
    };
  }

  // ── Build cell list (static, seeded pattern) ──
  let seed = 0xA4B2C3D4;
  function lcg() {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0xFFFFFFFF;
  }

  const cells = [];

  for (let s = 0; s < 6; s++) {
    const A = { x: cx, y: cy };
    const B = vertex(R, s);
    const C = vertex(R, (s + 1) % 6);

    for (let r = 1; r <= N; r++) {
      // Upward triangles: k = 0 … r-1
      for (let k = 0; k < r; k++) {
        const lit = lcg() > 0.52;
        cells.push({
          v: [P(r - 1, k, A, B, C), P(r, k, A, B, C), P(r, k + 1, A, B, C)],
          ring: r, sector: s, lit,
          phase: lcg() * Math.PI * 2,
          pulse: lcg() < 0.04,
        });
      }
      // Downward triangles: k = 0 … r-2
      for (let k = 0; k < r - 1; k++) {
        const lit = lcg() > 0.48;
        cells.push({
          v: [P(r - 1, k, A, B, C), P(r - 1, k + 1, A, B, C), P(r, k + 1, A, B, C)],
          ring: r, sector: s, lit,
          phase: lcg() * Math.PI * 2,
          pulse: false,
        });
      }
    }
  }

  // ── Draw ──
  let frame = 0;

  function drawCell(cell, t) {
    const [v0, v1, v2] = cell.v;
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.closePath();
    return true;
  }

  function render() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const t = frame / 60; // seconds

    // ── Background radial glow ──
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.15);
    bg.addColorStop(0,   'rgba(0,212,255,0.04)');
    bg.addColorStop(0.6, 'rgba(0,212,255,0.02)');
    bg.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // ── Filled cells ──
    for (const cell of cells) {
      if (!cell.lit) continue;
      const ringRatio = cell.ring / N;
      let alpha;
      if (cell.pulse) {
        alpha = 0.07 + 0.07 * Math.sin(t * 1.8 + cell.phase);
      } else if (cell.ring === N) {
        alpha = 0.22 + 0.06 * Math.sin(t * 0.6 + cell.phase);
      } else {
        alpha = 0.05 + ringRatio * 0.12;
      }
      const color = cell.sector % 2 === 0
        ? `rgba(0,212,255,${alpha.toFixed(3)})`
        : `rgba(123,47,255,${alpha.toFixed(3)})`;

      drawCell(cell, t);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // ── Grid lines ──
    ctx.lineWidth = 0.3;
    for (const cell of cells) {
      const alpha = (0.04 + (cell.ring / N) * 0.1).toFixed(3);
      drawCell(cell, t);
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.stroke();
    }

    // ── Spoke lines (center → outer vertex) ──
    ctx.lineWidth = 0.4;
    for (let i = 0; i < 6; i++) {
      const v = vertex(R, i);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(v.x, v.y);
      ctx.strokeStyle = 'rgba(0,212,255,0.12)';
      ctx.stroke();
    }

    // ── Intermediate concentric hexagons ──
    ctx.lineWidth = 0.4;
    for (let r = 2; r < N; r += 2) {
      const alpha = (0.05 + (r / N) * 0.07).toFixed(3);
      const verts = Array.from({ length: 6 }, (_, i) => vertex(R * r / N, i));
      ctx.beginPath();
      verts.forEach((v, i) => (i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y)));
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.stroke();
    }

    // ── Outer hexagon with glow ──
    const outerAlpha = 0.55 + 0.2 * Math.sin(t * 0.5);
    const verts = Array.from({ length: 6 }, (_, i) => vertex(R, i));
    ctx.beginPath();
    verts.forEach((v, i) => (i === 0 ? ctx.moveTo(v.x, v.y) : ctx.lineTo(v.x, v.y)));
    ctx.closePath();
    ctx.strokeStyle = `rgba(0,212,255,${outerAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = 'rgba(0,212,255,0.55)';
    ctx.shadowBlur  = 10;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // ── Center dot ──
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,212,255,0.55)';
    ctx.shadowColor = 'rgba(0,212,255,0.8)';
    ctx.shadowBlur  = 6;
    ctx.fill();
    ctx.shadowBlur  = 0;

    frame++;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
  } // end initHex

  ['hex-canvas', 'hex-canvas-2'].forEach(initHex);
})();
