import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Film } from '../data/site';
import { CloseIcon, YouTubeIcon } from './Icons';
import './Player.css';

interface PlayerProps {
  film: Film | null;
  onClose: () => void;
}

/** The case lid opens and the film plays inside it. */
export const Player: React.FC<PlayerProps> = ({ film, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (film && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(
          dialog.querySelector('.lid'),
          { scale: 1.12, rotation: -3, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }
        );
      }
    }
    if (!film && dialog.open) dialog.close();
    if (!film) document.documentElement.style.overflow = '';
  }, [film]);

  return (
    <dialog
      ref={ref}
      className="player"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={film ? `Playing ${film.title}` : 'Film player'}
    >
      {film && (
        <div className="lid">
          <div className="lid-head">
            <span className="lid-title display">{film.title}</span>
            <button type="button" className="lid-close stuck" onClick={onClose} autoFocus>
              <span className="vinyl is-paper label">
                <CloseIcon size={18} /> Close
              </span>
            </button>
          </div>
          <div className={`lid-screen ${film.vertical ? 'is-vertical' : ''}`}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0&playsinline=1`}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
          <a className="lid-yt label" href={`https://youtu.be/${film.id}`} target="_blank" rel="noopener noreferrer">
            <YouTubeIcon size={20} /> Open on YouTube
          </a>
        </div>
      )}
    </dialog>
  );
};
