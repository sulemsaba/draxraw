import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from './lib/gsap';
import { ThemeProvider } from './theme/ThemeContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { SelectedWork } from './components/SelectedWork';
import { StillsGallery } from './components/StillsGallery';
import { ContactFooter } from './components/ContactFooter';
import { Cursor } from './components/Cursor';
import { Preloader, PRELOADER_HANDOFF_MS } from './components/Preloader';
import { initLenis, stopLenis, startLenis } from './lib/lenis';
import './App.css';

/** 1px gold hairline along the very top: how far into the story you are. */
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
  const [booted, setBooted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduced);
    initLenis();
    if (reduced) {
      setBooted(true); /* no curtain for reduced motion, the page just is */
    } else {
      stopLenis(); /* hold the scroll until the curtain lifts */
    }
  }, []);

  useEffect(() => {
    if (booted) startLenis();
  }, [booted]);

  const reveal = useCallback(() => setBooted(true), []);

  return (
    <ThemeProvider>
      <div className="draxraw-app">
        <Cursor />
        <ScrollProgress />
        <Navigation navRef={navRef} />
        <main id="main-content">
          <Hero
            navRef={navRef}
            introDelay={!reducedMotion && !booted ? PRELOADER_HANDOFF_MS / 1000 : 0}
          />
          <Marquee />
          <SelectedWork />
          <StillsGallery />
        </main>
        <ContactFooter />
        {!reducedMotion && !booted && <Preloader onRevealed={reveal} />}
      </div>
    </ThemeProvider>
  );
};

export default App;
