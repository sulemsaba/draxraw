import React, { useRef, useState } from 'react';
import { gsap, reducedMotion } from '../lib/motion';
import { FILMS, YOUTUBE_URL, type Film } from '../data/site';
import { GoLink } from './PageWipe';
import { ArrowIcon } from './Icons';
import { Sticker } from './Sticker';
import { PlayIcon, YouTubeIcon } from './Icons';
import { Player } from './Player';
import { tilt, tornClip } from '../lib/torn';
import './Films.css';

interface FilmsProps {
  /** Show only the first N films (home page teaser). */
  limit?: number;
  title?: string;
  /** h1 on the Films page, h2 when it is a section of Home. */
  as?: 'h1' | 'h2';
}

export const Films: React.FC<FilmsProps> = ({ limit, title = 'The work', as = 'h2' }) => {
  const [playing, setPlaying] = useState<Film | null>(null);
  const peeledRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const films = limit ? FILMS.slice(0, limit) : FILMS;


  const play = (film: Film) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const card = e.currentTarget.closest<HTMLElement>('.film');
    const open = () => {
      setPlaying(film);
    };
    if (!card || reducedMotion()) return open();

    // Peel the sticker off the case from its top-left corner, then roll the film
    peeledRef.current = card;
    gsap.to(card, {
      rotation: -14,
      x: '+=40',
      y: -70,
      scale: 1.04,
      opacity: 0,
      transformOrigin: '100% 0%',
      duration: 0.42,
      ease: 'power2.in',
      onComplete: open,
    });
  };

  const close = () => {
    setPlaying(null);
    const card = peeledRef.current;
    peeledRef.current = null;
    if (!card) return;
    // Slap it back where it was
    gsap.fromTo(
      card,
      { rotation: 6, x: 0, y: -10, scale: 1.25, opacity: 0 },
      { rotation: 0, y: 0, scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(2)', delay: 0.15 }
    );
  };

  return (
    <section ref={rootRef} className="section films" id="work" aria-labelledby="work-title">
      <div className="section-inner">
        <header className="films-head">
          <Sticker as={as} color="red" torn={31} rotate={-1} innerClassName="display section-title-inner">
            <span id="work-title">{title}</span>
          </Sticker>
          <p className="films-note">
            Tap a film to play it.
          </p>
        </header>

        <div className="films-grid">
          {films.map((film, i) => (
            <article
              key={film.id}
              className={`film film-${i + 1}`}
              style={{ rotate: `${tilt(i * 5 + 2, 0.9)}deg` }}
              data-peel=""
            >
              <a
                className="film-hit"
                href={`https://youtu.be/${film.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={play(film)}
                aria-label={`Play ${film.title}, ${film.length}`}
              >
                <span className="film-print stuck">
                  <span className="film-photo">
                    <img src={`img/films/${film.id}.webp`} alt="" loading="lazy" width={1280} height={720} />
                    <span className="film-curl" />
                  </span>
                </span>

                <span className="film-play stuck">
                  <span className="vinyl is-yellow film-play-inner">
                    <PlayIcon size={26} />
                  </span>
                </span>

                <span className="film-label stuck">
                  <span className={`vinyl is-${film.color} film-label-inner`} style={{ clipPath: tornClip(i * 7 + 40, 4) }}>
                    <span className="film-title display">{film.title}</span>
                    <span className="film-meta label">
                      {film.kind && (
                        <>
                          {film.kind} <i>/</i>{' '}
                        </>
                      )}
                      {film.length}
                    </span>
                  </span>
                </span>

              </a>
            </article>
          ))}
        </div>

        {limit ? (
          <GoLink to="/films" className="films-more label">
            View all <ArrowIcon size={18} />
          </GoLink>
        ) : (
          <a className="films-more label" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            <YouTubeIcon /> More on YouTube: @DraxRaw
          </a>
        )}
      </div>

      <Player film={playing} onClose={close} />
    </section>
  );
};
