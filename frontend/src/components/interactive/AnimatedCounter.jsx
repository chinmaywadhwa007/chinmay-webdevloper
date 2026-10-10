import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated Counter with GSAP ScrollTrigger
 * Smoothly interpolates from 0 to target number with scale transition on entry.
 */
const AnimatedCounter = ({ targetValue = 0, suffix = '+', duration = 1.6, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const valObj = useRef({ val: 0 });

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          el,
          { scale: 0.82, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        gsap.to(valObj.current, {
          val: targetValue,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplayValue(Math.round(valObj.current.val));
          },
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(valObj.current);
    };
  }, [targetValue, duration]);

  return (
    <span ref={elementRef} className={className} style={{ display: 'inline-block' }}>
      {displayValue}{suffix}
    </span>
  );
};

export default AnimatedCounter;
