import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedCounter from '../interactive/AnimatedCounter';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_HIGHLIGHTS = {
  React:       { color: '#F0B09D', bg: 'rgba(122, 48, 35, 0.22)', label: 'Frontend architecture' },
  'Node.js':   { color: '#F0B09D', bg: 'rgba(122, 48, 35, 0.22)', label: 'Backend services & APIs' },
  PostgreSQL:  { color: '#F0B09D', bg: 'rgba(122, 48, 35, 0.22)', label: 'Relational data & persistence' },
  MongoDB:     { color: '#F0B09D', bg: 'rgba(122, 48, 35, 0.22)', label: 'Document-oriented data' },
};

const PRINCIPLES = [
  {
    id: 'architecture',
    num: '01',
    title: 'CLEAN ARCHITECTURE',
    short: 'Separation of concerns, predictable structure.',
    long: 'Separation of concerns, predictable structure, maintainable components and clear boundaries that make codebases easier to reason about and extend.',
    accent: '#D95A3A',
    accentBg: 'rgba(122, 48, 35, 0.22)',
    connectsBio: 'architectural clarity',
    connectsTechs: [],
    icon: 'architecture',
  },
  {
    id: 'fullstack',
    title: 'FULL-STACK SYSTEMS',
    num: '02',
    short: 'End-to-end ownership from UI to database.',
    long: 'End-to-end ownership from pixel-perfect UI to resilient API and data layer. Building complete systems that move data, handle auth, and serve users reliably.',
    accent: '#D95A3A',
    accentBg: 'rgba(122, 48, 35, 0.22)',
    connectsTechs: ['React', 'Node.js', 'PostgreSQL', 'MongoDB'],
    icon: 'fullstack',
  },
  {
    id: 'problem',
    title: 'PROBLEM SOLVING',
    num: '03',
    short: 'Diagnosing root cause, not patching symptoms.',
    long: 'Diagnosing root cause rather than patching symptoms. Methodically tracing bugs through the stack, reading logs and optimising for resilience.',
    accent: '#D95A3A',
    accentBg: 'rgba(122, 48, 35, 0.22)',
    connectsBio: 'debugging and resolving',
    connectsTechs: [],
    icon: 'problem',
  },
];

const WORKFLOW_STEPS = [
  { id: 'observe',   label: 'OBSERVE',   principle: null },
  { id: 'structure', label: 'STRUCTURE', principle: 'architecture' },
  { id: 'build',     label: 'BUILD',     principle: 'fullstack' },
  { id: 'debug',     label: 'DEBUG',     principle: 'problem' },
  { id: 'ship',      label: 'SHIP',      principle: null },
];

const STATS = [
  { val: 100, suffix: '+', label: 'Issues Resolved',    detail: 'Bugs debugged & optimised across lifecycle', accent: '#D95A3A' },
  { val: 5,   suffix: '+', label: 'Production Systems', detail: 'Digimate, Vexo, EstateCRM, Dezoryn, SkillLoop', accent: '#D95A3A' },
  { val: 12,  suffix: '+', label: 'Core Technologies',  detail: 'React, Node, TypeScript, SQL, Three.js & Cloud', accent: '#D95A3A' },
];

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const IconArchitecture = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5" className={active ? styles.iconAnimBracketL : ''} />
    <rect x="13" y="2" width="7" height="7" rx="1.5" className={active ? styles.iconAnimBracketR : ''} />
    <rect x="7.5" y="13" width="7" height="7" rx="1.5" />
    <line x1="5.5" y1="9" x2="5.5" y2="13.5" />
    <line x1="16.5" y1="9" x2="16.5" y2="13.5" />
    <line x1="5.5" y1="13.5" x2="11" y2="13.5" />
    <line x1="16.5" y1="13.5" x2="11" y2="13.5" />
  </svg>
);

const IconFullStack = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1.5" y="3" width="8" height="6" rx="1.5" />
    <rect x="12.5" y="13" width="8" height="6" rx="1.5" />
    <path d={active ? 'M 9.5 6 Q 14 6 14 16' : 'M 9.5 6 L 14 6 L 14 16'} className={styles.iconAnimPath} />
    <circle cx="11" cy="11" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconProblem = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8.5" />
    <circle cx="11" cy="11" r="4" className={active ? styles.iconAnimPulse : ''} />
    <line x1="11" y1="2.5" x2="11" y2="6" />
    <line x1="11" y1="16" x2="11" y2="19.5" />
    <line x1="2.5" y1="11" x2="6" y2="11" />
    <line x1="16" y1="11" x2="19.5" y2="11" />
  </svg>
);

// ─── Resume Button ─────────────────────────────────────────────────────────────
const ResumeButton = () => {
  const [phase, setPhase] = useState('idle'); // idle | downloading | done

  const handleClick = useCallback((e) => {
    if (phase !== 'idle') return;
    setPhase('downloading');
    setTimeout(() => setPhase('done'), 1200);
    setTimeout(() => setPhase('idle'), 3200);
  }, [phase]);

  return (
    <a
      href="/cwadhwa-resume.pdf"
      download="Chinmay-Wadhwa-Resume.pdf"
      className={`${styles.resumeBtn} ${phase === 'done' ? styles.resumeBtnDone : ''}`}
      onClick={handleClick}
      data-cursor="cta"
      data-cursor-text="DOWNLOAD"
    >
      <motion.span
        className={styles.resumeBtnIcon}
        animate={phase === 'downloading' ? { y: [0, 4, 0], transition: { repeat: 2, duration: 0.4 } }
          : phase === 'done' ? { rotate: 0 } : { y: 0 }}
      >
        {phase === 'done' ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M 2 7 L 5.5 10.5 L 11 4" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M 6.5 1 L 6.5 9 M 3 6.5 L 6.5 10 L 10 6.5" />
            <line x1="2" y1="12" x2="11" y2="12" />
          </svg>
        )}
      </motion.span>
      <span>
        {phase === 'idle' ? 'Download CV' : phase === 'downloading' ? 'Preparing…' : 'Downloaded ✓'}
      </span>
    </a>
  );
};

// ─── Highlighted tech span ────────────────────────────────────────────────────
const TechSpan = ({ tech, onHover, activeHighlight }) => {
  const info = TECH_HIGHLIGHTS[tech];
  const isActive = activeHighlight === tech;
  return (
    <span
      className={styles.techWord}
      style={{
        backgroundColor: isActive ? info.bg : 'transparent',
        color: isActive ? info.color : 'inherit',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
      onMouseEnter={() => onHover(tech)}
      onMouseLeave={() => onHover(null)}
      data-cursor="hover"
      data-cursor-text="INSPECT"
    >
      {tech}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className={styles.techTooltip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
          >
            {info.label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const About = () => {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingWordsRef = useRef([]);
  headingWordsRef.current = [];
  const subtitleRef = useRef(null);
  const bioColRef = useRef(null);
  const bioBlocksRef = useRef([]);
  bioBlocksRef.current = [];
  const principlesColRef = useRef(null);
  const workflowRef = useRef(null);
  const statsRef = useRef(null);
  const parallaxLeftRef = useRef(null);
  const parallaxRightRef = useRef(null);

  const [activePrinciple, setActivePrinciple] = useState(null);
  const [hoveredPrinciple, setHoveredPrinciple] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null); // tech word highlight
  const [hoveredWorkflow, setHoveredWorkflow] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const displayPrinciple = hoveredPrinciple || activePrinciple;

  // Resolve which tech highlights to show
  const visibleHighlights = useMemo(() => {
    const p = displayPrinciple || hoveredWorkflow;
    if (!p) return activeHighlight ? new Set([activeHighlight]) : new Set();
    const principle = PRINCIPLES.find(pr => pr.id === p);
    if (principle?.connectsTechs?.length) return new Set(principle.connectsTechs);
    return new Set();
  }, [displayPrinciple, hoveredWorkflow, activeHighlight]);

  const addBioBlockRef = (el) => {
    if (el && !bioBlocksRef.current.includes(el)) bioBlocksRef.current.push(el);
  };

  const addHeadingWordRef = (el) => {
    if (el && !headingWordsRef.current.includes(el)) headingWordsRef.current.push(el);
  };

  // ─── GSAP Scroll Animations ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      });

      // 1. Eyebrow tag
      tl.fromTo(tagRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });

      // 2. Heading words — clip+translate stagger
      tl.fromTo(headingWordsRef.current,
        { opacity: 0, y: 42, rotateX: 48, clipPath: 'polygon(0 0,100% 0,100% 0%,0 0%)' },
        { opacity: 1, y: 0, rotateX: 0, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)',
          duration: 0.78, stagger: 0.07, ease: 'power3.out' },
        '-=0.35');

      // 3. Subtitle fade
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.45');

      // 4. Bio column blocks stagger clip-path from bottom
      if (bioBlocksRef.current.length) {
        tl.fromTo(bioBlocksRef.current,
          { opacity: 0, y: 24, clipPath: 'inset(20px 0 0 0 round 8px)' },
          { opacity: 1, y: 0, clipPath: 'inset(0px 0 0 0 round 0px)',
            duration: 0.6, stagger: 0.1, ease: 'power2.out' },
          '-=0.3');
      }

      // 5. Principles column
      if (principlesColRef.current) {
        tl.fromTo(principlesColRef.current.querySelectorAll(`.${styles.principleItem}`),
          { opacity: 0, x: 36, clipPath: 'inset(0 0 0 20px round 4px)' },
          { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0px round 0px)',
            duration: 0.6, stagger: 0.12, ease: 'power3.out' },
          '-=0.5');
      }

      // 6. Workflow row
      if (workflowRef.current) {
        gsap.fromTo(workflowRef.current.querySelectorAll(`.${styles.workflowStep}`),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: workflowRef.current, start: 'top 88%', once: true } });
      }

      // 7. Stats
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.querySelectorAll(`.${styles.statCell}`),
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: 'power2.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 88%', once: true } });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // ─── Pointer Parallax ────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let lX, lY, rX, rY;
    if (parallaxLeftRef.current) {
      lX = gsap.quickTo(parallaxLeftRef.current, 'x', { duration: 1.2, ease: 'power1.out' });
      lY = gsap.quickTo(parallaxLeftRef.current, 'y', { duration: 1.2, ease: 'power1.out' });
    }
    if (parallaxRightRef.current) {
      rX = gsap.quickTo(parallaxRightRef.current, 'x', { duration: 0.85, ease: 'power1.out' });
      rY = gsap.quickTo(parallaxRightRef.current, 'y', { duration: 0.85, ease: 'power1.out' });
    }

    const onMove = (e) => {
      const { width, height, left, top } = section.getBoundingClientRect();
      const rx = (e.clientX - left) / width - 0.5;
      const ry = (e.clientY - top) / height - 0.5;
      lX?.(rx * 2.5); lY?.(ry * 1.8);
      rX?.(rx * 5); rY?.(ry * 3.5);
    };
    const onLeave = () => { lX?.(0); lY?.(0); rX?.(0); rY?.(0); };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const headingWords = 'Engineering with Intent'.split(' ');

  // Decide if tech word should glow (from principle hover or direct hover)
  const isTechActive = useCallback((tech) => {
    return visibleHighlights.has(tech);
  }, [visibleHighlights]);

  const activePrincipleData = PRINCIPLES.find(p => p.id === displayPrinciple);

  return (
    <section id="about" ref={sectionRef} className={`${styles.about} aboutTheme`} data-section="about">
      <div className={styles.container}>

        {/* ── SECTION HEADER ─────────────────────────────────────────────── */}
        <div className={styles.sectionHeader}>
          <div ref={tagRef} className={styles.sectionTag}>
            <span className={styles.tagIndicator}>●</span>
            <span>(01) BIOGRAPHY &amp; PHILOSOPHY</span>
          </div>

          <h2 className={styles.sectionTitle}>
            {headingWords.map((word, idx) => {
              const isIntent = word.toLowerCase() === 'intent';
              return (
                <span key={idx} className={styles.wordWrapper}>
                  <span
                    ref={addHeadingWordRef}
                    className={`${styles.headingWord} ${isIntent ? styles.intentWord : ''}`}
                  >
                    {word}&nbsp;
                    {isIntent && (
                      <svg
                        className={styles.editorialUnderline}
                        viewBox="0 0 110 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M 2 5.5 C 30 2.5, 75 7, 108 4.5"
                          stroke="#D95A3A"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </span>
                </span>
              );
            })}
          </h2>

          <p ref={subtitleRef} className={styles.sectionSubtitle}>
            Bridging technical precision with intuitive human experiences through clean full-stack systems.
          </p>
        </div>

        {/* ── MAIN TWO-COLUMN GRID ────────────────────────────────────────── */}
        <div className={styles.editorialGrid}>

          {/* LEFT: Biography */}
          <div ref={parallaxLeftRef} className={styles.bioColumn}>

            {/* Human intro block */}
            <div ref={addBioBlockRef} className={styles.bioBlock}>
              <h3 className={styles.bioHeading}>
                Hi, I'm{' '}
                <span className={styles.nameMarkerWrap}>
                  Chinmay Wadhwa
                  <svg className={styles.nameUnderlineMarker} viewBox="0 0 210 8" fill="none" aria-hidden="true">
                    <path
                      d="M 2 5.5 C 55 2.5, 145 6.5, 208 4"
                      stroke="#D95A3A"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h3>
              <p className={styles.bioLead} data-cursor="hover" data-cursor-text="READ">
                I am a Full-Stack Developer specialising in resilient web applications using{' '}
                <TechSpan tech="React" onHover={setActiveHighlight} activeHighlight={visibleHighlights.has('React') ? 'React' : activeHighlight === 'React' ? 'React' : null} />,{' '}
                <TechSpan tech="Node.js" onHover={setActiveHighlight} activeHighlight={visibleHighlights.has('Node.js') ? 'Node.js' : activeHighlight === 'Node.js' ? 'Node.js' : null} />,{' '}
                <TechSpan tech="PostgreSQL" onHover={setActiveHighlight} activeHighlight={visibleHighlights.has('PostgreSQL') ? 'PostgreSQL' : activeHighlight === 'PostgreSQL' ? 'PostgreSQL' : null} />, and{' '}
                <TechSpan tech="MongoDB" onHover={setActiveHighlight} activeHighlight={visibleHighlights.has('MongoDB') ? 'MongoDB' : activeHighlight === 'MongoDB' ? 'MongoDB' : null} />.
              </p>
            </div>

            {/* Engineering approach */}
            <div ref={addBioBlockRef} className={styles.bioBlock}>
              <p className={styles.bioApproach} data-cursor="hover" data-cursor-text="READ">
                My engineering approach is grounded in{' '}
                <span className={`${styles.phraseHighlight} ${displayPrinciple === 'architecture' ? styles.phraseActive : ''}`}>
                  architectural clarity
                </span>
                . Whether designing relational data models in PostgreSQL, composing modular React component trees,
                or building secure RESTful APIs, I care deeply about{' '}
                <span className={styles.phraseHighlight}>maintainability</span>,{' '}
                <span className={styles.phraseHighlight}>performance</span>, and{' '}
                <span className={styles.phraseHighlight}>polished typography</span>.
              </p>
            </div>

            {/* Experience block */}
            <div ref={addBioBlockRef} className={styles.bioBlock}>
              <p className={`${styles.bioBody} ${displayPrinciple === 'problem' ? styles.bioBodyHighlighted : ''}`}
                data-cursor="hover" data-cursor-text="READ">
                As a Full-Stack Developer at Digimate Tech and previously at Kvon Technologies, I have
                engineered production web applications across the full stack—{' '}
                <span className={`${styles.phraseHighlight} ${displayPrinciple === 'problem' ? styles.phraseActive : ''}`}>
                  debugging and resolving
                </span>{' '}
                100+ software issues across full-stack lifecycles.
              </p>
            </div>

            {/* Education */}
            <div ref={addBioBlockRef} className={styles.bioBlock}>
              <div className={styles.educationRow}>
                <svg className={styles.eduIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M 1 6 L 8 2 L 15 6 L 8 10 Z" />
                  <path d="M 4 8.5 L 4 12 Q 8 14 12 12 L 12 8.5" />
                  <line x1="15" y1="6" x2="15" y2="10" />
                </svg>
                <div>
                  <span className={styles.eduLabel}>EDUCATION</span>
                  <div className={styles.eduTitle}>B.Tech · Electronics &amp; Communication</div>
                  <div className={styles.eduYear}>2021 — 2025</div>
                </div>
              </div>
            </div>

            {/* Resume CTA */}
            <div ref={addBioBlockRef} className={styles.bioBlock}>
              <ResumeButton />
            </div>
          </div>

          {/* RIGHT: Principles */}
          <div ref={parallaxRightRef} className={styles.principlesColumn}>
            <div className={styles.principlesInner} ref={principlesColRef}>
              <div className={styles.principlesEyebrow}>ENGINEERING PRINCIPLES</div>

              {PRINCIPLES.map((p) => {
                const isHovered = hoveredPrinciple === p.id;
                const isActive = activePrinciple === p.id;
                const isDisplay = displayPrinciple === p.id;
                const hasFocus = displayPrinciple !== null;

                // Default: neutral gray #77716C, Hover: #D95A3A, Selected: #F0B09D
                const iconColor = isActive ? '#F0B09D' : isHovered ? '#D95A3A' : '#77716C';

                return (
                  <div
                    key={p.id}
                    className={`${styles.principleItem} ${isDisplay ? styles.principleItemActive : ''}`}
                    style={{ opacity: hasFocus && !isDisplay ? 0.38 : 1 }}
                    onMouseEnter={() => setHoveredPrinciple(p.id)}
                    onMouseLeave={() => setHoveredPrinciple(null)}
                    onClick={() => setActivePrinciple(prev => prev === p.id ? null : p.id)}
                    data-cursor="hover"
                    data-cursor-text="EXPLORE"
                  >
                    {/* Active indicator line */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={styles.principleActiveLine}
                          layoutId="principleIndicator"
                          style={{ backgroundColor: '#D95A3A' }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                        />
                      )}
                    </AnimatePresence>

                    <div className={styles.principleHeader}>
                      {/* Icon */}
                      <div
                        className={styles.principleIconWrap}
                        style={{
                          backgroundColor: isActive ? 'rgba(122, 48, 35, 0.22)' : isHovered ? '#151413' : '#111110',
                          color: iconColor,
                          borderColor: isActive ? '#A83F2D' : isHovered ? 'rgba(217, 90, 58, 0.35)' : 'rgba(242, 239, 232, 0.08)',
                        }}
                      >
                        {p.icon === 'architecture' && <IconArchitecture active={isActive} />}
                        {p.icon === 'fullstack' && <IconFullStack active={isActive} />}
                        {p.icon === 'problem' && <IconProblem active={isActive} />}
                      </div>

                      <div className={styles.principleMeta}>
                        <span
                          className={styles.principleNum}
                          style={{ color: isActive ? '#F0B09D' : isHovered ? '#E8785F' : '#77716C' }}
                        >
                          {p.num}
                        </span>
                        <h4 className={styles.principleTitle}>{p.title}</h4>
                      </div>
                    </div>

                    <div className={styles.principleDesc}>
                      <motion.p
                        className={styles.principleText}
                        animate={{ height: isDisplay ? 'auto' : 'auto' }}
                      >
                        {isDisplay ? p.long : p.short}
                      </motion.p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── HOW I WORK row ─────────────────────────────────────────────── */}
        <div ref={workflowRef} className={styles.workflowRow}>
          <span className={styles.workflowLabel}>HOW I WORK</span>
          <div className={styles.workflowSteps}>
            {WORKFLOW_STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <motion.button
                  className={`${styles.workflowStep} ${hoveredWorkflow === step.principle ? styles.workflowStepActive : ''}`}
                  onMouseEnter={() => step.principle && setHoveredWorkflow(step.principle)}
                  onMouseLeave={() => setHoveredWorkflow(null)}
                  animate={{
                    color: hoveredWorkflow === step.principle && step.principle
                      ? '#E8785F'
                      : undefined,
                  }}
                  data-cursor={step.principle ? 'hover' : undefined}
                  data-cursor-text={step.principle ? 'EXPLORE' : undefined}
                >
                  {step.label}
                </motion.button>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <span className={styles.workflowArrow}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── STATISTICS ─────────────────────────────────────────────────── */}
        <div ref={statsRef} className={styles.statsBlock}>
          {STATS.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <div
                className={`${styles.statCell} ${hoveredStat === idx ? styles.statCellActive : ''}`}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                data-cursor="hover"
                data-cursor-text="VIEW"
              >
                <motion.div
                  className={styles.statAccentLine}
                  animate={{
                    width: hoveredStat === idx ? 52 : 36,
                    backgroundColor: hoveredStat === idx ? '#E8785F' : '#D95A3A',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
                <div className={styles.statNumber}>
                  <AnimatedCounter targetValue={stat.val} suffix={stat.suffix} duration={1.6} />
                </div>
                <span className={`${styles.statLabel} ${hoveredStat === idx ? styles.statLabelActive : ''}`}>
                  {stat.label}
                </span>
                <span className={styles.statDetail}>{stat.detail}</span>
              </div>
              {idx < STATS.length - 1 && (
                <div className={styles.statSeparator} />
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
