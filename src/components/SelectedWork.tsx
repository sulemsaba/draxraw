import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FILM_PROJECTS } from '../data/projects';
import { ProjectFeature } from './ProjectFeature';
import './SelectedWork.css';

export const SelectedWork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="selected-work-section" id="work" aria-label="Selected Work">
      <div className="work-container">
        {/* Section Header */}
        <header ref={headerRef} className="work-header">
          <div className="work-header-lead">
            <h2 className="work-section-title">SELECTED WORK</h2>
            <p className="work-secondary-line">FILMS / STORIES / COMMISSIONS</p>
          </div>
          <div className="work-header-meta">
            <span className="archive-counter">[ 001 — 003 ]</span>
            <span className="archive-status">AVAILABLE FOR COMMISSION</span>
          </div>
        </header>

        {/* Cinematic Project Rows / Scenes */}
        <div className="work-projects-list">
          {FILM_PROJECTS.map((project, index) => (
            <ProjectFeature key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
