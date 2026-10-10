import React from 'react';
import { motion } from 'framer-motion';
import Contact from '../components/sections/Contact';

/**
 * Contact Page - Interactive contact portal connected to PostgreSQL/pgAdmin backend API
 */
const ContactPage = () => {
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
      style={{ minHeight: '100vh', paddingTop: '2rem' }}
    >
      <Contact />
    </motion.div>
  );
};

export default ContactPage;
