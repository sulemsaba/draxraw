import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '../lib/gsap';
import './Preloader.css';

interface PreloaderProps {
  /** Fires once the curtain has left the screen. */
  onRevealed: () => void;
}

const BOOT_MS = 1.9; // total time budget, kept tight on purpose

/**
 * The house lights: DRAX RAW lifts in letter by letter over a gold
 * hairline while a counter runs, then the whole panel wipes up and
 * hands the stage to the hero. One brand beat, then out of the way.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onRevealed }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        onRevealed();
        return;
      }

      const split = new SplitText(wordRef.current, { type: 'chars', mask: 'chars' });

      const counter = { value: 0 };
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: onRevealed
      });

      tl.fromTo(
        split.chars,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.75, stagger: 0.045 },
        0.05
      )
        .fromTo(
          ruleRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.15, ease: 'power2.inOut' },
          0.15
        )
        .fromTo(
          counter,
          { value: 0 },
          {
            value: 100,
            duration: 1.2,
            ease: 'power2.inOut',
            snap: { value: 1 },
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = String(Math.round(counter.value)).padStart(2, '0');
              }
            }
          },
          0.15
        )
        /* exit: letters leave first, the curtain follows */
        .to(split.chars, { yPercent: -115, duration: 0.4, stagger: 0.02, ease: 'power3.in' }, 1.32)
        .to(countRef.current, { autoAlpha: 0, duration: 0.25 }, 1.32)
        .to(
          panelRef.current,
          { yPercent: -100, duration: 0.85, ease: 'power4.inOut' },
          1.45
        );

      return () => {
        split.revert();
      };
    },
    { scope: panelRef }
  );

  return (
    <div ref={panelRef} className="preloader" role="status" aria-label="Drax Raw, loading">
      <div className="preloader-center">
        <span ref={wordRef} className="preloader-word display">
          Drax Raw
        </span>
        <span className="preloader-rule" aria-hidden="true">
          <span ref={ruleRef} className="preloader-rule-fill" />
        </span>
      </div>
      <span ref={countRef} className="preloader-count" aria-hidden="true">
        00
      </span>
    </div>
  );
};

/** Used by App to size the hero hand-off without measuring anything. */
export const PRELOADER_HANDOFF_MS = BOOT_MS * 1000 * 0.72;
