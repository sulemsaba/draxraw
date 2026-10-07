import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/motion';
import { PRINTS } from '../data/site';
import { Sticker } from './Sticker';
import { GoLink } from './PageWipe';
import { ArrowIcon } from './Icons';
import './PhotoStrip.css';

/** Home: the page holds still while a strip of photos slides past sideways. */
export const PhotoStrip: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth + 84;
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        // inside each frame the photo drifts the other way
        gsap.utils.toArray<HTMLElement>('.strip-photo img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
            }
          );
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="strip" aria-labelledby="strip-title">
      <div className="strip-head">
        <Sticker as="h2" color="paper" torn={59} rotate={-0.8} innerClassName="display section-title-inner">
          <span id="strip-title">Photos</span>
        </Sticker>
        <GoLink to="/photos" className="strip-all label">
          All {PRINTS.length} photos <ArrowIcon size={18} />
        </GoLink>
      </div>
      <div ref={trackRef} className="strip-track">
        {PRINTS.slice(0, 7).map((p) => (
          <GoLink key={p.src} to="/photos" className="strip-photo" aria-label={`${p.alt}. See all photos`}>
            <img src={p.src} alt="" loading="lazy" width={1600} height={1067} />
          </GoLink>
        ))}
      </div>
    </section>
  );
};
