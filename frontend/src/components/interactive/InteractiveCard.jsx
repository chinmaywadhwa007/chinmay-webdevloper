import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './InteractiveCard.module.css';

/**
 * Interactive Card with subtle 3D tilt, pastel aura expansion, and icon micro-rotation
 * Uses GSAP quickTo and direct transforms without React re-render thrashing.
 */
const InteractiveCard = ({
  children,
  accent = 'sage',
  className = '',
  maxTilt = 3, // Restrained 3 degrees max
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -yPct * maxTilt;
    const rotY = xPct * maxTilt;
    const moveX = xPct * 5;
    const moveY = yPct * 5;

    gsap.to(card, {
      rotateX: rotX,
      rotateY: rotY,
      x: moveX,
      y: moveY - 3,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${styles[`accent_${accent}`]} ${
        isHovered ? styles.cardActive : ''
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={styles.pastelAura} aria-hidden="true" />
      <div className={styles.innerContent}>{children}</div>
    </div>
  );
};

export default InteractiveCard;
