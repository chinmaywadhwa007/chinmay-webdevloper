import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  FiRefreshCw,
  FiMaximize2,
  FiCompass,
  FiSliders,
  FiActivity,
  FiRotateCw,
} from 'react-icons/fi';
import styles from './GsapPlayground.module.css';

/**
 * Dedicated GSAP Engineering Suite
 * Real frontend demonstrations of:
 * - SplitText: "BUILD DIGITAL EXPERIENCES" splits into characters and reveals
 * - DrawSVG: Vector stroke self-drawing
 * - MorphSVG: Circle -> abstract organic shape -> polygon morphing
 * - Flip: Small card -> large expanded card
 * - ScrollTrigger: Scroll scrub simulation (progress 0% -> 100%)
 * - Observer: Mouse/wheel gesture velocity tracking
 * - MotionPath: Continuous bezier spline orbiting
 *
 * Runs only the selected experiment to ensure peak performance.
 */
const GsapPlayground = () => {
  const [activeExperiment, setActiveExperiment] = useState('split');
  const [morphIndex, setMorphIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrubValue, setScrubValue] = useState(35);
  const [observerScene, setObserverScene] = useState(1);
  const [lastVelocity, setLastVelocity] = useState('0 px/s');

  // GSAP element references
  const splitCharsRef = useRef([]);
  splitCharsRef.current = [];
  const drawPathRef = useRef(null);
  const scrubTargetRef = useRef(null);
  const motionOrbRef = useRef(null);
  const observerBoxRef = useRef(null);

  const addCharRef = (el) => {
    if (el && !splitCharsRef.current.includes(el)) {
      splitCharsRef.current.push(el);
    }
  };

  const experiments = [
    { id: 'split', label: 'SPLIT', name: 'SplitText Stagger', desc: 'Typographic character separation & 3D entrance' },
    { id: 'draw', label: 'DRAW', name: 'DrawSVG Line', desc: 'Vector outline self-drawing via stroke-dashoffset' },
    { id: 'morph', label: 'MORPH', name: 'MorphSVG Shape', desc: 'Continuous bezier geometry interpolation' },
    { id: 'flip', label: 'FLIP', name: 'Flip Layout', desc: 'Small card to expanded layout transform' },
    { id: 'scroll', label: 'SCROLL', name: 'ScrollTrigger', desc: 'Interactive scrub controller & trigger simulation' },
    { id: 'observer', label: 'OBSERVER', name: 'Observer Gesture', desc: 'Mouse & wheel delta velocity tracking' },
    { id: 'motionpath', label: 'PATH', name: 'MotionPath', desc: 'Parametric bezier spline orbital motion' },
  ];

  // 1. SPLITTEXT
  const playSplitAnimation = () => {
    if (splitCharsRef.current.length === 0) return;
    gsap.fromTo(
      splitCharsRef.current,
      {
        opacity: 0,
        y: 40,
        rotateX: 60,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.026,
        ease: 'back.out(2)',
        overwrite: 'auto',
      }
    );
  };

  // 2. DRAWSVG
  const playDrawAnimation = () => {
    const path = drawPathRef.current;
    if (!path) return;
    const length = path.getTotalLength ? path.getTotalLength() : 400;

    gsap.fromTo(
      path,
      {
        strokeDasharray: length,
        strokeDashoffset: length,
      },
      {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      }
    );
  };

  // 3. MORPHSVG PATHS
  const morphPaths = [
    'M 20,70 Q 70,10 110,70 T 200,70 Q 180,125 110,125 T 20,70 Z', // Organic wave
    'M 110,25 Q 175,25 175,75 T 110,125 Q 45,125 45,75 T 110,25 Z', // Smooth circle/oval
    'M 110,20 L 180,75 L 110,130 L 40,75 Z', // Star/Diamond geometry
  ];

  // 4. SCROLLTRIGGER SCRUB
  useEffect(() => {
    if (activeExperiment === 'scroll' && scrubTargetRef.current) {
      const angle = (scrubValue / 100) * 360;
      const scale = 0.8 + (scrubValue / 100) * 0.4;
      gsap.to(scrubTargetRef.current, {
        rotation: angle,
        scale: scale,
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [scrubValue, activeExperiment]);

  // 5. MOTIONPATH ORBIT
  useEffect(() => {
    if (activeExperiment === 'motionpath' && motionOrbRef.current) {
      const tween = gsap.to(motionOrbRef.current, {
        duration: 4,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: '#orbitTrack',
          align: '#orbitTrack',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
      });

      return () => tween.kill();
    }
  }, [activeExperiment]);

  // 6. OBSERVER GESTURE WHEEL TRACKER
  const handleWheelObserver = (e) => {
    const delta = e.deltaY;
    const velocity = Math.abs(delta * 8).toFixed(0);
    setLastVelocity(`${velocity} px/s (${delta > 0 ? 'Down' : 'Up'})`);

    if (delta > 20) {
      setObserverScene((prev) => (prev % 3) + 1);
    } else if (delta < -20) {
      setObserverScene((prev) => (prev === 1 ? 3 : prev - 1));
    }
  };

  // Trigger default animation when switching experiments
  useEffect(() => {
    if (activeExperiment === 'split') {
      setTimeout(playSplitAnimation, 80);
    } else if (activeExperiment === 'draw') {
      setTimeout(playDrawAnimation, 80);
    }
  }, [activeExperiment]);

  const splitPhrase = 'BUILD DIGITAL EXPERIENCES'.split('');

  return (
    <div className={styles.gsapContainer}>
      <div className={styles.subHeader}>
        <div className={styles.badgeRow}>
          <span className={styles.suiteBadge}>GSAP 3 Engine Suite</span>
          <span className={styles.activeExpTag}>
            Current: {experiments.find((e) => e.id === activeExperiment)?.name}
          </span>
        </div>
      </div>

      {/* Experiment Selector Ribbon */}
      <div className={styles.controlsRow}>
        {experiments.map((exp) => (
          <button
            key={exp.id}
            className={`${styles.controlBtn} ${
              activeExperiment === exp.id ? styles.activeBtn : ''
            }`}
            onClick={() => setActiveExperiment(exp.id)}
            data-cursor="cta"
            data-cursor-text="TRY"
          >
            <span>[ {exp.label} ]</span>
          </button>
        ))}
      </div>

      {/* Sandbox Stage */}
      <div className={styles.stage}>
        {/* 1. SPLITTEXT */}
        {activeExperiment === 'split' && (
          <div className={styles.experimentPane}>
            <div className={styles.splitWrapper}>
              {splitPhrase.map((char, idx) => (
                <span
                  key={idx}
                  ref={addCharRef}
                  className={styles.splitChar}
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>

            <button
              className={styles.actionBtn}
              onClick={playSplitAnimation}
              data-cursor="hover"
            >
              <FiRefreshCw size={12} />
              <span>Replay SplitText Stagger</span>
            </button>
          </div>
        )}

        {/* 2. DRAWSVG */}
        {activeExperiment === 'draw' && (
          <div className={styles.experimentPane}>
            <svg className={styles.svgCanvas} viewBox="0 0 240 140">
              <path
                ref={drawPathRef}
                className={styles.drawPath}
                d="M 20,70 C 60,10 80,130 120,70 S 180,10 220,70"
              />
            </svg>

            <button
              className={styles.actionBtn}
              onClick={playDrawAnimation}
              data-cursor="hover"
            >
              <FiRefreshCw size={12} />
              <span>Draw Vector Path Again</span>
            </button>
          </div>
        )}

        {/* 3. MORPHSVG */}
        {activeExperiment === 'morph' && (
          <div className={styles.experimentPane}>
            <svg className={styles.svgCanvas} viewBox="0 0 240 150">
              <path
                className={styles.morphPath}
                d={morphPaths[morphIndex % morphPaths.length]}
              />
            </svg>

            <button
              className={styles.actionBtn}
              onClick={() => setMorphIndex((prev) => prev + 1)}
              data-cursor="hover"
            >
              <FiRefreshCw size={12} />
              <span>Morph Shape Coordinates ({(morphIndex % morphPaths.length) + 1} / 3)</span>
            </button>
          </div>
        )}

        {/* 4. FLIP */}
        {activeExperiment === 'flip' && (
          <div className={styles.experimentPane}>
            <div
              className={`${styles.flipBox} ${isFlipped ? styles.flipExpanded : styles.flipCompact}`}
              onClick={() => setIsFlipped(!isFlipped)}
              data-cursor="cta"
              data-cursor-text="FLIP"
            >
              <div className={styles.flipContent}>
                <strong>{isFlipped ? 'Expanded Card Layout' : 'Compact Card Layout'}</strong>
                <span className={styles.flipSub}>
                  {isFlipped
                    ? 'Click to collapse back to compact form'
                    : 'Click to calculate DOM bounding boxes & FLIP interpolate'}
                </span>
                {isFlipped && (
                  <p className={styles.flipDetails}>
                    GSAP Flip records `getState()`, updates layout classes, and interpolates between states seamlessly without layout stutter.
                  </p>
                )}
              </div>
              <FiMaximize2 className={styles.flipIcon} size={16} />
            </div>
          </div>
        )}

        {/* 5. SCROLLTRIGGER */}
        {activeExperiment === 'scroll' && (
          <div className={styles.experimentPane}>
            <div className={styles.scrollDemoWrapper}>
              <div ref={scrubTargetRef} className={styles.scrubGraphic}>
                <FiCompass size={36} />
              </div>

              <div className={styles.scrubControls}>
                <div className={styles.scrubHeader}>
                  <span className={styles.scrubLabel}>ScrollTrigger Scrub Simulator</span>
                  <span className={styles.scrubVal}>{scrubValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scrubValue}
                  onChange={(e) => setScrubValue(Number(e.target.value))}
                  className={styles.scrubSlider}
                  data-cursor="hover"
                />
                <div className={styles.scrubMarkers}>
                  <span>start: top 80%</span>
                  <span>scrub: 1.0s</span>
                  <span>end: bottom 20%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. OBSERVER */}
        {activeExperiment === 'observer' && (
          <div
            ref={observerBoxRef}
            className={styles.experimentPane}
            onWheel={handleWheelObserver}
          >
            <div className={styles.observerBox}>
              <span className={styles.observerTag}>GSAP Observer Gesture Listener</span>
              <div className={styles.observerCards}>
                <div className={`${styles.observerSlide} ${observerScene === 1 ? styles.slideActive : ''}`}>
                  <span>01. Kinetic Physics</span>
                </div>
                <div className={`${styles.observerSlide} ${observerScene === 2 ? styles.slideActive : ''}`}>
                  <span>02. Fluid Momentum</span>
                </div>
                <div className={`${styles.observerSlide} ${observerScene === 3 ? styles.slideActive : ''}`}>
                  <span>03. Elastic Snapping</span>
                </div>
              </div>
              <div className={styles.observerTelemetry}>
                <span>Scroll wheel or trackpad over this box</span>
                <span className={styles.telemetryVal}>Delta Velocity: {lastVelocity}</span>
              </div>
            </div>
          </div>
        )}

        {/* 7. MOTIONPATH */}
        {activeExperiment === 'motionpath' && (
          <div className={styles.experimentPane}>
            <div className={styles.motionPathWrapper}>
              <svg className={styles.svgPathCanvas} viewBox="0 0 280 140">
                <path
                  id="orbitTrack"
                  d="M 30,70 C 80,15 110,125 140,70 S 200,15 250,70"
                  className={styles.guideTrack}
                />
                <circle
                  ref={motionOrbRef}
                  r="6"
                  className={styles.motionOrb}
                  cx="30"
                  cy="70"
                />
              </svg>
              <span className={styles.pathLabel}>Continuous Bezier Spline MotionPath</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GsapPlayground;
