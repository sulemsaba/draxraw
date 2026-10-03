import React, { useCallback, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText } from '../lib/gsap';
import { FILM_PROJECTS } from '../data/projects';
import type { Project } from '../types/project';
import { ProjectFeature } from './ProjectFeature';
import { WorkLightbox } from './WorkLightbox';
import './SelectedWork.css';

/** The page's light/dark cutting rhythm for the six films. */
const THEME_RHYTHM: Array<'light' | 'dark'> = ['dark', 'light', 'dark', 'light', 'dark', 'dark'];

/**
 * The cutting room — all six films, each frame playing the film
 * itself (muted, in view), the cinema overlay one press away.
 */
export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const [watching, setWatching] = useState<Project | null>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      /* The heading cuts in word by word — the hero's signature. */
      const split = new SplitText(titleRef.current, { type: 'words' });
      gsap.set(split.words, { autoAlpha: 0 });
      gsap.set([countRef.current, noteRef.current], { autoAlpha: 0 });

      gsap.to(split.words, {
        autoAlpha: 1,
        duration: 0.01,
        ease: 'none',
        stagger: 0.07,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true
        }
      });

      gsap.to(countRef.current, {
        autoAlpha: 1,
        duration: 0.01,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true
        }
      });

      gsap.to(noteRef.current, {
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        }
      });

      return () => {
        split.revert();
      };
    },
    { scope: sectionRef }
  );

  const openWatch = useCallback((project: Project) => setWatching(project), []);
  const closeWatch = useCallback(() => setWatching(null), []);

  return (
    <section ref={sectionRef} className="selected-work" id="work" aria-label="Selected work">
      <div className="work-intro theme-dark" data-theme="dark">
        <div className="work-intro-inner">
          <h2 ref={titleRef} className="work-title">
            Selected work
          </h2>
          <span ref={countRef} className="work-count">
            ({String(FILM_PROJECTS.length).padStart(2, '0')})
          </span>
        </div>
        <p ref={noteRef} className="work-note">
          Every film plays right here &mdash; muted, looping, cut straight into the page. Press any frame to
          watch it with sound.
        </p>
      </div>

      <div className="work-list">
        {FILM_PROJECTS.map((project, index) => (
          <ProjectFeature
            key={project.id}
            project={project}
            index={index}
            theme={THEME_RHYTHM[index] ?? 'dark'}
            onWatch={openWatch}
          />
        ))}
      </div>

      {watching && <WorkLightbox project={watching} onClose={closeWatch} />}
    </section>
  );
};
