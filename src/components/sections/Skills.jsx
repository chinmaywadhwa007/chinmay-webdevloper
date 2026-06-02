import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Skills.module.css';

/**
 * Skills Section - Categorized skill display with filtering
 */
const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');

  const skillsData = {
    frontend: [
      { name: 'React', level: 80 },
      { name: 'JavaScript', level: 85 },

      { name: 'HTML/CSS', level: 100 },
      { name: 'Tailwind CSS', level: 100 },
      { name: 'Framer Motion', level: 75 },
    ],
    backend: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 88 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'Python', level: 85 },
      { name: 'REST APIs', level: 90 },

    ],
    tools: [
  { name: 'Git', level: 80 },
  { name: 'GitHub', level: 80 },
  { name: 'Postman', level: 75 },
  { name: 'VS Code', level: 90 },
  { name: 'Linux', level: 75 },
]
  };

  const categories = Object.keys(skillsData);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Skills & Expertise</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          className={styles.categoryButtons}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          key={activeCategory}
          className={styles.skillsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {skillsData[activeCategory].map((skill, index) => (
            <motion.div
              key={skill.name}
              className={styles.skillCard}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className={styles.skillHeader}>
                <h3>{skill.name}</h3>
                <span className={styles.percentage}>{skill.level}%</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progress}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
