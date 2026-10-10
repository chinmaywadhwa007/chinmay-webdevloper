import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ScrollProgress.module.css';

/**
 * ScrollProgress Component - Visual indicator of page scroll position
 */
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={styles.progressBar}
      style={{ width: `${scrollProgress}%` }}
      initial={{ width: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default ScrollProgress;
