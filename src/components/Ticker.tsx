import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/motion';
import { SERVICES } from '../data/site';
import './Ticker.css';

/** What Drax shoots, drifting slowly across the case. */
export const Ticker: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.to('.ticker-track', { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
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
    </div>
  );
};
