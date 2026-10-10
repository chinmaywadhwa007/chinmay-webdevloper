import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiCode, FiExternalLink } from 'react-icons/fi';
import styles from './GitHub.module.css';

/**
 * Editorial GitHub Section - Open source statistics and repository link
 */
const GitHub = () => {
  const stats = [
    {
      icon: FiCode,
      number: '3+',
      label: 'Production Systems',
      desc: 'Full-stack enterprise architectures shipped',
      accent: 'sage',
    },
    {
      icon: FiStar,
      number: 'High',
      label: 'System Reliability',
      desc: 'API debugging & query performance profiling',
      accent: 'lavender',
    },
    {
      icon: FiGitBranch,
      number: 'Modern',
      label: 'Cloud & AI Integration',
      desc: 'Experience with REST pipelines & neural APIs',
      accent: 'peach',
    },
  ];

  return (
    <section id="github" className={styles.github}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionTag}>
            <span>Open Source & Public Repositories</span>
          </div>
          <h2 className={styles.title}>GitHub & Code Repositories</h2>
          <p className={styles.subtitle}>
            Continuous learning through open source exploration, experimental prototypes, and clean code documentation.
          </p>
        </motion.div>

        {/* GitHub Highlight Stats */}
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`${styles.statCard} ${styles[`card_${stat.accent}`]}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className={`${styles.iconWrap} ${styles[`icon_${stat.accent}`]}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className={styles.statNumber}>{stat.number}</div>
                  <h4 className={styles.statLabel}>{stat.label}</h4>
                  <p className={styles.statDesc}>{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className={styles.ctaWrapper}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://github.com/chinmaywadhwa007"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            <span>Visit @chinmaywadhwa007 on GitHub</span>
            <FiExternalLink size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHub;
