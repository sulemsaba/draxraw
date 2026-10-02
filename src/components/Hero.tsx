import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import './Hero.css';

interface HeroProps {
  navRef: React.RefObject<HTMLElement | null>;
}

export const Hero: React.FC<HeroProps> = ({ navRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set([brandRef.current, identityRef.current, figureRef.current, cueRef.current], {
          clearProps: 'all'
        });
        return;
      }

      /* Quiet entry sequence */
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (navRef.current) {
        /* Opacity only — a transform here would break position:fixed
           for the mobile menu overlay that lives inside the header. */
        tl.fromTo(
          navRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1.0 },
          0.1
        );
      }

      tl.fromTo(
        figureRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0% 0 0% 0)', duration: 1.15, ease: 'power3.out' },
        0.2
      ).fromTo(
        figureRef.current?.querySelector('img') ?? {},
        { scale: 1.025 },
        { scale: 1, duration: 1.5, ease: 'power3.out' },
        0.2
      );

      tl.fromTo(
        brandRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.9 },
        0.6
      ).fromTo(
        identityRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9 },
        0.8
      ).fromTo(
        cueRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        1.0
      );

      /* Subtle scroll parallax — desktop only */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        const scrollTween = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });

        scrollTween
          .to(figureRef.current, { y: 40 }, 0)
          .to(brandRef.current, { y: -28 }, 0)
          .to(identityRef.current, { y: -16 }, 0)
          .to(cueRef.current, { autoAlpha: 0, y: -8 }, 0);

        return () => {
          scrollTween.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const scrollToWork = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="hero theme-light" id="top" data-theme="light" aria-label="Introduction">
      <div className="hero-inner">
        <h1 ref={brandRef} className="hero-brand">
          DRAX.RAW
        </h1>

        <div ref={figureRef} className="hero-figure">
          <img
            src="/images/drax-portrait.png"
            alt="Portrait of Drax — filmmaker and photographer — with his camera"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div ref={identityRef} className="hero-identity">
          <p className="identity-role">Filmmaker / Editor / Photographer</p>
          <p className="identity-base">Dar es Salaam, Tanzania</p>
        </div>

        <a ref={cueRef} href="#work" className="hero-cue" onClick={scrollToWork}>
          Selected work <span className="cue-arrow" aria-hidden="true">&#8595;</span>
        </a>
      </div>
    </section>
  );
};
