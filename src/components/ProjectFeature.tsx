import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { Project } from '../types/project';
import './ProjectFeature.css';

interface ProjectFeatureProps {
  project: Project;
  index?: number;
  theme?: 'light' | 'dark';
}

/** Per-variant reveal choreography — deliberately not identical. */
const REVEALS = {
  'landscape-feature': { clipFrom: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out', imgFrom: 1.03 },
  'portrait-offset': { clipFrom: 'inset(0 0 0 100%)', duration: 0.95, ease: 'power2.out', imgFrom: 1.04 },
  'full-bleed': { clipFrom: 'inset(0 100% 0 0)', duration: 1.25, ease: 'power3.out', imgFrom: 1.03 }
} as const;

export const ProjectFeature: React.FC<ProjectFeatureProps> = ({ project, index = 0, theme = 'dark' }) => {
  const articleRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLAnchorElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const reveal = REVEALS[project.layoutVariant];

      gsap.fromTo(
        mediaRef.current,
        { clipPath: reveal.clipFrom },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: reveal.duration,
          ease: reveal.ease,
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top 78%',
            once: true
          }
        }
      );

      gsap.fromTo(
        mediaRef.current?.querySelector('img') ?? {},
        { scale: reveal.imgFrom },
        {
          scale: 1,
          duration: reveal.duration + 0.25,
          ease: reveal.ease,
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top 78%',
            once: true
          }
        }
      );

      gsap.fromTo(
        metaRef.current,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.15 + index * 0.05,
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top 74%',
            once: true
          }
        }
      );
    },
    { scope: articleRef }
  );

  return (
    <article
      ref={articleRef}
      className={`project theme-${theme} variant-${project.layoutVariant}`}
      data-theme={theme}
      data-testid={`project-${project.number}`}
    >
      <a
        ref={mediaRef}
        href={project.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="project-media"
        style={{ aspectRatio: project.aspectRatio }}
        aria-label={`Watch ${project.title} on YouTube (opens in a new tab)`}
      >
        <div className="media-inner">
          <img src={project.thumbnail} alt={project.title} loading="lazy" />
        </div>
      </a>

      <div ref={metaRef} className="project-meta">
        <div className="meta-main">
          <span className="project-number">{project.number}</span>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-type">
            {project.type} / {project.year}
          </p>
        </div>
        <span className="view-project" aria-hidden="true">
          View project&nbsp;&#8599;
        </span>
      </div>
    </article>
  );
};
