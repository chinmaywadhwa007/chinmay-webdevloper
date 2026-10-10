import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMove, FiCheck, FiRotateCcw, FiLayers, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import styles from './MotionReactPlayground.module.css';

/**
 * Dedicated Motion for React Interactive Playground
 * Demonstrates:
 * - Interactive [ DRAG ME ] card with spring physics
 * - Bounds & elastic deflection with automatic spring return
 * - Hover & tap micro-interactions
 * - Smooth layout morphing transitions (layout & layoutId)
 */
const MotionReactPlayground = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [springStiffness, setSpringStiffness] = useState(380);
  const [springDamping, setSpringDamping] = useState(26);
  const [interactionCount, setInteractionCount] = useState(0);

  return (
    <div className={styles.motionReactContainer}>
      <div className={styles.subHeader}>
        <div className={styles.badgeRow}>
          <span className={styles.reactBadge}>Motion for React Physics</span>
          <span className={styles.subDesc}>
            Gestures, springs, layoutId & fluid boundary snapping
          </span>
        </div>

        {/* Physics tuning */}
        <div className={styles.physicsControls}>
          <button
            className={`${styles.toggleBtn} ${isExpanded ? styles.toggleActive : ''}`}
            onClick={() => {
              setIsExpanded(!isExpanded);
              setInteractionCount((c) => c + 1);
            }}
            data-cursor="cta"
            data-cursor-text="MORPH"
          >
            {isExpanded ? <FiMinimize2 size={12} /> : <FiMaximize2 size={12} />}
            <span>{isExpanded ? 'Compact Mode' : 'Layout Transition'}</span>
          </button>
        </div>
      </div>

      {/* Physics Sandbox Arena */}
      <div className={styles.arena}>
        <div className={styles.arenaCrosshair} />

        {/* The Interactive Motion Object */}
        <motion.div
          drag
          dragConstraints={{ left: -140, right: 140, top: -70, bottom: 70 }}
          dragElastic={0.4}
          dragTransition={{
            bounceStiffness: springStiffness,
            bounceDamping: springDamping,
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 12px 28px rgba(36, 35, 33, 0.12)',
          }}
          whileTap={{
            scale: 0.96,
            rotate: 1.5,
          }}
          layout
          transition={{
            type: 'spring',
            stiffness: springStiffness,
            damping: springDamping,
          }}
          className={`${styles.interactiveCard} ${isExpanded ? styles.cardExpanded : styles.cardCompact}`}
          data-cursor="hover"
          data-cursor-text="DRAG"
          onDragStart={() => setInteractionCount((c) => c + 1)}
        >
          <motion.div layout="position" className={styles.dragHandle}>
            <FiMove className={styles.handleIcon} size={15} />
            <span className={styles.handleText}>DRAG ME</span>
          </motion.div>

          <motion.div layout="position" className={styles.cardDetails}>
            <p className={styles.hintText}>
              Drag across the boundary and release to observe spring physics return.
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className={styles.expandedSpecs}
                >
                  <div className={styles.specItem}>
                    <span>Stiffness:</span>
                    <strong>{springStiffness}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Damping:</span>
                    <strong>{springDamping}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Interactions:</span>
                    <strong>{interactionCount}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <span className={styles.arenaFootnote}>
          Elastic boundaries active (±140px X, ±70px Y) · Auto-spring reset
        </span>
      </div>
    </div>
  );
};

export default MotionReactPlayground;
