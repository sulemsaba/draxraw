import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export { gsap, ScrollTrigger, SplitText, Flip };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

/** Smooth wheel scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export const startSmoothScroll = () => {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
};

export const scrollTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
};

export const setScrollLocked = (locked: boolean) => {
  if (locked) lenis?.stop();
  else lenis?.start();
};

/**
 * Magnetic pull: the element leans toward the pointer and springs back.
 * Returns a cleanup function.
 */
export const magnetize = (el: HTMLElement, strength = 0.3) => {
  if (!finePointer() || reducedMotion()) return () => {};
  const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
  const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * strength);
    y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x(0);
    y(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
  };
};
