import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from './lib/gsap';
import { ThemeProvider } from './theme/ThemeContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SelectedWork } from './components/SelectedWork';
import './App.css';

/** 1px gold hairline along the very top — how far into the story you are. */
const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
      });
    },
    { scope: barRef }
  );

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
};

export const App: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  return (
    <ThemeProvider>
      <div className="draxraw-app">
        <ScrollProgress />
        <Navigation navRef={navRef} />
        <main id="main-content">
          <Hero navRef={navRef} />
          <SelectedWork />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
