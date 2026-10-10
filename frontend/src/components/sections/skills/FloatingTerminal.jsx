import React, { useState, useEffect } from 'react';
import styles from './FloatingTerminal.module.css';

/**
 * Floating Monospace Terminal Layer
 * Clean typographic terminal without giant rectangular cards or fake window containers.
 * Integrates directly into the editorial canvas.
 */
const FloatingTerminal = () => {
  const [activeCmd, setActiveCmd] = useState('stack');
  const [typedChars, setTypedChars] = useState(0);

  const commandConfigs = {
    stack: {
      cmd: 'stack --show',
      output: [
        { group: 'frontend', items: ['react ✓', 'typescript ✓', 'gsap ✓', 'motion ✓'] },
        { group: 'backend', items: ['node ✓', 'fastify ✓', 'rest-apis ✓'] },
        { group: 'database', items: ['mongodb ✓', 'postgresql ✓', 'prisma ✓'] },
      ],
    },
    proof: {
      cmd: 'stack --proof',
      output: [
        { group: 'deployments', items: ['dezoryntechnology.com', 'digimatetechdigital.com', 'skilloop-omega.vercel.app'] },
        { group: 'architecture', items: ['hybrid SSR + edge caching', 'zero-lag GSAP motion'] },
      ],
    },
    status: {
      cmd: 'dev --status',
      output: [
        { group: 'runtime', items: ['Vite 8.0 HMR active', 'Rolldown ES-Next', '100% type safe'] },
      ],
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
    <div className={styles.terminalLayer}>
      <div className={styles.metaRow}>
        <span className={styles.tag}>INTEGRATED TERMINAL</span>
        <div className={styles.commandPills}>
          {Object.keys(commandConfigs).map((key) => (
            <button
              key={key}
              className={`${styles.cmdPill} ${activeCmd === key ? styles.cmdPillActive : ''}`}
              onClick={() => setActiveCmd(key)}
              data-cursor="hover"
            >
              <span>$ {commandConfigs[key].cmd}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.monospaceCanvas}>
        <div className={styles.pathLine}>chinmay@portfolio ~/skills</div>

        <div className={styles.promptLine}>
          <span className={styles.promptDollar}>$</span>
          <span className={styles.promptCommand}>
            {current.cmd.slice(0, typedChars)}
          </span>
          {typedChars < current.cmd.length && <span className={styles.cursorBlink} />}
        </div>

        {typedChars >= current.cmd.length && (
          <div className={styles.outputColumns}>
            {current.output.map((block, bIdx) => (
              <div key={bIdx} className={styles.outputGroup}>
                <span className={styles.groupHeader}>{block.group}</span>
                <ul className={styles.groupList}>
                  {block.items.map((item, iIdx) => (
                    <li key={iIdx} className={styles.groupItem}>
                      <span className={styles.itemName}>{item.replace('✓', '')}</span>
                      {item.includes('✓') && <span className={styles.check}>✓</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingTerminal;
