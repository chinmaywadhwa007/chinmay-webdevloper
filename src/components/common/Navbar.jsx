import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

/**
 * Navbar Component - Main navigation with theme toggle
 * Highlights active section and provides mobile menu
 */
const Navbar = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Smooth scroll to section
  const handleSectionClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Portfolio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {sections.map(section => (
            <motion.button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`${styles.navLink} ${activeSection === section.id ? styles.active : ''}`}
              whileHover={{ color: 'var(--primary)' }}
            >
              {section.label}
            </motion.button>
          ))}
        </div>

        {/* Right Actions */}
        <div className={styles.actions}>
          <motion.button
            onClick={toggleTheme}
            className={styles.themeToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            className={styles.mobileMenuBtn}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {sections.map(section => (
          <motion.button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={`${styles.mobileLink} ${activeSection === section.id ? styles.active : ''}`}
            whileHover={{ x: 8 }}
          >
            {section.label}
          </motion.button>
        ))}
      </motion.div>
    </nav>
  );
};

export default Navbar;
