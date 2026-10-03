import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import './StillsGallery.css';

interface Still {
  src: string;
  ratio: string;
  size: 'lg' | 'md' | 'sm';
  tone: 'wide' | 'tall' | 'square';
}

/** His frames, from the collected shoots. Real files only. */
const STILLS: Still[] = [
  { src: '/images/dar-girls-00162.jpg', ratio: '3 / 2', size: 'lg', tone: 'wide' },
  { src: '/images/dar-girls-00237.jpg', ratio: '2 / 3', size: 'lg', tone: 'tall' },
  { src: '/images/read-tz-mugabe-07267.jpg', ratio: '1 / 1', size: 'sm', tone: 'square' },
  { src: '/images/dar-girls-00372.jpg', ratio: '3 / 2', size: 'md', tone: 'wide' },
  { src: '/images/dar-girls-00417.jpg', ratio: '2 / 3', size: 'md', tone: 'tall' },
  { src: '/images/dar-girls-00426.jpg', ratio: '3 / 2', size: 'lg', tone: 'wide' }
];

/**
 * "Stories in a Frame": the photography, shown the way a contact
 * sheet scrolls. Desktop pins the section and scrubs the strip
 * sideways; touch and reduced-motion get an honest native swipe.
 */
export const StillsGallery: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const track = trackRef.current;
        if (!track) return;

        const distance = () => track.scrollWidth - window.innerWidth;

        const shift = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });

        /* each frame wipes in as the strip carries it through */
        const reveals = gsap.utils.toArray<HTMLElement>('.still-frame', track).map((frame) =>
          gsap.fromTo(
            frame.querySelector('img'),
            { clipPath: 'inset(0% 18% 0% 18%)', scale: 1.12 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: frame,
                containerAnimation: shift,
                start: 'left 96%',
                once: true
              }
            }
          )
        );

        return () => {
          reveals.forEach((t) => t.kill());
          shift.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="stills theme-light" id="stills" data-theme="light" aria-label="Photography, Stories in a Frame">
      <div className="stills-viewport">
        <header className="stills-head">
          <p className="stills-kicker">Photography</p>
          <h2 className="stills-title display">
            Stories in a&nbsp;Frame
          </h2>
          <p className="stills-hint" aria-hidden="true">
            Keep scrolling &nbsp;&rarr;
          </p>
        </header>

        <div className="stills-track-clip">
          <div ref={trackRef} className="stills-track">
            {STILLS.map((still, i) => (
              <figure key={still.src} className={`still-frame still-${still.size} still-${still.tone}`}>
                <div className="still-crop" style={{ aspectRatio: still.ratio }}>
                  <img src={still.src} alt={`Photograph ${i + 1} by Drax Raw`} loading="lazy" />
                </div>
                <figcaption className="still-caption">
                  <span>Frame {String(i + 1).padStart(2, '0')}</span>
                  <span>Dar es Salaam</span>
                </figcaption>
              </figure>
            ))}

            <a
              className="still-more"
              href="https://www.instagram.com/drax.raw/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="still-more-text display">
                More
                <br />
                Frames
              </span>
              <span className="still-more-link">On Instagram&nbsp;&#8599;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
