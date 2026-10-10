import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowUpRight,
  FiArrowUp,
  FiCopy,
  FiCheck,
  FiLayers,
} from 'react-icons/fi';
import BrandLogo from './BrandLogo';
import styles from './Footer.module.css';

/**
 * High-Craft Editorial Footer
 * Includes Callout CTA, Live IST Clock, Multi-Column Sitemap, Tech Foundation & Social Connects
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [istTime, setIstTime] = useState('');
  const [copied, setCopied] = useState(false);

  // Live India Standard Time (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setIstTime(formatted);
      } catch {
        setIstTime('IST (UTC+5:30)');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick 1-click email copy
  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('chinmaywadhwa01@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // Smooth back to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects', badge: 'Featured' },
    { label: 'Skills', path: '/skills', badge: 'Interactive' },
    { label: 'Experience', path: '/experience' },
    { label: 'About Me', path: '/about' },
    { label: 'Resume', path: '/resume' },
    { label: 'Contact', path: '/contact' },
  ];

  const techStack = [
    'React 19 & Next.js',
    'Node.js & Express',
    'PostgreSQL & Prisma',
    'Three.js & GSAP',
    'TypeScript & Tailwind',
    'System Architecture',
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      handle: '@chinmaywadhwa007',
      url: 'https://github.com/chinmaywadhwa007',
      icon: FiGithub,
    },
    {
      name: 'LinkedIn',
      handle: 'in/chinmay-wadhwa',
      url: 'https://www.linkedin.com/in/chinmay-wadhwa-898a39234/',
      icon: FiLinkedin,
    },
    {
      name: 'Email',
      handle: 'chinmaywadhwa01@gmail.com',
      url: 'mailto:chinmaywadhwa01@gmail.com',
      icon: FiMail,
    },
    {
      name: 'Phone',
      handle: '+91 8290087742',
      url: 'tel:+918290087742',
      icon: FiPhone,
    },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Ambient Top Glow */}
      <div className={styles.glowTop} aria-hidden="true" />

      <div className={styles.container}>
        {/* ============================================================
            1. CALL TO ACTION / COLLABORATION TEASER BANNER
            ============================================================ */}
        <section className={styles.ctaBanner} aria-label="Collaboration Inquiry">
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <div className={styles.availabilityPill}>
                <span className={styles.statusDot} />
                <span className={styles.availabilityText}>
                  AVAILABLE FOR SELECT ROLES & FREELANCE
                </span>
              </div>
              <h2 className={styles.ctaTitle}>
                Let's engineer something <span className={styles.titleAccent}>remarkable</span> together.
              </h2>
              <p className={styles.ctaSubtitle}>
                Have an architectural challenge, product concept, or looking for an engineer
                obsessed with speed, aesthetics, and reliability? Let's talk.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.primaryCtaBtn}>
                <span>Start a Project</span>
                <FiArrowUpRight className={styles.ctaArrowIcon} size={18} />
              </Link>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`${styles.secondaryCtaBtn} ${copied ? styles.copiedActive : ''}`}
                aria-label="Copy Chinmay's email address"
              >
                {copied ? (
                  <>
                    <FiCheck size={16} className={styles.btnIcon} />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <FiCopy size={16} className={styles.btnIcon} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. MAIN MULTI-COLUMN EDITORIAL GRID
            ============================================================ */}
        <div className={styles.mainGrid}>
          {/* Column 1: Brand & Real-Time Presence */}
          <div className={styles.colBrand}>
            <div className={styles.brandHeader}>
              <BrandLogo
                concept="signature"
                lockup="mark"
                size="md"
                variant="glass"
                interactive={true}
              />
              <div>
                <h3 className={styles.brandName}>Chinmay Wadhwa</h3>
                <p className={styles.brandRole}>Full Stack Developer & Systems Craftsman</p>
              </div>
            </div>

            <p className={styles.brandBio}>
              Bridging design precision with resilient backend architectures.
              Obsessed with high-performance web systems, micro-interactions, and scalable engineering.
            </p>

            {/* Live Presence Card */}
            <div className={styles.presenceCard}>
              <div className={styles.presenceRow}>
                <FiMapPin size={14} className={styles.presenceIcon} />
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div className={styles.presenceRow}>
                <FiClock size={14} className={styles.presenceIcon} />
                <span>
                  {istTime ? `${istTime} IST` : 'Local Time (IST)'}
                </span>
              </div>
              <div className={styles.presenceStatus}>
                <span className={styles.presenceDot} />
                <span>Active & Ready to Collaborate</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sitemap & Navigation */}
          <nav className={styles.colNav} aria-label="Footer Navigation">
            <h4 className={styles.colTitle}>
              <span className={styles.colNumber}>01</span>
              <span>SITEMAP</span>
            </h4>
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={styles.navLink}>
                    <span className={styles.linkText}>{link.label}</span>
                    {link.badge && (
                      <span className={styles.navBadge}>{link.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Stack & Core Competencies */}
          <div className={styles.colStack}>
            <h4 className={styles.colTitle}>
              <span className={styles.colNumber}>02</span>
              <span>TECH FOUNDATION</span>
            </h4>
            <div className={styles.stackTags}>
              {techStack.map((tech) => (
                <span key={tech} className={styles.stackTag}>
                  {tech}
                </span>
              ))}
            </div>
            <div className={styles.stackNote}>
              <FiLayers size={13} className={styles.stackNoteIcon} />
              <span>Optimized for 60fps fluidity, semantic accessibility, and clean modular code.</span>
            </div>
          </div>

          {/* Column 4: Channels & Social Network */}
          <div className={styles.colConnect}>
            <h4 className={styles.colTitle}>
              <span className={styles.colNumber}>03</span>
              <span>NETWORK</span>
            </h4>
            <div className={styles.socialCards}>
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialCard}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`${item.name}: ${item.handle}`}
                  >
                    <div className={styles.socialCardLeft}>
                      <span className={styles.socialIconWrap}>
                        <IconComponent size={15} />
                      </span>
                      <div className={styles.socialInfo}>
                        <span className={styles.socialName}>{item.name}</span>
                        <span className={styles.socialHandle}>{item.handle}</span>
                      </div>
                    </div>
                    <FiArrowUpRight size={14} className={styles.socialArrow} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thin Warm Divider */}
        <div className={styles.divider} />

        {/* ============================================================
            3. BOTTOM METADATA & REFINED COLOPHON
            ============================================================ */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>
              © {currentYear} Chinmay Wadhwa. All rights reserved.
            </p>
          </div>

          <div className={styles.bottomCenter}>
            <span className={styles.editorialBadge}>
              Designed with human care & editorial clarity
            </span>
            <span className={styles.metaDot} aria-hidden="true">·</span>
            <span className={styles.techBadge}>React 19 & Vite</span>
          </div>

          <div className={styles.bottomRight}>
            <button
              type="button"
              onClick={handleScrollToTop}
              className={styles.backToTopInline}
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <FiArrowUp size={14} className={styles.backToTopIcon} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
