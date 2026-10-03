import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap';
import type { Project } from '../types/project';
import './ProjectFeature.css';

interface ProjectFeatureProps {
  project: Project;
  index?: number;
  theme?: 'light' | 'dark';
  /** Opens the cinema overlay: the film plays there with sound. */
  onWatch?: (project: Project) => void;
}

/** Per-scene reveal choreography, deliberately not identical. */
const REVEALS = {
  spotlight: { clipFrom: 'inset(0% 100% 0% 0%)', duration: 1.15, ease: 'power3.out' },
  poster: { clipFrom: 'inset(100% 0% 0% 0%)', duration: 1.0, ease: 'power3.out' },
  cinema: { clipFrom: 'inset(0% 0% 100% 0%)', duration: 1.25, ease: 'power3.out' },
  spread: { clipFrom: 'inset(0% 100% 0% 0%)', duration: 1.05, ease: 'power3.out' },
  frame: { clipFrom: 'inset(0% 0% 100% 0%)', duration: 0.95, ease: 'power3.out' },
  vertical: { clipFrom: 'inset(42% 42% 42% 42%)', duration: 1.3, ease: 'power4.inOut' }
} as const;

/**
 * One film, one scene. Six different compositions so the page
 * reads like a cut sequence, not a template: titles overlap
 * frames, one title runs BEHIND the frame, outlined numerals
 * drift against the media. The film itself plays inside its
 * frame, muted and looping, but only while the frame is on
 * screen (a ScrollTrigger gate mounts and unmounts the stream,
 * so six films never cost six live players). The still sits
 * underneath the whole time: it breathes until the stream
 * fades over it, and it stays honest if the stream never
 * arrives. Pressing a frame opens the sound-on cinema overlay.
 */
export const ProjectFeature: React.FC<ProjectFeatureProps> = ({ project, index = 0, theme = 'dark', onWatch }) => {
  const articleRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const [streamState, setStreamState] = useState<'idle' | 'loading' | 'live'>('idle');

  /* Muted, chrome-less loop of the actual film: the poster's live cut. */
  const previewSrc = `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${project.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`;

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) return; /* still, honest frames: pressing one still opens the cinema */

      /* Live gate: the film plays only while its frame is on screen.
         Mount, wait for load, fade over the poster; off screen, unmount. */
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
            start: 'top 80%',
            once: true
          }
        }
      );

      /* The still breathes until the stream covers it (and forever
         on connections where the stream never arrives). Scale only:
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

      /* Title words cut in one frame at a time: the house signature. */
      const split = new SplitText(titleRef.current, { type: 'words' });
      gsap.set(split.words, { autoAlpha: 0 });
      gsap.set([indexRef.current, metaRef.current], { autoAlpha: 0, y: 18 });

      gsap.to(split.words, {
        autoAlpha: 1,
        duration: 0.01,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: articleRef.current,
          start: 'top 72%',
          once: true
        }
      });

      gsap.to([indexRef.current, metaRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: articleRef.current,
          start: 'top 68%',
          once: true
        }
      });

      /* Depth: desktop only. The numeral drifts against the frame. */
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
        const indexDrift = gsap.fromTo(
          indexRef.current,
          { yPercent: 26 },
          {
            yPercent: -26,
            ease: 'none',
            scrollTrigger: {
              trigger: articleRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9
            }
          }
        );
        return () => {
          drift.kill();
          indexDrift.kill();
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
      className={`film theme-${theme} scene-${project.layoutVariant}`}
      data-theme={theme}
      data-testid={`project-${project.number}`}
    >
      <span ref={indexRef} className="film-index display" aria-hidden="true">
        {project.number}
      </span>

      <div className="film-stage">
        <div ref={mediaRef} className="film-media" style={{ aspectRatio: project.aspectRatio }}>
          <div ref={innerRef} className="media-inner">
            <div className="media-poster">
              <img src={project.thumbnail} alt={project.title} loading="lazy" />
            </div>
            <div className={`media-live${streamState === 'live' ? ' is-on' : ''}`} aria-hidden="true">
              {streamState !== 'idle' && (
                <iframe
                  src={previewSrc}
                  title={`${project.title} muted preview`}
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
            data-cursor="media"
            onClick={() => onWatch?.(project)}
            aria-label={`Watch ${project.title} with sound`}
          />
        </div>
      </div>

      <header className="film-head">
        <div className="film-row">
          <span className="film-no">{project.number}</span>
          <span className="film-rule" aria-hidden="true" />
        </div>
        <h3 ref={titleRef} className="film-title display">
          {project.title}
        </h3>
        <p ref={metaRef} className="film-meta">
          {project.type} &middot; {project.year} &middot; {project.role}
        </p>
      </header>
    </article>
  );
};
