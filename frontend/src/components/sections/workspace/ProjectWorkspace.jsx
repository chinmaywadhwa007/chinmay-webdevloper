import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FiArrowUpRight, FiGithub, FiMaximize2, FiCornerDownLeft } from 'react-icons/fi';
import AnimatedCounter from '../../interactive/AnimatedCounter';
import { projects, CATEGORIES, ACCENTS, workspaceMetrics } from './projectsData';
import styles from './ProjectWorkspace.module.css';

const pad = (n) => String(n).padStart(2, '0');

/* --------------------------------------------------------------------------
   HOW IT WORKS — Architecture trace.
   HOVER a layer → the request "travels" from the client up to that layer.
   -------------------------------------------------------------------------- */
const ArchitectureTrace = ({ nodes, accent }) => {
  const [traceTo, setTraceTo] = useState(null);

  return (
    <div className={styles.trace} onMouseLeave={() => setTraceTo(null)} style={{ '--accent': accent }}>
      <div className={styles.traceHeader}>
        <span className={styles.monoLabel}>How it works</span>
        <span className={styles.traceHint}>
          {traceTo === null ? 'Hover a layer to trace the request' : `Request → ${nodes[traceTo].label}`}
        </span>
      </div>

      <ol className={styles.traceRail}>
        {nodes.map((node, i) => {
          const isLit = traceTo !== null && i <= traceTo;
          return (
            <li
              key={node.label}
              className={`${styles.traceNode} ${isLit ? styles.traceNodeLit : ''}`}
              onMouseEnter={() => setTraceTo(i)}
              data-cursor="hover"
            >
              <span className={styles.traceIndex}>{pad(i + 1)}</span>
              <span className={styles.traceLabel}>{node.label}</span>
              <span className={styles.traceSub}>{node.sub}</span>
              {i < nodes.length - 1 && (
                <span className={`${styles.traceLink} ${traceTo !== null && i < traceTo ? styles.traceLinkLit : ''}`}>
                  <span className={styles.tracePulse} style={{ animationDelay: `${i * 0.45}s` }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

/* --------------------------------------------------------------------------
   Featured Preview — the active system rendered large and cinematic.
   -------------------------------------------------------------------------- */
const FeaturedPreview = ({ project, position, total, onOpenCaseStudy }) => {
  const mediaRef = useRef(null);
  const imgRef = useRef(null);
  const accent = ACCENTS[project.accent] || ACCENTS.sage;

  const handleMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = mediaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(imgRef.current, { x: x * -14, y: y * -10, scale: 1.04, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleLeave = () => {
    gsap.to(imgRef.current, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
  };

  return (
    <motion.article
      key={project.id}
      className={styles.preview}
      style={{ '--accent': accent }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      aria-live="polite"
    >
      {/* Media — CLICK transforms into the full case study */}
      <div
        ref={mediaRef}
        className={styles.media}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={() => onOpenCaseStudy(project)}
        data-cursor="project"
        data-cursor-text="OPEN"
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title} case study`}
        onKeyDown={(e) => e.key === 'Enter' && onOpenCaseStudy(project)}
      >
        <img ref={imgRef} src={project.image} alt={`${project.title} interface`} className={styles.mediaImg} />
        <div className={styles.mediaShade} />

        <div className={styles.mediaTopBar}>
          <span className={styles.domainChip}>{project.domain}</span>
          <span className={styles.statusChip}>
            <span className={project.isLive ? styles.statusDotLive : styles.statusDotIdle} />
            {project.isLive ? 'Live' : 'Architecture'}
          </span>
        </div>

        <span className={styles.mediaExpand} aria-hidden="true">
          <FiMaximize2 size={14} />
        </span>
      </div>

      {/* Identity */}
      <div className={styles.previewBody}>
        <div className={styles.previewMeta}>
          <span className={styles.monoLabel}>
            {pad(position)} / {pad(total)}
          </span>
          <span className={styles.metaDivider} />
          <span className={styles.previewCategory}>{project.categoryLabel}</span>
        </div>

        <div className={styles.previewHeadline}>
          <div>
            <h2 className={styles.previewTitle}>{project.title}</h2>
            <p className={styles.previewSummary}>{project.summary}</p>
          </div>

          <div className={styles.previewActions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => onOpenCaseStudy(project)}
              data-cursor="hover"
            >
              <span>Case study</span>
              <FiArrowUpRight size={15} />
            </button>
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconAction}
                aria-label={`Launch ${project.title}`}
                title="Launch live platform"
              >
                <FiArrowUpRight size={16} />
              </a>
            )}
            {project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconAction}
                aria-label={`${project.title} source code`}
                title="View source code"
              >
                <FiGithub size={15} />
              </a>
            )}
          </div>
        </div>

        <ul className={styles.signals}>
          {project.signals.map((s) => (
            <li key={s} className={styles.signal}>
              <span className={styles.signalDot} />
              {s}
            </li>
          ))}
        </ul>

        <ArchitectureTrace nodes={project.architecture} accent={accent} />
      </div>
    </motion.article>
  );
};

/* --------------------------------------------------------------------------
   Project Workspace — Header, metric strip, Index (left) + Preview (right)
   -------------------------------------------------------------------------- */
const ProjectWorkspace = ({ activeId, onSelect, onOpenCaseStudy }) => {
  const [category, setCategory] = useState('all');
  const [hoverId, setHoverId] = useState(null);
  const hoverTimer = useRef(null);
  const itemRefs = useRef({});
  const headerRef = useRef(null);

  const filtered = useMemo(
    () => (category === 'all' ? projects : projects.filter((p) => p.category === category)),
    [category]
  );

  // A system selected elsewhere (map, timeline, explorer) may be outside the current filter — reveal it
  useEffect(() => {
    if (!filtered.some((p) => p.id === activeId)) setCategory('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const changeCategory = (id) => {
    setCategory(id);
    const next = id === 'all' ? projects : projects.filter((p) => p.category === id);
    if (!next.some((p) => p.id === activeId) && next[0]) onSelect(next[0].id);
  };

  // Headline entrance
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-reveal]',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', delay: 0.1 }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const displayedId = hoverId || activeId;
  const displayed = projects.find((p) => p.id === displayedId) || projects[0];
  const position = projects.findIndex((p) => p.id === displayed.id) + 1;

  const handleHover = (id) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoverId(id), 90);
  };

  const clearHover = () => {
    clearTimeout(hoverTimer.current);
    setHoverId(null);
  };

  const handleKeyDown = (e) => {
    const idx = filtered.findIndex((p) => p.id === activeId);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = filtered[(idx + (e.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length];
      setHoverId(null);
      onSelect(next.id);
      itemRefs.current[next.id]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = projects.find((p) => p.id === activeId);
      if (current) onOpenCaseStudy(current);
    }
  };

  const metrics = [
    { value: workspaceMetrics.systems, suffix: '', label: 'Systems shipped' },
    { value: workspaceMetrics.technologies, suffix: '', label: 'Technologies' },
    { value: workspaceMetrics.live, suffix: '', label: 'Live in production' },
    { value: workspaceMetrics.layers, suffix: '', label: 'Architecture layers' },
  ];

  return (
    <section id="workspace" className={styles.workspaceSection} aria-labelledby="workspace-title">
      <div className={styles.container}>
        {/* Editorial header */}
        <header ref={headerRef} className={styles.header}>
          <span data-reveal className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            (03) Project Workspace
          </span>

          <h1 id="workspace-title" className={styles.headline}>
            <span data-reveal className={styles.headlineMuted}>I don&rsquo;t just build projects.</span>
            <span data-reveal className={styles.headlineStrong}>
              I build <em className={styles.headlineAccent}>systems.</em>
            </span>
          </h1>

          <p data-reveal className={styles.intro}>
            Every entry below is an engineered system — interfaces, services, data and motion working together.
            Inspect one, trace how it works, then open the full case study.
          </p>

          <dl data-reveal className={styles.metricStrip}>
            {metrics.map((m) => (
              <div key={m.label} className={styles.metric}>
                <dt className={styles.metricLabel}>{m.label}</dt>
                <dd className={styles.metricValue}>
                  <AnimatedCounter targetValue={m.value} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Workspace: Index + Preview */}
        <div className={styles.workspace}>
          <aside className={styles.index} aria-label="Project index">
            <div className={styles.indexHeader}>
              <span className={styles.monoLabel}>Index</span>
              <span className={styles.monoLabel}>{pad(filtered.length)} entries</span>
            </div>

            <div className={styles.filters} role="tablist" aria-label="Filter systems">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={category === c.id}
                  className={`${styles.filter} ${category === c.id ? styles.filterActive : ''}`}
                  onClick={() => changeCategory(c.id)}
                  data-cursor="hover"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <ul className={styles.indexList} onMouseLeave={clearHover} onKeyDown={handleKeyDown}>
              {filtered.map((p) => {
                const isActive = p.id === activeId;
                const isPreviewing = p.id === displayed.id;
                const n = projects.findIndex((x) => x.id === p.id) + 1;
                return (
                  <li key={p.id} style={{ '--accent': ACCENTS[p.accent] }}>
                    <button
                      ref={(el) => (itemRefs.current[p.id] = el)}
                      type="button"
                      className={`${styles.indexItem} ${isPreviewing ? styles.indexItemPreview : ''} ${
                        isActive ? styles.indexItemActive : ''
                      }`}
                      onMouseEnter={() => handleHover(p.id)}
                      onFocus={() => onSelect(p.id)}
                      onClick={() => {
                        clearHover();
                        onSelect(p.id);
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      data-cursor="hover"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="indexActiveBar"
                          className={styles.activeBar}
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className={styles.itemNumber}>{pad(n)}</span>
                      <span className={styles.itemText}>
                        <span className={styles.itemTitle}>{p.shortTitle}</span>
                        <span className={styles.itemCategory}>{p.categoryLabel}</span>
                      </span>
                      <span
                        className={p.isLive ? styles.statusDotLive : styles.statusDotIdle}
                        title={p.isLive ? 'Live' : 'Architecture'}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className={styles.keyHint}>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
              <span className={styles.keyHintSep} />
              <kbd>
                <FiCornerDownLeft size={10} />
              </kbd>{' '}
              open
            </p>
          </aside>

          <div className={styles.previewSlot}>
            <AnimatePresence mode="wait">
              <FeaturedPreview
                key={displayed.id}
                project={displayed}
                position={position}
                total={projects.length}
                onOpenCaseStudy={onOpenCaseStudy}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectWorkspace;
