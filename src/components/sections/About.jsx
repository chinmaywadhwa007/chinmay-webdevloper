
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiPenTool, FiTrendingUp } from 'react-icons/fi';
import styles from './About.module.css';



const About = () => {
  const highlights = [
    {
      icon: FiCode,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable code following best practices and design patterns.',
    },
    {
      icon: FiTrendingUp,
      title: '6 months of intership exp @ kvon-technologies',
      description: 'Creating beautiful user interfaces with attention to detail and user experience.',
    },
    {
      icon: FiPenTool,
      title: 'Problem Solving',
      description: 'Debugging applications, fixing API issues, and continuously improving system reliability and performance.',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        {/* Section Title */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>About Me</h2>
          <div className={styles.underline} />
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>



            {/* Bio */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <motion.div variants={itemVariants} className={styles.bio}>
                <p>
                  I'm Chinmay Wadhwa, a Full-Stack Developer with experience building web applications using React, Node.js, MongoDB, and PostgreSQL. I enjoy solving real-world problems through clean code, scalable backend systems, and user-friendly interfaces.
                </p>
                <br />
                <p>
                  When I'm not coding, you'll usually find me preparing for technical interviews, learning new technologies, working on personal projects, or creating content around bikes and technology.
                </p>
              </motion.div>
            </div>

          </div>


          {/* Highlights */}
          <div className={styles.highlights}>
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className={styles.highlight}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className={styles.iconBox}>
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.stat}>
            <h4>6</h4>
            <p>months Experience</p>
          </div>
          <div className={styles.stat}>
            <h4>3 major projects + min projects </h4>
            <p>Projects Completed</p>
          </div>
          <div className={styles.stat}>
            <h4>10+</h4>
            <p>technologies used</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
