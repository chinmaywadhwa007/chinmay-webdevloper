import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EditorialCategoryNav from './skills/EditorialCategoryNav';
import TechWorldMap from './skills/TechWorldMap';
import ProjectConnectionRibbon from './skills/ProjectConnectionRibbon';
import InteractiveModeLab from './skills/InteractiveModeLab';
import CentralMotionObject from './skills/CentralMotionObject';
import FloatingTerminal from './skills/FloatingTerminal';
import styles from './Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Editorial Technical Playground
 * An interactive architectural map and frontend experiment lab.
 * Pure warm ivory aesthetic, zero giant rectangular cards, floating nodes with
 * subtle pastel indicators, thin SVG curves, proximity deflection, and real project proof.
 */
const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTech, setHoveredTech] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const headingWordsRef = useRef([]);
  headingWordsRef.current = [];
  const subtitleRef = useRef(null);
  const highlighterRef = useRef(null);
  const techMarkerRef = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);

  const addHeadingWordRef = (el) => {
    if (el && !headingWordsRef.current.includes(el)) {
      headingWordsRef.current.push(el);
    }
  };

  const headingWords = 'Skills & Capabilities'.split(' ');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stage 1 Entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      });

      // 1. Eyebrow Tag entrance
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // 2. Word-by-word 3D Perspective Reveal
      tl.fromTo(
        headingWordsRef.current,
        {
          opacity: 0,
          y: 35,
          rotateX: 45,
          clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          onComplete: () => {
            headingWordsRef.current.forEach((el) => {
              if (el) el.style.clipPath = 'none';
            });
          },
        },
        '-=0.25'
      );

      // 2b. Editorial Handwritten Highlighter Draw behind "Capabilities" (Left -> Right)
      if (highlighterRef.current) {
        tl.fromTo(
          highlighterRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.58,
            ease: 'power2.out',
          },
          '+=0.2'
        );
      }

      // 3. Supporting Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      );

      // 4. Constellation Stage Assembly
      if (stage2Ref.current) {
        tl.fromTo(
          stage2Ref.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.3'
        );
      }

      // 4b. Editorial Underline Marker Draw beneath "TECHNICAL"
      if (techMarkerRef.current) {
        ScrollTrigger.create({
          trigger: techMarkerRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              techMarkerRef.current,
              { clipPath: 'inset(0 100% 0 0)' },
              {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.55,
                delay: 0.2,
                ease: 'power2.out',
              }
            );
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className={`${styles.skills} skillsTheme`} data-section="skills">
      <div className={styles.container}>
        {/* ==============================================================
            STAGE 1: Editorial Introduction
            ============================================================== */}
        <div className={styles.sectionHeader}>
          <div ref={tagRef} className={styles.sectionTag}>
            <span>(04) TECHNICAL PLAYGROUND</span>
          </div>

          <h2 className={styles.title}>
            {headingWords.map((word, idx) => {
              const isHighlight = word.toLowerCase().includes('capabilities');
              return (
                <span
                  key={idx}
                  className={`${styles.wordWrapper} ${isHighlight ? styles.highlighterWrapper : ''}`}
                >
                  <span ref={addHeadingWordRef} className={styles.headingWord}>
                    {isHighlight ? (
                      <span className={styles.highlighterMarker}>
                        <span className={styles.wordText}>{word}</span>
                        <svg
                          ref={highlighterRef}
                          className={styles.highlighterSvg}
                          viewBox="0 0 300 28"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M 4 4 C 45 2.5, 95 5, 150 3 C 205 1.5, 255 3.5, 293 2.5 C 296 3.5, 298 7, 297 14 C 296 21, 298 25, 294 26 C 250 27, 195 25.5, 145 26.5 C 95 27.5, 45 26, 2 26.5 C 0.5 22, 1 15, 2 8 C 2.5 5, 3.5 4.5, 4 4 Z"
                            fill="rgba(184, 169, 201, 0.52)"
                          />
                        </svg>
                      </span>
                    ) : (
                      word
                    )}
                    {idx < headingWords.length - 1 ? '\u00A0' : ''}
                  </span>
                </span>
              );
            })}
          </h2>

          <p ref={subtitleRef} className={styles.subtitle}>
            A curated technical stack backed by real projects, production workflows,
            interactive experiments, and engineering systems.
          </p>
        </div>

        {/* Editorial Category Navigation */}
        <EditorialCategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* ==============================================================
            STAGE 2: Interactive Technology Constellation (Core System)
            ============================================================== */}
        <div ref={stage2Ref} className={styles.stageTwoWrapper}>
          <div className={styles.stageLabelRow}>
            <span className={styles.stageIndex}>02</span>
            <span className={styles.stageTitle}>TECHNOLOGY CONSTELLATION &amp; RELATIONSHIPS</span>
          </div>

          {/* Technical World Map headline */}
          <div className={styles.worldMapIntro}>
            <h3 className={styles.worldMapTitle}>
              <span className={styles.techUnderlineWrap}>
                <span className={styles.techWord}>TECHNICAL</span>
                <svg
                  ref={techMarkerRef}
                  className={styles.techUnderlineSvg}
                  viewBox="0 0 160 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 1 2 C 35 1.2, 75 2.8, 115 1.8 C 135 1.4, 150 2.2, 158 1.5 C 159 3, 159 5.5, 157 7 C 125 7.8, 90 6.8, 55 7.6 C 30 8.2, 12 7.2, 1 7 C 0.5 5.5, 0.5 3.5, 1 2 Z"
                    fill="rgba(184, 169, 201, 0.32)"
                  />
                </svg>
              </span>{' '}
              <span>WORLD</span>
            </h3>
            <p className={styles.worldMapSubtitle}>
              An interactive map of the technologies, systems and workflows I use to build production experiences.
            </p>
          </div>

          {/* Interactive Technical World Map */}
          <TechWorldMap
            activeCategory={activeCategory}
            hoveredTech={hoveredTech}
            setHoveredTech={setHoveredTech}
            selectedTech={selectedTech}
            onSelectTech={setSelectedTech}
          />

          {/* Production Evidence Bridge */}
          <ProjectConnectionRibbon
            hoveredTech={hoveredTech}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
          />
        </div>

        {/* ==============================================================
            STAGE 3: Open Interactive Experiments & Living Systems
            ============================================================== */}
        <div ref={stage3Ref} className={styles.stageThreeWrapper}>
          <div className={styles.stageLabelRow}>
            <span className={styles.stageIndex}>03</span>
            <span className={styles.stageTitle}>LIVING ARCHITECTURAL FLOWS</span>
          </div>

          {/* Living architectural flow simulations (No giant cards) */}
          <InteractiveModeLab
            activeCategory={activeCategory}
            hoveredTech={hoveredTech}
          />

          {/* Central Interactive Motion Object (The Tactile Physics Demonstrator) */}
          <CentralMotionObject />

          {/* Floating Monospace Terminal */}
          <FloatingTerminal />
        </div>
      </div>
    </section>
  );
};

export default Skills;
