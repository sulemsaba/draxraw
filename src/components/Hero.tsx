import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DraxPortraitPlaceholder } from './DraxPortraitPlaceholder';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  navRef: React.RefObject<HTMLElement | null>;
}

export const Hero: React.FC<HeroProps> = ({ navRef }) => {
  const heroRef = useRef<HTMLElement>(null);
  const draxTitleRef = useRef<HTMLDivElement>(null);
  const rawTitleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set([draxTitleRef.current, rawTitleRef.current, metaRef.current, portraitRef.current, indicatorRef.current], {
          opacity: 1,
          y: 0,
          x: 0
        });
        if (navRef.current) gsap.set(navRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Initial Cinematic Load Sequence
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Navbar fades in gently
      if (navRef.current) {
        tl.fromTo(
          navRef.current,
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 1.2 },
          0.2
        );
      }

      // 2. DRAX and RAW reveal separately (slow, cinematic, deliberate)
      tl.fromTo(
        draxTitleRef.current,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1.5 },
        0.4
      );

      tl.fromTo(
        rawTitleRef.current,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1.5 },
        0.65
      );

      // 3. Metadata appears afterward
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1 },
        1.1
      );

      // 4. Portrait placeholder enters subtly from below/right
      tl.fromTo(
        portraitRef.current,
        { opacity: 0, y: 60, x: 20 },
        { opacity: 1, y: 0, x: 0, duration: 1.6 },
        1.25
      );

      // 5. Selected work indicator appears last
      tl.fromTo(
        indicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.9 },
        1.7
      );

      // Scroll Transition Parallax (Title sequence into a film)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      // DRAX and RAW move at different speeds
      if (draxTitleRef.current) {
        scrollTl.to(draxTitleRef.current, { yPercent: -18, opacity: 0.6 }, 0);
      }
      if (rawTitleRef.current) {
        scrollTl.to(rawTitleRef.current, { yPercent: -35, opacity: 0.4 }, 0);
      }
      if (metaRef.current) {
        scrollTl.to(metaRef.current, { yPercent: -25, opacity: 0.1 }, 0);
      }
      if (portraitRef.current) {
        scrollTl.to(portraitRef.current, { yPercent: -12, opacity: 0.7 }, 0);
      }
      if (indicatorRef.current) {
        scrollTl.to(indicatorRef.current, { opacity: 0 }, 0);
      }
    },
    { scope: heroRef }
  );

  const scrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="hero-section" id="hero" aria-label="Hero Introduction">
      {/* Background Ambience Lines (Cinematic Frame Markers) */}
      <div className="hero-frame-markers" aria-hidden="true">
        <div className="frame-marker top-left-mark">01 // 35MM REEL</div>
        <div className="frame-marker top-right-mark">DAR ES SALAAM ARCHIVE</div>
      </div>

      <div className="hero-inner">
        {/* Giant Monolithic Editorial Title */}
        <div className="hero-title-stage">
          <div className="hero-title-line" ref={draxTitleRef}>
            <h1 className="hero-display-title">
              DRAX<span className="title-dot">.</span>
            </h1>
          </div>
          <div className="hero-title-line line-raw" ref={rawTitleRef}>
            <span className="hero-display-title text-raw">RAW</span>
          </div>
        </div>

        {/* Asymmetrical Composition Metadata Block */}
        <div className="hero-meta-block" ref={metaRef}>
          <div className="meta-accent-bar" />
          <div className="meta-text-group">
            <span className="meta-label">FIELDS</span>
            <p className="meta-value">FILM / PHOTOGRAPHY / EDITING</p>
          </div>
          <div className="meta-text-group">
            <span className="meta-label">BASE</span>
            <p className="meta-value">DAR ES SALAAM — TZ</p>
          </div>
          <div className="meta-text-group">
            <span className="meta-label">YEAR</span>
            <p className="meta-value serif-accent">2026 ARCHIVE</p>
          </div>
        </div>

        {/* Drax Cutout Portrait Placeholder Area (Right/Lower section, partially overlapping giant title) */}
        <div className="hero-portrait-slot" ref={portraitRef}>
          <DraxPortraitPlaceholder />
        </div>

        {/* Bottom Selected Work Indicator */}
        <div className="hero-bottom-bar">
          <a
            ref={indicatorRef}
            href="#work"
            className="hero-work-indicator"
            onClick={scrollToWork}
            aria-label="Scroll down to Selected Work"
          >
            <span className="indicator-text">SELECTED WORK</span>
            <span className="indicator-arrow">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
