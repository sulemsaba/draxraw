import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import './Cursor.css';

/**
 * Fine-pointer cursor: a small paper dot that trails the pointer,
 * grows into a PLAY chip over any [data-cursor="media"] surface and
 * hugs links. Touch and reduced-motion visitors never see it and
 * keep the native cursor everywhere.
 */
export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reducedMotion || !dotRef.current) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    document.documentElement.classList.add('has-cursor');

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.32, ease: 'power3' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.32, ease: 'power3' });

    gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const onMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      gsap.to(dot, { autoAlpha: 1, duration: 0.2, overwrite: 'auto' });

      const target = event.target as HTMLElement | null;
      const overMedia = target?.closest?.('[data-cursor="media"]');
      const overLink = target?.closest?.('a, button');
      const nextState = overMedia ? 'media' : overLink ? 'link' : 'default';
      if (dot.dataset.state !== nextState) {
        dot.dataset.state = nextState;
        if (nextState === 'media') {
          gsap.to(dot, { width: 76, height: 76, backgroundColor: '#f1efe8', mixBlendMode: 'normal', duration: 0.35, ease: 'power3.out' });
          gsap.to(label, { autoAlpha: 1, duration: 0.25 });
        } else if (nextState === 'link') {
          gsap.to(dot, { width: 34, height: 34, backgroundColor: '#ece9e2', mixBlendMode: 'difference', duration: 0.35, ease: 'power3.out' });
          gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        } else {
          gsap.to(dot, { width: 10, height: 10, backgroundColor: '#ece9e2', mixBlendMode: 'difference', duration: 0.35, ease: 'power3.out' });
          gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        }
      }
    };

    const onLeave = () => gsap.to(dot, { autoAlpha: 0, duration: 0.25 });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
      dot.dataset.state = undefined;
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor-dot" aria-hidden="true">
      <span ref={labelRef} className="cursor-label">
        Play
      </span>
    </div>
  );
};
