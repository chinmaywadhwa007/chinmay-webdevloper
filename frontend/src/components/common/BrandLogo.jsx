import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './BrandLogo.module.css';

/**
 * BrandLogo — Official Chinmay Wadhwa Identity System
 * Supports 3 concepts from brand architecture:
 *   1. 'signature' (Concept 01 - Primary Logo)
 *   2. 'coded'     (Concept 02 - Alternate Logo)
 *   3. 'flow'      (Concept 03 - Interactive Logo)
 *
 * Lockup variations:
 *   - 'mark'       : Pure glyph / monogram for Navbar, Favicon, badges
 *   - 'horizontal' : Mark + spaced typography side-by-side
 *   - 'vertical'   : Mark centered above spaced typography
 *
 * Container themes:
 *   - 'dark' | 'glass' | 'circular' | 'light'
 *
 * Interaction states:
 *   - 'idle'    : Clean & architectural
 *   - 'hover'   : Subtle glow + node pulse
 *   - 'click'   : Energy pulse travels along the stroke to the node
 *   - 'loading' : Stroke draws in via dashoffset + orbital halo
 */
const BrandLogo = ({
  concept = 'signature',
  lockup = 'mark',
  variant = 'glass',
  state = 'auto',
  size = 'md',
  showText = false,
  showSubtitle = true,
  interactive = true,
  animated = true,
  className = '',
  onClick,
  onHoverStart,
  onHoverEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const pathRef = useRef(null);

  const effectiveState = state !== 'auto' ? state : (isHovered ? 'hover' : (isTraveling ? 'click' : 'idle'));

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  const handleClick = (e) => {
    if (interactive) {
      setIsTraveling(true);
      setClickCount((c) => c + 1);
      setTimeout(() => setIsTraveling(false), 800);
    }
    if (onClick) onClick(e);
  };

  // Dimensions based on size preset
  const sizeMap = {
    xs: { width: 34, height: 20, fontTitle: '0.62rem', fontSub: '0.42rem' },
    sm: { width: 44, height: 26, fontTitle: '0.75rem', fontSub: '0.48rem' },
    md: { width: 62, height: 36, fontTitle: '0.88rem', fontSub: '0.55rem' },
    lg: { width: 94, height: 54, fontTitle: '1.15rem', fontSub: '0.68rem' },
    xl: { width: 140, height: 80, fontTitle: '1.45rem', fontSub: '0.78rem' },
  };

  const currentDims = typeof size === 'number'
    ? { width: size, height: Math.round(size * 0.56), fontTitle: '0.85rem', fontSub: '0.52rem' }
    : (sizeMap[size] || sizeMap.md);

  // Concept 01: The Signature Mark path
  // Continuous ribbon: Top of C -> rounded loop -> baseline -> first peak of W -> valley -> mid peak -> valley -> upward arm to glowing node
  const signaturePath = 'M 48 27 L 30 27 C 18 27 12 34 12 43 C 12 52 18 59 30 59 L 52 59 C 58 59 62 50 66 33 L 78 59 L 93 33 L 107 59 C 113 59 122 47 136 17';

  // Concept 03: The Flow Mark paths
  const flowCPath = 'M 46 27 C 22 27 14 34 14 43 C 14 52 22 59 46 59';
  const flowBridgePath = 'M 46 59 C 58 59 63 32 74 32 C 85 32 90 59 102 59';
  const flowWPath = 'M 102 59 L 112 28 L 124 57 L 136 28 L 146 56';

  const renderMark = () => {
    if (concept === 'coded') {
      // Concept 02: THE CODED MARK (< • \W/ >)
      return (
        <svg
          className={`${styles.markSvg} ${effectiveState === 'loading' ? styles.loadingState : ''}`}
          viewBox="0 0 160 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: currentDims.width, height: currentDims.height }}
        >
          <defs>
            <linearGradient id="cwCodedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CDE8D5" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#D7C8FF" />
              <stop offset="100%" stopColor="#FFE6BF" />
            </linearGradient>
            <radialGradient id="codedDotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#D7C8FF" />
              <stop offset="100%" stopColor="rgba(215, 200, 255, 0)" />
            </radialGradient>
          </defs>

          {/* Hexagonal corner guides */}
          <path
            d="M 12 40 L 22 24 M 148 40 L 138 24 M 12 40 L 22 56 M 148 40 L 138 56"
            stroke="rgba(215, 200, 255, 0.22)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Left Angle Bracket */}
          <path
            d="M 40 25 L 22 40 L 40 55"
            stroke="url(#cwCodedGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isTraveling ? styles.bracketExpandLeft : ''}
          />

          {/* Center Pulsing Tech Dot */}
          <circle
            cx="58"
            cy="40"
            r="4.2"
            fill="#FFFFFF"
            className={`${styles.codedDot} ${isHovered ? styles.dotPulsing : ''}`}
          />
          <circle
            cx="58"
            cy="40"
            r="9"
            fill="url(#codedDotGlow)"
            opacity={isHovered ? 0.8 : 0.4}
            className={styles.codedDotHalo}
          />

          {/* Stylized Angular W */}
          <path
            d="M 74 25 L 86 55 L 98 34 L 110 55 L 122 25"
            stroke="url(#cwCodedGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Angle Bracket */}
          <path
            d="M 132 25 L 150 40 L 132 55"
            stroke="url(#cwCodedGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isTraveling ? styles.bracketExpandRight : ''}
          />
        </svg>
      );
    }

    if (concept === 'flow') {
      // Concept 03: THE FLOW MARK (C ~•~ W)
      return (
        <svg
          className={`${styles.markSvg} ${effectiveState === 'loading' ? styles.loadingState : ''}`}
          viewBox="0 0 160 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: currentDims.width, height: currentDims.height }}
        >
          <defs>
            <linearGradient id="cwFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CDE8D5" />
              <stop offset="40%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#D7C8FF" />
              <stop offset="100%" stopColor="#FFCDB2" />
            </linearGradient>
            <radialGradient id="flowNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#CDE8D5" />
              <stop offset="100%" stopColor="rgba(205, 232, 213, 0)" />
            </radialGradient>
          </defs>

          {/* C arc */}
          <path
            d={flowCPath}
            stroke="url(#cwFlowGrad)"
            strokeWidth="5.2"
            strokeLinecap="round"
          />

          {/* Wave bridge over node */}
          <path
            d={flowBridgePath}
            stroke="url(#cwFlowGrad)"
            strokeWidth="4.8"
            strokeLinecap="round"
            className={isTraveling ? styles.waveFlowActive : ''}
          />

          {/* Center bridge node */}
          <circle cx="74" cy="45" r="4" fill="#FFFFFF" />
          <circle cx="74" cy="45" r="10" fill="url(#flowNodeGlow)" opacity={0.6} />

          {/* W cursive paths */}
          <path
            d={flowWPath}
            stroke="url(#cwFlowGrad)"
            strokeWidth="5.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // Default: Concept 01 THE SIGNATURE MARK (Primary Logo)
    return (
      <svg
        className={`${styles.markSvg} ${effectiveState === 'loading' ? styles.loadingState : ''}`}
        viewBox="0 0 156 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: currentDims.width, height: currentDims.height }}
      >
        <defs>
          {/* Opalescent iridescent ribbon gradient blending brand Sage, Lavender, Peach, Butter */}
          <linearGradient id="cwRibbonGrad" x1="0%" y1="30%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="22%" stopColor="#E6E0F8" />
            <stop offset="48%" stopColor="#D7C8FF" />
            <stop offset="75%" stopColor="#FFCDB2" />
            <stop offset="100%" stopColor="#FFE6BF" />
          </linearGradient>

          {/* Node halo glow */}
          <radialGradient id="cwNodeHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFE6BF" />
            <stop offset="75%" stopColor="#FFCDB2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgba(255, 205, 178, 0)" />
          </radialGradient>

          {/* Loading ring aura */}
          <radialGradient id="cwLoadingAura" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(215, 200, 255, 0)" />
            <stop offset="90%" stopColor="rgba(215, 200, 255, 0.25)" />
            <stop offset="100%" stopColor="rgba(255, 230, 191, 0.45)" />
          </radialGradient>
        </defs>

        {/* Loading state circular orbital boundary */}
        {effectiveState === 'loading' && (
          <circle
            cx="78"
            cy="38"
            r="36"
            stroke="url(#cwRibbonGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className={styles.loadingOrbitalRing}
          />
        )}

        {/* Ambient glow behind ribbon on hover/active */}
        <path
          d={signaturePath}
          stroke="#D7C8FF"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isHovered || effectiveState === 'hover' ? 0.28 : 0.08}
          className={styles.glowBackdrop}
        />

        {/* Main Architectural CW Ribbon Vector */}
        <path
          ref={pathRef}
          d={signaturePath}
          stroke="url(#cwRibbonGrad)"
          strokeWidth="5.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.signatureRibbon} ${effectiveState === 'loading' ? styles.lineDrawIn : ''}`}
        />

        {/* Interactive traveling energy pulse on click */}
        {isTraveling && (
          <circle
            cx="0"
            cy="0"
            r="4.5"
            fill="#FFFFFF"
            className={styles.travelingParticle}
          >
            <animateMotion
              path={signaturePath}
              dur="0.65s"
              repeatCount="1"
              fill="freeze"
            />
          </circle>
        )}

        {/* Terminal Illuminated Glowing Node Orb (•) */}
        <g className={`${styles.nodeGroup} ${isHovered ? styles.nodeHovered : ''} ${isTraveling ? styles.nodeTriggered : ''}`}>
          {/* Subtle flare rays */}
          <line
            x1="136"
            y1="7"
            x2="136"
            y2="27"
            stroke="rgba(255, 230, 191, 0.4)"
            strokeWidth="0.8"
            opacity={isHovered ? 0.9 : 0.4}
          />
          <line
            x1="126"
            y1="17"
            x2="146"
            y2="17"
            stroke="rgba(255, 230, 191, 0.4)"
            strokeWidth="0.8"
            opacity={isHovered ? 0.9 : 0.4}
          />

          {/* Outer halo */}
          <circle
            cx="136"
            cy="17"
            r="12"
            fill="url(#cwNodeHalo)"
            className={styles.nodeHalo}
          />

          {/* Core sphere */}
          <circle
            cx="136"
            cy="17"
            r="4.8"
            fill="#FFFFFF"
            className={styles.nodeCore}
          />
        </g>
      </svg>
    );
  };

  // Typography for horizontal or vertical lockups
  const renderTypography = () => (
    <div className={`${styles.brandLockupText} ${lockup === 'vertical' ? styles.textVertical : styles.textHorizontal}`}>
      <span className={styles.brandTitle} style={{ fontSize: currentDims.fontTitle }}>
        CHINMAY WADHWA
      </span>
      {showSubtitle && (
        <span className={styles.brandSubtitle} style={{ fontSize: currentDims.fontSub }}>
          FULL-STACK DEVELOPER
        </span>
      )}
    </div>
  );

  // Return based on lockup mode
  return (
    <div
      className={`
        ${styles.logoRoot}
        ${styles[`theme_${variant}`]}
        ${styles[`lockup_${lockup}`]}
        ${interactive ? styles.isInteractive : ''}
        ${isHovered ? styles.isHovered : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : undefined}
      aria-label="Chinmay Wadhwa — Full-Stack Developer Logo"
    >
      <div className={styles.markContainer}>
        {renderMark()}
      </div>

      {(lockup !== 'mark' || showText) && renderTypography()}
    </div>
  );
};

export default BrandLogo;
