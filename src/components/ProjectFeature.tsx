import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap';
import type { Project } from '../types/project';
import './ProjectFeature.css';

interface ProjectFeatureProps {
  project: Project;
  index?: number;
  theme?: 'light' | 'dark';
  /** Opens the cinema overlay — the film plays here with sound. */
  onWatch?: (project: Project) => void;
}

/** Per-variant reveal choreography — deliberately not identical. */
const REVEALS = {
  'landscape-feature': { clipFrom: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out' },
  'portrait-offset': { clipFrom: 'inset(0 0 0 100%)', duration: 0.95, ease: 'power2.out' },
  'full-bleed': { clipFrom: 'inset(0 100% 0 0)', duration: 1.25, ease: 'power3.out' }
} as const;

/**
 * One project frame. The actual film plays inside the frame —
 * muted, looping, chrome-less — but only while the frame is on
 * screen (a ScrollTrigger gate mounts/unmounts the stream, so a
 * page of six films never pays for six live players at once).
 * The still sits underneath the whole time: it breathes (Ken
 * Burns) until the stream fades over it, and it stays honest if
 * the stream never arrives.
 */
export const ProjectFeature: React.FC<ProjectFeatureProps> = ({ project, index = 0, theme = 'dark', onWatch }) => {
  const articleRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [streamState, setStreamState] = useState<'idle' | 'loading' | 'live'>('idle');

  /* Muted, chrome-less loop of the actual film — the poster's live cut. */
  const previewSrc = `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${project.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`;

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) return; /* still, honest frames — pressing one still opens the cinema */

      /* Live gate — the film plays only while its frame is on screen.
         Mount -> wait for load -> fade over the poster; off screen -> unmount. */
      ScrollTrigger.create({
        trigger: mediaRef.current,
        start: 'top 95%',
        end: 'bottom 5%',
        onToggle: (self) => setStreamState(self.isActive ? 'loading' : 'idle')
      });

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

      /* The still breathes until the stream covers it (and forever
         on connections where the stream never arrives). Scale only —
         a translate would expose the edges of a cover-fit image. */
      const poster = mediaRef.current?.querySelector('img');
      if (poster) {
        gsap.to(poster, {
          scale: 1.07,
          duration: 11 + (index % 3) * 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }

      /* Caption words cut in one frame at a time — the hero's signature. */
      const split = new SplitText(titleRef.current, { type: 'words' });
      gsap.set(split.words, { autoAlpha: 0 });
      gsap.set(metaRef.current, { autoAlpha: 0, y: 14 });

      gsap.to(split.words, {
        autoAlpha: 1,
        duration: 0.01,
        ease: 'none',
        stagger: 0.055,
        scrollTrigger: {
          trigger: articleRef.current,
          start: 'top 72%',
          once: true
        }
      });

      gsap.to(metaRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: articleRef.current,
          start: 'top 70%',
          once: true
        }
      });

      /* Depth — desktop only, a slow drift of the whole frame. */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        const drift = gsap.fromTo(
          innerRef.current,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: articleRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5
            }
          }
        );
        return () => {
          drift.kill();
        };
      });

      return () => {
        split.revert();
        mm.revert();
      };
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
      <div ref={mediaRef} className="project-media" style={{ aspectRatio: project.aspectRatio }}>
        <div ref={innerRef} className="media-inner">
          <div className="media-poster">
            <img src={project.thumbnail} alt={project.title} loading="lazy" />
          </div>
          <div className={`media-live${streamState === 'live' ? ' is-on' : ''}`} aria-hidden="true">
            {streamState !== 'idle' && (
              <iframe
                src={previewSrc}
                title={`${project.title} — muted preview`}
                allow="autoplay; encrypted-media"
                onLoad={() => setStreamState('live')}
                tabIndex={-1}
              />
            )}
          </div>
        </div>
        <button
          type="button"
          className="media-hit"
          onClick={() => onWatch?.(project)}
          aria-label={`Watch ${project.title} with sound`}
        />
      </div>

      <div ref={metaRef} className="project-meta">
        <div className="meta-main">
          <span className="project-number">{project.number}</span>
          <h3 ref={titleRef} className="project-title">
            {project.title}
          </h3>
          <p className="project-type">
            {project.type} / {project.year}
          </p>
        </div>
        <span className="view-project" aria-hidden="true">
          Watch with sound&nbsp;&#8599;
        </span>
      </div>
    </article>
  );
};
