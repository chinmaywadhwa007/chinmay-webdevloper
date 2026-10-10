import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/common/CustomCursor';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import BackToTop from './components/common/BackToTop';
import ScrollToTop from './components/common/ScrollToTop';

// Dedicated Page Views
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import ExperiencePage from './pages/ExperiencePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import styles from './App.module.css';

/**
 * Animated Routes Wrapper for Smooth Multi-Page Transitions
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resume" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Main App Component - Multi-page router with global theme and layout
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <CursorProvider>
          <div className={styles.app}>
            <CustomCursor />
            <ScrollToTop />
            <ScrollProgress />
            <BackToTop />
            <Navbar />

            <main className={styles.main}>
              <AnimatedRoutes />
            </main>

            <Footer />
          </div>
        </CursorProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
