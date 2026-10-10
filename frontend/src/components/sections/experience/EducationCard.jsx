import React, { useRef, useState, useEffect } from 'react';
import { FiAward, FiCheck, FiBookOpen } from 'react-icons/fi';
import styles from './EducationCard.module.css';

/**
 * Editorial Academic Foundation Card
 * Visually distinguishes technical degree foundation from industry experience cards:
 * - Prominent "FOUNDATION" marker
 * - Compact core topic pillars: Electronics, Communication Systems, Data Structures, Web Development, Software Engineering
 * - Date badge hover expansion ("4 YEARS") with sage accent
 * - Stack evolution row: HTML · CSS · JavaScript · React
 * - 3D micro-parallax tilt (1.5-2deg)
 */
const EducationCard = ({
  milestone,
  isActive = false,
  cardRef,
  onInspect,
  hoveredTech = null,
  onHoverTech,
}) => {
  const innerRef = useRef(null);
  const contentRef = useRef(null);
  const dateBadgeRef = useRef(null);

  const [dateExpanded, setDateExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;
    setIsTouchDevice(isTouch);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -1.8;
    const rotateY = ((x - centerX) / centerX) * 1.8;

    innerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(${(rotateY * 0.4).toFixed(1)}px, ${(rotateX * -0.4).toFixed(1)}px, 4px)`;
    }
    if (dateBadgeRef.current) {
      dateBadgeRef.current.style.transform = `translate3d(${(rotateY * 0.7).toFixed(1)}px, ${(rotateX * -0.7).toFixed(1)}px, 8px)`;
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || !innerRef.current) return;
    innerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    if (contentRef.current) contentRef.current.style.transform = 'translate3d(0, 0, 0)';
    if (dateBadgeRef.current) dateBadgeRef.current.style.transform = 'translate3d(0, 0, 0)';
  };

  const {
    chapterTag,
    role,
    company,
    period,
    durationContext,
    summary,
    foundationTopics,
    contributions,
    stack,
    accent,
  } = milestone;

  const isTechMatched = hoveredTech && stack.includes(hoveredTech);

  return (
    <div
      ref={cardRef}
      className={`
        ${styles.cardOuter} 
        ${isActive ? styles.cardActive : ''}
        ${isTechMatched ? styles.cardTechMatched : ''}
      `}
      data-cursor="cta"
      data-cursor-text="INSPECT"
      onClick={() => onInspect?.(milestone)}
    >
      <div
        ref={innerRef}
        className={`${styles.cardInner} ${styles[`accent_${accent}`] || styles.accent_mutedIce}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Header Row */}
        <div className={styles.topMetaRow}>
          <div className={styles.foundationTagRow}>
            <span className={styles.foundationTag}>{chapterTag}</span>
            <span className={styles.academicBadge}>FORMAL DEGREE</span>
          </div>

          <div className={styles.metaActionsRight}>
            {/* Interactive Date Badge */}
            <div
              ref={dateBadgeRef}
              className={`${styles.dateBadge} ${
                dateExpanded ? styles.dateBadgeExpanded : ''
              }`}
              onMouseEnter={() => setDateExpanded(true)}
              onMouseLeave={() => setDateExpanded(false)}
              title="Duration"
            >
              <span className={styles.dateDefault}>{period}</span>
              <span className={styles.dateHoverContext}>● {durationContext}</span>
            </div>

            {/* Subtle Inspect Action Pill */}
            <span className={styles.inspectPill}>
              <span>INSPECT</span>
              <span className={styles.inspectArrow}>↗</span>
            </span>
          </div>
        </div>

        {/* Degree & Institution */}
        <div className={styles.degreeHeader}>
          <div className={styles.degreeTitleGroup}>
            <div className={styles.iconContainer}>
              <FiAward size={20} />
            </div>
            <div>
              <div className={styles.degreeTitleWrapper}>
                <h3 className={styles.degreeTitle}>{role}</h3>
              </div>
              <p className={styles.institutionName}>{company}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div ref={contentRef} className={styles.contentBody}>
          <p className={styles.summaryText}>{summary}</p>

          {/* Distinct Compact Academic Foundation Topics List */}
          <div className={styles.foundationBlock}>
            <div className={styles.foundationHeader}>
              <FiBookOpen size={13} className={styles.bookIcon} />
              <span className={styles.foundationTitle}>CORE ACADEMIC PILLARS</span>
            </div>
            <div className={styles.topicsGrid}>
              {foundationTopics.map((topic, idx) => (
                <div key={idx} className={styles.topicItem}>
                  <span className={styles.topicBullet} />
                  <span className={styles.topicName}>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Coursework & Engineering Contributions */}
          <div className={styles.contributionsBlock}>
            <span className={styles.contributionsTitle}>KEY ACADEMIC & TECHNICAL MILESTONES</span>
            <ul className={styles.contributionsList}>
              {contributions.map((item, idx) => (
                <li
                  key={idx}
                  className={styles.contributionItem}
                  data-cursor="hover"
                  data-cursor-text="DETAIL"
                >
                  <span className={styles.checkIconWrapper}>
                    <FiCheck size={13} className={styles.checkIcon} />
                  </span>
                  <div className={styles.contributionTextWrapper}>
                    <span className={styles.contributionText}>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Evolution with Interactive Trace */}
          <div className={styles.stackEvolutionRow} onClick={(e) => e.stopPropagation()}>
            <span className={styles.stackLabel}>FOUNDATION STACK:</span>
            <div className={styles.stackList}>
              {stack.map((tech, idx) => {
                const isSelected = hoveredTech === tech;

                return (
                  <span
                    key={idx}
                    className={`${styles.stackItem} ${isSelected ? styles.stackItemActive : ''}`}
                    onMouseEnter={() => onHoverTech?.(tech)}
                    onMouseLeave={() => onHoverTech?.(null)}
                    data-cursor="hover"
                    data-cursor-text="TRACE"
                    title={`Trace ${tech} across timeline`}
                  >
                    {tech}
                    {idx < stack.length - 1 && <span className={styles.stackSeparator}>·</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EducationCard);
