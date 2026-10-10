import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import CollaborationLaunchpad from '../components/sections/CollaborationLaunchpad';
import FeaturedProjectCard from '../components/interactive/FeaturedProjectCard';
import ProjectCaseStudy from '../components/interactive/ProjectCaseStudy';
import Magnetic from '../components/interactive/Magnetic';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home Page - Main landing showcase featuring the Interactive Editorial Hero,
 * About Dossier, Trajectory Timeline, and High-End Physical Featured Architectures
 */
const Home = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Section Refs for ScrollTrigger Entrance & Parallax
  const featuredSectionRef = useRef(null);
  const featuredTagRef = useRef(null);
  const featuredHeadingWordsRef = useRef([]);
  featuredHeadingWordsRef.current = [];
  const featuredSubtitleRef = useRef(null);
  const cardsGridRef = useRef(null);
  const cardComponentRefs = useRef([]);
  cardComponentRefs.current = [];

  const addHeadingWordRef = (el) => {
    if (el && !featuredHeadingWordsRef.current.includes(el)) {
      featuredHeadingWordsRef.current.push(el);
    }
  };

  const addCardCompRef = (el) => {
    if (el && !cardComponentRefs.current.includes(el)) {
      cardComponentRefs.current.push(el);
    }
  };

  const featuredArchitectures = [
    {
      id: 'dezoryn',
      title: 'Dezoryn Technologies',
      category: 'Enterprise Business Automation',
      description: 'Enterprise automation platform connecting CRM, ERP, and AI workflows.',
      fullDescription:
        'Engineered intelligent enterprise platforms connecting CRM, Cloud ERP, and AI Neural Engines. Built with PostgreSQL, React 18, and scalable workflow automation.',
      image: '/dezoryn.png',
      domain: 'dezoryntechnology.com',
      liveUrl: 'https://www.dezoryntechnology.com/',
      githubUrl: null,
      accent: 'sage',
      isLive: true,
      tags: ['React 18', 'PostgreSQL', 'Node.js'],
      allTags: ['React 18', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Enterprise ERP', 'JWT RBAC'],
      architecture: [
        { label: 'Client', sub: 'React 18' },
        { label: 'API Gateway', sub: 'REST / Express' },
        { label: 'Service', sub: 'Node.js Core' },
        { label: 'Security', sub: 'JWT & RBAC' },
        { label: 'Database', sub: 'PostgreSQL Pool' },
      ],
      performance: 'Sub-120ms API latency · 98 Lighthouse Score · Zero-layout-shift modular dashboard',
      auth: 'Stateless JWT auth tokens stored in HTTP-Only cookies with granular Role-Based Access Control',
      dataFlow: 'Client transaction → Payload schema validation → ACID-compliant PostgreSQL queries → Real-time UI synchronization',
      ctaText: 'Launch Platform',
      isVideo: false,
    },
    {
      id: 'vexo-music',
      title: 'VEXO Music',
      category: 'Audio Visual & Entertainment',
      description: 'High-fidelity audio-visual streaming platform with custom playback architecture.',
      fullDescription:
        'Pioneering original soundscapes and audio-visual streaming. Powered by Video.js ambient playback, custom sound player architecture, and studio service bookings.',
      image: '/vexo.png',
      domain: 'vexo-music-fxwa-steel.vercel.app',
      liveUrl: 'https://vexo-music-fxwa-steel.vercel.app/',
      githubUrl: null,
      accent: 'peach',
      isLive: true,
      tags: ['React', 'Next.js', 'Video.js'],
      allTags: ['React', 'Next.js', 'Video.js', 'Web Audio API', 'Framer Motion', 'Tailwind CSS'],
      architecture: [
        { label: 'Client', sub: 'Next.js 14' },
        { label: 'Engine', sub: 'Video.js Core' },
        { label: 'Audio', sub: 'Web Audio API' },
        { label: 'Visualizer', sub: 'GSAP 60fps' },
        { label: 'Edge Delivery', sub: 'CDN Streaming' },
      ],
      performance: '60fps GPU-accelerated equalizer · Instant audio buffer caching · Responsive canvas render pipeline',
      auth: 'Stateless session persistence for custom user playlists, volume settings, and media presets',
      dataFlow: 'Audio track request → Stream buffer initialization → Web Audio frequency bin analysis → Real-time visual equalizer pulse',
      ctaText: 'Launch App',
      isVideo: false,
    },
    {
      id: 'skill-loop',
      title: 'SkillLoop',
      category: 'Peer-to-Peer Learning',
      description: 'Peer-to-peer knowledge exchange platform with collaborative live arenas.',
      fullDescription:
        'Peer-to-Peer Skill Exchange & Arena connecting learners and mentors through a virtual knowledge economy with collaborative arenas and interactive sessions.',
      image: '/page.png',
      domain: 'skilloop-omega.vercel.app',
      liveUrl: 'https://skilloop-omega.vercel.app/',
      githubUrl: 'https://github.com/chinmaywadhwa007/skilloop-a-skill-exchange-platform-',
      accent: 'butter',
      isLive: true,
      tags: ['React', 'Node.js', 'MongoDB'],
      allTags: ['React', 'Node.js', 'MongoDB', 'Express.js', 'REST APIs', 'JWT', 'Framer Motion'],
      architecture: [
        { label: 'Client', sub: 'React SPA' },
        { label: 'REST API', sub: 'Express.js' },
        { label: 'Service', sub: 'Node.js Engine' },
        { label: 'Auth Guard', sub: 'JWT Middleware' },
        { label: 'Document Store', sub: 'MongoDB' },
      ],
      performance: 'Sub-50ms arena response times · Optimized MongoDB aggregation pipelines · Efficient client state updates',
      auth: 'Cryptographic JWT session authentication with bearer auth headers and route security middleware',
      dataFlow: 'Quiz submission → Server score verification → Atomic document update in MongoDB → Global leaderboard recalculation',
      ctaText: 'Launch Arena',
      isVideo: false,
    },
  ];

  // ScrollTrigger Entrance & Sequential Parallax Scrubbing
  useEffect(() => {
    const section = featuredSectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Master Sequential Entrance Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      });

      // 1. Eyebrow Tag entrance
      tl.fromTo(
        featuredTagRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // 2. Word-by-word 3D perspective heading reveal
      tl.fromTo(
        featuredHeadingWordsRef.current,
        {
          opacity: 0,
          y: 40,
          rotateX: 40,
          clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // 3. Subtitle entrance
      tl.fromTo(
        featuredSubtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.45'
      );

      // 4. Clean, unified card entrance with subtle lift and fade (no shutter wipe)
      const cardDomEls = cardComponentRefs.current.map((c) => c?.getCard()).filter(Boolean);
      if (cardDomEls.length > 0) {
        tl.fromTo(
          cardDomEls,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.3'
        );
      }

      // 5. Project cards remain securely anchored with clean clearance
      if (cardsGridRef.current) {
        gsap.set(cardsGridRef.current, { y: 0 });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const headingWords = 'Featured Architectures'.split(' ');

  return (
    <div className={styles.homePage}>
      {/* Signature Interactive Hero */}
      <Hero />

      {/* Subtle Section Connector */}
      <div className={styles.sectionConnector} aria-hidden="true">
        <svg width="100%" height="40" viewBox="0 0 1200 40" fill="none">
          <path d="M 0,20 Q 300,38 600,20 T 1200,20" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        </svg>
      </div>

      {/* Editorial Bio & Feature Highlights */}
      <About />

      {/* Subtle Section Connector */}
      <div className={styles.sectionConnector} aria-hidden="true">
        <svg width="100%" height="40" viewBox="0 0 1200 40" fill="none">
          <path d="M 0,20 Q 400,2 800,20 T 1200,20" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        </svg>
      </div>

      {/* Trajectory & Milestones Timeline */}
      <Experience />

      {/* Subtle Section Connector */}
      <div className={styles.sectionConnector} aria-hidden="true">
        <svg width="100%" height="40" viewBox="0 0 1200 40" fill="none">
          <path d="M 0,20 Q 350,38 700,20 T 1200,20" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        </svg>
      </div>

      {/* Featured Production Work Showcase */}
      <section id="projects" ref={featuredSectionRef} className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div ref={featuredTagRef} className={styles.sectionTag}>
            <span>(03) Selected Production Systems</span>
          </div>

          <h2 className={styles.sectionTitle}>
            {headingWords.map((word, idx) => (
              <span key={idx} className={styles.wordWrapper}>
                <span ref={addHeadingWordRef} className={styles.headingWord}>
                  {word}&nbsp;
                </span>
              </span>
            ))}
          </h2>

          <p ref={featuredSubtitleRef} className={styles.sectionSubtitle}>
            High-impact enterprise solutions, intelligent automation platforms, and high-fidelity media engines.
          </p>
        </div>

        {/* Compact Editorial Featured Architectures Grid */}
        <div
          ref={cardsGridRef}
          className={styles.featuredGrid}
          onMouseLeave={() => setActiveCardIndex(null)}
        >
          {featuredArchitectures.map((project, index) => {
            const isDimmed = activeCardIndex !== null && activeCardIndex !== index;

            return (
              <FeaturedProjectCard
                key={project.id}
                ref={addCardCompRef}
                project={project}
                index={index}
                isDimmed={isDimmed}
                onCardHover={(idx) => setActiveCardIndex(idx)}
                onCardLeave={() => setActiveCardIndex(null)}
                onSelect={(proj) => setSelectedCaseStudy(proj)}
              />
            );
          })}
        </div>

        {/* View All Projects CTA */}
        <div className={styles.viewAllWrap}>
          <Magnetic strength={0.25} radius={90} maxOffset={10} arrowSelector=".magnetic-arrow">
            <Link
              to="/projects"
              className={styles.viewAllBtn}
              data-cursor="project"
              data-cursor-text="ALL WORKS"
            >
              <span>Explore All Projects & Architecture Showcase</span>
              <FiArrowRight size={16} className="magnetic-arrow" />
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* Subtle Section Connector */}
      <div className={styles.sectionConnector} aria-hidden="true">
        <svg width="100%" height="40" viewBox="0 0 1200 40" fill="none">
          <path d="M 0,20 Q 500,2 950,20 T 1200,20" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        </svg>
      </div>

      {/* Collaboration Launchpad — Final Interactive CTA Destination */}
      <CollaborationLaunchpad id="contact" />

      {/* Case Study Morph Modal */}
      {selectedCaseStudy && (
        <ProjectCaseStudy
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}
    </div>
  );
};

export default Home;
