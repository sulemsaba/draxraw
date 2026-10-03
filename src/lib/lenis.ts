import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/**
 * One Lenis instance for the whole app, wired into the GSAP ticker
 * the way the Lenis + ScrollTrigger integration recommends:
 * the ticker drives raf(), every scroll updates ScrollTrigger.
 * Reduced-motion visitors simply keep the native scroller.
 */
let lenis: Lenis | null = null;

export const initLenis = (): Lenis | null => {
  if (lenis) return lenis;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return lenis;
};

export const getLenis = (): Lenis | null => lenis;

/** Smooth-scroll to an element, Lenis when present, native otherwise. */
export const scrollToTarget = (target: string | HTMLElement, offset = 0): void => {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

export const stopLenis = (): void => lenis?.stop();
export const startLenis = (): void => lenis?.start();
