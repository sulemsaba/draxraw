import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '../lib/gsap';
import './Hero.css';

interface HeroProps {
  navRef: React.RefObject<HTMLElement | null>;
}

/**
 * Welcome screen — "the site edits like Drax edits".
 * Words CUT in one frame at a time (his cuts), the photograph
 * wipes open in one long move (his reveals), everything else
 * stays silent. GSAP is the signature here, not decoration.
 */
export const Hero: React.FC<HeroProps> = ({ navRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return; /* copy and image simply render */

      /* ---- entry sequence ------------------------------------ */
      const split = new SplitText(statementRef.current, { type: 'words' });

      gsap.set(split.words, { autoAlpha: 0 });
      gsap.set([kickerRef.current, dotRef.current, cueRef.current], { autoAlpha: 0 });
      gsap.set(figureRef.current, { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(figureRef.current?.querySelector('img') ?? {}, { scale: 1.06 });

      const tl = gsap.timeline();

      if (navRef.current) {
        /* Opacity only — a transform here would break position:fixed
           for the mobile menu overlay that lives inside the header. */
        tl.fromTo(navRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 0.1);
      }

      tl.to(
        kickerRef.current,
        { autoAlpha: 1, duration: 0.01, ease: 'none' },
        0.2
      )
        /* the statement — one word per frame, on a beat */
        .to(
          split.words,
          { autoAlpha: 1, duration: 0.01, ease: 'none', stagger: 0.075 },
          0.35
        )
        /* the photograph — one long horizontal wipe, like a slate opening */
        .to(
          figureRef.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'power4.inOut' },
          0.55
        )
        .to(
          figureRef.current?.querySelector('img') ?? {},
          { scale: 1, duration: 1.6, ease: 'power3.out' },
          0.55
        )
        /* the period lands after the last word — full stop, gold */
        .to(dotRef.current, { autoAlpha: 1, duration: 0.01, ease: 'none' }, 0.98)
        .to(cueRef.current, { autoAlpha: 1, duration: 0.01, ease: 'none' }, 1.55);

      /* ---- scroll: the moment breathes ------------------------ */
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
          .to(figureRef.current, { y: 48 }, 0)
          .to(statementRef.current, { y: -26 }, 0)
          .to(kickerRef.current, { y: -14 }, 0)
          .to(cueRef.current, { autoAlpha: 0, y: -8 }, 0);

        return () => {
          scrollTween.kill();
        };
      });

      return () => {
        split.revert();
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
        <div ref={kickerRef} className="hero-kicker">
          <p>Filmmaker &middot; Video Editor &middot; Visual Storyteller</p>
          <p>Dar es Salaam, Tanzania</p>
        </div>

        <div className="hero-statement-zone">
          <h1 ref={statementRef} className="hero-statement">
            I Tell Stories Through The Art of Editing
          </h1>
          <span ref={dotRef} className="statement-dot" aria-hidden="true">
            .
          </span>
        </div>

        <div ref={figureRef} className="hero-figure">
          <img
            src="/images/hero-drax.jpg"
            alt="Drax Raw lowering his sunglasses in studio light"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <a ref={cueRef} href="#work" className="hero-cue" onClick={scrollToWork}>
          Selected work <span className="cue-arrow" aria-hidden="true">&#8595;</span>
        </a>
      </div>
    </section>
  );
};
