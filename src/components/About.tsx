import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '../lib/gsap';
import { ABOUT_LEAD, ABOUT_PARAGRAPHS, CAPABILITIES } from '../data/bio';
import './About.css';

/**
 * About. The real bio, read the way an edit reads: the lead
 * statement fills in word by word as you scroll (scrub, not a
 * one-shot fade), the portrait wipes open and drifts, and the
 * capabilities stand in a quiet index. Everything on this
 * section is his own text from his own site.
 */
export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const capListRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      /* the lead fills word by word while you scroll through it */
      const leadSplit = new SplitText(leadRef.current, { type: 'words' });
      gsap.set(leadSplit.words, { autoAlpha: 0.14 });

      gsap.to(leadSplit.words, {
        autoAlpha: 1,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: {
          trigger: leadRef.current,
          start: 'top 82%',
          end: 'bottom 46%',
          scrub: 0.4
        }
      });

      /* portrait wipes open, then drifts slower than the page */
      gsap.fromTo(
        figureRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: figureRef.current, start: 'top 82%', once: true }
        }
      );

      gsap.fromTo(
        figureRef.current?.querySelector('img') ?? {},
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: figureRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        }
      );

      /* body paragraphs and the capability index lift in */
      gsap.set([bodyRef.current?.children ?? [], capListRef.current?.children ?? []], {
        autoAlpha: 0,
        y: 26
      });

      gsap.to([bodyRef.current?.children ?? [], capListRef.current?.children ?? []].flat(), {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        stagger: 0.09,
        scrollTrigger: { trigger: bodyRef.current, start: 'top 78%', once: true }
      });

      return () => {
        leadSplit.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="about theme-light" id="about" data-theme="light" aria-label="About Drax Raw">
      <div className="about-inner">
        <p className="about-kicker">About</p>

        <div className="about-grid">
          <div className="about-copy">
            <p ref={leadRef} className="about-lead">
              {ABOUT_LEAD}
            </p>

            <div ref={bodyRef} className="about-body">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <ul ref={capListRef} className="about-caps" aria-label="Capabilities">
              {CAPABILITIES.map((cap) => (
                <li key={cap.index} className="about-cap">
                  <span className="about-cap-index">{cap.index}</span>
                  <span className="about-cap-label">{cap.label}</span>
                  <span className="about-cap-note">{cap.note}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="about-figure">
            <div ref={figureRef} className="about-figure-crop">
              <img
                src="/images/about-drax.jpg"
                alt="Drax Raw seated in studio light, wearing sunglasses and a cross pendant"
                loading="lazy"
              />
            </div>
            <figcaption className="about-figure-caption">
              <span>Drax Raw</span>
              <span>Dar es Salaam</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
