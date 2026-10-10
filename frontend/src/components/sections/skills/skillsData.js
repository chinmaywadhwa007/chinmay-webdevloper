/**
 * Curated Technical Stack Data
 * Backed by real production systems, engineering workflows, and verified project proofs.
 * Editorial constellation topology, category accents, and verified project bridges.
 */

export const ACCENTS = {
  sage: '#CDE8D5',            // Official Brand Sage
  lavender: '#D7C8FF',        // Official Brand Lavender
  peach: '#FFCDB2',           // Official Brand Peach
  butter: '#FFE6BF',          // Official Brand Butter
  cream: '#FFE6BF',           // Official Brand Cream / Butter
  darkLavender: '#64548E',    // Dark Lavender accent
  lightLavender: '#E4DCFA',   // Light Lavender
  warmWhite: '#F3F0E8',       // Primary Text
  secondaryText: '#A7A39B',   // Secondary Text
  background: '#0B0C10',      // Main Obsidian Background
  canvasBg: '#111217',        // Technical Canvas Background
  charcoal: '#15161C',        // Node Charcoal
  // Backward compatibility
  apricot: '#FFCDB2',
  ivory: '#F3F0E8',
  muted: '#A7A39B',
  black: '#0B0C10',
};

// Curated randomized/staggered brand palette highlight variations for capability tags
export const CAPABILITY_LAVENDER_STYLES = [
  { bg: 'rgba(215, 200, 255, 0.14)', border: 'rgba(215, 200, 255, 0.38)', color: '#D7C8FF', dot: '#D7C8FF' }, // Lavender
  { bg: 'rgba(205, 232, 213, 0.14)', border: 'rgba(205, 232, 213, 0.38)', color: '#CDE8D5', dot: '#CDE8D5' }, // Sage
  { bg: 'rgba(255, 205, 178, 0.14)', border: 'rgba(255, 205, 178, 0.38)', color: '#FFCDB2', dot: '#FFCDB2' }, // Peach
  { bg: 'rgba(255, 230, 191, 0.14)', border: 'rgba(255, 230, 191, 0.38)', color: '#FFE6BF', dot: '#FFE6BF' }, // Butter
  { bg: 'rgba(215, 200, 255, 0.20)', border: 'rgba(215, 200, 255, 0.45)', color: '#F3F0E8', dot: '#D7C8FF' }, // Highlighted Lavender
  { bg: 'rgba(205, 232, 213, 0.20)', border: 'rgba(205, 232, 213, 0.45)', color: '#F3F0E8', dot: '#CDE8D5' }, // Highlighted Sage
  { bg: 'rgba(255, 205, 178, 0.20)', border: 'rgba(255, 205, 178, 0.45)', color: '#F3F0E8', dot: '#FFCDB2' }, // Highlighted Peach
];

export const getCapStyle = (cap = '', index = 0) => {
  let hash = index;
  for (let i = 0; i < cap.length; i++) {
    hash = (hash << 5) - hash + cap.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % CAPABILITY_LAVENDER_STYLES.length;
  return CAPABILITY_LAVENDER_STYLES[idx];
};

export const SKILL_CATEGORIES = [
  { id: 'all', label: 'ALL SYSTEMS', accent: 'lavender', color: '#D7C8FF' },
  { id: 'frontend', label: 'FRONTEND', accent: 'sage', color: '#CDE8D5' },
  { id: 'backend', label: 'BACKEND', accent: 'lavender', color: '#D7C8FF' },
  { id: 'database', label: 'DATABASE', accent: 'peach', color: '#FFCDB2' },
  { id: 'motion', label: 'MOTION', accent: 'butter', color: '#FFE6BF' },
  { id: 'tools', label: 'TOOLS', accent: 'lavender', color: '#D7C8FF' },
];

export const REAL_PROJECTS = [
  { id: 'dezoryn', name: 'Dezoryn Technologies', url: 'dezoryntechnology.com', role: 'Enterprise ERP & AI Systems' },
  { id: 'skill-loop', name: 'SkillLoop Platform', url: 'skilloop-omega.vercel.app', role: 'Peer-to-Peer Skill Exchange' },
  { id: 'vexo', name: 'VEXO Music', url: 'vexo-music-steel.vercel.app', role: 'Audio-Visual Media Platform' },
  { id: 'digimate', name: 'Digimate Tech', url: 'digimatetechdigital.com', role: 'Digital Solutions Ecosystem' },
  { id: 'portfolio', name: 'Editorial Portfolio', url: '#', role: 'Kinetic Engineering System' },
];

export const CONSTELLATION_NODES = [
  // --- FRONTEND (Sage: #B8A9C9) ---
  {
    id: 'react',
    label: 'React',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Component Architecture', 'API Integration', 'Routing', 'State Management', 'Animation Integration'],
    proof: ['Dezoryn', 'SkillLoop', 'Portfolio'],
    pos: {
      all: { x: 50, y: 26 },
      frontend: { x: 50, y: 38 },
      backend: { x: 20, y: 20 },
      database: { x: 18, y: 18 },
      motion: { x: 25, y: 24 },
      tools: { x: 22, y: 24 },
    },
    isAnchor: true,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Strict Type Contracts', 'Generic Interfaces', 'API Payload Types', 'Type Guards'],
    proof: ['Digimate Tech', 'Dezoryn', 'Portfolio'],
    pos: {
      all: { x: 35, y: 16 },
      frontend: { x: 50, y: 18 },
      backend: { x: 12, y: 32 },
      database: { x: 12, y: 32 },
      motion: { x: 12, y: 18 },
      tools: { x: 32, y: 16 },
    },
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['App Router Architecture', 'Server & Client Components', 'API Routes', 'Image Optimization'],
    proof: ['VEXO', 'Enterprise Solutions'],
    pos: {
      all: { x: 65, y: 16 },
      frontend: { x: 74, y: 30 },
      backend: { x: 28, y: 12 },
      database: { x: 12, y: 48 },
      motion: { x: 38, y: 15 },
      tools: { x: 15, y: 38 },
    },
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'ADVANCED',
    capabilities: ['ES6+ Modern Syntax', 'Async / Await Pipelines', 'Event Loop Mechanics', 'DOM APIs'],
    proof: ['Kinetic Typography Engine', 'All Projects'],
    pos: {
      all: { x: 44, y: 38 },
      frontend: { x: 50, y: 56 },
      backend: { x: 16, y: 46 },
      database: { x: 24, y: 12 },
      motion: { x: 18, y: 35 },
      tools: { x: 28, y: 32 },
    },
  },
  {
    id: 'html',
    label: 'HTML',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Semantic DOM Hierarchy', 'WCAG Accessibility (ARIA)', 'Modern Document Outlining'],
    proof: ['Digimate Tech', 'Portfolio', 'SkillLoop'],
    pos: {
      all: { x: 26, y: 28 },
      frontend: { x: 26, y: 32 },
      backend: { x: 8, y: 22 },
      database: { x: 8, y: 24 },
      motion: { x: 14, y: 46 },
      tools: { x: 12, y: 46 },
    },
  },
  {
    id: 'css',
    label: 'CSS',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['CSS Grid & Flexbox Systems', 'Custom Properties (Tokens)', 'Fluid Typography (clamp)'],
    proof: ['Editorial Portfolio', 'All Projects'],
    pos: {
      all: { x: 58, y: 44 },
      frontend: { x: 50, y: 74 },
      backend: { x: 8, y: 56 },
      database: { x: 8, y: 62 },
      motion: { x: 22, y: 48 },
      tools: { x: 10, y: 60 },
    },
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS',
    category: 'frontend',
    accent: 'sage',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Design System Tokens', 'Responsive Grids', 'Arbitrary Values & Variants'],
    proof: ['Dezoryn', 'Digimate Tech', 'SkillLoop'],
    pos: {
      all: { x: 22, y: 42 },
      frontend: { x: 50, y: 90 },
      backend: { x: 8, y: 72 },
      database: { x: 8, y: 76 },
      motion: { x: 10, y: 60 },
      tools: { x: 10, y: 74 },
    },
  },

  // --- BACKEND (Peach: #B8A9C9) ---
  {
    id: 'nodejs',
    label: 'Node.js',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Event-Driven Core', 'Async I/O Streams', 'Modular Service Architecture', 'Cluster Scaling'],
    proof: ['Digimate Tech', 'Kvon', 'SkillLoop', 'Dezoryn'],
    pos: {
      all: { x: 74, y: 35 },
      frontend: { x: 88, y: 15 },
      backend: { x: 30, y: 35 },
      database: { x: 28, y: 25 },
      motion: { x: 88, y: 15 },
      tools: { x: 42, y: 20 },
    },
    isAnchor: true,
  },
  {
    id: 'express',
    label: 'Express.js',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Router Orchestration', 'Custom Middleware Chains', 'Global Error Handlers'],
    proof: ['Digimate Tech', 'SkillLoop', 'Kvon'],
    pos: {
      all: { x: 86, y: 28 },
      frontend: { x: 92, y: 25 },
      backend: { x: 48, y: 25 },
      database: { x: 18, y: 40 },
      motion: { x: 92, y: 25 },
      tools: { x: 56, y: 18 },
    },
  },
  {
    id: 'fastify',
    label: 'Fastify',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'ADVANCED',
    capabilities: ['High-Throughput Routing', 'JSON Schema Validation', 'Low Overhead Serialization'],
    proof: ['Microservice Benchmarks'],
    pos: {
      all: { x: 88, y: 44 },
      frontend: { x: 90, y: 38 },
      backend: { x: 70, y: 25 },
      database: { x: 26, y: 52 },
      motion: { x: 90, y: 38 },
      tools: { x: 70, y: 20 },
    },
  },
  {
    id: 'rest-api',
    label: 'REST APIs',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Idempotent HTTP Methods', 'Standard Status Codes', 'Pagination & Filtering', 'API Versioning'],
    proof: ['Digimate Tech', 'SkillLoop', 'Kvon'],
    pos: {
      all: { x: 62, y: 34 },
      frontend: { x: 82, y: 46 },
      backend: { x: 50, y: 46 },
      database: { x: 40, y: 20 },
      motion: { x: 84, y: 48 },
      tools: { x: 50, y: 32 },
    },
  },
  {
    id: 'jwt',
    label: 'JWT',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Stateless Token Signing', 'HTTP-Only Cookie Storage', 'Bearer Authentication'],
    proof: ['Dezoryn', 'Digimate Tech', 'SkillLoop'],
    pos: {
      all: { x: 84, y: 58 },
      frontend: { x: 92, y: 52 },
      backend: { x: 34, y: 65 },
      database: { x: 15, y: 70 },
      motion: { x: 92, y: 55 },
      tools: { x: 62, y: 35 },
    },
  },
  {
    id: 'rbac',
    label: 'RBAC',
    category: 'backend',
    accent: 'peach',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Hierarchical Role Control', 'Route Guard Middleware', 'Dynamic Permissions'],
    proof: ['Dezoryn', 'Kvon'],
    pos: {
      all: { x: 72, y: 58 },
      frontend: { x: 88, y: 64 },
      backend: { x: 66, y: 65 },
      database: { x: 22, y: 82 },
      motion: { x: 88, y: 68 },
      tools: { x: 74, y: 36 },
    },
  },

  // --- DATABASE (Butter: #B8A9C9) ---
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'database',
    accent: 'butter',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Relational Schema Modeling', 'B-Tree Indexing', 'EXPLAIN Execution Plans', 'Foreign Key Integrity'],
    proof: ['Dezoryn', 'Digimate Tech', 'Kvon'],
    pos: {
      all: { x: 58, y: 68 },
      frontend: { x: 85, y: 78 },
      backend: { x: 62, y: 84 },
      database: { x: 35, y: 35 },
      motion: { x: 85, y: 80 },
      tools: { x: 32, y: 72 },
    },
    isAnchor: true,
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    category: 'database',
    accent: 'butter',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Document Schema Design', 'Aggregation Pipelines', 'Compound Indexing', 'Atomic Operations'],
    proof: ['SkillLoop', 'Digimate Tech'],
    pos: {
      all: { x: 44, y: 66 },
      frontend: { x: 75, y: 88 },
      backend: { x: 42, y: 84 },
      database: { x: 65, y: 35 },
      motion: { x: 75, y: 88 },
      tools: { x: 20, y: 80 },
    },
    isAnchor: true,
  },
  {
    id: 'sql',
    label: 'SQL',
    category: 'database',
    accent: 'butter',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Multi-Table JOINs', 'Window Functions & CTEs', 'Aggregation Pipelines', 'Transaction Isolation'],
    proof: ['Digimate Tech', 'Kvon'],
    pos: {
      all: { x: 52, y: 78 },
      frontend: { x: 86, y: 92 },
      backend: { x: 52, y: 90 },
      database: { x: 50, y: 52 },
      motion: { x: 88, y: 92 },
      tools: { x: 44, y: 78 },
    },
  },
  {
    id: 'mongoose',
    label: 'Mongoose',
    category: 'database',
    accent: 'butter',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Schema Validation Rules', 'Pre/Post Hooks', 'Virtual Properties', 'Populate Queries'],
    proof: ['SkillLoop'],
    pos: {
      all: { x: 34, y: 74 },
      frontend: { x: 65, y: 94 },
      backend: { x: 30, y: 90 },
      database: { x: 65, y: 70 },
      motion: { x: 68, y: 94 },
      tools: { x: 15, y: 90 },
    },
  },
  {
    id: 'prisma',
    label: 'Prisma',
    category: 'database',
    accent: 'butter',
    color: '#B8A9C9',
    status: 'ADVANCED',
    capabilities: ['Declarative Schema Migrations', 'Type-Safe Queries', 'Relation Filtering'],
    proof: ['Modern Prototypes'],
    pos: {
      all: { x: 68, y: 78 },
      frontend: { x: 92, y: 94 },
      backend: { x: 74, y: 90 },
      database: { x: 35, y: 70 },
      motion: { x: 92, y: 94 },
      tools: { x: 54, y: 85 },
    },
  },

  // --- MOTION (Lavender: #B8A9C9) ---
  {
    id: 'gsap',
    label: 'GSAP',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Hardware-Accelerated Tweens', 'Timeline Sequencing', 'quickTo Zero-Lag Tracking', 'React 19 Contexts'],
    proof: ['Portfolio Hero', 'Trajectory Timeline', 'Featured Cards Tilt'],
    pos: {
      all: { x: 20, y: 60 },
      frontend: { x: 12, y: 60 },
      backend: { x: 88, y: 15 },
      database: { x: 88, y: 18 },
      motion: { x: 30, y: 30 },
      tools: { x: 78, y: 55 },
    },
    isAnchor: true,
  },
  {
    id: 'motion-react',
    label: 'Motion',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Spring Physics', 'Layout Morphing (layoutId)', 'Gesture Tracking (Drag/Tap)', 'AnimatePresence'],
    proof: ['Portfolio', 'Navbar Pill', 'Category Switcher'],
    pos: {
      all: { x: 32, y: 84 },
      frontend: { x: 22, y: 84 },
      backend: { x: 92, y: 32 },
      database: { x: 92, y: 30 },
      motion: { x: 70, y: 30 },
      tools: { x: 88, y: 65 },
    },
    isAnchor: true,
  },
  {
    id: 'scrolltrigger',
    label: 'ScrollTrigger',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Scroll Scrubbing & Sync', 'Clip-Path Unveils', 'Pinning & Depth Parallax'],
    proof: ['Portfolio', 'Experience Timeline', 'About Reveal'],
    pos: {
      all: { x: 14, y: 72 },
      frontend: { x: 8, y: 72 },
      backend: { x: 90, y: 46 },
      database: { x: 90, y: 44 },
      motion: { x: 18, y: 52 },
      tools: { x: 80, y: 70 },
    },
  },
  {
    id: 'splittext',
    label: 'SplitText',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'ADVANCED',
    capabilities: ['Character Parsing', '3D Perspective Staggers', 'Radial Magnetic Distances'],
    proof: ['Portfolio Hero', 'Playground Titles'],
    pos: {
      all: { x: 26, y: 72 },
      frontend: { x: 16, y: 78 },
      backend: { x: 86, y: 58 },
      database: { x: 86, y: 56 },
      motion: { x: 38, y: 52 },
      tools: { x: 84, y: 82 },
    },
  },
  {
    id: 'svg',
    label: 'SVG',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Scalable Vectors', 'Self-Drawing Paths', 'Curved Geometry Coordinate Interpolation'],
    proof: ['Relationship Constellation', 'Section Wave Connectors'],
    pos: {
      all: { x: 40, y: 88 },
      frontend: { x: 35, y: 92 },
      backend: { x: 92, y: 72 },
      database: { x: 92, y: 68 },
      motion: { x: 62, y: 52 },
      tools: { x: 92, y: 80 },
    },
  },
  {
    id: 'videojs',
    label: 'Video.js',
    category: 'motion',
    accent: 'lavender',
    color: '#B8A9C9',
    status: 'PRODUCTION',
    capabilities: ['Ambient Media Streaming', 'Custom Editorial Controls', 'Audio Spectrum Sync'],
    proof: ['VEXO Music Entertainment Platform'],
    pos: {
      all: { x: 85, y: 72 },
      frontend: { x: 84, y: 35 },
      backend: { x: 88, y: 84 },
      database: { x: 88, y: 82 },
      motion: { x: 82, y: 52 },
      tools: { x: 90, y: 92 },
    },
  },
];

/**
 * Editorial Connection Lines
 * Very thin SVG connection paths that illuminate on interaction
 */
export const CONSTELLATION_EDGES = [
  // Full-Stack Architecture Highway
  { from: 'react', to: 'typescript', category: 'frontend' },
  { from: 'typescript', to: 'nextjs', category: 'frontend' },
  { from: 'nextjs', to: 'rest-api', category: 'backend' },
  { from: 'rest-api', to: 'nodejs', category: 'backend' },
  { from: 'nodejs', to: 'postgresql', category: 'database' },
  { from: 'nodejs', to: 'mongodb', category: 'database' },
  
  // Frontend Internal Mechanics
  { from: 'react', to: 'javascript', category: 'frontend' },
  { from: 'react', to: 'nextjs', category: 'frontend' },
  { from: 'javascript', to: 'html', category: 'frontend' },
  { from: 'javascript', to: 'css', category: 'frontend' },
  { from: 'css', to: 'tailwind', category: 'frontend' },
  { from: 'html', to: 'tailwind', category: 'frontend' },

  // Backend Internal Pipelines
  { from: 'nodejs', to: 'express', category: 'backend' },
  { from: 'nodejs', to: 'fastify', category: 'backend' },
  { from: 'express', to: 'rest-api', category: 'backend' },
  { from: 'fastify', to: 'rest-api', category: 'backend' },
  { from: 'nodejs', to: 'jwt', category: 'backend' },
  { from: 'jwt', to: 'rbac', category: 'backend' },

  // Database Internal Schema Links
  { from: 'postgresql', to: 'sql', category: 'database' },
  { from: 'mongodb', to: 'mongoose', category: 'database' },
  { from: 'postgresql', to: 'prisma', category: 'database' },
  { from: 'sql', to: 'prisma', category: 'database' },

  // Motion & Animation Network
  { from: 'react', to: 'gsap', category: 'motion' },
  { from: 'gsap', to: 'scrolltrigger', category: 'motion' },
  { from: 'scrolltrigger', to: 'splittext', category: 'motion' },
  { from: 'splittext', to: 'svg', category: 'motion' },
  { from: 'svg', to: 'motion-react', category: 'motion' },
  { from: 'react', to: 'motion-react', category: 'motion' },
  { from: 'motion-react', to: 'videojs', category: 'motion' },
  { from: 'nextjs', to: 'videojs', category: 'motion' },
];

/**
 * Mapping from technology ID to connected verified projects
 */
export const TECH_TO_PROJECTS = {
  react: ['dezoryn', 'skill-loop', 'portfolio'],
  typescript: ['digimate', 'dezoryn', 'portfolio'],
  nextjs: ['vexo'],
  javascript: ['portfolio', 'dezoryn', 'skill-loop', 'digimate'],
  html: ['digimate', 'portfolio', 'skill-loop'],
  css: ['portfolio', 'dezoryn', 'skill-loop', 'digimate'],
  tailwind: ['dezoryn', 'digimate', 'skill-loop'],
  nodejs: ['dezoryn', 'skill-loop', 'digimate'],
  express: ['digimate', 'skill-loop'],
  fastify: ['dezoryn'],
  'rest-api': ['digimate', 'skill-loop', 'dezoryn'],
  jwt: ['dezoryn', 'digimate', 'skill-loop'],
  rbac: ['dezoryn'],
  postgresql: ['dezoryn', 'digimate'],
  mongodb: ['skill-loop', 'digimate'],
  sql: ['digimate', 'dezoryn'],
  mongoose: ['skill-loop'],
  prisma: ['dezoryn'],
  gsap: ['portfolio'],
  scrolltrigger: ['portfolio'],
  splittext: ['portfolio'],
  'motion-react': ['portfolio'],
  svg: ['portfolio', 'dezoryn'],
  videojs: ['vexo'],
};
