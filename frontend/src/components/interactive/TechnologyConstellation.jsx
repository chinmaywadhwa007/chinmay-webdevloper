import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import styles from './TechnologyConstellation.module.css';

/**
 * Artistic Technology Constellation
 * Interactive typographic nodes connected by dynamic SVG bezier paths.
 * Hover triggers path illumination, cluster resonance, and metadata reveal.
 */
const TechnologyConstellation = ({ mouseOffset = { x: 0, y: 0 } }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const containerRef = useRef(null);

  // Nodes with percentage-based responsive positions and cluster definitions
  const nodes = [
    // Frontend Cluster (Left Edge & Flank)
    {
      id: 'react',
      name: 'React',
      cluster: 'frontend',
      x: 10,
      y: 28,
      accent: 'sage',
      detail: 'React 18 · Architecture',
    },
    {
      id: 'ts',
      name: 'TypeScript',
      cluster: 'frontend',
      x: 15,
      y: 54,
      accent: 'lavender',
      detail: 'Strict Types & Systems',
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      cluster: 'frontend',
      x: 8,
      y: 76,
      accent: 'peach',
      detail: 'SSR & Edge Deployment',
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      cluster: 'frontend',
      x: 23,
      y: 38,
      accent: 'butter',
      detail: 'Design Tokens & CSS',
    },

    // Backend & Cloud Cluster (Right Edge & Flank)
    {
      id: 'nodejs',
      name: 'Node.js',
      cluster: 'backend',
      x: 90,
      y: 28,
      accent: 'sage',
      detail: 'High-Throughput Runtime',
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      cluster: 'backend',
      x: 83,
      y: 54,
      accent: 'lavender',
      detail: 'Relational & Index Optimization',
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      cluster: 'backend',
      x: 91,
      y: 76,
      accent: 'peach',
      detail: 'Document Aggregation',
    },
    {
      id: 'sql',
      name: 'SQL',
      cluster: 'backend',
      x: 76,
      y: 36,
      accent: 'butter',
      detail: 'Schema Normalization',
    },

    // Lower Architecture Bridge
    {
      id: 'python',
      name: 'Python',
      cluster: 'bridge',
      x: 22,
      y: 86,
      accent: 'sage',
      detail: 'Automation & Backend Logic',
    },
    {
      id: 'rest',
      name: 'REST APIs',
      cluster: 'bridge',
      x: 77,
      y: 84,
      accent: 'lavender',
      detail: 'Secure JWT Endpoints',
    },
  ];

  // Pre-calculated connection lines between related nodes
  const connections = [
    { from: 'react', to: 'tailwind', cluster: 'frontend' },
    { from: 'react', to: 'ts', cluster: 'frontend' },
    { from: 'ts', to: 'nextjs', cluster: 'frontend' },
    { from: 'nextjs', to: 'python', cluster: 'frontend' },
    { from: 'nodejs', to: 'sql', cluster: 'backend' },
    { from: 'nodejs', to: 'postgres', cluster: 'backend' },
    { from: 'postgres', to: 'mongodb', cluster: 'backend' },
    { from: 'postgres', to: 'rest', cluster: 'backend' },
  ];

  // Helper to get coordinates
  const getNode = (id) => nodes.find((n) => n.id === id);

  // Parallax layer response
  const parallaxX = mouseOffset.x * 0.04;
  const parallaxY = mouseOffset.y * 0.04;

  const activeCluster = hoveredNodeId ? getNode(hoveredNodeId)?.cluster : null;

  return (
    <div
      ref={containerRef}
      className={styles.constellationWrapper}
      style={{
        transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
      }}
      aria-hidden="true"
    >
      {/* SVG Connecting Paths Network */}
      <svg className={styles.svgCanvas} width="100%" height="100%">
        <defs>
          <linearGradient id="neutralLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.18)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {connections.map((conn, idx) => {
          const fromNode = getNode(conn.from);
          const toNode = getNode(conn.to);
          if (!fromNode || !toNode) return null;

          const isConnected =
            hoveredNodeId === conn.from || hoveredNodeId === conn.to;
          const isClusterActive = activeCluster === conn.cluster;

          return (
            <line
              key={idx}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              className={`${styles.connectionLine} ${
                isConnected
                  ? styles.lineHighlight
                  : isClusterActive
                  ? styles.lineClusterActive
                  : ''
              }`}
              stroke={isConnected ? '#AEBFA7' : 'rgba(255, 255, 255, 0.12)'}
              strokeDasharray={isConnected ? 'none' : '3 4'}
            />
          );
        })}
      </svg>

      {/* Typographic Nodes */}
      {nodes.map((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isRelated =
          hoveredNodeId &&
          (activeCluster === node.cluster ||
            connections.some(
              (c) =>
                (c.from === hoveredNodeId && c.to === node.id) ||
                (c.to === hoveredNodeId && c.from === node.id)
            ));

        return (
          <div
            key={node.id}
            className={`${styles.node} ${styles[`accent_${node.accent}`]} ${
              isHovered ? styles.nodeHovered : ''
            } ${isRelated ? styles.nodeRelated : ''}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            onMouseEnter={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
          >
            <div className={styles.nodePill}>
              <span className={styles.nodeDot} />
              <span className={styles.nodeName}>{node.name}</span>
            </div>

            {/* Hover Editorial Metadata Callout */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className={styles.tooltip}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.tooltipText}>{node.detail}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default TechnologyConstellation;
