import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CapabilityEvolution.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Skill relationship map ──────────────────────────────────────
const SKILL_RELATIONS = {
  Fundamentals:      { label: 'FORMED THE BASE FOR', desc: 'All subsequent engineering and development work.' },
  Electronics:       { label: 'APPLIED IN', desc: 'Circuit analysis and signal processing coursework.' },
  Programming:       { label: 'APPLIED TO', desc: 'Data structures, web development and algorithm design.' },
  'Data Structures': { label: 'APPLIED IN', desc: 'API design, database indexing and query optimisation.' },
  Backend:           { label: 'BUILT AT', desc: 'Kvon Technologies — production API services.' },
  APIs:              { label: 'BUILT FOR', desc: 'Enterprise client web applications and data pipelines.' },
  SQL:               { label: 'USED IN', desc: 'PostgreSQL query optimisation and index tuning.' },
  Authentication:    { label: 'IMPLEMENTED VIA', desc: 'JWT workflows and RBAC authorisation.' },
  'Full Stack':      { label: 'SHIPS IN', desc: 'Digimate · Vexo · EstateCRM · Dezoryn' },
  React:             { label: 'USED TO BUILD', desc: 'DigiMate · SkillLoop · VEXO · Dezoryn' },
  TypeScript:        { label: 'ADOPTED FOR', desc: 'Type-safe API clients and component contracts.' },
  'Node.js':         { label: 'POWERS', desc: 'Fastify and Express backend services.' },
  Databases:         { label: 'DESIGNED FOR', desc: 'PostgreSQL, MongoDB, schema architecture.' },
  Architecture:      { label: 'APPLIED ACROSS', desc: 'Frontend, backend, database and deployment layers.' },
  Deployment:        { label: 'MOVING', desc: 'Tested changes into production environments.' },
};

// ─── Production loop steps ────────────────────────────────────────
const PRODUCTION_LOOP = [
  { id: 'build',      label: 'BUILD',     desc: 'Implementing features across the full stack.' },
  { id: 'debug',      label: 'DEBUG',     desc: 'Tracing API, database and runtime failures.' },
  { id: 'integrate',  label: 'INTEGRATE', desc: 'Connecting services, APIs and third-party systems.' },
  { id: 'deploy',     label: 'DEPLOY',    desc: 'Moving tested changes into a production environment.' },
  { id: 'maintain',   label: 'MAINTAIN',  desc: 'Monitoring, patching and evolving live systems.' },
];

// ─── Stage workflow flows ─────────────────────────────────────────
const STAGE_FLOWS = {
  0: ['FUNDAMENTALS', 'PROGRAMMING', 'DATA STRUCTURES', 'WEB DEVELOPMENT'],
  1: ['BACKEND', 'API', 'DATABASE', 'AUTHENTICATION'],
  2: null, // production loop handles stage 2
};

// ─── Progress bar labels ──────────────────────────────────────────
const PROGRESS_LABELS = ['FOUNDATION', 'PRODUCTION', 'END-TO-END'];

const ACCENT = {
  mutedIce:   { border: 'rgba(156, 201, 212, 0.22)', bg: '#111313', dot: '#5E8C96', text: '#F2F0E9', signal: '#5E8C96' },
  primaryIce: { border: 'rgba(156, 201, 212, 0.40)', bg: '#161A1B', dot: '#9CC9D4', text: '#F2F0E9', signal: '#9CC9D4' },
  sage:       { border: 'rgba(156, 201, 212, 0.22)', bg: '#111313', dot: '#5E8C96', text: '#F2F0E9', signal: '#5E8C96' },
  lavender:   { border: 'rgba(156, 201, 212, 0.22)', bg: '#111313', dot: '#5E8C96', text: '#F2F0E9', signal: '#5E8C96' },
  peach:      { border: 'rgba(156, 201, 212, 0.40)', bg: '#161A1B', dot: '#9CC9D4', text: '#F2F0E9', signal: '#9CC9D4' },
};

const ACCENTS = ['mutedIce', 'mutedIce', 'primaryIce'];

function CapabilityEvolution({ milestones, activeMilestoneIndex = 0 }) {
  const [activeStage, setActiveStage]       = useState(0);
  const [hoveredSkill, setHoveredSkill]     = useState(null);
  const [loopStep, setLoopStep]             = useState(0);
  const [loopPaused, setLoopPaused]         = useState(false);
  const [expandedStage, setExpandedStage]   = useState(null);
  const [isTouchDevice, setIsTouchDevice]   = useState(false);
  const [reducedMotion, setReducedMotion]   = useState(false);

  const wrapperRef   = useRef(null);
  const connector0   = useRef(null); // connector line SVG 0→1
  const connector1   = useRef(null); // connector line SVG 1→2
  const signal0      = useRef(null); // traveling circle 0→1
  const signal1      = useRef(null); // traveling circle 1→2
  const progressDot  = useRef(null); // bottom progress indicator
  const loopInterval = useRef(null);
  const skillRefs    = useRef({});
  const stageRefs    = useRef([]);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const rafRef       = useRef(null);

  // ── Environment detection ──────────────────────────────────────
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // ── ScrollTrigger — auto-advance stages on scroll ─────────────
  useEffect(() => {
    if (!wrapperRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      milestones.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: `top ${80 - i * 18}%`,
          onEnter: () => { if (i === 0) setActiveStage(0); },
        });
      });
    });
    return () => ctx.revert();
  }, [milestones, reducedMotion]);

  // ── Sync with parent timeline milestone (optional) ────────────
  useEffect(() => {
    if (activeMilestoneIndex !== undefined) {
      setActiveStage(activeMilestoneIndex);
    }
  }, [activeMilestoneIndex]);

  // ── Production loop ticker ─────────────────────────────────────
  useEffect(() => {
    if (activeStage !== 2 || loopPaused) {
      clearInterval(loopInterval.current);
      return;
    }
    loopInterval.current = setInterval(() => {
      setLoopStep(s => (s + 1) % PRODUCTION_LOOP.length);
    }, 1600);
    return () => clearInterval(loopInterval.current);
  }, [activeStage, loopPaused]);

  // ── GSAP connector signal animation (pure x-translation) ──────
  const fireSignal = useCallback((connRef, signalRef) => {
    if (!signalRef.current || reducedMotion) return;
    const dot = signalRef.current;
    gsap.killTweensOf(dot);
    // Position dot at left edge of its SVG (cx=0,cy=2) and travel to x=80
    gsap.fromTo(dot,
      { opacity: 0, x: 0 },
      {
        opacity: 1,
        x: 80,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => gsap.to(dot, { opacity: 0, duration: 0.18 }),
      }
    );
  }, [reducedMotion]);

  // ── Stage change handler ───────────────────────────────────────
  const handleStageClick = useCallback((idx) => {
    if (idx === activeStage) {
      setExpandedStage(prev => (prev === idx ? null : idx));
      return;
    }
    setActiveStage(idx);
    setExpandedStage(null);
    if (!reducedMotion) {
      if (idx >= 1) fireSignal(connector0, signal0);
      if (idx >= 2) setTimeout(() => fireSignal(connector1, signal1), 200);
    }
  }, [activeStage, fireSignal, reducedMotion]);

  // ── Pointer parallax on active stage (desktop only) ───────────
  useEffect(() => {
    if (isTouchDevice || reducedMotion) return;
    const handleMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', handleMove, { passive: true });

    const animate = () => {
      const activeEl = stageRefs.current[activeStage];
      if (!activeEl) { rafRef.current = requestAnimationFrame(animate); return; }
      const rect = activeEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = ((mouseRef.current.x - cx) / rect.width)  * 3;
      const dy = ((mouseRef.current.y - cy) / rect.height) * 3;
      activeEl.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
      stageRefs.current.forEach(el => { if (el) el.style.transform = ''; });
    };
  }, [activeStage, isTouchDevice, reducedMotion]);

  // ── Skill stagger animation via GSAP ─────────────────────────
  useEffect(() => {
    if (reducedMotion) return;
    const pills = Object.values(skillRefs.current).filter(Boolean);
    if (!pills.length) return;
    gsap.fromTo(pills,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, stagger: 0.045, duration: 0.3, ease: 'power2.out', delay: 0.1 }
    );
  }, [activeStage, reducedMotion]);

  // ── Reset skill refs on stage change ──────────────────────────
  useEffect(() => { skillRefs.current = {}; }, [activeStage]);

  const ac = ACCENTS[activeStage] || 'sage';
  const accentToken = ACCENT[ac];

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      aria-label="Capability Progression Track"
    >
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className={styles.headerRow}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} style={{ background: accentToken.dot }} />
          <span>Capability Progression Track</span>
        </div>
        <span className={styles.tagline}>
          From theoretical foundations to end-to-end production delivery
        </span>
      </div>

      {/* ─── Three Stages ─────────────────────────────────────── */}
      <div className={styles.stagesRow}>
        {milestones.map((item, idx) => {
          const isActive   = activeStage === idx;
          const isExpanded = expandedStage === idx;
          const isPast     = idx < activeStage;
          const acc        = item.accent;
          const aToken     = ACCENT[acc];

          return (
            <React.Fragment key={item.id}>
              {/* Stage Card */}
              <motion.button
                ref={el => (stageRefs.current[idx] = el)}
                className={`${styles.stageCard} ${isActive ? styles.stageActive : ''} ${isPast ? styles.stagePast : ''}`}
                style={isActive ? {
                  '--accent-border': aToken.border,
                  '--accent-bg':     aToken.bg,
                  '--accent-dot':    aToken.dot,
                  '--accent-text':   aToken.text,
                } : {}}
                onClick={() => handleStageClick(idx)}
                aria-pressed={isActive}
                aria-expanded={isExpanded}
                aria-label={`Activate stage ${item.step}: ${item.capabilityPhase}`}
                data-cursor="hover"
                data-cursor-text={isActive ? 'ACTIVATE' : 'EXPLORE'}
                layout
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              >
                {/* Active edge accent */}
                {isActive && (
                  <motion.div
                    className={styles.activeEdge}
                    style={{ background: aToken.dot }}
                    layoutId="activeEdge"
                    transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                  />
                )}

                {/* Stage number */}
                <div className={styles.stageNumRow}>
                  <span
                    className={styles.stageNum}
                    style={isActive ? { color: aToken.dot } : {}}
                  >
                    {item.step}
                  </span>
                  {isActive && (
                    <motion.span
                      className={styles.stageNumDot}
                      style={{ background: aToken.dot }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    />
                  )}
                  {isPast && <span className={styles.pastCheck}>✓</span>}
                </div>

                {/* Phase label */}
                <div className={styles.phaseInfo}>
                  <span className={`${styles.phaseLabel} ${isActive ? styles.phaseLabelActive : ''}`}>
                    {item.capabilityPhase}
                  </span>
                  <span className={styles.phaseMeta}>
                    {item.year} · {item.chapterTag}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className={styles.divider}
                  style={isActive ? { background: aToken.border } : {}}
                />

                {/* Skills — animated stagger on mount via GSAP */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={`skills-${idx}`}
                      className={styles.skillsFlow}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.capabilityItems.map((skill, si) => {
                        const rel = SKILL_RELATIONS[skill];
                        return (
                          <div
                            key={skill}
                            className={styles.skillPillWrapper}
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                            style={{ '--acc-bg': aToken.bg, '--acc-dot': aToken.dot }}
                            data-cursor="hover"
                            data-cursor-text="INSPECT"
                          >
                            <span
                              ref={el => { if (el) skillRefs.current[`${idx}-${si}`] = el; }}
                              className={`${styles.skillPill} ${hoveredSkill === skill ? styles.skillPillHovered : ''}`}
                              style={hoveredSkill === skill ? { borderColor: aToken.border } : {}}
                            >
                              {hoveredSkill === skill && (
                                <span className={styles.skillDot} style={{ background: aToken.dot }} />
                              )}
                              {skill}
                            </span>

                            {/* Micro tooltip */}
                            {hoveredSkill === skill && rel && (
                              <motion.div
                                className={styles.skillTooltip}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                              >
                                <span className={styles.tooltipLabel}>{rel.label}</span>
                                <span className={styles.tooltipDesc}>{rel.desc}</span>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Inactive: compact pill count */}
                  {!isActive && (
                    <motion.div
                      key={`inactive-${idx}`}
                      className={styles.inactiveCount}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className={styles.countDot} style={{ background: aToken.dot }} />
                      <span className={styles.countText}>
                        {item.capabilityItems.length} capabilities
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded workflow / production loop */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className={styles.expandedContent}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Stage 2: Production loop */}
                      {idx === 2 && (
                        <div className={styles.productionLoop}>
                          {PRODUCTION_LOOP.map((step, pi) => (
                            <div
                              key={step.id}
                              className={`${styles.loopStep} ${loopStep === pi ? styles.loopStepActive : ''}`}
                              onMouseEnter={() => { setLoopPaused(true);  }}
                              onMouseLeave={() => { setLoopPaused(false); }}
                              data-cursor="hover"
                              data-cursor-text="TRACE"
                            >
                              <span
                                className={styles.loopDot}
                                style={loopStep === pi ? { background: aToken.dot } : {}}
                              />
                              <span className={styles.loopLabel}>{step.label}</span>
                              {loopStep === pi && (
                                <motion.span
                                  className={styles.loopDesc}
                                  initial={{ opacity: 0, x: 6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {step.desc}
                                </motion.span>
                              )}
                              {pi < PRODUCTION_LOOP.length - 1 && (
                                <span className={styles.loopArrow}>→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Stages 0 & 1: sequential flow */}
                      {STAGE_FLOWS[idx] && (
                        <div className={styles.stageFlow}>
                          {STAGE_FLOWS[idx].map((step, fi) => (
                            <React.Fragment key={step}>
                              <motion.span
                                className={styles.flowStep}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: fi * 0.07, duration: 0.25, ease: 'power2.out' }}
                              >
                                {step}
                              </motion.span>
                              {fi < STAGE_FLOWS[idx].length - 1 && (
                                <span className={styles.flowConnector} style={{ color: aToken.dot }}>↓</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* ─── Animated Connector Between Stages ─────────── */}
              {idx < milestones.length - 1 && (
                <div className={styles.connectorWrapper} aria-hidden="true">
                  <svg
                    className={styles.connectorSvg}
                    viewBox="0 0 80 4"
                    preserveAspectRatio="none"
                    overflow="visible"
                  >
                    {/* Track */}
                    <line
                      x1="0" y1="2" x2="80" y2="2"
                      stroke="#DED9CF"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    {/* Active fill */}
                    <motion.line
                      ref={idx === 0 ? connector0 : connector1}
                      x1="0" y1="2" x2="80" y2="2"
                      stroke={ACCENT[milestones[idx + 1].accent].signal}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: activeStage > idx ? 1 : 0,
                        opacity:    activeStage > idx ? 1 : 0,
                      }}
                      transition={{ duration: 0.45, ease: 'power2.out' }}
                    />
                    {/* Signal dot (GSAP-driven) */}
                    <circle
                      ref={idx === 0 ? signal0 : signal1}
                      r="3"
                      fill={ACCENT[milestones[idx + 1].accent].signal}
                      opacity="0"
                    />
                  </svg>

                  {/* Direction hint */}
                  <span className={styles.connectorHint}>
                    {idx === 0 ? '2021→2025' : '2025→2026'}
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ─── Bottom Progress Indicator ────────────────────────── */}
      <div className={styles.progressBar} aria-label="Career progression indicator">
        <div className={styles.progressTrack}>
          {/* Filled portion */}
          <motion.div
            className={styles.progressFill}
            style={{ background: accentToken.dot }}
            animate={{ width: `${(activeStage / (milestones.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          />
          {/* Traveling dot */}
          <motion.div
            ref={progressDot}
            className={styles.progressDotEl}
            style={{ background: accentToken.dot, boxShadow: `0 0 0 3px ${accentToken.bg}` }}
            animate={{ left: `${(activeStage / (milestones.length - 1)) * 100}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          />
        </div>
        <div className={styles.progressLabels}>
          {PROGRESS_LABELS.map((label, li) => (
            <button
              key={label}
              className={`${styles.progressLabel} ${activeStage === li ? styles.progressLabelActive : ''}`}
              style={activeStage === li ? { color: accentToken.dot } : {}}
              onClick={() => handleStageClick(li)}
              aria-label={`Go to ${label} stage`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CapabilityEvolution);
