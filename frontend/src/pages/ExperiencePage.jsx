import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Experience from '../components/sections/Experience';

/**
 * Experience Page - Professional journey, industry roles, and engineering impact
 * Visual Identity: Ice Blue / Frost on Deep Charcoal (#0B0D0D)
 */
const ExperiencePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="experiencePageTheme"
      data-page="experience"
      style={{
        minHeight: '100vh',
        paddingTop: '2rem',
        backgroundColor: '#0B0D0D',
        color: '#F2F0E9',
      }}
    >
      <Experience />
    </motion.div>
  );
};

export default ExperiencePage;
