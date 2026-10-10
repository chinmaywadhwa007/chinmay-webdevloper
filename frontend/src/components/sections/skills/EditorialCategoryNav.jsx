import React from 'react';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from './skillsData';
import styles from './EditorialCategoryNav.module.css';

/**
 * Editorial Category Navigation
 * Minimal horizontal typography navigation with delicate pastel underline
 * Replaces bulky pill containers with open editorial layout.
 */
const EditorialCategoryNav = ({ activeCategory, onSelectCategory }) => {
  return (
    <nav className={styles.nav} aria-label="Technical disciplines">
      <div className={styles.navRow}>
        {SKILL_CATEGORIES.map((cat, idx) => {
          const isActive = activeCategory === cat.id;

          return (
            <React.Fragment key={cat.id}>
              {idx > 0 && <span className={styles.interpunct} aria-hidden="true">·</span>}

              <button
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                data-cursor="hover"
              >
                <span className={styles.itemLabel}>{cat.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="categoryUnderline"
                    className={styles.activeUnderline}
                    style={{ backgroundColor: '#B8A9C9' }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default EditorialCategoryNav;
