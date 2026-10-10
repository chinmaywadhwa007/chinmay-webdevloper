import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FiArrowUpRight, FiX } from 'react-icons/fi';
import { projects, TECH_LANES, ACCENTS, LAYERS, FLOW_STEPS } from './projectsData';
import styles from './SystemsMap.module.css';

/* Short system descriptors for the selector (presentation copy only) */
const KIND = {
  dezoryn: 'Enterprise Automation',
  'vexo-music': 'Media Platform',
  'digimate-tech-digital': 'Digital Solutions',
  'skill-loop': 'Skill Exchange',
  shopease: 'Commerce',
};

const ROW_Y0 = 50; // y of row 0 (px)
const ROW_GAP = 86; // vertical distance between tiers (px)
const NODE_HALF_H = 21; // half the rendered node height — edges start/end at node borders
const MAX_ROWS = 5;
const CANVAS_H = ROW_Y0 * 2 + ROW_GAP * (MAX_ROWS - 1);

const pad = (n) => String(n).padStart(2, '0');
const laneOf = (tech) => TECH_LANES.find((l) => l.techs.includes(tech));

/** Walk the graph `depth` hops in one direction. */
const walk = (start, adjacency, depth) => {
  const seen = new Set();
  let frontier = [start];
  for (let d = 0; d < depth; d++) {
    const next = [];
    frontier.forEach((id) => (adjacency[id] || []).forEach((n) => !seen.has(n) && (seen.add(n), next.push(n))));
    frontier = next;
  }
  return seen;
};

/* --------------------------------------------------------------------------
   ArchitectureGraph — one system only. Keyed by system id so each selection
   mounts fresh and draws its connections tier by tier, then settles.
   -------------------------------------------------------------------------- */
const ArchitectureGraph = ({ project, width, lit, onNodeEnter, onNodeLeave, onNodeClick, pinned }) => {
  const rootRef = useRef(null);
  const { nodes, edges } = project.graph;

  const pos = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, { x: n.x * width, y: ROW_Y0 + n.row * ROW_GAP }])),
    [nodes, width]
  );
  const rowOf = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n.row])), [nodes]);

  // Progressive draw on mount (system selection). No continuous animation afterwards.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        '[data-node]',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', stagger: (i, el) => Number(el.dataset.row) * 0.13 },
        0
      );
      gsap.utils.toArray('[data-edge]').forEach((path) => {
        const at = 0.18 + Number(path.dataset.row) * 0.13;
        tl.fromTo(path, { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.5, ease: 'power2.inOut' }, at);
      });
      tl.fromTo('[data-inlet]', { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.03 }, '-=0.25');
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const hasFocus = lit !== null;

  return (
    <div ref={rootRef} className={styles.graph} style={{ height: CANVAS_H }}>
      <svg className={styles.edges} width={width} height={CANVAS_H} viewBox={`0 0 ${width} ${CANVAS_H}`} aria-hidden="true">
        {edges.map(([from, to]) => {
          const a = pos[from];
          const b = pos[to];
          const y1 = a.y + NODE_HALF_H;
          const y2 = b.y - NODE_HALF_H;
          const my = (y1 + y2) / 2;
          const id = `${from}-${to}`;
          const isLit = hasFocus && lit.edges.has(id);
          // Primary (sage): touches the traced node or completes the response. Secondary (lavender): further hops / flow hover.
          const isSecondary = isLit && (lit.tone === 'flow' || (lit.tone === 'trace' && !lit.primary.has(id)));
          const cls = [styles.edge, isLit ? styles.edgeLit : '', isSecondary ? styles.edgeSecondary : '', hasFocus && !isLit ? styles.edgeDim : '']
            .filter(Boolean)
            .join(' ');
          return (
            <g key={id}>
              <path
                data-edge
                data-row={rowOf[from]}
                d={`M ${a.x} ${y1} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${y2}`}
                pathLength="1"
                strokeDasharray="1"
                className={cls}
              />
              <circle data-inlet cx={b.x} cy={y2} r="2.4" className={`${styles.inlet} ${isLit ? styles.inletLit : ''} ${isSecondary ? styles.inletSecondary : ''}`} />
            </g>
          );
        })}
      </svg>

      {nodes.map((n) => {
        const isTech = Boolean(n.techs?.length);
        const isFocus = hasFocus && lit.focus === n.id;
        const isRelated = hasFocus && lit.nodes.has(n.id);
        const cls = [
          styles.node,
          isTech ? '' : styles.nodePattern,
          isFocus ? styles.nodeFocus : '',
          isRelated && !isFocus ? styles.nodeRelated : '',
          isRelated && lit.tone === 'flow' ? styles.nodeFlow : '',
          hasFocus && !isRelated ? styles.nodeDim : '',
          pinned === n.id ? styles.nodePinned : '',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <button
            key={n.id}
            type="button"
            data-node
            data-row={n.row}
            className={cls}
            style={{ left: pos[n.id].x, top: pos[n.id].y }}
            onMouseEnter={() => onNodeEnter(n.id)}
            onMouseLeave={onNodeLeave}
            onFocus={() => onNodeEnter(n.id)}
            onBlur={onNodeLeave}
            onClick={() => onNodeClick(n.id)}
            aria-pressed={pinned === n.id}
            aria-label={`${n.label} — ${n.sub}`}
            data-cursor={isTech ? 'technology' : 'architecture'}
            data-cursor-text={isTech ? 'TRACE' : 'CONNECT'}
          >
            <span className={styles.nodeDot} />
            <span className={styles.nodeText}>
              <span className={styles.nodeLabel}>{n.label}</span>
              <span className={styles.nodeSub}>{n.sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------------------
   Inspector — system details by default, technology / pattern details on focus.
   -------------------------------------------------------------------------- */
const Inspector = ({ project, node, pinned, onUnpin, onLoadSystem, onTraceTech, onOpenCaseStudy }) => {
  const accent = ACCENTS[project.accent];

  if (node && node.techs?.length) {
    const tech = node.techs[0];
    const users = projects.filter((p) => p.stack.includes(tech));
    return (
      <div className={styles.inspectorBody}>
        <span className={styles.kicker}>Technology</span>
        <h3 className={styles.inspTitle}>{tech}</h3>
        <p className={styles.inspSub}>
          {laneOf(tech)?.label} lane · {LAYERS[node.layer]}
        </p>

        <div className={styles.inspBlock}>
          <span className={styles.blockLabel}>Role in {project.shortTitle}</span>
          <span className={styles.roleLine}>{node.sub}</span>
        </div>

        <div className={styles.inspBlock}>
          <span className={styles.blockLabel}>
            Used by {users.length} of {projects.length} systems
          </span>
          <ul className={styles.usedBy}>
            {projects.map((p) => {
              const uses = p.stack.includes(tech);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`${styles.usedByItem} ${uses ? styles.usedByOn : ''}`}
                    disabled={!uses || p.id === project.id}
                    onClick={() => onLoadSystem(p.id, tech)}
                    data-cursor={uses && p.id !== project.id ? 'project' : undefined}
                    data-cursor-text={uses && p.id !== project.id ? 'INSPECT' : undefined}
                  >
                    <span className={styles.usedByDot} style={{ '--accent': ACCENTS[p.accent] }} />
                    {p.shortTitle}
                    {p.id === project.id && <span className={styles.hereTag}>here</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {pinned && (
          <button type="button" className={styles.unpin} onClick={onUnpin} data-cursor="hover">
            <FiX size={12} /> Release trace
          </button>
        )}
      </div>
    );
  }

  if (node) {
    const { nodes, edges } = project.graph;
    const label = (id) => nodes.find((n) => n.id === id)?.label;
    const upstream = edges.filter(([, to]) => to === node.id).map(([from]) => label(from));
    const downstream = edges.filter(([from]) => from === node.id).map(([, to]) => label(to));
    return (
      <div className={styles.inspectorBody}>
        <span className={styles.kicker}>Architecture pattern</span>
        <h3 className={styles.inspTitle}>{node.label}</h3>
        <p className={styles.inspSub}>
          {node.sub} · {LAYERS[node.layer]}
        </p>
        <div className={styles.inspBlock}>
          <span className={styles.blockLabel}>Receives from</span>
          <span className={styles.roleLine}>{upstream.length ? upstream.join(', ') : '—'}</span>
        </div>
        <div className={styles.inspBlock}>
          <span className={styles.blockLabel}>Connects to</span>
          <span className={styles.roleLine}>{downstream.length ? downstream.join(', ') : '— terminal node'}</span>
        </div>
        {pinned && (
          <button type="button" className={styles.unpin} onClick={onUnpin} data-cursor="hover">
            <FiX size={12} /> Release trace
          </button>
        )}
      </div>
    );
  }

  const layerCount = new Set(project.graph.nodes.map((n) => n.layer)).size;
  return (
    <div className={styles.inspectorBody} style={{ '--accent': accent }}>
      <span className={styles.kicker}>System</span>
      <h3 className={styles.inspTitle}>{project.title}</h3>
      <p className={styles.inspSub}>{KIND[project.id]}</p>

      <div className={styles.counts}>
        <span>
          <strong>{project.stack.length}</strong> technologies
        </span>
        <span>
          <strong>{layerCount}</strong> layers
        </span>
      </div>

      <div className={styles.inspBlock}>
        <span className={styles.blockLabel}>Stack</span>
        <ul className={styles.stackList}>
          {project.stack.map((t) => (
            <li key={t}>
              <button
                type="button"
                className={styles.stackItem}
                onMouseEnter={() => onTraceTech(t)}
                onMouseLeave={() => onTraceTech(null)}
                onFocus={() => onTraceTech(t)}
                onBlur={() => onTraceTech(null)}
                data-cursor="technology"
                data-cursor-text="TRACE"
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.inspBlock}>
        <span className={styles.blockLabel}>Architecture</span>
        <p className={styles.archChain}>
          {project.architecture.map((a, i) => (
            <React.Fragment key={a.label}>
              {i > 0 && <span className={styles.archArrow}>→</span>}
              <span>{a.label}</span>
            </React.Fragment>
          ))}
        </p>
      </div>

      <button
        type="button"
        className={styles.openBtn}
        onClick={() => onOpenCaseStudy?.(project)}
        data-cursor="project"
        data-cursor-text="OPEN"
      >
        Open case study <FiArrowUpRight size={14} />
      </button>
    </div>
  );
};

/* --------------------------------------------------------------------------
   SystemsMap → Architecture Workspace
   SELECT a system → UNDERSTAND its graph → INSPECT → TRACE → CHANGE SYSTEM
   -------------------------------------------------------------------------- */
const SystemsMap = ({ activeId, onSelect, onOpenCaseStudy }) => {
  const [hoverNode, setHoverNode] = useState(null);
  const [traceNode, setTraceNode] = useState(null);
  const [pinNode, setPinNode] = useState(null);
  const [hoverStep, setHoverStep] = useState(null);
  const [width, setWidth] = useState(0);
  const [inView, setInView] = useState(false);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const selectorRefs = useRef({});

  const project = projects.find((p) => p.id === activeId) || projects[0];
  const { nodes, edges } = project.graph;

  // Measure the canvas so the SVG uses real pixels (no distorted strokes)
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // First draw happens when the workspace scrolls into view
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // System changed (here or from another section) — drop traces that don't belong to it
  useEffect(() => {
    setHoverNode(null);
    setTraceNode(null);
    setHoverStep(null);
    setPinNode((cur) => (cur && nodes.some((n) => n.id === cur) ? cur : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const adjacency = useMemo(() => {
    const down = {};
    const up = {};
    edges.forEach(([a, b]) => {
      (down[a] ||= []).push(b);
      (up[b] ||= []).push(a);
    });
    return { down, up };
  }, [edges]);

  // Inspector shows hovered/pinned nodes; graph lighting also follows inspector-driven traces
  const inspectId = hoverNode || pinNode;
  const focusNode = nodes.find((n) => n.id === inspectId) || null;
  const focusId = hoverNode || traceNode || pinNode;

  // What is lit right now — a node trace, a data-flow step, or nothing
  const lit = useMemo(() => {
    if (hoverStep) {
      const step = FLOW_STEPS.find((s) => s.id === hoverStep);
      const layerOf = Object.fromEntries(nodes.map((n) => [n.id, n.layer]));
      if (step.response) {
        return { focus: null, tone: 'complete', nodes: new Set(nodes.map((n) => n.id)), edges: new Set(edges.map(([a, b]) => `${a}-${b}`)) };
      }
      if (step.request) {
        const crossing = edges.filter(([a, b]) => layerOf[a] === 'client' && layerOf[b] !== 'client');
        return {
          focus: null,
          tone: 'flow',
          nodes: new Set(crossing.flat()),
          edges: new Set(crossing.map(([a, b]) => `${a}-${b}`)),
        };
      }
      const ids = new Set(nodes.filter((n) => step.layers.includes(n.layer)).map((n) => n.id));
      return {
        focus: null,
        tone: 'flow',
        nodes: ids,
        edges: new Set(edges.filter(([a, b]) => ids.has(a) && ids.has(b)).map(([a, b]) => `${a}-${b}`)),
      };
    }
    if (focusId) {
      const chain = new Set([focusId, ...walk(focusId, adjacency.up, 2), ...walk(focusId, adjacency.down, 2)]);
      const litEdges = edges.filter(([a, b]) => chain.has(a) && chain.has(b));
      return {
        focus: focusId,
        tone: 'trace',
        nodes: chain,
        edges: new Set(litEdges.map(([a, b]) => `${a}-${b}`)),
        primary: new Set(litEdges.filter(([a, b]) => a === focusId || b === focusId).map(([a, b]) => `${a}-${b}`)),
      };
    }
    return null;
  }, [hoverStep, focusId, nodes, edges, adjacency]);

  // "One toolkit, many architectures" — which systems share the focused technology
  const focusTech = nodes.find((n) => n.id === focusId)?.techs?.[0] || null;

  const loadSystem = (id, carryTech = null) => {
    setHoverNode(null);
    setTraceNode(null);
    setHoverStep(null);
    const next = projects.find((p) => p.id === id);
    const carried = carryTech ? next?.graph.nodes.find((n) => n.techs?.includes(carryTech))?.id : null;
    setPinNode(carried || null);
    if (id !== activeId) onSelect(id);
  };

  const traceTech = (tech) => {
    if (!tech) return setTraceNode(null);
    const n = nodes.find((x) => x.techs?.includes(tech));
    return setTraceNode(n ? n.id : null);
  };

  const handleSelectorKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const idx = projects.findIndex((p) => p.id === activeId);
    const next = projects[(idx + (e.key === 'ArrowDown' ? 1 : -1) + projects.length) % projects.length];
    loadSystem(next.id);
    selectorRefs.current[next.id]?.focus();
  };

  // Subtle local dot response — CSS variables only, no particles
  const handlePointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const availableSteps = useMemo(() => {
    const layers = new Set(nodes.map((n) => n.layer));
    const layerOf = Object.fromEntries(nodes.map((n) => [n.id, n.layer]));
    return Object.fromEntries(
      FLOW_STEPS.map((s) => [
        s.id,
        s.response || (s.request ? edges.some(([a, b]) => layerOf[a] === 'client' && layerOf[b] !== 'client') : s.layers.some((l) => layers.has(l))),
      ])
    );
  }, [nodes, edges]);

  return (
    <section className={styles.section} aria-labelledby="systems-map-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>04 — System relationships</span>
            <h2 id="systems-map-title" className={styles.title}>
              One toolkit, <span className={styles.titleMuted}>many architectures.</span>
            </h2>
            <p className={styles.lede}>
              Select a system to load its architecture. Hover a technology to trace its relationships — and see which
              other systems share it.
            </p>
          </div>
          <span className={styles.headerMeta}>
            <span className={styles.headerMetaDot} />
            Inspect system · {pad(projects.length)} architectures
          </span>
        </header>

        <div ref={frameRef} className={styles.frame} data-nav-avoid>
          {/* LEFT — System selector */}
          <nav className={styles.selector} aria-label="Select a system">
            <div className={styles.zoneHead}>
              <span>Systems</span>
            </div>
            <ul className={styles.selectorList} onKeyDown={handleSelectorKey}>
              {projects.map((p, i) => {
                const isActive = p.id === project.id;
                const shares = focusTech ? p.stack.includes(focusTech) : null;
                return (
                  <li key={p.id}>
                    <button
                      ref={(el) => (selectorRefs.current[p.id] = el)}
                      type="button"
                      className={[
                        styles.system,
                        isActive ? styles.systemActive : '',
                        shares === true ? styles.systemShares : '',
                        shares === false ? styles.systemMuted : '',
                      ].join(' ')}
                      onClick={() => loadSystem(p.id)}
                      aria-current={isActive ? 'true' : undefined}
                      data-cursor="project"
                      data-cursor-text="INSPECT"
                    >
                      <span className={styles.systemNum}>{pad(i + 1)}</span>
                      <span className={styles.systemText}>
                        <span className={styles.systemName}>{p.shortTitle}</span>
                        <span className={styles.systemKind}>{KIND[p.id]}</span>
                      </span>
                      <span className={styles.shareDot} aria-hidden="true" />
                      {isActive && (
                        <motion.span
                          layoutId="systemIndicator"
                          className={styles.systemIndicator}
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className={styles.selectorHint}>
              {focusTech ? (
                <>
                  <span className={styles.hintAccent}>{focusTech}</span> appears in{' '}
                  {projects.filter((p) => p.stack.includes(focusTech)).length} systems
                </>
              ) : (
                '↑ ↓ to switch systems'
              )}
            </p>
          </nav>

          {/* CENTER — Active architecture */}
          <div className={styles.stage}>
            <div className={styles.zoneHead}>
              <span>
                Active architecture <span className={styles.zoneHeadStrong}>— {project.shortTitle}</span>
              </span>
              <span className={styles.legend}>
                <span className={styles.legendTech} /> technology
                <span className={styles.legendPattern} /> pattern
              </span>
            </div>
            <div
              ref={canvasRef}
              className={styles.canvas}
              style={{ height: CANVAS_H }}
              onPointerMove={handlePointer}
              onMouseLeave={() => setHoverNode(null)}
            >
              <AnimatePresence mode="wait">
                {inView && width > 0 && (
                  <motion.div
                    key={project.id}
                    className={styles.graphLayer}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  >
                    <ArchitectureGraph
                      project={project}
                      width={width}
                      lit={lit}
                      pinned={pinNode}
                      onNodeEnter={setHoverNode}
                      onNodeLeave={() => setHoverNode(null)}
                      onNodeClick={(id) => setPinNode((cur) => (cur === id ? null : id))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — Inspector */}
          <aside className={styles.inspector} aria-live="polite">
            <div className={styles.zoneHead}>
              <span>Inspector</span>
              {pinNode && <span className={styles.pinnedTag}>pinned</span>}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${project.id}-${focusNode?.id || 'system'}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Inspector
                  project={project}
                  node={focusNode}
                  pinned={Boolean(pinNode)}
                  onUnpin={() => setPinNode(null)}
                  onLoadSystem={loadSystem}
                  onTraceTech={traceTech}
                  onOpenCaseStudy={onOpenCaseStudy}
                />
              </motion.div>
            </AnimatePresence>
          </aside>

          {/* BOTTOM — Data flow strip */}
          <div className={styles.flow} onMouseLeave={() => setHoverStep(null)}>
            <span className={styles.flowLabel}>Data flow</span>
            <ol className={styles.flowSteps}>
              {FLOW_STEPS.map((s, i) => {
                const available = availableSteps[s.id];
                return (
                  <li key={s.id} className={styles.flowItem}>
                    {i > 0 && <span className={styles.flowArrow}>→</span>}
                    <button
                      type="button"
                      className={`${styles.flowStep} ${hoverStep === s.id ? styles.flowStepOn : ''} ${
                        s.response && hoverStep === s.id ? styles.flowStepSage : ''
                      }`}
                      disabled={!available}
                      onMouseEnter={() => available && setHoverStep(s.id)}
                      onFocus={() => available && setHoverStep(s.id)}
                      onBlur={() => setHoverStep(null)}
                      title={available ? undefined : `No ${s.label.toLowerCase()} layer in ${project.shortTitle}`}
                      data-cursor={available ? 'hover' : undefined}
                    >
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemsMap;
