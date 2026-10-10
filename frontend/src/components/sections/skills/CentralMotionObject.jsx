import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMove } from 'react-icons/fi';
import styles from './CentralMotionObject.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * INTERACTION PHYSICS — Comprehensive Interactive Playground
 * A responsive physics system where pointer movement, drag, click morph,
 * press-and-hold energy build, magnetic nodes, and scroll position continuously interact.
 */
const CentralMotionObject = () => {
  const arenaRef = useRef(null);
  const centerObjectRef = useRef(null);
  const nodeRefs = useRef({});
  const nodeQuickTos = useRef({});
  const centerQuickTo = useRef({});

  // SVG Morphing Shapes (Real bezier paths)
  const morphShapes = [
    {
      id: 'circle',
      name: 'Circle',
      d: 'M 60,10 C 87.6,10 110,32.4 110,60 C 110,87.6 87.6,110 60,110 C 32.4,110 10,87.6 10,60 C 10,32.4 32.4,10 60,10 Z',
      accent: '#B8A9C9',
    },
    {
      id: 'square',
      name: 'Rounded Square',
      d: 'M 60,12 C 96,12 108,24 108,60 C 108,96 96,108 60,108 C 24,108 12,96 12,60 C 12,24 24,12 60,12 Z',
      accent: '#D0C5DC',
    },
    {
      id: 'diamond',
      name: 'Diamond',
      d: 'M 60,10 C 85,35 110,60 110,60 C 85,85 60,110 60,110 C 35,85 10,60 10,60 C 35,35 60,10 60,10 Z',
      accent: '#51465F',
    },
    {
      id: 'organic',
      name: 'Organic Shape',
      d: 'M 60,10 C 106,14 116,56 96,86 C 76,116 34,106 18,74 C 2,42 24,14 60,10 Z',
      accent: '#D9A895',
    },
  ];

  const [shapeIndex, setShapeIndex] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Velocity tracking ref
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const velocityRef = useRef({ vx: 0, vy: 0, speed: 0 });
  const holdTimerRef = useRef(null);

  // Surrounding Magnetic Nodes Configuration
  const magneticNodes = [
    {
      id: 'gsap',
      label: 'GSAP',
      desc: 'Timeline & scroll orchestration',
      accent: '#B8A9C9',
      defaultPos: { x: -170, y: -70 },
    },
    {
      id: 'motion',
      label: 'MOTION',
      desc: 'Gesture & spring interaction',
      accent: '#D0C5DC',
      defaultPos: { x: 170, y: -70 },
    },
    {
      id: 'svg',
      label: 'SVG',
      desc: 'Geometry & path animation',
      accent: '#51465F',
      defaultPos: { x: 180, y: 65 },
    },
    {
      id: 'spring',
      label: 'SPRING',
      desc: 'Natural physics & velocity settling',
      accent: '#D9A895',
      defaultPos: { x: -180, y: 65 },
    },
    {
      id: 'scroll',
      label: 'SCROLL',
      desc: 'Position-linked timeline scrub',
      accent: '#DCCFB5',
      defaultPos: { x: 0, y: 110 },
    },
  ];

  const currentShape = morphShapes[shapeIndex % morphShapes.length];

  // -------------------------------------------------------------
  // INTERACTION 1: POINTER FIELD & VELOCITY (Zero React renders on move)
  // -------------------------------------------------------------
  useEffect(() => {
    const arena = arenaRef.current;
    const centerObj = centerObjectRef.current;
    if (!arena || !centerObj) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    // Initialize quickTo for center object
    centerQuickTo.current = {
      xTo: gsap.quickTo(centerObj, 'x', { duration: 0.35, ease: 'power2.out' }),
      yTo: gsap.quickTo(centerObj, 'y', { duration: 0.35, ease: 'power2.out' }),
      rotTo: gsap.quickTo(centerObj, 'rotation', { duration: 0.4, ease: 'power2.out' }),
      scaleXTo: gsap.quickTo(centerObj, 'scaleX', { duration: 0.3, ease: 'power2.out' }),
      scaleYTo: gsap.quickTo(centerObj, 'scaleY', { duration: 0.3, ease: 'power2.out' }),
    };

    // Initialize quickTo for surrounding magnetic nodes
    magneticNodes.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (el) {
        nodeQuickTos.current[node.id] = {
          xTo: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' }),
          yTo: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' }),
        };
      }
    });

    const handlePointerMove = (e) => {
      const arenaRect = arena.getBoundingClientRect();
      const arenaCenterX = arenaRect.left + arenaRect.width / 2;
      const arenaCenterY = arenaRect.top + arenaRect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate velocity
      const now = Date.now();
      const dt = Math.max(now - lastMousePos.current.time, 16);
      const dx = mouseX - lastMousePos.current.x;
      const dy = mouseY - lastMousePos.current.y;
      const speed = Math.hypot(dx, dy) / (dt / 1000); // px/sec

      velocityRef.current = { vx: dx / dt, vy: dy / dt, speed };
      lastMousePos.current = { x: mouseX, y: mouseY, time: now };

      // 1. Center object slight magnetic follow + velocity tilt & stretch
      const offsetCenterX = (mouseX - arenaCenterX) / 28;
      const offsetCenterY = (mouseY - arenaCenterY) / 28;

      // Velocity-induced rotation (clamped ±5 deg)
      const rot = Math.max(-5, Math.min(5, (dx / dt) * 12));
      const stretch = Math.min(0.08, speed * 0.00004);

      if (centerQuickTo.current.xTo) {
        centerQuickTo.current.xTo(offsetCenterX);
        centerQuickTo.current.yTo(offsetCenterY);
        centerQuickTo.current.rotTo(rot);
        centerQuickTo.current.scaleXTo(1 + stretch);
        centerQuickTo.current.scaleYTo(1 - stretch * 0.5);
      }

      // 2. Surrounding nodes proximity displacement
      magneticNodes.forEach((node) => {
        const helpers = nodeQuickTos.current[node.id];
        if (!helpers) return;

        const nodeAbsX = arenaCenterX + node.defaultPos.x;
        const nodeAbsY = arenaCenterY + node.defaultPos.y;

        const dist = Math.hypot(mouseX - nodeAbsX, mouseY - nodeAbsY);
        const radius = 150;

        if (dist < radius) {
          // Push 2-8px away / toward cursor smoothly
          const force = (1 - dist / radius) * 8;
          const angle = Math.atan2(mouseY - nodeAbsY, mouseX - nodeAbsX);
          helpers.xTo(-Math.cos(angle) * force);
          helpers.yTo(-Math.sin(angle) * force);
        } else {
          helpers.xTo(0);
          helpers.yTo(0);
        }
      });
    };

    const handlePointerLeave = () => {
      if (centerQuickTo.current.xTo) {
        centerQuickTo.current.xTo(0);
        centerQuickTo.current.yTo(0);
        centerQuickTo.current.rotTo(0);
        centerQuickTo.current.scaleXTo(1);
        centerQuickTo.current.scaleYTo(1);
      }

      magneticNodes.forEach((node) => {
        const helpers = nodeQuickTos.current[node.id];
        if (helpers) {
          helpers.xTo(0);
          helpers.yTo(0);
        }
      });
    };

    arena.addEventListener('pointermove', handlePointerMove);
    arena.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      arena.removeEventListener('pointermove', handlePointerMove);
      arena.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // -------------------------------------------------------------
  // INTERACTION 3: SVG MORPH (Clicking cycles SVG shapes)
  // -------------------------------------------------------------
  const handleShapeClick = () => {
    setShapeIndex((prev) => prev + 1);
  };

  // -------------------------------------------------------------
  // INTERACTION 6: PRESS AND HOLD ENERGY BUILD
  // -------------------------------------------------------------
  const handleHoldStart = () => {
    setIsHolding(true);

    // Gently push surrounding nodes outward radially
    magneticNodes.forEach((node) => {
      const helpers = nodeQuickTos.current[node.id];
      if (helpers) {
        const angle = Math.atan2(node.defaultPos.y, node.defaultPos.x);
        helpers.xTo(Math.cos(angle) * 18);
        helpers.yTo(Math.sin(angle) * 18);
      }
    });
  };

  const handleHoldEnd = () => {
    setIsHolding(false);

    // Elastic recoil back to rest
    magneticNodes.forEach((node) => {
      const helpers = nodeQuickTos.current[node.id];
      if (helpers) {
        helpers.xTo(0);
        helpers.yTo(0);
      }
    });
  };

  // -------------------------------------------------------------
  // INTERACTION 7: SCROLLTRIGGER TIMELINE SCRUB
  // -------------------------------------------------------------
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: arena,
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 1.2,
        },
      })
      .fromTo(
        arena,
        { opacity: 0.85, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: 'none' }
      );
    }, arena);

    return () => ctx.revert();
  }, []);

  // -------------------------------------------------------------
  // DRAG HANDLERS (Framer Motion drag events)
  // -------------------------------------------------------------
  const handleDrag = (_, info) => {
    setDragOffset({ x: info.offset.x, y: info.offset.y });

    // Elastic tether: tether surrounding nodes slightly toward drag offset
    magneticNodes.forEach((node) => {
      const helpers = nodeQuickTos.current[node.id];
      if (helpers) {
        helpers.xTo(info.offset.x * 0.12);
        helpers.yTo(info.offset.y * 0.12);
      }
    });
  };

  const handleDragEnd = () => {
    setDragOffset({ x: 0, y: 0 });

    magneticNodes.forEach((node) => {
      const helpers = nodeQuickTos.current[node.id];
      if (helpers) {
        helpers.xTo(0);
        helpers.yTo(0);
      }
    });
  };

  return (
    <div className={styles.playgroundWrapper}>
      {/* Header and Descriptive Labels */}
      <div className={styles.headerBlock}>
        <div className={styles.taglineRow}>
          <span className={styles.tag}>INTERACTION PHYSICS</span>
          <span className={styles.labelChips}>
            <span>POINTER</span>
            <span className={styles.chipDot}>·</span>
            <span>DRAG</span>
            <span className={styles.chipDot}>·</span>
            <span>SPRING</span>
            <span className={styles.chipDot}>·</span>
            <span>MORPH</span>
            <span className={styles.chipDot}>·</span>
            <span>SCROLL</span>
          </span>
        </div>

        <p className={styles.description}>
          Move, drag and manipulate the system to explore pointer physics, spring motion and SVG transitions.
        </p>
      </div>

      {/* Physics Arena */}
      <div
        ref={arenaRef}
        className={styles.arena}
        data-cursor="hover"
        data-cursor-text="EXPLORE"
      >
        {/* Dynamic SVG Connection Lines between center and surrounding nodes */}
        <svg className={styles.connectionCanvas} width="100%" height="100%">
          {magneticNodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const centerX = '50%';
            const centerY = '50%';

            return (
              <line
                key={node.id}
                x1={centerX}
                y1={centerY}
                x2={`calc(50% + ${node.defaultPos.x}px)`}
                y2={`calc(50% + ${node.defaultPos.y}px)`}
                className={`${styles.connectionLine} ${isHovered ? styles.lineActive : ''} ${
                  isHolding ? styles.lineStretched : ''
                }`}
                style={{
                  stroke: isHovered ? node.accent : 'var(--border-dark)',
                  strokeWidth: isHovered || isHolding ? 1.6 : 1,
                  opacity: isHovered ? 0.8 : isHolding ? 0.6 : 0.2,
                }}
              />
            );
          })}
        </svg>

        {/* Surrounding Magnetic Nodes */}
        {magneticNodes.map((node) => {
          const isHovered = hoveredNodeId === node.id;

          return (
            <div
              key={node.id}
              ref={(el) => (nodeRefs.current[node.id] = el)}
              className={`${styles.magneticNode} ${isHovered ? styles.nodeHovered : ''}`}
              style={{
                left: `calc(50% + ${node.defaultPos.x}px)`,
                top: `calc(50% + ${node.defaultPos.y}px)`,
                borderColor: isHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.16)',
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              data-cursor="hover"
              data-cursor-text="INSPECT"
            >
              <span
                className={styles.nodeAccentDot}
                style={{
                  backgroundColor: node.accent,
                  transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                }}
              />
              <span className={styles.nodeLabel}>{node.label}</span>

              {/* Contextual Description Revealed on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={styles.nodeTooltip}
                  >
                    <span>{node.desc}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Central Draggable & Morphing Object */}
        <motion.div
          ref={centerObjectRef}
          drag
          dragConstraints={{ left: -160, right: 160, top: -85, bottom: 85 }}
          dragElastic={0.4}
          dragTransition={{
            bounceStiffness: 350,
            bounceDamping: 22,
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onClick={handleShapeClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: isHolding ? 1.12 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 24,
          }}
          className={`${styles.centerObject} ${isHolding ? styles.holdingGlow : ''}`}
          data-cursor="hover"
          data-cursor-text="DRAG"
        >
          {/* Real SVG Morphing Vector Shape */}
          <svg className={styles.morphSvg} viewBox="0 0 120 120">
            <path
              className={styles.morphPath}
              d={currentShape.d}
              style={{
                stroke: currentShape.accent,
                fill: `${currentShape.accent}14`,
              }}
            />
          </svg>

          {/* Center Typographic Overlay */}
          <div className={styles.centerContent}>
            <div className={styles.shapeNameRow}>
              <FiMove size={12} className={styles.dragIcon} />
              <strong className={styles.shapeName}>{currentShape.name.toUpperCase()}</strong>
            </div>
            <span className={styles.shapeHint}>Click to morph · Drag to test spring</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CentralMotionObject;
