import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import styles from './Hero.module.css';

/**
 * Hero Section - Typewriter effect and main CTA
 */
const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Full Stack Developer | GenAI Enthusiast';
  const typingSpeed = 100;

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const scrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className={styles.hero}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className={styles.greeting}>
          <span className={styles.wave}>👋</span>
          <p>Welcome to my portfolio</p>
        </motion.div>

        {/* Main Title */}
        <motion.h1 variants={itemVariants} className={styles.title}>
          <span className={styles.name}>chinmay wadhwa </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.h2 variants={itemVariants} className={styles.subtitle}>
          {displayText}
          <span className={styles.cursor}>|</span>
        </motion.h2>

        {/* Description */}
        <motion.p variants={itemVariants} className={styles.description}>
          I build full-stack web apps using Next.js, Node.js, and MongoDB. Recently shipped skill-loop and FrostFlow — check them out below.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className={styles.ctas}>
          <motion.button
            className={styles.ctaPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Let's Connect
          </motion.button>
          <motion.button
            className={styles.ctaSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const projectsSection = document.getElementById('projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            View My Project
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={scrollDown}
        >
          <FiArrowDown size={24} />
        </motion.button>
      </motion.div>

      {/* Background Elements */}
      <div className={styles.bgElements}>
        <motion.div
          className={styles.gradientBlob1}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className={styles.gradientBlob2}
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>
    </section>
  );
};

export default Hero;
