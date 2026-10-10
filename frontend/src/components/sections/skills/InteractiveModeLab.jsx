import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  FiSend,
  FiPlay,
  FiCheck,
  FiRefreshCw,
  FiActivity,
  FiShield,
  FiLock,
  FiCpu,
  FiSliders,
  FiCompass,
  FiZap,
} from 'react-icons/fi';
import BrandDesignLab from './BrandDesignLab';
import styles from './InteractiveModeLab.module.css';

/**
 * Living Architectural Flows & Engineering Systems
 * Connected, interactive workflows demonstrating full-stack and frontend mechanics:
 * 1. INTERACTION: Pointer -> Event -> State -> Component -> Render -> Motion
 * 2. API: Browser -> HTTP -> Route -> Controller -> Service -> DB -> Response -> UI State
 * 3. AUTH: Form -> Validation -> Request -> Server -> Credential Check -> JWT -> Session -> Protected Route
 * 4. DATA: UI -> Query -> Service -> ORM -> Database -> Result -> Transform -> Product UI
 * 5. REACT: State -> Component Tree -> Reconciliation -> Commit Phase -> Browser Paint
 * 6. MOTION: Pointer/Scroll -> Motion Value -> GSAP/Motion -> Transform -> Compositor
 * 7. DEPLOY: Code -> Git -> Build -> Type Check -> Test -> Deploy -> Production
 * 8. PERFORMANCE: Main Thread vs Hardware GPU Compositor Pipeline
 */
const InteractiveModeLab = () => {
  const [activeWorkflow, setActiveWorkflow] = useState('api');

  // 1. INTERACTION state
  const [interactionActive, setInteractionActive] = useState(false);
  const [interactionStep, setInteractionStep] = useState(-1);
  const [interactionDelta, setInteractionDelta] = useState({ x: 0, scale: 1 });

  // 2. API REQUEST state
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [apiStep, setApiStep] = useState(-1);
  const [apiCompleted, setApiCompleted] = useState(false);

  // 3. AUTH state
  const [isAuthRunning, setIsAuthRunning] = useState(false);
  const [authStep, setAuthStep] = useState(-1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 4. DATA state
  const [isDataRunning, setIsDataRunning] = useState(false);
  const [dataStep, setDataStep] = useState(-1);
  const [dataCompleted, setDataCompleted] = useState(false);

  // 5. REACT state
  const [isReactRunning, setIsReactRunning] = useState(false);
  const [reactStep, setReactStep] = useState(-1);
  const [renderVersion, setRenderVersion] = useState(1);

  // 6. MOTION state
  const [activeMotionSub, setActiveMotionSub] = useState('split');
  const [motionBranch, setMotionBranch] = useState('gsap'); // 'gsap' | 'motion'
  const [morphIndex, setMorphIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrubValue, setScrubValue] = useState(40);

  // 7. DEPLOY state
  const [isDeployRunning, setIsDeployRunning] = useState(false);
  const [deployStep, setDeployStep] = useState(-1);
  const [isLive, setIsLive] = useState(false);

  // 8. PERFORMANCE state
  const [isPerfRunning, setIsPerfRunning] = useState(false);
  const [perfStep, setPerfStep] = useState(-1);

  // Refs for direct GSAP tweens
  const splitCharsRef = useRef([]);
  splitCharsRef.current = [];
  const drawVectorRef = useRef(null);
  const scrubTargetRef = useRef(null);

  const addCharRef = (el) => {
    if (el && !splitCharsRef.current.includes(el)) {
      splitCharsRef.current.push(el);
    }
  };

  const workflows = [
    { id: 'brand', label: 'BRAND & LOGO SYSTEM', accent: '#D7C8FF' },
    { id: 'interaction', label: 'INTERACTION', accent: '#CDE8D5' },
    { id: 'api', label: 'API LIFECYCLE', accent: '#D7C8FF' },
    { id: 'auth', label: 'AUTH', accent: '#FFCDB2' },
    { id: 'data', label: 'DATA ACCESS', accent: '#FFE6BF' },
    { id: 'react', label: 'REACT FLOW', accent: '#D7C8FF' },
    { id: 'motion', label: 'MOTION', accent: '#FFCDB2' },
    { id: 'deploy', label: 'DEPLOY', accent: '#CDE8D5' },
    { id: 'performance', label: 'PERFORMANCE', accent: '#FFE6BF' },
  ];

  // -------------------------------------------------------------
  // TRIGGER 1: INTERACTION
  // -------------------------------------------------------------
  const triggerInteraction = () => {
    if (interactionActive) return;
    setInteractionActive(true);
    setInteractionStep(0);

    const steps = 6;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setInteractionStep(i);
        if (i === steps - 1) {
          setInteractionDelta({ x: 18, scale: 1.08 });
          setTimeout(() => {
            setInteractionDelta({ x: 0, scale: 1 });
            setInteractionActive(false);
          }, 600);
        }
      }, i * 160);
    }
  };

  // -------------------------------------------------------------
  // TRIGGER 2: API REQUEST
  // -------------------------------------------------------------
  const apiNodes = [
    { label: 'BROWSER', sub: 'HTTP / Client' },
    { label: 'REQUEST', sub: 'GET /api/projects' },
    { label: 'ROUTE', sub: 'Fastify Matcher' },
    { label: 'CONTROLLER', sub: 'Payload Guard' },
    { label: 'SERVICE', sub: 'Domain Logic' },
    { label: 'DATABASE', sub: 'Postgres Pool' },
    { label: 'RESPONSE', sub: '200 OK (14.2ms)' },
    { label: 'UI STATE', sub: 'React Commit' },
  ];

  const triggerApiRequest = () => {
    if (isApiRunning) return;
    setIsApiRunning(true);
    setApiCompleted(false);
    setApiStep(0);

    apiNodes.forEach((_, idx) => {
      setTimeout(() => {
        setApiStep(idx);
        if (idx === apiNodes.length - 1) {
          setTimeout(() => {
            setApiCompleted(true);
            setIsApiRunning(false);
          }, 240);
        }
      }, idx * 190);
    });
  };

  // -------------------------------------------------------------
  // TRIGGER 3: AUTH
  // -------------------------------------------------------------
  const authNodes = [
    { label: 'LOGIN FORM', sub: 'Client Credentials' },
    { label: 'VALIDATION', sub: 'Schema Guard' },
    { label: 'REQUEST', sub: 'POST /api/auth' },
    { label: 'CONTROLLER', sub: 'Rate Limiter' },
    { label: 'VERIFICATION', sub: 'Argon2 Hash Match' },
    { label: 'JWT SIGNING', sub: 'HMAC-SHA256' },
    { label: 'SESSION', sub: 'HTTP-Only Cookie' },
    { label: 'PROTECTED ROUTE', sub: '/dashboard [OK]' },
  ];

  const triggerAuthFlow = () => {
    if (isAuthRunning) return;
    setIsAuthRunning(true);
    setIsAuthenticated(false);
    setAuthStep(0);

    authNodes.forEach((_, idx) => {
      setTimeout(() => {
        setAuthStep(idx);
        if (idx === authNodes.length - 1) {
          setTimeout(() => {
            setIsAuthenticated(true);
            setIsAuthRunning(false);
          }, 260);
        }
      }, idx * 190);
    });
  };

  // -------------------------------------------------------------
  // TRIGGER 4: DATA ACCESS
  // -------------------------------------------------------------
  const dataNodes = [
    { label: 'UI HOOK', sub: 'useProjects()' },
    { label: 'QUERY BUFFER', sub: 'SQL / Prisma' },
    { label: 'SERVICE', sub: 'Repository' },
    { label: 'DRIVER POOL', sub: 'pg-bouncer' },
    { label: 'DATABASE', sub: 'B-Tree Index Scan' },
    { label: 'TUPLES', sub: '3 rows (1.2ms)' },
    { label: 'TRANSFORM', sub: 'Type Serialization' },
    { label: 'PRODUCT UI', sub: '3 records rendered' },
  ];

  const triggerDataQuery = () => {
    if (isDataRunning) return;
    setIsDataRunning(true);
    setDataCompleted(false);
    setDataStep(0);

    dataNodes.forEach((_, idx) => {
      setTimeout(() => {
        setDataStep(idx);
        if (idx === dataNodes.length - 1) {
          setTimeout(() => {
            setDataCompleted(true);
            setIsDataRunning(false);
          }, 240);
        }
      }, idx * 180);
    });
  };

  // -------------------------------------------------------------
  // TRIGGER 5: REACT RENDERING
  // -------------------------------------------------------------
  const reactNodes = [
    { label: 'STATE / CONTEXT', desc: 'Hook state or context value mutated' },
    { label: 'COMPONENT TREE', desc: 'Fiber nodes scheduled for evaluation' },
    { label: 'RECONCILIATION', desc: 'React diffs virtual DOM tree heuristics' },
    { label: 'COMMIT PHASE', desc: 'DOM mutations batched and applied' },
    { label: 'BROWSER PAINT', desc: 'Hardware compositor renders UI (0 reflow)' },
  ];

  const triggerReactState = () => {
    if (isReactRunning) return;
    setIsReactRunning(true);
    setReactStep(0);

    reactNodes.forEach((_, idx) => {
      setTimeout(() => {
        setReactStep(idx);
        if (idx === reactNodes.length - 1) {
          setTimeout(() => {
            setRenderVersion((v) => v + 1);
            setIsReactRunning(false);
          }, 240);
        }
      }, idx * 190);
    });
  };

  // -------------------------------------------------------------
  // TRIGGER 6: MOTION & ANIMATION PIPELINE
  // -------------------------------------------------------------
  const playSplitAnimation = () => {
    if (splitCharsRef.current.length === 0) return;
    gsap.fromTo(
      splitCharsRef.current,
      { opacity: 0, y: 32, rotateX: 60, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.026,
        ease: 'back.out(2)',
        overwrite: 'auto',
      }
    );
  };

  const playDrawAnimation = () => {
    const path = drawVectorRef.current;
    if (!path) return;
    const length = path.getTotalLength ? path.getTotalLength() : 380;
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 1.35, ease: 'power2.inOut', overwrite: 'auto' }
    );
  };

  const morphShapes = [
    'M 20,60 Q 60,10 100,60 T 180,60 Q 160,110 100,110 T 20,60 Z',
    'M 100,20 Q 160,20 160,65 T 100,110 Q 40,110 40,65 T 100,20 Z',
    'M 100,15 L 165,65 L 100,115 L 35,65 Z',
  ];

  useEffect(() => {
    if (activeMotionSub === 'split') {
      setTimeout(playSplitAnimation, 60);
    } else if (activeMotionSub === 'draw') {
      setTimeout(playDrawAnimation, 60);
    }
  }, [activeMotionSub]);

  // Scrub demo interaction
  useEffect(() => {
    if (scrubTargetRef.current) {
      const angle = (scrubValue / 100) * 360;
      const scale = 0.85 + (scrubValue / 100) * 0.35;
      gsap.to(scrubTargetRef.current, {
        rotation: angle,
        scale: scale,
        duration: 0.1,
        ease: 'none',
      });
    }
  }, [scrubValue]);

  // -------------------------------------------------------------
  // TRIGGER 7: DEPLOY PIPELINE
  // -------------------------------------------------------------
  const deployNodes = [
    { label: 'git push', sub: 'origin/main commit' },
    { label: 'npm run build', sub: 'Vite & Rolldown bundle' },
    { label: 'TypeScript', sub: 'Strict static check (0 err)' },
    { label: 'Unit & E2E', sub: 'Automated test suite' },
    { label: 'Edge Deploy', sub: 'Global CDN distribution' },
    { label: 'LIVE ✓', sub: 'Production rollout complete' },
  ];

  const triggerDeployPipeline = () => {
    if (isDeployRunning) return;
    setIsDeployRunning(true);
    setIsLive(false);
    setDeployStep(0);

    deployNodes.forEach((_, idx) => {
      setTimeout(() => {
        setDeployStep(idx);
        if (idx === deployNodes.length - 1) {
          setTimeout(() => {
            setIsLive(true);
            setIsDeployRunning(false);
          }, 240);
        }
      }, idx * 220);
    });
  };

  // -------------------------------------------------------------
  // TRIGGER 8: PERFORMANCE
  // -------------------------------------------------------------
  const triggerPerfProfile = () => {
    if (isPerfRunning) return;
    setIsPerfRunning(true);
    setPerfStep(0);

    const steps = 4;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setPerfStep(i);
        if (i === steps - 1) {
          setTimeout(() => setIsPerfRunning(false), 400);
        }
      }, i * 220);
    }
  };

  const currentWf = workflows.find((w) => w.id === activeWorkflow);

  return (
    <div className={styles.livingFlowsContainer}>
      {/* ==============================================================
          WORKFLOW NAVIGATION: Compact Editorial Links with Pastel Underline
          ============================================================== */}
      <nav className={styles.workflowNav} aria-label="Living architectural workflows">
        <div className={styles.navLinksRow}>
          {workflows.map((wf, idx) => {
            const isActive = activeWorkflow === wf.id;

            return (
              <React.Fragment key={wf.id}>
                {idx > 0 && <span className={styles.navInterpunct}>·</span>}
                <button
                  className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`}
                  onClick={() => setActiveWorkflow(wf.id)}
                  data-cursor="hover"
                >
                  <span className={styles.navLabel}>{wf.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="wfNavUnderline"
                      className={styles.activeUnderline}
                      style={{ backgroundColor: wf.accent }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </nav>

      {/* ==============================================================
          WORKFLOW PANE (Editorial Hierarchy: Eyebrow, Title, Description, Trigger, Flow)
          ============================================================== */}
      <div className={styles.flowStageCanvas}>
        {/* ------------------------------------------------------------
            0. BRAND IDENTITY & DESIGN SYSTEM PLAYGROUND
            ------------------------------------------------------------ */}
        {activeWorkflow === 'brand' && (
          <div className={styles.flowPane}>
            <BrandDesignLab />
          </div>
        )}

        {/* ------------------------------------------------------------
            1. USER INTERACTION WORKFLOW
            ------------------------------------------------------------ */}
        {activeWorkflow === 'interaction' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  01 — USER INTERACTION PIPELINE
                </span>
                <h3 className={styles.headline}>
                  POINTER → EVENT → STATE → COMPONENT → RENDER → MOTION
                </h3>
                <p className={styles.description}>
                  Tracing pointer input through event capture, state mutation, virtual reconciliation, and physical motion response.
                </p>
              </div>

              <button
                className={styles.triggerBtn}
                onClick={triggerInteraction}
                disabled={interactionActive}
                data-cursor="cta"
                data-cursor-text="TRY"
              >
                <span>{interactionActive ? 'Propagating Event...' : 'TRIGGER INTERACTION'}</span>
                <FiZap size={11} />
              </button>
            </div>

            {/* Pipeline Strip */}
            <div className={styles.pipelineStrip}>
              {['POINTER', 'EVENT', 'STATE', 'COMPONENT', 'RENDER', 'MOTION'].map((step, idx) => {
                const isActive = interactionStep === idx;
                const isPast = interactionStep > idx;

                return (
                  <React.Fragment key={step}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{step}</span>
                    </div>

                    {idx < 5 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Live Interactive Outcome */}
            <div className={styles.liveOutcomeArea}>
              <div
                className={styles.reactiveObject}
                style={{
                  transform: `translateX(${interactionDelta.x}px) scale(${interactionDelta.scale})`,
                  borderColor: interactionActive ? '#F5F3EE' : 'var(--border)',
                }}
              >
                <span className={styles.reactiveLabel}>Spring Target</span>
                <span className={styles.reactiveTelemetry}>
                  {interactionActive
                    ? 'State mutated · Frame 60fps · RAF transform committed'
                    : 'Awaiting user input trigger'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            2. API REQUEST LIFECYCLE
            ------------------------------------------------------------ */}
        {activeWorkflow === 'api' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  02 — REQUEST LIFECYCLE
                </span>
                <h3 className={styles.headline}>
                  REQUEST → APPLICATION → DATA → RESPONSE
                </h3>
                <p className={styles.description}>
                  Tracing a typed request from the browser through routing, controller orchestration, service layer, persistence layer, and back into the UI.
                </p>
              </div>

              <div className={styles.actionPillGroup}>
                <span className={styles.codePill}>GET /api/projects</span>
                <button
                  className={styles.triggerBtn}
                  onClick={triggerApiRequest}
                  disabled={isApiRunning}
                  data-cursor="cta"
                  data-cursor-text="SEND"
                >
                  <span>{isApiRunning ? 'Packet Traveling...' : 'SEND REQUEST'}</span>
                  <FiSend size={11} />
                </button>
              </div>
            </div>

            {/* Hierarchical Pipeline Strip */}
            <div className={styles.pipelineStrip}>
              {apiNodes.map((node, idx) => {
                const isActive = apiStep === idx;
                const isPast = apiStep > idx;

                return (
                  <React.Fragment key={node.label}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span className={styles.layerBadge}>{node.sub}</span>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{node.label}</span>
                    </div>

                    {idx < apiNodes.length - 1 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Live Response Outcome */}
            {apiCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.liveOutcomeArea}
              >
                <div className={styles.resultStrip}>
                  <span className={styles.okBadge}>
                    <FiCheck size={12} />
                    <span>200 OK</span>
                  </span>
                  <span className={styles.latencyNote}>Roundtrip 14.2ms</span>
                  <span className={styles.dividerDot}>·</span>
                  <span className={styles.recordsText}>
                    3 records loaded: [ "Dezoryn Technologies", "VEXO Music", "SkillLoop Platform" ]
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------
            3. AUTHENTICATION & ACCESS CONTROL
            ------------------------------------------------------------ */}
        {activeWorkflow === 'auth' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  03 — AUTHENTICATION & AUTHORIZATION
                </span>
                <h3 className={styles.headline}>
                  CREDENTIALS → VALIDATION → TOKEN SIGNING → CLIENT SESSION → PROTECTED ROUTE
                </h3>
                <p className={styles.description}>
                  Stateless cryptographic authentication lifecycle from client schema validation to JWT verification and role-based route guarding.
                </p>
              </div>

              <div className={styles.actionPillGroup}>
                <span className={styles.codePill}>POST /api/auth/login</span>
                <button
                  className={styles.triggerBtn}
                  onClick={triggerAuthFlow}
                  disabled={isAuthRunning}
                  data-cursor="cta"
                  data-cursor-text="TRY"
                >
                  <FiLock size={11} />
                  <span>{isAuthRunning ? 'Validating Token...' : 'AUTHENTICATE'}</span>
                </button>
              </div>
            </div>

            {/* Pipeline Strip */}
            <div className={styles.pipelineStrip}>
              {authNodes.map((node, idx) => {
                const isActive = authStep === idx;
                const isPast = authStep > idx;

                return (
                  <React.Fragment key={node.label}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span className={styles.layerBadge}>{node.sub}</span>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{node.label}</span>
                    </div>

                    {idx < authNodes.length - 1 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Auth Session Transition */}
            <div className={styles.liveOutcomeArea}>
              <div className={styles.authStatusBadge}>
                {isAuthenticated ? (
                  <span className={styles.authGranted}>
                    <FiShield size={13} />
                    <span>AUTHENTICATED: /dashboard [Bearer Token Active · RBAC: Verified Developer · 200 OK]</span>
                  </span>
                ) : (
                  <span className={styles.authPending}>
                    <span>SESSION STATE: Unauthenticated Visitor (Public Scope)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            4. DATA ACCESS & QUERY FLOW
            ------------------------------------------------------------ */}
        {activeWorkflow === 'data' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  04 — DATA ACCESS & QUERY FLOW
                </span>
                <h3 className={styles.headline}>
                  QUERY → ORM / DRIVER → PERSISTENCE → RESULT → TRANSFORM → UI
                </h3>
                <p className={styles.description}>
                  How application data moves from a typed query into persistence and back into the product interface.
                </p>
              </div>

              <div className={styles.actionPillGroup}>
                <span className={styles.codePill}>SELECT * FROM projects WHERE featured = true;</span>
                <button
                  className={styles.triggerBtn}
                  onClick={triggerDataQuery}
                  disabled={isDataRunning}
                  data-cursor="cta"
                  data-cursor-text="TRY"
                >
                  <FiPlay size={11} />
                  <span>{isDataRunning ? 'Executing Plan...' : 'RUN QUERY'}</span>
                </button>
              </div>
            </div>

            {/* Pipeline Strip */}
            <div className={styles.pipelineStrip}>
              {dataNodes.map((node, idx) => {
                const isActive = dataStep === idx;
                const isPast = dataStep > idx;

                return (
                  <React.Fragment key={node.label}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span className={styles.layerBadge}>{node.sub}</span>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{node.label}</span>
                    </div>

                    {idx < dataNodes.length - 1 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Query Outcome */}
            {dataCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.liveOutcomeArea}
              >
                <div className={styles.dataResultsCard}>
                  <div className={styles.resultMetaRow}>
                    <span className={styles.dataMeta}>QUERY COMPLETE</span>
                    <span className={styles.dataMetaSub}>3 rows returned via B-Tree index scan</span>
                  </div>
                  <div className={styles.projectChips}>
                    <span className={styles.chipItem}>Dezoryn Technologies</span>
                    <span className={styles.chipItem}>VEXO Music</span>
                    <span className={styles.chipItem}>SkillLoop Platform</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------
            5. REACT STATE FLOW & RECONCILIATION
            ------------------------------------------------------------ */}
        {activeWorkflow === 'react' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  05 — RENDERING & COMPONENT FLOW
                </span>
                <h3 className={styles.headline}>
                  STATE / CONTEXT → COMPONENT TREE → RECONCILIATION → COMMIT → BROWSER PAINT
                </h3>
                <p className={styles.description}>
                  How state changes propagate through React's component tree before the browser commits the resulting UI update.
                </p>
              </div>

              <button
                className={styles.triggerBtn}
                onClick={triggerReactState}
                disabled={isReactRunning}
                data-cursor="cta"
                data-cursor-text="TRY"
              >
                <FiActivity size={11} />
                <span>{isReactRunning ? 'Diffing Virtual DOM...' : 'DISPATCH STATE'}</span>
              </button>
            </div>

            {/* Pipeline Strip with precise step explanations */}
            <div className={styles.pipelineStrip}>
              {reactNodes.map((node, idx) => {
                const isActive = reactStep === idx;
                const isPast = reactStep > idx;

                return (
                  <React.Fragment key={node.label}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span className={styles.layerBadge}>{node.desc}</span>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{node.label}</span>
                    </div>

                    {idx < reactNodes.length - 1 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Live React Render Telemetry */}
            <div className={styles.liveOutcomeArea}>
              <div className={styles.reactTelemetry}>
                <span>Fiber Reconciliation Pass: #{renderVersion}</span>
                <span className={styles.telemetryDivider}>·</span>
                <span>Virtual DOM diffing latency: 0.7ms</span>
                <span className={styles.telemetryDivider}>·</span>
                <span className={styles.telemetryHighlight}>0 layout reflows</span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            6. MOTION SYSTEMS
            ------------------------------------------------------------ */}
        {activeWorkflow === 'motion' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  06 — MOTION SYSTEMS & ANIMATION PIPELINE
                </span>
                <h3 className={styles.headline}>
                  USER INPUT → POINTER / SCROLL → MOTION VALUE → GSAP / MOTION → TRANSFORM → COMPOSITOR
                </h3>
                <p className={styles.description}>
                  Interaction primitives used to turn state, pointer input, and scroll position into responsive interface motion.
                </p>
              </div>

              {/* Engine Branch Selector */}
              <div className={styles.engineBranchRow}>
                <button
                  className={`${styles.branchBtn} ${motionBranch === 'gsap' ? styles.branchBtnActive : ''}`}
                  onClick={() => setMotionBranch('gsap')}
                  data-cursor="hover"
                >
                  <span>GSAP (ScrollTrigger · SplitText · Flip)</span>
                </button>
                <button
                  className={`${styles.branchBtn} ${motionBranch === 'motion' ? styles.branchBtnActive : ''}`}
                  onClick={() => setMotionBranch('motion')}
                  data-cursor="hover"
                >
                  <span>MOTION (Spring · Gesture · Layout)</span>
                </button>
              </div>
            </div>

            {/* Interactive Motion Experiments Navigation */}
            <div className={styles.motionControlsRibbon}>
              {['split', 'morph', 'draw', 'flip', 'scrub'].map((m) => (
                <button
                  key={m}
                  className={`${styles.motionCtrlBtn} ${activeMotionSub === m ? styles.motionCtrlActive : ''}`}
                  onClick={() => setActiveMotionSub(m)}
                  data-cursor="hover"
                >
                  <span>[ {m.toUpperCase()} ]</span>
                </button>
              ))}
            </div>

            {/* Active Motion Stage */}
            <div className={styles.openMotionCanvas}>
              {activeMotionSub === 'split' && (
                <div className={styles.motionCenterBox}>
                  <div className={styles.splitTypo}>
                    {'BUILD DIGITAL EXPERIENCES'.split('').map((char, idx) => (
                      <span
                        key={idx}
                        ref={addCharRef}
                        className={styles.splitChar}
                        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </div>
                  <button className={styles.reActionBtn} onClick={playSplitAnimation}>
                    <FiRefreshCw size={11} />
                    <span>Replay SplitText Stagger</span>
                  </button>
                </div>
              )}

              {activeMotionSub === 'morph' && (
                <div className={styles.motionCenterBox}>
                  <svg className={styles.motionSvg} viewBox="0 0 200 130">
                    <path
                      className={styles.morphPath}
                      d={morphShapes[morphIndex % morphShapes.length]}
                    />
                  </svg>
                  <button className={styles.reActionBtn} onClick={() => setMorphIndex((i) => i + 1)}>
                    <FiRefreshCw size={11} />
                    <span>Morph Bezier Geometry ({(morphIndex % morphShapes.length) + 1}/3)</span>
                  </button>
                </div>
              )}

              {activeMotionSub === 'draw' && (
                <div className={styles.motionCenterBox}>
                  <svg className={styles.motionSvg} viewBox="0 0 200 130">
                    <path
                      ref={drawVectorRef}
                      className={styles.drawPath}
                      d="M 20,65 C 60,10 80,120 110,65 S 150,10 180,65"
                    />
                  </svg>
                  <button className={styles.reActionBtn} onClick={playDrawAnimation}>
                    <FiRefreshCw size={11} />
                    <span>Draw Vector Stroke</span>
                  </button>
                </div>
              )}

              {activeMotionSub === 'flip' && (
                <div className={styles.motionCenterBox}>
                  <motion.div
                    layout
                    className={`${styles.flipCard} ${isFlipped ? styles.flipCardExpanded : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    data-cursor="hover"
                    data-cursor-text="FLIP"
                  >
                    <strong>{isFlipped ? 'FLIP Layout Morph (Expanded)' : 'Compact Layout'}</strong>
                    <span className={styles.flipSub}>
                      {isFlipped ? 'Click to collapse' : 'Click to calculate DOM bounding boxes & FLIP'}
                    </span>
                  </motion.div>
                </div>
              )}

              {activeMotionSub === 'scrub' && (
                <div className={styles.scrubDemoBox}>
                  <div ref={scrubTargetRef} className={styles.scrubTarget}>
                    <FiCompass size={32} />
                  </div>
                  <div className={styles.scrubSliderRow}>
                    <span className={styles.scrubTag}>ScrollTrigger Timeline Scrub</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={scrubValue}
                      onChange={(e) => setScrubValue(Number(e.target.value))}
                      className={styles.scrubInput}
                    />
                    <span className={styles.scrubPct}>{scrubValue}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            7. DEPLOYMENT & CI/CD PIPELINE
            ------------------------------------------------------------ */}
        {activeWorkflow === 'deploy' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  07 — PRODUCTION DEPLOYMENT PIPELINE
                </span>
                <h3 className={styles.headline}>
                  CODE → GIT → BUILD → TYPE CHECK → TEST → DEPLOY → PRODUCTION
                </h3>
                <p className={styles.description}>
                  From source commit to static type checking, ES-Next bundling, automated verification, and global edge CDN routing.
                </p>
              </div>

              <button
                className={styles.triggerBtn}
                onClick={triggerDeployPipeline}
                disabled={isDeployRunning}
                data-cursor="cta"
                data-cursor-text="TRY"
              >
                <FiZap size={11} />
                <span>{isDeployRunning ? 'Running CI/CD Pipeline...' : 'BUILD PIPELINE'}</span>
              </button>
            </div>

            {/* Pipeline Strip */}
            <div className={styles.pipelineStrip}>
              {deployNodes.map((node, idx) => {
                const isActive = deployStep === idx;
                const isPast = deployStep > idx;

                return (
                  <React.Fragment key={node.label}>
                    <div className={`${styles.nodeCol} ${isActive ? styles.nodeColActive : ''}`}>
                      <span className={styles.layerBadge}>{node.sub}</span>
                      <span
                        className={styles.signalDot}
                        style={{
                          backgroundColor: isActive || isPast ? '#F5F3EE' : 'var(--border-dark)',
                          transform: isActive ? 'scale(1.7)' : 'scale(1)',
                        }}
                      />
                      <span className={styles.nodeName}>{node.label}</span>
                    </div>

                    {idx < deployNodes.length - 1 && (
                      <div className={styles.trackLine}>
                        <span
                          className={styles.trackFill}
                          style={{
                            width: isPast || isActive ? '100%' : '0%',
                            backgroundColor: '#F5F3EE',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Live Deployment Outcome */}
            <div className={styles.liveOutcomeArea}>
              <div className={styles.deployStatusStrip}>
                {isLive ? (
                  <span className={styles.livePill}>
                    <span className={styles.greenPulse} />
                    <span>LIVE: Edge deployment active across 285+ global PoPs · Zero-downtime atomic swap</span>
                  </span>
                ) : (
                  <span className={styles.stagedPill}>
                    <span>Pipeline Status: Ready for release trigger</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
            8. RENDER PERFORMANCE & GPU COMPOSITING
            ------------------------------------------------------------ */}
        {activeWorkflow === 'performance' && (
          <div className={styles.flowPane}>
            <div className={styles.paneHeader}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow} style={{ color: '#F5F3EE' }}>
                  08 — RENDER PERFORMANCE & GPU COMPOSITION
                </span>
                <h3 className={styles.headline}>
                  MAIN THREAD BOTTLENECK vs HARDWARE-ACCELERATED COMPOSITING
                </h3>
                <p className={styles.description}>
                  Comparing layout reflow against composite-only transforms executing directly on the GPU compositor thread with 0ms main thread blocking.
                </p>
              </div>

              <button
                className={styles.triggerBtn}
                onClick={triggerPerfProfile}
                disabled={isPerfRunning}
                data-cursor="cta"
                data-cursor-text="TRY"
              >
                <FiActivity size={11} />
                <span>{isPerfRunning ? 'Profiling Pipeline...' : 'PROFILE PIPELINE'}</span>
              </button>
            </div>

            {/* Dual Paths Comparison */}
            <div className={styles.perfCompareArea}>
              {/* Path 1: Heavy Layout */}
              <div className={styles.perfPathBlock}>
                <span className={styles.pathHeader}>Layout-Triggering Pipeline (Jank Risk)</span>
                <div className={styles.pathFlow}>
                  <span>Input</span>
                  <span>→</span>
                  <span>Style Recalc</span>
                  <span>→</span>
                  <span className={styles.bottleneckNode}>Layout (Reflow)</span>
                  <span>→</span>
                  <span className={styles.bottleneckNode}>Paint (Repaint)</span>
                  <span>→</span>
                  <span>Composite</span>
                </div>
              </div>

              {/* Path 2: Optimized Hardware Compositor */}
              <div className={`${styles.perfPathBlock} ${styles.optimizedBlock}`}>
                <span className={styles.pathHeaderOpt}>Hardware-Accelerated Path (Sage Optimized)</span>
                <div className={styles.pathFlow}>
                  <span>User Input</span>
                  <span>→</span>
                  <span className={styles.optNode}>Transform & Opacity</span>
                  <span>→</span>
                  <span className={styles.optNode}>GPU Compositor Thread</span>
                  <span>→</span>
                  <span className={styles.optNode}>60 / 120 FPS Fluid Paint</span>
                </div>
              </div>
            </div>

            {/* Performance Telemetry */}
            <div className={styles.liveOutcomeArea}>
              <div className={styles.perfTelemetryRow}>
                <span>Cumulative Layout Shift: <strong>0.000</strong></span>
                <span className={styles.telemetryDivider}>·</span>
                <span>Main Thread Utilization: <strong>&lt; 2.1%</strong></span>
                <span className={styles.telemetryDivider}>·</span>
                <span>Compositor Thread: <strong>Zero Jank / 120 FPS</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveModeLab;
