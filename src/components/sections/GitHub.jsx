import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiCode } from 'react-icons/fi';
import styles from './GitHub.module.css';

/**
 * GitHub Section - Display GitHub repositories and stats
 */
const GitHub = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock GitHub repos data (in a real app, this would be fetched from GitHub API)
  useEffect(() => {
    const mockRepos = [
      {
        name: 'portfolio-v2',
        description: 'Modern portfolio website built with React, Vite, and Framer Motion',
        url: 'https://github.com',
        stars: 128,
        language: 'JavaScript',
      },
      {
        name: 'react-components-lib',
        description: 'Reusable React components library with TypeScript support',
        url: 'https://github.com',
        stars: 234,
        language: 'TypeScript',
      },
      {
        name: 'api-starter',
        description: 'Express.js API starter template with authentication and database',
        url: 'https://github.com',
        stars: 89,
        language: 'JavaScript',
      },
      {
        name: 'next-cms',
        description: 'Headless CMS built with Next.js and PostgreSQL',
        url: 'https://github.com',
        stars: 156,
        language: 'TypeScript',
      },
      {
        name: 'web-scraper',
        description: 'Web scraper utility for data extraction and processing',
        url: 'https://github.com',
        stars: 67,
        language: 'Python',
      },
      {
        name: 'design-tokens',
        description: 'Design tokens and theming system for web applications',
        url: 'https://github.com',
        stars: 102,
        language: 'CSS',
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setRepos(mockRepos);
      setLoading(false);
    }, 800);
  }, []);

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
      transition: { duration: 0.6 },
    },
  };

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    CSS: '#563d7c',
  };

  return (
    <section id="github" className={styles.github}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Open Source & Projects</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.stat}>
            <FiCode size={24} />
            <div>
              <h4>3+</h4>
              <p>major projects</p>
            </div>
          </div>
          <div className={styles.stat}>
            <FiStar size={24} />
            <div>
              <h4>Strong</h4>
              <p>Debugging & Problem Solving</p>

            </div>
          </div>
          <div className={styles.stat}>
            <FiGitBranch size={24} />
            <div>
              <h4>AI</h4>
              <p>Experience with AI Tools & API Integration</p>
            </div>
          </div>
        </motion.div>

        
        {/* GitHub CTA */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://github.com/chinmaywadhwa007"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All on GitHub →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHub;
