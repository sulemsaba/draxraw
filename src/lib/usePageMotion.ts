import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, reducedMotion, ScrollTrigger } from './motion';

/**
 * The shared motion on every page: each material arrives its own way as it
 * scrolls in.
 */
export const usePageMotion = (scope: RefObject<HTMLElement | null>) => {
  useGSAP(
    () => {
      if (reducedMotion()) return;

      const arrive = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars, stagger: number) => {
        const els = gsap.utils.toArray<HTMLElement>(selector);
        if (!els.length) return;
        gsap.set(els, { opacity: 0 });
        ScrollTrigger.batch(els, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.fromTo(batch, from, { ...to, stagger }),
        });
      };

      // Headings and buttons: slapped on like stickers
      arrive('[data-slap]', { scale: 1.25, opacity: 0, rotation: () => gsap.utils.random(-6, 6) }, {
        scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.6)',
      }, 0.07);
      // Prints: dropped and pressed down under their tape
      arrive('[data-tape]', { y: -40, opacity: 0, rotation: () => gsap.utils.random(-5, 5) }, {
        y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: 'power3.out',
      }, 0.08);
      // Film stickers: laid down from one corner and smoothed flat
      arrive('[data-peel]', { opacity: 0, rotation: -7, y: 50, transformOrigin: '0% 0%' }, {
        opacity: 1, rotation: 0, y: 0, duration: 0.9, ease: 'expo.out',
      }, 0.12);
      // Plain text blocks: rise
      arrive('[data-rise]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.08);

    },
    { scope }
  );
};
