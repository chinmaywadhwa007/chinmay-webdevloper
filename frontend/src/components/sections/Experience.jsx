import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { milestones, careerCounters } from './experience/experienceData';
import ExperienceCard from './experience/ExperienceCard';
import EducationCard from './experience/EducationCard';
import CapabilityEvolution from './experience/CapabilityEvolution';
import timelineSound from './experience/timelineSound';
import styles from './Experience.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Interactive Career Timeline — Experience & Journey
 * Visual Identity: Ice Blue / Frost on Deep Charcoal (#0B0D0D)
 *
 * Movement & Sound Enhancements:
 * - Ultra-responsive GSAP ScrollTrigger timeline progression with exact milestone geometry
 * - Luminous frosted ice tracer bead gliding down the active rail in lockstep with scroll
 * - Ascending dual-layer tactile mechanical sound (synthesized ratchet tick + trimmed revolver spin sample)
 * - Distinct pitch per milestone: 680Hz (Foundation) -> 880Hz (Internship) -> 1180Hz (Current) -> 1480Hz (Journey Continues)
 * - Exact node centering with floating frosted pill labels (no collision with SVG track)
 * - Silky card lift & border illumination on viewport entry
 */
const Experience = () => {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const counterRowRef = useRef(null);
  const timelineRef = useRef(null);
  const svgLineRef = useRef(null);
  const svgPathRef = useRef(null);
  const tracerDotRef = useRef(null);
  const tracerGlowRef = useRef(null);

  const nodeRefs = useRef([]);
  const outerRingRefs = useRef([]);
  const innerDotRefs = useRef([]);
  const cardRefs = useRef([]);
  const milestoneRowRefs = useRef([]);
  const chapterLabelRefs = useRef([]);

  // Directional scroll progress tracking refs
  const previousProgressRef = useRef(0);
  const lastTriggeredThresholdRef = useRef(-1);

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [isJourneyReached, setIsJourneyReached] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => timelineSound.isSoundEnabled());

  // Technology trace interaction state
  const [hoveredTech, setHoveredTech] = useState(null);

  // Experience inspector modal state
  const [inspectedMilestone, setInspectedMilestone] = useState(null);

  const orderedMilestones = milestones; // Chronological: 2021 -> 2025 -> 2026

  // ──────────────────────────────────────────────
  // Sound subscription listener & gesture unlock
  // ──────────────────────────────────────────────
  useEffect(() => {
    const handleGesture = () => {
      timelineSound.unlock();
    };
    window.addEventListener('pointerdown', handleGesture, { passive: true, once: true });
    window.addEventListener('click', handleGesture, { passive: true, once: true });
    window.addEventListener('keydown', handleGesture, { passive: true, once: true });
    window.addEventListener('touchstart', handleGesture, { passive: true, once: true });

    const unsubscribe = timelineSound.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      unsubscribe();
    };
  }, []);

  const toggleSound = () => {
    const nextState = timelineSound.toggleSound();
    setSoundEnabled(nextState);
  };

  // ──────────────────────────────────────────────
  // Close inspector on Escape key
  // ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setInspectedMilestone(null);
      }
    };
    if (inspectedMilestone) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [inspectedMilestone]);

  // ──────────────────────────────────────────────
  // Smooth scroll to milestone on node click
  // ──────────────────────────────────────────────
  const scrollToMilestone = useCallback((index) => {
    timelineSound.playSound(index);

    const row = milestoneRowRefs.current[index];
    if (!row) return;
    const offset = row.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }, []);

  // ──────────────────────────────────────────────
  // GSAP Scroll Animations & Progressive Timeline
  // ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Immediate static presentation for reduced-motion users
        [eyebrowRef, titleRef, subtitleRef, counterRowRef].forEach((r) => {
          if (r.current) gsap.set(r.current, { opacity: 1 });
        });
        if (svgPathRef.current) {
          gsap.set(svgPathRef.current, { strokeDashoffset: 0 });
        }
        if (tracerDotRef.current) {
          gsap.set(tracerDotRef.current, { attr: { cy: 520 }, opacity: 1 });
        }
        outerRingRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, scale: 1 });
        });
        innerDotRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, scale: 1 });
        });
        return;
      }

      // ── 1. Section Header Staggered Entrance ──
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      });

      if (eyebrowRef.current) {
        headerTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(`.${styles.titleWord}`);
        headerTl.fromTo(
          words,
          {
            opacity: 0,
            y: 28,
            clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }

      if (subtitleRef.current) {
        headerTl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.35'
        );
      }

      if (counterRowRef.current) {
        headerTl.fromTo(
          counterRowRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.3'
        );
      }

      // ── 2. Chapter Label Entrance ──
      chapterLabelRefs.current.forEach((label) => {
        if (!label) return;
        gsap.fromTo(
          label,
          { opacity: 0, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: label,
              start: 'top 84%',
              once: true,
            },
          }
        );
      });

      // ── 3. Progressive Line & Dynamic Tracer Movement ──
      if (timelineRef.current && svgPathRef.current) {
        const pathLength = 600;
        gsap.set(svgPathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        // Exact physical node alignment thresholds:
        // Node 0 (2021 Foundation): 14% -> y=84px
        // Node 1 (2025 Internship): 50% -> y=300px
        // Node 2 (2026 Production): 86% -> y=516px
        // Exit (Journey Continues): 95% -> y=570px
        const THRESHOLDS = [0.14, 0.50, 0.86, 0.95];

        const triggerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true, // Instantaneous, zero-delay physical attachment to scroll
            onUpdate: (self) => {
              const currentProgress = self.progress;
              const prevProgress = previousProgressRef.current;
              const scrollingDown = self.direction > 0;
              const scrollingUp = self.direction < 0;

              // Update luminous frosted tracer bead position in exact sync (no SVG filter overhead)
              const currentY = currentProgress * pathLength;
              if (tracerDotRef.current) {
                tracerDotRef.current.setAttribute('cy', currentY.toFixed(1));
                tracerDotRef.current.style.opacity = currentProgress > 0.01 ? '1' : '0';
              }
              if (tracerGlowRef.current) {
                tracerGlowRef.current.setAttribute('cy', currentY.toFixed(1));
                tracerGlowRef.current.style.opacity = currentProgress > 0.01 ? '1' : '0';
              }

              if (scrollingDown) {
                // Crossing thresholds downwards
                for (let i = 0; i < THRESHOLDS.length; i++) {
                  const t = THRESHOLDS[i];
                  if (prevProgress < t && currentProgress >= t) {
                    if (lastTriggeredThresholdRef.current !== i) {
                      lastTriggeredThresholdRef.current = i;
                      timelineSound.playSound(i); // Trigger distinct ascending milestone tick

                      if (i < 3) {
                        setActiveMilestoneIndex(i);
                        setActiveStep(i + 1);

                        const ringEl = outerRingRefs.current[i];
                        const dotEl = innerDotRefs.current[i];
                        if (ringEl) {
                          gsap.fromTo(
                            ringEl,
                            { scale: 0.7, opacity: 0.3 },
                            {
                              scale: i === 2 ? 1.15 : 1.05,
                              opacity: 1,
                              duration: 0.42,
                              ease: 'back.out(2)',
                              overwrite: 'auto',
                            }
                          );
                        }
                        if (dotEl) {
                          gsap.fromTo(
                            dotEl,
                            { scale: 0, opacity: 0 },
                            {
                              scale: 1,
                              opacity: 1,
                              duration: 0.35,
                              ease: 'back.out(2)',
                              overwrite: 'auto',
                            }
                          );
                        }
                      } else {
                        setIsJourneyReached(true);
                      }
                    }
                    break;
                  }
                }
              } else if (scrollingUp) {
                // Crossing thresholds upwards (reverse)
                for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
                  const t = THRESHOLDS[i];
                  if (prevProgress >= t && currentProgress < t) {
                    if (lastTriggeredThresholdRef.current === i) {
                      lastTriggeredThresholdRef.current = i - 1;
                      const soundIdx = i > 0 ? i - 1 : 0;
                      timelineSound.playSound(soundIdx);

                      if (i === 3) {
                        setIsJourneyReached(false);
                        setActiveMilestoneIndex(2);
                        setActiveStep(3);
                      } else {
                        const prevIdx = i > 0 ? i - 1 : 0;
                        setActiveMilestoneIndex(prevIdx);
                        setActiveStep(prevIdx + 1);

                        const ringEl = outerRingRefs.current[i];
                        const dotEl = innerDotRefs.current[i];
                        if (ringEl) {
                          gsap.to(ringEl, { scale: 0.7, opacity: 0, duration: 0.25, overwrite: 'auto' });
                        }
                        if (dotEl) {
                          gsap.to(dotEl, { scale: 0, opacity: 0, duration: 0.2, overwrite: 'auto' });
                        }
                      }
                    }
                    break;
                  }
                }
              }

              previousProgressRef.current = currentProgress;
            },
          },
        });

        // Progressive SVG line stroke scrubbed from 0 to 100% in Ice Blue (#9CC9D4)
        triggerTimeline.fromTo(
          svgPathRef.current,
          { strokeDashoffset: pathLength },
          { strokeDashoffset: 0, ease: 'none' }
        );
      }

      // ── 4. Sequenced Card Reveals with Viewport Active Synchronization ──
      milestoneRowRefs.current.forEach((rowEl, rowIdx) => {
        if (!rowEl) return;

        const cardInner = rowEl.querySelector('[class*="cardInner"]');
        const roleTitle = rowEl.querySelector('[class*="roleTitle"]') || rowEl.querySelector('[class*="degreeTitle"]');
        const company = rowEl.querySelector('[class*="companyName"]') || rowEl.querySelector('[class*="institutionName"]');
        const dateBadge = rowEl.querySelector('[class*="dateBadge"]');
        const summary = rowEl.querySelector('[class*="summaryText"]');
        const bullets = rowEl.querySelectorAll('[class*="contributionItem"]');
        const stack = rowEl.querySelector('[class*="stackEvolutionRow"]');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: rowEl,
            start: 'top 82%',
            once: true,
          },
        });

        // Card border reveals
        if (cardInner) {
          cardTl.fromTo(
            cardInner,
            { opacity: 0, y: 26, borderColor: 'transparent' },
            { opacity: 1, y: 0, borderColor: 'var(--border)', duration: 0.55, ease: 'power2.out' }
          );
        }

        // Role title appears
        if (roleTitle) {
          cardTl.fromTo(
            roleTitle,
            {
              opacity: 0,
              y: 18,
              clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
            },
            {
              opacity: 1,
              y: 0,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 0.52,
              ease: 'power3.out',
            },
            '-=0.35'
          );
        }

        // Company appears
        if (company) {
          cardTl.fromTo(
            company,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
            '-=0.3'
          );
        }

        // Date badge appears
        if (dateBadge) {
          cardTl.fromTo(
            dateBadge,
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.6)' },
            '-=0.28'
          );
        }

        // Summary reveals
        if (summary) {
          cardTl.fromTo(
            summary,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
            '-=0.25'
          );
        }

        // Contribution bullets stagger in
        if (bullets && bullets.length > 0) {
          cardTl.fromTo(
            bullets,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.32,
              stagger: 0.06,
              ease: 'power2.out',
            },
            '-=0.2'
          );
        }

        // Stack appears last
        if (stack) {
          cardTl.fromTo(
            stack,
            { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            {
              opacity: 1,
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.48,
              ease: 'power2.out',
            },
            '-=0.15'
          );
        }
      });
    }, section);

    // Refresh ScrollTrigger positions after page assets settle
    const refreshTimer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      ctx.revert();
    };
  }, []);

  // Helper registration callbacks
  const addNodeRef = (el, idx) => {
    nodeRefs.current[idx] = el;
  };
  const addRingRef = (el, idx) => {
    outerRingRefs.current[idx] = el;
  };
  const addDotRef = (el, idx) => {
    innerDotRefs.current[idx] = el;
  };
  const addCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };
  const addChapterRef = (el) => {
    if (el && !chapterLabelRefs.current.includes(el)) chapterLabelRefs.current.push(el);
  };

  return (
    <section
      id="experience"
      data-section="experience"
      ref={sectionRef}
      className={`${styles.experience} experienceTheme`}
    >
      <div className={styles.container}>

        {/* ─── Section Header ─── */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerTopRow}>
            <div ref={eyebrowRef} className={styles.eyebrow}>
              <span className={styles.eyebrowNumber}>05</span>
              <span className={styles.eyebrowSep}>—</span>
              <span>EXPERIENCE / JOURNEY</span>
            </div>

            {/* Subtle Sound Toggle Control */}
            <button
              type="button"
              onClick={toggleSound}
              className={`${styles.soundToggle} ${soundEnabled ? styles.soundToggleOn : styles.soundToggleOff}`}
              aria-label={`Timeline sound ${soundEnabled ? 'on' : 'off'}`}
              data-cursor="hover"
              data-cursor-text="SOUND"
              title={soundEnabled ? 'Subtle milestone sound: Enabled' : 'Subtle milestone sound: Muted'}
            >
              <span className={styles.soundIndicatorDot} />
              <span>{soundEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </div>

          <h2
            ref={titleRef}
            className={styles.sectionTitle}
            aria-label="Experience that compounds."
          >
            <span className={`${styles.titleWord} ${styles.experienceWord}`}>Experience</span>
            <span className={styles.titleWord}>that</span>
            <span className={`${styles.titleWord} ${styles.compoundWrapper}`}>
              compounds.
              <svg
                className={styles.iceUnderlineSvg}
                viewBox="0 0 160 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 2 5 Q 80 1 158 5"
                  stroke="#9CC9D4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p ref={subtitleRef} className={styles.sectionSubtitle}>
            A progression from <span className={styles.subKeyword}>learning</span> →{' '}
            <span className={styles.subKeyword}>building</span> →{' '}
            <span className={styles.subKeyword}>shipping</span> →{' '}
            <span className={styles.subKeyword}>production systems</span>.
          </p>

          {/* Career Counter — editorial summary */}
          <div ref={counterRowRef} className={styles.careerCounterRow}>
            {careerCounters.map((item, idx) => (
              <div key={idx} className={styles.counterItem}>
                <span className={`${styles.counterNum} ${styles[`counterAccent_${item.accent}`]}`}>
                  {item.count}
                </span>
                <span className={styles.counterLabel}>{item.label}</span>
                {idx < careerCounters.length - 1 && (
                  <span className={styles.counterSep}>·</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Capability Evolution Secondary Progression Layer ─── */}
        <CapabilityEvolution
          milestones={orderedMilestones}
          activeMilestoneIndex={activeMilestoneIndex}
        />

        {/* ─── Timeline Layout ─── */}
        <div className={styles.timelineLayout} ref={timelineRef}>

          {/* Left Column: Progressive SVG Line + Nodes + Step Counter */}
          <div className={styles.timelineLeft}>

            {/* Vertical Progress Step Counter */}
            <div className={styles.progressCounter}>
              {orderedMilestones.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.progressStep} ${activeStep === idx + 1 ? styles.progressStepActive : ''}`}
                  onClick={() => scrollToMilestone(idx)}
                  aria-label={`Jump to ${orderedMilestones[idx].company}`}
                  data-cursor="hover"
                  data-cursor-text="PROGRESS"
                >
                  {String(idx + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            {/* SVG Progressive Line Track with Frosted Motion Lead Tracer */}
            <div className={styles.svgTrackWrapper}>
              <svg
                ref={svgLineRef}
                className={styles.svgLine}
                viewBox="0 0 12 600"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Subtle Inactive Neutral/Deep-Ice Background Track */}
                <line
                  x1="6" y1="0" x2="6" y2="600"
                  stroke="rgba(156, 201, 212, 0.16)"
                  strokeWidth="2"
                />

                {/* Progressive Scroll-driven Active Line: Primary Ice (#9CC9D4) */}
                <line
                  ref={svgPathRef}
                  x1="6" y1="0" x2="6" y2="600"
                  stroke="#9CC9D4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Active Frosted Motion Tracer: Outer Glow Halo + Core Bead (Zero SVG filter GPU penalty) */}
                <circle
                  ref={tracerGlowRef}
                  cx="6"
                  cy="0"
                  r="7.5"
                  fill="rgba(156, 201, 212, 0.28)"
                  className={styles.tracerGlow}
                />
                <circle
                  ref={tracerDotRef}
                  cx="6"
                  cy="0"
                  r="3.5"
                  fill="#E4F0EE"
                  className={styles.tracerCore}
                />
              </svg>

              {/* Milestone Markers positioned with exact geometric centering */}
              {orderedMilestones.map((m, idx) => {
                const posPercent = idx === 0 ? 14 : idx === 1 ? 50 : 86;
                const isNodeActive = activeMilestoneIndex >= idx;

                return (
                  <div
                    key={m.id}
                    className={`${styles.nodeWrapper} ${isNodeActive ? styles.nodeActive : ''}`}
                    style={{ top: `${posPercent}%` }}
                  >
                    {/* Chapter Year Label — Frosted dark pill badge floating neatly above circle */}
                    <div
                      ref={addChapterRef}
                      className={styles.chapterMarker}
                    >
                      <span className={styles.chapterYear}>{m.year}</span>
                      <span className={styles.chapterTag}>{m.chapterTag}</span>
                    </div>

                    {/* Interactive Milestone Marker Button */}
                    <button
                      ref={(el) => addNodeRef(el, idx)}
                      className={`
                        ${styles.timelineNode}
                        ${styles[`node_${m.accent}`]}
                        ${activeMilestoneIndex === idx ? styles.nodeCurrentActive : ''}
                      `}
                      onClick={() => scrollToMilestone(idx)}
                      aria-label={`Jump to ${m.company} (${m.year})`}
                      data-cursor="hover"
                      data-cursor-text="PROGRESS"
                      title={`${m.year} · ${m.isCurrent ? 'CURRENT' : m.chapterTag}`}
                    >
                      {/* Active Outer Ring */}
                      <span
                        ref={(el) => addRingRef(el, idx)}
                        className={styles.markerOuterRing}
                      />

                      {/* Inactive Hollow Base Circle */}
                      <span className={styles.markerBaseCircle} />

                      {/* Active Inner Filled Dot */}
                      <span
                        ref={(el) => addDotRef(el, idx)}
                        className={styles.markerInnerDot}
                      />

                      {/* Micro-interaction Hover Label */}
                      <span className={styles.markerHoverPill}>
                        {m.year} · {m.isCurrent ? 'CURRENT' : m.chapterTag}
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* "Journey Continues" Visual Extender below final marker */}
              <div className={`${styles.journeyExtender} ${isJourneyReached ? styles.journeyExtenderActive : ''}`}>
                <div className={styles.extenderLine} />
                <div className={styles.nextChapterBadge}>
                  <span className={styles.nextChapterArrow}>↓</span>
                  <span className={styles.nextChapterText}>NEXT CHAPTER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Milestone Experience Cards */}
          <div className={styles.timelineRight}>
            {orderedMilestones.map((m, idx) => {
              const isActive = activeMilestoneIndex === idx;

              return (
                <div
                  key={m.id}
                  ref={(el) => (milestoneRowRefs.current[idx] = el)}
                  data-milestone-index={idx}
                  className={styles.milestoneRow}
                >
                  {m.type === 'education' ? (
                    <EducationCard
                      milestone={m}
                      isActive={isActive}
                      cardRef={(el) => addCardRef(el, idx)}
                      onInspect={(item) => setInspectedMilestone(item)}
                      hoveredTech={hoveredTech}
                      onHoverTech={setHoveredTech}
                    />
                  ) : (
                    <ExperienceCard
                      milestone={m}
                      isActive={isActive}
                      cardRef={(el) => addCardRef(el, idx)}
                      onInspect={(item) => setInspectedMilestone(item)}
                      hoveredTech={hoveredTech}
                      onHoverTech={setHoveredTech}
                    />
                  )}
                </div>
              );
            })}

            {/* "JOURNEY CONTINUES" Section Exit Connector — Ice Palette, Not inside a card */}
            <div
              className={`${styles.sectionConnector} ${isJourneyReached ? styles.sectionConnectorActive : ''}`}
              data-cursor="hover"
              data-cursor-text="PROGRESS"
            >
              <span className={styles.connectorLine} />
              <div className={styles.connectorContent}>
                <span className={styles.connectorDot}>●</span>
                <span className={styles.connectorLabel}>JOURNEY CONTINUES</span>
                <span className={styles.connectorSublabel}>· Actively building &amp; delivering</span>
              </div>
              <span className={styles.connectorLine} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Experience Inspector Modal / Panel ─── */}
      {inspectedMilestone && (
        <div
          className={styles.inspectorOverlay}
          onClick={() => setInspectedMilestone(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspector-title"
        >
          <div
            className={styles.inspectorModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Chapter Tag, Current Badge, and Close Button */}
            <div className={styles.inspectorHeader}>
              <div className={styles.inspectorHeaderLeft}>
                <span className={styles.inspectorTag}>
                  {inspectedMilestone.step} — {inspectedMilestone.chapterTag}
                </span>
                {inspectedMilestone.isCurrent && (
                  <span className={styles.inspectorCurrentBadge}>
                    <span className={styles.inspectorPulseDot} /> CURRENT
                  </span>
                )}
              </div>
              <button
                type="button"
                className={styles.inspectorCloseBtn}
                onClick={() => setInspectedMilestone(null)}
                aria-label="Close inspector"
                data-cursor="hover"
                data-cursor-text="CLOSE"
              >
                ✕
              </button>
            </div>

            {/* Role, Company, Period */}
            <div className={styles.inspectorIdentity}>
              <h3 id="inspector-title" className={styles.inspectorRole}>
                {inspectedMilestone.role}
              </h3>
              <div className={styles.inspectorCompanyRow}>
                <span className={styles.inspectorCompany}>{inspectedMilestone.company}</span>
                <span className={styles.inspectorDot}>·</span>
                <span className={styles.inspectorPeriod}>{inspectedMilestone.period}</span>
                {inspectedMilestone.durationContext && (
                  <span className={styles.inspectorDuration}>({inspectedMilestone.durationContext})</span>
                )}
              </div>
            </div>

            {/* WHAT I WORKED ON */}
            <div className={styles.inspectorSection}>
              <h4 className={styles.inspectorSectionTitle}>WHAT I WORKED ON</h4>
              <p className={styles.inspectorSummary}>{inspectedMilestone.summary}</p>
            </div>

            {/* KEY CONTRIBUTIONS */}
            <div className={styles.inspectorSection}>
              <h4 className={styles.inspectorSectionTitle}>KEY CONTRIBUTIONS</h4>
              <ul className={styles.inspectorContributionsList}>
                {inspectedMilestone.contributions.map((item, idx) => (
                  <li key={idx} className={styles.inspectorContributionItem}>
                    <span className={styles.inspectorCheckIcon}>✓</span>
                    <span className={styles.inspectorContributionText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TECH STACK with Interactive Trace */}
            <div className={styles.inspectorSection}>
              <h4 className={styles.inspectorSectionTitle}>TECH STACK</h4>
              <div className={styles.inspectorStackChips}>
                {inspectedMilestone.stack.map((tech, idx) => {
                  const isHovered = hoveredTech === tech;

                  return (
                    <span
                      key={idx}
                      className={`${styles.inspectorChip} ${isHovered ? styles.inspectorChipActive : ''}`}
                      onMouseEnter={() => setHoveredTech(tech)}
                      onMouseLeave={() => setHoveredTech(null)}
                      data-cursor="hover"
                      data-cursor-text="TRACE"
                      title={`Trace ${tech} across timeline`}
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;
