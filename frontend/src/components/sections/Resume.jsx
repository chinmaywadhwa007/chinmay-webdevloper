import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiDownload,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheck,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiCode,
  FiDatabase,
  FiCpu,
  FiBriefcase,
  FiArrowRight,
} from 'react-icons/fi';
import AnimatedCounter from '../interactive/AnimatedCounter';
import styles from './Resume.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Interactive Technology Annotations (Requirement 8) ───────────
const TECH_ANNOTATIONS = {
  'React': 'Component architecture, hooks & reactive interfaces',
  'TypeScript': 'Strict type-safety, interfaces & domain models',
  'Node.js': 'Asynchronous backend microservices & REST APIs',
  'Express.js': 'HTTP middleware, routing & error propagation',
  'PostgreSQL': 'Relational data modeling, indexing & ACID compliance',
  'MongoDB': 'Document storage, aggregation & flexible schemas',
  'Tailwind CSS': 'Utility-first responsive styling system',
  'Three.js': 'WebGL 3D graphics & interactive scene rendering',
  'GSAP': 'Hardware-accelerated timelines & ScrollTrigger motion',
  'SQL': 'Relational schema design, queries & CRUD optimization',
  'Git': 'Version control, feature branches & merge workflows',
  'GitHub': 'Repository management, pull requests & code review',
  'Postman': 'API contract testing & payload verification',
  'JWT': 'Stateless tokens, auth headers & session security',
  'RBAC': 'Role-based access control & permission guards',
  'Next.js': 'Server-side rendering, routing & full-stack web architecture',
  'JavaScript': 'ES6+ core language, closures & event loop',
  'HTML5': 'Semantic document structure & web accessibility',
  'CSS3': 'Layout systems, flexbox, CSS grid & custom properties',
  'WebGL': 'GPU hardware acceleration in modern browsers',
  'Python': 'Data scripting & algorithm design',
  'Linux CLI': 'Terminal workflows, environment config & shell tools',
};

// ─── Career Dossier Component ─────────────────────────────────────
const Resume = () => {
  const resumePdfPath = '/Chinmay-Wadhwa-Resume.pdf';

  // Navigation & Mode Switcher state
  const [activeMode, setActiveMode] = useState('timeline'); // 'timeline' | 'projects' | 'stack' | 'education'
  const [activeSkillCategory, setActiveSkillCategory] = useState('ALL');
  const [didOrShipped, setDidOrShipped] = useState('did'); // 'did' | 'shipped'
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);

  // Video hover state for Vexo
  const vexoVideoRef = useRef(null);
  const [isVexoPlaying, setIsVexoPlaying] = useState(false);

  // GSAP Timeline Ref
  const sectionRef = useRef(null);
  const timelineSpineRef = useRef(null);
  const spineProgressRef = useRef(null);

  // Environment
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  }, []);

  // ── GSAP Timeline Spine Scroll Trigger (Requirement 4) ───────────
  useEffect(() => {
    const spine = timelineSpineRef.current;
    const progress = spineProgressRef.current;
    if (!spine || !progress) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: spine,
      start: 'top 75%',
      end: 'bottom 40%',
      scrub: 0.5,
      onUpdate: (self) => {
        gsap.to(progress, {
          scaleY: self.progress,
          duration: 0.1,
          overwrite: 'auto',
        });
      },
    });

    return () => trigger.kill();
  }, [activeMode]);

  // ── Copy email helper ───────────────────────────────────────────
  const handleCopyEmail = useCallback(async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText('chinmaywadhwa01@gmail.com');
      setCopyState(true);
      setTimeout(() => setCopyState(false), 2400);
    } catch {
      window.location.href = 'mailto:chinmaywadhwa01@gmail.com';
    }
  }, []);

  // ── Vexo Video Hover Handlers (Requirement 11) ───────────────────
  const handleVexoMouseEnter = useCallback(() => {
    if (isTouchDevice.current) return;
    if (vexoVideoRef.current) {
      vexoVideoRef.current.play().then(() => setIsVexoPlaying(true)).catch(() => {});
    }
  }, []);

  const handleVexoMouseLeave = useCallback(() => {
    if (isTouchDevice.current) return;
    if (vexoVideoRef.current) {
      vexoVideoRef.current.pause();
      vexoVideoRef.current.currentTime = 0;
      setIsVexoPlaying(false);
    }
  }, []);

  // ── Projects Data (Requirements 9, 10, 11) ───────────────────────
  const dossierProjects = [
    {
      id: 'digimate',
      title: 'Digimate Tech Digital Solutions',
      type: 'Full-Stack Platform',
      year: '2026',
      role: 'Full-Stack Developer',
      image: '/digimate.png',
      liveUrl: 'https://digimatetechdigital.com/',
      githubUrl: null,
      description:
        'Engineered complete client web platform with custom backend architecture, PostgreSQL relational schemas, authentication, and responsive client interfaces.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    },
    {
      id: 'vexo',
      title: 'Vexo',
      type: 'Audio-Visual Media Platform',
      year: '2026',
      role: 'Frontend & Motion Engineer',
      image: '/vexo.png',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      liveUrl: 'https://vexo-music-fxwa-steel.vercel.app/',
      githubUrl: 'https://github.com/chinmaywadhwa007',
      description:
        'High-fidelity music & entertainment application featuring custom playback controls, dynamic motion UI, and responsive audio-visual layouts.',
      technologies: ['React', 'Next.js', 'Web Audio API', 'Framer Motion', 'Tailwind CSS'],
    },
    {
      id: 'estatecrm',
      title: 'EstateCRM',
      type: 'Real Estate Management',
      year: '2026',
      role: 'Full-Stack Developer',
      image: '/digimate-platform.png',
      liveUrl: '#',
      githubUrl: 'https://github.com/chinmaywadhwa007',
      description:
        'Cloud-native CRM platform for property listings, client communication workflows, and PostgreSQL-integrated deal management.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'REST APIs'],
    },
    {
      id: 'dezoryn',
      title: 'Dezoryn',
      type: 'Enterprise Business Automation',
      year: '2026',
      role: 'Frontend Developer',
      image: '/dezoryn.png',
      liveUrl: 'https://www.dezoryntechnology.com/',
      githubUrl: 'https://github.com/chinmaywadhwa007',
      description:
        'Modular enterprise web platform providing operational automation, interactive dashboards, and optimized production interfaces.',
      technologies: ['React', 'TypeScript', 'JavaScript', 'CSS Modules'],
    },
    {
      id: 'skilloop',
      title: 'SkillLoop',
      type: 'Peer-to-Peer Skill Exchange',
      year: '2025',
      role: 'Full-Stack Developer',
      image: '/shopease.png',
      liveUrl: 'https://skilloop-omega.vercel.app/',
      githubUrl: 'https://github.com/chinmaywadhwa007/skilloop-a-skill-exchange-platform-',
      description:
        'Peer-to-peer knowledge platform enabling user profiles, skill discovery, arena quizzes, and JWT-authenticated session middleware.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'JWT'],
    },
  ];

  // ── Skills Taxonomy by Category & Mastery Tier (Requirements 12, 13) ──
  const skillCategories = ['ALL', 'FRONTEND', 'BACKEND', 'DATABASE', '3D & MOTION', 'TOOLS', 'LANGUAGES'];

  const allSkills = [
    { name: 'React', category: 'FRONTEND', tier: 'CORE' },
    { name: 'TypeScript', category: 'LANGUAGES', tier: 'CORE' },
    { name: 'Node.js', category: 'BACKEND', tier: 'CORE' },
    { name: 'PostgreSQL', category: 'DATABASE', tier: 'CORE' },
    { name: 'Express.js', category: 'BACKEND', tier: 'CORE' },
    { name: 'JavaScript', category: 'LANGUAGES', tier: 'CORE' },
    { name: 'SQL', category: 'DATABASE', tier: 'CORE' },
    { name: 'Next.js', category: 'FRONTEND', tier: 'WORKING' },
    { name: 'Tailwind CSS', category: 'FRONTEND', tier: 'WORKING' },
    { name: 'MongoDB', category: 'DATABASE', tier: 'WORKING' },
    { name: 'Git', category: 'TOOLS', tier: 'WORKING' },
    { name: 'GitHub', category: 'TOOLS', tier: 'WORKING' },
    { name: 'Postman', category: 'TOOLS', tier: 'WORKING' },
    { name: 'Linux CLI', category: 'TOOLS', tier: 'WORKING' },
    { name: 'REST APIs', category: 'BACKEND', tier: 'CORE' },
    { name: 'JWT & RBAC', category: 'BACKEND', tier: 'WORKING' },
    { name: 'Three.js', category: '3D & MOTION', tier: 'FOUNDATION' },
    { name: 'GSAP', category: '3D & MOTION', tier: 'WORKING' },
    { name: 'WebGL', category: '3D & MOTION', tier: 'FOUNDATION' },
    { name: 'Framer Motion', category: '3D & MOTION', tier: 'WORKING' },
    { name: 'Python', category: 'LANGUAGES', tier: 'FOUNDATION' },
  ];

  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === 'ALL') return allSkills;
    return allSkills.filter(s => s.category === activeSkillCategory);
  }, [activeSkillCategory]);

  return (
    <section id="resume" ref={sectionRef} className={`${styles.dossier} aboutTheme`} data-section="resume">
      <div className={styles.container}>

        {/* ─── SECTION HEADER ──────────────────────────────── */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowNum}>(04)</span>
            <span>CAREER DOSSIER &amp; CREDENTIALS</span>
          </div>

          <h2 className={styles.title}>Engineering Career Dossier</h2>
          <p className={styles.subtitle}>
            Verified production experience, systems architecture, engineering timeline, and direct technical documentation.
          </p>
        </div>

        {/* ─── HERO CAREER DOSSIER CARD (Requirement 1) ────── */}
        <div className={styles.heroCard}>
          <div className={styles.heroTopRow}>
            <div className={styles.nameBlock}>
              <h1 className={styles.dossierName}>CHINMAY WADHWA</h1>
              <span className={styles.dossierRole}>Full-Stack Developer</span>
              <span className={styles.dossierStackLine}>React · TypeScript · Node.js · PostgreSQL · MongoDB</span>
            </div>

            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              <span>OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES</span>
            </div>
          </div>

          {/* Editorial Metadata Row */}
          <div className={styles.metadataRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>Jaipur, Rajasthan, India</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>PRODUCTION TENURE</span>
              <span className={styles.metaValue}>4+ Months Full-Stack Production</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>CORE SPECIALTY</span>
              <span className={styles.metaValue}>Full-Stack Systems &amp; Web Platforms</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>STATUS</span>
              <span className={styles.metaValue}>Active Production Contributor</span>
            </div>
          </div>

          {/* Contact Rail (Requirement 17) */}
          <div className={styles.contactRail}>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`${styles.railItem} ${copyState ? styles.railItemActive : ''}`}
              data-cursor="hover"
              data-cursor-text={copyState ? 'COPIED' : 'COPY'}
              title="Copy email to clipboard"
            >
              <FiMail className={styles.railItemIcon} />
              <span>{copyState ? 'chinmaywadhwa01@gmail.com (Copied ✓)' : 'chinmaywadhwa01@gmail.com'}</span>
            </button>

            <a
              href="tel:+918290087742"
              className={styles.railItem}
              data-cursor="hover"
              data-cursor-text="CALL"
            >
              <FiPhone className={styles.railItemIcon} />
              <span>+91 8290087742</span>
            </a>

            <div className={styles.railItem}>
              <FiMapPin className={styles.railItemIcon} />
              <span>Jaipur, India</span>
            </div>

            <a
              href="https://github.com/chinmaywadhwa007"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.railItem}
              data-cursor="hover"
              data-cursor-text="VISIT"
            >
              <FiGithub className={styles.railItemIcon} />
              <span>GitHub ↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/chinmay-wadhwa-898a39234/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.railItem}
              data-cursor="hover"
              data-cursor-text="VISIT"
            >
              <FiLinkedin className={styles.railItemIcon} />
              <span>LinkedIn ↗</span>
            </a>

            <a
              href={resumePdfPath}
              download="Chinmay-Wadhwa-Resume.pdf"
              className={`${styles.railItem} ${styles.railItemDownload}`}
              data-cursor="cta"
              data-cursor-text="DOWNLOAD"
            >
              <FiDownload className={styles.railItemIcon} />
              <span>Download CV (PDF)</span>
            </a>
          </div>
        </div>

        {/* ─── CAREER METRICS STRIP (Requirement 20) ───────── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIndicatorLine} />
            <div className={styles.statNumber}>
              <AnimatedCounter targetValue={4} suffix="+" duration={1.2} />
            </div>
            <div className={styles.statLabel}>Months Production Experience</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIndicatorLine} />
            <div className={styles.statNumber}>
              <AnimatedCounter targetValue={5} suffix="+" duration={1.4} />
            </div>
            <div className={styles.statLabel}>Production Systems Shipped</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIndicatorLine} />
            <div className={styles.statNumber}>
              <AnimatedCounter targetValue={100} suffix="+" duration={1.6} />
            </div>
            <div className={styles.statLabel}>Bugs &amp; Issues Resolved</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIndicatorLine} />
            <div className={styles.statNumber}>
              <AnimatedCounter targetValue={12} suffix="+" duration={1.4} />
            </div>
            <div className={styles.statLabel}>Core Technologies Mastered</div>
          </div>
        </div>

        {/* ─── CAREER PROGRESSION PATHWAY (Requirement 21) ─── */}
        <div className={styles.progressionStrip} aria-label="Career progression pathway">
          <div className={styles.progStep}>
            <span className={`${styles.progDot} ${styles.progDot_2021}`} title="2021 Past: Engineering Foundation" />
            <div className={styles.progStepText}>
              <span className={styles.progYear}>2021</span>
              <span className={styles.progTitle}>Engineering Foundation</span>
            </div>
          </div>

          <span className={styles.progConnector} />

          <div className={styles.progStep}>
            <span className={`${styles.progDot} ${styles.progDot_2025}`} title="2025 Previous: First Production Experience (Kvon)" />
            <div className={styles.progStepText}>
              <span className={styles.progYear}>2025</span>
              <span className={styles.progTitle}>Previous Role (Kvon)</span>
            </div>
          </div>

          <span className={styles.progConnector} />

          <div className={styles.progStep}>
            <span className={`${styles.progDot} ${styles.progDot_2026}`} title="2026 Current: Full-Stack Engineering (Digimate)">
              <span className={styles.progDotInner} />
            </span>
            <div className={styles.progStepText}>
              <span className={`${styles.progYear} ${styles.progYearCurrent}`}>2026</span>
              <span className={`${styles.progTitle} ${styles.progTitleCurrent}`}>Current Role (Digimate)</span>
            </div>
          </div>
        </div>

        {/* ─── DOSSIER MODE SWITCHER BAR (Requirements 2, 22) ─ */}
        <div className={styles.modeSwitcherRow}>
          <div className={styles.modeTabsGroup} role="tablist">
            {[
              { id: 'timeline', label: 'EXPERIENCE' },
              { id: 'projects', label: 'PROJECTS' },
              { id: 'stack',    label: 'STACK' },
              { id: 'education',label: 'EDUCATION' },
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeMode === tab.id}
                className={`${styles.modeTab} ${activeMode === tab.id ? styles.modeTabActive : ''}`}
                onClick={() => setActiveMode(tab.id)}
                data-cursor="hover"
                data-cursor-text={tab.label}
              >
                {activeMode === tab.id && (
                  <motion.span
                    layoutId="activeDossierTab"
                    className={styles.modeSharedIndicator}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={styles.modeTabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>

          <a
            href={resumePdfPath}
            download="Chinmay-Wadhwa-Resume.pdf"
            className={styles.downloadCtaButton}
            data-cursor="cta"
            data-cursor-text="PDF"
          >
            <FiDownload size={14} />
            <span>Download Official CV</span>
          </a>
        </div>

        {/* ─── DYNAMIC CONTENT MODES (Requirements 3–15) ───── */}
        <AnimatePresence mode="wait">

          {/* ── MODE 1: TIMELINE ──────────────────────────── */}
          {activeMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={styles.timelineWrapper}
            >
              {/* Vertical timeline spine */}
              <div ref={timelineSpineRef} className={styles.timelineSpine}>
                <div ref={spineProgressRef} className={styles.timelineSpineProgress} />
              </div>

              {/* ── Milestone 1: 2026 Digimate Tech (CURRENT) ──────── */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNodeCol}>
                  <div className={`${styles.timelineMarker} ${styles.timelineMarkerCurrent}`}>
                    <span className={styles.markerInnerDotCurrent} />
                  </div>
                </div>

                <div className={`${styles.timelineContentCard} ${styles.timelineContentCardCurrent}`}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.expRoleTitle}>Full-Stack Developer</h3>
                      <div className={styles.expCompanyMeta}>
                        <FiBriefcase size={14} className={styles.expCompanyIcon} />
                        <span>Digimate Tech Pvt. Limited · Jaipur, India</span>
                      </div>
                    </div>
                    <span className={styles.expPeriodBadgeCurrent}>Jul 2026 – Present</span>
                  </div>

                  <p className={styles.expSummary}>
                    Building and maintaining production web applications across frontend, backend, database, and deployment layers. Contributed to 100+ bug resolutions, API integrations, and scalable client platforms.
                  </p>

                  {/* "WHAT I DID" / "WHAT I SHIPPED" Switcher (Requirement 7) */}
                  <div className={styles.didShippedSwitcher}>
                    <div className={styles.subSwitcherHeader}>
                      <button
                        type="button"
                        className={`${styles.subSwitcherBtn} ${didOrShipped === 'did' ? styles.subSwitcherBtnActive : ''}`}
                        onClick={() => setDidOrShipped('did')}
                      >
                        WHAT I DID
                      </button>
                      <button
                        type="button"
                        className={`${styles.subSwitcherBtn} ${didOrShipped === 'shipped' ? styles.subSwitcherBtnActive : ''}`}
                        onClick={() => setDidOrShipped('shipped')}
                      >
                        WHAT I SHIPPED
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {didOrShipped === 'did' ? (
                        <motion.ul
                          key="did"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={styles.bulletList}
                        >
                          <li className={styles.bulletItem}>
                            <span className={styles.bulletDotCurrent} />
                            <span>Engineered component and state architecture for responsive client applications using React, TypeScript, and modern CSS.</span>
                          </li>
                          <li className={styles.bulletItem}>
                            <span className={styles.bulletDotCurrent} />
                            <span>Built backend services and RESTful APIs with Node.js, Express.js, TypeScript, including JWT authentication and validation.</span>
                          </li>
                          <li className={styles.bulletItem}>
                            <span className={styles.bulletDotCurrent} />
                            <span>Designed PostgreSQL relational data schemas, optimized SQL queries, and implemented MongoDB document collections.</span>
                          </li>
                          <li className={styles.bulletItem}>
                            <span className={styles.bulletDotCurrent} />
                            <span>Investigated and resolved 100+ bugs across frontend, backend, database, and deployment environments.</span>
                          </li>
                          <li className={styles.bulletItem}>
                            <span className={styles.bulletDotCurrent} />
                            <span>Managed feature development, code reviews, and releases with Git and GitHub collaborative workflows.</span>
                          </li>
                        </motion.ul>
                      ) : (
                        <motion.div
                          key="shipped"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={styles.shippedShelf}
                        >
                          <div className={styles.shippedCard}>
                            <span className={styles.shippedName}>DigiMate Digital</span>
                            <span className={styles.shippedDesc}>Full-Stack Web Platform · Node.js, PostgreSQL, TypeScript</span>
                          </div>
                          <div className={styles.shippedCard}>
                            <span className={styles.shippedName}>Vexo</span>
                            <span className={styles.shippedDesc}>Audio-Visual Media Platform · React, Web Audio API, Next.js</span>
                          </div>
                          <div className={styles.shippedCard}>
                            <span className={styles.shippedName}>EstateCRM</span>
                            <span className={styles.shippedDesc}>Real Estate Management · PostgreSQL, Express, Reusable UI</span>
                          </div>
                          <div className={styles.shippedCard}>
                            <span className={styles.shippedName}>Dezoryn</span>
                            <span className={styles.shippedDesc}>Enterprise Business Automation · Modular Architecture</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expand / Collapse Details (Requirement 6) */}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(p => !p)}
                    className={styles.expandToggleBtn}
                    data-cursor="hover"
                    data-cursor-text={isExpanded ? 'COLLAPSE' : 'EXPAND'}
                  >
                    <span>{isExpanded ? 'COLLAPSE TECHNICAL BREAKDOWN' : 'EXPAND FULL PRODUCTION BREAKDOWN'}</span>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.expandedBreakdown}
                      >
                        <div className={styles.breakdownColumn}>
                          <span className={styles.breakdownTitle}>FRONTEND ARCHITECTURE</span>
                          <span className={styles.breakdownText}>Component hierarchy, custom hooks, typed props, accessibility, and high-performance render lifecycles.</span>
                        </div>
                        <div className={styles.breakdownColumn}>
                          <span className={styles.breakdownTitle}>BACKEND &amp; APIS</span>
                          <span className={styles.breakdownText}>REST endpoint contracts, middleware pipeline, centralized error handling, and payload validation.</span>
                        </div>
                        <div className={styles.breakdownColumn}>
                          <span className={styles.breakdownTitle}>DATABASE INTEGRITY</span>
                          <span className={styles.breakdownText}>PostgreSQL normalized tables, primary/foreign keys, connection pooling, and pgAdmin administration.</span>
                        </div>
                        <div className={styles.breakdownColumn}>
                          <span className={styles.breakdownTitle}>DEPLOYMENT &amp; CI/CD</span>
                          <span className={styles.breakdownText}>Environment configuration, production builds, branch protection, and bug triage.</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interactive Tech Chips with Tooltips (Requirement 8) */}
                  <div className={styles.techChipsRow}>
                    {['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'Git'].map(tech => (
                      <div key={tech} className={styles.techChip} data-cursor="hover" data-cursor-text="INSPECT">
                        <span>{tech}</span>
                        {TECH_ANNOTATIONS[tech] && (
                          <span className={styles.techChipTooltip}>{TECH_ANNOTATIONS[tech]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Milestone 2: 2025 Kvon Technologies (PREVIOUS) ───── */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNodeCol}>
                  <div className={`${styles.timelineMarker} ${styles.timelineMarkerPrev}`}>
                    <span className={styles.markerInnerDotPrev} />
                  </div>
                </div>

                <div className={`${styles.timelineContentCard} ${styles.timelineContentCardPrev}`}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.expRoleTitle}>Junior Full-Stack Developer Intern</h3>
                      <div className={styles.expCompanyMeta}>
                        <FiBriefcase size={14} />
                        <span>Kvon Technologies · Jaipur, India</span>
                      </div>
                    </div>
                    <span className={styles.expPeriodBadgePrev}>Feb 2025 – Jul 2025</span>
                  </div>

                  <p className={styles.expSummary}>
                    Developed backend services and web functionality using Node.js, Express.js, and SQL databases. Designed RESTful APIs supporting CRUD workflows, authentication, and database integration.
                  </p>

                  <ul className={styles.bulletList}>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletDotPrev} />
                      <span>Built and documented RESTful endpoints supporting database-driven application workflows.</span>
                    </li>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletDotPrev} />
                      <span>Implemented JWT-based authentication and Role-Based Access Control (RBAC) to secure sensitive routes.</span>
                    </li>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletDotPrev} />
                      <span>Performed SQL database design, queries, and integration with backend business logic.</span>
                    </li>
                    <li className={styles.bulletItem}>
                      <span className={styles.bulletDotPrev} />
                      <span>Tested and verified endpoints using Postman, resolving backend logic bugs during feature testing.</span>
                    </li>
                  </ul>

                  <div className={styles.techChipsRow}>
                    {['Node.js', 'Express.js', 'SQL', 'JWT', 'RBAC', 'Postman', 'Git'].map(tech => (
                      <div key={tech} className={styles.techChip} data-cursor="hover" data-cursor-text="INSPECT">
                        <span>{tech}</span>
                        {TECH_ANNOTATIONS[tech] && (
                          <span className={styles.techChipTooltip}>{TECH_ANNOTATIONS[tech]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Milestone 3: 2021–2025 JECRC Education (PAST) ── */}
              <div className={styles.timelineItem}>
                <div className={styles.timelineNodeCol}>
                  <div className={`${styles.timelineMarker} ${styles.timelineMarkerPast}`}>
                    <span className={styles.markerInnerDotPast} />
                  </div>
                </div>

                <div className={`${styles.timelineContentCard} ${styles.timelineContentCardPast}`}>
                  <div className={styles.expHeader}>
                    <div>
                      <h3 className={styles.expRoleTitle}>B.Tech — Electronics &amp; Communication Engineering</h3>
                      <div className={styles.expCompanyMeta}>
                        <span>JECRC Foundation · Jaipur, India</span>
                      </div>
                    </div>
                    <span className={styles.expPeriodBadgePast}>
                      2021 — 2025
                    </span>
                  </div>

                  <p className={styles.expSummary}>
                    Rigorous engineering education covering digital electronics, communications systems, data structures, and computer science principles that form the foundation of my software engineering capabilities.
                  </p>

                  <div className={styles.techChipsRow}>
                    {['Data Structures', 'Algorithms', 'OOP', 'Digital Systems', 'Signals & Systems'].map(item => (
                      <span key={item} className={styles.techChip}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Journey Continues (Requirement) ── */}
              <div className={styles.journeyContinues} aria-label="Journey continues indicator">
                <div className={styles.journeyLine} />
                <div className={styles.journeyContent}>
                  <span className={styles.journeyIndicator}>●</span>
                  <span className={styles.journeyMain}>The Journey Continues</span>
                  <span className={styles.journeySecondary}>Building resilient systems &amp; engineering future platforms</span>
                </div>
              </div>

            </motion.div>
          )}

          {/* ── MODE 2: PROJECTS SHELF (Requirements 9, 10, 11) ─ */}
          {activeMode === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={styles.projectsShelf}
            >
              {dossierProjects.map((proj) => {
                const isVexo = proj.id === 'vexo';

                return (
                  <div
                    key={proj.id}
                    className={styles.projectArtifactCard}
                    onMouseEnter={isVexo ? handleVexoMouseEnter : undefined}
                    onMouseLeave={isVexo ? handleVexoMouseLeave : undefined}
                  >
                    <div className={styles.projectMediaWrap}>
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className={styles.projectImage}
                        loading="lazy"
                      />

                      {/* Video Preview on Hover for Vexo (Requirement 11) */}
                      {isVexo && proj.videoUrl && (
                        <>
                          <video
                            ref={vexoVideoRef}
                            src={proj.videoUrl}
                            muted
                            loop
                            playsInline
                            preload="none"
                            className={`${styles.projectVideo} ${isVexoPlaying ? styles.projectVideoPlaying : ''}`}
                          />
                          {!isVexoPlaying && (
                            <span className={styles.videoBadge}>▶ HOVER TO PREVIEW</span>
                          )}
                        </>
                      )}
                    </div>

                    <div className={styles.projectBody}>
                      <div className={styles.projectTopMeta}>
                        <span className={styles.projectType}>{proj.type}</span>
                        <span className={styles.projectYear}>{proj.year}</span>
                      </div>

                      <h4 className={styles.projectTitle}>{proj.title}</h4>
                      <p className={styles.projectDescription}>{proj.description}</p>

                      <div className={styles.projectTechCluster}>
                        {proj.technologies.map(tech => (
                          <span key={tech} className={styles.projectTechBadge}>{tech}</span>
                        ))}
                      </div>

                      <div className={styles.projectActionsRow}>
                        {proj.liveUrl && proj.liveUrl !== '#' && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectLink}
                            data-cursor="hover"
                            data-cursor-text="OPEN"
                          >
                            <span>Live Platform</span>
                            <FiArrowRight size={13} />
                          </a>
                        )}

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.projectLink}
                            data-cursor="hover"
                            data-cursor-text="CODE"
                          >
                            <span>Source</span>
                            <FiExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ── MODE 3: TECHNICAL STACK & RELATIONSHIPS (12, 13, 14) ── */}
          {activeMode === 'stack' && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={styles.skillsEcosystemWrap}
            >
              {/* Category Filter Bar */}
              <div className={styles.skillsCategoryNav} role="tablist">
                {skillCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.skillsCategoryBtn} ${activeSkillCategory === cat ? styles.skillsCategoryBtnActive : ''}`}
                    onClick={() => setActiveSkillCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Relationship Map (Requirement 14) */}
              <div className={styles.skillsChainMap} aria-label="Technical connection chain">
                <div className={styles.chainNode}>React</div>
                <span className={styles.chainArrow}>→</span>
                <div className={styles.chainNode}>TypeScript</div>
                <span className={styles.chainArrow}>→</span>
                <div className={styles.chainNode}>Node.js</div>
                <span className={styles.chainArrow}>→</span>
                <div className={styles.chainNode}>REST APIs</div>
                <span className={styles.chainArrow}>→</span>
                <div className={styles.chainNode}>PostgreSQL</div>
              </div>

              {/* Mastery Tiers (No arbitrary percentages - Requirement 13) */}
              <div className={styles.tiersGrid}>
                {/* Core Production Tier */}
                <div className={styles.tierCard}>
                  <div className={styles.tierHeader}>
                    <span className={`${styles.tierBadge} ${styles.tierBadge_core}`}>CORE PRODUCTION</span>
                  </div>
                  <p className={styles.tierDesc}>
                    Technologies utilized daily in shipping full-stack production systems, databases, and client interfaces.
                  </p>
                  <div className={styles.tierSkillsList}>
                    {filteredSkills.filter(s => s.tier === 'CORE').map(s => (
                      <div key={s.name} className={styles.techChip} data-cursor="hover" data-cursor-text="INSPECT">
                        <span>{s.name}</span>
                        {TECH_ANNOTATIONS[s.name] && (
                          <span className={styles.techChipTooltip}>{TECH_ANNOTATIONS[s.name]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Working Experience Tier */}
                <div className={styles.tierCard}>
                  <div className={styles.tierHeader}>
                    <span className={`${styles.tierBadge} ${styles.tierBadge_working}`}>WORKING PROFICIENCY</span>
                  </div>
                  <p className={styles.tierDesc}>
                    Production tools, styling frameworks, testing environments, and document stores actively integrated.
                  </p>
                  <div className={styles.tierSkillsList}>
                    {filteredSkills.filter(s => s.tier === 'WORKING').map(s => (
                      <div key={s.name} className={styles.techChip} data-cursor="hover" data-cursor-text="INSPECT">
                        <span>{s.name}</span>
                        {TECH_ANNOTATIONS[s.name] && (
                          <span className={styles.techChipTooltip}>{TECH_ANNOTATIONS[s.name]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialized & Foundations Tier */}
                <div className={styles.tierCard}>
                  <div className={styles.tierHeader}>
                    <span className={`${styles.tierBadge} ${styles.tierBadge_foundation}`}>FOUNDATION &amp; 3D</span>
                  </div>
                  <p className={styles.tierDesc}>
                    3D graphics, WebGL scene projection, scripting languages, and hardware systems architecture.
                  </p>
                  <div className={styles.tierSkillsList}>
                    {filteredSkills.filter(s => s.tier === 'FOUNDATION').map(s => (
                      <div key={s.name} className={styles.techChip} data-cursor="hover" data-cursor-text="INSPECT">
                        <span>{s.name}</span>
                        {TECH_ANNOTATIONS[s.name] && (
                          <span className={styles.techChipTooltip}>{TECH_ANNOTATIONS[s.name]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MODE 4: EDUCATION (Requirement 15) ───────────── */}
          {activeMode === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={styles.educationCard}
            >
              <div className={styles.eduHeaderRow}>
                <div>
                  <h3 className={styles.eduSchoolTitle}>JECRC Foundation</h3>
                  <p className={styles.eduDegreeText}>
                    Bachelor of Technology — Electronics and Communication Engineering
                  </p>
                </div>
                <span className={styles.eduYearsBadge}>Nov 2021 – May 2025 · Jaipur, India</span>
              </div>

              <div className={styles.eduTracksWrap}>
                <span className={styles.eduTracksTitle}>FOUNDATION DISCIPLINES &amp; CS RIGOR</span>
                <div className={styles.eduTracksList}>
                  {[
                    'Object-Oriented Programming (OOP)',
                    'Data Structures & Algorithms (DSA)',
                    'Digital Electronics & Logic Design',
                    'Communication Systems & Protocols',
                    'Microprocessors & Microcontrollers',
                    'Database Fundamentals',
                    'Software Development Lifecycle (SDLC)',
                  ].map(track => (
                    <span key={track} className={styles.eduTrackBadge}>{track}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </section>
  );
};

export default Resume;
