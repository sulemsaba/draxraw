import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { FILM_PROJECTS } from '../data/projects';
import { ProjectFeature } from './ProjectFeature';
import './SelectedWork.css';

/** The page's light/dark cutting rhythm for the six films. */
const THEME_RHYTHM: Array<'light' | 'dark'> = ['dark', 'light', 'dark', 'light', 'dark', 'dark'];

/**
 * The cutting room. A poster-size header, then all six films as
 * six different scenes. Each frame carries its image into a
 * dedicated project page on click — no lightbox, no modal.
 */
export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      /* the header lifts out of two masks: curtains, not fades */
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 112 });
      gsap.set(noteRef.current, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true
        }
      });

      tl.to(line1Ref.current, { yPercent: 0, duration: 1.05, ease: 'power4.out' }, 0)
        .to(line2Ref.current, { yPercent: 0, duration: 1.05, ease: 'power4.out' }, 0.12)
        .to(noteRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.55);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="selected-work" id="film" aria-label="Film work">
      <div className="work-intro theme-dark" data-theme="dark">
        <p className="work-kicker">Selected work</p>
        <h2 className="work-title display">
          <span className="line-mask">
            <span ref={line1Ref} className="line-inner">
              Film
            </span>
          </span>
          <span className="line-mask">
            <span ref={line2Ref} className="line-inner">
              <span className="work-count">({String(FILM_PROJECTS.length).padStart(2, '0')})</span>
            </span>
          </span>
        </h2>
        <p ref={noteRef} className="work-note">
          Six films, cut straight into the page. Each frame carries into its own project experience.
        </p>
      </div>

      <div className="work-list">
        {FILM_PROJECTS.map((project, index) => (
          <ProjectFeature
            key={project.id}
            project={project}
            index={index}
            theme={THEME_RHYTHM[index] ?? 'dark'}
          />
        ))}
      </div>
    </section>
  );
};
