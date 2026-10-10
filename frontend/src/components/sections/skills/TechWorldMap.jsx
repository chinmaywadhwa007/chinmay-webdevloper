import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONSTELLATION_NODES } from './skillsData';
import styles from './TechWorldMap.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Map Layout Positions (% of container) ─────────────────────────────────
// LEFT/WEST: Frontend   CENTER: Backend/API   LOWER: Database   RIGHT: Motion
const MAP_POSITIONS = {
  // FRONTEND - West region
  html:         { x: 8,  y: 32 },
  css:          { x: 8,  y: 52 },
  javascript:   { x: 16, y: 22 },
  typescript:   { x: 18, y: 40 },
  react:        { x: 25, y: 30 },
  nextjs:       { x: 22, y: 58 },
  tailwind:     { x: 12, y: 68 },

  // BACKEND - Center region
  nodejs:       { x: 48, y: 30 },
  express:      { x: 42, y: 45 },
  fastify:      { x: 56, y: 20 },
  'rest-api':   { x: 50, y: 50 },
  jwt:          { x: 58, y: 42 },
  rbac:         { x: 60, y: 58 },

  // DATABASE - Lower center
  mongodb:      { x: 40, y: 72 },
  mongoose:     { x: 32, y: 82 },
  postgresql:   { x: 52, y: 76 },
  sql:          { x: 58, y: 86 },
  prisma:       { x: 46, y: 88 },

  // MOTION & MEDIA - East region
  gsap:         { x: 74, y: 24 },
  scrolltrigger:{ x: 78, y: 38 },
  splittext:    { x: 82, y: 52 },
  'motion-react':{ x: 72, y: 48 },
  svg:          { x: 68, y: 62 },
  videojs:      { x: 82, y: 70 },
};

// Category-filtered positions (collapse to groups)
const CATEGORY_POSITIONS = {
  frontend: {
    html:         { x: 15, y: 25 },
    css:          { x: 15, y: 50 },
    javascript:   { x: 30, y: 18 },
    typescript:   { x: 28, y: 40 },
    react:        { x: 45, y: 30 },
    nextjs:       { x: 35, y: 60 },
    tailwind:     { x: 20, y: 70 },
    nodejs:       { x: 82, y: 30 },
    express:      { x: 82, y: 45 },
    fastify:      { x: 86, y: 18 },
    'rest-api':   { x: 80, y: 55 },
    jwt:          { x: 88, y: 40 },
    rbac:         { x: 90, y: 60 },
    mongodb:      { x: 72, y: 75 },
    mongoose:     { x: 65, y: 85 },
    postgresql:   { x: 80, y: 78 },
    sql:          { x: 87, y: 88 },
    prisma:       { x: 76, y: 90 },
    gsap:         { x: 56, y: 22 },
    scrolltrigger:{ x: 60, y: 38 },
    splittext:    { x: 65, y: 52 },
    'motion-react':{ x: 54, y: 48 },
    svg:          { x: 50, y: 62 },
    videojs:      { x: 66, y: 72 },
  },
  backend: {
    nodejs:       { x: 35, y: 28 },
    express:      { x: 28, y: 44 },
    fastify:      { x: 42, y: 18 },
    'rest-api':   { x: 38, y: 52 },
    jwt:          { x: 50, y: 38 },
    rbac:         { x: 52, y: 58 },
    html:         { x: 10, y: 25 },
    css:          { x: 10, y: 45 },
    javascript:   { x: 14, y: 18 },
    typescript:   { x: 14, y: 38 },
    react:        { x: 20, y: 30 },
    nextjs:       { x: 18, y: 56 },
    tailwind:     { x: 12, y: 68 },
    mongodb:      { x: 55, y: 72 },
    mongoose:     { x: 48, y: 82 },
    postgresql:   { x: 65, y: 76 },
    sql:          { x: 70, y: 86 },
    prisma:       { x: 60, y: 88 },
    gsap:         { x: 78, y: 22 },
    scrolltrigger:{ x: 82, y: 38 },
    splittext:    { x: 86, y: 52 },
    'motion-react':{ x: 76, y: 48 },
    svg:          { x: 72, y: 62 },
    videojs:      { x: 86, y: 72 },
  },
  database: {
    mongodb:      { x: 28, y: 36 },
    mongoose:     { x: 20, y: 56 },
    postgresql:   { x: 42, y: 36 },
    sql:          { x: 50, y: 56 },
    prisma:       { x: 36, y: 70 },
    nodejs:       { x: 55, y: 26 },
    express:      { x: 62, y: 42 },
    fastify:      { x: 68, y: 18 },
    'rest-api':   { x: 62, y: 56 },
    jwt:          { x: 72, y: 38 },
    rbac:         { x: 74, y: 58 },
    html:         { x: 10, y: 22 },
    css:          { x: 10, y: 42 },
    javascript:   { x: 14, y: 18 },
    typescript:   { x: 14, y: 35 },
    react:        { x: 20, y: 28 },
    nextjs:       { x: 16, y: 54 },
    tailwind:     { x: 10, y: 68 },
    gsap:         { x: 78, y: 22 },
    scrolltrigger:{ x: 82, y: 38 },
    splittext:    { x: 86, y: 52 },
    'motion-react':{ x: 76, y: 48 },
    svg:          { x: 72, y: 62 },
    videojs:      { x: 86, y: 72 },
  },
  motion: {
    gsap:         { x: 30, y: 25 },
    scrolltrigger:{ x: 22, y: 45 },
    splittext:    { x: 38, y: 48 },
    'motion-react':{ x: 45, y: 30 },
    svg:          { x: 52, y: 52 },
    videojs:      { x: 58, y: 35 },
    react:        { x: 14, y: 22 },
    typescript:   { x: 14, y: 40 },
    nextjs:       { x: 14, y: 58 },
    html:         { x: 8, y: 28 },
    css:          { x: 8, y: 48 },
    javascript:   { x: 8, y: 68 },
    tailwind:     { x: 8, y: 82 },
    nodejs:       { x: 72, y: 25 },
    express:      { x: 72, y: 45 },
    fastify:      { x: 78, y: 18 },
    'rest-api':   { x: 76, y: 58 },
    jwt:          { x: 82, y: 38 },
    rbac:         { x: 84, y: 58 },
    mongodb:      { x: 66, y: 72 },
    mongoose:     { x: 60, y: 82 },
    postgresql:   { x: 76, y: 76 },
    sql:          { x: 82, y: 86 },
    prisma:       { x: 70, y: 88 },
  },
};

// Connection routes shown — curated, meaningful relationships only
const MAP_ROUTES = [
  // Frontend -> Backend
  { from: 'react',      to: 'rest-api',   label: 'API calls' },
  { from: 'react',      to: 'nodejs',     label: 'SSR / API' },
  { from: 'nextjs',     to: 'rest-api',   label: 'API routes' },
  { from: 'typescript', to: 'react',      label: 'Type safety' },
  { from: 'javascript', to: 'react',      label: 'Core' },
  { from: 'html',       to: 'react',      label: 'JSX base' },
  { from: 'css',        to: 'tailwind',   label: 'Styling system' },
  // Backend internal
  { from: 'nodejs',     to: 'express',    label: 'Framework' },
  { from: 'nodejs',     to: 'fastify',    label: 'Framework' },
  { from: 'express',    to: 'rest-api',   label: 'Routes' },
  { from: 'fastify',    to: 'rest-api',   label: 'Routes' },
  { from: 'nodejs',     to: 'jwt',        label: 'Auth' },
  { from: 'jwt',        to: 'rbac',       label: 'Permissions' },
  // Backend -> Database
  { from: 'nodejs',     to: 'postgresql', label: 'SQL queries' },
  { from: 'nodejs',     to: 'mongodb',    label: 'Doc queries' },
  { from: 'postgresql', to: 'prisma',     label: 'ORM' },
  { from: 'mongodb',    to: 'mongoose',   label: 'ODM' },
  { from: 'postgresql', to: 'sql',        label: 'Query lang' },
  // Motion
  { from: 'gsap',       to: 'scrolltrigger', label: 'Plugin' },
  { from: 'gsap',       to: 'splittext',  label: 'Plugin' },
  { from: 'react',      to: 'motion-react', label: 'Animation' },
  { from: 'svg',        to: 'gsap',       label: 'Path anim' },
  { from: 'videojs',    to: 'react',      label: 'Component' },
  { from: 'motion-react', to: 'svg',      label: 'Layout' },
];

// Workflow nodes (for WORKFLOW mode)
const WORKFLOW_NODES = [
  { id: 'wf-user',     label: 'USER',     x: 48, y: 8,  color: '#A7A39B' },
  { id: 'wf-react',    label: 'REACT',    x: 48, y: 22, color: '#B8A9C9' },
  { id: 'wf-api',      label: 'REST API', x: 48, y: 38, color: '#B8A9C9' },
  { id: 'wf-nodejs',   label: 'NODE.JS',  x: 48, y: 52, color: '#51465F' },
  { id: 'wf-db',       label: 'DATABASE', x: 48, y: 65, color: '#DCCFB5' },
  { id: 'wf-auth',     label: 'AUTH / JWT', x: 72, y: 52, color: '#D9A895' },
  { id: 'wf-response', label: 'RESPONSE', x: 48, y: 78, color: '#D0C5DC' },
  { id: 'wf-ui',       label: 'UI UPDATE',x: 48, y: 90, color: '#B8A9C9' },
];

const WORKFLOW_ROUTES = [
  { from: 'wf-user',    to: 'wf-react' },
  { from: 'wf-react',   to: 'wf-api' },
  { from: 'wf-api',     to: 'wf-nodejs' },
  { from: 'wf-nodejs',  to: 'wf-auth' },
  { from: 'wf-nodejs',  to: 'wf-db' },
  { from: 'wf-db',      to: 'wf-response' },
  { from: 'wf-auth',    to: 'wf-response' },
  { from: 'wf-response',to: 'wf-ui' },
];

// Architecture mode
const ARCH_NODES = [
  { id: 'arch-fe',    label: 'FRONTEND',     sublabel: 'React · Next.js · TypeScript',  x: 48, y: 12, color: '#B8A9C9' },
  { id: 'arch-api',   label: 'API LAYER',    sublabel: 'REST APIs · Auth · Routing',    x: 48, y: 32, color: '#51465F' },
  { id: 'arch-svc',   label: 'SERVICE LAYER',sublabel: 'Node.js · Express · Fastify',   x: 48, y: 52, color: '#51465F' },
  { id: 'arch-db',    label: 'DATA LAYER',   sublabel: 'PostgreSQL · MongoDB · Prisma', x: 48, y: 72, color: '#DCCFB5' },
  { id: 'arch-motion',label: 'MOTION SYSTEM',sublabel: 'GSAP · ScrollTrigger · Motion', x: 80, y: 32, color: '#D0C5DC' },
  { id: 'arch-media', label: 'MEDIA ENGINE', sublabel: 'Video.js · SVG · Canvas',       x: 80, y: 52, color: '#D9A895' },
];

const ARCH_ROUTES = [
  { from: 'arch-fe',    to: 'arch-api' },
  { from: 'arch-api',   to: 'arch-svc' },
  { from: 'arch-svc',   to: 'arch-db' },
  { from: 'arch-fe',    to: 'arch-motion' },
  { from: 'arch-motion',to: 'arch-media' },
];

// Region labels
const REGION_LABELS = [
  { label: 'FRONTEND SYSTEM', x: 5,  y: 6,  align: 'left' },
  { label: 'API LAYER',       x: 46, y: 4,  align: 'center' },
  { label: 'DATA LAYER',      x: 46, y: 95, align: 'center' },
  { label: 'MOTION SYSTEM',   x: 93, y: 6,  align: 'right' },
  { label: 'MEDIA ENGINE',    x: 93, y: 74, align: 'right' },
];

// Decorative coordinates
const COORD_LABELS = [
  { text: '31.10N 75.87E', x: 4, y: 92 },
  { text: '48.85N  2.35E', x: 84, y: 14 },
  { text: '1.35N 103.81E', x: 66, y: 93 },
];

// Tech tooltip details
const TECH_DETAILS = {
  react:          { role: 'Frontend architecture',  projects: ['DigiMate','SkillLoop','Portfolio'] },
  typescript:     { role: 'Type safety layer',       projects: ['DigiMate','Dezoryn','Portfolio'] },
  nextjs:         { role: 'Full-stack React',        projects: ['VEXO','Enterprise'] },
  javascript:     { role: 'Core scripting',          projects: ['All Projects'] },
  html:           { role: 'Semantic structure',      projects: ['DigiMate','Portfolio','SkillLoop'] },
  css:            { role: 'Visual styling',          projects: ['Portfolio','All Projects'] },
  tailwind:       { role: 'Utility design system',  projects: ['Dezoryn','DigiMate','SkillLoop'] },
  nodejs:         { role: 'Server runtime',          projects: ['DigiMate','SkillLoop','Dezoryn'] },
  express:        { role: 'HTTP routing',            projects: ['DigiMate','SkillLoop'] },
  fastify:        { role: 'High-perf routing',       projects: ['Dezoryn'] },
  'rest-api':     { role: 'API contracts',           projects: ['DigiMate','SkillLoop','Dezoryn'] },
  jwt:            { role: 'Token auth',              projects: ['Dezoryn','DigiMate','SkillLoop'] },
  rbac:           { role: 'Role-based access',       projects: ['Dezoryn'] },
  postgresql:     { role: 'Relational database',     projects: ['Dezoryn','DigiMate'] },
  mongodb:        { role: 'Document database',       projects: ['SkillLoop','DigiMate'] },
  sql:            { role: 'Query language',          projects: ['DigiMate','Dezoryn'] },
  mongoose:       { role: 'MongoDB ODM',             projects: ['SkillLoop'] },
  prisma:         { role: 'Type-safe ORM',           projects: ['Prototypes'] },
  gsap:           { role: 'Animation engine',        projects: ['Portfolio'] },
  scrolltrigger:  { role: 'Scroll-based animation',  projects: ['Portfolio'] },
  splittext:      { role: 'Text splitting plugin',   projects: ['Portfolio'] },
  'motion-react': { role: 'React animation lib',     projects: ['Portfolio'] },
  svg:            { role: 'Vector graphics',         projects: ['Portfolio','Dezoryn'] },
  videojs:        { role: 'Video streaming',         projects: ['VEXO'] },
};

// ─── Lavender Highlight Variations for Capabilities ─────────────────────────
const CAPABILITY_LAVENDER_STYLES = [
  { bg: 'rgba(184, 169, 201, 0.14)', border: 'rgba(184, 169, 201, 0.38)', color: '#D0C5DC', dot: '#B8A9C9' },
  { bg: 'rgba(81, 70, 95, 0.38)',    border: 'rgba(184, 169, 201, 0.28)', color: '#B8A9C9', dot: '#51465F' },
  { bg: 'rgba(208, 197, 220, 0.12)', border: 'rgba(208, 197, 220, 0.32)', color: '#F3F0E8', dot: '#D0C5DC' },
  { bg: 'rgba(197, 184, 213, 0.18)', border: 'rgba(184, 169, 201, 0.42)', color: '#D0C5DC', dot: '#B8A9C9' },
  { bg: 'rgba(220, 207, 181, 0.12)', border: 'rgba(220, 207, 181, 0.30)', color: '#DCCFB5', dot: '#DCCFB5' }, // warm cream highlight
  { bg: 'rgba(217, 168, 149, 0.14)', border: 'rgba(217, 168, 149, 0.35)', color: '#D9A895', dot: '#D9A895' }, // subtle peach accent
  { bg: 'rgba(168, 150, 190, 0.16)', border: 'rgba(184, 169, 201, 0.32)', color: '#B8A9C9', dot: '#D0C5DC' },
];

const getCapStyle = (cap = '', index = 0) => {
  let hash = index;
  for (let i = 0; i < cap.length; i++) {
    hash = (hash << 5) - hash + cap.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % CAPABILITY_LAVENDER_STYLES.length;
  return CAPABILITY_LAVENDER_STYLES[idx];
};

// Bezier path helper
function getBezierPath(x1, y1, x2, y2, w, h) {
  const px1 = (x1 / 100) * w;
  const py1 = (y1 / 100) * h;
  const px2 = (x2 / 100) * w;
  const py2 = (y2 / 100) * h;
  const dx = px2 - px1;
  const dy = py2 - py1;
  const cpx = px1 + dx * 0.5 - dy * 0.12;
  const cpy = py1 + dy * 0.5 + dx * 0.08;
  return { d: `M ${px1} ${py1} Q ${cpx} ${cpy} ${px2} ${py2}`, px1, py1, px2, py2 };
}

// ─── Animated Signal Particle ────────────────────────────────────────────────
const SignalParticle = React.memo(({ pathD, color, duration, delay, w, h }) => {
  const circleRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    const path = pathRef.current;
    if (!circle || !path) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const totalLength = path.getTotalLength();
    let running = true;
    let raf;
    const startTime = performance.now() + delay * 1000;

    const step = (now) => {
      if (!running) return;
      const elapsed = now - startTime;
      if (elapsed < 0) { raf = requestAnimationFrame(step); return; }
      const t = Math.min(elapsed / (duration * 1000), 1);
      if (t < 1) {
        const pt = path.getPointAtLength(t * totalLength);
        circle.setAttribute('cx', pt.x);
        circle.setAttribute('cy', pt.y);
        const a = t < 0.08 ? t / 0.08 : t > 0.92 ? (1 - t) / 0.08 : 1;
        circle.setAttribute('opacity', a * 0.9);
        raf = requestAnimationFrame(step);
      } else {
        circle.setAttribute('opacity', 0);
      }
    };
    raf = requestAnimationFrame(step);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, [pathD, delay, duration]);

  return (
    <g>
      <path ref={pathRef} d={pathD} fill="none" stroke="none" />
      <circle ref={circleRef} r="3.5" fill={color} opacity="0" style={{ pointerEvents: 'none' }} />
    </g>
  );
});

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const TechWorldMap = ({ activeCategory, hoveredTech, setHoveredTech, selectedTech, onSelectTech }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const parallaxBgRef = useRef(null);
  const parallaxNodesRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 560 });
  const [mode, setMode] = useState('tech');
  const [pinnedTech, setPinnedTech] = useState(null);
  const [signalRoutes, setSignalRoutes] = useState([]);
  const [tracing, setTracing] = useState(false);
  const [traceStep, setTraceStep] = useState(-1);

  // Container measurement
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: width, h: Math.max(height, 500) });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Resolve node position
  const getPos = useCallback((id) => {
    if (activeCategory !== 'all' && CATEGORY_POSITIONS[activeCategory]?.[id]) {
      return CATEGORY_POSITIONS[activeCategory][id];
    }
    return MAP_POSITIONS[id] || { x: 50, y: 50 };
  }, [activeCategory]);

  // Connected nodes for hover
  const connectedIds = useMemo(() => {
    const active = hoveredTech || pinnedTech;
    if (!active) return new Set();
    const set = new Set([active]);
    MAP_ROUTES.forEach(r => {
      if (r.from === active) set.add(r.to);
      if (r.to === active) set.add(r.from);
    });
    return set;
  }, [hoveredTech, pinnedTech]);

  // Active routes
  const activeRoutes = useMemo(() => {
    const active = hoveredTech || pinnedTech;
    if (!active) return new Set();
    const set = new Set();
    MAP_ROUTES.forEach((r, i) => {
      if (r.from === active || r.to === active) set.add(i);
    });
    return set;
  }, [hoveredTech, pinnedTech]);

  // Animated signal particles
  useEffect(() => {
    if (mode !== 'tech') { setSignalRoutes([]); return; }
    const pick = () => {
      const shuffled = [...MAP_ROUTES].sort(() => Math.random() - 0.5).slice(0, 6);
      setSignalRoutes(shuffled.map((r, i) => ({ ...r, key: `${r.from}-${r.to}-${Date.now()}-${i}`, delay: i * 1.6 })));
    };
    pick();
    const iv = setInterval(pick, 13000);
    return () => clearInterval(iv);
  }, [mode]);

  // Scroll entry animation
  useEffect(() => {
    const section = mapRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReducedMotion) return;

          const tl = gsap.timeline();
          // 1. Background map fades in
          tl.fromTo(`.${styles.mapBackground}`,
            { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' });
          // 2. Region labels
          tl.fromTo(`.${styles.regionLabel}`,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5');
          // 3. Nodes
          tl.fromTo(`.${styles.mapNode}`,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.035, ease: 'back.out(1.6)' }, '-=0.3');
          // 4. Route paths
          tl.fromTo(`.${styles.routePath}`,
            { strokeDashoffset: 300, strokeDasharray: 300 },
            { strokeDashoffset: 0, duration: 1.2, stagger: 0.06, ease: 'power2.inOut' }, '-=0.4');
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  // Pointer parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let bgX, bgY, nodesX, nodesY;
    if (parallaxBgRef.current) {
      bgX = gsap.quickTo(parallaxBgRef.current, 'x', { duration: 1.4, ease: 'power1.out' });
      bgY = gsap.quickTo(parallaxBgRef.current, 'y', { duration: 1.4, ease: 'power1.out' });
    }
    if (parallaxNodesRef.current) {
      nodesX = gsap.quickTo(parallaxNodesRef.current, 'x', { duration: 0.85, ease: 'power1.out' });
      nodesY = gsap.quickTo(parallaxNodesRef.current, 'y', { duration: 0.85, ease: 'power1.out' });
    }

    const onMove = (e) => {
      const { width, height, left, top } = container.getBoundingClientRect();
      const rx = (e.clientX - left) / width - 0.5;
      const ry = (e.clientY - top) / height - 0.5;
      bgX?.(rx * 3.5); bgY?.(ry * 2);
      nodesX?.(rx * 7); nodesY?.(ry * 4.5);
    };
    const onLeave = () => {
      bgX?.(0); bgY?.(0);
      nodesX?.(0); nodesY?.(0);
    };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // TRACE REQUEST
  const handleTraceRequest = useCallback(() => {
    if (tracing) return;
    setTracing(true);
    setTraceStep(-1);
    WORKFLOW_ROUTES.forEach((_, i) => {
      setTimeout(() => {
        setTraceStep(i);
        if (i === WORKFLOW_ROUTES.length - 1) {
          setTimeout(() => { setTracing(false); setTraceStep(-1); }, 900);
        }
      }, i * 750);
    });
  }, [tracing]);

  const handleNodeClick = useCallback((id) => {
    if (mode !== 'tech') return;
    const next = pinnedTech === id ? null : id;
    setPinnedTech(next);
    onSelectTech?.(next);
  }, [mode, pinnedTech, onSelectTech]);

  const handleOutsideClick = useCallback((e) => {
    if (!e.target.closest(`.${styles.mapNode}`) && !e.target.closest(`.${styles.pinnedProfile}`)) {
      setPinnedTech(null);
      onSelectTech?.(null);
    }
  }, [onSelectTech]);

  const activeTech = pinnedTech || hoveredTech;
  const activeNode = CONSTELLATION_NODES.find(n => n.id === activeTech);
  const activeNodeDetail = activeTech ? TECH_DETAILS[activeTech] : null;

  const isCategoryVisible = useCallback((node) => {
    if (activeCategory === 'all') return true;
    return node.category === activeCategory;
  }, [activeCategory]);

  const { w, h } = containerSize;

  return (
    <div className={styles.worldMapWrap} ref={mapRef}>

      {/* Mode toggle bar */}
      <div className={styles.modeRow}>
        <div className={styles.modeTabs}>
          {['tech', 'workflow', 'architecture'].map(m => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode(m); setPinnedTech(null); setTraceStep(-1); setTracing(false); }}
            >
              {m === 'tech' ? 'TECH STACK' : m === 'workflow' ? 'WORKFLOW' : 'ARCHITECTURE'}
            </button>
          ))}
        </div>

        {mode === 'workflow' && (
          <button
            className={`${styles.traceBtn} ${tracing ? styles.traceBtnActive : ''}`}
            onClick={handleTraceRequest}
            disabled={tracing}
          >
            {tracing ? 'TRACING…' : 'TRACE REQUEST →'}
          </button>
        )}
      </div>

      {/* Canvas */}
      <div className={styles.canvas} ref={containerRef} onClick={handleOutsideClick}>

        {/* Map background (parallax layer 1) */}
        <div ref={parallaxBgRef} className={styles.mapBackground} aria-hidden="true">
          <svg
            className={styles.worldSvg}
            viewBox="0 0 1000 560"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="techGrid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(184, 169, 201, 0.07)" strokeWidth="0.45" opacity="0.4" />
              </pattern>
              <pattern id="techGridLg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(184, 169, 201, 0.07)" strokeWidth="0.8" opacity="0.2" />
              </pattern>
            </defs>

            {/* Grid base */}
            <rect width="1000" height="560" fill="url(#techGrid)" />
            <rect width="1000" height="560" fill="url(#techGridLg)" />

            {/* Latitude curves */}
            {[90, 168, 250, 332, 415, 495].map((y, i) => (
              <path key={`lat-${i}`} d={`M 0 ${y} Q 500 ${y - 10} 1000 ${y}`}
                fill="none" stroke="rgba(184, 169, 201, 0.06)" strokeWidth="0.55" opacity="0.3" />
            ))}
            {/* Longitude curves */}
            {[130, 260, 390, 500, 640, 760, 880].map((x, i) => (
              <path key={`lon-${i}`} d={`M ${x} 0 Q ${x + 8} 280 ${x} 560`}
                fill="none" stroke="rgba(184, 169, 201, 0.06)" strokeWidth="0.55" opacity="0.25" />
            ))}

            {/* Continental silhouettes (subtle monochrome foundation) */}
            {/* West mass — Frontend region */}
            <ellipse cx="150" cy="210" rx="115" ry="140" fill="rgba(184, 169, 201, 0.02)" opacity="0.8" />
            <ellipse cx="85"  cy="410" rx="72"  ry="85"  fill="rgba(184, 169, 201, 0.015)" opacity="0.8" />
            {/* Topographic rings */}
            <ellipse cx="150" cy="210" rx="95"  ry="115" fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.7" opacity="0.2" />
            <ellipse cx="150" cy="210" rx="68"  ry="82"  fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.5" opacity="0.15" />
            <ellipse cx="150" cy="210" rx="44"  ry="54"  fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.4" opacity="0.1" />

            {/* Center mass — Backend/API */}
            <ellipse cx="500" cy="285" rx="168" ry="148" fill="rgba(184, 169, 201, 0.02)" opacity="0.8" />
            <ellipse cx="470" cy="440" rx="138" ry="98"  fill="rgba(184, 169, 201, 0.015)" opacity="0.8" />
            <ellipse cx="500" cy="285" rx="140" ry="118" fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.7" opacity="0.2" />
            <ellipse cx="500" cy="285" rx="105" ry="85"  fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.5" opacity="0.15" />

            {/* East mass — Motion/Media */}
            <ellipse cx="820" cy="205" rx="135" ry="125" fill="rgba(184, 169, 201, 0.02)" opacity="0.8" />
            <ellipse cx="855" cy="405" rx="105" ry="95"  fill="rgba(184, 169, 201, 0.015)" opacity="0.8" />
            <ellipse cx="820" cy="205" rx="112" ry="102" fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.7" opacity="0.2" />
            <ellipse cx="820" cy="205" rx="80"  ry="72"  fill="none" stroke="rgba(184, 169, 201, 0.05)" strokeWidth="0.5" opacity="0.15" />

            {/* Crosshair markers */}
            {[[120, 75],[480, 38],[885, 58],[55,498],[950,476],[500,528]].map(([cx,cy], i) => (
              <g key={`mk-${i}`} opacity="0.32">
                <line x1={cx-6} y1={cy} x2={cx+6} y2={cy} stroke="rgba(184, 169, 201, 0.16)" strokeWidth="0.9" />
                <line x1={cx} y1={cy-6} x2={cx} y2={cy+6} stroke="rgba(184, 169, 201, 0.16)" strokeWidth="0.9" />
                <circle cx={cx} cy={cy} r="2" fill="none" stroke="rgba(184, 169, 201, 0.16)" strokeWidth="0.8" />
              </g>
            ))}

            {/* Coordinate decorations */}
            {COORD_LABELS.map((c, i) => (
              <text key={`coord-${i}`}
                x={(c.x / 100) * 1000} y={(c.y / 100) * 560}
                fontSize="7.5" fill="#A7A39B" opacity="0.45"
                fontFamily="'JetBrains Mono', monospace" letterSpacing="0.04em"
              >
                {c.text}
              </text>
            ))}
          </svg>
        </div>

        {/* Region labels */}
        {mode === 'tech' && REGION_LABELS.map((rl, i) => (
          <div key={i} className={styles.regionLabel}
            style={{ left: `${rl.x}%`, top: `${rl.y}%`, textAlign: rl.align, color: '#A7A39B' }}>
            {rl.label}
          </div>
        ))}

        {/* SVG route lines */}
        <svg
          className={styles.routeSvg}
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        >
          {/* TECH MODE routes */}
          {mode === 'tech' && MAP_ROUTES.map((route, i) => {
            const fromNode = CONSTELLATION_NODES.find(n => n.id === route.from);
            const toNode = CONSTELLATION_NODES.find(n => n.id === route.to);
            if (!fromNode || !toNode) return null;

            const fromPos = getPos(route.from);
            const toPos = getPos(route.to);
            const { d } = getBezierPath(fromPos.x, fromPos.y, toPos.x, toPos.y, w, h);

            const isActive = activeRoutes.has(i);
            const hasActive = !!activeTech;
            const isFiltered = activeCategory === 'all'
              || fromNode.category === activeCategory
              || toNode.category === activeCategory;

            const opac = hasActive
              ? (isActive ? 0.90 : 0.05)
              : (isFiltered ? 0.20 : 0.06);

            // Connections: rgba(184,169,201,0.20)
            // Active connections: #B8A9C9
            // When hovering a technology: related connections -> light lavender (#D0C5DC)
            let strokeColor = 'rgba(184, 169, 201, 0.20)';
            if (isActive) {
              strokeColor = hoveredTech ? '#D0C5DC' : '#B8A9C9';
            }

            return (
              <path key={`rt-${i}`}
                className={styles.routePath}
                d={d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isActive ? 1.8 : 0.95}
                strokeOpacity={opac}
                strokeLinecap="round"
                style={{ transition: 'stroke-opacity 0.42s ease, stroke 0.42s ease, stroke-width 0.35s ease' }}
              />
            );
          })}

          {/* Signal particles (tech mode) */}
          {mode === 'tech' && signalRoutes.map((route) => {
            const fromNode = CONSTELLATION_NODES.find(n => n.id === route.from);
            const toNode = CONSTELLATION_NODES.find(n => n.id === route.to);
            if (!fromNode || !toNode) return null;
            const fromPos = getPos(route.from);
            const toPos = getPos(route.to);
            const { d } = getBezierPath(fromPos.x, fromPos.y, toPos.x, toPos.y, w, h);
            return (
              <SignalParticle
                key={route.key}
                pathD={d}
                color="#D0C5DC"
                duration={3.4}
                delay={route.delay}
                w={w} h={h}
              />
            );
          })}

          {/* WORKFLOW routes */}
          {mode === 'workflow' && WORKFLOW_ROUTES.map((route, i) => {
            const from = WORKFLOW_NODES.find(n => n.id === route.from);
            const to = WORKFLOW_NODES.find(n => n.id === route.to);
            if (!from || !to) return null;
            const { d } = getBezierPath(from.x, from.y, to.x, to.y, w, h);
            const isActive = traceStep >= i;
            return (
              <path key={`wf-${i}`}
                className={styles.routePath}
                d={d} fill="none"
                stroke={isActive ? '#D9A895' : 'rgba(184, 169, 201, 0.20)'}
                strokeWidth={isActive ? 2 : 1.1}
                strokeOpacity={isActive ? 0.92 : 0.22}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.4s ease, stroke-opacity 0.4s ease, stroke-width 0.3s ease' }}
              />
            );
          })}

          {/* Workflow signal particle during trace */}
          {mode === 'workflow' && tracing && traceStep >= 0 && (() => {
            const route = WORKFLOW_ROUTES[traceStep];
            if (!route) return null;
            const from = WORKFLOW_NODES.find(n => n.id === route.from);
            const to = WORKFLOW_NODES.find(n => n.id === route.to);
            if (!from || !to) return null;
            const { d } = getBezierPath(from.x, from.y, to.x, to.y, w, h);
            return <SignalParticle key={`trace-${traceStep}`} pathD={d} color="#D9A895" duration={0.7} delay={0} w={w} h={h} />;
          })()}

          {/* ARCHITECTURE routes */}
          {mode === 'architecture' && ARCH_ROUTES.map((route, i) => {
            const from = ARCH_NODES.find(n => n.id === route.from);
            const to = ARCH_NODES.find(n => n.id === route.to);
            if (!from || !to) return null;
            const { d } = getBezierPath(from.x, from.y, to.x, to.y, w, h);
            return (
              <path key={`arch-${i}`}
                className={styles.routePath}
                d={d} fill="none"
                stroke="#B8A9C9"
                strokeWidth="1.5"
                strokeOpacity="0.40"
                strokeLinecap="round"
                strokeDasharray="7 5"
              />
            );
          })}
        </svg>

        {/* Nodes layer (parallax layer 2) */}
        <div ref={parallaxNodesRef} className={styles.nodesLayer}>

          {/* TECH MODE */}
          {mode === 'tech' && CONSTELLATION_NODES.map(node => {
            const pos = getPos(node.id);
            const isHovered = hoveredTech === node.id;
            const isPinned = pinnedTech === node.id;
            const isConnected = connectedIds.has(node.id);
            const hasActive = !!activeTech;
            const inCategory = isCategoryVisible(node);

            // Inactive / unrelated fade slightly (0.30)
            let opacity = 1;
            if (hasActive && !isConnected) opacity = 0.30;
            else if (!inCategory) opacity = 0.25;

            // When hovering a technology:
            // hovered node -> dusty lavender (#B8A9C9)
            // related technologies -> dark lavender (#51465F)
            // selected technology -> light lavender (#D0C5DC)
            let nodeDotColor = '#B8A9C9';
            if (isPinned) {
              nodeDotColor = '#D0C5DC';
            } else if (isHovered) {
              nodeDotColor = '#B8A9C9';
            } else if (hasActive && isConnected) {
              nodeDotColor = '#51465F';
            }

            const detail = TECH_DETAILS[node.id];

            return (
              <motion.div
                key={node.id}
                className={`${styles.mapNode} ${isHovered ? styles.nodeHovered : ''} ${isPinned ? styles.nodePinned : ''} ${hasActive && isConnected && !isHovered && !isPinned ? styles.nodeRelated : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  '--node-color': nodeDotColor,
                }}
                animate={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity,
                  scale: isPinned ? 1.18 : isHovered ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                onMouseEnter={() => setHoveredTech(node.id)}
                onMouseLeave={() => setHoveredTech(null)}
                onClick={() => handleNodeClick(node.id)}
                data-cursor="tech"
                data-cursor-text={isPinned ? 'UNPIN' : 'TRACE'}
              >
                <span className={styles.nodeDot} style={{ backgroundColor: nodeDotColor }} />
                <span
                  className={styles.nodeLabel}
                  style={{
                    color: hasActive && !isConnected ? 'rgba(243, 240, 232, 0.30)' : '#F3F0E8',
                  }}
                >
                  {node.label}
                </span>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {isHovered && !isPinned && detail && (
                    <motion.div
                      className={styles.hoverTooltip}
                      initial={{ opacity: 0, y: 8, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.93 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <div className={styles.tooltipName}>{node.label.toUpperCase()}</div>
                      <div className={styles.tooltipRole}>{detail.role}</div>

                      {/* Capabilities with lavender highlights */}
                      {node.capabilities && (
                        <div className={styles.tooltipCaps}>
                          {node.capabilities.slice(0, 3).map((cap, cIdx) => {
                            const capStyle = getCapStyle(cap, cIdx);
                            return (
                              <span
                                key={cIdx}
                                className={styles.tooltipCap}
                                style={{
                                  backgroundColor: capStyle.bg,
                                  borderColor: capStyle.border,
                                  color: capStyle.color,
                                }}
                              >
                                {cap}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className={styles.tooltipUsed}>
                        <span className={styles.tooltipUsedLabel}>Used in:</span>
                        {detail.projects.join(' · ')}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* WORKFLOW MODE */}
          {mode === 'workflow' && WORKFLOW_NODES.map((node, i) => {
            const routeIdx = WORKFLOW_ROUTES.findIndex(r => r.to === node.id);
            const isActive = traceStep >= routeIdx || node.id === 'wf-user';
            return (
              <motion.div
                key={node.id}
                className={`${styles.workflowNode} ${isActive && traceStep >= 0 ? styles.workflowNodeActive : ''}`}
                style={{ left: `${node.x}%`, top: `${node.y}%`, '--node-color': node.color }}
                animate={{ scale: isActive && traceStep >= 0 ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              >
                <span className={styles.workflowNodeDot} style={{ backgroundColor: node.color }} />
                <span className={styles.workflowNodeLabel}>{node.label}</span>
              </motion.div>
            );
          })}

          {/* ARCHITECTURE MODE */}
          {mode === 'architecture' && ARCH_NODES.map(node => (
            <div
              key={node.id}
              className={styles.archNode}
              style={{ left: `${node.x}%`, top: `${node.y}%`, '--node-color': node.color }}
            >
              <div className={styles.archNodeHeader}>
                <span className={styles.archNodeDot} style={{ backgroundColor: node.color }} />
                <span className={styles.archNodeTitle}>{node.label}</span>
              </div>
              <div className={styles.archNodeSub}>{node.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Pinned profile panel */}
        <AnimatePresence>
          {pinnedTech && activeNode && activeNodeDetail && mode === 'tech' && (
            <motion.div
              className={styles.pinnedProfile}
              initial={{ opacity: 0, x: 18, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.pinnedHeader}>
                <span className={styles.pinnedDot} style={{ backgroundColor: activeNode.color }} />
                <strong className={styles.pinnedName}>{activeNode.label}</strong>
                <span
                  className={styles.pinnedCategory}
                  style={{
                    backgroundColor: 'rgba(217, 168, 149, 0.12)',
                    borderColor: 'rgba(217, 168, 149, 0.28)',
                    color: '#D9A895',
                  }}
                >
                  {activeNode.category}
                </span>
                <button className={styles.pinnedClose}
                  onClick={() => { setPinnedTech(null); onSelectTech?.(null); }}>
                  ×
                </button>
              </div>
              <div className={styles.pinnedRole}>{activeNodeDetail.role}</div>

              {/* Capabilities with randomized/varied lavender highlight colors */}
              <div className={styles.pinnedCapabilities}>
                {activeNode.capabilities.map((cap, i) => {
                  const capStyle = getCapStyle(cap, i);
                  return (
                    <span
                      key={i}
                      className={styles.pinnedCap}
                      style={{
                        backgroundColor: capStyle.bg,
                        borderColor: capStyle.border,
                        color: capStyle.color,
                      }}
                    >
                      <span className={styles.capDot} style={{ backgroundColor: capStyle.dot }} />
                      {cap}
                    </span>
                  );
                })}
              </div>

              {connectedIds.size > 1 && (
                <div className={styles.pinnedConnectedSection}>
                  <span className={styles.pinnedConnectedLabel}>Related Dependencies:</span>
                  <div className={styles.pinnedConnectedList}>
                    {[...connectedIds].filter(id => id !== pinnedTech).slice(0, 5).map(id => {
                      const n = CONSTELLATION_NODES.find(n => n.id === id);
                      return n ? (
                        <span key={id} className={styles.pinnedConnectedPill}
                          style={{ borderColor: 'rgba(184, 169, 201, 0.25)' }}
                          onClick={() => { setPinnedTech(id); onSelectTech?.(id); }}>
                          {n.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              <div className={styles.pinnedUsedIn}>
                <span className={styles.pinnedUsedLabel}>Production Deployments:</span>
                {activeNodeDetail.projects.join(' · ')}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend + hint row */}
      <div className={styles.bottomRow}>
        <div className={styles.legend}>
          {[
            { label: 'FRONTEND / CORE', color: '#B8A9C9' },
            { label: 'BACKEND / DATA',  color: '#51465F' },
            { label: 'SELECTED / STACK', color: '#D0C5DC' },
            { label: 'SYSTEM FLOW',   color: '#D9A895' },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
              <span className={styles.legendLabel}>{item.label}</span>
            </div>
          ))}
        </div>

        <p className={styles.mapHint}>
          Trace a technology to inspect dependencies across the system architecture.
        </p>
      </div>
    </div>
  );
};

export default TechWorldMap;
