import React from 'react';
import { motion } from 'framer-motion';
import About from '../components/sections/About';
import Resume from '../components/sections/Resume';

/**
 * About Page - Biography, background, engineering philosophy, and downloadable resume
 */
const AboutPage = () => {
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      className="aboutPageTheme"
      data-page="about"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh', paddingTop: '2rem', backgroundColor: '#0A0A09' }}
    >
      <About />
      <Resume />
    </motion.div>
  );
};

export default AboutPage;
