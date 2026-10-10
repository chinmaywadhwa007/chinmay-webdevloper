import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiExternalLink, FiGithub, FiGlobe, FiLayers, FiArrowRight } from 'react-icons/fi';
import VexoVideoExperience from '../interactive/VexoVideoExperience';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Editorial Project Card with pointer image parallax and cursor integration
 */
const InteractiveProjectCard = ({ project, index, activeProjectIndex }) => {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const titleRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = cardRef.current;
    const img = imgRef.current;
    const title = titleRef.current;
    if (!card || !img) return;

    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(img, {
      x: xPct * 12,
      y: yPct * 12,
      scale: 1.035,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (title) {
      gsap.to(title, {
        x: xPct * 5,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    const img = imgRef.current;
    const title = titleRef.current;
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
    if (title) {
      gsap.to(title, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  const accentClass = styles[`accent_${project.accent || 'sage'}`];
  const isVexo = project.id === 'vexo-music';

  return (
    <div
      ref={cardRef}
      className={`${styles.projectCard} ${accentClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Editorial Browser Mockup Header */}
      <div className={styles.browserHeader}>
        <div className={styles.browserDots}>
          <span className={`${styles.dot} ${styles.dot1}`} />
          <span className={`${styles.dot} ${styles.dot2}`} />
          <span className={`${styles.dot} ${styles.dot3}`} />
        </div>

        <div className={styles.browserUrl} title={project.domain}>
          <FiGlobe className={styles.globeIcon} size={12} />
          <span>{project.domain}</span>
        </div>

        {project.isLive ? (
          <div className={styles.liveBadge} title="Active in Production">
            <span className={styles.liveDot} />
            <span>Live</span>
          </div>
        ) : (
          <div className={styles.codeBadge}>
            <span>Architecture</span>
          </div>
        )}
      </div>

      {/* Visual Media Container: VEXO gets Video.js, others get interactive image */}
      {isVexo ? (
        <VexoVideoExperience />
      ) : (
        <div
          className={styles.imageContainer}
          data-cursor="project"
          data-cursor-text="VIEW"
        >
          <img
            ref={imgRef}
            src={project.image}
            alt={project.title}
            className={styles.projectImage}
            loading="lazy"
          />
        </div>
      )}

      {/* Card Content */}
      <div className={styles.content}>
        <div className={styles.cardMeta}>
          <span className={styles.categoryLabel}>{project.categoryLabel}</span>
          <span className={styles.projectIndexNumber}>0{index + 1}</span>
        </div>

        <h3 ref={titleRef} className={styles.projectTitle}>
          {project.title}
        </h3>
        <h4 className={styles.projectSubtitle}>{project.subtitle}</h4>
        <p className={styles.description}>{project.description}</p>

        {/* Small Neutral Tags */}
        <div className={styles.tags}>
          {project.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons: Charcoal & Muted Plum */}
        <div className={styles.cardActions}>
          {project.liveUrl !== '#' ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtnPrimary}
              data-cursor="link"
              data-cursor-text="LAUNCH"
            >
              <span>Launch Platform</span>
              <FiExternalLink size={14} />
            </a>
          ) : null}

          {project.githubUrl !== '#' ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtnSecondary}
              data-cursor="link"
              data-cursor-text="SOURCE"
            >
              <FiGithub size={14} />
              <span>Source Code</span>
            </a>
          ) : (
            project.liveUrl === '#' && (
              <span className={styles.internalBadge}>Enterprise Proprietary</span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Featured Projects Section with Cinematic Entry and Responsive Grid/Story
 */
const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef(null);
  const titleWordsRef = useRef([]);
  titleWordsRef.current = [];

  const addTitleWordRef = (el) => {
    if (el && !titleWordsRef.current.includes(el)) {
      titleWordsRef.current.push(el);
    }
  };

  const filterCategories = [
    { id: 'all', label: 'All Works' },
    { id: 'enterprise', label: 'Enterprise & AI' },
    { id: 'frontend', label: 'Frontend & Media' },
    { id: 'backend', label: 'Backend & Cloud' },
    { id: 'fullstack', label: 'Full Stack' },
  ];

  const projectsData = [
    {
      id: 'dezoryn',
      title: 'Dezoryn Technologies',
      subtitle: 'Enterprise Business Automation & Intelligent Platform',
      description:
        'Architected intelligent enterprise platforms unifying CRM, Cloud ERP, and AI Neural Engines. Built with PostgreSQL, React 18, JWT RBAC, and intelligent workflow orchestration.',
      image: '/dezoryn.png',
      domain: 'dezoryntechnology.com',
      liveUrl: 'https://www.dezoryntechnology.com/',
      githubUrl: '#',
      category: 'enterprise',
      categoryLabel: 'Enterprise & AI',
      accent: 'sage', // Soft Sage Accent
      isLive: true,
      tags: ['React 18', 'PostgreSQL', 'AI Core 3.0', 'Enterprise ERP', 'JWT RBAC'],
    },
    {
      id: 'vexo-music',
      title: 'VEXO Music Entertainment',
      subtitle: 'Sonic Architecture & Global Entertainment Platform',
      description:
        'Pioneering original soundscapes, artist development, and high-fidelity media streaming. Powered by Video.js ambient playback, custom sound player architecture, and studio service bookings.',
      image: '/vexo.png',
      domain: 'vexo-music-fxwa-steel.vercel.app',
      liveUrl: 'https://vexo-music-fxwa-steel.vercel.app/',
      githubUrl: '#',
      category: 'frontend',
      categoryLabel: 'Frontend & Media',
      accent: 'peach', // Muted Peach Accent
      isLive: true,
      tags: ['React', 'Next.js', 'Video.js', 'Web Audio API', 'Framer Motion'],
    },
    {
      id: 'digimate-tech-digital',
      title: 'Digimate Tech Digital Solutions',
      subtitle: 'Enterprise Full-Stack Web Platform & Digital Solutions',
      description:
        'Full-stack enterprise platform engineered with React, TypeScript, Tailwind CSS, and Node.js. Architected complete end-to-end solutions unifying responsive client interfaces, scalable RESTful APIs, and PostgreSQL database workflows.',
      image: '/digimate-platform.png',
      domain: 'digimatetechdigital.com',
      liveUrl: 'https://digimatetechdigital.com/',
      githubUrl: '#',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      accent: 'lavender', // Soft Lavender Accent
      isLive: true,
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Cloud Architecture'],
    },
    {
      id: 'skill-loop',
      title: 'SkillLoop Platform',
      subtitle: 'Peer-to-Peer Skill Exchange & Arena',
      description:
        'Full-stack skill exchange platform connecting learners and mentors through a virtual economy. Users share knowledge, earn currency, and participate in collaborative learning arenas.',
      image: '/page.png',
      domain: 'skilloop-omega.vercel.app',
      liveUrl: 'https://skilloop-omega.vercel.app/',
      githubUrl: 'https://github.com/chinmaywadhwa007/skilloop-a-skill-exchange-platform-',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      accent: 'butter', // Soft Butter Accent
      isLive: true,
      tags: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Framer Motion'],
    },
    {
      id: 'shopease',
      title: 'ShopEase E-Commerce',
      subtitle: 'Full-Stack Modern Commerce & Payment Platform',
      description:
        'Full-stack e-commerce application featuring Stripe payment processing, real-time inventory management, reactive cart state synchronization, and secure authentication.',
      image: '/shopease.png',
      domain: 'shopease.store',
      liveUrl: '#',
      githubUrl: '#',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      accent: 'sage', // Soft Sage Accent
      isLive: false,
      tags: ['React', 'Stripe API', 'Node.js', 'Express', 'Cart Sync'],
    },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projectsData
      : projectsData.filter((proj) => proj.category === activeCategory);

  // Cinematic Entry Animation on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Large typography word-by-word reveal
      gsap.fromTo(
        titleWordsRef.current,
        {
          opacity: 0,
          y: 40,
          rotateX: 45,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const headlineWords = 'Engineered Platforms'.split(' ');

  return (
    <section id="projects" ref={sectionRef} className={styles.projects}>
      <div className={styles.container}>
        {/* Section Header with Staggered Word Reveal */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>
            <span>(03) Selected Works & Architectures</span>
          </div>

          <h2 className={styles.title}>
            {headlineWords.map((word, i) => (
              <span key={i} className={styles.wordWrapper}>
                <span ref={addTitleWordRef} className={styles.headingWord}>
                  {word}&nbsp;
                </span>
              </span>
            ))}
          </h2>

          <p className={styles.subtitle}>
            Production applications, enterprise automation engines, full-stack ecosystems, and interactive media platforms.
          </p>
        </div>

        {/* Minimal Editorial Filter Pills */}
        <div className={styles.filterContainer}>
          {filterCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                data-cursor="hover"
              >
                <span className={styles.filterBtnText}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project, index) => (
            <InteractiveProjectCard
              key={project.id}
              project={project}
              index={index}
              activeProjectIndex={0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
