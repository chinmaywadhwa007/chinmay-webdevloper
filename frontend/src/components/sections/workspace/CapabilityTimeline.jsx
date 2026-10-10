import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowUpRight } from 'react-icons/fi';
import { projects } from './projectsData';
import styles from './CapabilityTimeline.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * CapabilityTimeline — how the systems evolved.
 * SCROLL → progression: the rail fills and each phase activates in sequence.
 * Each phase lists the technologies it introduced for the first time (computed from stack data).
 */
const CapabilityTimeline = ({ onSelect }) => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const phases = useMemo(() => {
    const ordered = [...projects].sort((a, b) => a.evolution.phase.localeCompare(b.evolution.phase));
    const seen = new Set();
    return ordered.map((p) => {
      const introduced = p.stack.filter((t) => !seen.has(t));
      p.stack.forEach((t) => seen.add(t));
      return { ...p, introduced };
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      end: 'bottom 70%',
      scrub: true,
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  const reached = (i) => progress >= (i / (phases.length - 1)) * 0.92;
  const currentIndex = phases.reduce((last, _, i) => (reached(i) ? i : last), -1);

  const handleSelect = (id) => {
    onSelect(id);
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="evolution-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>(05) Capability evolution</span>
          <h2 id="evolution-title" className={styles.title}>
            Each system raised <span className={styles.titleMuted}>the ceiling for the next.</span>
          </h2>
        </div>

        <div className={styles.timelineWrap} style={{ '--progress': progress }}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} />
          </span>

          <ol className={styles.timeline}>
          {phases.map((p, i) => {
            const isOn = reached(i);
            return (
              <li
                key={p.id}
                className={`${styles.phase} ${isOn ? styles.phaseOn : ''} ${i === currentIndex ? styles.phaseCurrent : ''}`}
              >
                <span className={styles.node} aria-hidden="true" />
                <span className={styles.phaseLabel}>{p.evolution.phase}</span>
                <h3 className={styles.capability}>{p.evolution.capability}</h3>

                <button
                  type="button"
                  className={styles.projectLink}
                  onClick={() => handleSelect(p.id)}
                  data-cursor="hover"
                >
                  {p.shortTitle}
                  <FiArrowUpRight size={13} />
                </button>

                <p className={styles.learned}>{p.evolution.learned}</p>

                {p.introduced.length > 0 && (
                  <div className={styles.introduced}>
                    <span className={styles.introducedLabel}>New in this phase</span>
                    <div className={styles.chips}>
                      {p.introduced.map((t) => (
                        <span key={t} className={styles.chip}>
                          +{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CapabilityTimeline;
