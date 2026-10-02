import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { FILM_PROJECTS } from '../data/projects';
import { ProjectFeature } from './ProjectFeature';
import './SelectedWork.css';

export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        introRef.current,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="selected-work" id="work" aria-label="Selected work">
      <div ref={introRef} className="work-intro theme-dark" data-theme="dark">
        <div className="work-intro-inner">
          <h2 className="work-title">Selected work</h2>
          <span className="work-years">2026</span>
        </div>
      </div>

      <div className="work-list">
        {FILM_PROJECTS.map((project, index) => (
          <ProjectFeature
            key={project.id}
            project={project}
            index={index}
            theme={index === 1 ? 'light' : 'dark'}
          />
        ))}
      </div>
    </section>
  );
};
