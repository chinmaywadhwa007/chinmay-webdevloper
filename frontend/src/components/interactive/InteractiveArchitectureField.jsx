import React, { useRef, useEffect } from 'react';
import styles from './InteractiveArchitectureField.module.css';

/**
 * InteractiveArchitectureField
 * An engineered technical grid field spanning the hero and top canvas.
 * - 95% neutral warm-gray dots with subtle natural brightness variation.
 * - 5% subtle pastel accent nodes (soft peach, soft apricot, sage).
 * - Subtle technical architecture routing traces with slow clock drift.
 * - Proximity-driven cursor reactions (dots brighten, delicate hairline connections form and fade).
 * - CW Monogram connection reaction when the navbar logo is hovered.
 * - Sits behind the floating navbar and hero content.
 */
const InteractiveArchitectureField = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const cwHoverRef = useRef(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grid configuration
    const spacing = 32; // 32px between dots for balanced density
    let cols = Math.ceil(width / spacing) + 1;
    let rows = Math.ceil(height / spacing) + 1;

    // Deterministic pseudo-random generator for consistent accent node placement
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    // Node types: 'neutral', 'peach', 'apricot', 'sage'
    class Node {
      constructor(col, row, x, y) {
        this.col = col;
        this.row = row;
        this.x = x;
        this.y = y;

        const seed = col * 37 + row * 101;
        const rand = pseudoRandom(seed);
        const rand2 = pseudoRandom(seed + 1);

        // 95% neutral, 5% subtle pastel accent nodes (Brand Palette: Lavender, Peach, Sage, Butter)
        if (rand < 0.02) {
          this.type = 'lavender';
          this.color = '#D7C8FF';
          this.baseAlpha = 0.6 + rand2 * 0.25;
          this.baseRadius = 1.8;
          this.hasRing = rand2 > 0.6; // Occasional micro technical ring
        } else if (rand < 0.035) {
          this.type = 'peach';
          this.color = '#FFCDB2';
          this.baseAlpha = 0.55 + rand2 * 0.25;
          this.baseRadius = 1.7;
          this.hasRing = false;
        } else if (rand < 0.048) {
          this.type = 'sage';
          this.color = '#CDE8D5';
          this.baseAlpha = 0.5 + rand2 * 0.2;
          this.baseRadius = 1.6;
          this.hasRing = false;
        } else if (rand < 0.06) {
          this.type = 'butter';
          this.color = '#FFE6BF';
          this.baseAlpha = 0.5 + rand2 * 0.2;
          this.baseRadius = 1.6;
          this.hasRing = false;
        } else {
          this.type = 'neutral';
          this.color = '#F5F3EE';
          // Subtle natural brightness variation
          this.baseAlpha = 0.09 + rand2 * 0.12;
          this.baseRadius = 1.0;
          this.hasRing = false;
        }

        this.currentAlpha = this.baseAlpha;
        this.currentRadius = this.baseRadius;
        this.activeFactor = 0; // 0 to 1 based on cursor proximity
      }

      update(mouseX, mouseY, isCwHover) {
        // Distance to cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = 95;
        const maxDistSq = maxDist * maxDist;

        let targetActive = 0;
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          targetActive = Math.pow(1 - dist / maxDist, 1.6);
        }

        // CW logo reaction: if CW is hovered and this node is in the top-left area near the logo
        if (isCwHover && this.row <= 3 && this.x > width / 2 - 280 && this.x < width / 2 + 10) {
          targetActive = Math.max(targetActive, 0.65);
        }

        // Smooth interpolation
        this.activeFactor += (targetActive - this.activeFactor) * 0.15;

        // Apply visual response
        if (this.type === 'neutral') {
          this.currentAlpha = this.baseAlpha + this.activeFactor * 0.42;
          this.currentRadius = this.baseRadius + this.activeFactor * 0.8;
        } else {
          this.currentAlpha = this.baseAlpha + this.activeFactor * 0.35;
          this.currentRadius = this.baseRadius + this.activeFactor * 0.6;
        }
      }

      draw(context) {
        context.fillStyle = this.color;
        context.globalAlpha = this.currentAlpha;
        context.beginPath();
        context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        context.fill();

        // Technical accent micro-ring
        if (this.hasRing) {
          context.strokeStyle = this.color;
          context.globalAlpha = this.currentAlpha * 0.45;
          context.lineWidth = 0.8;
          context.beginPath();
          context.arc(this.x, this.y, this.currentRadius + 3.5, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }

    let nodes = [];
    const initGrid = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push(new Node(c, r, c * spacing, r * spacing));
        }
      }
    };

    initGrid();

    // ── Technical Architecture Traces (Curved & Orthogonal Routing Lines) ──
    let traceOffset = 0;

    const drawTraces = () => {
      if (!prefersReducedMotion) {
        traceOffset += 0.2; // Slow clock drift
      }

      // Trace 1: Top-Left Arch Trace — sweeps from top-left through the architecture field toward center
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.lineDashOffset = -traceOffset;

      const grad1 = ctx.createLinearGradient(0, 0, width * 0.45, 180);
      grad1.addColorStop(0, 'rgba(174, 191, 167, 0.25)'); // apricot start
      grad1.addColorStop(0.5, 'rgba(231, 184, 168, 0.16)'); // peach mid
      grad1.addColorStop(1, 'rgba(222, 217, 207, 0.04)'); // soft fade

      ctx.strokeStyle = grad1;
      ctx.beginPath();
      // Flow from top-left empty zone curving across grid intersections
      ctx.moveTo(-20, 48);
      ctx.bezierCurveTo(width * 0.12, 48, width * 0.18, 140, width * 0.38, 140);
      ctx.lineTo(width * 0.48, 140);
      ctx.stroke();

      // Trace 2: Top-Left Upper Cross Bus
      ctx.setLineDash([2, 5]);
      ctx.lineDashOffset = traceOffset * 0.8;
      const grad2 = ctx.createLinearGradient(width * 0.05, 96, width * 0.32, 96);
      grad2.addColorStop(0, 'rgba(174, 191, 167, 0.20)'); // sage
      grad2.addColorStop(1, 'rgba(245, 243, 238, 0.03)');
      ctx.strokeStyle = grad2;
      ctx.beginPath();
      ctx.moveTo(width * 0.04, 96);
      ctx.lineTo(width * 0.26, 96);
      ctx.lineTo(width * 0.30, 64);
      ctx.stroke();

      // Trace 3: Right flank subtle return
      const grad3 = ctx.createLinearGradient(width * 0.65, 120, width + 20, 240);
      grad3.addColorStop(0, 'rgba(245, 243, 238, 0.03)');
      grad3.addColorStop(0.6, 'rgba(174, 191, 167, 0.18)');
      grad3.addColorStop(1, 'rgba(245, 243, 238, 0.05)');
      ctx.strokeStyle = grad3;
      ctx.setLineDash([4, 7]);
      ctx.lineDashOffset = -traceOffset * 0.7;
      ctx.beginPath();
      ctx.moveTo(width * 0.62, 120);
      ctx.bezierCurveTo(width * 0.75, 120, width * 0.85, 220, width + 40, 220);
      ctx.stroke();

      ctx.restore();
    };

    // ── Dynamic Proximity Connection Lines ──
    const drawProximityConnections = () => {
      const activeNodes = nodes.filter((n) => n.activeFactor > 0.18);
      if (activeNodes.length < 2) return;

      ctx.save();
      ctx.lineWidth = 0.8;

      for (let i = 0; i < activeNodes.length; i++) {
        for (let j = i + 1; j < activeNodes.length; j++) {
          const a = activeNodes[i];
          const b = activeNodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          // Connect adjacent grid neighbours only
          if (distSq < (spacing * 1.5) * (spacing * 1.5)) {
            const combinedActive = Math.min(a.activeFactor, b.activeFactor);
            const alpha = combinedActive * 0.22;

            ctx.strokeStyle = a.type !== 'neutral' ? a.color : b.type !== 'neutral' ? b.color : '#F5F3EE';
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    // ── Main Render Loop ──
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw technical routing traces
      drawTraces();

      // 2. Update and draw nodes
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cwHover = cwHoverRef.current;

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(mx, my, cwHover);
        nodes[i].draw(ctx);
      }

      // 3. Draw proximity connection lines between reacting nodes
      drawProximityConnections();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // ── Mouse & Resize Event Listeners ──
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    const handleResize = () => {
      initGrid();
    };

    // CW Logo hover custom events
    const handleCwEnter = () => {
      cwHoverRef.current = true;
    };
    const handleCwLeave = () => {
      cwHoverRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('cw-logo-enter', handleCwEnter);
    window.addEventListener('cw-logo-leave', handleCwLeave);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('cw-logo-enter', handleCwEnter);
      window.removeEventListener('cw-logo-leave', handleCwLeave);
    };
  }, []);

  return (
    <div className={styles.fieldContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.fieldCanvas} />
    </div>
  );
};

export default InteractiveArchitectureField;
