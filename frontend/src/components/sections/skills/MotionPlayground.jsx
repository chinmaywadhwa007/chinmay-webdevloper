import React, { useState } from 'react';
import GsapPlayground from './GsapPlayground';
import MotionReactPlayground from './MotionReactPlayground';
import styles from './MotionPlayground.module.css';

/**
 * Interactive Frontend Motion Lab
 * Modular container uniting:
 * - GSAP 3 Engineering Suite (SplitText, DrawSVG, MorphSVG, Flip, ScrollTrigger, Observer, MotionPath)
 * - Motion for React Interactive Sandbox ([DRAG ME], spring physics, gestures, layoutId)
 */
const MotionPlayground = () => {
  const [motionEngine, setMotionEngine] = useState('gsap'); // 'gsap' | 'motion-react'

  return (
    <div className={styles.motionCard}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.tagline}>Animation Engineering Lab</span>
          <h3 className={styles.title}>Interactive Motion Playground</h3>
        </div>

        {/* Engine Switcher */}
        <div className={styles.engineSwitcher}>
          <button
            className={`${styles.engineBtn} ${motionEngine === 'gsap' ? styles.engineActive : ''}`}
            onClick={() => setMotionEngine('gsap')}
            data-cursor="hover"
          >
            <span>GSAP Engineering Suite</span>
          </button>
          <button
            className={`${styles.engineBtn} ${motionEngine === 'motion-react' ? styles.engineActive : ''}`}
            onClick={() => setMotionEngine('motion-react')}
            data-cursor="hover"
          >
            <span>Motion for React Physics</span>
          </button>
        </div>
      </div>

      {/* Active Playground */}
      <div className={styles.playgroundBody}>
        {motionEngine === 'gsap' ? (
          <GsapPlayground />
        ) : (
          <MotionReactPlayground />
        )}
      </div>
    </div>
  );
};

export default MotionPlayground;
