import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiFolder, FiArrowDown } from 'react-icons/fi';
import Magnetic from '../interactive/Magnetic';
import TechnologyConstellation from '../interactive/TechnologyConstellation';
import InteractiveArchitectureField from '../interactive/InteractiveArchitectureField';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Signature Editorial Hero Experience
 * Kinetic responsive typography, distance-based magnetic characters, velocity response,
 * multi-layer depth parallax, interactive constellation, and ScrollTrigger cinematic departure.
 */
const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const bioRef = useRef(null);
  const ctasRef = useRef(null);
  const scrollIndRef = useRef(null);
  const scrollFillRef = useRef(null);
  const bgGeomRef = useRef(null);
  const ambientRef = useRef(null);
  const badgeRef = useRef(null);
  const constellationRef = useRef(null);

  // References for all individual kinetic character spans
  const charRefs = useRef([]);
  charRefs.current = [];

  const addCharRef = (el) => {
    if (el && !charRefs.current.includes(el)) {
      charRefs.current.push(el);
    }
  };

  // Kinetic typography physics state (stored in ref for 0 re-render 120 FPS performance)
  const physicsRef = useRef({
    mouseX: -1000,
    mouseY: -1000,
    prevMouseX: -1000,
    prevMouseY: -1000,
    velX: 0,
    velY: 0,
    speed: 0,
    charData: [], // { el, origX, origY, currentX, currentY, targetX, targetY, currentRot, targetRot, currentScale, targetScale }
  });

  // Cycling editorial specialties
  const specialties = [
    'Full Stack Systems',
    'PostgreSQL & Database Architecture',
    'React & Modern Frontend',
    'Node.js & Scalable APIs',
  ];

  const [specIndex, setSpecIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = specialties[specIndex];
    let timer;

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timer = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, 70);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2400);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setSpecIndex((prev) => (prev + 1) % specialties.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, specIndex]);

  // Master Entry & Kinetic Physics Engine
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // 1. Initial measurement of character coordinates
    const measureChars = () => {
      physicsRef.current.charData = charRefs.current.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          currentX: 0,
          currentY: 0,
          targetX: 0,
          targetY: 0,
          currentRot: 0,
          targetRot: 0,
          currentScale: 1,
          targetScale: 1,
        };
      });
    };

    // 2. High-End Staggered GSAP Entry Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          measureChars();
        },
      });

      // Background shapes initialize
      tl.fromTo(
        ambientRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2 }
      );

      // Availability indicator appears
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -24, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75 },
        '-=0.8'
      );

      // Individual character reveal with staggered 3D tilt & blur
      tl.fromTo(
        charRefs.current,
        {
          opacity: 0,
          y: (i) => 90 + (i % 4) * 12,
          rotateX: 70,
          rotateZ: (i) => (i % 2 === 0 ? -4 : 4),
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          filter: 'blur(0px)',
          duration: 1.15,
          stagger: 0.038,
          ease: 'power3.out',
        },
        '-=0.5'
      );

      // Subtitle reveals
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 22, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.6'
      );

      // Bio text reveals
      tl.fromTo(
        bioRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      );

      // Technology constellation activates
      tl.fromTo(
        constellationRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9 },
        '-=0.4'
      );

      // CTA Buttons enter last
      tl.fromTo(
        ctasRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.75 },
        '-=0.3'
      );

      // Scroll Indicator appears
      tl.fromTo(
        scrollIndRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2'
      );

      // 3. ScrollTrigger Cinematic Departure Timeline into About
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          pin: false,
        },
      });

      scrollTl
        .to(headlineRef.current, { y: -80, scale: 0.92, opacity: 0.7, ease: 'none' }, 0)
        .to(subtitleRef.current, { y: -110, opacity: 0.5, ease: 'none' }, 0)
        .to(bioRef.current, { y: -90, opacity: 0.4, ease: 'none' }, 0)
        .to(constellationRef.current, { y: -50, opacity: 0.15, scale: 1.05, ease: 'none' }, 0)
        .to(ctasRef.current, { y: -60, opacity: 0, ease: 'none' }, 0)
        .to(scrollIndRef.current, { opacity: 0, ease: 'none' }, 0)
        .to(ambientRef.current, { y: 60, opacity: 0.3, ease: 'none' }, 0);
    }, hero);

    // 4. Multi-Layer Normalized Mouse Parallax & Kinetic Physics Loop
    let rafId;

    const handlePointerMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      const p = physicsRef.current;
      const prevX = p.mouseX;
      const prevY = p.mouseY;

      p.mouseX = e.clientX;
      p.mouseY = e.clientY;

      if (prevX !== -1000) {
        p.velX = e.clientX - prevX;
        p.velY = e.clientY - prevY;
        p.speed = Math.hypot(p.velX, p.velY);
      }

      // Layer Parallax (depth multipliers)
      if (!prefersReducedMotion && !isTouch) {
        // Background geometry: 0.02
        if (bgGeomRef.current) {
          gsap.to(bgGeomRef.current, {
            x: normX * 18,
            y: normY * 18,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        // Decorative ambient: 0.08
        if (ambientRef.current) {
          gsap.to(ambientRef.current, {
            x: normX * 42,
            y: normY * 42,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        // Subtitle: 0.015
        if (subtitleRef.current) {
          gsap.to(subtitleRef.current, {
            x: normX * 9,
            y: normY * 9,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        // Headline: 0.01
        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            x: normX * 6,
            y: normY * 6,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
    };

    // 5. Kinetic Character Magnetic Physics Tick (Distance-Based)
    const updateKineticChars = () => {
      const p = physicsRef.current;
      const radius = 135; // Radius of magnetic influence

      p.charData.forEach((char) => {
        if (p.mouseX === -1000 || prefersReducedMotion || isTouch) return;

        const dx = p.mouseX - char.centerX;
        const dy = p.mouseY - char.centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          // Distance influence curve (strong near center, falling smoothly to 0)
          const influence = Math.pow(1 - dist / radius, 1.6);
          const pushDistance = influence * 11; // 3-11px movement
          const angle = Math.atan2(dy, dx);

          // Moves slightly away/toward cursor
          char.targetX = -Math.cos(angle) * pushDistance + p.velX * 0.06 * influence;
          char.targetY = -Math.sin(angle) * pushDistance + p.velY * 0.06 * influence;
          char.targetRot = (dx / radius) * 4 * influence;
          char.targetScale = 1 + influence * 0.04;
        } else {
          char.targetX = 0;
          char.targetY = 0;
          char.targetRot = 0;
          char.targetScale = 1;
        }

        // Smooth damping interpolation
        char.currentX += (char.targetX - char.currentX) * 0.18;
        char.currentY += (char.targetY - char.currentY) * 0.18;
        char.currentRot += (char.targetRot - char.currentRot) * 0.18;
        char.currentScale += (char.targetScale - char.currentScale) * 0.18;

        // Apply physical transform directly without triggering React re-renders
        char.el.style.transform = `translate3d(${char.currentX}px, ${char.currentY}px, 0) rotate(${char.currentRot}deg) scale(${char.currentScale})`;
      });

      // Decay velocity
      p.velX *= 0.85;
      p.velY *= 0.85;
      p.speed *= 0.85;

      rafId = requestAnimationFrame(updateKineticChars);
    };

    // Window resize remeasures character coordinates
    const handleResize = () => {
      measureChars();
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(updateKineticChars);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const firstName = 'CHINMAY'.split('');
  const lastName = 'WADHWA'.split('');

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>
      {/* Interactive Technical Architecture Field (Dynamic Nodes, Routing Traces & Reactive Proximity) */}
      <InteractiveArchitectureField />

      {/* Subtle curved background lines */}
      <div ref={bgGeomRef} className={styles.bgGeometry} aria-hidden="true">
        <svg className={styles.geomSvg} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M -100,200 Q 400,100 900,450 T 1900,300"
            fill="none"
            stroke="#DED9CF"
            strokeWidth="0.8"
            strokeDasharray="4 6"
            opacity="0.35"
          />
          <path
            d="M 100,700 Q 600,400 1200,650 T 2000,500"
            fill="none"
            stroke="#E6E0F2"
            strokeWidth="0.9"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Ambient Soft Radial Shapes (No Neon) */}
      <div ref={ambientRef} className={styles.ambientShapes} aria-hidden="true">
        <div className={styles.shapeLavender} />
        <div className={styles.shapeSage} />
        <div className={styles.shapePeach} />
      </div>

      {/* Interactive Technology Constellation (SVG Network) */}
      <div ref={constellationRef} className={styles.constellationContainer}>
        <TechnologyConstellation mouseOffset={{ x: 0, y: 0 }} />
      </div>

      {/* Main Container */}
      <div className={styles.container}>
        {/* Availability Pill Indicator */}
        <div ref={badgeRef} className={styles.availabilityWrapper}>
          <div
            className={styles.availabilityBadge}
            data-cursor="hover"
            data-cursor-text="STATUS"
          >
            <span className={styles.statusDot}>
              <span className={styles.statusPulse} />
              <span className={styles.statusSolid} />
            </span>
            <span className={styles.availabilityText}>Available for Software Engineering Roles</span>
            <span className={styles.badgeSep}>•</span>
            <span className={styles.locationText}>Jaipur, India</span>
          </div>
        </div>

        {/* Signature Kinetic Responsive Typography */}
        <div ref={headlineRef} className={styles.headlineWrapper}>
          <h1 className={styles.headline}>
            {/* Line 1: CHINMAY */}
            <div className={styles.headlineRow}>
              {firstName.map((char, i) => (
                <span
                  key={`first-${i}`}
                  ref={addCharRef}
                  className={`${styles.char} ${styles.charBold}`}
                  data-char={char}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Line 2: WADHWA */}
            <div className={styles.headlineRow}>
              {lastName.map((char, i) => (
                <span
                  key={`last-${i}`}
                  ref={addCharRef}
                  className={`${styles.char} ${styles.charLight}`}
                  data-char={char}
                >
                  {char}
                </span>
              ))}
            </div>
          </h1>
        </div>

        {/* Dynamic Editorial Specialty Subtitle */}
        <div ref={subtitleRef} className={styles.subtitleBlock}>
          <p className={styles.roleSubline}>
            <span className={styles.rolePrefix}>Engineering</span>
            <span className={styles.roleDynamic}>{displayText}</span>
            <span className={styles.typingCursor} />
          </p>
        </div>

        {/* Editorial Bio Description */}
        <p ref={bioRef} className={styles.description}>
          Full-Stack Developer crafting resilient web architectures, scalable backend services, and high-fidelity interactive media platforms. 
          Recently engineered enterprise platforms for <strong className={styles.highlightText}>Digimate Tech Digital Solutions</strong>, business automation for <strong className={styles.highlightText}>Dezoryn Technologies</strong>, collaborative learning ecosystems for <strong className={styles.highlightText}>SkillLoop</strong>, and media platforms for <strong className={styles.highlightText}>VEXO Music</strong>.
        </p>

        {/* Magnetic Hero CTAs with Independent Arrow Movement */}
        <div ref={ctasRef} className={styles.actionGroup}>
          <Magnetic
            strength={0.34}
            radius={110}
            maxOffset={14}
            arrowSelector=".magnetic-arrow"
          >
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/contact')}
              data-cursor="cta"
              data-cursor-text="LET'S TALK"
            >
              <span>Initiate Contact</span>
              <FiArrowRight size={17} className="magnetic-arrow" />
            </button>
          </Magnetic>

          <Magnetic
            strength={0.3}
            radius={100}
            maxOffset={12}
            arrowSelector=".magnetic-arrow"
          >
            <button
              className={styles.secondaryBtn}
              onClick={() => navigate('/projects')}
              data-cursor="project"
              data-cursor-text="VIEW"
            >
              <FiFolder size={17} />
              <span>Explore Works</span>
              <FiArrowRight size={15} className="magnetic-arrow" style={{ opacity: 0.6 }} />
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Editorial Scroll Indicator with Dynamic Progress */}
      <div
        ref={scrollIndRef}
        className={styles.scrollIndicator}
        onClick={scrollToAbout}
        data-cursor="link"
        data-cursor-text="SCROLL"
        role="button"
        tabIndex={0}
        aria-label="Scroll down to About section"
      >
        <span className={styles.scrollLabel}>Explore</span>
        <div className={styles.scrollTrack}>
          <div ref={scrollFillRef} className={styles.scrollBar} />
        </div>
        <FiArrowDown size={14} className={styles.scrollArrow} />
      </div>
    </section>
  );
};

export default Hero;
