import React, { useState } from 'react';
import { FiPlay, FiDatabase, FiCheck, FiLayers, FiExternalLink, FiSearch } from 'react-icons/fi';
import styles from './DatabasePlayground.module.css';

/**
 * Interactive Schema Visualization & Query Simulator
 * Demonstrates:
 * 1. Schema: PROJECTS (id, title, description, stack[], liveUrl)
 * 2. Animated Query: SELECT * FROM projects WHERE featured = true;
 * 3. Flow: QUERY -> DATABASE -> RESULT
 * 4. Project Result Cards
 */
const DatabasePlayground = () => {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryStage, setQueryStage] = useState(null); // 'QUERY' | 'DATABASE' | 'RESULT'
  const [hasResults, setHasResults] = useState(false);

  const schemaFields = [
    { name: 'id', type: 'UUID PRIMARY KEY' },
    { name: 'title', type: 'VARCHAR(120) NOT NULL' },
    { name: 'description', type: 'TEXT' },
    { name: 'stack[]', type: 'TEXT[]' },
    { name: 'liveUrl', type: 'VARCHAR(255)' },
  ];

  const results = [
    {
      id: 'p_01',
      title: 'Dezoryn Technologies',
      description: 'Enterprise ERP & AI platform with scalable multi-tenant architecture and real-time analytics.',
      stack: ['React 18', 'PostgreSQL', 'AI Core', 'Tailwind CSS'],
      liveUrl: 'dezoryntechnology.com',
    },
    {
      id: 'p_02',
      title: 'VEXO Music Entertainment',
      description: 'Immersive audio-visual media streaming platform featuring custom Video.js integration and equalizers.',
      stack: ['Next.js', 'Video.js', 'Web Audio API', 'GSAP'],
      liveUrl: 'vexo-music-steel.vercel.app',
    },
    {
      id: 'p_03',
      title: 'SkillLoop Platform',
      description: 'Peer-to-peer skill exchange platform with real-time trading logic and interactive developer arena.',
      stack: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
      liveUrl: 'skilloop-omega.vercel.app',
    },
    {
      id: 'p_04',
      title: 'Digimate Tech Digital Solutions',
      description: 'Comprehensive digital agency ecosystem with dynamic CRM, portfolio galleries, and client portal.',
      stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      liveUrl: 'digimatetechdigital.com',
    },
  ];

  const handleExecute = () => {
    if (isQuerying) return;
    setIsQuerying(true);
    setHasResults(false);
    setQueryStage('QUERY');

    setTimeout(() => {
      setQueryStage('DATABASE');
    }, 280);

    setTimeout(() => {
      setQueryStage('RESULT');
    }, 560);

    setTimeout(() => {
      setIsQuerying(false);
      setHasResults(true);
    }, 800);
  };

  return (
    <div className={styles.dbPlaygroundCard}>
      <div className={styles.header}>
        <div>
          <span className={styles.tagline}>Relational & Document Databases</span>
          <h3 className={styles.title}>Database Schema & Query Execution</h3>
        </div>
      </div>

      <div className={styles.queryRunnerRow}>
        {/* Schema Definition */}
        <div className={styles.schemaBox}>
          <div className={styles.schemaHeader}>
            <span className={styles.schemaTitle}>PROJECTS</span>
            <span className={styles.engineBadge}>PostgreSQL / MongoDB</span>
          </div>

          <ul className={styles.fieldList}>
            {schemaFields.map((field) => (
              <li key={field.name} className={styles.fieldItem}>
                <span className={styles.fieldName}>{field.name}</span>
                <span className={styles.fieldType}>{field.type}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Query Runner */}
        <div className={styles.queryBox}>
          <div className={styles.schemaHeader}>
            <span className={styles.schemaTitle}>SQL Query Buffer</span>
            <span className={styles.engineBadge}>B-Tree Index Scan</span>
          </div>

          <pre className={styles.querySnippet}>
            <span className={styles.sqlSelect}>SELECT</span> <span className={styles.sqlVal}>*</span>{'\n'}
            <span className={styles.sqlFrom}>FROM</span> <span className={styles.sqlTable}>projects</span>{'\n'}
            <span className={styles.sqlWhere}>WHERE</span> featured = <span className={styles.sqlVal}>true</span>;
          </pre>

          <div className={styles.actionsRow}>
            <button
              className={styles.executeBtn}
              onClick={handleExecute}
              disabled={isQuerying}
              data-cursor="cta"
              data-cursor-text="TRY"
            >
              <FiPlay size={13} />
              <span>{isQuerying ? 'Executing Query...' : 'Execute Query'}</span>
            </button>

            {/* Query Pipeline Indicator */}
            {isQuerying && (
              <div className={styles.flowStages}>
                <span className={`${styles.flowStage} ${queryStage === 'QUERY' ? styles.stageActive : ''}`}>
                  QUERY
                </span>
                <span className={styles.flowArrow}>↓</span>
                <span className={`${styles.flowStage} ${queryStage === 'DATABASE' ? styles.stageActive : ''}`}>
                  DATABASE
                </span>
                <span className={styles.flowArrow}>↓</span>
                <span className={`${styles.flowStage} ${queryStage === 'RESULT' ? styles.stageActive : ''}`}>
                  RESULT
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Query Results Project Cards */}
      {hasResults && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsMeta}>
              <span className={styles.statusPill}>
                <FiCheck size={12} />
                <span>4 Records Returned</span>
              </span>
              <span className={styles.indexInfo}>Index Scan on idx_projects_featured (1.2ms)</span>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {results.map((project) => (
              <div
                key={project.id}
                className={styles.projectResultCard}
                data-cursor="hover"
                data-cursor-text="VIEW"
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardId}>{project.id}</span>
                  <span className={styles.cardUrl}>{project.liveUrl}</span>
                </div>
                <h4 className={styles.cardTitle}>{project.title}</h4>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.stackTags}>
                  {project.stack.map((item, idx) => (
                    <span key={idx} className={styles.stackTag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePlayground;
