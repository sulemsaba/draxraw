import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap';
import { stashFlipState } from '../lib/flipState';
import type { Project } from '../types/project';
import './ProjectFeature.css';

interface ProjectFeatureProps {
  project: Project;
  index?: number;
  theme?: 'light' | 'dark';
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
 * One film, one scene. Six different compositions so the page reads
 * like a cut sequence, not a template: titles overlap frames, one
 * title runs BEHIND the frame, outlined numerals drift against the
 * media. The film itself plays inside its frame, muted and looping,
 * but only while the frame is on screen (a ScrollTrigger gate mounts
 * and unmounts the stream, so six films never cost six live players).
 *
 * Clicking a frame carries the still image into a dedicated project
 * page via GSAP Flip — the image is the through-line between the
 * cutting room and the storytelling room.
 */
export const ProjectFeature: React.FC<ProjectFeatureProps> = ({ project, index = 0, theme = 'dark' }) => {
  const navigate = useNavigate();
  const articleRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const posterImgRef = useRef<HTMLImageElement>(null);
  const [streamState, setStreamState] = useState<'idle' | 'loading' | 'live'>('idle');

  /* Muted, chrome-less loop of the actual film: the poster's live cut. */
  const previewSrc = `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${project.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`;

  /**
   * Capture the poster image's Flip state before navigation so the
   * project page hero can carry it across the route change. We use a
   * plain `<a href>` link for keyboard/pointer navigation but intercept
   * the click to stash state. If Flip fails to capture for any reason,
   * the project page falls back to a simple reveal — navigation never
   * depends on the transition succeeding.
   */
  const openProject = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const img = posterImgRef.current;
    if (img) {
      stashFlipState(`project-${project.id}`, img);
    }
    navigate(`/work/${project.id}`);
  };

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) return;

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
      const poster = posterImgRef.current;
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
      gsap.set(metaRef.current, { autoAlpha: 0, y: 18 });

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

      gsap.to(metaRef.current, {
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

      /* Depth: desktop only. The frame drifts gently against the page. */
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
      className={`film theme-${theme} scene-${project.layoutVariant}`}
      data-theme={theme}
      data-testid={`project-${project.number}`}
    >
      <div className="film-stage">
        <div ref={mediaRef} className="film-media" style={{ aspectRatio: project.aspectRatio }}>
          <div ref={innerRef} className="media-inner">
            <div className="media-poster">
              <img
                ref={posterImgRef}
                src={project.thumbnail}
                alt={project.title}
                loading="lazy"
                data-flip-id={`project-${project.id}`}
              />
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
          <a
            href={`/work/${project.id}`}
            className="media-hit"
            data-cursor="media"
            onClick={openProject}
            aria-label={`Open ${project.title} project`}
          />
        </div>
      </div>

      <header className="film-head">
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
