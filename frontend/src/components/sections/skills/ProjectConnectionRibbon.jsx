import React from 'react';
import { REAL_PROJECTS, TECH_TO_PROJECTS, CONSTELLATION_NODES } from './skillsData';
import styles from './ProjectConnectionRibbon.module.css';

/**
 * Project Connection Ribbon
 * Demonstrates real-world usage proof.
 * When hovering a technology in the constellation, relevant projects illuminate.
 * When hovering a project here, relevant technologies illuminate in the constellation.
 */
const ProjectConnectionRibbon = ({ hoveredTech, activeProject, setActiveProject }) => {
  // Find which projects are associated with the currently hovered tech
  const highlightedProjectIds = hoveredTech ? TECH_TO_PROJECTS[hoveredTech] || [] : [];
  const hoveredNode = CONSTELLATION_NODES.find((n) => n.id === hoveredTech);

  return (
    <div className={styles.ribbonWrapper}>
      <div className={styles.ribbonHeader}>
        <span className={styles.ribbonTag}>PRODUCTION EVIDENCE BRIDGE</span>
        <span className={styles.ribbonNote}>
          {hoveredNode
            ? `Technologies validated in active production deployments:`
            : `Hover projects to trace technological foundation:`}
        </span>
      </div>

      <div className={styles.projectsRow}>
        {REAL_PROJECTS.map((project) => {
          const isHighlighted = highlightedProjectIds.includes(project.id);
          const isSelected = activeProject === project.id;

          return (
            <div
              key={project.id}
              className={`${styles.projectChip} ${
                isHighlighted || isSelected ? styles.chipHighlighted : ''
              }`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              data-cursor="tech"
              data-cursor-text="TRACE"
            >
              <div className={styles.chipIndicatorWrap}>
                <span
                  className={styles.statusDot}
                  style={{
                    backgroundColor:
                      isHighlighted && hoveredNode
                        ? hoveredNode.color
                        : isSelected
                        ? '#D9A895'
                        : 'rgba(184, 169, 201, 0.28)',
                    transform: isHighlighted || isSelected ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
                <span className={styles.projectName}>{project.name}</span>
              </div>

              <span className={styles.projectRole}>{project.role}</span>

              {isHighlighted && hoveredNode && (
                <span
                  className={styles.accentLine}
                  style={{ backgroundColor: hoveredNode.color }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectConnectionRibbon;
