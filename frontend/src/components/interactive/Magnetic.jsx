import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Reusable Magnetic Physics Wrapper
 * Gently attracts children toward pointer within a defined radius and supports independent nested arrow displacement.
 */
const Magnetic = ({
  children,
  strength = 0.32,
  radius = 120,
  maxOffset = 14,
  arrowSelector = null,
  className = '',
  style = {},
  onClick = () => {},
  ...props
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(pointer: coarse)').matches) return;

    let arrowEl = arrowSelector ? el.querySelector(arrowSelector) : null;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        // Distance-damped attraction
        const pull = Math.min(dist / radius, 1);
        const targetX = Math.max(-maxOffset, Math.min(maxOffset, dx * strength * pull));
        const targetY = Math.max(-maxOffset, Math.min(maxOffset, dy * strength * pull));

        gsap.to(el, {
          x: targetX,
          y: targetY,
          duration: 0.32,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Independent amplified movement for nested arrow
        if (arrowEl) {
          gsap.to(arrowEl, {
            x: targetX * 1.55,
            y: targetY * 1.55,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      } else {
        reset();
      }
    };

    const reset = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: 'elastic.out(1.15, 0.45)',
        overwrite: 'auto',
      });

      if (arrowEl) {
        gsap.to(arrowEl, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1.15, 0.45)',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseLeave = () => {
      reset();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
      if (arrowEl) gsap.killTweensOf(arrowEl);
    };
  }, [strength, radius, maxOffset, arrowSelector]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: 'inline-block', ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Magnetic;
