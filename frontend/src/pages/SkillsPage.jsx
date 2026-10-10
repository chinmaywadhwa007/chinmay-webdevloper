import React from 'react';
import { motion } from 'framer-motion';
import Skills from '../components/sections/Skills';

/**
 * Skills Page - Comprehensive breakdown of languages, frameworks, databases, and tooling
 */
const SkillsPage = () => {
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
      className="skillsTheme"
      data-page="skills"
      style={{ minHeight: '100vh', paddingTop: '2rem', background: '#0B0C0C' }}
    >
      <Skills />
    </motion.div>
  );
};

export default SkillsPage;
