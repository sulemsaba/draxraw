import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { getLenis } from '../lib/lenis';
import './Marquee.css';

const ITEMS = [
  'Music Videos',
  'Event Films',
  'Documentaries',
  'Short Form',
  'Color Grading',
  'The Edit'
];

/**
 * A single strip of services, cut like a ticker. It runs on its
 * own, but the page's scroll velocity pushes it faster, so fast
 * scrolling literally speeds the strip up. Trailing edge fades keep
 * it inside the page, no hard clip line.
 */
export const Marquee: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion || !trackRef.current) return;

      /* two identical groups inside the track: -50% loops forever */
      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 26,
        ease: 'none',
        repeat: -1
      });

      /* scroll velocity drives the ticker's timeScale */
      const lenis = getLenis();
      const boost = gsap.quickTo(loop, 'timeScale', { duration: 0.4, ease: 'power2' });

      const onScroll = () => {
        const v = lenis ? Math.abs(lenis.velocity) : 0;
        boost(1 + Math.min(v / 9, 2.6));
      };

      /* settle back toward cruise speed whenever scrolling rests */
      const settle = () => {
        if (!lenis || Math.abs(lenis.velocity) < 0.05) boost(1);
      };
      gsap.ticker.add(settle);

      lenis?.on('scroll', onScroll);

      return () => {
        lenis?.off('scroll', onScroll);
        gsap.ticker.remove(settle);
        loop.kill();
      };
    },
    { scope: rootRef }
  );

  const strip = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <span key={item} className="marquee-item">
          <span className="marquee-text display">{item}</span>
          <span className="marquee-dot" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="marquee theme-light" data-theme="light" aria-label="Services">
      <div ref={trackRef} className="marquee-track">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
};
