import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from '../types/project';
import './ProjectFeature.css';

interface ProjectFeatureProps {
  project: Project;
  index?: number;
}

export const ProjectFeature: React.FC<ProjectFeatureProps> = ({ project }) => {
  const containerRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'top 30%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(
        imageFrameRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      ).fromTo(
        textContentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
        '-=0.8'
      );
    },
    { scope: containerRef }
  );

  return (
    <article
      ref={containerRef}
      className={`project-scene variant-${project.layoutVariant}`}
      id={`project-${project.id}`}
      data-testid={`project-scene-${project.number}`}
    >
      {/* Top Scene Marker Line */}
      <div className="scene-status-line">
        <span className="scene-index-num">{project.number}</span>
        <div className="scene-divider" />
        <span className="scene-category-tag">{project.category}</span>
        {project.duration && <span className="scene-duration">{project.duration}</span>}
        <span className="scene-year">{project.year}</span>
      </div>

      <div className="scene-body">
        {/* Cinematic Visual Frame linking directly to the film */}
        <a
          ref={imageFrameRef as unknown as React.RefObject<HTMLAnchorElement>}
          href={project.youtubeUrl || (project.youtubeId ? `https://youtu.be/${project.youtubeId}` : '#')}
          target="_blank"
          rel="noopener noreferrer"
          className="scene-media-frame"
          style={{ aspectRatio: project.aspectRatio || '16/9' }}
          aria-label={`Watch ${project.title} on YouTube`}
        >
          <img
            src={project.thumbnail}
            alt={project.title}
            className="scene-image"
            loading="lazy"
          />

          {/* Cinematic Corner Accents */}
          <div className="frame-crosshair top-left" />
          <div className="frame-crosshair top-right" />
          <div className="frame-crosshair bottom-left" />
          <div className="frame-crosshair bottom-right" />

          {/* Hover View Project Indicator */}
          <div className="scene-hover-badge">
            <span className="badge-dot" />
            <span className="badge-text">PLAY FILM</span>
            {project.duration && <span className="badge-time">[{project.duration}]</span>}
            <span className="badge-arrow">↗</span>
          </div>
        </a>

        {/* Editorial Project Information */}
        <div ref={textContentRef} className="scene-editorial-info">
          <div className="info-header">
            <h3 className="project-title">{project.title}</h3>
            {project.role && <p className="project-role">{project.role}</p>}
          </div>

          <p className="project-description">{project.description}</p>

          {/* Technical Camera / Location Specs */}
          {project.filmMeta && (
            <div className="project-tech-meta">
              {project.filmMeta.camera && (
                <div className="tech-item">
                  <span className="tech-key">CAM:</span>
                  <span className="tech-val">{project.filmMeta.camera}</span>
                </div>
              )}
              {project.filmMeta.aspect && (
                <div className="tech-item">
                  <span className="tech-key">FRAME:</span>
                  <span className="tech-val">{project.filmMeta.aspect}</span>
                </div>
              )}
              {project.filmMeta.location && (
                <div className="tech-item">
                  <span className="tech-key">LOC:</span>
                  <span className="tech-val">{project.filmMeta.location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
