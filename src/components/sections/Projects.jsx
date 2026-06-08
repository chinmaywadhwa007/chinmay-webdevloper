import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import styles from './Projects.module.css';

/**
 * Projects Section - Showcase of featured projects
 */
const Projects = () => {
  const projects = [
    {
      title: 'ShopEase',
      description: 'Full-stack e-commerce application with payment integration, inventory management, and user authentication.',
      image: '/shopease.png',
      tags: ['React', 'tailwind css', 'stitch for desiging ', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      title: 'skill-loop ',
      description: 'SkillLoop is a full-stack skill exchange platform designed to connect learners and mentors through a coin-based ecosystem. Users can teach skills they are proficient in, earn virtual coins, and use those coins to learn new skills from others within the community. The platform encourages collaborative learning while rewarding knowledge sharing.',
      image: '/public/skilloop- page.png',
      tags: ['React', 'node.js', 'Tailwind CSS', 'Framer Motion', 'backend', 'mongodb'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      title: 'Frost-flow',
      description: 'FrostFlow is a full-stack task management platform designed to help individuals and teams organize, track, and manage their daily tasks efficiently. The platform provides a clean and intuitive interface for creating, updating, prioritizing, and monitoring tasks while ensuring secure access through modern authentication mechanisms.',
      image: 'https://images.unsplash.com/photo-1677442d019cecf3d7453fa920f8ef1cff2768d5e?w=600&h=400&fit=crop',
      tags: ['React', 'OpenAI API', 'TypeScript', 'Vercel'],
      liveUrl: '#',
      githubUrl: '#',
    },

  ];

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

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Featured Projects</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className={styles.projectsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className={styles.projectCard}
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              {/* Image Container */}
              <div className={styles.imageContainer}>
                <img src={project.image} alt={project.title} />
                <div className={styles.overlay}>
                  <div className={styles.links}>
                    <motion.a
                      href={project.liveUrl}
                      className={styles.link}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Live"
                    >
                      <FiExternalLink size={24} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      className={styles.link}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Code"
                    >
                      <FiGithub size={24} />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={styles.content}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {/* Tags */}
                <div className={styles.tags}>
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
