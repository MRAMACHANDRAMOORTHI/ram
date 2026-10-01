import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles/index.css';

import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './providers/ThemeProvider';
import { UIProvider } from './providers/UIProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UIProvider>
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </LazyMotion>
      </UIProvider>
    </ThemeProvider>
  </StrictMode>,
);
