import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectWorkspace from '../components/sections/workspace/ProjectWorkspace';
import SystemsMap from '../components/sections/workspace/SystemsMap';
import CapabilityTimeline from '../components/sections/workspace/CapabilityTimeline';
import QueryExplorer from '../components/sections/workspace/QueryExplorer';
import { projects, toCaseStudy } from '../components/sections/workspace/projectsData';
import ProjectCaseStudy from '../components/interactive/ProjectCaseStudy';
import GitHub from '../components/sections/GitHub';

/**
 * Projects Page — Interactive Project Workspace
 * Index + active system preview → system relationships → capability evolution → query explorer.
 * A single active-system state is shared so every view can load a project into the workspace.
 */
const ProjectsPage = () => {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [caseStudy, setCaseStudy] = useState(null);

  const handleSelect = useCallback((id) => setActiveId(id), []);
  const handleOpenCaseStudy = useCallback((project) => setCaseStudy(toCaseStudy(project)), []);
  const handleCloseCaseStudy = useCallback(() => setCaseStudy(null), []);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  return (
    <>
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="projectsPageTheme"
      data-page="projects"
      style={{ minHeight: '100vh', background: '#0B0D0C' }}
    >
      {/* Index + Featured System Preview */}
      <ProjectWorkspace
        activeId={activeId}
        onSelect={handleSelect}
        onOpenCaseStudy={handleOpenCaseStudy}
      />

      {/* Architecture workspace — selector · active architecture · inspector · data flow */}
      <SystemsMap activeId={activeId} onSelect={handleSelect} onOpenCaseStudy={handleOpenCaseStudy} />

      {/* Scroll-driven capability evolution */}
      <CapabilityTimeline onSelect={handleSelect} />

      {/* SQL-style explorer (frontend simulation) */}
      <QueryExplorer onSelect={handleSelect} />

      {/* GitHub Open Source Showcase */}
      <GitHub />
    </motion.div>

    {/* Case Study Morph — outside the transformed wrapper so `position: fixed` stays viewport-relative */}
    {caseStudy && (
      <div className="projectsPageTheme" data-page="projects">
        <ProjectCaseStudy project={caseStudy} onClose={handleCloseCaseStudy} />
      </div>
    )}
    </>
  );
};

export default ProjectsPage;
