import { FiBriefcase, FiAward } from 'react-icons/fi';

/**
 * Verified Career Milestone Data
 * Chronological journey from formal engineering foundation to full-stack production engineering.
 */
export const milestones = [
  {
    id: 'milestone-education',
    step: '01',
    year: '2021',
    chapterTag: 'FOUNDATION',
    type: 'education',
    role: 'Bachelor of Technology · Electronics & Communication',
    company: 'JECRC Foundation',
    period: 'Nov 2021 — May 2025',
    durationContext: '4 YEARS',
    accent: 'mutedIce', // #5E8C96 Muted Ice
    icon: FiAward,
    summary:
      'Rigorous academic and practical engineering foundation in Electronics, Communication Systems, Data Structures, and modern full-stack web engineering paradigms.',
    foundationTopics: [
      'Electronics',
      'Communication Systems',
      'Data Structures',
      'Web Development',
      'Software Engineering',
    ],
    capabilityPhase: 'WHAT I LEARNED',
    capabilityItems: [
      'Fundamentals',
      'Electronics',
      'Programming',
      'Data Structures',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
    contributions: [
      'Mastered modern web architecture: React, Node.js, Express, MongoDB, and PostgreSQL',
      'Engineered full-stack platforms including Dezoryn, SkillLoop, and ShopEase',
      'Completed specialized Full Stack Web Development and cloud fundamentals coursework',
      'Practiced algorithmic problem solving and production-grade software design',
    ],
  },
  {
    id: 'milestone-internship',
    step: '02',
    year: '2025',
    chapterTag: 'FIRST PRODUCTION EXPERIENCE',
    type: 'internship',
    role: 'Junior Full-Stack Developer Intern',
    company: 'Kvon Technologies',
    period: 'Feb 2025 — Jul 2025',
    durationContext: '6 MONTHS',
    accent: 'mutedIce', // #5E8C96 Muted Ice
    icon: FiBriefcase,
    summary:
      'Contributed to production backend debugging, API orchestration, SQL database optimization, and secure session management for enterprise client web applications.',
    capabilityPhase: 'WHAT I PRACTICED',
    capabilityItems: [
      'Backend',
      'APIs',
      'SQL',
      'Authentication',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'JWT'],
    contributions: [
      'Optimized PostgreSQL query structures and indices to reduce backend response overhead',
      'Diagnosed and resolved edge-case API routing anomalies across staging environments',
      'Implemented secure JWT-based authentication workflows and RBAC authorization',
      'Collaborated on RESTful API architecture paired with MongoDB and SQL engines',
    ],
  },
  {
    id: 'milestone-current',
    step: '03',
    year: '2026',
    chapterTag: 'PRODUCTION ENGINEERING',
    type: 'production',
    isCurrent: true,
    role: 'Full-Stack Developer',
    company: 'Digimate Tech Pvt. Limited',
    period: 'Jul 2026 — Present',
    durationContext: 'CURRENT',
    accent: 'primaryIce', // #9CC9D4 Primary Ice / #E4F0EE Frost
    icon: FiBriefcase,
    summary:
      'Building and maintaining production web applications across frontend, backend, database, and deployment layers for high-impact platforms including Digimate Tech Digital Solutions, Vexo, EstateCRM, and Dezoryn.',
    capabilityPhase: 'WHAT I SHIP',
    capabilityItems: [
      'Full Stack',
      'React',
      'TypeScript',
      'Node.js',
      'Databases',
      'Architecture',
      'Deployment',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Fastify', 'PostgreSQL', 'MongoDB', 'GSAP'],
    contributions: [
      'Developed responsive and interactive web applications using React, TypeScript, JavaScript, and Tailwind CSS',
      'Built backend services and RESTful APIs using Node.js, Express.js, and TypeScript with authentication and validation',
      'Engineered PostgreSQL, SQL, and MongoDB database schemas, CRUD operations, and optimized queries',
      'Diagnosed, debugged, and resolved 100+ software bugs across full-stack development and deployment layers',
    ],
  },
];

export const careerCounters = [
  { count: '01', label: 'Education', accent: 'mutedIce' },
  { count: '01', label: 'Internship', accent: 'mutedIce' },
  { count: '01', label: 'Production Role', accent: 'primaryIce' },
];
