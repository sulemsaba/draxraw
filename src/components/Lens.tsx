import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reducedMotion } from '../lib/motion';
import { GoLink } from './PageWipe';
import { ArrowIcon } from './Icons';
import './Lens.css';

/**
 * Through the lens. A camera lens sits on the dark; scrolling pushes you
 * into it until the glass fills the screen and you are inside Drax's film.
 * The picture behind the glass stays screen-sized the whole way (its scale
 * cancels the lens's), so it reads as looking through a real lens.
 */
export const Lens: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const body = ref.current?.querySelector<HTMLElement>('.lens-body');
      const view = ref.current?.querySelector<HTMLElement>('.lens-view');
      if (!body || !view) return;

      // How far the lens must grow for its glass (82% of it) to cover the screen
      const endScale = () => {
        const diag = Math.hypot(window.innerWidth, window.innerHeight);
        return (diag / (body.offsetWidth * 0.82)) * 1.06;
      };

      const state = { p: 0 };
      const apply = () => {
        const S = endScale();
        const e = gsap.parseEase('power2.in')(state.p);
        const s = 1 + (S - 1) * e;
        gsap.set(body, { scale: s });
        gsap.set(view, { scale: (1 / s) * (1.2 - 0.2 * state.p) });
      };
      apply();

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onRefresh: apply,
          },
        })
        .to('.lens-intro', { opacity: 0, y: -30, duration: 0.15 }, 0)
        .to(state, { p: 1, duration: 0.8, ease: 'none', onUpdate: apply }, 0)
        .to('.lens-glare', { opacity: 0, duration: 0.3 }, 0.5)
        .to('.lens-iris', { opacity: 0, duration: 0.25 }, 0.1)
        .fromTo('.lens-outro', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.82)
        .to({}, { duration: 0.1 });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="lens" aria-label="Through the lens">
      <p className="lens-intro label">Look through the lens</p>

      <div className="lens-body" aria-hidden="true">
        <div className="lens-glass">
          <img className="lens-view" src="img/lens.webp" alt="" width={1280} height={546} />
          <span className="lens-iris" />
          <span className="lens-glare" />
        </div>
      </div>

      <div className="lens-outro">
        <p className="lens-title display">A World That Never Stops</p>
        <GoLink to="/films" className="lens-cta label">
          Watch the films <ArrowIcon size={18} />
        </GoLink>
      </div>
    </section>
  );
};
