import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FiCheck, FiFolder } from 'react-icons/fi';
import { getCapStyle } from './skillsData';
import styles from './SkillItem.module.css';

/**
 * Interactive Skill Item Card
 * Demonstrates real production capability and verified usage proof without percentage bars.
 * Equipped with subtle 2-3deg physical tilt and cursor integration.
 */
const SkillItem = ({ skill }) => {
  const cardRef = useRef(null);
  const rotXTo = useRef(null);
  const rotYTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    rotXTo.current = gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power2.out' });
    rotYTo.current = gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power2.out' });
    yTo.current = gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power2.out' });

    return () => {
      gsap.killTweensOf(card);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = cardRef.current;
    if (!card || !rotXTo.current) return;

    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 2-3 degrees tilt
    rotXTo.current(-yPct * 4);
    rotYTo.current(xPct * 4);
    if (yTo.current) yTo.current(-2);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const accentClass = styles[`card_${skill.statusAccent || 'sage'}`];
  const statusBadgeClass = styles[`status_${skill.statusAccent || 'sage'}`];

  return (
    <div
      className={styles.cardPerspectiveWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`${styles.skillCard} ${accentClass}`}
        data-cursor="hover"
        data-cursor-text="EXPLORE"
      >
        {/* Header: Skill Name & Production Status */}
        <div className={styles.cardHeader}>
          <h3 className={styles.skillName}>{skill.name}</h3>
          <span className={`${styles.statusBadge} ${statusBadgeClass}`}>
            <span className={styles.statusDot} />
            <span>{skill.status}</span>
          </span>
        </div>

        <p className={styles.skillDescription}>{skill.description}</p>

        {/* Technical Capabilities */}
        <div className={styles.capabilitiesSection}>
          <span className={styles.sectionLabel}>Core Capabilities</span>
          <div className={styles.capabilitiesWrap}>
            {skill.capabilities.map((cap, idx) => {
              const capStyle = getCapStyle(cap, idx);
              return (
                <span
                  key={idx}
                  className={styles.capabilityPill}
                  style={{
                    backgroundColor: capStyle.bg,
                    borderColor: capStyle.border,
                    color: capStyle.color,
                  }}
                >
                  {cap}
                </span>
              );
            })}
          </div>
        </div>

        {/* Production Proof */}
        <div className={styles.proofSection}>
          <span className={styles.sectionLabel}>Used in Production</span>
          <div className={styles.proofList}>
            {skill.proof.map((item, pIdx) => (
              <span
                key={pIdx}
                className={styles.proofBadge}
                data-cursor="hover"
                data-cursor-text="VIEW"
              >
                <FiFolder className={styles.proofIcon} size={11} />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillItem;
