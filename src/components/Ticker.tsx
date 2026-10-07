import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion';
import { SERVICES } from '../data/site';
import './Ticker.css';

/**
 * What Drax shoots, running across the case. Scrolling pushes it faster,
 * and it runs the way you scroll.
 */
export const Ticker: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>('.ticker-track');
      const loops = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 28 + i * 6, ease: 'none', repeat: -1 })
      );
      let dir = 1;
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          dir = self.direction;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
          loops.forEach((t) => gsap.to(t, { timeScale: dir * boost, duration: 0.2, overwrite: true }));
          // settle back to cruising speed
          loops.forEach((t) => gsap.to(t, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' }));
        },
      });
    },
    { scope: rootRef }
  );

  const words = SERVICES.map((s) => s.label);
  const row = (key: string) => (
    <div className="ticker-track" key={key} aria-hidden="true">
      {[...words, ...words].map((w, i) => (
        <span key={i} className="ticker-word display">
          {w}
          <i />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="ticker" role="region" aria-label="What Drax shoots">
      <p className="sr-only">{words.join(', ')}</p>
      {row('a')}
      {row('b')}
    </div>
  );
};
