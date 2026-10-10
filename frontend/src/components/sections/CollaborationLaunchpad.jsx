import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMail, FiArrowRight, FiCheck } from 'react-icons/fi';
import Magnetic from '../interactive/Magnetic';
import styles from './CollaborationLaunchpad.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Collaboration Launchpad — Final Interactive CTA Destination
 * - Huge editorial headline & supporting text.
 * - Interactive availability pulse (AVAILABLE FOR OPPORTUNITIES -> OPEN TO CONNECT).
 * - Editorial collaboration types strip with subtle pastel underlines.
 * - Minimal "HOW WE START" 4-step workflow with GSAP signal progression.
 * - Step-by-step hover annotations with portfolio pastels (lavender, peach, sage, butter).
 * - Ultra-slow technical marquee with individual hover color accents.
 * - Magnetic micro-interactions on buttons with bracket expansion and feedback state.
 * - Pointer-reactive ambient light fields (light on paper).
 * - Successful contact return state ("CONNECTION ESTABLISHED ✓").
 */
const CollaborationLaunchpad = ({ id = 'contact' }) => {
  const navigate = useNavigate();

  // Component refs
  const containerRef = useRef(null);
  const ambientLavenderRef = useRef(null);
  const ambientSageRef = useRef(null);
  const ambientPeachRef = useRef(null);
  const signalHeadRef = useRef(null);
  const workflowTrackRef = useRef(null);

  // States
  const [isAvailHovered, setIsAvailHovered] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(null);
  const [isTalking, setIsTalking] = useState(false);
  const [isStacking, setIsStacking] = useState(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [isContactSuccess, setIsContactSuccess] = useState(false);

  // ── 1. Check for Contact Return State (Requirement 15) ─────────────
  useEffect(() => {
    try {
      const submitted = sessionStorage.getItem('contact_submitted');
      if (submitted === 'true') {
        setIsContactSuccess(true);
        const timer = setTimeout(() => {
          setIsContactSuccess(false);
          sessionStorage.removeItem('contact_submitted');
        }, 6000);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      // Storage access safety
    }
  }, []);

  // ── 2. Pointer-reactive ambient background fields (Requirement 13) ─
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Maximum 5-8px slow subtle movement
    if (ambientLavenderRef.current) {
      gsap.to(ambientLavenderRef.current, {
        x: x * 14,
        y: y * 14,
        duration: 1.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (ambientSageRef.current) {
      gsap.to(ambientSageRef.current, {
        x: -x * 12,
        y: -y * 12,
        duration: 1.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (ambientPeachRef.current) {
      gsap.to(ambientPeachRef.current, {
        x: x * 10,
        y: -y * 10,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }, []);

  // ── 3. Workflow Signal & Scroll Trigger (Requirements 5 & 19) ─────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const signalHead = signalHeadRef.current;
    if (!container || !signalHead) return;

    const ctx = gsap.context(() => {
      // Signal travel along connecting line (only once on enter view)
      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            signalHead,
            { left: '0%', opacity: 0 },
            {
              left: '100%',
              opacity: 1,
              duration: 2.2,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.to(signalHead, { opacity: 0, duration: 0.4 });
              },
            }
          );
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // ── 4. Smooth Button Click Handlers (Requirements 10 & 11) ────────
  const handleGetInTouchClick = (e) => {
    e.preventDefault();
    setIsTalking(true);

    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/contact');
      }
      setTimeout(() => setIsTalking(false), 900);
    }, 240);
  };

  const handleStackClick = (e) => {
    e.preventDefault();
    setIsStacking(true);

    setTimeout(() => {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/skills');
      }
      setTimeout(() => setIsStacking(false), 900);
    }, 240);
  };

  // Collaboration Types (Requirement 3)
  const collabTypes = [
    { title: 'SOFTWARE ENGINEERING', color: '#AEBFA7' },
    { title: 'FULL-STACK DEVELOPMENT', color: '#AEBFA7' },
    { title: 'PRODUCT SYSTEMS', color: '#C7BBD3' },
    { title: 'ARCHITECTURAL COLLABORATION', color: '#E7B8A8' },
  ];

  // Workflow Steps (Requirements 4, 6, 8)
  const workflowSteps = [
    {
      num: '01',
      title: 'YOU REACH OUT',
      annotation: 'Send a project, role or collaboration idea.',
      color: '#C7BBD3',
      bgAccent: 'rgba(199, 187, 211, 0.08)',
    },
    {
      num: '02',
      title: 'WE DISCUSS',
      annotation: 'Scope, constraints and technical direction.',
      color: '#AEBFA7',
      bgAccent: 'rgba(174, 191, 167, 0.08)',
    },
    {
      num: '03',
      title: 'I BUILD',
      annotation: 'Design, develop, test and iterate.',
      color: '#E7B8A8',
      bgAccent: 'rgba(231, 184, 168, 0.08)',
    },
    {
      num: '04',
      title: 'WE SHIP',
      annotation: 'Deploy, refine and hand over.',
      color: '#AEBFA7',
      bgAccent: 'rgba(174, 191, 167, 0.08)',
    },
  ];

  // Technical Marquee Items (Requirement 7)
  const marqueeTechs = [
    { name: 'React', color: '#E7B8A8' },
    { name: 'TypeScript', color: '#C7BBD3' },
    { name: 'Node.js', color: '#AEBFA7' },
    { name: 'PostgreSQL', color: '#AEBFA7' },
    { name: 'MongoDB', color: '#AEBFA7' },
    { name: 'GSAP', color: '#E5D8BD' },
    { name: 'Framer Motion', color: '#C7BBD3' },
    { name: 'Next.js', color: '#F5F3EE' },
    { name: 'Tailwind CSS', color: '#AEBFA7' },
    { name: 'Fastify', color: '#AEBFA7' },
    { name: 'REST APIs', color: '#E7B8A8' },
    { name: 'Three.js', color: '#C7BBD3' },
  ];

  return (
    <section
      id={id}
      ref={containerRef}
      className={styles.launchpadContainer}
      onMouseMove={handleMouseMove}
    >
      {/* ─── Ambient pointer-reactive soft light fields (Requirement 13) ── */}
      <div ref={ambientLavenderRef} className={styles.ambientFieldLavender} aria-hidden="true" />
      <div ref={ambientSageRef} className={styles.ambientFieldSage} aria-hidden="true" />
      <div ref={ambientPeachRef} className={styles.ambientFieldPeach} aria-hidden="true" />

      {/* ─── Subtle Signal Bar on Hover (Requirement 14: YOU → IDEA → BUILD → SHIP) ── */}
      <div className={styles.signalHeaderBar} aria-hidden="true">
        <span className={styles.signalWord}>YOU</span>
        <span className={styles.signalArrow}>→</span>
        <span className={styles.signalWord}>IDEA</span>
        <span className={styles.signalArrow}>→</span>
        <span className={styles.signalWord}>BUILD</span>
        <span className={styles.signalArrow}>→</span>
        <span className={styles.signalWord}>SHIP</span>
      </div>

      <div className={styles.mainContent}>

        {/* ─── Eyebrow (Requirement 1) ─────────────────────────────────── */}
        <div className={styles.eyebrow}>
          <span>(04) INQUIRIES &amp; COLLABORATION</span>
        </div>

        {/* ─── Hero Headline (Requirements 1 & 15) ─────────────────────── */}
        <AnimatePresence mode="wait">
          {isContactSuccess ? (
            <motion.h2
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`${styles.heroTitle} ${styles.heroTitleSuccess}`}
            >
              CONNECTION ESTABLISHED <FiCheck className={styles.successIcon} />
            </motion.h2>
          ) : (
            <motion.h2
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className={styles.heroTitle}
            >
              READY TO BUILD<br />SOMETHING EXCEPTIONAL?
            </motion.h2>
          )}
        </AnimatePresence>

        {/* ─── Supporting Text (Requirements 1 & 15) ───────────────────── */}
        <p className={styles.supportingText}>
          {isContactSuccess
            ? "Your transmission was delivered. I'll review your project scope and follow up promptly."
            : "Currently available for software engineering roles, full-stack development contracts, and architectural consultations."}
        </p>

        {/* ─── CTA Buttons (Requirements 1, 9, 10, 11) ─────────────────── */}
        <div className={styles.ctaButtonGroup}>
          {/* Primary: GET IN TOUCH / LET'S TALK */}
          <Magnetic strength={0.28} radius={90} maxOffset={5}>
            <button
              type="button"
              onClick={handleGetInTouchClick}
              className={`${styles.primaryBtn} ${isTalking ? styles.primaryBtnActive : ''}`}
              data-cursor="cta"
              data-cursor-text="CONNECT"
            >
              <FiMail className={styles.btnMailIcon} size={16} />
              <span className={styles.primaryBtnText}>
                {isTalking ? "LET'S TALK" : "GET IN TOUCH"}
              </span>
              <FiArrowRight className={styles.btnArrowIcon} size={15} />
            </button>
          </Magnetic>

          {/* Secondary: VIEW TECHNICAL STACK */}
          <Magnetic strength={0.24} radius={80} maxOffset={4}>
            <button
              type="button"
              onClick={handleStackClick}
              className={`${styles.secondaryBtn} ${isStacking ? styles.secondaryBtnActive : ''}`}
              data-cursor="hover"
              data-cursor-text="EXPLORE"
            >
              <span className={styles.bracketLeft}>&lt;</span>
              <span className={styles.secondaryBtnText}>VIEW TECHNICAL STACK</span>
              <span className={styles.bracketRight}>&gt;</span>
            </button>
          </Magnetic>
        </div>

        {/* ─── Availability Status Indicator (Requirement 2) ───────────── */}
        <div
          className={styles.availabilityRow}
          onMouseEnter={() => setIsAvailHovered(true)}
          onMouseLeave={() => setIsAvailHovered(false)}
          data-cursor="hover"
          data-cursor-text="AVAILABLE"
        >
          <span className={styles.availDot} />
          <span className={styles.availText}>
            {isAvailHovered ? "OPEN TO CONNECT" : "AVAILABLE FOR OPPORTUNITIES"}
          </span>
        </div>

        <div className={styles.horizontalDivider} />

        {/* ─── Collaboration Types Strip (Requirement 3) ───────────────── */}
        <div className={styles.collabStrip}>
          {collabTypes.map((item, idx) => (
            <React.Fragment key={item.title}>
              <span
                className={styles.collabItem}
                data-cursor="hover"
                style={{ '--underline-accent': item.color }}
              >
                {item.title}
                <span className={styles.collabUnderline} />
              </span>
              {idx < collabTypes.length - 1 && (
                <span className={styles.collabDot}>·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── Interactive "HOW WE START" Workflow (Requirements 4, 5, 6, 8) ─ */}
        <div className={styles.workflowSection}>
          <div className={styles.workflowTag}>
            <span>HOW WE START</span>
          </div>

          <div className={styles.workflowTrack} ref={workflowTrackRef}>
            {/* Animated Signal Progress Line */}
            <div className={styles.signalProgressLine}>
              <div ref={signalHeadRef} className={styles.signalHead} />
            </div>

            <div className={styles.workflowStepsRow}>
              {workflowSteps.map((step, idx) => {
                const isHovered = activeStepIdx === idx;
                return (
                  <div
                    key={step.num}
                    className={`${styles.workflowStep} ${isHovered ? styles.workflowStepActive : ''}`}
                    onMouseEnter={() => setActiveStepIdx(idx)}
                    onMouseLeave={() => setActiveStepIdx(null)}
                    data-cursor="hover"
                    data-cursor-text="TRACE"
                    style={{ '--step-accent': step.color, '--step-bg': step.bgAccent }}
                  >
                    <div className={styles.stepNum}>{step.num}</div>
                    <div className={styles.stepTitle}>{step.title}</div>

                    {/* Small Editorial Annotation on Hover (Requirement 6) */}
                    <div className={styles.stepAnnotationWrap}>
                      <AnimatePresence>
                        {isHovered && (
                          <motion.span
                            className={styles.stepAnnotation}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -2 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                          >
                            {step.annotation}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.horizontalDivider} />

        {/* ─── Tech Stack Marquee (Requirement 7) ──────────────────────── */}
        <div
          className={styles.marqueeContainer}
          onMouseEnter={() => setIsMarqueePaused(true)}
          onMouseLeave={() => setIsMarqueePaused(false)}
        >
          <div
            className={`${styles.marqueeTrack} ${isMarqueePaused ? styles.marqueePaused : ''}`}
          >
            {/* Render duplicated list for seamless marquee loop */}
            {[...marqueeTechs, ...marqueeTechs].map((tech, i) => (
              <span
                key={i}
                className={styles.techMarqueeItem}
                data-cursor="hover"
                style={{ '--tech-accent': tech.color }}
              >
                <span className={styles.techMarqueeName}>{tech.name}</span>
                <span className={styles.techMarqueeDot}>·</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CollaborationLaunchpad;
