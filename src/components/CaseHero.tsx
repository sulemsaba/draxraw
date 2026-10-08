import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, onBoot, reducedMotion, SplitText } from '../lib/motion';
import { Sticker } from './Sticker';
import { PlayIcon, WhatsAppIcon } from './Icons';
import { GoLink } from './PageWipe';
import { WHATSAPP_URL } from '../data/site';
import './CaseHero.css';

let heroOpened = false;

const SLAP_FROM = { scale: 1.45, opacity: 0, rotation: () => gsap.utils.random(-10, 10) };
const SLAP_TO = { scale: 1, opacity: 1, rotation: 0, duration: 0.42, ease: 'back.out(2.2)' };

export const CaseHero: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const hero = rootRef.current;

      // Opening: the two name stickers slap on, then each letter drops into place
      const letters = new SplitText('.name-letters', { type: 'chars' }).chars;
      // Held until the loading screen hands over, then played
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.name-drax', SLAP_FROM, SLAP_TO, 0)
        .fromTo('.name-raw', SLAP_FROM, SLAP_TO, 0.16)
        .from(letters, { yPercent: -60, rotation: () => gsap.utils.random(-25, 25), opacity: 0, duration: 0.5, ease: 'back.out(2.6)', stagger: 0.05 }, 0.05)
        .fromTo('.hero-drax', SLAP_FROM, SLAP_TO, 0.42)
        .fromTo(hero, { y: 0 }, { y: 5, duration: 0.05, yoyo: true, repeat: 1 }, 0.58)
        .from('.hero-roles, .hero-actions > *', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.7)
        .from('.case-rail', { opacity: 0, duration: 0.5 }, 0.8);
      // The opening plays once per visit; coming back to Home shows the hero settled
      if (heroOpened) tl.progress(1);
      else
        onBoot(() => {
          heroOpened = true;
          tl.play();
        });

      // Scrolling away: the stickers pull apart and Drax sinks back into the case
      gsap
        .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('.name-drax', { y: -160, x: -40, ease: 'none' }, 0)
        .to('.name-raw', { y: -70, x: 70, ease: 'none' }, 0)
        .to('.hero-drax', { y: 110, ease: 'none' }, 0)
        .to('.hero-roles, .hero-actions', { y: -50, opacity: 0, ease: 'none' }, 0);

    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="case-hero" id="top" aria-label="Drax Raw, filmmaker in Dar es Salaam">
      <div className="hero-board">
        <h1 className="hero-name">
          <span className="sr-only">Drax Raw</span>
          <Sticker color="paper" torn={3} rotate={-1.5} slap={false} className="name-drax" innerClassName="display">
            <span className="name-letters" aria-hidden="true">DRAX</span>
          </Sticker>
          <Sticker color="red" torn={11} rotate={2} slap={false} className="name-raw" innerClassName="display">
            <span className="name-letters" aria-hidden="true">RAW</span>
          </Sticker>
        </h1>

        <figure className="hero-drax">
          <img
            src="img/drax-cutout.webp"
            alt="Drax in a red cap and headphones, checking a camera"
            width={1100}
            height={1680}
            fetchPriority="high"
          />
        </figure>

        <p className="hero-roles label">
          Filmmaker <i>/</i> Editor <i>/</i> Photographer
        </p>

        <div className="hero-actions">
          <a className="stuck btn-sticker" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <span className="vinyl is-red btn-inner label">
              <WhatsAppIcon /> Book on WhatsApp
            </span>
          </a>
          <GoLink to="/films" className="btn-plain label">
            <PlayIcon size={16} /> Watch my films
          </GoLink>
        </div>
      </div>
    </section>
  );
};
