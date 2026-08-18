/**
 * Toroidal Protocol — Ring Network Canvas
 * Supports multiple instances via data-id or default 'torus-canvas'.
 * © 2025-2026 Satinus E.I.R.L.
 */
(function () {
  'use strict';

  function initTorus(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const DPR  = Math.min(window.devicePixelRatio || 1, 2);
  const SIZE = parseInt(canvas.dataset.size || '200', 10);
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  ctx.scale(DPR, DPR);

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const NODES = 16;
  const R_OUTER = SIZE * 0.40;
  const R_INNER = SIZE * 0.22;
  const NODE_R  = 3.5;

  const COL_PROTO  = '#8b5cf6';
  const COL_ACTIVE = '#c084fc';
  const COL_PULSE  = 'rgba(139,92,246,';
  const COL_CROSS  = 'rgba(139,92,246,0.12)';

  // Precompute node positions (outer ring)
  function nodePos(i, R) {
    const a = (2 * Math.PI * i / NODES) - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  }

  const outerNodes = Array.from({ length: NODES }, (_, i) => nodePos(i, R_OUTER));
  const innerNodes = Array.from({ length: NODES }, (_, i) => nodePos(i, R_INNER));

  // Gossip pulses: {fromIdx, toIdx, t0, ttl, type}
  const pulses = [];
  let frame = 0;

  function spawnPulse() {
    const from = Math.floor(Math.random() * NODES);
    const types = ['gossip', 'swim', 'wal'];
    pulses.push({
      from,
      to: (from + 1 + Math.floor(Math.random() * 3)) % NODES,
      t0: frame,
      ttl: 90,
      type: types[Math.floor(Math.random() * types.length)],
    });
  }

  // Draw torus silhouette (two concentric hexagon-like rings connected)
  function drawTorus(t) {
    // Outer donut shadow glow
    const grd = ctx.createRadialGradient(cx, cy, R_INNER * 0.8, cx, cy, R_OUTER * 1.15);
    grd.addColorStop(0,   'rgba(139,92,246,0.0)');
    grd.addColorStop(0.4, 'rgba(139,92,246,0.055)');
    grd.addColorStop(0.75,'rgba(139,92,246,0.035)');
    grd.addColorStop(1,   'rgba(139,92,246,0.0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Outer ring arc
    const outerAlpha = 0.45 + 0.15 * Math.sin(t * 0.4);
    ctx.beginPath();
    ctx.arc(cx, cy, R_OUTER, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139,92,246,${outerAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.2;
    ctx.shadowColor = 'rgba(139,92,246,0.5)';
    ctx.shadowBlur  = 8;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // Inner ring arc
    const innerAlpha = 0.2 + 0.1 * Math.sin(t * 0.6 + 1.0);
    ctx.beginPath();
    ctx.arc(cx, cy, R_INNER, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139,92,246,${innerAlpha.toFixed(3)})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Spokes (outer → inner)
    for (let i = 0; i < NODES; i += 2) {
      const o = outerNodes[i];
      const n = innerNodes[i];
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(n.x, n.y);
      ctx.strokeStyle = 'rgba(139,92,246,0.08)';
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    // Cross-links between non-adjacent nodes (mesh resilience)
    const crossPairs = [[0,4],[4,8],[8,12],[12,0],[2,10],[6,14]];
    for (const [a, b] of crossPairs) {
      const A = outerNodes[a];
      const B = outerNodes[b];
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      // Curved through center-ish
      ctx.quadraticCurveTo(cx, cy, B.x, B.y);
      ctx.strokeStyle = COL_CROSS;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  function drawNodes(t) {
    for (let i = 0; i < NODES; i++) {
      const n = outerNodes[i];
      const pulse = 0.7 + 0.2 * Math.sin(t * 1.2 + i * 0.4);

      // Glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_R * 2.5, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, NODE_R * 2.5);
      ng.addColorStop(0,   `rgba(139,92,246,${(0.18 * pulse).toFixed(3)})`);
      ng.addColorStop(1,   'rgba(139,92,246,0)');
      ctx.fillStyle = ng;
      ctx.fill();

      // Node body
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
      ctx.fillStyle = i % 4 === 0 ? COL_ACTIVE : COL_PROTO;
      ctx.shadowColor = COL_PROTO;
      ctx.shadowBlur  = i % 4 === 0 ? 6 : 3;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  function drawPulses() {
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      const age = frame - p.t0;
      if (age > p.ttl) { pulses.splice(i, 1); continue; }

      const progress = age / p.ttl;
      const fromN = outerNodes[p.from];
      const toN   = outerNodes[p.to];
      const px    = fromN.x + (toN.x - fromN.x) * progress;
      const py    = fromN.y + (toN.y - fromN.y) * progress;
      const alpha = Math.sin(progress * Math.PI);

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      const col = p.type === 'wal' ? '0,212,255' : '192,132,252';
      ctx.fillStyle = `rgba(${col},${(alpha * 0.9).toFixed(3)})`;
      ctx.shadowColor = `rgba(${col},0.7)`;
      ctx.shadowBlur  = 6;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Trail
      ctx.beginPath();
      ctx.moveTo(fromN.x, fromN.y);
      ctx.lineTo(px, py);
      ctx.strokeStyle = `rgba(${col},${(alpha * 0.2).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawCenter(t) {
    const r = 4 + 2 * Math.sin(t * 0.8);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139,92,246,0.18)';
    ctx.strokeStyle = 'rgba(139,92,246,0.5)';
    ctx.lineWidth = 0.8;
    ctx.fill();
    ctx.stroke();
  }

  let spawnCooldown = 0;

  function render() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const t = frame / 60;

    drawTorus(t);
    drawNodes(t);
    drawPulses();
    drawCenter(t);

    spawnCooldown--;
    if (spawnCooldown <= 0 && pulses.length < 6) {
      spawnPulse();
      spawnCooldown = 20 + Math.floor(Math.random() * 30);
    }

    frame++;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
  } // end initTorus

  // Init all torus canvases on the page
  ['torus-canvas', 'torus-canvas-2'].forEach(initTorus);
})();
