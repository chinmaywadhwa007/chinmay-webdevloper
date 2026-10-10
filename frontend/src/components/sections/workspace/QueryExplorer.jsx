import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiDatabase } from 'react-icons/fi';
import { projects, ACCENTS } from './projectsData';
import styles from './QueryExplorer.module.css';

const CLAUSES = {
  category: [
    { value: null, label: 'any' },
    { value: 'enterprise', label: 'enterprise' },
    { value: 'frontend', label: 'media' },
    { value: 'fullstack', label: 'fullstack' },
  ],
  uses: [null, 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'JWT Auth'],
  status: [
    { value: null, label: 'any' },
    { value: 'live', label: 'live' },
    { value: 'architecture', label: 'architecture' },
  ],
  order: [
    { value: 'stack_size', label: 'stack_size' },
    { value: 'name', label: 'name' },
  ],
};

const PRESETS = [
  { label: 'Live systems', q: { category: null, uses: null, status: 'live', order: 'stack_size' } },
  { label: 'PostgreSQL backed', q: { category: null, uses: 'PostgreSQL', status: null, order: 'stack_size' } },
  { label: 'Secured with JWT', q: { category: null, uses: 'JWT Auth', status: null, order: 'name' } },
  { label: 'Full-stack only', q: { category: 'fullstack', uses: null, status: null, order: 'stack_size' } },
];

const DEFAULT_QUERY = { category: null, uses: null, status: null, order: 'stack_size' };

const sameQuery = (a, b) => Object.keys(a).every((k) => a[k] === b[k]);

/* Tiny SQL highlighter — tokens rendered as spans (subtle per-clause tones, no bright rainbow) */
const KW_TONE = { select: 'kwSelect', from: 'kwFrom', where: 'kwWhere' };
const Kw = ({ children, tone }) => (
  <span className={`${styles.kw} ${tone ? styles[KW_TONE[tone]] : ''}`}>{children}</span>
);
const Str = ({ children }) => <span className={styles.str}>&apos;{children}&apos;</span>;
const Fn = ({ children }) => <span className={styles.fn}>{children}</span>;

/**
 * QueryExplorer — a frontend-only SQL-style explorer over the project dataset.
 * CLICK clauses → TRANSFORMATION of the query and its result set.
 */
const QueryExplorer = ({ onSelect }) => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);

  const rows = useMemo(() => {
    let r = projects.filter(
      (p) =>
        (!query.category || p.category === query.category) &&
        (!query.uses || p.stack.includes(query.uses)) &&
        (!query.status || (query.status === 'live' ? p.isLive : !p.isLive))
    );
    r = [...r].sort((a, b) =>
      query.order === 'name' ? a.title.localeCompare(b.title) : b.stack.length - a.stack.length
    );
    return r;
  }, [query]);

  // Simulated execution latency for feedback
  useEffect(() => {
    setRunning(true);
    const t = setTimeout(() => setRunning(false), 320);
    return () => clearTimeout(t);
  }, [query, runId]);

  const set = (key, value) => setQuery((q) => ({ ...q, [key]: value }));

  const whereLines = [
    query.category && (
      <>
        category = <Str>{query.category}</Str>
      </>
    ),
    query.uses && (
      <>
        <Str>{query.uses}</Str> = <Fn>ANY</Fn>(stack)
      </>
    ),
    query.status && (
      <>
        status = <Str>{query.status}</Str>
      </>
    ),
  ].filter(Boolean);

  const handleRow = (id) => {
    onSelect(id);
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.section} aria-labelledby="query-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>(06) Query the work</span>
            <h2 id="query-title" className={styles.title}>
              Explore it like <span className={styles.titleMuted}>a database.</span>
            </h2>
          </div>
          <div className={styles.presets}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`${styles.preset} ${sameQuery(p.q, query) ? styles.presetActive : ''}`}
                onClick={() => setQuery(p.q)}
                data-cursor="hover"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.console}>
          {/* Clause builder */}
          <div className={styles.builder}>
            <ClauseGroup
              label="WHERE category ="
              options={CLAUSES.category}
              value={query.category}
              onChange={(v) => set('category', v)}
            />
            <ClauseGroup
              label="WHERE stack CONTAINS"
              options={CLAUSES.uses.map((u) => ({ value: u, label: u || 'any' }))}
              value={query.uses}
              onChange={(v) => set('uses', v)}
            />
            <ClauseGroup
              label="WHERE status ="
              options={CLAUSES.status}
              value={query.status}
              onChange={(v) => set('status', v)}
            />
            <ClauseGroup
              label="ORDER BY"
              options={CLAUSES.order}
              value={query.order}
              onChange={(v) => set('order', v)}
            />
            <button
              type="button"
              className={styles.reset}
              onClick={() => setQuery(DEFAULT_QUERY)}
              disabled={sameQuery(query, DEFAULT_QUERY)}
              data-cursor="hover"
            >
              Reset query
            </button>
          </div>

          {/* Editor + results */}
          <div className={styles.output}>
            <div className={styles.editorBar}>
              <span className={styles.editorTab}>
                <FiDatabase size={12} /> systems.sql
              </span>
              <button
                type="button"
                className={styles.runBtn}
                onClick={() => setRunId((n) => n + 1)}
                data-cursor="hover"
              >
                <FiPlay size={11} /> Run
              </button>
            </div>

            <pre className={styles.sql} aria-label="Generated SQL query">
              <code>
                <Kw tone="select">SELECT</Kw> name, category, database, stack_size, status
                {'\n'}
                <Kw tone="from">FROM</Kw> systems
                {whereLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {'\n'}
                    <Kw tone="where">{i === 0 ? 'WHERE' : '  AND'}</Kw> {line}
                  </React.Fragment>
                ))}
                {'\n'}
                <Kw>ORDER BY</Kw> {query.order} {query.order === 'stack_size' ? <Kw>DESC</Kw> : <Kw>ASC</Kw>};
              </code>
            </pre>

            <div className={styles.resultBar}>
              <span>
                {running ? (
                  <span className={styles.executing}>Executing…</span>
                ) : (
                  <>
                    <strong>{rows.length}</strong> {rows.length === 1 ? 'row' : 'rows'} returned
                  </>
                )}
              </span>
              <span className={styles.simNote}>client-side simulation</span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>name</th>
                    <th>category</th>
                    <th>database</th>
                    <th className={styles.num}>stack_size</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {!running &&
                      rows.map((p, i) => (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.25 } }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          className={styles.row}
                          onClick={() => handleRow(p.id)}
                          style={{ '--accent': ACCENTS[p.accent] }}
                          data-cursor="project"
                          data-cursor-text="LOAD"
                        >
                          <td className={styles.rowIndex}>{String(i + 1).padStart(2, '0')}</td>
                          <td className={styles.rowName}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRow(p.id);
                              }}
                            >
                              {p.title}
                            </button>
                          </td>
                          <td>{p.category}</td>
                          <td className={p.database ? '' : styles.nullCell}>{p.database || 'NULL'}</td>
                          <td className={styles.num}>{p.stack.length}</td>
                          <td>
                            <span className={p.isLive ? styles.badgeLive : styles.badgeIdle}>
                              {p.isLive ? 'live' : 'architecture'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {!running && rows.length === 0 && (
                <p className={styles.empty}>
                  0 rows. No system matches every clause — try loosening one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ClauseGroup = ({ label, options, value, onChange }) => (
  <div className={styles.clause}>
    <span className={styles.clauseLabel}>{label}</span>
    <div className={styles.clauseOptions}>
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          className={`${styles.option} ${value === o.value ? styles.optionActive : ''}`}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          data-cursor="hover"
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

export default QueryExplorer;
