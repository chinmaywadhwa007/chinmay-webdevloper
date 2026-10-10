import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { FiArrowRight, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import ProjectImage from './ProjectImage';
import styles from './FeaturedProjectCard.module.css';

/**
 * FeaturedProjectCard - Compact Editorial Architecture Card
 * Reduced vertical density (~520-560px), 16:9 media viewport, concise 1-2 line description,
 * top 3 technologies, and single primary action that triggers the Case Study morph.
 */
const FeaturedProjectCard = forwardRef(
  ({ project, index, isDimmed = false, onCardHover, onCardLeave, onSelect }, ref) => {
    const cardElRef = useRef(null);
    const imageRef = useRef(null);

    // Expose DOM elements for parent ScrollTrigger entrance sequence
    useImperativeHandle(ref, () => ({
      getCard: () => cardElRef.current,
      getImage: () => imageRef.current?.getViewport(),
    }));

    const accentClass =
      project.accent === 'peach'
        ? styles.cardPeach
        : project.accent === 'butter' || project.accent === 'apricot'
        ? styles.cardButter
        : project.accent === 'lavender'
        ? styles.cardLavender
        : styles.cardSage;

    const handleCardClick = () => {
      if (onSelect) {
        onSelect(project);
      }
    };

    return (
      <div
        ref={cardElRef}
        className={`${styles.featuredCard} ${accentClass} ${isDimmed ? styles.cardDimmed : ''}`}
        onMouseEnter={() => onCardHover && onCardHover(index)}
        onMouseLeave={() => onCardLeave && onCardLeave()}
        onClick={handleCardClick}
        data-cursor="project"
        data-cursor-text="VIEW"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View ${project.title} case study`}
      >
        {/* Top Accent Expanding Line */}
        <div className={styles.accentBorderTop} />

        {/* 16:9 Compact Project Image & Browser Mockup */}
        <ProjectImage
          ref={imageRef}
          src={project.image}
          alt={project.title}
          domain={project.domain}
          isLive={project.isLive}
          accent={project.accent}
          isVideo={project.isVideo}
          labelText={project.isVideo ? 'PLAY PREVIEW' : 'VIEW PROJECT'}
        />

        {/* Compact Editorial Content */}
        <div className={styles.cardBody}>
          <div className={styles.categoryLabel}>{project.category}</div>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <p className={styles.projectDescription}>{project.description}</p>

          {/* Exactly 3 Key Technologies */}
          <div className={styles.tagsRow}>
            {project.tags.slice(0, 3).map((tag, tIdx) => (
              <span key={tIdx} className={styles.techTag}>
                {tag}
              </span>
            ))}
          </div>

          {/* Clean Action Row */}
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              data-cursor="cta"
              data-cursor-text="EXPAND"
            >
              <span>View Project</span>
              <FiArrowRight size={14} className={styles.actionArrow} />
            </button>

            <div className={styles.secondaryLinks} onClick={(e) => e.stopPropagation()}>
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.subtleExternalLink}
                  title="Launch Platform"
                  data-cursor="hover"
                >
                  <FiArrowUpRight size={15} />
                </a>
              )}

              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.subtleExternalLink}
                  title="Source Code"
                  data-cursor="hover"
                >
                  <FiGithub size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default FeaturedProjectCard;
