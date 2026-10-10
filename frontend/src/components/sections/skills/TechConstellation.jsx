import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  CONSTELLATION_NODES,
  CONSTELLATION_EDGES,
  TECH_TO_PROJECTS,
  REAL_PROJECTS,
  ACCENTS,
  getCapStyle,
} from './skillsData';
import styles from './TechConstellation.module.css';

/**
 * Primary Visual Element: Interactive Technology Constellation
 * Organic floating nodes on open warm ivory background with whisper-thin SVG paths,
 * pointer proximity deflection, dynamic category morphing, and contextual proof.
 */
const TechConstellation = ({
  activeCategory,
  hoveredTech,
  setHoveredTech,
  selectedTech,
  onSelectTech,
  activeProject,
}) => {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const proximityOffsets = useRef({});
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 520 });

  // Update container dimensions for SVG line calculation
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height: Math.max(height, 500) });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute active position map for the current category
  const getNodePos = useCallback(
    (node) => {
      const mode = activeCategory === 'all' ? 'all' : activeCategory;
      const pos = node.pos[mode] || node.pos.all;
      return {
        x: (pos.x / 100) * containerSize.width,
        y: (pos.y / 100) * containerSize.height,
        pctX: pos.x,
        pctY: pos.y,
      };
    },
    [activeCategory, containerSize]
  );

  // Proximity Physics: Mouse movement smoothly deflects nearby nodes without React state updates
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    // Initialize quickTo helpers for each node
    CONSTELLATION_NODES.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (el) {
        proximityOffsets.current[node.id] = {
          xTo: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' }),
          yTo: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' }),
        };
      }
    });

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const radius = 140; // Proximity threshold

      CONSTELLATION_NODES.forEach((node) => {
        const helpers = proximityOffsets.current[node.id];
        if (!helpers) return;

        const pos = getNodePos(node);
        const dx = mouseX - pos.x;
        const dy = mouseY - pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          // Push 2-7px away from cursor
          const force = (1 - dist / radius) * 7;
          const angle = Math.atan2(dy, dx);
          helpers.xTo(-Math.cos(angle) * force);
          helpers.yTo(-Math.sin(angle) * force);
        } else {
          helpers.xTo(0);
          helpers.yTo(0);
        }
      });
    };

    const handleMouseLeave = () => {
      CONSTELLATION_NODES.forEach((node) => {
        const helpers = proximityOffsets.current[node.id];
        if (helpers) {
          helpers.xTo(0);
          helpers.yTo(0);
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerSize, getNodePos]);

  // Compute connected nodes for highlight
  const activeTechId = hoveredTech || selectedTech;
  const connectedTechIds = new Set();
  if (activeTechId) {
    connectedTechIds.add(activeTechId);
    CONSTELLATION_EDGES.forEach((edge) => {
      if (edge.from === activeTechId) connectedTechIds.add(edge.to);
      if (edge.to === activeTechId) connectedTechIds.add(edge.from);
    });
  }

  // Active tech by project selection
  const projectTechIds = new Set();
  if (activeProject) {
    Object.entries(TECH_TO_PROJECTS).forEach(([tId, pList]) => {
      if (pList.includes(activeProject)) {
        projectTechIds.add(tId);
      }
    });
  }

  const activeNodeData = CONSTELLATION_NODES.find((n) => n.id === activeTechId);

  return (
    <div className={styles.constellationWrap}>
      <div
        ref={containerRef}
        className={styles.canvasContainer}
        onMouseLeave={() => setHoveredTech(null)}
      >
        {/* Whisper-Thin SVG Connection Lines */}
        <svg className={styles.svgOverlay} width="100%" height="100%">
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8BFAE" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#B9AED6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E5B7A5" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {CONSTELLATION_EDGES.map((edge) => {
            const sourceNode = CONSTELLATION_NODES.find((n) => n.id === edge.from);
            const targetNode = CONSTELLATION_NODES.find((n) => n.id === edge.to);
            if (!sourceNode || !targetNode) return null;

            const sourcePos = getNodePos(sourceNode);
            const targetPos = getNodePos(targetNode);

            const isEdgeHighlighted =
              activeTechId &&
              (edge.from === activeTechId || edge.to === activeTechId);

            const isDimmed = activeTechId && !isEdgeHighlighted;

            // Curved bezier path calculation
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const cx = sourcePos.x + dx * 0.5;
            const cy = sourcePos.y + dy * 0.5 - 15; // Subtle curvature

            const pathD = `M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`;

            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={pathD}
                className={`${styles.connectionLine} ${
                  isEdgeHighlighted ? styles.lineActive : ''
                } ${isDimmed ? styles.lineDimmed : ''}`}
                style={{
                  stroke: isEdgeHighlighted
                    ? activeNodeData?.color || '#242321'
                    : 'var(--border-dark)',
                  strokeWidth: isEdgeHighlighted ? 1.8 : 1,
                  opacity: isEdgeHighlighted ? 0.85 : 0.16,
                }}
              />
            );
          })}
        </svg>

        {/* Floating Typographic Nodes */}
        {CONSTELLATION_NODES.map((node) => {
          const pos = getNodePos(node);
          const isHovered = hoveredTech === node.id;
          const isSelected = selectedTech === node.id;
          const isConnected = connectedTechIds.has(node.id);
          const isProjectMatch = projectTechIds.has(node.id);
          const isDimmed =
            (activeTechId && !isConnected && !isProjectMatch) ||
            (activeProject && !isProjectMatch);

          const isMatchingCategory =
            activeCategory === 'all' || node.category === activeCategory;

          return (
            <motion.div
              key={node.id}
              ref={(el) => (nodeRefs.current[node.id] = el)}
              className={`${styles.nodeItem} ${
                isHovered || isSelected ? styles.nodeActive : ''
              } ${isDimmed ? styles.nodeDimmed : ''} ${
                !isMatchingCategory ? styles.nodeOffCategory : ''
              }`}
              animate={{
                left: `${pos.pctX}%`,
                top: `${pos.pctY}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 18,
              }}
              onMouseEnter={() => setHoveredTech(node.id)}
              onClick={() => onSelectTech(selectedTech === node.id ? null : node.id)}
              data-cursor="hover"
              data-cursor-text="EXPLORE"
              style={{
                borderColor:
                  isHovered || isSelected
                    ? node.color
                    : isProjectMatch
                    ? node.color
                    : 'transparent',
              }}
            >
              {/* Tiny Pastel Indicator Dot */}
              <span
                className={styles.nodeDot}
                style={{
                  backgroundColor: node.color,
                  transform: isHovered || isSelected ? 'scale(1.5)' : 'scale(1)',
                }}
              />

              {/* Node Typographic Label */}
              <span
                className={styles.nodeLabel}
                style={{
                  fontWeight: isHovered || isSelected || node.isAnchor ? 700 : 500,
                  color: isHovered || isSelected ? '#242321' : 'var(--text-primary)',
                }}
              >
                {node.label}
              </span>

              {/* Status Signal */}
              {isMatchingCategory && node.isAnchor && (
                <span className={styles.anchorPulse} style={{ backgroundColor: node.color }} />
              )}
            </motion.div>
          );
        })}

        {/* Small Contextual Information Tag (Floating beside or beneath the active node) */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={styles.floatingContextBadge}
              style={{
                left: `clamp(16px, ${getNodePos(activeNodeData).pctX}%, calc(100% - 320px))`,
                top: `clamp(20px, calc(${getNodePos(activeNodeData).pctY}% + 38px), calc(100% - 140px))`,
              }}
            >
              <div className={styles.contextHeader}>
                <div className={styles.contextTitleGroup}>
                  <span
                    className={styles.contextCategoryDot}
                    style={{ backgroundColor: activeNodeData.color }}
                  />
                  <strong className={styles.contextName}>{activeNodeData.label}</strong>
                </div>

                <span
                  className={styles.contextStatus}
                  style={{
                    backgroundColor: `${activeNodeData.color}26`,
                    color: '#242321',
                    borderColor: `${activeNodeData.color}66`,
                  }}
                >
                  {activeNodeData.status}
                </span>
              </div>

              {/* Capabilities List */}
              <div className={styles.contextCapabilities}>
                {activeNodeData.capabilities.slice(0, 4).map((cap, cIdx) => {
                  const capStyle = getCapStyle(cap, cIdx);
                  return (
                    <span
                      key={cIdx}
                      className={styles.contextPill}
                      style={{
                        backgroundColor: capStyle.bg,
                        borderColor: capStyle.border,
                        color: capStyle.color,
                        border: '1px solid',
                      }}
                    >
                      {cap}
                    </span>
                  );
                })}
              </div>

              {/* Used In Projects Proof */}
              <div className={styles.contextProofRow}>
                <span className={styles.proofPrefix}>Used in:</span>
                <span className={styles.proofNames}>
                  {activeNodeData.proof.join(' · ')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Hint */}
      <div className={styles.constellationHint}>
        <span>Hover nodes to trace architectural connections · Click to pin technical profile</span>
      </div>
    </div>
  );
};

export default TechConstellation;
