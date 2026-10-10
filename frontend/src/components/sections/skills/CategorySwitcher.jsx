import React from 'react';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from './skillsData';
import styles from './CategorySwitcher.module.css';

/**
 * Editorial Category Switcher with Layout Spring Indicator
 */
const CategorySwitcher = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className={styles.switcherWrapper}>
      <nav className={styles.switcherContainer} aria-label="Technical skills categories">
        {SKILL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${isActive ? styles.activeBtn : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              data-cursor="hover"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className={`${styles.activeIndicator} ${styles[`indicator_${cat.accent}`]}`}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}
              <span
                className={`${styles.btnDot} ${isActive ? styles.btnDotActive : ''}`}
                aria-hidden="true"
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CategorySwitcher;
