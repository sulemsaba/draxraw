import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CaseNav } from './components/CaseNav';
import { CaseHero } from './components/CaseHero';
import { Extrusion } from './components/Extrusion';
import { Services } from './components/Services';
import { Films } from './components/Films';
import { Prints } from './components/Prints';
import { About } from './components/About';
import { Book } from './components/Book';

gsap.registerPlugin(ScrollTrigger);

// Stickers arrive the way they do in life: slapped on hard, a touch rotated,
// overshooting flat against the case with a small thud.
const SLAP_FROM = { scale: 1.45, opacity: 0, rotation: () => gsap.utils.random(-10, 10) };
const SLAP_TO = { scale: 1, opacity: 1, rotation: 0, duration: 0.42, ease: 'back.out(2.2)' };
// Below the fold the slap is lighter, so it stays a gesture, not a template.
const LIGHT_FROM = { scale: 1.22, opacity: 0, rotation: () => gsap.utils.random(-6, 6) };
const LIGHT_TO = { scale: 1, opacity: 1, rotation: 0, duration: 0.36, ease: 'back.out(1.4)' };

export const App: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const hero = root.current?.querySelector('.case-hero');
      const heroStickers = gsap.utils.toArray<HTMLElement>('.case-hero [data-slap]');

      // Opening: the case sits empty under its old bleached stickers, then Drax's go on one by one.
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from('.fragment', { opacity: 0, duration: 0.8, stagger: 0.04, ease: 'power1.out' }, 0);
      heroStickers.forEach((el, i) => {
        const at = 0.2 + i * 0.16;
        tl.fromTo(el, SLAP_FROM, SLAP_TO, at);
        if (i < 3 && hero) {
          tl.fromTo(hero, { y: 0 }, { y: 4, duration: 0.05, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at + 0.16);
        }
      });
      tl.from('.case-logo, .case-rail', { opacity: 0, duration: 0.5 }, 0.9);

      // Below the fold, each material arrives its own way as it scrolls in.
      const onScroll = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars, stagger: number) => {
        const els = gsap.utils.toArray<HTMLElement>(selector).filter((el) => !hero?.contains(el));
        gsap.set(els, { opacity: 0 });
        ScrollTrigger.batch(els, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.fromTo(batch, from, { ...to, stagger }),
        });
      };

      // Section titles and CTAs: slapped on
      onScroll('[data-slap]', LIGHT_FROM, LIGHT_TO, 0.07);
      // Photo prints: dropped and pressed down under their tape
      onScroll('[data-tape]', { y: -36, opacity: 0, rotation: () => gsap.utils.random(-5, 5) }, {
        y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'power3.out',
      }, 0.08);
      // Film stickers: laid down from one corner and smoothed flat
      onScroll('[data-peel]', { opacity: 0, rotation: -7, y: 40, transformOrigin: '0% 0%' }, {
        opacity: 1, rotation: 0, y: 0, duration: 0.8, ease: 'expo.out',
      }, 0.12);
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <CaseNav />
      <main id="main">
        <CaseHero />
        <Extrusion />
        <Films />
        <Extrusion />
        <Services />
        <Extrusion />
        <Prints />
        <Extrusion />
        <About />
        <Book />
      </main>
    </div>
  );
};

export default App;
