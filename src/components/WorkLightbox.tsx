import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { Project } from '../types/project';
import './WorkLightbox.css';

interface WorkLightboxProps {
  project: Project;
  onClose: () => void;
}

/**
 * The cinema — a film plays here with sound, without leaving the
 * page. Opens on a hard cut, closes on one; the room is always
 * dark whatever mode the page is in. Esc, the Close control and
 * the backdrop all return you to exactly where you were.
 */
export const WorkLightbox: React.FC<WorkLightboxProps> = ({ project, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  /* Sound on — a user gesture opened this room, so autoplay is earned. */
  const embedSrc = `https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  useGSAP(
    () => {
      /* Opacity only — autoAlpha would set visibility:hidden at the
         tween's first frame and silently swallow the focus() handoff. */
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      gsap.fromTo(
        stageRef.current,
        { clipPath: 'inset(4% 3% 4% 3%)', autoAlpha: 0.3, scale: 0.988 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out'
        }
      );
    },
    { scope: overlayRef }
  );

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.18,
      ease: 'power1.in',
      onComplete: onClose
    });
  }, [closing, onClose]);

  /* Scroll lock + focus handoff while the lights are down. */
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose]);

  return (
    <div
      ref={overlayRef}
      className="cinema"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — playing with sound`}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <button ref={closeRef} type="button" className="cinema-close" onClick={requestClose}>
        Close&nbsp;&#215;
      </button>

      <figure ref={stageRef} className="cinema-stage">
        <div className={`cinema-frame${project.vertical ? ' cinema-frame-vertical' : ''}`}>
          <iframe
            src={embedSrc}
            title={`${project.title} — Drax Raw`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <figcaption className="cinema-caption">
          <span className="cinema-number">{project.number}</span>
          <h3 className="cinema-title">{project.title}</h3>
          <p className="cinema-meta">
            {project.type} / {project.year} &middot; {project.role}
          </p>
          <p className="cinema-desc">{project.description}</p>
          <a className="cinema-yt" href={project.youtubeUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube&nbsp;&#8599;
          </a>
        </figcaption>
      </figure>
    </div>
  );
};
