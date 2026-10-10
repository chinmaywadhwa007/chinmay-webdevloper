import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkillItem from './SkillItem';
import { SKILLS_BY_CATEGORY } from './skillsData';
import styles from './SkillGrid.module.css';

/**
 * SkillGrid - Responsive card collection with staggered entrance on category change
 */
const SkillGrid = ({ activeCategory }) => {
  const skills = SKILLS_BY_CATEGORY[activeCategory] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        className={styles.skillsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {skills.map((skill) => (
          <motion.div key={skill.id} variants={itemVariants}>
            <SkillItem skill={skill} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillGrid;
