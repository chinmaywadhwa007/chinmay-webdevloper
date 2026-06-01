import React from 'react';
import {  motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';
import styles from './Experience.module.css';

/**
 * Experience Section - Timeline of work experience
 */
const Experience = () => {
  const experiences = [

    {
      degree: 'Bachelor of Technology (ECE)',
      college: 'JECRC Foundation',
      duration: 'Nov 2021 - May 2025',
      description:
        'Completed B.Tech in Electronics and Communication Engineering while building full-stack web development skills.',
      achievements: [
        'Learned React, Node.js, MongoDB, and PostgreSQL',
        'Built FrostFlow, SkillLoop, and ShopEase projects',
        'Completed Full Stack Development training',
        'Prepared for software engineering and full-stack roles',
      ],
    },
    {
      role: 'Junior Full-Stack Developer Intern',
      company: 'Kvon Technologies',
      duration: 'Feb 2025 - Jul 2025',
      description:
        'Worked on backend debugging, API integrations, database optimization, and authentication systems for production applications.',
      achievements: [
        'Improved database performance through query optimization and indexing',
        'Debugged backend issues using API logs and database inspection',
        'Implemented JWT authentication and RBAC authorization',
        'Worked with MongoDB, SQL, and REST APIs',
      ],
    },
  ];




  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Experience</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className={styles.timelineItem}
              variants={itemVariants}
            >
              {/* Timeline Marker */}
              <div className={styles.marker}>
                <div className={styles.markerDot} />
              </div>

              {/* Content Card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleSection}>
                    <div className={styles.iconBox}>
                      <FiBriefcase size={20} />
                    </div>
                    <div>
                      <h3>{exp.role}</h3>
                      <p className={styles.company}>{exp.company}</p>
                    </div>
                  </div>
                  <span className={styles.duration}>{exp.duration}</span>
                </div>

                <p className={styles.description}>{exp.description}</p>

                {/* Achievements */}
                <ul className={styles.achievements}>
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>
                      <span className={styles.bullet}>✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
