import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '../lib/gsap';
import { scrollToTarget } from '../lib/lenis';
import './Hero.css';

interface HeroProps {
  navRef: React.RefObject<HTMLElement | null>;
  /** Seconds to wait for the preloader curtain before the edit starts. */
  introDelay?: number;
}

/**
 * The poster. One giant name across the page, the man and his
 * camera cut out and standing right on the fold, the statement
 * underneath. The name is split twice: a solid layer behind him
 * and a hairline outline in front of him, so he physically sits
 * INSIDE the typography. GSAP builds him into the page, then the
 * scroll pulls the planes apart at different speeds.
 */
export const Hero: React.FC<HeroProps> = ({ navRef, introDelay = 0 }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLHeadingElement>(null);
  const outlineRef = useRef<HTMLSpanElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return; /* the poster simply renders */

      /* ---- entrance: build the poster ------------------------- */
      const solidSplit = new SplitText(solidRef.current, { type: 'chars', mask: 'chars' });
      const outlineSplit = new SplitText(outlineRef.current, { type: 'chars', mask: 'chars' });
      const words = new SplitText(statementRef.current, { type: 'words' });

      gsap.set(solidSplit.chars, { yPercent: 118 });
      gsap.set(outlineSplit.chars, { yPercent: 118, autoAlpha: 0 });
      gsap.set([kickerRef.current, dotRef.current, cueRef.current], { autoAlpha: 0 });
      gsap.set(words.words, { autoAlpha: 0 });
      gsap.set(subjectRef.current, { clipPath: 'inset(100% 0% 0% 0%)', y: 34 });
      gsap.set(subjectRef.current?.querySelector('img') ?? {}, { scale: 1.07 });

      const tl = gsap.timeline({ delay: introDelay });

      if (navRef.current) {
        /* Opacity only — a transform here would break position:fixed
           for the mobile menu overlay that lives inside the header. */
        tl.fromTo(navRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0 }, 0.1);
      }

      tl /* the name rises letter by letter, both layers on one beat */
        .to(
          solidSplit.chars,
          { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05 },
          0.15
        )
        .to(
          outlineSplit.chars,
          { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power4.out', stagger: 0.05 },
          0.15
        )
        /* the man prints into the page, bottom up, and settles */
        .to(
          subjectRef.current,
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.15, ease: 'power4.inOut' },
          0.5
        )
        .to(
          subjectRef.current?.querySelector('img') ?? {},
          { scale: 1, duration: 1.7, ease: 'power3.out' },
          0.5
        )
        /* the statement cuts in word by word, the house signature */
        .to(
          words.words,
          { autoAlpha: 1, duration: 0.01, ease: 'none', stagger: 0.07 },
          0.95
        )
        .to(kickerRef.current, { autoAlpha: 1, duration: 0.01, ease: 'none' }, 0.4)
        /* the period lands after the last word, gold, full stop */
        .to(dotRef.current, { autoAlpha: 1, duration: 0.01, ease: 'none' }, 1.42)
        .to(cueRef.current, { autoAlpha: 1, duration: 0.01, ease: 'none' }, 1.7);

      /* ---- scroll: the planes separate ------------------------ */
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
          /* he sinks slower than the page: the poster breathes open */
          .to(subjectRef.current, { y: 110, scale: 1.03 }, 0)
          .to(typeRef.current, { y: -90 }, 0)
          .to(statementRef.current, { y: -40 }, 0)
          .to(kickerRef.current, { y: -18 }, 0)
          .to(cueRef.current, { autoAlpha: 0, y: -8 }, 0);

        /* ---- pointer drift: the layers answer the cursor ------- */
        const subjectX = gsap.quickTo(subjectRef.current, 'x', { duration: 0.7, ease: 'power3' });
        const subjectY = gsap.quickTo(subjectRef.current, 'yPercent', { duration: 0.9, ease: 'power3' });
        const typeX = gsap.quickTo(typeRef.current, 'x', { duration: 0.9, ease: 'power3' });

        const onMove = (event: MouseEvent) => {
          const nx = (event.clientX / window.innerWidth - 0.5) * 2;
          const ny = (event.clientY / window.innerHeight - 0.5) * 2;
          subjectX(nx * 14);
          subjectY(ny * 5);
          typeX(nx * -8);
        };

        const section = sectionRef.current;
        section?.addEventListener('mousemove', onMove);

        return () => {
          section?.removeEventListener('mousemove', onMove);
          scrollTween.kill();
        };
      });

      return () => {
        solidSplit.revert();
        outlineSplit.revert();
        words.revert();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  const scrollToWork = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToTarget('#film');
  };

  return (
    <section ref={sectionRef} className="hero theme-light" id="top" data-theme="light" aria-label="Introduction">
      <div className="hero-inner">
        <div ref={kickerRef} className="hero-kicker">
          <p>Filmmaker &middot; Video Editor &middot; Visual Storyteller</p>
          <p>Dar es Salaam, Tanzania</p>
        </div>

        <div ref={typeRef} className="hero-type">
          <h1 className="hero-giant display">
            <span ref={solidRef} className="hero-giant-solid">
              Drax&nbsp;Raw
            </span>
            <span ref={outlineRef} className="hero-giant-outline" aria-hidden="true">
              Drax&nbsp;Raw
            </span>
          </h1>
          <div ref={subjectRef} className="hero-subject">
            <img
              src="/images/hero-drax-cutout.webp"
              alt="Drax Raw operating a cinema camera, red cap and headphones"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="hero-foot">
          <div className="hero-statement-zone">
            <h2 ref={statementRef} className="hero-statement">
              I Tell Stories Through The Art of Editing
            </h2>
            <span ref={dotRef} className="statement-dot" aria-hidden="true">
              .
            </span>
          </div>

          <a ref={cueRef} href="#film" className="hero-cue" onClick={scrollToWork}>
            Selected work <span className="cue-arrow" aria-hidden="true">&#8595;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
