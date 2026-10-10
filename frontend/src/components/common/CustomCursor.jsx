import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useCursor } from '../../context/CursorContext';
import styles from './CustomCursor.module.css';

/**
 * Signature High-End Custom Cursor
 * - Physics-driven follow with velocity elongation elsewhere across the site.
 * - Refined micro-detail floating "GO" capsule specifically for navbar items:
 *   • Target size: ~36x22px (tablet ~34x20px), rounded capsule.
 *   • Typography: 9.5px, 600 weight, 0.04em letter-spacing, white text.
 *   • Styling: Dark charcoal (#242321), soft shadow, 0.92 opacity, no glow, no border.
 *   • Position: Floats ABOVE the navbar item with 8-12px vertical separation (no text overlap).
 *   • Movement: Smooth horizontal tracking with subtle lag behind pointer.
 *   • Enter/Leave animations: 4px -> 0 rise with 0.85 -> 1 scale on enter; 0 -> -3px float on leave.
 *   • Active item rule: Does NOT show GO when hovering an active item (preserves pastel capsule).
 *   • Disabled completely on touch/mobile devices.
 */

/* Cursor palette — mirrors the exact Forest Green & Charcoal tokens in index.css */
const CURSOR = {
  white: '#F2F0E8',
  sage: '#AEBFA7',
  sageLine: 'rgba(174, 191, 167, 0.45)',
  forest: '#183A2A',
  deepForest: '#141615',
  darkGreen: '#E7B8A8',
  mutedForest: '#C7BBD3',
  paleSage: '#E5D8BD',
  charcoal: '#0D0E0D',
};

const CustomCursor = () => {
  const { cursorType, cursorText, setCursor, resetCursor } = useCursor();
  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position and velocity state stored in refs for 120fps performance
  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const velRef = useRef({ x: 0, y: 0, speed: 0 });
  const targetPosRef = useRef({ x: -100, y: -100 });

  // Navbar hover state refs
  const isNavHoveredRef = useRef(false);
  const navTargetRef = useRef(null);
  const navAnimRef = useRef({ y: 0, scale: 1, opacity: 0 });

  // Keep type & text in sync without tearing down listeners
  const cursorTypeRef = useRef(cursorType);
  const cursorTextRef = useRef(cursorText);
  useEffect(() => {
    cursorTypeRef.current = cursorType;
    cursorTextRef.current = cursorText;
  }, [cursorType, cursorText]);

  useEffect(() => {
    // Detect touch / coarse pointer / mobile devices
    const checkTouch = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 
                      window.matchMedia('(hover: none)').matches || 
                      window.innerWidth <= 768 ||
                      'ontouchstart' in window;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize GSAP centered transform
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // GSAP quickTo setters for buttery 120fps performance
    const xTo = gsap.quickTo(cursor, 'x', { duration: prefersReducedMotion ? 0.05 : 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: prefersReducedMotion ? 0.05 : 0.28, ease: 'power3.out' });
    const scaleXTo = gsap.quickTo(cursor, 'scaleX', { duration: 0.22, ease: 'power2.out' });
    const scaleYTo = gsap.quickTo(cursor, 'scaleY', { duration: 0.22, ease: 'power2.out' });
    const rotateTo = gsap.quickTo(cursor, 'rotation', { duration: 0.2, ease: 'power2.out' });

    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      targetPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Physics update tick
    const updatePhysics = () => {
      const target = targetPosRef.current;
      const current = posRef.current;
      const prev = prevPosRef.current;

      if (isNavHoveredRef.current && navTargetRef.current) {
        // ── NAVBAR MICRO-CAPSULE POSITIONING ────────────────────────
        const navRect = navTargetRef.current.getBoundingClientRect();
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        const targetHeight = isTablet ? 20 : 22;
        const halfHeight = targetHeight / 2;
        const verticalSeparation = 8; // 8px vertical separation below nav item

        // Position downwards BELOW the navigation item (never cut off by top of viewport)
        const destY = navRect.bottom + verticalSeparation + halfHeight + navAnimRef.current.y;

        // Smooth cursor-following horizontal movement clamped gracefully to nav item
        const padding = 14;
        const minX = navRect.left + padding;
        const maxX = navRect.right - padding;
        const destX = minX >= maxX
          ? (navRect.left + navRect.right) / 2
          : Math.max(minX, Math.min(maxX, target.x));

        // Subtle lag behind pointer (lerp 0.24 for soft following)
        current.x += (destX - current.x) * 0.24;
        current.y += (destY - current.y) * 0.32;

        xTo(current.x);
        yTo(current.y);

        // Apply scale & neutral rotation
        scaleXTo(navAnimRef.current.scale);
        scaleYTo(navAnimRef.current.scale);
        rotateTo(0);

        // Apply opacity directly
        if (cursor) {
          cursor.style.opacity = navAnimRef.current.opacity;
        }
      } else {
        // ── STANDARD GLOBAL CUSTOM CURSOR PHYSICS ───────────────────
        current.x += (target.x - current.x) * 0.35;
        current.y += (target.y - current.y) * 0.35;

        const dx = current.x - prev.x;
        const dy = current.y - prev.y;
        const speed = Math.hypot(dx, dy);

        velRef.current = { x: dx, y: dy, speed };
        prevPosRef.current = { x: current.x, y: current.y };

        xTo(current.x);
        yTo(current.y);

        if (cursor) {
          cursor.style.opacity = isVisible ? '1' : '0';
        }

        // Velocity elongation & rotation (only when not showing text)
        if (!cursorTextRef.current && !prefersReducedMotion) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const stretch = Math.min(speed * 0.018, 0.45);
          const squeeze = Math.min(speed * 0.01, 0.22);

          if (speed > 1.5) {
            scaleXTo(1 + stretch);
            scaleYTo(1 - squeeze);
            rotateTo(angle);
          } else {
            scaleXTo(1);
            scaleYTo(1);
          }
        } else {
          scaleXTo(1);
          scaleYTo(1);
          rotateTo(0);
        }
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(updatePhysics);

    // ── NAVBAR ENTRANCE & LEAVE ANIMATIONS ─────────────────────────
    const triggerNavEnter = (targetEl, text) => {
      navTargetRef.current = targetEl;
      isNavHoveredRef.current = true;

      gsap.killTweensOf(navAnimRef.current);

      // On navbar hover (floating downwards):
      // starts -4px and eases downwards to 0, opacity 0 -> 0.92, scale 0.85 -> 1
      navAnimRef.current.y = -4;
      navAnimRef.current.scale = 0.85;
      navAnimRef.current.opacity = 0;

      gsap.to(navAnimRef.current, {
        y: 0,
        scale: 1,
        opacity: 0.92,
        duration: 0.20,
        ease: 'power2.out',
      });

      setCursor('nav', text || 'GO');
    };

    const triggerNavLeave = (onDone) => {
      if (!isNavHoveredRef.current) {
        if (onDone) onDone();
        return;
      }

      gsap.killTweensOf(navAnimRef.current);

      // When leaving:
      // opacity: 0.92 -> 0, scale: 1 -> 0.9, y: 0 -> 3px (eases slightly downward as it fades), duration: 0.18s
      gsap.to(navAnimRef.current, {
        y: 3,
        scale: 0.9,
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          isNavHoveredRef.current = false;
          navTargetRef.current = null;
          if (onDone) onDone();
        },
      });
    };

    const evaluateTarget = (element) => {
      const target = element.closest('[data-cursor], [data-cursor-text], a, button');
      if (!target) return;

      const declaredType = target.getAttribute('data-cursor');
      const declaredText = target.getAttribute('data-cursor-text');

      if (declaredType || declaredText) {
        setCursor(declaredType || 'hover', declaredText || '');
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button') {
        setCursor('link', '');
      }
    };

    // Document mouseover listener
    const handleDocumentOver = (e) => {
      // 1. If hovering an active navbar item, DO NOT show GO and do not compete with pastel capsule
      const navActive = e.target.closest('[data-cursor="nav-active"]');
      if (navActive) {
        if (isNavHoveredRef.current) {
          triggerNavLeave(() => resetCursor());
        } else {
          resetCursor();
        }
        return;
      }

      // 2. If hovering an inactive navbar link, show tiny GO label
      const navItem = e.target.closest('[data-cursor="nav"]');
      if (navItem) {
        const text = navItem.getAttribute('data-cursor-text') || 'GO';
        if (isNavHoveredRef.current && navTargetRef.current) {
          // Gliding smoothly between inactive nav items
          navTargetRef.current = navItem;
          setCursor('nav', text);
        } else {
          // Fresh entrance from outside
          triggerNavEnter(navItem, text);
        }
        return;
      }

      // 3. If leaving nav items to another element
      if (isNavHoveredRef.current) {
        triggerNavLeave(() => evaluateTarget(e.target));
        return;
      }

      evaluateTarget(e.target);
    };

    // Document mouseout listener
    const handleDocumentOut = (e) => {
      const currentNav = e.target.closest('[data-cursor="nav"]');
      if (currentNav) {
        const nextNav = e.relatedTarget?.closest?.('[data-cursor="nav"]');
        if (nextNav) {
          // Direct switch between nav items is handled by handleDocumentOver
          return;
        }
        // Left the navbar links completely
        triggerNavLeave(() => resetCursor());
        return;
      }

      const target = e.target.closest('[data-cursor], [data-cursor-text], a, button');
      if (target && !isNavHoveredRef.current) {
        resetCursor();
      }
    };

    document.addEventListener('mouseover', handleDocumentOver, { passive: true });
    document.addEventListener('mouseout', handleDocumentOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleDocumentOver);
      document.removeEventListener('mouseout', handleDocumentOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isTouchDevice, setCursor, resetCursor]);

  // Transition size and appearance on cursorType or text change
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const label = labelRef.current;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

    if (cursorType === 'nav') {
      // ── NAVBAR MICRO-CAPSULE ────────────────────────────────────
      const width = isTablet ? 34 : 36;
      const height = isTablet ? 20 : 22;

      gsap.to(cursor, {
        width,
        height,
        borderRadius: 9999,
        backgroundColor: '#201F1E',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        duration: 0.20,
        ease: 'power2.out',
      });

      if (label) {
        gsap.to(label, {
          opacity: 1,
          scale: 1,
          fontSize: isTablet ? '9px' : '9.5px',
          fontWeight: '600',
          letterSpacing: '0.04em',
          color: '#F2F0E8',
          duration: 0.18,
          ease: 'power2.out',
        });
      }
    } else if (cursorText) {
      // ── GLOBAL CUSTOM CURSOR PILL (Projects, Skills, etc.) ──────
      let pillBg = CURSOR.deepForest;
      let pillColor = CURSOR.white;
      let pillBorder = '1px solid rgba(229, 216, 189, 0.22)';
      const darkBorder = '1px solid rgba(16, 39, 29, 0.35)';

      if (cursorType === 'project' || cursorType === 'architecture') {
        pillBg = CURSOR.sage;
        pillColor = CURSOR.charcoal;
        pillBorder = darkBorder;
      } else if (cursorType === 'tech' || cursorType === 'technology' || cursorType === 'skills') {
        pillBg = '#B8A9C9';
        pillColor = '#0B0C0C';
        pillBorder = '1px solid rgba(81, 70, 95, 0.5)';
      } else if (cursorType === 'contact' || cursorType === 'cta') {
        pillBg = CURSOR.paleSage;
        pillColor = CURSOR.charcoal;
        pillBorder = darkBorder;
      }

      gsap.to(cursor, {
        width: Math.max(cursorText.length * 8 + 36, 68),
        height: 34,
        borderRadius: 9999,
        backgroundColor: pillBg,
        border: pillBorder,
        boxShadow: '0 8px 24px rgba(11, 13, 12, 0.5)',
        duration: 0.28,
        ease: 'power3.out',
      });

      if (label) {
        gsap.to(label, {
          opacity: 1,
          scale: 1,
          fontSize: '0.68rem',
          fontWeight: '700',
          letterSpacing: '0.08em',
          color: pillColor,
          duration: 0.22,
          delay: 0.05,
          ease: 'power2.out',
        });
      }
    } else {
      // ── CIRCLE STATES BASED ON TYPE ─────────────────────────────
      let size = 12;
      let bg = 'rgba(242, 240, 232, 0.92)'; // default — warm white
      let border = '1px solid rgba(11, 13, 12, 0.4)';

      if (cursorType === 'link') {
        size = 28;
        bg = 'rgba(229, 216, 189, 0.2)'; // external / links — pale sage
        border = `1.5px solid ${CURSOR.paleSage}`;
      } else if (cursorType === 'hover') {
        size = 28;
        bg = 'rgba(199, 187, 211, 0.28)'; // hover — muted forest
        border = `1.5px solid ${CURSOR.mutedForest}`;
      } else if (cursorType === 'project' || cursorType === 'architecture') {
        size = cursorType === 'project' ? 46 : 42;
        bg = 'rgba(174, 191, 167, 0.25)'; // soft sage
        border = `1.5px solid ${CURSOR.sage}`;
      } else if (cursorType === 'tech' || cursorType === 'technology' || cursorType === 'skills') {
        size = 38;
        bg = 'rgba(184, 169, 201, 0.22)';
        border = '1.5px solid #B8A9C9';
      } else if (cursorType === 'cta' || cursorType === 'contact') {
        size = 36;
        bg = 'rgba(229, 216, 189, 0.25)'; // pale sage
        border = `1.5px solid ${CURSOR.paleSage}`;
      } else if (cursorType === 'nav-active') {
        size = 8;
        bg = 'rgba(242, 240, 232, 0.35)';
        border = 'none';
      }

      gsap.to(cursor, {
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bg,
        border,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        duration: 0.25,
        ease: 'power3.out',
      });

      if (label) {
        gsap.to(label, { opacity: 0, scale: 0.7, duration: 0.15 });
      }
    }
  }, [cursorType, cursorText, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${isVisible ? styles.visible : ''}`}
      aria-hidden="true"
    >
      <span ref={labelRef} className={styles.label}>
        {cursorText}
      </span>
    </div>
  );
};

export default CustomCursor;
