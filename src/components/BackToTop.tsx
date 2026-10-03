import React, { useEffect, useRef, useState } from 'react';
import { scrollToTarget } from '../lib/lenis';
import './BackToTop.css';

/**
 * A small floating "back to top" control that appears on mobile
 * after the visitor scrolls past the first viewport. Sits at the
 * bottom-right corner, respects the iOS safe area, fades in/out
 * smoothly, and uses the Drax gold as the accent so it reads as
 * part of the brand rather than a generic UI widget.
 *
 * Desktop and reduced-motion visitors never see it — they have
 * the native scroll bar and the "Back to top" link in the
 * ContactFooter. This is purely a mobile-nicety.
 */
export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (finePointer) return; /* desktop keeps the footer link */

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        setVisible(window.scrollY > window.innerHeight * 1.2);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    scrollToTarget('#top');
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={toTop}
      aria-label="Back to top"
    >
      <span className="back-to-top-icon" aria-hidden="true">
        &#8593;
      </span>
    </button>
  );
};
