import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from './lib/gsap';
import { ThemeProvider } from './theme/ThemeContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { SelectedWork } from './components/SelectedWork';
import { About } from './components/About';
import { StillsGallery } from './components/StillsGallery';
import { ContactFooter } from './components/ContactFooter';
import { Cursor } from './components/Cursor';
import { Preloader, PRELOADER_HANDOFF_MS } from './components/Preloader';
import { WorkDetail } from './routes/WorkDetail';
import { initLenis, stopLenis, startLenis, scrollToTarget } from './lib/lenis';
import './App.css';

/**
 * Forces WorkDetail to fully remount when the route id changes.
 * This avoids a known SplitText + React state issue where the title's
 * split-spans DOM from the previous project would leak through into
 * the new project's render if useGSAP didn't re-run.
 */
const WorkDetailKeyed: React.FC = () => {
  const { pathname } = useLocation();
  // Pull the route id out for the key. Falls back to 'none' on bad routes.
  const match = pathname.match(/\/work\/([^/]+)/);
  return <WorkDetail key={match?.[1] ?? 'none'} />;
};

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

/**
 * The homepage. Lifted out of App so it renders as one route.
 * The preloader hand-off timing is passed down to Hero.
 */
const Home: React.FC<{ introDelay: number; navRef: React.RefObject<HTMLElement | null> }> = ({ introDelay, navRef }) => (
  <>
    <Hero navRef={navRef} introDelay={introDelay} />
    <Marquee />
    <SelectedWork />
    <About />
    <StillsGallery />
  </>
);

export const App: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  /* When the route changes, scroll back to top and refresh ScrollTrigger
     so triggers from the previous page don't ghost-fire on the new one. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!booted) return;
    /* Skip on first paint while preloader still owns the screen. */
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    /* Defer so the new route's DOM is committed before we re-measure. */
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname, booted]);

  const reveal = useCallback(() => setBooted(true), []);

  /* Smooth-scroll nav helper that works across routes: if we're on a
     project page, route home first, then scroll after a tick. */
  const goSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      event.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => scrollToTarget(href));
        });
      } else {
        scrollToTarget(href);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <ThemeProvider>
      <div className="draxraw-app">
        <Cursor />
        <ScrollProgress />
        <Navigation navRef={navRef} onNavigate={goSection} />
        <main id="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  introDelay={!reducedMotion && !booted ? PRELOADER_HANDOFF_MS / 1000 : 0}
                  navRef={navRef}
                />
              }
            />
            <Route path="/work/:id" element={<WorkDetailKeyed />} />
          </Routes>
        </main>
        <ContactFooter />
        {!reducedMotion && !booted && <Preloader onRevealed={reveal} />}
      </div>
    </ThemeProvider>
  );
};

export default App;
