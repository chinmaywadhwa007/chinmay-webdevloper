import React, { useRef, useState, useEffect } from 'react';
import { FiBriefcase, FiCheck } from 'react-icons/fi';
import styles from './ExperienceCard.module.css';

/**
 * Editorial Interactive Experience Card
 * Features:
 * - Subtle 3D mouse parallax tilt (1.5-2deg) with layered movement (header 1x, content 1.02x, date 1.05x)
 * - Date badge hover expansion showing duration context (CURRENT / 6 MONTHS)
 * - Subtle animated CURRENT status indicator for active role
 * - Interactive contribution items with icon activation, 3-5px text shift, and pastel underline
 * - Tech stack evolution tags with subtle illumination
 * - Global cursor integration (VIEW, STACK, DETAIL)
 */
const ExperienceCard = ({
  milestone,
  isActive = false,
  cardRef,
  onInspect,
  hoveredTech = null,
  onHoverTech,
}) => {
  const innerRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const dateBadgeRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [dateExpanded, setDateExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;
    setIsTouchDevice(isTouch);
  }, []);

  // Subtle 3D Pointer Parallax (capped at 1.5 - 2deg)
  const handleMouseMove = (e) => {
    if (isTouchDevice || !innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -1.8; // max ~1.8deg
    const rotateY = ((x - centerX) / centerX) * 1.8;

    innerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    // Layered subtle movement
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(${(rotateY * 0.4).toFixed(1)}px, ${(rotateX * -0.4).toFixed(1)}px, 4px)`;
    }
    if (dateBadgeRef.current) {
      dateBadgeRef.current.style.transform = `translate3d(${(rotateY * 0.7).toFixed(1)}px, ${(rotateX * -0.7).toFixed(1)}px, 8px)`;
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || !innerRef.current) return;
    setIsHovered(false);
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
    contributions,
    stack,
    accent,
    isCurrent,
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
        className={`${styles.cardInner} ${styles[`accent_${accent}`] || styles.accent_primaryIce}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Meta Row: Chapter Label + Date Badge + Inspect Action */}
        <div ref={headerRef} className={styles.topMetaRow}>
          <div className={styles.categoryBadgeRow}>
            <span className={styles.categoryBadge}>{chapterTag}</span>
            {isCurrent && (
              <span className={styles.currentIndicator} title="Active Production Role">
                <span className={styles.currentPulseDot} />
                <span className={styles.currentText}>CURRENT</span>
              </span>
            )}
          </div>

          <div className={styles.metaActionsRight}>
            {/* Date Badge with Interactive Hover Expansion */}
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
              <span className={styles.dateHoverContext}>
                {durationContext === 'CURRENT' ? '● CURRENT' : `● ${durationContext}`}
              </span>
            </div>

            {/* Subtle Inspect Action Pill */}
            <span className={styles.inspectPill}>
              <span>INSPECT</span>
              <span className={styles.inspectArrow}>↗</span>
            </span>
          </div>
        </div>

        {/* Role & Company Header */}
        <div className={styles.roleHeader}>
          <div className={styles.roleTitleGroup}>
            <div className={styles.iconContainer}>
              <FiBriefcase size={18} />
            </div>
            <div>
              <div className={styles.roleTitleWrapper}>
                <h3 className={styles.roleTitle}>
                  {isCurrent && <span className={styles.roleTitleDot}>● </span>}
                  {role}
                </h3>
              </div>
              <p className={styles.companyName}>{company}</p>
            </div>
          </div>
        </div>

        {/* One-Sentence Summary */}
        <div ref={contentRef} className={styles.contentBody}>
          <p className={styles.summaryText}>{summary}</p>

          {/* Key Contributions with Interactive Micro-Interactions */}
          <div className={styles.contributionsBlock}>
            <span className={styles.contributionsTitle}>KEY CONTRIBUTIONS</span>
            <ul className={styles.contributionsList}>
              {contributions.map((item, idx) => (
                <li
                  key={idx}
                  className={styles.contributionItem}
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

          {/* Tech Stack Evolution Row with Interactive Trace */}
          <div className={styles.stackEvolutionRow} onClick={(e) => e.stopPropagation()}>
            <span className={styles.stackLabel}>STACK:</span>
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

export default React.memo(ExperienceCard);
