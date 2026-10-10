import React, { useState, useEffect } from 'react';
import styles from './SkillTerminal.module.css';

/**
 * Minimal Editorial Code Terminal
 * Interactive command selector with simulated typed execution.
 */
const SkillTerminal = () => {
  const [activeCmd, setActiveCmd] = useState('stack');
  const [typedChars, setTypedChars] = useState(0);

  const commandConfigs = {
    stack: {
      cmd: 'stack --show',
      output: `frontend
  react ✓
  typescript ✓
  gsap ✓
  motion ✓

backend
  node ✓
  fastify ✓

database
  mongodb ✓
  postgresql ✓`,
    },
    proof: {
      cmd: 'stack --proof',
      output: `production_deployments:
  dezoryntechnology.com      → React 18, Postgres, AI Core
  digimatetechdigital.com    → React, TypeScript, Node.js
  skilloop-omega.vercel.app  → React, Node.js, MongoDB, REST
  vexo-music.vercel.app      → Next.js, Video.js, Web Audio

resolved_issues: 100+ production bugs & query bottlenecks`,
    },
    status: {
      cmd: 'dev --status',
      output: `architecture: clean editorial modular system
compilation_target: esnext (Rolldown / Vite)
motion_engine: GSAP quickTo + Motion for React
responsiveness: full touch & desktop adaptation
a11y_status: semantic DOM hierarchy, zero lag`,
    },
  };

  const current = commandConfigs[activeCmd];

  useEffect(() => {
    setTypedChars(0);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedChars(index);
      if (index >= current.cmd.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [activeCmd, current.cmd]);

  return (
    <div className={styles.terminalCard}>
      {/* Editorial Window Header */}
      <div className={styles.terminalHeader}>
        <div className={styles.windowDots}>
          <span className={`${styles.dot} ${styles.dotClose}`} />
          <span className={`${styles.dot} ${styles.dotMin}`} />
          <span className={`${styles.dot} ${styles.dotMax}`} />
        </div>

        <span className={styles.terminalTitle}>terminal — zsh</span>

        <div className={styles.commandButtons}>
          {Object.keys(commandConfigs).map((key) => (
            <button
              key={key}
              className={`${styles.cmdBtn} ${activeCmd === key ? styles.activeCmdBtn : ''}`}
              onClick={() => setActiveCmd(key)}
              data-cursor="hover"
            >
              <span>--{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div className={styles.terminalBody}>
        <div className={styles.terminalCwd}>chinmay@portfolio ~/skills</div>

        <div className={styles.promptLine}>
          <span className={styles.promptSymbol}>$ </span>
          <span className={styles.commandText}>
            {current.cmd.slice(0, typedChars)}
          </span>
          {typedChars < current.cmd.length && <span className={styles.cursorBlink} />}
        </div>

        {typedChars >= current.cmd.length && (
          <div className={styles.outputBlock}>
            {current.output.split('\n').map((line, idx) => (
              <div key={idx}>
                {line.includes('✓') ? (
                  <>
                    <span>{line.replace('✓', '')}</span>
                    <span className={styles.checkMark}>✓</span>
                  </>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTerminal;
