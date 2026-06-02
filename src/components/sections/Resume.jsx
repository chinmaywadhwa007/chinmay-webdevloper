import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiEye } from 'react-icons/fi';
import styles from './Resume.module.css';

/**
 * Resume Section - Download and view resume
 */
const Resume = () => {
  const education = [
    {
      degree: 'Bachelor of ECE',
      school: 'Jecrc Foundation',
      year: '2021-2024',
      description: 'Focused on web development, software engineering, and computer networks.',
    },
    {
      degree: 'Full Stack Web Development Bootcamp',
      school: 'upflairs',
      year: '2023 (3 months)',
      description: 'Intensive program covering React, Node.js, and modern web development practices.',
    },
  ];

  const certifications = [
    'full stack certification by  hitesh choudary udamy',
    'genAi certification by hitesh choudary udamy',
    'cybersequrity certification Learn & Build ',

  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="resume" className={styles.resume}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Resume & Qualifications</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* Resume Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.a
            href="/cwadhwa-resume.pdf"
            target="_blank"
            download="Chinmay-Wadhwa-Resume.pdf"
            className={styles.actionBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload size={20} />
            Download Resume
          </motion.a>
          <motion.a
            href="/cwadhwa-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.actionBtn} ${styles.secondary}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiEye size={20} />
            View Resume
          </motion.a>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Education */}
          <motion.div variants={itemVariants} className={styles.section}>
            <h3 className={styles.sectionTitle}>Education</h3>
            <div className={styles.list}>
              {education.map((item, index) => (
                <div key={index} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <h4>{item.degree}</h4>
                    <span className={styles.year}>{item.year}</span>
                  </div>
                  <p className={styles.school}>{item.school}</p>
                  <p className={styles.description}>{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={itemVariants} className={styles.section}>
            <h3 className={styles.sectionTitle}>Certifications & Achievements</h3>
            <div className={styles.certList}>
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className={styles.certItem}
                  whileHover={{ x: 5 }}
                >
                  <span className={styles.checkmark}>✓</span>
                  {cert}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className={styles.additionalInfo}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.infoCard}>
            <h4>Languages</h4>
            <p>English, Hindi</p>
          </div>
          <div className={styles.infoCard}>
            <h4>Interests</h4>
            <p>Web Development, UI/UX Design, Open Source, Tech Blogging, cybersecurity</p>
          </div>
          <div className={styles.infoCard}>
            <h4>Availability</h4>
            <p>Open to Full-Stack Developer, Backend Developer, and Software Engineer opportunities, security fields</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
