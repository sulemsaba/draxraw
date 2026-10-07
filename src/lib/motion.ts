import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export { gsap, ScrollTrigger, SplitText, Flip };

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

let booted = false;
const bootListeners: Array<() => void> = [];

/** Run cb once the loading screen has handed over to the page (immediately if it already has). */
export const onBoot = (cb: () => void) => {
  if (booted) cb();
  else bootListeners.push(cb);
};

export const markBooted = () => {
  if (booted) return;
  booted = true;
  bootListeners.splice(0).forEach((cb) => cb());
};
