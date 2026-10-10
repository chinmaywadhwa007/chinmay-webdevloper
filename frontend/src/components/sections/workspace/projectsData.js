/* ==========================================================================
   Project Workspace — Unified System Data
   Single source of truth consumed by the Index, Featured Preview,
   Systems Map, Capability Evolution and the SQL-style Query Explorer.
   ========================================================================== */

/* Mirrors the exact Forest Green & Charcoal tokens in index.css (raw values for inline styles / color-mix). */
export const ACCENTS = {
  sage: '#8FAF98',        /* SOFT SAGE — Active / selected states */
  lavender: '#37664B',    /* MUTED FOREST — Hover / secondary states */
  peach: '#1F4A35',       /* DARK GREEN — Secondary accent */
  cream: '#C1D4C5',       /* PALE SAGE — Small highlights */
  butter: '#C1D4C5',      /* PALE SAGE */
  forest: '#183A2A',      /* FOREST GREEN — Primary brand accent */
  deepForest: '#10271D',  /* DEEP FOREST — Dark green surface */
  softSage: '#8FAF98',
  paleSage: '#C1D4C5',
  warmWhite: '#F2F0E8',
  charcoal: '#0B0D0C',
};

export const CATEGORIES = [
  { id: 'all', label: 'All Systems' },
  { id: 'enterprise', label: 'Enterprise & AI' },
  { id: 'frontend', label: 'Media' },
  { id: 'fullstack', label: 'Full Stack' },
];

/**
 * Canonical technology nodes grouped by architectural lane.
 * Used by the Systems Map to draw project → technology relationships.
 */
export const TECH_LANES = [
  {
    id: 'interface',
    label: 'Interface',
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'service',
    label: 'Service',
    techs: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'],
  },
  {
    id: 'data',
    label: 'Data',
    techs: ['PostgreSQL', 'MongoDB'],
  },
  {
    id: 'integration',
    label: 'Media & Integrations',
    techs: ['Video.js', 'Web Audio API', 'Stripe API', 'AI Workflows'],
  },
];

/** Architectural layers used by each system's graph + the data-flow strip. */
export const LAYERS = {
  client: 'Client layer',
  api: 'API layer',
  service: 'Service layer',
  data: 'Data layer',
};

/** Generic request lifecycle — each step lights the matching layer in the active graph. */
export const FLOW_STEPS = [
  { id: 'client', label: 'Client', layers: ['client'] },
  { id: 'request', label: 'Request', request: true },
  { id: 'api', label: 'API', layers: ['api'] },
  { id: 'service', label: 'Service', layers: ['service'] },
  { id: 'database', label: 'Database', layers: ['data'] },
  { id: 'response', label: 'Response', response: true },
];

/*
 * Per-system architecture graph.
 * row → vertical tier (0 = top), x → horizontal position as a fraction of the canvas.
 * techs[0] is the node's primary technology (canonical TECH_LANES name); nodes
 * without techs are architectural patterns.
 */

export const projects = [
  {
    id: 'dezoryn',
    title: 'Dezoryn Technologies',
    shortTitle: 'Dezoryn',
    subtitle: 'Enterprise Business Automation & Intelligent Platform',
    category: 'enterprise',
    categoryLabel: 'Enterprise & AI',
    accent: 'sage',
    image: '/dezoryn.png',
    domain: 'dezoryntechnology.com',
    liveUrl: 'https://www.dezoryntechnology.com/',
    githubUrl: '#',
    isLive: true,
    summary: 'Enterprise automation platform connecting CRM, ERP, and AI workflows.',
    fullDescription:
      'Architected intelligent enterprise platforms unifying CRM, Cloud ERP, and AI Neural Engines. Built with PostgreSQL, React 18, JWT RBAC, and intelligent workflow orchestration.',
    tags: ['React 18', 'PostgreSQL', 'AI Core 3.0', 'Enterprise ERP', 'JWT RBAC'],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'REST APIs', 'JWT Auth', 'PostgreSQL', 'AI Workflows'],
    database: 'PostgreSQL',
    signals: ['RBAC security model', 'Workflow orchestration', 'Modular dashboards'],
    architecture: [
      { label: 'Client', sub: 'React 18' },
      { label: 'API Gateway', sub: 'REST / Express' },
      { label: 'Service', sub: 'Node.js Core' },
      { label: 'Security', sub: 'JWT & RBAC' },
      { label: 'Database', sub: 'PostgreSQL Pool' },
    ],
    graph: {
      nodes: [
        { id: 'react', label: 'React', sub: 'React 18 client', layer: 'client', row: 0, x: 0.5, techs: ['React'] },
        { id: 'ts', label: 'TypeScript', sub: 'Typed modules', layer: 'client', row: 1, x: 0.5, techs: ['TypeScript'] },
        { id: 'api', label: 'REST APIs', sub: 'Express gateway', layer: 'api', row: 2, x: 0.5, techs: ['REST APIs', 'Express'] },
        { id: 'auth', label: 'JWT Auth', sub: 'RBAC guard', layer: 'api', row: 3, x: 0.3, techs: ['JWT Auth'] },
        { id: 'node', label: 'Node.js', sub: 'Service core', layer: 'service', row: 3, x: 0.7, techs: ['Node.js'] },
        { id: 'pg', label: 'PostgreSQL', sub: 'ACID store', layer: 'data', row: 4, x: 0.3, techs: ['PostgreSQL'] },
        { id: 'ai', label: 'AI Workflows', sub: 'Orchestration', layer: 'service', row: 4, x: 0.7, techs: ['AI Workflows'] },
      ],
      edges: [['react', 'ts'], ['ts', 'api'], ['api', 'auth'], ['api', 'node'], ['auth', 'pg'], ['node', 'pg'], ['node', 'ai']],
    },
    performance: 'Sub-120ms API latency · 98 Lighthouse Score · Zero-layout-shift modular dashboard',
    auth: 'Stateless JWT auth tokens stored in HTTP-Only cookies with granular Role-Based Access Control',
    dataFlow:
      'Client transaction → Payload schema validation → ACID-compliant PostgreSQL queries → Real-time UI synchronization',
    evolution: {
      phase: 'Phase 05',
      capability: 'Enterprise & Intelligent Systems',
      learned: 'Role-based security, multi-module ERP data models and AI workflow orchestration at business scale.',
    },
  },
  {
    id: 'vexo-music',
    title: 'VEXO Music Entertainment',
    shortTitle: 'VEXO Music',
    subtitle: 'Sonic Architecture & Global Entertainment Platform',
    category: 'frontend',
    categoryLabel: 'Frontend & Media',
    accent: 'peach',
    image: '/vexo.png',
    domain: 'vexo-music-fxwa-steel.vercel.app',
    liveUrl: 'https://vexo-music-fxwa-steel.vercel.app/',
    githubUrl: '#',
    isLive: true,
    isMedia: true,
    summary: 'High-fidelity audio-visual platform with a custom playback architecture.',
    fullDescription:
      'Pioneering original soundscapes, artist development, and high-fidelity media streaming. Powered by Video.js ambient playback, custom sound player architecture, and studio service bookings.',
    tags: ['React', 'Next.js', 'Video.js', 'Web Audio API', 'Framer Motion'],
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Video.js', 'Web Audio API'],
    database: null,
    signals: ['Custom media engine', 'Audio-reactive visuals', 'Motion-first UI'],
    architecture: [
      { label: 'Client', sub: 'Next.js 14' },
      { label: 'Engine', sub: 'Video.js Core' },
      { label: 'Audio', sub: 'Web Audio API' },
      { label: 'Visualizer', sub: 'GSAP 60fps' },
      { label: 'Edge Delivery', sub: 'CDN Streaming' },
    ],
    graph: {
      nodes: [
        { id: 'next', label: 'Next.js', sub: 'React app shell', layer: 'client', row: 0, x: 0.5, techs: ['Next.js', 'React'] },
        { id: 'tw', label: 'Tailwind CSS', sub: 'Design tokens', layer: 'client', row: 1, x: 0.27, techs: ['Tailwind CSS'] },
        { id: 'fm', label: 'Framer Motion', sub: 'Motion layer', layer: 'client', row: 1, x: 0.73, techs: ['Framer Motion'] },
        { id: 'vjs', label: 'Video.js', sub: 'Playback engine', layer: 'service', row: 2, x: 0.5, techs: ['Video.js'] },
        { id: 'wa', label: 'Web Audio API', sub: 'Frequency analysis', layer: 'service', row: 3, x: 0.27, techs: ['Web Audio API'] },
        { id: 'cdn', label: 'Edge CDN', sub: 'Media delivery', layer: 'data', row: 3, x: 0.73 },
        { id: 'vis', label: 'Visualizer', sub: 'GSAP render loop', layer: 'service', row: 4, x: 0.27 },
      ],
      edges: [['next', 'tw'], ['next', 'fm'], ['next', 'vjs'], ['vjs', 'wa'], ['vjs', 'cdn'], ['wa', 'vis']],
    },
    performance: '60fps GPU-accelerated equalizer · Instant audio buffer caching · Responsive canvas render pipeline',
    auth: 'Stateless session persistence for custom user playlists, volume settings, and media presets',
    dataFlow:
      'Audio track request → Stream buffer initialization → Web Audio frequency bin analysis → Real-time visual equalizer pulse',
    evolution: {
      phase: 'Phase 04',
      capability: 'Media & Interaction Engineering',
      learned: 'Custom player controls, audio analysis pipelines and GPU-friendly motion systems.',
    },
  },
  {
    id: 'digimate-tech-digital',
    title: 'Digimate Tech Digital Solutions',
    shortTitle: 'Digimate',
    subtitle: 'Enterprise Full-Stack Web Platform & Digital Solutions',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    accent: 'lavender',
    image: '/digimate-platform.png',
    domain: 'digimatetechdigital.com',
    liveUrl: 'https://digimatetechdigital.com/',
    githubUrl: '#',
    isLive: true,
    summary: 'End-to-end business platform with typed interfaces and scalable REST services.',
    fullDescription:
      'Full-stack enterprise platform engineered with React, TypeScript, Tailwind CSS, and Node.js. Architected complete end-to-end solutions unifying responsive client interfaces, scalable RESTful APIs, and PostgreSQL database workflows.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Cloud Architecture'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'PostgreSQL'],
    database: 'PostgreSQL',
    signals: ['Typed component system', 'Scalable REST layer', 'Responsive design system'],
    architecture: [
      { label: 'Client', sub: 'React + TS' },
      { label: 'Design System', sub: 'Tailwind CSS' },
      { label: 'API', sub: 'REST / Node.js' },
      { label: 'Cloud', sub: 'Deployment' },
      { label: 'Database', sub: 'PostgreSQL' },
    ],
    graph: {
      nodes: [
        { id: 'react', label: 'React', sub: 'Component layer', layer: 'client', row: 0, x: 0.5, techs: ['React'] },
        { id: 'ts', label: 'TypeScript', sub: 'Typed contracts', layer: 'client', row: 1, x: 0.3, techs: ['TypeScript'] },
        { id: 'tw', label: 'Tailwind CSS', sub: 'Design system', layer: 'client', row: 1, x: 0.7, techs: ['Tailwind CSS'] },
        { id: 'api', label: 'REST APIs', sub: 'Validated endpoints', layer: 'api', row: 2, x: 0.5, techs: ['REST APIs'] },
        { id: 'node', label: 'Node.js', sub: 'Business logic', layer: 'service', row: 3, x: 0.5, techs: ['Node.js'] },
        { id: 'pg', label: 'PostgreSQL', sub: 'Relational store', layer: 'data', row: 4, x: 0.3, techs: ['PostgreSQL'] },
        { id: 'cloud', label: 'Cloud Runtime', sub: 'Deployment', layer: 'service', row: 4, x: 0.7 },
      ],
      edges: [['react', 'ts'], ['react', 'tw'], ['ts', 'api'], ['api', 'node'], ['node', 'pg'], ['node', 'cloud']],
    },
    performance: 'Typed end-to-end contracts · Component-level code splitting · Responsive layouts across breakpoints',
    auth: 'Validated API contracts with typed request / response models and protected admin routes',
    dataFlow: 'Typed client form → REST endpoint validation → PostgreSQL persistence → Optimistic UI refresh',
    evolution: {
      phase: 'Phase 03',
      capability: 'Typed Full-Stack Platforms',
      learned: 'TypeScript contracts across the stack, design systems and production deployment workflows.',
    },
  },
  {
    id: 'skill-loop',
    title: 'SkillLoop Platform',
    shortTitle: 'SkillLoop',
    subtitle: 'Peer-to-Peer Skill Exchange & Arena',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    accent: 'sage',
    image: '/page.png',
    domain: 'skilloop-omega.vercel.app',
    liveUrl: 'https://skilloop-omega.vercel.app/',
    githubUrl: 'https://github.com/chinmaywadhwa007/skilloop-a-skill-exchange-platform-',
    isLive: true,
    summary: 'Peer-to-peer knowledge exchange powered by a virtual skill economy.',
    fullDescription:
      'Full-stack skill exchange platform connecting learners and mentors through a virtual economy. Users share knowledge, earn currency, and participate in collaborative learning arenas.',
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Framer Motion'],
    stack: ['React', 'Framer Motion', 'Node.js', 'Express', 'REST APIs', 'JWT Auth', 'MongoDB'],
    database: 'MongoDB',
    signals: ['Virtual currency ledger', 'Live learning arenas', 'JWT session security'],
    architecture: [
      { label: 'Client', sub: 'React SPA' },
      { label: 'REST API', sub: 'Express.js' },
      { label: 'Service', sub: 'Node.js Engine' },
      { label: 'Auth Guard', sub: 'JWT Middleware' },
      { label: 'Document Store', sub: 'MongoDB' },
    ],
    graph: {
      nodes: [
        { id: 'react', label: 'React', sub: 'SPA client', layer: 'client', row: 0, x: 0.5, techs: ['React'] },
        { id: 'fm', label: 'Framer Motion', sub: 'Arena motion', layer: 'client', row: 1, x: 0.28, techs: ['Framer Motion'] },
        { id: 'api', label: 'Express', sub: 'REST routes', layer: 'api', row: 1, x: 0.72, techs: ['Express', 'REST APIs'] },
        { id: 'jwt', label: 'JWT Auth', sub: 'Auth guard', layer: 'api', row: 2, x: 0.72, techs: ['JWT Auth'] },
        { id: 'node', label: 'Node.js', sub: 'Score engine', layer: 'service', row: 3, x: 0.4, techs: ['Node.js'] },
        { id: 'ledger', label: 'Skill Ledger', sub: 'Virtual currency', layer: 'service', row: 3, x: 0.78 },
        { id: 'mongo', label: 'MongoDB', sub: 'Document store', layer: 'data', row: 4, x: 0.55, techs: ['MongoDB'] },
      ],
      edges: [['react', 'fm'], ['react', 'api'], ['api', 'jwt'], ['jwt', 'node'], ['jwt', 'ledger'], ['node', 'mongo'], ['ledger', 'mongo']],
    },
    performance: 'Sub-50ms arena response times · Optimized MongoDB aggregation pipelines · Efficient client state updates',
    auth: 'Cryptographic JWT session authentication with bearer auth headers and route security middleware',
    dataFlow:
      'Quiz submission → Server score verification → Atomic document update in MongoDB → Global leaderboard recalculation',
    evolution: {
      phase: 'Phase 02',
      capability: 'Real Users & Live Data',
      learned: 'Authentication, document modelling, aggregation pipelines and multi-user state.',
    },
  },
  {
    id: 'shopease',
    title: 'ShopEase E-Commerce',
    shortTitle: 'ShopEase',
    subtitle: 'Full-Stack Modern Commerce & Payment Platform',
    category: 'fullstack',
    categoryLabel: 'Full Stack',
    accent: 'lavender',
    image: '/shopease.png',
    domain: 'shopease.store',
    liveUrl: '#',
    githubUrl: '#',
    isLive: false,
    summary: 'Commerce engine with Stripe payments, inventory and synced cart state.',
    fullDescription:
      'Full-stack e-commerce application featuring Stripe payment processing, real-time inventory management, reactive cart state synchronization, and secure authentication.',
    tags: ['React', 'Stripe API', 'Node.js', 'Express', 'Cart Sync'],
    stack: ['React', 'Node.js', 'Express', 'REST APIs', 'Stripe API'],
    database: null,
    signals: ['Stripe checkout flow', 'Inventory management', 'Reactive cart sync'],
    architecture: [
      { label: 'Storefront', sub: 'React' },
      { label: 'Cart State', sub: 'Client Sync' },
      { label: 'API', sub: 'Express' },
      { label: 'Payments', sub: 'Stripe API' },
      { label: 'Inventory', sub: 'Node.js Service' },
    ],
    graph: {
      nodes: [
        { id: 'react', label: 'React', sub: 'Storefront', layer: 'client', row: 0, x: 0.5, techs: ['React'] },
        { id: 'cart', label: 'Cart State', sub: 'Client sync', layer: 'client', row: 1, x: 0.5 },
        { id: 'api', label: 'Express', sub: 'REST API', layer: 'api', row: 2, x: 0.5, techs: ['Express', 'REST APIs'] },
        { id: 'stripe', label: 'Stripe API', sub: 'Payment intents', layer: 'service', row: 3, x: 0.3, techs: ['Stripe API'] },
        { id: 'node', label: 'Node.js', sub: 'Inventory service', layer: 'service', row: 3, x: 0.7, techs: ['Node.js'] },
        { id: 'orders', label: 'Order Flow', sub: 'Confirm → decrement', layer: 'service', row: 4, x: 0.5 },
      ],
      edges: [['react', 'cart'], ['cart', 'api'], ['api', 'stripe'], ['api', 'node'], ['stripe', 'orders'], ['node', 'orders']],
    },
    performance: 'Instant cart updates · Idempotent checkout requests · Lightweight storefront bundle',
    auth: 'Secure authentication with protected checkout and order routes',
    dataFlow: 'Add to cart → Client state sync → Stripe payment intent → Order confirmation → Inventory decrement',
    evolution: {
      phase: 'Phase 01',
      capability: 'Commerce Foundations',
      learned: 'Client state management, third-party payment APIs and transactional order flows.',
    },
  },
];

/** Derived workspace metrics — computed, never hard-coded. */
export const workspaceMetrics = (() => {
  const techs = new Set(projects.flatMap((p) => p.stack));
  const layers = projects.reduce((sum, p) => sum + p.architecture.length, 0);
  return {
    systems: projects.length,
    technologies: techs.size,
    live: projects.filter((p) => p.isLive).length,
    layers,
  };
})();

/** Maps a workspace project to the shape expected by ProjectCaseStudy. */
export const toCaseStudy = (p) => ({
  ...p,
  category: p.categoryLabel,
  allTags: p.stack,
  githubUrl: p.githubUrl === '#' ? null : p.githubUrl,
});
