import React, { useState } from 'react';
import { GRAPH_NODES, GRAPH_EDGES } from './skillsData';
import styles from './SkillRelationshipGraph.module.css';

/**
 * Interactive Technology Relationship Graph
 * Connects frontend, backend, database, and motion tools via SVG bezier curves.
 * Hovering any node illuminates architectural relationships and connected nodes.
 */
const SkillRelationshipGraph = () => {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Find connected node IDs
  const connectedNodeIds = new Set();
  if (hoveredNodeId) {
    connectedNodeIds.add(hoveredNodeId);
    GRAPH_EDGES.forEach((edge) => {
      if (edge.from === hoveredNodeId) connectedNodeIds.add(edge.to);
      if (edge.to === hoveredNodeId) connectedNodeIds.add(edge.from);
    });
  }

  // Active edge relations
  const activeEdges = GRAPH_EDGES.filter(
    (edge) => edge.from === hoveredNodeId || edge.to === hoveredNodeId
  );

  const hoveredNode = GRAPH_NODES.find((n) => n.id === hoveredNodeId);

  return (
    <div className={styles.graphCard}>
      <div className={styles.header}>
        <div>
          <span className={styles.tagline}>Architectural Ecosystem</span>
          <h3 className={styles.title}>Technology Relationship Network</h3>
        </div>
      </div>

      <div
        className={styles.graphContainer}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        {/* SVG Connection Paths */}
        <svg className={styles.svgCanvas}>
          {GRAPH_EDGES.map((edge) => {
            const source = GRAPH_NODES.find((n) => n.id === edge.from);
            const target = GRAPH_NODES.find((n) => n.id === edge.to);
            if (!source || !target) return null;

            const isEdgeActive =
              hoveredNodeId && (edge.from === hoveredNodeId || edge.to === hoveredNodeId);

            // Calculate bezier control points
            const x1 = `${source.x}%`;
            const y1 = `${source.y}%`;
            const x2 = `${target.x}%`;
            const y2 = `${target.y}%`;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={`${styles.connectionLine} ${
                  isEdgeActive ? styles.lineActive : ''
                }`}
              />
            );
          })}
        </svg>

        {/* Typographic Nodes */}
        <div className={styles.graphNodesWrap}>
          {GRAPH_NODES.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const isDimmed = hoveredNodeId && !isConnected;

            const dotClass =
              node.accent === 'peach'
                ? styles.dotPeach
                : node.accent === 'lavender'
                ? styles.dotLavender
                : node.accent === 'butter'
                ? styles.dotButter
                : styles.dotSage;

            return (
              <button
                key={node.id}
                className={`${styles.nodePill} ${isHovered ? styles.nodeActive : ''} ${
                  isDimmed ? styles.nodeDimmed : ''
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                data-cursor="hover"
                data-cursor-text="EXPLORE"
              >
                <span className={dotClass} />
                <span>{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Context Callout */}
      <div className={styles.calloutBar}>
        <span className={styles.calloutTag}>
          {hoveredNode ? hoveredNode.label : 'Hover Node'}
        </span>
        <span>
          {hoveredNode
            ? `Connected to ${activeEdges.length} architectural modules: ${activeEdges
                .map((e) => e.label)
                .join(', ')}`
            : 'Hover any technology node above to inspect architectural relationships and data pipelines.'}
        </span>
      </div>
    </div>
  );
};

export default SkillRelationshipGraph;
