import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { FiGlobe } from 'react-icons/fi';
import ProjectHoverLabel from './ProjectHoverLabel';
import VexoVideoExperience from './VexoVideoExperience';
import styles from './ProjectImage.module.css';

/**
 * Interactive Project Image with Browser Header, Clip-Path Mask Reveal,
 * Layered Parallax (1.5x image, 2.0x radial sheen, 3.0x floating label),
 * and subtle physical surface light tracking.
 */
const ProjectImage = forwardRef(
  (
    {
      src,
      alt,
      domain,
      isLive = true,
      accent = 'sage',
      isVideo = false,
      labelText = 'VIEW PROJECT',
    },
    ref
  ) => {
    const wrapperRef = useRef(null);
    const viewportRef = useRef(null);
    const imgRef = useRef(null);
    const highlightRef = useRef(null);
    const labelFollowerRef = useRef(null);

    // Expose viewportRef for ScrollTrigger clip-path entrance
    useImperativeHandle(ref, () => ({
      getViewport: () => viewportRef.current,
      getWrapper: () => wrapperRef.current,
    }));

    // Mouse tracking for 1.5x parallax and surface sheen
    const handleMouseMove = (e) => {
      if (isVideo) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const viewport = viewportRef.current;
      const img = imgRef.current;
      const highlight = highlightRef.current;
      if (!viewport || !img) return;

      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPct = (x / rect.width - 0.5); // -0.5 to 0.5
      const yPct = (y / rect.height - 0.5);

      // Subtle Image Parallax (restrained scale 1.015 per design spec)
      gsap.to(img, {
        x: xPct * 8,
        y: yPct * 6 - 2,
        scale: 1.015,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      // 2.0x Radial Surface Sheen
      if (highlight) {
        highlight.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(255, 253, 249, 0.32) 0%, rgba(255, 253, 249, 0.08) 50%, transparent 80%)`;
      }

      // 3.0x Following Label
      if (labelFollowerRef.current) {
        labelFollowerRef.current.onMove(x, y);
      }
    };

    const handleMouseEnter = (e) => {
      if (isVideo) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (labelFollowerRef.current) {
        labelFollowerRef.current.onEnter(x, y);
      }
    };

    const handleMouseLeave = () => {
      if (isVideo) return;
      const img = imgRef.current;
      if (img) {
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }

      if (labelFollowerRef.current) {
        labelFollowerRef.current.onLeave();
      }
    };

    const accentBadgeClass =
      accent === 'peach'
        ? styles.liveBadgePeach
        : accent === 'butter'
        ? styles.liveBadgeButter
        : styles.liveBadgeSage;

    return (
      <div
        ref={wrapperRef}
        className={styles.imageWrapper}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Media Container: VEXO gets Video.js, others get interactive parallax image */}
        {isVideo ? (
          <VexoVideoExperience />
        ) : (
          <div
            ref={viewportRef}
            className={styles.mediaViewport}
            data-cursor="project"
            data-cursor-text="VIEW"
          >
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className={styles.projectImage}
              loading="lazy"
            />

            {/* Floating Live Badge */}
            {isLive && (
              <div className={`${styles.floatingLiveBadge} ${accentBadgeClass}`}>
                <div className={styles.liveDotWrapper}>
                  <span className={styles.liveDot} />
                  <span className={styles.liveDotRing} />
                </div>
                <span>Live</span>
              </div>
            )}

            {/* Subtle Surface Specular Highlight */}
            <div ref={highlightRef} className={styles.surfaceHighlight} />

            {/* Small Editorial Floating Label Following Cursor */}
            <ProjectHoverLabel ref={labelFollowerRef} text={labelText} />
          </div>
        )}
      </div>
    );
  }
);

export default ProjectImage;
