import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { FILMS, YOUTUBE_URL, type Film } from '../data/site';
import { Sticker } from './Sticker';
import { PlayIcon, YouTubeIcon } from './Icons';
import { Player } from './Player';
import { tilt, tornClip } from '../lib/torn';
import './Films.css';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Films: React.FC = () => {
  const [playing, setPlaying] = useState<Film | null>(null);
  const peeledRef = useRef<HTMLElement | null>(null);

  const play = (film: Film) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const card = e.currentTarget.closest<HTMLElement>('.film');
    const open = () => {
      setPlaying(film);
    };
    if (!card || reduceMotion()) return open();

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
    <section className="section films" id="work" aria-labelledby="work-title">
      <div className="section-inner">
        <header className="films-head">
          <Sticker as="h2" color="red" torn={31} rotate={-1} innerClassName="display section-title-inner">
            <span id="work-title">The work</span>
          </Sticker>
          <p className="films-note">
            Tap a film to play it.
          </p>
        </header>

        <div className="films-grid">
          {FILMS.map((film, i) => (
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

        <a className="films-more label" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
          <YouTubeIcon /> More on YouTube: @DraxRaw
        </a>
      </div>

      <Player film={playing} onClose={close} />
    </section>
  );
};
