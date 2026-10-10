import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';
import { FiArrowRight } from 'react-icons/fi';
import styles from './ProjectHoverLabel.module.css';

/**
 * Small, editorial floating label that tracks the mouse inside project images
 */
const ProjectHoverLabel = forwardRef(({ text = 'VIEW PROJECT' }, ref) => {
  const labelRef = useRef(null);
  const xQuickTo = useRef(null);
  const yQuickTo = useRef(null);
  const isVisibleRef = useRef(false);

  useImperativeHandle(ref, () => ({
    onEnter: (x, y) => {
      const el = labelRef.current;
      if (!el) return;

      if (!xQuickTo.current) {
        xQuickTo.current = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3.out' });
        yQuickTo.current = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3.out' });
      }

      gsap.killTweensOf(el);
      gsap.set(el, { x, y });
      xQuickTo.current(x);
      yQuickTo.current(y);

      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'back.out(2)',
        overwrite: 'auto',
      });
      isVisibleRef.current = true;
    },

    onMove: (x, y) => {
      if (!isVisibleRef.current) return;
      if (xQuickTo.current) xQuickTo.current(x);
      if (yQuickTo.current) yQuickTo.current(y);
    },

    onLeave: () => {
      const el = labelRef.current;
      if (!el) return;
      isVisibleRef.current = false;
      gsap.to(el, {
        opacity: 0,
        scale: 0.7,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    },
  }));

  return (
    <div ref={labelRef} className={styles.hoverLabel} aria-hidden="true">
      <span>{text}</span>
      <FiArrowRight className={styles.arrowIcon} size={11} />
    </div>
  );
});

export default ProjectHoverLabel;
