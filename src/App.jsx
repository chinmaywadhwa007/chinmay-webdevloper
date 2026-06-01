import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import BackToTop from './components/common/BackToTop';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import GitHub from './components/sections/GitHub';
import Resume from './components/sections/Resume';
import Contact from './components/sections/Contact';
import styles from './App.module.css';

/**
 * Main App Component - Root component with routing and layout
 */
function App() {
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'github', label: 'Open Source' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <Router>
      <ThemeProvider>
        <div className={styles.app}>
          <ScrollProgress />
          <BackToTop />
          <Navbar sections={sections} />
          
          <main className={styles.main}>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <GitHub />
            <Resume />
            <Contact />
          </main>

          <Footer />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
