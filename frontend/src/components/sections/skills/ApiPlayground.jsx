import React, { useState } from 'react';
import {
  FiSend,
  FiCheckCircle,
  FiGlobe,
  FiLayout,
  FiServer,
  FiDatabase,
  FiRepeat,
  FiCpu,
} from 'react-icons/fi';
import styles from './ApiPlayground.module.css';

/**
 * Interactive Request-Flow Architecture Simulation
 * Demonstrates: CLIENT -> REACT -> REST API -> NODE / FASTIFY -> SERVICE -> DATABASE -> RESPONSE
 */
const ApiPlayground = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [responseReady, setResponseReady] = useState(false);

  const flowNodes = [
    { label: 'Client', icon: FiGlobe },
    { label: 'React', icon: FiLayout },
    { label: 'REST API', icon: FiRepeat },
    { label: 'Node / Fastify', icon: FiServer },
    { label: 'Service', icon: FiCpu },
    { label: 'Database', icon: FiDatabase },
    { label: 'Response', icon: FiCheckCircle },
  ];

  const triggerSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setResponseReady(false);
    setActiveStep(0);

    const stepInterval = 240; // ms per node

    flowNodes.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        if (idx === flowNodes.length - 1) {
          setTimeout(() => {
            setResponseReady(true);
            setIsRunning(false);
          }, 240);
        }
      }, idx * stepInterval);
    });
  };

  const sampleResponse = {
    status: 200,
    statusText: 'OK',
    latency: '16.8ms',
    projects: [
      'Dezoryn',
      'VEXO',
      'SkillLoop',
    ],
  };

  return (
    <div className={styles.apiPlaygroundCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <span className={styles.tagline}>Backend Pipeline Architecture</span>
          <h3 className={styles.title}>Interactive Request-Flow Simulator</h3>
        </div>

        <div className={styles.reqControlRow}>
          <div className={styles.endpointPill}>
            <span className={styles.methodBadge}>GET</span>
            <span>/api/projects</span>
          </div>

          <button
            className={styles.sendBtn}
            onClick={triggerSimulation}
            disabled={isRunning}
            data-cursor="cta"
            data-cursor-text="TRY"
          >
            <span>{isRunning ? 'Processing Flow...' : 'SEND REQUEST →'}</span>
            <FiSend size={13} />
          </button>
        </div>
      </div>

      {/* Architecture Flow Nodes Track */}
      <div className={styles.flowContainer}>
        <div className={styles.flowTrack}>
          {flowNodes.map((node, idx) => {
            const Icon = node.icon;
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <React.Fragment key={node.label}>
                <div
                  className={`${styles.flowNode} ${isActive ? styles.nodeActive : ''} ${
                    isCompleted ? styles.nodeCompleted : ''
                  }`}
                >
                  <div className={styles.nodeIconWrapper}>
                    <Icon size={18} />
                  </div>
                  <span className={styles.nodeLabel}>{node.label}</span>
                </div>

                {idx < flowNodes.length - 1 && (
                  <div className={styles.flowConnector}>
                    <div
                      className={styles.connectorProgress}
                      style={{
                        width: isCompleted || isActive ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Simulated Response Box */}
      {responseReady && (
        <div className={styles.responseBox}>
          <div className={styles.responseHeader}>
            <span className={styles.statusTag}>
              <FiCheckCircle size={13} />
              <span>HTTP 200 OK</span>
            </span>
            <span className={styles.latencyTag}>Execution Latency: 18.4ms</span>
          </div>

          <pre className={styles.jsonOutput}>
            {JSON.stringify(sampleResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiPlayground;
