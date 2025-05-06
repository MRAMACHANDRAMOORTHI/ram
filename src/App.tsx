import React, { useEffect } from 'react';
import './index.css'
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Clients from './components/Clients';
import Education from './components/Education';
import Skills from './components/Skills';
import TechStack from './components/TechStack';
import ResumeCTA from './components/ResumeCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Experience from './components/Experience';
import Projects from './components/Projects';

declare global {
  interface Window {
    initGpTemplate?: () => void;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    // Re-run template setup (scrollspy, AOS, counters, etc.)
    window.initGpTemplate?.();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <main id="main">
        <About />
        <TechStack />
        <Skills />
        <ResumeCTA />
        <Experience />
        <Education />
        <Projects />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;