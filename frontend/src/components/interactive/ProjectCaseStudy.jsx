import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiGithub, FiCheck, FiArrowRight, FiShield, FiCpu, FiDatabase } from 'react-icons/fi';
import styles from './ProjectCaseStudy.module.css';

/**
 * ProjectCaseStudy - Expanded Deep-Dive Technical Case Study Modal
 * Activated by clicking any Featured Architecture card.
 * Provides complete architectural breakdown, performance metrics, authentication,
 * data flow schemas, and direct production links.
 */
const ProjectCaseStudy = ({ project, onClose }) => {
  // ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  // Mirrors the index.css tokens — orange retired (butter/apricot resolve to cream)
  const accentColor =
    project.accent === 'peach'
      ? '#E7B8A8'
      : project.accent === 'butter' || project.accent === 'apricot' || project.accent === 'cream'
      ? '#E5D8BD'
      : project.accent === 'lavender'
      ? '#C7BBD3'
      : '#AEBFA7'; // sage default

  return (
    <AnimatePresence>
      <div className={styles.backdrop} onClick={onClose} role="presentation">
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
        >
          {/* Top Bar with Category, Title & Close Button */}
          <div className={styles.modalHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.categoryPill} style={{ color: accentColor }}>
                <span className={styles.categoryDot} style={{ backgroundColor: accentColor }} />
                <span>{project.category}</span>
              </div>
              <h2 id="case-study-title" className={styles.projectTitle}>
                {project.title}
              </h2>
            </div>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close case study"
              data-cursor="hover"
            >
              <span className={styles.escBadge}>ESC</span>
              <FiX size={18} />
            </button>
          </div>

          <div className={styles.modalScrollBody}>
            {/* Visual Media Showcase */}
            <div className={styles.mediaContainer}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.showcaseImage}
              />
              <div className={styles.mediaMetaBar}>
                <span className={styles.domainIndicator}>{project.domain}</span>
                {project.isLive && (
                  <span className={styles.liveIndicator} style={{ color: accentColor }}>
                    <span className={styles.livePulse} style={{ backgroundColor: accentColor }} />
                    Active in Production
                  </span>
                )}
              </div>
            </div>

            {/* Comprehensive Technical Overview */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionLabel}>SYSTEM OVERVIEW &amp; OBJECTIVE</h3>
              <p className={styles.overviewText}>
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Architecture Flow Pipeline */}
            {project.architecture && project.architecture.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionLabel}>END-TO-END ARCHITECTURE PIPELINE</h3>
                <div className={styles.archPipeline}>
                  {project.architecture.map((node, idx) => (
                    <React.Fragment key={idx}>
                      <div className={styles.archNode}>
                        <span className={styles.nodeLabel}>{node.label}</span>
                        <span className={styles.nodeSub}>{node.sub}</span>
                      </div>
                      {idx < project.architecture.length - 1 && (
                        <div className={styles.archConnector}>
                          <FiArrowRight size={14} className={styles.archArrow} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications Grid: Performance, Auth, Data Flow */}
            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <div className={styles.specHeader}>
                  <FiCpu className={styles.specIcon} style={{ color: accentColor }} />
                  <span className={styles.specTitle}>PERFORMANCE &amp; SPEED</span>
                </div>
                <p className={styles.specBody}>
                  {project.performance || 'Sub-150ms response latencies with zero layout shifts and optimized asset caching.'}
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specHeader}>
                  <FiShield className={styles.specIcon} style={{ color: accentColor }} />
                  <span className={styles.specTitle}>SECURITY &amp; AUTH</span>
                </div>
                <p className={styles.specBody}>
                  {project.auth || 'Cryptographic JWT session authentication with role-based route guards.'}
                </p>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specHeader}>
                  <FiDatabase className={styles.specIcon} style={{ color: accentColor }} />
                  <span className={styles.specTitle}>DATA FLOW &amp; INTEGRITY</span>
                </div>
                <p className={styles.specBody}>
                  {project.dataFlow || 'Strict payload schema validation with transactional queries and real-time state sync.'}
                </p>
              </div>
            </div>

            {/* Technologies Applied */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionLabel}>TECHNOLOGY ECOSYSTEM</h3>
              <div className={styles.tagsCloud}>
                {(project.allTags || project.tags).map((tech, idx) => (
                  <span key={idx} className={styles.techBadge}>
                    <FiCheck size={11} className={styles.badgeCheck} style={{ color: accentColor }} />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Launch Footer */}
            <div className={styles.modalFooter}>
              <div className={styles.footerLinks}>
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.launchBtn}
                    data-cursor="cta"
                    data-cursor-text="VISIT"
                  >
                    <span>Launch Platform</span>
                    <FiExternalLink size={14} />
                  </a>
                )}

                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceBtn}
                    data-cursor="hover"
                    data-cursor-text="CODE"
                  >
                    <FiGithub size={15} />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                className={styles.dismissBtn}
                onClick={onClose}
              >
                Close Case Study
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectCaseStudy;
