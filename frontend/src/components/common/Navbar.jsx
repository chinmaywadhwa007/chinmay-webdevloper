import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import BrandLogo from './BrandLogo';
import styles from './Navbar.module.css';

/**
 * Editorial Floating Navbar
 * - Scroll-shrink (94% scale at scrollY > 50)
 * - Single shared pastel capsule travels between active tabs via Framer layoutId
 * - Per-route pastel identity: lavender / peach / sage / butter / blue / blush / beige
 * - IntersectionObserver tracks in-page sections on home route
 * - Mobile spring drawer
 */

// Per-route pastel identity — neutralized to light warm white capsule (#F2F0E8)
const PASTEL = {
  home:       { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  projects:   { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  skills:     { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  experience: { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  about:      { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  resume:     { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
  contact:    { bg: '#F2F0E8', shadow: 'rgba(0, 0, 0, 0.25)', border: 'transparent' },
};

const NAV_ITEMS = [
  { id: 'home',       path: '/',           label: 'Home' },
  { id: 'projects',   path: '/projects',   label: 'Projects' },
  { id: 'skills',     path: '/skills',     label: 'Skills' },
  { id: 'experience', path: '/experience', label: 'Experience' },
  { id: 'about',      path: '/about',      label: 'About' },
  { id: 'resume',     path: '/resume',     label: 'Resume' },
  { id: 'contact',    path: '/contact',    label: 'Contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen,     setIsOpen]     = useState(false);
  const [overAvoid,  setOverAvoid]  = useState(false);
  const [peek,       setPeek]       = useState(false);
  const location = useLocation();

  // ── Scroll shrink (shrinks navbar slightly when user scrolls down any page) ──
  //    + tuck away while a [data-nav-avoid] surface (e.g. architecture workspace) sits beneath it
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setIsScrolled(window.scrollY > 50);
      const zones = document.querySelectorAll('[data-nav-avoid]');
      let covered = false;
      zones.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < 80 && r.bottom > 24) covered = true;
      });
      setOverAvoid(covered);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    // Pointer near the top edge reveals the navbar again
    const onMove = (e) => setPeek(e.clientY < 96);
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, [location.pathname]);

  const isTucked = overAvoid && !peek && !isOpen;

  // ── Active item determined strictly by route path ────────────────
  const getActiveId = () => {
    if (location.pathname === '/') return 'home';
    for (const item of NAV_ITEMS) {
      if (item.path !== '/' && location.pathname.startsWith(item.path)) {
        return item.id;
      }
    }
    return 'home';
  };

  const activeId = getActiveId();
  const activePastel = PASTEL[activeId] || PASTEL.home;

  return (
    <>
      <header
        className={`${styles.navbarWrapper} ${isScrolled ? styles.navbarScrolled : ''} ${isTucked ? styles.navbarTucked : ''}`}
        role="banner"
      >
        <nav className={styles.navContainer} aria-label="Primary navigation">

          {/* CW Monogram — Primary Signature Mark */}
          <Link
            to="/"
            className={styles.logoLink}
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => {
              window.dispatchEvent(new CustomEvent('cw-logo-enter'));
            }}
            onMouseLeave={() => {
              window.dispatchEvent(new CustomEvent('cw-logo-leave'));
            }}
            title="Chinmay Wadhwa — Home"
            data-cursor="hover"
          >
            <BrandLogo
              concept="signature"
              lockup="mark"
              size="sm"
              variant="glass"
              interactive={false}
            />
          </Link>

          {/* Desktop Nav */}
          <div className={styles.navLinks}>
            {NAV_ITEMS.map(item => {
              const isActive = item.id === activeId;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  data-cursor={isActive ? 'nav-active' : 'nav'}
                  data-cursor-text={isActive ? undefined : 'GO'}
                >
                  {/* Subtle peach underline for active item */}
                  {isActive && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      className={styles.activeUnderline}
                      transition={{
                        layout: { type: 'spring', stiffness: 380, damping: 32 },
                      }}
                    />
                  )}
                  <span className={styles.navText}>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <div className={styles.mobileActions}>
            <button
              className={styles.mobileToggle}
              onClick={() => setIsOpen(v => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              data-cursor="hover"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileDrawer}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{   opacity: 0, y: -12,  scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            <div className={styles.mobileList}>
              {NAV_ITEMS.map(item => {
                const isActive = item.id === activeId;
                const pastel   = PASTEL[item.id] || PASTEL.home;

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={styles.mobileItem}
                    style={isActive ? {
                      backgroundColor: pastel.bg,
                      borderColor:     pastel.border,
                    } : {}}
                  >
                    <span>{item.label}</span>
                    {isActive
                      ? <span className={styles.mobileDot} style={{ background: activePastel.border }} />
                      : <FiArrowUpRight size={14} className={styles.mobileArrow} />
                    }
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
