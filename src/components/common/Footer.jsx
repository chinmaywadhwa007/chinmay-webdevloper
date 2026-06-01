import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import styles from './Footer.module.css';

/**
 * Footer Component - Social links and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      icon: FiGithub,
      url: 'https://github.com',
      label: 'GitHub',
    },
    {
      icon: FiLinkedin,
      url: 'https://www.linkedin.com/feed/',
      label: 'LinkedIn',
    },
  
    
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Social Links */}
          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={styles.socialLink}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className={styles.copyright}>
            © {currentYear} Your Name. All rights reserved.
          </p>

          {/* Design Credit */}
          <p className={styles.credit}>
            Crafted with passion and React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
